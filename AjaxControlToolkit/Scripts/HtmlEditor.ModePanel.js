Type.registerNamespace("Sys.Extended.UI.HtmlEditor");

Sys.Extended.UI.HtmlEditor.ModePanel = function(element) {
    Sys.Extended.UI.HtmlEditor.ModePanel.initializeBase(this, [element]);

    this._activated = false;
    this._isActivating = false;
    this._editPanel = null;
    this._cachedContent = null;
    this._onbeforeunload$delegate = Function.createDelegate(this, this._onbeforeunload);
}

Sys.Extended.UI.HtmlEditor.ModePanel.prototype = {

    set_editPanel: function(value) {
        this._editPanel = value;
    },

    get_content: function() {
        if(this._activated) {
            return this._getContent();
        } else {
            if(this._cachedContent != null)
                return this._cachedContent;
            else
                return "";
        }
    },

    set_content: function(value) {
        this._cachedContent = value;

        if(!this._activated && !this._isActivating) {
            this._activate(value);
        } else {
            if(!this._isActivating) {
                this._setContent(value);
            } else {
                var panel = this;
                setTimeout(function() {
                    panel.set_content(value);
                }, 10);

                return false;
            }
        }
        return true;
    },

    _activate: function() {
        this.get_element().style.display = "";
        this._isActivating = true;
    },

    _activateFinished: function() {
        this._activated = true;
        this._isActivating = false;
        this._editPanel._setActive();

        if(this._editPanel.get_autofocus())
            this._focus();
    },

    _deactivate: function() {
        this.get_element().style.display = "none";
        this._activated = false;
        this._isActivating = false;
    },

    initialize: function() {
        Sys.Extended.UI.HtmlEditor.ModePanel.callBaseMethod(this, "initialize");
        if(Sys.Extended.UI.HtmlEditor.isIE)
            $addHandlers(window, { beforeunload: this._onbeforeunload$delegate });
    },

    dispose: function() {
        if(Sys.Extended.UI.HtmlEditor.isIE)
            $common.removeHandlers(window, { beforeunload: this._onbeforeunload$delegate });

        if(this._activated) {
            if(Sys.Extended.UI.HtmlEditor.isIE)
                this._onbeforeunload();

            this._deactivate();
        }

        Sys.Extended.UI.HtmlEditor.ModePanel.callBaseMethod(this, "dispose");
    },

    _onbeforeunload: function() {
        if(this._activated)
            if(!this._editPanel._contentPrepared) {
                this._editPanel._prepareContentForPostback(this.get_content());
                this._editPanel._contentPrepared = true;
            }
    },

    _getContent: function() {
        if(this._cachedContent != null)
            return this._cachedContent;
        else
            return "";
    },

    _setContent: function(value) {
    },

    _focus: function() {
        this._focused();
    },

    _focused: function(prize) {
        this._editPanel._focused(prize);
        this._editPanel.set_autofocus(true);
    },

    _really_focused: function() {
        this._editPanel._really_focused();
        this._editPanel.set_autofocus(true);
    }
}

Sys.Extended.UI.HtmlEditor.ModePanel.registerClass("Sys.Extended.UI.HtmlEditor.ModePanel", Sys.UI.Control);