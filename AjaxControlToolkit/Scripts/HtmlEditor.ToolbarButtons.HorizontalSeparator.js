Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.HorizontalSeparator = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.HorizontalSeparator.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.HorizontalSeparator.prototype = {

    isImage: function() {
        return false;
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.HorizontalSeparator.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.HorizontalSeparator", Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeImageButton);