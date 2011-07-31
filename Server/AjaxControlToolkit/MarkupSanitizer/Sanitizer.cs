using System;
using System.Linq;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace MarkupSanitizer
{
    public static class Sanitizer
    {
        static readonly Regex TagRegex = new Regex(@"<(?<tagClose>/?)(?<tagName>[?]?[\w!-:]+)\s*(?<tagAttributes>.*?)\s*>");
        const string TagExpressionCloseGroup = "tagClose";
        const string TagExpressionNameGroup = "tagName";
        const string TagExpressionAttributesGroup = "tagAttributes";

        static readonly Regex EmptyTagRegex = new Regex(@"<(?<tagName>\w+)\s*[^>]*?\s*>([\s]|&#160;)*?</\k<tagName>\s*>");
        const string EmptyTagNameGroup = "tagName";
        const short EmptyTagPassCount = 2;

        static readonly Regex CharacterEscapeRegex = new Regex(@"&((?<namedEscape>\w*)|(?:#(?<numericEscape>\d+)));");

        static readonly Regex WhiteSpaceRegex = new Regex(@"\s+");

        static readonly Regex AttributeRegex = new Regex(@"((?<name>[\w-]+)=(?<quote>['""])(?<value>.*?)\k<quote>)|((?<name>[\w-]+)=(?<value>[^\s]+))");
        const string AttributeExpressionNameGroup = "name";
        const string AttributeExpressionValueGroup = "value";

        static IDictionary<string, TagDefinition> allowedTags;

        public static SanitizedMarkup SanitizeMarkup(string inputMarkup)
        {
            var writer = new MarkupWriter(GetAllowedTags());

            var tokens = TokenizeMarkup(inputMarkup);

            foreach (var token in tokens)
            {
                token.ProcessOutput(writer);
            }

            while (writer.OpenTags.Count > 0)
            {
                writer.CloseTag();
            }

            string markupText = writer.ToString();

            for (int i = 0; i < EmptyTagPassCount; i++ )
            {
                markupText = EmptyTagRegex.Replace(markupText, new MatchEvaluator(match =>
                {
                    var tagName = match.Groups[EmptyTagNameGroup].Value;
                    var tagDefinition = writer.GetTagDefinition(tagName);
                    return tagDefinition.AllowEmpty ? match.Value : string.Empty;
                }));
            }

            return new SanitizedMarkup(markupText, writer.TransitionalDoctypeRequired);
        }

        public static string RemoveAllTags(string markup)
        {
            var tagsStripped = TagRegex.Replace(markup, " ");
            return WhiteSpaceRegex.Replace(tagsStripped, " ").Trim();
        }

        public static IMarkupToken[] TokenizeMarkup(string markup)
        {
            var tokens = new List<IMarkupToken>();
            var capturedLength = 0;

            var tags = TagRegex.Matches(markup);

            foreach (Match tag in tags)
            {
                // If there's text between this tag and the previous one, capture it as a token
                if (tag.Index > capturedLength)
                {
                    var textLength = tag.Index - capturedLength;
                    var rawText = markup.Substring(capturedLength, textLength);
                    var unescapedText = DecodeCharacterEscapes(rawText);
                    tokens.Add(new MarkupBlob(unescapedText));
                    capturedLength += textLength;
                }

                // Capture the tag itself as a token
                tokens.Add(new MarkupTag
                (
                    tag.Groups[TagExpressionNameGroup].Value,
                    tag.Groups[TagExpressionCloseGroup].Length == 0,
                    ParseAttributes(tag.Groups[TagExpressionAttributesGroup].Value)
                ));
                capturedLength += tag.Length;
            }

            // If there's any text left, capture it as a blob
            if (capturedLength < markup.Length)
            {
                var rawText = markup.Substring(capturedLength);
                var unescapedText = DecodeCharacterEscapes(rawText);
                tokens.Add(new MarkupBlob(unescapedText));
            }

            return tokens.ToArray();
        }

        static string DecodeCharacterEscapes(string rawText)
        {
            var unescapedText = CharacterEscapeRegex.Replace(rawText, new MatchEvaluator(match => System.Web.HttpUtility.HtmlDecode(match.Value)));
            return unescapedText;
        }

        static Dictionary<string, string> ParseAttributes(string formatted)
        {
            var attributes = new Dictionary<string, string>();

            var matches = AttributeRegex.Matches(formatted);

            foreach (Match match in matches)
            {
                var attributeName = match.Groups[AttributeExpressionNameGroup].Value;
                var attributeValue = match.Groups[AttributeExpressionValueGroup].Value;
                var attributeValueUnescaped = DecodeCharacterEscapes(attributeValue);
                attributes.Add(attributeName, attributeValueUnescaped);
            }

            return attributes;
        }

        static IDictionary<string, TagDefinition> GetAllowedTags()
        {
            if (allowedTags == null)
            {
                string[] StandardContentHolders = new[] { "p", "li", "td", "dt", "dd" };

                var allowedTagsList = new List<TagDefinition>(new[]
                {
                    MarkupWriter.ParagraphTag,
                    new TagDefinition("span", false, StandardContentHolders, null, null, null),
                    
                    new TagDefinition("a", false, StandardContentHolders, null, null, null, new[] { "href", "title" }),
                    new TagDefinition("img", true, StandardContentHolders, null, null, null, new[] { "src", "alt" }),
                    
                    new TagDefinition("h1", false),
                    new TagDefinition("h2", false),
                    new TagDefinition("h3", false),
                    new TagDefinition("h4", false),
                    new TagDefinition("h5", false),
                    new TagDefinition("h6", false),

                    new TagDefinition("strong", false, StandardContentHolders, null, null, null, null, new[] { "b" }, false, false),
                    new TagDefinition("em", false, StandardContentHolders, null, null, null, null, new[] { "i" }, false, false),
                    new TagDefinition("abbr", false, StandardContentHolders, null, null, null),
                    new TagDefinition("acronym", false, StandardContentHolders, null, null, null),
                    
                    new TagDefinition("dl", false, null, null, new[] { "p" }, null),
                    new TagDefinition("dt", false, null, new[] { "dl" }, null, null),
                    new TagDefinition("dd", false, null, new[] { "dl" }, null, null),
                    
                    new TagDefinition("ol", false, null, new[] { TagDefinition.TagRoot, "li", "td", "th", "dt", "dd" }, new[] { "p" }, null),
                    new TagDefinition("ul", false, null, new[] { TagDefinition.TagRoot, "li", "td", "th", "dt", "dd" } , new[] { "p" }, null),
                    new TagDefinition("li", false, new[] { "ul", "ol" }, null, null, new[] { "li" }),
                    
                    new TagDefinition("table", false, null, null, TagDefinition.AllTags, null),
                    new TagDefinition("tr", false, new[] { "table", "tbody", "thead", "tfoot" }, null, null, null),
                    new TagDefinition("td", false, new[] { "tr" }, null, null, null, new[] { "colspan", "rowspan" }, null, true, false),
                    new TagDefinition("th", false, new[] { "tr" }, null, null, null),
                    
                    new TagDefinition("iframe", false, null, null, TagDefinition.AllTags, null, new[] { "src" }, null, true, true)
                });

                var dict = new Dictionary<string, TagDefinition>(StringComparer.InvariantCultureIgnoreCase);
                foreach (var tagDefinition in allowedTagsList)
                {
                    dict.Add(tagDefinition.TagName, tagDefinition);
                    if (tagDefinition.LegacyNames != null)
                    {
                        foreach (string legacyTag in tagDefinition.LegacyNames)
                        {
                            dict.Add(legacyTag, tagDefinition);
                        }
                    }
                }

                Sanitizer.allowedTags = dict;
                
            }

            return allowedTags;
        }
    }
}