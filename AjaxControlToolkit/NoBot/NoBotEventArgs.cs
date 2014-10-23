using System;

namespace AjaxControlToolkit {

    public class NoBotEventArgs : EventArgs {
        string _challengeScript = String.Empty;
        string _requiredResponse = String.Empty;

        public string ChallengeScript {
            get { return _challengeScript; }
            set { _challengeScript = value; }
        }

        public string RequiredResponse {
            get { return _requiredResponse; }
            set { _requiredResponse = value; }
        }
    }

}
