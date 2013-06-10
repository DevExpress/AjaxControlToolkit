

using System;
using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit
{
    /// <summary>
    /// Base class that provides DynamicPopulate support to multiple extenders
    /// </summary>
    [RequiredScript(typeof(DynamicPopulateExtender))]
    public abstract class DynamicPopulateExtenderControlBase : AnimationExtenderControlBase
    {
        /// <summary>
        /// ID of the control to dynamically populate
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("dynamicControlID")]
        [DefaultValue("")]
        [IDReferenceProperty(typeof(WebControl))]
        [Category("Behavior")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string DynamicControlID
        {
            get { return GetPropertyValue("DynamicControlID", ""); }
            set { SetPropertyValue("DynamicControlID", value); }
        }

        /// <summary>
        /// An arbitrary string value to be passed to the dynamic populate web method.  For example,
        /// if the element to be populated is within a data-bound repeater, this could be the ID of
        /// the current row. 
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("dynamicContextKey")]
        [DefaultValue("")]
        [Category("Behavior")]
        public string DynamicContextKey
        {
            get { return GetPropertyValue("DynamicContextKey", ""); }
            set { SetPropertyValue("DynamicContextKey", value); }
        }

        /// <summary>
        /// The URL of the web service to call. Leave this parameter blank and specify a
        /// ServiceMethod to call a PageMethod.  The web service should be decorated with the
        /// System.Web.Script.Services.ScriptService attribute.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("dynamicServicePath")]
        [UrlProperty]
        [TypeConverter(typeof(ServicePathConverter))]
        [Category("Behavior")]
        public string DynamicServicePath
        {
            get { return GetPropertyValue("DynamicServicePath", ""); }
            set { SetPropertyValue("DynamicServicePath", value); }
        }

        /// <summary>
        /// Prevent serialization of the service path if no ServiceMethod was supplied
        /// </summary>
        /// <returns>Whether or not the service path should be serialized</returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        private bool ShouldSerializeServicePath()
        {
            return !string.IsNullOrEmpty(DynamicServiceMethod);
        }

        /// <summary>
        /// The name of the method to call on the page or web service.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("dynamicServiceMethod")]
        [DefaultValue("")]
        [Category("Behavior")]
        public string DynamicServiceMethod
        {
            get { return GetPropertyValue("DynamicServiceMethod", ""); }
            set { SetPropertyValue("DynamicServiceMethod", value); }
        }

        /// <summary>
        /// Whether the results of the dynamic population should be cached and
        /// not fetched again after the first load
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("cacheDynamicResults")]
        [DefaultValue(false)]
        [Category("Behavior")]
        public bool CacheDynamicResults
        {
            get { return GetPropertyValue<bool>("CacheDynamicResults", false); }
            set { SetPropertyValue<bool>("CacheDynamicResults", value); }
        }

        /// <summary>
        /// Ensure the properties have been set correctly
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        public override void EnsureValid()
        {
            base.EnsureValid();
            // If any properties are set, they must all be valid
            if (!string.IsNullOrEmpty(DynamicControlID) || !string.IsNullOrEmpty(DynamicContextKey) || !string.IsNullOrEmpty(DynamicServicePath) || !string.IsNullOrEmpty(DynamicServiceMethod))
            {
                if (string.IsNullOrEmpty(DynamicControlID))
                {
                    throw new ArgumentException("DynamicControlID must be set");
                }
                // DynamicContextKey optional
                // DynamicServicePath optional
                if (string.IsNullOrEmpty(DynamicServiceMethod))
                {
                    throw new ArgumentException("DynamicServiceMethod must be set");
                }
            }
        }
    }
}