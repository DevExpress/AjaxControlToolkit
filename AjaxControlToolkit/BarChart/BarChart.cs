#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web.UI;
using System.Drawing.Design;
using AjaxControlToolkit.Design;
using System.Drawing;

namespace AjaxControlToolkit {

    /// <summary>
    /// The BarChart control enables you to render a bar chart from one or more series of values.  
    /// </summary>
    [ClientCssResource(Constants.BarChartName)]
    [ClientScriptResource("Sys.Extended.UI.BarChart", Constants.BarChartName)]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.BarChartName + Constants.IconPostfix)]
    public class BarChart : ChartBase {
        List<BarChartSeries> _series = new List<BarChartSeries>();

        /// <summary>
        /// This is a required property. You need to provide a set of values for
        /// the category axis to create a bar chart
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("categoriesAxis")]
        public string CategoriesAxis { get; set; }

        /// <summary>
        /// Provides a list of series to the client side. 
        /// The Values property is required for designer experience support, 
        /// because the editor always prevents providing values to the client side as ExtenderControlProperty at runtime.
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty(true, true)]
        [ClientPropertyName("clientSeries")]
        public List<BarChartSeries> ClientSeries {
            get { return _series; }
        }

        /// <summary>
        /// A list of series.
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        [DefaultValue(null)]
        [NotifyParentProperty(true)]
        [Editor(typeof(ChartBaseSeriesEditor<BarChartSeries>), typeof(UITypeEditor))]
        public List<BarChartSeries> Series {
            get { return _series; }
        }

        /// <summary>
        /// A type of bar charts including Column, StackedColumn, Bar, and StackedBar.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(BarChartType.Column)]
        [ClientPropertyName("chartType")]
        public BarChartType ChartType { get; set; }

        /// <summary>
        /// Interval size for the value axis line.
        /// The default is 9
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(9)]
        [ClientPropertyName("valueAxisLines")]
        public int ValueAxisLines { get; set; }

        /// <summary>
        /// A color of the value axis lines.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("valueAxisLineColor")]
        public string ValueAxisLineColor { get; set; }

        /// <summary>
        /// A color of the category axis lines.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("categoryAxisLineColor")]
        public string CategoryAxisLineColor { get; set; }

        /// <summary>
        /// A color of the base lines of the chart.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("baseLineColor")]
        public string BaseLineColor { get; set; }

        protected override void OnInit(EventArgs e) {
            base.OnInit(e);
            if(IsDesignMode)
                return;

            foreach(BarChartSeries barChartSeries in Series) {
                if(String.IsNullOrWhiteSpace(barChartSeries.Name))
                    throw new Exception("Name is missing the BarChartSeries. Please provide a name in the BarChartSeries.");
            }
        }
    }

}
#pragma warning restore 1591