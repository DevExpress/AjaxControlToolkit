using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {
    class Storage {
        static Lazy<Storage> _storageStrategy = new Lazy<Storage>(Create, true);
        const string TemporaryUploadFolderName = "_AjaxFileUpload";

        static Storage Create() {
            return new Storage();
        }

        static internal Storage GetStorage() {
            return _storageStrategy.Value;
        }

        internal string GetRootTempFolder() {
            return Path.Combine(
                String.IsNullOrWhiteSpace(AjaxFileUploadHelper.RootTempFolderPath)
                ? AppDomain.CurrentDomain.BaseDirectory
                : AjaxFileUploadHelper.RootTempFolderPath,
                TemporaryUploadFolderName);
        }

        internal string GetTempFolder(string fileId) {
            return Path.Combine(GetRootTempFolder(), fileId);
        }

        internal void BuildTempFolder(string fileId) {
            CreateDirectory(GetTempFolder(fileId));
        }

        internal void CreateDirectory(string path) {
            Directory.CreateDirectory(path);
        }

        internal void DeleteDirectory(string path) {
            var dirInfo = new DirectoryInfo(path);

            if(dirInfo.Exists)
                dirInfo.Delete(true);
        }

        internal bool DirectoryExists(string path) {
            return Directory.Exists(path);
        }

        internal bool IsSubDirectory(string parentDirectory, string childDirectory) {
            var directoryInfo = new DirectoryInfo(childDirectory).Parent;

            while(directoryInfo != null) {
                if(directoryInfo.FullName == parentDirectory)
                    return true;
                directoryInfo = directoryInfo.Parent;
            }

            return false;
        }

        internal Stream CreateFileStream(string tmpFilePath) {
            return new FileStream(tmpFilePath, FileMode.Create, FileAccess.ReadWrite, FileShare.ReadWrite);
        }

        internal Stream AppendFileStream(string tmpFilePath) {
            return new FileStream(tmpFilePath, FileMode.Append, FileAccess.Write, FileShare.ReadWrite);
        }

        internal Stream ReadFileStream(string path) {
            return new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
        }

        internal string[] GetFiles(string directoryPath) {
            return Directory.GetFiles(directoryPath);
        }

        internal FileStats GetFileStats(string path) {
            var fileInfo = new FileInfo(path);
            var fileStats = new FileStats() {
                Extension = fileInfo.Extension,
                FullName = fileInfo.FullName,
                Length = fileInfo.Length,
                Name = fileInfo.Name
            };
            return fileStats;
        }

        internal void DeleteRootDirectories() {
            var dirInfo = new DirectoryInfo(GetRootTempFolder());

            foreach(var dir in dirInfo.GetDirectories())
                dir.Delete(true);
        }

        internal void CopyFile(string source, string destination) {
            File.Copy(source, destination);
        }
    }
}
