using AjaxControlToolkit.Reference.Core.Rendering;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Text.RegularExpressions;

namespace AjaxControlToolkit.Reference.Core {

    public class ExtenderDoc : MarkupBuilder {
        bool _renderSampleSiteLink;
        bool _forceHeaderRendering;

        public ExtenderDoc(IDocRenderer renderer, bool renderSampleSiteLink = true, bool forceHeaderRendering = false)
            : base(renderer) {
            _renderSampleSiteLink = renderSampleSiteLink;
            _forceHeaderRendering = forceHeaderRendering;
        }

        public string BuildDoc(IEnumerable<TypeDoc> typeDocs, IEnumerable<TypeDoc> animationTypeDocs = null) {
            var sb = new StringBuilder();

            if(animationTypeDocs != null)
                sb.AppendLine(BuildAnimationScriptsTree(typeDocs.FirstOrDefault(), animationTypeDocs));

            foreach(var typeDoc in typeDocs)
                sb.AppendLine(
                    BuildTypeDoc(
                        typeDoc, typeDoc.Equals(typeDocs.First())));

            return sb.ToString();
        }

        string BuildAnimationScriptsTree(TypeDoc typeDoc, IEnumerable<TypeDoc> animationTypeDocs) {
            _markupStringBuilder.Clear();

            foreach(var animationTypeDoc in animationTypeDocs) {
                var baseTypeShortName = RemoveRootNamespace(animationTypeDoc.BaseTypeName);
                var typeLevel = GetTypeLevel(baseTypeShortName, animationTypeDocs);
                _markupStringBuilder.Append(
                    _renderer.RenderListItem(
                        animationTypeDoc.Name != typeDoc?.Name 
                            ? _renderer.RenderWikiPageLink(animationTypeDoc.Name) 
                            : animationTypeDoc.Name, 
                        false, 
                        typeLevel));
            }

            return _markupStringBuilder.ToString();
        }

        int GetTypeLevel(string baseTypeName, IEnumerable<TypeDoc> typeDocs) {
            var typeDocsWithShortBaseNames = typeDocs.Select(t =>
                new TypeDoc(
                    String.Format("{0}.{1}", t.Namespace, t.Name),
                    RemoveRootNamespace(t.BaseTypeName)));

            if(String.IsNullOrWhiteSpace(baseTypeName))
                return 1;

            var baseType = typeDocsWithShortBaseNames
                .FirstOrDefault(t => t.BaseTypeName == baseTypeName);

            var counter = 0;

            while(baseType != null) {
                baseType = typeDocsWithShortBaseNames
                    .FirstOrDefault(t => t.Name == baseType.BaseTypeName);

                counter++;
            }

            return counter;
        }

        public string BuildTypeDoc(TypeDoc typeDoc, bool isFirstTypeDoc) {
            _markupStringBuilder.Clear();

            if(!isFirstTypeDoc || _forceHeaderRendering)
                RenderTypeName(typeDoc.Name);
            else
                if(_renderSampleSiteLink)
                RenderSampleSiteLink(typeDoc.Name);

            if(!String.IsNullOrWhiteSpace(typeDoc.BaseTypeName))
                RenderBaseTypeReference(typeDoc.BaseTypeName);

            RenderTypeDescription(typeDoc.Summary);
            RenderTypeRemarks(typeDoc.Remarks);

            RenderProperties(typeDoc.Properties.OrderBy(p => p.Name));
            RenderMethods(typeDoc.Methods.OrderBy(m => m.Name), "Methods");
            RenderEvents(typeDoc.Events.OrderBy(e => e.Name));

            RenderClientProperties(typeDoc.ClientProperties.OrderBy(p => p.Name));
            RenderMethods(typeDoc.ClientMethods.OrderBy(m => m.Name), "Client methods");
            RenderClientEvents(typeDoc.ClientEvents.OrderBy(e => e.Name));

            RenderClientPropertiesExpanded(typeDoc.ClientProperties.OrderBy(p => p.Name));
            RenderMethodsExpanded(typeDoc.Methods.OrderBy(m => m.Name), "Methods");
            RenderMethodsExpanded(typeDoc.ClientMethods.OrderBy(m => m.Name), "Client methods");
            RenderClientEventsExpanded(typeDoc.ClientEvents.OrderBy(e => e.Name));

            return _markupStringBuilder.ToString();
        }

        void RenderBaseTypeReference(string baseTypeName) {
            var baseTypeShortName = RemoveRootNamespace(baseTypeName);
            var baseTypeAnchor = GenerateAnchor(baseTypeShortName);
            _markupStringBuilder.Append(_renderer.RenderText(String.Format(" (inherits {0})", _renderer.RenderWikiPageLink(baseTypeShortName))));
        }

        static string RemoveRootNamespace(string baseTypeName) {
            if(String.IsNullOrWhiteSpace(baseTypeName))
                return null;

            return baseTypeName.Replace("AjaxControlToolkit.", "");
        }

