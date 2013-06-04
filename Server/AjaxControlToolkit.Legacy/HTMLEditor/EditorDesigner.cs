using System.Web.UI.WebControls;
using System.Web.UI;
using System.Web.UI.Design;
using AjaxControlToolkit;
using AjaxControlToolkit.Design;
using System.ComponentModel;
using System.Collections.Generic;
using System;
using System.ComponentModel.Design;
using System.Windows.Forms.Design;
using System.Windows.Forms;
using System.Text;
using System.Diagnostics;
using System.Drawing;
using System.Globalization;
using System.ComponentModel.Design.Serialization;
using System.IO;

namespace AjaxControlToolkit
{
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2117:AptcaTypesShouldOnlyExtendAptcaBaseTypes", Justification = "Security handled by base class")]
    public class EditorDesigner : DesignerWithMapPath
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public EditorDesigner()
        {
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        private AjaxControlToolkit.HTMLEditor.Editor Editor
        {
            get
            {
                return (AjaxControlToolkit.HTMLEditor.Editor)Component;
            }
        }      

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public override string GetDesignTimeHtml(DesignerRegionCollection regions)
        {
            StringBuilder sb = new StringBuilder(1024);
            StringWriter sr = new StringWriter(sb, CultureInfo.InvariantCulture);
            HtmlTextWriter writer = new HtmlTextWriter(sr);
            writer.AddAttribute(HtmlTextWriterAttribute.Rel, "stylesheet");
            writer.AddAttribute(HtmlTextWriterAttribute.Href, Editor.Page.ClientScript.GetWebResourceUrl(typeof(AjaxControlToolkit.HTMLEditor.Editor),"HTMLEditor.Editor.css"));
            writer.RenderBeginTag(HtmlTextWriterTag.Link);
            writer.RenderEndTag();
            Editor.CreateChilds(this);
            Editor.RenderControl(writer);
            return sb.ToString();
        }
    }

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2117:AptcaTypesShouldOnlyExtendAptcaBaseTypes", Justification = "Security handled by base class")]
    public class DesignerWithMapPath : System.Web.UI.Design.ControlDesigner
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2116:AptcaMethodsShouldOnlyCallAptcaMethods", Justification = "Security handled by base class")]
        public string MapPath(string originalPath)
        {
            string result = null;
            ISite site = this.Component.Site;

            if (site != null)
            {
                IWebApplication vWA = (IWebApplication)site.GetService(typeof(IWebApplication));
                if (vWA != null)
                {
                    string path = originalPath.Replace("/", "\\");
                    bool fromRoot = false;

                    while (path.Length > 0 && (path.Substring(0, 1) == "\\" || path.Substring(0, 1) == "~"))
                    {
                        fromRoot = true;
                        path = path.Substring(1);
                        if (path.Length == 0)
                            break;
                    }

                    string fAppRootFolder = vWA.RootProjectItem.PhysicalPath;

                    if (fromRoot)
                    {
                        result = Path.Combine(fAppRootFolder, path);
                    }
                    else
                    {
                        string pageUrl = Path.GetDirectoryName(this.RootDesigner.DocumentUrl).Replace("/", "\\");
                        while (pageUrl.Length > 0 && (pageUrl.Substring(0, 1) == "\\" || pageUrl.Substring(0, 1) == "~"))
                        {
                            pageUrl = pageUrl.Substring(1);
                            if (pageUrl.Length == 0)
                                break;
                        }
                        result = Path.Combine(Path.Combine(fAppRootFolder, pageUrl), path);
                    }
                    result = this.RootDesigner.ResolveUrl(result).Substring(8).Replace("/", "\\");
                    if (result.IndexOf(fAppRootFolder, StringComparison.OrdinalIgnoreCase) != 0) // outside Web Application
                        result = null;
                }
            }
            return result;
        }
    }
}
