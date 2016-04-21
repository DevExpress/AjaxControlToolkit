using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit.Reference.Core {
    class BugfixesBuilder : IssueBuilder {
        public BugfixesBuilder(IEnumerable<GitHubIssue> validIssues)
            : base(validIssues) {
                issueKindName = "bug";
        }

        internal override string GetHeader() {
            return "Bug fixes:";
        }
    }
}
