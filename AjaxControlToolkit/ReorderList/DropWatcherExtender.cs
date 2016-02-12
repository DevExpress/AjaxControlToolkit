#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    // The extender which attaches the DropWatcherBehavior to our list element.
    [ToolboxItem(false)]
    [ClientScriptResource("Sys.Extended.UI.DragDropWatcher", Constants.DropWatcherName)]
    [RequiredScript(typeof(DragDropScripts))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(BulletedList))]
    public class DropWatcherExtender : ExtenderControlBase {

        string DataTypeName {
            get { return "HTML_" + Parent.ID; }
        }

        // Passthrough to the acceptedDataTypes property of the dragDropList.  Value is always
        // 'HTML' but the property needs to be r/w to be serialized.
        [Browsable(false)]
        [ClientPropertyName("acceptedDataTypes")]
        [ExtenderControlProperty()]
        public string AcceptedDataTypes {
            get { return DataTypeName; }
            set { }
        }

        // The string that is placed in the postBackCode that should be replaced for argument values.
        [ClientPropertyName("argReplaceString")]
        [ExtenderControlProperty()]
        public string ArgReplaceString {
            get { return GetPropertyValue("ArgReplaceString", ""); }
            set { SetPropertyValue("ArgReplaceString", value); }
        }

        [ClientPropertyName("argSuccessString")]
        [ExtenderControlProperty()]
        public string ArgSuccessString {
            get { return GetPropertyValue("ArgSuccessString", ""); }
            set { SetPropertyValue("ArgSuccessString", value); }
        }

        [ClientPropertyName("argErrorString")]
        [ExtenderControlProperty()]
        public string ArgErrorString {
            get { return GetPropertyValue("ArgErrorString", ""); }
            set { SetPropertyValue("ArgErrorString", value); }
        }

        [ClientPropertyName("argContextString")]
        [ExtenderControlProperty()]
        public string ArgContextString {
            get { return GetPropertyValue("ArgContextString", ""); }
            set { SetPropertyValue("ArgContextString", value); }
        }

        [ClientPropertyName("callbackCssStyle")]
        [ExtenderControlProperty()]
        public string CallbackCssStyle {
            get { return GetPropertyValue("CallbackCssStyle", ""); }
            set { SetPropertyValue("CallbackCssStyle", value); }
        }

        // Passthrough to the dragDropList.  Always "HTML" but needs to be r/w for the serializer to see it.
        [Browsable(false)]
        [ClientPropertyName("dragDataType")]
        [ExtenderControlProperty()]
        public string DataType {
            get { return DataTypeName; }
            set { }
        }

        // Passthrough to the dragDropList.  Always "Move" but needs to be r/w for the serializer to see it.
        [Browsable(false)]
        [ClientPropertyName("dragMode")]
        [ExtenderControlProperty()]
        public int DragMode {
            get {
                //TODO Shouldn't this be an Enum value?
                return /* "Move" */ 1;
            }
            set { }
        }

        /// The element that will be shown as the "you can drop here" visual when an item is 
        /// being reordered.
        [IDReferenceProperty(typeof(Control))]
        [ElementReference()]
        [ClientPropertyName("dropCueTemplate")]
        [ExtenderControlProperty()]
        public string DropLayoutElement {
            get { return GetPropertyValue("DropLayoutElement", ""); }
            set { SetPropertyValue("DropLayoutElement", value); }
        }

        // The postback code string to be fired when a drop occurs on the client side, including
        // the argReplaceString which will be replaced by the index of the item that's being moved.
        [ClientPropertyName("postbackCode")]
        [ExtenderControlProperty()]
        public string PostBackCode {
            get { return GetPropertyValue("PostbackCode", ""); }
            set { SetPropertyValue("PostbackCode", value); }
        }
    }

}

#pragma warning restore 1591