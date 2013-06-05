Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.Underline = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.Underline.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.Underline.prototype = {
    callMethod : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Underline.callBaseMethod(this, "callMethod")) return false;
        this._designPanel._execCommand("underline", false, null);
    },
    
    checkState : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Underline.callBaseMethod(this, "checkState")) return false;
        return this._designPanel._queryCommandState("underline");
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.Underline.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.Underline", Sys.Extended.UI.HTMLEditor.ToolbarButton.EditorToggleButton);


