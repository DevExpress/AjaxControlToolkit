using System;
using System.Text.RegularExpressions;

public class PasswordStrengthMarkupCleaner : MarkupCleaner {
    internal string Clean(string markup) {
        return SimplifyStrengthStyles(markup);
    }

    private string SimplifyStrengthStyles(string markup) {
        var pattern = "StrengthStyles=\"(?<value>[^\"]+?)\"";
        var match = Regex.Match(markup, pattern, RegexOptions.Singleline);

        if(match.Success) {
            var stylesValue = match.Groups["value"].Value;
            markup = markup.Replace(stylesValue, "cssClass1;cssClass2;cssClass3;cssClass4;cssClass5");
        }

        return markup;
    }
}