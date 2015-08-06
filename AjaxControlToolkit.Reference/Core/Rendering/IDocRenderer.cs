using System.Collections.Generic;

namespace AjaxControlToolkit.Reference.Core.Rendering {

    public interface IDocRenderer {
        string RenderHeader(string text, int level = 1);
        string RenderText(string text, bool bold = false, bool italic = false);
        string RenderLink(string text, string url);
        
        string RenderList(IEnumerable<DocListItem> items);
        string RenderListItem(string text, bool ordered = false);
    }
}