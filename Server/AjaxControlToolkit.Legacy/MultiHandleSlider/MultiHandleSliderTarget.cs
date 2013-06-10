

using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit
{
    /// <summary>
    /// A description for a control that is bound to the effects of a <see cref="MultiHandleSliderExtender"/>.
    /// </summary>
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Multi")]
    [ParseChildren(true)]
    [PersistChildren(false)]
    public class MultiHandleSliderTarget
    {
        private string _controlID;
        private string _handleCssClass;
        private int _decimals;
        private int _offset;

        #region Properties

        /// <summary>
        /// Sets the ID of the control that is bound to the location of this handle.
        /// </summary>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1709:IdentifiersShouldBeCasedCorrectly", MessageId = "ID")]
        [ExtenderControlProperty]
        [Description("Sets the ID of the control that is bound to the location of this handle.")]
        [IDReferenceProperty(typeof(WebControl))]
        [NotifyParentProperty(true)]
        public string ControlID
        {
            get
            {
                return _controlID;
            }
            set
            {
                _controlID = value;
            }
        }

        /// <summary>
        /// Sets the style of the handle associated with this <see cref="MultiHandleSliderTarget" />, if custom styles are used.
        /// </summary>
        [ExtenderControlProperty]
        [Description("Sets the style of the handle associated with the MultiHandleSliderTarget, if custom styles are used.")]
        [DefaultValue("")]
        [NotifyParentProperty(true)]
        public string HandleCssClass
        {
            get
            {
                return _handleCssClass;
            }
            set
            {
                _handleCssClass = value;
            }
        }

        [ExtenderControlProperty]
        [Description("Sets the number of decimal places to store with the value.")]
        [DefaultValue(0)]
        [NotifyParentProperty(true)]
        public int Decimals
        {
            get
            {
                return _decimals;
            }
            set
            {
                _decimals = value;
            }
        }

        /// <summary>
        /// Sets the number of pixels to offset the width of the handle, for handles with transparent space.
        /// </summary>
        [ExtenderControlProperty]
        [Description("Sets the number of pixels to offset the width of the handle, for handles with transparent space.")]
        [DefaultValue(0)]
        [NotifyParentProperty(true)]
        public int Offset
        {
            get
            {
                return _offset;
            }
            set
            {
                _offset = value;
            }
        }
        #endregion
    }
}
