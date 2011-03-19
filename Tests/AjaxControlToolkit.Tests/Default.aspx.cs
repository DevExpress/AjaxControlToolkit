using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;

namespace AjaxControlToolkit.Tests {
    public partial class Default : System.Web.UI.Page {



        /// <summary>
        /// Get all of the tests from the Tests folder (and not the Test_Page files)
        /// </summary>
        public string GetTests() {
            var testFolder = MapPath("~/Tests");
            var tests = (from f in Directory.GetFiles(testFolder, "*.aspx", SearchOption.AllDirectories)
                         where !f.EndsWith("_TestPage.aspx", StringComparison.InvariantCultureIgnoreCase)
                         orderby f descending
                         select String.Format("'{0}'", ToRelativePath(f))).ToArray();
            return String.Join(",", tests);


        }


        public string ToRelativePath(string filePath) {
            return filePath.Replace(MapPath("~/"), ResolveClientUrl("~/")).Replace("\\", "/");
        }

    
    }
}