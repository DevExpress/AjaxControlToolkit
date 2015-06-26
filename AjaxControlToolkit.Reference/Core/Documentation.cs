using AjaxControlToolkit.Reference.Core.Parsing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AjaxControlToolkit.Reference.Core {

    public class Documentation {

        IDictionary<string, TypeDoc> _types;

        public void Add(IEnumerable<RawDoc> rawDocs) {

            foreach(var rawDoc in rawDocs)
                ProcessInfo(rawDoc.TargetNamePrefix, rawDoc.TargetFullName).Fill(rawDoc.Elements);
        }

        DocBase ProcessInfo(string targetNamePrefix, string fullName) {
            switch(targetNamePrefix) {
                case "T": {
                        return GetTypeByName(fullName);
                    }
                case "M": {
                        var info = new MethodDoc(fullName);
                        GetTypeByName(info.Namespace).AddMethod(info);
                        return info;
                    }
                case "P": {
                        var info = new PropertyDoc(fullName);
                        GetTypeByName(info.Namespace).AddProperty(info);
                        return info;
                    }
                case "E": {
                        var info = new EventDoc(fullName);
                        GetTypeByName(info.Namespace).AddEvent(info);
                        return info;
                    }
                case "cM": {
                        var info = new ClientMethodDoc(fullName);
                        GetTypeByName(info.Namespace).AddClientMethod(info);
                        return info;
                    }
                case "cP": {
                        var info = new ClientPropertyDoc(fullName);
                        GetTypeByName(info.Namespace).AddClientProperty(info);
                        return info;
                    }
            }

            throw new ArgumentException("Unknown info type", "fullName");
        }

        TypeDoc GetTypeByName(string typeName) {
            if(!_types.ContainsKey(typeName))
                _types.Add(typeName, new TypeDoc(typeName));

            return _types[typeName];
        }

        public Documentation() {
            _types = new Dictionary<string, TypeDoc>();
        }

        public IEnumerable<TypeDoc> Types {
            get { return _types.Values; }
        }
    }

}