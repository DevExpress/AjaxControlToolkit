using AjaxControlToolkit.Reference.Core;
using AjaxControlToolkit.Reference.Core.Parsing;
using AjaxControlToolkit.Reference.Core.Rendering;
using AjaxControlToolkit.ReferenceCore.Parsing;

using System;
using System.Linq;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using System.Xml.Linq;
using IO = System.IO;

namespace AjaxControlToolkit.Reference.Controllers {

    public class ReferenceController : Controller {
        const string ActNamespace = "AjaxControlToolkit";

        public ActionResult Index() {
            return View(ToolkitTypes.GetTypeNames());
        }

        public ContentResult Markup(string id) {
            var typeName = id;
            var xmlDocFolder = Server.MapPath("~/bin/");
            var scriptsFolder = Server.MapPath("~/bin/Scripts/");
            var doc = Documentation.Get(typeName, xmlDocFolder, scriptsFolder);

            var docRenderer = new GitHubDocRenderer();
            var extenderDoc = new ExtenderDoc(docRenderer);
            var markup = extenderDoc.BuildDoc(doc.Types);

            return Content(markup);
        }
    }

}
