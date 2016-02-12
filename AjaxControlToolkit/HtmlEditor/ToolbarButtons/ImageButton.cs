#pragma warning disable 1591
using System;
using System.ComponentModel;
using System.IO;
using System.Web;
using System.Web.UI;

namespace AjaxControlToolkit.HtmlEditor.ToolbarButtons {

    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HtmlEditor.ToolbarButtons.ImageButton", Constants.HtmlEditorImageButtonName)]
    public abstract class ImageButton : CommonButton {
        public ImageButton()
            : base(HtmlTextWriterTag.Img) {
        }

        protected virtual Type BaseImageButtonType {
            get { return typeof(ImageButton); }
        }

        [DefaultValue("")]
        [Category("Appearance")]
        [ExtenderControlProperty]
        [ClientPropertyName("normalSrc")]
        public string NormalSrc {
            get { return (string)(ViewState["NormalSrc"] ?? String.Empty); }
            set { ViewState["NormalSrc"] = value; }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeNormalSrc() {
            return IsRenderingScript;
        }

        [DefaultValue("")]
        [Category("Appearance")]
        [ExtenderControlProperty]
        [ClientPropertyName("hoverSrc")]
        public string HoverSrc {
            get { return (string)(ViewState["HoverSrc"] ?? String.Empty); }
            set { ViewState["HoverSrc"] = value; }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeHoverSrc() {
            return IsRenderingScript;
        }

        [DefaultValue("")]
        [Category("Appearance")]
        [ExtenderControlProperty]
        [ClientPropertyName("downSrc")]
        public string DownSrc {
            get { return (string)(ViewState["DownSrc"] ?? String.Empty); }
            set { ViewState["DownSrc"] = value; }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeDownSrc() {
            return IsRenderingScript;
        }

        [DefaultValue("")]
        [Category("Appearance")]
        [ExtenderControlProperty]
        [ClientPropertyName("activeSrc")]
        public string ActiveSrc {
            get { return (string)(ViewState["ActiveSrc"] ?? String.Empty); }
            set { ViewState["ActiveSrc"] = value; }
        }

        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeActiveSrc() {
            return IsRenderingScript;
        }

        protected void RegisterButtonImages(string name, string ext) {
            var type = GetType();
            Toolbar toolbar = null;
            var parent = Parent;

            while(parent != null) {
                toolbar = parent as Toolbar;
                if(toolbar != null) break;
                parent = parent.Parent;
            }

            if(toolbar == null)
                throw new NotSupportedException("Toolbar's ImageButton can be inside Toolbar control only");

            var isSeparator = false;
            var curType = type;
            while(curType != typeof(CommonButton)) {
                if(curType == typeof(HorizontalSeparator)) {
                    isSeparator = true;
                    break;
                }
                curType = curType.BaseType;
            }

            if(isSeparator) {
                NormalSrc = getImagePath(BaseImageButtonType, name, ext, toolbar);
            }
            else {
                NormalSrc = getImagePath(BaseImageButtonType, name + "-Inactive", ext, toolbar);
                DownSrc = getImagePath(BaseImageButtonType, name + "-Active", ext, toolbar);
            }

            var isStatus = false;
            curType = type.BaseType;
            while(curType != typeof(CommonButton)) {
                if(curType == typeof(EditorToggleButton) || curType == typeof(ModeButton)) {
                    isStatus = true;
                    break;
                }
                curType = curType.BaseType;
            }

            if(isStatus)
                ActiveSrc = DownSrc;
        }

        protected void RegisterButtonImages(string name) {
            RegisterButtonImages(name, "gif");
        }

        internal void InternalRegisterButtonImages(string name) {
            RegisterButtonImages(name, "gif");
        }

        string getImagePath(Type type, string name, string ext, Toolbar toolbar) {
            var folder = toolbar.ButtonImagesFolder;
            var result = ToolkitResourceManager.GetImageHref("HtmlEditor." + name + "." + ext, this);

            if(folder.Length > 0) {
                var path = folder + name + "." + ext;
                var fileName = String.Empty;

                if(IsDesign && _designer != null)
                    fileName = _designer.MapPath(path);
                else
                    fileName = HttpContext.Current.Server.MapPath(path);

                if(fileName != null)
                    if(File.Exists(fileName))
                        result = path;
            }

            return result;
        }

        protected override void AddAttributesToRender(HtmlTextWriter writer) {
            writer.AddAttribute("src", NormalSrc);
            writer.AddAttribute("alt", String.Empty);
            base.AddAttributesToRender(writer);
        }
    }

}

#pragma warning restore 1591