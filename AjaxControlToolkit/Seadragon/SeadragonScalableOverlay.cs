using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {

    [ToolboxItem(false)]
    public class SeadragonScalableOverlay : SeadragonOverlay {
        SeadragonRect rect;

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content), NotifyParentProperty(true)]
        public SeadragonRect Rect {
            get {
                if(rect == null)
                    rect = new SeadragonRect();

                return rect;
            }
        }

        public SeadragonScalableOverlay() {
        }

        [Browsable(false)]
        [DefaultValue(SeadragonOverlayPlacement.TopLeft)]
        public sealed override SeadragonOverlayPlacement Placement {
            get { return SeadragonOverlayPlacement.TopLeft; }
        }
    }

}
