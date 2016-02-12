#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Drawing;
using AjaxControlToolkit.Design;

namespace AjaxControlToolkit {

    /// <summary>
    /// ConfirmButton is an extender that catches button clicks (or click on an instance of a type that is derived from Button) and displays a message to a user.
    /// If the user clicks OK, the button or link functions normally.
    /// If the user does not click OK, the click event is trapped and the button does not perform its default submit behavior.
    /// </summary>
    [Designer(typeof(ConfirmButtonExtenderDesigner))]
    [ClientScriptResource("Sys.Extended.UI.ConfirmButtonBehavior", Constants.ConfirmButtonName)]
    [TargetControlType(typeof(IButtonControl))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.ConfirmButtonName + Constants.IconPostfix)]
    public class ConfirmButtonExtender : ExtenderControlBase {
        protected override void OnLoad(EventArgs e) {
            base.OnLoad(e);

            // Register an empty OnSubmit statement so the ASP.NET WebForm_OnSubmit method will be automatically
            // created and our behavior will be able to wrap it if necessary
            ScriptManager.RegisterOnSubmitStatement(this, typeof(ConfirmButtonExtender), "ConfirmButtonExtenderOnSubmit", "null;");

            RegisterDisplayModalPopup();
        }

        /// <summary>
        /// Registers the target of DisplayModalPopupID for use with ConfirmButton.
        /// </summary>
        /// <remarks>
        /// Called in OnLoad by default, but can be called later if the ModalPopup/ConfirmButton are created dynamically.
        /// </remarks>
        public void RegisterDisplayModalPopup() {
            if(!String.IsNullOrEmpty(DisplayModalPopupID)) {
                // Find the specified ModalPopupExtender and validate it
                var mpe = FindControlHelper(DisplayModalPopupID) as ModalPopupExtender;
                if(mpe == null)
                    throw new ArgumentException("Unable to find specified ModalPopupExtender.");

                if(mpe.TargetControlID != TargetControlID)
                    throw new ArgumentException("ConfirmButton and the ModalPopupExtender specified by its DisplayModalPopupID must specify the same TargetControlID.");

                if(String.IsNullOrEmpty(mpe.OkControlID) && String.IsNullOrEmpty(mpe.CancelControlID))
                    throw new ArgumentException("Specified ModalPopupExtender must set at least OkControlID and/or CancelControlID.");

                if(!String.IsNullOrEmpty(mpe.OnOkScript) || !String.IsNullOrEmpty(mpe.OnCancelScript))
                    throw new ArgumentException("Specified ModalPopupExtender may not set OnOkScript or OnCancelScript.");

                // Re-point the ModalPopupExtender to an invisible placeholder button
                // The following might better be done in OnPreRender, but because of non-deterministic
                // ordering with respect to when the ModalPopupExtender will register itself with the
                // ScriptManager (also in OnPreRender), we need to re-point it a stage earlier.
                var placeholder = new Button();
                placeholder.ID = ID + "_CBE_MPE_Placeholder";
                placeholder.Style[HtmlTextWriterStyle.Display] = "none";
                Controls.Add(placeholder);
                mpe.TargetControlID = placeholder.ID;

                // The behavior will need to be able to initiate a postback
                PostBackScript = Page.ClientScript.GetPostBackEventReference(TargetControl, String.Empty);
            }
        }

        /// <summary>
        /// Confirmation text to display.
        /// </summary>
        /// <remarks>
        /// HTML entities can be used for a newline character.
        /// </remarks>
        [ExtenderControlProperty]
        [RequiredProperty]
        [ClientPropertyName("confirmText")]
        public string ConfirmText {
            get { return GetPropertyValue("ConfirmText", String.Empty); }
            set { SetPropertyValue("ConfirmText", value); }
        }

        /// <summary>
        /// A client script to be executed when the Cancel button is clicked in the confirm dialog box.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("onClientCancel")]
        public string OnClientCancel {
            get { return GetPropertyValue("OnClientCancel", String.Empty); }
            set { SetPropertyValue("OnClientCancel", value); }
        }

        /// <summary>
        /// True if the confirm dialog should run for form submission (i.e., after validators are all satisfied).
        /// The default is false
        /// </summary>
        /// <remarks>
        /// This is useful if a page contains ASP.NET validator controls and the confirm dialog box should be displayed only after all validation checks pass.
        /// </remarks>
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("confirmOnFormSubmit")]
        public bool ConfirmOnFormSubmit {
            get { return GetPropertyValue<bool>("ConfirmOnFormSubmit", false); }
            set { SetPropertyValue<bool>("ConfirmOnFormSubmit", value); }
        }

        /// <summary>
        /// Specifies an ID of a pre-configured ModalPopupExtender for use instead of window.confirm.
        /// </summary>
        /// <remarks>
        /// When you use the DisplayModalPopupID property, the following conditions must be met: 
        /// - The ModalPopup control must be configured with the same TargetControlID value as the ConfirmButton extender. (It will work properly if the ConfirmButton extender is disabled.) 
        /// - The ModalPopup control must specify the OkControlID or CancelControlID property to identify buttons that correspond to the OK and Cancel buttons in the confirm dialog box. 
        /// - The ModalPopup must not specify the OnOkScript or OnCancelScript property.        
        /// </remarks>
        [ExtenderControlProperty]
        [ClientPropertyName("displayModalPopupID")]
        [DefaultValue("")]
        [IDReferenceProperty(typeof(ModalPopupExtender))]
        public string DisplayModalPopupID {
            get { return GetPropertyValue<string>("DisplayModalPopupID", String.Empty); }
            set { SetPropertyValue<string>("DisplayModalPopupID", value); }
        }

        /// <summary>
        /// Specifies the script to run to initiate a postback.
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("postBackScript")]
        [DefaultValue("")]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        public string PostBackScript {
            get { return GetPropertyValue("PostBackScript", String.Empty); }
            set { SetPropertyValue("PostBackScript", value); }
        }
    }

}

#pragma warning restore 1591