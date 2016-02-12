#pragma warning disable 1591
using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    [ParseChildren(true), PersistChildren(false)]
    public class MultiHandleSliderTarget {
        string _controlID,
                _handleCssClass;
        int _decimals, 
            _offset;

        [ExtenderControlProperty]
        [Description("Sets the ID of the control that is bound to the location of this handle.")]
        [IDReferenceProperty(typeof(WebControl))]
        [NotifyParentProperty(true)]
        public string ControlID {
            get { return _controlID; }
            set { _controlID = value; }
        }

        [ExtenderControlProperty]
        [Description("Sets the style of the handle associated with the MultiHandleSliderTarget, if custom styles are used.")]
        [DefaultValue("")]
        [NotifyParentProperty(true)]
        public string HandleCssClass {
            get { return _handleCssClass; }
            set { _handleCssClass = value; }
        }

        [ExtenderControlProperty]
        [Description("Sets the number of decimal places to store with the value.")]
        [DefaultValue(0)]
        [NotifyParentProperty(true)]
        public int Decimals {
            get { return _decimals; }
            set { _decimals = value; }
        }

        // Sets the number of pixels to offset the width of the handle, for handles with transparent space.
        [ExtenderControlProperty]
        [Description("Sets the number of pixels to offset the width of the handle, for handles with transparent space.")]
        [DefaultValue(0)]
        [NotifyParentProperty(true)]
        public int Offset {
            get { return _offset; }
            set { _offset = value; }
        }
    }

}

#pragma warning restore 1591