using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Design;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    [Designer(typeof(NumericUpDownExtenderDesigner))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientCssResource(Constants.NumericUpDownName)]
    [ClientScriptResource("Sys.Extended.UI.NumericUpDownBehavior", Constants.NumericUpDownName)]
    [TargetControlType(typeof(TextBox))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.NumericUpDownName + Constants.IconPostfix)]
    public class NumericUpDownExtender : ExtenderControlBase {
        /// <summary>
        /// Reference to custom Up button.
        /// </summary>
        [IDReferenceProperty(typeof(Control))]
        [ExtenderControlProperty()]
        [ClientPropertyName("targetButtonUpID")]
        public string TargetButtonUpID {
            get { return GetPropertyValue("TargetButtonUpID", ""); }
            set { SetPropertyValue("TargetButtonUpID", value); }
        }

        /// <summary>
        /// Reference to custom Down button.
        /// </summary>
        [IDReferenceProperty(typeof(Control))]
        [ExtenderControlProperty()]
        [ClientPropertyName("targetButtonDownID")]
        public string TargetButtonDownID {
            get { return GetPropertyValue("TargetButtonDownID", ""); }
            set { SetPropertyValue("TargetButtonDownID", value); }
        }

        /// <summary>
        /// Path to a web service that returns the data used to get the next value.
        /// </summary>
        /// <remarks>
        /// This property should be left null if ServiceUpMethod or ServiceDownMethod refers
        /// to a page method. The web service should be decorated with the
        /// System.Web.Script.Services.ScriptService attribute.
        /// </remarks>
        [TypeConverter(typeof(ServicePathConverter))]
        [UrlProperty()]
        [Editor("System.Web.UI.Design.UrlEditor", typeof(UITypeEditor))]
        [ExtenderControlProperty()]
        [ClientPropertyName("serviceUpPath")]
        public string ServiceUpPath {
            get { return GetPropertyValue("ServiceUpPath", ""); }
            set { SetPropertyValue("ServiceUpPath", value); }
        }

        bool ShouldSerializeServiceUpPath() {
            return !String.IsNullOrEmpty(ServiceUpMethod);
        }

        /// <summary>
        /// Web service method that returns the data used to get the next value,
        /// or the name of a method declared on the Page which is decorated with the WebMethodAttribute.
        /// </summary>
        /// <remarks>
        /// The signature of this method must match the following:
        /// ..[System.Web.Services.WebMethod]
        /// ..[System.Web.Script.Services.ScriptMethod]
        /// ..public int NextValue(int current, string tag) { ... }
        /// </remarks>
        [ExtenderControlProperty()]
        [ClientPropertyName("serviceUpMethod")]
        public string ServiceUpMethod {
            get { return GetPropertyValue("ServiceUpMethod", ""); }
            set { SetPropertyValue("ServiceUpMethod", value); }
        }

        /// <summary>
        /// Path to a web service that returns the data used to get the previous value.
        /// </summary>
        /// <remarks>
        /// This property should be left null if ServiceUpMethod or ServiceDownMethod refers
        /// to a page method. The web service should be decorated with the
        /// System.Web.Script.Services.ScriptService attribute.
        /// </remarks>
        [TypeConverter(typeof(ServicePathConverter))]
        [UrlProperty()]
        [Editor("System.Web.UI.Design.UrlEditor", typeof(UITypeEditor))]
        [ExtenderControlProperty()]
        [ClientPropertyName("serviceDownPath")]
        public string ServiceDownPath {
            get { return GetPropertyValue("ServiceDownPath", ""); }
            set { SetPropertyValue("ServiceDownPath", value); }
        }

        bool ShouldSerializeServieDownPath() {
            return !String.IsNullOrEmpty(ServiceDownMethod);
        }

        /// <summary>
        /// Web service method that returns the data used to get the previous value,
        /// or the name of a method declared on the Page which is decorated with the WebMethodAttribute.
        /// </summary>
        /// <remarks>
        /// The signature of this method must match the following:
        /// ..[System.Web.Services.WebMethod]
        /// ..[System.Web.Script.Services.ScriptMethod]
        /// ..public int NextValue(int current, string tag) { ... }
        /// </remarks>
        [ExtenderControlProperty()]
        [ClientPropertyName("serviceDownMethod")]
        public string ServiceDownMethod {
            get { return GetPropertyValue("ServiceDownMethod", ""); }
            set { SetPropertyValue("ServiceDownMethod", value); }
        }

        /// <summary>
        /// Step used for simple numeric incrementing and decrementing.
        /// </summary>
        /// <remarks>
        /// The default value is 1.
        /// </remarks>
        [DefaultValue(1.0)]
        [ExtenderControlProperty]
        [ClientPropertyName("step")]
        public double Step {
            get { return GetPropertyValue("Step", 1.0); }
            set { SetPropertyValue("Step", value); }
        }

        /// <summary>
        /// The minimum value allowed by the extender.
        /// </summary>
        /// <remarks>
        /// Currently, it does not prevent out of range values from being entered
        /// into the textbox even if Minimum or Maximum are specified on the extender,
        /// but using the up/down buttons should bring the value into the allowed range when clicked.
        /// </remarks>
        [ExtenderControlProperty]
        [ClientPropertyName("minimum")]
        public double Minimum {
            get { return GetPropertyValue("Minimum", double.MinValue); }
            set { SetPropertyValue("Minimum", value); }
        }

        /// <summary>
        /// The maximum value allowed by the extender.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("maximum")]
        public double Maximum {
            get { return GetPropertyValue("Maximum", double.MaxValue); }
            set { SetPropertyValue("Maximum", value); }
        }

        /// <summary>
        /// A list of strings separated by semicolons (;) to be used as an enumeration by NumericUpDown.
        /// </summary>
        [Editor("System.ComponentModel.Design.MultilineStringEditor", typeof(UITypeEditor))]
        [ExtenderControlProperty()]
        [ClientPropertyName("refValues")]
        public string RefValues {
            get { return GetPropertyValue("RefValues", ""); }
            set { SetPropertyValue("RefValues", value); }
        }

        /// <summary>
        /// Combined size of the TextBox and Up/Down buttons (min value 25).
        /// </summary>
        /// <remarks>
        /// This property is not used if you provide custom buttons.
        /// </remarks>
        [RequiredProperty()]
        [ExtenderControlProperty()]
        [ClientPropertyName("width")]
        public int Width {
            get { return GetPropertyValue("Width", 0); }
            set { SetPropertyValue("Width", value); }
        }

        /// <summary>
        /// Custom parameter for call WebService method.
        /// </summary>
        [ExtenderControlProperty()]
        [ClientPropertyName("tag")]
        public string Tag {
            get { return GetPropertyValue("Tag", ""); }
            set { SetPropertyValue("Tag", value); }
        }
    }

}
