using System.Collections.Generic;

namespace AjaxControlToolkit.HtmlEditor.Sanitizer {

    public interface IHtmlSanitizer {
        string GetSafeHtmlFragment(string htmlFragment, Dictionary<string, string[]> whiteList);
    }

}
