using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {
    abstract class StorageStrategy {
        static Lazy<StorageStrategy> _storageStrategy = new Lazy<StorageStrategy>(Create, true);
        protected const string TemporaryUploadFolderName = "_AjaxFileUpload";

        static StorageStrategy Create() {
            if(String.IsNullOrWhiteSpace(AjaxFileUploadHelper.RootTempFolderPath))
                return new IsolatedStorageStrategy();
            else
                return new FileSystemStrategy();
        }

        static internal StorageStrategy GetStorage() {
            return _storageStrategy.Value;
        }

        internal string GetRootTempFolder() {
            return Path.Combine(AjaxFileUploadHelper.RootTempFolderPath == null ? "" : AjaxFileUploadHelper.RootTempFolderPath, TemporaryUploadFolderName);
        }

        internal string GetTempFolder(string fileId) {
            return Path.Combine(GetRootTempFolder(), fileId);
        }

        internal void BuildTempFolder(string fileId) {
            CreateDirectory(GetTempFolder(fileId));            
        }

        internal abstract void CreateDirectory(string path);

        internal abstract void DeleteDirectory(string path);

        internal abstract bool DirectoryExists(string path);

        internal abstract bool IsSubDirectory(string parentDirectory, string childDirectory);

        internal abstract Stream CreateFileStream(string tmpFilePath);

        internal abstract Stream AppendFileStream(string tmpFilePath);

        internal abstract Stream ReadFileStream(string path);

        internal abstract string[] GetFiles(string directoryPath);

        internal abstract FileStats GetFileStats(string path);

        internal abstract void DeleteRootDirectories();

        internal abstract void CopyFile(string source, string destination);
    }
}
