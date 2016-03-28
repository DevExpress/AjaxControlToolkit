#pragma warning disable 1591
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit {
    public interface IWebCache {
        object this[string key] { get; set; }
    }
}
#pragma warning restore 1591