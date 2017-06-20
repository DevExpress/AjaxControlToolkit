﻿using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Text;

namespace AjaxControlToolkit.Reference.Core.Rendering {

    public class GitHubDocRenderer : IDocRenderer {

        public string Sanitize(string text) {
            if(String.IsNullOrWhiteSpace(text))
                return String.Empty;

            return text
                .Replace("*", "\\*")
                .Replace("_", "\\_")
                .Replace("1. ", "1\\. ")
                .Replace("#", "\\#");
        }

        public string RenderHeader(string text, int level = 1) {
            if(String.IsNullOrWhiteSpace(text))
                return String.Empty;

            return new String('#', level) + " " + text;
        }

        public string RenderText(string text, bool bold = false, bool italic = false) {
            if(String.IsNullOrWhiteSpace(text))
                return String.Empty;

            var result = text;

            result = result.Replace("<code>", "`").Replace("</code>", "`");

            if(bold)
                result = String.Format("**{0}**", result);

            if(italic)
                result = String.Format("_{0}_", result);

            return result;
        }

        public string RenderListItem(string text, bool ordered = false, int level = 1) {
            if(String.IsNullOrWhiteSpace(text))
                return String.Empty;

            return new String(' ', (level - 1) * 4) + (ordered ? "1." : "*") + " " + text + NewLine();
        }

        public string RenderNewParagraph() {
            return "\n\n";
        }

        public string RenderLineBreak() {
            return "<br>";
        }

        private string NewLine() {
            return "\n";
        }

        public string RenderDescriptionBlock(Dictionary<string, string> values) {
            var sortedValues = new SortedDictionary<string, string>(values);
            var descriptionStringBuilder = new StringBuilder();

            descriptionStringBuilder.Append(String.Format("| {0} | {1} |", "Name", "Description"));
            descriptionStringBuilder.Append(NewLine());
            descriptionStringBuilder.Append("| --- | --- |");
            descriptionStringBuilder.Append(NewLine());

            foreach(var value in sortedValues) {
                descriptionStringBuilder.Append(String.Format("| {0} | {1} |", RenderText(value.Key), RenderText(value.Value)));
                descriptionStringBuilder.Append(NewLine());
            }

            return descriptionStringBuilder.ToString();
        }

        public string RenderUrl(string text, string url) {
            return String.Format("[{0}]({1})", text, url);
        }

        public string RenderWikiPageLink(string text, string pageName = null) {
            if(String.IsNullOrWhiteSpace(pageName))
                return String.Format("[[{0}]]", text);

            return String.Format("[[{0}|{1}]]", text, pageName);
        }
    }
}