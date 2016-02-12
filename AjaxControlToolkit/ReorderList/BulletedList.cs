#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;

namespace AjaxControlToolkit {

    // We create our own BulletedList because the ASP.NET one
    // Takes ListItems rather than regular controls as it's children.
    [ToolboxItem(false)]
    public class BulletedList : WebControl {
        public BulletedList() {
        }

        protected override HtmlTextWriterTag TagKey {
            get {
                return HtmlTextWriterTag.Ul;
            }
        }
    }

}

#pragma warning restore 1591