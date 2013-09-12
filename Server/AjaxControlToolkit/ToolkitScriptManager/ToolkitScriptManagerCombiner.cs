using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Threading;
using System.Web;
using System.Web.UI;

namespace AjaxControlToolkit {
    /// <summary>
    /// Provide functionality for combine and minificaton for ToolkitScriptManager
    /// </summary>
    public class ToolkitScriptManagerCombiner {
        private readonly Dictionary<Assembly, WebResourceAttribute[]> _webResourceAttributeCache =
            new Dictionary<Assembly, WebResourceAttribute[]>();

        private readonly Dictionary<Assembly, ScriptCombineAttribute[]> _scriptCombineAttributeCache =
            new Dictionary<Assembly, ScriptCombineAttribute[]>();

        private readonly Dictionary<Assembly, ScriptResourceAttribute[]> _scriptResourceAttributeCache =
            new Dictionary<Assembly, ScriptResourceAttribute[]>();

        private static readonly Dictionary<string, string> CachedScriptContent = new Dictionary<string, string>();

        private enum ScriptCombineStatus {
            Combineable,
            Excluded,
            NotCorrespondingWebResourceAttribute,
            HasCdnPath
        }


        /// <summary>
        /// Regular expression for detecting WebResource/ScriptResource substitutions in script files
        /// </summary>
        internal static readonly Regex WebResourceRegex =
            new Regex("<%\\s*=\\s*(?<resourceType>WebResource|ScriptResource)\\(\"(?<resourceName>[^\"]*)\"\\)\\s*%>",
                RegexOptions.Singleline | RegexOptions.Multiline);

        private List<ScriptReference> _scriptReferences;
        private bool _scriptEntriesLoaded;

        private readonly ToolkitScriptManagerConfig _scriptManagerConfig;
        private readonly ToolkitScriptManagerHelper _helper;
        private List<ScriptEntry> _scriptEntries;

        /// <summary>
        /// Helper class to provide combine and minification for ToolkitScriptManager.
        /// This API supports the AjaxControlToolkit infrastructure and is not intended to be used directly from your code.
        /// </summary>
        /// <param name="toolkitScriptManagerConfig"></param>
        /// <param name="helper"></param>
        public ToolkitScriptManagerCombiner(ToolkitScriptManagerConfig toolkitScriptManagerConfig,
            ToolkitScriptManagerHelper helper) {
            _scriptManagerConfig = toolkitScriptManagerConfig;
            _helper = helper;
        }


