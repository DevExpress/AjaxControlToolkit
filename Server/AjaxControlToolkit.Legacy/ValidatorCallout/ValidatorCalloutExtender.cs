

using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

[assembly: System.Web.UI.WebResource("ValidatorCallout.ValidatorCalloutBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("ValidatorCallout.ValidatorCalloutBehavior.debug.js", "text/javascript")]
[assembly: WebResource("ValidatorCallout.ValidatorCallout.css", "text/css", PerformSubstitution = true)]
[assembly: WebResource("ValidatorCallout.alert-large.gif", "image/gif")]
[assembly: WebResource("ValidatorCallout.alert-small.gif", "image/gif")]
[assembly: WebResource("ValidatorCallout.close.gif", "image/gif")]

namespace AjaxControlToolkit
{
    [Designer("AjaxControlToolkit.ValidatorCalloutDesigner, AjaxControlToolkit")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(PopupExtender))]
    [RequiredScript(typeof(AnimationExtender))]
    [TargetControlType(typeof(IValidator))]
    [ClientCssResource("ValidatorCallout.ValidatorCallout.css")]
    [ClientScriptResource("Sys.Extended.UI.ValidatorCalloutBehavior", "ValidatorCallout.ValidatorCalloutBehavior.js")]
    [ToolboxItem(Utility.ToolBoxItemTypeName)]
    [ToolboxBitmap(typeof(ValidatorCalloutExtender), "ValidatorCallout.ValidatorCallout.ico")]
    public class ValidatorCalloutExtender : AnimationExtenderControlBase
    {
        /// <summary>
        /// Constructs a new ValidatorCalloutExtender.
        /// </summary>
        public ValidatorCalloutExtender()
        {
            EnableClientState = true;
        }

        [DefaultValue("")]
        [UrlProperty]
        [ExtenderControlProperty]
        [ClientPropertyName("warningIconImageUrl")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification = "Using string to avoid Uri complications")]
        public string WarningIconImageUrl
        {
            get { return GetPropertyValue("WarningIconImageUrl", (string)null) ?? (DesignMode ? "" : Page.ClientScript.GetWebResourceUrl(typeof(ValidatorCalloutExtender), "ValidatorCallout.alert-large.gif")); }
            set { SetPropertyValue("WarningIconImageUrl", value); }
        }

        [DefaultValue("")]
        [UrlProperty]
        [ExtenderControlProperty]
        [ClientPropertyName("closeImageUrl")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1056:UriPropertiesShouldNotBeStrings", Justification = "Using string to avoid Uri complications")]
        public string CloseImageUrl
        {
            get { return GetPropertyValue("CloseImageUrl", (string)null) ?? (DesignMode ? "" : Page.ClientScript.GetWebResourceUrl(typeof(ValidatorCalloutExtender), "ValidatorCallout.close.gif")); }
            set { SetPropertyValue("CloseImageUrl", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("cssClass")]
        public string CssClass
        {
            get { return GetPropertyValue("CssClass", string.Empty); }
            set { SetPropertyValue("CssClass", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("highlightCssClass")]
        public string HighlightCssClass
        {
            get { return GetPropertyValue("HighlightCssClass", string.Empty); }
            set { SetPropertyValue("HighlightCssClass", value); }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("popupPosition")]
        [DefaultValue(ValidatorCalloutPosition.Right)]
        [Description("Indicates where you want the ValidatorCallout displayed.")]
        public virtual ValidatorCalloutPosition PopupPosition
        {
            get { return GetPropertyValue("PopupPosition", ValidatorCalloutPosition.Right); }
            set { SetPropertyValue("PopupPosition", value); }
        }

        [DefaultValue(typeof(Unit), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("width")]
        public Unit Width
        {
            get { return GetPropertyValue("Width", Unit.Empty); }
            set { SetPropertyValue("Width", value); }
        }

        /// <summary>
        /// OnShow animation
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("onShow")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnShow
        {
            get { return GetAnimation(ref _onShow, "OnShow"); }
            set { SetAnimation(ref _onShow, "OnShow", value); }
        }
        private Animation _onShow;

        /// <summary>
        /// OnHide animation
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("onHide")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnHide
        {
            get { return GetAnimation(ref _onHide, "OnHide"); }
            set { SetAnimation(ref _onHide, "OnHide", value); }
        }
        private Animation _onHide;

        /// <summary>
        /// Convert server IDs into ClientIDs for animations
        /// </summary>
        protected override void OnPreRender(EventArgs e)
        {
            // Get the associated BaseValidator and set ClientState accordingly
            BaseValidator baseValidator = TargetControl as BaseValidator;
            if ((null != baseValidator) && !baseValidator.IsValid)
            {
                ClientState = "INVALID";
            }
            else
            {
                ClientState = "";
            }

            base.OnPreRender(e);

            ResolveControlIDs(_onShow);
            ResolveControlIDs(_onHide);
        }
    }
}
