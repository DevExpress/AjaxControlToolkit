using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;

namespace MarkupSanitizer
{
    [DebuggerDisplay("Tag: {TagName}, IsOpening: {IsOpeningTag}")]
    public class MarkupTag : IMarkupToken
    {
        readonly string _tagName;
        readonly bool _isOpeningTag;
        readonly IDictionary<string, string> _attributes;

        public MarkupTag(string tagName, bool isOpeningTag, Dictionary<string, string> attributes)
        {
            _tagName = tagName;
            _isOpeningTag = isOpeningTag;
            _attributes = attributes;
        }

        public string TagName { get { return _tagName; } }
        public bool IsOpeningTag { get { return _isOpeningTag; } }
        public IDictionary<string, string> Attributes { get { return _attributes; } }

        public void ProcessOutput(MarkupWriter writer)
        {
            TagDefinition tagDefinition = writer.GetTagDefinition(TagName);

            // If the tag is not defined, silently ignore it
            if (tagDefinition == null) return;

            if (IsOpeningTag)
            {
                // If we force a nesting, record the injection set so that we can collapse it later
                string[] injection = EnsureCorrectNesting(writer, tagDefinition);
                if (injection.Length > 0) writer.Injections.Push(injection);

                var allowedAttributes = (from a in Attributes
                                         where tagDefinition.AllowedAttributes.Contains(a.Key, StringComparer.InvariantCultureIgnoreCase)
                                         select a).ToDictionary(k => k.Key, v => v.Value);

                // We use the tag name from the definition here so that any upscaling can occur
                if (tagDefinition.IsShortcut)
                {
                    writer.ShortcutTag(tagDefinition, allowedAttributes);
                }
                else
                {
                    writer.OpenTag(tagDefinition, allowedAttributes);
                }
            }
            else
            {
                // Only continue if the tag is actually in the stack, else ignore it silently
                if (writer.OpenTags.Contains(tagDefinition.TagName, StringComparer.InvariantCultureIgnoreCase))
                {
                    // Close any tags above this one in the stack
                    while (writer.OpenTags.Count > 0 && !writer.OpenTags.Peek().Equals(tagDefinition.TagName, StringComparison.InvariantCultureIgnoreCase))
                    {
                        writer.CloseTag();
                    }

                    // If there are still open tags, we must be next in line
                    if (writer.OpenTags.Count > 0)
                    {
                        writer.CloseTag();
                    }
                }
            }
        }

        static string[] EnsureCorrectNesting(MarkupWriter writer, TagDefinition tagDefinition)
        {
            if (tagDefinition == null)
                return new string[] { };

            var injection = new List<string>();

            // If we're not allowed to have any parents at all, close them all down
            if (tagDefinition.BlockedParents.Union(tagDefinition.BlockedDirectParents).Intersect(TagDefinition.AllTags).Any())
            {
                while (writer.OpenTags.Count > 0)
                {
                    writer.CloseTag();
                }
            }

            // Keep closing tags until we get out from under any disallowed direct parents
            while (
                tagDefinition.BlockedDirectParents.Any() &&
                writer.OpenTags.Any() &&
                tagDefinition.BlockedDirectParents.Contains(writer.OpenTags.Peek()))
            {
                writer.CloseTag();
            }

            // If we have to be withing a particular direct parent, keep closing tags until we find one
            while (
                tagDefinition.RequiredDirectParents.Any() &&
                writer.OpenTags.Any() &&
                !tagDefinition.RequiredDirectParents.Contains(writer.OpenTags.Peek()))
            {
                writer.CloseTag();
            }

            // Keep closing tags until we get out from under any disallowed parents
            while (
                tagDefinition.BlockedParents.Any() &&
                writer.OpenTags.Intersect(tagDefinition.BlockedParents).Any())
            {
                writer.CloseTag();
            }

            // If we have to be within a specific parent, inject it
            if (tagDefinition.RequiredDirectParents.Any())
            {
                var directParentInjectionCandidates = (
                    from dpt in tagDefinition.RequiredDirectParents
                    where !dpt.Equals(TagDefinition.TagRoot)
                    select dpt).ToArray();
                bool haveRequiredDirectParent =
                    (writer.OpenTags.Count == 0 && tagDefinition.RequiredDirectParents.Contains(TagDefinition.TagRoot)) ||
                    (writer.OpenTags.Any() && directParentInjectionCandidates.Contains(writer.OpenTags.Last()));
                if (!haveRequiredDirectParent)
                {
                    var injectionTag = writer.GetTagDefinition(directParentInjectionCandidates.First());
                    InjectParent(writer, injection, injectionTag);
                }
            }

            if (tagDefinition.RequiredParents.Any())
            {
                var haveRequiredParent = writer.OpenTags.Intersect(tagDefinition.RequiredParents).Any();
                if (!haveRequiredParent)
                {
                    var injectionTag = writer.GetTagDefinition(tagDefinition.RequiredParents.First());
                    InjectParent(writer, injection, injectionTag);
                }
            }

            // If any injection has occurred, record the tag that caused it so we can collapse it later
            if (injection.Any())
            {
                injection.Insert(0, tagDefinition.TagName);
            }

            return injection.Distinct().ToArray();
        }

        private static void InjectParent(MarkupWriter writer, List<string> injection, TagDefinition injectionTag)
        {
            injection.Add(injectionTag.TagName);
            injection.AddRange(EnsureCorrectNesting(writer, injectionTag));
            writer.OpenTag(injectionTag, null);
        }
    }
}