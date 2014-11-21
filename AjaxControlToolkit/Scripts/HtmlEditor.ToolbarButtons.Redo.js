Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Redo = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.Redo.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Redo.prototype = {
    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.Redo.callBaseMethod(this, "callMethod"))
            return false;

        this._designPanel.redo();
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Redo.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.Redo", Sys.Extended.UI.HtmlEditor.ToolbarButtons.MethodButton);