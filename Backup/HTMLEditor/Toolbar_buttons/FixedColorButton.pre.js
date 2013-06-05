Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedColorButton = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedColorButton.initializeBase(this, [element]);
    
    this._defaultColor = "#000000";
    this._colorDiv = null;
    this._methodButton = null;
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedColorButton.prototype = {
    get_defaultColor : function() {
        return this._defaultColor;
    },
    set_defaultColor : function(value) {
        this._defaultColor = value;
        if (this._colorDiv != null) {
            this._colorDiv.get_element().style.backgroundColor = value;
        }
    },
    
    get_colorDiv : function() {
        return this._colorDiv;
    },
    set_colorDiv : function(value) {
        this._colorDiv = value;
    },
    
    get_methodButton : function() {
        return this._methodButton;
    },
    set_methodButton : function(value) {
        this._methodButton = value;
    },
    
    callMethod : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedColorButton.callBaseMethod(this, "callMethod")) return false;
        this.setColor(this.get_defaultColor());
    },
    
    setColor : function(color) {
    },

    initialize : function() {
        Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedColorButton.callBaseMethod(this, "initialize");
        
        if (this._methodButton != null) {
            this._methodButton.callMethod = Function.createDelegate(this, this.callMethod);
        }
        if (this._colorDiv != null) {
            this._colorDiv.callMethod = Function.createDelegate(this, this.callMethod);
        }
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedColorButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedColorButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeBoxButton);

