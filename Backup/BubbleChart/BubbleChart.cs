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

[assembly: System.Web.UI.WebResource("BubbleChart.BubbleChart.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("BubbleChart.BubbleChart.debug.js", "application/x-javascript")]
[assembly: WebResource("BubbleChart.BubbleChart.css", "text/css", PerformSubstitution = true)]

#endregion

namespace AjaxControlToolkit
{

    /// <summary>
    /// BubbleChart creates BubbleChart with the specified values.
    /// </summary>
    [Designer("AjaxControlToolkit.BubbleChartDesigner, AjaxControlToolkit")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientCssResource("BubbleChart.BubbleChart.css")]
    [ClientScriptResource("Sys.Extended.UI.BubbleChart", "BubbleChart.BubbleChart.js")]
    public class BubbleChart : ScriptControlBase
    {
        private BubbleChartValueCollection bubbleChartValueList = null;

        #region [ Constructors ]

        /// <summary>
        /// Initializes a new BubbleChart control.
        /// </summary>
        public BubbleChart()
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
        /// Width of Bubble Chart.
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
        /// Height of Bubble Chart. 
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
        /// Title of Bubble Chart. 
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
        /// Provide list of values to client side. Need help from Values property 
        /// for designer experience support, cause Editor always blocks the property
        /// ability to provide values to client side as ExtenderControlProperty on run time.
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty(true, true)]
        public BubbleChartValueCollection BubbleChartClientValues
        {
            get
            {
                return bubbleChartValueList;
            }
        }

        /// <summary>
        /// defines values related to Bubble chart.
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        [DefaultValue(null)]
        [NotifyParentProperty(true)]
        [Editor(typeof(BubbleChartValueCollectionEditor), typeof(UITypeEditor))]
        public BubbleChartValueCollection BubbleChartValues
        {
            get
            {
                if (bubbleChartValueList == null)
                    bubbleChartValueList = new BubbleChartValueCollection();
                return bubbleChartValueList;
            }
        }

        /// <summary>
        /// CSS/Theme file name of Bubble Chart. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("BubbleChart")]
        [ClientPropertyName("theme")]
        public string Theme
        {
            get;
            set;
        }

        /// <summary>
        /// Number of lines on the Y Axis. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(6)]
        [ClientPropertyName("yAxisLines")]
        public int YAxisLines
        {
            get;
            set;
        }

        /// <summary>
        /// Number of lines on the X Axis. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(6)]
        [ClientPropertyName("xAxisLines")]
        public int XAxisLines
        {
            get;
            set;
        }

        /// <summary>
        /// Number of sizes of bubbles. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(5)]
        [ClientPropertyName("bubbleSizes")]
        public int BubbleSizes
        {
            get;
            set;
        }

        /// <summary>
        /// Font color of title of Bubble Chart. 
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
        /// Color of background lines of Value Axis of Bubble Chart. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("yAxisLineColor")]
        public string YAxisLineColor
        {
            get;
            set;
        }

        /// <summary>
        /// Color of background lines of X Axis of Bubble Chart. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("xAxisLineColor")]
        public string XAxisLineColor
        {
            get;
            set;
        }

        /// <summary>
        /// Color of Base Lines of Bubble Chart. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("baseLineColor")]
        public string BaseLineColor
        {
            get;
            set;
        }

        /// <summary>
        /// Background Color of Tooltip. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("#FFC652")]
        [ClientPropertyName("tooltipBackgroundColor")]
        public string TooltipBackgroundColor
        {
            get;
            set;
        }

        /// <summary>
        /// Font Color of Tooltip. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("#0E426C")]
        [ClientPropertyName("tooltipFontColor")]
        public string TooltipFontColor
        {
            get;
            set;
        }

        /// <summary>
        /// Border Color of Tooltip. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("#B85B3E")]
        [ClientPropertyName("tooltipBorderColor")]
        public string TooltipBorderColor
        {
            get;
            set;
        }

        /// <summary>
        /// Text/Label to which X axis's values representing to.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("xAxisLabel")]
        public string XAxisLabel
        {
            get;
            set;
        }

        /// <summary>
        /// Text/Label to which Y axis's values representing to.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("yAxisLabel")]
        public string YAxisLabel
        {
            get;
            set;
        }

        /// <summary>
        /// Text/Label to which Bubble values representing to.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("bubbleLabel")]
        public string BubbleLabel
        {
            get;
            set;
        }

        /// <summary>
        /// Font color of Axis labels to which axis values are representing. 
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("axislabelFontColor")]
        public string AxislabelFontColor
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
                foreach (BubbleChartValue bubbleChartValue in BubbleChartValues)
                {
                    if (bubbleChartValue.Category == null || bubbleChartValue.Category.Trim() == "")
                    {
                        throw new Exception("Category is missing the BubbleChartValue. Please provide a Category in the BubbleChartValue.");
                    }

                    //if (bubbleChartValue.X == 0)
                    //{
                    //    throw new Exception("X is missing the BubbleChartValue. Please provide a value of X in the BubbleChartValue.");
                    //}

                    //if (bubbleChartValue.Y == 0)
                    //{
                    //    throw new Exception("Y is missing the BubbleChartValue. Please provide a value of Y in the BubbleChartValue.");
                    //}

                    if (bubbleChartValue.Data == 0)
                    {
                        throw new Exception("Data is missing the BubbleChartValue. Please provide a value of Data in the BubbleChartValue.");
                    }
                }
            }
        }
        
        /// <summary>
        /// CreateChilds call to create child controls for Bubble Chart.
        /// </summary>
        internal void CreateChilds()
        {
            this.Controls.Clear();
            this.CreateChildControls();
        }

        /// <summary>
        /// CreateChildControls creates html controls for a Bubble Chart control.
        /// </summary>
        protected override void CreateChildControls()
        {
            GenerateHtmlInputControls();
        }


        /// <summary>
        /// GenerateHtmlInputControls creates parent div for Bubble Chart control.
        /// </summary>
        /// <returns>Return the client id of parent div that contains all other html controls.</returns>
        protected string GenerateHtmlInputControls()
        {   
            HtmlGenericControl parent = new HtmlGenericControl("div");
            parent.ID = "_ParentDiv";            
            parent.Attributes.Add("style", string.Format("border-style:solid; border-width:1px;width:{0};height:{1};", ChartWidth, ChartHeight));
            StringBuilder sbScript = new StringBuilder();
            sbScript.Append("<script>"); 
            
            sbScript.Append("function init(evt) { ");
            sbScript.Append("    if ( window.svgDocument == null ) { ");
            sbScript.Append("        gDocument = evt.target.ownerDocument;");   
            sbScript.Append("    } ");
            sbScript.Append("} ");

            sbScript.Append("function ShowTooltip(me, evt, category, data, bubbleLabel) { ");
            sbScript.Append(string.Format("    var tooltipDiv = document.getElementById('{0}_tooltipDiv');", this.ClientID));
            sbScript.Append("    tooltipDiv.innerHTML = String.format('{0}: {1} {2}', category, data, bubbleLabel) ;");
            sbScript.Append("    tooltipDiv.style.top = evt.pageY - 25 + 'px';");
            sbScript.Append("    tooltipDiv.style.left = evt.pageX + 20 + 'px';");
            sbScript.Append("    tooltipDiv.style.visibility = 'visible';");            
            sbScript.Append("    me.style.strokeWidth = '4';");
            sbScript.Append("    me.style.fillOpacity = '1';");
            sbScript.Append("    me.style.strokeOpacity = '1';");
            sbScript.Append("} ");

            sbScript.Append("function HideTooltip(me, evt) { ");
            sbScript.Append(string.Format("    var tooltipDiv = document.getElementById('{0}_tooltipDiv');", this.ClientID));
            sbScript.Append("    tooltipDiv.innerHTML = '';");
            sbScript.Append("    tooltipDiv.style.visibility = 'hidden';");
            sbScript.Append("    me.style.strokeWidth = '0';");
            sbScript.Append("    me.style.fillOpacity = '0.7';");
            sbScript.Append("    me.style.strokeOpacity = '0.7';");
            sbScript.Append("} ");

            sbScript.Append("</script>");
            parent.InnerHtml = sbScript.ToString();
            Controls.Add(parent);
            return parent.ClientID;
        }

        /// <summary>
        /// DescribeComponent creates propreties in ScriptComponentDescriptor for child controls in Bubble Chart
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
