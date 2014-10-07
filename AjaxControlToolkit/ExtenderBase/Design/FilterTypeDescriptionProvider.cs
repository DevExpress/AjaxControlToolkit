using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace AjaxControlToolkit.Design {

    // This class allows the filtering/replacement of properties from the default list of properties.
    // We use this to modify the name of the ExtenderProperty on-demand
    internal class FilterTypeDescriptionProvider<T> : TypeDescriptionProvider, ICustomTypeDescriptor {

        T _target;
        TypeDescriptionProvider _baseProvider;
        ICustomTypeDescriptor _baseDescriptor;
        bool _extended;

        protected bool FilterExtendedProperties {
            get { return _extended; }
            set { _extended = value; }
        }

        protected T Target {
            get { return _target; }
        }

        // The default type descriptor for this type.  We delegate most calls to this.
        private ICustomTypeDescriptor BaseDescriptor {
            get {
                if(_baseDescriptor == null) {
                    if(FilterExtendedProperties) {
                        _baseDescriptor = _baseProvider.GetExtendedTypeDescriptor(Target);
                    } else {
                        _baseDescriptor = _baseProvider.GetTypeDescriptor(Target);
                    }
                }
                return _baseDescriptor;
            }
        }

        public FilterTypeDescriptionProvider(T target) :
            base(TypeDescriptor.GetProvider(target)) {
            _target = target;

            _baseProvider = TypeDescriptor.GetProvider(target);
        }

        public void Dispose() {
            _target = default(T);
            _baseDescriptor = null;
            _baseProvider = null;
        }


        public AttributeCollection GetAttributes() {
            return BaseDescriptor.GetAttributes();
        }

        public string GetClassName() {
            return BaseDescriptor.GetClassName();
        }

        public string GetComponentName() {
            return BaseDescriptor.GetComponentName();
        }

        public TypeConverter GetConverter() {
            return BaseDescriptor.GetConverter();
        }

        public EventDescriptor GetDefaultEvent() {
            return BaseDescriptor.GetDefaultEvent();
        }

        public PropertyDescriptor GetDefaultProperty() {
            return BaseDescriptor.GetDefaultProperty();
        }

        public object GetEditor(Type editorBaseType) {
            return BaseDescriptor.GetEditor(editorBaseType);
        }

        public EventDescriptorCollection GetEvents(Attribute[] attributes) {
            return BaseDescriptor.GetEvents(attributes);
        }

        public EventDescriptorCollection GetEvents() {
            return BaseDescriptor.GetEvents();
        }

        public object GetPropertyOwner(PropertyDescriptor pd) {
            return BaseDescriptor.GetPropertyOwner(pd);
        }

        public PropertyDescriptorCollection GetProperties(System.Attribute[] attributes) {
            PropertyDescriptorCollection props = BaseDescriptor.GetProperties(attributes);

            props = FilterProperties(props);
            return props;
        }

        public PropertyDescriptorCollection GetProperties() {
            return FilterProperties(BaseDescriptor.GetProperties());
        }

        private PropertyDescriptorCollection FilterProperties(PropertyDescriptorCollection props) {
            // create a new property array, PropertyDescriptorCollection is read-only here.
            PropertyDescriptor[] propArray = new PropertyDescriptor[props.Count];

            props.CopyTo(propArray, 0);

            bool changed = false;

            // run through the list, replacing as necessary
            //
            for(int i = 0; i < propArray.Length; i++) {
                PropertyDescriptor newProp = ProcessProperty(propArray[i]);
                if(newProp != propArray[i]) {
                    changed = true;
                    propArray[i] = newProp;
                }
            }

            // build the new collection if we made a change.
            //
            if(changed) {
                props = new PropertyDescriptorCollection(propArray);
            }
            return props;
        }

        // To be handled in derived class - this method takes a given property and modifies
        // it if necessary.  The result will be pushed back into the original property list, 
        // replacing the original PropertyDescriptor.
        protected virtual PropertyDescriptor ProcessProperty(PropertyDescriptor baseProp) {
            return baseProp;
        }

    }

}
