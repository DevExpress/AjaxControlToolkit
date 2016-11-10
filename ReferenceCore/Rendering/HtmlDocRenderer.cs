using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace AjaxControlToolkit.Reference.Core.Rendering {

    public class HtmlDocRenderer {
        
        public string RenderMembers(TypeDoc doc) {
            var sb = new StringBuilder();

            RenderList(sb, doc.Properties, "Properties");

            if(doc.Methods.Any()) {
                RenderNewLine(sb);
                RenderList(sb, doc.Methods, "Methods");
            }

            if(doc.Events.Any()) {
                RenderNewLine(sb);
                RenderList(sb, doc.Events, "Events");
            }

            return sb.ToString();
        }

        void RenderNewLine(StringBuilder sb) {
            sb.Append("<br />");
        }

        void RenderList(StringBuilder sb, IEnumerable<DocBase> members, string header) {
            sb.Append(RenderBold(header));
            sb.Append("<ul>");

            foreach(var member in members)
                RenderListItem(sb, member);

            sb.Append("</ul>");
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