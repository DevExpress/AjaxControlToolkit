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
    public class SeadragonPoint {

        public SeadragonPoint() {
        }

        public SeadragonPoint(float x, float y) {
            X = x;
            Y = y;
        }

        public float X { get; set; }
        public float Y { get; set; }
    }

}
#pragma warning restore 1591