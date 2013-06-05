using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI.WebControls;
using System.Web.UI;
using System.ComponentModel;
using System.Web.UI.Design;
using System.Drawing.Design;
using System.Web.UI.HtmlControls;
using System.Collections;
using System.Drawing;


[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Utils.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Utils.debug.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Buttons.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Buttons.debug.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.DisplayRect.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.DisplayRect.debug.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.ImageLoader.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.ImageLoader.debug.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Profiler.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Profiler.debug.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Rect.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Rect.debug.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Spring.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Spring.debug.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Drawer.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Drawer.debug.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.TileSource.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.TileSource.debug.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.DeepZoom.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.DeepZoom.debug.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Viewport.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Viewport.debug.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Strings.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Strings.debug.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.debug.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Config.js", "text/javascript", PerformSubstitution = true)]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Config.debug.js", "text/javascript", PerformSubstitution = true)]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.MouseTracker.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.MouseTracker.debug.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Point.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.Seadragon.Point.debug.js", "text/javascript")]
[assembly: System.Web.UI.WebResource("Seadragon.images.fullpage_grouphover.png", "img/png")]
[assembly: System.Web.UI.WebResource("Seadragon.images.fullpage_hover.png", "img/png")]
[assembly: System.Web.UI.WebResource("Seadragon.images.fullpage_pressed.png", "img/png")]
[assembly: System.Web.UI.WebResource("Seadragon.images.fullpage_rest.png", "img/png")]
[assembly: System.Web.UI.WebResource("Seadragon.images.home_grouphover.png", "img/png")]
[assembly: System.Web.UI.WebResource("Seadragon.images.home_hover.png", "img/png")]
[assembly: System.Web.UI.WebResource("Seadragon.images.home_pressed.png", "img/png")]
[assembly: System.Web.UI.WebResource("Seadragon.images.home_rest.png", "img/png")]
[assembly: System.Web.UI.WebResource("Seadragon.images.zoomin_grouphover.png", "img/png")]
[assembly: System.Web.UI.WebResource("Seadragon.images.zoomin_hover.png", "img/png")]
[assembly: System.Web.UI.WebResource("Seadragon.images.zoomin_pressed.png", "img/png")]
[assembly: System.Web.UI.WebResource("Seadragon.images.zoomin_rest.png", "img/png")]
[assembly: System.Web.UI.WebResource("Seadragon.images.zoomout_grouphover.png", "img/png")]
[assembly: System.Web.UI.WebResource("Seadragon.images.zoomout_hover.png", "img/png")]
[assembly: System.Web.UI.WebResource("Seadragon.images.zoomout_pressed.png", "img/png")]
[assembly: System.Web.UI.WebResource("Seadragon.images.zoomout_rest.png", "img/png")]
namespace AjaxControlToolkit
{
    [ClientScriptResource("Sys.Extended.UI.Seadragon.Viewer", "Seadragon.Seadragon.Utils.js", LoadOrder = 0)]
    [ClientScriptResource("Sys.Extended.UI.Seadragon.Viewer", "Seadragon.Seadragon.Buttons.js", LoadOrder = 1)]
    [ClientScriptResource("Sys.Extended.UI.Seadragon.Viewer", "Seadragon.Seadragon.Config.js", LoadOrder = 2)]
    [ClientScriptResource("Sys.Extended.UI.Seadragon.Viewer", "Seadragon.Seadragon.js", LoadOrder = 3)]
    [ClientScriptResource("Sys.Extended.UI.Seadragon.Viewer", "Seadragon.Seadragon.MouseTracker.js", LoadOrder = 4)]
    [ClientScriptResource("Sys.Extended.UI.Seadragon.Viewer", "Seadragon.Seadragon.Point.js", LoadOrder = 5)]
    [ClientScriptResource("Sys.Extended.UI.Seadragon.Viewer", "Seadragon.Seadragon.Strings.js", LoadOrder = 6)]
    [ClientScriptResource("Sys.Extended.UI.Seadragon.Viewer", "Seadragon.Seadragon.Drawer.js", LoadOrder = 7)]
    [ClientScriptResource("Sys.Extended.UI.Seadragon.Viewer", "Seadragon.Seadragon.TileSource.js", LoadOrder = 8)]
    [ClientScriptResource("Sys.Extended.UI.Seadragon.Viewer", "Seadragon.Seadragon.DeepZoom.js", LoadOrder = 9)]
    [ClientScriptResource("Sys.Extended.UI.Seadragon.Viewer", "Seadragon.Seadragon.Rect.js", LoadOrder = 10)]
    [ClientScriptResource("Sys.Extended.UI.Seadragon.Viewer", "Seadragon.Seadragon.ImageLoader.js", LoadOrder = 11)]
    [ClientScriptResource("Sys.Extended.UI.Seadragon.Viewer", "Seadragon.Seadragon.Profiler.js", LoadOrder = 12)]
    [ClientScriptResource("Sys.Extended.UI.Seadragon.Viewer", "Seadragon.Seadragon.Spring.js", LoadOrder = 13)]
    [ClientScriptResource("Sys.Extended.UI.Seadragon.Viewer", "Seadragon.Seadragon.Viewport.js", LoadOrder = 14)]
    [ClientScriptResource("Sys.Extended.UI.Seadragon.Viewer", "Seadragon.Seadragon.DisplayRect.js", LoadOrder = 15)]
    [ParseChildren(true)]
    [PersistChildren(false)]
    [Designer("AjaxControlToolkit.SeadragonDesigner, AjaxControlToolkit")]
    [ToolboxData("<{0}:Seadragon runat=server></{0}:Seadragon>")]
    public class Seadragon : ScriptControlBase
    {
        private List<SeadragonControl> _controls;
        private List<SeadragonOverlay> _overlays;
        private ArrayList _controlsDescriptor;
        private ArrayList _overlaysDescriptor;

