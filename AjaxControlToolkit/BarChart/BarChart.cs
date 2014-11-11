using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web.UI;
using System.Drawing.Design;
using AjaxControlToolkit.Design;

namespace AjaxControlToolkit {

    [ClientCssResource(Constants.BarChartName)]
    [ClientScriptResource("Sys.Extended.UI.BarChart", Constants.BarChartName)]
    public class BarChart : ChartBase {
        List<BarChartSeries> _series = new List<BarChartSeries>();

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
        public List<BarChartSeries> ClientSeries {
            get { return _series; }
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        [DefaultValue(null)]
        [NotifyParentProperty(true)]
        [Editor(typeof(ChartBaseSeriesEditor<BarChartSeries>), typeof(UITypeEditor))]
        public List<BarChartSeries> Series {
            get { return _series; }
        }

        [ExtenderControlProperty]
        [DefaultValue(BarChartType.Column)]
        [ClientPropertyName("chartType")]
        public BarChartType ChartType { get; set; }

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

            foreach(BarChartSeries barChartSeries in Series) {
                if(barChartSeries.Name == null || barChartSeries.Name.Trim() == "")
                    throw new Exception("Name is missing the BarChartSeries. Please provide a name in the BarChartSeries.");
            }
        }
    }

}