

using System;
using System.ComponentModel;
using System.Web.UI;
using System.Web;

namespace AjaxControlToolkit
{
    public class ServicePathConverter : StringConverter
    {
        public override object ConvertTo(ITypeDescriptorContext context, System.Globalization.CultureInfo culture, object value, Type destinationType)
        {
            if (destinationType == typeof(string))
            {
                string strValue = (string)value;

                if (string.IsNullOrEmpty(strValue))
                {
                    HttpContext currentContext = HttpContext.Current;

                    if (currentContext != null)
                    {
                        return currentContext.Request.FilePath;
                    }
                }
            }

            return base.ConvertTo(context, culture, value, destinationType);
        }
    }
}
