using AjaxControlToolkit.Design;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing.Design;
using System.Linq;
using System.Web.UI;
using System.Drawing;

namespace AjaxControlToolkit {

    /// <summary>
    /// AreaChart control allows to render an area chart from one or more series of values.
    /// </summary>
    [ClientCssResource(Constants.AreaChartName)]
    [ClientScriptResource("Sys.Extended.UI.AreaChart", Constants.AreaChartName)]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.AreaChartName + Constants.IconPostfix)]
    public class AreaChart : ChartBase {
        List<AreaChartSeries> _series = new List<AreaChartSeries>();

        /// <summary>
        /// Comma-separated text for each category rendered below X axis
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("categoriesAxis")]
        public string CategoriesAxis { get; set; }

        /// <summary>
        /// List of series for client side
        /// </summary>
        // Provide list of series to client side. Need help from Series property 
        // for designer experience support, cause Editor always blocks the property
        // ability to provide values to client side as ExtenderControlProperty on run time.
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty(true, true)]
        [ClientPropertyName("clientSeries")]
        public List<AreaChartSeries> ClientSeries {
            get { return _series; }
        }

        /// <summary>
        /// List of series with designer support
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        [DefaultValue(null)]
        [NotifyParentProperty(true)]
        [Editor(typeof(ChartBaseSeriesEditor<AreaChartSeries>), typeof(UITypeEditor))]
        public List<AreaChartSeries> Series {
            get { return _series; }
        }

        /// <summary>
        /// Chart type. The default value is Basic
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(AreaChartType.Basic)]
        [ClientPropertyName("chartType")]
        public AreaChartType ChartType { get; set; }

        /// <summary>
        /// Value axis lines count. The default value is 9
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(9)]
        [ClientPropertyName("valueAxisLines")]
        public int ValueAxisLines { get; set; }

        /// <summary>
        /// Value axis line color
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("valueAxisLineColor")]
        public string ValueAxisLineColor { get; set; }

        /// <summary>
        /// Category axis line color
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("categoryAxisLineColor")]
        public string CategoryAxisLineColor { get; set; }

        /// <summary>
        /// Base line color
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("baseLineColor")]
        public string BaseLineColor { get; set; }

        protected override void OnInit(EventArgs e) {
            base.OnInit(e);
            if(IsDesignMode)
                return;

            foreach(AreaChartSeries areaChartSeries in Series) {
                if(String.IsNullOrWhiteSpace(areaChartSeries.Name))
                    throw new Exception("Name is missing in the AreaChartSeries. Please provide a name in the AreaChartSeries.");
            }
        }
    }

}