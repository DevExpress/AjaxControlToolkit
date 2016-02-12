#pragma warning disable 1591
using System.Collections.Generic;

namespace AjaxControlToolkit.HtmlEditor.Sanitizer {

    public interface IHtmlSanitizer {
        string GetSafeHtmlFragment(string htmlFragment, Dictionary<string, string[]> whiteList);
    }

}

#pragma warning restore 1591