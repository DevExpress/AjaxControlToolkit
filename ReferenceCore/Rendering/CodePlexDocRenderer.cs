using System;
using System.Collections.Generic;
using System.Text;

namespace AjaxControlToolkit.Reference.Core.Rendering {

    public class CodePlexDocRenderer : IDocRenderer {
        public string RenderHeader(string text, int level = 1) {
            if(String.IsNullOrWhiteSpace(text))
                return String.Empty;

            return new String('!', level) + " " + text;
        }

        public string RenderText(string text, bool bold = false, bool italic = false) {
            if(String.IsNullOrWhiteSpace(text))
                return String.Empty;

            var result = text;

            if(bold)
                result = String.Format("*{0}*", result);

            if(italic)
                result = String.Format("_{0}_", result);

            return result;
        }

        public string RenderLink(string text, string url) {
            return String.Format("[url:{0}]", url);
        }

        public string RenderTextBlock(string text, bool bold = false, bool italic = false) {
            return RenderText(text, bold, italic);
        }

        public string RenderList(IEnumerable<DocListItem> items) {
            if(items == null)
                return String.Empty;

            var sb = new StringBuilder();

            foreach(var item in items) {
                sb.Append(GetListItemHeader(item));
                sb.Append(GetListItemType(item));
                sb.Append(GetListItemDescription(item));
            }

            if(sb.Length > 0)
                sb.Length -= 2;

            return sb.ToString();
        }

        string GetListItemDescription(DocListItem item) {
            if(String.IsNullOrEmpty(item.Description))
                return String.Empty;

            return RenderListItem(item.Description, level: 2) + Environment.NewLine;
        }

        string GetListItemType(DocListItem item) {
            if(String.IsNullOrEmpty(item.Type))
                return String.Empty;

            return RenderListItem(item.Type, level: 2) + Environment.NewLine;
        }

        string GetListItemHeader(DocListItem item) {
            if(String.IsNullOrEmpty(item.Header))
                return String.Empty;

            return RenderListItem(item.Header) + Environment.NewLine;
        }

        public string RenderListItem(string text, bool ordered = false, int level = 1) {
            if(String.IsNullOrWhiteSpace(text))
                return String.Empty;

            return new String(ordered ? '#' : '*', level) + " " + text;
        }
    }
}