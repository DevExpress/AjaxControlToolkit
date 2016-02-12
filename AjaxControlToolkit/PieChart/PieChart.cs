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
    /// The PieChart control enables you to render a pie chart from one or more PieChartValues.
    /// This control is compatible with any browser which supports SVG including Internet Explorer 9 and above.
    /// </summary>
    [ClientCssResource(Constants.PieChartName)]
    [ClientScriptResource("Sys.Extended.UI.PieChart", Constants.PieChartName)]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.PieChartName + Constants.IconPostfix)]
    public class PieChart : ChartBase {
        List<PieChartValue> _values = new List<PieChartValue>();

        /// <summary>
        /// Provides the list of PieChartValues to the client side
        /// </summary>
        /// <remarks>
        /// Needs help from the PieChartValues property for designer experience support,
        /// because Editor always blocks the property's ability to provide values to
        /// the client side as ExtenderControlProperty does at runtime
        /// </remarks>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty(true, true)]
        [ClientPropertyName("pieChartClientValues")]
        public List<PieChartValue> PieChartClientValues {
            get { return _values; }
        }

        /// <summary>
        /// A list of PieChartValues
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Visible)]
        [DefaultValue(null)]
        [NotifyParentProperty(true)]
        [Editor(typeof(ChartBaseSeriesEditor<PieChartValue>), typeof(UITypeEditor))]
        public List<PieChartValue> PieChartValues {
            get { return _values; }
        }

        protected override void OnInit(EventArgs e) {
            base.OnInit(e);
            if(IsDesignMode)
                return;

            foreach(PieChartValue pieChartValue in PieChartValues) {
                if(String.IsNullOrWhiteSpace(pieChartValue.Category))
                    throw new Exception("Category is missing in the PieChartValue. Please provide a Category in the PieChartValue.");
            }
        }
    }

}
#pragma warning restore 1591