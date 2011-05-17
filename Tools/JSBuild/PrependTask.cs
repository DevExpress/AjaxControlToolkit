namespace JSBuild {
    using System.IO;
    using Microsoft.Build.Framework;
    using Microsoft.Build.Utilities;

    public class PrependTask : Task {
        [Required]
        public ITaskItem[] SourceFiles {
            get;
            set;
        }

        [Required]
        public string Text {
            get;
            set;
        }

        public override bool Execute() {
            if (SourceFiles == null || SourceFiles.Length == 0) {
                Log.LogMessage("Prepend: No files to process.");
                return true;
            }
 
            foreach (ITaskItem item in SourceFiles) {
                string sourceFile = item.ItemSpec;
                File.WriteAllText(sourceFile, Text + "\r\n" + File.ReadAllText(sourceFile));
            }
            return true;
        }
    }
}
