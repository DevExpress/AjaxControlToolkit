using System;
using System.Collections.Generic;
using System.Text;

namespace AjaxControlToolkit.Reference.Core.Rendering {

    public class ExtenderDoc {
        IDocRenderer _renderer;
        StringBuilder _docStringBuilder = new StringBuilder();

        public ExtenderDoc(IDocRenderer renderer) {
            _renderer = renderer;
        }

        public string BuildDoc(IEnumerable<TypeDoc> typeDocs) {
            foreach(var typeDoc in typeDocs) {
                RenderTypeName(typeDoc.Name);
                RenderTypeDescription(typeDoc.Summary);
                RenderMethods(typeDoc.Methods, "Methods");
                RenderEvents(typeDoc.Events);
                RenderProperties(typeDoc.Properties);
                RenderClientProperties(typeDoc.ClientProperties);
                RenderMethods(typeDoc.ClientMethods, "Client methods");
            }

            return _docStringBuilder.ToString();
        }

        void RenderTypeName(string typeName) {
            _docStringBuilder.AppendLine(_renderer.RenderHeader(typeName));
        }

        void RenderTypeDescription(string typeDescription) {
            _docStringBuilder.AppendLine(_renderer.RenderTextBlock(typeDescription));
        }

        void RenderMethods<T>(IEnumerable<T> methods, string headerText) where T : IMethodDoc {
            var methodsStringBuilder = new StringBuilder();
            methodsStringBuilder.AppendLine(_renderer.RenderHeader(headerText));

            foreach(var methodDoc in methods) {
                methodsStringBuilder.AppendLine(_renderer.RenderTextBlock(methodDoc.Name, bold: true));
                methodsStringBuilder.AppendLine(_renderer.RenderTextBlock(methodDoc.Summary));

                methodsStringBuilder.AppendLine(_renderer.RenderTextBlock("Params:", italic: true));

                var docList = new List<DocListItem>();
                foreach(var docListItem in GetMethodParams(methodDoc))
                    docList.Add(docListItem);
                methodsStringBuilder.AppendLine(_renderer.RenderList(docList));
            }

            _docStringBuilder.AppendLine(methodsStringBuilder.ToString());
        }

        IEnumerable<DocListItem> GetMethodParams(IMethodDoc methodDoc) {
            foreach(var param in methodDoc.Params) {
                var header = _renderer.RenderTextBlock(param.Name, bold: true);
                var description = _renderer.RenderTextBlock(_renderer.RenderText("Type: ", italic: true) + _renderer.RenderText(param.TypeName)) +
                    _renderer.RenderTextBlock(param.Description);

                yield return new DocListItem() {
                    Header = header,
                    Description = description
                };
            }
        }

        void RenderEvents(IEnumerable<EventDoc> events) {
            var eventsStringBuilder = new StringBuilder();
            eventsStringBuilder.AppendLine(_renderer.RenderHeader("Events"));

            foreach(var eventDoc in events) {
                eventsStringBuilder.AppendLine(_renderer.RenderTextBlock(eventDoc.Name, bold: true));
                eventsStringBuilder.AppendLine(_renderer.RenderTextBlock(eventDoc.Summary));
            }

            _docStringBuilder.AppendLine(eventsStringBuilder.ToString());
        }

        void RenderClientProperties(IEnumerable<ClientPropertyDoc> clientProperties) {
            var propertiesStringBuilder = new StringBuilder();
            propertiesStringBuilder.AppendLine(_renderer.RenderHeader("Client properties"));

            foreach(var clientPropertyDoc in clientProperties) {
                propertiesStringBuilder.AppendLine(_renderer.RenderTextBlock(clientPropertyDoc.Name, bold: true));
                propertiesStringBuilder.AppendLine(_renderer.RenderTextBlock(clientPropertyDoc.Summary));
                propertiesStringBuilder.AppendLine(_renderer.RenderTextBlock(_renderer.RenderText("Getter name: ", bold: true) + _renderer.RenderText(clientPropertyDoc.GetterName)));
                propertiesStringBuilder.AppendLine(_renderer.RenderTextBlock(_renderer.RenderText("Setter name: ", bold: true) + _renderer.RenderText(clientPropertyDoc.SetterName)));
            }

            _docStringBuilder.AppendLine(propertiesStringBuilder.ToString());
        }

        void RenderProperties(IEnumerable<PropertyDoc> properties) {
            var propertiesStringBuilder = new StringBuilder();
            propertiesStringBuilder.AppendLine(_renderer.RenderHeader("Properties"));

            foreach(var propertyDoc in properties) {
                propertiesStringBuilder.AppendLine(_renderer.RenderTextBlock(propertyDoc.Name, bold: true));
                propertiesStringBuilder.AppendLine(_renderer.RenderTextBlock(propertyDoc.Summary));
            }

            _docStringBuilder.AppendLine(propertiesStringBuilder.ToString());
        }
    }
}
