using System;
using System.Text.RegularExpressions;

public abstract class MarkupCleaner {
    protected string RemoveTagContent(string markup, string tagName) {
        var pattern = String.Format(@"<{0}>.*?<\/{0}>", tagName);
        return Regex.Replace(markup, pattern, String.Format(@"<{0}>...</{0}>", tagName), RegexOptions.Singleline);
    }
}