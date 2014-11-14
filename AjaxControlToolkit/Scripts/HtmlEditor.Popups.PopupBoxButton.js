Type.registerNamespace("Sys.Extended.UI.HtmlEditor.Popups");

Sys.Extended.UI.HtmlEditor.Popups.PopupBoxButton = function(element) {
    Sys.Extended.UI.HtmlEditor.Popups.PopupBoxButton.initializeBase(this, [element]);

    this._designPanel = null;
}

Sys.Extended.UI.HtmlEditor.Popups.PopupBoxButton.prototype = {
}

Sys.Extended.UI.HtmlEditor.Popups.PopupBoxButton.registerClass("Sys.Extended.UI.HtmlEditor.Popups.PopupBoxButton", Sys.Extended.UI.HtmlEditor.Popups.PopupCommonButton);