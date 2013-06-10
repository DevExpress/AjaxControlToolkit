

using System;

namespace AjaxControlToolkit
{
    /// <summary>
    /// The presence of this attribute on a property of a subclass of
    /// TargetControlPropertiesBase indicates that the property value is
    /// required and the control can not be used without it. Absence of a
    /// required property value causes an exception to be thrown during
    /// creation of the control.
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class RequiredPropertyAttribute : Attribute
    {
        /// <summary>
        /// Constructs a new RequiredPropertyAttribute
        /// </summary>
        public RequiredPropertyAttribute()
        {
        }
    }
}
