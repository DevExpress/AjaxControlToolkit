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

[assembly: WebResource(Constants.ScriptResourcePrefix + Constants.BaseScriptName + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.ScriptResourcePrefix + Constants.BaseScriptName + Constants.MinJsPostfix, "text/javascript")]

[assembly: WebResource(Constants.ScriptResourcePrefix + Constants.CommonScriptName + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.ScriptResourcePrefix + Constants.CommonScriptName + Constants.MinJsPostfix, "text/javascript")]

[assembly: WebResource(Constants.ScriptResourcePrefix + Constants.TextBoxWatermark + Constants.JsPostfix, "text/javascript")]
[assembly: WebResource(Constants.ScriptResourcePrefix + Constants.TextBoxWatermark + Constants.MinJsPostfix, "text/javascript")]
