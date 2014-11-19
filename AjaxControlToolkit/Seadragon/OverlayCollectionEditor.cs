using System;
using System.ComponentModel.Design;

namespace AjaxControlToolkit {

    public class OverlayCollectionEditor : CollectionEditor {

        public OverlayCollectionEditor(Type type)
            : base(type) {
        }

        protected override bool CanSelectMultipleInstances() {
            return false;
        }

        protected override Type[] CreateNewItemTypes() {
            return new Type[] { typeof(SeadragonFixedOverlay), typeof(SeadragonScalableOverlay) };
        }
    }

}