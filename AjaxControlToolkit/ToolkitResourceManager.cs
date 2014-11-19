using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.HtmlControls;

namespace AjaxControlToolkit {
    // Usage:
    //
    // Application_Start:
    // ToolkitResourceManager.UseStaticResources = true;
    // BundleTable.Bundles.Add(new ScriptBundle("~/bundles/AjaxControlToolkit/Scripts").Include(ToolkitResourceManager.GetScriptPaths()));
    // BundleTable.Bundles.Add(new StyleBundle("~/bundles/AjaxControlToolkit/Styles").Include(ToolkitResourceManager.GetStylePaths()));
    // 
    // Page_Init:
    // AjaxControlToolkit.ToolkitResourceManager.RenderStyleLinks = false;
    //
    // ScriptManager:
    // <asp:ScriptReference Path="~/bundles/AjaxControlToolkit" />
    //
    // Head:
    // <head runat="server">
    //     <asp:PlaceHolder runat="server">
    //         <%: Styles.Render("~/bundles/AjaxControlToolkit/Styles") %>
    //     </asp:PlaceHolder>
    // </head>

    public static class ToolkitResourceManager {
        const string ContextKey_UseEmbeddedStyles = "3ca56b9cc998439ca4894b076783cfc9";

        static readonly object _sync = new object();
        static bool _useStaticResources = false;
        static readonly Dictionary<Type, List<ResourceEntry>>
            _scriptsCache = new Dictionary<Type, List<ResourceEntry>>(),
            _cssCache = new Dictionary<Type, List<ResourceEntry>>();

        public static bool RenderStyleLinks {
            get { return GetContextFlag(ContextKey_UseEmbeddedStyles, true); }
            set { SetContextFlag(ContextKey_UseEmbeddedStyles, true, value); }
        }

        public static void UseStaticResources() {
            if(_useStaticResources)
                return;

            _useStaticResources = true;
            RegisterScriptMappings(GetScriptNames());
        }

        // Scripts

        public static string[] GetScriptPaths(params string[] toolkitBundles) {
            return GetScriptNames(toolkitBundles).Select(FormatScriptReleaseVirtualPath).ToArray();
        }

        internal static IEnumerable<ScriptReference> GetControlScriptReferences(Type type) {
            return new Localization().GetLocalizationScriptReferences().Concat(
                GetScriptEntries(type).Select(entry => new ScriptReference {
                Assembly = entry.AssemblyName,
                Name = entry.ResourceName + Constants.JsPostfix
            }));
        }

        static IEnumerable<string> GetScriptNames(params string[] toolkitBundles) {
            var localizationScripts = new Localization().GetAllLocalizationScripts();

            var controlScripts = new List<string>();
            var trace = new HashSet<string>();
            var bundleResolver = new Bundling.BundleResolver(new Bundling.DefaultCache());

            foreach(var type in bundleResolver.GetControlTypesInBundles(new HttpContextWrapper(HttpContext.Current), toolkitBundles)) {
                foreach(var name in GetScriptEntries(type).Select(entry => entry.ResourceName)) {
                    if(trace.Contains(name))
                        continue;

                    controlScripts.Add(name);
                    trace.Add(name);
                }
            }

            return localizationScripts.Concat(controlScripts);
        }

        static void RegisterScriptMappings(IEnumerable<string> scriptNames) {
            var toolkitAssembly = typeof(ToolkitResourceManager).Assembly;
            foreach(var name in scriptNames) {
                ScriptManager.ScriptResourceMapping.AddDefinition(name + Constants.JsPostfix, toolkitAssembly, new ScriptResourceDefinition() {
                    Path = FormatScriptReleaseVirtualPath(name),
                    DebugPath = FormatScriptDebugVirtualPath(name)
                });
            }
        }

        static string FormatScriptDebugVirtualPath(string scriptName) {
            return Constants.ScriptsDebugVirtualPath + scriptName + Constants.DebugJsPostfix;
        }

        static string FormatScriptReleaseVirtualPath(string scriptName) {
            return Constants.ScriptsReleaseVirtualPath + scriptName + Constants.JsPostfix;
        }

        // Styles

        public static string[] GetStylePaths(params string[] toolkitBundles) {
            var controlTypes = new Bundling.BundleResolver(new Bundling.DefaultCache())
                .GetControlTypesInBundles(new HttpContextWrapper(HttpContext.Current), toolkitBundles);

            return GetStyleNames(controlTypes.ToArray())
                .Distinct()
                .Select(name => FormatStyleVirtualPath(name, false))
                .ToArray();
        }

