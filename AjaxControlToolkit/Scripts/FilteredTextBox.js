Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.FilteredTextBoxBehavior = function(element) {
    // The FilteredTextBoxBehavior is used to prevent invalid characters from being entered into a textbox
    // "element" - the textbox element this behavior is associated with
    Sys.Extended.UI.FilteredTextBoxBehavior.initializeBase(this, [element]);

    this._keypressHandler = null;
    this._changeHandler = null;

    this._intervalID = null;

    this._filterType = Sys.Extended.UI.FilterTypes.Custom;
    this._filterMode = Sys.Extended.UI.FilterModes.ValidChars;
    this._validChars = null;
    this._invalidChars = null;
    this._filterInterval = 250;

    this.charTypes = {};
    this.charTypes.LowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    this.charTypes.UppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.charTypes.Numbers = "0123456789";
}

Sys.Extended.UI.FilteredTextBoxBehavior.prototype = {

    initialize: function() {
        Sys.Extended.UI.FilteredTextBoxBehavior.callBaseMethod(this, 'initialize');

        var element = this.get_element();

        this._keypressHandler = Function.createDelegate(this, this._onkeypress);
        $addHandler(element, 'keypress', this._keypressHandler);

        this._changeHandler = Function.createDelegate(this, this._onchange);
        $addHandler(element, 'change', this._changeHandler);

        var callback = Function.createDelegate(this, this._intervalCallback);
        this._intervalID = window.setInterval(callback, this._filterInterval);
    },

    dispose: function() {
        var element = this.get_element();

        $removeHandler(element, 'keypress', this._keypressHandler);
        this._keypressHandler = null;

        $removeHandler(element, 'change', this._changeHandler);
        this._changeHandler = null;

        window.clearInterval(this._intervalID);

        Sys.Extended.UI.FilteredTextBoxBehavior.callBaseMethod(this, 'dispose');
    },

    _getValidChars: function() {
        if(this._validChars)
            return this._validChars;

        this._validChars = "";

        for(type in this.charTypes) {
            var filterType = Sys.Extended.UI.FilterTypes.toString(this._filterType);

            if(filterType.indexOf(type) != -1)
                this._validChars += this.charTypes[type];
        }

        return this._validChars;
    },

    _getInvalidChars: function() {
        // Get all the invalid characters (in case of custom filtering and InvalidChars mode)
        // returns all invalid characters
        if(!this._invalidChars)
            this._invalidChars = this.charTypes.Custom;

        return this._invalidChars;
    },

    _onkeypress: function(evt) {
        // Handler for the target textbox's key press event
        // "evt" - event info

        // This handler will only get called for valid characters in IE, we use keyCode

        // In FireFox, this will be called for all key presses, with charCode/which
        // being set for keys we should filter (e.g. the chars) and keyCode being
        // set for all other keys.

        // scanCode = event.charCode

        // In Safari, charCode, which, and keyCode will all be filled with the same value,
        // as well as keyIdentifier, which has the string representation either as "end" or "U+00000008"

        // 1) Check for ctrl/alt/meta -> bail if true
        // 2) Check for keyIdentifier.startsWith("U+") -> bail if false
        // 3) Check keyCode < 0x20 -> bail
        // 4) Special case Delete (63272) -> bail

        var scanCode;

        // Note (Supergibbs): Changed to handle all majors browsers
        // IE and Safari only fires for valid characters
        // Firefox sets charCode to 0 and uses keyCode for special keys
        // Opera always fires but you cannot distinguish which are valid or special keys 
        if((((/* ff */ evt.rawEvent.charCode == 0) ||
             (/* opera */ evt.rawEvent.keyCode == evt.rawEvent.which && evt.rawEvent.charCode == undefined)) &&
              ((evt.rawEvent.keyCode == Sys.UI.Key.pageUp) ||
               (evt.rawEvent.keyCode == Sys.UI.Key.pageDown) ||
               (evt.rawEvent.keyCode == Sys.UI.Key.up) ||
               (evt.rawEvent.keyCode == Sys.UI.Key.down) ||
               (evt.rawEvent.keyCode == Sys.UI.Key.left) ||
               (evt.rawEvent.keyCode == Sys.UI.Key.right) ||
               (evt.rawEvent.keyCode == Sys.UI.Key.home) ||
               (evt.rawEvent.keyCode == Sys.UI.Key.end) ||
               (evt.rawEvent.keyCode == 46 /* Delete */))) ||
               (evt.ctrlKey /* Control keys */))
            return;

        if(evt.rawEvent.keyIdentifier) {
            // Safari
            // Note (Garbin): used the underlying rawEvent insted of the DomEvent instance.
            if(evt.rawEvent.ctrlKey || evt.rawEvent.altKey || evt.rawEvent.metaKey)
                return;

            if(evt.rawEvent.keyIdentifier.substring(0, 2) != "U+")
                return;

            scanCode = evt.rawEvent.charCode;
            if(scanCode == 63272 /* Delete */)
                return;
        } else {
            scanCode = evt.charCode;
        }

        if(scanCode && scanCode >= 0x20 /* space */) {
            var c = String.fromCharCode(scanCode);

            if(!this._processKey(c))
                evt.preventDefault();
        }
    },

    _processKey: function(key) {
        // Determine whether the key is valid or whether it should be filtered out
        // "key" - character to be validated
        // returns true if the character should be accepted, false if it should be filtered

        // Allow anything that's not a printable character,
        // e.g. backspace, arrows, etc.  Everything above 32
        // should be considered allowed, as it may be Unicode, etc.
        var filter = "",
            shouldFilter = false;

        if(this._filterMode == Sys.Extended.UI.FilterModes.ValidChars) {
            filter = this._getValidChars();

            // Determine if we should accept the character
            shouldFilter = filter && (filter.length > 0) && (filter.indexOf(key) == -1);
        } else {
            filter = this._getInvalidChars();

            // Determine if we should accept the character
            shouldFilter = filter && (filter.length > 0) && (filter.indexOf(key) > -1);
        }

        // Raise the processKey event and allow handlers to intercept
        // and decide whether the key should be allowed
        var eventArgs = new Sys.Extended.UI.FilteredTextBoxProcessKeyEventArgs(key, Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()).get_Value(), shouldFilter);
        this.raiseProcessKey(eventArgs);

        // If a processKey handler decided the key should be allowed, just
        // return true and pass it through (note that the default value of
        // allowKey is the opposite of shouldFilter so it will work as normal
        // if no one is handling the event)
        if(eventArgs.get_allowKey())
            return true;

        // Else if it was decided that it shouldn't be allowed,
        // raise the Filtered event and return false to filter the key
        this.raiseFiltered(new Sys.Extended.UI.FilteredTextBoxEventArgs(key));

        return false;
    },

    _onchange: function() {
        // Handler for the target textbox's key change event which will filter
        // the text again (to make sure no text was inserted without keypresses, etc.)
        var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()),
            text = wrapper.get_Value() || '',
            result = new Sys.StringBuilder();

        for(var i = 0; i < text.length; i++) {
            var ch = text.substring(i, i + 1);

            if(this._processKey(ch))
                result.append(ch);
        }

        // change the value only if it is different
        if(wrapper.get_Value() != result.toString())
            wrapper.set_Value(result.toString());
    },

    _intervalCallback: function() {
        // Method that is repeatedly called to purge invalid characters from the textbox

        this._changeHandler();
    },

    get_ValidChars: function() {
        // A string consisting of all characters considered valid for the textbox, if
        // "Custom" is specified as the field type. Otherwise this parameter is ignored.
        return this.charTypes.Custom;
    },

    set_ValidChars: function(value) {
        if(this._validChars != null || this.charTypes.Custom != value) {
            this.charTypes.Custom = value;
            this._validChars = null;
            this.raisePropertyChanged('ValidChars');
        }
    },

    get_InvalidChars: function() {
        // A string consisting of all characters considered invalid for the textbox, if "Custom" is specified as the field type. Otherwise this parameter is ignored.
        return this.charTypes.Custom;
    },

    set_InvalidChars: function(value) {
        if(this._invalidChars != null || this.charTypes.Custom != value) {
            this.charTypes.Custom = value;
            this._invalidChars = null;
            this.raisePropertyChanged('InvalidChars');
        }
    },

    get_FilterType: function() {
        // FilterType - A the type of filter to apply, as a comma-separated combination of
        // Numbers, LowercaseLetters, UppercaseLetters, and Custom. If Custom is specified,
        // the ValidChars field will be used in addition to other settings such as Numbers.
        return this._filterType;
    },

    set_FilterType: function(value) {
        if(this._validChars != null || this._filterType != value) {
            this._filterType = value;
            this._validChars = null;
            this.raisePropertyChanged('FilterType');
        }
    },

    get_FilterMode: function() {
        // FilterMode - The filter mode to apply when custom filtering is activated; supported values are ValidChars and InvalidChars.
        return this._filterMode;
    },

    set_FilterMode: function(value) {
        if(this._validChars != null || this._invalidChars != null || this._filterMode != value) {
            this._filterMode = value;
            this._validChars = null;
            this._invalidChars = null;
            this.raisePropertyChanged('FilterMode');
        }
    },

    get_FilterInterval: function() {
        // An integer containing the interval (in milliseconds) in which 
        // the field's contents are filtered
        return this._filterInterval;
    },

    set_FilterInterval: function(value) {
        if(this._filterInterval != value) {
            this._filterInterval = value;
            this.raisePropertyChanged('FilterInterval');
        }
    },

    add_processKey: function(handler) {
        this.get_events().addHandler('processKey', handler);
    },

    remove_processKey: function(handler) {
        this.get_events().removeHandler('processKey', handler);
    },

    raiseProcessKey: function(eventArgs) {
        var handler = this.get_events().getHandler('processKey');
        if(handler)
            handler(this, eventArgs);
    },

    add_filtered: function(handler) {
        this.get_events().addHandler('filtered', handler);
    },

    remove_filtered: function(handler) {
        this.get_events().removeHandler('filtered', handler);
    },

    raiseFiltered: function(eventArgs) {
        var handler = this.get_events().getHandler('filtered');
        if(handler)
            handler(this, eventArgs);
    }
}

