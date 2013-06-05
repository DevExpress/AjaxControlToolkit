

using System;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.Globalization;

#region Assembly Resource Attribute
[assembly: System.Web.UI.WebResource("Rating.RatingBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Rating.RatingBehavior.debug.js", "text/javascript")]
#endregion

namespace AjaxControlToolkit
{
    [ToolboxItem(false)]
    [TargetControlType(typeof(Rating))]
    [ClientScriptResource("Sys.Extended.UI.RatingBehavior", "Rating.RatingBehavior.js")]
    public class RatingExtender : ExtenderControlBase
    {
        public RatingExtender()
        {
            EnableClientState = true;
        }

        [ExtenderControlProperty(true, true)]
        [ClientPropertyName("_isServerControl")]
        public bool IsServerControl {
            get {
                return true;
            }
        }

        [ExtenderControlProperty]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool AutoPostBack
        {
            get
            {
                return GetPropertyValue("AutoPostback", false);
            }
            set
            {
                SetPropertyValue("AutoPostback", value);
            }
        }

        [DefaultValue(0)]
        [ExtenderControlProperty]
        public int Rating
        {
            get
            {
                string value = ClientState;
                if (value == null)
                {
                    value = "0";
                }
                return Int32.Parse(value, CultureInfo.InvariantCulture);
            }
            set
            {
                ClientState = value.ToString(CultureInfo.InvariantCulture);
            }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string CallbackID
        {
            get { return GetPropertyValue("CallbackID", string.Empty); }
            set { SetPropertyValue("CallbackID", value); }
        }       

        [DefaultValue("")]
        [ExtenderControlProperty]
        public string Tag
        {
            get { return GetPropertyValue("Tag", string.Empty); }
            set { SetPropertyValue("Tag", value); }
        }

        [DefaultValue(0)]
        [ExtenderControlProperty]
        public int RatingDirection
        {
            get { return GetPropertyValue("RatingDirection", 0); }
            set { SetPropertyValue("RatingDirection", value); }

        }
        
        [DefaultValue(5)]
        [ExtenderControlProperty]
        public int MaxRating
        {
            get { return GetPropertyValue("MaxRating", 5); }
            set { SetPropertyValue("MaxRating", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [RequiredProperty]
        public string StarCssClass
        {
            get { return GetPropertyValue("StarCssClass", String.Empty); }
            set { SetPropertyValue("StarCssClass", value); }
        }

        [DefaultValue(false)]
        [ExtenderControlProperty]
        public bool ReadOnly
        {
            get { return GetPropertyValue("ReadOnly", false); }
            set { SetPropertyValue("ReadOnly", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [RequiredProperty]
        public string FilledStarCssClass
        {
            get { return GetPropertyValue("FilledStarCssClass", string.Empty); }
            set { SetPropertyValue("FilledStarCssClass", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [RequiredProperty]
        public string EmptyStarCssClass
        {
            get { return GetPropertyValue("EmptyStarCssClass", string.Empty); }
            set { SetPropertyValue("EmptyStarCssClass", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [RequiredProperty]
        public string WaitingStarCssClass
        {
            get { return GetPropertyValue("WaitingStarCssClass", string.Empty); }
            set { SetPropertyValue("WaitingStarCssClass", value); }
        }
     }
}


