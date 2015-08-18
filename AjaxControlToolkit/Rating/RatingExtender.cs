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

        /// <summary>
        /// True to cause a postback on rating item click.
        /// </summary>
        [ExtenderControlProperty]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [ClientPropertyName("autoPostBack")]
        public bool AutoPostBack {
            get { return GetPropertyValue("AutoPostback", false); }
            set { SetPropertyValue("AutoPostback", value); }
        }

        /// <summary>
        /// Current rating value.
        /// </summary>
        [DefaultValue(0)]
        [ExtenderControlProperty]
        [ClientPropertyName("rating")]
        public int Rating {
            get {
                var value = ClientState;
                if(value == null)
                    value = "0";

                return Int32.Parse(value, CultureInfo.InvariantCulture);
            }
            set { ClientState = value.ToString(CultureInfo.InvariantCulture); }
        }

        /// <summary>
        /// Callback ID.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("callbackID")]
        public string CallbackID {
            get { return GetPropertyValue("CallbackID", String.Empty); }
            set { SetPropertyValue("CallbackID", value); }
        }

        /// <summary>
        /// A custom parameter to pass to the ClientCallBack.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("tag")]
        public string Tag {
            get { return GetPropertyValue("Tag", String.Empty); }
            set { SetPropertyValue("Tag", value); }
        }

        /// <summary>
        /// Orientation of the stars (LeftToRightTopToBottom or RightToLeftBottomToTop).
        /// </summary>
        [DefaultValue(0)]
        [ExtenderControlProperty]
        [ClientPropertyName("ratingDirection")]
        public int RatingDirection {
            get { return GetPropertyValue("RatingDirection", 0); }
            set { SetPropertyValue("RatingDirection", value); }

        }

        /// <summary>
        /// Maximum rating value.
        /// </summary>
        [DefaultValue(5)]
        [ExtenderControlProperty]
        [ClientPropertyName("maxRating")]
        public int MaxRating {
            get { return GetPropertyValue("MaxRating", 5); }
            set { SetPropertyValue("MaxRating", value); }
        }

        /// <summary>
        /// CSS class for a visible star.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [RequiredProperty]
        [ClientPropertyName("starCssClass")]
        public string StarCssClass {
            get { return GetPropertyValue("StarCssClass", String.Empty); }
            set { SetPropertyValue("StarCssClass", value); }
        }

        /// <summary>
        /// Whether or not the rating can be changed.
        /// </summary>
        [DefaultValue(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("readOnly")]
        public bool ReadOnly {
            get { return GetPropertyValue("ReadOnly", false); }
            set { SetPropertyValue("ReadOnly", value); }
        }

        /// <summary>
        /// CSS class for star in filled mode.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [RequiredProperty]
        [ClientPropertyName("filledStarCssClass")]
        public string FilledStarCssClass {
            get { return GetPropertyValue("FilledStarCssClass", String.Empty); }
            set { SetPropertyValue("FilledStarCssClass", value); }
        }

        /// <summary>
        /// CSS class for a star in empty mode.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [RequiredProperty]
        [ClientPropertyName("emptyStarCssClass")]
        public string EmptyStarCssClass {
            get { return GetPropertyValue("EmptyStarCssClass", String.Empty); }
            set { SetPropertyValue("EmptyStarCssClass", value); }
        }

        /// <summary>
        /// CSS class for a star in waiting mode.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [RequiredProperty]
        [ClientPropertyName("waitingStarCssClass")]
        public string WaitingStarCssClass {
            get { return GetPropertyValue("WaitingStarCssClass", String.Empty); }
            set { SetPropertyValue("WaitingStarCssClass", value); }
        }
    }

}
