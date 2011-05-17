Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator.prototype = {
    
    isImage : function() {
        return false;
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator", Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeImageButton);

