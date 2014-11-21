Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColor = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColor.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColor.prototype = {

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColor.callBaseMethod(this, "callMethod"))
            return false;
    },

    setColor: function(color) {
        Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColor.callBaseMethod(this, "setColor", [color]);
        this._designPanel._execCommand("forecolor", false, color);
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColor.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColor", Sys.Extended.UI.HtmlEditor.ToolbarButtons.ColorButton);