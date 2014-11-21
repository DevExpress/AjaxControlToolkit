Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.BackColorSelector = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.BackColorSelector.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.BackColorSelector.prototype = {

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.BackColorSelector.callBaseMethod(this, "callMethod"))
            return false;
    },

    setColor: function(color) {
        Sys.Extended.UI.HtmlEditor.ToolbarButtons.BackColorSelector.callBaseMethod(this, "setColor", [color]);
        this._designPanel._execCommand("backcolor", false, color);
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.BackColorSelector.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.BackColorSelector", Sys.Extended.UI.HtmlEditor.ToolbarButtons.ColorSelector);