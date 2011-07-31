using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

using System.Diagnostics;
using System.Web;

namespace MarkupSanitizer
{
    [DebuggerDisplay("Blob: {UnescapedText}")]
    public class MarkupBlob : IMarkupToken
    {
        static readonly Regex NoiseRegex = new Regex(@"(&#13;|&#10;)");

        public string UnescapedText { get; private set; }

        public MarkupBlob(string unescapedText)
        {
            UnescapedText = unescapedText;
        }

        public void ProcessOutput(MarkupWriter writer)
        {
            var encodedText = //HttpUtility.HtmlEncode(UnescapedText);
                Microsoft.Security.Application.Encoder.HtmlEncode(UnescapedText);
                //AntiXss.HtmlEncode(UnescapedText);
            var cleanedText = NoiseRegex.Replace(encodedText, string.Empty);
            writer.Append(cleanedText);
        }
    }
}