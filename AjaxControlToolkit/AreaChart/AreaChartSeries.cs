#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace AjaxControlToolkit {

    public class AreaChartSeries {
        string _name = String.Empty;
        string _areaColor = String.Empty;

        public string Name {
            get { return _name; }
            set { _name = value; }
        }

        public string AreaColor {
            get { return _areaColor; }
            set { _areaColor = value; }
        }

        [TypeConverter(typeof(DataConverter<decimal>))]
        public decimal[] Data { get; set; }
    }

}

#pragma warning restore 1591