

using System;

namespace AjaxControlToolkit
{
    /// <summary>
    /// Allows the mapping of a property declared in managed code to a property
    /// declared in client script.  For example, if the client script property is named "handle" and you
    /// prefer the name on the TargetProperties object to be "Handle", you would apply this attribute with the value "handle."
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class ClientPropertyNameAttribute : Attribute
    {
        private string _propertyName;

        public ClientPropertyNameAttribute()
        {
        }

        /// <summary>
        /// Creates an instance of the ClientPropertyNameAttribute and initializes
        /// the PropertyName value.
        /// </summary>
        /// <param name="propertyName">The name of the property in client script that you wish to map to.</param>
        public ClientPropertyNameAttribute(string propertyName)
        {
            _propertyName = propertyName;
        }

        /// <summary>
        /// The name of the property in client script code that you wish to map to.
        /// </summary>
        public string PropertyName
        {
            get { return _propertyName; }
        }

        public override bool IsDefaultAttribute()
        {
            return string.IsNullOrEmpty(PropertyName);
        }
    }
}
