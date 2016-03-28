using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Caching;

namespace AjaxControlToolkit {
    class CacheWrapper : IWebCache {

        Cache _cache;

        public CacheWrapper(Cache cache) {
            _cache = cache;
        }

        public object this[string key] {
            get { return _cache[key]; }
            set { _cache[key] = value; }
        }

    }
}
