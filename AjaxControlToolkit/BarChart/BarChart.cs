using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web.UI;
using System.Web;
using System.Drawing.Design;
using AjaxControlToolkit.Design;
using System.Web.UI.HtmlControls;

namespace AjaxControlToolkit {

    [Designer("AjaxControlToolkit.Design.BarChartDesigner, AjaxControlToolkit")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientCssResource(Constants.BarChartName)]
    [ClientScriptResource("Sys.Extended.UI.BarChart", Constants.BarChartName)]

    public class BarChart : ScriptControlBase {
        BarChartSeriesCollection barChartSeriesList = null;

        public BarChart()
            : base(true, HtmlTextWriterTag.Div) {
        }

        bool IsDesignMode {
            get { return (HttpContext.Current == null); }
        }

        [ExtenderControlProperty]
        [DefaultValue(null)]
        [ClientPropertyName("chartWidth")]
        public string ChartWidth { get; set; }

        [ExtenderControlProperty]
        [DefaultValue(null)]
        [ClientPropertyName("chartHeight")]
        public string ChartHeight { get; set; }

        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("chartTitle")]
        public string ChartTitle { get; set; }

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
        public BarChartSeriesCollection ClientSeries {
            get { return barChartSeriesList; }
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        [DefaultValue(null)]
        [NotifyParentProperty(true)]
        [Editor(typeof(BarChartSeriesCollectionEditor), typeof(UITypeEditor))]
        public BarChartSeriesCollection Series {
            get {
                if(barChartSeriesList == null)
                    barChartSeriesList = new BarChartSeriesCollection();
                return barChartSeriesList;
            }
        }

        [ExtenderControlProperty]
        [DefaultValue(BarChartType.Column)]
        [ClientPropertyName("chartType")]
        public BarChartType ChartType { get; set; }

        [ExtenderControlProperty]
        [DefaultValue("BarChart")]
        [ClientPropertyName("theme")]
        public string Theme { get; set; }

        [ExtenderControlProperty]
        [DefaultValue(9)]
        [ClientPropertyName("valueAxisLines")]
        public int ValueAxisLines { get; set; }

        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("chartTitleColor")]
        public string ChartTitleColor { get; set; }

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

        protected override void OnInit(EventArgs e) {
            base.OnInit(e);
            if(IsDesignMode)
                return;

            foreach(BarChartSeries barChartSeries in Series) {
                if(barChartSeries.Name == null || barChartSeries.Name.Trim() == "")
                    throw new Exception("Name is missing the BarChartSeries. Please provide a name in the BarChartSeries.");
            }
        }

        internal void CreateChilds() {
            Controls.Clear();
            CreateChildControls();
        }

        protected override void CreateChildControls() {
            GenerateHtmlInputControls();
        }

        protected string GenerateHtmlInputControls() {
            var parent = new HtmlGenericControl("div");
            parent.ID = "_ParentDiv";
            parent.Attributes.Add("style", "border-style:solid; border-width:1px;");
            Controls.Add(parent);
            return parent.InnerHtml;

        }
    }

}