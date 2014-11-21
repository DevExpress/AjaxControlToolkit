Type.registerNamespace("Sys.Extended.UI.HtmlEditor.Popups");

Sys.Extended.UI.HtmlEditor.Popups.Popup = function(element) {
    Sys.Extended.UI.HtmlEditor.Popups.Popup.initializeBase(this, [element]);

    this._iframe = null;
    this._top = 0;
    this._left = 0;
    this._doc = null;
    this._initialContent = "";
    this._cssPath = "";
    this._autoDimensions = true;
    this._registeredFields = [];
    this._registeredHandlers = [];
    this._app_onload$delegate = Function.createDelegate(this, this._app_onload);
    this.isOpened = false;
    this.isLoaded = false;
    this.isLoading = false;
}

Sys.Extended.UI.HtmlEditor.Popups.Popup.prototype = {

    getDocument: function() {
        return this._doc;
    },

    getPopupMediator: function() {
        if(this._iframe.contentWindow && this._iframe.contentWindow.popupMediator)
            return this._iframe.contentWindow.popupMediator;
        else
            return null;
    },

    get_registeredFields: function() {
        return this._registeredFields;
    },

    set_registeredFields: function(value) {
        this._registeredFields = eval(value);
    },

    get_registeredHandlers: function() {
        return this._registeredHandlers;
    },

    set_registeredHandlers: function(value) {
        this._registeredHandlers = eval(value);
    },

    get_initialContent: function() {
        return this._initialContent;
    },

    set_initialContent: function(value) {
        this._initialContent = value;
    },

    get_cssPath: function() {
        return this._cssPath;
    },

    set_cssPath: function(value) {
        this._cssPath = value;
    },

    get_autoDimensions: function() {
        return this._autoDimensions;
    },

    set_autoDimensions: function(value) {
        this._autoDimensions = value;
    },

    get_iframe: function() {
        return this._iframe;
    },

    set_iframe: function(value) {
        this._iframe = value;
    },

    checkCorrectLoaded: function(func) {
        var popup = this;
        if(popup.isLoaded && (popup._iframe.style.height == "0px" || popup._iframe.style.width == "0px"))
            this.isLoaded = false;

        if(!this.isLoaded) {
            if(!this.isLoading)
                this.reload();

            if(typeof func != "undefined")
                setTimeout(func, 10);

            return false;
        }

        return true;
    },

    _baseOpen: function(callback, top, left) {
        var popup = this;

        if(!this.checkCorrectLoaded(function() { popup._baseOpen(callback, top, left); }))
            return;

        var element = this.get_element();

        if(typeof left != "undefined")
            this._left = parseInt(left);
        if(typeof top != "undefined")
            this._top = parseInt(top);

        element.style.top = this._top + "px";
        element.style.left = this._left + "px";

        setTimeout(function() {
            if(typeof callback == "function")
                popup._onDocumentLoaded(callback);

            popup.isOpened = true;
        }, 0);
    },

    open: function(callback, top, left) {
        this._baseOpen(callback, top, left);
    },

    close: function(callback) {
        var element = this.get_element();
        this.isOpened = false;

        element.style.top = "-2000px";
        element.style.left = "-2000px";

        if(typeof callback == "function")
            callback();
    },

    reload: function() {
        this.isLoading = true;
        var element = this.get_element();
        var _parentNode_ = element.parentNode;

        document.body.appendChild(element);
        _parentNode_.appendChild(this.get_element());

        this._doc = this._iframe.contentWindow.document;
        this._doc.open();
        var html = new Sys.StringBuilder();

        html.append("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.1//EN\" \"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\"><html><head>");
        if(this._cssPath.length > 0)
            html.append("<link rel=\"stylesheet\" href=\"" + this._cssPath + "\" media=\"all\" />");

        html.append("<script>var __loaded__ = false;</script></head><body style='margin:0px; padding:0px; border-width:0px;' onload='__loaded__ = true;'>");
        if(this._autoDimensions)
            html.append("<table cellspacing='0' cellpadding='0' border='0'><tr><td>");

        html.append(this._initialContent);
        if(this._autoDimensions)
            html.append("</td></tr></table>");

        html.append("</body></html>");

        this._doc.write(html.toString());
        this._doc.close();

        this.isLoaded = false;
        this._afterReload();
    },

    _afterReload: function() {
        var contentWindow = this._iframe.contentWindow,
            popup = this;

        this.isLoaded = contentWindow.__loaded__;

        if(!(popup._doc.body && popup._doc.body.innerHTML))
            this.isLoaded = false;

        if(!this.isLoaded) {
            setTimeout(function() {
                popup._afterReload()
            }, 10); // waiting for loading
            return;
        }

        this.isLoaded = false;
        contentWindow.popupMediator = {};
        contentWindow.popupMediator.registeredFields = this._registeredFields;
        contentWindow.popupMediator.registeredHandlers = this._registeredHandlers;

        contentWindow.popupMediator.get_callMethodByName = function(name) {
            var handlers = contentWindow.popupMediator.registeredHandlers;

            for(var i = 0; i < handlers.length; i++) {
                var handler = handlers[i];

                if(handler.name == name)
                    return handler.callMethod;
            }

            return null;
        };

        contentWindow.popupMediator.set_callMethodByName = function(name, value) {
            var handlers = contentWindow.popupMediator.registeredHandlers;

            for(var i = 0; i < handlers.length; i++) {
                var handler = handlers[i];

                if(handler.name == name)
                    handler.callMethod = value;
            }
        };

        contentWindow.popupMediator.getField = function(name) {
            var registeredFields = contentWindow.popupMediator.registeredFields;

            for(var i = 0; i < registeredFields.length; i++) {
                var registeredField = registeredFields[i];

                if(registeredField.name == name)
                    return contentWindow.document.getElementById(registeredField.clientID);
            }

            return null;
        };

        contentWindow.Sys = Sys;

        for(var i = 0; i < this._registeredHandlers.length; i++)
            $find(this._registeredHandlers[i].clientID).activate(contentWindow.document.getElementById(this._registeredHandlers[i].clientID));


        if(Sys.Extended.UI.HtmlEditor.isIE) {
            popup._doc.onselectstart = function() {
                var event = popup._iframe.contentWindow.event;
                var tagName = event.srcElement.tagName.toUpperCase();

                if(tagName == "INPUT" || tagName == "TEXTAREA")
                    return true;

                return false;
            };
        } else {
            popup._doc.onmousedown = function disableselect(e) {
                var tagName = e.target.tagName.toUpperCase();

                if(tagName == "INPUT" || tagName == "TEXTAREA" || tagName == "SELECT")
                    return true;
                if(Sys.Extended.UI.HtmlEditor.isSafari)
                    if(tagName == "TABLE" || tagName == "TR" || tagName == "TD" || tagName == "DIV")
                        return true;

                return false;
            };

            var aInp = popup._doc.getElementsByTagName('input');
            for(var i = 0; i < aInp.length; i++)
                aInp[i].setAttribute('autocomplete', 'off')
        }

        if(this._autoDimensions) {
            popup._iframe.style.height = "1000px";
            popup._iframe.style.width = "1000px";

            setTimeout(function() {
                popup._iframe.style.height = popup._doc.body.firstChild.offsetHeight + "px";
                popup._iframe.style.width = popup._doc.body.firstChild.offsetWidth + "px";
                popup.isLoaded = true;
                popup.isLoading = false;
            }, 0);
        } else {
            popup.isLoaded = true;
            popup.isLoading = false;
        }
    },

    _onDocumentLoaded: function(callback) {
        var popup = this;
        if(!this.isLoaded) {
            setTimeout(function() {
                popup._onDocumentLoaded(callback)
            }, 10); // waiting for loading
            return;
        }

        this.isLoaded = true;
        callback(this._iframe.contentWindow);
    },

    initialize: function() {
        this.__appLoaded__ = false;

        Sys.Extended.UI.HtmlEditor.Popups.Popup.callBaseMethod(this, "initialize");
        Sys.Application.add_load(this._app_onload$delegate);
    },

    dispose: function() {
        Sys.Application.remove_load(this._app_onload$delegate);

        if(this.isOpened)
            this.close();

        Sys.Extended.UI.HtmlEditor.Popups.Popup.callBaseMethod(this, "dispose");
    },

    _app_onload: function(sender, e) {
        if(this.__appLoaded__)
            return;

        this.__appLoaded__ = true;
        var element = this.get_element();

        if(Sys.Extended.UI.HtmlEditor.isReallyVisible(element)) {
            this._parentNode_ = element.parentNode;
            this.reload();
        }
    }
}

Sys.Extended.UI.HtmlEditor.Popups.Popup.registerClass("Sys.Extended.UI.HtmlEditor.Popups.Popup", Sys.UI.Control);