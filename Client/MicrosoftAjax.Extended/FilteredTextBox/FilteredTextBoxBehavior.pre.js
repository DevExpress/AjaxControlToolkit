


/// <reference name="MicrosoftAjax.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />

(function() {
var scriptName = "ExtendedFilteredTextBox";

function execute() {

Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.FilteredTextBoxBehavior = function(element) {
    /// <summary>
    /// The FilteredTextBoxBehavior is used to prevent invalid characters from being entered into a textbox
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement">
    /// The textbox element this behavior is associated with
    /// </param>
    Sys.Extended.UI.FilteredTextBoxBehavior.initializeBase(this, [element]);
    
    this._keypressHandler = null;
    this._changeHandler = null;
    
    this._intervalID = null;
    
    this._filterType =  Sys.Extended.UI.FilterTypes.Custom;
    this._filterMode =  Sys.Extended.UI.FilterModes.ValidChars;
    this._validChars = null;
    this._invalidChars = null;
    this._filterInterval = 250;
    
    this.charTypes = { };
    this.charTypes.LowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    this.charTypes.UppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.charTypes.Numbers = "0123456789";
}
Sys.Extended.UI.FilteredTextBoxBehavior.prototype = {
    initialize : function() {
        /// <summary>
        /// Initialize the behavior
        /// </summary>
        Sys.Extended.UI.FilteredTextBoxBehavior.callBaseMethod(this, 'initialize');
        
        var element = this.get_element();

        this._keypressHandler = Function.createDelegate(this, this._onkeypress);
        $addHandler(element, 'keypress', this._keypressHandler);
        
        this._changeHandler = Function.createDelegate(this, this._onchange);
        $addHandler(element, 'change', this._changeHandler);

        var callback = Function.createDelegate(this, this._intervalCallback);
        this._intervalID = window.setInterval(callback, this._filterInterval);
    },
    
    dispose : function() {
        /// <summary>
        /// Dispose the behavior
        /// </summary>
        var element = this.get_element();
        
        $removeHandler(element, 'keypress', this._keypressHandler);
        this._keypressHandler = null;
        
        $removeHandler(element, 'change', this._changeHandler);
        this._changeHandler = null;

        window.clearInterval(this._intervalID);
        
        Sys.Extended.UI.FilteredTextBoxBehavior.callBaseMethod(this, 'dispose');
    },
    
    _getValidChars : function() {
        /// <summary>
        /// Get all the valid characters
        /// </summary>
        /// <returns type="String">
        /// All valid characters
        /// </returns>

        if (this._validChars) return this._validChars;
        this._validChars = "";
        
        for (type in this.charTypes) {
            var filterType = Sys.Extended.UI.FilterTypes.toString(this._filterType);
            if (filterType.indexOf(type) != -1) {
                this._validChars += this.charTypes[type];
            }
        }

        return this._validChars;    
    },
    
    _getInvalidChars : function() {
        /// <summary>
        /// Get all the invalid characters (in case of custom filtering and InvalidChars mode)
        /// </summary>
        /// <returns type="String">
        /// All invalid characters
        /// </returns>

        if (!this._invalidChars) {
            this._invalidChars = this.charTypes.Custom;
        }
        return this._invalidChars;
    },

    _onkeypress : function(evt) {
        /// <summary>
        /// Handler for the target textbox's key press event
        /// </summary>
        /// <param name="evt" type="Sys.UI.DomEvent">
        /// Event info
        /// </param>

        // This handler will only get called for valid characters in IE, we use keyCode
        //
        // In FireFox, this will be called for all key presses, with charCode/which
        // being set for keys we should filter (e.g. the chars) and keyCode being
        // set for all other keys.
        //
        // scanCode = event.charCode
        //
        // In Safari, charCode, which, and keyCode will all be filled with the same value,
        // as well as keyIdentifier, which has the string representation either as "end" or "U+00000008"
        //
        // 1) Check for ctrl/alt/meta -> bail if true
        // 2) Check for keyIdentifier.startsWith("U+") -> bail if false
        // 3) Check keyCode < 0x20 -> bail
        // 4) Special case Delete (63272) -> bail
        
        var scanCode;

        // Note (Supergibbs): Changed to handle all majors browsers
        // IE and Safari only fires for valid characters
        // Firefox sets charCode to 0 and uses keyCode for special keys
        // Opera always fires but you cannot distinguish which are valid or special keys 
        if ( (((/* ff */ evt.rawEvent.charCode == 0) || 
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
               (evt.ctrlKey /* Control keys */)) {
            return;
        }        
       
        if (evt.rawEvent.keyIdentifier) {
            // Safari
            // Note (Garbin): used the underlying rawEvent insted of the DomEvent instance.
            if (evt.rawEvent.ctrlKey || evt.rawEvent.altKey || evt.rawEvent.metaKey) {
                return;
            }
            
            if (evt.rawEvent.keyIdentifier.substring(0,2) != "U+") {
                return;
            }
            
            scanCode = evt.rawEvent.charCode; 
            if (scanCode == 63272 /* Delete */) {
                return;
            }
        } else {
            scanCode = evt.charCode;
        }  
            
        if (scanCode && scanCode >= 0x20 /* space */) {
            var c = String.fromCharCode(scanCode);
            if(!this._processKey(c)) {
                evt.preventDefault();
            }
        }
    },
    
    _processKey : function(key) {
        /// <summary>
        /// Determine whether the key is valid or whether it should be filtered out
        /// </summary>
        /// <param name="key" type="String">
        /// Character to be validated
        /// </param>
        /// <returns type="Boolean">
        /// True if the character should be accepted, false if it should be filtered
        /// </returns>

        // Allow anything that's not a printable character,
        // e.g. backspace, arrows, etc.  Everything above 32
        // should be considered allowed, as it may be Unicode, etc.
        
        var filter = "";
        var shouldFilter = false;
        
        if (this._filterMode == Sys.Extended.UI.FilterModes.ValidChars) {
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
        if (eventArgs.get_allowKey()) {
            return true;
        }
        
        // Else if it was decided that it shouldn't be allowed,
        // raise the Filtered event and return false to filter the key
        this.raiseFiltered(new Sys.Extended.UI.FilteredTextBoxEventArgs(key));
        return false;
    },
    
    _onchange : function() {
        /// <summary>
        /// Handler for the target textbox's key change event which will filter
        /// the text again (to make sure no text was inserted without keypresses, etc.)
        /// </summary>
        
        var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());
        var text = wrapper.get_Value() || '';
        var result = new Sys.StringBuilder();
        for (var i = 0; i < text.length; i++) {
            var ch = text.substring(i, i+1);
            if (this._processKey(ch)) {
                result.append(ch);
            }
        }
        // change the value only if it is different
        if (wrapper.get_Value() != result.toString()) {
            wrapper.set_Value(result.toString());
        }
    },
    
    _intervalCallback : function() {
    /// <summary>
    /// Method that is repeatedly called to purge invalid characters from the textbox
    /// </summary>
        
        this._changeHandler();
    },
    
    get_ValidChars : function() {
        /// <value type="String">
        /// A string consisting of all characters considered valid for the textbox, if
        /// "Custom" is specified as the field type. Otherwise this parameter is ignored.
        /// </value>
        return this.charTypes.Custom;
    },
    set_ValidChars : function(value) {
        if (this._validChars != null || this.charTypes.Custom != value) {
            this.charTypes.Custom = value;
            this._validChars = null;
            this.raisePropertyChanged('ValidChars');
        }
    },

    get_InvalidChars : function() {
        /// <value type="String">
        /// A string consisting of all characters considered invalid for the textbox, if "Custom" is specified as the field type. Otherwise this parameter is ignored.
        /// </value>
        return this.charTypes.Custom;
    },
    set_InvalidChars : function(value) {
        if (this._invalidChars != null || this.charTypes.Custom != value) {
            this.charTypes.Custom = value;
            this._invalidChars = null;
            this.raisePropertyChanged('InvalidChars');
        }
    },
    
    get_FilterType : function() {
        /// <value type="Sys.Extended.UI.FilterTypes">
        /// FilterType - A the type of filter to apply, as a comma-separated combination of
        /// Numbers, LowercaseLetters, UppercaseLetters, and Custom. If Custom is specified,
        /// the ValidChars field will be used in addition to other settings such as Numbers.
        /// </value>
        return this._filterType;
    },        
    set_FilterType : function(value) {
        if (this._validChars != null || this._filterType != value) {
            this._filterType = value;
            this._validChars = null;
            this.raisePropertyChanged('FilterType');
        }
    },
    
    get_FilterMode : function() {
        /// <value type="Sys.Extended.UI.FilterModes">
        /// FilterMode - The filter mode to apply when custom filtering is activated; supported values are ValidChars and InvalidChars.
        /// </value>
        return this._filterMode;
    },        
    set_FilterMode : function(value) {
        if (this._validChars != null || this._invalidChars != null || this._filterMode != value) {
            this._filterMode = value;
            this._validChars = null;
            this._invalidChars = null;
            this.raisePropertyChanged('FilterMode');
        }
    },

    get_FilterInterval : function() {
        /// <value type="int">
        /// An integer containing the interval (in milliseconds) in which 
        /// the field's contents are filtered
        /// </value>
        return this._filterInterval;
    },
    set_FilterInterval : function(value) {
        if (this._filterInterval != value) {
            this._filterInterval = value;
            this.raisePropertyChanged('FilterInterval');
        }
    },
    
    add_processKey : function(handler) {
        /// <summary>
        /// Add an event handler for the processKey event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('processKey', handler);
    },
    remove_processKey : function(handler) {
        /// <summary>
        /// Remove an event handler from the processKey event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('processKey', handler);
    },
    raiseProcessKey : function(eventArgs) {
        /// <summary>
        /// Raise the processKey event
        /// </summary>
        /// <param name="eventArgs" type="Sys.Extended.UI.FilteredTextBoxProcessKeyEventArgs" mayBeNull="false">
        /// Event arguments for the processKey event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('processKey');
        if (handler) {
            handler(this, eventArgs);
        }
    },

    add_filtered : function(handler) {
        /// <summary>
        /// Add an event handler for the filtered event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('filtered', handler);
    },
    remove_filtered : function(handler) {
        /// <summary>
        /// Remove an event handler from the filtered event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('filtered', handler);
    },
    raiseFiltered : function(eventArgs) {
        /// <summary>
        /// Raise the filtered event
        /// </summary>
        /// <param name="eventArgs" type="Sys.Extended.UI.FilteredTextBoxEventArgs" mayBeNull="false">
        /// Event arguments for the filtered event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('filtered');
        if (handler) {
            handler(this, eventArgs);
        }
    }
}
Sys.Extended.UI.FilteredTextBoxBehavior.registerClass('Sys.Extended.UI.FilteredTextBoxBehavior', Sys.Extended.UI.BehaviorBase);
Sys.registerComponent(Sys.Extended.UI.FilteredTextBoxBehavior, { name: "filteredTextBox" });

Sys.Extended.UI.FilterTypes = function() {
    /// <summary>
    /// Character filter to be applied to a textbox
    /// </summary>
    /// <field name="Custom" type="Number" integer="true">
    /// Custom Characters
    /// </field>
    /// <field name="Numbers" type="Number" integer="true">
    /// Numbers (0123456789)
    /// </field>
    /// <field name="UppercaseLetters" type="Number" integer="true">
    /// Uppercase Letters (ABCDEFGHIJKLMNOPQRSTUVWXYZ)
    /// </field>
    /// <field name="LowercaseLetters" type="Number" integer="true">
    /// Lowercase Letters (abcdefghijklmnopqrstuvwxyz)
    /// </field>
    throw Error.invalidOperation();
}
Sys.Extended.UI.FilterTypes.prototype = {
    Custom           :  0x1,
    Numbers          :  0x2,
    UppercaseLetters :  0x4,
    LowercaseLetters :  0x8
}
Sys.Extended.UI.FilterTypes.registerEnum('Sys.Extended.UI.FilterTypes', true);

Sys.Extended.UI.FilterModes = function() {
    /// <summary>
    /// Filter mode to be applied to a textbox
    /// </summary>
    /// <field name="ValidChars" type="Number" integer="true">
    /// Provide a list of valid characters
    /// </field>
    /// <field name="InvalidChars" type="Number" integer="true">
    /// Provide a list of invalid characters
    /// </field>
    throw Error.invalidOperation();
}
Sys.Extended.UI.FilterModes.prototype = {
    ValidChars   :  0x1,
    InvalidChars :  0x2
}
Sys.Extended.UI.FilterModes.registerEnum('Sys.Extended.UI.FilterModes', true);

Sys.Extended.UI.FilteredTextBoxProcessKeyEventArgs = function(key, text, shouldFilter) {
    /// <summary>
    /// Event arguments used when the processKey event is raised
    /// </summary>
    /// <param name="key" type="String" mayBeNull="False">
    /// Key to be processed
    /// </param>
    /// <param name="text" type="String" mayBeNull="True">
    /// Current text in the textbox
    /// </param>
    /// <param name="shouldFilter" type="Boolean" mayBeNull="False">
    /// Whether the character should be filtered given the current
    /// FilteredTextBox settings
    /// </param>
    Sys.Extended.UI.FilteredTextBoxProcessKeyEventArgs.initializeBase(this);
    
    this._key = key;
    this._text = text;
    this._shouldFilter = shouldFilter;
    this._allowKey = !shouldFilter;
}
Sys.Extended.UI.FilteredTextBoxProcessKeyEventArgs.prototype = {
    get_key : function() {
        /// <value type="String" mayBeNull="False">
        /// Key to be processed
        /// </value>
        return this._key;
    },
    
    get_text : function() {
        /// <value type="String" mayBeNull="True">
        /// Current text in the textbox
        /// </value>
        return this._text;
    },
    
    get_shouldFilter : function() {
        /// <value type="Boolean" mayBeNull="False">
        /// Whether the character should be filtered given the current
        /// FilteredTextBox settings
        /// </value>
        return this._shouldFilter;
    },
    
    get_allowKey : function() {
        /// <value type="Boolean" mayBeNull="False">
        /// Whether or not the key will be filtered.  It defaults to the opposite of
        /// shouldFilter and should be set by handlers of the processKey event.
        /// </value>
        return this._allowKey;
    },
    set_allowKey : function(value) {
        this._allowKey = value;
    }
}
Sys.Extended.UI.FilteredTextBoxProcessKeyEventArgs.registerClass('Sys.Extended.UI.FilteredTextBoxProcessKeyEventArgs', Sys.EventArgs);

Sys.Extended.UI.FilteredTextBoxEventArgs = function(key) {
    /// <summary>
    /// Event arguments used when the filtered event is raised
    /// </summary>
    /// <param name="key" type="String" mayBeNull="False">
    /// Key that was filtered
    /// </param>
    Sys.Extended.UI.FilteredTextBoxEventArgs.initializeBase(this);

    this._key = key;
}
Sys.Extended.UI.FilteredTextBoxEventArgs.prototype = {
    get_key : function() {
        /// <value type="String" mayBeNull="False">
        /// Key that was filtered
        /// </value>
        return this._key;
    }
}
Sys.Extended.UI.FilteredTextBoxEventArgs.registerClass('Sys.Extended.UI.FilteredTextBoxEventArgs', Sys.EventArgs);

} // execute

if (window.Sys && Sys.loader) {
    Sys.loader.registerScript(scriptName, ["ExtendedBase", "ExtendedCommon"], execute);
}
else {
    execute();
}

})();
