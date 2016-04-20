using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit.Reference {
    public class GitHubIssue {

        public string Url { get; set; }
        public int Number { get; set; }
        public string Title { get; set; }
        public List<GitHubLabel> Labels;
        public string State { get; set; }
        public GitHubMilestone Milestone { get; set; }
        public object pull_request { get; set; }

        public bool IsPullRequest() {
            return pull_request != null;
        }
    }
}