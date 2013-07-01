using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Web;
using System.Web.UI;
using Microsoft.Ajax.Utilities;

namespace AjaxControlToolkit
{
    internal class ToolkitScriptManagerCombiner
    {
        private readonly Dictionary<Assembly, WebResourceAttribute[]> _webResourceAttributeCache = new Dictionary<Assembly, WebResourceAttribute[]>();
        private readonly Dictionary<Assembly, ScriptCombineAttribute[]> _scriptCombineAttributeCache = new Dictionary<Assembly, ScriptCombineAttribute[]>();
        private readonly Dictionary<Assembly, ScriptResourceAttribute[]> _scriptResourceAttributeCache = new Dictionary<Assembly, ScriptResourceAttribute[]>();

        private enum ScriptCombineStatus
        {
            Combineable, Excluded, NotCorrespondingWebResourceAttribute
        }   

        /// <summary>
        /// Request param name for the serialized combined scripts string
        /// </summary>
        internal const string CombinedScriptsParamName = "_TSM_CombinedScripts_";

        internal static readonly Regex WebResourceRegex = new Regex("<%\\s*=\\s*(?<resourceType>WebResource|ScriptResource)\\(\"(?<resourceName>[^\"]*)\"\\)\\s*%>", RegexOptions.Singleline | RegexOptions.Multiline);


        /// <summary>
        /// Outputs the combined script file requested by the HttpRequest to the HttpResponse
        /// </summary>
        /// <param name="context">HttpContext for the transaction</param>
        /// <param name="configFilePath">Path for controls config</param>
        /// <returns>true if the script file was output</returns>
        internal bool OutputCombinedScriptFile(HttpContext context, string configFilePath)
        {
            // Initialize
            bool output = false;
            HttpRequest request = context.Request;

            string combinedScripts;
            if (request.RequestType.ToUpper() == "GET")
            {
                combinedScripts = request.Params[CombinedScriptsParamName];
            }
            else
            {
#if NET45
                combinedScripts = request.Form[CombinedScriptsParamName];
#else
                combinedScripts = request.Params[CombinedScriptsParamName];
#endif
            }

            if (!string.IsNullOrEmpty(combinedScripts))
            {
                // This is a request for a combined script file
                HttpResponse response = context.Response;
                response.ContentType = "application/x-javascript";

                HttpCachePolicy cache = response.Cache;

                // Only cache script when not in Debug mode
                // Set the same (~forever) caching rules that ScriptResource.axd uses
                cache.SetCacheability(HttpCacheability.Public);
                cache.VaryByParams[CombinedScriptsParamName] = true;
                cache.SetOmitVaryStar(true);
                cache.SetExpires(DateTime.Now.AddDays(365));
                cache.SetValidUntilExpires(true);
                cache.SetLastModifiedFromFileDependencies();

                // Get the stream to write the combined script to (using a compressed stream if requested)
                // Note that certain versions of IE6 have difficulty with compressed responses, so we
                // don't compress for those browsers (just like ASP.NET AJAX's ScriptResourceHandler)
                Stream outputStream = response.OutputStream;
                if (!request.Browser.IsBrowser("IE") || (6 < request.Browser.MajorVersion))
                {
                    foreach (string acceptEncoding in (request.Headers["Accept-Encoding"] ?? "").ToUpperInvariant().Split(','))
                    {
                        if ("GZIP" == acceptEncoding)
                        {
                            // Browser wants GZIP; wrap the output stream with a GZipStream
                            response.AddHeader("Content-encoding", "gzip");
                            outputStream = new GZipStream(outputStream, CompressionMode.Compress);
                            break;
                        }

                        if ("DEFLATE" == acceptEncoding)
                        {
                            // Browser wants Deflate; wrap the output stream with a DeflateStream
                            response.AddHeader("Content-encoding", "deflate");
                            outputStream = new DeflateStream(outputStream, CompressionMode.Compress);
                            break;
                        }
                    }
                }

                // Output the combined script
                using (StreamWriter outputWriter = new StreamWriter(outputStream))
                {
                    // Get the list of scripts to combine
                    List<ScriptEntry> scriptEntries = DeserializeScriptEntries(configFilePath);

                    var js = "";
                    using (var ms = new MemoryStream())
                    {
                        var writer = new StreamWriter(ms);
                        // Write the scripts
                        WriteScripts(scriptEntries, writer);
                        writer.Flush();

                        ms.Position = 0;
                        js = (new StreamReader(ms)).ReadToEnd();
                    }

                    var minifier = new Minifier();
                    var jsContents = minifier.MinifyJavaScript(js);
                    outputWriter.WriteLine(jsContents);
                    // Write the ASP.NET AJAX script notification code
                    outputWriter.WriteLine("if(typeof(Sys)!=='undefined')Sys.Application.notifyScriptLoaded();");
                }

                output = true;
            }
            return output;
        }

