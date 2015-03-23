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
    [ProvideToolboxItems(1)]
    public sealed class AjaxControlToolkitVsPackage : Package {

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
            var path = new Uri(typeof(AjaxControlToolkitVsPackage).Assembly.CodeBase).AbsolutePath;
            path = Uri.UnescapeDataString(path);
            path = Path.GetDirectoryName(path);
            path = Path.Combine(path, "AjaxControlToolkit.dll"); 

            return Assembly.LoadFrom(path);
        }


    }
}
