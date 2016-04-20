using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit.Reference.Core {
    abstract class IssueBuilder {
        protected IEnumerable<GitHubIssue> validIssues;
        protected string issueKindName;

        public IssueBuilder(IEnumerable<GitHubIssue> validIssues) {
            this.validIssues = validIssues;
        }

        internal abstract string GetHeader();

        internal bool HasIssues() {
            return validIssues.Any(issue => IsTargetType(issue));
        }

        internal bool IsTargetType(GitHubIssue issue) {
            return issue.Labels != null && issue.Labels.Select(label => label.Name).Any(name => name == issueKindName);
        }

        internal IEnumerable<GitHubIssue> GetCommonIssues() {
            return validIssues.Where(issue =>
                IsTargetType(issue)
                && issue
                .Labels
                .Select(label => label.Name)
                .All(name => !ToolkitTypes.GetIssueTypeNames()
                .Contains(name)));
        }

        internal IEnumerable<GitHubIssue> GetSpecificIssues() {
            return validIssues.Where(issue => issue.Labels != null
                    && IsTargetType(issue)
                    && issue.Labels.Any(label => ToolkitTypes.GetIssueTypeNames().Contains(label.Name)));
        }
    }
}