        internal static IEnumerable<string> GetStyleHrefs(Control control) {
            return GetStyleNames(control.GetType()).Select(name => GetStyleHref(name, control));
        }

        internal static string GetStyleHref(string name, Control control) {
            var minified = !IsDebuggingEnabled();
            var controlType = control.GetType();

            return _useStaticResources
                ? FormatStyleVirtualPath(name, minified)
                : control.Page.ClientScript.GetWebResourceUrl(controlType, FormatStyleResourceName(name, minified));
        }

        static IEnumerable<string> GetStyleNames(params Type[] controlTypes) {
            foreach(var type in controlTypes) {
                foreach(var entry in GetStyleEntries(type))
                    yield return entry.ResourceName;
            }

            yield return Constants.BackgroundStylesName;
        }

        static string FormatStyleVirtualPath(string name, bool minified) {
            return Constants.StylesVirtualPath + name + (minified ? Constants.MinCssPostfix : Constants.CssPostfix);
        }

        static string FormatStyleResourceName(string name, bool minified) {
            return Constants.StyleResourcePrefix + name + (minified ? Constants.MinCssPostfix : Constants.CssPostfix);
        }

        public static void RegisterCssReferences(Control control) {
            if(!RenderStyleLinks)
                return;

            // Add the link to the page header instead of inside the body which is not xhtml compliant
            var header = control.Page.Header;

            foreach(var href in GetStyleHrefs(control)) {
                // It would be nice to add the required header here, but it's too late in the page
                // lifecycle to be modifying the Page.Controls collection - throw an informative
                // exception instead and let the page author make the simple change.
                if(header == null)
                    throw new NotSupportedException("This page is missing a HtmlHead control which is required for the CSS stylesheet link that is being added. Please add <head runat=\"server\" />.");

                var linkExists = false;
                foreach(var headerControl in header.Controls) {
                    var headerLink = headerControl as HtmlLink;
                    if(headerLink != null && href.Equals(headerLink.Href, StringComparison.OrdinalIgnoreCase)) {
                        linkExists = true;
                        break;
                    }
                }

                if(linkExists)
                    continue;

                // Add to HEAD even if IsInAsyncPostBack, to check duplicates on the server side
                var link = new HtmlLink();
                link.Href = href;
                link.Attributes.Add("type", "text/css");
                link.Attributes.Add("rel", "stylesheet");
                header.Controls.Add(link);

                // ASP.NET AJAX doesn't currently send a new head element down during an async postback,
                // so we do the same thing on the client by registering the appropriate script for after
                // the update.
                var scriptManager = ScriptManager.GetCurrent(control.Page);
                if(scriptManager == null)
                    throw new InvalidOperationException("A ScriptManager is required on the page to use ASP.NET AJAX Script Components.");

                if(!scriptManager.IsInAsyncPostBack)
                    continue;

                var resolvedUrl = link.ResolveClientUrl(href);
                ScriptManager.RegisterClientScriptBlock(control, control.GetType(), "RegisterCssReferences",
                    "if (window.__ExtendedControlCssLoaded == null || typeof window.__ExtendedControlCssLoaded == 'undefined') {" +
                    "    window.__ExtendedControlCssLoaded = new Array();" +
                    "}" +
                    "var controlCssLoaded = window.__ExtendedControlCssLoaded; " +
                    "var head = document.getElementsByTagName('HEAD')[0];" +
                    "if (head && !Array.contains(controlCssLoaded,'" + resolvedUrl + "')) {" +
                        "var linkElement = document.createElement('link');" +
                        "linkElement.type = 'text/css';" +
                        "linkElement.rel = 'stylesheet';" +
                        "linkElement.href = '" + resolvedUrl + "';" +
                        "head.appendChild(linkElement);" +
                        "controlCssLoaded.push('" + resolvedUrl + "');" +
                    "}"
                    , true);
            }
        }

        // Images

        internal static string GetImageHref(string imageName, Control control) {
            if(_useStaticResources)
                return control.Page.ResolveClientUrl(Constants.ImagesVirtualPath + imageName);

            return control.Page.ClientScript.GetWebResourceUrl(control.GetType(), Constants.ImageResourcePrefix + imageName);
        }

        internal static void RegisterImagePaths(string[] imageNames, Control control) {
            if(imageNames.Length < 1)
                return;

            control.Page.ClientScript.RegisterStartupScript(
                control.Page.GetType(),
                "bb9d9f1593ff41a198714a472d603c55",
                "Type.registerNamespace('Sys.Extended.UI.Images');",
                true
            );

            var jser = new JavaScriptSerializer();
            var builder = new StringBuilder();
            foreach(var name in imageNames) {
                builder.AppendLine("Sys.Extended.UI.Images[" + jser.Serialize(name) + "] = "
                    + jser.Serialize(ToolkitResourceManager.GetImageHref(name, control)) + ";");
            }

            control.Page.ClientScript.RegisterStartupScript(control.GetType(), "086a0778a11d433386793f72ea881602", builder.ToString(), true);
        }

