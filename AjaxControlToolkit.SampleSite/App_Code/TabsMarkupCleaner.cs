using System.Text.RegularExpressions;

public class TabsMarkupCleaner : MarkupCleaner {
    internal string Clean(string markup) {
        markup = RemoveExtraTabPanels(markup);
        return RemoveContentTemplateContent(markup);
    }

    string RemoveContentTemplateContent(string markup) {
        return RemoveTagContent(markup, "ContentTemplate");
    }

    string RemoveExtraTabPanels(string markup) {
        var pattern = @"<ajaxToolkit:TabPanel.*?<\/ajaxToolkit:TabPanel>";
        var matches = Regex.Matches(markup, pattern, RegexOptions.Singleline);

        if(matches.Count == 0)
            return markup;

        for(int i = 1; i < matches.Count; i++)
            markup = markup.Replace(matches[i].Value, ".");

        return markup;
    }
}