using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AjaxControlToolkit.Reference.Core.Rendering {

    public interface IDocRenderer {
        string RenderText(string text, bool isBold, bool isItalic);
        string RenderListItem(string text, bool isNumbered);
        string RenderAnchor(string text, string url);
        string RenderHeader(string text, int level);
    }

}