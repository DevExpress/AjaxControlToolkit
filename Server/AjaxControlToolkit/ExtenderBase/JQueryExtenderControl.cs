using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Web.UI;
using System.Web.UI.HtmlControls;

namespace AjaxControlToolkit {
    public abstract class JQueryExtenderControl : ExtenderControlBase {
        protected override void CreateChildControls() {

            base.CreateChildControls();

            // Translate all extender properties into data-act-options attribute value

            var clientProperties = this.GetType().GetProperties(BindingFlags.Public
                                                                | BindingFlags.Instance
                                                                | BindingFlags.DeclaredOnly);

            // All properties with non-default value will stored here
            var jsonProps = new List<string>();

            foreach (var property in clientProperties) {
                var attr =
                    property.GetCustomAttributes(typeof (ExtenderControlPropertyAttribute), false).FirstOrDefault();
                if (attr != null) {
                    var propType = property.PropertyType;
                    var defaultAttr =
                        (DefaultValueAttribute)
                            property.GetCustomAttributes(typeof (DefaultValueAttribute), false).FirstOrDefault();
                    var defaultValue = defaultAttr != null
                        ? defaultAttr.Value
                        : (propType.IsValueType ? Activator.CreateInstance(propType) : null);
                    var value = property.GetValue(this, null);

                    // Only add non-default property values
                    if (value != defaultValue) {
                        jsonProps.Add(string.Format("\"{0}\":\"{1}\"", property.Name, value));
                    }
                }
            }

            var targetControl = this.TargetControl;

            // Generate data-act-options attribute value
            var dataOptions = "{" + string.Join(",", jsonProps.ToArray()) + "}";

            // Create <data> HTML element with data-act-options attribute            
            var control = new HtmlGenericControl("data") {ID = targetControl.ID + "_Extender"};
            control.Attributes.Add("data-act-options", dataOptions);

            // Set the target control id of this data goes to 
            control.Attributes.Add("data-act-target", targetControl.ClientID);

            // Set with control name, jQuery selector will use it for global activation
            // control.Attributes.Add("data-act-control", this.GetType().Name);

            // Locate it right under the target control
            Controls.AddAt(Page.Controls.IndexOf(targetControl) + 1, control);
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
