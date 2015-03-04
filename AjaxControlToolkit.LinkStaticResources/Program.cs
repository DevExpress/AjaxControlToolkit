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

        static void Main(string[] args) {
            string solutionDirPath = Directory.GetParent(Directory.GetParent(Assembly.GetEntryAssembly().Location).FullName).FullName;

            string
                outputDir = Path.Combine(solutionDirPath, @"AjaxControlToolkit.StaticResources\"),
                scriptsDir = outputDir + "Scripts",
                stylesDir = outputDir + "Styles",
                imagesDir = outputDir + "Images",
                samplesDir = Path.Combine(solutionDirPath, @"AjaxControlToolkit.SampleSite\"),
                samplesScriptsDir = samplesDir + @"Scripts\AjaxControlToolkit\",
                samplesStylesDir = samplesDir + @"Content\AjaxControlToolkit\Styles\",
                samplesImagesDir = samplesDir + @"Content\AjaxControlToolkit\Images\";

            foreach(var path in Directory.EnumerateFiles(Path.Combine(solutionDirPath, @"AjaxControlToolkit\Scripts"), "*.js")) {
                LinkScript(scriptsDir, path);
                LinkScript(samplesScriptsDir, path);
            }

            foreach(var path in Directory.EnumerateFiles(Path.Combine(solutionDirPath, @"AjaxControlToolkit\Scripts\Localization"), "*.js")) {
                LinkScript(scriptsDir, path, TransformLocalizationScriptName);
                LinkScript(samplesScriptsDir, path, TransformLocalizationScriptName);
            }

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
