Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Italic = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.Italic.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Italic.prototype = {

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.Italic.callBaseMethod(this, "callMethod"))
            return false;

        this._designPanel._execCommand("italic", false, null);
    },

    checkState: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.Italic.callBaseMethod(this, "checkState"))
            return false;

        return this._designPanel._queryCommandState("italic");
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Italic.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.Italic", Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton);