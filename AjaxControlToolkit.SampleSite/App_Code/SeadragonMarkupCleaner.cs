using System;
using System.Text.RegularExpressions;
using System.Linq;

public class SeadragonMarkupCleaner : MarkupCleaner {
    internal string Clean(string markup) {
        markup = RemoveMenuAttributes(markup);
        return RemoveMenuStyleTags(markup);
    }

    string RemoveMenuStyleTags(string markup) {
        var pattern = "<asp:Menu[^>]+?>(?<styles>.+?)<Items>";
        var match = Regex.Match(markup, pattern, RegexOptions.Singleline);

        if(match.Success) {
            var stylesString = match.Groups["styles"].Value;
            var stylesLines = stylesString.Split(new string[] { "\r\n" }, StringSplitOptions.None);
            var newStyleLines = String.Join("\r\n", stylesLines.First(), stylesLines.Last() + "set menu style", stylesLines.Last());
            markup = markup.Replace(match.Groups["styles"].Value, newStyleLines);
        }

        return markup;
    }

    string RemoveMenuAttributes(string markup) {
        var pattern = "<asp:Menu\\s+runat=\"server\"(?<attributes>[^>]+?)>";
        var match = Regex.Match(markup, pattern, RegexOptions.Singleline);

        if(match.Success)
            markup = markup.Replace(match.Groups["attributes"].Value, "");

        return markup;
    }
}