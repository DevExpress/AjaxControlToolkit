using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.RegularExpressions;
using System.Reflection;

namespace AjaxControlToolkit.LinkStaticResources {

    class Program {

        static LinkedList<string> bundleEntries = new LinkedList<string>();

        static void Main(string[] args) {
            string solutionDirPath = Directory.GetParent(Directory.GetParent(Directory.GetParent(Assembly.GetEntryAssembly().Location).FullName).FullName).FullName;

            string
                outputDir = Path.Combine(solutionDirPath, @"AjaxControlToolkit.StaticResources\"),
                scriptsDir = outputDir + "Scripts",
                stylesDir = outputDir + "Styles",
                imagesDir = outputDir + "Images",
                samplesDir = Path.Combine(solutionDirPath, @"AjaxControlToolkit.SampleSite\"),
                samplesScriptsDir = samplesDir + @"Scripts\AjaxControlToolkit\",
                samplesStylesDir = samplesDir + @"Content\AjaxControlToolkit\Styles\",
                samplesImagesDir = samplesDir + @"Content\AjaxControlToolkit\Images\";

            DeleteBundleConfigJson(solutionDirPath);

            foreach(var path in Directory.EnumerateFiles(Path.Combine(solutionDirPath, @"AjaxControlToolkit\Scripts"), "*.js")) {
                LinkScript(scriptsDir, path);
                LinkScript(samplesScriptsDir, path);
                AddScriptToBundleConfig(path);
            }

            foreach(var path in Directory.EnumerateFiles(Path.Combine(solutionDirPath, @"AjaxControlToolkit\Scripts\Localization"), "*.js")) {
                LinkScript(scriptsDir, path, TransformLocalizationScriptName);
                LinkScript(samplesScriptsDir, path, TransformLocalizationScriptName);
                AddScriptToBundleConfig(path);
            }

            CreateBundleConfigJson(solutionDirPath);

            foreach(var path in Directory.EnumerateFiles(Path.Combine(solutionDirPath, @"AjaxControlToolkit\Styles"), "*.css")) {
                LinkStyle(stylesDir, path);
                LinkStyle(samplesStylesDir, path);
            }

            foreach(var path in Directory.EnumerateFiles(Path.Combine(solutionDirPath, @"AjaxControlToolkit\Images"))) {
                if(Regex.IsMatch(path, @"\.(gif|jpg|png)$")) {
                    LinkStyle(imagesDir, path);
                    LinkStyle(samplesImagesDir, path);
                }
            }
        }

        static void CreateBundleConfigJson(string solutionDirPath) {
            File.WriteAllText(
                GetBundleConfigPath(solutionDirPath), 
                String.Format(
                    "[{0}]", 
                    String.Join(
                        ",",
                        bundleEntries)));
        }

        static void DeleteBundleConfigJson(string solutionDirPath) {
            try {
                File.Delete(GetBundleConfigPath(solutionDirPath));
            } catch(Exception) { }
        }

        static string GetBundleConfigPath(string solutionDirPath) {
            return Path.Combine(solutionDirPath, @"AjaxControlToolkit\bundleconfig.json");
        }

        static void AddScriptToBundleConfig(string path) {
            var regex = new Regex(@"Scripts\\(Localization\\)?\w+\.js");
            var match = regex.Match(path);

            if(match.Success)
                AddBundleEntry(match.Value.Replace(@"\", "/"));
        }

        static void AddBundleEntry(string value) {
            var entry = String.Format(
                @"{{""outputFileName"":""{0}"",""inputFiles"":[""{1}""]}}",
                    value.Replace(".js", ".min.js"),
                    value);

            bundleEntries.AddLast(entry);
        }

        static void LinkScript(string prefix, string path, Func<string, string> fileNameTransformer = null) {
            var fileName = Path.GetFileName(path);

            if(fileNameTransformer != null)
                fileName = fileNameTransformer(fileName);

            if(fileName.EndsWith(".min.js"))
                fileName = Path.Combine("Release", fileName.Replace(".min.js", ".js"));
            else
                fileName = Path.Combine("Debug", fileName.Replace(".js", ".debug.js"));

            CreateHardLink(path, Path.Combine(prefix, fileName));
        }

        static void LinkStyle(string prefix, string path) {
            var fileName = Path.GetFileName(path);

            switch(fileName) {
                case "Backgrounds.css":
                case "Backgrounds.min.css":
                    return;

                case "Backgrounds_static.css":
                    fileName = "Backgrounds.css";
                    break;

                case "Backgrounds_static.min.css":
                    fileName = "Backgrounds.min.css";
                    break;
            }

            CreateHardLink(path, Path.Combine(prefix, fileName));
        }

        static string TransformLocalizationScriptName(string name) {
            return "Localization." + name.Replace("Resources_", "Resources.");
        }

        static void CreateHardLink(string source, string destination) {
            EnsurePath(destination);

            if(!CreateHardLink(destination, source, IntPtr.Zero))
                throw new Exception("Failed to create hardlink");
        }

        static void EnsurePath(string path) {
            var dir = Path.GetDirectoryName(path);
            if(!Directory.Exists(dir))
                Directory.CreateDirectory(dir);

            if(File.Exists(path))
                File.Delete(path);
        }

        [DllImport("Kernel32.dll", CharSet = CharSet.Unicode)]
        static extern bool CreateHardLink(string lpFileName, string lpExistingFileName, IntPtr lpSecurityAttributes);
    }

}
