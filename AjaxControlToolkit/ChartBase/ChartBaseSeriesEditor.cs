#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;

namespace AjaxControlToolkit.Design {

    public class ChartBaseSeriesEditor<T> : CollectionEditor {

        public ChartBaseSeriesEditor(Type type)
            : base(type) {
        }

        protected override Type[] CreateNewItemTypes() {
            return new[] { typeof(T) };
        }

        protected override bool CanSelectMultipleInstances() {
            return false;
        }
    }

}
#pragma warning restore 1591