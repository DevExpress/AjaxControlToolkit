#pragma warning disable 1591
using System;
using System.Collections;
using System.ComponentModel;
using System.Web.UI;

namespace AjaxControlToolkit {

    public class MaskedEditTypeConvert : StringConverter {
        public override bool GetStandardValuesSupported(ITypeDescriptorContext context) {
            return true;
        }

        public override bool GetStandardValuesExclusive(ITypeDescriptorContext context) {
            return false;
        }

        public override StandardValuesCollection GetStandardValues(ITypeDescriptorContext context) {
            if((context == null) || (context.Container == null))
                return null;

            var serverControls = GetControls(context.Container);
            if(serverControls != null)
                return new StandardValuesCollection(serverControls);

            return null;
        }

        static object[] GetControls(IContainer container) {
            var availableControls = new ArrayList();

            foreach(IComponent component in container.Components) {
                var serverControl = component as Control;
                if(serverControl != null
                   && !(serverControl is Page)
                   && serverControl.ID != null
                   && serverControl.ID.Length != 0
                   && IncludeControl(serverControl)
                   )
                    availableControls.Add(serverControl.ID);
            }
            availableControls.Sort(Comparer.Default);

            return availableControls.ToArray();
        }

        static bool IncludeControl(Control serverControl) {
            var returnedVal = false;
            var controlType = serverControl.GetType().ToString();
            if(controlType.IndexOf("Sys.Extended.UI.maskededitextender", StringComparison.OrdinalIgnoreCase) != -1)
                returnedVal = true;

            return returnedVal;
        }
    }

}

#pragma warning restore 1591