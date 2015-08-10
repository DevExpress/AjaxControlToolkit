using AjaxControlToolkit.Reference.Core.Rendering;
using System;
using System.Collections.Generic;
using System.Text;

namespace AjaxControlToolkit.Reference.Core {

    public class ExtenderDoc {
        IDocRenderer _renderer;
        StringBuilder _docStringBuilder = new StringBuilder();

        public ExtenderDoc(IDocRenderer renderer) {
            _renderer = renderer;
        }

        public string BuildDoc(IEnumerable<TypeDoc> typeDocs) {
            var sb = new StringBuilder();

            foreach(var typeDoc in typeDocs)
                sb.Append(BuildTypeDoc(typeDoc));

            return sb.ToString();
        }

        public string BuildTypeDoc(TypeDoc typeDoc) {
            _docStringBuilder.Clear();

            RenderTypeName(typeDoc.Name);
            RenderTypeDescription(typeDoc.Summary);
            RenderMethods(typeDoc.Methods, "Methods");
            RenderEvents(typeDoc.Events);
            RenderProperties(typeDoc.Properties);
            RenderClientProperties(typeDoc.ClientProperties);
            RenderMethods(typeDoc.ClientMethods, "Client methods");

            return _docStringBuilder.ToString();
        }

        void RenderTypeName(string typeName) {
            _docStringBuilder.AppendLine(_renderer.RenderHeader(typeName));
        }

        void RenderTypeDescription(string typeDescription) {
            _docStringBuilder.AppendLine(_renderer.RenderTextBlock(typeDescription));
        }

        void RenderMethods(IEnumerable<MethodDoc> methods, string headerText) {
            var methodsStringBuilder = new StringBuilder();
            methodsStringBuilder.AppendLine(_renderer.RenderHeader(headerText, level: 2));

            foreach(var methodDoc in methods) {
                methodsStringBuilder.AppendLine(_renderer.RenderTextBlock(methodDoc.Name, bold: true));
                methodsStringBuilder.AppendLine(_renderer.RenderTextBlock(methodDoc.Summary));

                methodsStringBuilder.AppendLine(_renderer.RenderTextBlock("Params:", italic: true));

                foreach(var item in FormatMethodParams(methodDoc))
                    methodsStringBuilder.AppendLine(item);

            }

            _docStringBuilder.AppendLine(methodsStringBuilder.ToString());
        }

        IEnumerable<string> FormatMethodParams(MethodDoc methodDoc) {
            foreach(var param in methodDoc.Params) {
                var header = _renderer.RenderText(param.Name, bold: true);
                var type = _renderer.RenderText(_renderer.RenderText("Type: ", italic: true) + _renderer.RenderText(param.TypeName));

                yield return
                    _renderer.RenderListItem(header, false, 1) +
                    _renderer.RenderListItem(type, false, 2) +
                    _renderer.RenderListItem(param.Description, false, 2);
            }
        }

        void RenderEvents(IEnumerable<EventDoc> events) {
            var eventsStringBuilder = new StringBuilder();
            eventsStringBuilder.AppendLine(_renderer.RenderHeader("Events", level: 2));

            foreach(var eventDoc in events) {
                eventsStringBuilder.AppendLine(_renderer.RenderTextBlock(eventDoc.Name, bold: true));
                eventsStringBuilder.AppendLine(_renderer.RenderTextBlock(eventDoc.Summary));
            }

            _docStringBuilder.AppendLine(eventsStringBuilder.ToString());
        }

        void RenderClientProperties(IEnumerable<ClientPropertyDoc> clientProperties) {
            var propertiesStringBuilder = new StringBuilder();
            propertiesStringBuilder.AppendLine(_renderer.RenderHeader("Client properties", level: 2));

            foreach(var clientPropertyDoc in clientProperties) {
                propertiesStringBuilder.AppendLine(_renderer.RenderTextBlock(clientPropertyDoc.Name, bold: true));
                propertiesStringBuilder.AppendLine(_renderer.RenderTextBlock(clientPropertyDoc.Summary));

                if(!String.IsNullOrWhiteSpace(clientPropertyDoc.GetterName))
                    propertiesStringBuilder.AppendLine(_renderer.RenderTextBlock(_renderer.RenderText("Getter name: ", bold: true) + _renderer.RenderText(clientPropertyDoc.GetterName)));

                if(!String.IsNullOrWhiteSpace(clientPropertyDoc.SetterName))
                    propertiesStringBuilder.AppendLine(_renderer.RenderTextBlock(_renderer.RenderText("Setter name: ", bold: true) + _renderer.RenderText(clientPropertyDoc.SetterName)));
            }

            _docStringBuilder.AppendLine(propertiesStringBuilder.ToString());
        }

        void RenderProperties(IEnumerable<PropertyDoc> properties) {
            var propertiesStringBuilder = new StringBuilder();
            propertiesStringBuilder.AppendLine(_renderer.RenderHeader("Properties", level: 2));

            foreach(var propertyDoc in properties) {
                propertiesStringBuilder.AppendLine(_renderer.RenderTextBlock(propertyDoc.Name, bold: true));
                propertiesStringBuilder.AppendLine(_renderer.RenderTextBlock(propertyDoc.Summary));
            }

            _docStringBuilder.AppendLine(propertiesStringBuilder.ToString());
        }
    }
}
