/// <reference name="MicrosoftAjax.js"/>


Type.registerNamespace("CustomAjaxServerControlSample.StandardWelcomeLabel");

CustomAjaxServerControlSample.StandardWelcomeLabel.WelcomeLabel = function (element) {
    CustomAjaxServerControlSample.StandardWelcomeLabel.WelcomeLabel.initializeBase(this, [element]);
};

CustomAjaxServerControlSample.StandardWelcomeLabel.WelcomeLabel.prototype = {
    initialize: function() {
        CustomAjaxServerControlSample.StandardWelcomeLabel.WelcomeLabel.callBaseMethod(this, 'initialize');
        var el = this.get_element();

        el.style.cursor = 'pointer';
        el.onclick = function() {
            alert("You've been clicked!");
        };
    },

    dispose: function() {
        CustomAjaxServerControlSample.StandardWelcomeLabel.WelcomeLabel.callBaseMethod(this, 'dispose');
    }
};

CustomAjaxServerControlSample.StandardWelcomeLabel.WelcomeLabel.registerClass('CustomAjaxServerControlSample.StandardWelcomeLabel.WelcomeLabel', Sys.UI.Control);

if (typeof(Sys) !== 'undefined') Sys.Application.notifyScriptLoaded();