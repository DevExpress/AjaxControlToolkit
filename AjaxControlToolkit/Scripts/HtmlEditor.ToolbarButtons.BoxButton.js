Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.BoxButton = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.BoxButton.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.BoxButton.prototype = {

    initialize: function() {
        Sys.Extended.UI.HtmlEditor.ToolbarButtons.BoxButton.callBaseMethod(this, "initialize");
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.BoxButton.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.BoxButton", Sys.Extended.UI.HtmlEditor.ToolbarButtons.CommonButton);