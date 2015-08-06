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
                RenderTypeName(typeDoc);
                RenderTypeDescription(typeDoc);
                RenderMethods(typeDoc);
                RenderEvents(typeDoc);
                RenderProperties(typeDoc);
                RenderClientMethods(typeDoc);
                RenderClientProperties(typeDoc);
            }

            return _docStringBuilder.ToString();
        }

        void RenderTypeName(TypeDoc typeDoc) {
            _docStringBuilder.AppendLine(_renderer.RenderHeader(typeDoc.Name));
        }

        void RenderTypeDescription(TypeDoc typeDoc) {
            _docStringBuilder.AppendLine(_renderer.RenderText(typeDoc.Summary));
        }

        void RenderMethods(TypeDoc typeDoc) {
            var methodsStringBuilder = new StringBuilder();
            methodsStringBuilder.AppendLine(_renderer.RenderHeader("Methods"));

            foreach(var methodDoc in typeDoc.Methods) {
                methodsStringBuilder.AppendLine(_renderer.RenderText(methodDoc.Name, bold: true));
                methodsStringBuilder.AppendLine(_renderer.RenderText(methodDoc.Summary));

                methodsStringBuilder.AppendLine(_renderer.RenderText("Params", italic: true));

                var docList = new List<DocListItem>();
                foreach(var docListItem in GetMethodParams(methodDoc))
                    docList.Add(docListItem);
                methodsStringBuilder.AppendLine(_renderer.RenderList(docList));
            }

            _docStringBuilder.AppendLine(methodsStringBuilder.ToString());
        }

        IEnumerable<DocListItem> GetMethodParams(IMethodDoc methodDoc) {
            foreach(var param in methodDoc.Params) {
                var header = _renderer.RenderText(param.Name, bold: true);
                var description = _renderer.RenderText("Type: ", italic: true) +
                    _renderer.RenderText(param.TypeName) +
                    _renderer.RenderText(param.Description);

                yield return new DocListItem() {
                    Header = header,
                    Description = description
                };
            }
        }

        void RenderEvents(TypeDoc typeDoc) {
            throw new NotImplementedException();
        }

        void RenderClientProperties(TypeDoc typeDoc) {
            throw new NotImplementedException();
        }

        void RenderClientMethods(TypeDoc typeDoc) {
            var methodsStringBuilder = new StringBuilder();
            methodsStringBuilder.AppendLine(_renderer.RenderHeader("Client methods: "));

            foreach(var methodDoc in typeDoc.ClientMethods) {
                methodsStringBuilder.AppendLine(_renderer.RenderText(methodDoc.Name, bold: true));
                methodsStringBuilder.AppendLine(_renderer.RenderText(methodDoc.Summary));

                var docList = new List<DocListItem>();
                foreach(var docListItem in GetMethodParams(methodDoc))
                    docList.Add(docListItem);
                methodsStringBuilder.AppendLine(_renderer.RenderList(docList));
            }

            _docStringBuilder.AppendLine(methodsStringBuilder.ToString());
        }

        void RenderProperties(TypeDoc typeDoc) {
            throw new NotImplementedException();
        }    
    }
}
