Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.FixedForeColor = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.FixedForeColor.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.FixedForeColor.prototype = {

    setColor: function(color) {
        this._designPanel._execCommand("forecolor", false, color);
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.FixedForeColor.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.FixedForeColor", Sys.Extended.UI.HtmlEditor.ToolbarButtons.FixedColorButton);