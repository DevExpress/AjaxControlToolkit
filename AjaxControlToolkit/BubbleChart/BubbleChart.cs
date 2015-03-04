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

    [ClientCssResource(Constants.BubbleChartName)]
    [ClientScriptResource("Sys.Extended.UI.BubbleChart", Constants.BubbleChartName)]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.BubbleChartName + Constants.IconPostfix)]
    public class BubbleChart : ChartBase {
        List<BubbleChartValue> _values = new List<BubbleChartValue>();

        // Provide list of values to client side. Need help from Values property 
        // for designer experience support, cause Editor always blocks the property
        // ability to provide values to client side as ExtenderControlProperty on run time.
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty(true, true)]
        public List<BubbleChartValue> BubbleChartClientValues {
            get { return _values; }
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        [DefaultValue(null)]
        [NotifyParentProperty(true)]
        [Editor(typeof(ChartBaseSeriesEditor<BubbleChartValue>), typeof(UITypeEditor))]
        public List<BubbleChartValue> BubbleChartValues {
            get { return _values; }
        }

        [ExtenderControlProperty]
        [DefaultValue(6)]
        [ClientPropertyName("yAxisLines")]
        public int YAxisLines { get; set; }

        [ExtenderControlProperty]
        [DefaultValue(6)]
        [ClientPropertyName("xAxisLines")]
        public int XAxisLines { get; set; }

        [ExtenderControlProperty]
        [DefaultValue(5)]
        [ClientPropertyName("bubbleSizes")]
        public int BubbleSizes { get; set; }

        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("yAxisLineColor")]
        public string YAxisLineColor { get; set; }

        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("xAxisLineColor")]
        public string XAxisLineColor { get; set; }

        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("baseLineColor")]
        public string BaseLineColor { get; set; }

        [ExtenderControlProperty]
        [DefaultValue("#FFC652")]
        [ClientPropertyName("tooltipBackgroundColor")]
        public string TooltipBackgroundColor { get; set; }

        [ExtenderControlProperty]
        [DefaultValue("#0E426C")]
        [ClientPropertyName("tooltipFontColor")]
        public string TooltipFontColor { get; set; }

        [ExtenderControlProperty]
        [DefaultValue("#B85B3E")]
        [ClientPropertyName("tooltipBorderColor")]
        public string TooltipBorderColor { get; set; }

        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("xAxisLabel")]
        public string XAxisLabel { get; set; }

        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("yAxisLabel")]
        public string YAxisLabel { get; set; }

        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("bubbleLabel")]
        public string BubbleLabel { get; set; }

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