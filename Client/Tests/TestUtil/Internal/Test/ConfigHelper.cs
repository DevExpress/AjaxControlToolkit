using System;
using System.Collections.Generic;
using System.Text;
using System.Configuration;
using System.Web.Configuration;
using System.IO;

namespace Microsoft.Internal.Test {
    public static class ConfigHelper {
        public static bool IsDebugMode(string appName) {
            Configuration config = WebConfigurationManager.OpenWebConfiguration("/" + appName);
            CompilationSection compilationSection =
                config.SectionGroups["system.web"].Sections["compilation"] as CompilationSection;
            return compilationSection.Debug;
        }

        public static void SetDebugMode(string appName, bool debugMode) {
            Configuration config = WebConfigurationManager.OpenWebConfiguration("/" + appName);
            CompilationSection compilationSection =
                config.SectionGroups["system.web"].Sections["compilation"] as CompilationSection;
            compilationSection.Debug = debugMode;

            // Remove read-only attribute from file
            File.SetAttributes(config.FilePath, FileAttributes.Normal);

            config.Save(ConfigurationSaveMode.Modified);

            // Recycle app pool to ensure config change has been applied before making a request.
            IISHelper.RecycleAppPool();
        }

        public static void SetTrust(string appName, string trustLevel) {
            Configuration config = WebConfigurationManager.OpenWebConfiguration("/" + appName);
            TrustSection trustSection =
                config.SectionGroups["system.web"].Sections["trust"] as TrustSection;
            trustSection.Level = trustLevel;

            // Remove read-only attribute from file
            File.SetAttributes(config.FilePath, FileAttributes.Normal);

            config.Save(ConfigurationSaveMode.Modified);

            // Recycle app pool to ensure config change has been applied before making a request.
            IISHelper.RecycleAppPool();
        }
    }
}
