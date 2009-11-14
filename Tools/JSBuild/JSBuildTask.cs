using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Build.Utilities;
using Microsoft.Build.Framework;
using System.IO;
using System.Text.RegularExpressions;

namespace JSBuild {
    public class JSBuildTask : Task {
        private ITaskItem[] _sourceFiles;
        private string _sourceDirectory;
        private string _destinationDirectory;
        private string _debugHeader;
        private string _debugHeaderText = String.Empty;
        private string _releaseHeader;
        private string _releaseHeaderText = String.Empty;

        [Required]
        public ITaskItem[] SourceFiles {
            set {
                _sourceFiles = value;
            }
            get {
                return _sourceFiles;
            }
        }

        [Required]
        public string SourceDirectory {
            set {
                _sourceDirectory = value;
            }
            get {
                return _sourceDirectory;
            }
        }

        [Required]
        public string DestinationDirectory {
            set {
                _destinationDirectory = value;
            }
            get {
                return _destinationDirectory;
            }
        }

        public string DebugHeader {
            get {
                return _debugHeader;
            }
            set {
                _debugHeader = value;
            }
        }

        public string ReleaseHeader {
            get {
                return _releaseHeader;
            }
            set {
                _releaseHeader = value;
            }
        }

        public override bool Execute() {
            // If nothing to process then just return
            if (_sourceFiles == null || _sourceFiles.Length == 0) {
                Log.LogMessage("JSBuild: No .pre.js files to process.");
                return true;
            }

            // Load header text
            if (!String.IsNullOrEmpty(_debugHeader)) {
                _debugHeaderText = File.ReadAllText(_debugHeader);
            }
            if (!String.IsNullOrEmpty(_releaseHeader)) {
                _releaseHeaderText = File.ReadAllText(_releaseHeader);
            }


            // Process each .pre.js file one-by-one
            foreach (ITaskItem item in _sourceFiles) {
                var sourceFile = item.ItemSpec;
                if (sourceFile.ToLowerInvariant().EndsWith(".pre.js")) {

                    // Debug path
                    var destinationDebug = Path.Combine(_destinationDirectory, sourceFile);
                    destinationDebug = Regex.Replace(destinationDebug, ".pre.js$", ".debug.js", RegexOptions.IgnoreCase);

                    // Release path
                    var destinationRelease = Path.Combine(_destinationDirectory, sourceFile);
                    destinationRelease = Regex.Replace(destinationRelease, ".pre.js$", ".js", RegexOptions.IgnoreCase);

                    Log.LogMessage("JSBuild: Processing {0} --> {1},{2}.", sourceFile, destinationDebug, destinationRelease);

                    try {
                        Process(sourceFile, destinationDebug, destinationRelease);
                    }
                    catch (Exception ex) {
                        Log.LogErrorFromException(ex);
                        return false;
                    }

                }
            }

            return true;
        }

        public void Process(string sourcePath, string debugPath, string releasePath) {
            // Make sure destination directory exits
            var basePath = Path.GetDirectoryName(releasePath);
            if (!Directory.Exists(basePath)) {
                Directory.CreateDirectory(basePath);
            }

            // Create source reader
            var sourceReader = new StreamReader(sourcePath);

            // Create debug writer
            var debugWriter = new StringWriter();

            // Create release writer
            var releaseWriter = new StringWriter();

            // Create preprocessor
            var preprocessor = new Preprocessor();

            using (sourceReader) {
                using (debugWriter) {
                    using (releaseWriter) {
                        preprocessor.Process(sourcePath, sourceReader, debugWriter, releaseWriter);
                    }
                }
            }

            WriteDebug(debugPath, debugWriter.ToString());
            WriteRelease(releasePath, releaseWriter.ToString());
        }

        private void WriteDebug(string debugPath, string debugContent) {
            // Add debug header
            debugContent = _debugHeaderText + debugContent;

            // Write to file system
            if (!String.IsNullOrEmpty(debugContent)) {
                File.WriteAllText(debugPath, debugContent);
            }
        }


        private void WriteRelease(string releasePath, string releaseContent) {
            // Add release header
            releaseContent = _releaseHeaderText + releaseContent;

            // Write to file system
            if (!String.IsNullOrEmpty(releaseContent)) {
                File.WriteAllText(releasePath, releaseContent);
            }
        }
    }
}