        // Entries

        static IEnumerable<ResourceEntry> GetScriptEntries(Type type) {
            return GetResourceEntries<ClientScriptResourceAttribute>(type, new HashSet<Type>(), _scriptsCache);
        }

        static IEnumerable<ResourceEntry> GetStyleEntries(Type type) {
            return GetResourceEntries<ClientCssResourceAttribute>(type, new HashSet<Type>(), _cssCache);
        }

        // Gets the ScriptReferences for a Type and walks the Type's dependencies with circular-reference checking
        static IEnumerable<ResourceEntry> GetResourceEntries<AttributeType>(Type type, ICollection<Type> typeTrace, IDictionary<Type, List<ResourceEntry>> cache) where AttributeType : ClientResourceAttribute {
            if(typeTrace.Contains(type))
                throw new InvalidOperationException("Circular reference detected.");

            // Look for a cached set of references outside of the lock for perf.
            if(cache.ContainsKey(type))
                return cache[type];

            // Track this type to prevent circular references
            typeTrace.Add(type);
            try {
                lock(_sync) {
                    // double-checked lock pattern
                    if(cache.ContainsKey(type))
                        return cache[type];

                    var requiredEntries = type.GetCustomAttributes(typeof(RequiredScriptAttribute), true)
                        .Cast<RequiredScriptAttribute>()
                        .Where(a => a.ExtenderType != null)
                        .OrderBy(a => a.LoadOrder)
                        .SelectMany(a => GetResourceEntries<AttributeType>(a.ExtenderType, typeTrace, cache));

                    // create a new sequence so we can sort it independently
                    var resourceEntries = Enumerable.Empty<ResourceEntry>();

                    var current = type;
                    var orderOffset = 0;
                    while(current != typeof(object)) {
                        var attrs = current.GetCustomAttributes(typeof(AttributeType), false);
                        orderOffset -= attrs.Length;

                        resourceEntries = resourceEntries.Concat(attrs
                            .Cast<AttributeType>()
                            .Select(a => new ResourceEntry(a.ResourcePath, current, orderOffset + a.LoadOrder))
                            .ToList() // force evaluation because 'current' is mutable
                        );

                        current = current.BaseType;
                    }

                    var result = requiredEntries.Concat(resourceEntries.Distinct().OrderBy(e => e.Order)).ToList();
                    cache.Add(type, result);
                    return result;
                }
            } finally {
                typeTrace.Remove(type);
            }
        }

        // Utils

        static bool GetContextFlag(string key, bool defaultValue) {
            var context = HttpContext.Current;
            if(context == null || !context.Items.Contains(key))
                return defaultValue;

            return (bool)context.Items[key];
        }

        static void SetContextFlag(string key, object defaultValue, object value) {
            var context = HttpContext.Current;
            if(context == null)
                return;

            if(defaultValue == value)
                context.Items.Remove(key);
            else
                context.Items[key] = value;
        }

        static bool IsDebuggingEnabled() {
            var context = HttpContext.Current;
            if(context == null)
                return false;

            var page = context.Handler as Page;
            if(page == null)
                return context.IsDebuggingEnabled;

            var scriptManager = ScriptManager.GetCurrent(page);
            if(scriptManager == null)
                return context.IsDebuggingEnabled;

            return scriptManager.IsDebuggingEnabled;
        }

        struct ResourceEntry : IEquatable<ResourceEntry> {
            public readonly string ResourceName;
            public readonly Type ComponentType;
            public readonly int Order;

            public ResourceEntry(string name, Type componentType, int order) {
                if(String.IsNullOrEmpty(name))
                    throw new ArgumentException();

                ResourceName = name;
                ComponentType = componentType;
                Order = order;
            }

            public string AssemblyName {
                get { return ComponentType == null ? "" : ComponentType.Assembly.FullName; }
            }

            public override int GetHashCode() {
                return ResourceName.ToLower().GetHashCode() ^ ComponentType.GetHashCode();
            }

            public override bool Equals(object obj) {
                return obj is ResourceEntry && Equals((ResourceEntry)obj);
            }

            public bool Equals(ResourceEntry other) {
                return ResourceName.Equals(other.ResourceName, StringComparison.OrdinalIgnoreCase)
                    && ComponentType == other.ComponentType;
            }
        }
    }
}