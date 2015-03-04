using System.Collections.Generic;
using System.Web.UI;
using System.ComponentModel;
using System.Drawing.Design;
using System.Collections;
using System;
using System.Drawing;

namespace AjaxControlToolkit {

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

        [ExtenderControlProperty]
        [DefaultValue(1.5f)]
        [ClientPropertyName("animationTime")]
        public float AnimationTime {
            get { return GetPropertyValue<float>("AnimationTime", 1.5f); }
            set { SetPropertyValue<float>("AnimationTime", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("showNavigationControl")]
        public bool ShowNavigationControl {
            get { return GetPropertyValue<bool>("ShowNavigationControl", true); }
            set { SetPropertyValue<bool>("ShowNavigationControl", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(0.5f)]
        [ClientPropertyName("blendTime")]
        public float BlendTime {
            get { return GetPropertyValue<float>("BlendTime", 0.5f); }
            set { SetPropertyValue<float>("BlendTime", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("alwaysBlend")]
        public bool AlwaysBlend {
            get { return GetPropertyValue<bool>("AlwaysBlend", false); }
            set { SetPropertyValue<bool>("AlwaysBlend", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("autoHideControls")]
        public bool AutoHideControls {
            get { return GetPropertyValue<bool>("AutoHideControls", true); }
            set { SetPropertyValue<bool>("AutoHideControls", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("immediateRender")]
        public bool ImmediateRender {
            get { return GetPropertyValue<bool>("ImmediateRender", true); }
            set { SetPropertyValue<bool>("ImmediateRender", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("wrapHorizontal")]
        public bool WrapHorizontal {
            get { return GetPropertyValue<bool>("WrapHorizontal", false); }
            set { SetPropertyValue<bool>("WrapHorizontal", value); }
        }


        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("wrapVertical")]
        public bool WrapVertical {
            get { return GetPropertyValue<bool>("WrapVertical", false); }
            set { SetPropertyValue<bool>("WrapVertical", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(0.8f)]
        [ClientPropertyName("minZoomDimension")]
        public float MinZoomDimension {
            get { return GetPropertyValue<float>("MinZoomDimension", 0.8f); }
            set { SetPropertyValue<float>("MinZoomDimension", value); }
        }


        [ExtenderControlProperty]
        [DefaultValue(2f)]
        [ClientPropertyName("maxZoomPixelRatio")]
        public float MaxZoomPixelRatio {
            get { return GetPropertyValue<float>("MaxZoomPixelRatio", 2f); }
            set { SetPropertyValue<float>("MaxZoomPixelRatio", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(0.5f)]
        [ClientPropertyName("visibilityRatio")]
        public float VisibilityRatio {
            get { return GetPropertyValue<float>("VisibilityRatio", 0.5f); }
            set { SetPropertyValue<float>("VisibilityRatio", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(5.0f)]
        [ClientPropertyName("springStiffness")]
        public float SpringStiffness {
            get { return GetPropertyValue<float>("SpringStiffness", 5.0f); }
            set { SetPropertyValue<float>("SpringStiffness", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(2)]
        [ClientPropertyName("imageLoaderLimit")]
        public int ImageLoaderLimit {
            get { return GetPropertyValue<int>("SpringStiffness", 2); }
            set { SetPropertyValue<int>("SpringStiffness", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(200)]
        [ClientPropertyName("clickTimeThreshold")]
        public int ClickTimeThreshold {
            get { return GetPropertyValue<int>("ClickTimeThreshold", 200); }
            set { SetPropertyValue<int>("ClickTimeThreshold", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(2)]
        [ClientPropertyName("clickDistThreshold")]
        public int clickDistThreshold {
            get { return GetPropertyValue<int>("clickDistThreshold", 2); }
            set { SetPropertyValue<int>("clickDistThreshold", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(2.0f)]
        [ClientPropertyName("zoomPerClick")]
        public float ZoomPerClick {
            get { return GetPropertyValue<float>("ZoomPerClick", 2.0f); }
            set { SetPropertyValue<float>("ZoomPerClick", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(2.0f)]
        [ClientPropertyName("zoomPerSecond")]
        public float ZoomPerSecond {
            get { return GetPropertyValue<float>("ZoomPerSecond", 2.0f); }
            set { SetPropertyValue<float>("ZoomPerSecond", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(100)]
        [ClientPropertyName("maxImageCacheCount")]
        public int MaxImageCacheCount {
            get { return GetPropertyValue<int>("maxImageCacheCount", 100); }
            set { SetPropertyValue<int>("maxImageCacheCount", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(0.5f)]
        [ClientPropertyName("minPixelRatio")]
        public float MinPixelRatio {
            get { return GetPropertyValue<float>("MinPixelRatio", 0.5f); }
            set { SetPropertyValue<float>("MinPixelRatio", value); }
        }

        [ExtenderControlEvent]
        [ClientPropertyName("0pen")]
        [DefaultValue("")]
        public string OnClientOpen {
            get { return GetPropertyValue<string>("OnClientOpen", String.Empty); }
            set { SetPropertyValue<string>("OnClientOpen", value); }
        }

        [ExtenderControlEvent]
        [ClientPropertyName("error")]
        [DefaultValue("")]
        public string OnClientError {
            get { return GetPropertyValue<string>("OnClientError", String.Empty); }
            set { SetPropertyValue<string>("OnClientError", value); }
        }

        [ExtenderControlEvent]
        [DefaultValue("")]
        [ClientPropertyName("ignore")]
        public string OnClientIgnore {
            get { return GetPropertyValue<string>("OnClientIgnore", String.Empty); }
            set { SetPropertyValue<string>("OnClientIgnore", value); }
        }

        [ExtenderControlEvent]
        [DefaultValue("")]
        [ClientPropertyName("resize")]
        public string OnClientResize {
            get { return GetPropertyValue<string>("OnClientResize", String.Empty); }
            set { SetPropertyValue<string>("OnClientResize", value); }
        }

        [ExtenderControlEvent]
        [DefaultValue("")]
        [ClientPropertyName("animationstart")]
        public string OnClientAnimationStart {
            get { return GetPropertyValue<string>("OnClientAnimationStart", String.Empty); }
            set { SetPropertyValue<string>("OnClientAnimationStart", value); }
        }

        [ExtenderControlEvent]
        [DefaultValue("")]
        [ClientPropertyName("animationend")]
        public string OnClientAnimationEnd {
            get { return GetPropertyValue<string>("OnClientAnimationEnd", String.Empty); }
            set { SetPropertyValue<string>("OnClientAnimationEnd", value); }
        }

        [ExtenderControlEvent]
        [DefaultValue("")]
        [ClientPropertyName("animation")]
        public string OnClientAnimation {
            get { return GetPropertyValue<string>("OnClientAnimation", String.Empty); }
            set { SetPropertyValue<string>("OnClientAnimation", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("mouseNavEnabled")]
        public bool MouseNavEnabled {
            get { return GetPropertyValue<bool>("MouseNavEnabled", true); }
            set { SetPropertyValue<bool>("MouseNavEnabled", value); }
        }
        [EditorAttribute(typeof(SeadragonUrlEditor), typeof(UITypeEditor))]
        public string SourceUrl {
            get { return GetPropertyValue<string>("SourceUrl", String.Empty); }
            set { SetPropertyValue<string>("SourceUrl", value); }
        }

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

        [EditorBrowsable(EditorBrowsableState.Never)]
        public override ControlCollection Controls {
            get { return base.Controls; }
        }

        protected override ControlCollection CreateControlCollection() {
            return base.CreateControlCollection();
        }

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
