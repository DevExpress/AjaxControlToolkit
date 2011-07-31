using System;
using System.Collections.Generic;
using System.Text;
using System.Diagnostics;

namespace MarkupSanitizer
{
    public interface IMarkupToken
    {
        void ProcessOutput(MarkupWriter writer);
    }
}