Sys.Extended.UI.FilteredTextBoxBehavior.registerClass('Sys.Extended.UI.FilteredTextBoxBehavior', Sys.Extended.UI.BehaviorBase);

Sys.Extended.UI.FilterTypes = function() {
    // Character filter to be applied to a textbox
    // "Custom" - custom Characters
    // "Numbers" - numbers (0123456789)
    // "UppercaseLetters" - uppercase Letters (ABCDEFGHIJKLMNOPQRSTUVWXYZ)
    // "LowercaseLetters" - lowercase Letters (abcdefghijklmnopqrstuvwxyz)
    throw Error.invalidOperation();
}

Sys.Extended.UI.FilterTypes.prototype = {
    Custom: 0x1,
    Numbers: 0x2,
    UppercaseLetters: 0x4,
    LowercaseLetters: 0x8
}

Sys.Extended.UI.FilterTypes.registerEnum('Sys.Extended.UI.FilterTypes', true);

Sys.Extended.UI.FilterModes = function() {
    // Filter mode to be applied to a textbox
    // "ValidChars" - provide a list of valid characters
    // "InvalidChars" - provide a list of invalid characters
    throw Error.invalidOperation();
}

Sys.Extended.UI.FilterModes.prototype = {
    ValidChars: 0x1,
    InvalidChars: 0x2
}

