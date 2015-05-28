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
            CountSuits();
        }

        void CountSuits() {
            var suitesDirectory = Server.MapPath("~/Suites");
            var pagePaths = Directory.EnumerateFiles(suitesDirectory, "*.aspx", SearchOption.AllDirectories);

            var suitesCount = new List<SuiteCount>();
            foreach(var path in pagePaths) {
                var fileContent = File.ReadAllText(path);
                var count = Regex.Matches(fileContent, "it\\(").Count;
                suitesCount.Add(new SuiteCount(Path.GetFileName(path), count));
            }

            JavaScriptSerializer serializer = new JavaScriptSerializer();
            var serializedDictionary = serializer.Serialize((object)suitesCount);

            ClientScript.RegisterClientScriptBlock(typeof(Testing), "SuitesCount", "<script type='text/javascript'>window.Testing = {};window.Testing.Suites=" + serializedDictionary + "</script>");
        }
    }
}