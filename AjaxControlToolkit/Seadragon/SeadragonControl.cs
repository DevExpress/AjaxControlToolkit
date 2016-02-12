#pragma warning disable 1591
using System.Web.UI;
using System.Web.UI.WebControls;
using System.ComponentModel;

namespace AjaxControlToolkit {

    [ToolboxItem(false)]
    [ToolboxData("<{0}:SeadragonControl runat=\"server\"></{0}:SeadragonControl>")]
    public class SeadragonControl : Panel {
        ControlAnchor _anchor;
        public SeadragonControl() {
        }

        public SeadragonControl(Control ctl, ControlAnchor anchor) {
            _anchor = anchor;
            Controls.Add(ctl);
        }

        public ControlAnchor Anchor {
            get { return _anchor; }
            set { _anchor = value; }
        }
    }

}
#pragma warning restore 1591