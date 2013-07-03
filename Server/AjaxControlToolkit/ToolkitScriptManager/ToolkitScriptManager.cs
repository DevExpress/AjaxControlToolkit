using System;
using System.Configuration;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI;

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
        /// <summary>
        /// Request param name for the serialized combined scripts string
        /// </summary>
        internal const string CombinedScriptsParamName = "_TSM_CombinedScripts_";

        /// <summary>
        /// Request param name for the hidden field name
        /// </summary>
        internal const string HiddenFieldParamName = "_TSM_HiddenField_";

        /// <summary>
        /// Regular expression for detecting WebResource/ScriptResource substitutions in script files
        /// </summary>
        protected static readonly Regex WebResourceRegex = ToolkitScriptManagerCombiner.WebResourceRegex;

        /// <summary>
        /// Backing field for Combiner. Please don't use this for operational, use Combiner instead.
        /// </summary>
        private static ToolkitScriptManagerCombiner _combiner;

        private string _controlsConfig;
        private bool _combineScripts = true;
        private Uri _combineScriptsHandlerUrl;
        private string _combinedScriptUrl;

        /// <summary>
        /// Initialize and get ToolkitScriptManagerCombiner
        /// </summary>
        private static ToolkitScriptManagerCombiner Combiner
        {
            get
            {
                if (_combiner == null)
                {
                    // Determine is user uses custom cache provider
                    IAjaxControlToolkitCacheProvider cacheProvider = null;
                    var customCacheProviderSetting = ConfigurationManager.AppSettings["AjaxControlToolkitCacheProvider"];
                    if (customCacheProviderSetting != null)
                    {
                        try
                        {
                            var assemblyInfo = customCacheProviderSetting.Split(new[] { "," },
                                                                                      StringSplitOptions.RemoveEmptyEntries);
                            cacheProvider =
                                (IAjaxControlToolkitCacheProvider)
                                Activator.CreateInstance(assemblyInfo[0], assemblyInfo[1]).Unwrap();
                        }
                        catch (Exception e)
                        {
                            throw new Exception("Failed to activate custom cache provider " +
                                                    customCacheProviderSetting, e);
                        }
                    }

                    // Use default cache provider if custom cache provider not found
                    if (cacheProvider == null)
                        cacheProvider = new AjaxControlToolkitCacheProvider();

                    // Initialize ToolkitScriptManagerCombiner
                    _combiner = new ToolkitScriptManagerCombiner(cacheProvider);
                }

                return _combiner;
            }
        }

        /// <summary>
        /// Specifies whether or not multiple script references should be combined into a single file
        /// </summary>
        public bool CombineScripts
        {
            get { return _combineScripts; }
            set { _combineScripts = value; }
        }

        /// <summary>
        /// Optionally specifies the URL of an HTTP handler for generating the combined script files.
        /// Property CombineScripts must set to true to make this works.
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

        /// <summary>
        /// Path of AjaxControlToolkit config file.
        /// </summary>
        public string ControlsConfig
        {
            get { return _controlsConfig; }
            set { _controlsConfig = value; }
        }

        /// <summary>
        /// OnInit override that runs only when serving the combined script file
        /// </summary>
        /// <param name="e">event args</param>
        protected override void OnInit(EventArgs e)
        {
            if (!DesignMode && (null != Context) && Combiner.OutputCombinedScriptFile(Context, _controlsConfig))
            {
                // This was a combined script request that was satisfied; end all processing now
                Page.Response.End();
            }
            base.OnInit(e);
        }

        /// <summary>
        /// OnLoad override that runs only when serving the original page
        /// </summary>
        /// <param name="e">event args</param>
        protected override void OnLoad(EventArgs e)
        {
            if (!IsInAsyncPostBack)
            {
                if (_combineScripts && ScriptMode != ScriptMode.Debug)
                {
                    var contentHash = Combiner.GetContentHash(_controlsConfig);
                    var configParam = !String.IsNullOrEmpty(_controlsConfig)
                                          ? "Custom_" + ClientID
                                          : "Default";

                    Page.ClientScript.RegisterHiddenField(HiddenFieldParamName, configParam+";"+contentHash);
                    _combinedScriptUrl = BuildCombinedScriptUrl(configParam, contentHash);
                    Scripts.Add(new ScriptReference(_combinedScriptUrl));
                }
                else
                {
                    var cache = Page.Response.Cache;
                    
                    // Send a no-cache, no-store header
                    cache.SetCacheability(HttpCacheability.NoCache);
                    cache.SetNoStore();

                    var scriptReferences = Combiner.GetScriptReferences(_controlsConfig);
                    foreach (var scriptRef in scriptReferences)
                    {
                        Scripts.Add(scriptRef);
                    }
                }
            }

            base.OnLoad(e);
        }

        private string BuildCombinedScriptUrl(string configParam, string contentHash)
        {
            return String.Format(CultureInfo.InvariantCulture,
                                               "{0}?{1}={2}&{3}={4}",
                                               ((null != _combineScriptsHandlerUrl)
                                                    ? Page.ResolveUrl(_combineScriptsHandlerUrl.ToString())
                                                    : Page.Request.Path.Replace(" ", "%20")),
                                               CombinedScriptsParamName, configParam,
                                               ToolkitScriptManagerCombiner.CacheBustParamName, contentHash);
        }

        /// <summary>
        /// Outputs the combined script file requested by the HttpRequest to the HttpResponse.
        /// If AjaxControlToolkit.config is exists on root folder of web, then combined scripts 
        /// are determined from there.
        /// </summary>
        /// <param name="context">HttpContext for the transaction</param>
        public static bool OutputCombinedScriptFile(HttpContext context)
        {
            return Combiner.OutputCombinedScriptFile(context, null);
        }

        /// <summary>
        /// Callable implementation of System.Web.Script.Serialization.JavaScriptString.QuoteString
        /// </summary>
        /// <param name="value">value to quote</param>
        /// <returns>quoted string</returns>
        [SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity",
            Justification = "Callable implementation of System.Web.Script.Serialization.JavaScriptString.QuoteString")]
        protected static string QuoteString(string value)
        {
            return ToolkitScriptManagerCombiner.QuoteString(value);
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
        protected static void AppendCharAsUnicode(StringBuilder builder, char c)
        {
            ToolkitScriptManagerCombiner.AppendCharAsUnicode(builder, c);
        }


        protected override void OnResolveScriptReference(ScriptReferenceEventArgs e)
        {
            base.OnResolveScriptReference(e);
            if (_combineScripts && ScriptMode != ScriptMode.Debug && !String.IsNullOrEmpty(e.Script.Assembly)
                && !String.IsNullOrEmpty(e.Script.Name) && Combiner.IsScriptRegistered(e.Script))
            {
                if (IsInAsyncPostBack && String.IsNullOrEmpty(_combinedScriptUrl))
                {
                    var hiddenParam = Page.Request.Form[HiddenFieldParamName];
                    if(String.IsNullOrEmpty(hiddenParam))
                        throw new Exception(HiddenFieldParamName + " is empty");

                    var configParam = hiddenParam.Split(new[] {";"}, StringSplitOptions.RemoveEmptyEntries)[0];
                    var contentHash = hiddenParam.Substring(configParam.Length + 1);
                    _combinedScriptUrl = BuildCombinedScriptUrl(configParam, contentHash);
                }

                e.Script.Name = "";
                e.Script.Assembly = "";
                e.Script.Path = _combinedScriptUrl;
            }
        }
    }
}
