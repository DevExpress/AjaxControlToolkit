

using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Drawing;

[assembly: System.Web.UI.WebResource("DragPanel.FloatingBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("DragPanel.FloatingBehavior.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    /// <summary>
    /// This extender attaches the stock "floatingBehavior" to a Panel, and is an example
    /// of wrapping an existing behavior with an extender.
    /// 
    /// When attached to a Panel, the user can then drag that panel around the browser rendering surface
    /// using the mouse.
    /// </summary>
    [Designer("AjaxControlToolkit.DragPanelDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.FloatingBehavior", "DragPanel.FloatingBehavior.js")] // note the "null" passed in for the prefix
    [TargetControlType(typeof(WebControl))]
    [RequiredScript(typeof(DragDropScripts))]
    [System.Drawing.ToolboxBitmap(typeof(DragPanelExtender), "DragPanel.DragPanel.ico")]    
    public class DragPanelExtender : ExtenderControlBase
    {
        /// <summary>
        /// The server ID of a control that will serve as the "handle" for this drag operation.
        /// When the user clicks and drags on this control, the associated panel will be moved as well.
        /// </summary>
        [IDReferenceProperty(typeof(WebControl))]
        [ExtenderControlProperty()]
        [ElementReference()]
        [RequiredProperty]
        [ClientPropertyName("handle")] // the property on the floatingBevahior is called "handle" - this associates this property with that name
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string DragHandleID {
            get {
                string dragHandleID = GetPropertyValue("DragHandleID", "");
                if (string.IsNullOrEmpty(dragHandleID)) {                    
                    dragHandleID = TargetControlID;
                }
                return dragHandleID;
            }
            set {
                SetPropertyValue("DragHandleID", value);
            }
        }

        // TODO: Migrate (serializes as (Loc.X, Loc.Y) instead of (loc.x, loc.y)
        //
        //[ClientPropertyName("location")]
        //[ExtenderControlProperty()]
        //public Point Location {
        //    get {
        //        return GetPropertyValue("Location", Point.Empty);
        //    }
        //    set {
        //        SetPropertyValue("Location", value);
        //    }
        //}

        //[EditorBrowsable(EditorBrowsableState.Never)]
        //public bool ShouldSerializeLocation() {
        //    return Location != Point.Empty;
        //}
    }
}


