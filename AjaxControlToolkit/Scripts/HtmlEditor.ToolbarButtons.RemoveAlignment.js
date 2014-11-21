Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveAlignment = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveAlignment.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveAlignment.prototype = {
    checkState: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveAlignment.callBaseMethod(this, "checkState"))
            return false;

        return this._designPanel._textAlignState(null);
    },

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveAlignment.callBaseMethod(this, "callMethod"))
            return false;

        var editor = this._designPanel,
            editPanel = this._editPanel;

        editor._saveContent();
        editor.MSIE_justify("left", true);
        editor.onContentChanged();

        setTimeout(function() {
            editPanel.updateToolbar();
        }, 0);
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveAlignment.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveAlignment", Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton);