using AjaxControlToolkit.Design;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    [Designer(typeof(ValidatorCalloutExtenderDesigner))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(PopupExtender))]
    [RequiredScript(typeof(AnimationExtender))]
    [TargetControlType(typeof(IValidator))]
    [ClientCssResource(Constants.ValidatorCalloutName)]
    [ClientScriptResource("Sys.Extended.UI.ValidatorCalloutBehavior", Constants.ValidatorCalloutName)]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), "ValidatorCallout.ico")]
    public class ValidatorCalloutExtender : AnimationExtenderControlBase {
        public ValidatorCalloutExtender() {
            EnableClientState = true;
        }

        [DefaultValue("")]
        [UrlProperty]
        [ExtenderControlProperty]
        [ClientPropertyName("warningIconImageUrl")]
        public string WarningIconImageUrl {
            get { return GetPropertyValue("WarningIconImageUrl", (string)null) ?? (DesignMode ? String.Empty : ToolkitResourceManager.GetImageHref(Constants.ValidatorCalloutAlertLargeImage, this)); }
            set { SetPropertyValue("WarningIconImageUrl", value); }
        }

        [DefaultValue("")]
        [UrlProperty]
        [ExtenderControlProperty]
        [ClientPropertyName("closeImageUrl")]
        public string CloseImageUrl {
            get { return GetPropertyValue("CloseImageUrl", (string)null) ?? (DesignMode ? String.Empty : ToolkitResourceManager.GetImageHref(Constants.ValidatorCalloutCloseImage, this)); }
            set { SetPropertyValue("CloseImageUrl", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("cssClass")]
        public string CssClass {
            get { return GetPropertyValue("CssClass", String.Empty); }
            set { SetPropertyValue("CssClass", value); }
        }

        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("highlightCssClass")]
        public string HighlightCssClass {
            get { return GetPropertyValue("HighlightCssClass", String.Empty); }
            set { SetPropertyValue("HighlightCssClass", value); }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("popupPosition")]
        [DefaultValue(ValidatorCalloutPosition.Right)]
        [Description("Indicates where you want the ValidatorCallout displayed.")]
        public virtual ValidatorCalloutPosition PopupPosition {
            get { return GetPropertyValue("PopupPosition", ValidatorCalloutPosition.Right); }
            set { SetPropertyValue("PopupPosition", value); }
        }

        [DefaultValue(typeof(Unit), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("width")]
        public Unit Width {
            get { return GetPropertyValue("Width", Unit.Empty); }
            set { SetPropertyValue("Width", value); }
        }

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