        /// <summary>
        /// Get script entries based on config file.
        /// </summary>
        /// <param name="configFilePath">Path of config file.</param>
        /// <returns>List of script entry</returns>
        private List<ScriptEntry> DeserializeScriptEntries(string configFilePath)
        {
            var scriptReferences = GetScriptReferences(configFilePath);
            return scriptReferences.Select(scriptRef => new ScriptEntry(scriptRef)).ToList();
        }

        /// <summary>
        /// Load all script references needed by toolkits registered at config file.
        /// </summary>
        /// <param name="configFilePath">Path of config file</param>
        /// <returns>List of script reference</returns>
        internal List<ScriptReference> GetScriptReferences(string configFilePath)
        {
            var scriptReferences = new List<ScriptReference>();
            foreach (var control in ToolkitScriptManagerConfig.GetRegisteredControls(configFilePath))
            {
                var scriptRefs = ScriptObjectBuilder.GetScriptReferences(control);
                foreach (var scriptRef in scriptRefs)
                {
                    if (scriptReferences.All(s => s.Name != scriptRef.Name))
                    {
                        scriptReferences.Add(scriptRef);
                    }
                }
            }
            return scriptReferences;
        }

        /// <summary>
        /// Writes scripts (including localized script resources) to the specified stream
        /// </summary>
        /// <param name="scriptEntries">list of scripts to write</param>
        /// <param name="outputWriter">writer for output stream</param>
        private void WriteScripts(List<ScriptEntry> scriptEntries, TextWriter outputWriter)
        {
            foreach (ScriptEntry scriptEntry in scriptEntries)
            {
                if (!scriptEntry.Loaded)
                {
                    var combineStatus = IsScriptCombinable(scriptEntry);

                    if (combineStatus == ScriptCombineStatus.NotCorrespondingWebResourceAttribute)
                    {
                        throw new NotSupportedException(string.Format(CultureInfo.CurrentCulture,
                                                                      "Combined script request includes uncombinable script \"{0}\".",
                                                                      scriptEntry.Name));
                    }

                    if (combineStatus == ScriptCombineStatus.Combineable)
                    {
                        // This script hasn't been loaded by the browser, so add it to the combined script file
                        string script = scriptEntry.GetScript();
                        if (WebResourceRegex.IsMatch(script))
                        {
                            // This script uses script substitution which isn't supported yet, so throw an exception since it's too late to fix
                            throw new NotSupportedException(string.Format(CultureInfo.CurrentCulture,
                                                                          "ToolkitScriptManager does not support <%= WebResource/ScriptResource(...) %> substitution as used by script file \"{0}\".",
                                                                          scriptEntry.Name));
                        }
                        outputWriter.WriteLine(script);

                        // Save current culture and set the specified culture
                        CultureInfo currentUiCulture = Thread.CurrentThread.CurrentUICulture;
                        try
                        {
                            try
                            {
                                Thread.CurrentThread.CurrentUICulture = new CultureInfo(scriptEntry.Culture);
                            }
                            catch (ArgumentException)
                            {
                                // Invalid culture; proceed with default culture (just as for unsupported cultures)
                            }

                            // Write out the associated script resources (if any) in the proper culture
                            Assembly scriptAssembly = scriptEntry.LoadAssembly();
                            foreach (
                                ScriptResourceAttribute scriptResourceAttribute in
                                    GetScriptResourceAttributes(scriptAssembly))
                            {
                                if (scriptResourceAttribute.ScriptName == scriptEntry.Name)
                                {
#pragma warning disable 0618 // obsolete members of ScriptResourceAttribute are used but necessary in the 3.5 build
                                    // Found a matching script resource; write it out
                                    outputWriter.WriteLine(string.Format(CultureInfo.InvariantCulture, "{0}={{",
                                                                         scriptResourceAttribute.TypeName));

                                    // Get the script resource name (without the trailing ".resources")
                                    string scriptResourceName = scriptResourceAttribute.ScriptResourceName;
                                    if (scriptResourceName.EndsWith(".resources", StringComparison.OrdinalIgnoreCase))
                                    {
                                        scriptResourceName = scriptResourceName.Substring(0,
                                                                                          scriptResourceName.Length - 10);
                                    }
#pragma warning restore 0618

                                    // Load a ResourceManager/ResourceSet and walk through the list to output them all
                                    System.Resources.ResourceManager resourceManager =
                                        new System.Resources.ResourceManager(scriptResourceName, scriptAssembly);
                                    using (
                                        System.Resources.ResourceSet resourceSet =
                                            resourceManager.GetResourceSet(CultureInfo.InvariantCulture, true, true))
                                    {
                                        bool first = true;
                                        foreach (System.Collections.DictionaryEntry de in resourceSet)
                                        {
                                            if (!first)
                                            {
                                                // Need a comma between all entries
                                                outputWriter.Write(",");
                                            }
                                            // Output the entry
                                            string name = (string)de.Key;
                                            string value = resourceManager.GetString(name);
                                            outputWriter.Write(string.Format(CultureInfo.InvariantCulture,
                                                                             "\"{0}\":\"{1}\"", QuoteString(name),
                                                                             QuoteString(value)));
                                            first = false;
                                        }
                                    }
                                    outputWriter.WriteLine("};");
                                }
                            }

                        }
                        finally
                        {
                            // Restore culture
                            Thread.CurrentThread.CurrentUICulture = currentUiCulture;
                        }

                        // Done with this script
                    }

                    // This script is now (or will be soon) loaded by the browser
                    scriptEntry.Loaded = true;
                }
            }
        }

