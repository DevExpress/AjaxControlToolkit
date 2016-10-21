using ColorCode;
using System;
using System.Linq;
using System.IO;
using System.Text.RegularExpressions;
using System.Web.UI.HtmlControls;
using System.Web;
using System.Collections.Generic;
using System.Web.UI;

public class MarkupHighlighter {
    string _filePath;
    Page _page;
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

    public MarkupHighlighter(Page page) {
        _page = page;
        var filePath = page.Request.PhysicalPath;
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

    public static void HighlightControlMarkups(Page page) {
        new MarkupHighlighter(page).HighlightControlMarkups();
    }

    void HighlightControlMarkups() {
        var sourceCode = File.ReadAllText(_filePath);
        var controlMarkups = GetControlMarkups(sourceCode);
        foreach(var markup in controlMarkups) {
            var cleanedControlMarkup = CleanControlMarkup(markup.Lines);
            var colorizeReadyMarkup = PrepareMarkupForColorizer(cleanedControlMarkup);
            string colorizedMarkup = ColorizeMarkup(colorizeReadyMarkup, markup.Language);
            var restoredMarkup = RestoreMarkupFormatting(colorizedMarkup);
            var codeInfoBlock = GetControlByType<HtmlGenericControl>(_page, c => c.ID == markup.CodeBlockID);
            codeInfoBlock.InnerHtml = restoredMarkup;
        }
    }

    static string ColorizeMarkup(string colorizeReadyMarkup, string language) {
        switch(language) {
            case "aspx":
                return new CodeColorizer().Colorize(colorizeReadyMarkup, Languages.Aspx);
            case "js":
                return new CodeColorizer().Colorize(colorizeReadyMarkup, Languages.JavaScript);
            default:
                throw new ArgumentOutOfRangeException();
        }
    }

    public T GetControlByType<T>(Control root, Func<T, bool> predicate = null) where T : Control {
        if(root == null)
            throw new ArgumentNullException("root");

        var stack = new Stack<Control>(new Control[] { root });

        while(stack.Count > 0) {
            var control = stack.Pop();
            T match = control as T;

            if(match != null && (predicate == null || predicate(match)))
                return match;

            foreach(Control childControl in control.Controls)
                stack.Push(childControl);
        }

        return default(T);
    }

    IEnumerable<Markup> GetControlMarkups(string text) {
        var lines = GetMultilineMarkup(text);
        ICollection<Markup> markups = new List<Markup>();
        var codeBlockID = "codeBlock";
        Markup markup = null;

        if(_filePath.EndsWith(".markup")) {
            markup = new Markup();
            markup.CodeBlockID = codeBlockID;
            markup.Lines = lines;
            markups.Add(markup);
            return markups;
        }

        var startMarkerPattern = @"<%--start highlighted block(\s+(?<codeBlockID>\w+?))?(\s+(?<language>\w+?))?--%>";
        var finishMarkerPattern = @"<%--fihish highlighted block--%>";
        bool blockStarted = false;

        for(int i = 0; i < lines.Length; i++) {
            if(!blockStarted) {
                var match = Regex.Match(lines[i], startMarkerPattern);
                if(match.Success) {
                    markup = new Markup();
                    markup.CodeBlockID = !String.IsNullOrWhiteSpace(match.Groups["codeBlockID"].Value) ? match.Groups["codeBlockID"].Value : codeBlockID;

                    if(!String.IsNullOrWhiteSpace(match.Groups["language"].Value))
                        markup.Language = match.Groups["language"].Value;

                    blockStarted = true;
                }
            } else {
                var match = Regex.Match(lines[i], finishMarkerPattern);
                if(match.Success) {
                    markups.Add(markup);
                    blockStarted = false;
                } else
                    markup.Lines.Add(lines[i]);
            }
        }

        return markups;
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
        return null;
        //var sourceCode = File.ReadAllText(_filePath);
        //var controlMarkup = GetControlMarkup(sourceCode, controlID);
        //var cleanedControlMarkup = CleanControlMarkup(controlMarkup);
        //var colorizeReadyMarkup = PrepareMarkupForColorizer(cleanedControlMarkup);
        //var colorizedMarkup = new CodeColorizer().Colorize(colorizeReadyMarkup, Languages.Aspx);
        //return RestoreMarkupFormatting(colorizedMarkup);
    }

    string RestoreMarkupFormatting(string colorizedMarkup) {
        var markup = RestoreEmptyAttributes(colorizedMarkup);
        return TransformSeadragonMenuElement(markup);
    }

    string TransformSeadragonMenuElement(string markup) {
        var pattern = "<span style=\"[^\"]+?\">Menu<\\/span>"
            + "\\s*<span style=\"[^\"]+?\">runat<\\/span>"
            + "\\s*<span style=\"[^\"]+?\">=<\\/span>"
            + "\\s*<span style=\"[^\"]+?\">&quot;server&quot;<\\/span>";

        var match = Regex.Match(markup, pattern, RegexOptions.Singleline);
        if(match.Success)
            markup = markup.Replace(match.Value, match.Value + " ...");

        return markup;
    }

    string RestoreEmptyAttributes(string colorizedMarkup) {
        return colorizedMarkup.Replace("&quot;" + ATTRIBUTE_DUMMY_VALUE + "&quot;", "&quot;&quot;");
    }

    string PrepareMarkupForColorizer(string markup) {
        return markup.Replace("\"\"", "\"" + ATTRIBUTE_DUMMY_VALUE + "\"");
    }

    string GetHighlightedScriptMarkup(string scriptID) {
        return null;
        //var sourceCode = File.ReadAllText(_filePath);
        //var scriptMarkup = GetScriptMarkup(sourceCode, scriptID);
        //var cleanedControlMarkup = CleanScriptMarkup(scriptMarkup);

        //return new CodeColorizer().Colorize(cleanedControlMarkup, Languages.JavaScript);
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

    string CleanControlMarkup(IEnumerable<string> markup) {
        markup = DecreaseIndent(markup);
        var singleLineMarkup = String.Join("\r\n", markup);
        return CustomClean(singleLineMarkup);
    }

    string CleanScriptMarkup(IEnumerable<string> markup) {
        markup = RemoveMarginalLines(markup);
        markup = DecreaseIndent(markup);
        return String.Join("\r\n", markup);
    }

    string[] GetMultilineMarkup(string markup) {
        var lines = markup.Split(
                new string[] { "\r\n" },
                StringSplitOptions.RemoveEmptyEntries);

        if(lines.Length == 1)
            lines = markup.Split(
                new string[] { "\n" },
                StringSplitOptions.RemoveEmptyEntries);

        return lines;
    }

    IEnumerable<string> DecreaseIndent(IEnumerable<string> lines) {
        var newLines = new List<string>(lines.Count());
        int indent = lines.First().TakeWhile(Char.IsWhiteSpace).Count();

        foreach(var line in lines)
            newLines.Add(line.Substring(indent));

        return newLines;
    }

    IEnumerable<string> RemoveMarginalLines(IEnumerable<string> lines) {
        return lines.Skip(1).Take(lines.Count() - 2);
    }

    protected virtual string CustomClean(string markup) {
        if(_filePath.EndsWith("Accordion.aspx"))
            return new AccordionMarkupCleaner().Clean(markup);

        if(_filePath.EndsWith("AutoComplete.aspx"))
            return new AutoCompleteMarkupCleaner().Clean(markup);

        if(_filePath.EndsWith("PasswordStrength.aspx"))
            return new PasswordStrengthMarkupCleaner().Clean(markup);

        if(_filePath.EndsWith("ReorderList.aspx"))
            return new ReorderListMarkupCleaner().Clean(markup);

        if(_filePath.EndsWith("Seadragon.aspx"))
            return new SeadragonMarkupCleaner().Clean(markup);

        if(_filePath.EndsWith("Tabs.aspx"))
            return new TabsMarkupCleaner().Clean(markup);

        if(_filePath.EndsWith("UpdatePanelAnimation.aspx"))
            return new UpdatePanelAnimationMarkupCleaner().Clean(markup);

        return markup;
    }
}