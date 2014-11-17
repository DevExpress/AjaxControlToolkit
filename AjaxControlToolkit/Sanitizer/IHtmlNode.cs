using System.Collections.Generic;

namespace AjaxControlToolkit.HtmlEditor.Sanitizer {

    public interface IHtmlNode {
        string Name { get; }
        IEnumerable<IHtmlNode> Children { get; }
        IEnumerable<IHtmlAttribute> Attributes { get; }
        void Remove();
    }

}