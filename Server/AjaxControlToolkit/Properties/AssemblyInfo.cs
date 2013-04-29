using System.Reflection;
using System.Resources;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Security;
using System.Security.Permissions;
using System.Web.UI;
using AjaxControlToolkit;

// General Information about an assembly is controlled through the following 
// set of attributes. Change these attribute values to modify the information
// associated with an assembly.
[assembly: AssemblyTitle("Ajax Control Toolkit")]
[assembly: AssemblyConfiguration("")]
[assembly: AssemblyProduct("AjaxControlToolkit")]
[assembly: AssemblyCopyright("Copyright © CodePlex Foundation 2012")]
[assembly: AssemblyTrademark("")]
[assembly: AssemblyCulture("")]

// Dependency Attribute for assemblies 
[assembly: DependencyAttribute("System.Web,", LoadHint.Always)]
[assembly: DependencyAttribute("System.Web.Ajax,", LoadHint.Always)]
[assembly: DependencyAttribute("System.Web.Extensions,", LoadHint.Always)]

#pragma warning disable 0618
[assembly: SecurityPermission(SecurityAction.RequestMinimum, Execution = true)]
#pragma warning restore 0618

[assembly: TagPrefix("AjaxControlToolkit", "asp")]
[assembly: TagPrefix("System.Web.UI", "asp")]

[assembly: AllowPartiallyTrustedCallers]
[assembly: ComVisible(false)]
[assembly: System.CLSCompliant(true)]

#if NET4
[assembly: SecurityRules(SecurityRuleSet.Level1)]
[assembly: System.Web.Script.AjaxFrameworkAssembly]
[assembly: AssemblyVersion("4.1.7.0429")]
[assembly: AssemblyFileVersion("4.1.7.0429")]
#elif NET45
[assembly: SecurityRules(SecurityRuleSet.Level1)]
[assembly: System.Web.Script.AjaxFrameworkAssembly]
[assembly: AssemblyVersion("4.5.7.0429")]
[assembly: AssemblyFileVersion("4.5.7.0429")]
#else
[assembly: AssemblyVersion("3.5.7.0429")]
[assembly: AssemblyFileVersion("3.5.7.0429")]  
#endif
[assembly: NeutralResourcesLanguage("en-US")]

[assembly: ScriptCombine(ExcludeScripts = "Slider.SliderBehavior_resource.js,Seadragon.Seadragon.Config.js")]

// core script resources

[assembly: WebResource("Start.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxOpenData.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxDataContext.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxTemplates.js", "application/x-javascript")]
// debug versions
[assembly: WebResource("Start.debug.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxOpenData.debug.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxDataContext.debug.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxTemplates.debug.js", "application/x-javascript")]

// Script resources
[assembly: ScriptResource("MicrosoftAjaxOpenData.js", "ScriptResources.OpenData.Res", "Sys.Data.OpenDataRes")]
[assembly: ScriptResource("MicrosoftAjaxOpenData.debug.js", "ScriptResources.OpenData.Res.debug", "Sys.Data.OpenDataRes")]
[assembly: ScriptResource("MicrosoftAjaxDataContext.js", "ScriptResources.DataContext.Res", "Sys.Data.DataRes")]
[assembly: ScriptResource("MicrosoftAjaxDataContext.debug.js", "ScriptResources.DataContext.Res.debug", "Sys.Data.DataRes")]
[assembly: ScriptResource("MicrosoftAjaxTemplates.js", "ScriptResources.Templates.Res", "Sys.UI.TemplatesRes")]
[assembly: ScriptResource("MicrosoftAjaxTemplates.debug.js", "ScriptResources.Templates.Res.debug", "Sys.UI.TemplatesRes")]

// Scripts from System.Web.Extensions
[assembly: WebResource("MicrosoftAjax.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxApplicationServices.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxComponentModel.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxCore.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxGlobalization.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxHistory.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxNetwork.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxSerialization.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxTimer.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxWebForms.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxWebServices.js", "application/x-javascript")]
[assembly: WebResource("Date.HijriCalendar.js", "application/x-javascript")]
[assembly: WebResource("Date.UmAlQuraCalendar.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjax.debug.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxApplicationServices.debug.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxComponentModel.debug.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxCore.debug.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxGlobalization.debug.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxHistory.debug.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxNetwork.debug.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxSerialization.debug.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxTimer.debug.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxWebForms.debug.js", "application/x-javascript")]
[assembly: WebResource("MicrosoftAjaxWebServices.debug.js", "application/x-javascript")]
[assembly: WebResource("Date.HijriCalendar.debug.js", "application/x-javascript")]
[assembly: WebResource("Date.UmAlQuraCalendar.debug.js", "application/x-javascript")]

// Script resources
[assembly: ScriptResource("MicrosoftAjax.js", "ScriptResources.Res", "Sys.Res")]
[assembly: ScriptResource("MicrosoftAjax.debug.js", "ScriptResources.Res.debug", "Sys.Res")]
[assembly: ScriptResource("MicrosoftAjaxCore.js", "ScriptResources.Res", "Sys.Res")]
[assembly: ScriptResource("MicrosoftAjaxCore.debug.js", "ScriptResources.Res.debug", "Sys.Res")]
[assembly: ScriptResource("MicrosoftAjaxWebForms.js", "ScriptResources.WebForms.Res", "Sys.WebForms.Res")]
[assembly: ScriptResource("MicrosoftAjaxWebForms.debug.js", "ScriptResources.WebForms.Res.debug", "Sys.WebForms.Res")]

