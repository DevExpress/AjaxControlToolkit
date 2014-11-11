using AjaxControlToolkit.Design;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing.Design;
using System.Linq;
using System.Text;
using System.Web.UI;
using System.Web.UI.HtmlControls;

namespace AjaxControlToolkit {

    [ClientCssResource(Constants.LineChartName)]
    [ClientScriptResource("Sys.Extended.UI.LineChart", Constants.LineChartName)]
    public class LineChart : ChartBase {
        List<LineChartSeries> _series = new List<LineChartSeries>();

        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("categoriesAxis")]
        public string CategoriesAxis { get; set; }

        // Provide list of series to client side. Need help from Series property 
        // for designer experience support, cause Editor always blocks the property
        // ability to provide values to client side as ExtenderControlProperty on run time.
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty(true, true)]
        public List<LineChartSeries> ClientSeries {
            get { return _series; }
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        [DefaultValue(null)]
        [NotifyParentProperty(true)]
        [Editor(typeof(ChartBaseSeriesEditor<LineChartSeries>), typeof(UITypeEditor))]
        public List<LineChartSeries> Series {
            get { return _series; }
        }

        [ExtenderControlProperty]
        [DefaultValue(LineChartType.Basic)]
        [ClientPropertyName("chartType")]
        public LineChartType ChartType { get; set; }

        [ExtenderControlProperty]
        [DefaultValue(9)]
        [ClientPropertyName("valueAxisLines")]
        public int ValueAxisLines { get; set; }

        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("valueAxisLineColor")]
        public string ValueAxisLineColor { get; set; }

        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("categoryAxisLineColor")]
        public string CategoryAxisLineColor { get; set; }

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
        [ClientPropertyName("areaDataLabel")]
        public string AreaDataLabel { get; set; }

        protected override void OnInit(EventArgs e) {
            base.OnInit(e);
            if(IsDesignMode)
                return;

            foreach(LineChartSeries lineChartSeries in Series) {
                if(String.IsNullOrWhiteSpace(lineChartSeries.Name))
                    throw new Exception("Name is missing in the LineChartSeries. Please provide a name in the LineChartSeries.");
            }
        }

        protected override void CreateChildControls() {
            var parent = new HtmlGenericControl("div");
            parent.ID = "_ParentDiv";
            parent.Attributes.Add("style", "border-style:solid; border-width:1px;");
            var sbScript = new StringBuilder();
            sbScript.Append("<script>");

            sbScript.Append("function init(evt) { ");
            sbScript.Append("    if ( window.svgDocument == null ) { ");
            sbScript.Append("        gDocument = evt.target.ownerDocument;");
            sbScript.Append("    } ");
            sbScript.Append("} ");

            sbScript.Append("function ShowTooltip(me, evt, data, areaDataLabel) { ");
            sbScript.Append(String.Format("    var tooltipDiv = document.getElementById('{0}_tooltipDiv');", ClientID));
            sbScript.Append("    tooltipDiv.innerHTML = String.format('{0}{1}', data, areaDataLabel) ;");
            sbScript.Append("    tooltipDiv.style.top = evt.pageY - 25 + 'px';");
            sbScript.Append("    tooltipDiv.style.left = evt.pageX + 20 + 'px';");
            sbScript.Append("    tooltipDiv.style.visibility = 'visible';");
            sbScript.Append("    me.style.strokeWidth = '5';");
            sbScript.Append("} ");

            sbScript.Append("function HideTooltip(me, evt) { ");
            sbScript.Append(String.Format("    var tooltipDiv = document.getElementById('{0}_tooltipDiv');", ClientID));
            sbScript.Append("    tooltipDiv.innerHTML = '';");
            sbScript.Append("    tooltipDiv.style.visibility = 'hidden';");
            sbScript.Append("    me.style.strokeWidth = '2';");
            sbScript.Append("} ");

            sbScript.Append("</script>");
            parent.InnerHtml = sbScript.ToString();
            Controls.Add(parent);
        }
    }

}