using AjaxControlToolkit.Reference.Core.Parsing;
using System.Collections.Generic;
using System.Xml.Linq;
using AjaxControlToolkit.ReferenceCore.Parsing;

namespace AjaxControlToolkit.Reference.Core {

    public class TypeDoc : DocBase {
        IList<MethodDoc> _methods;
        IList<EventDoc> _events;
        IList<PropertyDoc> _properties;
        IList<MethodDoc> _clientMethods;
        IList<ClientPropertyDoc> _clientProperties;
        IList<ClientEventDoc> _clientEvents;

        public TypeDoc(string fullName)
            : base(fullName) {
            _methods = new List<MethodDoc>();
            _events = new List<EventDoc>();
            _properties = new List<PropertyDoc>();
            _clientMethods = new List<MethodDoc>();
            _clientProperties = new List<ClientPropertyDoc>();
            _clientEvents = new List<ClientEventDoc>();
        }

        public IEnumerable<MethodDoc> Methods {
            get { return _methods; }
        }

        public IEnumerable<EventDoc> Events {
            get { return _events; }
        }

        public IEnumerable<PropertyDoc> Properties {
            get { return _properties; }
        }

        public IEnumerable<MethodDoc> ClientMethods {
            get { return _clientMethods; }
        }

        public IEnumerable<ClientPropertyDoc> ClientProperties {
            get { return _clientProperties; }
        }

        public IEnumerable<ClientEventDoc> ClientEvents {
            get { return _clientEvents; }
        }

        public void AddMethod(MethodDoc info) {
            _methods.Add(info);
        }

        public void AddEvent(EventDoc info) {
            _events.Add(info);
        }

        public void AddProperty(PropertyDoc info) {
            _properties.Add(info);
        }

        public void AddClientMethod(MethodDoc info) {
            _clientMethods.Add(info);
        }

        public void AddClientProperty(ClientPropertyDoc info) {
            _clientProperties.Add(info);
        }

        public void AddClientEvent(ClientEventDoc info) {
            _clientEvents.Add(info);
        }

        public override DocBase Fill(IEnumerable<XElement> values, ContentType contentType) {
            DocParser.Instance.FillInfo(this, values, contentType);
            return this;
        }
    }
}