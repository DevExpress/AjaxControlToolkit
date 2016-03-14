#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// DynamicPopulate is an extender that replaces the control content with the result of the Web service or a page method call.
    /// </summary>
    [Designer(typeof(DynamicPopulateExtenderDesigner))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.DynamicPopulateBehavior", Constants.DynamicPopulateName)]
    [TargetControlType(typeof(WebControl))]
    [TargetControlType(typeof(HtmlControl))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.DynamicPopulateName + Constants.IconPostfix)]
    public class DynamicPopulateExtender : ExtenderControlBase {

        /// <summary>
        /// Determines if HTML content of a target element should be cleared when the update begins.
        /// </summary>
        [DefaultValue(true)]
        [ExtenderControlProperty]
        [Category("Behavior")]
        [ClientPropertyName("clearContentsDuringUpdate")]
        public bool ClearContentsDuringUpdate {
            get { return GetPropertyValue("ClearContentsDuringUpdate", true); }
            set { SetPropertyValue("ClearContentsDuringUpdate", value); }
        }

        /// <summary>
        /// A key that you can pass to the Web service call, such as an ID. This is optional.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [Category("Behavior")]
        [ClientPropertyName("contextKey")]
        public string ContextKey {
            get { return GetPropertyValue("ContextKey", String.Empty); }
            set { SetPropertyValue("ContextKey", value); }
        }

        /// <summary>
        /// A control's ID to trigger the target population. The population will be triggered by this control's Click event.
        /// </summary>
        [ExtenderControlProperty]
        [IDReferenceProperty(typeof(Control))]
        [ClientPropertyName("populateTriggerID")]
        [Category("Behavior")]
        public string PopulateTriggerControlID {
            get { return GetPropertyValue("PopulateTriggerControlID", String.Empty); }
            set { SetPropertyValue("PopulateTriggerControlID", value); }
        }

        /// <summary>
        /// A name of a Web service or page method to call
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [Category("Behavior")]
        [ClientPropertyName("serviceMethod")]
        public string ServiceMethod {
            get { return GetPropertyValue("ServiceMethod", String.Empty); }
            set {
                if(!String.IsNullOrEmpty(CustomScript)) {
                    throw new InvalidOperationException("ServiceMethod can not be set if a CustomScript is set.");
                }
                SetPropertyValue("ServiceMethod", value);
            }
        }

        /// <summary>
        /// A path of the web service to call. If it is blank, a page method will be called instead.
        /// </summary>
        [ExtenderControlProperty]
        [UrlProperty]
        [TypeConverter(typeof(ServicePathConverter))]
        [Category("Behavior")]
        [ClientPropertyName("servicePath")]
        public string ServicePath {
            get { return GetPropertyValue("ServicePath", String.Empty); }
            set { SetPropertyValue("ServicePath", value); }
        }

        bool ShouldSerializeServicePath() {
            return !String.IsNullOrEmpty(ServiceMethod);
        }

        /// <summary>
        /// A CSS style to apply while the update is in progress
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [Category("Behavior")]
        [ClientPropertyName("updatingCssClass")]
        public string UpdatingCssClass {
            get { return GetPropertyValue("UpdatingCss", String.Empty); }
            set { SetPropertyValue("UpdatingCss", value); }
        }

        /// <summary>
        /// CustomScript can be used to evaluate a JavaScript function that will return a string to populate the control.
        /// This script method must return a string and will be called instead of the Service or Page method.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [Category("Behavior")]
        [ClientPropertyName("customScript")]
        public string CustomScript {
            get { return GetPropertyValue("CustomScript", String.Empty); }
            set {
                if(!String.IsNullOrEmpty(ServiceMethod)) {
                    throw new InvalidOperationException("CustomScript can not be set if a ServiceMethod is set.");
                }
                SetPropertyValue("CustomScript", value);
            }
        }

        /// <summary>
        /// Determines if the dynamic population result should be cached and not fetched again after the first load.
        /// The default is false
        /// </summary>
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
#pragma warning restore 1591