        #region [ Properties ]

        [ExtenderControlProperty]
        [DefaultValue(1.5f)]
        [ClientPropertyName("animationTime")]
        public float AnimationTime
        {
            get { return GetPropertyValue<float>("AnimationTime", 1.5f); }
            set { SetPropertyValue<float>("AnimationTime", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("showNavigationControl")]
        public bool ShowNavigationControl
        {
            get { return GetPropertyValue<bool>("ShowNavigationControl", true); }
            set { SetPropertyValue<bool>("ShowNavigationControl", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(0.5f)]
        [ClientPropertyName("blendTime")]
        public float BlendTime
        {
            get { return GetPropertyValue<float>("BlendTime", 0.5f); }
            set { SetPropertyValue<float>("BlendTime", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("alwaysBlend")]
        public bool AlwaysBlend
        {
            get { return GetPropertyValue<bool>("AlwaysBlend", false); }
            set { SetPropertyValue<bool>("AlwaysBlend", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("autoHideControls")]
        public bool AutoHideControls
        {
            get { return GetPropertyValue<bool>("AutoHideControls", true); }
            set { SetPropertyValue<bool>("AutoHideControls", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("immediateRender")]
        public bool ImmediateRender
        {
            get { return GetPropertyValue<bool>("ImmediateRender", true); }
            set { SetPropertyValue<bool>("ImmediateRender", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("wrapHorizontal")]
        public bool WrapHorizontal
        {
            get { return GetPropertyValue<bool>("WrapHorizontal", false); }
            set { SetPropertyValue<bool>("WrapHorizontal", value); }
        }


        [ExtenderControlProperty]
        [DefaultValue(false)]
        [ClientPropertyName("wrapVertical")]
        public bool WrapVertical
        {
            get { return GetPropertyValue<bool>("WrapVertical", false); }
            set { SetPropertyValue<bool>("WrapVertical", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(0.8f)]
        [ClientPropertyName("minZoomDimension")]
        public float MinZoomDimension
        {
            get { return GetPropertyValue<float>("MinZoomDimension", 0.8f); }
            set { SetPropertyValue<float>("MinZoomDimension", value); }
        }


        [ExtenderControlProperty]
        [DefaultValue(2f)]
        [ClientPropertyName("maxZoomPixelRatio")]
        public float MaxZoomPixelRatio
        {
            get { return GetPropertyValue<float>("MaxZoomPixelRatio", 2f); }
            set { SetPropertyValue<float>("MaxZoomPixelRatio", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(0.5f)]
        [ClientPropertyName("visibilityRatio")]
        public float VisibilityRatio
        {
            get { return GetPropertyValue<float>("VisibilityRatio", 0.5f); }
            set { SetPropertyValue<float>("VisibilityRatio", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(5.0f)]
        [ClientPropertyName("springStiffness")]
        public float SpringStiffness
        {
            get { return GetPropertyValue<float>("SpringStiffness", 5.0f); }
            set { SetPropertyValue<float>("SpringStiffness", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(2)]
        [ClientPropertyName("imageLoaderLimit")]
        public int ImageLoaderLimit
        {
            get { return GetPropertyValue<int>("SpringStiffness", 2); }
            set { SetPropertyValue<int>("SpringStiffness", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(200)]
        [ClientPropertyName("clickTimeThreshold")]
        public int ClickTimeThreshold
        {
            get { return GetPropertyValue<int>("ClickTimeThreshold", 200); }
            set { SetPropertyValue<int>("ClickTimeThreshold", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(2)]
        [ClientPropertyName("clickDistThreshold")]
        public int clickDistThreshold
        {
            get { return GetPropertyValue<int>("clickDistThreshold", 2); }
            set { SetPropertyValue<int>("clickDistThreshold", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(2.0f)]
        [ClientPropertyName("zoomPerClick")]
        public float ZoomPerClick
        {
            get { return GetPropertyValue<float>("ZoomPerClick", 2.0f); }
            set { SetPropertyValue<float>("ZoomPerClick", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(2.0f)]
        [ClientPropertyName("zoomPerSecond")]
        public float ZoomPerSecond
        {
            get { return GetPropertyValue<float>("ZoomPerSecond", 2.0f); }
            set { SetPropertyValue<float>("ZoomPerSecond", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(100)]
        [ClientPropertyName("maxImageCacheCount")]
        public int MaxImageCacheCount
        {
            get { return GetPropertyValue<int>("maxImageCacheCount", 100); }
            set { SetPropertyValue<int>("maxImageCacheCount", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(0.5f)]
        [ClientPropertyName("minPixelRatio")]
        public float MinPixelRatio
        {
            get { return GetPropertyValue<float>("MinPixelRatio", 0.5f); }
            set { SetPropertyValue<float>("MinPixelRatio", value); }
        }

        [ExtenderControlEvent]
        [ClientPropertyName("0pen")]
        [DefaultValue("")]
        public string OnClientOpen
        {
            get { return GetPropertyValue<string>("OnClientOpen", string.Empty); }
            set { SetPropertyValue<string>("OnClientOpen", value); }
        }

        [ExtenderControlEvent]
        [ClientPropertyName("error")]
        [DefaultValue("")]
        public string OnClientError
        {
            get { return GetPropertyValue<string>("OnClientError", string.Empty); }
            set { SetPropertyValue<string>("OnClientError", value); }
        }

        [ExtenderControlEvent]
        [DefaultValue("")]
        [ClientPropertyName("ignore")]
        public string OnClientIgnore
        {
            get { return GetPropertyValue<string>("OnClientIgnore", string.Empty); }
            set { SetPropertyValue<string>("OnClientIgnore", value); }
        }

        [ExtenderControlEvent]
        [DefaultValue("")]
        [ClientPropertyName("resize")]
        public string OnClientResize
        {
            get { return GetPropertyValue<string>("OnClientResize", string.Empty); }
            set { SetPropertyValue<string>("OnClientResize", value); }
        }

        [ExtenderControlEvent]
        [DefaultValue("")]
        [ClientPropertyName("animationstart")]
        public string OnClientAnimationStart
        {
            get { return GetPropertyValue<string>("OnClientAnimationStart", string.Empty); }
            set { SetPropertyValue<string>("OnClientAnimationStart", value); }
        }

        [ExtenderControlEvent]
        [DefaultValue("")]
        [ClientPropertyName("animationend")]
        public string OnClientAnimationEnd
        {
            get { return GetPropertyValue<string>("OnClientAnimationEnd", string.Empty); }
            set { SetPropertyValue<string>("OnClientAnimationEnd", value); }
        }

        [ExtenderControlEvent]
        [DefaultValue("")]
        [ClientPropertyName("animation")]
        public string OnClientAnimation
        {
            get { return GetPropertyValue<string>("OnClientAnimation", string.Empty); }
            set { SetPropertyValue<string>("OnClientAnimation", value); }
        }

        [ExtenderControlProperty]
        [DefaultValue(true)]
        [ClientPropertyName("mouseNavEnabled")]
        public bool MouseNavEnabled
        {
            get { return GetPropertyValue<bool>("MouseNavEnabled", true); }
            set { SetPropertyValue<bool>("MouseNavEnabled", value); }
        }
        [EditorAttribute(typeof(SeadragonUrlEditor), typeof(UITypeEditor))]
        public string SourceUrl
        {
            get { return GetPropertyValue<string>("SourceUrl", string.Empty); }
            set { SetPropertyValue<string>("SourceUrl", value); }
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        [NotifyParentProperty(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        public List<SeadragonControl> ControlsCollection
        {
            get
            {
                if (this._controls == null)
                    this._controls = new List<SeadragonControl>();
                return this._controls;
            }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public override ControlCollection Controls
        {
            get { return base.Controls; }
        }

        protected override ControlCollection CreateControlCollection()
        {
            return base.CreateControlCollection();
        }

        [PersistenceMode(PersistenceMode.InnerProperty)]
        [NotifyParentProperty(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        [Editor(typeof(OverlayCollectionEditor), typeof(UITypeEditor))]
        public List<SeadragonOverlay> OverlaysCollection
        {
            get
            {
                if (this._overlays == null)
                    this._overlays = new List<SeadragonOverlay>();
                return this._overlays;
            }
        }

        #endregion
        protected override HtmlTextWriterTag TagKey
        {
            get
            {
                return HtmlTextWriterTag.Div;
            }
        }
        protected override void CreateChildControls()
        {
            this._controlsDescriptor = new ArrayList();
            this._overlaysDescriptor = new ArrayList();

            foreach (SeadragonControl ctl in this.ControlsCollection)
            {
                this.Controls.Add(ctl);
                this._controlsDescriptor.Add(new { id = ctl.ClientID, anchor = ctl.Anchor });
            }

            foreach (SeadragonOverlay ctl in this.OverlaysCollection)
            {
                this.Controls.Add(ctl);
                if (ctl is SeadragonFixedOverlay)
                {
                    SeadragonFixedOverlay fixedOverlay = ctl as SeadragonFixedOverlay;
                    this._overlaysDescriptor.Add(new { id = fixedOverlay.ClientID, point = fixedOverlay.Point,placement=fixedOverlay.Placement });
                }
                else
                {
                    SeadragonScalableOverlay scalableOverlay = ctl as SeadragonScalableOverlay;
                    this._overlaysDescriptor.Add(new { id = scalableOverlay.ClientID, rect = scalableOverlay.Rect });
                }
            }
        }
        protected override void DescribeComponent(ScriptComponentDescriptor descriptor)
        {
            base.DescribeComponent(descriptor);
            descriptor.AddProperty("controls", this._controlsDescriptor);
            descriptor.AddProperty("overlays", this._overlaysDescriptor);
            descriptor.AddProperty("xmlPath", ResolveClientUrl(this.SourceUrl));
            descriptor.AddProperty("prefixUrl", this.Page.Request.ApplicationPath);
        }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "V", Justification = "V stands for value")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1715:IdentifiersShouldHaveCorrectPrefix", MessageId = "T", Justification = "V stands for value")]
        protected V GetPropertyValue<V>(string propertyName, V nullValue)
        {
            if (ViewState[propertyName] == null)
            {
                return nullValue;
            }
            return (V)ViewState[propertyName];
        }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "V", Justification = "V stands for value")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1715:IdentifiersShouldHaveCorrectPrefix", MessageId = "T", Justification = "V stands for value")]
        protected void SetPropertyValue<V>(string propertyName, V value)
        {
            ViewState[propertyName] = value;
        }
    }
}
