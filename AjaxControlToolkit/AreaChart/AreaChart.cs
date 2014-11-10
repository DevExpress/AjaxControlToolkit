using AjaxControlToolkit.Design;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing.Design;
using System.Linq;
using System.Web.UI;

namespace AjaxControlToolkit {

    [ClientCssResource(Constants.AreaChartName)]
    [ClientScriptResource("Sys.Extended.UI.AreaChart", Constants.AreaChartName)]
    public class AreaChart : ChartBase {
        AreaChartSeriesCollection areaChartSeriesList = null;

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
        public AreaChartSeriesCollection ClientSeries {
            get { return areaChartSeriesList; }
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        [DefaultValue(null)]
        [NotifyParentProperty(true)]
        [Editor(typeof(AreaChartSeriesCollectionEditor), typeof(UITypeEditor))]
        public AreaChartSeriesCollection Series {
            get {
                if(areaChartSeriesList == null)
                    areaChartSeriesList = new AreaChartSeriesCollection();
                return areaChartSeriesList;
            }
        }

        [ExtenderControlProperty]
        [DefaultValue(AreaChartType.Basic)]
        [ClientPropertyName("chartType")]
        public AreaChartType ChartType { get; set; }

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

        protected override void OnInit(EventArgs e) {
            base.OnInit(e);
            if(IsDesignMode)
                return;

            foreach(AreaChartSeries areaChartSeries in Series) {
                if(areaChartSeries.Name == null || areaChartSeries.Name.Trim() == "") {
                    throw new Exception("Name is missing in the AreaChartSeries. Please provide a name in the AreaChartSeries.");
                }
            }
        }

        // DescribeComponent creates propreties in ScriptComponentDescriptor for child controls in AreaChart.
        protected override void DescribeComponent(ScriptComponentDescriptor descriptor) {
            base.DescribeComponent(descriptor);
        }
    }

}