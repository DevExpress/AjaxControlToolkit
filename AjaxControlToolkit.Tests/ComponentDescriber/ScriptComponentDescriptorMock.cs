using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.UI;

namespace AjaxControlToolkit.Tests {
    public class ScriptComponentDescriptorMock : IScriptComponentDescriptor {

        Dictionary<string, object> _properties = new Dictionary<string, object>();
        Dictionary<string, object> _elementProperties = new Dictionary<string, object>();
        Dictionary<string, object> _eventProperties = new Dictionary<string, object>();

        public Dictionary<string, object> Properties {
            get { return _properties; }
        }

        public Dictionary<string, object> ElementProperties {
            get { return _elementProperties; }
        }

        public Dictionary<string, object> EventProperties {
            get { return _eventProperties; }
        }

        #region IScriptComponentDescriptor Members

        public string ClientID {
            get { throw new NotImplementedException(); }
        }

        public string ID {
            get {
                throw new NotImplementedException();
            }
            set {
                throw new NotImplementedException();
            }
        }

        public string Type {
            get {
                throw new NotImplementedException();
            }
            set {
                throw new NotImplementedException();
            }
        }

        public void AddComponentProperty(string name, string componentID) {
            throw new NotImplementedException();
        }

        public void AddElementProperty(string name, string elementID) {
            _elementProperties.Add(name, elementID);
        }

        public void AddEvent(string name, string handler) {
            _eventProperties.Add(name, handler);
        }

        public void AddProperty(string name, object value) {
            _properties.Add(name, value);
        }

        public void AddScriptProperty(string name, string script) {
            throw new NotImplementedException();
        }

        #endregion
    }
}
