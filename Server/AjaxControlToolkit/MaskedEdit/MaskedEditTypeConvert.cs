
// 
// Product      : MaskedEdit Extend Control
// Version      : 1.0.0.0
// Date         : 10/23/2006
// Development  : Fernando Cerqueira 
// Version      : 1.0.0.1
// Development  : 02/22/2007 Fernando Cerqueira 
// 
using System;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.ComponentModel;
using System.Collections;
using System.Globalization;

namespace AjaxControlToolkit
{
    public class MaskedEditTypeConvert : StringConverter
    {
        public override bool GetStandardValuesSupported(ITypeDescriptorContext context)
        {
            return true;
        }
        public override bool GetStandardValuesExclusive(ITypeDescriptorContext context)
        {
            return false;
        }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1062:ValidateArgumentsOfPublicMethods", Justification = "context is checked against null")]
        public override StandardValuesCollection GetStandardValues(ITypeDescriptorContext context)
        {
            if ((context == null) || (context.Container == null))
            {
                return null;
            }
            Object[] serverControls = GetControls(context.Container);
            if (serverControls != null)
            {
                return new StandardValuesCollection(serverControls);
            }
            return null;
        }
        private static object[] GetControls(IContainer container)
        {
            ArrayList availableControls = new ArrayList();
            foreach (IComponent component in container.Components)
            {
                Control serverControl = component as Control;
                if (serverControl != null &&
                    !(serverControl is Page) &&
                    serverControl.ID != null &&
                    serverControl.ID.Length != 0 &&
                    IncludeControl(serverControl))
                {
                    availableControls.Add(serverControl.ID);
                }
            }
            availableControls.Sort(Comparer.Default);
            return availableControls.ToArray();
        }
        private static bool IncludeControl(Control serverControl)
        {
            bool ReturnedVal = false;
            string ControlType = serverControl.GetType().ToString();
            if (ControlType.IndexOf("Sys.Extended.UI.maskededitextender", StringComparison.OrdinalIgnoreCase) != -1)
            {
                ReturnedVal = true;
            }
            return ReturnedVal;
        }
    }
}
