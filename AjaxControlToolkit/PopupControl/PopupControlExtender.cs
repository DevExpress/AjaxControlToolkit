using System;
using System.ComponentModel;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    [ClientScriptResource("Sys.Extended.UI.PopupControlBehavior", Constants.PopupControlName)]
    [RequiredScript(typeof(PopupExtender))]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [TargetControlType(typeof(Control))]
    [Designer("AjaxControlToolkit.Design.PopupControlDesigner, AjaxControlToolkit")]
    [ToolboxItem("System.Web.UI.Design.WebControlToolboxItem, System.Design, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a")]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.PopupControlName + Constants.IconPostfix)]
    public class PopupControlExtender : DynamicPopulateExtenderControlBase {
        bool _shouldClose;
        string _closeString;
        Page _proxyForCurrentPopup;
        EventHandler _pagePreRenderHandler;

        public PopupControlExtender() {
        }

        // Constructor with a page - Used to initialize proxy controls only.
        private PopupControlExtender(Page page) {
            _proxyForCurrentPopup = page;

            // In this case, the control acts as a proxy
            // It is not actually added to control collections and does not participate in the page cycle
            // Attach the Page.PreRender event
            _pagePreRenderHandler = new EventHandler(Page_PreRender);
            _proxyForCurrentPopup.PreRender += _pagePreRenderHandler;
        }

        // Gets a proxy PopupControlExtender representing the currently active popup on the specified page
        // Only the Cancel and Commit methods should be called on the proxy
        public static PopupControlExtender GetProxyForCurrentPopup(Page page) {
            var popupControlExtender = new PopupControlExtender(page);
            return popupControlExtender;
        }

        // Cancels the popup control and hides it, abandoning any results it has
        public void Cancel() {
            // It is possible for Cancel() to be called numerous times during the same postback so we just remember the desired state
            // Pass the magic cancel string as the result
            _closeString = "$$CANCEL$$";
            _shouldClose = true;
        }

        // Commits the popup control and hides it, applying the specified result
        public void Commit(string result) {
            // It is possible for Commit() to be called numerous times during the same postback so we just remember the desired state
            _closeString = result;
            _shouldClose = true;
        }

        protected override void OnLoad(EventArgs e) {
            base.OnLoad(e);

            // Attach the Page.PreRender event - Make sure we hook up only once
            if(_pagePreRenderHandler == null) {
                _pagePreRenderHandler = new EventHandler(Page_PreRender);
                Page.PreRender += _pagePreRenderHandler;
            }
        }

        protected void Page_PreRender(object sender, EventArgs e) {
            // If Cancel()/Commit() were called, close the popup now
            if(_shouldClose)
                Close(_closeString);
        }

        // Closes the popup control, applying the specified result or abandoning it
        void Close(string result) {
            if(_proxyForCurrentPopup == null) {
                // Normal call - Simply register the relevant data item for the TargetControl
                ScriptManager.GetCurrent(Page).RegisterDataItem(TargetControl, result);
            } else {
                // Proxy call - Add a LiteralControl to pass the information down to the interested PopupControlExtender
                var literalControl = new LiteralControl();
                literalControl.ID = "_PopupControl_Proxy_ID_";
                _proxyForCurrentPopup.Controls.Add(literalControl);
                ScriptManager.GetCurrent(_proxyForCurrentPopup).RegisterDataItem(literalControl, result);
            }
        }

        [Browsable(false)]
        [EditorBrowsable(EditorBrowsableState.Never)]
        public string ExtenderControlID {
            get { return GetPropertyValue("ExtenderControlID", String.Empty); }
            set { SetPropertyValue("ExtenderControlID", value); }
        }

        [ExtenderControlProperty]
        [IDReferenceProperty(typeof(WebControl))]
        [RequiredProperty]
        [DefaultValue("")]
        public string PopupControlID {
            get { return GetPropertyValue("PopupControlID", String.Empty); }
            set { SetPropertyValue("PopupControlID", value); }
        }

        // Optional name of the target control's property to set with the result of the popup
        // If not present, the default "value" property will be used
        [ExtenderControlProperty]
        [DefaultValue("")]
        public string CommitProperty {
            get { return GetPropertyValue("CommitProperty", String.Empty); }
            set { SetPropertyValue("CommitProperty", value); }
        }

        // Optional script to run after setting the target control's property
        [ExtenderControlProperty]
        [DefaultValue("")]
        public string CommitScript {
            get { return GetPropertyValue("CommitScript", String.Empty); }
            set { SetPropertyValue("CommitScript", value); }
        }

        // Optional position for the popup window (relative to the target control)
        [ExtenderControlProperty]
        [DefaultValue(PopupControlPopupPosition.Center)]
        public PopupControlPopupPosition Position {
            get { return GetPropertyValue("Position", PopupControlPopupPosition.Center); }
            set { SetPropertyValue("Position", value); }
        }

        // Optional X (horizontal) offset for the popup window (relative to the target control)
        [ExtenderControlProperty]
        [DefaultValue(0)]
        public int OffsetX {
            get { return GetPropertyValue("OffsetX", 0); }
            set { SetPropertyValue("OffsetX", value); }
        }

        // Optional Y (vertical) offset for the popup window (relative to the target control)
        [ExtenderControlProperty]
        [DefaultValue(0)]
        public int OffsetY {
            get { return GetPropertyValue("OffsetY", 0); }
            set { SetPropertyValue("OffsetY", value); }
        }

        [ExtenderControlProperty]
        [ClientPropertyName("onShow")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnShow {
            get { return GetAnimation(ref _onShow, "OnShow"); }
            set { SetAnimation(ref _onShow, "OnShow", value); }
        }
        Animation _onShow;

        [ExtenderControlProperty]
        [ClientPropertyName("onHide")]
        [Browsable(false)]
        [DefaultValue(null)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Animation OnHide {
            get { return GetAnimation(ref _onHide, "OnHide"); }
            set { SetAnimation(ref _onHide, "OnHide", value); }
        }
        Animation _onHide;

        // Convert server IDs into ClientIDs for animations
        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);

            ResolveControlIDs(_onShow);
            ResolveControlIDs(_onHide);
        }
    }

}