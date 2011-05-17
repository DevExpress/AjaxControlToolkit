namespace JSBuild {
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Text.RegularExpressions;
    using System.Globalization;
    using System.Xml;
    using System.Web.Script.Serialization;
    using System.Text;

    public class Preprocessor {
        private string _line = String.Empty;
        private int _lineNumber = 0;
        private List<DirectiveFrame> _directiveFrames;
        private bool _activeDebug;
        private bool _activeRelease;
        private static Regex OneLineCommentRegex = new Regex(@"^\s*//([^/!]|$)", RegexOptions.Compiled);
        private static Regex DirectiveRegex = new Regex(@"^\s*(//\#|\#)", RegexOptions.Compiled);

        public Preprocessor() {
            Symbols = new List<String>();

            _directiveFrames = new List<DirectiveFrame>();
        }

        private Preprocessor(List<DirectiveFrame> frames)
            : this() {
            _directiveFrames = frames ?? new List<DirectiveFrame>();
        }

        public List<String> Symbols { get; set; }
        public bool StripComments { get; set; }
        public string ReleaseHeader { get; set; }
        public string DebugHeader { get; set; }

        public string[] Process(string sourcePath, string releaseOutputPath) {
            List<String> paths = new List<String>();

            // Make sure destination directory exits
            string basePath = Path.GetDirectoryName(releaseOutputPath);
            if (!Directory.Exists(basePath)) {
                Directory.CreateDirectory(basePath);
            }
            string ext = Path.GetExtension(releaseOutputPath);
            string debugOutputPath = Path.ChangeExtension(releaseOutputPath, "debug" + ext);

            string resourcesField = null;
            bool resourcesNamespace = false;
            string resourcesXmlPath = null;
            string resourcesXmlPathExtension = null;
            Dictionary<String, String>[] neutralResources = null;
            Dictionary<CultureInfo, Dictionary<String, String>[]> cultureResources = null;

            // examine first non-empty line in source file for #localize directive
            using (var sourceReader = new StreamReader(sourcePath)) {
                string line;
                do {
                    line = sourceReader.ReadLine().Trim();
                }
                while (String.IsNullOrEmpty(line) && !sourceReader.EndOfStream);

                if (!String.IsNullOrEmpty(line) && DirectiveRegex.IsMatch(line)) {
                    try {
                        var directive = new Directive(1, line);
                        if (directive.Command.Equals("localize", StringComparison.OrdinalIgnoreCase) && directive.Parameters.Count >= 2) {
                            resourcesField = directive.Parameters[0];
                            resourcesNamespace = bool.Parse(directive.Parameters[1]);
                            resourcesXmlPath = directive.Parameters[2];
                            resourcesXmlPathExtension = Path.GetExtension(resourcesXmlPath);
                        }
                    }
                    catch (Exception ex) {
                        throw new InvalidOperationException(String.Format("Error while attempting to parse #localize directive for {0}.", sourcePath), ex);
                    }
                }
            }

            if (!String.IsNullOrEmpty(resourcesXmlPath)) {
                resourcesXmlPath = Path.GetFullPath(Path.Combine(Path.GetDirectoryName(sourcePath), resourcesXmlPath));

                // build the invariant resources
                cultureResources = new Dictionary<CultureInfo, Dictionary<String, String>[]>();
                neutralResources = GetDebugReleaseResources(resourcesXmlPath, null, null);
                // if neither debug or release resources found, throw
                if (neutralResources == null) {
                    throw new InvalidOperationException("String resources not found: " + resourcesXmlPath);
                }

                // build a list of all the available resources from this resource path. For example,
                // if the given path is foo.resx, look for foo.FR-fr.resx, and the debug versions of each.
                foreach (CultureInfo culture in CultureInfo.GetCultures(CultureTypes.NeutralCultures | CultureTypes.SpecificCultures)) {
                    if (!String.IsNullOrEmpty(culture.Name)) {
                        string name = culture.Name;
                        // replace foo.resx with foo.<culture>.resx
                        string fileName = Path.ChangeExtension(resourcesXmlPath, name + resourcesXmlPathExtension);
                        Dictionary<String, String>[] resources = GetDebugReleaseResources(fileName, name, neutralResources);
                        if (resources != null) {
                            cultureResources[culture] = resources;
                        }
                    }
                }
            }

            string debugBaseScript;
            string releaseBaseScript;

            using (var releaseWriter = new StringWriter()) {
                using (var debugWriter = new StringWriter()) {
                    using (var sourceReader = new StreamReader(sourcePath)) {
                        Process(sourcePath, sourceReader, debugWriter, releaseWriter);
                    }
                    debugBaseScript = debugWriter.ToString();
                }
                releaseBaseScript = releaseWriter.ToString();
            }

            // create output for neutral release/debug scripts
            CreateOutput(/*paths*/ paths,
                /*culture*/ CultureInfo.InvariantCulture,
                /*stringResources*/ neutralResources,
                /*resourcesField*/ resourcesField,
                /*resourcesNamespace*/ resourcesNamespace,
                /*releaseBaseScript*/ releaseBaseScript,
                /*releasePath*/ releaseOutputPath,
                /*debugBaseScript*/ debugBaseScript,
                /*debugPath*/ debugOutputPath);

            if (neutralResources != null) {
                // Also output a version of the scripts which has no resources.
                // This version of the script can then be embedded into an assembly and make use of the
                // localization feature of ScriptResourceHandler -- otherwise, the resources would be
                // duplicated.
                // The script is placed into an 'embed' folder in the same directory as the normal output.
                string debugEmbedPath = Path.Combine(Path.GetDirectoryName(debugOutputPath), "embed");
                string noResourceDebugPath = Path.Combine(debugEmbedPath, Path.GetFileName(debugOutputPath));

                string releaseEmbedPath = Path.Combine(Path.GetDirectoryName(releaseOutputPath), "embed");
                string noResourceReleasePath = Path.Combine(releaseEmbedPath, Path.GetFileName(releaseOutputPath));
                CreateOutput(/*paths*/ paths,
                    /*culture*/ CultureInfo.InvariantCulture,
                    /*stringResources*/ null,
                    /*resourcesField*/ null,
                    /*resourcesNamespace*/ false,
                    /*releaseBaseScript*/ releaseBaseScript,
                    /*releasePath*/ noResourceReleasePath,
                    /*debugBaseScript*/ debugBaseScript,
                    /*debugPath*/ noResourceDebugPath);
            }

            // create output for each culture in a 'loc' subdirectory
            if (cultureResources != null) {
                string releaseLocPath = Path.Combine(Path.Combine(Path.GetDirectoryName(releaseOutputPath), "loc"), Path.GetFileName(releaseOutputPath));
                string debugLocPath = Path.Combine(Path.Combine(Path.GetDirectoryName(debugOutputPath), "loc"), Path.GetFileName(debugOutputPath));
                foreach (KeyValuePair<CultureInfo, Dictionary<String, String>[]> resources in cultureResources) {
                    CreateOutput(/*paths*/ paths,
                        /*culture*/ resources.Key,
                        /*stringResources*/ resources.Value,
                        /*resourcesField*/ resourcesField,
                        /*resourcesNamespace*/ resourcesNamespace,
                        /*releaseBaseScript*/ releaseBaseScript,
                        /*releasePath*/ releaseLocPath,
                        /*debugBaseScript*/ debugBaseScript,
                        /*debugPath*/ debugLocPath);
                }
            }

            return paths.ToArray();
        }

        private void CreateOutput(List<String> paths, CultureInfo culture, Dictionary<String, String>[] stringResources, string resourcesField, bool resourcesNamespace, string releaseBaseScript, string releasePath, string debugBaseScript, string debugPath) {
            string releaseFileName = releasePath;
            string debugFileName = debugPath;
            if (culture != CultureInfo.InvariantCulture) {
                string ext = Path.GetExtension(releaseFileName);
                releaseFileName = Path.ChangeExtension(releasePath, culture.Name + ext);
                debugFileName = Path.ChangeExtension(releasePath, "debug." + culture.Name + ext);
            }
            paths.Add(debugFileName);
            Directory.CreateDirectory(Path.GetDirectoryName(debugFileName));
            File.WriteAllText(debugFileName, debugBaseScript);
            if (stringResources != null) {
                if (stringResources[0] != null) {
                    File.AppendAllText(debugFileName, GetResourcesObject(resourcesField, resourcesNamespace, stringResources[0]));
                }
                if (stringResources[1] != null) {
                    releaseBaseScript = releaseBaseScript + GetResourcesObject(resourcesField, resourcesNamespace, stringResources[1]);
                }
            }
            paths.Add(releaseFileName);
            Directory.CreateDirectory(Path.GetDirectoryName(releaseFileName));
            File.WriteAllText(releaseFileName, releaseBaseScript);
        }

        private string GetResourcesObject(string resourcesField, bool resourcesNamespace, Dictionary<String, String> stringResources) {
            JavaScriptSerializer jss = new JavaScriptSerializer();
            StringBuilder sb = new StringBuilder();
            if (resourcesNamespace) {
                string ns = resourcesField.Substring(0, resourcesField.LastIndexOf('.'));
                sb.Append("\r\nType.registerNamespace(" + jss.Serialize(ns) + ");");
            }
            sb.Append("\r\n").Append(resourcesField).Append(" = {");
            bool first = true;
            foreach (KeyValuePair<String, String> resource in stringResources) {
                if (!first) {
                    sb.Append(",\r\n");
                }
                else {
                    first = false;
                    sb.Append("\r\n");
                }
                sb.Append(jss.Serialize(resource.Key)).Append(": ").Append(jss.Serialize(resource.Value));
            }
            sb.Append("\r\n};\r\n");
            return sb.ToString();
        }

        private Dictionary<String, String>[] GetDebugReleaseResources(string filePath, string cultureName, Dictionary<String, String>[] neutralResources) {
            // filePath: foo.resx or foo.FR.resx
            Dictionary<String, String> releaseResources = GetResources(filePath);
            Dictionary<String, String> debugResources = releaseResources == null ? new Dictionary<String, String>() : new Dictionary<String, String>(releaseResources);
            // check for debug version of resources
            string ext = Path.GetExtension(filePath);
            string debugFilePath;
            if (String.IsNullOrEmpty(cultureName)) {
                // foo.resx -> foo.debug.resx
                debugFilePath = Path.ChangeExtension(filePath, "debug" + ext);
            }
            else {
                // foo.FR.resx -> foo.debug.FR.resx
                int index = filePath.LastIndexOf(cultureName + ".");
                debugFilePath = filePath.Substring(0, index) + "debug." + cultureName + ext;
            }
            if (File.Exists(debugFilePath)) {
                // overwrite copied release resources for each specified debug resource
                GetResources(debugResources, debugFilePath);
            }
            if (debugResources.Count == 0) {
                debugResources = null;
            }
            if (releaseResources == null && debugResources == null) {
                // this culture has no specific resources, so a script isn't generated for it.
                return null;
            }
            else {
                if (neutralResources == null) {
                    // these ARE the neutral resources
                    return new Dictionary<String, String>[] { debugResources, releaseResources };
                }
                else {
                    // combine culture specific resources with the neutral ones
                    return new Dictionary<String, String>[] {
                        CombineResources(neutralResources[0], debugResources),
                        CombineResources(neutralResources[1], releaseResources)
                    };
                }
            }
        }

        private Dictionary<String, String> CombineResources(Dictionary<String, String> neutralResources, Dictionary<String, String> cultureResources) {
            if (cultureResources == null) {
                return neutralResources;
            }
            var combinedResources = new Dictionary<String, String>(neutralResources);
            foreach (KeyValuePair<String, String> entry in cultureResources) {
                combinedResources[entry.Key] = entry.Value;
            }
            return combinedResources;
        }

        private Dictionary<String, String> GetResources(string filePath) {
            Dictionary<String, String> resources = null;
            if (File.Exists(filePath)) {
                resources = new Dictionary<String, String>();
                GetResources(resources, filePath);
            }
            return resources;
        }

        private void GetResources(Dictionary<String, String> resources, string filePath) {
            if (File.Exists(filePath)) {
                XmlDocument doc = new XmlDocument();
                doc.Load(filePath);
                foreach (XmlNode node in doc.SelectNodes("/root/data")) {
                    var name = node.Attributes["name"].Value;
                    var value = node.SelectSingleNode("value").InnerText;
                    resources[name] = value;
                }
            }
        }

        private void Process(string sourcePath, TextReader sourceReader, TextWriter debugWriter, TextWriter releaseWriter) {
            _activeDebug = IsActive(true);
            _activeRelease = IsActive(false);

            using (sourceReader) {
                if (!String.IsNullOrEmpty(ReleaseHeader)) {
                    releaseWriter.WriteLine(ReleaseHeader);
                }
                if (!String.IsNullOrEmpty(DebugHeader)) {
                    debugWriter.WriteLine(DebugHeader);
                }
                while ((_line = sourceReader.ReadLine()) != null) {
                    _lineNumber++;
                    if (DirectiveRegex.IsMatch(_line)) {
                        var directive = new Directive(_lineNumber, _line);

                        switch (directive.Command) {
                            case "LOCALIZE":
                                // already processed
                                break;
                            case "IF":
                                ProcessIFDirective(directive);
                                break;
                            case "ELSE":
                                ProcessELSEDirective(directive);
                                break;
                            case "ENDIF":
                                ProcessENDIFDirective(directive);
                                break;
                            case "INCLUDE":
                                ProcessINCLUDEDirective(sourcePath, directive, debugWriter, releaseWriter);
                                break;
                            case "DEFINE":
                                ProcessDEFINEDirective(directive, false);
                                break;
                            case "UNDEFINE":
                                ProcessDEFINEDirective(directive, true);
                                break;
                            default:
                                throw new InvalidOperationException("Unknown directive " + directive.Command);
                        }
                        _activeDebug = IsActive(true);
                        _activeRelease = IsActive(false);
                    }
                    else if (!StripComments || !OneLineCommentRegex.IsMatch(_line)) {
                        if (_activeDebug) {
                            debugWriter.WriteLine(_line);
                        }
                        if (_activeRelease) {
                            releaseWriter.WriteLine(_line);
                        }
                    }
                }
            }
        }

        private bool IsActive(bool debug) {
            foreach (var frame in _directiveFrames) {
                if ((debug && !frame.ActiveDebug) || (!debug && !frame.ActiveRelease)) {
                    return false;
                }
            }
            return true;
        }

        protected void ProcessDEFINEDirective(Directive directive, bool remove) {
            foreach (string parameter in directive.Parameters) {
                if (remove) {
                    Symbols.Remove(parameter);
                }
                else {
                    Symbols.Add(parameter);
                }
            }
        }

        protected void ProcessIFDirective(Directive directive) {
            string symbol = directive.Parameters[0].ToUpperInvariant();
            if (String.IsNullOrEmpty(symbol)) {
                ThrowProcessingError("Invalid #IF parameter");
            }

            // Process IF
            bool activeDebug = false;
            bool activeRelease = false;
            switch (symbol) {
                case "DEBUG":
                    activeDebug = true;
                    activeRelease = false;
                    break;
                case "RELEASE":
                    activeDebug = false;
                    activeRelease = true;
                    break;
                default:
                    activeDebug = activeRelease = Symbols.Contains(symbol, StringComparer.OrdinalIgnoreCase);
                    break;
            }
            _directiveFrames.Add(new DirectiveFrame { Directive = directive, ActiveDebug = activeDebug, ActiveRelease = activeRelease });
        }

        protected void ProcessELSEDirective(Directive directive) {
            var frame = _directiveFrames[_directiveFrames.Count - 1];
            frame.ActiveDebug = !frame.ActiveDebug;
            frame.ActiveRelease = !frame.ActiveRelease;
        }

        protected void ProcessENDIFDirective(Directive directive) {
            if (_directiveFrames.Count == 0) {
                ThrowProcessingError("#ENDIF without #IF");
            }
            _directiveFrames.RemoveAt(_directiveFrames.Count - 1);
        }

        protected void ProcessINCLUDEDirective(string sourcePath, Directive directive, TextWriter debugWriter, TextWriter releaseWriter) {
            string includeFile = directive.Parameters[0];
            if (String.IsNullOrEmpty(includeFile)) {
                ThrowProcessingError("#INCLUDE missing include file ");
            }

            // Recurse
            string includePath = Path.Combine(Path.GetDirectoryName(sourcePath), includeFile);
            var includeReader = new StreamReader(includePath);
            var includePreprocessor = new Preprocessor(_directiveFrames) { Symbols = Symbols, StripComments = StripComments };
            includePreprocessor.Process(includePath, includeReader, debugWriter, releaseWriter);
        }

        private void ThrowProcessingError(string message) {
            throw new InvalidOperationException(String.Format("{0} on line {1}:{2}.", message, _lineNumber, _line));
        }
    }
}
