Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton.prototype = {

    onEditPanelActivity: function() {
        Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton.callBaseMethod(this, "onEditPanelActivity");
        this.setActivity(this.checkState());
    },

    checkState: function() {
        if(!this.checkRangeInDesign())
            return false;

        return true;
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton", Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeImageButton);