using System;
using System.Collections.Generic;
using System.Configuration.Provider;
using System.Linq;

namespace AjaxControlToolkit.HtmlEditor.Sanitizer {

    public abstract class HtmlSanitizerProvider : ProviderBase {

        public abstract string GetSafeHtmlFragment(string htmlFragment, Dictionary<string, string[]> whiteList);
    }

}