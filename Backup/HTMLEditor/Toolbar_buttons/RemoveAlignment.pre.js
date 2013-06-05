Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveAlignment = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveAlignment.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveAlignment.prototype = {
    checkState : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveAlignment.callBaseMethod(this, "checkState")) return false;
        return this._designPanel._textAlignState(null);
    },
    
    callMethod : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveAlignment.callBaseMethod(this, "callMethod")) return false;
        var editor = this._designPanel;
        var editPanel = this._editPanel;
        editor._saveContent();
        editor.MSIE_justify("left", true);
        editor.onContentChanged();
        setTimeout(function(){editPanel.updateToolbar();},0);
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveAlignment.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveAlignment", Sys.Extended.UI.HTMLEditor.ToolbarButton.EditorToggleButton);

