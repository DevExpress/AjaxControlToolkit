Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorSelector = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorSelector.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorSelector.prototype = {
    callMethod : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorSelector.callBaseMethod(this, "callMethod")) return false;
    },
    
    setColor : function(color) {
        Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorSelector.callBaseMethod(this, "setColor", [color]);
        this._designPanel._execCommand("forecolor", false, color);
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorSelector.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorSelector", Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorSelector);

