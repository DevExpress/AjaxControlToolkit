#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Globalization;
using System.Web;

namespace AjaxControlToolkit {

    public class ServicePathConverter : StringConverter {
        public override object ConvertTo(ITypeDescriptorContext context, CultureInfo culture, object value, Type destinationType) {
            if (destinationType == typeof(string)) {
                string strValue = (string)value;

                if (string.IsNullOrEmpty(strValue)) {
                    HttpContext currentContext = HttpContext.Current;

                    if (currentContext != null) {
                        return currentContext.Request.FilePath;
                    }
                }
            }

            return base.ConvertTo(context, culture, value, destinationType);
        }
    }
}

#pragma warning restore 1591