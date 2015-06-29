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

            var engine = new Engine(HttpContext.ApplicationInstance.Request.PhysicalPath);
            return Content(engine.RenderPageFromFile(path, model));
        }
    }

}