

using System;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.Drawing.Design;

#region Assembly Resource Attribute
[assembly: System.Web.UI.WebResource("NumericUpDown.NumericUpDownBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("NumericUpDown.NumericUpDownBehavior.debug.js", "text/javascript")]
#endregion

namespace AjaxControlToolkit
{
    [Designer("AjaxControlToolkit.NumericUpDownDesigner, AjaxControlToolkit")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.NumericUpDownBehavior", "NumericUpDown.NumericUpDownBehavior.js")]
    [TargetControlType(typeof(TextBox))]
    [System.Drawing.ToolboxBitmap(typeof(NumericUpDownExtender), "NumericUpDown.NumericUpDown.ico")]
    public class NumericUpDownExtender : ExtenderControlBase
    {
        /// <summary>
        /// Control to Up
        /// </summary>
        [IDReferenceProperty(typeof(Control))]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        [ExtenderControlProperty()]
        public string TargetButtonUpID
        {
            get
            {
                return GetPropertyValue("TargetButtonUpID", "");
            }
            set
            {
                SetPropertyValue("TargetButtonUpID", value);
            }
        }

        /// <summary>
        /// Control to Down
        /// </summary>
        [IDReferenceProperty(typeof(Control))]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        [ExtenderControlProperty()]
        public string TargetButtonDownID
        {
            get
            {
                return GetPropertyValue("TargetButtonDownID", "");
            }
            set
            {
                SetPropertyValue("TargetButtonDownID", value);
            }
        }

        /// <summary>
        /// Path to the helper web service
        /// </summary>
        [TypeConverter(typeof(ServicePathConverter))]
        [UrlProperty()]
        [Editor("System.Web.UI.Design.UrlEditor", typeof(UITypeEditor))]
        [ExtenderControlProperty()]
        public string ServiceUpPath
        {
            get
            {
                return GetPropertyValue("ServiceUpPath", "");
            }
            set
            {
                SetPropertyValue("ServiceUpPath", value);
            }
        }

        private bool ShouldSerializeServiceUpPath() {
            return !string.IsNullOrEmpty(ServiceUpMethod);
        }

        /// <summary>
        /// Method to the helper web service
        /// </summary>
        [ExtenderControlProperty()]
        public string ServiceUpMethod
        {
            get
            {
                return GetPropertyValue("ServiceUpMethod", "");
            }
            set
            {
                SetPropertyValue("ServiceUpMethod", value);
            }
        }

        /// <summary>
        /// Path to the helper web service
        /// </summary>
        [TypeConverter(typeof(ServicePathConverter))]
        [UrlProperty()]
        [Editor("System.Web.UI.Design.UrlEditor", typeof(UITypeEditor))]
        [ExtenderControlProperty()]
        public string ServiceDownPath
        {
            get
            {
                return GetPropertyValue("ServiceDownPath", "");
            }
            set
            {
                SetPropertyValue("ServiceDownPath", value);
            }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        private bool ShouldSerializeServieDownPath() {
            return !string.IsNullOrEmpty(ServiceDownMethod);
        }

        /// <summary>
        /// Method to the helper web service
        /// </summary>
        [ExtenderControlProperty()]
        public string ServiceDownMethod
        {
            get
            {
                return GetPropertyValue("ServiceDownMethod", "");
            }
            set
            {
                SetPropertyValue("ServiceDownMethod", value);
            }
        }


        /// <summary>
        /// Step used for simple numeric incrementing and decrementing
        /// </summary>
        [DefaultValue(1.0)]
        [ExtenderControlProperty]
        public double Step
        {
            get { return GetPropertyValue("Step", 1.0); }
            set { SetPropertyValue("Step", value); }
        }
        
        /// <summary>
        /// Minimum Value
        /// </summary>
        [ExtenderControlProperty]
        public double Minimum
        {
            get { return GetPropertyValue("Minimum", double.MinValue); }
            set { SetPropertyValue("Minimum", value); }
        }

        /// <summary>
        /// Maximum Value
        /// </summary>
        [ExtenderControlProperty]
        public double Maximum
        {
            get { return GetPropertyValue("Maximum", double.MaxValue); }
            set { SetPropertyValue("Maximum", value); }
        }

        /// <summary>
        /// List for RefValue
        /// </summary>
        [Editor("System.ComponentModel.Design.MultilineStringEditor", typeof(UITypeEditor))]
        [ExtenderControlProperty()]
        public string RefValues
        {
            get
            {
                return GetPropertyValue("RefValues", "");
            }
            set
            {
                SetPropertyValue("RefValues", value);
            }
        }
        /// <summary>
        /// TextBox + Button Width 
        /// </summary>
        [RequiredProperty()]
        [ExtenderControlProperty()]
        public int Width
        {
            get
            {
                return GetPropertyValue("Width", 0);
            }
            set
            {
                SetPropertyValue("Width", value);
            }
        }

        /// <summary>
        /// Custom parameter for call WebService method
        /// </summary>
        [ExtenderControlProperty()]
        public string Tag
        {
            get
            {
                return GetPropertyValue("Tag", "");
            }
            set
            {
                SetPropertyValue("Tag", value);
            }
        }
    }
}
