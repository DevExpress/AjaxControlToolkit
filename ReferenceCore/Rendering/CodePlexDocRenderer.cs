using System;
using System.Collections.Generic;
using System.Text;

namespace AjaxControlToolkit.Reference.Core.Rendering {

    public class CodePlexDocRenderer : IDocRenderer {

        public string Sanitize(string text) {
            if(String.IsNullOrWhiteSpace(text))
                return String.Empty;

            return text
                .Replace("*", "{\"*\"}")
                .Replace("_", "{\"_\"}")
                .Replace("+", "{\"+\"}")
                .Replace("!", "{\"!\"}")
                .Replace("#", "{\"#\"}");
        }

        public string RenderHeader(string text, int level = 1) {
            if(String.IsNullOrWhiteSpace(text))
                return String.Empty;

            return new String('!', level) + " " + text;
        }

        public string RenderText(string text, bool bold = false, bool italic = false) {
            if(String.IsNullOrWhiteSpace(text))
                return String.Empty;

            var result = text;

            result = result.Replace("<code>", "{{").Replace("</code>", "}}");

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

            return new String(ordered ? '#' : '*', level) + " " + text + RenderNewParagraph();
        }

        public string RenderNewParagraph() {
            return "\n";
        }

        public string RenderLineBreak() {
            return "\n";
        }

        public string RenderDescriptionBlock(Dictionary<string, string> values) {
            var descriptionStringBuilder = new StringBuilder();

            descriptionStringBuilder.Append(String.Format("|| {0} || {1} ||", "Name", "Description"));
            descriptionStringBuilder.Append(this.RenderNewParagraph());
            foreach(var value in values) {
                descriptionStringBuilder.Append(String.Format("| {0} | {1} |", RenderText(value.Key), RenderText(value.Value)));
                descriptionStringBuilder.Append(this.RenderNewParagraph());
            }

            return descriptionStringBuilder.ToString();
        }

        public string RenderUrl(string text, string url) {
            return String.Format("[url:{0}|{1}]", text, url);
        }
    }
}