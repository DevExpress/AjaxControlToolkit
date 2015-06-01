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
            RendertSpecsQty();
        }

        void RendertSpecsQty() {
            var suites = GetTestPagePaths()
                .Select(path => new {
                    name = Path.GetFileName(path),
                    specQty = CountSpecsInFile(path)
                })
                .Where(s => s.specQty > 0);

            ClientScript.RegisterClientScriptBlock(
                typeof(Testing),
                "SuitesCount",
                "window.Testing = {}; window.Testing.Suites=" + new JavaScriptSerializer().Serialize(suites),
                true);
        }

        IEnumerable<string> GetTestPagePaths() {
            var suitesDirectory = Server.MapPath("~/Suites");

            return Directory.EnumerateFiles(suitesDirectory, "*.aspx", SearchOption.AllDirectories);
        }

        int CountSpecsInFile(string filePath) {
            return Regex.Matches(File.ReadAllText(filePath), "\\s+it\\(").Count;
        }
    }

}