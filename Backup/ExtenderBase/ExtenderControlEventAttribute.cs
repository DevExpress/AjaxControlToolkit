

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
    /// Signifies that this Property should be exposed as a client-side event reference
    /// </summary>
    [AttributeUsage(AttributeTargets.Property, Inherited=true)]
    public sealed class ExtenderControlEventAttribute : Attribute
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1823:AvoidUnusedPrivateFields", Justification="Exposing this for user convenience")]
        private static ExtenderControlEventAttribute Yes = new ExtenderControlEventAttribute(true);
        private static ExtenderControlEventAttribute No = new ExtenderControlEventAttribute(false);
        private static ExtenderControlEventAttribute Default = No;

        #region [ Fields ]

        private bool _isScriptEvent;

        #endregion

        #region [ Constructors ]

        /// <summary>
        /// Initializes a new ExtenderControlEventAttribute
        /// </summary>
        public ExtenderControlEventAttribute()
            : this(true)
        {
        }

        /// <summary>
        /// Initializes a new ExtenderControlEventAttribute
        /// </summary>
        /// <param name="isScriptEvent"></param>
        public ExtenderControlEventAttribute(bool isScriptEvent)
        {
            _isScriptEvent = isScriptEvent;
        }

        #endregion

        #region [ Properties ]

        /// <summary>
        /// Whether this is a valid ScriptEvent
        /// </summary>
        public bool IsScriptEvent
        {
            get { return _isScriptEvent; }
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
            ExtenderControlEventAttribute other = obj as ExtenderControlEventAttribute;
            if (other != null)
            {
                return other._isScriptEvent == _isScriptEvent;
            }
            return false;
        }

        /// <summary>
        /// Gets a hash code for this object
        /// </summary>
        /// <returns></returns>
        public override int GetHashCode()
        {
            return _isScriptEvent.GetHashCode();
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
