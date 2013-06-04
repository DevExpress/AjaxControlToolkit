using System;
using System.Collections.Generic;
using System.Text;

namespace AjaxControlToolkit
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1019:DefineAccessorsForAttributeArguments", Justification = "The composition of baseType and resourceName is available as ResourcePath")]
    public sealed class ClientCssResourceAttribute : Attribute
    {
        private string _resourcePath;
        private int _loadOrder;

        public ClientCssResourceAttribute(Type baseType, string resourceName)
        {
            if (baseType == null) throw new ArgumentNullException("baseType");
            if (resourceName == null) throw new ArgumentNullException("resourceName");

            string typeName = baseType.FullName;
            int lastDot = typeName.LastIndexOf('.');
            if (lastDot != -1)
            {
                typeName = typeName.Substring(0, lastDot);
            }
            _resourcePath = typeName + '.' + resourceName;
        }

        public ClientCssResourceAttribute(string fullResourceName)
        {
            if (fullResourceName == null) throw new ArgumentNullException("fullResourceName");
            _resourcePath = fullResourceName;
        }

        public string ResourcePath
        {
            get { return _resourcePath; }
        }

        public int LoadOrder
        {
            get { return _loadOrder; }
            set { _loadOrder = value; }
        }
    }
}
