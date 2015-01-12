namespace AjaxControlToolkit.HtmlEditor.Sanitizer {

    public interface IHtmlAttribute {
        string Name { get; }
        string Value { get; set; }
        void Remove();
    }

}