Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedBackColor = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedBackColor.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedBackColor.prototype = {
    setColor : function(color) {
        this._designPanel._execCommand("backcolor", false, color);
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedBackColor.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedBackColor", Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedColorButton);