        /// <summary>
        /// Outputs the combined script file requested by the HttpRequest to the HttpResponse
        /// </summary>
        /// <param name="context">HttpContext for the transaction</param>
        /// <returns>true if the script file was output</returns>
        public bool OutputCombinedScriptFile(HttpContextBase context) {

            // Initialize
            var request = context.Request;

            // Determine is there any combine script request in http context
            var combinedScripts = ToolkitScriptManagerHelper.GetRequestParamValue(request,
                ToolkitScriptManager.CombinedScriptsParamName);

            if (string.IsNullOrEmpty(combinedScripts))
                return false;

            // This is a request for a combined script file
            var response = context.Response;
            response.ContentType = "application/x-javascript";

            var cache = response.Cache;

            // Set the same (~forever) caching rules that ScriptResource.axd uses
            cache.SetCacheability(HttpCacheability.Public);
            cache.VaryByParams[ToolkitScriptManager.CombinedScriptsParamName] = true;
            cache.VaryByParams[ToolkitScriptManager.HiddenFieldParamName] = true;
            cache.VaryByParams[ToolkitScriptManager.CacheBustParamName] = true;
            cache.VaryByParams[ToolkitScriptManager.EnableCdnParamName] = true;
            cache.SetOmitVaryStar(true);
            cache.SetExpires(DateTime.Now.AddDays(365));
            cache.SetValidUntilExpires(true);
            cache.SetLastModifiedFromFileDependencies();

            // Get the stream to write the combined script to (using a compressed stream if requested)
            // Note that certain versions of IE6 have difficulty with compressed responses, so we
            // don't compress for those browsers (just like ASP.NET AJAX's ScriptResourceHandler)
            var outputStream = response.OutputStream;
            if (!request.Browser.IsBrowser("IE") || (6 < request.Browser.MajorVersion)) {
                foreach (
                    string acceptEncoding in (request.Headers["Accept-Encoding"] ?? "").ToUpperInvariant().Split(',')) {
                    if ("GZIP" == acceptEncoding) {
                        // Browser wants GZIP; wrap the output stream with a GZipStream
                        response.AddHeader("Content-encoding", "gzip");
                        outputStream = new GZipStream(outputStream, CompressionMode.Compress);
                        break;
                    }

                    if ("DEFLATE" == acceptEncoding) {
                        // Browser wants Deflate; wrap the output stream with a DeflateStream
                        response.AddHeader("Content-encoding", "deflate");
                        outputStream = new DeflateStream(outputStream, CompressionMode.Compress);
                        break;
                    }
                }
            }


            // Output the combined script
            using (var outputWriter = new StreamWriter(outputStream)) {

                var hash = ToolkitScriptManagerHelper.GetRequestParamValue(request,
                    ToolkitScriptManager.CacheBustParamName);
                var bundlesParam = ToolkitScriptManagerHelper.GetRequestParamValue(request,
                    ToolkitScriptManager.ControlBundleParamName);
                var enableCdn = bool.Parse(ToolkitScriptManagerHelper.GetRequestParamValue(request, ToolkitScriptManager.EnableCdnParamName));

                string[] bundles = null;
                if (!string.IsNullOrEmpty(bundlesParam)) {
                    bundles = bundlesParam.Split(new[] {ToolkitScriptManager.QueryStringBundleDelimiter},
                        StringSplitOptions.RemoveEmptyEntries);
                }

                var js = GetCombinedScriptContent(context, hash, bundles, enableCdn);


                var minifyResult = _helper.MinifyJS(js);
                if (minifyResult.ErrorList.Count > 0) {
                    _helper.WriteErrors(outputWriter, minifyResult.ErrorList);
                }
                else {
                    // Write minified scripts
                    _helper.WriteToStream(outputWriter, minifyResult.Result);
                    // Write the ASP.NET AJAX script notification code
                    _helper.WriteToStream(outputWriter,
                        "if(typeof(Sys)!=='undefined')Sys.Application.notifyScriptLoaded();");
                }
            }
            return true;
        }


        /// <summary>
        /// Try to get cached script content. If not found then reload and recache it based on bundles.
        /// </summary>
        /// <param name="context">Current HttpContext</param>
        /// <param name="hash">Hash as a cache key</param>
        /// <param name="bundles">Bundles to load if cache is expired or not found</param>
        /// <returns></returns>
        private string GetCombinedScriptContent(HttpContextBase context, string hash, string[] bundles, bool enableCdn)
        {
            if (CachedScriptContent.ContainsKey(hash))
                return CachedScriptContent[hash];

            // reload script references
            LoadScriptReferences(context, bundles);
            var scriptContent = GetCombinedRegisteredScriptContent(enableCdn);

            // recache script references
            CachedScriptContent.Add(hash, scriptContent);

            return scriptContent;
        }

        /// <summary>
        /// Get combined registered script content. Script entries must be loaded before calling this method.
        /// </summary>
        /// <returns></returns>
        private string GetCombinedRegisteredScriptContent(bool enableCdn) {

            if (!_scriptEntriesLoaded)
                throw new OperationCanceledException("Script entries not loaded yet.");

            // Get the list of scripts to combine
            _scriptEntries = _scriptReferences.Select(scriptRef => new ScriptEntry(scriptRef)).ToList();

            using (var ms = new MemoryStream()) {
                var writer = new StreamWriter(ms);
                // Write the scripts
                WriteScripts(_scriptEntries, writer, enableCdn);
                writer.Flush();

                ms.Position = 0;
                return (new StreamReader(ms)).ReadToEnd();
            }
        }

