using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit.Reference {
    public class GitHubIssue {

        public string Url { get; set; } // "https://api.github.com/repos/DevExpress/AjaxControlToolkit/issues/70",
        public int Number { get; set; } //70,
        public string Title { get; set; }// "Deprecate HtmlEditor in favor of HtmlEditorExtender",
        public List<GitHubLabel> Labels;
        public string State { get; set; }// "closed",
        public GitHubMilestone Milestone { get; set; }
        public object pull_request { get; set; }

        public bool IsPullRequest() {
            return pull_request != null;
        }
    }
}