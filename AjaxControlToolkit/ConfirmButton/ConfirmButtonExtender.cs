using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Drawing;

namespace AjaxControlToolkit {

    [Designer("AjaxControlToolkit.Design.ConfirmButtonExtenderDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.ConfirmButtonBehavior", Constants.ConfirmButtonName)]
    [TargetControlType(typeof(IButtonControl))]
    [ToolboxBitmap(typeof(ConfirmButtonExtender), Constants.ConfirmButtonName + Constants.IconPostfix)]
    public class ConfirmButtonExtender : ExtenderControlBase {
        protected override void OnLoad(EventArgs e) {
            base.OnLoad(e);

            // Register an empty OnSubmit statement so the ASP.NET WebForm_OnSubmit method will be automatically
            // created and our behavior will be able to wrap it if necessary
            ScriptManager.RegisterOnSubmitStatement(this, typeof(ConfirmButtonExtender), "ConfirmButtonExtenderOnSubmit", "null;");

            RegisterDisplayModalPopup();
        }

        // Registers the target of DisplayModalPopupID for use with ConfirmButton
        // Called in OnLoad by default, but can be called later if the ModalPopup/ConfirmButton are created dynamically.
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

        [ExtenderControlProperty]
        [RequiredProperty]
        public string ConfirmText {
            get { return GetPropertyValue("ConfirmText", String.Empty); }
            set { SetPropertyValue("ConfirmText", value); }
        }

        // Gets or sets the client-side script that executes when the cancel button is clicked on the confirm dialog.
        [ExtenderControlProperty]
        [DefaultValue("")]
        public string OnClientCancel {
            get { return GetPropertyValue("OnClientCancel", String.Empty); }
            set { SetPropertyValue("OnClientCancel", value); }
        }

        // True iff the confirm dialog should run for form submission (i.e., after validators are all satisfied)
        [ExtenderControlProperty]
        [DefaultValue(false)]
        public bool ConfirmOnFormSubmit {
            get { return GetPropertyValue<bool>("ConfirmOnFormSubmit", false); }
            set { SetPropertyValue<bool>("ConfirmOnFormSubmit", value); }
        }

        // Specifies the ID of a pre-configured ModalPopupExtender to use in place of window.confirm
        [ExtenderControlProperty]
        [ClientPropertyName("displayModalPopupID")]
        [DefaultValue("")]
        [IDReferenceProperty(typeof(ModalPopupExtender))]
        public string DisplayModalPopupID {
            get { return GetPropertyValue<string>("DisplayModalPopupID", String.Empty); }
            set { SetPropertyValue<string>("DisplayModalPopupID", value); }
        }

        // Specifies the script to run to initiate a postback
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
