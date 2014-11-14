Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.SubScript = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.SubScript.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.SubScript.prototype = {
    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.SubScript.callBaseMethod(this, "callMethod")) return false;
        this._designPanel._execCommand("subScript", false, null);
    },

    checkState: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.SubScript.callBaseMethod(this, "checkState")) return false;
        return this._designPanel._queryCommandState("subScript");
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.SubScript.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.SubScript", Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton);