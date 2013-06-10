

using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

#region Assembly Resource Attribute
[assembly: System.Web.UI.WebResource("ReorderList.DropWatcherBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("ReorderList.DropWatcherBehavior.debug.js", "text/javascript")]
#endregion

namespace AjaxControlToolkit
{
    /// <summary>
    /// The extender which attaches the DropWatcherBehavior to our list element.
    /// </summary>
    [ToolboxItem(false)]
    [ClientScriptResource("Sys.Extended.UI.DragDropWatcher", "ReorderList.DropWatcherBehavior.js")]
    [RequiredScript(typeof(DragDropScripts))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(BulletedList))]
    public class DropWatcherExtender : ExtenderControlBase
    {

        private string DataTypeName
        {
            get
            {
                return "HTML_" + Parent.ID;
            }
        }

        /// <summary>
        /// Passthrough to the acceptedDataTypes property of the dragDropList.  Value is always
        /// 'HTML' but the property needs to be r/w to be serialized.
        /// </summary>
        [Browsable(false)]
        [ClientPropertyName("acceptedDataTypes")]
        [ExtenderControlProperty()]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1822:MarkMembersAsStatic", Justification="Required by Reflection")]
        public string AcceptedDataTypes {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Used by VS designer")]
            get {
                return DataTypeName;
            }
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Used by VS designer")]
            set {
                // Do nothing
                SuppressUnusedParameterWarning(value);
            }
        }

        /// <summary>
        /// The string that is placed in the postBackCode that should be replaced for argument values.
        /// </summary>
        /// 
        [ClientPropertyName("argReplaceString")]
        [ExtenderControlProperty()]
        public string ArgReplaceString {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Used by VS designer")]
            get {
                return GetPropertyValue("ArgReplaceString", "");
            }
            set {
                SetPropertyValue("ArgReplaceString", value);
            }
        }

        [ClientPropertyName("argSuccessString")]
        [ExtenderControlProperty()]
        public string ArgSuccessString {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Used by VS designer")]
            get {
                return GetPropertyValue("ArgSuccessString", "");
            }
            set {
                SetPropertyValue("ArgSuccessString", value);
            }
        }

        [ClientPropertyName("argErrorString")]
        [ExtenderControlProperty()]
        public string ArgErrorString {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Used by VS designer")]
            get {
                return GetPropertyValue("ArgErrorString", "");
            }
            set {
                SetPropertyValue("ArgErrorString", value);
            }
        }
        
        [ClientPropertyName("argContextString")]
        [ExtenderControlProperty()]
        public string ArgContextString {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Used by VS designer")]
            get {
                return GetPropertyValue("ArgContextString", "");
            }
            set {
                SetPropertyValue("ArgContextString", value);
            }
        }

        [ClientPropertyName("callbackCssStyle")]
        [ExtenderControlProperty()]
        public string CallbackCssStyle {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Used by VS designer")]
            get {
                return GetPropertyValue("CallbackCssStyle", "");
            }
            set {
                SetPropertyValue("CallbackCssStyle", value);
            }
        }

        /// <summary>
        /// Passthrough to the dragDropList.  Always "HTML" but needs to be r/w for the serializer to see it.
        /// </summary>
        [Browsable(false)]
        [ClientPropertyName("dragDataType")]
        [ExtenderControlProperty()]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1822:MarkMembersAsStatic", Justification = "Required by Reflection")]
        public string DataType {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Used by VS designer")]
            get {                
                return DataTypeName;
            }
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Used by VS designer")]
            set {
                // Do nothing
                SuppressUnusedParameterWarning(value);
            }
        }

        /// <summary>
        /// Passthrough to the dragDropList.  Always "Move" but needs to be r/w for the serializer to see it.
        /// </summary>        
        [Browsable(false)]
        [ClientPropertyName("dragMode")]
        [ExtenderControlProperty()]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1822:MarkMembersAsStatic", Justification = "Required by Reflection")]
        public int DragMode {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Used by VS designer")]
            get {
                return /* "Move" */ 1; //TODO Shouldn't this be an Enum value?
            }
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Used by VS designer")]
            set {
                // Do nothing
                SuppressUnusedParameterWarning(value);
            }
        }

        /// <summary>
        /// The element that will be shown as the "you can drop here" visual when an item is 
        /// being reordered.
        /// </summary>
        [IDReferenceProperty(typeof(Control))]
        [ElementReference()]
        [ClientPropertyName("dropCueTemplate")]
        [ExtenderControlProperty()]
        public string DropLayoutElement {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Used by VS designer")]
            get {
                return GetPropertyValue("DropLayoutElement", "");
            }
            set {
                SetPropertyValue("DropLayoutElement", value);
            }
        }

        /// <summary>
        /// The postback code string to be fired when a drop occurs on the client side, including
        /// the argReplaceString which will be replaced by the index of the item that's being moved.
        /// </summary>
        ///         
        [ClientPropertyName("postbackCode")]
        [ExtenderControlProperty()]
        public string PostBackCode {
            [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "Used by VS designer")]
            get {
                return GetPropertyValue("PostbackCode", "");
            }
            set {
                SetPropertyValue("PostbackCode", value);
            }
        }     
    }
}
