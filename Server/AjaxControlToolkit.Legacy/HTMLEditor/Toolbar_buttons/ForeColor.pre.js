Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColor = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColor.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColor.prototype = {
    callMethod : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColor.callBaseMethod(this, "callMethod")) return false;
    },
    
    setColor : function(color) {
        Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColor.callBaseMethod(this, "setColor", [color]);
        this._designPanel._execCommand("forecolor", false, color);
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColor.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColor", Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorButton);

