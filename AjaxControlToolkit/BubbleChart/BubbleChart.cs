#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing.Design;
using System.Linq;
using System.Text;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Drawing;

namespace AjaxControlToolkit {

    /// <summary>
    /// The BubbleChart control enables you to render a bubble chart from one or more series of values. 
    /// This control is compatible with any browser that supports SVG including Internet Explorer 9 and above.
    /// </summary>
    [ClientCssResource(Constants.BubbleChartName)]
    [ClientScriptResource("Sys.Extended.UI.BubbleChart", Constants.BubbleChartName)]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.BubbleChartName + Constants.IconPostfix)]
    public class BubbleChart : ChartBase {
        List<BubbleChartValue> _values = new List<BubbleChartValue>();

        /// <summary>
        /// Provides a list of values to the client side. 
        /// The Values property is required for designer experience support, 
        /// because the editor always prevents providing values to the client side as ExtenderControlProperty at runtime.
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty(true, true)]
        [ClientPropertyName("bubbleChartClientValues")]
        public List<BubbleChartValue> BubbleChartClientValues {
            get { return _values; }
        }

        /// <summary>
        /// A list of values.
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        [DefaultValue(null)]
        [NotifyParentProperty(true)]
        [Editor(typeof(ChartBaseSeriesEditor<BubbleChartValue>), typeof(UITypeEditor))]
        public List<BubbleChartValue> BubbleChartValues {
            get { return _values; }
        }

        /// <summary>
        /// Interval size for the Y axis line of the chart.
        /// The default is 6
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(6)]
        [ClientPropertyName("yAxisLines")]
        public int YAxisLines { get; set; }

        /// <summary>
        /// Iinterval size for the X axis line of the chart. 
        /// The default is 6
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(6)]
        [ClientPropertyName("xAxisLines")]
        public int XAxisLines { get; set; }

        /// <summary>
        /// The number of different bubble sizes.
        /// The default is 5
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(5)]
        [ClientPropertyName("bubbleSizes")]
        public int BubbleSizes { get; set; }

        /// <summary>
        /// A color of the Y axis lines of the chart.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("yAxisLineColor")]
        public string YAxisLineColor { get; set; }

        /// <summary>
        /// A color of the X axis lines of the chart.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("xAxisLineColor")]
        public string XAxisLineColor { get; set; }

        /// <summary>
        /// The color of the base lines of a chart.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("baseLineColor")]
        public string BaseLineColor { get; set; }

        /// <summary>
        /// A background color of the tooltip box.
        /// The default is #FFC652
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("#FFC652")]
        [ClientPropertyName("tooltipBackgroundColor")]
        public string TooltipBackgroundColor { get; set; }

        /// <summary>
        /// A font color of the tooltip box.
        /// The default is #0E426C
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("#0E426C")]
        [ClientPropertyName("tooltipFontColor")]
        public string TooltipFontColor { get; set; }

        /// <summary>
        /// A border color of the tooltip box. 
        /// The default is #B85B3E
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("#B85B3E")]
        [ClientPropertyName("tooltipBorderColor")]
        public string TooltipBorderColor { get; set; }

        /// <summary>
        /// Text/label to describe what data is in XAxis.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("xAxisLabel")]
        public string XAxisLabel { get; set; }

        /// <summary>
        /// Text/label to describe what data is in YAxis.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("yAxisLabel")]
        public string YAxisLabel { get; set; }

        /// <summary>
        /// Text/label that will be shown in the tooltip and describe a bubble value.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("bubbleLabel")]
        public string BubbleLabel { get; set; }

        /// <summary>
        /// The axis label font color
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("axislabelFontColor")]
        public string AxislabelFontColor { get; set; }

        protected override void OnInit(EventArgs e) {
            base.OnInit(e);
            if(IsDesignMode)
                return;

            foreach(BubbleChartValue bubbleChartValue in BubbleChartValues) {
                if(String.IsNullOrWhiteSpace(bubbleChartValue.Category))
                    throw new Exception("Category is missing the BubbleChartValue. Please provide a Category in the BubbleChartValue.");

                if(bubbleChartValue.Data == 0)
                    throw new Exception("Data is missing the BubbleChartValue. Please provide a value of Data in the BubbleChartValue.");
            }
        }

        protected override void CreateChildControls() {
            var parent = new HtmlGenericControl("div");
            parent.ID = "_ParentDiv";
            parent.Attributes.Add("style", String.Format("border-style:solid; border-width:1px;width:{0};height:{1};", ChartWidth, ChartHeight));
            var sbScript = new StringBuilder();
            sbScript.Append("<script>");

            sbScript.Append("function init(evt) { ");
            sbScript.Append("    if ( window.svgDocument == null ) { ");
            sbScript.Append("        gDocument = evt.target.ownerDocument;");
            sbScript.Append("    } ");
            sbScript.Append("} ");

            sbScript.Append("function ShowTooltip(me, evt, category, data, bubbleLabel) { ");
            sbScript.Append(String.Format("    var tooltipDiv = document.getElementById('{0}_tooltipDiv');", ClientID));
            sbScript.Append("    tooltipDiv.innerHTML = String.format('{0}: {1} {2}', category, data, bubbleLabel) ;");
            sbScript.Append("    tooltipDiv.style.top = evt.pageY - 25 + 'px';");
            sbScript.Append("    tooltipDiv.style.left = evt.pageX + 20 + 'px';");
            sbScript.Append("    tooltipDiv.style.visibility = 'visible';");
            sbScript.Append("    me.style.strokeWidth = '4';");
            sbScript.Append("    me.style.fillOpacity = '1';");
            sbScript.Append("    me.style.strokeOpacity = '1';");
            sbScript.Append("} ");

            sbScript.Append("function HideTooltip(me, evt) { ");
            sbScript.Append(String.Format("    var tooltipDiv = document.getElementById('{0}_tooltipDiv');", ClientID));
            sbScript.Append("    tooltipDiv.innerHTML = '';");
            sbScript.Append("    tooltipDiv.style.visibility = 'hidden';");
            sbScript.Append("    me.style.strokeWidth = '0';");
            sbScript.Append("    me.style.fillOpacity = '0.7';");
            sbScript.Append("    me.style.strokeOpacity = '0.7';");
            sbScript.Append("} ");

            sbScript.Append("</script>");
            parent.InnerHtml = sbScript.ToString();
            Controls.Add(parent);
        }
    }

}
#pragma warning restore 1591