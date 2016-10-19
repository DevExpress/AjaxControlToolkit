using System;
using System.Text.RegularExpressions;

public class ReorderListMarkupCleaner : MarkupCleaner {
    internal string Clean(string markup) {
        markup = RemoveItemTemplateContent(markup);
        markup = RemoveEditItemTemplateContent(markup);
        markup = RemoveReorderTemplateContent(markup);
        markup = RemoveDragHandleTemplateContent(markup);
        return RemoveInsertItemTemplateContent(markup);
    }

    string RemoveDragHandleTemplateContent(string markup) {
        return RemoveTagContent(markup, "DragHandleTemplate");
    }

    string RemoveReorderTemplateContent(string markup) {
        return RemoveTagContent(markup, "ReorderTemplate");
    }

    string RemoveItemTemplateContent(string markup) {
        return RemoveTagContent(markup, "ItemTemplate");
    }

    string RemoveEditItemTemplateContent(string markup) {
        return RemoveTagContent(markup, "EditItemTemplate");
    }

    string RemoveInsertItemTemplateContent(string markup) {
        return RemoveTagContent(markup, "InsertItemTemplate");
    }
}