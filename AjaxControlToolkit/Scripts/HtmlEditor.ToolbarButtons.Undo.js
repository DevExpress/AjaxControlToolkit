Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Undo = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.Undo.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Undo.prototype = {
    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.Undo.callBaseMethod(this, "callMethod")) return false;
        this._designPanel.undo();
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Undo.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.Undo", Sys.Extended.UI.HtmlEditor.ToolbarButtons.MethodButton);