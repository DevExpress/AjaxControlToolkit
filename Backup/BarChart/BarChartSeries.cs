using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;
using System.Web.UI;
using System.Drawing.Design;
using System.Collections;


namespace AjaxControlToolkit
{
    /// <summary>
    /// BarChartSeries holds information of name and data related to a series of chart.    
    /// </summary>
    public class BarChartSeries
    {
        private string _name = String.Empty;        
        private string _barColor = string.Empty;        
        private decimal[] _data;

        /// <summary>
        /// To get name of series.
        /// </summary>        
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }

        /// <summary>
        /// Color of Bar for this series.
        /// </summary>
        public string BarColor
        {
            get { return _barColor; }
            set { _barColor = value; }
        }

        /// <summary>
        /// Data for this series.
        /// </summary>
        [TypeConverter(typeof(DataConverter<decimal>))]
        public decimal[] Data
        {
            get;
            set;
        }
    }    
}
