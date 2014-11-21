Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyFull = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyFull.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyFull.prototype = {

    checkState: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyFull.callBaseMethod(this, "checkState"))
            return false;

        return this._designPanel._textAlignState("justify");
    },

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyFull.callBaseMethod(this, "callMethod"))
            return false;

        this._designPanel._execCommand("JustifyFull");
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyFull.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyFull", Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton);