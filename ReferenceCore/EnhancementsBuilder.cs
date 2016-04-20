using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit.Reference.Core {
    class EnhancementsBuilder : IssueBuilder {
        public EnhancementsBuilder(IEnumerable<GitHubIssue> validIssues)
            : base(validIssues) {
                issueKindName = "enhancement";
        }

        internal override string GetHeader() {
            return "Features and improvements:";
        }
    }
}
