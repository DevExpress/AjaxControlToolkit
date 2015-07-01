using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {

    class CustomControlElement : ConfigurationElement {

        [ConfigurationProperty("type", IsRequired = true, IsKey = true)]
        public string Type {
            get { return (string)this["type"]; }
            set { this["type"] = value; }
        }
    }

}
