using System.Reflection;
using System.Resources;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Security;
using System.Security.Permissions;
using System.Web.UI;

// Dependency Attribute for assemblies 
[assembly: DependencyAttribute("System.Web,", LoadHint.Always)]
[assembly: DependencyAttribute("System.Web.Extensions,", LoadHint.Always)]

[assembly: SecurityPermission(SecurityAction.RequestMinimum, Execution = true)]

[assembly: TagPrefix("System.Web.UI", "asp")]

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
[assembly: ScriptResource("MicrosoftAjaxOpenData.js", "System.Web.Resources.ScriptLibrary.OpenData.Res", "Sys.Data.OpenDataRes")]
[assembly: ScriptResource("MicrosoftAjaxOpenData.debug.js", "System.Web.Resources.ScriptLibrary.OpenData.Res.debug", "Sys.Data.OpenDataRes")]
[assembly: ScriptResource("MicrosoftAjaxDataContext.js", "System.Web.Resources.ScriptLibrary.DataContext.Res", "Sys.Data.DataRes")]
[assembly: ScriptResource("MicrosoftAjaxDataContext.debug.js", "System.Web.Resources.ScriptLibrary.DataContext.Res.debug", "Sys.Data.DataRes")]
[assembly: ScriptResource("MicrosoftAjaxTemplates.js", "System.Web.Resources.ScriptLibrary.Templates.Res", "Sys.UI.TemplatesRes")]
[assembly: ScriptResource("MicrosoftAjaxTemplates.debug.js", "System.Web.Resources.ScriptLibrary.Templates.Res.debug", "Sys.UI.TemplatesRes")]

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
[assembly: ScriptResource("MicrosoftAjax.js", "System.Web.Resources.ScriptLibrary.Res", "Sys.Res")]
[assembly: ScriptResource("MicrosoftAjax.debug.js", "System.Web.Resources.ScriptLibrary.Res.debug", "Sys.Res")]
[assembly: ScriptResource("MicrosoftAjaxCore.js", "System.Web.Resources.ScriptLibrary.Res", "Sys.Res")]
[assembly: ScriptResource("MicrosoftAjaxCore.debug.js", "System.Web.Resources.ScriptLibrary.Res.debug", "Sys.Res")]
[assembly: ScriptResource("MicrosoftAjaxWebForms.js", "System.Web.Resources.ScriptLibrary.WebForms.Res", "Sys.WebForms.Res")]
[assembly: ScriptResource("MicrosoftAjaxWebForms.debug.js", "System.Web.Resources.ScriptLibrary.WebForms.Res.debug", "Sys.WebForms.Res")]


// Default tag prefix for designer
[assembly: TagPrefix("System.Web.UI", "asp")]
//[assembly: TagPrefix("System.Web.UI.WebControls", "asp")]

[assembly: AllowPartiallyTrustedCallers]
[assembly: ComVisible(false)]
[assembly: System.CLSCompliant(true)]
[assembly: AssemblyVersion("3.0.40203.0")]
[assembly: AssemblyFileVersion("3.0.40203.0")]
[assembly: NeutralResourcesLanguage("en-US")]

// CDN Path
// http[s]://ajax.microsoft.com/ajax/beta/1002/*
