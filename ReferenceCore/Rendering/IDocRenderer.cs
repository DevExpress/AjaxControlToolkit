using System.Collections.Generic;

namespace AjaxControlToolkit.Reference.Core.Rendering {

    public interface IDocRenderer {
        string RenderHeader(string text, int level = 1);
        string RenderText(string text, bool bold = false, bool italic = false);
        string RenderLineBreak();
        string RenderListItem(string text, bool ordered = false, int level = 1);
    }
}