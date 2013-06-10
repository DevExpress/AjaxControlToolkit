Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorClear = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorClear.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorClear.prototype = {
    callMethod : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorClear.callBaseMethod(this, "callMethod")) return false;
        this._designPanel._execCommand("forecolor", false, "");
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorClear.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorClear", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);

