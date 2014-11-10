using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit.Design {

    public class BarChartSeriesCollectionEditor : CollectionEditor {

        public BarChartSeriesCollectionEditor(Type type)
            : base(type) {
        }

        protected override Type[] CreateNewItemTypes() {
            return new[] { typeof(BarChartSeries) };
        }

        protected override bool CanSelectMultipleInstances() {
            return false;
        }
    }

}
