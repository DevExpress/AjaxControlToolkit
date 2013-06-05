


using System;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Reflection;
using AjaxControlToolkit;

namespace AjaxControlToolkit.Design {

    // we use this as a marker to see which properties we've hidden versus
    // ones the developer wants hidden.
    //
    internal sealed class ExtenderVisiblePropertyAttribute : Attribute {
        private bool _value; // = false;

        public static ExtenderVisiblePropertyAttribute Yes = new ExtenderVisiblePropertyAttribute(true);
        public static ExtenderVisiblePropertyAttribute No = new ExtenderVisiblePropertyAttribute(false);
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields", Justification = "Exposing this for user convenience")]
        public static ExtenderVisiblePropertyAttribute Default = No;

        public ExtenderVisiblePropertyAttribute(bool value) {
            _value = value;
        }

        public bool Value {
            get {
                return _value;
            }
        }

        public override bool IsDefaultAttribute() {
            return !_value;
        }        
    }

    internal class ExtenderPropertiesTypeDescriptor : ExpandableObjectConverter {
        public override object ConvertTo(ITypeDescriptorContext context, CultureInfo culture, object value, Type destinationType) {

            if (destinationType == typeof(string)) {
                return ""; // we don't want any text for the extender expandable node
            }
            return base.ConvertTo(context, culture, value, destinationType);
        }
    }

    /// <summary>
    /// This class allows us to selectively hide properties on an object
    /// from the property browser, as well as to delay supplying a target until it's 
    /// called for.  This allows us to create the properties object on-demand rather than
    /// needing it up front.
    ///        
    /// </summary>
    ///         
    internal class ExtenderPropertiesProxy : ICustomTypeDescriptor {
        private object _target;
        private string[] _propsToHide;

        private object Target {
            get {
                return this._target;
            }
        }

        public ExtenderPropertiesProxy(object target, params string[] propsToHide) {
            _target = target;
            _propsToHide = propsToHide;
        }

        PropertyDescriptorCollection ICustomTypeDescriptor.GetProperties(Attribute[] attributes) {

            // we'll walk the extenders properties looking for the ones marked as ExtenderControl properties.
            // for those, we'll make them visible, then add them to the list.
            //

            PropertyDescriptorCollection propCollection = TypeDescriptor.GetProperties(this.Target); 

            if (_propsToHide != null && _propsToHide.Length > 0) {
                List<PropertyDescriptor> props = new List<PropertyDescriptor>();

                for (int i = 0; i < propCollection.Count; i++) {
                    PropertyDescriptor prop = propCollection[i];

                    ExtenderControlPropertyAttribute extenderPropAttr = (ExtenderControlPropertyAttribute)prop.Attributes[typeof(ExtenderControlPropertyAttribute)];

                    if (extenderPropAttr == null) {
                        continue;
                    }

                    ExtenderVisiblePropertyAttribute evpa = (ExtenderVisiblePropertyAttribute)prop.Attributes[typeof(ExtenderVisiblePropertyAttribute)];

                    if (evpa == null || !evpa.Value) {
                        // if there isn't an ExtenderVisiblePropertyAttribute on here (the designer adds this),
                        // then we shouldn't process it.  Usually this means the developer marked it as Browsable.False.
                        //
                        continue;
                    }

                    // if the name is in the list, remove browsable from the name.
                    //
                    int index = Array.FindIndex<string>(_propsToHide,
                            delegate(string s) {
                                return s == prop.Name;
                            }
                        );

                    if (index != -1) {
                        continue;
                    }

                    // add the drop down if it is selectable.
                    //
                    IDReferencePropertyAttribute controlRefAttr = (IDReferencePropertyAttribute)prop.Attributes[typeof(IDReferencePropertyAttribute)];

                    Attribute tca = prop.Attributes[typeof(TypeConverterAttribute)];

                    if (controlRefAttr != null && !controlRefAttr.IsDefaultAttribute()) {
                        Type t = typeof(TypedControlIDConverter<Control>).GetGenericTypeDefinition();

                        t = t.MakeGenericType(controlRefAttr.ReferencedControlType);

                        tca = new TypeConverterAttribute(t);                        
                    }

                    prop = TypeDescriptor.CreateProperty(prop.ComponentType, prop, BrowsableAttribute.Yes, tca);

                    // add it to the list.
                    //
                    props.Add(prop);


                }

                propCollection = new PropertyDescriptorCollection(props.ToArray());

            }
            return propCollection;
        }

        #region ICustomTypeDescriptor Stubs

        System.ComponentModel.AttributeCollection ICustomTypeDescriptor.GetAttributes() {
            return TypeDescriptor.GetAttributes(this.Target);
        }

        string ICustomTypeDescriptor.GetClassName() {
            return TypeDescriptor.GetClassName(this.Target);
        }

        string ICustomTypeDescriptor.GetComponentName() {
            return TypeDescriptor.GetComponentName(this.Target);
        }

        TypeConverter ICustomTypeDescriptor.GetConverter() {
            return TypeDescriptor.GetConverter(this.Target);
        }

        EventDescriptor ICustomTypeDescriptor.GetDefaultEvent() {
            return TypeDescriptor.GetDefaultEvent(this.Target);
        }

        PropertyDescriptor ICustomTypeDescriptor.GetDefaultProperty() {
            return TypeDescriptor.GetDefaultProperty(this.Target);
        }

        object ICustomTypeDescriptor.GetEditor(Type editorBaseType) {
            return TypeDescriptor.GetEditor(this.Target, editorBaseType);
        }

        EventDescriptorCollection ICustomTypeDescriptor.GetEvents(Attribute[] attributes) {
            return TypeDescriptor.GetEvents(this.Target, attributes);
        }

        EventDescriptorCollection ICustomTypeDescriptor.GetEvents() {
            return TypeDescriptor.GetEvents(this.Target);
        }


        PropertyDescriptorCollection ICustomTypeDescriptor.GetProperties() {
            return TypeDescriptor.GetProperties(this.Target);
        }

        object ICustomTypeDescriptor.GetPropertyOwner(PropertyDescriptor pd) {
            return this.Target;
        }

        #endregion
    }
}
