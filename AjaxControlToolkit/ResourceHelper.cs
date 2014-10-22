using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;

namespace AjaxControlToolkit {

    public static class ResourceHelper {
        private static readonly object _sync = new object();
        private static readonly Dictionary<Type, List<ResourceEntry>> _scriptsCache = new Dictionary<Type, List<ResourceEntry>>();
        private static readonly Dictionary<Type, List<ResourceEntry>> _cssCache = new Dictionary<Type, List<ResourceEntry>>();

        public static IEnumerable<string> GetCssUrls(Control control) {
            var minified = !IsDebuggingEnabled();
            var clientScript = control.Page.ClientScript;

            return GetResourceEntries<ClientCssResourceAttribute>(control.GetType(), new HashSet<Type>(), _cssCache)
                .Select(entry => { 
                    var fullName = Constants.StyleResourcePrefix + entry.ResourceName + (minified ? Constants.MinCssPostfix : Constants.CssPostfix);
                    return clientScript.GetWebResourceUrl(entry.ComponentType, fullName);
                });
        }

        public static IEnumerable<ScriptReference> GetScriptReferences(Type type) {
            return GetScriptEntries(type).Select(entry => new ScriptReference {
                Assembly = entry.AssemblyName,
                Name = entry.ResourceName + Constants.JsPostfix
            });
        }

        public static IEnumerable<string> GetScriptNames(Type type) {
            return GetScriptEntries(type).Select(entry => entry.ResourceName);
        }


        static IEnumerable<ResourceEntry> GetScriptEntries(Type type) {
            return GetResourceEntries<ClientScriptResourceAttribute>(type, new HashSet<Type>(), _scriptsCache);
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

        static bool IsDebuggingEnabled() {
            var context = HttpContext.Current;
            if(context == null)
                return false;

            var page = context.Handler as Page;
            if(page == null)
                return context.IsDebuggingEnabled;

            var sm = ScriptManager.GetCurrent(page);
            if(sm == null)
                return context.IsDebuggingEnabled;

            return sm.IsDebuggingEnabled;
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