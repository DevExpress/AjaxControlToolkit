Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.Cut = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.Cut.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.Cut.prototype = {
    callMethod : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Cut.callBaseMethod(this, "callMethod")) return false;
        var editor = this._designPanel;

        if(Sys.Extended.UI.HTMLEditor.isIE) {
            editor.openWait();
            setTimeout(function(){editor.isShadowed(); editor._copyCut('x',true); editor.closeWait();},0)
        } else {
            editor._copyCut('x',true);
        }
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.Cut.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.Cut", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);