        private void RenderClientPropertiesExpanded(IEnumerable<ClientPropertyDoc> clientProperties) {
            RenderMembersExpanded(clientProperties,
               "Client properties",
               (propertyDoc) => RenderPropertyAccessors(propertyDoc));
        }

        private void RenderClientEventsExpanded(IEnumerable<ClientEventDoc> clientEvents) {
            RenderMembersExpanded(clientEvents,
                "Client events",
                (eventDoc) => RenderEventMethods(eventDoc));
        }

        void RenderMethodsExpanded(IEnumerable<MethodDoc> methods, string headerText) {
            RenderMembersExpanded(methods,
                headerText,
                (methodDoc) => RenderMethodParams(methodDoc),
                (methodDoc) => BuildMethodSignature(methodDoc));
        }

        void RenderMembersExpanded(IEnumerable<DocBase> memberDocs, string headerText, Func<DocBase, string> additionalInfoRenderer, Func<DocBase, string> memberNameTransform = null) {
            if(memberDocs.Count() <= 0)
                return;

            var sectionStringBuilder = new StringBuilder();
            sectionStringBuilder.Append(_renderer.RenderNewParagraph() + _renderer.RenderHeader(headerText, level: 2));

            foreach(var memberDoc in memberDocs) {
                var methodNameTransformed = memberNameTransform != null ? memberNameTransform(memberDoc) : memberDoc.Name;
                sectionStringBuilder.Append(_renderer.RenderNewParagraph());
                sectionStringBuilder.Append(_renderer.RenderHeader(methodNameTransformed, 3));

                sectionStringBuilder.Append(_renderer.RenderNewParagraph());
                sectionStringBuilder.Append(_renderer.RenderText(_renderer.Sanitize(memberDoc.Summary)));

                if(!String.IsNullOrWhiteSpace(memberDoc.Remarks)) {
                    var remarks = _renderer.RenderText("Remarks:", italic: true, bold: true) + " " + _renderer.RenderText(_renderer.Sanitize(memberDoc.Remarks).Trim(), italic: true);
                    sectionStringBuilder.Append(_renderer.RenderNewParagraph() + remarks);
                }

                sectionStringBuilder.Append(additionalInfoRenderer(memberDoc));
            }

            _markupStringBuilder.Append(sectionStringBuilder.ToString());
        }

        string RenderMethodParams(DocBase member) {
            if(!(member is MethodDoc))
                return "";

            var methodDoc = (MethodDoc)member;
            var paramsStringBuilder = new StringBuilder();

            if(methodDoc.Params.Count() > 0) {
                paramsStringBuilder.Append(_renderer.RenderNewParagraph());
                paramsStringBuilder.Append(_renderer.RenderText("Params:", italic: true));

                foreach(var item in FormatMethodParams(methodDoc))
                    paramsStringBuilder.Append(_renderer.RenderNewParagraph() + item);
            }

            return paramsStringBuilder.ToString();
        }

        string RenderEventMethods(DocBase member) {
            if(!(member is ClientEventDoc))
                return "";

            var eventDoc = (ClientEventDoc)member;
            var eventMethodsStringBuilder = new StringBuilder();

            eventMethodsStringBuilder.Append(_renderer.RenderNewParagraph() + _renderer.RenderText("Add event handler method:", italic: true) + " " + _renderer.RenderText(eventDoc.AddMethodName + "(handler)"));
            eventMethodsStringBuilder.Append(_renderer.RenderLineBreak() + _renderer.RenderText("Remove event handler method:", italic: true) + " " + _renderer.RenderText(eventDoc.RemoveMethodName + "(handler)"));

            if(!String.IsNullOrWhiteSpace(eventDoc.RaiseMethodName))
                eventMethodsStringBuilder.Append(_renderer.RenderLineBreak() + _renderer.RenderText("Raise event method:", italic: true) + " " + _renderer.RenderText(eventDoc.RaiseMethodName + "()"));

            eventMethodsStringBuilder.Append(_renderer.RenderNewParagraph());
            return eventMethodsStringBuilder.ToString();
        }

        string RenderPropertyAccessors(DocBase member) {
            if(!(member is ClientPropertyDoc))
                return "";

            var clientPropertyDoc = (ClientPropertyDoc)member;
            var propertyAccessorsStringBuilder = new StringBuilder();

            if(!String.IsNullOrWhiteSpace(clientPropertyDoc.GetterName))
                propertyAccessorsStringBuilder.Append(
                    _renderer.RenderNewParagraph() +
                    _renderer.RenderText("Getter name:", italic: true) + " " +
                    _renderer.RenderText(clientPropertyDoc.GetterName + "()"));

            if(!String.IsNullOrWhiteSpace(clientPropertyDoc.SetterName))
                propertyAccessorsStringBuilder.Append(
                    _renderer.RenderLineBreak() +
                    _renderer.RenderText("Setter name:", italic: true) + " " +
                    _renderer.RenderText(clientPropertyDoc.SetterName + "(value)"));

            return propertyAccessorsStringBuilder.ToString();
        }

