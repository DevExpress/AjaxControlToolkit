using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web.UI;
using System.Drawing.Design;
using AjaxControlToolkit.Design;

namespace AjaxControlToolkit {

    [ClientCssResource(Constants.PieChartName)]
    [ClientScriptResource("Sys.Extended.UI.PieChart", Constants.PieChartName)]
    public class PieChart : ChartBase {
        List<PieChartValue> _values = new List<PieChartValue>();

        // Provide list of PieChartValue to client side. Need help from PieChartValues property 
        // for designer experience support, cause Editor always blocks the property
        // ability to provide values to client side as ExtenderControlProperty on run time.
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ExtenderControlProperty(true, true)]
        public List<PieChartValue> PieChartClientValues {
            get { return _values; }
        }

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