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

    public partial class Testing : System.Web.UI.Page {

        protected void Page_Load(object sender, EventArgs e) {
            var suites = GetSuites();
            var targetSuite = Request.Params["suite"];

            if(!String.IsNullOrWhiteSpace(targetSuite))
                suites = suites.Where(s => s.name == targetSuite);

            RenderSpecsQty(suites);
        }

        void RenderSpecsQty(IEnumerable<SuiteInfo> suites) {
            
            ClientScript.RegisterClientScriptBlock(
                typeof(Testing),
                "SuitesCount",
                "window.Testing = {}; window.Testing.Suites=" + new JavaScriptSerializer().Serialize(suites),
                true);
        }

        private IEnumerable<SuiteInfo> GetSuites() {
            var suitesDir = Server.MapPath("~/Suites");

            return GetTestPagePaths(suitesDir)
                .Select(path => new SuiteInfo{
                    name = GetRelativePath(path, suitesDir),
                    specQty = CountSpecsInFile(path)
                })
                .Where(s => s.specQty > 0);
        }

        IEnumerable<string> GetTestPagePaths(string suitesDirectory) {
            return Directory.EnumerateFiles(suitesDirectory, "*.aspx", SearchOption.AllDirectories);
        }

        int CountSpecsInFile(string filePath) {
            return Regex.Matches(File.ReadAllText(filePath), "\\s+it\\(").Count;
        }

        string GetRelativePath(string fullPath, string basePath) {
            if(!basePath.EndsWith(@"\"))
                basePath += @"\";

            var relativeUri = new Uri(basePath).MakeRelativeUri(new Uri(fullPath));

            return relativeUri.ToString().Replace("/", @"\");
        }
    }

}