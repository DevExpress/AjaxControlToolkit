#pragma warning disable 1591
using System.Web.UI;
using System.Web.UI.WebControls;
using System.ComponentModel;
using System.Web;
using System.Security.Permissions;

namespace AjaxControlToolkit {

    [ToolboxData("<{0}:SeadragonOverlay runat=server></{0}:SeadragonOverlay>")]
    public abstract class SeadragonOverlay : Panel {
        public virtual SeadragonOverlayPlacement Placement { get; set; }

        protected override HtmlTextWriterTag TagKey {
            get { return HtmlTextWriterTag.Div; }
        }
    }

}
#pragma warning restore 1591