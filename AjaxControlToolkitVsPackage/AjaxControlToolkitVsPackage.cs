using System;
using System.Collections.Generic;
using System.Drawing.Design;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using Microsoft.VisualStudio.Shell;
using System.IO;

namespace AjaxControlToolkitVsPackage {

    [PackageRegistration(UseManagedResourcesOnly = true)]
    [InstalledProductRegistration("#110", "#112", "1.0"/*, IconResourceID = 400*/)]
    [Guid("e79bade7-6755-466f-9788-3d8243bdcc5f")]
    [ProvideToolboxItems(2)]
    public sealed class AjaxControlToolkitVsPackage : Package {

        const string
            _actAssemblyName = "AjaxControlToolkit.dll",
            _actName = "ASP.NET AJAX Control Toolkit",
            _extensionsDirName = "Extensions";


        public AjaxControlToolkitVsPackage() {
            this.ToolboxInitialized += (s, e) => {
                InstallToolboxItems();
            };

            this.ToolboxUpgraded += (s, e) => {
                RemoveToolboxItems();
                InstallToolboxItems();
            };
        }

        void InstallToolboxItems() {
            var assembly = LoadToolkitAssembly();
            var version = assembly.GetName().Version.ToString(2);

            var service = (IToolboxService)GetService(typeof(IToolboxService));
            foreach(var item in EnumerateToolboxItems(assembly))
                service.AddToolboxItem(item, "AJAX Control Toolkit v" + version);
        }

        void RemoveToolboxItems() {
            var service = (IToolboxService)GetService(typeof(IToolboxService));
            foreach(var item in EnumerateToolboxItems(LoadToolkitAssembly()))
                service.RemoveToolboxItem(item);
        }

        static IEnumerable<ToolboxItem> EnumerateToolboxItems(Assembly assembly) {
            return ToolboxService.GetToolboxItems(assembly, null).Cast<ToolboxItem>();
        }

        static Assembly LoadToolkitAssembly() {
            var result = GetAssemblyFromUserDocs();
            if(result != null)
                return result;

            result = GetAssemblyFromVsExtensions();
            if(result != null)
                return result;

            return GetAssemblyFromCurrentDir();
        }

        static Assembly GetAssemblyFromUserDocs() {
            var path = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments),
                _actName,
                "Bin",
                _actAssemblyName);

            return TryLoadAssembly(path);
        }

        static Assembly GetAssemblyFromVsExtensions() {
            var path = Path.Combine(GetParentDirByName(GetCurrentAssemblyPath(), _extensionsDirName), _actName, _actAssemblyName);

            return TryLoadAssembly(path);
        }

        static string GetParentDirByName(string path, string parentName) {
            var current = new DirectoryInfo(path);

            while (current != null) {
                if(String.Compare(current.Name, parentName, true) == 0)
                    return current.FullName;

                current = current.Parent;
            }

            return String.Empty;
        }

        static Assembly GetAssemblyFromCurrentDir() {
            var path = Path.Combine(GetCurrentAssemblyPath(), _actAssemblyName);

            return TryLoadAssembly(path);
        }

        static string GetCurrentAssemblyPath() {
            var path = new Uri(typeof(AjaxControlToolkitVsPackage).Assembly.CodeBase).AbsolutePath;
            path = Uri.UnescapeDataString(path);

            return Path.GetDirectoryName(path);
        }

        static Assembly TryLoadAssembly(string path) {
            if(!File.Exists(path))
                return null;

            try {
                return Assembly.LoadFrom(path);
            } catch {
                return null;
            }
        }
    }
}
