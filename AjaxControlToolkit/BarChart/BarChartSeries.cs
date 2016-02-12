#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {

    public class BarChartSeries {
        string _name = String.Empty;
        string _barColor = string.Empty;

        public string Name {
            get { return _name; }
            set { _name = value; }
        }

        public string BarColor {
            get { return _barColor; }
            set { _barColor = value; }
        }

        [TypeConverter(typeof(DataConverter<decimal>))]
        public decimal[] Data { get; set; }
    }

}

#pragma warning restore 1591