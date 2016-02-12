#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {
    public class DataConverter<T> : TypeConverter {

        public override bool CanConvertFrom(ITypeDescriptorContext context, Type sourceType) {
            return sourceType == typeof(string);
        }

        public override object ConvertFrom(ITypeDescriptorContext context, CultureInfo culture, object value) {
            var val = value as string;
            if(string.IsNullOrEmpty(val))
                return new T[0];

            var vals = val.Split(',');
            var items = new List<T>();
            var type = typeof(T);
            foreach(string s in vals) {
                T item = (T)Convert.ChangeType(s, type);
                items.Add(item);
            }
            return items.ToArray();
        }
    }

}

#pragma warning restore 1591