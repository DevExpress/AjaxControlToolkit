Type.registerNamespace("Sys.Extended.UI.HTMLEditor");
Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.ModeButton = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.ModeButton.initializeBase(this, [element]);
    
    this._activeMode = Sys.Extended.UI.HTMLEditor.ActiveModeType.Design;
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.ModeButton.prototype = {
    get_activeMode : function() {
        return this._activeMode;
    },
    set_activeMode : function(value) {
        this._activeMode = value;
    },
 
    _onclick : function(e) {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.ModeButton.callBaseMethod(this, "_onclick")) return false;
        var modeButton = this;
        setTimeout(function() {
                modeButton._editPanel.set_activeMode(modeButton._activeMode);
            },0);
        return true;
    },
    
    onEditPanelActivity : function() {
        this.setActivity(this._editPanel.get_activeMode() == this._activeMode);
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.ModeButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.ModeButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.ImageButton);

