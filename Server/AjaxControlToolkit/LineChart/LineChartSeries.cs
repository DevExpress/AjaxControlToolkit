using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;
using System.Web.UI;
using System.Drawing.Design;

namespace AjaxControlToolkit
{
    /// <summary>
    /// LineChartSeries holds information of name and data related to a series of chart.    
    /// </summary>
    public class LineChartSeries 
    {
        private string _name = String.Empty;
        private string _lineColor = string.Empty;
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
        /// Color of Line for this series.
        /// </summary>
        public string LineColor
        {
            get { return _lineColor; }
            set { _lineColor = value; }
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
