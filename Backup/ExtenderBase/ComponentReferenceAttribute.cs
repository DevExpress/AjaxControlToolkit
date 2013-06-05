

using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

namespace AjaxControlToolkit
{
    /// <summary>
    /// Signifies that this property references a ScriptComponent
    /// </summary>
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class ComponentReferenceAttribute : Attribute
    {
        public ComponentReferenceAttribute()
        {
        }
    }
}
