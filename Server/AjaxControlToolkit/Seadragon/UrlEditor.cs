using System;
using System.Collections.Generic;
using System.Text;
using System.Security.Permissions;
using System.Web.UI.Design;

namespace AjaxControlToolkit
{
    [SecurityPermission(SecurityAction.Demand, Flags=SecurityPermissionFlag.UnmanagedCode)]
    public class SeadragonUrlEditor:UrlEditor
    {
        protected override string Caption
        {
            get
            {
                return base.Caption;
            }
        }
        protected override string Filter
        {
            get
            {
                return "DZI Files (*.dzi)|*.dzi|XML Files (*.xml)|*.xml";
            }
        }
    }
}
