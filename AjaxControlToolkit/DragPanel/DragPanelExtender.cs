using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Drawing;

namespace AjaxControlToolkit {

    // This extender attaches the stock "floatingBehavior" to a Panel, and is an example
    // of wrapping an existing behavior with an extender.
    // When attached to a Panel, the user can then drag that panel around the browser rendering surface
    // using the mouse.
    [Designer("AjaxControlToolkit.Design.DragPanelExtenderDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.DragPanelBehavior", Constants.DragPanelScriptName)]
    [TargetControlType(typeof(WebControl))]
    [RequiredScript(typeof(DragDropScripts))]
    [ToolboxBitmap(typeof(DragPanelExtender), "DragPanel.ico")]
    public class DragPanelExtender : ExtenderControlBase {
        // The server ID of a control that will serve as the "handle" for this drag operation.
        // When the user clicks and drags on this control, the associated panel will be moved as well.
        [IDReferenceProperty(typeof(WebControl))]
        [ExtenderControlProperty()]
        [ElementReference()]
        [RequiredProperty]
        [ClientPropertyName("handle")] // the property on the floatingBevahior is called "handle" - this associates this property with that name
        public string DragHandleID {
            get {
                string dragHandleID = GetPropertyValue("DragHandleID", "");
                if(string.IsNullOrEmpty(dragHandleID)) {
                    dragHandleID = TargetControlID;
                }
                return dragHandleID;
            }
            set { SetPropertyValue("DragHandleID", value); }
        }
    }
}