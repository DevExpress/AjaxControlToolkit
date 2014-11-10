using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit.Design {

    public class AreaChartSeriesCollectionEditor : CollectionEditor {

        public AreaChartSeriesCollectionEditor(Type type)
            : base(type) {
        }

        protected override Type[] CreateNewItemTypes() {
            return new[] { typeof(AreaChartSeries) };
        }

        protected override bool CanSelectMultipleInstances() {
            return false;
        }
    }
}
