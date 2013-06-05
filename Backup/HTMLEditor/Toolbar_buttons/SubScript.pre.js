Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.SubScript = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.SubScript.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.SubScript.prototype = {
    callMethod : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.SubScript.callBaseMethod(this, "callMethod")) return false;
        this._designPanel._execCommand("subScript", false, null);
    },
    
    checkState : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.SubScript.callBaseMethod(this, "checkState")) return false;
        return this._designPanel._queryCommandState("subScript");
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.SubScript.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.SubScript", Sys.Extended.UI.HTMLEditor.ToolbarButton.EditorToggleButton);

