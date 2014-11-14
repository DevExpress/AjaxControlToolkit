Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Underline = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.Underline.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Underline.prototype = {
    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.Underline.callBaseMethod(this, "callMethod")) return false;
        this._designPanel._execCommand("underline", false, null);
    },

    checkState: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.Underline.callBaseMethod(this, "checkState")) return false;
        return this._designPanel._queryCommandState("underline");
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Underline.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.Underline", Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton);