using System.Collections.Generic;
using System.Web.UI;
using System.ComponentModel;
using System.Drawing.Design;
using System.Collections;
using System;
using System.Drawing;

namespace AjaxControlToolkit {

    /// <summary>
    /// The Seadragon control can be used for interactively viewing images. Use your mouse to pan and zoom around the image.
    /// </summary>
    [ClientScriptResource("Sys.Extended.UI.Seadragon.Viewer", Constants.SeadragonName)]
    [ToolboxData("<{0}:Seadragon runat=server></{0}:Seadragon>")]
    [ToolboxBitmap(typeof(ToolboxIcons.Accessor), Constants.SeadragonName + Constants.IconPostfix)]
    public class Seadragon : ScriptControlBase {
        List<SeadragonControl> _controls;
        List<SeadragonOverlay> _overlays;
        ArrayList _controlsDescriptor;
        ArrayList _overlaysDescriptor;

        readonly string[] _imageNames = new[] {
            Constants.SeadragonFullpageGrouphoverImage,
            Constants.SeadragonFullpageHoverImage,
            Constants.SeadragonFullpagePressedImage,
            Constants.SeadragonFullpageRestImage,
            Constants.SeadragonHomeGrouphoverImage,
            Constants.SeadragonHomeHoverImage,
            Constants.SeadragonHomePressedImage,
            Constants.SeadragonHomeRestImage,
            Constants.SeadragonZoominGrouphoverImage,
            Constants.SeadragonZoominHoverImage,
            Constants.SeadragonZoominPressedImage,
            Constants.SeadragonZoominRestImage,
            Constants.SeadragonZoomoutGrouphoverImage,
            Constants.SeadragonZoomoutHoverImage,
            Constants.SeadragonZoomoutPressedImage,
            Constants.SeadragonZoomoutRestImage
        };

        public Seadragon()
            : base(HtmlTextWriterTag.Unknown) {
        }

        /// <summary>
        /// The amount of time in seconds that animations should last. Default is 1.5.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(1.5f)]
        [ClientPropertyName("animationTime")]
        public float AnimationTime {
            get { return GetPropertyValue<float>("AnimationTime", 1.5f); }
            set { SetPropertyValue<float>("AnimationTime", value); }
        }

        /// <summary>
        /// Whether navigation buttons should be shown.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("showNavigationControl")]
        public bool ShowNavigationControl {
            get { return GetPropertyValue<bool>("ShowNavigationControl", true); }
            set { SetPropertyValue<bool>("ShowNavigationControl", value); }
        }

        /// <summary>
        /// The amount of time in seconds that new tiles take to blend from transparent to opaque. Default is 0.5.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0.5f)]
        [ClientPropertyName("blendTime")]
        public float BlendTime {
            get { return GetPropertyValue<float>("BlendTime", 0.5f); }
            set { SetPropertyValue<float>("BlendTime", value); }
        }

        /// <summary>
        /// Whether tiles should always blend in and out, not just when they're first loaded. Default is false.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("alwaysBlend")]
        public bool AlwaysBlend {
            get { return GetPropertyValue<bool>("AlwaysBlend", false); }
            set { SetPropertyValue<bool>("AlwaysBlend", value); }
        }

        /// <summary>
        /// Whether controls should get automatically hidden when the user's mouse is off the
        /// viewer and the image has stopped animating. Default is true.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("autoHideControls")]
        public bool AutoHideControls {
            get { return GetPropertyValue<bool>("AutoHideControls", true); }
            set { SetPropertyValue<bool>("AutoHideControls", value); }
        }

        /// <summary>
        /// Whether the most appropriate tiles should always be rendered first, before any lower-res tiles are
        /// rendered. This loses the "sharpening" effect and instead creates a very visible "tiling" effect. Default is false.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("immediateRender")]
        public bool ImmediateRender {
            get { return GetPropertyValue<bool>("ImmediateRender", true); }
            set { SetPropertyValue<bool>("ImmediateRender", value); }
        }

        /// <summary>
        /// Whether or not control to use horizontal wrapping.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("wrapHorizontal")]
        public bool WrapHorizontal {
            get { return GetPropertyValue<bool>("WrapHorizontal", false); }
            set { SetPropertyValue<bool>("WrapHorizontal", value); }
        }

        /// <summary>
        /// Whether or not control to use vertical wrapping.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("wrapVertical")]
        public bool WrapVertical {
            get { return GetPropertyValue<bool>("WrapVertical", false); }
            set { SetPropertyValue<bool>("WrapVertical", value); }
        }

        /// <summary>
        /// The minimum size (in screen pixels) of either dimension that can result from zooming out. Default is 16.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0.8f)]
        [ClientPropertyName("minZoomDimension")]
        public float MinZoomDimension {
            get { return GetPropertyValue<float>("MinZoomDimension", 0.8f); }
            set { SetPropertyValue<float>("MinZoomDimension", value); }
        }

        /// <summary>
        /// The maximum pixel ratio (screen pixel to content pixel) that can result from zooming in. Default is 4.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(2f)]
        [ClientPropertyName("maxZoomPixelRatio")]
        public float MaxZoomPixelRatio {
            get { return GetPropertyValue<float>("MaxZoomPixelRatio", 2f); }
            set { SetPropertyValue<float>("MaxZoomPixelRatio", value); }
        }

        /// <summary>
        /// The minimum portion of the viewport that must show visible content in both dimensions. Default is 0.1.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0.5f)]
        [ClientPropertyName("visibilityRatio")]
        public float VisibilityRatio {
            get { return GetPropertyValue<float>("VisibilityRatio", 0.5f); }
            set { SetPropertyValue<float>("VisibilityRatio", value); }
        }

        /// <summary>
        /// Determines how sharply the springs used for animations move. Default is 5.0.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(5.0f)]
        [ClientPropertyName("springStiffness")]
        public float SpringStiffness {
            get { return GetPropertyValue<float>("SpringStiffness", 5.0f); }
            set { SetPropertyValue<float>("SpringStiffness", value); }
        }

        /// <summary>
        /// The maximum number of concurrent image downloads that can be performed by each viewer. Default is 2.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(2)]
        [ClientPropertyName("imageLoaderLimit")]
        public int ImageLoaderLimit {
            get { return GetPropertyValue<int>("SpringStiffness", 2); }
            set { SetPropertyValue<int>("SpringStiffness", value); }
        }

        /// <summary>
        /// The maximum number of milliseconds that can pass between a mousedown and a mouseup for the action to still be considered a "quick" click. Default is 200.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(200)]
        [ClientPropertyName("clickTimeThreshold")]
        public int ClickTimeThreshold {
            get { return GetPropertyValue<int>("ClickTimeThreshold", 200); }
            set { SetPropertyValue<int>("ClickTimeThreshold", value); }
        }

        /// <summary>
        /// The maximum number of pixels the mouse can move between a mousedown and a mouseup for the action to still be considered a "quick" click. Default is 5.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(2)]
        [ClientPropertyName("clickDistThreshold")]
        public int clickDistThreshold {
            get { return GetPropertyValue<int>("clickDistThreshold", 2); }
            set { SetPropertyValue<int>("clickDistThreshold", value); }
        }

        /// <summary>
        /// The factor by which images should zoom when clicked on. Default is 2.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(2.0f)]
        [ClientPropertyName("zoomPerClick")]
        public float ZoomPerClick {
            get { return GetPropertyValue<float>("ZoomPerClick", 2.0f); }
            set { SetPropertyValue<float>("ZoomPerClick", value); }
        }

        /// <summary>
        /// The factor by which images should zoom over each second when the zoom buttons are held down. Default is 2.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(2.0f)]
        [ClientPropertyName("zoomPerSecond")]
        public float ZoomPerSecond {
            get { return GetPropertyValue<float>("ZoomPerSecond", 2.0f); }
            set { SetPropertyValue<float>("ZoomPerSecond", value); }
        }

        /// <summary>
        /// Maximum image cache count.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(100)]
        [ClientPropertyName("maxImageCacheCount")]
        public int MaxImageCacheCount {
            get { return GetPropertyValue<int>("maxImageCacheCount", 100); }
            set { SetPropertyValue<int>("maxImageCacheCount", value); }
        }

        /// <summary>
        /// Minimum pixel ratio.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(0.5f)]
        [ClientPropertyName("minPixelRatio")]
        public float MinPixelRatio {
            get { return GetPropertyValue<float>("MinPixelRatio", 0.5f); }
            set { SetPropertyValue<float>("MinPixelRatio", value); }
        }

        /// <summary>
        /// The name of a JavaScript function executed on the client-side after image opened.
        /// </summary>
        [ExtenderControlEvent]
        [ClientPropertyName("0pen")]
        [DefaultValue("")]
        public string OnClientOpen {
            get { return GetPropertyValue<string>("OnClientOpen", String.Empty); }
            set { SetPropertyValue<string>("OnClientOpen", value); }
        }

        /// <summary>
        /// The name of a JavaScript function executed on the client-side on error.
        /// </summary>
        [ExtenderControlEvent]
        [ClientPropertyName("error")]
        [DefaultValue("")]
        public string OnClientError {
            get { return GetPropertyValue<string>("OnClientError", String.Empty); }
            set { SetPropertyValue<string>("OnClientError", value); }
        }

        /// <summary>
        /// The name of a JavaScript function executed on the client-side on ignore.
        /// </summary>
        [ExtenderControlEvent]
        [DefaultValue("")]
        [ClientPropertyName("ignore")]
        public string OnClientIgnore {
            get { return GetPropertyValue<string>("OnClientIgnore", String.Empty); }
            set { SetPropertyValue<string>("OnClientIgnore", value); }
        }

        /// <summary>
        /// The name of a JavaScript function executed on the client-side when image resized.
        /// </summary>
        [ExtenderControlEvent]
        [DefaultValue("")]
        [ClientPropertyName("resize")]
        public string OnClientResize {
            get { return GetPropertyValue<string>("OnClientResize", String.Empty); }
            set { SetPropertyValue<string>("OnClientResize", value); }
        }

