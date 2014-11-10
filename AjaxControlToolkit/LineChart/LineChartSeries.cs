using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {

    public class LineChartSeries {
        string _name = String.Empty;
        string _lineColor = String.Empty;

        public string Name {
            get { return _name; }
            set { _name = value; }
        }

        public string LineColor {
            get { return _lineColor; }
            set { _lineColor = value; }
        }

        [TypeConverter(typeof(DataConverter<decimal>))]
        public decimal[] Data { get; set; }
    }

}
