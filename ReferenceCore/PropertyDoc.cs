using AjaxControlToolkit.Reference.Core.Parsing;
using System.Collections.Generic;
using System.Xml.Linq;
using AjaxControlToolkit.ReferenceCore.Parsing;

namespace AjaxControlToolkit.Reference.Core {

    public class PropertyDoc : DocBase {

        public PropertyDoc(string fullName) : base(fullName) { }

        public override DocBase Fill(IEnumerable<XElement> values, ContentType contentType) {
            DocParser.Instance.FillInfo(this, values, contentType);
            return this;
        }
    }
}