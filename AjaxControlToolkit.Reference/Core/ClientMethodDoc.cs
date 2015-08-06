using AjaxControlToolkit.Reference.Core.Parsing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.Linq;

namespace AjaxControlToolkit.Reference.Core {

    public class ClientMethodDoc : DocBase, IMethodDoc {
        List<ParamInfo> _params = new List<ParamInfo>();

        public IEnumerable<ParamInfo> Params {
            get { return _params; }
        }

        public ClientMethodDoc(string fullName) : base(fullName) { }

        public override DocBase Fill(IEnumerable<XElement> values) {
            DocParser.Instance.FillInfo(this, values);
            return this;
        }

        public void AddParam(string name, string typeName, string description) {
            _params.Add(new ParamInfo() { Name = name, Description = description, TypeName = typeName });
        }
    }

}