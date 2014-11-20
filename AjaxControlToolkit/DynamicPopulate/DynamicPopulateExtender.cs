using AjaxControlToolkit.Design;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    [Designer(typeof(DynamicPopulateExtenderDesigner))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.DynamicPopulateBehavior", Constants.DynamicPopulateName)]
    [TargetControlType(typeof(WebControl))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.DynamicPopulateName + Constants.IconPostfix)]
    public class DynamicPopulateExtender : ExtenderControlBase {

        [DefaultValue(true)]
        [ExtenderControlProperty]
        [Category("Behavior")]
        public bool ClearContentsDuringUpdate {
            get { return GetPropertyValue("ClearContentsDuringUpdate", true); }
            set { SetPropertyValue("ClearContentsDuringUpdate", value); }
        }

        // An key that you can pass to the web service call, such as an ID.  This is optional.
        [DefaultValue("")]
        [ExtenderControlProperty]
        [Category("Behavior")]
        public string ContextKey {
            get { return GetPropertyValue("ContextKey", String.Empty); }
            set { SetPropertyValue("ContextKey", value); }
        }

        // The ID of a control to trigger the population of the target. The population will be triggered by this controls "click" event.
        [ExtenderControlProperty]
        [IDReferenceProperty(typeof(Control))]
        [ClientPropertyName("PopulateTriggerID")]
        [Category("Behavior")]
        public string PopulateTriggerControlID {
            get { return GetPropertyValue("PopulateTriggerControlID", String.Empty); }
            set { SetPropertyValue("PopulateTriggerControlID", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue("")]
        [Category("Behavior")]
        public string ServiceMethod {
            get { return GetPropertyValue("ServiceMethod", String.Empty); }
            set {
                if(!String.IsNullOrEmpty(CustomScript)) {
                    throw new InvalidOperationException("ServiceMethod can not be set if a CustomScript is set.");
                }
                SetPropertyValue("ServiceMethod", value);
            }
        }

        // The path of the web service to call, or if this is blank, a page method will be called instead.
        [ExtenderControlProperty]
        [UrlProperty]
        [TypeConverter(typeof(ServicePathConverter))]
        [Category("Behavior")]
        public string ServicePath {
            get { return GetPropertyValue("ServicePath", String.Empty); }
            set { SetPropertyValue("ServicePath", value); }
        }

        bool ShouldSerializeServicePath() {
            return !String.IsNullOrEmpty(ServiceMethod);
        }

        [ExtenderControlProperty]
        [DefaultValue("")]
        [Category("Behavior")]
        public string UpdatingCssClass {
            get { return GetPropertyValue("UpdatingCss", String.Empty); }
            set { SetPropertyValue("UpdatingCss", value); }
        }

        // A CustomScript can be used to eval a javascript function that will return a string to populate the control.
        // This script method must return a string and will be called instead of the Service or Page method.
        [ExtenderControlProperty]
        [DefaultValue("")]
        [Category("Behavior")]
        public string CustomScript {
            get { return GetPropertyValue("CustomScript", String.Empty); }
            set {
                if(!String.IsNullOrEmpty(ServiceMethod)) {
                    throw new InvalidOperationException("CustomScript can not be set if a ServiceMethod is set.");
                }
                SetPropertyValue("CustomScript", value);
            }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("cacheDynamicResults")]
        [DefaultValue(false)]
        [Category("Behavior")]
        public bool CacheDynamicResults {
            get { return GetPropertyValue<bool>("CacheDynamicResults", false); }
            set { SetPropertyValue<bool>("CacheDynamicResults", value); }
        }

        // Check if the properties have been set correctly
        protected override bool CheckIfValid(bool throwException) {
            if(String.IsNullOrEmpty(CustomScript) && String.IsNullOrEmpty(ServiceMethod)) {
                if(throwException)
                    throw new InvalidOperationException("CustomScript or ServiceMethod must be set.");
                return false;
            }
            return base.CheckIfValid(throwException);
        }
    }

}