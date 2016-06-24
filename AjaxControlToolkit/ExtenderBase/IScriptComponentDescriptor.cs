using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {
    public interface IScriptComponentDescriptor {
        string ClientID { get; }
        string ID { get; set; }
        string Type { get; set; }
        void AddComponentProperty(string name, string componentID);
        void AddElementProperty(string name, string elementID);
        void AddEvent(string name, string handler);
        void AddProperty(string name, object value);       
    }
}

