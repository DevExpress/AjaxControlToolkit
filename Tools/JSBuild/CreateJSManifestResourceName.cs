namespace JSBuild {
    using System;
    using System.IO;
    using Microsoft.Build.Framework;
    using Microsoft.Build.Tasks;

    public class CreateJSManifestResourceName : CreateCSharpManifestResourceName {
        private string _baseDirectory;

        [Required]
        public string baseDirectory {
            get { return _baseDirectory; }
            set { _baseDirectory = value; }
        }

        protected override string CreateManifestName(string fileName, string linkFileName, string rootNamespace, string dependentUponFileName, System.IO.Stream binaryStream) {
            this.Log.LogMessage("fileName={0} and linkFileName={1}", fileName, linkFileName);
            _baseDirectory = _baseDirectory.Trim();

            // Ensure that base directory ends with \
            if (!_baseDirectory.EndsWith(Path.DirectorySeparatorChar.ToString())) {
                _baseDirectory = _baseDirectory + Path.DirectorySeparatorChar;
            }

            // If file name starts with base directory, remove it
            if (fileName.StartsWith(_baseDirectory, StringComparison.InvariantCultureIgnoreCase)) {
                linkFileName = fileName.Remove(0, _baseDirectory.Length);
                linkFileName = linkFileName.Replace(Path.DirectorySeparatorChar.ToString(), ".");
                linkFileName = linkFileName.Replace(Path.AltDirectorySeparatorChar.ToString(), ".");
            }
            return base.CreateManifestName(fileName, linkFileName, rootNamespace, dependentUponFileName, binaryStream);
        }
    }
}
