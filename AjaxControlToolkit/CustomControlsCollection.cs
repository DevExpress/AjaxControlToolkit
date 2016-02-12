#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {

    public class CustomControlsCollection : ConfigurationElementCollection {

        public override ConfigurationElementCollectionType CollectionType {
            get { return ConfigurationElementCollectionType.AddRemoveClearMap; }
        }

        protected override ConfigurationElement CreateNewElement() {
            return new CustomControlElement();
        }

        protected override object GetElementKey(ConfigurationElement element) {
            return ((CustomControlElement)element).Type;
        }
    }

}

#pragma warning restore 1591