using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit.Desgin {

    public class BubbleChartValueCollectionEditor : CollectionEditor {

        public BubbleChartValueCollectionEditor(Type type)
            : base(type) {
        }

        protected override Type[] CreateNewItemTypes() {
            return new[] { typeof(BubbleChartValue) };
        }

        protected override bool CanSelectMultipleInstances() {
            return false;
        }
    }

}
