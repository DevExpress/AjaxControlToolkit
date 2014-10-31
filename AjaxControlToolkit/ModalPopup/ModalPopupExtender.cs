using System;
using System.ComponentModel;
using System.Drawing;
using System.Globalization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    [Designer("AjaxControlToolkit.Design.ModalPopupExtenderDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.ModalPopupBehavior", Constants.ModalPopup)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(DragPanelExtender))]
    [RequiredScript(typeof(DropShadowExtender))]
    [RequiredScript(typeof(AnimationExtender))]
    [TargetControlType(typeof(Control))]
    [ToolboxItem("System.Web.UI.Design.WebControlToolboxItem, System.Design, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a")]
    [ToolboxBitmap(typeof(ModalPopupExtender), Constants.ModalPopup + Constants.IconPostfix)]
    public class ModalPopupExtender : DynamicPopulateExtenderControlBase {
        // Desired visibility state: true, false or none
        bool? _show;

        Animation _onHidden,
                  _onShown,
                  _onHiding,
                  _onShowing;

        [ExtenderControlProperty]
        [DefaultValue("")]
        [IDReferenceProperty(typeof(WebControl))]
        [RequiredProperty]
        public string PopupControlID {
            get { return GetPropertyValue("PopupControlID", String.Empty); }
            set { SetPropertyValue("PopupControlID", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue("")]
        public string BackgroundCssClass {
            get { return GetPropertyValue("BackgroundCssClass", String.Empty); }
            set { SetPropertyValue("BackgroundCssClass", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue("")]
        [IDReferenceProperty(typeof(WebControl))]
        public string OkControlID {
            get { return GetPropertyValue("OkControlID", String.Empty); }
            set { SetPropertyValue("OkControlID", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue("")]
        [IDReferenceProperty(typeof(WebControl))]
        public string CancelControlID {
            get { return GetPropertyValue("CancelControlID", String.Empty); }
            set { SetPropertyValue("CancelControlID", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue("")]
        public string OnOkScript {
            get { return GetPropertyValue("OnOkScript", String.Empty); }
            set { SetPropertyValue("OnOkScript", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue("")]
        public string OnCancelScript {
            get { return GetPropertyValue("OnCancelScript", String.Empty); }
            set { SetPropertyValue("OnCancelScript", value); }
        }

        // The X coordinate of the top/left corner of the modal popup
        // (the popup will be centered horizontally if not specified)
        [ExtenderControlProperty]
        [DefaultValue(-1)]
        public int X {
            get { return GetPropertyValue("X", -1); }
            set { SetPropertyValue("X", value); }
        }

        // The Y coordinate of the top/left corner of the modal popup
        // (the popup will be centered vertically if not specified)
        [ExtenderControlProperty]
        [DefaultValue(-1)]
        public int Y {
            get { return GetPropertyValue("Y", -1); }
            set { SetPropertyValue("Y", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(false)]
        [Obsolete("The drag feature on modal popup will be automatically turned on if you specify the PopupDragHandleControlID property. Setting the Drag property is a noop")]
        public bool Drag {
            get { return GetPropertyValue("stringDrag", false); }
            set { SetPropertyValue("stringDrag", value); }
        }

        [ExtenderControlProperty]
        [IDReferenceProperty(typeof(WebControl))]
        [DefaultValue("")]
        public string PopupDragHandleControlID {
            get { return GetPropertyValue("PopupDragHandleControlID", String.Empty); }
            set { SetPropertyValue("PopupDragHandleControlID", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(false)]
        public bool DropShadow {
            get { return GetPropertyValue("stringDropShadow", false); }
            set { SetPropertyValue("stringDropShadow", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(ModalPopupRepositionMode.RepositionOnWindowResizeAndScroll)]
        [ClientPropertyName("repositionMode")]
        public ModalPopupRepositionMode RepositionMode {
            get { return GetPropertyValue("RepositionMode", ModalPopupRepositionMode.RepositionOnWindowResizeAndScroll); }
            set { SetPropertyValue("RepositionMode", value); }
        }

        // Animation to perform once the modal popup is shown
        [Browsable(false)]
        [ExtenderControlProperty]
        public Animation OnShown {
            get { return GetAnimation(ref _onShown, "OnShown"); }
            set { SetAnimation(ref _onShown, "OnShown", value); }
        }

        // Animation to perform once the modal popup is hidden
        [Browsable(false)]
        [ExtenderControlProperty]
        public Animation OnHidden {
            get { return GetAnimation(ref _onHidden, "OnHidden"); }
            set { SetAnimation(ref _onHidden, "OnHidden", value); }
        }

        // Animation to perform just before the modal popup is being shown
        [Browsable(false)]
        [ExtenderControlProperty]
        public Animation OnShowing {
            get { return GetAnimation(ref _onShowing, "OnShowing"); }
            set { SetAnimation(ref _onShowing, "OnShowing", value); }
        }

        // Animation to perform just before the modal popup is being hidden.
        // The popup closes only after the animation completes.
        [Browsable(false)]
        [ExtenderControlProperty]
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
