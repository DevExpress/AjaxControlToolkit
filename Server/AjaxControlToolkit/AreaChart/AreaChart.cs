using System;
using System.Collections;
using System.ComponentModel.Design.Serialization;
using System.Data;
using System.Configuration;
using System.Reflection;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Web.Script;
using System.ComponentModel;
using System.Xml;
using System.IO;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Globalization;
using AjaxControlToolkit;
using System.Text;
using System.Web.Script.Serialization;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Design;

#region [ Resources ]

[assembly: System.Web.UI.WebResource("AreaChart.AreaChart.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("AreaChart.AreaChart.debug.js", "application/x-javascript")]
[assembly: WebResource("AreaChart.AreaChart.css", "text/css", PerformSubstitution = true)]

#endregion

namespace AjaxControlToolkit
{

    /// <summary>
    /// AreaChart creates areachart with the specified values.
    /// </summary>
    [Designer("AjaxControlToolkit.AreaChartDesigner, AjaxControlToolkit")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientCssResource("AreaChart.AreaChart.css")]
    [ClientScriptResource("Sys.Extended.UI.AreaChart", "AreaChart.AreaChart.js")]
    public class AreaChart : ScriptControlBase
    {
        private AreaChartSeriesCollection areaChartSeriesList = null;

        #region [ Constructors ]

        /// <summary>
        /// Initializes a new AreaChart Control.
        /// </summary>
        public AreaChart()
            : base(true, HtmlTextWriterTag.Div)
        {
        }

        #endregion

        #region [Private Properties]
        /// <summary>
        /// Gets whether control is in design mode or not.
        /// </summary>
        private bool IsDesignMode
        {
            get
            {
                return (HttpContext.Current == null);
            }
        }

        #endregion

        #region [ Public Properties ]

        /// <summary>
        /// Width of AreaChart.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(null)]
        [ClientPropertyName("chartWidth")]
        public string ChartWidth
        {
            get;
            set;
        }

        /// <summary>
        /// Height of AreaChart. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(null)]
        [ClientPropertyName("chartHeight")]
        public string ChartHeight
        {
            get;
            set;
        }

        /// <summary>
        /// Title of AreaChart. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("chartTitle")]
        public string ChartTitle
        {
            get;
            set;
        }

        /// <summary>
        /// Categories Axis of AreaChart. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("categoriesAxis")]
        public string CategoriesAxis
        {
            get;
            set;
        }
        
        /// <summary>
        /// Provide list of series to client side. Need help from Series property 
        /// for designer experience support, cause Editor always blocks the property
        /// ability to provide values to client side as ExtenderControlProperty on run time.
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty(true, true)]
        public AreaChartSeriesCollection ClientSeries
        {
            get
            {
                return areaChartSeriesList;
            }
        }

        /// <summary>
        /// defines series related to AreaChart.
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        [DefaultValue(null)]
        [NotifyParentProperty(true)]
        [Editor(typeof(AreaChartSeriesCollectionEditor), typeof(UITypeEditor))]
        public AreaChartSeriesCollection Series
        {
            get
            {
                if (areaChartSeriesList == null)
                    areaChartSeriesList = new AreaChartSeriesCollection();
                return areaChartSeriesList;
            }
        }

        /// <summary>
        /// Type of AreaChart. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(AreaChartType.Basic)]
        [ClientPropertyName("chartType")]
        public AreaChartType ChartType
        {
            get;
            set;
        }

        /// <summary>
        /// CSS/Theme file name of AreaChart. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("AreaChart")]
        [ClientPropertyName("theme")]
        public string Theme
        {
            get;
            set;
        }

        /// <summary>
        /// Number of lines on the Value Axis. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(9)]
        [ClientPropertyName("valueAxisLines")]
        public int ValueAxisLines
        {
            get;
            set;
        }

        /// <summary>
        /// Text color of title of Area Chart.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("chartTitleColor")]
        public string ChartTitleColor
        {
            get;
            set;
        }

        /// <summary>
        /// Color of background lines of Value Axis of Area Chart. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("valueAxisLineColor")]
        public string ValueAxisLineColor
        {
            get;
            set;
        }

        /// <summary>
        /// Color of background lines of Catgory Axis of Area Chart.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("categoryAxisLineColor")]
        public string CategoryAxisLineColor
        {
            get;
            set;
        }

        /// <summary>
        /// Color of Base Lines of Area Chart.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("baseLineColor")]
        public string BaseLineColor
        {
            get;
            set;
        }

        #endregion

        #region [ Members ]

        /// <summary>
        /// On Init to validate data.
        /// </summary>
        /// <param name="e"></param>
        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);
            if (!IsDesignMode)
            {
                foreach (AreaChartSeries areaChartSeries in Series)
                {
                    if (areaChartSeries.Name == null || areaChartSeries.Name.Trim() == "")
                    {
                        throw new Exception("Name is missing in the AreaChartSeries. Please provide a name in the AreaChartSeries.");
                    }
                }
            }
        }
        
        /// <summary>
        /// CreateChilds call to create child controls for AreaChart.
        /// </summary>
        internal void CreateChilds()
        {
            this.Controls.Clear();
            this.CreateChildControls();
        }

        /// <summary>
        /// CreateChildControls creates html controls for a AreaChart control.
        /// </summary>
        protected override void CreateChildControls()
        {
            GenerateHtmlInputControls();
        }


        /// <summary>
        /// GenerateHtmlInputControls creates parent div for AreaChart control.
        /// </summary>
        /// <returns>Return the client id of parent div that contains all other html controls.</returns>
        protected string GenerateHtmlInputControls()
        {
            HtmlGenericControl parent = new HtmlGenericControl("div");
            parent.ID = "_ParentDiv";            
            parent.Attributes.Add("style", "border-style:solid; border-width:1px;");
            Controls.Add(parent);

            return parent.InnerHtml;
        }

        /// <summary>
        /// DescribeComponent creates propreties in ScriptComponentDescriptor for child controls in AreaChart.
        /// </summary>
        /// <param name="descriptor">Descriptor object which will accpet server components to convert in client script.</param>
        protected override void DescribeComponent(ScriptComponentDescriptor descriptor)
        {
            base.DescribeComponent(descriptor);
            if (!IsDesignMode)
            {
                
            }
        }

        #endregion
       
    }
}
