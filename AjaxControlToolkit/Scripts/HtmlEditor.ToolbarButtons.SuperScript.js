Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.SuperScript = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.SuperScript.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.SuperScript.prototype = {
    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.SuperScript.callBaseMethod(this, "callMethod")) return false;
        this._designPanel._execCommand("superScript", false, null);
    },

    checkState: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.SuperScript.callBaseMethod(this, "checkState")) return false;
        return this._designPanel._queryCommandState("superScript");
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.SuperScript.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.SuperScript", Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton);