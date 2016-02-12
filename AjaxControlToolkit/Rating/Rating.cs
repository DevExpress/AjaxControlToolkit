#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.Web.UI;
using System.Web.UI.WebControls;
using AjaxControlToolkit.Design;

namespace AjaxControlToolkit {

    /// <summary>
    /// The Rating control provides intuitive rating experience that allows users to select the number of stars that represents their rating
    /// </summary>
    [NonVisualControl, ToolboxData("<{0}:Rating runat=\"server\"></{0}:Rating>")]
    [DesignerAttribute(typeof(RatingExtenderDesigner))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.RatingName + Constants.IconPostfix)]
    public class Rating : Panel, ICallbackEventHandler, IPostBackEventHandler {
        static readonly object EventChange = new object();
        static readonly object EventClick = new object();
        RatingExtender _extender;
        string _returnFromEvent;
        Orientation _align;
        RatingDirection _direction;

        public Rating() {
        }

        /// <summary>
        /// Set to True to cause a postback on a rating item click
        /// </summary>
        [Category("Behavior")]
        [Description("True to cause a postback on rating change")]
        [DefaultValue(false)]
        [ClientPropertyName("autoPostBack")]
        public bool AutoPostBack {
            get {
                EnsureChildControls();
                return _extender.AutoPostBack;
            }
            set {
                EnsureChildControls();
                _extender.AutoPostBack = value;
            }
        }

        /// <summary>
        /// An Initial rating value
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("Rating")]
        [Bindable(true, BindingDirection.TwoWay)]
        [DefaultValue(3)]
        public int CurrentRating {
            get {
                EnsureChildControls();
                return _extender.Rating;
            }
            set {
                if(value <= MaxRating) {
                    EnsureChildControls();
                    _extender.Rating = value;
                } else
                    throw new ArgumentOutOfRangeException("CurrentRating", "CurrentRating must be greater than MaxRating");
            }
        }

        /// <summary>
        /// Maximum rating value
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("MaxRating")]
        [DefaultValue(5)]
        [Bindable(true, BindingDirection.TwoWay)]
        [ClientPropertyName("maxRating")]
        public int MaxRating {
            get {
                EnsureChildControls();
                return _extender.MaxRating;
            }
            set {
                if(value > 0) {
                    EnsureChildControls();
                    _extender.MaxRating = value;
                    if(CurrentRating > value)
                        CurrentRating = MaxRating;
                } else
                    throw new ArgumentOutOfRangeException("MaxRating", "MaxRating must be greater than zero");
            }
        }

        /// <summary>
        /// ID of the behavior object
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("BehaviorID")]
        [DefaultValue("")]
        public string BehaviorID {
            get {
                EnsureChildControls();
                return _extender.BehaviorID;
            }
            set {
                EnsureChildControls();
                _extender.BehaviorID = value;
            }
        }

        /// <summary>
        /// Whether or not the rating can be changed
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("ReadOnly")]
        [DefaultValue(false)]
        [Bindable(true, BindingDirection.TwoWay)]
        [ClientPropertyName("readOnly")]
        public bool ReadOnly {
            get {
                EnsureChildControls();
                return _extender.ReadOnly;
            }
            set {
                EnsureChildControls();
                _extender.ReadOnly = value;
            }
        }

        /// <summary>
        /// A custom parameter to pass to ClientCallBack
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("Tag")]
        [DefaultValue("")]
        [Bindable(true, BindingDirection.TwoWay)]
        [ClientPropertyName("tag")]
        public string Tag {
            get {
                EnsureChildControls();
                return _extender.Tag;
            }
            set {
                EnsureChildControls();
                _extender.Tag = value;
            }
        }

        /// <summary>
        /// A CSS class for a visible star
        /// </summary>
        [Browsable(true)]
        [Themeable(true)]
        [Category("Behavior")]
        [Description("StarCssClass")]
        [DefaultValue("")]
        [ClientPropertyName("starCssClass")]
        public string StarCssClass {
            get {
                EnsureChildControls();
                return _extender.StarCssClass;
            }
            set {
                EnsureChildControls();
                _extender.StarCssClass = value;
            }
        }

        /// <summary>
        /// A CSS class for a star in filled mode
        /// </summary>
        [Browsable(true)]
        [Themeable(true)]
        [Category("Behavior")]
        [Description("FilledStarCssClass")]
        [DefaultValue("")]
        [ClientPropertyName("filledStarCssClass")]
        public string FilledStarCssClass {
            get {
                EnsureChildControls();
                return _extender.FilledStarCssClass;
            }
            set {
                EnsureChildControls();
                _extender.FilledStarCssClass = value;
            }
        }

        /// <summary>
        /// A CSS class for a star in empty mode
        /// </summary>
        [Browsable(true)]
        [Themeable(true)]
        [Category("Behavior")]
        [Description("EmptyStarCssClass")]
        [DefaultValue("")]
        [ClientPropertyName("emptyStarCssClass")]
        public string EmptyStarCssClass {
            get {
                EnsureChildControls();
                return _extender.EmptyStarCssClass;
            }
            set {
                EnsureChildControls();
                _extender.EmptyStarCssClass = value;
            }
        }

        /// <summary>
        /// A CSS class for a star in waiting mode
        /// </summary>
        [Browsable(true)]
        [Themeable(true)]
        [Category("Behavior")]
        [Description("WaitingStarCssClass")]
        [DefaultValue("")]
        [ClientPropertyName("waitingStarCssClass")]
        public string WaitingStarCssClass {
            get {
                EnsureChildControls();
                return _extender.WaitingStarCssClass;
            }
            set {
                EnsureChildControls();
                _extender.WaitingStarCssClass = value;
            }
        }

        /// <summary>
        /// Alignment of the stars (Vertical or Horizontal)
        /// </summary>
        [Browsable(true)]
        [Themeable(true)]
        [Category("Appearance")]
        [Description("Rating Align")]
        [DefaultValue(Orientation.Horizontal)]
        public Orientation RatingAlign {
            get { return _align; }
            set { _align = value; }
        }

        /// <summary>
        /// Orientation of stars (LeftToRightTopToBottom or RightToLeftBottomToTop)
        /// </summary>
        [Browsable(true)]
        [Themeable(true)]
        [Category("Appearance")]
        [Description("Rating Direction")]
        [DefaultValue(RatingDirection.LeftToRightTopToBottom)]
        [ClientPropertyName("ratingDirection")]
        public RatingDirection RatingDirection {
            get {
                EnsureChildControls();
                return _direction;
            }
            set {
                EnsureChildControls();
                _direction = value;
                _extender.RatingDirection = (int)value;
            }
        }

        /// <summary>
        /// Rating control ID
        /// </summary>
        public override string ID {
            get { return base.ID; }
            set {
                base.ID = value;
                EnsureChildControls();
                _extender.ID = value + "_RatingExtender";
                _extender.TargetControlID = value;
            }
        }

        protected override void CreateChildControls() {
            base.CreateChildControls();

            _extender = new RatingExtender();

            //No add Extender in design mode if not add tag Extender and Properties in control
            if(!DesignMode) {
                Controls.Add(_extender);
            }
        }

        protected override void RenderContents(HtmlTextWriter writer) {
            base.RenderContents(writer);

            var currentRating = CurrentRating;
            var maxRating = MaxRating;

            writer.AddAttribute("href", "javascript:void(0)");
            writer.AddAttribute("style", "text-decoration:none");
            writer.AddAttribute("id", ClientID + "_A");
            writer.AddAttribute("title", currentRating.ToString(CultureInfo.CurrentCulture));
            writer.RenderBeginTag(HtmlTextWriterTag.A);
            //CreateSPAN
            for(var i = 1; i < MaxRating + 1; i++) {
                writer.AddAttribute("id", ClientID + "_Star_" + i.ToString(CultureInfo.InvariantCulture));
                if(_align == Orientation.Horizontal)
                    writer.AddStyleAttribute("float", "left");
                if(_direction == RatingDirection.LeftToRightTopToBottom)
                    if(i <= currentRating)
                        writer.AddAttribute("class", StarCssClass + " " + FilledStarCssClass);
                    else
                        writer.AddAttribute("class", StarCssClass + " " + EmptyStarCssClass);
                else
                    if(i <= maxRating - currentRating)
                        writer.AddAttribute("class", StarCssClass + " " + EmptyStarCssClass);
                    else
                        writer.AddAttribute("class", StarCssClass + " " + FilledStarCssClass);

                writer.RenderBeginTag(HtmlTextWriterTag.Span);
                writer.Write("&nbsp;");
                writer.RenderEndTag();
            }
            writer.RenderEndTag();
        }

        protected override void OnLoad(EventArgs e) {
            base.OnLoad(e);

            var cm = Page.ClientScript;

            // Create JavaScript function for ClientCallBack WebForm_DoCallBack
            // Not sure why we need it, but the callback doesn't get registered on the client
            // side properly without it.
            //
            cm.GetCallbackEventReference(this, String.Empty, String.Empty, String.Empty);

            EnsureChildControls();

            _extender.CallbackID = UniqueID;
        }

        /// <summary>
        /// Fires when rating is changed
        /// </summary>
        public event RatingEventHandler Changed {
            add { base.Events.AddHandler(Rating.EventChange, value); }
            remove { base.Events.RemoveHandler(Rating.EventChange, value); }
        }

        protected virtual void OnChanged(RatingEventArgs e) {
            var eventHandler = (RatingEventHandler)base.Events[Rating.EventChange];
            if(eventHandler != null) {
                eventHandler(this, e);
            }
        }

        /// <summary>
        /// Fires when rating is set
        /// </summary>
        public event RatingEventHandler Click {
            add { base.Events.AddHandler(Rating.EventClick, value); }
            remove { base.Events.RemoveHandler(Rating.EventClick, value); }
        }

        protected virtual void OnClick(RatingEventArgs e) {
            var eventHandler = (RatingEventHandler)base.Events[Rating.EventClick];
            if(eventHandler != null) {
                eventHandler(this, e);
            }
        }

        #region ICallbackEventHandler Members

        /// <summary>
        /// Returns a callback result
        /// </summary>
        /// <returns>Callback result</returns>
        public string GetCallbackResult() {
            return _returnFromEvent;
        }

        /// <summary>
        /// Raises the callback event
        /// </summary>
        /// <param name="eventArgument" type="String">Event argument</param>
        public void RaiseCallbackEvent(string eventArgument) {
            var args = new RatingEventArgs(eventArgument);

            OnClick(args);

            var value = Convert.ToInt32(args.Value.Replace(";", ""));
            if(value != this.CurrentRating)
                OnChanged(args);

            _returnFromEvent = args.CallbackResult;
        }

        #endregion

        #region IPostBackEventHandler Members

        /// <summary>
        /// Raises the postback event
        /// </summary>
        /// <param name="eventArgument" type="String">Event argument</param>
        public void RaisePostBackEvent(string eventArgument) {
            var args = new RatingEventArgs(eventArgument);

            OnClick(args);

            var value = Convert.ToInt32(args.Value.Replace(";", ""));
            if(value != this.CurrentRating)
                OnChanged(args);
        }

        #endregion
    }

    public delegate void RatingEventHandler(object sender, RatingEventArgs e);

    public class RatingEventArgs : EventArgs {
        string _value;
        string _tag;
        string _callbackResult;

        public RatingEventArgs(string args) {
            if(args == null)
                throw new ArgumentNullException("args");

            var tabArgs = args.Split(';');
            if(tabArgs.Length == 2) {
                _value = tabArgs[0];
                _tag = tabArgs[1];
            }
        }

        public string Value {
            get { return _value; }
        }

        public string Tag {
            get { return _tag; }
        }

        public string CallbackResult {
            get { return _callbackResult; }
            set { _callbackResult = value; }
        }
    }

    public enum RatingDirection {
        LeftToRightTopToBottom = 0,
        RightToLeftBottomToTop = 1
    }

}

#pragma warning restore 1591