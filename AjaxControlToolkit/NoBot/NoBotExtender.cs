#pragma warning disable 1591
using System.ComponentModel;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    [ToolboxItem(false)]
    [ClientScriptResource("Sys.Extended.UI.NoBotBehavior", Constants.NoBotName)]
    [TargetControlType(typeof(Label))]
    public class NoBotExtender : ExtenderControlBase {
        public NoBotExtender() {
            EnableClientState = true;
        }

        [ExtenderControlProperty()]
        [DefaultValue("")]
        [ClientPropertyName("challengeScript")]
        public string ChallengeScript {
            get { return GetPropertyValue("ChallengeScript", ""); }
            set { SetPropertyValue("ChallengeScript", value); }
        }
    }

}

#pragma warning restore 1591