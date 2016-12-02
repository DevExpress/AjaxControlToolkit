using AjaxControlToolkit.Reference;
using AjaxControlToolkit.Reference.Core;
using AjaxControlToolkit.Reference.Core.Rendering;
using System;
using System.IO;
using System.Linq;

namespace AjaxControlToolkit.WikiReferenceUpdater {
    class Program {
        static void Main(string[] args) {
            var wikiRepoPath = args[0];
            var xmlDocFolder = GetXmlDocFolder();
            var scriptsFolder = GetScriptFolder();
            var docRenderer = new GitHubDocRenderer();
            var typeNames = ToolkitTypes.GetTypeNames().Concat(ToolkitTypes.GetAnimationTypeNames());

            foreach(var typeName in typeNames) {
                var renderSampleSiteLink = Documentation.IsRenderSampleSiteLink(typeName);
                var forceHeaderRendering = Documentation.IsForceHeaderRendering(typeName);
                var extenderDoc = new ExtenderDoc(docRenderer, renderSampleSiteLink, forceHeaderRendering);
                var doc = Documentation.Get(typeName, xmlDocFolder, scriptsFolder);

                Documentation animationDocs = null;
                if(Documentation.IsAnimationScriptsRelatedType(typeName))
                    animationDocs = Documentation.GetAnimationScriptsReference(scriptsFolder);

                var markup = extenderDoc.BuildDoc(doc.Types, animationDocs?.Types);
                var markdownFilePath = Path.Combine(wikiRepoPath, typeName + ".md");
                File.WriteAllText(markdownFilePath, markup);

                var htmlDescripton = new HtmlDocRenderer().RenderDescription(doc.Types.FirstOrDefault().Summary);
                SaveHtmlDescription(typeName, htmlDescripton);
                var htmlProperties = new HtmlDocRenderer().RenderMembers(doc.Types.FirstOrDefault());
                SaveHtmlProperties(typeName, htmlProperties);
            }
        }

        static void SaveHtmlProperties(string typeName, string html) {
            var path = Path.Combine(GetHtmlFileFolder(), typeName + ".Members.html");
            File.WriteAllText(path, html);
        }

        static void SaveHtmlDescription(string typeName, string html) {
            var path = Path.Combine(GetHtmlFileFolder(), typeName + ".Description.html");
            File.WriteAllText(path, html);
        }

        static string GetHtmlFileFolder() {
            return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"..\..\..\AjaxControlToolkit.SampleSite\App_Data\ControlReference");
        }

        static string GetScriptFolder() {
            return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"..\..\..\AjaxControlToolkit\Scripts");
        }

        static string GetXmlDocFolder() {
            return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"..\..\..\bin");
        }
    }
}
