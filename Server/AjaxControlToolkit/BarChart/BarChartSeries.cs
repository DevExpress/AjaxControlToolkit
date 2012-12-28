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
        private DataValueCollection dataValues = null;

        /// <summary>
        /// To get name of series.
        /// </summary>        
        public string Name
        {
            get { return _name; }
            set { _name = value; }
        }        

        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty(true, true)]
        public DataValueCollection DataValueList
        {
            get
            {
                return dataValues;
            }
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        [DefaultValue(null)]
        [NotifyParentProperty(true)]
        [Editor(typeof(DataValueCollectionEditor), typeof(UITypeEditor))]
        public DataValueCollection DataValues
        {
            get
            {
                if (dataValues == null)
                    dataValues = new DataValueCollection();
                return dataValues;
            }
        }

        /// <summary>
        /// Color of Bar for this series.
        /// </summary>
        public string BarColor
        {
            get { return _barColor; }
            set { _barColor = value; }
        }
       
    }

    /// <summary>
    /// Class to hold Data.
    /// </summary>
    public class DataValue
    {
        decimal data;

        public decimal Data
        {
            get { return data; }
            set { data = value; }
        }
    }

    /// <summary>
    /// Collection class for DataValues.
    /// </summary>
    public sealed class DataValueCollection : List<DataValue>
    { 
    
    }
}
