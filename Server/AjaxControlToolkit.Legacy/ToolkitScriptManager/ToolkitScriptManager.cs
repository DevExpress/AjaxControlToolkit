


using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit
{
    /// <summary>
    /// ScriptManager derived class to add the ability to combine multiple
    /// smaller scripts into one larger one as a way to reduce the number
    /// of files the client must download
    /// </summary>
    [Themeable(true)]
    public class ToolkitScriptManager : ScriptManager
    {
        private static readonly Dictionary<Assembly, WebResourceAttribute[]> _webResourceAttributeCache = new Dictionary<Assembly, WebResourceAttribute[]>();
        private static readonly Dictionary<Assembly, ScriptCombineAttribute[]> _scriptCombineAttributeCache = new Dictionary<Assembly, ScriptCombineAttribute[]>();
        private static readonly Dictionary<Assembly, ScriptResourceAttribute[]> _scriptResourceAttributeCache = new Dictionary<Assembly, ScriptResourceAttribute[]>();

        /// <summary>
        /// Request param name for the serialized combined scripts string
        /// </summary>
        private const string CombinedScriptsParamName = "_TSM_CombinedScripts_";

        /// <summary>
        /// Request param name for the hidden field name
        /// </summary>
        private const string HiddenFieldParamName = "_TSM_HiddenField_";

        /// <summary>
        /// Regular expression for detecting WebResource/ScriptResource substitutions in script files
        /// </summary>
        protected static readonly Regex WebResourceRegex = new Regex("<%\\s*=\\s*(?<resourceType>WebResource|ScriptResource)\\(\"(?<resourceName>[^\"]*)\"\\)\\s*%>", RegexOptions.Singleline | RegexOptions.Multiline);

#if !NET4 && !NET45
        private static Dictionary<String, bool> _scripts;

        static ToolkitScriptManager() {
            _scripts = new Dictionary<string, bool>();
            _scripts.Add("MicrosoftAjax.js", true);
            _scripts.Add("MicrosoftAjaxWebForms.js", true);
            _scripts.Add("MicrosoftAjaxTimer.js", true);
            _scripts.Add("MicrosoftAjax.debug.js", true);
            _scripts.Add("MicrosoftAjaxWebForms.debug.js", true);
            _scripts.Add("MicrosoftAjaxTimer.debug.js", true);
        }
#endif
        private static WebResourceAttribute[] GetWebResourceAttributes(Assembly assembly)
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

        private static ScriptResourceAttribute[] GetScriptResourceAttributes(Assembly assembly)
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

        private static ScriptCombineAttribute[] GetScriptCombineAttributes(Assembly assembly)
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
        /// Specifies whether or not multiple script references should be combined into a single file
        /// </summary>
        public bool CombineScripts
        {
            get { return _combineScripts; }
            set { _combineScripts = value; }
        }
        private bool _combineScripts = true;

        /// <summary>
        /// Optionally specifies the URL of an HTTP handler for generating the combined script files
        /// </summary>
        /// <remarks>
        /// The handler's ProcessRequest method should call directly through to ToolkitScriptManager.OutputCombinedScriptFile
        /// </remarks>
        [UrlProperty]
        public Uri CombineScriptsHandlerUrl
        {
            get { return _combineScriptsHandlerUrl; }
            set { _combineScriptsHandlerUrl = value; }
        }
        private Uri _combineScriptsHandlerUrl;

        /// <summary>
        /// List of ScriptEntry objects tracking scripts that are used by the page
        /// </summary>
        private List<ScriptEntry> _scriptEntries;

        /// <summary>
        /// Url for the browser to request to get the combined script file
        /// </summary>
        private string _combinedScriptUrl;

        /// <summary>
        /// List of script references that have been disabled
        /// </summary>
        private List<ScriptReference> _disabledScriptReferences;

        /// <summary>
        /// List of script references that have been seen and are uncombinable
        /// </summary>
        private List<ScriptReference> _uncombinableScriptReferences;

#if !NET4 && !NET45
        private void ApplyAssembly(ScriptReference script, bool isComposite) {
            // if the script has a name and no path, and no assembly or the assembly is set to SWE,
            // set the path to the resource in ACT. We set the path instead of just changing the assembly
            // so that ScriptManager still considers the scripts Microsoft Ajax scripts, which allows it to emit
            // inline script.
            if (!String.IsNullOrEmpty(script.Name) && String.IsNullOrEmpty(script.Path) &&
                (String.IsNullOrEmpty(script.Assembly) || Assembly.Load(script.Assembly) == typeof(ScriptManager).Assembly)) {
                if (!isComposite && _scripts.ContainsKey(script.Name)) {
                    RedirectScriptReference sr = new RedirectScriptReference(script.Name);
                    script.Path = sr.GetBaseUrl(ScriptManager.GetCurrent(Page));
                    script.ScriptMode = ScriptMode.Release;
                }
                else {
                    script.Assembly = typeof(ToolkitScriptManager).Assembly.FullName;
                }
            }
        }
#endif

        /// <summary>
        /// OnLoad override that runs only when serving the original page
        /// </summary>
        /// <param name="e">event args</param>
        protected override void OnLoad(EventArgs e)
        {
            // Initialize
            _disabledScriptReferences = new List<ScriptReference>();
            _uncombinableScriptReferences = new List<ScriptReference>();

            // Create a hidden field to track loaded scripts - load its contents if already present
            string hiddenFieldName = HiddenFieldName;
            string value = "";
            if (!IsInAsyncPostBack || (null == Page.Request.Form[hiddenFieldName]))
            {
                RegisterHiddenField(Page, hiddenFieldName, value);
                if (_combineScripts)
                {
                    RegisterStartupScript(Page, Page.GetType(), "ClearHiddenOnLoad",
                        string.Format(CultureInfo.InvariantCulture,
                            "(function() {{" +
                                "var fn = function() {{" +
                                    "$get(\"{0}\").value = '';" +
                                    "Sys.Application.remove_init(fn);" +
                                "}};" +
                                "Sys.Application.add_init(fn);" +
                            "}})();", QuoteString(hiddenFieldName), "")
                        , true);
                }
            }
            else
            {
                value = Page.Request.Form[hiddenFieldName];
            }

            // Get the list of already-loaded scripts from the page
            _scriptEntries = DeserializeScriptEntries(value, true);

            base.OnLoad(e);
        }

        protected override void OnResolveCompositeScriptReference(CompositeScriptReferenceEventArgs e)
        {
#if !NET4 && !NET45
            foreach (ScriptReference sr in e.CompositeScript.Scripts) {
                ApplyAssembly(sr, true);
            }
            base.OnResolveCompositeScriptReference(e);
#endif
        }

        /// <summary>
        /// OnResolveScriptReference override to track combinable scripts and update the script references
        /// </summary>
        /// <param name="e">event args</param>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Portability", "CA1903:UseOnlyApiFromTargetedFramework", MessageId = "System.Web.UI.ScriptReferenceBase")]
        protected override void OnResolveScriptReference(ScriptReferenceEventArgs e)
        {
#if !NET4 && !NET45
            ApplyAssembly(e.Script, false);
#endif
            base.OnResolveScriptReference(e);

            // If combining scripts and this is a candidate script
            if (_combineScripts && !String.IsNullOrEmpty(e.Script.Assembly) && !String.IsNullOrEmpty(e.Script.Name))
            {
                // Initialize
                ScriptReference scriptReference = e.Script;
                ScriptEntry scriptEntry = new ScriptEntry(scriptReference);

                if (IsScriptCombinable(scriptEntry))
                {
                    if (!_scriptEntries.Contains(scriptEntry))
                    {
                        // Haven't seen this script yet; add it to the list and invalidate the Url
                        _scriptEntries.Add(scriptEntry);
                        _combinedScriptUrl = null;
                    }

                    if (null == _combinedScriptUrl)
                    {
                        // Url is invalid; update it
                        _combinedScriptUrl = String.Format(CultureInfo.InvariantCulture, "{0}?{1}={2}&{3}={4}", ((null != _combineScriptsHandlerUrl) ? _combineScriptsHandlerUrl.ToString() : Page.Request.Path.Replace(" ", "%20")), HiddenFieldParamName, HiddenFieldName, CombinedScriptsParamName, HttpUtility.UrlEncode(SerializeScriptEntries(_scriptEntries, false)));
                    }

                    // Remove the script from the list and track it
                    scriptReference.Name = "";
                    scriptReference.Assembly = "";
                    _disabledScriptReferences.Add(scriptReference);

                    // Update the common (combined) Url for all tracked scripts
                    foreach (ScriptReference disabledScriptReference in _disabledScriptReferences)
                    {
                        disabledScriptReference.Path = _combinedScriptUrl;
                    }
                }
                else
                {
                    // See if we've already seen this uncombinable script reference
                    bool alreadySeen = false;
                    foreach (ScriptReference uncombinableScriptReference in _uncombinableScriptReferences)
                    {
                        if ((uncombinableScriptReference.Assembly == scriptReference.Assembly) && (uncombinableScriptReference.Name == scriptReference.Name))
                        {
                            alreadySeen = true;
                        }
                    }
                    if (!alreadySeen)
                    {
                        // Haven't seen the script reference yet, so we need to stop building the current combined script
                        // file and let the uncombinable script reference be output so as not to alter the ordering of
                        // scripts (which may have dependencies). Update our state so we'll start building a new combined
                        // script file with the next combinable script.
                        // Note: _combinedScriptUrl was initially cleared here. While that's correct behavior (and was
                        // released without issue), not clearing it means that we can omit an unnecessary <script> tag
                        // for the scenario "CombinableA, Uncombinable?, CombinableA, Uncombinable?" because the second
                        // instance of CombinableA will reuse the URL from the first (vs. an empty one) and ScriptManager
                        // will detect and omit the redundant URL.
                        _uncombinableScriptReferences.Add(scriptReference);
                        _disabledScriptReferences.Clear();
                        foreach (ScriptEntry se in _scriptEntries)
                        {
                            se.Loaded = true;
                        }
                    }
                }
            }
        }

        /// <summary>
        /// OnInit override that runs only when serving the combined script file
        /// </summary>
        /// <param name="e">event args</param>
        protected override void OnInit(EventArgs e)
        {
            if (!DesignMode && (null != Context) && OutputCombinedScriptFile(Context))
            {
                // This was a combined script request that was satisfied; end all processing now
                Page.Response.End();
            }
            base.OnInit(e);
        }

        /// <summary>
        /// Outputs the combined script file requested by the HttpRequest to the HttpResponse
        /// </summary>
        /// <param name="context">HttpContext for the transaction</param>
        /// <returns>true if the script file was output</returns>
        public static bool OutputCombinedScriptFile(HttpContext context)
        {
            // Initialize
            bool output = false;
            HttpRequest request = context.Request;
            string hiddenFieldName;
            string combinedScripts;
            if (request.RequestType.ToUpper() == "GET")
            {
                hiddenFieldName = request.Params[HiddenFieldParamName];
                combinedScripts = request.Params[CombinedScriptsParamName];
            }
            else
            {
#if NET45
                hiddenFieldName = request.Form[HiddenFieldParamName];
                combinedScripts = request.Form[CombinedScriptsParamName];
#else
            hiddenFieldName = request.Params[HiddenFieldParamName];
            combinedScripts = request.Params[CombinedScriptsParamName];
#endif
            }

            if (!string.IsNullOrEmpty(hiddenFieldName) && !string.IsNullOrEmpty(combinedScripts))
            {
                // This is a request for a combined script file
                HttpResponse response = context.Response;
                response.ContentType = "application/x-javascript";

                // Set the same (~forever) caching rules that ScriptResource.axd uses
                HttpCachePolicy cache = response.Cache;
                cache.SetCacheability(HttpCacheability.Public);
                cache.VaryByParams[HiddenFieldParamName] = true;
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
                        else if ("DEFLATE" == acceptEncoding)
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
                    List<ScriptEntry> scriptEntries = DeserializeScriptEntries(HttpUtility.UrlDecode(combinedScripts), false);

                    // Write the scripts
                    WriteScripts(scriptEntries, outputWriter);

                    // Write the ASP.NET AJAX script notification code
                    outputWriter.WriteLine("if(typeof(Sys)!=='undefined')Sys.Application.notifyScriptLoaded();");

                    // Write a handler to run on page load and update the hidden field tracking scripts loaded in the browser
                    outputWriter.WriteLine(string.Format(CultureInfo.InvariantCulture,
                        "(function() {{" +
                            "var fn = function() {{" +
                                "$get(\"{0}\").value += '{1}';" +
                                "Sys.Application.remove_load(fn);" +
                            "}};" +
                            "Sys.Application.add_load(fn);" +
                        "}})();",
                            QuoteString(hiddenFieldName),
                            SerializeScriptEntries(scriptEntries, true)));
                }

                output = true;
            }
            return output;
        }

        /// <summary>
        /// Writes scripts (including localized script resources) to the specified stream
        /// </summary>
        /// <param name="scriptEntries">list of scripts to write</param>
        /// <param name="outputWriter">writer for output stream</param>
        private static void WriteScripts(List<ScriptEntry> scriptEntries, TextWriter outputWriter)
        {
            foreach (ScriptEntry scriptEntry in scriptEntries)
            {
                if (!scriptEntry.Loaded)
                {
                    if (!IsScriptCombinable(scriptEntry))
                    {
                        throw new NotSupportedException(string.Format(CultureInfo.CurrentCulture, "Combined script request includes uncombinable script \"{0}\".", scriptEntry.Name));
                    }

                    // This script hasn't been loaded by the browser, so add it to the combined script file
                    outputWriter.Write("//START ");
                    outputWriter.WriteLine(scriptEntry.Name);
                    string script = scriptEntry.GetScript();
                    if (WebResourceRegex.IsMatch(script))
                    {
                        // This script uses script substitution which isn't supported yet, so throw an exception since it's too late to fix
                        throw new NotSupportedException(string.Format(CultureInfo.CurrentCulture, "ToolkitScriptManager does not support <%= WebResource/ScriptResource(...) %> substitution as used by script file \"{0}\".", scriptEntry.Name));
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
                        foreach (ScriptResourceAttribute scriptResourceAttribute in GetScriptResourceAttributes(scriptAssembly))
                        {
                            if (scriptResourceAttribute.ScriptName == scriptEntry.Name)
                            {
#pragma warning disable 0618 // obsolete members of ScriptResourceAttribute are used but necessary in the 3.5 build
                                // Found a matching script resource; write it out
                                outputWriter.WriteLine(string.Format(CultureInfo.InvariantCulture, "{0}={{", scriptResourceAttribute.TypeName));

                                // Get the script resource name (without the trailing ".resources")
                                string scriptResourceName = scriptResourceAttribute.ScriptResourceName;
                                if (scriptResourceName.EndsWith(".resources", StringComparison.OrdinalIgnoreCase))
                                {
                                    scriptResourceName = scriptResourceName.Substring(0, scriptResourceName.Length - 10);
                                }
#pragma warning restore 0618

                                // Load a ResourceManager/ResourceSet and walk through the list to output them all
                                System.Resources.ResourceManager resourceManager = new System.Resources.ResourceManager(scriptResourceName, scriptAssembly);
                                using (System.Resources.ResourceSet resourceSet = resourceManager.GetResourceSet(CultureInfo.InvariantCulture, true, true))
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
                                        outputWriter.Write(string.Format(CultureInfo.InvariantCulture, "\"{0}\":\"{1}\"", QuoteString(name), QuoteString(value)));
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
                    outputWriter.Write("//END ");
                    outputWriter.WriteLine(scriptEntry.Name);
                }

                // This script is now (or will be soon) loaded by the browser
                scriptEntry.Loaded = true;
            }
        }

        /// <summary>
        /// Checks if the specified ScriptEntry is combinable
        /// </summary>
        /// <param name="scriptEntry">ScriptEntry to check</param>
        /// <returns>true iff combinable</returns>
        private static bool IsScriptCombinable(ScriptEntry scriptEntry)
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
                            combinable = false;
                            break;
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
                // Don't allow it to be combined if not
                combinable &= correspondingWebResourceAttribute;
            }
            return combinable;
        }

        /// <summary>
        /// Serialize a list of ScriptEntries
        /// </summary>
        /// <remarks>
        /// Serialized list looks like:
        /// ;Assembly1.dll Version=1:Culture:MVID1:ScriptName1Hash:ScriptName2Hash;Assembly2.dll Version=2:Culture:MVID1:ScriptName3Hash
        /// </remarks>
        /// <param name="scriptEntries">list of scripts to serialize</param>
        /// <param name="allScripts">true iff all scripts should be serialized; otherwise only not loaded ones</param>
        /// <returns>serialized list</returns>
        private static string SerializeScriptEntries(List<ScriptEntry> scriptEntries, bool allScripts)
        {
            // Serialized string must never be null (';' is safe)
            StringBuilder serializedScriptEntries = new StringBuilder(";");
            string currentAssembly = null;
            foreach (ScriptEntry scriptEntry in scriptEntries)
            {
                if (allScripts || !scriptEntry.Loaded)
                {
                    // Serializing this script name
                    if (currentAssembly != scriptEntry.Assembly)
                    {
                        // It's a different assembly, so serialize the assembly name and Culture.MVID value first
                        serializedScriptEntries.Append(";");
                        serializedScriptEntries.Append(scriptEntry.Assembly);
                        serializedScriptEntries.Append(":");
                        serializedScriptEntries.Append(CultureInfo.CurrentUICulture.IetfLanguageTag);
                        serializedScriptEntries.Append(":");
                        serializedScriptEntries.Append(scriptEntry.LoadAssembly().ManifestModule.ModuleVersionId);
                        currentAssembly = scriptEntry.Assembly;
                    }
                    // Serialize the script name hash
                    serializedScriptEntries.Append(":");
                    //49d880ab
                    serializedScriptEntries.Append(scriptEntry.Name.GetHashCode().ToString("x", CultureInfo.InvariantCulture));
                }
            }
            return serializedScriptEntries.ToString();
        }

        /// <summary>
        /// Deserialize a list of ScriptEntries
        /// </summary>
        /// <remarks>
        /// Serialized list looks like:
        /// ;Assembly1.dll Version=1:Culture:MVID1:ScriptName1Hash:ScriptName2Hash;Assembly2.dll Version=2:Culture:MVID1:ScriptName3Hash
        /// </remarks>
        /// <param name="serializedScriptEntries">serialized list</param>
        /// <param name="loaded">loaded state of the serialized scripts</param>
        /// <returns>list of scripts</returns>
        private static List<ScriptEntry> DeserializeScriptEntries(string serializedScriptEntries, bool loaded)
        {
            List<ScriptEntry> scriptEntries = new List<ScriptEntry>();
            foreach (string assemblyScripts in serializedScriptEntries.Split(';'))
            {
                // Deserialize this assembly's scripts
                string assembly = null;
                string culture = null;
                string mvid = null;
                Dictionary<string, string> resourceNameHashToResourceName = null;
                foreach (string script in assemblyScripts.Split(':'))
                {
                    if (null == assembly)
                    {
                        // Haven't got the assembly name yet; this is it
                        assembly = script;
                    }
                    else if (null == culture)
                    {
                        // Haven't got the culture value yet; this is it
                        culture = script;
                    }
                    else if (null == mvid)
                    {
                        // Haven't got the MVID value yet; this is it
                        mvid = script;
                    }
                    else
                    {
                        if (null == resourceNameHashToResourceName)
                        {
                            // Populate the "resource name hash to resource name" dictionary for this assembly
                            resourceNameHashToResourceName = new Dictionary<string, string>();
                            foreach (string resourceName in (new ScriptEntry(assembly, null, null)).LoadAssembly().GetManifestResourceNames())
                            {
                                string hashCode = resourceName.GetHashCode().ToString("x", CultureInfo.InvariantCulture);
                                if (resourceNameHashToResourceName.ContainsKey(hashCode))
                                {
                                    // Hash collisions are exceedingly rare, but possible
                                    throw new NotSupportedException(string.Format(CultureInfo.CurrentCulture, "Assembly \"{0}\" contains multiple scripts with hash code \"{1}\".", assembly, hashCode));
                                }
                                resourceNameHashToResourceName[hashCode] = resourceName;
                            }
                        }
                        // Map the script hash to a script name
                        string scriptName;
                        if (!resourceNameHashToResourceName.TryGetValue(script, out scriptName))
                        {
                            throw new NotSupportedException(string.Format(CultureInfo.CurrentCulture, "Assembly \"{0}\" does not contain a script with hash code \"{1}\".", assembly, script));
                        }
                        // Create a ScriptEntry to represent the script
                        ScriptEntry scriptEntry = new ScriptEntry(assembly, scriptName, culture);
                        scriptEntry.Loaded = loaded;
                        scriptEntries.Add(scriptEntry);
                    }
                }
            }
            return scriptEntries;
        }

        /// <summary>
        /// Name of the hidden field used to store loaded scripts
        /// </summary>
        protected string HiddenFieldName
        {
            get { return ClientID + "_HiddenField"; }
        }

        /// <summary>
        /// Represents a script reference - including tracking its loaded state in the client browser
        /// </summary>
        private class ScriptEntry
        {
            /// <summary>
            /// Containing Assembly
            /// </summary>
            public readonly string Assembly;

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

            /// <summary>
            /// Constructor
            /// </summary>
            /// <param name="assembly">containing assembly</param>
            /// <param name="name">script name</param>
            /// <param name="culture">culture for rendering the script</param>
            public ScriptEntry(string assembly, string name, string culture)
            {
                Assembly = assembly;
                Name = name;
                Culture = culture;
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
                using (Stream stream = LoadAssembly().GetManifestResourceStream(Name))
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
                    _loadedAssembly = System.Reflection.Assembly.Load(Assembly);
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
                return ((other.Assembly == Assembly) && (other.Name == Name));
            }

            /// <summary>
            /// GetHashCode override corresponding to the Equals override above
            /// </summary>
            /// <returns>hash code for the object</returns>
            public override int GetHashCode()
            {
                return Assembly.GetHashCode() ^ Name.GetHashCode();
            }
        }

        /// <summary>
        /// Callable implementation of System.Web.Script.Serialization.JavaScriptString.QuoteString
        /// </summary>
        /// <param name="value">value to quote</param>
        /// <returns>quoted string</returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity", Justification = "Callable implementation of System.Web.Script.Serialization.JavaScriptString.QuoteString")]
        protected static string QuoteString(string value)
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
        protected static void AppendCharAsUnicode(StringBuilder builder, char c)
        {
            builder.Append(@"\u");
            builder.AppendFormat(CultureInfo.InvariantCulture, "{0:x4}", new object[] { (int)c });
        }

        private class RedirectScriptReference : ScriptReference
        {
            public RedirectScriptReference(string name)
            {
                Name = name;
                Assembly = typeof(ToolkitScriptManager).Assembly.FullName;
            }

            public string GetBaseUrl(ScriptManager sm)
            {
                return base.GetUrl(sm, true);
            }
        }

    }
}
