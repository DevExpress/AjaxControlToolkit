#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;

namespace AjaxControlToolkit.Design {

    public class MultiHandleSliderTargetsEditor : CollectionEditor {

        public MultiHandleSliderTargetsEditor(Type type)
            : base(type) {
        }

        protected override Type[] CreateNewItemTypes() {
            return new[] { typeof(MultiHandleSliderTarget) };
        }

        protected override bool CanSelectMultipleInstances() {
            return false;
        }
    }

}
#pragma warning restore 1591