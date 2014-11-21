Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.DecreaseIndent = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.DecreaseIndent.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.DecreaseIndent.prototype = {

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.DecreaseIndent.callBaseMethod(this, "callMethod"))
            return false;

        this._designPanel._execCommand("Outdent");
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.DecreaseIndent.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.DecreaseIndent", Sys.Extended.UI.HtmlEditor.ToolbarButtons.MethodButton);

