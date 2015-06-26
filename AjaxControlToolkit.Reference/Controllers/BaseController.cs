using AjaxControlToolkit.Reference.Core.Razor;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AjaxControlToolkit.Reference.Controllers {

    public class BaseController : Controller {

        protected ContentResult CustomContent<T>(T model) {

            var path = Path.Combine(Server.MapPath("~/Views"),
                RouteData.Values["controller"].ToString(),
                RouteData.Values["action"] + ".cshtml").ToString();

            //var requestPath = HttpContext.Request.FilePath;
            //if(requestPath == "/") {
            //    var route = (System.Web.Routing.Route)RouteData.Route;
            //    requestPath = route.Defaults["controller"] + "/" + route.Defaults["action"];
            //}
            //var path = Path.Combine(Server.MapPath("~/Views"), requestPath.TrimStart('~', '/') + ".cshtml");
            var engine = new Engine(HttpContext.ApplicationInstance.Request.PhysicalPath);
            return Content(engine.RenderPageFromFile(path, model));
        }
    }

}