using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel;

namespace AjaxControlToolkit
{
    /// <summary>
    /// BubbleChartValue holds information of category, x, y and data related to a series of chart.
    /// </summary>
    public class BubbleChartValue 
    {
        private string _category = string.Empty;
        private decimal _x;
        private decimal _y;
        private decimal _data;
        private string _bubbleColor = string.Empty;        

        /// <summary>
        /// To get category of a particular bubble.
        /// </summary>        
        public string Category
        {
            get { return _category; }
            set { _category = value; }
        }

        /// <summary>
        /// To get X value related to a particular bubble.
        /// </summary>        
        public decimal X
        {
            get { return _x; }
            set { _x = value; }
        }

        /// <summary>
        /// To get Y value related to a particular bubble.
        /// </summary>        
        public decimal Y
        {
            get { return _y; }
            set { _y = value; }
        }

        /// <summary>
        /// To get data related to a particular bubble.
        /// </summary>        
        public decimal Data
        {
            get { return _data; }
            set { _data = value; }
        }

        /// <summary>
        /// 
        /// Defines color related to a particular bubble.
        /// </summary>        
        public string BubbleColor
        {
            get { return _bubbleColor; }
            set { _bubbleColor = value; }
        }
    }
}
