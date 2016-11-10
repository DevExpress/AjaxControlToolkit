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
            var extenderDoc = new ExtenderDoc(docRenderer);

            var typeNames = ToolkitTypes.GetTypeNames();
            foreach(var typeName in typeNames) {
                var doc = Documentation.Get(typeName, xmlDocFolder, scriptsFolder);
                var markup = extenderDoc.BuildDoc(doc.Types);
                var markdownFilePath = Path.Combine(wikiRepoPath, typeName.Replace("Extender", "") + ".md");
                File.WriteAllText(markdownFilePath, markup);

                var htmlDescripton = new HtmlDocRenderer().RenderDescription(doc.Types.FirstOrDefault().Summary);
                SaveHtmlDescription(typeName, htmlDescripton);
                var htmlProperties = new HtmlDocRenderer().RenderList(doc.Types.FirstOrDefault().Properties);
                SaveHtmlProperties(typeName, htmlProperties);
            }
        }

        static void SaveHtmlProperties(string typeName, string html) {
            var path = Path.Combine(GetHtmlFileFolder(), typeName + ".Properties.html");
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
