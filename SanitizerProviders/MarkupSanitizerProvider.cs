using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AjaxControlToolkit.Sanitizer
{
    class MarkupSanitizerProvider : SanitizerProvider
    {
        private string _applicationName;
        public override string ApplicationName { 
            get
            {
                return _applicationName;
            }
            set
            {
                _applicationName = value;
            }

        }

        public override bool RequiresFullTrust
        { 
            get
            {
                return true;
            }
        }

        public override string GetSafeHtmlFragment(string htmlFragment)
        {
            return MarkupSanitizer.Sanitizer.SanitizeMarkup(htmlFragment).MarkupText;
        }
    }
}
