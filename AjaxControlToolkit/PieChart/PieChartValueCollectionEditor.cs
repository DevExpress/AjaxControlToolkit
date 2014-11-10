using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit.Design {

    public class PieChartValueCollectionEditor : CollectionEditor {

        public PieChartValueCollectionEditor(Type type)
            : base(type) {
        }

        protected override Type[] CreateNewItemTypes() {
            return new[] { typeof(PieChartValue) };
        }

        protected override bool CanSelectMultipleInstances() {
            return false;
        }
    }
}
