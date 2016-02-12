#pragma warning disable 1591
using System;
using System.Diagnostics.CodeAnalysis;
using System.Security.Permissions;
using System.Web;
using System.Web.UI;

namespace AjaxControlToolkit.MaskedEditValidatorCompatibility {

    [AspNetHostingPermission(SecurityAction.LinkDemand, Level = AspNetHostingPermissionLevel.Minimal)]
    [AspNetHostingPermission(SecurityAction.InheritanceDemand, Level = AspNetHostingPermissionLevel.Minimal)]
    public abstract class BaseValidator : System.Web.UI.WebControls.BaseValidator, IBaseValidatorAccessor {
        ScriptManager _scriptManager;
        bool _scriptManagerChecked;

        protected BaseValidator() {
        }

        internal ScriptManager ScriptManager {
            get {
                if(!_scriptManagerChecked) {
                    _scriptManagerChecked = true;
                    var page = Page;

                    if(page != null)
                        _scriptManager = ScriptManager.GetCurrent(page);
                }
                return _scriptManager;
            }
        }

        protected override void AddAttributesToRender(HtmlTextWriter writer) {
            if(ScriptManager == null || !ScriptManager.SupportsPartialRendering) {
                base.AddAttributesToRender(writer);
                return;
            }

            ValidatorHelper.DoBaseValidatorAddAttributes(this, this, writer);
        }

        protected override void OnInit(EventArgs e) {
            base.OnInit(e);
            if(ScriptManager == null || !ScriptManager.SupportsPartialRendering)
                return;

            ValidatorHelper.DoInitRegistration(Page);
        }

        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);

            if(ScriptManager == null || !ScriptManager.SupportsPartialRendering)
                return;

            ValidatorHelper.DoPreRenderRegistration(this, this);
        }

        protected override void RegisterValidatorDeclaration() {
            if(ScriptManager == null || !ScriptManager.SupportsPartialRendering) {
                base.RegisterValidatorDeclaration();
                return;
            }

            ValidatorHelper.DoValidatorArrayDeclaration(this, typeof(BaseValidator));
        }

        #region IBaseValidatorAccessor Members
        bool IBaseValidatorAccessor.RenderUpLevel {
            get { return RenderUplevel; }
        }

        HtmlTextWriterTag IWebControlAccessor.TagKey {
            get { return TagKey; }
        }

        void IBaseValidatorAccessor.EnsureID() { EnsureID(); }

        string IBaseValidatorAccessor.GetControlRenderID(string name) {
            return GetControlRenderID(name);
        }
        #endregion
    }

}

#pragma warning restore 1591