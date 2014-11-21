Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.OkCancelPopupButton = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.OkCancelPopupButton.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.OkCancelPopupButton.prototype = {

    set_activeEditPanel: function(value) {
        if(this._editPanel != value && this._editPanel != null) {
            var relatedPopup = this.get_relatedPopup();

            if(typeof relatedPopup._forceImClose == "function") {
                var func = relatedPopup._forceImClose;
                func(relatedPopup._iframe.contentWindow);
            }
        }
        Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModePopupImageButton.callBaseMethod(this, "set_activeEditPanel", [value]);
    },

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.OkCancelPopupButton.callBaseMethod(this, "callMethod"))
            return false;

        this.openPopup(Function.createDelegate(this, this._onopened));

        return true;
    },

    _onopened: function(contentWindow) {
        contentWindow.popupMediator.set_callMethodByName("OK", Function.createDelegate(this, this._onOK));
        contentWindow.popupMediator.set_callMethodByName("Cancel", Function.createDelegate(this, this._onCancel));

        var relatedPopup = this.get_relatedPopup();
        relatedPopup._popup = this._designPanel._popup;
        relatedPopup._forceImClose = Function.createDelegate(this, this._onCancel);

        this._designPanel._popup = this.get_relatedPopup();
        this.opened(contentWindow);
    },

    opened: function(contentWindow) {
    },

    _onOK: function(contentWindow) {
        if(this.okCheck(contentWindow))
            this._exit(Function.createDelegate(this, this.ok), contentWindow);
    },

    _onCancel: function(contentWindow) {
        if(this.cancelCheck(contentWindow))
            this._exit(Function.createDelegate(this, this.cancel), contentWindow);
    },

    _exit: function(callback, contentWindow) {
        this.closePopup();
        this._designPanel._popup = this.get_relatedPopup()._popup;
        this.get_relatedPopup()._popup = null;
        this.get_relatedPopup()._forceImClose = null;

        callback(contentWindow);
    },

    ok: function(contentWindow) {
    },

    cancel: function(contentWindow) {
    },

    okCheck: function(contentWindow) {
        return true;
    },

    cancelCheck: function(contentWindow) {
        return true;
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.OkCancelPopupButton.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.OkCancelPopupButton", Sys.Extended.UI.HtmlEditor.ToolbarButtons.DesignModePopupImageButton);