Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.CommonButton = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.CommonButton.initializeBase(this, [element]);

    this._loaded = false;
    this._preservePlace = false;
    this._editPanel = null;
    this._activeModes = null;
    this._app_onload$delegate = Function.createDelegate(this, this._app_onload);
    this._cssClass = "";

    this._onmouseover$delegate = Function.createDelegate(this, this._onmouseover);
    this._onmouseout$delegate = Function.createDelegate(this, this._onmouseout);
    this._onmousedown$delegate = Function.createDelegate(this, this._onmousedown);
    this._onmouseup$delegate = Function.createDelegate(this, this._onmouseup);
    this._onclick$delegate = Function.createDelegate(this, this._onclick);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.CommonButton.prototype = {

    get_preservePlace: function() {
        return this._preservePlace;
    },

    set_preservePlace: function(value) {
        this._preservePlace = value;
    },

    set_activeEditPanel: function(value) {
        this._editPanel = value;

        if(this._editPanel == null) {
            this.hideButton();
        } else {
            if(this.isAllowedActiveMode(this._editPanel.get_activeMode()) && this.canBeShown()) {
                this.showButton();
                this.onEditPanelActivity();
            } else {
                this.hideButton();
            }
        }
    },

    isImage: function() {
        return true;
    },

    checkRangeInDesign: function() {
        if(typeof this._designPanel == "undefined")
            return false;

        if(this._designPanel == null)
            return false;
        if(this._designPanel.isPopup())
            return false;

        var parent = Sys.Extended.UI.HtmlEditor.getSelParent(this._designPanel);
        if(parent.nodeType == 3)
            parent = parent.parentNode;

        return (parent.ownerDocument == this._designPanel._doc);
    },

    get_buttonName: function() {
        var name = Object.getType(this).getName();
        name = name.substring(name.lastIndexOf(".") + 1);

        return name;
    },

    get_message: function(messageName) {
        var expression = "Sys.Extended.UI.Resources.HtmlEditor_toolbar_button_" + this.get_buttonName() + "_message_" + messageName;

        return eval(expression);
    },

    isDisplayed: function() {
        var element = this.get_element();

        if(element) {
            var style = element.style;

            return (style.display != "none" && style.visibility != "hidden");
        } else {
            return false;
        }
    },

    hideButton: function() {
        var element = this.get_element();

        if(element) {
            if(!this._preservePlace)
                element.style.display = "none";
            else
                element.style.visibility = "hidden";
        }
    },

    showButton: function() {
        var element = this.get_element();

        if(element) {
            if(element.style.display == "none")
                element.style.display = "";

            if(this._preservePlace)
                element.style.visibility = "visible";
        }
    },

    canBeShown: function() {
        return true;
    },

    onEditPanelActivity: function() {
    },

    get_activeModes: function() {
        if(this._activeModes == null)
            this._activeModes = [];

        return this._activeModes;
    },

    set_activeModes: function(value) {
        this.get_activeModes().push(value);
    },

    get_activeModesIds: function() {
    },

    set_activeModesIds: function(value) {
        var arr = value.split(";");

        for(var i = 0; i < arr.length; i++)
            this.set_activeModes(parseInt(arr[i]));
    },

    set_toolTip: function(value) {
        this.get_element().title = value;
    },

    get_toolTip: function() {
        return this.get_element().title;
    },

    isAllowedActiveMode: function(value) {
        for(var i = 0; i < this.get_activeModes().length; i++)
            if(this.get_activeModes()[i] == value)
                return true;

        return false;
    },

    initialize: function() {
        Sys.Extended.UI.HtmlEditor.ToolbarButtons.CommonButton.callBaseMethod(this, "initialize");

        Sys.Application.add_load(this._app_onload$delegate);
        var element = this.get_element();

        if(this._preservePlace && !this.canBeShown())
            element.style.display = "none";

        this._cssClass = element.className;

        if(this.isImage())
            $addHandlers(element, {
                mouseover: this._onmouseover$delegate,
                mouseout: this._onmouseout$delegate,
                mousedown: this._onmousedown$delegate,
                mouseup: this._onmouseup$delegate,
                click: this._onclick$delegate
            });

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

    dispose: function() {
        if(this.isImage()) {
            $common.removeHandlers(this.get_element(), {
                mouseover: this._onmouseover$delegate,
                mouseout: this._onmouseout$delegate,
                mousedown: this._onmousedown$delegate,
                mouseup: this._onmouseup$delegate,
                click: this._onclick$delegate
            });
        }

        this._loaded = false;
        Sys.Application.remove_load(this._app_onload$delegate);
        Sys.Extended.UI.HtmlEditor.ToolbarButtons.CommonButton.callBaseMethod(this, "dispose");
    },

    _app_onload: function(sender, e) {
        this.onButtonLoaded();
        this._loaded = true;
    },

    onButtonLoaded: function() {
    },

    _onmouseover: function(e) {
        if(!this.isEnable())
            return false;

        Sys.UI.DomElement.addCssClass(this.get_element(), this._cssClass + "_hover");

        return true;
    },

    _onmouseout: function(e) {
        if(!this.isEnable())
            return false;

        Sys.UI.DomElement.removeCssClass(this.get_element(), this._cssClass + "_hover");
        Sys.UI.DomElement.removeCssClass(this.get_element(), this._cssClass + "_mousedown");

        return true;
    },

    _onmousedown: function(e) {
        if(!this.isEnable())
            return null;

        Sys.UI.DomElement.addCssClass(this.get_element(), this._cssClass + "_mousedown");

        return false;
    },

    _onmouseup: function(e) {
        if(!this.isEnable())
            return false;

        Sys.UI.DomElement.removeCssClass(this.get_element(), this._cssClass + "_mousedown");

        return true;
    },

    _onclick: function(e) {
        if(!this.isEnable())
            return false;

        return true;
    },

    isEnable: function() {
        if(!this._loaded)
            return false;

        if(this._editPanel == null)
            return false;

        return true;
    },

    setActivity: function(value) {
        if(value)
            Sys.UI.DomElement.addCssClass(this.get_element(), this._cssClass + "_active");
        else
            Sys.UI.DomElement.removeCssClass(this.get_element(), this._cssClass + "_active");
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.CommonButton.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.CommonButton", Sys.UI.Control);