using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.UI;

namespace AjaxControlToolkit {
    class ScriptComponentDescriptorWrapper : IScriptComponentDescriptor {
        ScriptComponentDescriptor _descriptor;

        public ScriptComponentDescriptorWrapper(ScriptComponentDescriptor descriptor) {
            _descriptor = descriptor;
        }

        public string ClientID {
            get { return _descriptor.ClientID; }
        }

        public string ID {
            get { return _descriptor.ID; }
            set { _descriptor.ID = value; }
        }

        public string Type {
            get { return _descriptor.Type; }
            set { _descriptor.Type = value; }
        }

        public void AddComponentProperty(string name, string componentID) {
            _descriptor.AddComponentProperty(name, componentID);
        }

        public void AddElementProperty(string name, string elementID) {
            _descriptor.AddElementProperty(name, elementID);
        }

        public void AddEvent(string name, string handler) {
            _descriptor.AddEvent(name, handler);
        }

        public void AddProperty(string name, object value) {
            _descriptor.AddProperty(name, value);
        }

        public void AddScriptProperty(string name, string script) {
            _descriptor.AddScriptProperty(name, script);
        }

    }
}
