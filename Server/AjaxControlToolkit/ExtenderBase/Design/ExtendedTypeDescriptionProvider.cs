


using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel;

namespace AjaxControlToolkit.Design
{
    /// <summary>
    /// This class allows the filtering/replacement of properties from the default list of properties.
    /// 
    /// We use this to modify the name of the ExtenderProperty on-demand
    /// </summary>
    /// <typeparam name="T"></typeparam>
    internal class FilterTypeDescriptionProvider<T> : TypeDescriptionProvider, ICustomTypeDescriptor
    {
        T _target;
        ICustomTypeDescriptor _baseDescriptor;
        TypeDescriptionProvider _baseProvider;
        bool _extended;

        public FilterTypeDescriptionProvider(T target) :
                    base(TypeDescriptor.GetProvider(target))
        {
            _target = target;

            // pick up the default provider
            _baseProvider = TypeDescriptor.GetProvider(target);
        }

        /// <summary>
        /// The object we are wrapping.
        /// </summary>
        protected T Target
        {
            get
            {
                return _target;
            }
        }
        
        /// <summary>
        /// The default type descriptor for this type.  We delegate most calls to this.
        /// </summary>
        private ICustomTypeDescriptor BaseDescriptor
        {
            get
            {
                if (_baseDescriptor == null)
                {
                    if (FilterExtendedProperties)
                    {
                        _baseDescriptor = _baseProvider.GetExtendedTypeDescriptor(Target);
                    }
                    else
                    {
                        _baseDescriptor = _baseProvider.GetTypeDescriptor(Target);
                    }
                }
                return _baseDescriptor;
            }
        }

        /// <summary>
        /// True to filter extender properties, otherwise false.
        /// </summary>
        protected bool FilterExtendedProperties
        {
            get
            {
                return _extended;
            }
            set
            {
                _extended = value;
            }
        }

        /// <summary>
        /// Intercept the call to GetTypeDescriptor and return ourselves if appropriate
        /// </summary>
        public override ICustomTypeDescriptor GetTypeDescriptor(Type objectType, object instance)
        {
            if (FilterExtendedProperties || instance != (object)Target)
            {
                return _baseProvider.GetTypeDescriptor(objectType, instance);
            }
            else
            {
                return this;
            }
        }

        /// <summary>
        /// Intercept the call to GetExtendedTypeDescriptor and return ourselves if appropriate
        /// </summary>
        public override ICustomTypeDescriptor GetExtendedTypeDescriptor(object instance)
        {
            if (FilterExtendedProperties && instance == (object)Target)
            {
                return this;
            }
            else
            {
                return _baseProvider.GetExtendedTypeDescriptor(instance);                
            }
        }

        /// <summary>
        /// To be handled in derived class - this method takes a given property and modifies
        /// it if necessary.  The result will be pushed back into the original property list, 
        /// replacing the original PropertyDescriptor.
        /// </summary>
        protected virtual PropertyDescriptor ProcessProperty(PropertyDescriptor baseProp)
        {
            return baseProp;
        }

        public void Dispose()
        {               
            _target = default(T);                
            _baseDescriptor = null;
            _baseProvider = null;
        }

        #region ICustomTypeDescriptor Members

        PropertyDescriptorCollection ICustomTypeDescriptor.GetProperties()
        {
            return FilterProperties(BaseDescriptor.GetProperties());
        }


        PropertyDescriptorCollection ICustomTypeDescriptor.GetProperties(Attribute[] attributes)
        {
            PropertyDescriptorCollection props = BaseDescriptor.GetProperties(attributes);

            props = FilterProperties(props);
            return props;
        }

        private PropertyDescriptorCollection FilterProperties(PropertyDescriptorCollection props)
        {
            // create a new property array, PropertyDescriptorCollection is read-only here.
            //
            PropertyDescriptor[] propArray = new PropertyDescriptor[props.Count];

            props.CopyTo(propArray, 0);

            bool changed = false;

            // run through the list, replacing as necessary
            //
            for (int i = 0; i < propArray.Length; i++)
            {
                PropertyDescriptor newProp = ProcessProperty(propArray[i]);
                if (newProp != propArray[i])
                {
                    changed = true;
                    propArray[i] = newProp;
                }
            }

            // build the new collection if we made a change.
            //
            if (changed)
            {
                props = new PropertyDescriptorCollection(propArray);
            }
            return props;
        }

        #region ICustomTypeDescriptor Stubs

        System.ComponentModel.AttributeCollection ICustomTypeDescriptor.GetAttributes()
        {
            return BaseDescriptor.GetAttributes();
        }

        string ICustomTypeDescriptor.GetClassName()
        {
            return BaseDescriptor.GetClassName();
        }

        string ICustomTypeDescriptor.GetComponentName()
        {
            return BaseDescriptor.GetComponentName();
        }

        TypeConverter ICustomTypeDescriptor.GetConverter()
        {
            return BaseDescriptor.GetConverter();
        }

        EventDescriptor ICustomTypeDescriptor.GetDefaultEvent()
        {
            return BaseDescriptor.GetDefaultEvent();
        }

        PropertyDescriptor ICustomTypeDescriptor.GetDefaultProperty()
        {
            return BaseDescriptor.GetDefaultProperty();
        }

        object ICustomTypeDescriptor.GetEditor(Type editorBaseType)
        {
            return BaseDescriptor.GetEditor(editorBaseType);
        }

        EventDescriptorCollection ICustomTypeDescriptor.GetEvents(Attribute[] attributes)
        {
            return BaseDescriptor.GetEvents(attributes);
        }

        EventDescriptorCollection ICustomTypeDescriptor.GetEvents()
        {
            return BaseDescriptor.GetEvents();
        }


        object ICustomTypeDescriptor.GetPropertyOwner(PropertyDescriptor pd)
        {
            return BaseDescriptor.GetPropertyOwner(pd);
        }
        #endregion
        #endregion

    }
}
