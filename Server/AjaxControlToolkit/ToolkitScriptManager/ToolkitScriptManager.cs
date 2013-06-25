using System;
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
        /// Regular expression for detecting WebResource/ScriptResource substitutions in script files
        /// </summary>
        protected static readonly Regex WebResourceRegex = ToolkitScriptManagerCombiner.WebResourceRegex;

        private static readonly ToolkitScriptManagerCombiner Combiner = new ToolkitScriptManagerCombiner();

        private string _controlsConfig;
        private bool _combineScripts = true;
        private Uri _combineScriptsHandlerUrl;


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
            if (!DesignMode && (null != Context) && OutputCombinedScriptFile(Context, _controlsConfig))
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
                if (_combineScripts)
                {
                    var configParam = (!string.IsNullOrEmpty(_controlsConfig)
                                          ? "Custom_" + ClientID
                                          : "Default") + ";" + ScriptMode.ToString();
                    var combinedScriptUrl = String.Format(CultureInfo.InvariantCulture, 
                        "{0}?{1}={2}",
                        ((null != _combineScriptsHandlerUrl) ? Page.ResolveUrl(_combineScriptsHandlerUrl.ToString()) : Page.Request.Path.Replace(" ", "%20")),
                        ToolkitScriptManagerCombiner.CombinedScriptsParamName, configParam);
                    Scripts.Add(new ScriptReference(combinedScriptUrl));
                }
                else
                {
                    var scriptReferences = Combiner.GetScriptReferences(_controlsConfig);
                    foreach (var scriptRef in scriptReferences)
                    {
                        Scripts.Add(scriptRef);
                    }
                }
            }

            base.OnLoad(e);
        }

        /// <summary>
        /// Outputs the combined script file requested by the HttpRequest to the HttpResponse.
        /// If AjaxControlToolkit.config is exists on root folder of web, then combined scripts 
        /// are determined from there.
        /// </summary>
        /// <param name="context">HttpContext for the transaction</param>
        public static bool OutputCombinedScriptFile(HttpContext context)
        {
            return OutputCombinedScriptFile(context, null);
        }

        /// <summary>
        /// Outputs the combined script file requested by the HttpRequest to the HttpResponse
        /// Combined scripts determined from settings on configuration file at configFilePath.
        /// </summary>
        /// <param name="context">HttpContext for the transaction</param>
        /// <param name="configFilePath">Path for controls config</param>
        public static bool OutputCombinedScriptFile(HttpContext context, string configFilePath)
        {
            return Combiner.OutputCombinedScriptFile(context, configFilePath);
        }

        /// <summary>
        /// Callable implementation of System.Web.Script.Serialization.JavaScriptString.QuoteString
        /// </summary>
        /// <param name="value">value to quote</param>
        /// <returns>quoted string</returns>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Maintainability", "CA1502:AvoidExcessiveComplexity",
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
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1062:ValidateArgumentsOfPublicMethods",
            Justification =
                "Callable implementation of System.Web.Script.Serialization.JavaScriptString.AppendCharAsUnicode")]
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Naming",
            "CA1704:IdentifiersShouldBeSpelledCorrectly", MessageId = "c",
            Justification =
                "Callable implementation of System.Web.Script.Serialization.JavaScriptString.AppendCharAsUnicode")]
        protected static void AppendCharAsUnicode(StringBuilder builder, char c)
        {
            ToolkitScriptManagerCombiner.AppendCharAsUnicode(builder, c);
        }

    }
}
