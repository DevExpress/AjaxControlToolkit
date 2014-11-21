Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeSelectButton = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeSelectButton.initializeBase(this, [element]);
    this._designPanel = null;
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeSelectButton.prototype = {

    onEditPanelActivity: function() {
        this._designPanel = this._editPanel.get_activePanel();
        this.checkState()
    },


    checkState: function() {
        if(!this.checkRangeInDesign())
            return false;

        return true;
    },

    callMethod: function(select, e) {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeSelectButton.callBaseMethod(this, "callMethod"))
            return false;

        if(this._designPanel == null)
            return false;
        if(this._designPanel.isPopup())
            return false;

        return true;
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeSelectButton.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeSelectButton", Sys.Extended.UI.HtmlEditor.ToolbarButtons.SelectButton);