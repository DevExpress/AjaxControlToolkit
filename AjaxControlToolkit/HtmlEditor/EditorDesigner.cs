#pragma warning disable 1591
using AjaxControlToolkit.HtmlEditor;
using System;
using System.ComponentModel;
using System.Globalization;
using System.IO;
using System.Text;
using System.Web.UI;
using System.Web.UI.Design;

namespace AjaxControlToolkit.Design {

    public class HtmlEditorDesigner : DesignerWithMapPath {
        public HtmlEditorDesigner() {
        }

        Editor HtmlEditor {
            get { return (Editor)Component; }
        }

        public override string GetDesignTimeHtml(DesignerRegionCollection regions) {
            var sb = new StringBuilder(1024);
            var sr = new StringWriter(sb, CultureInfo.InvariantCulture);

            var writer = new HtmlTextWriter(sr);
            writer.AddAttribute(HtmlTextWriterAttribute.Rel, "stylesheet");
            writer.AddAttribute(HtmlTextWriterAttribute.Href, HtmlEditor.Page.ClientScript.GetWebResourceUrl(typeof(Editor), Constants.HtmlEditorEditorName + ".css"));
            writer.RenderBeginTag(HtmlTextWriterTag.Link);
            writer.RenderEndTag();

            HtmlEditor.CreateChilds(this);
            HtmlEditor.RenderControl(writer);

            return sb.ToString();
        }
    }

    public class DesignerWithMapPath : ControlDesigner {

        public string MapPath(string originalPath) {
            string result = null;
            var site = Component.Site;

            if(site != null) {
                var vWA = (IWebApplication)site.GetService(typeof(IWebApplication));
                if(vWA != null) {
                    var path = originalPath.Replace("/", "\\");
                    var fromRoot = false;

                    while(path.Length > 0 && (path.Substring(0, 1) == "\\" || path.Substring(0, 1) == "~")) {
                        fromRoot = true;
                        path = path.Substring(1);
                        if(path.Length == 0)
                            break;
                    }

                    var fAppRootFolder = vWA.RootProjectItem.PhysicalPath;

                    if(fromRoot) {
                        result = Path.Combine(fAppRootFolder, path);
                    }
                    else {
                        var pageUrl = Path.GetDirectoryName(RootDesigner.DocumentUrl).Replace("/", "\\");
                        while(pageUrl.Length > 0 && (pageUrl.Substring(0, 1) == "\\" || pageUrl.Substring(0, 1) == "~")) {
                            pageUrl = pageUrl.Substring(1);
                            if(pageUrl.Length == 0)
                                break;
                        }
                        result = Path.Combine(Path.Combine(fAppRootFolder, pageUrl), path);
                    }
                    result = RootDesigner.ResolveUrl(result).Substring(8).Replace("/", "\\");
                    if(result.IndexOf(fAppRootFolder, StringComparison.OrdinalIgnoreCase) != 0) // outside Web Application
                        result = null;
                }
            }
            return result;
        }
    }

}

#pragma warning restore 1591