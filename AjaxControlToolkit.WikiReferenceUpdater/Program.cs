using AjaxControlToolkit.Reference;
using AjaxControlToolkit.Reference.Core;
using AjaxControlToolkit.Reference.Core.Rendering;
using System;
using System.IO;

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
            }
        }

        static string GetScriptFolder() {
            return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"..\..\..\AjaxControlToolkit\Scripts");
        }

        static string GetXmlDocFolder() {
            return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"..\..\..\bin");
        }
    }
}
