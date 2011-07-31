using System;

namespace MarkupSanitizer
{
    public class SanitizedMarkup
    {
        string _markupText;
        bool _transitionalDoctypeRequired;

        public SanitizedMarkup(string markupText, bool transitionalDoctypeRequired)
        {
            _markupText = markupText;
            _transitionalDoctypeRequired = transitionalDoctypeRequired;
        }

        public string MarkupText { get { return _markupText; } }
        public bool TransitionalDoctypeRequired { get { return _transitionalDoctypeRequired; } }
    }
}