using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit.Design {

    public class LineChartSeriesCollectionEditor : CollectionEditor {

        public LineChartSeriesCollectionEditor(Type type)
            : base(type) {
        }

        protected override Type[] CreateNewItemTypes() {
            return new[] { typeof(LineChartSeries) };
        }

        protected override bool CanSelectMultipleInstances() {
            return false;
        }
    }

}