        internal List<ScriptReference> GetExcludedScripts(bool hasCdnPath) {
            if (_scriptEntries == null || _scriptEntries.Count == 0)
                return null;

            return
                _scriptReferences.Where(
                    s => _scriptEntries.Where(se => !se.Loaded && se.HasCdnPath == hasCdnPath)
                        .Select(se => se.Name).Contains(s.Name)).ToList();
        }

        /// <summary>
        /// Get script content hash in bundles. Script entries must be loaded first before calling this method.
        /// </summary>
        /// <param name="context">Current HttpContext</param>
        /// <param name="bundles">Bundle names</param>
        /// <returns></returns>
        public string GetCombinedScriptContentHash(HttpContextBase context, string[] bundles, bool enableCdn)
        {
            var content = GetCombinedRegisteredScriptContent(enableCdn);
            var hash = _helper.Hashing(content);

            // Store script content into cache once we have its hash.
            if (!CachedScriptContent.ContainsKey(hash))
                CachedScriptContent.Add(hash, content);

            return hash;
        }

        /// <summary>
        /// Load all script references needed by toolkits registered at config file based on bundles.
        /// If bundles is null then all control types from config are loaded.
        /// </summary>
        /// <param name="context">Current HttpContext</param>
        /// <param name="bundles">Name of bundles</param>
        /// <returns>List of script reference</returns>
        public List<ScriptReference> LoadScriptReferences(HttpContextBase context, string[] bundles) {
            _scriptReferences = new List<ScriptReference>();
            foreach (var control in _scriptManagerConfig.GetControlTypesInBundles(context, bundles)) {
                var scriptRefs = ScriptObjectBuilder.GetScriptReferences(control);
                foreach (var scriptRef in scriptRefs) {
                    if (_scriptReferences.All(s => s.Name != scriptRef.Name)) {
                        _scriptReferences.Add(scriptRef);
                    }
                }
            }

            _scriptEntriesLoaded = true;
            return _scriptReferences;
        }

        /// <summary>
        /// Determine is script already registered on script entries memory to be combined.
        /// </summary>
        /// <param name="scriptReference">Script to determine.</param>
        /// <returns>true if registered</returns>
        public bool IsScriptRegistered(ScriptReference scriptReference) {
            if (!_scriptEntriesLoaded)
                throw new OperationCanceledException("Script entries not loaded yet.");

            // No script was registered
            if (_scriptReferences == null || _scriptReferences.Count == 0)
                return false;

            // Determine is script is not loaded because part of excluded script to be combined
            if (_scriptEntries != null &&
                _scriptEntries.Where(s => !s.Loaded)
                    .Any(
                        s =>
                            s.Name == scriptReference.Name &&
                            s.LoadAssembly().FullName == scriptReference.Assembly))
                return false;

            return _scriptReferences.Any(s => s.Name == scriptReference.Name && s.Assembly == scriptReference.Assembly);
        }

        /// <summary>
        /// Register script reference to script entries.
        /// </summary>
        /// <param name="scriptReference"></param>
        public void RegisterScriptReference(ScriptReference scriptReference) {
            if (_scriptEntries == null)
                _scriptEntries = new List<ScriptEntry>();

            var scriptEntry =
                _scriptEntries.FirstOrDefault(
                    s => s.LoadAssembly().FullName == scriptReference.Assembly && s.Name == scriptReference.Name);

            if (scriptEntry == null) {
                scriptEntry = new ScriptEntry(scriptReference);
                _scriptEntries.Add(scriptEntry);
            }

            scriptEntry.Loaded = true;
        }

