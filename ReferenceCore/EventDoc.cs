using AjaxControlToolkit.Reference.Core.Parsing;
using System.Collections.Generic;
using System.Xml.Linq;

namespace AjaxControlToolkit.Reference.Core {

    public class EventDoc : DocBase {

        public EventDoc(string fullName) : base(fullName) { }

        public override DocBase Fill(IEnumerable<XElement> values) {
            DocParser.Instance.FillInfo(this, values);
            return this;
        }
    }
}