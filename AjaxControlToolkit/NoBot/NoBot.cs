#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// NoBot is a control that prevents CAPTCHA-like bot/spam without user interactions. This approach is
    /// easier to bypass than the implementation that requires actual human intervention, but NoBot has the
    /// benefit of being completely invisible. NoBot is probably most relevant for low-traffic sites where
    /// blog/comment spam is a problem and 100% effectiveness is not required.
    /// </summary>
    /// <remarks>
    /// NoBot employs a few different anti-bot techniques:
    /// * Forcing the client's browser to perform a configurable JavaScript calculation and verifying the result
    ///   as part of a postback. For example, the calculation may be simple numeric or may involve the DOM for
    ///   added assurance that a browser is involved
    /// * Enforcing a configurable delay between a request sent to a form and the time it can be posted back.
    ///   For example, a human is unlikely to complete a form in less than two seconds 
    /// * Enforcing a configurable limit to the number of acceptable requests for each IP address per unit of
    ///   time. For example, a human is unlikely to submit the same form more than five times in a minute.
    /// 
    /// NoBot can be tested by violating any of the above mentioned techniques: posting back quickly,
    /// posting back many times, or disabling JavaScript in the browser.
    /// </remarks>
    [Designer(typeof(NoBotExtenderDesigner))]
    [DefaultEvent("GenerateChallengeAndResponse")]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.NoBotName + Constants.IconPostfix)]
    public class NoBot : WebControl, INamingContainer {
        static SortedList<DateTime, string> _pastAddresses = new SortedList<DateTime, string>();

        int _responseMinimumDelaySeconds = 2;
        int _cutoffWindowSeconds = 60;
        int _cutoffMaximumInstances = 5;

        NoBotExtender _extender;
        NoBotState _state = NoBotState.InvalidUnknown;

        // Set the html tag to be div instead of the default span to be xhtml compliant
        public NoBot()
            : base(HtmlTextWriterTag.Div) { }

        protected override void CreateChildControls() {
            base.CreateChildControls();

            // The Label gives something to attach the extender to
            var label = new Label() {
                ID = ID + "_NoBotLabel"
            };
            Controls.Add(label);

            _extender = new NoBotExtender() {
                ID = ID + "_NoBotExtender",
                TargetControlID = label.ID
            };
            Controls.Add(_extender);
        }

        // Determine the challenge and the required response
        protected override void OnLoad(EventArgs e) {
            base.OnLoad(e);
            EnsureChildControls();

            CheckResponseAndStoreState();  // Do this (if it hasn't already been done) before preparing the next challenge

            // Default challenge is to perform a trivial complement of a number
            var eventArgs = new NoBotEventArgs();
            var utcNow = DateTime.UtcNow;
            var randomValue = utcNow.Millisecond;

            eventArgs.ChallengeScript = String.Format(CultureInfo.InvariantCulture, "~{0}", randomValue.ToString(CultureInfo.InvariantCulture));
            eventArgs.RequiredResponse = (~randomValue).ToString(CultureInfo.InvariantCulture);

            // If a custom challenge has been provided, use it instead
            if(GenerateChallengeAndResponse != null)
                GenerateChallengeAndResponse(this, eventArgs);

            // Send down the challenge
            _extender.ChallengeScript = eventArgs.ChallengeScript;
            _extender.ClientState = String.Empty;

            // Save values for use during postback
            ViewState[ResponseTimeKey] = utcNow.AddSeconds(_responseMinimumDelaySeconds);
            var sessionKey = CreateSessionKey(utcNow.Ticks);
            ViewState[SessionKeyKey] = sessionKey;
            Page.Session[sessionKey] = eventArgs.RequiredResponse;
        }

        /// <summary>
        /// Returns whether or not the user is valid
        /// </summary>
        /// <param name="state" type="NoBotState">NoBot state</param>
        /// <returns>Whether user is valid</returns>
        public bool IsValid(out NoBotState state) {
            EnsureChildControls();

            CheckResponseAndStoreState();

            state = _state;
            return (NoBotState.Valid == state);
        }

        /// <summary>
        /// Returns whether or not the user is valid
        /// </summary>
        /// <returns>Whether user is valid</returns>
        public bool IsValid() {
            NoBotState unused;
            return IsValid(out unused);
        }

        /// <summary>
        /// Returns a copy of the user address cache
        /// </summary>
        /// <returns>Copy of the user address cache</returns>
        public static SortedList<DateTime, string> GetCopyOfUserAddressCache() {
            lock(_pastAddresses) {
                return new SortedList<DateTime, string>(_pastAddresses);
            }
        }

        /// <summary>
        /// Clears the user address cache
        /// </summary>
        public static void EmptyUserAddressCache() {
            lock(_pastAddresses) {
                _pastAddresses.Clear();
            }
        }

        // Check the last response (if any) and prepare for the next one
        void CheckResponseAndStoreState() {
            if(NoBotState.InvalidUnknown != _state) return;

            try {
                // Report valid when page first loaded (to avoid breaking pages that unconditionally check IsValid)
                if(!Page.IsPostBack) {
                    _state = NoBotState.Valid;
                    return;
                }

                // Report invalid if response arrives too soon
                var responseTime = (DateTime)ViewState[ResponseTimeKey];
                var utcNow = DateTime.UtcNow;
                if(utcNow < responseTime) {
                    _state = NoBotState.InvalidResponseTooSoon;
                    return;
                }

                // Report invalid if too many responses from same IP address
                // NOTE: The performance of the following code can be improved
                // if performance becomes an issue.
                lock(_pastAddresses) {
                    // Add user address to address cache, taking care not to duplicate keys
                    var userAddress = Page.Request.UserHostAddress;
                    var utcAdd = utcNow;
                    while(_pastAddresses.ContainsKey(utcAdd))
                        utcAdd = utcAdd.AddTicks(1);

                    _pastAddresses.Add(utcAdd, userAddress);
                    // Calculate cutoff window for cached addresses
                    var utcCutoff = utcNow.AddSeconds(-_cutoffWindowSeconds);
                    // Determine number of expired addresses
                    var cutoffs = 0;
                    foreach(var time in _pastAddresses.Keys) {
                        if(time < utcCutoff)
                            cutoffs++;
                        else
                            break;
                    }

                    // Remove expired addresses
                    while(0 < cutoffs) {
                        _pastAddresses.RemoveAt(0);
                        cutoffs--;
                    }
                    // Determine number of instances of user address in cache
                    var instances = 0;
                    foreach(var address in _pastAddresses.Values) {
                        if(userAddress == address)
                            instances++;
                    }

                    // Fail if too many
                    if(_cutoffMaximumInstances < instances) {
                        _state = NoBotState.InvalidAddressTooActive;
                        return;
                    }
                }

                // Report invalid if response is wrong
                var sessionKey = (string)ViewState[SessionKeyKey];
                var requiredResponse = (string)Page.Session[sessionKey];
                Page.Session.Remove(sessionKey);
                if(requiredResponse != _extender.ClientState) {
                    _state = NoBotState.InvalidBadResponse;
                    return;
                }

                // All checks OK, report valid
                _state = NoBotState.Valid;
            }
            catch(NullReferenceException) {
                _state = NoBotState.InvalidBadSession;
            }
        }

        // Return the unique key for storing the response time
        string ResponseTimeKey {
            get { return String.Format(CultureInfo.InvariantCulture, "NoBot_ResponseTimeKey_{0}", UniqueID); }
        }

        // Return the unique key for storing the session key
        string SessionKeyKey {
            get { return String.Format(CultureInfo.InvariantCulture, "NoBot_SessionKeyKey_{0}", UniqueID); }
        }

        // Create a unique session key
        string CreateSessionKey(long ticks) {
            return String.Format(CultureInfo.InvariantCulture, "NoBot_SessionKey_{0}_{1}", UniqueID, ticks);
        }

        /// <summary>
        /// An optional EventHandler providing a custom implementation of the challenge/response code
        /// </summary>
        public event EventHandler<NoBotEventArgs> GenerateChallengeAndResponse;

        /// <summary>
        /// Optional minimum number of seconds before which a response (postback) is considered valid
        /// </summary>
        public int ResponseMinimumDelaySeconds {
            get { return _responseMinimumDelaySeconds; }
            set { _responseMinimumDelaySeconds = value; }
        }

        /// <summary>
        /// Optional number of seconds specifying the length of the cutoff window
        /// that tracks previous postbacks from each IP address
        /// </summary>
        public int CutoffWindowSeconds {
            get { return _cutoffWindowSeconds; }
            set { _cutoffWindowSeconds = value; }
        }

        /// <summary>
        /// Optional maximum number of postbacks to allow by a single IP address within the cutoff window
        /// </summary>
        public int CutoffMaximumInstances {
            get { return _cutoffMaximumInstances; }
            set { _cutoffMaximumInstances = value; }
        }
    }

}

#pragma warning restore 1591