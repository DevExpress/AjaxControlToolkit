

using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.Text;

namespace AjaxControlToolkit
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple=true)]
    public sealed class RequiredScriptAttribute : Attribute
    {
        private int _order;
        private Type _extenderType;
        private string _scriptName;

        public Type ExtenderType
        {
            get { return _extenderType; }
        }

        public string ScriptName
        {
            get { return _scriptName; }
        }

        public int LoadOrder
        {
            get { return _order; }
        }

        public RequiredScriptAttribute()
        {
        }

        public RequiredScriptAttribute(string scriptName)            
        {
            _scriptName = scriptName;
        }

        public RequiredScriptAttribute(Type extenderType): this(extenderType, 0) {
        }

        public RequiredScriptAttribute(Type extenderType, int loadOrder) 
        {
            _extenderType = extenderType;
            _order = loadOrder;
        }

        public override bool IsDefaultAttribute()
        {
            return _extenderType == null;
        }
    }
}
