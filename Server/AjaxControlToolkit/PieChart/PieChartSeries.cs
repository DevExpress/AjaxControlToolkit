using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;

namespace AjaxControlToolkit
{
    /// <summary>
    /// PieChartSeries holds information of category and data related to a series of chart.    
    /// </summary>
    public class PieChartSeries
    {
        private string _category = String.Empty;
        private decimal _data;
        private string _seriesColor = string.Empty;

        /// <summary>
        /// To get category of series.
        /// </summary>        
        public string Category
        {
            get { return _category; }
            set { _category = value; }
        }

        /// <summary>
        /// To get data related to series.
        /// </summary>        
        public decimal Data
        {
            get { return _data; }
            set { _data = value; }
        }

        /// <summary>
        /// To get category of series.
        /// </summary>        
        public string SeriesColor
        {
            get { return _seriesColor; }
            set { _seriesColor = value; }
        }
    }
}