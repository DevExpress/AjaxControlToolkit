Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorButton = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorButton.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorButton.prototype = {

    callMethod : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorButton.callBaseMethod(this, "callMethod")) return false;
        this.openPopup(Function.createDelegate(this, this._onopened));
        return true;
    },
    
    _onopened : function(contentWindow) {
        contentWindow.setColor = Function.createDelegate(this, this.setColor);
    },
    
    setColor : function(color) {
        this.closePopup();
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModePopupImageButton);
