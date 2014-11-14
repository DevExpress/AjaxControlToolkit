Type.registerNamespace("Sys.Extended.UI.HtmlEditor.Popups");

Sys.Extended.UI.HtmlEditor.Popups.OkCancelAttachedTemplatePopup = function(element) {
    Sys.Extended.UI.HtmlEditor.Popups.OkCancelAttachedTemplatePopup.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.Popups.OkCancelAttachedTemplatePopup.prototype = {

    initialize: function() {
        Sys.Extended.UI.HtmlEditor.Popups.OkCancelAttachedTemplatePopup.callBaseMethod(this, "initialize");
    },

    dispose: function() {
        Sys.Extended.UI.HtmlEditor.Popups.OkCancelAttachedTemplatePopup.callBaseMethod(this, "dispose");
    }
}

Sys.Extended.UI.HtmlEditor.Popups.OkCancelAttachedTemplatePopup.registerClass("Sys.Extended.UI.HtmlEditor.Popups.OkCancelAttachedTemplatePopup", Sys.Extended.UI.HtmlEditor.Popups.AttachedTemplatePopup);