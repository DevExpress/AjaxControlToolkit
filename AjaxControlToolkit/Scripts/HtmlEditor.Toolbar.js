Type.registerNamespace("Sys.Extended.UI.HtmlEditor");

Sys.Extended.UI.HtmlEditor.Toolbar = function(element) {
    Sys.Extended.UI.HtmlEditor.Toolbar.initializeBase(this, [element]);

    this._loaded = false;
    this._cachedButtonIds = null;
    this._cachedEditPanel = null;
    this._buttons = null;
    this._alwaysVisible = false;
    this._app_onload$delegate = Function.createDelegate(this, this._app_onload);
}

Sys.Extended.UI.HtmlEditor.Toolbar.prototype = {

    get_alwaysVisible: function() {
        return this._alwaysVisible;
    },

    set_alwaysVisible: function(value) {
        this._alwaysVisible = value;
        if(this.get_isInitialized())
            this.raisePropertyChanged("alwaysVisible");
    },

    set_activeEditPanel: function(value) {
        if(!this._loaded) {
            this._cachedEditPanel = value;
            return;
        }

        for(var i = 0; i < this.get_buttons().length; i++)
            this.get_buttons()[i].set_activeEditPanel(value);
    },

    disable: function() {
        if(this.get_isInitialized()) {
            if(this._alwaysVisible)
                return;

            for(var i = 0; i < this.get_buttons().length; i++)
                this.get_buttons()[i].set_activeEditPanel(null);
        }
    },

    get_buttons: function() {
        if(this._buttons == null)
            this._buttons = [];

        return this._buttons;
    },

    set_buttons: function(value) {
        this.get_buttons().push(value);
    },

    get_buttonIds: function() {
    },

    set_buttonIds: function(value) {
        if(!this.get_isInitialized()) {
            this._cachedButtonIds = value;
            return;
        }

        var arr = value.split(";");
        for(var i = 0; i < arr.length; i++)
            if(arr[i].length > 0)
                this.set_buttons($find(arr[i]));
    },

    initialize: function() {
        Sys.Extended.UI.HtmlEditor.Toolbar.callBaseMethod(this, "initialize");
        Sys.Application.add_load(this._app_onload$delegate);
    },

    dispose: function() {
        this._loaded = false;

        Sys.Application.remove_load(this._app_onload$delegate);
        Sys.Extended.UI.HtmlEditor.Toolbar.callBaseMethod(this, "dispose");
    },

    _app_onload: function(sender, e) {
        if(this._cachedButtonIds != null) {
            this.set_buttonIds(this._cachedButtonIds);
            this._cachedButtonIds = null;
        }

        this._loaded = true;
        if(this._cachedEditPanel != null) {
            this.set_activeEditPanel(this._cachedEditPanel);
            this._cachedEditPanel = null;
        }
    }
}

Sys.Extended.UI.HtmlEditor.Toolbar.registerClass("Sys.Extended.UI.HtmlEditor.Toolbar", Sys.UI.Control);