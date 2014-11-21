Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyCenter = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyCenter.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyCenter.prototype = {

    checkState: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyCenter.callBaseMethod(this, "checkState"))
            return false;

        return this._designPanel._textAlignState("center");
    },

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyCenter.callBaseMethod(this, "callMethod"))
            return false;

        this._designPanel._execCommand("JustifyCenter");
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyCenter.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyCenter", Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton);