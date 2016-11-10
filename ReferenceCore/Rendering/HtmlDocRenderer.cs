using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace AjaxControlToolkit.Reference.Core.Rendering {

    public class HtmlDocRenderer {

        public string RenderMembers(TypeDoc doc) {
            var sb = new StringBuilder();

            RenderList(sb, doc.Properties.OrderBy(p => p.Name), "Properties");

            if(doc.Methods.Any()) {
                RenderNewLine(sb);
                RenderList(sb, doc.Methods.OrderBy(m => m.Name), "Methods", ExtenderDoc.BuildMethodSignature);
            }

            if(doc.Events.Any()) {
                RenderNewLine(sb);
                RenderList(sb, doc.Events.OrderBy(e => e.Name), "Events");
            }

            return sb.ToString();
        }

        void RenderNewLine(StringBuilder sb) {
            sb.Append("<br />");
        }

        void RenderList(StringBuilder sb, IEnumerable<DocBase> members, string header, Func<DocBase, string> memberNameTransform = null) {
            sb.Append(RenderBold(header));
            sb.Append("<ul>");

            foreach(var member in members)
                RenderListItem(sb, member, memberNameTransform);

            sb.Append("</ul>");
        }

        void RenderListItem(StringBuilder sb, DocBase member, Func<DocBase, string> memberNameTransform = null) {
            sb.Append("<li>");
            var memberName = memberNameTransform == null ? member.Name : memberNameTransform(member);
            sb.Append(RenderBold(memberName));
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