#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit.Bundling {

    public interface ICache {
        T Get<T>(string key) where T : class;
        void Set(string key, object value);
        void Set(string key, object value, string fileCacheDependencyName);
        void Remove(string key);
    }

}

#pragma warning restore 1591