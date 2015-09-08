using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// The ModalPopup extender allows you to display content in an element that mimics a modal dialog box,
    /// which prevents the user from interacting with the rest of the page. The modal content can contain
    /// any hierarchy of controls. It is displayed above a background (in z-order) that can have a custom style applied to it.
    /// 
    /// Clicking OK or Cancel in the modal popup dismisses the content and optionally runs custom script. The custom script is
    /// typically used to apply changes that were made in the modal popup. If a postback is required, you can allow the OK or
    /// Cancel control to perform the postback.
    /// 
    /// By default, the modal content is centered on the page. However, you can set absolute positiniong,
    /// and set only X or only Y to center the content vertically or horizontally.
    /// </summary>
    [Designer(typeof(ModalPopupExtenderDesigner))]
    [ClientScriptResource("Sys.Extended.UI.ModalPopupBehavior", Constants.ModalPopup)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(DragPanelExtender))]
    [RequiredScript(typeof(DropShadowExtender))]
    [RequiredScript(typeof(AnimationExtender))]
    [TargetControlType(typeof(Control))]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.ModalPopup + Constants.IconPostfix)]
    public class ModalPopupExtender : DynamicPopulateExtenderControlBase {
        // Desired visibility state: true, false or none
        bool? _show;

        Animation _onHidden,
                  _onShown,
                  _onHiding,
                  _onShowing;

        /// <summary>
        /// The ID of the element to display as a modal popup
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [IDReferenceProperty(typeof(WebControl))]
        [RequiredProperty]
        [ClientPropertyName("popupControlID")]
        public string PopupControlID {
            get { return GetPropertyValue("PopupControlID", String.Empty); }
            set { SetPropertyValue("PopupControlID", value); }
        }

        /// <summary>
        /// The CSS class to apply to the background when the modal popup is displayed
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("backgroundCssClass")]
        public string BackgroundCssClass {
            get { return GetPropertyValue("BackgroundCssClass", String.Empty); }
            set { SetPropertyValue("BackgroundCssClass", value); }
        }

        /// <summary>
        /// The ID of the element that dismisses the modal popup
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [IDReferenceProperty(typeof(WebControl))]
        [ClientPropertyName("okControlID")]
        public string OkControlID {
            get { return GetPropertyValue("OkControlID", String.Empty); }
            set { SetPropertyValue("OkControlID", value); }
        }

        /// <summary>
        /// The ID of the element that cancels the modal popup
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [IDReferenceProperty(typeof(WebControl))]
        [ClientPropertyName("cancelControlID")]
        public string CancelControlID {
            get { return GetPropertyValue("CancelControlID", String.Empty); }
            set { SetPropertyValue("CancelControlID", value); }
        }

        /// <summary>
        /// The script to run when the modal popup is dismissed using the element specified in OkControlID
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("onOkScript")]
        public string OnOkScript {
            get { return GetPropertyValue("OnOkScript", String.Empty); }
            set { SetPropertyValue("OnOkScript", value); }
        }

        /// <summary>
        /// The script to run when the modal popup is dismissed using the element specified in CancelControlID
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue("")]
        [ClientPropertyName("onCancelScript")]
        public string OnCancelScript {
            get { return GetPropertyValue("OnCancelScript", String.Empty); }
            set { SetPropertyValue("OnCancelScript", value); }
        }

        /// <summary>
        /// The X coordinate of the top/left corner of the modal popup
        /// </summary>
        /// <remarks>
        /// If this value is not specified, the popup will be centered horizontally
        /// </remarks>
        [ExtenderControlProperty]
        [DefaultValue(-1)]
        [ClientPropertyName("x")]
        public int X {
            get { return GetPropertyValue("X", -1); }
            set { SetPropertyValue("X", value); }
        }

        /// <summary>
        /// The Y coordinate of the top/left corner of the modal popup
        /// </summary>
        /// <remarks>
        /// If this value is not specified, the popup will be centered vertically
        /// </remarks>
        [ExtenderControlProperty]
        [DefaultValue(-1)]
        [ClientPropertyName("y")]
        public int Y {
            get { return GetPropertyValue("Y", -1); }
            set { SetPropertyValue("Y", value); }
        }

        /// <summary>
        /// Boolean value that specifies whether the modal popup can be dragged
        /// </summary>
        /// <remarks>
        /// This property is obsolete.
        /// </remarks>
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [Obsolete("The drag feature on modal popup will be automatically turned on if you specify the PopupDragHandleControlID property. Setting the Drag property is a noop")]
        [ClientPropertyName("drag")]
        public bool Drag {
            get { return GetPropertyValue("stringDrag", false); }
            set { SetPropertyValue("stringDrag", value); }
        }

        /// <summary>
        /// The ID of the embedded element that contains the popup header and title that
        /// will be used as a drag handle
        /// </summary>
        [ExtenderControlProperty]
        [IDReferenceProperty(typeof(WebControl))]
        [DefaultValue("")]
        [ClientPropertyName("popupDragHandleControlID")]
        public string PopupDragHandleControlID {
            get { return GetPropertyValue("PopupDragHandleControlID", String.Empty); }
            set { SetPropertyValue("PopupDragHandleControlID", value); }
        }

        /// <summary>
        /// True to automatically add a dropshadow to the modal popup
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("dropShadow")]
        public bool DropShadow {
            get { return GetPropertyValue("stringDropShadow", false); }
            set { SetPropertyValue("stringDropShadow", value); }
        }

        /// <summary>
        /// A value that determines whether the popup must be repositioned when the
        /// window is resized or scrolled
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(ModalPopupRepositionMode.RepositionOnWindowResizeAndScroll)]
        [ClientPropertyName("repositionMode")]
        public ModalPopupRepositionMode RepositionMode {
            get { return GetPropertyValue("RepositionMode", ModalPopupRepositionMode.RepositionOnWindowResizeAndScroll); }
            set { SetPropertyValue("RepositionMode", value); }
        }

        /// <summary>
        /// Animation to perform once the modal popup is shown
        /// </summary>
        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("onShown")]
        public Animation OnShown {
            get { return GetAnimation(ref _onShown, "OnShown"); }
            set { SetAnimation(ref _onShown, "OnShown", value); }
        }

        /// <summary>
        /// Animation to perform once the modal popup is hidden
        /// </summary>
        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("onHidden")]
        public Animation OnHidden {
            get { return GetAnimation(ref _onHidden, "OnHidden"); }
            set { SetAnimation(ref _onHidden, "OnHidden", value); }
        }

        /// <summary>
        /// Animation to perform just before the modal popup is being shown
        /// </summary>
        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("onShowing")]
        public Animation OnShowing {
            get { return GetAnimation(ref _onShowing, "OnShowing"); }
            set { SetAnimation(ref _onShowing, "OnShowing", value); }
        }

        /// <summary>
        /// Animation to perform just before the modal popup is being hidden.
        /// The popup closes only after the animation completes.
        /// </summary>
        [Browsable(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("onHiding")]
        public Animation OnHiding {
            get { return GetAnimation(ref _onHiding, "OnHiding"); }
            set { SetAnimation(ref _onHiding, "OnHiding", value); }
        }

        public void Show() {
            _show = true;
        }

        public void Hide() {
            _show = false;
        }

        protected override void OnPreRender(EventArgs e) {
            // If Show() or Hide() were called during the request, change the visibility now
            if(_show.HasValue)
                ChangeVisibility(_show.Value);

            ResolveControlIDs(_onShown);
            ResolveControlIDs(_onHidden);
            ResolveControlIDs(_onShowing);
            ResolveControlIDs(_onHiding);

            base.OnPreRender(e);
        }

        // Emit script to the client that will cause the modal popup behavior
        // to be shown or hidden
        private void ChangeVisibility(bool show) {
            if(TargetControl == null)
                throw new ArgumentNullException("TargetControl", "TargetControl property cannot be null");

            var operation = show ? "show" : "hide";

            if(ScriptManager.GetCurrent(Page).IsInAsyncPostBack)
                // RegisterDataItem is more elegant, but we can only call it during an async postback
                ScriptManager.GetCurrent(Page).RegisterDataItem(TargetControl, operation);
            else {
                // Add a load handler to show the popup and then remove itself
                var script = string.Format(CultureInfo.InvariantCulture,
                    "(function() {{" +
                        "var fn = function() {{" +
                            "Sys.Extended.UI.ModalPopupBehavior.invokeViaServer('{0}', {1}); " +
                            "Sys.Application.remove_load(fn);" +
                        "}};" +
                        "Sys.Application.add_load(fn);" +
                    "}})();",
                    BehaviorID,
                    show ? "true" : "false");
                ScriptManager.RegisterStartupScript(this, typeof(ModalPopupExtender), operation + BehaviorID, script, true);
            }
        }
    }

}
