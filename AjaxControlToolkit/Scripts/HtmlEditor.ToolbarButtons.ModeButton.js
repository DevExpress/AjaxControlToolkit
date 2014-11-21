Type.registerNamespace("Sys.Extended.UI.HtmlEditor");
Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.ModeButton = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.ModeButton.initializeBase(this, [element]);

    this._activeMode = Sys.Extended.UI.HtmlEditor.ActiveModeType.Design;
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.ModeButton.prototype = {
    get_activeMode: function() {
        return this._activeMode;
    },

    set_activeMode: function(value) {
        this._activeMode = value;
    },

    _onclick: function(e) {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.ModeButton.callBaseMethod(this, "_onclick"))
            return false;

        var modeButton = this;
        setTimeout(function() {
            modeButton._editPanel.set_activeMode(modeButton._activeMode);
        }, 0);

        return true;
    },

    onEditPanelActivity: function() {
        this.setActivity(this._editPanel.get_activeMode() == this._activeMode);
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.ModeButton.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.ModeButton", Sys.Extended.UI.HtmlEditor.ToolbarButtons.ImageButton);