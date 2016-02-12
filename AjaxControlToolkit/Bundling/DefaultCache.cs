#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Caching;

namespace AjaxControlToolkit.Bundling {

    public class DefaultCache : ICache {
        public void Set(string key, object value) {
            HttpRuntime.Cache[key] = value;
        }

        public T Get<T>(string key) where T : class {
            return HttpRuntime.Cache[key] as T;
        }

        public void Remove(string key) {
            HttpRuntime.Cache.Remove(key);
        }

        public void Set(string key, object value, string fileCacheDependencyName) {
            HttpRuntime.Cache.Insert(key, value, new CacheDependency(fileCacheDependencyName));
        }

    }
}
#pragma warning restore 1591