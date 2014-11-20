using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

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

        [ExtenderControlProperty()]
        [DefaultValue("")]
        [RequiredProperty()]
        public string HandleCssClass {
            get { return GetPropertyValue("HandleCssClass", String.Empty); }
            set { SetPropertyValue("HandleCssClass", value); }
        }

        [ExtenderControlProperty()]
        [DefaultValue("")]
        public string ResizableCssClass {
            get { return GetPropertyValue("ResizableCssClass", String.Empty); }
            set { SetPropertyValue("ResizableCssClass", value); }
        }

        [ExtenderControlProperty()]
        [DefaultValue(0)]
        public int HandleOffsetX {
            get { return GetPropertyValue("HandleOffsetX", 0); }
            set { SetPropertyValue("HandleOffsetX", value); }
        }

        [ExtenderControlProperty()]
        [DefaultValue(0)]
        public int HandleOffsetY {
            get { return GetPropertyValue("HandleOffsetY", 0); }
            set { SetPropertyValue("HandleOffsetY", value); }
        }

        [ExtenderControlProperty()]
        [DefaultValue(0)]
        public int MinimumWidth {
            get { return GetPropertyValue("MinimumWidth", 0); }
            set { SetPropertyValue("MinimumWidth", value); }
        }

        [ExtenderControlProperty()]
        [DefaultValue(0)]
        public int MinimumHeight {
            get { return GetPropertyValue("MinimumHeight", 0); }
            set { SetPropertyValue("MinimumHeight", value); }
        }

        [ExtenderControlProperty()]
        [DefaultValue(MaximumValue)]
        public int MaximumWidth {
            get { return GetPropertyValue("MaximumWidth", MaximumValue); }
            set { SetPropertyValue("MaximumWidth", value); }
        }

        [ExtenderControlProperty()]
        [DefaultValue(MaximumValue)]
        public int MaximumHeight {
            get { return GetPropertyValue("MaximumHeight", MaximumValue); }
            set { SetPropertyValue("MaximumHeight", value); }
        }

        // Note: onresize isn't a behavior property, it's a behavior event.
        // It's specified as a property here so that ExtenderBase and the
        // Visual Studio designer will expose it to the user and write it
        // to the xml-script so that ASP.NET AJAX will hook up the event
        // properly.
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [ClientPropertyName("resize")]
        public string OnClientResize {
            get { return GetPropertyValue("OnClientResize", String.Empty); }
            set { SetPropertyValue("OnClientResize", value); }
        }

        // See above note for onresize
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [ClientPropertyName("resizing")]
        public string OnClientResizing {
            get { return GetPropertyValue("OnClientResizing", String.Empty); }
            set { SetPropertyValue("OnClientResizing", value); }
        }

        // See above note for onresize
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [ClientPropertyName("resizebegin")]
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

        // This Size property is available for use on the server via code-behind.
        // There is a corresponding Size property available for use on the client
        // via script
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
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
