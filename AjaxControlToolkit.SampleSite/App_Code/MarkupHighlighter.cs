using ColorCode;
using System;
using System.Linq;
using System.IO;
using System.Text.RegularExpressions;
using System.Web.UI.HtmlControls;
using System.Web;

public class MarkupHighlighter {
    string _filePath;

    public MarkupHighlighter(string filePath) {
        var dir = Path.GetDirectoryName(filePath);
        var fileWithoutExtension = Path.GetFileNameWithoutExtension(filePath);
        var extension = Path.GetExtension(filePath);

        var markupFile = Path.Combine(dir, fileWithoutExtension + ".markup");

        if(File.Exists(markupFile))
            _filePath = markupFile;
        else
            _filePath = filePath;
    }

    public static void HighlightMarkup(string controlID, InfoBlock.InfoBlock codeInfoBlock) {
        var markup = new MarkupHighlighter(HttpContext.Current.Request.PhysicalPath).GetHighlightedMarkup(controlID);
        var control = codeInfoBlock.FindControl("codeBlock") as HtmlGenericControl;
        control.InnerHtml = markup;
    }

    string GetHighlightedMarkup(string controlID) {
        var sourceCode = File.ReadAllText(_filePath);
        var controlMarkup = GetControlMarkup(sourceCode, controlID);
        var cleanedControlMarkup = CleanControlMarkup(controlMarkup);

        return new CodeColorizer().Colorize(cleanedControlMarkup, Languages.Aspx);
    }

    string GetControlMarkup(string text, string controlID) {
        
        var selfClosingTagPattern = @"(\r\n)?\s*<ajaxToolkit:.*?ID=""{0}""[^<]*?\/>";
        var match = Regex.Match(text, String.Format(selfClosingTagPattern, controlID), RegexOptions.Singleline);

        if(!match.Success) {
            var generalTagPattern = @"(\r\n)?\s*<ajaxToolkit:(?<tag>\w+).*?ID=""{0}"".*?<\/ajaxToolkit:\k<tag>>";
            match = Regex.Match(text, String.Format(generalTagPattern, controlID), RegexOptions.Singleline);
        }

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

    protected virtual string CustomClean(string markup) {
        if(_filePath.EndsWith("Accordion.aspx"))
            return new AccordionMarkupCleaner().Clean(markup);

        if(_filePath.EndsWith("AutoComplete.aspx"))
            return new AutoCompleteMarkupCleaner().Clean(markup);

        return markup;
    }
}