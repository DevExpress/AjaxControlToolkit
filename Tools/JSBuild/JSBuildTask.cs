namespace JSBuild {
    using System;
    using System.IO;
    using Microsoft.Build.Framework;
    using Microsoft.Build.Utilities;

    public class JSBuildTask : Task {
        public JSBuildTask() {
            IncludePathInOutput = true;
            StripComments = true;
        }

        [Required]
        public ITaskItem[] SourceFiles {
            get;
            set;
        }

        [Required]
        public string SourceDirectory {
            get;
            set;
        }

        [Required]
        public string DestinationDirectory {
            get;
            set;
        }

        public bool IncludePathInOutput {
            get;
            set;
        }

        public bool StripComments {
            get;
            set;
        }

        public string DebugHeader {
            get;
            set;
        }

        public string ReleaseHeader {
            get;
            set;
        }

        public override bool Execute() {
            // If nothing to process then just return
            if (SourceFiles == null || SourceFiles.Length == 0) {
                Log.LogMessage("JSBuild: No files to process.");
                return true;
            }
 
            // Process each .pre.js file one-by-one
            foreach (ITaskItem item in SourceFiles) {
                string sourceFile = item.ItemSpec;
                string destinationPath = sourceFile;
                if (!IncludePathInOutput) {
                    destinationPath = Path.GetFileName(destinationPath);
                }

                // Release path
                string destinationRelease = Path.Combine(DestinationDirectory, destinationPath);
                if (destinationRelease.EndsWith(".pre.js", StringComparison.OrdinalIgnoreCase)) {
                    destinationRelease = destinationRelease.Substring(0, destinationRelease.Length - ".pre.js".Length) + ".js";
                }

                Log.LogMessage(MessageImportance.High, "JSBuild: Processing {0} -> {1}", Path.GetFileName(sourceFile), Path.GetDirectoryName(Path.GetFullPath(destinationRelease)));
                string[] outputFiles;
                try {
                    var preprocessor = new Preprocessor() {
                        StripComments = StripComments,
                        DebugHeader = DebugHeader,
                        ReleaseHeader = ReleaseHeader
                    };
                    outputFiles = preprocessor.Process(sourceFile, destinationRelease);
                }
                catch (Exception ex) {
                    Log.LogErrorFromException(ex);
                    return false;
                }

                foreach (string outputFile in outputFiles) {
                    var info = new FileInfo(outputFile);
                    Log.LogMessage(MessageImportance.High, "\t\t-> {0} [{1:n0} bytes ({2:n1}kb)]", Path.GetFileName(outputFile), info.Length, ((double)info.Length) / 1024D);
                }
            }
            return true;
        }
    }
}
