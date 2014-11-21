Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyRight = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyRight.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyRight.prototype = {

    checkState: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyRight.callBaseMethod(this, "checkState"))
            return false;

        return this._designPanel._textAlignState("right");
    },

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyRight.callBaseMethod(this, "callMethod"))
            return false;

        this._designPanel._execCommand("JustifyRight");
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyRight.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.JustifyRight", Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton);