using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {
    class FileSystemStrategy : StorageStrategy {
        internal override void CreateDirectory(string path) {
            Directory.CreateDirectory(path);
        }

        internal override bool IsSubDirectory(string parentDirectory, string childDirectory) {
            var directoryInfo = new DirectoryInfo(childDirectory).Parent;

            while(directoryInfo != null) {
                if(directoryInfo.FullName == parentDirectory)
                    return true;
                directoryInfo = directoryInfo.Parent;
            }

            return false;
        }

        internal override Stream CreateFileStream(string tmpFilePath) {
            return new FileStream(tmpFilePath, FileMode.Create, FileAccess.ReadWrite, FileShare.ReadWrite);
        }

        internal override Stream AppendFileStream(string tmpFilePath) {
            return new FileStream(tmpFilePath, FileMode.Append, FileAccess.Write, FileShare.ReadWrite);
        }

        internal override Stream ReadFileStream(string path) {
            return new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
        }

        internal override void DeleteDirectory(string path) {
            var dirInfo = new DirectoryInfo(path);

            if(dirInfo.Exists)
                dirInfo.Delete(true);
        }

        internal override bool DirectoryExists(string path) {
            return Directory.Exists(path);
        }

        internal override string[] GetFiles(string directoryPath) {
            return Directory.GetFiles(directoryPath);
        }

        internal override FileStats GetFileStats(string path) {
            var fileInfo =new FileInfo(path);
            var fileStats = new FileStats()
            {
                Extension = fileInfo.Extension,
                FullName = fileInfo.FullName,
                Length = fileInfo.Length,
                Name = fileInfo.Name
            };
            return fileStats;
        }

        internal override void DeleteRootDirectories() {
            var dirInfo = new DirectoryInfo(GetRootTempFolder());

            foreach(var dir in dirInfo.GetDirectories())
                dir.Delete(true);
        }
    }
}
