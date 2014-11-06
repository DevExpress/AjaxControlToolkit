using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.Design;

namespace AjaxControlToolkit.Design {

    internal class TabPanelDesigner : ControlDesigner {

        protected override void PreFilterProperties(System.Collections.IDictionary properties) {
            // get the template properties.
            //
            var templateProps = new PropertyDescriptor[] { (PropertyDescriptor)properties["HeaderTemplate"], (PropertyDescriptor)properties["ContentTemplate"] };

            // Codeplex Issue 10952
            // now we want to add the TemplateContainerAttribute to them.
            // we don't want to do this in the code because the original design had the containers not be an INamingContainer,
            // but TemplateContainerAttribute requires it.
            //
            // so we just add this at design time to make the designer happy, and everything else continues to work as always
            // at runtime.
            //
            foreach(PropertyDescriptor pd in templateProps) {
                if(pd != null)
                    properties[pd.Name] = TypeDescriptor.CreateProperty(typeof(TabPanel), pd, new TemplateContainerAttribute(typeof(TabPanel)));
            }

            base.PreFilterProperties(properties);
        }
    }

}
