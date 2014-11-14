Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.StrikeThrough = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.StrikeThrough.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.StrikeThrough.prototype = {
    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.StrikeThrough.callBaseMethod(this, "callMethod")) return false;
        this._designPanel._execCommand("strikeThrough", false, null);
    },

    checkState: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.StrikeThrough.callBaseMethod(this, "checkState")) return false;
        return this._designPanel._queryCommandState("strikeThrough");
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.StrikeThrough.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.StrikeThrough", Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton);