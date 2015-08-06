using AjaxControlToolkit.Reference.Core.Parsing;
using System.Collections.Generic;
using System.Xml.Linq;

namespace AjaxControlToolkit.Reference.Core {

    public class ClientPropertyDoc : DocBase {

        public string GetterName { get; set; }
        public string SetterName { get; set; }

        public ClientPropertyDoc(string fullName) : base(fullName) { }

        public override DocBase Fill(IEnumerable<XElement> values) {
            DocParser.Instance.FillInfo(this, values);
            return this;
        }
    }
}