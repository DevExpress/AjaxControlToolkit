


using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.ComponentModel;
using System.Web.UI.Design;
using System.Globalization;

namespace AjaxControlToolkit
{
    [ParseChildren(false)]
    [PersistChildren(true)]
    [NonVisualControl, ToolboxData("<{0}:Rating runat=\"server\"></{0}:Rating>")]
    [DesignerAttribute(typeof(RatingDesigner))]
    [System.Drawing.ToolboxBitmap(typeof(Rating), "Rating.Rating.ico")]
    public class Rating : System.Web.UI.WebControls.Panel, ICallbackEventHandler, IPostBackEventHandler
    {
        private static readonly object EventChange = new object();
        private RatingExtender _extender;
        private string _returnFromEvent;
        private Orientation _align;
        private RatingDirection _direction;
        

        public Rating()
        {
        }

        [Category("Behavior")]
        [Description("True to cause a postback on rating change")]
        [DefaultValue(false)]
        public bool AutoPostBack
        {
            get
            {
                EnsureChildControls();
                return _extender.AutoPostBack;                
            }
            set
            {
                EnsureChildControls();
                _extender.AutoPostBack = value;
            }
        }

        /// <summary>
        /// Length of the transition animation in milliseconds
        /// </summary>
        [Browsable(true)]
        [Category("Behavior")]
        [Description("Rating")]
        [Bindable(true, BindingDirection.TwoWay)]
        [DefaultValue(3)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Usage", "CA2208:InstantiateArgumentExceptionsCorrectly")]
        public int CurrentRating
        {
            get
            {
                EnsureChildControls();
                return _extender.Rating;
            }
            set
            {
                if (value <= MaxRating)
                {
                    EnsureChildControls();
                    _extender.Rating = value;
                }
                else
                    throw new ArgumentOutOfRangeException("CurrentRating", "CurrentRating must be greater than MaxRating");
            }
        }

        [Browsable(true)]
        [Category("Behavior")]
        [Description("MaxRating")]
        [DefaultValue(5)]
        [Bindable(true, BindingDirection.TwoWay)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:DoNotPassLiteralsAsLocalizedParameters", Justification = "Assembly is not localized")]
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Usage", "CA2208:InstantiateArgumentExceptionsCorrectly")]
        public int MaxRating
        {
            get
            {
                EnsureChildControls();
                return _extender.MaxRating;
            }
            set
            {
                if (value > 0)
                {
                    EnsureChildControls();
                    _extender.MaxRating = value;
                    if (CurrentRating > value)
                    {
                        CurrentRating = MaxRating;
                    }
                }
                else
                    throw new ArgumentOutOfRangeException("MaxRating", "MaxRating must be greater than zero");
            }
        }

        [Browsable(true)]
        [Category("Behavior")]
        [Description("BehaviorID")]
        [DefaultValue("")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", MessageId = "Member")]
        public string BehaviorID
        {
            get
            {
                EnsureChildControls();
                return _extender.BehaviorID;
            }
            set
            {
                EnsureChildControls();
                _extender.BehaviorID = value;
            }
        }

        [Browsable(true)]
        [Category("Behavior")]
        [Description("ReadOnly")]
        [DefaultValue(false)]
        [Bindable(true, BindingDirection.TwoWay)]
        public bool ReadOnly
        {
            get
            {
                EnsureChildControls();
                return _extender.ReadOnly;
            }
            set
            {
                EnsureChildControls();
                _extender.ReadOnly = value;
            }
        }

        [Browsable(true)]
        [Category("Behavior")]
        [Description("Tag")]
        [DefaultValue("")]
        [Bindable(true, BindingDirection.TwoWay)]
        public string Tag
        {
            get
            {
                EnsureChildControls();
                return _extender.Tag;
            }
            set
            {
                EnsureChildControls();
                _extender.Tag = value;
            }
        }

        [Browsable(true)]
        [Themeable(true)]
        [Category("Behavior")]
        [Description("StarCssClass")]
        [DefaultValue("")]
        public string StarCssClass
        {
            get
            {
                EnsureChildControls();
                return _extender.StarCssClass;
            }
            set
            {
                EnsureChildControls();
                _extender.StarCssClass = value;
            }
        }

        [Browsable(true)]
        [Themeable(true)]
        [Category("Behavior")]
        [Description("FilledStarCssClass")]
        [DefaultValue("")]
        public string FilledStarCssClass
        {
            get
            {
                EnsureChildControls();
                return _extender.FilledStarCssClass;
            }
            set
            {
                EnsureChildControls();
                _extender.FilledStarCssClass = value;
            }
        }

        [Browsable(true)]
        [Themeable(true)]
        [Category("Behavior")]
        [Description("EmptyStarCssClass")]
        [DefaultValue("")]
        public string EmptyStarCssClass
        {
            get
            {
                EnsureChildControls();
                return _extender.EmptyStarCssClass;
            }
            set
            {
                EnsureChildControls();
                _extender.EmptyStarCssClass = value;
            }
        }

        [Browsable(true)]
        [Themeable(true)]
        [Category("Behavior")]
        [Description("WaitingStarCssClass")]
        [DefaultValue("")]
        public string WaitingStarCssClass
        {
            get
            {
                EnsureChildControls();
                return _extender.WaitingStarCssClass;
            }
            set
            {
                EnsureChildControls();
                _extender.WaitingStarCssClass = value;
            }
        }

        [Browsable(true)]
        [Themeable(true)]
        [Category("Appearance")]
        [Description("Rating Align")]
        [DefaultValue(Orientation.Horizontal)]
        public Orientation RatingAlign
        {
            get { return _align; }
            set { _align = value; }
        }

        [Browsable(true)]
        [Themeable(true)]
        [Category("Appearance")]
        [Description("Rating Direction")]
        [DefaultValue(RatingDirection.LeftToRightTopToBottom)]
        public RatingDirection RatingDirection
        {
            get
            {
                EnsureChildControls();
                return _direction;
            }
            set
            {
                EnsureChildControls();
                _direction = value;
                _extender.RatingDirection = (int)value;
            }
        }
        public override string ID 
        {
            get 
            { 
                return base.ID;
            }
            set 
            { 
              base.ID = value;
              EnsureChildControls();
              _extender.ID = value + "_RatingExtender";
              _extender.TargetControlID = value;
            }
        }
        protected override void CreateChildControls()
        {
            base.CreateChildControls();

            // Create the extender
            _extender = new RatingExtender();

            //No add Extender in design mode if not add tag Extender and Properties in control
            if (!this.DesignMode)
            {
                Controls.Add(_extender);
            }
        }

        protected override void RenderContents(HtmlTextWriter writer)
        {
            base.RenderContents(writer);

            int currentRating = this.CurrentRating;
            int maxRating = this.MaxRating;

            writer.AddAttribute("href", "javascript:void(0)");
            writer.AddAttribute("style", "text-decoration:none");
            writer.AddAttribute("id", this.ClientID + "_A");
            writer.AddAttribute("title", currentRating.ToString(CultureInfo.CurrentCulture));
            writer.RenderBeginTag(HtmlTextWriterTag.A);
            //CreateSPAN
            for (int i = 1; i < MaxRating + 1; i++)
            {
                writer.AddAttribute("id", this.ClientID + "_Star_" + i.ToString(CultureInfo.InvariantCulture));
                if (_align == Orientation.Horizontal)
                    writer.AddStyleAttribute("float", "left");
                if (_direction == RatingDirection.LeftToRightTopToBottom)
                    if (i <= currentRating)
                        writer.AddAttribute("class", StarCssClass + " " + FilledStarCssClass);
                    else
                        writer.AddAttribute("class", StarCssClass + " " + EmptyStarCssClass);
                else
                    if (i <= maxRating - currentRating)
                        writer.AddAttribute("class", StarCssClass + " " + EmptyStarCssClass);
                    else
                        writer.AddAttribute("class", StarCssClass + " " + FilledStarCssClass);
                writer.RenderBeginTag(HtmlTextWriterTag.Span);
                writer.Write("&nbsp;");
                writer.RenderEndTag();
            }
            writer.RenderEndTag();
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            ClientScriptManager cm = Page.ClientScript;

            // Create JavaScript function for ClientCallBack WebForm_DoCallBack
            // Not sure why we need it, but the callback doesn't get registered on the client
            // side properly without it.
            //
            cm.GetCallbackEventReference(this, "", "", "");

            
            EnsureChildControls();

            _extender.CallbackID = UniqueID;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Design", "CA1009:DeclareEventHandlersCorrectly")]
        public event RatingEventHandler Changed
        {
            add
            {
                base.Events.AddHandler(Rating.EventChange, value);
            }
            remove
            {
                base.Events.RemoveHandler(Rating.EventChange, value);
            }
        }

        protected virtual void OnChanged(RatingEventArgs e)
        {
            RatingEventHandler eventHandler = (RatingEventHandler)base.Events[Rating.EventChange];
            if (eventHandler != null)
            {
                eventHandler(this, e);
            }
        }

        #region ICallbackEventHandler Members

        public string GetCallbackResult()
        {
            return _returnFromEvent;
        }

        public void RaiseCallbackEvent(string eventArgument)
        {
            RatingEventArgs args = new RatingEventArgs(eventArgument);
            this.OnChanged(args);
            _returnFromEvent = args.CallbackResult;
        }

        #endregion

        #region IPostBackEventHandler Members

        public void RaisePostBackEvent(string eventArgument)
        {
            RatingEventArgs args = new RatingEventArgs(eventArgument);
            this.OnChanged(args);
        }

        #endregion
    }

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1003:UseGenericEventHandlerInstances", Justification = "Designer doesn't work with generic event handlers")]
    public delegate void RatingEventHandler(object sender, RatingEventArgs e);

    public class RatingEventArgs : EventArgs
    {
        private string _value;
        private string _tag;
        private string _callbackResult;
        public RatingEventArgs(string args)
        {
            if (args == null)
            {
                throw new ArgumentNullException("args");
            }

            string[] tabArgs = args.Split(';');
            if (tabArgs.Length == 2)
            {
                _value = tabArgs[0];
                _tag = tabArgs[1];
            }
        }
        public string Value
        {
            get { return _value; }
        }
        public string Tag
        {
            get { return _tag; }
        }
        public string CallbackResult
        {
            get { return _callbackResult; }
            set { _callbackResult = value; }
        }
    }

    public enum RatingDirection
    {
        LeftToRightTopToBottom = 0,
        RightToLeftBottomToTop = 1
    }
}
