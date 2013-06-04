using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.ComponentModel;
using System.Web;
using System.Security.Permissions;

namespace AjaxControlToolkit
{
    [ToolboxData("<{0}:SeadragonOverlay runat=server></{0}:SeadragonOverlay>")]   
    public abstract class SeadragonOverlay : Panel
    {
        public virtual SeadragonOverlayPlacement Placement { get; set; }
        protected override HtmlTextWriterTag TagKey
        {
            get
            {
                return HtmlTextWriterTag.Div;
            }
        }
    }
    [ToolboxItem(false)]
    public class SeadragonFixedOverlay : SeadragonOverlay
    {
        private SeadragonPoint point;
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content), NotifyParentProperty(true)]
        public SeadragonPoint Point
        {
            get
            {
                if (this.point == null)
                    this.point = new SeadragonPoint();
                return this.point;
            }
        }
        public SeadragonFixedOverlay()
        {
        }

    }
    [ToolboxItem(false)]
    public class SeadragonScalableOverlay : SeadragonOverlay
    {
        private SeadragonRect rect;
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content), NotifyParentProperty(true)]
        public SeadragonRect Rect
        {
            get
            {
                if (this.rect == null)
                    this.rect = new SeadragonRect();
                return this.rect;
            }
        }
        public SeadragonScalableOverlay()
        {
        }
        [Browsable(false)]
        [DefaultValue(SeadragonOverlayPlacement.TOP_LEFT)]
        public sealed override SeadragonOverlayPlacement Placement
        {
            get
            {
                return SeadragonOverlayPlacement.TOP_LEFT;
            }
        }
    }

    public enum SeadragonOverlayPlacement
    {
        CENTER,
        TOP_LEFT,
        TOP,
        TOP_RIGHT,
        RIGHT,
        BOTTOM_RIGHT,
        BOTTOM,
        BOTTOM_LEFT,
        LEFT
    }
    [TypeConverter(typeof(ExpandableObjectConverter)), AspNetHostingPermission(SecurityAction.LinkDemand, Level = AspNetHostingPermissionLevel.Minimal)]
    public class SeadragonRect
    {
        private SeadragonPoint point;

        public float Height { get; set; }
        public float Width { get; set; }
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content), NotifyParentProperty(true)]
        public SeadragonPoint Point
        {
            get
            {
                if (this.point == null)
                    this.point = new SeadragonPoint();
                return this.point;
            }
        }
        public SeadragonRect()
        {
        }
        public SeadragonRect(float width, float height)
        {
            this.Height = height;
            this.Width = width;
        }

    }
    [TypeConverter(typeof(ExpandableObjectConverter)), AspNetHostingPermission(SecurityAction.LinkDemand, Level = AspNetHostingPermissionLevel.Minimal)]
    public class SeadragonPoint
    {
        public float X { get; set; }
        public float Y { get; set; }
        public SeadragonPoint()
        {
        }
        public SeadragonPoint(float x, float y)
        {
            this.X = x;
            this.Y = y;
        }
    }
}