Sys.Extended.UI.FilterModes.registerEnum('Sys.Extended.UI.FilterModes', true);

Sys.Extended.UI.FilteredTextBoxProcessKeyEventArgs = function(key, text, shouldFilter) {
    // Event arguments used when the processKey event is raised
    // "key" - key to be processed
    // "text" - current text in the textbox
    // "shouldFilter" - whether the character should be filtered given the current filteredTextBox settings
    Sys.Extended.UI.FilteredTextBoxProcessKeyEventArgs.initializeBase(this);

    this._key = key;
    this._text = text;
    this._shouldFilter = shouldFilter;
    this._allowKey = !shouldFilter;
}

Sys.Extended.UI.FilteredTextBoxProcessKeyEventArgs.prototype = {

    get_key: function() {
        // Key to be processed
        return this._key;
    },

    get_text: function() {
        // Current text in the textbox
        return this._text;
    },

    get_shouldFilter: function() {
        // Whether the character should be filtered given the current
        // FilteredTextBox settings
        return this._shouldFilter;
    },

    get_allowKey: function() {
        // Whether or not the key will be filtered.  It defaults to the opposite of
        // shouldFilter and should be set by handlers of the processKey event.
        return this._allowKey;
    },

    set_allowKey: function(value) {
        this._allowKey = value;
    }
}

Sys.Extended.UI.FilteredTextBoxProcessKeyEventArgs.registerClass('Sys.Extended.UI.FilteredTextBoxProcessKeyEventArgs', Sys.EventArgs);

Sys.Extended.UI.FilteredTextBoxEventArgs = function(key) {
    // Event arguments used when the filtered event is raised
    // "key" - key that was filtered
    Sys.Extended.UI.FilteredTextBoxEventArgs.initializeBase(this);

    this._key = key;
}

Sys.Extended.UI.FilteredTextBoxEventArgs.prototype = {

    get_key: function() {
        // Key that was filtered
        return this._key;
    }
}

Sys.Extended.UI.FilteredTextBoxEventArgs.registerClass('Sys.Extended.UI.FilteredTextBoxEventArgs', Sys.EventArgs);