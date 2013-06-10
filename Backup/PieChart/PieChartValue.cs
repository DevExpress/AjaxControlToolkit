using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;

namespace AjaxControlToolkit
{
    /// <summary>
    /// PieChartValue holds information of category and data related to a PieChartValue.    
    /// </summary>
    public class PieChartValue 
    {
        private string _category = String.Empty;
        private decimal _data;
        private string _pieChartValueColor = string.Empty;
        private string _pieChartValueStrokeColor = string.Empty;

        /// <summary>
        /// To get category of PieChartValue.
        /// </summary>        
        public string Category
        {
            get { return _category; }
            set { _category = value; }
        }        

        /// <summary>
        /// To get data related to PieChartValue.
        /// </summary>        
        public decimal Data
        {
            get { return _data; }
            set { _data = value; }
        }

        /// <summary>
        /// To get fill color of PieChartValue.
        /// </summary>        
        public string PieChartValueColor
        {
            get { return _pieChartValueColor; }
            set { _pieChartValueColor = value; }
        }

        /// <summary>
        /// To get stroke color of PieChartValue.
        /// </summary>        
        public string PieChartValueStrokeColor
        {
            get { return _pieChartValueStrokeColor; }
            set { _pieChartValueStrokeColor = value; }
        }
    }
}
