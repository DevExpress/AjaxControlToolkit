using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;
using System.Globalization;

namespace AjaxControlToolkit
{
    /// <summary>
    /// This is genertic type converter to convert value to and from string.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class DataConverter<T> : TypeConverter
    {
        /// <summary>
        /// Returns true if source is of type string
        /// </summary>
        /// <param name="context"></param>
        /// <param name="sourceType"></param>
        /// <returns></returns>
        public override bool CanConvertFrom(ITypeDescriptorContext context, Type sourceType)
        {
            return sourceType == typeof(string);
        }

        /// <summary>
        /// This will convert comma separated string to array of specified type
        /// </summary>
        /// <param name="context"></param>
        /// <param name="culture"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value)
        {
            string val = value as string;
            if (string.IsNullOrEmpty(val))
                return new T[0];

            string[] vals = val.Split(',');
            List<T> items = new List<T>();
            Type type = typeof(T);
            foreach (string s in vals)
            {
                T item = (T)Convert.ChangeType(s, type);
                items.Add(item);
            }
            return items.ToArray();
        }
    }
}
