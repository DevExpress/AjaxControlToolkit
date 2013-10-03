using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Linq;
using System.Web.UI.WebControls;

namespace AjaxControlToolkit {
    /// <summary>
    /// ScriptManager derived class to add the ability to combine multiple
    /// smaller scripts into one larger one as a way to reduce the number
    /// of files the client must download
    /// </summary>
    [Themeable(true)]
    public class ToolkitScriptManager : ScriptManager {
        
        #region Constants

        /// <summary>
        /// Request param name for the serialized combined scripts string
        /// </summary>
        public const string CombinedScriptsParamName = "_TSM_CombinedScripts_";

        /// <summary>
        /// Request param name for the control bundles
        /// </summary>
        public const string ControlBundleParamName = "_TSM_Bundles_";

        /// <summary>
        /// Request param name for the script version
        /// </summary>
        public const string CacheBustParamName = "v";

        /// <summary>
        /// Request param name for the CDN enabled script
        /// </summary>
        public const string EnableCdnParamName = "cdn";

        /// <summary>
        /// Request param name for the hidden field name
        /// </summary>
        public const string HiddenFieldParamName = "_TSM_HiddenField_";

        /// <summary>
        /// Delimiter string to separate bundle names in query string
        /// </summary>
        internal const string QueryStringBundleDelimiter = ";";

        #endregion

        private bool _combineScripts = true;
        private Uri _combineScriptsHandlerUrl;
        private string _combinedScriptUrl;
        private List<ControlBundle> _controlBundles;
        private readonly ToolkitScriptManagerCombiner _combiner;

#if !NET40 && !NET45
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
#endif


        /// <summary>
        /// Constructor
        /// </summary>
        public ToolkitScriptManager() {
            _combiner = new ToolkitScriptManagerCombiner(
                new ToolkitScriptManagerConfig(new AjaxControlToolkitCacheProvider()),
                new ToolkitScriptManagerHelper());
        }

        /// <summary>
        /// Specifies whether or not multiple script references should be combined into a single file
        /// </summary>
        [DefaultValue(true)]
        public bool CombineScripts {
            get { return _combineScripts; }
            set { _combineScripts = value; }
        }

        /// <summary>
        /// Optionally specifies the URL of an HTTP handler for generating the combined script files.
        /// Property CombineScripts must set to true to make this works.
        /// This property will be overridden if AjaxControlToolkit.CombineScriptsHandler http handler registered.
        /// </summary>
        /// <remarks>
        /// The handler's ProcessRequest method should call directly through to ToolkitScriptManager.OutputCombinedScriptFile
        /// </remarks>
        [Obsolete("Please register AjaxControlToolkit.CombineScriptsHandler http handler instead.")]
        [UrlProperty]
        public Uri CombineScriptsHandlerUrl {
            get { return _combineScriptsHandlerUrl; }
            set { _combineScriptsHandlerUrl = value; }
        }

