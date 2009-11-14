

// A simple version of the real behavior - just to verify script path works right.


Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.ConfirmButtonBehavior = function(element) { 
    Sys.Extended.UI.ConfirmButtonBehavior.initializeBase(this, [element]);
}

Sys.Extended.UI.ConfirmButtonBehavior.prototype = {

    //
    // Variables
    //

    // Properties
    _ConfirmTextValue : null,

    //
    // Overrides
    //

    initialize : function() {
        Sys.Extended.UI.ConfirmButtonBehavior.callBaseMethod(this, 'initialize');

        this.get_element().value = this._ConfirmTextValue;
    },

    dispose : function() {
        Sys.Extended.UI.ConfirmButtonBehavior.callBaseMethod(this, 'dispose');
    },

//    getDescriptor : function() {
//        var td = Sys.Extended.UI.ConfirmButtonBehavior.callBaseMethod(this, 'getDescriptor');
//        td.addProperty('ConfirmText', String);
//        return td;
//    },

    //
    // Property get/set methods
    //

    get_ConfirmText : function() {
        return this._ConfirmTextValue;
    },

    set_ConfirmText : function(value) {
        this._ConfirmTextValue = value;
    }
}

Sys.Extended.UI.ConfirmButtonBehavior.registerClass('Sys.Extended.UI.ConfirmButtonBehavior', Sys.Extended.UI.BehaviorBase);

if (typeof(Sys) !== 'undefined') Sys.Application.notifyScriptLoaded();
