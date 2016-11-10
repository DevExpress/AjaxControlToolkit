using System;
using System.Collections.Generic;
using System.Text;
using System.Web;

namespace AjaxControlToolkit.Reference.Core.Rendering {

    public class HtmlDocRenderer {
        
        public string RenderList(IEnumerable<DocBase> members) {
            var sb = new StringBuilder();
            sb.Append("<ul>");

            foreach(var member in members)
                RenderListItem(sb, member);

            sb.Append("</ul>");

            return sb.ToString();
        }

        void RenderListItem(StringBuilder sb, DocBase member) {
            sb.Append("<li>");
            sb.Append(RenderBold(member.Name));
            sb.Append(" - ");
            sb.Append(member.Summary);
            sb.Append("</li>");
        }

        string RenderBold(string text) {
            return String.Format("<b>{0}</b>", text);
        }

        public string RenderDescription(string summary) {
            return HttpUtility.HtmlEncode(summary);
        }
    }
}