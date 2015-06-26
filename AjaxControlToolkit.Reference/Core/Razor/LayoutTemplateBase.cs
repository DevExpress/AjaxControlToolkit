using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.WebPages;

namespace AjaxControlToolkit.Reference.Core.Razor {

    public abstract class LayoutTemplateBase : TemplateBase {

        public string Body { get; set; }

        public string RenderBody() {
            return Body;
        }
    }

}