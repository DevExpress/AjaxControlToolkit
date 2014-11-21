Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColorClear = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColorClear.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColorClear.prototype = {

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColorClear.callBaseMethod(this, "callMethod"))
            return false;

        this._designPanel._execCommand("forecolor", false, "");
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColorClear.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.ForeColorClear", Sys.Extended.UI.HtmlEditor.ToolbarButtons.MethodButton);