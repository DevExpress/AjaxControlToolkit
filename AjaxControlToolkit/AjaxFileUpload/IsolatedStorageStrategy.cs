using System;
using System.Collections.Generic;
using System.IO;
using System.IO.IsolatedStorage;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {
    class IsolatedStorageStrategy : StorageStrategy {

        IsolatedStorageFile isoStorage;

        public IsolatedStorageStrategy() {
            isoStorage = IsolatedStorageFile.GetUserStoreForAssembly();
        }

        internal override void CreateDirectory(string path) {
            isoStorage.CreateDirectory(path);
        }

        internal override bool IsSubDirectory(string parentDirectory, string childDirectory) {
            try {
                var directoryName = Path.GetDirectoryName(childDirectory);
                bool directoryExists = isoStorage.DirectoryExists(directoryName);

                while(directoryExists) {
                    if(directoryName == parentDirectory)
                        return true;

                    directoryName = Path.GetDirectoryName(directoryName);
                    directoryExists = isoStorage.DirectoryExists(directoryName);
                }
            } catch(ArgumentException) {
                return false;
            }

            return false;
        }

        internal override Stream CreateFileStream(string tmpFilePath) {
            return new IsolatedStorageFileStream(tmpFilePath, FileMode.Create, FileAccess.ReadWrite, FileShare.ReadWrite, isoStorage);
        }

        internal override Stream AppendFileStream(string tmpFilePath) {
            return new IsolatedStorageFileStream(tmpFilePath, FileMode.Append, FileAccess.Write, FileShare.ReadWrite, isoStorage);
        }

        internal override Stream ReadFileStream(string path) {
            return new IsolatedStorageFileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite, isoStorage);
        }

        internal override void DeleteDirectory(string path) {
            if(isoStorage.DirectoryExists(path))
                DeleteDirectoryRecursively(path);
        }

        private void DeleteDirectoryRecursively(string dir) {
            var pattern = dir + @"\*";
            var files = isoStorage.GetFileNames(pattern);

            foreach(var file in files)
                isoStorage.DeleteFile(Path.Combine(dir, file));

            var dirs = isoStorage.GetDirectoryNames(pattern);
            foreach(var dName in dirs)
                DeleteDirectoryRecursively(Path.Combine(dir, dName));

            isoStorage.DeleteDirectory(dir);
        }

        internal override bool DirectoryExists(string path) {
            return isoStorage.DirectoryExists(path);
        }

        internal override string[] GetFiles(string directoryPath) {
            return isoStorage.GetFileNames(Path.Combine(directoryPath, "*"))
                .Select(fileName => Path.Combine(directoryPath, fileName))
                .ToArray();
        }

        internal override FileStats GetFileStats(string path) {
            var fileStats = new FileStats();
            fileStats.FullName = path;
            fileStats.Extension = Path.GetExtension(path);
            fileStats.Name = Path.GetFileName(path);
            using(var file = new IsolatedStorageFileStream(path, FileMode.Open, FileAccess.Read, FileShare.ReadWrite, isoStorage)) {
                fileStats.Length = file.Length;
            }
            return fileStats;
        }

        internal override void DeleteRootDirectories() {
            DeleteDirectoryRecursively("");
        }

        internal override void CopyFile(string source, string destination) {
            using(var writer = new FileStream(destination, FileMode.Create, FileAccess.Write, FileShare.None))
            using(var file = new IsolatedStorageFileStream(source, FileMode.Open, FileAccess.Read, FileShare.None, isoStorage))
                file.CopyTo(writer);
        }
    }
}
