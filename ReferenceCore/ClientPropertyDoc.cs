using AjaxControlToolkit.Reference.Core.Parsing;
using System.Collections.Generic;
using System.Xml.Linq;
using AjaxControlToolkit.ReferenceCore.Parsing;

namespace AjaxControlToolkit.Reference.Core {

    public class ClientEventDoc : DocBase {

        public string AddMethodName { get; set; }
        public string RemoveMethodName { get; set; }
        public string RaiseMethodName { get; set; }

        public ClientEventDoc(string fullName) : base(fullName) { }

        public override DocBase Fill(IEnumerable<XElement> values, ContentType contentType) {
            DocParser.Instance.FillInfo(this, values, contentType);
            return this;
        }
    }
}