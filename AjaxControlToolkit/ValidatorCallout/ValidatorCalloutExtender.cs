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
    /// <section name="Known Issues">
    /// The callouts do not currently display automatically after a server post-back
    /// and will only work for custom validators which utilize client-side validation.
    /// Even after a post-back the callout will display when the form is 
    /// revalidated when a postback is attempted again.
    /// </section>
    /// <section name="Theming">
    /// You can change the look and feel of the ValidatorCallout using the ValidatorCallout
    /// CssClass property. The ValidatorCallout has a predefined set of CSS classes that
    /// can be overridden. It has a default style which is embedded as a WebResource
    /// (or Static Resource if you are using the Stating Resources NuGet package) and is a
    /// part of the AJAX Control Toolkit assembly that has styles set for all the sub-classes.
    /// You can find the default styles in the AJAX Control Toolkit solution in the
    /// "AjaxControlToolkit/Styles/ValidatorCallout.css" file. If your CssClass does not provide
    /// values for any of those then it falls back to the default value. To customize the
    /// same the user would have to set the CssClass property to the name of the CSS style
    /// and define the styles for the individual classes so that the various elements in a
    /// ValidatorCallout control can be styled accordingly. For example if the CssClass property
    /// was set to "CustomValidatorCalloutStyle", this is how the CSS to style the border and
    /// background color would look:
    /// ```
    /// .CustomValidatorCalloutStyle div,
    /// .CustomValidatorCalloutStyle td {
    ///     border: solid 1px blue;
    ///     background-color: #add8e6;
    /// }
    /// ```
    /// </section>
    /// <section name="CSS classes">
    /// ```
    /// /* The popup table */
    /// .ajax__validator_popup_table
    /// /* The popup table row */
    /// .ajax__validator_popup_table_row
    /// /* The callout cell */
    /// .ajax__validatorcallout_callout_cell
    /// /* The table in the callout cell */
    /// .ajax__validatorcallout_callout_table
    /// /* The callout table row */
    /// .ajax__validatorcallout_callout_table_row
    /// /* The error message cell */
    /// .ajax__validatorcallout_error_message_cell
    /// /* The warning icon cell */
    /// .ajax__validatorcallout_icon_cell
    /// /* The close button cell */
    /// .ajax__validatorcallout_close_button_cell
    /// /* The arror cell */
    /// .ajax__validatorcallout_arrow_cell
    /// /* Inner div of a cell. Used in the close button cell and the arrow cell */
    /// .ajax__validatorcallout_innerdiv
    /// ```
    /// </section>
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
        /// The path to a custom warning icon image
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
        /// The path to a custom close image
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
        /// Name of the CSS class used to style the ValidatorCallout
        /// </summary>
        /// <remarks>
        /// See the ValidatorCallout Theming section for more information
        /// </remarks>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("cssClass")]
        public string CssClass {
            get { return GetPropertyValue("CssClass", String.Empty); }
            set { SetPropertyValue("CssClass", value); }
        }

        /// <summary>
        /// A CSS class to apply to the invalid field
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("highlightCssClass")]
        public string HighlightCssClass {
            get { return GetPropertyValue("HighlightCssClass", String.Empty); }
            set { SetPropertyValue("HighlightCssClass", value); }
        }

        /// <summary>
        /// Indicates where the ValidatorCallout popup should
        /// appear relatively to the control to validate
        /// </summary>
        /// <remarks>
        /// Possible values:
        /// * BottomLeft
        /// * BottomRight
        /// * TopLeft
        /// * TopRight
        /// * Left
        /// * Right
        /// </remarks>
        /// <default>
        /// ValidatorCalloutPosition.Right
        /// </default>
        [ExtenderControlProperty]
        [ClientPropertyName("popupPosition")]
        [DefaultValue(ValidatorCalloutPosition.Right)]
        [Description("Indicates where you want the ValidatorCallout displayed.")]
        public virtual ValidatorCalloutPosition PopupPosition {
            get { return GetPropertyValue("PopupPosition", ValidatorCalloutPosition.Right); }
            set { SetPropertyValue("PopupPosition", value); }
        }

        /// <summary>
        /// The width of the callout
        /// </summary>
        [DefaultValue(typeof(Unit), "")]
        [ExtenderControlProperty]
        [ClientPropertyName("width")]
        public Unit Width {
            get { return GetPropertyValue("Width", Unit.Empty); }
            set { SetPropertyValue("Width", value); }
        }

        /// <summary>
        /// Generic OnShow animation for the ValidatorCallout extender
        /// </summary>
        /// <remarks>
        /// The OnShow animation will be played each time the validation popup
        /// is displayed. The popup will be positioned correctly but hidden.
        /// The animation can use to display the popup along with any other visual effects.
        /// 
        /// See Animation Reference for more details.
        /// </remarks>
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
        /// Generic OnHide animation for the ValidatorCallout extender
        /// </summary>
        /// <remarks>
        /// The OnHide animation will be played each time the validation popup is hidden
        /// </remarks>
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