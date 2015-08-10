using System;
using System.Collections.Generic;
using System.Text;

namespace AjaxControlToolkit.Reference.Core.Rendering {

    public class CodePlexDocRenderer : IDocRenderer {

        public string RenderHeader(string text, int level = 1) {
            if(String.IsNullOrWhiteSpace(text))
                return String.Empty;

            return RenderLineBreak() + new String('!', level) + " " + text;
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

        public string RenderListItem(string text, bool ordered = false, int level = 1) {
            if(String.IsNullOrWhiteSpace(text))
                return String.Empty;

            return new String(ordered ? '#' : '*', level) + " " + text + RenderLineBreak();
        }

        public string RenderLineBreak() {
            return "\n";
        }
    }
}