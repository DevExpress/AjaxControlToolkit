#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    // Base class that provides DynamicPopulate support to multiple extenders
    [RequiredScript(typeof(DynamicPopulateExtender))]
    public abstract class DynamicPopulateExtenderControlBase : AnimationExtenderControlBase {

        [ExtenderControlProperty]
        [ClientPropertyName("dynamicControlID")]
        [DefaultValue("")]
        [IDReferenceProperty(typeof(WebControl))]
        [Category("Behavior")]
        public string DynamicControlID {
            get { return GetPropertyValue("DynamicControlID", String.Empty); }
            set { SetPropertyValue("DynamicControlID", value); }
        }

        // An arbitrary string value to be passed to the dynamic populate web method.  For example,
        // if the element to be populated is within a data-bound repeater, this could be the ID of
        // the current row. 
        [ExtenderControlProperty]
        [ClientPropertyName("dynamicContextKey")]
        [DefaultValue("")]
        [Category("Behavior")]
        public string DynamicContextKey {
            get { return GetPropertyValue("DynamicContextKey", String.Empty); }
            set { SetPropertyValue("DynamicContextKey", value); }
        }

        // The URL of the web service to call. Leave this parameter blank and specify a
        // ServiceMethod to call a PageMethod.  The web service should be decorated with the
        // System.Web.Script.Services.ScriptService attribute.
        [ExtenderControlProperty]
        [ClientPropertyName("dynamicServicePath")]
        [UrlProperty]
        [TypeConverter(typeof(ServicePathConverter))]
        [Category("Behavior")]
        public string DynamicServicePath {
            get { return GetPropertyValue("DynamicServicePath", String.Empty); }
            set { SetPropertyValue("DynamicServicePath", value); }
        }

        // Prevent serialization of the service path if no ServiceMethod was supplied
        bool ShouldSerializeServicePath() {
            return !String.IsNullOrEmpty(DynamicServiceMethod);
        }

        // The name of the method to call on the page or web service.
        [ExtenderControlProperty]
        [ClientPropertyName("dynamicServiceMethod")]
        [DefaultValue("")]
        [Category("Behavior")]
        public string DynamicServiceMethod {
            get { return GetPropertyValue("DynamicServiceMethod", String.Empty); }
            set { SetPropertyValue("DynamicServiceMethod", value); }
        }

        // Whether the results of the dynamic population should be cached and
        // not fetched again after the first load
        [ExtenderControlProperty]
        [ClientPropertyName("cacheDynamicResults")]
        [DefaultValue(false)]
        [Category("Behavior")]
        public bool CacheDynamicResults {
            get { return GetPropertyValue<bool>("CacheDynamicResults", false); }
            set { SetPropertyValue<bool>("CacheDynamicResults", value); }
        }

        public override void EnsureValid() {
            base.EnsureValid();
            // If any properties are set, they must all be valid
            if(!String.IsNullOrEmpty(DynamicControlID) || !String.IsNullOrEmpty(DynamicContextKey) || 
                !String.IsNullOrEmpty(DynamicServicePath) || !String.IsNullOrEmpty(DynamicServiceMethod)) {
                if(String.IsNullOrEmpty(DynamicControlID))
                    throw new ArgumentException("DynamicControlID must be set");

                // DynamicContextKey optional
                // DynamicServicePath optional
                if(String.IsNullOrEmpty(DynamicServiceMethod))
                    throw new ArgumentException("DynamicServiceMethod must be set");
            }
        }
    }

}

#pragma warning restore 1591