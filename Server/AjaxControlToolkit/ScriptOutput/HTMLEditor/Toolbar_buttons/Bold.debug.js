Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.Bold = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.Bold.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.Bold.prototype = {
    callMethod : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Bold.callBaseMethod(this, "callMethod")) return false;
        this._designPanel._execCommand("bold", false, null);
    },
    
    checkState : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Bold.callBaseMethod(this, "checkState")) return false;
        return this._designPanel._queryCommandState("bold");
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.Bold.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.Bold", Sys.Extended.UI.HTMLEditor.ToolbarButton.EditorToggleButton);

