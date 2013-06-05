

using System;
using System.ComponentModel;
using System.Web.UI;

[assembly: System.Web.UI.WebResource("DynamicPopulate.DynamicPopulateBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("DynamicPopulate.DynamicPopulateBehavior.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    /// <summary>
    /// This extender allows you to dynamically populate the innerHTML of a control based on a 
    /// web service callback.
    /// </summary>
    [Designer("AjaxControlToolkit.DynamicPopulateDesigner, AjaxControlToolkit")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.DynamicPopulateBehavior", "DynamicPopulate.DynamicPopulateBehavior.js")]
    [TargetControlType(typeof(Control))]
    [System.Drawing.ToolboxBitmap(typeof(DynamicPopulateExtender), "DynamicPopulate.DynamicPopulate.ico")]
    public class DynamicPopulateExtender : ExtenderControlBase
    {
        /// <summary>
        /// Whether or not we should clear the HTML contents of the
        /// target element when an update begins
        /// </summary>
        [DefaultValue(true)]
        [ExtenderControlProperty]
        [Category("Behavior")]
        public bool ClearContentsDuringUpdate
        {
            get { return GetPropertyValue("ClearContentsDuringUpdate", true); }
            set { SetPropertyValue("ClearContentsDuringUpdate", value); }
        }

        /// <summary>
        /// An key that you can pass to the web service call, such as an ID.  This is optional.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [Category("Behavior")]
        public string ContextKey
        {
            get { return GetPropertyValue("ContextKey", ""); }
            set { SetPropertyValue("ContextKey", value); }
        }

        /// <summary>
        /// The ID of a control to trigger the population of the target.  The population will
        /// be triggered by this controls "click" event.
        /// </summary>
        [ExtenderControlProperty]
        [IDReferenceProperty(typeof(Control))]
        [ClientPropertyName("PopulateTriggerID")]
        [Category("Behavior")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string PopulateTriggerControlID
        {
            get { return GetPropertyValue("PopulateTriggerControlID", ""); }
            set { SetPropertyValue("PopulateTriggerControlID", value); }
        }

        /// <summary>
        /// The method name of the web service of page method to call.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [Category("Behavior")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        public string ServiceMethod
        {
            get { return GetPropertyValue("ServiceMethod", ""); }
            set
            {
                if (!string.IsNullOrEmpty(CustomScript))
                {
                    throw new InvalidOperationException("ServiceMethod can not be set if a CustomScript is set.");
                }
                SetPropertyValue("ServiceMethod", value);
            }
        }

        /// <summary>
        /// The path of the web service to call, or if this is blank, a page method will be
        /// called instead.
        /// </summary>        
        [ExtenderControlProperty]
        [UrlProperty]
        [TypeConverter(typeof(ServicePathConverter))]
        [Category("Behavior")]
        public string ServicePath
        {
            get { return GetPropertyValue("ServicePath", ""); }
            set { SetPropertyValue("ServicePath", value); }
        }

        /// <summary>
        /// Prevent serialization of the service path if no ServiceMethod was supplied
        /// </summary>
        /// <returns>Whether or not the service path should be serialized</returns>
        private bool ShouldSerializeServicePath()
        {
            return !string.IsNullOrEmpty(ServiceMethod);
        }

        /// <summary>
        /// A CSS style to apply while the update is in progress
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [Category("Behavior")]
        public string UpdatingCssClass
        {
            get { return GetPropertyValue("UpdatingCss", ""); }
            set { SetPropertyValue("UpdatingCss", value); }
        }

        /// <summary>
        /// A CustomScript can be used to eval a javascript function that will return a string to populate the control.  This script method
        /// must return a string and will be called instead of the Service or Page method.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [Category("Behavior")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        public string CustomScript
        {
            get { return GetPropertyValue("CustomScript", ""); }
            set
            {
                if (!string.IsNullOrEmpty(ServiceMethod))
                {
                    throw new InvalidOperationException("CustomScript can not be set if a ServiceMethod is set.");
                }
                SetPropertyValue("CustomScript", value);
            }
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
        /// Check if the properties have been set correctly
        /// </summary>
        /// <param name="throwException">Whether exceptions should be thrown on violations</param>
        /// <returns>True if the properties have been set correctly, false if not</returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        protected override bool CheckIfValid(bool throwException)
        {
            if (string.IsNullOrEmpty(CustomScript) && string.IsNullOrEmpty(ServiceMethod))
            {
                if (throwException)
                {
                    throw new InvalidOperationException("CustomScript or ServiceMethod must be set.");
                }
                return false;
            }
            return base.CheckIfValid(throwException);
        }
    }
}