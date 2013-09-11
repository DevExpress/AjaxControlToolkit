using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

[assembly: WebResource("CustomAjaxServerControlSample.StandardWelcomeLabel.WelcomeLabel.js", "text/javascript")]

namespace CustomAjaxServerControlSample.StandardWelcomeLabel {

    [DefaultProperty("Text")]
    [ToolboxData("<{0}:WelcomeLabel runat=server></{0}:WelcomeLabel>")]
    public class WelcomeLabel : Label, IScriptControl {

        private ScriptManager _scriptManager;

        [Bindable(true),
            Category("Appearance"),
            DefaultValue(""),
            Description("The text to display when the user is not logged in."),
            Localizable(true)]
        public virtual string DefaultUserName {
            get {
                var s = (string) ViewState["DefaultUserName"];
                return s ?? String.Empty;
            }
            set {
                ViewState["DefaultUserName"] = value;
            }
        }

        protected override void RenderContents(HtmlTextWriter writer) {
            writer.WriteEncodedText(Text);

            string displayUserName = DefaultUserName;
            if (Context != null) {
                string userName = Context.User.Identity.Name;
                if (!String.IsNullOrEmpty(userName)) {
                    displayUserName = userName;
                }
            }

            if (!String.IsNullOrEmpty(displayUserName)) {
                writer.Write(", ");
                writer.WriteEncodedText(displayUserName);
            }

            writer.Write("! Please click me.");
        }

        protected override void OnPreRender(EventArgs e) {
            if (!this.DesignMode) {
                // Test for ScriptManager and register if it exists
                _scriptManager = ScriptManager.GetCurrent(Page);

                if (_scriptManager == null)
                    throw new HttpException("A ScriptManager control must exist on the current page.");

                _scriptManager.RegisterScriptControl(this);
            }

            base.OnPreRender(e);
        }

        protected override void Render(HtmlTextWriter writer) {
            if (!this.DesignMode)
                _scriptManager.RegisterScriptDescriptors(this);

            base.Render(writer);
        }

        public IEnumerable<ScriptDescriptor>
            GetScriptDescriptors() {
            var descriptor =
                new ScriptControlDescriptor("CustomAjaxServerControlSample.StandardWelcomeLabel.WelcomeLabel", this.ClientID);
            yield return descriptor;
        }

        public IEnumerable<ScriptReference>
            GetScriptReferences() {
            yield return
                new ScriptReference("CustomAjaxServerControlSample.StandardWelcomeLabel.WelcomeLabel.js", this.GetType().Assembly.FullName);
        }
    }
}