#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {

    public class LineChartSeries {
        string _name = String.Empty;
        string _lineColor = String.Empty;

        /// <summary>
        /// The name of the LineChart series
        /// </summary>
        public string Name {
            get { return _name; }
            set { _name = value; }
        }

        /// <summary>
        /// Enables you to set a line color for a particular series
        /// </summary>
        public string LineColor {
            get { return _lineColor; }
            set { _lineColor = value; }
        }

        /// <summary>
        /// Provides data for a particular series
        /// </summary>
        [TypeConverter(typeof(DataConverter<decimal>))]
        public decimal[] Data { get; set; }
    }

}

#pragma warning restore 1591