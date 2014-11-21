Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColorSelector = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColorSelector.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColorSelector.prototype = {

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColorSelector.callBaseMethod(this, "callMethod"))
            return false;
    },

    setColor: function(color) {
        Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColorSelector.callBaseMethod(this, "setColor", [color]);
        this._designPanel._execCommand("forecolor", false, color);
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColorSelector.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColorSelector", Sys.Extended.UI.HtmlEditor.ToolbarButtons.ColorSelector);