        /// <summary>
        /// Selected control bundles to be used by this ToolkitScriptManager.
        /// You have to set control bundles in AjaxControlToolkit.config to make this works.
        /// If this property is not set then default controls in control bundles will be used.
        /// </summary>
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Content)]
        [PersistenceMode(PersistenceMode.InnerProperty)]
        public List<ControlBundle> ControlBundles {
            get {
                this.EnsureChildControls();
                if (_controlBundles == null)
                    _controlBundles = new List<ControlBundle>();
                return _controlBundles;
            }
        }


        /// <summary>
        /// OnInit override that initialize CombineScriptsHandler url and serving the combined script file.
        /// </summary>
        /// <param name="e">event args</param>
        protected override void OnInit(EventArgs e) {

            // Initialize the URL of CombineScriptsHandler http handler from web.config
            var config =
                ConfigurationManager.GetSection("system.web/httpHandlers") as
                System.Web.Configuration.HttpHandlersSection ??
                ConfigurationManager.GetSection("system.webServer/handlers") as
                System.Web.Configuration.HttpHandlersSection;

            if (config != null && config.Handlers != null) {
                var handlers = config.Handlers.OfType<System.Web.Configuration.HttpHandlerAction>();
                var combineScriptsHandlerConfig = handlers.FirstOrDefault(
                    c => {
                        var type = c.Type.Split(new[] {","}, StringSplitOptions.RemoveEmptyEntries);
                        return type[0].Trim() == "AjaxControlToolkit.CombineScriptsHandler" &&
                               type[1].Trim() == "AjaxControlToolkit";
                    });

                if (combineScriptsHandlerConfig != null) {
                    var uriBase = new Uri(new Uri(this.Page.Request.Url.GetLeftPart(UriPartial.Authority)),
                                          Page.ResolveUrl("~/"));
                    _combineScriptsHandlerUrl = new Uri(uriBase, combineScriptsHandlerConfig.Path);
                }
            }

            // Querying http request, determine if request is for serving the combined script file then just end the response of Page.
            if (!DesignMode && (null != Context) && _combiner.OutputCombinedScriptFile(new HttpContextWrapper(Context))) {
                // This was a combined script request that was satisfied; end all processing now
                Page.Response.End();
            }
            base.OnInit(e);
        }

        /// <summary>
        /// OnLoad override that runs only when serving the original page
        /// </summary>
        /// <param name="e">event args</param>
        protected override void OnLoad(EventArgs e) {

            if (!IsInAsyncPostBack) {

                // Determine custom bundles
                var bundles = (_controlBundles != null) ? _controlBundles.Select(c => c.Name).ToArray() : null;

                // Combine & minify only work when not in debug mode and CombineScripts property set to true
                var doCombineAndMinify = _combineScripts && !IsDebugMode;

                LoadScriptReferences(new HttpContextWrapper(Context), bundles, doCombineAndMinify);

                if (!doCombineAndMinify) {
                    var cache = Page.Response.Cache;

                    // Send a no-cache, no-store header
                    cache.SetCacheability(HttpCacheability.NoCache);
                    cache.SetNoStore();
                }
            }

            base.OnLoad(e);
        }

        /// <summary>
        /// Load script references based on bundles to memorize it or/and to be rendered on page.
        /// If forCombineAndMinify parameter set to true then loaded combinable scripts will never be rendered to the Page, it will stay in memory instead except rest of un-combinable scripts.
        /// This API supports the AjaxControlToolkit infrastructure and is not intended to be used directly from your code.
        /// </summary>
        /// <param name="context">Current HttpContext</param>
        /// <param name="bundles">Name of bundles</param>
        /// <param name="forCombineAndMinify">Indicate that loaded scripts will be combined and minified. 
        /// If set to true then loaded combinable scripts will never be rendered to the Page, it will stay in memory instead. Except of rest of un-combinable scripts that will be rendered to the Page.</param>
        public void LoadScriptReferences(HttpContextBase context, string[] bundles, bool forCombineAndMinify) {

            // Load script references in memory
            var scriptReferences = _combiner.LoadScriptReferences(context, bundles);

            if (forCombineAndMinify) {

                bool enableCdn = false;
#if NET45 || NET40
                enableCdn = EnableCdn;
#endif

                // Build unique content hash
                var contentHash = _combiner.GetCombinedScriptContentHash(context, bundles, enableCdn);

                // Store content hash in hidden field, we'll use it in resolving script reference when async callback occurred
                Page.ClientScript.RegisterHiddenField(HiddenFieldParamName, contentHash);

                // Add un-combined scripts that referenced to its CDN to the Page
                var excludedCdnScripts = _combiner.GetExcludedScripts(true);
                if (excludedCdnScripts != null) {
                    foreach (var scriptReference in excludedCdnScripts) {
                        Scripts.Add(scriptReference);
                        _combiner.RegisterScriptReference(scriptReference);
                    }
                }

                // Add combined script URL to the Page
                _combinedScriptUrl = BuildCombinedScriptUrl(contentHash);
                Scripts.Add(new ScriptReference(_combinedScriptUrl));

                // Add another un-combined scripts to the Page
                var excludedScripts = _combiner.GetExcludedScripts(false);
                if (excludedScripts != null) {
                    foreach (var scriptReference in excludedScripts) {
                        Scripts.Add(scriptReference);
                        _combiner.RegisterScriptReference(scriptReference);
                    }
                }
            }
            else {
                // Load all requestred scripts controls in normal way as script references
                foreach (var scriptRef in scriptReferences) {
                    Scripts.Add(scriptRef);
                }
            }
        }

        /// <summary>
        /// Overridden OnPreRender method. Validating all script references when page about to render.
        /// </summary>
        /// <param name="e"></param>
        protected override void OnPreRender(EventArgs e) {
            base.OnPreRender(e);
            if (!IsInAsyncPostBack)
                ValidateScriptReferences();
        }

        /// <summary>
        /// Ensure all needed scripts by registered control are registered properly in memory.
        /// This API supports the AjaxControlToolkit infrastructure and is not intended to be used directly from your code.
        /// </summary>
        public void ValidateScriptReferences() {

            // validation works for combine and minification only
            if (!_combineScripts || IsDebugMode)
                return;

            var controlTypesInPage = new List<Type>();
            GetRegisteredControlTypes(Page.Controls, controlTypesInPage);
            foreach (var controlType in controlTypesInPage) {
                var scriptReferences = ScriptObjectBuilder.GetScriptReferences(controlType);
                foreach (var scriptReference in scriptReferences) {
                    if (!_combiner.IsScriptRegistered(scriptReference))
                        throw new Exception("Could not load control " + controlType.FullName
                                            + ". The script reference(s) of this control was not loaded correctly. "
                                            +
                                            "If AjaxControlToolkit.config is used, probably this control is not registered properly.");
                }
            }
        }

        /// <summary>
        /// Recursively find all WebControls type registered in Page
        /// </summary>
        /// <param name="controls">Control collection in Page</param>
        /// <param name="results">Distinct results</param>
        private void GetRegisteredControlTypes(ControlCollection controls, ICollection<Type> results) {
            foreach (Control control in controls) {
                var controlType = control.GetType();

                if ((control is WebControl || control is ExtenderControl) && !results.Contains(controlType))
                    results.Add(controlType);

                if (control.HasControls())
                    GetRegisteredControlTypes(control.Controls, results);
            }
        }

        /// <summary>
        /// Build combined script URL. When _combineScriptsHandlerUrl is empty, then current Page address is used.
        /// </summary>
        /// <param name="contentHash"></param>
        /// <returns></returns>
        private string BuildCombinedScriptUrl(string contentHash) {
            var bundleControlsParam = "";
            if (_controlBundles != null && _controlBundles.Count > 0)
                bundleControlsParam = string.Join(QueryStringBundleDelimiter,
                                                  _controlBundles.Select(x => x.Name).ToArray());

            bool enableCdn = false;
#if NET45 || NET40
            enableCdn = EnableCdn;
#endif

            return String.Format(CultureInfo.InvariantCulture,
                                 "{0}?{1}={2}&{3}={4}&{5}={6}&{7}={8}",
                                 null != _combineScriptsHandlerUrl
                                     ? Page.ResolveUrl(_combineScriptsHandlerUrl.ToString())
                                     : Page.Request.Path.Replace(" ", "%20"),
                                 CombinedScriptsParamName, _combineScripts,
                                 CacheBustParamName, contentHash,
                                 ControlBundleParamName, bundleControlsParam,
                                 EnableCdnParamName, enableCdn);
        }

        /// <summary>
        /// Outputs the combined script file requested by the HttpRequest to the HttpResponse.
        /// If AjaxControlToolkit.config is exists on root folder of web, then combined scripts 
        /// are determined from there.
        /// </summary>
        /// <param name="context">HttpContext for the transaction</param>
        public static bool OutputCombinedScriptFile(HttpContext context) {
            return new ToolkitScriptManagerCombiner(
                new ToolkitScriptManagerConfig(new AjaxControlToolkitCacheProvider()),
                new ToolkitScriptManagerHelper())
                .OutputCombinedScriptFile(new HttpContextWrapper(context));
        }

        /// <summary>
        /// Callable implementation of System.Web.Script.Serialization.JavaScriptString.QuoteString
        /// </summary>
        /// <param name="value">value to quote</param>
        /// <returns>quoted string</returns>
        [SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity",
            Justification = "Callable implementation of System.Web.Script.Serialization.JavaScriptString.QuoteString")]
        protected static string QuoteString(string value) {
            return ToolkitScriptManagerHelper.QuoteString(value);
        }

        /// <summary>
        /// Callable implementation of System.Web.Script.Serialization.JavaScriptString.AppendCharAsUnicode
        /// </summary>
        /// <param name="builder">string builder</param>
        /// <param name="c">character to append</param>
        [SuppressMessage("Microsoft.Design", "CA1062:ValidateArgumentsOfPublicMethods",
            Justification =
                "Callable implementation of System.Web.Script.Serialization.JavaScriptString.AppendCharAsUnicode")]
        [SuppressMessage("Microsoft.Naming",
            "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "c",
            Justification =
                "Callable implementation of System.Web.Script.Serialization.JavaScriptString.AppendCharAsUnicode")]
        protected static void AppendCharAsUnicode(StringBuilder builder, char c) {
            ToolkitScriptManagerHelper.AppendCharAsUnicode(builder, c);
        }


        protected override void OnResolveCompositeScriptReference(CompositeScriptReferenceEventArgs e)
        {
#if !NET40 && !NET45            
            foreach (ScriptReference sr in e.CompositeScript.Scripts) {
                ApplyAssembly(sr, true);
            }
            base.OnResolveCompositeScriptReference(e);
#endif
        }

        /// <summary>
        /// On async post back, control carries out the script references information that needed to be added to the Page. 
        /// In this overridden method, script will be determined whether it's already combined or not. 
        /// If it's already combined then we just need to change the pointer of script reference to combined script address, 
        /// so there will be no redundant scripts added on a Page.
        /// </summary>
        /// <param name="e"></param>
        protected override void OnResolveScriptReference(ScriptReferenceEventArgs e)
        {

#if !NET40 && !NET45
            ApplyAssembly(e.Script, false);
#endif
            base.OnResolveScriptReference(e);

            bool enableCdn = false;
#if NET45 || NET40
            enableCdn = EnableCdn;
#endif


            if (_combineScripts && !IsDebugMode && !String.IsNullOrEmpty(e.Script.Assembly)
                && !String.IsNullOrEmpty(e.Script.Name) && _combiner.IsScriptRegistered(e.Script)
                && _combiner.IsScriptCombinable(e.Script, enableCdn)) {

                // Verify combined script URL. When async postback occurred, the _combinedScriptUrl is lost,
                // we need to restore it from posted hidden field
                if (IsInAsyncPostBack && String.IsNullOrEmpty(_combinedScriptUrl)) {
                    var contentHash = Page.Request.Form[HiddenFieldParamName];
                    if (String.IsNullOrEmpty(contentHash))
                        throw new Exception(HiddenFieldParamName + " is empty");

                    _combinedScriptUrl = BuildCombinedScriptUrl(contentHash);
                }

                // Change script reference address to combined script URL
                if (!string.IsNullOrEmpty(_combinedScriptUrl)) {
                    e.Script.Name = "";
                    e.Script.Assembly = "";
                    e.Script.Path = _combinedScriptUrl;
                }
            }
        }

        private bool IsDebugMode {
            get {
                return IsDebuggingEnabled;
            }
        }
    }
}
