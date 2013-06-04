Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.EditorToggleButton = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.EditorToggleButton.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.EditorToggleButton.prototype = {
    onEditPanelActivity: function() {
        Sys.Extended.UI.HTMLEditor.ToolbarButton.EditorToggleButton.callBaseMethod(this, "onEditPanelActivity");
        this.setActivity(this.checkState());
    },

    checkState: function() {
        if (!this.checkRangeInDesign()) return false;
        return true;
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.EditorToggleButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.EditorToggleButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeImageButton);

