using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.WebPages;

namespace AjaxControlToolkit.Reference.Core.Razor {

    public abstract class LayoutTemplateBase : TemplateBase {
        string _body;

        public string RenderBody() {
            return _body;
        }

        public string ToString(string body) {
            _body = body;
            return base.ToString();
        }
    }

}