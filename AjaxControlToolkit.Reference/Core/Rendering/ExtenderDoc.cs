using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace AjaxControlToolkit.Reference.Core.Rendering {
    public class ExtenderDoc {
        IDocRenderer _renderer;

        public ExtenderDoc(IDocRenderer renderer) {
            _renderer = renderer;
        }

        public string BuildDoc(IEnumerable<TypeDoc> typeDocs) {
            var sb = new StringBuilder();

            foreach(var typeDoc in typeDocs) {
                sb.AppendLine(RenderTypeName(typeDoc));
                sb.AppendLine(RenderTypeDescription(typeDoc));
                sb.AppendLine(RenderMethods(typeDoc));
                sb.AppendLine(RenderEvents(typeDoc));
                sb.AppendLine(RenderProperties(typeDoc));
                sb.AppendLine(RenderClientMethods(typeDoc));
                sb.AppendLine(RenderClientProperties(typeDoc));
            }

            return sb.ToString();
        }

        string RenderClientProperties(TypeDoc typeDoc) {
            throw new NotImplementedException();
        }

        string RenderClientMethods(TypeDoc typeDoc) {
            throw new NotImplementedException();
        }

        string RenderProperties(TypeDoc typeDoc) {
            throw new NotImplementedException();
        }

        string RenderEvents(TypeDoc typeDoc) {
            throw new NotImplementedException();
        }

        string RenderMethods(TypeDoc typeDoc) {
            var sb = new StringBuilder();
            sb.AppendLine(_renderer.RenderHeader("Methods", 2) + Environment.NewLine);

            foreach(var methodDoc in typeDoc.Methods) {
                sb.AppendLine(_renderer.RenderText(methodDoc.Name, true, false) + Environment.NewLine);
                sb.AppendLine(_renderer.RenderText(methodDoc.Summary, false, false) + Environment.NewLine);
                sb.AppendLine(_renderer.RenderText("Params", false, true) + Environment.NewLine);

                var list = new List<ListItem>();
                foreach(var param in methodDoc.Params) {
                    var header = _renderer.RenderText(param.Name, true, false);
                    var description = _renderer.RenderText("Type: ", false, true) + _renderer.RenderText(param.TypeName, false, false) + Environment.NewLine;
                    description += _renderer.RenderText(param.Description, false, false);
                    list.Add(new ListItem() { Header = header, Description = description });

                }
                sb.AppendLine(_renderer.RenderList(list));
            }

            return sb.ToString();
        }

        string RenderTypeDescription(TypeDoc typeDoc) {
            return _renderer.RenderText(typeDoc.Summary, false, false);
        }

        string RenderTypeName(TypeDoc typeDoc) {
            return _renderer.RenderHeader(typeDoc.Name, 1);
        }
    }
}
