using ColorCode;
using System;
using System.Linq;
using System.IO;
using System.Text.RegularExpressions;
using System.Web.UI.HtmlControls;
using System.Web;

public class MarkupHighlighter {
    string _filePath;
    const string ATTRIBUTE_DUMMY_VALUE = "ATTRIBUTE_DUMMY_VALUE";

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

    public static void HighlightScriptMarkup(string scriptID, InfoBlock.InfoBlock codeInfoBlock, string codeBlockID) {
        var markup = new MarkupHighlighter(HttpContext.Current.Request.PhysicalPath).GetHighlightedScriptMarkup(scriptID);
        var control = codeInfoBlock.FindControl(codeBlockID) as HtmlGenericControl;
        control.InnerHtml = markup;
    }

    public static void HighlightScriptMarkup(string scriptID, HtmlGenericControl codeBlock) {
        var markup = new MarkupHighlighter(HttpContext.Current.Request.PhysicalPath).GetHighlightedScriptMarkup(scriptID);
        codeBlock.InnerHtml = markup;
    }

    public static void HighlightControlMarkup(string controlID, InfoBlock.InfoBlock codeInfoBlock, string codeBlockID = "codeBlock") {
        var markup = new MarkupHighlighter(HttpContext.Current.Request.PhysicalPath).GetHighlightedControlMarkup(controlID);
        var control = codeInfoBlock.FindControl(codeBlockID) as HtmlGenericControl;
        control.InnerHtml = markup;
    }

    public static void HighlightControlMarkup(string controlID, HtmlGenericControl codeBlock) {
        var markup = new MarkupHighlighter(HttpContext.Current.Request.PhysicalPath).GetHighlightedControlMarkup(controlID);
        codeBlock.InnerHtml = markup;
    }

    string GetHighlightedControlMarkup(string controlID) {
        var sourceCode = File.ReadAllText(_filePath);
        var controlMarkup = GetControlMarkup(sourceCode, controlID);
        var cleanedControlMarkup = CleanControlMarkup(controlMarkup);
        var colorizeReadyMarkup = PrepareMarkupForColorizer(cleanedControlMarkup);
        var colorizedMarkup = new CodeColorizer().Colorize(colorizeReadyMarkup, Languages.Aspx);
        return RestoreMarkupFormatting(colorizedMarkup);
    }

    string RestoreMarkupFormatting(string colorizedMarkup) {
        return colorizedMarkup.Replace("&quot;" + ATTRIBUTE_DUMMY_VALUE + "&quot;", "&quot;&quot;");
    }

    string PrepareMarkupForColorizer(string markup) {
        return markup.Replace("\"\"", "\""+ ATTRIBUTE_DUMMY_VALUE + "\"");
    }

    string GetHighlightedScriptMarkup(string scriptID) {
        var sourceCode = File.ReadAllText(_filePath);
        var scriptMarkup = GetScriptMarkup(sourceCode, scriptID);
        var cleanedControlMarkup = CleanScriptMarkup(scriptMarkup);

        return new CodeColorizer().Colorize(cleanedControlMarkup, Languages.JavaScript);
    }

    string GetScriptMarkup(string text, string scriptID) {
        var pattern = @"<script[^>]*?id=""{0}""[^<]*?<\/script>";
        var match = Regex.Match(text, String.Format(pattern, scriptID), RegexOptions.Singleline);

        if(!match.Success)
            return null;

        return match.Value;
    }

    string GetControlMarkup(string text, string controlID) {
        var selfClosingAspTagPattern = @"(\r\n)?\s*<asp:[^>]*?ID=""{0}"".*?\/>";
        var match = Regex.Match(text, String.Format(selfClosingAspTagPattern, controlID), RegexOptions.Singleline);

        if(!match.Success) {
            var selfClosingToolkitTagPattern = @"(\r\n)?\s*<ajaxToolkit:[^>]*?ID=""{0}""[^<]*?\/>";
            match = Regex.Match(text, String.Format(selfClosingToolkitTagPattern, controlID), RegexOptions.Singleline);
        }

        if(!match.Success) {
            var generalToolkitTagPattern = @"(\r\n)?\s*<ajaxToolkit:(?<tag>\w+)[^>]*?ID=""{0}"".*?<\/ajaxToolkit:\k<tag>>";
            match = Regex.Match(text, String.Format(generalToolkitTagPattern, controlID), RegexOptions.Singleline);
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

    string CleanScriptMarkup(string markup) {
        var multilineMarkup = GetMultilineMarkup(markup);
        multilineMarkup = RemoveMarginalLines(multilineMarkup);
        multilineMarkup = DecreaseIndent(multilineMarkup);
        return String.Join("\r\n", multilineMarkup);
    }

    string[] GetMultilineMarkup(string markup) {
        return markup.Split(
                new string[] { "\r\n" },
                StringSplitOptions.RemoveEmptyEntries);
    }

    string[] DecreaseIndent(string[] lines) {
        var newLines = new string[lines.Length];
        int indent = lines[0].TakeWhile(Char.IsWhiteSpace).Count();

        for(int i = 0; i < lines.Length; i++)
            newLines[i] = lines[i].Substring(indent);

        return newLines;
    }

    string[] RemoveMarginalLines(string[] lines) {
        var newLines = new string[lines.Length - 2];

        for(int i = 1; i < lines.Length - 1; i++)
            newLines[i - 1] = lines[i];

        return newLines;
    }

    protected virtual string CustomClean(string markup) {
        if(_filePath.EndsWith("Accordion.aspx"))
            return new AccordionMarkupCleaner().Clean(markup);

        if(_filePath.EndsWith("AutoComplete.aspx"))
            return new AutoCompleteMarkupCleaner().Clean(markup);

        if(_filePath.EndsWith("PasswordStrength.aspx"))
            return new PasswordStrengthMarkupCleaner().Clean(markup);

        return markup;
    }
}