using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;

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

        public static bool UseStaticResources {
            get { return _useStaticResources; }
            set {
                _useStaticResources = value;
                if(_useStaticResources)
                    RegisterScriptMappings(GetScriptNames());
            }
        }

        public static string[] GetScriptPaths(params string[] toolkitBundles) {
            return GetScriptNames(toolkitBundles).Select(FormatScriptReleasePath).ToArray();
        }

        public static string[] GetStylePaths(params string[] toolkitBundles) {
            var result = new List<string>();
            var bundleResolver = new Bundling.BundleResolver(new Bundling.DefaultCache());
            var trace = new HashSet<string>();

            foreach(var type in bundleResolver.GetControlTypesInBundles(new HttpContextWrapper(HttpContext.Current), toolkitBundles))
                result.AddRange(GetStyleEntries(type).Select(entry => FormatStyleUrl(entry, true)).ToList());

            return result.Distinct().ToArray();
        }

        internal static IEnumerable<string> GetStyleUrls(Control control) {
            return GetStyleEntries(control.GetType()).Select(entry => FormatStyleUrl(entry, UseStaticResources));
        }

        internal static IEnumerable<ScriptReference> GetControlScriptReferences(Type type) {
            return GetScriptEntries(type).Select(entry => new ScriptReference {
                Assembly = entry.AssemblyName,
                Name = entry.ResourceName + Constants.JsPostfix
            });
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

        static string FormatStyleUrl(ResourceEntry entry, bool useStaticResources) {
            var isStatic = useStaticResources;
            var page = HttpContext.Current.Handler as Page;

            ClientScriptManager clientScript = null;
            if(page == null)
                isStatic = true;
            else
                clientScript = page.ClientScript;

            return isStatic ? FormatStyleStaticPath(entry.ResourceName) : FormatStyleResourceUrl(entry.ResourceName, entry.ComponentType, clientScript);
        }

        static IEnumerable<ResourceEntry> GetScriptEntries(Type type) {
            return GetResourceEntries<ClientScriptResourceAttribute>(type, new HashSet<Type>(), _scriptsCache);
        }

        static IEnumerable<ResourceEntry> GetStyleEntries(Type type) {
            return GetResourceEntries<ClientCssResourceAttribute>(type, new HashSet<Type>(), _cssCache);
        }

        // Gets the ScriptReferences for a Type and walks the Type's dependencies with circular-reference checking
        static List<ResourceEntry> GetResourceEntries<AttributeType>(Type type, ICollection<Type> typeTrace, IDictionary<Type, List<ResourceEntry>> cache) where AttributeType : ClientResourceAttribute {
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

        static void RegisterScriptMappings(IEnumerable<string> scriptNames) {
            var toolkitAssembly = typeof(ToolkitResourceManager).Assembly;
            foreach(var name in scriptNames)
                ScriptManager.ScriptResourceMapping.AddDefinition(FormatScriptResourceName(name), toolkitAssembly, CreateScriptDefinition(name));
        }

        static ScriptResourceDefinition CreateScriptDefinition(string scriptName) {
            return new ScriptResourceDefinition() {
                Path = FormatScriptReleasePath(scriptName),
                DebugPath = FormatScriptDebugPath(scriptName)
            };
        }

        static string FormatScriptResourceName(string scriptName) {
            return scriptName + Constants.JsPostfix;
        }

        static string FormatScriptDebugPath(string scriptName) {
            return Constants.ScriptStaticDebugPrefix + scriptName + Constants.DebugJsPostfix;
        }

        static string FormatScriptReleasePath(string scriptName) {
            return Constants.ScriptStaticReleasePrefix + scriptName + Constants.JsPostfix;
        }

        static string FormatStyleStaticPath(string styleName) {
            return Constants.StyleStaticPrefix + styleName + (IsDebuggingEnabled() ? Constants.CssPostfix : Constants.MinCssPostfix);
        }

        static string FormatStyleResourceUrl(string styleName, Type controlType, ClientScriptManager clientScript) {
            var fullName = Constants.StyleResourcePrefix + styleName + (IsDebuggingEnabled() ? Constants.CssPostfix : Constants.MinCssPostfix);

            return clientScript.GetWebResourceUrl(controlType, fullName);
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