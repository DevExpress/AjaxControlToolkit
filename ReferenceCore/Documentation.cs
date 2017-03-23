using AjaxControlToolkit.Reference.Core.Parsing;
using AjaxControlToolkit.ReferenceCore.Parsing;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Xml.Linq;

namespace AjaxControlToolkit.Reference.Core {

    public class Documentation {
        const string AnimationScriptsTypeName = "AnimationScripts";
        const string AccordionExtenderTypeName = "AccordionExtender";
        const string AccordionTypeName = "Accordion";
        IDictionary<string, TypeDoc> _types;

        public void Add(IEnumerable<RawDoc> rawDocs, ContentType contentType) {

            foreach(var rawDoc in rawDocs)
                ProcessInfo(rawDoc.TargetNamePrefix, rawDoc.TargetFullName, rawDoc.BaseTypeName).Fill(rawDoc.Elements, contentType);
        }

        DocBase ProcessInfo(string targetNamePrefix, string fullName, string baseTypeName) {
            switch(targetNamePrefix) {
                case "T": {
                        return GetTypeByName(fullName, baseTypeName);
                    }
                case "M": {
                        var info = new MethodDoc(fullName);
                        GetTypeByName(info.Namespace).AddMethod(info);
                        return info;
                    }
                case "P": {
                        var info = new PropertyDoc(fullName);
                        GetTypeByName(info.Namespace).AddProperty(info);
                        return info;
                    }
                case "E": {
                        var info = new EventDoc(fullName);
                        GetTypeByName(info.Namespace).AddEvent(info);
                        return info;
                    }
                case "cT": {
                        return GetTypeByName(fullName, baseTypeName);
                    }
                case "cM": {
                        var info = new MethodDoc(fullName);
                        GetTypeByName(info.Namespace).AddClientMethod(info);
                        return info;
                    }
                case "cP": {
                        var info = new ClientPropertyDoc(fullName);
                        GetTypeByName(info.Namespace).AddClientProperty(info);
                        return info;
                    }
                case "cE": {
                        var info = new ClientEventDoc(fullName);
                        GetTypeByName(info.Namespace).AddClientEvent(info);
                        return info;
                    }
            }

            throw new ArgumentException("Unknown info type", "fullName");
        }

        TypeDoc GetTypeByName(string typeName, string baseTypeName = null) {
            if(typeName.Contains(AccordionExtenderTypeName))
                typeName = typeName.Replace(AccordionExtenderTypeName, AccordionTypeName);

            if(!_types.ContainsKey(typeName))
                _types.Add(typeName, new TypeDoc(typeName, baseTypeName));

            return _types[typeName];
        }

        public Documentation() {
            _types = new Dictionary<string, TypeDoc>();
        }

        public IEnumerable<TypeDoc> Types {
            get { return _types.Values; }
        }

        public static Documentation GetNonAnimationScriptsReference(string type, string xmlDocFolder, string scriptsFolder) {
            var doc = new Documentation();
            var xml = LoadXml(Path.Combine(xmlDocFolder, "AjaxControltoolkit.xml"));

            var typeRegex = new Regex("^.{2}?AjaxControlToolkit." + type + @"(\.|$)");
            var members = xml.Root.Element("members").Elements()
                .Where(el => typeRegex.IsMatch(el.Attribute("name").Value))
                .Select(el => new RawDoc(el.Attribute("name").Value) {
                    Elements = el.Elements()
                })
                .OrderBy(el => el.TargetFullName);

            doc.Add(members, ContentType.Xml);

            foreach(var docType in doc.Types.ToList()) {
                var typeFullName = docType.Namespace + "." + GetNeededType(docType.Name);
                FillClientMembers(doc, typeFullName, scriptsFolder);
            }

            return doc;
        }

        public static Documentation Get(string type, string xmlDocFolder, string scriptsFolder) {
            if(ToolkitTypes.GetAnimationTypeNames().Contains(type)) {
                var doc = new Documentation();
                doc.Add(GetAnimationScriptsReferenceForType(type, scriptsFolder), ContentType.Text);
                return doc;
            }

            return GetNonAnimationScriptsReference(type, xmlDocFolder, scriptsFolder);
        }

        public static IEnumerable<RawDoc> GetAnimationScriptsReferenceForType(string animationTypeName, string scriptsFolder) {
            var doc = new Documentation();
            var commentParser = new CommentParser();
            var jsLines = File.ReadAllLines(Path.Combine(scriptsFolder, "AnimationScripts.js"));
            var typeFullName = "AjaxControlToolkit." + animationTypeName;
            return commentParser.ParseFile(jsLines, typeFullName);
        }

        public static Documentation GetAnimationScriptsReference(string scriptsFolder) {
            var doc = new Documentation();

            foreach(var animationTypeName in ToolkitTypes.GetAnimationTypeNames())
                doc.Add(GetAnimationScriptsReferenceForType(animationTypeName, scriptsFolder), ContentType.Text);

            return doc;
        }

        public static bool IsRenderSampleSiteLink(string typeName) {
            return !IsAnimationScriptsRelatedType(typeName);
        }

        public static bool IsForceHeaderRendering(string typeName) {
            return ToolkitTypes
                    .GetAnimationTypeNames()
                    .Contains(typeName);
        }

        public static bool IsAnimationScriptsRelatedType(string typeName) {
            return ToolkitTypes
                   .GetAnimationTypeNames()                   
                   .Contains(typeName);
        }

        static string GetNeededType(string typeName) {
            switch(typeName) {
                case "Accordion":
                    return "AccordionExtender";
                default:
                    return typeName;
            }
        }

        static void FillClientMembers(Documentation doc, string typeFullName, string scriptsFolder) {
            var actAssembly = typeof(ToolkitResourceManager).Assembly;
            var type = actAssembly.GetType(typeFullName, true);

            if(type.IsSubclassOf(typeof(ExtenderControlBase))
                ||
                type.IsSubclassOf(typeof(ScriptControlBase))
                ||
                type == typeof(ComboBox)) {
                var clientScriptName = type
                    .GetCustomAttributesData()
                    .First(a => a.Constructor.DeclaringType == typeof(ClientScriptResourceAttribute))
                    .ConstructorArguments[1]
                    .Value;
                var jsFileName = clientScriptName + ".js";

                var jsLines = File.ReadAllLines(Path.Combine(scriptsFolder, jsFileName));
                var commentParser = new CommentParser();
                var clientMembers = commentParser.ParseFile(jsLines, typeFullName);

                doc.Add(clientMembers, ContentType.Text);
            }
        }

        static XDocument LoadXml(string fileName) {
            XDocument xml;
            if(!File.Exists(fileName))
                throw new ArgumentException(String.Format("File '{0}' not found", fileName), "fileName");

            xml = XDocument.Load(fileName);
            if(xml == null)
                throw new ArgumentException(String.Format("Unable to load XML from '{0}'", fileName), "fileName");

            return xml;
        }
    }
}