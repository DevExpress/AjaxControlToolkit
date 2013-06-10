

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
    /// Signifies that this method should be exposed as a client callback 
    /// </summary>
    [AttributeUsage(AttributeTargets.Method, AllowMultiple=false, Inherited=true)]
    public sealed class ExtenderControlMethodAttribute : Attribute
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields", Justification="Exposing this for user convenience")]
        private static ExtenderControlMethodAttribute Yes = new ExtenderControlMethodAttribute(true);
        private static ExtenderControlMethodAttribute No = new ExtenderControlMethodAttribute(false);
        private static ExtenderControlMethodAttribute Default = No;

        #region [ Fields ]

        private bool _isScriptMethod;

        #endregion

        #region [ Constructors ]

        /// <summary>
        /// Initializes a new ExtenderControlMethodAttribute
        /// </summary>
        public ExtenderControlMethodAttribute()
            : this(true)
        {
        }

        /// <summary>
        /// Initializes a new ExtenderControlMethodAttribute
        /// </summary>
        /// <param name="isScriptMethod"></param>
        public ExtenderControlMethodAttribute(bool isScriptMethod)
        {
            _isScriptMethod = isScriptMethod;
        }

        #endregion

        #region [ Properties ]

        /// <summary>
        /// Whether this is a valid ScriptMethod
        /// </summary>
        public bool IsScriptMethod
        {
            get { return _isScriptMethod; }
        }

        #endregion

        #region [ Methods ]

        /// <summary>
        /// Tests for object equality
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public override bool Equals(object obj)
        {
            if (object.ReferenceEquals(obj, this))
            {
                return true;
            }
            ExtenderControlMethodAttribute other = obj as ExtenderControlMethodAttribute;
            if (other != null)
            {
                return other._isScriptMethod == _isScriptMethod;
            }
            return false;
        }

        /// <summary>
        /// Gets a hash code for this object
        /// </summary>
        /// <returns></returns>
        public override int GetHashCode()
        {
            return _isScriptMethod.GetHashCode();
        }

        /// <summary>
        /// Gets whether this is the default value for this attribute
        /// </summary>
        /// <returns></returns>
        public override bool IsDefaultAttribute()
        {
            return Equals(Default);
        }

        #endregion
    }
}
