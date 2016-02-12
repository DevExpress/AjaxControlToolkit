#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Globalization;
using System.Web.UI;

namespace AjaxControlToolkit {

    /// <summary>
    /// The Rating extender provides intuitive rating experience that allows users to select the
    /// number of stars that represents their rating. The page designer can specify the initial
    /// rating, the maximum rating to allow, the alignment and direction of stars, and custom
    /// styles for the different states a star can have. Rating also supports a ClientCallBack
    /// event that allows custom code to run after the user has rated something.
    /// </summary>
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
        /// True to cause a postback on a rating item click
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
        /// A current rating value
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
        /// ID of the callback
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("callbackID")]
        public string CallbackID {
            get { return GetPropertyValue("CallbackID", String.Empty); }
            set { SetPropertyValue("CallbackID", value); }
        }

        /// <summary>
        /// A custom parameter to pass to the ClientCallBack
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("tag")]
        public string Tag {
            get { return GetPropertyValue("Tag", String.Empty); }
            set { SetPropertyValue("Tag", value); }
        }

        /// <summary>
        /// Orientation of stars (LeftToRightTopToBottom or RightToLeftBottomToTop)
        /// </summary>
        [DefaultValue(0)]
        [ExtenderControlProperty]
        [ClientPropertyName("ratingDirection")]
        public int RatingDirection {
            get { return GetPropertyValue("RatingDirection", 0); }
            set { SetPropertyValue("RatingDirection", value); }

        }

        /// <summary>
        /// A maximum rating value
        /// </summary>
        [DefaultValue(5)]
        [ExtenderControlProperty]
        [ClientPropertyName("maxRating")]
        public int MaxRating {
            get { return GetPropertyValue("MaxRating", 5); }
            set { SetPropertyValue("MaxRating", value); }
        }

        /// <summary>
        /// A CSS class for a visible star
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
        /// Whether or not the rating can be changed
        /// </summary>
        [DefaultValue(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("readOnly")]
        public bool ReadOnly {
            get { return GetPropertyValue("ReadOnly", false); }
            set { SetPropertyValue("ReadOnly", value); }
        }

        /// <summary>
        /// A CSS class for star in filled mode
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
        /// A CSS class for a star in empty mode
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
        /// A CSS class for a star in waiting mode
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

#pragma warning restore 1591