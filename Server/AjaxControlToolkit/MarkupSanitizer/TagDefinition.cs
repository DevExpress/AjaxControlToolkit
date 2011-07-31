using System;
using System.Collections.Generic;

namespace MarkupSanitizer
{
    public class TagDefinition
    {
        internal static readonly string[] AllTags = new string[] { "*" };
        internal static readonly string TagRoot = string.Empty;

        string _tagName;
        bool _isShortcut;
        string[] _requiredParents;
        string[] _requiredDirectParents;
        string[] _blockedParents;
        string[] _blockedDirectParents;
        string[] _allowedAttributes;
        string[] _legacyNames;
        bool _allowEmpty;
        bool _requiresTransitionalDoctype;

        public TagDefinition(string tagName, bool isShortcut)
            : this(tagName, isShortcut, null, null, null, null)
        {
        }

        public TagDefinition(string tagName, bool isShortcut, string[] requiredParents, string[] requiredDirectParents, string[] blockedParents, string[] blockedDirectParents)
            : this(tagName, isShortcut, requiredParents, requiredDirectParents, blockedParents, blockedDirectParents, null)
        {
        }

        public TagDefinition(string tagName, bool isShortcut, string[] requiredParents, string[] requiredDirectParents, string[] blockedParents, string[] blockedDirectParents, string[] allowedAttributes)
            : this(tagName, isShortcut, requiredParents, requiredDirectParents, blockedParents, blockedDirectParents, allowedAttributes, null, false, false)
        {
        }

        public TagDefinition(string tagName, bool isShortcut, string[] requiredParents, string[] requiredDirectParents, string[] blockedParents, string[] blockedDirectParents, string[] allowedAttributes, string[] legacyNames, bool allowEmpty, bool requiresTransitionalDoctype)
        {
            _tagName = tagName;
            _isShortcut = isShortcut;
            _requiredParents = requiredParents ?? new string[] { };
            _requiredDirectParents = requiredDirectParents ?? new string[] { };
            _blockedParents = blockedParents ?? new string[] { };
            _blockedDirectParents = blockedDirectParents ?? new string[] { };
            _allowedAttributes = allowedAttributes ?? new string[] { };
            _legacyNames = legacyNames ?? new string[] { };
            _allowEmpty = allowEmpty;
            _requiresTransitionalDoctype = requiresTransitionalDoctype;
        }

        public string TagName { get { return _tagName; } }
        public bool IsShortcut { get { return _isShortcut; } }
        public IEnumerable<string> RequiredParents { get { return _requiredParents; } }
        public IEnumerable<string> RequiredDirectParents { get { return _requiredDirectParents; } }
        public IEnumerable<string> BlockedParents { get { return _blockedParents; } }
        public IEnumerable<string> BlockedDirectParents { get { return _blockedDirectParents; } }
        public IEnumerable<string> AllowedAttributes { get { return _allowedAttributes; } }
        public IEnumerable<string> LegacyNames { get { return _legacyNames; } }
        public bool AllowEmpty { get { return _allowEmpty; } }
        public bool RequiresTransitionalDoctype { get { return _requiresTransitionalDoctype; } }
    }
}