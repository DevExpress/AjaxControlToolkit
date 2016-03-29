using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {
    static class Storage {        
        const string TemporaryUploadFolderName = "_AjaxFileUpload";

        internal static string GetRootTempFolder() {
            return Path.Combine(
                String.IsNullOrWhiteSpace(AjaxFileUploadHelper.RootTempFolderPath)
                ? AppDomain.CurrentDomain.BaseDirectory
                : AjaxFileUploadHelper.RootTempFolderPath,
                TemporaryUploadFolderName);
        }

        internal static string GetTempFolder(string fileId) {
            return Path.Combine(GetRootTempFolder(), fileId);
        }

        internal static void BuildTempFolder(string fileId) {
            CreateDirectory(GetTempFolder(fileId));
        }

        static void CreateDirectory(string path) {
            Directory.CreateDirectory(path);
        }
    }
}