        /// <summary>
        /// The name of a JavaScript function executed on the client-side when animation starts.
        /// </summary>
        [ExtenderControlEvent]
        [DefaultValue("")]
        [ClientPropertyName("animationstart")]
        public string OnClientAnimationStart {
            get { return GetPropertyValue<string>("OnClientAnimationStart", String.Empty); }
            set { SetPropertyValue<string>("OnClientAnimationStart", value); }
        }

        /// <summary>
        /// The name of a JavaScript function executed on the client-side when animation ends.
        /// </summary>
        [ExtenderControlEvent]
        [DefaultValue("")]
        [ClientPropertyName("animationend")]
        public string OnClientAnimationEnd {
            get { return GetPropertyValue<string>("OnClientAnimationEnd", String.Empty); }
            set { SetPropertyValue<string>("OnClientAnimationEnd", value); }
        }

        /// <summary>
        /// The name of a JavaScript function executed on the client-side on animation.
        /// </summary>
        [ExtenderControlEvent]
        [DefaultValue("")]
        [ClientPropertyName("animation")]
        public string OnClientAnimation {
            get { return GetPropertyValue<string>("OnClientAnimation", String.Empty); }
            set { SetPropertyValue<string>("OnClientAnimation", value); }
        }

        /// <summary>
        /// Whether mouse navigation is enabled.
        /// </summary>
        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("mouseNavEnabled")]
        public bool MouseNavEnabled {
            get { return GetPropertyValue<bool>("MouseNavEnabled", true); }
            set { SetPropertyValue<bool>("MouseNavEnabled", value); }
        }

        /// <summary>
        /// The path for all UI images. This can be absolute or relative. If relative,
        /// it must be relative to the HTML page. A change to this value will only affect new viewers. Default is "img/".
        /// </summary>
        [EditorAttribute(typeof(SeadragonUrlEditor), typeof(UITypeEditor))]
        public string SourceUrl {
            get { return GetPropertyValue<string>("SourceUrl", String.Empty); }
            set { SetPropertyValue<string>("SourceUrl", value); }
        }

        /// <summary>
        /// Controls collection.
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [NotifyParentProperty(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        public List<SeadragonControl> ControlsCollection {
            get {
                if(_controls == null)
                    _controls = new List<SeadragonControl>();

                return _controls;
            }
        }

        /// <summary>
        /// Controls.
        /// </summary>
        [EditorBrowsable(EditorBrowsableState.Never)]
        public override ControlCollection Controls {
            get { return base.Controls; }
        }

        protected override ControlCollection CreateControlCollection() {
            return base.CreateControlCollection();
        }

        /// <summary>
        /// Overlays collection.
        /// </summary>
        [PersistenceMode(PersistenceMode.InnerProperty)]
        [NotifyParentProperty(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        [Editor(typeof(OverlayCollectionEditor), typeof(UITypeEditor))]
        public List<SeadragonOverlay> OverlaysCollection {
            get {
                if(_overlays == null)
                    _overlays = new List<SeadragonOverlay>();

                return _overlays;
            }
        }

        protected override HtmlTextWriterTag TagKey {
            get { return HtmlTextWriterTag.Div; }
        }

        protected override void CreateChildControls() {
            _controlsDescriptor = new ArrayList();
            _overlaysDescriptor = new ArrayList();

            foreach(SeadragonControl ctl in ControlsCollection) {
                Controls.Add(ctl);
                _controlsDescriptor.Add(new { id = ctl.ClientID, anchor = ctl.Anchor });
            }

            foreach(SeadragonOverlay ctl in OverlaysCollection) {
                Controls.Add(ctl);
                if(ctl is SeadragonFixedOverlay) {
                    var fixedOverlay = ctl as SeadragonFixedOverlay;
                    _overlaysDescriptor.Add(new { id = fixedOverlay.ClientID, point = fixedOverlay.Point, placement = fixedOverlay.Placement });
                } else {
                    var scalableOverlay = ctl as SeadragonScalableOverlay;
                    _overlaysDescriptor.Add(new { id = scalableOverlay.ClientID, rect = scalableOverlay.Rect });
                }
            }
        }

        protected override void DescribeComponent(ScriptComponentDescriptor descriptor) {
            base.DescribeComponent(descriptor);
            descriptor.AddProperty("controls", _controlsDescriptor);
            descriptor.AddProperty("overlays", _overlaysDescriptor);
            descriptor.AddProperty("xmlPath", ResolveClientUrl(SourceUrl));
            descriptor.AddProperty("prefixUrl", Page.Request.ApplicationPath);
        }

        protected V GetPropertyValue<V>(string propertyName, V nullValue) {
            if(ViewState[propertyName] == null)
                return nullValue;

            return (V)ViewState[propertyName];
        }

        protected void SetPropertyValue<V>(string propertyName, V value) {
            ViewState[propertyName] = value;
        }

        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);
            ToolkitResourceManager.RegisterImagePaths(_imageNames, this);
        }
    }

}
