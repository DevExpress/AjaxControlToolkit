using AjaxControlToolkit.Design;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// ValidatorCallout is an ASP.NET AJAX extender that enhances the functionality of 
    /// existing ASP.NET validators. To use this control, add an input field and a 
    /// validator control as you normally would. Then add the ValidatorCallout and 
    /// set its TargetControlID property to reference the validator control. 
    /// </summary>
    [Designer(typeof(ValidatorCalloutExtenderDesigner))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(PopupExtender))]
    [RequiredScript(typeof(AnimationExtender))]
    [TargetControlType(typeof(IValidator))]
    [ClientCssResource(Constants.ValidatorCalloutName)]
    [ClientScriptResource("Sys.Extended.UI.ValidatorCalloutBehavior", Constants.ValidatorCalloutName)]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.ValidatorCalloutName + Constants.IconPostfix)]
    public class ValidatorCalloutExtender : AnimationExtenderControlBase {
        public ValidatorCalloutExtender() {
            EnableClientState = true;
        }

        /// <summary>
        /// The path to a custom warning icon image.
        /// </summary>
        [DefaultValue("")]
        [UrlProperty]
        [ExtenderControlProperty]
        [ClientPropertyName("warningIconImageUrl")]
        public string WarningIconImageUrl {
            get { return GetPropertyValue("WarningIconImageUrl", (string)null) ?? (DesignMode ? String.Empty : ToolkitResourceManager.GetImageHref(Constants.ValidatorCalloutAlertLargeImage, this, false)); }
            set { SetPropertyValue("WarningIconImageUrl", value); }
        }

        /// <summary>
        /// The path to a custom close image.
        /// </summary>
        [DefaultValue("")]
        [UrlProperty]
        [ExtenderControlProperty]
        [ClientPropertyName("closeImageUrl")]
        public string CloseImageUrl {
            get { return GetPropertyValue("CloseImageUrl", (string)null) ?? (DesignMode ? String.Empty : ToolkitResourceManager.GetImageHref(Constants.ValidatorCalloutCloseImage, this, false)); }
            set { SetPropertyValue("CloseImageUrl", value); }
        }

        /// <summary>
        /// Name of the CSS class used to style the ValidatorCallout. 
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("cssClass")]
        public string CssClass {
            get { return GetPropertyValue("CssClass", String.Empty); }
            set { SetPropertyValue("CssClass", value); }
        }

        /// <summary>
        /// A CssClass to apply to the invalid field.
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("highlightCssClass")]
        public string HighlightCssClass {
            get { return GetPropertyValue("HighlightCssClass", String.Empty); }
            set { SetPropertyValue("HighlightCssClass", value); }
        }

        /// <summary>
        /// Indicates where you want the ValidatorCallout displayed.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("popupPosition")]
        [DefaultValue(ValidatorCalloutPosition.Right)]
        [Description("Indicates where you want the ValidatorCallout displayed.")]
        public virtual ValidatorCalloutPosition PopupPosition {
            get { return GetPropertyValue("PopupPosition", ValidatorCalloutPosition.Right); }
            set { SetPropertyValue("PopupPosition", value); }
        }

        /// <summary>
        /// The width of the callout.
        /// </summary>
        [DefaultValue(typeof(Unit), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("width")]
        public Unit Width {
            get { return GetPropertyValue("Width", Unit.Empty); }
            set { SetPropertyValue("Width", value); }
        }

        /// <summary>
        /// The OnShow animation will be played each time the validation popup
        /// is displayed. The popup will be positioned correctly but hidden.
        /// The animation can use to display the popup along with any other visual effects.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("onShow")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnShow {
            get { return GetAnimation(ref _onShow, "OnShow"); }
            set { SetAnimation(ref _onShow, "OnShow", value); }
        }
        Animation _onShow;

        /// <summary>
        /// The OnHide animation will be played each time the validation popup is hidden.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("onHide")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnHide {
            get { return GetAnimation(ref _onHide, "OnHide"); }
            set { SetAnimation(ref _onHide, "OnHide", value); }
        }
        Animation _onHide;

        // Convert server IDs into ClientIDs for animations
        protected override void OnPreRender(EventArgs e) {
            // Get the associated BaseValidator and set ClientState accordingly
            var baseValidator = TargetControl as BaseValidator;
            if((baseValidator != null) && !baseValidator.IsValid)
                ClientState = "INVALID";
            else
                ClientState = String.Empty;

            base.OnPreRender(e);

            ResolveControlIDs(_onShow);
            ResolveControlIDs(_onHide);
        }
    }

}