        /// <summary>
        /// Writes scripts (including localized script resources) to the specified stream
        /// </summary>
        /// <param name="scriptEntries">list of scripts to write</param>
        /// <param name="outputWriter">writer for output stream</param>
        private void WriteScripts(List<ScriptEntry> scriptEntries, TextWriter outputWriter, bool enableCdn) {
            foreach (ScriptEntry scriptEntry in scriptEntries) {
                if (!scriptEntry.Loaded) {
                    var combineStatus = IsScriptCombinable(scriptEntry, enableCdn);

                    if (combineStatus == ScriptCombineStatus.NotCorrespondingWebResourceAttribute) {
                        throw new NotSupportedException(string.Format(CultureInfo.CurrentCulture,
                            "Combined script request includes uncombinable script \"{0}\".",
                            scriptEntry.Name));
                    }

                    if (combineStatus == ScriptCombineStatus.Combineable) {
                        // This script hasn't been loaded by the browser, so add it to the combined script file
                        string script = scriptEntry.GetScript();
                        if (WebResourceRegex.IsMatch(script)) {
                            // This script uses script substitution which isn't supported yet, so throw an exception since it's too late to fix
                            throw new NotSupportedException(string.Format(CultureInfo.CurrentCulture,
                                "ToolkitScriptManager does not support <%= WebResource/ScriptResource(...) %> substitution as used by script file \"{0}\".",
                                scriptEntry.Name));
                        }
                        outputWriter.WriteLine(script);

                        // Save current culture and set the specified culture
                        CultureInfo currentUiCulture = Thread.CurrentThread.CurrentUICulture;
                        try {
                            try {
                                Thread.CurrentThread.CurrentUICulture = new CultureInfo(scriptEntry.Culture);
                            }
                            catch (ArgumentException) {
                                // Invalid culture; proceed with default culture (just as for unsupported cultures)
                            }

                            // Write out the associated script resources (if any) in the proper culture
                            Assembly scriptAssembly = scriptEntry.LoadAssembly();
                            foreach (
                                ScriptResourceAttribute scriptResourceAttribute in
                                    GetScriptResourceAttributes(scriptAssembly)) {
                                if (scriptResourceAttribute.ScriptName == scriptEntry.Name) {
#pragma warning disable 0618 // obsolete members of ScriptResourceAttribute are used but necessary in the 3.5 build
                                    // Found a matching script resource; write it out
                                    outputWriter.WriteLine(string.Format(CultureInfo.InvariantCulture, "{0}={{",
                                        scriptResourceAttribute.TypeName));

                                    // Get the script resource name (without the trailing ".resources")
                                    string scriptResourceName = scriptResourceAttribute.ScriptResourceName;
                                    if (scriptResourceName.EndsWith(".resources", StringComparison.OrdinalIgnoreCase)) {
                                        scriptResourceName = scriptResourceName.Substring(0,
                                            scriptResourceName.Length - 10);
                                    }
#pragma warning restore 0618

                                    // Load a ResourceManager/ResourceSet and walk through the list to output them all
                                    System.Resources.ResourceManager resourceManager =
                                        new System.Resources.ResourceManager(scriptResourceName, scriptAssembly);
                                    using (
                                        System.Resources.ResourceSet resourceSet =
                                            resourceManager.GetResourceSet(CultureInfo.InvariantCulture, true, true)) {
                                        bool first = true;
                                        foreach (System.Collections.DictionaryEntry de in resourceSet) {
                                            if (!first) {
                                                // Need a comma between all entries
                                                outputWriter.Write(",");
                                            }
                                            // Output the entry
                                            string name = (string) de.Key;
                                            string value = resourceManager.GetString(name);
                                            outputWriter.Write(string.Format(CultureInfo.InvariantCulture,
                                                "\"{0}\":\"{1}\"", ToolkitScriptManagerHelper.QuoteString(name),
                                                ToolkitScriptManagerHelper.QuoteString(value)));
                                            first = false;
                                        }
                                    }
                                    outputWriter.WriteLine("};");
                                }
                            }

                        }
                        finally {
                            // Restore culture
                            Thread.CurrentThread.CurrentUICulture = currentUiCulture;
                        }

                        // Done with this script
                        // This script is now (or will be soon) loaded by the browser
                        scriptEntry.Loaded = true;
                    }

                }
            }
        }

