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
        /// Provides list of PieChartValue to client side
        /// </summary>
        /// <remarks>
        /// Need help from PieChartValues property for designer experience support,
        /// cause Editor always blocks the property ability to provide values to
        /// client side as ExtenderControlProperty on run time
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
        /// List of PieChartValue
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