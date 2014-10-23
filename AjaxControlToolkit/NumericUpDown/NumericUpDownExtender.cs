using System;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Design;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    [Designer("AjaxControlToolkit.Design.NumericUpDownExtenderDesigner, AjaxControlToolkit")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.NumericUpDownBehavior", Constants.NumericUpDownName)]
    [TargetControlType(typeof(TextBox))]
    [ToolboxBitmap(typeof(NumericUpDownExtender), "NumericUpDown.ico")]
    public class NumericUpDownExtender : ExtenderControlBase {
        // Control to Up
        [IDReferenceProperty(typeof(Control))]
        [ExtenderControlProperty()]
        public string TargetButtonUpID {
            get { return GetPropertyValue("TargetButtonUpID", ""); }
            set { SetPropertyValue("TargetButtonUpID", value); }
        }

        // Control to Down
        [IDReferenceProperty(typeof(Control))]
        [ExtenderControlProperty()]
        public string TargetButtonDownID {
            get { return GetPropertyValue("TargetButtonDownID", ""); }
            set { SetPropertyValue("TargetButtonDownID", value); }
        }

        // Path to the helper web service
        [TypeConverter(typeof(ServicePathConverter))]
        [UrlProperty()]
        [Editor("System.Web.UI.Design.UrlEditor", typeof(UITypeEditor))]
        [ExtenderControlProperty()]
        public string ServiceUpPath {
            get { return GetPropertyValue("ServiceUpPath", ""); }
            set { SetPropertyValue("ServiceUpPath", value); }
        }

        bool ShouldSerializeServiceUpPath() {
            return !String.IsNullOrEmpty(ServiceUpMethod);
        }

        // Method to the helper web service
        [ExtenderControlProperty()]
        public string ServiceUpMethod {
            get { return GetPropertyValue("ServiceUpMethod", ""); }
            set { SetPropertyValue("ServiceUpMethod", value); }
        }

        // Path to the helper web service
        [TypeConverter(typeof(ServicePathConverter))]
        [UrlProperty()]
        [Editor("System.Web.UI.Design.UrlEditor", typeof(UITypeEditor))]
        [ExtenderControlProperty()]
        public string ServiceDownPath {
            get { return GetPropertyValue("ServiceDownPath", ""); }
            set { SetPropertyValue("ServiceDownPath", value); }
        }

        bool ShouldSerializeServieDownPath() {
            return !String.IsNullOrEmpty(ServiceDownMethod);
        }

        // Method to the helper web service
        [ExtenderControlProperty()]
        public string ServiceDownMethod {
            get { return GetPropertyValue("ServiceDownMethod", ""); }
            set { SetPropertyValue("ServiceDownMethod", value); }
        }

        // Step used for simple numeric incrementing and decrementing
        [DefaultValue(1.0)]
        [ExtenderControlProperty]
        public double Step {
            get { return GetPropertyValue("Step", 1.0); }
            set { SetPropertyValue("Step", value); }
        }

        [ExtenderControlProperty]
        public double Minimum {
            get { return GetPropertyValue("Minimum", double.MinValue); }
            set { SetPropertyValue("Minimum", value); }
        }

        [ExtenderControlProperty]
        public double Maximum {
            get { return GetPropertyValue("Maximum", double.MaxValue); }
            set { SetPropertyValue("Maximum", value); }
        }

        // List for RefValue
        [Editor("System.ComponentModel.Design.MultilineStringEditor", typeof(UITypeEditor))]
        [ExtenderControlProperty()]
        public string RefValues {
            get { return GetPropertyValue("RefValues", ""); }
            set { SetPropertyValue("RefValues", value); }
        }

        // TextBox + Button Width 
        [RequiredProperty()]
        [ExtenderControlProperty()]
        public int Width {
            get { return GetPropertyValue("Width", 0); }
            set { SetPropertyValue("Width", value); }
        }

        // Custom parameter for call WebService method
        [ExtenderControlProperty()]
        public string Tag {
            get { return GetPropertyValue("Tag", ""); }
            set { SetPropertyValue("Tag", value); }
        }
    }

}
