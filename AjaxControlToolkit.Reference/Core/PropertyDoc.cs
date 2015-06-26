using AjaxControlToolkit.Reference.Core.Parsing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Linq;

namespace AjaxControlToolkit.Reference.Core {

    public class PropertyDoc : DocBase {

        public PropertyDoc(string fullName) : base(fullName) { }

        public override DocBase Fill(IEnumerable<XElement> values) {
            DocParser.Instance.FillInfo(this, values);
            return this;
        }
    }

}