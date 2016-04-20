using AjaxControlToolkit.Reference.Core.Rendering;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Text.RegularExpressions;

namespace AjaxControlToolkit.Reference.Core {

    public class ExtenderDoc : MarkupBuilder {
        public ExtenderDoc(IDocRenderer renderer)
            : base(renderer) {
        }

        public string BuildDoc(IEnumerable<TypeDoc> typeDocs) {
            var sb = new StringBuilder();

            foreach(var typeDoc in typeDocs)
                sb.Append(BuildTypeDoc(typeDoc));

            return sb.ToString();
        }

        public string BuildTypeDoc(TypeDoc typeDoc) {
            _markupStringBuilder.Clear();

            RenderTypeName(typeDoc.Name);
            RenderSampleSiteLink(typeDoc.Name);
            RenderTypeDescription(typeDoc.Summary);
            RenderTypeRemarks(typeDoc.Remarks);

            RenderProperties(typeDoc.Properties);
            RenderMethods(typeDoc.Methods, "Methods");
            RenderEvents(typeDoc.Events);

            RenderClientProperties(typeDoc.ClientProperties);
            RenderMethods(typeDoc.ClientMethods, "Client methods");
            RenderClientEvents(typeDoc.ClientEvents);

            RenderClientPropertiesExpanded(typeDoc.ClientProperties);
            RenderMethodsExpanded(typeDoc.Methods, "Methods");
            RenderMethodsExpanded(typeDoc.ClientMethods, "Client methods");
            RenderClientEventsExpanded(typeDoc.ClientEvents);

            return _markupStringBuilder.ToString();
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
            _markupStringBuilder.Append(String.Format(" ({0})", _renderer.RenderUrl("demo", url)));
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
            var regex = new Regex("[^a-zA-Z0-9 -]");

            foreach(var member in members) {
                var memberNameTransformed = memberNameTransform == null ? member.Name : memberNameTransform(member);
                var memberNameLink = "#" + regex.Replace(memberNameTransformed.ToLower(), "").Replace(" ", "-");

                var remarks = "";
                if(renderRemarks
                    &&
                    !String.IsNullOrWhiteSpace(member.Remarks))
                    remarks = _renderer.RenderText("Remarks:", italic: true, bold: true) + " " + _renderer.RenderText(_renderer.Sanitize(member.Remarks).Trim(), italic: true);

                dict.Add(generateMemberLink ? String.Format("[{0}]({1})", memberNameTransformed, memberNameLink) : memberNameTransformed,
                    _renderer.Sanitize(member.Summary) + _renderer.RenderLineBreak() + remarks);
            }
            tableStringBuilder.Append(_renderer.RenderDescriptionBlock(dict));

            _markupStringBuilder.Append(tableStringBuilder.ToString());
        }

        void RenderMethods(IEnumerable<MethodDoc> methods, string headerText) {
            RenderTable(methods, headerText, (methodDoc) => BuildMethodSignature(methodDoc), true, false);
        }

        private string BuildMethodSignature(DocBase docBase) {
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
