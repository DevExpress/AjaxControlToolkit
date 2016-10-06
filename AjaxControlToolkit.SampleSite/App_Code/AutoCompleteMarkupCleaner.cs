using System.Text.RegularExpressions;

public class AutoCompleteMarkupCleaner : MarkupCleaner {
    internal string Clean(string markup) {
        markup = RemoveTagContent(markup, "OnShow");
        return RemoveTagContent(markup, "OnHide");
    }
}