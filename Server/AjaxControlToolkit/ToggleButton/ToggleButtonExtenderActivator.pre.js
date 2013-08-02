(function (window, $) {
    Sys.Extended.UI.ToggleButtonBehavior = function (element) {
        Sys.Extended.UI.ToggleButtonBehavior.initializeBase(this, [element]);
    };
    
    Sys.Extended.UI.ToggleButtonBehavior.prototype = {
        initialize: function () {
            $(this._element).toggleButtonExtender();
            Sys.Extended.UI.ToggleButtonBehavior.callBaseMethod(this, 'initialize');
        },

        dispose: function () {
            Sys.Extended.UI.ToggleButtonBehavior.callBaseMethod(this, 'dispose');
        }
    };

    Sys.Extended.UI.ToggleButtonBehavior.registerClass('Sys.Extended.UI.ToggleButtonBehavior', Sys.Extended.UI.BehaviorBase);
})(window, jQuery);