using AjaxControlToolkit;
using System.Reflection;
using System.Resources;
using System.Runtime.InteropServices;
using System.Security;
using System.Web.UI;

[assembly: AssemblyTitle("Ajax Control Toolkit")]
[assembly: AssemblyProduct("AjaxControlToolkit")]
[assembly: AssemblyCopyright("Copyright © CodePlex Foundation 2012-2014")]

[assembly: AllowPartiallyTrustedCallers]
[assembly: ComVisible(false)]

[assembly: SecurityRules(SecurityRuleSet.Level1)]
[assembly: NeutralResourcesLanguage("en-US")]
[assembly: AssemblyVersion("15.1")]
[assembly: AssemblyFileVersion("15.1")]

[assembly: WebResource(Constants.BaseScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.BaseScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.CommonScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.CommonScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.CompatTimerScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.CompatTimerScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.DropShadowScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.DropShadowScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.RoundedCornersScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.RoundedCornersScriptName + Constants.JsPostfix, "text/javascript")]

[assembly: WebResource(Constants.TextBoxWatermarkScriptName + Constants.DebugJsPostfix, "text/javascript")]
[assembly: WebResource(Constants.TextBoxWatermarkScriptName + Constants.JsPostfix, "text/javascript")]