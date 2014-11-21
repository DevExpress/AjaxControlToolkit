Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyLeft = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyLeft.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyLeft.prototype = {

    checkState: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyLeft.callBaseMethod(this, "checkState"))
            return false;

        return this._designPanel._textAlignState("left");
    },

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyLeft.callBaseMethod(this, "callMethod"))
            return false;

        this._designPanel._execCommand("JustifyLeft");
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyLeft.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyLeft", Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton);