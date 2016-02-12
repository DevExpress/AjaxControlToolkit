#pragma warning disable 1591
using System;

namespace AjaxControlToolkit.Design {

    // The PageMethodSignature attribute is used by Designer classes for Toolkit
    // components that include web services.  It decorates a delegate that describes
    // the signature of the web method.  The ExtenderControlBaseDesigner will
    // automatically add a DesignerActionItem for each of the page methods on the
    // component.
    [AttributeUsage(AttributeTargets.Delegate, AllowMultiple = false, Inherited = true)]
    public sealed class PageMethodSignatureAttribute : Attribute {
        // Friendly name of the page method displayed in the designer
        public string FriendlyName {
            get { return _friendlyName; }
        }
        private string _friendlyName;

        // Name of the ServicePath property (to verify that the component isn't
        // using a non-page method)
        public string ServicePathProperty {
            get { return _servicePathProperty; }
        }
        private string _servicePathProperty;

        // Name of the ServiceMethod property which will be used to set the name
        // of the page method, or navigate/repair an existing page method
        public string ServiceMethodProperty {
            get { return _serviceMethodProperty; }
        }
        private string _serviceMethodProperty;

        // Name of the UseContextKey property (which will be set to true if
        // specified).  The corresponding contextKey parameter should be included
        // with the signature but will not be set on the extender.        
        // A few components in the Toolkit have an optional second signature
        // to support using a ContextKey property.  Ideally they would have had
        // the ContextKey property from the beginning, but we didn't want to
        // break existing customers.  This should not be used by most components.
        public string UseContextKeyProperty {
            get { return _useContextKeyProperty; }
        }
        private string _useContextKeyProperty;

        // Whether the UseContextKeyProperty has been specified
        public bool IncludeContextParameter {
            get { return !string.IsNullOrEmpty(_useContextKeyProperty); }
        }

        public PageMethodSignatureAttribute(string friendlyName, string servicePathProperty, string serviceMethodProperty)
            : this(friendlyName, servicePathProperty, serviceMethodProperty, null) {
        }

        public PageMethodSignatureAttribute(string friendlyName, string servicePathProperty, string serviceMethodProperty, string useContextKeyProperty) {
            _friendlyName = friendlyName;
            _servicePathProperty = servicePathProperty;
            _serviceMethodProperty = serviceMethodProperty;
            _useContextKeyProperty = useContextKeyProperty;
        }
    }
}
#pragma warning restore 1591