using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    // This extender attaches the stock "floatingBehavior" to a Panel, and is an example
    // of wrapping an existing behavior with an extender.
    // When attached to a Panel, the user can then drag that panel around the browser rendering surface
    // using the mouse.

    /// <summary>
    /// The DragPanel extender allows users to easily add "draggability" to their controls.
    /// The DragPanel targets any ASP.NET Panel and takes an additional parameter that signifies the
    /// control to use as the "drag handle". Once initialized, the user can freely drag the panel around the web page using the drag handle.
    /// </summary>
    [Designer(typeof(DragPanelExtenderDesigner))]
    [ClientScriptResource("Sys.Extended.UI.FloatingBehavior", Constants.FloatingBehaviorName)]
    [TargetControlType(typeof(WebControl))]
    [RequiredScript(typeof(DragDropScripts))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.DragPanelName + Constants.IconPostfix)]
    public class DragPanelExtender : ExtenderControlBase {
        /// <summary>
        /// The server ID of a control that will serve as the "handle" for this drag operation.
        /// When the user clicks and drags on this control, the associated panel will be moved as well.
        /// </summary>
        [IDReferenceProperty(typeof(WebControl))]
        [ExtenderControlProperty()]
        [ElementReference()]
        [RequiredProperty]
        [ClientPropertyName("handle")] // the property on the floatingBevahior is called "handle" - this associates this property with that name
        public string DragHandleID {
            get {
                var dragHandleID = GetPropertyValue("DragHandleID", "");
                if(String.IsNullOrEmpty(dragHandleID)) {
                    dragHandleID = TargetControlID;
                }

                return dragHandleID;
            }
            set { SetPropertyValue("DragHandleID", value); }
        }
    }

}
