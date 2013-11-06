using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Web.UI;

namespace AjaxControlToolkit
{
    internal static class JQueryScriptBuilder
    {
        /// <summary>
        /// Build act-data-* options attribute on control's element
        /// </summary>
        /// <param name="targetControl"></param>
        /// <returns></returns>
        internal static string BuildDataOptionsAttribute(Control targetControl) {

            if (!(targetControl is IControlResolver))
                throw new Exception("JQuery control must derived from IControlResolver");

            var ctlType = targetControl.GetType();
            var properties = ctlType.GetProperties(BindingFlags.Public
                                                   | BindingFlags.Instance
                                                   | BindingFlags.DeclaredOnly).ToList();

            var behaviorIdProp = ctlType.GetProperty("BehaviorID");
            if (behaviorIdProp != null)
                properties.Add(behaviorIdProp);

            var dataOptions = new List<string>();

            foreach (var property in properties) {


                if (property.GetSetMethod(false) == null)
                    continue;

                var propType = property.PropertyType;

                if (propType.IsSpecialName)
                    continue;

                var skip = false;
                var customAttrs = property.GetCustomAttributes(true);

                IDReferencePropertyAttribute idReferencePropAttr = null;
                UrlPropertyAttribute urlPropAttr = null;
                ClientPropertyNameAttribute clientPropertyNameAttr = null;

                foreach (var customAttr in customAttrs) {
                    if (customAttr is PersistenceModeAttribute) {
                        var persistenceModeAttr = customAttr as PersistenceModeAttribute;
                        if (persistenceModeAttr.Mode != PersistenceMode.Attribute) {
                            skip = true;
                            break;
                        }
                    }

                    if (customAttr is BrowsableAttribute) {
                        var browseableAttr = customAttr as BrowsableAttribute;
                        if (!browseableAttr.Browsable) {
                            skip = true;
                            break;
                        }
                    }

                    if (customAttr is IDReferencePropertyAttribute)
                        idReferencePropAttr = customAttr as IDReferencePropertyAttribute;

                    if (customAttr is UrlPropertyAttribute)
                        urlPropAttr = customAttr as UrlPropertyAttribute;

                    if (customAttr is ClientPropertyNameAttribute)
                        clientPropertyNameAttr = customAttr as ClientPropertyNameAttribute;
                }

                if (skip)
                    continue;

                // Determine default property value
                var defaultValueAttr =
                    (DefaultValueAttribute)
                        property.GetCustomAttributes(typeof (DefaultValueAttribute), false).FirstOrDefault();

                var defaultValue = defaultValueAttr != null
                    ? defaultValueAttr.Value
                    : (propType.IsValueType ? Activator.CreateInstance(propType) : null);

                // Determine property value
                var value = property.GetValue(targetControl, null);

                if (idReferencePropAttr != null) {
                    var control = (targetControl as IControlResolver).ResolveControl((string)value);
                    if (control == null)
                        throw new Exception("Can't find control with ID '" + value + "'");
                    value = control.ClientID;
                }
                else if (urlPropAttr != null) {
                    value = targetControl.ResolveClientUrl((string) value);
                }


                // Only add non-default property values
                if (!object.Equals(value, defaultValue)) {
                    var formatedValue = value.ToString();

                    // Encode and quotize if value is string
                    if (propType.Equals(typeof (string)))
                        formatedValue = "'" + targetControl.Page.Server.HtmlEncode(formatedValue) + "'";

                    var propName = clientPropertyNameAttr == null
                        ? property.Name
                        : clientPropertyNameAttr.PropertyName;

                    dataOptions.Add(string.Format("{0}:{1}", CamelCaseFormat(propName), formatedValue));
                }
            }

            // Returns generated data options
            return string.Join(",", dataOptions.ToArray());
        }

        /// <summary>
        /// Format string in camel-case style.
        /// </summary>
        /// <param name="value">string to format</param>
        /// <returns></returns>
        private static string CamelCaseFormat(string value) {
            return Char.ToLowerInvariant(value[0]) + value.Substring(1);
        }
    }
}
