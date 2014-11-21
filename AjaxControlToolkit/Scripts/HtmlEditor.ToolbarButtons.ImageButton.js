Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.ImageButton = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.ImageButton.initializeBase(this, [element]);

    this._normalSrc = "";
    this._hoverSrc = "";
    this._downSrc = "";
    this._activeSrc = "";
    this._downTimer = null;
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.ImageButton.prototype = {

    get_normalSrc: function() {
        return this._normalSrc;
    },

    set_normalSrc: function(value) {
        this._normalSrc = value;
        var element = this.get_element();

        if(/none$/.test(element.src))
            element.src = value;
    },

    get_hoverSrc: function() {
        return this._hoverSrc;
    },

    set_hoverSrc: function(value) {
        this._hoverSrc = value;
    },

    get_downSrc: function() {
        return this._downSrc;
    },

    set_downSrc: function(value) {
        this._downSrc = value;
    },

    get_activeSrc: function() {
        return this._activeSrc;
    },

    set_activeSrc: function(value) {
        this._activeSrc = value;
    },

    isImage: function() {
        return true;
    },

    _onmouseover: function(e) {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.ImageButton.callBaseMethod(this, "_onmouseover"))
            return false;

        if(this._hoverSrc.length > 0)
            this.get_element().src = this._hoverSrc;

        return true;
    },

    _onmouseout: function(e) {
        var node = this.get_element();

        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.ImageButton.callBaseMethod(this, "_onmouseout"))
            return false;

        if(this._hoverSrc.length > 0) {
            if(Sys.UI.DomElement.containsCssClass(node, this._cssClass + "_mousedown") && this._downSrc.length > 0) {
                node.src = this._downSrc;
            } else {
                if(Sys.UI.DomElement.containsCssClass(node, this._cssClass + "_active") && this._activeSrc.length > 0)
                    node.src = this._activeSrc;
                else
                    node.src = this._normalSrc;
            }
        }

        return true;
    },

    _onmousedown: function(e) {
        if(Sys.Extended.UI.HtmlEditor.ToolbarButtons.ImageButton.callBaseMethod(this, "_onmousedown") === null)
            return null;

        if(this._downSrc.length > 0) {
            this.get_element().src = this._downSrc;
            this._downTimer = setTimeout(Function.createDelegate(this, this._onmouseup), 1000); // one second delay
        }

        return true;
    },

    _onmouseup: function(e) {
        var node = this.get_element();

        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.ImageButton.callBaseMethod(this, "_onmouseup"))
            return false;

        if(this._downSrc.length > 0) {
            if(Sys.UI.DomElement.containsCssClass(node, this._cssClass + "_hover") && this._hoverSrc.length > 0) {
                node.src = this._hoverSrc;
            } else {
                if(Sys.UI.DomElement.containsCssClass(node, this._cssClass + "_active") && this._activeSrc.length > 0)
                    node.src = this._activeSrc;
                else
                    node.src = this._normalSrc;
            }

            if(this._downTimer != null) {
                clearTimeout(this._downTimer);
                this._downTimer = null;
            }
        }

        return true;
    },

    setActivity: function(value) {
        var node = this.get_element();

        if(this._activeSrc.length > 0) {
            if(value) {
                if(!Sys.UI.DomElement.containsCssClass(node, this._cssClass + "_active"))
                    node.src = this._activeSrc;
            } else {
                if(Sys.UI.DomElement.containsCssClass(node, this._cssClass + "_active")) {
                    if(Sys.UI.DomElement.containsCssClass(node, this._cssClass + "_mousedown") && this._downSrc.length > 0) {
                        node.src = this._downSrc;
                    } else {
                        if(Sys.UI.DomElement.containsCssClass(node, this._cssClass + "_hover") && this._hoverSrc.length > 0)
                            node.src = this._hoverSrc;
                        else
                            node.src = this._normalSrc;
                    }
                }
            }
        }

        Sys.Extended.UI.HtmlEditor.ToolbarButtons.ImageButton.callBaseMethod(this, "setActivity", [value]);
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.ImageButton.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.ImageButton", Sys.Extended.UI.HtmlEditor.ToolbarButtons.CommonButton);