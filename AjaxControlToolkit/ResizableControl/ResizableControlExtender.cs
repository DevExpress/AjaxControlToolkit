using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// ResizableControl is an extender that attaches to any element on a web page and allows the user
    /// to resize that control with a handle that attaches to lower-right corner of the control. The
    /// resize handle lets the user resize the element as if it were a window. The appearance of the
    /// resize handle can be specified by the page designer with a CSS style. The content within the
    /// element can use CSS styles to automatically resize to fit the new dimensions. Alternatively,
    /// ResizableControl exposes two events (onresizing and onresize) that the page designer can attach
    /// custom script to in order to enable more complex layout logic. Element dimensions are preserved
    /// across postbacks to the server and "size" properties accesible on both the client and server
    /// can be used to enable custom resize behaviors. ResizableControl can optionally limit the maximum
    /// and minimum width and height of the target control so that resizing can be constrained by the page
    /// author (for example, to limit scrolling to only the horizontal dimension).
    /// </summary>
    [Designer(typeof(ResizableControlExtenderDesigner))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.ResizableControlBehavior", Constants.ResizableControlName)]
    [TargetControlType(typeof(WebControl))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.ResizableControlName + Constants.IconPostfix)]
    public class ResizableControlExtender : ExtenderControlBase {
        const int MaximumValue = 100000;

        public ResizableControlExtender() {
            EnableClientState = true;
        }

        /// <summary>
        /// The name of the CSS class to apply to the resize handle
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [RequiredProperty()]
        [ClientPropertyName("handleCssClass")]
        public string HandleCssClass {
            get { return GetPropertyValue("HandleCssClass", String.Empty); }
            set { SetPropertyValue("HandleCssClass", value); }
        }

        /// <summary>
        /// The name of the CSS class to apply to the element when resizing
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [ClientPropertyName("resizableCssClass")]
        public string ResizableCssClass {
            get { return GetPropertyValue("ResizableCssClass", String.Empty); }
            set { SetPropertyValue("ResizableCssClass", value); }
        }

        /// <summary>
        /// X-Offset to apply to the location of the resize handle
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        [ClientPropertyName("handleOffsetX")]
        public int HandleOffsetX {
            get { return GetPropertyValue("HandleOffsetX", 0); }
            set { SetPropertyValue("HandleOffsetX", value); }
        }

        /// <summary>
        /// Y-Offset to apply to the location of the resize handle
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        [ClientPropertyName("handleOffsetY")]
        public int HandleOffsetY {
            get { return GetPropertyValue("HandleOffsetY", 0); }
            set { SetPropertyValue("HandleOffsetY", value); }
        }

        /// <summary>
        /// Minimum width of the resizable element
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        [ClientPropertyName("minimumWidth")]
        public int MinimumWidth {
            get { return GetPropertyValue("MinimumWidth", 0); }
            set { SetPropertyValue("MinimumWidth", value); }
        }

        /// <summary>
        /// Minimum height of the resizable element
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(0)]
        [ClientPropertyName("minimumHeight")]
        public int MinimumHeight {
            get { return GetPropertyValue("MinimumHeight", 0); }
            set { SetPropertyValue("MinimumHeight", value); }
        }

        /// <summary>
        /// Maximum width of the resizable element
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(MaximumValue)]
        [ClientPropertyName("maximumWidth")]
        public int MaximumWidth {
            get { return GetPropertyValue("MaximumWidth", MaximumValue); }
            set { SetPropertyValue("MaximumWidth", value); }
        }

        /// <summary>
        /// Maximum height of the resizable element
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue(MaximumValue)]
        [ClientPropertyName("maximumHeight")]
        public int MaximumHeight {
            get { return GetPropertyValue("MaximumHeight", MaximumValue); }
            set { SetPropertyValue("MaximumHeight", value); }
        }

        // Note: onresize isn't a behavior property, it's a behavior event.
        // It's specified as a property here so that ExtenderBase and the
        // Visual Studio designer will expose it to the user and write it
        // to the xml-script so that ASP.NET AJAX will hook up the event
        // properly.

        /// <summary>
        /// Fires when the element has been resized
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [ClientPropertyName("resize")]
        public string OnClientResize {
            get { return GetPropertyValue("OnClientResize", String.Empty); }
            set { SetPropertyValue("OnClientResize", value); }
        }

        /// <summary>
        /// Fires as the element is being resized
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [ClientPropertyName("resizing")]
        public string OnClientResizing {
            get { return GetPropertyValue("OnClientResizing", String.Empty); }
            set { SetPropertyValue("OnClientResizing", value); }
        }

        /// <summary>
        /// Fires when the element starts being resized
        /// </summary>
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [ClientPropertyName("resizeBegin")]
        public string OnClientResizeBegin {
            get { return GetPropertyValue("OnClientResizeBegin", String.Empty); }
            set { SetPropertyValue("OnClientResizeBegin", value); }
        }

        public override void EnsureValid() {
            base.EnsureValid();
            if(MaximumWidth < MinimumWidth)
                throw new ArgumentException("Maximum width must not be less than minimum width");

            if(MaximumHeight < MinimumHeight)
                throw new ArgumentException("Maximum height must not be less than minimum height");
        }

        /// <summary>
        /// Size of the target
        /// </summary>
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [ClientPropertyName("size")]
        public Size Size {
            get {
                int width;
                int height;

                var clientStateArray = (ClientState ?? String.Empty).Split(',');

                if(clientStateArray.Length < 2 ||
                    String.IsNullOrEmpty(clientStateArray[0]) ||
                    String.IsNullOrEmpty(clientStateArray[1]) ||
                    !Int32.TryParse(clientStateArray[0], NumberStyles.Integer, CultureInfo.InvariantCulture, out width) ||
                    !Int32.TryParse(clientStateArray[1], NumberStyles.Integer, CultureInfo.InvariantCulture, out height)) {
                    return Size.Empty;
                } else
                    return new Size(width, height);
            }
            set { ClientState = String.Format(CultureInfo.InvariantCulture, "{0},{1}", value.Width, value.Height); }
        }
    }

}
