using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    ///<summary>
    /// This extender attaches the stock floatingBehavior to the panel and is an example of wrapping the existing behavior with an extender. 
    /// On being attached to the panel, a user can then drag that panel around the browser rendering surface using the mouse.
    ///</summary>
    [Designer(typeof(DragPanelExtenderDesigner))]
    [ClientScriptResource("Sys.Extended.UI.FloatingBehavior", Constants.FloatingBehaviorName)]
    [TargetControlType(typeof(WebControl))]
    [RequiredScript(typeof(DragDropScripts))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.DragPanelName + Constants.IconPostfix)]
    public class DragPanelExtender : ExtenderControlBase {
        /// <summary>
        /// The server ID of a control that will serve as a handle for this drag operation. 
        /// When a user clicks and drags this control, the associated panel will be moved as well.
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
