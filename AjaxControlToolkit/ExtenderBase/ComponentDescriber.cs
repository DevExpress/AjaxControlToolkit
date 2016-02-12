#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.UI;

namespace AjaxControlToolkit {

    public class ComponentDescriber {
        static Dictionary<Type, Converter<object, string>> _customConverters = new Dictionary<Type, Converter<object, string>>();

        public static void DescribeComponent(object instance, IScriptComponentDescriptor descriptor, IUrlResolutionService urlResolver, IControlResolver controlResolver) {
            // validate preconditions
            if(instance == null)
                throw new ArgumentNullException("instance");
            if(descriptor == null)
                throw new ArgumentNullException("descriptor");
            if(urlResolver == null)
                urlResolver = instance as IUrlResolutionService;
            if(controlResolver == null)
                controlResolver = instance as IControlResolver;

            // describe properties
            PropertyDescriptorCollection properties = TypeDescriptor.GetProperties(instance);
            foreach(PropertyDescriptor prop in properties) {
                ExtenderControlPropertyAttribute propAttr = null;
                ExtenderControlEventAttribute eventAttr = null;

                ClientPropertyNameAttribute nameAttr = null;
                IDReferencePropertyAttribute idRefAttr = null;
                UrlPropertyAttribute urlAttr = null;
                ElementReferenceAttribute elementAttr = null;
                ComponentReferenceAttribute compAttr = null;

                foreach(Attribute attr in prop.Attributes) {
                    Type attrType = attr.GetType();
                    if(attrType == typeof(ExtenderControlPropertyAttribute))
                        propAttr = attr as ExtenderControlPropertyAttribute;
                    else if(attrType == typeof(ExtenderControlEventAttribute))
                        eventAttr = attr as ExtenderControlEventAttribute;
                    else if(attrType == typeof(ClientPropertyNameAttribute))
                        nameAttr = attr as ClientPropertyNameAttribute;
                    else if(attrType == typeof(IDReferencePropertyAttribute))
                        idRefAttr = attr as IDReferencePropertyAttribute;
                    else if(attrType == typeof(UrlPropertyAttribute))
                        urlAttr = attr as UrlPropertyAttribute;
                    else if(attrType == typeof(ElementReferenceAttribute))
                        elementAttr = attr as ElementReferenceAttribute;
                    else if(attrType == typeof(ComponentReferenceAttribute))
                        compAttr = attr as ComponentReferenceAttribute;
                }

                string propertyName = prop.Name;

                // Try getting a property attribute
                if(propAttr == null || !propAttr.IsScriptProperty) {
                    // Try getting an event attribute
                    if(eventAttr == null || !eventAttr.IsScriptEvent) {
                        continue;
                    }
                }

                // attempt to rename the property/event
                if(nameAttr != null && !string.IsNullOrEmpty(nameAttr.PropertyName)) {
                    propertyName = nameAttr.PropertyName;
                }

                // determine whether to serialize the value of a property.  readOnly properties should always be serialized
                bool serialize = prop.ShouldSerializeValue(instance) || prop.IsReadOnly;
                if(serialize) {
                    // get the value of the property, skip if it is null
                    Control c = null;
                    object value = prop.GetValue(instance);
                    if(value == null) {
                        continue;
                    }

                    // convert and resolve the value
                    if(eventAttr != null && prop.PropertyType != typeof(String)) {
                        throw new InvalidOperationException("ExtenderControlEventAttribute can only be applied to a property with a PropertyType of System.String.");
                    } else {
                        if(!prop.PropertyType.IsPrimitive && !prop.PropertyType.IsEnum) {
                            // Check if we can use any of our custom converters
                            // (first do a direct lookup on the property type,
                            // but also check all of its base types if nothing
                            // was found)
                            Converter<object, string> customConverter = null;
                            if(!_customConverters.TryGetValue(prop.PropertyType, out customConverter)) {
                                foreach(KeyValuePair<Type, Converter<object, string>> pair in _customConverters) {
                                    if(prop.PropertyType.IsSubclassOf(pair.Key)) {
                                        customConverter = pair.Value;
                                        break;
                                    }
                                }
                            }

                            // Use the custom converter if found, otherwise use
                            // its current type converter
                            if(customConverter != null) {
                                value = customConverter(value);
                            } else {
                                // Determine if we should let ASP.NET AJAX handle this type of conversion, as it supports JSON serialization
                                if(propAttr != null && propAttr.UseJsonSerialization) {
                                    // Use ASP.NET JSON serialization
                                } else {
                                    // Use the property's own converter
                                    TypeConverter conv = prop.Converter;

                                    if(value.GetType() == typeof(DateTime))
                                        value = ((DateTime)value).ToString("s", CultureInfo.InvariantCulture);
                                    else
                                        value = conv.ConvertToString(null, CultureInfo.InvariantCulture, value);
                                }
                            }
                        }
                        if(idRefAttr != null && controlResolver != null) {
                            c = controlResolver.ResolveControl((string)value);
                        }
                        if(urlAttr != null && urlResolver != null) {
                            value = urlResolver.ResolveClientUrl((string)value);
                        }
                    }

                    // add the value as an appropriate description
                    if(eventAttr != null) {
                        descriptor.AddEvent(propertyName, (string)value);
                    } else if(elementAttr != null) {
                        if(c == null && controlResolver != null)
                            c = controlResolver.ResolveControl((string)value);
                        if(c != null)
                            value = c.ClientID;
                        descriptor.AddElementProperty(propertyName, (string)value);
                    } else if(compAttr != null) {
                        if(c == null && controlResolver != null)
                            c = controlResolver.ResolveControl((string)value);
                        if(c != null) {
                            ExtenderControlBase ex = c as ExtenderControlBase;
                            if(ex != null && ex.BehaviorID.Length > 0)
                                value = ex.BehaviorID;
                            else
                                value = c.ClientID;
                        }
                        descriptor.AddComponentProperty(propertyName, (string)value);
                    } else {
                        if(c != null)
                            value = c.ClientID;
                        descriptor.AddProperty(propertyName, value);
                    }
                }
            }

            // determine if we should describe methods
            foreach(MethodInfo method in instance.GetType().GetMethods(BindingFlags.Instance | BindingFlags.Static | BindingFlags.Public)) {
                ExtenderControlMethodAttribute methAttr = (ExtenderControlMethodAttribute)Attribute.GetCustomAttribute(method, typeof(ExtenderControlMethodAttribute));
                if(methAttr == null || !methAttr.IsScriptMethod) {
                    continue;
                }

                // We only need to support emitting the callback target and registering the WebForms.js script if there is at least one valid method
                Control control = instance as Control;
                if(control != null) {
                    // Force WebForms.js
                    control.Page.ClientScript.GetCallbackEventReference(control, null, null, null);

                    // Add the callback target
                    descriptor.AddProperty("_callbackTarget", control.UniqueID);
                }
                break;
            }
        }

    }

}
#pragma warning restore 1591