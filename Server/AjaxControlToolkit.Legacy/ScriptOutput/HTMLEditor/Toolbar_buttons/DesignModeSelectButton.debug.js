Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeSelectButton = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeSelectButton.initializeBase(this, [element]);
    this._designPanel = null;
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeSelectButton.prototype = {
    onEditPanelActivity: function() {
        this._designPanel = this._editPanel.get_activePanel();
        this.checkState()
    },


    checkState: function() {
        if (!this.checkRangeInDesign()) return false;
        return true;
    },

    callMethod: function(select, e) {
        if (!Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeSelectButton.callBaseMethod(this, "callMethod")) return false;
        if (this._designPanel == null) return false;
        if (this._designPanel.isPopup()) return false;

        return true;
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeSelectButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeSelectButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.SelectButton);

