using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

using System.Web;

namespace MarkupSanitizer
{
    public class MarkupWriter
    {
        const string OpenTagFormat = "<{0}{1}>";
        const string ShortcutTagFormat = "<{0}{1} />";
        const string CloseTagFormat = "</{0}>";
        const string AttributeFormat = " {0}=\"{1}\"";

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2104:DoNotDeclareReadOnlyMutableReferenceTypes", Justification = "It is immutable.")]
        public static readonly TagDefinition ParagraphTag = new TagDefinition("p", false, null, new[] { TagDefinition.TagRoot, "dt", "dd", "li", "td", "th" }, new[] { "p" }, null);

        StringBuilder Output { get; set; }

        public Stack<string> OpenTags { get; private set; }
        public Stack<string[]> Injections { get; private set; }
        public IDictionary<string, TagDefinition> AllowedTags { get; private set; }
        public bool TransitionalDoctypeRequired { get; private set; }

        public MarkupWriter(IDictionary<string, TagDefinition> allowedTags)
        {
            Output = new StringBuilder();
            OpenTags = new Stack<string>();
            Injections = new Stack<string[]>();
            AllowedTags = allowedTags;
            TransitionalDoctypeRequired = false;
        }

        public TagDefinition GetTagDefinition(string tagName)
        {
            TagDefinition td = null;
            if (AllowedTags.TryGetValue(tagName, out td))
            {
                return td;
            }

            return null;
        }

        public void OpenTag(TagDefinition tagDefinition, Dictionary<string, string> attributes)
        {
            string tagName = tagDefinition.TagName;

            CollapseInjections(tagName);

            OpenTags.Push(tagName);
            Output.AppendFormat(OpenTagFormat, tagName, FormatAttributes(attributes));

            if (tagDefinition.RequiresTransitionalDoctype)
            {
                TransitionalDoctypeRequired = true;
            }
        }

        private void CollapseInjections(string nextTagName)
        {
            if (Injections.Count > 0)
            {
                var lastInjection = Injections.Last();

                var openInjectionTags = OpenTags.Take(lastInjection.Length).ToList();
                var openInjectionTagsCount = openInjectionTags.Count;

                if (!string.IsNullOrEmpty(nextTagName))
                {
                    openInjectionTags.Insert(0, nextTagName);
                }

                var isLastInjectionActiveOnStack = lastInjection.SequenceEqual(openInjectionTags);

                if (!isLastInjectionActiveOnStack)
                {
                    Injections.Pop();
                    CloseTagsInternal(openInjectionTagsCount);
                }
            }
        }

        public void ShortcutTag(TagDefinition tagDefinition, Dictionary<string, string> attributes)
        {
            string tagName = tagDefinition.TagName;
            Output.AppendFormat(ShortcutTagFormat, tagName, FormatAttributes(attributes));
        }

        static string FormatAttributes(Dictionary<string, string> attributes)
        {
            if (attributes == null)
            {
                attributes = new Dictionary<string, string>();
            }

            

            var formatted = from a in attributes
                            select string.Format(AttributeFormat, a.Key, Microsoft.Security.Application.Encoder.HtmlAttributeEncode(a.Value));//HttpUtility.HtmlAttributeEncode(a.Value));
            // The leading space is included on each attribute, not as a separator, so that a
            // leading space is returned from this method whenever there are attributes present
            return string.Join(string.Empty, formatted.ToArray());
        }

        public void CloseTag()
        {
            CloseTagsInternal(1);
        }

        private void CloseTagsInternal(int count)
        {
            for (var i = 0; i < count; i++)
            {
                Output.AppendFormat(CloseTagFormat, OpenTags.Pop());
            }
        }

        public override string ToString()
        {
            return Output.ToString();
        }

        public void Append(string text)
        {
            var containsNonWhiteSpaceCharacters = text.ToCharArray().Count(c => !char.IsWhiteSpace(c)) > 0;

            if (containsNonWhiteSpaceCharacters)
            {
                CollapseInjections(string.Empty);
            }

            if (OpenTags.Count == 0)
            {
                OpenTag(ParagraphTag, null);
            }

            Output.Append(text);
        }
    }
}