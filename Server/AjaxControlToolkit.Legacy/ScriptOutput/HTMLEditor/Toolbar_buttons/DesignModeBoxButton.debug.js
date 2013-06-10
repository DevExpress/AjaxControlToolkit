Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeBoxButton = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeBoxButton.initializeBase(this, [element]);

    this._designPanel = null;
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeBoxButton.prototype = {
    _onmousedown : function(e) {
        if(this._designPanel == null) return false;
        if(this._designPanel.isPopup()) return false;
        if(Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeBoxButton.callBaseMethod(this, "_onmousedown",[e])===null) return false;
        this.callMethod();
        return false;
    },
    
    onEditPanelActivity : function() {
        this._designPanel = this._editPanel.get_activePanel();
    },
    
    callMethod : function() {
        if(this._designPanel == null) return false;
        if(this._designPanel.isPopup()) return false;
        return true;
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeBoxButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeBoxButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.BoxButton);

