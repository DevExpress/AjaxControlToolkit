using System.Web;
using System.Web.Caching;

namespace AjaxControlToolkit
{
    /// <summary>
    /// Provide cache management using HttpRuntime.Cache
    /// </summary>
    public class AjaxControlToolkitCacheProvider : IAjaxControlToolkitCacheProvider
    {
        /// <summary>
        /// Set cache value
        /// </summary>
        /// <param name="key">cache key</param>
        /// <param name="value">cache value</param>
        public void Set(string key, object value)
        {
            HttpRuntime.Cache[key] = value;
        }

        /// <summary>
        /// Get cache value
        /// </summary>
        /// <typeparam name="T">type of value</typeparam>
        /// <param name="key">cache key</param>
        /// <returns>cache value</returns>
        public T Get<T>(string key) where T : class
        {
            return HttpRuntime.Cache[key] as T;
        }

        /// <summary>
        /// Remove cache
        /// </summary>
        /// <param name="key">cache key</param>
        public void Remove(string key)
        {
            HttpRuntime.Cache.Remove(key);
        }

        /// <summary>
        /// Set file cache dependency
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <param name="fileCacheDependencyName"></param>
        public void Set(string key, object value, string fileCacheDependencyName) {
            HttpRuntime.Cache.Insert(key, value, new CacheDependency(fileCacheDependencyName));
        }

    }
}
