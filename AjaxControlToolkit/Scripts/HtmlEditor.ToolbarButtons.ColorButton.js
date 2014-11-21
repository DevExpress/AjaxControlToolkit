Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.ColorButton = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.ColorButton.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.ColorButton.prototype = {

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.ColorButton.callBaseMethod(this, "callMethod"))
            return false;

        this.openPopup(Function.createDelegate(this, this._onopened));

        return true;
    },

    _onopened: function(contentWindow) {
        contentWindow.setColor = Function.createDelegate(this, this.setColor);
    },

    setColor: function(color) {
        this.closePopup();
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.ColorButton.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.ColorButton", Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModePopupImageButton);