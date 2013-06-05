using System;
using System.ComponentModel;
using System.ComponentModel.Design;
using System.ComponentModel.Design.Serialization;
using System.Reflection;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Drawing.Design;
using System.Security.Permissions;
using System.Collections;
using System.Collections.ObjectModel;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;
using System.Xml.Schema;
using System.Globalization;
using System.CodeDom;
using System.Drawing;
using System.IO;
using AjaxControlToolkit;

#region [ Resources ]

[assembly: System.Web.UI.WebResource("HTMLEditor.Toolbar_buttons.ImageButton.js", "application/x-javascript")]
[assembly: System.Web.UI.WebResource("HTMLEditor.Toolbar_buttons.ImageButton.debug.js", "application/x-javascript")]

#endregion

namespace AjaxControlToolkit.HTMLEditor.ToolbarButton
{
    [ParseChildren(true)]
    [PersistChildren(false)]
    [RequiredScript(typeof(CommonToolkitScripts))]
    [ClientScriptResource("Sys.Extended.UI.HTMLEditor.ToolbarButton.ImageButton", "HTMLEditor.Toolbar_buttons.ImageButton.js")]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1012:AbstractTypesShouldNotHaveConstructors")]
    public abstract class ImageButton : CommonButton
    {
        #region [ Fields ]


        #endregion

        #region [ Constructors ]

        /// <summary>
        /// Initializes a new ImageButton
        /// </summary>
        public ImageButton()
            : base(HtmlTextWriterTag.Img)
        {
        }

        #endregion

        #region [ Properties ]

        protected virtual Type BaseImageButtonType
        {
            get { return typeof(ImageButton); }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Src")]
        [DefaultValue("")]
        [Category("Appearance")]
        [ExtenderControlProperty]
        [ClientPropertyName("normalSrc")]
        public string NormalSrc
        {
            get { return (string)(ViewState["NormalSrc"] ?? string.Empty); }
            set { ViewState["NormalSrc"] = value; }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Src")]
        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeNormalSrc()
        {
            return IsRenderingScript;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Src")]
        [DefaultValue("")]
        [Category("Appearance")]
        [ExtenderControlProperty]
        [ClientPropertyName("hoverSrc")]
        public string HoverSrc
        {
            get { return (string)(ViewState["HoverSrc"] ?? string.Empty); }
            set { ViewState["HoverSrc"] = value; }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Src")]
        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeHoverSrc()
        {
            return IsRenderingScript;
        }

        [DefaultValue("")]
        [Category("Appearance")]
        [ExtenderControlProperty]
        [ClientPropertyName("downSrc")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Src")]
        public string DownSrc
        {
            get { return (string)(ViewState["DownSrc"] ?? string.Empty); }
            set { ViewState["DownSrc"] = value; }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Src")]
        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeDownSrc()
        {
            return IsRenderingScript;
        }

        [DefaultValue("")]
        [Category("Appearance")]
        [ExtenderControlProperty]
        [ClientPropertyName("activeSrc")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Src")]
        public string ActiveSrc
        {
            get { return (string)(ViewState["ActiveSrc"] ?? string.Empty); }
            set { ViewState["ActiveSrc"] = value; }
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "Src")]
        [EditorBrowsable(EditorBrowsableState.Never)]
        public bool ShouldSerializeActiveSrc()
        {
            return IsRenderingScript;
        }

        #endregion

        #region [ Methods ]

        protected void RegisterButtonImages(string name, string ext)
        {
            Type type = this.GetType();
            Toolbar toolbar = null;
            Control parent = this.Parent;

            while (parent != null)
            {
                toolbar = parent as Toolbar;
                if (toolbar != null) break;
                parent = parent.Parent;
            }
            if (toolbar == null)
            {
                throw new NotSupportedException("Toolbar's ImageButton can be inside Toolbar control only");
            }

            bool isSeparator = false;
            Type curType = type;
            while (curType != typeof(CommonButton))
            {
                if (curType == typeof(HorizontalSeparator))
                {
                    isSeparator = true;
                    break;
                }
                curType = curType.BaseType;
            }

            if (isSeparator)
            {
                NormalSrc = getImagePath(BaseImageButtonType, name, ext, toolbar);
            }
            else
            {
                NormalSrc = getImagePath(BaseImageButtonType, name + "_n", ext, toolbar);
                DownSrc = getImagePath(BaseImageButtonType, name + "_a", ext, toolbar);
            }

            bool isStatus = false;
            curType = type.BaseType;
            while (curType != typeof(CommonButton))
            {
                if (curType == typeof(EditorToggleButton) || curType == typeof(ModeButton))
                {
                    isStatus = true;
                    break;
                }
                curType = curType.BaseType;
            }

            if (isStatus)
                ActiveSrc = DownSrc;
        }

        protected void RegisterButtonImages(string name)
        {
            RegisterButtonImages(name, "gif");
        }

        internal void InternalRegisterButtonImages(string name)
        {
            RegisterButtonImages(name, "gif");
        }

        private string getImagePath(Type type, string name, string ext, Toolbar toolbar)
        {
            string folder = toolbar.ButtonImagesFolder;
            string result = Page.ClientScript.GetWebResourceUrl(type, "HTMLEditor.Images."+name+"."+ext);

            if(folder.Length > 0 )
            {
                string path = folder + name + "." + ext;
                string fileName = "";

                if (this.IsDesign && _designer != null)
                    fileName = _designer.MapPath(path);
                else
                    fileName = System.Web.HttpContext.Current.Server.MapPath(path);

                if (fileName != null)
                {
                    if (File.Exists(fileName))
                    {
                        result = path;
                    }
                }
            }

            return result;
        }

        protected override void AddAttributesToRender(HtmlTextWriter writer)
        {
            writer.AddAttribute("src", NormalSrc);
            writer.AddAttribute("alt", "");
            base.AddAttributesToRender(writer);
        }

        #endregion
    }
}
