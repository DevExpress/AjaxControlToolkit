

using System;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.Drawing;
using System.Globalization;

[assembly: System.Web.UI.WebResource("ResizableControl.ResizableControlBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("ResizableControl.ResizableControlBehavior.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    [Designer("AjaxControlToolkit.ResizableControlDesigner, AjaxControlToolkit")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.ResizableControlBehavior", "ResizableControl.ResizableControlBehavior.js")]
    [TargetControlType(typeof(Control))]
    [System.Drawing.ToolboxBitmap(typeof(ResizableControlExtender), "ResizableControl.ResizableControl.ico")]
    public class ResizableControlExtender : ExtenderControlBase
    {
        private const int MaximumValue = 100000;

        public ResizableControlExtender()
        {
            EnableClientState = true;
        }

        [ExtenderControlProperty()]
        [DefaultValue("")]
        [RequiredProperty()]
        public string HandleCssClass
        {
            get
            {
                return GetPropertyValue("HandleCssClass", "");
            }
            set
            {
                SetPropertyValue("HandleCssClass", value);
            }
        }

        [ExtenderControlProperty()]
        [DefaultValue("")]
        public string ResizableCssClass
        {
            get
            {
                return GetPropertyValue("ResizableCssClass", "");
            }
            set
            {
                SetPropertyValue("ResizableCssClass", value);
            }
        }

        [ExtenderControlProperty()]
        [DefaultValue(0)]
        public int HandleOffsetX
        {
            get
            {
                return GetPropertyValue("HandleOffsetX", 0);
            }
            set
            {
                SetPropertyValue("HandleOffsetX", value);
            }
        }

        [ExtenderControlProperty()]
        [DefaultValue(0)]
        public int HandleOffsetY
        {
            get
            {
                return GetPropertyValue("HandleOffsetY", 0);
            }
            set
            {
                SetPropertyValue("HandleOffsetY", value);
            }
        }

        [ExtenderControlProperty()]
        [DefaultValue(0)]
        public int MinimumWidth
        {
            get
            {
                return GetPropertyValue("MinimumWidth", 0);
            }
            set
            {
                SetPropertyValue("MinimumWidth", value);
            }
        }

        [ExtenderControlProperty()]
        [DefaultValue(0)]
        public int MinimumHeight
        {
            get
            {
                return GetPropertyValue("MinimumHeight", 0);
            }
            set
            {
                SetPropertyValue("MinimumHeight", value);
            }
        }

        [ExtenderControlProperty()]
        [DefaultValue(MaximumValue)]
        public int MaximumWidth
        {
            get
            {
                return GetPropertyValue("MaximumWidth", MaximumValue);
            }
            set
            {
                SetPropertyValue("MaximumWidth", value);
            }
        }

        [ExtenderControlProperty()]
        [DefaultValue(MaximumValue)]
        public int MaximumHeight
        {
            get
            {
                return GetPropertyValue("MaximumHeight", MaximumValue);
            }
            set
            {
                SetPropertyValue("MaximumHeight", value);
            }
        }

        // Note: onresize isn't a behavior property, it's a behavior event.
        // It's specified as a property here so that ExtenderBase and the
        // Visual Studio designer will expose it to the user and write it
        // to the xml-script so that ASP.NET AJAX will hook up the event
        // properly.
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [ClientPropertyName("resize")]
        public string OnClientResize
        {
            get
            {
                return GetPropertyValue("OnClientResize", "");
            }
            set
            {
                SetPropertyValue("OnClientResize", value);
            }
        }

        // See above note for onresize
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [ClientPropertyName("resizing")]
        public string OnClientResizing
        {
            get
            {
                return GetPropertyValue("OnClientResizing", "");
            }
            set
            {
                SetPropertyValue("OnClientResizing", value);
            }
        }

        // See above note for onresize
        [ExtenderControlProperty()]
        [DefaultValue("")]
        [ClientPropertyName("resizebegin")]
        public string OnClientResizeBegin
        {
            get
            {
                return GetPropertyValue("OnClientResizeBegin", "");
            }
            set
            {
                SetPropertyValue("OnClientResizeBegin", value);
            }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        public override void EnsureValid()
        {
            base.EnsureValid();
            if (MaximumWidth < MinimumWidth)
            {
                throw new ArgumentException("Maximum width must not be less than minimum width");
            }
            if (MaximumHeight < MinimumHeight)
            {
                throw new ArgumentException("Maximum height must not be less than minimum height");
            }
        }

        // This Size property is available for use on the server via code-behind.
        // There is a corresponding Size property available for use on the client
        // via script
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Size Size
        {
            get
            {
                int width;
                int height;

                string[] clientStateArray = (ClientState ?? string.Empty).Split(',');

                if (clientStateArray.Length < 2 ||
                    string.IsNullOrEmpty(clientStateArray[0]) ||
                    string.IsNullOrEmpty(clientStateArray[1]) ||
                    !int.TryParse(clientStateArray[0], NumberStyles.Integer, CultureInfo.InvariantCulture, out width) ||
                    !int.TryParse(clientStateArray[1], NumberStyles.Integer, CultureInfo.InvariantCulture, out height))
                {
                    return Size.Empty;
                }
                else
                {
                    return new Size(width, height);
                }
            }
            set
            {
                ClientState = string.Format(CultureInfo.InvariantCulture, "{0},{1}", value.Width, value.Height);
            }
        }
    }
}
