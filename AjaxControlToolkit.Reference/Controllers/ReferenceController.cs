using AjaxControlToolkit.Reference.Core;
using AjaxControlToolkit.Reference.Core.Rendering;
using System.Linq;
using System.Web.Mvc;

namespace AjaxControlToolkit.Reference.Controllers {

    public class ReferenceController : Controller {
        const string ActNamespace = "AjaxControlToolkit";

        public ActionResult Index() {
            return View(ToolkitTypes.GetTypeNames().Concat(ToolkitTypes.GetAnimationTypeNames()));
        }

        public ContentResult Markup(string id) {
            var typeName = id;
            var xmlDocFolder = Server.MapPath("~/bin/");
            var scriptsFolder = Server.MapPath("~/bin/Scripts/");
            var doc = Documentation.Get(typeName, xmlDocFolder, scriptsFolder);
            var docRenderer = new GitHubDocRenderer();
            var renderSampleSiteLink = Documentation.IsRenderSampleSiteLink(typeName);
            var forceHeaderRendering = Documentation.IsForceHeaderRendering(typeName);
            var extenderDoc = new ExtenderDoc(docRenderer, renderSampleSiteLink, forceHeaderRendering);

            Documentation animationDocs = null;
            if(Documentation.IsAnimationScriptsRelatedType(typeName))
                animationDocs = Documentation.GetAnimationScriptsReference(scriptsFolder);

            var markup = extenderDoc.BuildDoc(doc.Types, animationDocs?.Types);

            return Content(markup);
        }


    }

}
