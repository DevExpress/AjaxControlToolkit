

using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

[assembly: System.Web.UI.WebResource("PopupControl.PopupControlBehavior.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("PopupControl.PopupControlBehavior.debug.js", "text/javascript")]

namespace AjaxControlToolkit
{
    /// <summary>
    /// PopupControl extender
    /// </summary>
    [ClientScriptResource("Sys.Extended.UI.PopupControlBehavior", "PopupControl.PopupControlBehavior.js")]
    [RequiredScript(typeof(PopupExtender))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(Control))]
    [Designer("AjaxControlToolkit.PopupControlDesigner, AjaxControlToolkit")]
    [ToolboxItem(Utility.ToolBoxItemTypeName)]
    [ToolboxBitmap(typeof(PopupControlExtender), "PopupControl.PopupControl.ico")]
    public class PopupControlExtender : DynamicPopulateExtenderControlBase
    {
        private bool _shouldClose;
        private string _closeString;
        private Page _proxyForCurrentPopup;
        private EventHandler _pagePreRenderHandler;

        /// <summary>
        /// Constructor
        /// </summary>
        public PopupControlExtender()
        {
        }

        /// <summary>
        /// Constructor with a page - Used to initialize proxy controls only.
        /// </summary>
        /// <param name="page">Page for which the control is proxying.</param>
        private PopupControlExtender(Page page)
        {
            _proxyForCurrentPopup = page;

            // In this case, the control acts as a proxy
            // It is not actually added to control collections and does not participate in the page cycle
            // Attach the Page.PreRender event
            _pagePreRenderHandler = new EventHandler(Page_PreRender);
            _proxyForCurrentPopup.PreRender += _pagePreRenderHandler;
        }

        /// <summary>
        /// Gets a proxy PopupControlExtender representing the currently active popup on the specified page
        /// </summary>
        /// <remarks>
        /// Only the Cancel and Commit methods should be called on the proxy
        /// </remarks>
        public static PopupControlExtender GetProxyForCurrentPopup(Page page)
        {
            PopupControlExtender popupControlExtender = new PopupControlExtender(page);
            return popupControlExtender;
        }

        /// <summary>
        /// Cancels the popup control and hides it, abandoning any results it has
        /// </summary>
        public void Cancel()
        {
            // It is possible for Cancel() to be called numerous times during the same postback so we just remember the desired state
            // Pass the magic cancel string as the result
            _closeString = "$$CANCEL$$";
            _shouldClose = true;
        }

        /// <summary>
        /// Commits the popup control and hides it, applying the specified result
        /// </summary>
        /// <param name="result">result of popup</param>
        public void Commit(string result)
        {
            // It is possible for Commit() to be called numerous times during the same postback so we just remember the desired state
            _closeString = result;
            _shouldClose = true;
        }

        /// <summary>
        /// Handles the OnLoad event.
        /// </summary>
        /// <param name="e">Argument associated with event.</param>
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            // Attach the Page.PreRender event - Make sure we hook up only once
            if (_pagePreRenderHandler == null)
            {
                _pagePreRenderHandler = new EventHandler(Page_PreRender);
                Page.PreRender += _pagePreRenderHandler;
            }
        }

        /// <summary>
        /// Handles the Page_PreRender event.
        /// </summary>
        /// <param name="sender">Object sending this event.</param>
        /// <param name="e">Argument associated with event.</param>
        protected void Page_PreRender(object sender, EventArgs e)
        {
            // If Cancel()/Commit() were called, close the popup now
            if (_shouldClose)
            {
                Close(_closeString);
            }
        }

        /// <summary>
        /// Closes the popup control, applying the specified result or abandoning it
        /// </summary>
        /// <param name="result">result of popup</param>
        private void Close(string result)
        {
            if (null == _proxyForCurrentPopup)
            {
                // Normal call - Simply register the relevant data item for the TargetControl
                ScriptManager.GetCurrent(Page).RegisterDataItem(TargetControl, result);
            }
            else
            {
                // Proxy call - Add a LiteralControl to pass the information down to the interested PopupControlExtender
                LiteralControl literalControl = new LiteralControl();
                literalControl.ID = "_PopupControl_Proxy_ID_";
                _proxyForCurrentPopup.Controls.Add(literalControl);
                ScriptManager.GetCurrent(_proxyForCurrentPopup).RegisterDataItem(literalControl, result);
            }
        }

        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string ExtenderControlID
        {
            get { return GetPropertyValue("ExtenderControlID", ""); }
            set { SetPropertyValue("ExtenderControlID", value); }
        }

        /// <summary>
        /// ID of the control that pops up
        /// </summary>
        [ExtenderControlProperty]
        [IDReferenceProperty(typeof(WebControl))]
        [RequiredProperty]
        [DefaultValue("")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1706:ShortAcronymsShouldBeUppercase", Justification = "Following ASP.NET AJAX pattern")]
        public string PopupControlID
        {
            get { return GetPropertyValue("PopupControlID", ""); }
            set { SetPropertyValue("PopupControlID", value); }
        }

        /// <summary>
        /// Optional name of the target control's property to set with the result of the popup
        /// </summary>
        /// <remarks>
        /// If not present, the default "value" property will be used
        /// </remarks>
        [ExtenderControlProperty]
        [DefaultValue("")]
        public string CommitProperty
        {
            get { return GetPropertyValue("CommitProperty", ""); }
            set { SetPropertyValue("CommitProperty", value); }
        }

        /// <summary>
        /// Optional script to run after setting the target control's property
        /// </summary>
        /// <remarks>
        /// Allows more complicated actions to be performed based on the popup results
        /// </remarks>
        [ExtenderControlProperty]
        [DefaultValue("")]
        public string CommitScript
        {
            get { return GetPropertyValue("CommitScript", ""); }
            set { SetPropertyValue("CommitScript", value); }
        }

        /// <summary>
        /// Optional position for the popup window (relative to the target control)
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(PopupControlPopupPosition.Center)]
        public PopupControlPopupPosition Position
        {
            get { return GetPropertyValue("Position", PopupControlPopupPosition.Center); }
            set { SetPropertyValue("Position", value); }
        }

        /// <summary>
        /// Optional X (horizontal) offset for the popup window (relative to the target control)
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        public int OffsetX
        {
            get { return GetPropertyValue("OffsetX", 0); }
            set { SetPropertyValue("OffsetX", value); }
        }

        /// <summary>
        /// Optional Y (vertical) offset for the popup window (relative to the target control)
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0)]
        public int OffsetY
        {
            get { return GetPropertyValue("OffsetY", 0); }
            set { SetPropertyValue("OffsetY", value); }
        }

        /// <summary>
        /// OnShow animation
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("onShow")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnShow
        {
            get { return GetAnimation(ref _onShow, "OnShow"); }
            set { SetAnimation(ref _onShow, "OnShow", value); }
        }
        private Animation _onShow;

        /// <summary>
        /// OnHide animation
        /// </summary>
        [ExtenderControlProperty]
        [ClientPropertyName("onHide")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnHide
        {
            get { return GetAnimation(ref _onHide, "OnHide"); }
            set { SetAnimation(ref _onHide, "OnHide", value); }
        }
        private Animation _onHide;

        /// <summary>
        /// Convert server IDs into ClientIDs for animations
        /// </summary>
        protected override void OnPreRender(EventArgs e)
        {
            base.OnPreRender(e);

            ResolveControlIDs(_onShow);
            ResolveControlIDs(_onHide);
        }
    }

    /// <summary>
    /// Enumeration of valid values for the Position property
    /// </summary>
    /// <remarks>
    /// These values must be kept in sync with the client-side enum
    /// </remarks>
    public enum PopupControlPopupPosition
    {
        Center = 0,
        Top = 1,
        Left = 2,
        Bottom = 3,
        Right = 4
    }
}