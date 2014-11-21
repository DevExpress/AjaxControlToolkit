Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.IncreaseIndent = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.IncreaseIndent.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.IncreaseIndent.prototype = {

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.IncreaseIndent.callBaseMethod(this, "callMethod"))
            return false;
        this._designPanel._execCommand("Indent");
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.IncreaseIndent.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.IncreaseIndent", Sys.Extended.UI.HtmlEditor.ToolbarButtons.MethodButton);