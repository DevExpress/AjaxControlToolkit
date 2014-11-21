Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeBoxButton = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeBoxButton.initializeBase(this, [element]);

    this._designPanel = null;
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeBoxButton.prototype = {

    _onmousedown: function(e) {
        if(this._designPanel == null)
            return false;

        if(this._designPanel.isPopup())
            return false;

        if(Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeBoxButton.callBaseMethod(this, "_onmousedown", [e]) === null)
            return false;

        this.callMethod();

        return false;
    },

    onEditPanelActivity: function() {
        this._designPanel = this._editPanel.get_activePanel();
    },

    callMethod: function() {
        if(this._designPanel == null)
            return false;

        if(this._designPanel.isPopup())
            return false;

        return true;
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeBoxButton.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModeBoxButton", Sys.Extended.UI.HtmlEditor.ToolbarButtons.BoxButton);

