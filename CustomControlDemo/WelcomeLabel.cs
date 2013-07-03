using System;
using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.WebControls;
using AjaxControlToolkit;

[assembly: WebResource("CustomControlDemo.WelcomeLabel.js", "text/javascript")]

namespace CustomControlDemo
{
    /// <summary>
    /// Modified from MSDN Example code http://msdn.microsoft.com/en-us/library/yhzc935f(v=vs.100).aspx.
    /// </summary>
    [DefaultProperty("Text")]
    [ToolboxData("<{0}:WelcomeLabel runat=server></{0}:WelcomeLabel>")]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource(null, "CustomControlDemo.WelcomeLabel.js")]
    public class WelcomeLabel : Label
    {
        [
        Bindable(true),
        Category("Appearance"),
        DefaultValue(""),
        Description("The text to display when the user is not logged in."),
        Localizable(true)
        ]
        public virtual string DefaultUserName
        {
            get
            {
                string s = (string)ViewState["DefaultUserName"];
                return (s == null) ? String.Empty : s;
            }
            set
            {
                ViewState["DefaultUserName"] = value;
            }
        }

        protected override void RenderContents(HtmlTextWriter writer)
        {
            writer.WriteEncodedText(Text);

            string displayUserName = DefaultUserName;
            if (Context != null)
            {
                string userName = Context.User.Identity.Name;
                if (!String.IsNullOrEmpty(userName))
                {
                    displayUserName = userName;
                }
            }

            if (!String.IsNullOrEmpty(displayUserName))
            {
                writer.Write(", ");
                writer.WriteEncodedText(displayUserName);
            }

            writer.Write("! Please click me.");
        }

        protected override void OnPreRender(EventArgs e)
        {
            base.OnPreRender(e);

            var script = "welcomeLabel.init('" + this.ClientID + "');";

            Page.ClientScript.RegisterStartupScript(this.GetType(), "WelcomeLabelScript", script, true);
        }
    }
}