        /// <summary>
        /// Determine is script reference combinable.
        /// </summary>
        /// <param name="scriptReference">Script Reference to check</param>
        /// <returns>Returns true if script combinable, otherwise false</returns>
        public bool IsScriptCombinable(ScriptReference scriptReference, bool enableCdn) {
            return IsScriptCombinable(new ScriptEntry(scriptReference), enableCdn) == ScriptCombineStatus.Combineable;
        }

        /// <summary>
        /// Checks if the specified ScriptEntry is combinable
        /// </summary>
        /// <param name="scriptEntry">ScriptEntry to check</param>
        /// <returns>true iff combinable</returns>
        private ScriptCombineStatus IsScriptCombinable(ScriptEntry scriptEntry, bool enableCdn) {
            // Load the script's assembly and look for ScriptCombineAttribute
            bool combinable = false;
            Assembly assembly = scriptEntry.LoadAssembly();
            foreach (ScriptCombineAttribute scriptCombineAttribute in GetScriptCombineAttributes(assembly)) {
                if (string.IsNullOrEmpty(scriptCombineAttribute.IncludeScripts)) {
                    // If the IncludeScripts property is empty, all scripts are combinable by default
                    combinable = true;
                }
                else {
                    // IncludeScripts specifies the combinable scripts
                    foreach (string includeScript in scriptCombineAttribute.IncludeScripts.Split(',')) {
                        // If this script name matches, it's combinable
                        if (0 ==
                            string.Compare(scriptEntry.Name, includeScript.Trim(), StringComparison.OrdinalIgnoreCase)) {
                            combinable = true;
                            break;
                        }
                    }
                }
                if (!string.IsNullOrEmpty(scriptCombineAttribute.ExcludeScripts)) {
                    // ExcludeScripts specifies the non-combinable scripts (and overrides IncludeScripts)
                    foreach (string excludeScript in scriptCombineAttribute.ExcludeScripts.Split(',')) {
                        // If the script name matches, it's not combinable
                        if (0 ==
                            string.Compare(scriptEntry.Name, excludeScript.Trim(), StringComparison.OrdinalIgnoreCase)) {
                            return ScriptCombineStatus.Excluded;
                        }
                    }
                }
            }

            if (combinable) {
                // Make sure the script has an associated WebResourceAttribute (else ScriptManager wouldn't have served it)
                bool correspondingWebResourceAttribute = false;
                foreach (WebResourceAttribute webResourceAttribute in GetWebResourceAttributes(assembly)) {
                    if (scriptEntry.Name == webResourceAttribute.WebResource) {
                        
#if NET45 || NET40
                        if (enableCdn && !string.IsNullOrEmpty(webResourceAttribute.CdnPath)) {
                            scriptEntry.HasCdnPath = true;
                            return ScriptCombineStatus.HasCdnPath;
                        }
#endif

                        correspondingWebResourceAttribute = true;
                        break;
                    }
                }
                // Don't allow it to be combined if not correspondingWebResourceAttribute
                if (!correspondingWebResourceAttribute)
                    return ScriptCombineStatus.NotCorrespondingWebResourceAttribute;
            }

            return ScriptCombineStatus.Combineable;
        }

        private WebResourceAttribute[] GetWebResourceAttributes(Assembly assembly) {
            WebResourceAttribute[] attributes;
            lock (_webResourceAttributeCache) {
                if (!_webResourceAttributeCache.TryGetValue(assembly, out attributes)) {
                    attributes = assembly.GetCustomAttributes(typeof (WebResourceAttribute), false)
                        .Cast<WebResourceAttribute>()
                        .Distinct().ToArray();
                    _webResourceAttributeCache[assembly] = attributes;
                }
            }
            return attributes;
        }

