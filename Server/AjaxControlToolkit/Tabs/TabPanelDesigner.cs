using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI.Design;
using System.ComponentModel;
using System.Web.UI;

namespace AjaxControlToolkit
{
    internal class TabPanelDesigner : ControlDesigner
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public TabPanelDesigner()
        {
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        protected override void PreFilterProperties(System.Collections.IDictionary properties)
        {
            // get the template properties.
            //
            PropertyDescriptor[] templateProps = new PropertyDescriptor[] { (PropertyDescriptor)properties["HeaderTemplate"], (PropertyDescriptor)properties["ContentTemplate"] };

            // Codeplex Issue 10952
            // now we want to add the TemplateContainerAttribute to them.
            // we don't want to do this in the code because the original design had the containers not be an INamingContainer,
            // but TemplateContainerAttribute requires it.
            //
            // so we just add this at design time to make the designer happy, and everything else continues to work as always
            // at runtime.
            //
            foreach (PropertyDescriptor pd in templateProps)
            {
                if (pd != null)
                {
                    properties[pd.Name] = TypeDescriptor.CreateProperty(typeof(TabPanel), pd, new TemplateContainerAttribute(typeof(TabPanel)));
                }
            }
            
            
            base.PreFilterProperties(properties);
        }
    }
}
