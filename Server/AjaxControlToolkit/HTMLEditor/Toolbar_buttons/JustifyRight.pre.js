Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyRight = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyRight.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyRight.prototype = {
    checkState : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyRight.callBaseMethod(this, "checkState")) return false;
        return this._designPanel._textAlignState("right");
    },
    
    callMethod : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyRight.callBaseMethod(this, "callMethod")) return false;
        this._designPanel._execCommand("JustifyRight");
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyRight.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyRight", Sys.Extended.UI.HTMLEditor.ToolbarButton.EditorToggleButton);

