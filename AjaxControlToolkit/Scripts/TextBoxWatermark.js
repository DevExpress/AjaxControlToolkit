Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.TextBoxWatermarkBehavior = function(element) {
    // The TextBoxWatermarkBehavior applies a watermark to a textbox
    // "element" - textbox associated with the behavior
    Sys.Extended.UI.TextBoxWatermarkBehavior.initializeBase(this, [element]);
    
    // Properties
    this._watermarkText = null;
    this._watermarkCssClass = null;

    // Member variables
    this._focusHandler = null;
    this._blurHandler = null;
    this._keyPressHandler = null;
    this._propertyChangedHandler = null;
    this._watermarkChangedHandler = null;
    this._oldClassName = null;
    this._clearedForSubmit = null;
    this._maxLength = null;

    // Hook into the ASP.NET WebForm_OnSubmit function to clear watermarks prior to submission
    if ((typeof(WebForm_OnSubmit) == 'function') && !Sys.Extended.UI.TextBoxWatermarkBehavior._originalWebForm_OnSubmit) {
        Sys.Extended.UI.TextBoxWatermarkBehavior._originalWebForm_OnSubmit = WebForm_OnSubmit;
        WebForm_OnSubmit = Sys.Extended.UI.TextBoxWatermarkBehavior.WebForm_OnSubmit;
    }
}
Sys.Extended.UI.TextBoxWatermarkBehavior.prototype = {
    initialize : function() {
        // Initialize the behavior
        Sys.Extended.UI.TextBoxWatermarkBehavior.callBaseMethod(this, 'initialize');

        var e = this.get_element();

        // Determine if this textbox is focused initially
        var hasInitialFocus = false;
        
        var clientState = Sys.Extended.UI.TextBoxWatermarkBehavior.callBaseMethod(this, 'get_ClientState');
        if (clientState != null && clientState != "") {
            hasInitialFocus = (clientState == "Focused");
            Sys.Extended.UI.TextBoxWatermarkBehavior.callBaseMethod(this, 'set_ClientState', null);
        }

        // Capture the initial style so we can toggle back and forth
        // between this and the watermarked style
        this._oldClassName = e.className;

        // Create delegates
        this._focusHandler = Function.createDelegate(this, this._onFocus);
        this._blurHandler = Function.createDelegate(this, this._onBlur);
        this._keyPressHandler = Function.createDelegate(this, this._onKeyPress);

        // Attach events
        $addHandler(e, 'focus', this._focusHandler);
        $addHandler(e, 'blur', this._blurHandler);
        $addHandler(e, 'keypress', this._keyPressHandler);

        this.registerPropertyChanged();

        // Initialize state and simulate a blur to apply the watermark if appropriate
        // Note: The comparison against _watermarkText is undesirable, but seemingly
        // necessary to support the load->Home->Back scenario in IE
        var currentValue = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()).get_Current();
        var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());
        if (("" == currentValue) || (this._watermarkText == currentValue)) {
            wrapper.set_Watermark(this._watermarkText)
            wrapper.set_IsWatermarked(true);
        }
        if (hasInitialFocus) {
            this._onFocus();
        } else {
            e.blur();
            this._onBlur();
        }

        this._clearedForSubmit = false;

        this.registerPartialUpdateEvents();

        this._watermarkChangedHandler = Function.createDelegate(this, this._onWatermarkChanged);
        wrapper.add_WatermarkChanged(this._watermarkChangedHandler);
    },

    dispose : function() {
        // Dispose the behavior
        var e = this.get_element();

        if (this._watermarkChangedHandler) {
            Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()).remove_WatermarkChanged(this._watermarkChangedHandler);
            this._watermarkChangedHandler = null;
        }

        // Unhook from Sys.Preview.UI.TextBox if present
        if(e.control && this._propertyChangedHandler) {
            e.control.remove_propertyChanged(this._propertyChangedHandler);
            this._propertyChangedHandler = null;
        }

        // Detach events
        if (this._focusHandler) {
            $removeHandler(e, 'focus', this._focusHandler);
            this._focusHandler = null;
        }
        if (this._blurHandler) {
            $removeHandler(e, 'blur', this._blurHandler);
            this._blurHandler = null;
        }
        if (this._keyPressHandler) {
            $removeHandler(e, 'keypress', this._keyPressHandler);
            this._keyPressHandler = null;
        }

        // Clear watermark text to avoid confusion during Refresh/Back/Forward
        if(Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()).get_IsWatermarked())
            this.clearText(false);

        Sys.Extended.UI.TextBoxWatermarkBehavior.callBaseMethod(this, 'dispose');
    },

    _onWatermarkChanged : function(sender, eventArgs) {
        // Handler invoked when the watermark changes
        if (Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()).get_IsWatermarked())
            this._onBlur();
        else
            this._onFocus();
    },

    /// <summary>
    /// Clears the text from the target
    /// </summary>
    /// <param name="focusing" type="Boolean">Whether or not we are focusing on the textbox</param>
    /// <member name="cM:AjaxControlToolkit.TextBoxWatermarkExtender.clearText" />
    clearText : function(focusing) {
        var element = this.get_element();
        var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(element);
        wrapper.set_Value("");
        wrapper.set_IsWatermarked(false);
        if(focusing)
            element.select();  // This fix displays the blinking cursor in a focused, empty text box in IE
    },

    _onFocus : function(evt) {
        // Handler for the textbox's focus event
        // "evt" - event info
        var e = this.get_element();
        if(Sys.Extended.UI.TextBoxWrapper.get_Wrapper(e).get_IsWatermarked()) {
            // Clear watermark
            this.clearText(evt ? true : false);
        }
        e.className = this._oldClassName;
        
        // Restore the MaxLength on the TextBox when we edit
        // the non-watermarked text
        if (this._maxLength > 0) {
            this.get_element().maxLength = this._maxLength;
            this._maxLength = null;
        }
    },

    _onBlur : function() {
        // Handle the textbox's blur event
        var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());
        if(("" == wrapper.get_Current()) || wrapper.get_IsWatermarked()) {
            // Enlarge the TextBox's MaxLength if it's not big enough
            // to accomodate the watermark
            if (this.get_element().maxLength > 0 && this._watermarkText.length > this.get_element().maxLength) {
                this._maxLength = this.get_element().maxLength;
                this.get_element().maxLength = this._watermarkText.length;
            }
            
            this._applyWatermark();
        }
    },

    _applyWatermark : function() {
        // Apply the watermark to the textbox
        var wrapper = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element());
        wrapper.set_Watermark(this._watermarkText);
        wrapper.set_IsWatermarked(true);

        if(!this._watermarkCssClass)
            return;

        var classList = this.get_element().className.split();
        if (Array.indexOf(classList, this._watermarkCssClass) === -1) {
            classList.push(this._watermarkCssClass);
            this.get_element().className = classList.join(" ");
        }
    },

    _onKeyPress : function() {
        // Handle the textbox's keypress event
        Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()).set_IsWatermarked(false);
    },

    /// <summary>
    /// A method to call to be assigned to Sys.Preview.UI.TextBox if any
    /// </summary>
    /// <remarks>
    /// This method must be called manually if Sys.Preview.UI.TextBox
    /// is added after TextBoxWatermarkBehavior is initialized
    /// </remarks>
    /// <member name="cM:AjaxControlToolkit.TextBoxWatermarkExtender.registerPropertyChanged" />
    registerPropertyChanged : function() {
        var e = this.get_element();
        if(e.control && !this._propertyChangedHandler) {
            this._propertyChangedHandler = Function.createDelegate(this, this._onPropertyChanged);
            e.control.add_propertyChanged(this._propertyChangedHandler);
        }
    },

    _onPropertyChanged : function(sender, propertyChangedEventArgs) {
        // Handler called automatically when a property change event is fired
        // "sender" - sender
        // "propertyChangedEventArgs" - event arguments
        if("text" == propertyChangedEventArgs.get_propertyName())
            this.set_Text(Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()).get_Current());
    },

    _onSubmit : function() {
        // Handler Called automatically when a submit happens to clear the watermark before posting back
        if(Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()).get_IsWatermarked()) {
            // Clear watermark text before page is submitted
            this.clearText(false);
            this._clearedForSubmit = true;
        }
    },

    _partialUpdateEndRequest : function(sender, endRequestEventArgs) {
        // Handler Called automatically when a partial postback ends
        // "sender" - sender
        // "endRequestEventArgs" - event arguments
        Sys.Extended.UI.TextBoxWatermarkBehavior.callBaseMethod(this, '_partialUpdateEndRequest', [sender, endRequestEventArgs]);

        if (this.get_element() && this._clearedForSubmit) {
            // Restore the cleared watermark (useful when the submit was wrapped in an UpdatePanel)
            this.get_element().blur();
            this._onBlur();
            this._clearedForSubmit = false;
        }
    },
    
    /// <summary>
    /// Text to show when the control has no value
    /// </summary>
    /// <getter>get_watermarkText</getter>
    /// <setter>set_watermarkText</setter>
    /// <member name="cP:AjaxControlToolkit.TextBoxWatermarkExtender.watermarkText" />
    get_watermarkText: function() {
        return this._watermarkText;
    },
    set_watermarkText: function(value) {
        if(this._watermarkText != value) {
            this._watermarkText = value;
            if(Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()).get_IsWatermarked())
                this._applyWatermark();
            this.raisePropertyChanged('watermarkText');
        }
    },

    get_WatermarkText : function() {
        Sys.Extended.Deprecated("get_WatermarkText()", "get_watermarkText()");
        return this.get_watermarkText();
    },
    set_WatermarkText : function(value) {
        Sys.Extended.Deprecated("set_WatermarkText(value)", "set_watermarkText(value)");
        this.set_watermarkText(value);
    },

    /// <summary>
    /// A CSS class to apply to the TextBox when it has no value (e.g. watermark text is shown)
    /// </summary>
    /// <getter>get_watermarkCssClass</getter>
    /// <setter>set_watermarkCssClass</setter>
    /// <member name="cP:AjaxControlToolkit.TextBoxWatermarkExtender.watermarkCssClass" />
    get_watermarkCssClass: function() {
        return this._watermarkCssClass;
    },
    set_watermarkCssClass: function(value) {
        if(this._watermarkCssClass != value) {
            this._watermarkCssClass = value;
            if(Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()).get_IsWatermarked())
                this._applyWatermark();
            this.raisePropertyChanged('watermarkCssClass');
        }
    },

    get_WatermarkCssClass : function() {
        Sys.Extended.Deprecated("get_WatermarkCssClass()", "get_watermarkCssClass()");
        return this.get_watermarkCssClass();
    },
    set_WatermarkCssClass : function(value) {
        Sys.Extended.Deprecated("set_WatermarkCssClass(value)", "set_watermarkCssClass(value)");
        this.set_watermarkCssClass(value);
    },

    /// <summary>
    /// Text of the target TextBox
    /// </summary>
    /// <getter>get_text</getter>
    /// <setter>set_text</setter>
    /// <member name="cP:AjaxControlToolkit.TextBoxWatermarkExtender.text" />
    get_text: function() {
        // Wrapper for the textbox's text that will ignore or create the watermark as appropriate
        return Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()).get_Value();
    },
    set_text: function(value) {
        if ("" == value) {
            Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()).set_Current("");
            this.get_element().blur();
            this._onBlur();  // onBlur needs to see ""
        } else {
            this._onFocus();  // onFocus sets ""
            Sys.Extended.UI.TextBoxWrapper.get_Wrapper(this.get_element()).set_Current(value);
        }
    },

    get_Text : function() {
        Sys.Extended.Deprecated("get_Text()", "get_text()");
        return this.get_text();
    },
    set_Text : function(value) {
        Sys.Extended.Deprecated("set_Text(value)", "set_text(value)");
        this.set_text(value);
    }
}
Sys.Extended.UI.TextBoxWatermarkBehavior.registerClass('Sys.Extended.UI.TextBoxWatermarkBehavior', Sys.Extended.UI.BehaviorBase);

Sys.Extended.UI.TextBoxWatermarkBehavior.WebForm_OnSubmit = function() {
    // Wraps ASP.NET's WebForm_OnSubmit in order to strip all watermarks prior to submission
    // returns - result of original WebForm_OnSubmit
    var result = Sys.Extended.UI.TextBoxWatermarkBehavior._originalWebForm_OnSubmit();
    if (result) {
        var components = Sys.Application.getComponents();
        for(var i = 0 ; i < components.length ; i++) {
            var component = components[i];
            if (Sys.Extended.UI.TextBoxWatermarkBehavior.isInstanceOfType(component))
                component._onSubmit();
        }
    }
    return result;
}