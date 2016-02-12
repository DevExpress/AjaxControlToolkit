#pragma warning disable 1591
using System.Security.Permissions;
using System.Web.UI.Design;

namespace AjaxControlToolkit {

    [SecurityPermission(SecurityAction.Demand, Flags = SecurityPermissionFlag.UnmanagedCode)]
    public class SeadragonUrlEditor : UrlEditor {

        protected override string Caption {
            get { return base.Caption; }
        }

        protected override string Filter {
            get { return "DZI Files (*.dzi)|*.dzi|XML Files (*.xml)|*.xml"; }
        }
    }

}
#pragma warning restore 1591