        /// <summary>
        /// Checks if the specified ScriptEntry is combinable
        /// </summary>
        /// <param name="scriptEntry">ScriptEntry to check</param>
        /// <returns>true iff combinable</returns>
        private ScriptCombineStatus IsScriptCombinable(ScriptEntry scriptEntry)
        {
            // Load the script's assembly and look for ScriptCombineAttribute
            bool combinable = false;
            Assembly assembly = scriptEntry.LoadAssembly();
            foreach (ScriptCombineAttribute scriptCombineAttribute in GetScriptCombineAttributes(assembly))
            {
                if (string.IsNullOrEmpty(scriptCombineAttribute.IncludeScripts))
                {
                    // If the IncludeScripts property is empty, all scripts are combinable by default
                    combinable = true;
                }
                else
                {
                    // IncludeScripts specifies the combinable scripts
                    foreach (string includeScript in scriptCombineAttribute.IncludeScripts.Split(','))
                    {
                        // If this script name matches, it's combinable
                        if (0 == string.Compare(scriptEntry.Name, includeScript.Trim(), StringComparison.OrdinalIgnoreCase))
                        {
                            combinable = true;
                            break;
                        }
                    }
                }
                if (!string.IsNullOrEmpty(scriptCombineAttribute.ExcludeScripts))
                {
                    // ExcludeScripts specifies the non-combinable scripts (and overrides IncludeScripts)
                    foreach (string excludeScript in scriptCombineAttribute.ExcludeScripts.Split(','))
                    {
                        // If the script name matches, it's not combinable
                        if (0 == string.Compare(scriptEntry.Name, excludeScript.Trim(), StringComparison.OrdinalIgnoreCase))
                        {
                            return ScriptCombineStatus.Excluded;
                        }
                    }
                }
            }

            if (combinable)
            {
                // Make sure the script has an associated WebResourceAttribute (else ScriptManager wouldn't have served it)
                bool correspondingWebResourceAttribute = false;
                foreach (WebResourceAttribute webResourceAttribute in GetWebResourceAttributes(assembly))
                {
                    if (scriptEntry.Name == webResourceAttribute.WebResource)
                    {
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

        private WebResourceAttribute[] GetWebResourceAttributes(Assembly assembly)
        {
            WebResourceAttribute[] attributes;
            lock (_webResourceAttributeCache)
            {
                if (!_webResourceAttributeCache.TryGetValue(assembly, out attributes))
                {
                    attributes = (WebResourceAttribute[])assembly.GetCustomAttributes(typeof(WebResourceAttribute), false);
                    _webResourceAttributeCache[assembly] = attributes;
                }
            }
            return attributes;
        }

        private ScriptResourceAttribute[] GetScriptResourceAttributes(Assembly assembly)
        {
            ScriptResourceAttribute[] attributes;
            lock (_scriptResourceAttributeCache)
            {
                if (!_scriptResourceAttributeCache.TryGetValue(assembly, out attributes))
                {
                    attributes = (ScriptResourceAttribute[])assembly.GetCustomAttributes(typeof(ScriptResourceAttribute), false);
                    _scriptResourceAttributeCache[assembly] = attributes;
                }
            }
            return attributes;
        }

        private ScriptCombineAttribute[] GetScriptCombineAttributes(Assembly assembly)
        {
            ScriptCombineAttribute[] attributes;
            lock (_scriptCombineAttributeCache)
            {
                if (!_scriptCombineAttributeCache.TryGetValue(assembly, out attributes))
                {
                    attributes = (ScriptCombineAttribute[])assembly.GetCustomAttributes(typeof(ScriptCombineAttribute), false);
                    _scriptCombineAttributeCache[assembly] = attributes;
                }
            }
            return attributes;
        }

        /// <summary>
        /// Callable implementation of System.Web.Script.Serialization.JavaScriptString.QuoteString
        /// </summary>
        /// <param name="value">value to quote</param>
        /// <returns>quoted string</returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity", Justification = "Callable implementation of System.Web.Script.Serialization.JavaScriptString.QuoteString")]
        internal static string QuoteString(string value)
        {
            StringBuilder builder = null;
            if (string.IsNullOrEmpty(value))
            {
                return string.Empty;
            }
            int startIndex = 0;
            int count = 0;
            for (int i = 0; i < value.Length; i++)
            {
                char c = value[i];
                if ((((c == '\r') || (c == '\t')) || ((c == '"') || (c == '\''))) || ((((c == '<') || (c == '>')) || ((c == '\\') || (c == '\n'))) || (((c == '\b') || (c == '\f')) || (c < ' '))))
                {
                    if (builder == null)
                    {
                        builder = new StringBuilder(value.Length + 5);
                    }
                    if (count > 0)
                    {
                        builder.Append(value, startIndex, count);
                    }
                    startIndex = i + 1;
                    count = 0;
                }

                switch (c)
                {
                    case '<':
                    case '>':
                    case '\'':
                        {
                            AppendCharAsUnicode(builder, c);
                            continue;
                        }
                    case '\\':
                        {
                            builder.Append(@"\\");
                            continue;
                        }
                    case '\b':
                        {
                            builder.Append(@"\b");
                            continue;
                        }
                    case '\t':
                        {
                            builder.Append(@"\t");
                            continue;
                        }
                    case '\n':
                        {
                            builder.Append(@"\n");
                            continue;
                        }
                    case '\f':
                        {
                            builder.Append(@"\f");
                            continue;
                        }
                    case '\r':
                        {
                            builder.Append(@"\r");
                            continue;
                        }
                    case '"':
                        {
                            builder.Append("\\\"");
                            continue;
                        }
                }
                if (c < ' ')
                {
                    AppendCharAsUnicode(builder, c);
                }
                else
                {
                    count++;
                }
            }
            if (builder == null)
            {
                return value;
            }
            if (count > 0)
            {
                builder.Append(value, startIndex, count);
            }
            return builder.ToString();
        }

        /// <summary>
        /// Callable implementation of System.Web.Script.Serialization.JavaScriptString.AppendCharAsUnicode
        /// </summary>
        /// <param name="builder">string builder</param>
        /// <param name="c">character to append</param>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1062:ValidateArgumentsOfPublicMethods", Justification = "Callable implementation of System.Web.Script.Serialization.JavaScriptString.AppendCharAsUnicode")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming", "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "c", Justification = "Callable implementation of System.Web.Script.Serialization.JavaScriptString.AppendCharAsUnicode")]
        internal static void AppendCharAsUnicode(StringBuilder builder, char c)
        {
            builder.Append(@"\u");
            builder.AppendFormat(CultureInfo.InvariantCulture, "{0:x4}", new object[] { (int)c });
        }

        /// <summary>
        /// Represents a script reference - including tracking its loaded state in the client browser
        /// </summary>
        private class ScriptEntry
        {
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
            /// Reference to the Assembly object (if loaded by LoadAssembly)
            /// </summary>
            private Assembly _loadedAssembly;
            private ScriptMode _scriptMode;

            /// <summary>
            /// Constructor
            /// </summary>
            /// <param name="assembly">containing assembly</param>
            /// <param name="name">script name</param>
            /// <param name="culture">culture for rendering the script</param>
            public ScriptEntry(string assembly, string name, string culture)
            {
                _assembly = assembly;
                Name = name;
                Culture = culture;
#if DEBUG
                _scriptMode = ScriptMode.Debug;
#else
                _scriptMode = ScriptMode.Release;
#endif
            }

            /// <summary>
            /// Constructor
            /// </summary>
            /// <param name="scriptReference">script reference</param>
            public ScriptEntry(ScriptReference scriptReference)
                : this(scriptReference.Assembly, scriptReference.Name, null)
            {
            }

            /// <summary>
            /// Gets the script corresponding to the object
            /// </summary>
            /// <returns>script text</returns>
            public string GetScript()
            {
                string script;
                using (Stream stream = LoadAssembly().GetManifestResourceStream(_scriptMode == ScriptMode.Debug ? Name.Replace(".js", ".debug.js") : Name))
                {
                    using (StreamReader reader = new StreamReader(stream))
                    {
                        script = reader.ReadToEnd();
                    }
                }
                return script;
            }

            /// <summary>
            /// Loads the associated Assembly
            /// </summary>
            /// <returns>Assembly reference</returns>
            public Assembly LoadAssembly()
            {
                if (null == _loadedAssembly)
                {
                    _loadedAssembly = System.Reflection.Assembly.Load(_assembly);
                }
                return _loadedAssembly;
            }

            /// <summary>
            /// Equals override to compare two ScriptEntry objects
            /// </summary>
            /// <param name="obj">comparison object</param>
            /// <returns>true iff both ScriptEntries represent the same script</returns>
            public override bool Equals(object obj)
            {
                ScriptEntry other = (ScriptEntry)obj;
                return ((other._assembly == _assembly) && (other.Name == Name));
            }

            /// <summary>
            /// GetHashCode override corresponding to the Equals override above
            /// </summary>
            /// <returns>hash code for the object</returns>
            public override int GetHashCode()
            {
                return _assembly.GetHashCode() ^ Name.GetHashCode();
            }
        }
    }
}
