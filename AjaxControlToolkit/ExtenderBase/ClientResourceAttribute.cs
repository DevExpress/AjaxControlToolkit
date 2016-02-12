#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {

    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public abstract class ClientResourceAttribute : Attribute {
        private int _loadOrder = 0;
        private string _resourcePath;

        public ClientResourceAttribute(string resourcePath) {
            if(resourcePath == null)
                throw new ArgumentNullException("resourcePath");            

            _resourcePath = resourcePath;
        }

        public string ResourcePath {
            get { return _resourcePath; }
        }

        public int LoadOrder {
            get { return _loadOrder; }
        }
    }

}

#pragma warning restore 1591