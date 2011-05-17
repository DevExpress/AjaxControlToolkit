Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.SuperScript = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.SuperScript.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.SuperScript.prototype = {
    callMethod : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.SuperScript.callBaseMethod(this, "callMethod")) return false;
        this._designPanel._execCommand("superScript", false, null);
    },
    
    checkState : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.SuperScript.callBaseMethod(this, "checkState")) return false;
        return this._designPanel._queryCommandState("superScript");
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.SuperScript.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.SuperScript", Sys.Extended.UI.HTMLEditor.ToolbarButton.EditorToggleButton);

