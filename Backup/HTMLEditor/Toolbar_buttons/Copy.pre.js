Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.Copy = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.Copy.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.Copy.prototype = {
    canBeShown : function() {
        return Sys.Extended.UI.HTMLEditor.isIE;
    },
    
    callMethod : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Copy.callBaseMethod(this, "callMethod")) return false;
        var editor = this._designPanel;

        if(Sys.Extended.UI.HTMLEditor.isIE) {
            editor.openWait();
            setTimeout(function(){editor.isShadowed(); editor._copyCut('c',true); editor.closeWait(); editor._ifShadow();},0)
        } else {
            editor._copyCut('c',true);
        }
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.Copy.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.Copy", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);

