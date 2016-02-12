#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {

    public class PieChartValue {
        decimal _data;
        string _category = String.Empty;
        string _pieChartValueColor = String.Empty;
        string _pieChartValueStrokeColor = String.Empty;

        public decimal Data {
            get { return _data; }
            set { _data = value; }
        }

        public string Category {
            get { return _category; }
            set { _category = value; }
        }

        public string PieChartValueColor {
            get { return _pieChartValueColor; }
            set { _pieChartValueColor = value; }
        }

        public string PieChartValueStrokeColor {
            get { return _pieChartValueStrokeColor; }
            set { _pieChartValueStrokeColor = value; }
        }
    }

}

#pragma warning restore 1591