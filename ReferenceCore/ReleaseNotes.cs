using AjaxControlToolkit.Reference.Core.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit.Reference.Core {
    public class ReleaseNotes : MarkupBuilder {
        public ReleaseNotes(IDocRenderer renderer)
            : base(renderer) {
        }

        public string BuildReleaseNotes(IEnumerable<GitHubIssue> validIssues, IEnumerable<GitHubIssue> invalidIssues) {
            _markupStringBuilder.Clear();

            BuildWarningSection(invalidIssues);

            BuildEnhancements(validIssues);
            BuildBugfixes(validIssues);

            return _markupStringBuilder.ToString();
        }

        private void BuildEnhancements(IEnumerable<GitHubIssue> validIssues) {
            if(HasEnhancements(validIssues)) {
                _markupStringBuilder.Append(_renderer.RenderHeader("Features and improvements:", 2));
                _markupStringBuilder.Append(_renderer.RenderNewParagraph());
            }

            var commonEnhancements = GetCommonEnhancements(validIssues);
            BuildCommonEnhancements(commonEnhancements);
            BuildSpecificEnhancements(validIssues);
        }

        private void BuildBugfixes(IEnumerable<GitHubIssue> validIssues) {
        }

        private void BuildCommonEnhancements(IEnumerable<GitHubIssue> enhancements) {
            if(enhancements.Any())
                BuildTypeEnhancements(enhancements, "All controls");
        }

        private void BuildSpecificEnhancements(IEnumerable<GitHubIssue> validIssues) {
            foreach(var typeName in ToolkitTypes.GetIssueTypeNames()) {
                var typeEnhancements = validIssues.Where(issue => issue.Labels != null
                    && IsEnhancement(issue)
                    && issue.Labels.Any(label => label.Name == typeName));

                if(typeEnhancements.Any())
                    BuildTypeEnhancements(typeEnhancements, GetReadableTypeName(typeName));
            }
        }

        private string GetReadableTypeName(string typeName) {
            switch(typeName) {
                case "HtmlEditor":
                    return "Editor";
                default:
                    return typeName;
            }
        }

        private void BuildTypeEnhancements(IEnumerable<GitHubIssue> typeEnhancements, string typeName) {
            _markupStringBuilder.Append(_renderer.RenderHeader(typeName, 3));
            _markupStringBuilder.Append(_renderer.RenderNewParagraph());

            foreach(var enhancement in typeEnhancements)
                _markupStringBuilder.Append(
                    _renderer.RenderListItem(
                        String.Format("Item {0} - {1}",
                            _renderer.RenderUrl(enhancement.Number.ToString(), enhancement.Url),
                            _renderer.RenderText(enhancement.Title))));

            _markupStringBuilder.Append(_renderer.RenderNewParagraph());
        }

        private static bool IsEnhancement(GitHubIssue issue) {
            return issue.Labels != null && issue.Labels.Select(label => label.Name).Contains("enhancement");
        }

        private IEnumerable<GitHubIssue> GetCommonEnhancements(IEnumerable<GitHubIssue> validIssues) {
            return validIssues.Where(issue =>
                IsEnhancement(issue)
                && issue
                .Labels
                .Select(label => label.Name)
                .All(name => !ToolkitTypes.GetIssueTypeNames()
                .Contains(name)));
        }

        private bool HasEnhancements(IEnumerable<GitHubIssue> validIssues) {
            return validIssues.Any(issue => IsEnhancement(issue));
        }

        private void BuildWarningSection(IEnumerable<GitHubIssue> invalidIssues) {
            if(!invalidIssues.Any())
                return;

            _markupStringBuilder.Append(_renderer.RenderHeader("Warning: labeled issues without milestone detected"));

            foreach(var issue in invalidIssues)
                _markupStringBuilder.Append(_renderer.RenderListItem(_renderer.RenderUrl(issue.Title, issue.Url)));
        }
    }
}
