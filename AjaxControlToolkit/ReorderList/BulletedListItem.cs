#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;

namespace AjaxControlToolkit {

    /// We create our own BulletedListItem control here (LI)
    /// because the ASP.NET BulletedList control exposes a collection of list items
    /// rather than a child collection of controls.
    [ToolboxItem(false)]
    public class BulletedListItem : WebControl {
        public BulletedListItem() {
        }

        protected override HtmlTextWriterTag TagKey {
            get {
                return HtmlTextWriterTag.Li;
            }
        }
    }

}

#pragma warning restore 1591