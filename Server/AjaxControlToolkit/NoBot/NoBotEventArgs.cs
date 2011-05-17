


using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

namespace AjaxControlToolkit
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Bot", Justification = "Bot is a commonly used term")]
    public class NoBotEventArgs : EventArgs
    {
        private string challengeScript = "";
        private string requiredResponse = "";

        public string ChallengeScript
        {
            get { return challengeScript; }
            set { challengeScript = value; }
        }
        public string RequiredResponse
        {
            get { return requiredResponse; }
            set { requiredResponse = value; }
        }
    }
}
