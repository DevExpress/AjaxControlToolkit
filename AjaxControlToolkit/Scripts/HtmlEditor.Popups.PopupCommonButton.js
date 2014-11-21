Type.registerNamespace("Sys.Extended.UI.HtmlEditor.Popups");

Sys.Extended.UI.HtmlEditor.Popups.PopupCommonButton = function(element) {
    Sys.Extended.UI.HtmlEditor.Popups.PopupCommonButton.initializeBase(this, [element]);

    this._loaded = false;
    this._activated = null;
    this._app_onload$delegate = Function.createDelegate(this, this._app_onload);
    this._cssClass = "";
    this._name = "";

    this._onmouseover$delegate = Function.createDelegate(this, this._onmouseover);
    this._onmouseout$delegate = Function.createDelegate(this, this._onmouseout);
    this._onmousedown$delegate = Function.createDelegate(this, this._onmousedown);
    this._onmouseup$delegate = Function.createDelegate(this, this._onmouseup);
    this._onclick$delegate = Function.createDelegate(this, this._onclick);
}

Sys.Extended.UI.HtmlEditor.Popups.PopupCommonButton.prototype = {

    isImage: function() {
        return true;
    },

    set_toolTip: function(value) {
        this.get_element().title = value;
    },

    get_toolTip: function() {
        return this.get_element().title;
    },

    set_name: function(value) {
        this._name = value;
    },

    get_name: function() {
        return this._name;
    },

    initialize: function() {
        var element = this.get_element();

        Sys.Extended.UI.HtmlEditor.Popups.PopupCommonButton.callBaseMethod(this, "initialize");
        Sys.Application.add_load(this._app_onload$delegate);
        this._cssClass = element.className.split(" ")[0];

        if(this.isImage()) {
            $addHandlers(element, {
                mouseover: this._onmouseover$delegate,
                mouseout: this._onmouseout$delegate,
                mousedown: this._onmousedown$delegate,
                mouseup: this._onmouseup$delegate,
                click: this._onclick$delegate
            });
        }

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            function diveSelectable(el) {
                if(el.nodeType == 1 && el.tagName) {
                    var tag = el.tagName.toUpperCase();

                    if(tag != "INPUT" && tag != "TEXTAREA" && tag != "IFRAME")
                        el.unselectable = "on";

                    for(var k = 0; k < el.childNodes.length; k++)
                        diveSelectable(el.childNodes.item(k));
                }
            }

            diveSelectable(element);
        } else {
            try {
                element.style.MozUserSelect = "none";
                element.parentNode.style.MozUserSelect = "none";
            } catch(ex) { }
        }
    },

    activate: function(element) {
        this._activated = element;

        if(this.isImage()) {
            Sys.Extended.UI.HtmlEditor._addEvent(this._activated, "mouseover", this._onmouseover$delegate);
            Sys.Extended.UI.HtmlEditor._addEvent(this._activated, "mouseout", this._onmouseout$delegate);
            Sys.Extended.UI.HtmlEditor._addEvent(this._activated, "mousedown", this._onmousedown$delegate);
            Sys.Extended.UI.HtmlEditor._addEvent(this._activated, "mouseup", this._onmouseup$delegate);
            Sys.Extended.UI.HtmlEditor._addEvent(this._activated, "click", this._onclick$delegate);
        }
    },

    dispose: function() {
        if(this.isImage() && this._activated != null) {
            Sys.Extended.UI.HtmlEditor._removeEvent(this._activated, "mouseover", this._onmouseover$delegate);
            Sys.Extended.UI.HtmlEditor._removeEvent(this._activated, "mouseout", this._onmouseout$delegate);
            Sys.Extended.UI.HtmlEditor._removeEvent(this._activated, "mousedown", this._onmousedown$delegate);
            Sys.Extended.UI.HtmlEditor._removeEvent(this._activated, "mouseup", this._onmouseup$delegate);
            Sys.Extended.UI.HtmlEditor._removeEvent(this._activated, "click", this._onclick$delegate);
        }
        this._activated = null;
        this._loaded = false;

        Sys.Application.remove_load(this._app_onload$delegate);
        Sys.Extended.UI.HtmlEditor.Popups.PopupCommonButton.callBaseMethod(this, "dispose");
    },

    _app_onload: function(sender, e) {
        if(this._loaded)
            return;

        this.onButtonLoaded();
        this._loaded = true;
    },

    onButtonLoaded: function() {
    },

    _onmouseover: function(e) {
        if(!this.isEnable())
            return false;

        Sys.UI.DomElement.addCssClass(this._activated, this._cssClass + "_hover");

        return true;
    },

    _onmouseout: function(e) {
        if(!this.isEnable())
            return false;

        var _target1 = e.toElement || e.relatedTarget;

        try {
            while(_target1 && typeof _target1 != "undefined")
                if(_target1 == this._activated)
                    break;
                else
                    _target1 = _target1.parentNode;
        } catch(e) {
            _target1 = null;
        }

        if(_target1 != null)
            return true;

        Sys.UI.DomElement.removeCssClass(this._activated, this._cssClass + "_hover");
        Sys.UI.DomElement.removeCssClass(this._activated, this._cssClass + "_mousedown");

        return true;
    },

    _onmousedown: function(e) {
        if(!this.isEnable())
            return null;

        Sys.UI.DomElement.addCssClass(this._activated, this._cssClass + "_mousedown");

        return false;
    },

    _onmouseup: function(e) {
        if(!this.isEnable())
            return false;

        Sys.UI.DomElement.removeCssClass(this._activated, this._cssClass + "_mousedown");

        return true;
    },

    _onclick: function(e) {
        if(!this.isEnable())
            return false;

        this.callMethod(e);

        return true;
    },

    callMethod: function(e) {
        var doc = this._activated.ownerDocument || this._activated.document || target,
            contWin = doc.defaultView || doc.parentWindow,
            method = contWin.popupMediator.get_callMethodByName(this._name);

        Function.createDelegate(this, method)(contWin);
    },

    isEnable: function() {
        if(!this._loaded)
            return false;

        return true;
    }
}

Sys.Extended.UI.HtmlEditor.Popups.PopupCommonButton.registerClass("Sys.Extended.UI.HtmlEditor.Popups.PopupCommonButton", Sys.UI.Control);