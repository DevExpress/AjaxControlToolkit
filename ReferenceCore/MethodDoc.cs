using AjaxControlToolkit.Reference.Core.Parsing;
using System.Collections.Generic;
using System.Xml.Linq;
using AjaxControlToolkit.ReferenceCore.Parsing;

namespace AjaxControlToolkit.Reference.Core {

    public class MethodDoc : DocBase {
        List<ParamInfo> _params = new List<ParamInfo>();

        public IEnumerable<ParamInfo> Params {
            get { return _params; }
        }

        public MethodDoc(string fullName) : base(fullName) { }

        public override DocBase Fill(IEnumerable<XElement> values, ContentType contentType) {
            DocParser.Instance.FillInfo(this, values, contentType);
            return this;
        }

        public void AddParam(string name, string typeName, string description) {
            _params.Add(new ParamInfo() { Name = name, Description = description, TypeName = typeName });
        }
    }
}