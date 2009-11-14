using System.Reflection;
using System.Resources;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Security;
using System.Security.Permissions;
using System.Web.UI;
using AjaxControlToolkit;

// Dependency Attribute for assemblies 
[assembly: DependencyAttribute("System.Web,", LoadHint.Always)]
[assembly: DependencyAttribute("System.Web.Ajax,", LoadHint.Always)]
[assembly: DependencyAttribute("System.Web.Extensions,", LoadHint.Always)]

[assembly: SecurityPermission(SecurityAction.RequestMinimum, Execution = true)]

[assembly: TagPrefix("AjaxControlToolkit", "asp")]

[assembly: AllowPartiallyTrustedCallers]
[assembly: ComVisible(false)]
[assembly: System.CLSCompliant(true)]
[assembly: AssemblyVersion("3.0.31106.*")]
[assembly: AssemblyFileVersion("3.0.31106.0")]
[assembly: NeutralResourcesLanguage("en-US")]

[assembly: ScriptCombine(ExcludeScripts = "Slider.SliderBehavior_resource.js")]

// CDN Path
// http[s]://ajax.microsoft.com/ajax/beta/0910/extended/*
