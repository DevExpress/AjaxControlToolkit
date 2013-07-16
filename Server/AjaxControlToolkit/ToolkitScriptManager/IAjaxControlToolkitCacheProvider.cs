namespace AjaxControlToolkit
{
    /// <summary>
    /// Provide cache management system
    /// </summary>
    public interface IAjaxControlToolkitCacheProvider
    {
        /// <summary>
        /// Set cache value
        /// </summary>
        /// <param name="key">cache key</param>
        /// <param name="value">cache value</param>
        void Set(string key, object value);

        /// <summary>
        /// Get cache value
        /// </summary>
        /// <typeparam name="T">type of value</typeparam>
        /// <param name="key">cache key</param>
        /// <returns>cache value</returns>
        T Get<T>(string key) where T : class;

        /// <summary>
        /// Remove cache
        /// </summary>
        /// <param name="key">cache key</param>
        void Remove(string key);

        /// <summary>
        /// Set file cache dependency
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <param name="fileCacheDependencyName"></param>
        void Set(string key, object value, string fileCacheDependencyName);
    }
}