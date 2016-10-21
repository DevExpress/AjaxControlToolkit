using System.Text.RegularExpressions;

public class UpdatePanelAnimationMarkupCleaner : MarkupCleaner {
    internal string Clean(string markup) {
        markup = RemoveTagContent(markup, "OnUpdating");
        return RemoveTagContent(markup, "OnUpdated");
    }
}