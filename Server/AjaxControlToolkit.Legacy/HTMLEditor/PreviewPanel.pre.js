Type.registerNamespace("Sys.Extended.UI.HTMLEditor");

Sys.Extended.UI.HTMLEditor.PreviewPanel = function(element) {
    Sys.Extended.UI.HTMLEditor.PreviewPanel.initializeBase(this, [element]);
    this._focus$delegate = Function.createDelegate(this, this._focus_event);
    this._blur$delegate = Function.createDelegate(this, this._blur_event);
    this._doc = null;
    this._content = "";
    this._panel_timer = null;
}

Sys.Extended.UI.HTMLEditor.PreviewPanel.prototype = {
    _focus: function() {
        try { // some browsers fail when invisible
            this.get_element().contentWindow.focus();
        } catch (e) { }
        this._focused();
    },

    _focus_event: function() {
        if (this._panel_timer == null) {
            var contentWindow = this.get_element().contentWindow;
            var panel = this;
            this._really_focused();
            this._panel_timer = setTimeout(function() { contentWindow.focus(); panel._really_focused(); panel._panel_timer = null; }, 0);
        }
        return true;
    },

    _blur_event: function() {
        if (this._panel_timer != null) {
            clearTimeout(this._panel_timer);
            this._panel_timer = null;
        }
        return true;
    },

    _activate: function(value) {
        Sys.Extended.UI.HTMLEditor.PreviewPanel.callBaseMethod(this, "_activate");
        this._content = value;
        this._wasFocused = false;
        this._initIframe(value);
        //Sys.Extended.UI.HTMLEditor._addEvents(this._doc.body, ["mousedown"], this._focus$delegate);
        Sys.Extended.UI.HTMLEditor._addEvents(this.get_element().contentWindow, ["focus"], this._focus$delegate);
        Sys.Extended.UI.HTMLEditor._addEvents(this.get_element().contentWindow, ["blur"], this._blur$delegate);
        this._activateFinished();
    },

    _deactivate: function() {
        Sys.Extended.UI.HTMLEditor._removeEvents(this.get_element().contentWindow, ["blur"], this._blur$delegate);
        Sys.Extended.UI.HTMLEditor._removeEvents(this.get_element().contentWindow, ["focus"], this._focus$delegate);
        //Sys.Extended.UI.HTMLEditor._removeEvents(this._doc.body, ["mousedown"], this._focus$delegate);
        if (Sys.Extended.UI.HTMLEditor.isIE) {
            try { // if src changed (with link in document) - security exception can occur in IE
                this._doc.open();
                this._doc.write("");
                this._doc.close();
                this.get_element().src = "javascript:false;";
            } catch (ex) { }
        }
        this._doc = null;
        this._content = "";
        Sys.Extended.UI.HTMLEditor.PreviewPanel.callBaseMethod(this, "_deactivate");
    },

    _initIframe: function(value) {
        var str = Sys.Extended.UI.HTMLEditor.Trim(value);
        this._doc = this.get_element().contentWindow.document;

        if (!Sys.Extended.UI.HTMLEditor.isIE) {
        } else {
            str = str.replace(/&amp;/ig, "&");
        }

        this._doc.open();
        this._doc.write("<html><head><link rel=\"stylesheet\" href=\"" + this._editPanel.get_documentCssPath() + "\" media=\"all\" /></head><body>" + str + "</body></html>");
        this._doc.close();
    },

    _getContent: function() {
        return this._content;
    },

    _setContent: function(value) {
        //        this._deactivate();
        //        this._editPanel.disableToolbars();
        //        this.set_content(value);
        this._content = value;
        this._initIframe(value);
    }
}

Sys.Extended.UI.HTMLEditor.PreviewPanel.registerClass("Sys.Extended.UI.HTMLEditor.PreviewPanel",Sys.Extended.UI.HTMLEditor.ModePanel);