        private ScriptResourceAttribute[] GetScriptResourceAttributes(Assembly assembly) {
            ScriptResourceAttribute[] attributes;
            lock (_scriptResourceAttributeCache) {
                if (!_scriptResourceAttributeCache.TryGetValue(assembly, out attributes)) {
                    attributes =
                        (ScriptResourceAttribute[])
                            assembly.GetCustomAttributes(typeof (ScriptResourceAttribute), false);
                    _scriptResourceAttributeCache[assembly] = attributes;
                }
            }
            return attributes;
        }

        private ScriptCombineAttribute[] GetScriptCombineAttributes(Assembly assembly) {
            ScriptCombineAttribute[] attributes;
            lock (_scriptCombineAttributeCache) {
                if (!_scriptCombineAttributeCache.TryGetValue(assembly, out attributes)) {
                    attributes =
                        (ScriptCombineAttribute[]) assembly.GetCustomAttributes(typeof (ScriptCombineAttribute), false);
                    _scriptCombineAttributeCache[assembly] = attributes;
                }
            }
            return attributes;
        }

        /// <summary>
        /// Represents a script reference - including tracking its loaded state in the client browser
        /// </summary>
        private class ScriptEntry {
            /// <summary>
            /// Containing Assembly
            /// </summary>
            private readonly string _assembly;

            /// <summary>
            /// Script name
            /// </summary>
            public readonly string Name;

            /// <summary>
            /// Culture to render the script in
            /// </summary>
            public readonly string Culture;

            /// <summary>
            /// Loaded state of the script in the client browser
            /// </summary>
            public bool Loaded;

            /// <summary>
            /// Indicate that the script has CDN path.
            /// </summary>
            public bool HasCdnPath;

            /// <summary>
            /// Constructor
            /// </summary>
            /// <param name="assembly">containing assembly</param>
            /// <param name="name">script name</param>
            /// <param name="culture">culture for rendering the script</param>
            public ScriptEntry(string assembly, string name, string culture) {
                _assembly = assembly;
                Name = name;
                Culture = culture;
            }

            /// <summary>
            /// Constructor
            /// </summary>
            /// <param name="scriptReference">script reference</param>
            public ScriptEntry(ScriptReference scriptReference)
                : this(scriptReference.Assembly, scriptReference.Name, null) {
            }

            /// <summary>
            /// Gets the script corresponding to the object
            /// </summary>
            /// <returns>script text</returns>
            public string GetScript() {
                string script;
                using (Stream stream = LoadAssembly().GetManifestResourceStream(Name)) {
                    using (StreamReader reader = new StreamReader(stream)) {
                        script = reader.ReadToEnd();
                    }
                }
                return script;
            }


            /// <summary>
            /// Loads the associated Assembly
            /// </summary>
            /// <returns>Assembly reference</returns>
            public Assembly LoadAssembly() {
                //if (!LoadedAssembly.ContainsKey(_assembly))
                //    LoadedAssembly.Add(_assembly, Assembly.Load(_assembly));
                //return LoadedAssembly[_assembly];
                return ToolkitScriptManagerHelper.GetAssembly(_assembly);
            }

            /// <summary>
            /// Equals override to compare two ScriptEntry objects
            /// </summary>
            /// <param name="obj">comparison object</param>
            /// <returns>true iff both ScriptEntries represent the same script</returns>
            public override bool Equals(object obj) {
                ScriptEntry other = (ScriptEntry) obj;
                return ((other._assembly == _assembly) && (other.Name == Name));
            }

            /// <summary>
            /// GetHashCode override corresponding to the Equals override above
            /// </summary>
            /// <returns>hash code for the object</returns>
            public override int GetHashCode() {
                return _assembly.GetHashCode() ^ Name.GetHashCode();
            }
        }       
    }
}