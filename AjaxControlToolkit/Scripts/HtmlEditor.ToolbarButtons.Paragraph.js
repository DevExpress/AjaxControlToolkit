Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Paragraph = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.Paragraph.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Paragraph.prototype = {
    checkState: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.Paragraph.callBaseMethod(this, "checkState"))
            return false;

        return this._designPanel._textAlignState("");
    },

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.Paragraph.callBaseMethod(this, "callMethod"))
            return false;

        this._designPanel._execCommand("Paragraph");
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Paragraph.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.Paragraph", Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton);