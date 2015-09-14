Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.MutuallyExclusiveCheckBoxBehavior = function(element) {
    // The MutuallyExclusiveCheckBoxBehavior allows only one checkbox in
    // a group with the same Key to be checked at a time
    // "element" - the DOM Element the behavior is associated with
    Sys.Extended.UI.MutuallyExclusiveCheckBoxBehavior.initializeBase(this, [element]);

    this._key = "";
    this._clickHandler = Function.createDelegate(this, this._onclick);
}

Sys.Extended.UI.MutuallyExclusiveCheckBoxBehavior.prototype = {

    initialize: function() {
        Sys.Extended.UI.MutuallyExclusiveCheckBoxBehavior.callBaseMethod(this, 'initialize');
        $addHandler(this.get_element(), "click", this._clickHandler);
    },

    dispose: function() {
        if(this._key) {
            var keys = Sys.Extended.UI.MutuallyExclusiveCheckBoxBehavior.Keys;
            var ar = keys[this._key];
            Array.remove(ar, this);
            this._key = null;
        }

        if(this._clickHandler) {
            $removeHandler(this.get_element(), "click", this._clickHandler);
            this._clickHandler = null;
        }

        Sys.Extended.UI.MutuallyExclusiveCheckBoxBehavior.callBaseMethod(this, 'dispose');
    },

    /// <summary>
    /// A unique key to use to associate check boxes
    /// </summary>
    /// <getter>get_key</getter>
    /// <setter>set_key</setter>
    /// <member name="cP:AjaxControlToolkit.MutuallyExclusiveCheckBoxExtender.key" />
    get_key: function() {
        return this._key;
    },
    set_key: function(value) {
        var keys = Sys.Extended.UI.MutuallyExclusiveCheckBoxBehavior.Keys;

        if(value != this._key) {
            if(this._key) {
                var ar = keys[this._key];
                Array.remove(ar, this._key);
            }

            this._key = value;
            if(value) {
                var ar = keys[this._key];
                if(ar == null)
                    ar = keys[this._key] = [];

                Array.add(ar, this);
            }
        }
    },

    get_Key: function() {
        Sys.Extended.Deprecated("get_Key()", "get_key()");
        return this.get_key();
    },
    set_Key: function(value) {
        Sys.Extended.Deprecated("set_Key(value)", "set_key(value)");
        this.set_key(value);
    },

    _onclick: function() {
        // Click handler used to ensure only one checkbox in its key is checked
        var element = this.get_element();
        var keys = Sys.Extended.UI.MutuallyExclusiveCheckBoxBehavior.Keys;

        if(this._key && element.checked) {
            var ar = keys[this._key];
            var t = this;

            Array.forEach(ar, function(b) {
                // Uncheck all other checkboxes in the same key group
                // "b" - checkbox in the same key group
                if(b != t) {
                    b.get_element().checked = false;
                    $common.tryFireEvent(b.get_element(), "change");
                }
            });
        }

        this.raise_checked(new Sys.Extended.UI.MutuallyExclusiveCheckBoxEventArgs(element, this._key));
    },

    /// <summary>
    /// Fires when the check box is checked
    /// </summary>
    /// <event add="add_checked" remove="remove_checked" raise="raise_checked" />
    /// <member name="cE:AjaxControlToolkit.MutuallyExclusiveCheckBoxExtender.checked" />
    add_checked: function(handler) {
        this.get_events().addHandler('checked', handler);
    },
    remove_checked: function(handler) {
        this.get_events().removeHandler('checked', handler);
    },
    raise_checked: function(eventArgs) {
        var handler = this.get_events().getHandler('checked');
        if(handler)
            handler(this, eventArgs);
    },
    raiseChecked: function(eventArgs) {
        Sys.Extended.Deprecated("raiseChecked(eventArgs)", "raise_checked(eventArgs)");
        this.raise_checked(eventArgs);
    }
}

Sys.Extended.UI.MutuallyExclusiveCheckBoxBehavior.registerClass('Sys.Extended.UI.MutuallyExclusiveCheckBoxBehavior', Sys.Extended.UI.BehaviorBase);
Sys.Extended.UI.MutuallyExclusiveCheckBoxBehavior.Keys = {};

Sys.Extended.UI.MutuallyExclusiveCheckBoxEventArgs = function(checkbox, key) {
    // Event arguments used when the checked event is raised
    // "checkbox" - checkbox that was checked or unchecked
    // "key" - the unique key used to associate checkboxes
    Sys.Extended.UI.MutuallyExclusiveCheckBoxEventArgs.initializeBase(this);

    this._key = key;
    this._checkbox = checkbox;
}

Sys.Extended.UI.MutuallyExclusiveCheckBoxEventArgs.prototype = {
    get_checkbox: function() {
        // Checkbox that was checked or unchecked
        return this._checkbox;
    },

    get_key: function() {
        // The unique key used to associate checkboxes
        return this._key;
    }
}

Sys.Extended.UI.MutuallyExclusiveCheckBoxEventArgs.registerClass('Sys.Extended.UI.MutuallyExclusiveCheckBoxEventArgs', Sys.EventArgs);