// (c) 2010 CodePlex Foundation



/// <reference name="MicrosoftAjax.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />

(function() {
var scriptName = "ExtendedConfirmButton";

function execute() {

Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.ConfirmButtonHiddenEventArgs = function(confirmed) {
    /// <summary>
    /// Event arguments used when the hidden event is raised
    /// </summary>
    /// <param name="confirmed" type="Boolean" mayBeNull="false">
    /// Whether or not the user confirmed the prompt
    /// </param>
    Sys.Extended.UI.ConfirmButtonHiddenEventArgs.initializeBase(this);
    
    this._confirmed = confirmed;
}
Sys.Extended.UI.ConfirmButtonHiddenEventArgs.prototype = {
    get_confirmed : function()  {
        /// <value type="Boolean" mayBeNull="false">
        /// Whether or not the user confirmed the prompt
        /// </value>
        return this._confirmed;
    }
}
Sys.Extended.UI.ConfirmButtonHiddenEventArgs.registerClass('Sys.Extended.UI.ConfirmButtonHiddenEventArgs', Sys.EventArgs);


Sys.Extended.UI.ConfirmButtonBehavior = function(element) {
    /// <summary>
    /// The ConfirmButtonBehavior extends buttons by providing a confirmation dialog when clicked
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" domElement="true">
    /// Button the behavior is associated with
    /// </param>
    Sys.Extended.UI.ConfirmButtonBehavior.initializeBase(this, [element]);

    this._ConfirmTextValue = null;

    this._OnClientCancelValue = null;

    this._ConfirmOnFormSubmit = false;

    this._displayModalPopupID = null;

    this._postBackScript = null;

    this._clickHandler = null;
    
    this._oldScript = null;
}
Sys.Extended.UI.ConfirmButtonBehavior.prototype = {
    initialize : function() {
        /// <summary>
        /// Initialize the behavior
        /// </summary>
        Sys.Extended.UI.ConfirmButtonBehavior.callBaseMethod(this, 'initialize');
        var element = this.get_element();

        this._clickHandler = Function.createDelegate(this, this._onClick);
        $addHandler(element, "click", this._clickHandler);
        
        this._oldScript = element.getAttribute("onclick");
        if (this._oldScript) {            
            element.setAttribute("onclick", null);            
        }

        if (this._ConfirmOnFormSubmit && (typeof(WebForm_OnSubmit) == 'function') && !Sys.Extended.UI.ConfirmButtonBehavior._originalWebForm_OnSubmit) {
            if (Sys.Extended.UI.TextBoxWatermarkBehavior && Sys.Extended.UI.TextBoxWatermarkBehavior._originalWebForm_OnSubmit) {
                Sys.Extended.UI.ConfirmButtonBehavior._originalWebForm_OnSubmit = Sys.Extended.UI.TextBoxWatermarkBehavior._originalWebForm_OnSubmit;
                Sys.Extended.UI.TextBoxWatermarkBehavior._originalWebForm_OnSubmit = Sys.Extended.UI.ConfirmButtonBehavior.WebForm_OnSubmit;
            } else {
                Sys.Extended.UI.ConfirmButtonBehavior._originalWebForm_OnSubmit = WebForm_OnSubmit;
                WebForm_OnSubmit = Sys.Extended.UI.ConfirmButtonBehavior.WebForm_OnSubmit;
            }
        }
    },

    dispose : function() {
        /// <summary>
        /// Dispose the behavior
        /// </summary>

        if (this._clickHandler) {
            $removeHandler(this.get_element(), "click", this._clickHandler);
            this._clickHandler = null;
        }
        
        if (this._oldScript) {
            this.get_element().setAttribute("onclick", this._oldScript);
            this._oldScript = null;
        }

        Sys.Extended.UI.ConfirmButtonBehavior.callBaseMethod(this, 'dispose');
    },

    _onClick : function(e) {
        /// <summary>
        /// Button's click handler to display the confirmation dialog
        /// </summary>
        /// <param name="e" type="Sys.UI.DomEvent">
        /// Event info
        /// </param>

        if (this.get_element() && !this.get_element().disabled) {
            if (this._ConfirmOnFormSubmit) {
                Sys.Extended.UI.ConfirmButtonBehavior._clickedBehavior = this;
            } else {
                if (!this._displayConfirmDialog()) {
                    e.preventDefault();
                    return false;
                }
                else if (this._oldScript) {
                    
                    if (String.isInstanceOfType(this._oldScript)) {
                        eval(this._oldScript);
                    }
                    else if (typeof(this._oldScript) == 'function'){
                        this._oldScript();                        
                    }   
                }
            }
        }
    },

    _displayConfirmDialog : function() {
        /// <summary>
        /// Handle the completion of a confirm dialog (whether by window.confirm or ModalPopupBehavior)
        /// </summary>
        /// <value type="Boolean">
        /// Result of the confirm dialog or false to cancel
        /// </value>

        var eventArgs = new Sys.CancelEventArgs();
        this.raiseShowing(eventArgs);
        if (eventArgs.get_cancel()) {
            return;
        }

        if(this._displayModalPopupID) {
            var mpe = $find(this._displayModalPopupID);
            if (!mpe) {
                throw Error.argument('displayModalPopupID', String.format(Sys.Extended.UI.Resources.CollapsiblePanel_NoControlID, this._displayModalPopupID));
            }
            mpe.set_OnOkScript("$find('"+this.get_id()+"')._handleConfirmDialogCompletion(true);");
            mpe.set_OnCancelScript("$find('"+this.get_id()+"')._handleConfirmDialogCompletion(false);");
            mpe.show();
            return false;
        } else {
            var result = window.confirm(this._ConfirmTextValue);
            this._handleConfirmDialogCompletion(result);
            return result;
        }
    },

    _handleConfirmDialogCompletion : function(result) {
        /// <summary>
        /// Handle the completion of a confirm dialog (whether by window.confirm or ModalPopupBehavior)
        /// </summary>
        /// <param name="result" type="Boolean">
        /// Result of the confirm dialog
        /// </param>
        this.raiseHidden(new Sys.Extended.UI.ConfirmButtonHiddenEventArgs(result));
        if (result) {
            if (this._postBackScript ) {
                eval(this._postBackScript);
            }
        } else {
            if (this._OnClientCancelValue) {
                window[this._OnClientCancelValue]();
            }
        }
    },

    get_OnClientCancel : function (){
        /// <value type="String">
        /// The client-side script that executes when the cancel button is clicked on the confirm dialog.
        /// </value>
      return this._OnClientCancelValue;
    },
    set_OnClientCancel : function (value) {
        if (this._OnClientCancelValue != value) {
            this._OnClientCancelValue = value;
            this.raisePropertyChanged('OnClientCancel'); 
        }
    },

    get_ConfirmText : function() {
        /// <value type="String">
        /// The text to show when you want to confirm the click. (Note: HTML entities can be used here (ex: "&#10;" for new-line))
        /// </value>
        return this._ConfirmTextValue;
    },
    set_ConfirmText : function(value) {
        if (this._ConfirmTextValue != value) {
            this._ConfirmTextValue = value;
            this.raisePropertyChanged('ConfirmText');
        }
    },

    get_ConfirmOnFormSubmit : function() {
        /// <value type="Boolean">
        /// True iff the confirm dialog should run for form submission (i.e., after validators are all satisfied)
        /// </value>
        return this._ConfirmOnFormSubmit;
    },
    set_ConfirmOnFormSubmit : function(value) {
        if (this._ConfirmOnFormSubmit != value) {
            this._ConfirmOnFormSubmit = value;
            this.raisePropertyChanged('ConfirmOnFormSubmit');
        }
    },

    get_displayModalPopupID : function() {
        /// <value type="String">
        /// ID of a ModalPopupBehavior to be used instead of the default window.confirm dialog
        /// </value>
        return this._displayModalPopupID;
    },
    set_displayModalPopupID : function(value) {
        if (this._displayModalPopupID != value) {
            this._displayModalPopupID = value;
            this.raisePropertyChanged('displayModalPopupID');
        }
    },

    get_postBackScript : function() {
        /// <value type="String">
        /// Script to run to initiate a postback
        /// </value>
        return this._postBackScript;
    },
    set_postBackScript : function(value) {
        if (this._postBackScript != value) {
            this._postBackScript = value;
            this.raisePropertyChanged('postBackScript');
        }
    },

    add_showing : function(handler) {
        /// <summary>
        /// Add an event handler for the showing event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('showing', handler);
    },
    remove_showing : function(handler) {
        /// <summary>
        /// Remove an event handler from the showing event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('showing', handler);
    },
    raiseShowing : function(eventArgs) {
        /// <summary>
        /// Raise the showing event
        /// </summary>
        /// <param name="eventArgs" type="Sys.CancelEventArgs" mayBeNull="false">
        /// Event arguments for the showing event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('showing');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_hidden : function(handler) {
        /// <summary>
        /// Add an event handler for the hidden event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('hidden', handler);
    },
    remove_hidden : function(handler) {
        /// <summary>
        /// Remove an event handler from the hidden event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('hidden', handler);
    },
    raiseHidden : function(eventArgs) {
        /// <summary>
        /// Raise the hidden event
        /// </summary>
        /// <param name="eventArgs" type="Sys.Extended.UI.ConfirmButtonHiddenEventArgs" mayBeNull="false">
        /// Event arguments for the hidden event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('hidden');
        if (handler) {
            handler(this, eventArgs);
        }
    }
}
Sys.Extended.UI.ConfirmButtonBehavior.registerClass('Sys.Extended.UI.ConfirmButtonBehavior', Sys.Extended.UI.BehaviorBase);
Sys.registerComponent(Sys.Extended.UI.ConfirmButtonBehavior, { name: "confirmButton", parameters: [{name: "ConfirmText", type: "String"}] });

Sys.Extended.UI.ConfirmButtonBehavior.WebForm_OnSubmit = function() {
    /// <summary>
    /// Wraps ASP.NET's WebForm_OnSubmit in order to display the confirm dialog prior to submission
    /// </summary>
    /// <returns type="Boolean">
    /// Result of original WebForm_OnSubmit
    /// </returns>
    var result = Sys.Extended.UI.ConfirmButtonBehavior._originalWebForm_OnSubmit();
    if (result && Sys.Extended.UI.ConfirmButtonBehavior._clickedBehavior) {
        result = Sys.Extended.UI.ConfirmButtonBehavior._clickedBehavior._displayConfirmDialog();
    }
    Sys.Extended.UI.ConfirmButtonBehavior._clickedBehavior = null;
    return result;
}

} // execute

if (window.Sys && Sys.loader) {
    Sys.loader.registerScript(scriptName, ["ExtendedBase"], execute);
}
else {
    execute();
}

})();
