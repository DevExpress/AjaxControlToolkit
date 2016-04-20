using System;
using System.Linq;
using System.IO;
using System.Net;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Diagnostics;
using AjaxControlToolkit.Reference.Core;
using AjaxControlToolkit.Reference.Core.Rendering;

namespace AjaxControlToolkit.Reference.Controllers {
    public class ReleaseNotesController : Controller {
        public ActionResult Index() {
            var milestones = new string[] { "16.2" };

            return View(milestones);
        }

        public ContentResult Milestone(string id) {
            var milestone = id;
            var closedIssues = new List<GitHubIssue>();
            WebResponse response = GetResponse("https://api.github.com/repos/DevExpress/AjaxControlToolkit/issues?state=closed");

            while(HasNextPage(response))
            {
                closedIssues.AddRange(GetIssuesPart(response));
                response = GetResponse(GetNextPageUrl(response));
            }
            closedIssues.AddRange(GetIssuesPart(response));

            var invalidIssues = ValidateLabeledIssuesWithoutMilestone(closedIssues);
            var validIssues = GetMilestoneIssues(closedIssues, milestone);

            var docRenderer = new GitHubDocRenderer();
            var releaseNotes = new ReleaseNotes(docRenderer);
            var markup = releaseNotes.BuildReleaseNotes(validIssues.OrderBy(issue => issue.Number), invalidIssues);

            Debug.WriteLine("Issues count: " + releaseNotes.GetIssueCount());

            return Content(markup);
        }

        private IEnumerable<GitHubIssue> GetMilestoneIssues(IEnumerable<GitHubIssue> closedIssues, string milestone) {
            return closedIssues.Where(issue =>
                IsTargetMilestone(issue, milestone)
                && issue.Labels.Any(label => IsReleaseNotesLabel(label)));
        }

        private static bool IsTargetMilestone(GitHubIssue issue, string milestone) {
            return issue.Milestone != null && issue.Milestone.Title == milestone;
        }

        private IEnumerable<GitHubIssue> ValidateLabeledIssuesWithoutMilestone(IEnumerable<GitHubIssue> closedIssues) {
            return closedIssues.Where(issue => !issue.IsPullRequest() 
                && issue.Milestone == null 
                && issue.Labels.Any(label => IsReleaseNotesLabel(label)));
        }

        private static bool IsReleaseNotesLabel(GitHubLabel label) {
            return label.Name == "bug" || label.Name == "enhancement";
        }

        private bool HasNextPage(WebResponse response) {
            return GetLinkPartsCollection(response)
                .Any(parts => HasNextPageSignature(parts));
        }

        private bool HasNextPageSignature(string[] parts) {
            return parts[1] == " rel=\"next\"";
        }

        private string GetNextPageUrl(WebResponse response) {
            return GetLinkPartsCollection(response)
                .Where(parts => HasNextPageSignature(parts))
                .Select(parts => parts[0].Replace("<", "").Replace(">", ""))
                .FirstOrDefault();
        }

        IEnumerable<string[]> GetLinkPartsCollection(WebResponse response) {
            var linkPartsCollection = new List<string[]>();
            var linksString = response.Headers.Get("Link");
            var links = linksString.Split(',');

            for(int i = 0; i < links.Length; i++)
                linkPartsCollection.Add(links[i].Split(';'));

            return linkPartsCollection;
        }

        private IEnumerable<GitHubIssue> GetIssuesPart(WebResponse response) {
            var stream = response.GetResponseStream();
            using(var reader = new StreamReader(stream)) {
                var responseText = reader.ReadToEnd();
                var issuesArray = JArray.Parse(responseText);
                var issues = new List<GitHubIssue>();

                foreach(var token in issuesArray) {
                    var issue = JsonConvert.DeserializeObject<GitHubIssue>(token.ToString());
                    issues.Add(issue);
                }

                return issues.Where(issue => issue.pull_request == null);
            }
        }

        private WebResponse GetResponse(string url) {
            var request = (HttpWebRequest)WebRequest.Create(url);
            request.UserAgent = "Foo";
            request.Accept = "application/json";
            return request.GetResponse();
        }
    }
}
