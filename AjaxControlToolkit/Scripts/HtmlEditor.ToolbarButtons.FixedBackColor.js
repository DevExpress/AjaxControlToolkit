Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.FixedBackColor = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.FixedBackColor.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.FixedBackColor.prototype = {

    setColor: function(color) {
        this._designPanel._execCommand("backcolor", false, color);
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.FixedBackColor.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.FixedBackColor", Sys.Extended.UI.HtmlEditor.ToolbarButtons.FixedColorButton);