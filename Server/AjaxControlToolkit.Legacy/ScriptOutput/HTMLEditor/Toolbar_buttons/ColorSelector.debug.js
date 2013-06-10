Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorSelector = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorSelector.initializeBase(this, [element]);
    
    this._fixedColorButton = null;
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorSelector.prototype = {

    get_fixedColorButton: function() {
        return this._fixedColorButton;
    },

    set_fixedColorButton: function(value) {
        this._fixedColorButton = value;
    },

    callMethod: function() {
        if (!Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorSelector.callBaseMethod(this, "callMethod")) return false;
        this.openPopup(Function.createDelegate(this, this._onopened));

        return true;
    },

    _onopened: function(contentWindow) {
        contentWindow.setColor = Function.createDelegate(this, this.setColor);
    },

    setColor: function(color) {
        this.closePopup();
        if (this._fixedColorButton != null) {
            this._fixedColorButton.set_defaultColor(color);
        }
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorSelector.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorSelector", Sys.Extended.UI.HTMLEditor.ToolbarButton.Selector);

