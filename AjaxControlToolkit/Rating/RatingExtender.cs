using System;
using System.ComponentModel;
using System.Globalization;
using System.Web.UI;

namespace AjaxControlToolkit {

    [ToolboxItem(false)]
    [TargetControlType(typeof(Rating))]
    [ClientScriptResource("Sys.Extended.UI.RatingBehavior", Constants.RatingName)]
    public class RatingExtender : ExtenderControlBase {
        public RatingExtender() {
            EnableClientState = true;
        }

        [ExtenderControlProperty(true, true)]
        [ClientPropertyName("_isServerControl")]
        public bool IsServerControl {
            get { return true; }
        }

        [ExtenderControlProperty]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool AutoPostBack {
            get { return GetPropertyValue("AutoPostback", false); }
            set { SetPropertyValue("AutoPostback", value); }
        }

        [DefaultValue(0)]
        [ExtenderControlProperty]
        public int Rating {
            get {
                var value = ClientState;
                if(value == null)
                    value = "0";

                return Int32.Parse(value, CultureInfo.InvariantCulture);
            }
            set { ClientState = value.ToString(CultureInfo.InvariantCulture); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        public string CallbackID {
            get { return GetPropertyValue("CallbackID", String.Empty); }
            set { SetPropertyValue("CallbackID", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        public string Tag {
            get { return GetPropertyValue("Tag", String.Empty); }
            set { SetPropertyValue("Tag", value); }
        }

        [DefaultValue(0)]
        [ExtenderControlProperty]
        public int RatingDirection {
            get { return GetPropertyValue("RatingDirection", 0); }
            set { SetPropertyValue("RatingDirection", value); }

        }

        [DefaultValue(5)]
        [ExtenderControlProperty]
        public int MaxRating {
            get { return GetPropertyValue("MaxRating", 5); }
            set { SetPropertyValue("MaxRating", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [RequiredProperty]
        public string StarCssClass {
            get { return GetPropertyValue("StarCssClass", String.Empty); }
            set { SetPropertyValue("StarCssClass", value); }
        }

        [DefaultValue(false)]
        [ExtenderControlProperty]
        public bool ReadOnly {
            get { return GetPropertyValue("ReadOnly", false); }
            set { SetPropertyValue("ReadOnly", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [RequiredProperty]
        public string FilledStarCssClass {
            get { return GetPropertyValue("FilledStarCssClass", String.Empty); }
            set { SetPropertyValue("FilledStarCssClass", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [RequiredProperty]
        public string EmptyStarCssClass {
            get { return GetPropertyValue("EmptyStarCssClass", String.Empty); }
            set { SetPropertyValue("EmptyStarCssClass", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [RequiredProperty]
        public string WaitingStarCssClass {
            get { return GetPropertyValue("WaitingStarCssClass", String.Empty); }
            set { SetPropertyValue("WaitingStarCssClass", value); }
        }
    }

}
