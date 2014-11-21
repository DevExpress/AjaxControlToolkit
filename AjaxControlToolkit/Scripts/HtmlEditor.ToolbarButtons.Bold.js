Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Bold = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.Bold.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Bold.prototype = {

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.Bold.callBaseMethod(this, "callMethod"))
            return false;

        this._designPanel._execCommand("bold", false, null);
    },

    checkState: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.Bold.callBaseMethod(this, "checkState"))
            return false;

        return this._designPanel._queryCommandState("bold");
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Bold.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.Bold", Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton);