using System.Text.RegularExpressions;

public class AccordionMarkupCleaner : MarkupCleaner {
    internal string Clean(string markup) {
        markup = RemoveExtraAccordionPanes(markup);
        markup = RemoveAccordionHeaderContent(markup);
        return RemoveAccordionContentContent(markup);
    }

    string RemoveExtraAccordionPanes(string markup) {
        var pattern = @"<ajaxToolkit:AccordionPane.*?<\/ajaxToolkit:AccordionPane>";
        var matches = Regex.Matches(markup, pattern, RegexOptions.Singleline);

        if(matches.Count == 0)
            return markup;

        for(int i = 1; i < matches.Count; i++)
            markup = markup.Replace(matches[i].Value, ".");

        return markup;
    }

    string RemoveAccordionHeaderContent(string markup) {
        return RemoveTagContent(markup, "Header");
    }

    string RemoveAccordionContentContent(string markup) {
        return RemoveTagContent(markup, "Content");
    }
}