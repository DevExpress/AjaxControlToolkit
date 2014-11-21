Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.SelectButton = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.SelectButton.initializeBase(this, [element]);

    this._onclick_option$delegate = Function.createDelegate(this, this._onclick_option);
    this._onchange$delegate = Function.createDelegate(this, this._onchange);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.SelectButton.prototype = {

    initialize: function() {
        var nodeId = this.get_element().id;
        Sys.Extended.UI.HtmlEditor.ToolbarButtons.SelectButton.callBaseMethod(this, "initialize");
        this._select = $get(nodeId + "_select");

        $addHandler(this._select, "change", this._onchange$delegate);
        for(var i = 0; i < this._select.options.length; i++) {
            var option = this._select.options[i];
            $addHandler(option, "click", this._onclick_option$delegate);
        }
    },

    dispose: function() {
        for(var i = 0; i < this._select.options.length; i++) {
            var option = this._select.options[i];
            $removeHandler(option, "click", this._onclick_option$delegate);
        }

        $removeHandler(this._select, "change", this._onchange$delegate);
        Sys.Extended.UI.HtmlEditor.ToolbarButtons.SelectButton.callBaseMethod(this, "dispose");
    },

    isImage: function() {
        return false;
    },

    callMethod: function(select, e) {
        return true;
    },

    _onclick_option: function(e) {
        if(!this.isEnable())
            return false;

        var option = e.target;
        option.parentNode.value = option.value;
        Sys.Extended.UI.HtmlEditor._stopEvent(e);

        if(!Sys.Extended.UI.HtmlEditor.isSafari)
            return false;

        this.callMethod(option.parentNode, e);

        return true;
    },

    _onchange: function(e) {
        if(!this.isEnable())
            return false;

        var select = e.target;
        Sys.Extended.UI.HtmlEditor._stopEvent(e);
        this.callMethod(select, e);

        return true;
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.SelectButton.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.SelectButton", Sys.Extended.UI.HtmlEditor.ToolbarButtons.CommonButton);