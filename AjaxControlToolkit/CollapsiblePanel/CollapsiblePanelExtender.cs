using System;
using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    // An extender class which adds collapse/expand behavior to an ASP.NET Panel control.
    // The panel that is extended can then be collapsed or expanded by the user of the page, which is handy
    // for doing things like showing or hiding content or maximizing available space.
    [Designer("AjaxControlToolkit.Design.CollapsiblePanelExtenderDesigner, AjaxControlToolkit")]
    [ClientScriptResource("Sys.Extended.UI.CollapsiblePanelBehavior", Constants.CollapsiblePanelName)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [RequiredScript(typeof(AnimationScripts))]
    [TargetControlType(typeof(Panel))]
    [DefaultProperty("CollapseControlID")]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.CollapsiblePanelName + Constants.IconPostfix)]
    public class CollapsiblePanelExtender : ExtenderControlBase {
        public CollapsiblePanelExtender() {
            ClientStateValuesLoaded += new EventHandler(CollapsiblePanelExtender_ClientStateValuesLoaded);
            EnableClientState = true;
        }

        // The server ID of the control to initiate the collapse of the target panel.  The panel will
        // collapse when this control fires its client side "onclick" event.
        // 
        // If this value is the same as the value for "ExpandControlID", the CollapsiblePanel will
        // toggle when this control is clicked.
        [IDReferenceProperty(typeof(WebControl))]
        [DefaultValue("")]
        [ExtenderControlProperty]
        public string CollapseControlID {
            get { return GetPropertyValue("CollapseControlID", String.Empty); }
            set { SetPropertyValue("CollapseControlID", value); }
        }

        // The server ID of the control to initiate the expansion of the target panel.  The panel will
        // opening when this control fires its client side "onclick" event.
        // 
        // If this value is the same as the value for "CollapseControlID", the CollapsiblePanel will
        // toggle when this control is clicked.       
        [IDReferenceProperty(typeof(WebControl))]
        [DefaultValue("")]
        [ExtenderControlProperty]
        public string ExpandControlID {
            get { return GetPropertyValue("ExpandControlID", String.Empty); }
            set { SetPropertyValue("ExpandControlID", value); }
        }

        // If true, and the panel is in its 'expanded' state, the panel will
        // automatically collapse when the mouse pointer moves off of the panel.
        [DefaultValue(false)]
        [ExtenderControlProperty]
        public bool AutoCollapse {
            get { return GetPropertyValue("AutoCollapse", false); }
            set { SetPropertyValue("AutoCollapse", value); }
        }

        // If true, and the panel is in its 'collapsed' state, the panel will
        // automatically expand when the mouse pointer moves into the panel.
        [DefaultValue(false)]
        [ExtenderControlProperty]
        public bool AutoExpand {
            get { return GetPropertyValue("AutoExpand", false); }
            set { SetPropertyValue("AutoExpand", value); }
        }

        // The size of the panel when it is in it's collapsed state.  To avoid flicker when your page
        // initializes, set the initial height (or width) of your Panel control to match this value, and set the Collapsed property
        // to 'true'.
        // 
        // The default value is -1, which indicates that the CollapsiblePanel should initialize the CollapsedSize based on the
        // initial size of the object.
        [DefaultValue(-1)]
        [ExtenderControlProperty]
        public int CollapsedSize {
            get { return GetPropertyValue("CollapseHeight", -1); }
            set { SetPropertyValue("CollapseHeight", value); }
        }

        // The size of the panel when it is in it's opened state.  To avoid flicker when your page
        // initializes, set the initial width of your Panel control to match this value, and set the Collapsed property
        // to 'false'.
        // 
        // The default value is -1, which indicates that the CollapsiblePanel should initialize the ExpandedSize based on the
        // parent div offsetheight if aligned vertically and parentdiv offsetwidth if aligned horizonatally.        
        [DefaultValue(-1)]
        [ExtenderControlProperty]
        public int ExpandedSize {
            get { return GetPropertyValue("ExpandedSize", -1); }
            set { SetPropertyValue("ExpandedSize", value); }
        }

        // Determines whether the contents of the panel should be scrolled or clipped if they do not fit into
        // the expanded size.
        [DefaultValue(false)]
        [ExtenderControlProperty]
        public bool ScrollContents {
            get { return GetPropertyValue("ScrollContents", false); }
            set { SetPropertyValue("ScrollContents", value); }
        }

        // Determines whether the CollapsiblePanelBehavior should suppress the click operations of the controls
        // referenced in CollapseControlID and/or ExpandControlID.  
        // 
        // By default, this value is false, except for anchor ("A") tags.
        [DefaultValue(false)]
        [ExtenderControlProperty]
        public bool SuppressPostBack {
            get { return GetPropertyValue("SuppressPostBack", false); }
            set { SetPropertyValue("SuppressPostBack", value); }
        }

        // Signals the initial collapsed state of the control.  Note this will not cause
        // an expanded control to collapse at initialization, but rather tells the extender
        // what the initial state of the Panel control is. 
        [DefaultValue(false)]
        [ExtenderControlProperty]
        public bool Collapsed {
            get { return GetPropertyValue("Collapsed", false); }
            set { SetPropertyValue("Collapsed", value); }
        }

        // The text to display in the collapsed state.  When the panel is collapsed,
        // the internal contents (anything between the start and ending tags) of the control referenced by
        // the TextLabelID property will be replaced with this text.  This collapsed text is also used
        // as the alternate text of the image if ImageControlID is set.
        [DefaultValue("")]
        [ExtenderControlProperty]
        public string CollapsedText {
            get { return GetPropertyValue("CollapsedText", String.Empty); }
            set { SetPropertyValue("CollapsedText", value); }
        }

        // The text to display in the expanded state.  When the panel is expanded,
        // the internal contents (anything between the start and ending tags) of the control referenced by
        // the TextLabelID property will be replaced with this text.  This expanded text is also used
        // as the alternate text of the image if ImageControlID is set.
        [DefaultValue("")]
        [ExtenderControlProperty]
        public string ExpandedText {
            get { return GetPropertyValue("ExpandedText", String.Empty); }
            set { SetPropertyValue("ExpandedText", value); }
        }

        // The ID of a label control to display the current state of the Panel.  When the collapsed state of the 
        // panel changes, the entire HTML contents (anything between the start and ending tags of the label) will be replaced
        // with the status text.
        [IDReferenceProperty(typeof(Label))]
        [DefaultValue("")]
        [ExtenderControlProperty]
        public string TextLabelID {
            get { return GetPropertyValue("TextLabelID", String.Empty); }
            set { SetPropertyValue("TextLabelID", value); }
        }

        // Image to be displayed when the Panel is expanded and the ImageControlID is set
        [DefaultValue("")]
        [UrlProperty]
        [ExtenderControlProperty]
        public string ExpandedImage {
            get { return GetPropertyValue("ExpandedImage", String.Empty); }
            set { SetPropertyValue("ExpandedImage", value); }
        }

        // Image to be displayed when the Panel is collapsed and the ImageControlID is set
        [DefaultValue("")]
        [UrlProperty]
        [ExtenderControlProperty]
        public string CollapsedImage {
            get { return GetPropertyValue("CollapsedImage", String.Empty); }
            set { SetPropertyValue("CollapsedImage", value); }
        }

        // The ID of an image control to display the current state of the Panel.  When the collapsed state of the 
        // panel changes, the image source will be changed from the ExpandedImage to the CollapsedImage.  We also
        // use the ExpandedText and CollapsedText as the image's alternate text if they are provided.
        [IDReferenceProperty(typeof(System.Web.UI.WebControls.Image))]
        [DefaultValue("")]
        [ExtenderControlProperty]
        public string ImageControlID {
            get { return GetPropertyValue("ImageControlID", String.Empty); }
            set { SetPropertyValue("ImageControlID", value); }
        }

        // The dimension to use for collapsing and expanding - vertical or horizontal.
        [DefaultValue(CollapsiblePanelExpandDirection.Vertical)]
        [ExtenderControlProperty]
        public CollapsiblePanelExpandDirection ExpandDirection {
            get { return GetPropertyValue("ExpandDirection", CollapsiblePanelExpandDirection.Vertical); }
            set { SetPropertyValue("ExpandDirection", value); }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public override void EnsureValid() {
            base.EnsureValid();

            if((ExpandedText != null || CollapsedText != null) && TextLabelID == null)
                throw new ArgumentException("If CollapsedText or ExpandedText is set, TextLabelID must also be set.");
        }

        void CollapsiblePanelExtender_ClientStateValuesLoaded(object sender, EventArgs e) {
            var ctrl = this.FindControl(this.TargetControlID) as WebControl;
            if(ctrl != null) {
                if(!String.IsNullOrEmpty(base.ClientState)) {
                    var collapsed = bool.Parse(base.ClientState);

                    if(collapsed)
                        ctrl.Style["display"] = "none";
                    else
                        ctrl.Style["display"] = String.Empty;
                }
            }
        }
    }

}
