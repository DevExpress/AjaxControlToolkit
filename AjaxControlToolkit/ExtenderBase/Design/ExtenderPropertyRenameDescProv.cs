using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace AjaxControlToolkit.Design {

    // This provider allows us to rename the extender provided property
    internal class ExtenderPropertyRenameDescProv<T> : FilterTypeDescriptionProvider<IComponent> where T : ExtenderControlBase {

        private ExtenderControlBaseDesigner<T> _owner;

        public ExtenderPropertyRenameDescProv(ExtenderControlBaseDesigner<T> owner, IComponent target)
            : base(target) {
            _owner = owner;
            FilterExtendedProperties = true;
        }

    }

}