        void RenderTypeRemarks(string typeRemarks) {
            var remarksBody = _renderer.Sanitize(typeRemarks).Replace("\\*", "<br>\\*");
            _markupStringBuilder.Append(_renderer.RenderNewParagraph() + _renderer.RenderText(remarksBody));
        }

        void RenderTypeName(string typeName) {
            _markupStringBuilder.Append(_renderer.RenderNewParagraph() + _renderer.RenderHeader(typeName));
        }

        void RenderSampleSiteLink(string typeName) {
            var url = LinkHelper.GetSampleSiteLink(typeName);
            _markupStringBuilder.Append(_renderer.RenderUrl("Demo Page", url));
        }

        void RenderTypeDescription(string typeDescription) {
            _markupStringBuilder.Append(_renderer.RenderNewParagraph() + _renderer.RenderText(_renderer.Sanitize(typeDescription)));
        }

        void RenderTable(IEnumerable<DocBase> members, string tableName, Func<DocBase, string> memberNameTransform = null, bool generateMemberLink = false, bool renderRemarks = true) {
            if(members.Count() <= 0)
                return;

            var tableStringBuilder = new StringBuilder();
            tableStringBuilder.Append(_renderer.RenderNewParagraph() + _renderer.RenderHeader(tableName, level: 2));
            tableStringBuilder.Append(_renderer.RenderNewParagraph());

            var dict = new Dictionary<string, string>();


            foreach(var member in members) {
                var memberNameTransformed = memberNameTransform == null ? member.Name : memberNameTransform(member);
                string memberAnchor = GenerateAnchor(memberNameTransformed);

                var remarks = "";
                if(renderRemarks
                    &&
                    !String.IsNullOrWhiteSpace(member.Remarks))
                    remarks = _renderer.RenderText("Remarks:", italic: true, bold: true) + " " + _renderer.RenderText(_renderer.Sanitize(member.Remarks).Trim(), italic: true);

                dict.Add(generateMemberLink
                        ? _renderer.RenderUrl(memberNameTransformed, memberAnchor)
                        : memberNameTransformed,
                    _renderer.Sanitize(member.Summary) + _renderer.RenderLineBreak() + remarks);
            }
            tableStringBuilder.Append(_renderer.RenderDescriptionBlock(dict));

            _markupStringBuilder.Append(tableStringBuilder.ToString());
        }

        private static string GenerateAnchor(string text) {
            var textWithoutParentheses = Regex.Replace(text.ToLower(), "[(|)]+", "");
            return "#" + Regex.Replace(textWithoutParentheses, "\\W+", "-").Trim('-');
        }

        void RenderMethods(IEnumerable<MethodDoc> methods, string headerText) {
            RenderTable(methods, headerText, (methodDoc) => BuildMethodSignature(methodDoc), true, false);
        }

        public static string BuildMethodSignature(DocBase docBase) {
            if(!(docBase is MethodDoc))
                return docBase.Name;

            var methodDoc = (MethodDoc)docBase;

            var methodNameWithSignature = methodDoc.Name + "(";
            if(methodDoc.Params.Count() > 0) {
                foreach(var param in methodDoc.Params)
                    methodNameWithSignature += param.Name + ", ";

                methodNameWithSignature = methodNameWithSignature.Substring(0, methodNameWithSignature.Length - 2);
            }
            methodNameWithSignature += ")";
            return methodNameWithSignature;
        }

        IEnumerable<string> FormatMethodParams(MethodDoc methodDoc) {
            foreach(var param in methodDoc.Params) {
                var header = _renderer.RenderText(param.Name, bold: true);
                var type = _renderer.RenderText("Type:", italic: true) + " " + _renderer.RenderText(param.TypeName);
                var description = _renderer.RenderText("Description:", italic: true) + " " + _renderer.Sanitize(param.Description);

                yield return
                    _renderer.RenderListItem(header, false, 1) +
                    _renderer.RenderListItem(type, false, 2) +
                    _renderer.RenderListItem(description, false, 2);
            }
        }

        void RenderEvents(IEnumerable<EventDoc> events) {
            RenderTable(events, "Events");
        }

        void RenderClientProperties(IEnumerable<ClientPropertyDoc> clientProperties) {
            RenderTable(clientProperties, "Client properties", null, true, false);
        }

        void RenderProperties(IEnumerable<PropertyDoc> properties) {
            RenderTable(properties, "Properties");
        }

        void RenderClientEvents(IEnumerable<ClientEventDoc> clientEvents) {
            RenderTable(clientEvents, "Client events", null, true, false);
        }

    }
}
