

using System;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.ComponentModel.Design;
using AjaxControlToolkit;

#region Assembly Resource Attribute
[assembly: System.Web.UI.WebResource("NoBot.NoBotBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("NoBot.NoBotBehavior.debug.js", "text/javascript")]
#endregion

namespace AjaxControlToolkit
{
    [ToolboxItem(false)]
    [ClientScriptResource("Sys.Extended.UI.NoBotBehavior", "NoBot.NoBotBehavior.js")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Bot", Justification = "Bot is a commonly used term")]
    [TargetControlType(typeof(Label))]
    public class NoBotExtender : ExtenderControlBase
    {
        public NoBotExtender()
        {
            EnableClientState = true;
        }

        [ExtenderControlProperty()]
        [DefaultValue("")]
        public string ChallengeScript
        {
            get
            {
                return GetPropertyValue("ChallengeScript", "");
            }
            set
            {
                SetPropertyValue("ChallengeScript", value);
            }
        }
    }
}
