using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit.Jasmine {

    public struct SuiteInfo {
        public string path;
        public int specCount;
    }

    public partial class TestRunner : System.Web.UI.Page {

        protected void Page_Load(object sender, EventArgs e) {
            var suites = GetSuites();
            var targetSuite = Request.Params["suite"];

            RenderSpecs(suites);
        }

        void RenderSpecs(IEnumerable<SuiteInfo> suites) {
            
            ClientScript.RegisterClientScriptBlock(
                typeof(TestRunner),
                "Suites",
                "window.TestRunner = {}; window.TestRunner.Suites=" + new JavaScriptSerializer().Serialize(suites),
                true);
        }

        IEnumerable<SuiteInfo> GetSuites() {
            var suitesDir = Server.MapPath("~/Suites");

            return GetTestPagePaths(suitesDir)
                .Select(path => new SuiteInfo {
                    path = GetRelativePath(path, suitesDir),
                    specCount = CountSpecsInFile(path)
                })
                .Where(s => s.specCount > 0);
        }

        IEnumerable<string> GetTestPagePaths(string suitesDirectory) {
            return Directory.EnumerateFiles(suitesDirectory, "*.aspx", SearchOption.AllDirectories);
        }

        int CountSpecsInFile(string filePath) {
            var text = File.ReadAllText(filePath);
            var totalSpecs = Regex.Matches(text, "\\s+it\\(").Count;
            totalSpecs -= SubtractBrowserDependentSpecs(text, Request.Browser.Browser);
            return totalSpecs;
        }

        private int SubtractBrowserDependentSpecs(string text, string browser) {
            var regex = new Regex(@"<%\s*if\s*\(\s*Request\.Browser\.Browser\s*(?<CompareOperator>[!=]+)\s*""" + browser + @"""\s*\)\s*{\s*%>");
            var match = regex.Match(text);
            if(match.Success
                &&
                (match.Groups["CompareOperator"].Value == "!=")) {
                    var beginBlockEndPosition = match.Index + match.Length;
                    var browserDependentTestsTextEndIndex = text.IndexOf("<% } %>", beginBlockEndPosition);
                    var browserDependentTestsText = text.Substring(beginBlockEndPosition, browserDependentTestsTextEndIndex - beginBlockEndPosition);
                    return Regex.Matches(browserDependentTestsText, "\\s+it\\(").Count;
            }

            return 0;
        }

        string GetRelativePath(string fullPath, string basePath) {
            if(!basePath.EndsWith(@"\"))
                basePath += @"\";

            var relativeUri = new Uri(basePath).MakeRelativeUri(new Uri(fullPath));

            return relativeUri.ToString().Replace("/", @"\");
        }
    }
}