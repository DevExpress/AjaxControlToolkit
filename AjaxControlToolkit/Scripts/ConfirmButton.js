Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.ConfirmButtonHiddenEventArgs = function(confirmed) {
    Sys.Extended.UI.ConfirmButtonHiddenEventArgs.initializeBase(this);

    this._confirmed = confirmed;
}

Sys.Extended.UI.ConfirmButtonHiddenEventArgs.prototype = {
    get_confirmed: function() {
        return this._confirmed;
    }
}

Sys.Extended.UI.ConfirmButtonHiddenEventArgs.registerClass('Sys.Extended.UI.ConfirmButtonHiddenEventArgs', Sys.EventArgs);


Sys.Extended.UI.ConfirmButtonBehavior = function(element) {
    Sys.Extended.UI.ConfirmButtonBehavior.initializeBase(this, [element]);

    // Confirm text
    this._ConfirmTextValue = null;

    // Cancel value
    this._OnClientCancelValue = null;

    // Confirm on form submit
    this._ConfirmOnFormSubmit = false;

    // ModalPopup to use instead of window.confirm
    this._displayModalPopupID = null;

    // Script to call to initiate a postback
    this._postBackScript = null;

    // Click handler for the target control
    this._clickHandler = null;

    this._oldScript = null;
}

Sys.Extended.UI.ConfirmButtonBehavior.prototype = {

    initialize: function() {
        Sys.Extended.UI.ConfirmButtonBehavior.callBaseMethod(this, 'initialize');
        var element = this.get_element();

        // Attach the handler
        this._clickHandler = Function.createDelegate(this, this._onClick);
        $addHandler(element, "click", this._clickHandler);

        // hoist out any existing script
        //
        this._oldScript = element.getAttribute("onclick");
        if(this._oldScript)
            element.setAttribute("onclick", null);

        // Hook into the ASP.NET WebForm_OnSubmit function to display the confirm dialog prior to submission
        if(this._ConfirmOnFormSubmit && (typeof (WebForm_OnSubmit) == 'function') && !Sys.Extended.UI.ConfirmButtonBehavior._originalWebForm_OnSubmit) {
            if(Sys.Extended.UI.TextBoxWatermarkBehavior && Sys.Extended.UI.TextBoxWatermarkBehavior._originalWebForm_OnSubmit) {
                // If TextBoxWatermark has already hooked the WebForm_OnSubmit, we want to run before it so the watermark removal is always last to run
                Sys.Extended.UI.ConfirmButtonBehavior._originalWebForm_OnSubmit = Sys.Extended.UI.TextBoxWatermarkBehavior._originalWebForm_OnSubmit;
                Sys.Extended.UI.TextBoxWatermarkBehavior._originalWebForm_OnSubmit = Sys.Extended.UI.ConfirmButtonBehavior.WebForm_OnSubmit;
            } else {
                // Hook WebForm_OnSubmit normally
                Sys.Extended.UI.ConfirmButtonBehavior._originalWebForm_OnSubmit = WebForm_OnSubmit;
                WebForm_OnSubmit = Sys.Extended.UI.ConfirmButtonBehavior.WebForm_OnSubmit;
            }
        }
    },

    dispose: function() {
        // Detach event handlers
        if(this._clickHandler) {
            $removeHandler(this.get_element(), "click", this._clickHandler);
            this._clickHandler = null;
        }

        if(this._oldScript) {
            this.get_element().setAttribute("onclick", this._oldScript);
            this._oldScript = null;
        }

        Sys.Extended.UI.ConfirmButtonBehavior.callBaseMethod(this, 'dispose');
    },

    _onClick: function(e) {
        if(this.get_element() && !this.get_element().disabled) {
            if(this._ConfirmOnFormSubmit) {
                // Note that this behavior was triggered (for later)
                Sys.Extended.UI.ConfirmButtonBehavior._clickedBehavior = this;
            } else {
                // Display the dialog and cancel the click if necessary
                if(!this._displayConfirmDialog()) {
                    e.preventDefault();
                    return false;
                } else if(this._oldScript) {
                    if(String.isInstanceOfType(this._oldScript))
                        eval(this._oldScript);
                    else if(typeof (this._oldScript) == 'function')
                        this._oldScript();
                }
            }
        }
    },

    _displayConfirmDialog: function() {
        // Raise the showing event and potentially cancel
        var eventArgs = new Sys.CancelEventArgs();
        this.raise_showing(eventArgs);

        if(eventArgs.get_cancel())
            return;

        if(this._displayModalPopupID) {
            // Using a ModalPopupBehavior instead of window.confirm
            var mpe = $find(this._displayModalPopupID);
            if(!mpe)
                throw Error.argument('displayModalPopupID', String.format(Sys.Extended.UI.Resources.CollapsiblePanel_NoControlID, this._displayModalPopupID));

            // Hook into ModalPopupBehavior for the confirm result
            mpe.set_OnOkScript("$find('" + this.get_id() + "')._handleConfirmDialogCompletion(true);");
            mpe.set_OnCancelScript("$find('" + this.get_id() + "')._handleConfirmDialogCompletion(false);");

            // Show the ModalPopupBehavior
            mpe.show();

            // Cancel postback since ModalPopupBehavior.show is asynchronous - _handleConfirmDialogCompletion will handle the result
            return false;
        } else {
            // Display window.confirm dialog
            var result = window.confirm(this._ConfirmTextValue);
            this._handleConfirmDialogCompletion(result);

            return result;
        }
    },

    _handleConfirmDialogCompletion: function(result) {
        // Handle the completion of a confirm dialog (whether by window.confirm or ModalPopupBehavior)
        this.raise_hidden(new Sys.Extended.UI.ConfirmButtonHiddenEventArgs(result));

        if(result) {
            // Confirmed - Initiate the postback if specified
            if(this._postBackScript)
                eval(this._postBackScript);
        } else {
            // Rejected - Execute the associated script if present
            if(this._OnClientCancelValue)
                window[this._OnClientCancelValue]();
        }
    },

    /// <summary>
    /// A string that contains a client script that executes when the Cancel button is clicked in the confirm dialog box.
    /// </summary>
    /// <getter>get_onClientCancel</getter>
    /// <setter>set_onClientCancel</setter>
    /// <member name="cP:AjaxControlToolkit.ConfirmButtonExtender.onClientCancel" />
    get_onClientCancel: function() {
        // The client-side script that executes when the cancel button is clicked on the confirm dialog.
        return this._OnClientCancelValue;
    },
    set_onClientCancel: function(value) {
        if(this._OnClientCancelValue != value) {
            this._OnClientCancelValue = value;
            this.raisePropertyChanged('onClientCancel');
        }
    },

    get_OnClientCancel: function() {
        Sys.Extended.Deprecated("get_OnClientCancel()", "get_onClientCancel()");
        return this.get_onClientCancel();  
    },
    set_OnClientCancel: function(value) {
        Sys.Extended.Deprecated("set_OnClientCancel(value)", "set_onClientCancel(value)");
        this.set_onClientCancel(value);
    },

    /// <summary>
    /// Confirmation text to display.
    /// </summary>
    /// <remarks>
    /// HTML entities can be used for a newline character.
    /// </remarks>
    /// <getter>get_confirmText</getter>
    /// <setter>set_confirmText</setter>
    /// <member name="cP:AjaxControlToolkit.ConfirmButtonExtender.confirmText" />
    get_confirmText: function() {
        // The text to show when you want to confirm the click. (Note: HTML entities can be used here (ex: "&#10;" for new-line))
        return this._ConfirmTextValue;
    },
    set_confirmText: function(value) {
        if(this._ConfirmTextValue != value) {
            this._ConfirmTextValue = value;
            this.raisePropertyChanged('confirmText');
        }
    },

    get_ConfirmText: function() {
        Sys.Extended.Deprecated("get_ConfirmText()", "get_confirmText()");
        return this.get_confirmText();  
    },
    set_ConfirmText: function(value) {
        Sys.Extended.Deprecated("set_ConfirmText(value)", "set_confirmText(value)");
        this.set_confirmText(value);
    },

    /// <summary>
    /// A Boolean value that specifies that the confirm dialog box should not be displayed until the form is submitted.
    /// </summary>
    /// <remarks>
    /// This is useful if a page contains ASP.NET validator controls and the confirm dialog box should be displayed only after all validation checks pass.
    /// </remarks>
    /// <getter>get_confirmOnFormSubmit</getter>
    /// <setter>set_confirmOnFormSubmit</setter>
    /// <member name="cP:AjaxControlToolkit.ConfirmButtonExtender.confirmOnFormSubmit" />
    get_confirmOnFormSubmit: function() {
        // True iff the confirm dialog should run for form submission (i.e., after validators are all satisfied)
        return this._ConfirmOnFormSubmit;
    },
    set_confirmOnFormSubmit: function(value) {
        if(this._ConfirmOnFormSubmit != value) {
            this._ConfirmOnFormSubmit = value;
            this.raisePropertyChanged('confirmOnFormSubmit');
        }
    },

    get_ConfirmOnFormSubmit: function() {
        Sys.Extended.Deprecated("get_ConfirmOnFormSubmit()", "get_confirmOnFormSubmit()");
        return this.get_confirmOnFormSubmit();
    },
    set_ConfirmOnFormSubmit: function(value) {
        Sys.Extended.Deprecated("set_ConfirmOnFormSubmit(value)", "set_confirmOnFormSubmit(value)");
        this.set_confirmOnFormSubmit(value);
    },

    /// <summary>
    /// A string that contains the ID of the ModalPopupBehavior control for use instead of the default window.confirm dialog box.
    /// </summary>
    /// <getter>get_displayModalPopupID</getter>
    /// <setter>set_displayModalPopupID</setter>
    /// <member name="cP:AjaxControlToolkit.ConfirmButtonExtender.displayModalPopupID" />
    get_displayModalPopupID: function() {
        // ID of a ModalPopupBehavior to be used instead of the default window.confirm dialog
        return this._displayModalPopupID;
    },
    set_displayModalPopupID: function(value) {
        if(this._displayModalPopupID != value) {
            this._displayModalPopupID = value;
            this.raisePropertyChanged('displayModalPopupID');
        }
    },

    /// <summary>
    /// A string that contains script to run in order to initiate a postback.
    /// </summary>
    /// <getter>get_postBackScript</getter>
    /// <setter>set_postBackScript</setter>
    /// <member name="cP:AjaxControlToolkit.ConfirmButtonExtender.postBackScript" />
    get_postBackScript: function() {
        return this._postBackScript;
    },
    set_postBackScript: function(value) {
        if(this._postBackScript != value) {
            this._postBackScript = value;
            this.raisePropertyChanged('postBackScript');
        }
    },

    /// <summary>
    /// Fires when the control is being shown.
    /// </summary>
    /// <event add="add_showing" remove="remove_showing" raise="raise_showing" />
    /// <member name="cE:AjaxControlToolkit.ConfirmButtonExtender.showing" />
    add_showing: function(handler) {
        this.get_events().addHandler('showing', handler);
    },
    remove_showing: function(handler) {
        this.get_events().removeHandler('showing', handler);
    },
    raise_showing: function(eventArgs) {
        var handler = this.get_events().getHandler('showing');
        if(handler)
            handler(this, eventArgs);
    },
    raiseShowing: function(eventArgs) {
        Sys.Extended.Deprecated("raiseShowing", "raise_showing");
        this.raise_showing(eventArgs);
    },

    /// <summary>
    /// Fires when the control is hidden.
    /// </summary>
    /// <event add="add_hidden" remove="remove_hidden" raise="raise_hidden" />
    /// <member name="cE:AjaxControlToolkit.ConfirmButtonExtender.hidden" />
    add_hidden: function(handler) {
        this.get_events().addHandler('hidden', handler);
    },
    remove_hidden: function(handler) {
        this.get_events().removeHandler('hidden', handler);
    },
    raise_hidden: function(eventArgs) {
        var handler = this.get_events().getHandler('hidden');
        if(handler)
            handler(this, eventArgs);
    },
    raiseHidden: function(eventArgs) {
        Sys.Extended.Deprecated("raiseHidden", "raise_hidden");
        this.raise_hidden(eventArgs);
    }
}

Sys.Extended.UI.ConfirmButtonBehavior.registerClass('Sys.Extended.UI.ConfirmButtonBehavior', Sys.Extended.UI.BehaviorBase);

Sys.Extended.UI.ConfirmButtonBehavior.WebForm_OnSubmit = function() {
    // Wraps ASP.NET's WebForm_OnSubmit in order to display the confirm dialog prior to submission    
    var result = Sys.Extended.UI.ConfirmButtonBehavior._originalWebForm_OnSubmit();

    if(result && Sys.Extended.UI.ConfirmButtonBehavior._clickedBehavior)
        result = Sys.Extended.UI.ConfirmButtonBehavior._clickedBehavior._displayConfirmDialog();

    Sys.Extended.UI.ConfirmButtonBehavior._clickedBehavior = null;

    return result;
}