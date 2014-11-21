Type.registerNamespace("Sys.Extended.UI.HtmlEditor");

Sys.Extended.UI.HtmlEditor.ActiveModeChangedArgs = function(oldMode, newMode, editPanel) {
    if(arguments.length != 3)
        throw Error.parameterCount();

    //Calling the base class constructor     
    Sys.Extended.UI.HtmlEditor.ActiveModeChangedArgs.initializeBase(this);

    this._oldMode = oldMode;
    this._newMode = newMode;
    this._editPanel = editPanel;
}

Sys.Extended.UI.HtmlEditor.ActiveModeChangedArgs.prototype = {

    get_oldMode: function() {
        return this._oldMode;
    },

    get_newMode: function() {
        return this._newMode;
    },

    get_editPanel: function() {
        return this._editPanel;
    }
}

Sys.Extended.UI.HtmlEditor.ActiveModeChangedArgs.registerClass('Sys.Extended.UI.HtmlEditor.ActiveModeChangedArgs', Sys.EventArgs);