using AjaxControlToolkit.Reference.Core.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using AjaxControlToolkit.ReferenceCore;

namespace AjaxControlToolkit.Reference.Core {
    public class ReleaseNotes : MarkupBuilder {
        private int issueCounter;

        public ReleaseNotes(IDocRenderer renderer)
            : base(renderer) {
        }

        public int GetIssueCount() {
            return issueCounter;
        }

        public string BuildReleaseNotes(IEnumerable<GitHubIssue> validIssues, IEnumerable<GitHubIssue> invalidIssues) {
            issueCounter = 0;
            _markupStringBuilder.Clear();

            BuildWarningSection(invalidIssues);

            BuildIssuesKind(new EnhancementsBuilder(validIssues));
            BuildIssuesKind(new BugfixesBuilder(validIssues));

            return _markupStringBuilder.ToString();
        }

        private void BuildIssuesKind(IssueBuilder issueBuilder) {
            if(issueBuilder.HasIssues()) {
                _markupStringBuilder.Append(_renderer.RenderHeader(issueBuilder.GetHeader(), 2));
                _markupStringBuilder.Append(_renderer.RenderNewParagraph());
            }

            BuildCommonIssues(issueBuilder.GetCommonIssues());
            BuildSpecificIssues(issueBuilder.GetSpecificIssues());
        }

        private void BuildCommonIssues(IEnumerable<GitHubIssue> commonIssues) {
            if(commonIssues.Any())
                BuildTypeIssues(commonIssues, "All controls");
        }

        private void BuildSpecificIssues(IEnumerable<GitHubIssue> specificIssues) {
            foreach(var typeName in ToolkitTypes.GetIssueTypeNames()) {
                var typeIssues = specificIssues.Where(issue => issue.Labels.Select(label => label.Name).Contains(typeName));

                if(typeIssues.Any())
                    BuildTypeIssues(typeIssues, GetReadableTypeName(typeName));
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

        private void BuildTypeIssues(IEnumerable<GitHubIssue> typeIssues, string typeName) {
            _markupStringBuilder.Append(_renderer.RenderHeader(typeName, 3));
            _markupStringBuilder.Append(_renderer.RenderNewParagraph());

            foreach(var issue in typeIssues) {
                _markupStringBuilder.Append(
                    _renderer.RenderListItem(
                        String.Format("Item {0} - {1}",
                            _renderer.RenderUrl(issue.Number.ToString(), issue.Url),
                            _renderer.RenderText(issue.Title))));

                issueCounter++;
            }

            _markupStringBuilder.Append(_renderer.RenderNewParagraph());
        }

        private bool IsBugfix(GitHubIssue issue) {
            return issue.Labels != null && issue.Labels.Select(label => label.Name).Contains("bug");
        }

        private void BuildWarningSection(IEnumerable<GitHubIssue> invalidIssues) {
            if(!invalidIssues.Any())
                return;

            _markupStringBuilder.Append(_renderer.RenderHeader("Warning: labeled issues without milestone detected"));
            _markupStringBuilder.Append(_renderer.RenderNewParagraph());

            foreach(var issue in invalidIssues)
                _markupStringBuilder.Append(_renderer.RenderListItem(_renderer.RenderUrl(issue.Title, issue.Url)));
        }
    }
}
