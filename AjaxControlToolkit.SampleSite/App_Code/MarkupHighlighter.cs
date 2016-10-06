using ColorCode;
using System;
using System.Linq;
using System.IO;
using System.Text.RegularExpressions;
using System.Web.UI.HtmlControls;

public class MarkupHighlighter {
    public static void HighlightMarkup(string filePath, string controlID, InfoBlock.InfoBlock codeInfoBlock) {
        var markup = new MarkupHighlighter().GetHighlightedMarkup(filePath, controlID);
        var control = codeInfoBlock.FindControl("codeBlock") as HtmlGenericControl;
        control.InnerHtml = markup;
    }

    string GetHighlightedMarkup(string filePath, string controlID) {
        if(!filePath.EndsWith(".aspx"))
            filePath += ".aspx";

        var sourceCode = File.ReadAllText(filePath);
        var controlMarkup = GetControlMarkup(sourceCode, controlID);
        var cleanedControlMarkup = CleanControlMarkup(controlMarkup);

        return new CodeColorizer().Colorize(cleanedControlMarkup, Languages.Aspx);
    }

    string GetControlMarkup(string text, string controlID) {
        var generalTagPattern = @"\r\n\s*<ajaxToolkit:(?<tag>\w+).*?ID=""{0}"".*?<\/ajaxToolkit:\k<tag>>";
        var selfClosingTagPattern = @"\r\n\s*<ajaxToolkit:.*?ID=""{0}"".*?\/>";
        var pattern = generalTagPattern + "|" + selfClosingTagPattern;
        var match = Regex.Match(text, String.Format(pattern, controlID), RegexOptions.Singleline);

        if(!match.Success)
            return null;

        return match.Value;
    }

    string CleanControlMarkup(string markup) {
        var multilineMarkup = GetMultilineMarkup(markup);
        multilineMarkup = DecreaseIndent(multilineMarkup);
        markup = String.Join("\r\n", multilineMarkup);
        return CustomClean(markup);
    }

    string[] GetMultilineMarkup(string markup) {
        return markup.Split(
                new string[] { "\r\n" },
                StringSplitOptions.RemoveEmptyEntries);
    }

    string[] DecreaseIndent(string[] lines) {
        string[] newLines = new string[lines.Length];
        int indent = lines[0].TakeWhile(Char.IsWhiteSpace).Count();

        for(int i = 0; i < lines.Length; i++)
            newLines[i] = lines[i].Substring(indent);

        return newLines;
    }

    protected string CustomClean(string markup) {
        markup = RemoveExtraAccordionPanes(markup);
        markup = RemoveAccordionHeaderContent(markup);
        return RemoveAccordionContentContent(markup);
    }

    private static string RemoveExtraAccordionPanes(string markup) {
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

    private static string RemoveTagContent(string markup, string tagName) {
        var pattern = String.Format(@"<{0}>.*?<\/{0}>", tagName);
        return Regex.Replace(markup, pattern, String.Format( @"<{0}>...</{0}>", tagName), RegexOptions.Singleline);
    }
}