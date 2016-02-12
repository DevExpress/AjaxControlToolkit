#pragma warning disable 1591
using AjaxControlToolkit.Design;
using System;
using System.ComponentModel;
using System.Diagnostics.CodeAnalysis;
using System.Drawing;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {

    /// <summary>
    /// An extender class which adds collapse/expand behavior to an ASP.NET Panel control.
    /// The panel that is extended can then be collapsed or expanded by the user of the page, which is handy
    /// for doing things like showing or hiding content or maximizing available space.
    /// </summary>
    [Designer(typeof(CollapsiblePanelExtenderDesigner))]
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

        /// <summary>
        /// The server ID of the control to initiate the collapse of the target panel. The panel will
        /// collapse when this control fires its client side "onclick" event
        /// </summary>
        /// <remarks>
        /// If this value is the same as the value for "ExpandControlID", the CollapsiblePanel will
        /// toggle when this control is clicked
        /// </remarks>
        [IDReferenceProperty(typeof(WebControl))]
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("collapseControlID")]
        public string CollapseControlID {
            get { return GetPropertyValue("CollapseControlID", String.Empty); }
            set { SetPropertyValue("CollapseControlID", value); }
        }

        /// <summary>
        /// The server ID of the control to initiate the expansion of the target panel.  The panel will
        /// opening when this control fires its client side "onclick" event
        /// </summary>
        /// <remarks>
        /// If this value is the same as the value for "CollapseControlID", the CollapsiblePanel will
        /// toggle when this control is clicked
        /// </remarks>
        [IDReferenceProperty(typeof(WebControl))]
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("expandControlID")]
        public string ExpandControlID {
            get { return GetPropertyValue("ExpandControlID", String.Empty); }
            set { SetPropertyValue("ExpandControlID", value); }
        }

        /// <summary>
        /// If true, and the panel is in its 'expanded' state, the panel will
        /// automatically collapse when the mouse pointer moves off of the panel.
        /// The default is false
        /// </summary>
        [DefaultValue(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("autoCollapse")]
        public bool AutoCollapse {
            get { return GetPropertyValue("AutoCollapse", false); }
            set { SetPropertyValue("AutoCollapse", value); }
        }

        /// <summary>
        /// If true, and the panel is in its 'collapsed' state, the panel will
        /// automatically expand when the mouse pointer moves into the panel.
        /// The default is false
        /// </summary>
        [DefaultValue(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("autoExpand")]
        public bool AutoExpand {
            get { return GetPropertyValue("AutoExpand", false); }
            set { SetPropertyValue("AutoExpand", value); }
        }

        /// <summary>
        /// The size of the panel when it is in it's collapsed state.  To avoid flicker when your page
        /// initializes, set the initial height (or width) of your Panel control to match this value, and set the Collapsed property
        /// to 'true'
        /// </summary>
        /// <remarks>
        /// The default value is -1, which indicates that the CollapsiblePanel should initialize the CollapsedSize based on the
        /// initial size of the object
        /// </remarks>
        [DefaultValue(-1)]
        [ExtenderControlProperty]
        [ClientPropertyName("collapsedSize")]
        public int CollapsedSize {
            get { return GetPropertyValue("CollapseHeight", -1); }
            set { SetPropertyValue("CollapseHeight", value); }
        }

        /// <summary>
        /// The size of the panel when it is in it's opened state.  To avoid flicker when your page
        /// initializes, set the initial width of your Panel control to match this value, and set the Collapsed property
        /// to 'false'
        /// </summary>
        /// <remarks>
        /// The default value is -1, which indicates that the CollapsiblePanel should initialize the ExpandedSize based on the
        /// parent div offsetheight if aligned vertically and parentdiv offsetwidth if aligned horizonatally    
        /// </remarks>
        [DefaultValue(-1)]
        [ExtenderControlProperty]
        public int ExpandedSize {
            get { return GetPropertyValue("ExpandedSize", -1); }
            set { SetPropertyValue("ExpandedSize", value); }
        }

        /// <summary>
        /// Determines whether the contents of the panel should be scrolled or clipped if they do not fit into
        /// the expanded size.
        /// The default is false
        /// </summary>
        [DefaultValue(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("scrollContents")]
        public bool ScrollContents {
            get { return GetPropertyValue("ScrollContents", false); }
            set { SetPropertyValue("ScrollContents", value); }
        }

        /// <summary>
        /// Determines whether the CollapsiblePanelBehavior should suppress the click operations of the controls
        /// referenced in CollapseControlID and/or ExpandControlID. 
        /// </summary>
        /// <remarks>
        /// By default, this value is false, except for anchor ("A") tags
        /// </remarks>
        [DefaultValue(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("suppressPostBack")]
        public bool SuppressPostBack {
            get { return GetPropertyValue("SuppressPostBack", false); }
            set { SetPropertyValue("SuppressPostBack", value); }
        }

        /// <summary>
        /// Signals the initial collapsed state of the control.  Note this will not cause
        /// an expanded control to collapse at initialization, but rather tells the extender
        /// what the initial state of the Panel control is.
        /// The default is false
        /// </summary>
        [DefaultValue(false)]
        [ExtenderControlProperty]
        [ClientPropertyName("collapsed")]
        public bool Collapsed {
            get { return GetPropertyValue("Collapsed", false); }
            set { SetPropertyValue("Collapsed", value); }
        }

        /// <summary>
        /// The text to display in the collapsed state.  When the panel is collapsed,
        /// the internal contents (anything between the start and ending tags) of the control referenced by
        /// the TextLabelID property will be replaced with this text.  This collapsed text is also used
        /// as the alternate text of the image if ImageControlID is set
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("collapsedText")]
        public string CollapsedText {
            get { return GetPropertyValue("CollapsedText", String.Empty); }
            set { SetPropertyValue("CollapsedText", value); }
        }

        /// <summary>
        /// The text to display in the expanded state.  When the panel is expanded,
        /// the internal contents (anything between the start and ending tags) of the control referenced by
        /// the TextLabelID property will be replaced with this text.  This expanded text is also used
        /// as the alternate text of the image if ImageControlID is set
        /// </summary>
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("expandedText")]
        public string ExpandedText {
            get { return GetPropertyValue("ExpandedText", String.Empty); }
            set { SetPropertyValue("ExpandedText", value); }
        }

        /// <summary>
        /// The ID of a label control to display the current state of the Panel.  When the collapsed state of the 
        /// panel changes, the entire HTML contents (anything between the start and ending tags of the label) will be replaced
        /// with the status text
        /// </summary>
        [IDReferenceProperty(typeof(Label))]
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("textLabelID")]
        public string TextLabelID {
            get { return GetPropertyValue("TextLabelID", String.Empty); }
            set { SetPropertyValue("TextLabelID", value); }
        }

        /// <summary>
        /// Image to be displayed when the Panel is expanded and the ImageControlID is set
        /// </summary>
        [DefaultValue("")]
        [UrlProperty]
        [ExtenderControlProperty]
        [ClientPropertyName("expandedImage")]
        public string ExpandedImage {
            get { return GetPropertyValue("ExpandedImage", String.Empty); }
            set { SetPropertyValue("ExpandedImage", value); }
        }

        /// <summary>
        /// Image to be displayed when the Panel is collapsed and the ImageControlID is set
        /// </summary>
        [DefaultValue("")]
        [UrlProperty]
        [ExtenderControlProperty]
        [ClientPropertyName("collapsedImage")]
        public string CollapsedImage {
            get { return GetPropertyValue("CollapsedImage", String.Empty); }
            set { SetPropertyValue("CollapsedImage", value); }
        }

        /// <summary>
        /// The ID of an image control to display the current state of the Panel.  When the collapsed state of the 
        /// panel changes, the image source will be changed from the ExpandedImage to the CollapsedImage.  We also
        /// use the ExpandedText and CollapsedText as the image's alternate text if they are provided
        /// </summary>
        [IDReferenceProperty(typeof(System.Web.UI.WebControls.Image))]
        [DefaultValue("")]
        [ExtenderControlProperty]
        [ClientPropertyName("imageControlID")]
        public string ImageControlID {
            get { return GetPropertyValue("ImageControlID", String.Empty); }
            set { SetPropertyValue("ImageControlID", value); }
        }

        /// <summary>
        /// The dimension to use for collapsing and expanding - vertical or horizontal
        /// </summary>
        [DefaultValue(CollapsiblePanelExpandDirection.Vertical)]
        [ExtenderControlProperty]
        [ClientPropertyName("expandDirection")]
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

#pragma warning restore 1591