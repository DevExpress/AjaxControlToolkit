using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {

    [ToolboxItem(false)]
    public class SeadragonFixedOverlay : SeadragonOverlay {
        SeadragonPoint point;

        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content), NotifyParentProperty(true)]
        public SeadragonPoint Point {
            get {
                if(point == null)
                    point = new SeadragonPoint();

                return point;
            }
        }

        public SeadragonFixedOverlay() {
        }
    }

}
