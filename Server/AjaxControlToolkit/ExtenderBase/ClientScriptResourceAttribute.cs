

using System;
using System.Collections.Generic;
using System.Text;

namespace AjaxControlToolkit
{
    /// <summary>
    /// Associates a client script resource with an extender class.
    /// This allows the extender to find it's associated script and what
    /// names and prefixes with which to reference it.
    /// </summary>
    /// 
    [AttributeUsage(AttributeTargets.Class, AllowMultiple=true)]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1019:DefineAccessorsForAttributeArguments", Justification = "The composition of baseType, resourceName, and fullResourceName is available as ResourcePath")]
    public sealed class ClientScriptResourceAttribute : Attribute
    {
        private string _resourcePath;
        private string _componentType;
        private int     _loadOrder;
        
        /// <summary>
        /// The component type name to use when referencing the component class in XML.
        /// If the XML reference is "<myns:Foo/>", the component type is "Foo".
        /// </summary>        
        public string ComponentType
        {
            get { return _componentType; }
            set { _componentType = value; }
        }

        public int LoadOrder
        {
            get { return _loadOrder; }
            set { _loadOrder = value; }
        }
        
        /// <summary>
        /// This is the path to the resource in the assembly.  This is usually defined as
        /// [default namespace].[Folder name].FileName.  In a project called "ControlLibrary1", a
        /// JScript file called Foo.js in the "Script" subdirectory would be named "ControlLibrary1.Script.Foo.js" by default.
        /// </summary>
        public string ResourcePath
        {
            get { return _resourcePath; }
            set { _resourcePath = value; }
        }

        public ClientScriptResourceAttribute()
        {
        }

        /// <summary>
        /// Called from other constructors to set the prefix and the name.
        /// </summary>
        /// <param name="componentType">The name given to the class in the Web.TypeDescriptor.addType call</param>        
        public ClientScriptResourceAttribute(string componentType)
        {               
            _componentType = componentType;
        }

        /// <summary>
        /// Associates a client script resource with the class.
        /// </summary>
        /// <param name="componentType">The name given to the class in the Web.TypeDescriptor.addType call</param>
        /// <param name="baseType">A Type that lives in the same folder as the script file</param>
        /// <param name="resourceName">The name of the script file itself (e.g. 'foo.cs')</param>
        public ClientScriptResourceAttribute(string componentType, Type baseType, string resourceName){
            if (baseType == null)
                throw new ArgumentNullException("baseType");
            if (resourceName == null)
                throw new ArgumentNullException("resourceName");
            string typeName = baseType.FullName;

            int lastDot = typeName.LastIndexOf('.');

            if (lastDot != -1) {
                typeName = typeName.Substring(0, lastDot);
            }

            ResourcePath = typeName + "." + resourceName;
            this._componentType = componentType;
        }

        /// <summary>
        /// Associates a client script resource with the class.
        /// </summary>
        /// <param name="componentType">The name given to the class in the Web.TypeDescriptor.addType call</param>
        /// <param name="fullResourceName">The name of the script resource, e.g. 'ControlLibrary1.FooExtender.Foo.js'</param>       
        public ClientScriptResourceAttribute(string componentType, string fullResourceName)
            : this(componentType)
        {
            if (fullResourceName == null) throw new ArgumentNullException("fullResourceName");
            ResourcePath = fullResourceName;
        }

        /// <summary>
        /// Associates a client script resource with the class.
        /// </summary>
        /// <param name="componentType">The name given to the class in the Web.TypeDescriptor.addType call</param>
        /// <param name="fullResourceName">The name of the script resource, e.g. 'ControlLibrary1.FooExtender.Foo.js'</param>
        /// <param name="useUnMinifiedVersionForDebugMode">If set to true then resource path will goes to *.debug.js file instead on DEBUG mode. You must provide *.debug.js version of your script to enable this mode.</param>
        public ClientScriptResourceAttribute(string componentType, string fullResourceName, bool useUnMinifiedVersionForDebugMode)
            : this(componentType)
        {
            if (fullResourceName == null) throw new ArgumentNullException("fullResourceName");
#if(DEBUG)
            ResourcePath = fullResourceName;
            var lastDot = fullResourceName.LastIndexOf(".js");
            if (useUnMinifiedVersionForDebugMode && lastDot > 0)
            {
                ResourcePath = fullResourceName.Substring(0, lastDot) + ".debug.js";
            }
            else
            {
                ResourcePath = fullResourceName;
            }
#else
            ResourcePath = fullResourceName;
#endif
        }

        public override bool IsDefaultAttribute()
        {
            return ComponentType == null && ResourcePath == null;
        }
    }
}
