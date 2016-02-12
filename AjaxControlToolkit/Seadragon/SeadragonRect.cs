#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Security.Permissions;
using System.Text;
using System.Web;

namespace AjaxControlToolkit {

    [TypeConverter(typeof(ExpandableObjectConverter)), AspNetHostingPermission(SecurityAction.LinkDemand, Level = AspNetHostingPermissionLevel.Minimal)]
    public class SeadragonRect {
        SeadragonPoint point;

        public SeadragonRect() {
        }

        public SeadragonRect(float width, float height) {
            Height = height;
            Width = width;
        }

        public float Height { get; set; }
        public float Width { get; set; }
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content), NotifyParentProperty(true)]
        public SeadragonPoint Point {
            get {
                if(point == null)
                    point = new SeadragonPoint();

                return point;
            }
        }
    }

}
#pragma warning restore 1591