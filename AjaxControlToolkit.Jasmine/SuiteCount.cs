using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AjaxControlToolkit.Jasmine {
    public class SuiteCount {
        public string name;
        public int specQty;

        public SuiteCount(string name, int specQty) {
            this.name = name;
            this.specQty = specQty;
        }
    }
}