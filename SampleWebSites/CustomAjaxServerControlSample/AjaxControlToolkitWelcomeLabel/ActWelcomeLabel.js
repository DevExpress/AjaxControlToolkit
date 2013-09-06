/// <reference name="MicrosoftAjax.js"/>

Type.registerNamespace("CustomAjaxServerControlSample.AjaxControlToolkitWelcomeLabel");

CustomAjaxServerControlSample.AjaxControlToolkitWelcomeLabel.ActWelcomeLabel = function (element) {
    CustomAjaxServerControlSample.AjaxControlToolkitWelcomeLabel.ActWelcomeLabel.initializeBase(this, [element]);
};

CustomAjaxServerControlSample.AjaxControlToolkitWelcomeLabel.ActWelcomeLabel.prototype = {
    initialize: function() {
        CustomAjaxServerControlSample.AjaxControlToolkitWelcomeLabel.ActWelcomeLabel.callBaseMethod(this, 'initialize');
        var el = this.get_element();
        $common.setStyle(el, { cursor: 'pointer' });
        el.onclick = function () {
            alert("You've been clicked!");
        };
    },

    dispose: function() {
        CustomAjaxServerControlSample.AjaxControlToolkitWelcomeLabel.ActWelcomeLabel.callBaseMethod(this, 'dispose');
    }
};

CustomAjaxServerControlSample.AjaxControlToolkitWelcomeLabel.ActWelcomeLabel.registerClass('CustomAjaxServerControlSample.AjaxControlToolkitWelcomeLabel.ActWelcomeLabel', Sys.UI.Control);

if (typeof(Sys) !== 'undefined') Sys.Application.notifyScriptLoaded();