using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {
    public abstract class JQueryExtenderControl : ExtenderControlBase {

        /// <summary>
        /// Control name in camel case
        /// </summary>
        private readonly string _controlName;

        protected JQueryExtenderControl()
        {
            _controlName = this.GetType().Name;
            _controlName = Char.ToLowerInvariant(_controlName[0]) + _controlName.Substring(1);
        }

        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);

            if (DesignMode)
                return;

            var clientProperties = this.GetType().GetProperties(BindingFlags.Public
                                                               | BindingFlags.Instance
                                                               | BindingFlags.DeclaredOnly);

            // All properties with non-default value will stored here
            var jsonProps = new List<string>();

            foreach (var property in clientProperties)
            {
                var attr =
                    property.GetCustomAttributes(typeof(ExtenderControlPropertyAttribute), false).FirstOrDefault();
                if (attr != null)
                {
                    var propType = property.PropertyType;
                    var defaultAttr =
                        (DefaultValueAttribute)
                            property.GetCustomAttributes(typeof(DefaultValueAttribute), false).FirstOrDefault();
                    var defaultValue = defaultAttr != null
                        ? defaultAttr.Value
                        : (propType.IsValueType ? Activator.CreateInstance(propType) : null);
                    var value = property.GetValue(this, null);

                    // Only add non-default property values
                    if (value != defaultValue)
                    {
                        jsonProps.Add(string.Format("\"{0}\":\"{1}\"", property.Name, value));
                    }
                }
            }

            // Generate data-act-options attribute value
            var dataOptions = "{" + string.Join(",", jsonProps.ToArray()) + "}";

            var targetControl = this.TargetControl as WebControl;
            var attrs = (targetControl is CheckBox) 
                ? (targetControl as CheckBox).InputAttributes
                : targetControl.Attributes;

            attrs.Add("data-act-" + _controlName, dataOptions);
        }

        protected override IEnumerable<ScriptDescriptor> GetScriptDescriptors(Control targetControl) {
            var descriptor =
                new ScriptBehaviorDescriptor(ClientControlType, targetControl.ClientID);

            return new List<ScriptDescriptor>(new ScriptDescriptor[] { descriptor });
        }

        protected override IEnumerable<ScriptReference> GetScriptReferences() {
            return null;
        }
    }
}
