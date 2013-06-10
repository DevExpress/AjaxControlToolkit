

using System;
using System.ComponentModel;
using System.Collections.Generic;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

[assembly: System.Web.UI.WebResource("ConfirmButton.confirmButtonBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("ConfirmButton.confirmButtonBehavior.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    /// <summary>
    /// ConfirmButton extender class definition
    /// </summary>
    [Designer("AjaxControlToolkit.ConfirmButtonDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.ConfirmButtonBehavior", "ConfirmButton.confirmButtonBehavior.js")]
    [TargetControlType(typeof(IButtonControl))]
    [System.Drawing.ToolboxBitmap(typeof(ConfirmButtonExtender), "ConfirmButton.ConfirmButton.ico")]
    public class ConfirmButtonExtender : ExtenderControlBase
    {
        /// <summary>
        /// OnLoad override
        /// </summary>
        /// <param name="e">event args</param>
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            // Register an empty OnSubmit statement so the ASP.NET WebForm_OnSubmit method will be automatically
            // created and our behavior will be able to wrap it if necessary
            ScriptManager.RegisterOnSubmitStatement(this, typeof(ConfirmButtonExtender), "ConfirmButtonExtenderOnSubmit", "null;");

            RegisterDisplayModalPopup();
        }

        /// <summary>
        /// Registers the target of DisplayModalPopupID for use with ConfirmButton
        /// </summary>
        /// <remarks>
        /// Called in OnLoad by default, but can be called later if the ModalPopup/ConfirmButton are created dynamically.
        /// </remarks>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        public void RegisterDisplayModalPopup()
        {
            if (!string.IsNullOrEmpty(DisplayModalPopupID))
            {
                // Find the specified ModalPopupExtender and validate it
                ModalPopupExtender mpe = FindControlHelper(DisplayModalPopupID) as ModalPopupExtender;
                if (null == mpe)
                {
                    throw new ArgumentException("Unable to find specified ModalPopupExtender.");
                }
                if (mpe.TargetControlID != TargetControlID)
                {
                    throw new ArgumentException("ConfirmButton and the ModalPopupExtender specified by its DisplayModalPopupID must specify the same TargetControlID.");
                }
                if (string.IsNullOrEmpty(mpe.OkControlID) && string.IsNullOrEmpty(mpe.CancelControlID))
                {
                    throw new ArgumentException("Specified ModalPopupExtender must set at least OkControlID and/or CancelControlID.");
                }
                if (!string.IsNullOrEmpty(mpe.OnOkScript) || !string.IsNullOrEmpty(mpe.OnCancelScript))
                {
                    throw new ArgumentException("Specified ModalPopupExtender may not set OnOkScript or OnCancelScript.");
                }

                // Re-point the ModalPopupExtender to an invisible placeholder button
                // The following might better be done in OnPreRender, but because of non-deterministic
                // ordering with respect to when the ModalPopupExtender will register itself with the
                // ScriptManager (also in OnPreRender), we need to re-point it a stage earlier.
                Button placeholder = new Button();
                placeholder.ID = ID + "_CBE_MPE_Placeholder";
                placeholder.Style[HtmlTextWriterStyle.Display] = "none";
                Controls.Add(placeholder);
                mpe.TargetControlID = placeholder.ID;

                // The behavior will need to be able to initiate a postback
                PostBackScript = Page.ClientScript.GetPostBackEventReference(TargetControl, "");
            }
        }

        /// <summary>
        /// Text to display in the confirm dialog
        /// </summary>
        [ExtenderControlProperty]
        [RequiredProperty]
        public string ConfirmText
        {
            get
            {
                return GetPropertyValue("ConfirmText", "");
            }
            set
            {
                SetPropertyValue("ConfirmText", value);
            }
        }

        /// <summary>
        /// Gets or sets the client-side script that executes when the cancel button is clicked on the confirm dialog.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        public string OnClientCancel
        {
            get
            {
                return GetPropertyValue("OnClientCancel", string.Empty);
            }
            set
            {
                SetPropertyValue("OnClientCancel", value);
            }
        }

        /// <summary>
        /// True iff the confirm dialog should run for form submission (i.e., after validators are all satisfied)
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(false)]
        public bool ConfirmOnFormSubmit
        {
            get
            {
                return GetPropertyValue<bool>("ConfirmOnFormSubmit", false);
            }
            set
            {
                SetPropertyValue<bool>("ConfirmOnFormSubmit", value);
            }
        }

        /// <summary>
        /// Specifies the ID of a pre-configured ModalPopupExtender to use in place of window.confirm
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("displayModalPopupID")]
        [DefaultValue("")]
        [IDReferenceProperty(typeof(ModalPopupExtender))]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string DisplayModalPopupID
        {
            get
            {
                return GetPropertyValue<string>("DisplayModalPopupID", string.Empty);
            }
            set
            {
                SetPropertyValue<string>("DisplayModalPopupID", value);
            }
        }

        /// <summary>
        /// Specifies the script to run to initiate a postback
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("postBackScript")]
        [DefaultValue("")]
        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        public string PostBackScript
        {
            get
            {
                return GetPropertyValue("PostBackScript", string.Empty);
            }
            set
            {
                SetPropertyValue("PostBackScript", value);
            }
        }
    }
}
