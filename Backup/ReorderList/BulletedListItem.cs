


using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI.WebControls;
using System.Web.UI;

namespace AjaxControlToolkit
{
    /// <summary>
    /// We create our own BulletedListItem control here (LI)
    /// because the ASP.NET BulletedList control exposes a collection of list items
    /// rather than a child collection of controls.
    /// </summary>
    [System.ComponentModel.ToolboxItem(false)]
    public class BulletedListItem : WebControl
    {
        public BulletedListItem()
        {            
        }

        protected override HtmlTextWriterTag TagKey
        {
            get
            {
                return HtmlTextWriterTag.Li;
            }
        }
    }
}
