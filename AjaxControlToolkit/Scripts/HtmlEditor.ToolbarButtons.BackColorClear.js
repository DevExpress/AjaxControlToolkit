Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.BackColorClear = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.BackColorClear.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.BackColorClear.prototype = {

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.BackColorClear.callBaseMethod(this, "callMethod"))
            return false;

        this._designPanel._execCommand("backcolor", false, "");
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.BackColorClear.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.BackColorClear", Sys.Extended.UI.HtmlEditor.ToolbarButtons.MethodButton);