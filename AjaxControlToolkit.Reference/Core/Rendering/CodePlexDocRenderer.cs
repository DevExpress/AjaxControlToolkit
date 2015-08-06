using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace AjaxControlToolkit.Reference.Core.Rendering {
    public class CodePlexDocRenderer : IDocRenderer {
        #region IDocRenderer Members

        public string RenderHeader(string text, int level = 1) {
            return new String('!', level) + " " + text;
        }

        public string RenderText(string text, bool bold = false, bool italic = false) {
            if(bold)
                return String.Format("*{0}*", text);

            if(italic)
                return String.Format("_{0}_", text);

            return text;
        }

        public string RenderLink(string text, string url) {
            return String.Format("[url:{0}]", url);
        }

        public string RenderTextBlock(string text, bool bold = false, bool italic = false) {
            return RenderText(text, bold, false);
        }

        public string RenderList(IEnumerable<DocListItem> items) {
            var sb = new StringBuilder();
            foreach(var item in items) {
                sb.AppendLine(RenderListItem(item.Header));
                sb.AppendLine(RenderListItem(item.Type, level: 2));
                sb.AppendLine(RenderListItem(item.Description, level: 2));
            }

            return sb.ToString();
        }

        public string RenderListItem(string text, bool ordered = false, int level = 1) {
            return new String(ordered ? '#' : '*', level) + " " + text;
        }

        #endregion
    }
}