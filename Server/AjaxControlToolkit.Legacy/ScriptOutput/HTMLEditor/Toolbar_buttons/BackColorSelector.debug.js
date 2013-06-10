Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorSelector = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorSelector.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorSelector.prototype = {
    callMethod : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorSelector.callBaseMethod(this, "callMethod")) return false;
    },
    
    setColor : function(color) {
        Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorSelector.callBaseMethod(this, "setColor", [color]);
        this._designPanel._execCommand("backcolor", false, color);
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorSelector.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorSelector", Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorSelector);

