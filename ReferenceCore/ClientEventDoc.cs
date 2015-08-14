using AjaxControlToolkit.Reference.Core.Parsing;
using System.Collections.Generic;
using System.Xml.Linq;
using AjaxControlToolkit.ReferenceCore.Parsing;

namespace AjaxControlToolkit.Reference.Core {

    public class ClientPropertyDoc : DocBase {

        public string GetterName { get; set; }
        public string SetterName { get; set; }

        public ClientPropertyDoc(string fullName) : base(fullName) { }

        public override DocBase Fill(IEnumerable<XElement> values, ContentType contentType) {
            DocParser.Instance.FillInfo(this, values, contentType);
            return this;
        }
    }
}