using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;

namespace CopyStaticFiles {

    class Program {

        static void Main(string[] args) {
            // NOTE paths are relative to Bin 

            const string outputDir = "../StaticFiles";
            const string scriptsPrefix = "Scripts/AjaxControlToolkit";

            foreach(var path in Directory.EnumerateFiles("../AjaxControlToolkit/Scripts", "*.js"))
                LinkScript(Path.Combine(outputDir, scriptsPrefix), path);

            foreach(var path in Directory.EnumerateFiles("../AjaxControlToolkit/Scripts/Localization", "*.js"))
                LinkScript(Path.Combine(outputDir, scriptsPrefix), path, TransformLocalizationScriptName);
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

        static string TransformLocalizationScriptName(string name) {
            return "Localization." + name.Replace("Resources_", "Resources.");                            
        }

        static void CreateHardLink(string source, string destination) {
            var dir = Path.GetDirectoryName(destination);
            if(!Directory.Exists(dir))
                Directory.CreateDirectory(dir);

            if(File.Exists(destination))
                File.Delete(destination);

            if(!CreateHardLink(destination, source, IntPtr.Zero))
                throw new Exception("Failed to create hardlink");
        }

        [DllImport("Kernel32.dll", CharSet = CharSet.Unicode)]
        static extern bool CreateHardLink(string lpFileName, string lpExistingFileName, IntPtr lpSecurityAttributes);

    }

}
