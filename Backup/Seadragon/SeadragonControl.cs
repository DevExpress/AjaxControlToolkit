using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.ComponentModel;


namespace AjaxControlToolkit
{
    [ToolboxItem(false)]
    [ToolboxData("<{0}:SeadragonControl runat=\"server\"></{0}:SeadragonControl>")]   
    public class SeadragonControl:Panel
    {
        private ControlAnchor _anchor;
        public SeadragonControl()
        {
        }

        public SeadragonControl(Control ctl, ControlAnchor anchor)
        {
            this._anchor = anchor;
            this.Controls.Add(ctl);
        }

        public ControlAnchor Anchor
        {
            get
            {
                return this._anchor;
            }
            set
            {
                this._anchor = value;
            }
        }
    }
    public enum ControlAnchor
    {
        NONE,
        TOP_LEFT,
        TOP_RIGHT,
        BOTTOM_RIGHT,
        BOTTOM_LEFT
    }
}
