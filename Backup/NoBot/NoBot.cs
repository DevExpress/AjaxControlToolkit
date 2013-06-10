


using System;
using System.Data;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Globalization;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;

namespace AjaxControlToolkit
{
    [Designer("AjaxControlToolkit.NoBotDesigner, AjaxControlToolkit")]
    [DefaultEvent("GenerateChallengeAndResponse")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Bot", Justification = "Bot is a commonly used term")]
    [System.Drawing.ToolboxBitmap(typeof(NoBot), "NoBot.NoBot.ico")]
    public class NoBot : WebControl, INamingContainer
    {
        // Statics
        private static SortedList<DateTime, string> _pastAddresses = new SortedList<DateTime, string>();

        // Properties
        private int _responseMinimumDelaySeconds = 2;
        private int _cutoffWindowSeconds = 60;
        private int _cutoffMaximumInstances = 5;

        // Internals
        private NoBotExtender _extender; // = null;
        private NoBotState _state = NoBotState.InvalidUnknown;

        /// <summary>
        /// Set the html tag to be div instead of the default span to be xhtml compliant
        /// </summary>
        public NoBot() : base(HtmlTextWriterTag.Div)
        { }

        // Create extender and properties
        protected override void CreateChildControls()
        {
            base.CreateChildControls();
            // The Label gives something to attach the extender to
            Label label = new Label();
            label.ID = this.ID + "_NoBotLabel";
            Controls.Add(label);
            _extender = new NoBotExtender();
            _extender.ID = this.ID + "_NoBotExtender";
            _extender.TargetControlID = label.ID;
            Controls.Add(_extender);
        }

        // Determine the challenge and the required response
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            EnsureChildControls();

            CheckResponseAndStoreState();  // Do this (if it hasn't already been done) before preparing the next challenge

            // Default challenge is to perform a trivial complement of a number
            NoBotEventArgs eventArgs = new NoBotEventArgs();
            DateTime utcNow = DateTime.UtcNow;
            int randomValue = utcNow.Millisecond;
            eventArgs.ChallengeScript = string.Format(CultureInfo.InvariantCulture, "~{0}", randomValue.ToString(CultureInfo.InvariantCulture));
            eventArgs.RequiredResponse = (~randomValue).ToString(CultureInfo.InvariantCulture);

            // If a custom challenge has been provided, use it instead
            if (null != GenerateChallengeAndResponse)
            {
                GenerateChallengeAndResponse(this, eventArgs);
            }

            // Send down the challenge
            _extender.ChallengeScript = eventArgs.ChallengeScript;
            _extender.ClientState = "";

            // Save values for use during postback
            ViewState[ResponseTimeKey] = utcNow.AddSeconds(_responseMinimumDelaySeconds);
            string sessionKey = CreateSessionKey(utcNow.Ticks);
            ViewState[SessionKeyKey] = sessionKey;
            Page.Session[sessionKey] = eventArgs.RequiredResponse;
        }

        // Return whether the user is believed to be valid along with relevant details
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1021:AvoidOutParameters", MessageId = "0#", Justification = "Out parameter state allows all override forms to return a bool")]
        public bool IsValid(out NoBotState state)
        {
            EnsureChildControls();

            CheckResponseAndStoreState();

            state = _state;
            return (NoBotState.Valid == state);
        }

        // Return whether the user is believed to be valid
        public bool IsValid()
        {
            NoBotState unused;
            return IsValid(out unused);
        }

        // Gets a copy of the user address cache
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1024:UsePropertiesWhereAppropriate", Justification = "Method performs a copy")]
        public static SortedList<DateTime, string> GetCopyOfUserAddressCache()
        {
            lock (_pastAddresses)
            {
                return new SortedList<DateTime, string>(_pastAddresses);
            }
        }

        // Empties the user address cache
        public static void EmptyUserAddressCache()
        {
            lock (_pastAddresses)
            {
                _pastAddresses.Clear();
            }
        }

        // Check the last response (if any) and prepare for the next one
        private void CheckResponseAndStoreState()
        {
            if (NoBotState.InvalidUnknown == _state)
            {
                try
                {
                    // Report valid when page first loaded (to avoid breaking pages that unconditionally check IsValid)
                    //
                    if (!Page.IsPostBack)
                    {
                        _state = NoBotState.Valid;
                        return;
                    }

                    // Report invalid if response arrives too soon
                    //
                    DateTime responseTime = (DateTime)ViewState[ResponseTimeKey];
                    DateTime utcNow = DateTime.UtcNow;
                    if (utcNow < responseTime)
                    {
                        _state = NoBotState.InvalidResponseTooSoon;
                        return;
                    }

                    // Report invalid if too many responses from same IP address
                    // NOTE: The performance of the following code can be improved
                    // if performance becomes an issue.
                    //
                    lock (_pastAddresses)
                    {
                        // Add user address to address cache, taking care not to duplicate keys
                        string userAddress = Page.Request.UserHostAddress;
                        DateTime utcAdd = utcNow;
                        while (_pastAddresses.ContainsKey(utcAdd))
                        {
                            utcAdd = utcAdd.AddTicks(1);
                        }
                        _pastAddresses.Add(utcAdd, userAddress);
                        // Calculate cutoff window for cached addresses
                        DateTime utcCutoff = utcNow.AddSeconds(-_cutoffWindowSeconds);
                        // Determine number of expired addresses
                        int cutoffs = 0;
                        foreach (DateTime time in _pastAddresses.Keys)
                        {
                            if (time < utcCutoff)
                            {
                                cutoffs++;
                            }
                            else
                            {
                                break;
                            }
                        }
                        // Remove expired addresses
                        while (0 < cutoffs)
                        {
                            _pastAddresses.RemoveAt(0);
                            cutoffs--;
                        }
                        // Determine number of instances of user address in cache
                        int instances = 0;
                        foreach (string address in _pastAddresses.Values)
                        {
                            if (userAddress == address)
                            {
                                instances++;
                            }
                        }
                        // Fail if too many
                        if (_cutoffMaximumInstances < instances)
                        {
                            _state = NoBotState.InvalidAddressTooActive;
                            return;
                        }
                    }

                    // Report invalid if response is wrong
                    //
                    string sessionKey = (string)ViewState[SessionKeyKey];
                    string requiredResponse = (string)Page.Session[sessionKey];
                    Page.Session.Remove(sessionKey);
                    if (requiredResponse != _extender.ClientState)
                    {
                        _state = NoBotState.InvalidBadResponse;
                        return;
                    }

                    // All checks OK, report valid
                    //
                    _state = NoBotState.Valid;
                }
                catch (NullReferenceException)
                {
                    _state = NoBotState.InvalidBadSession;
                }
            }
        }

        // Return the unique key for storing the response time
        private string ResponseTimeKey
        {
            get
            {
                return string.Format(CultureInfo.InvariantCulture, "NoBot_ResponseTimeKey_{0}", UniqueID);
            }
        }

        // Return the unique key for storing the session key
        private string SessionKeyKey
        {
            get
            {
                return string.Format(CultureInfo.InvariantCulture, "NoBot_SessionKeyKey_{0}", UniqueID);
            }
        }

        // Create a unique session key
        private string CreateSessionKey(long ticks)
        {
            return string.Format(CultureInfo.InvariantCulture, "NoBot_SessionKey_{0}_{1}", UniqueID, ticks);
        }

        public event EventHandler<NoBotEventArgs> GenerateChallengeAndResponse;

        public int ResponseMinimumDelaySeconds
        {
            get { return _responseMinimumDelaySeconds; }
            set { _responseMinimumDelaySeconds = value; }
        }

        public int CutoffWindowSeconds
        {
            get { return _cutoffWindowSeconds; }
            set { _cutoffWindowSeconds = value; }
        }

        public int CutoffMaximumInstances
        {
            get { return _cutoffMaximumInstances; }
            set { _cutoffMaximumInstances = value; }
        }
    }
}
