using System;

namespace AjaxControlToolkit {

    public class NoBotEventArgs: EventArgs {
        private string challengeScript = "";
        private string requiredResponse = "";

        public string ChallengeScript {
            get { return challengeScript; }
            set { challengeScript = value; }
        }
        public string RequiredResponse {
            get { return requiredResponse; }
            set { requiredResponse = value; }
        }
    }

}
