Type.registerNamespace("Sys.Extended.UI.HtmlEditor.Popups");

Sys.Extended.UI.HtmlEditor.Popups.LinkProperties = function(element) {
    Sys.Extended.UI.HtmlEditor.Popups.LinkProperties.initializeBase(this, [element]);

    this._defaultTarget = "_self";
    this._targetTextHolder = null;
    this._urlTextHolder = null;
}

Sys.Extended.UI.HtmlEditor.Popups.LinkProperties.prototype = {

    get_defaultTarget: function() {
        return this._defaultTarget;
    },

    set_defaultTarget: function(value) {
        this._defaultTarget = value;
    }
}

Sys.Extended.UI.HtmlEditor.Popups.LinkProperties.registerClass("Sys.Extended.UI.HtmlEditor.Popups.LinkProperties", Sys.Extended.UI.HtmlEditor.Popups.OkCancelAttachedTemplatePopup);