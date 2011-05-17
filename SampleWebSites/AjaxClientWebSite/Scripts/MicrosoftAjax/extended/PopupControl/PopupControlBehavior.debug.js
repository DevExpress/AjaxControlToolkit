// (c) 2010 CodePlex Foundation



/// <reference name="MicrosoftAjax.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />
/// <reference path="../DynamicPopulate/DynamicPopulateBehavior.js" />
/// <reference path="../Animation/Animations.js" />
/// <reference path="../Animation/AnimationBehavior.js" />
/// <reference path="../PopupExtender/PopupBehavior.js" />

(function() {
var scriptName = "ExtendedPopupBehavior";

function execute() {

Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.PopupControlBehavior = function(element) {
    /// <summary>
    /// The PopupControlBehavior opens a popup window next to the target element
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" domElement="true">
    /// DOM element associated with the behavior
    /// </param>
    Sys.Extended.UI.PopupControlBehavior.initializeBase(this, [element]);
    
    this._popupControlID = null;
    this._commitProperty = null;
    this._commitScript = null;
    this._position = null;
    this._offsetX = 0;
    this._offsetY = 0;
    this._extenderControlID = null;

    this._popupElement = null;
    this._popupBehavior = null;
    this._popupVisible = false;
    this._focusHandler = null;
    this._popupKeyDownHandler = null;
    this._popupClickHandler = null;
    this._bodyClickHandler = null;
    this._onShowJson = null;
    this._onHideJson = null;
}
Sys.Extended.UI.PopupControlBehavior.prototype = {
    initialize : function() {
        /// <summary>
        /// Initialize the behavior
        /// </summary>
        Sys.Extended.UI.PopupControlBehavior.callBaseMethod(this, 'initialize');

        var e = this.get_element();
        this._popupElement = $get(this._popupControlID);

        this._popupBehavior = $create(Sys.Extended.UI.PopupBehavior, { 'id':this.get_id()+'PopupBehavior', 'parentElement':e }, null, null, this._popupElement);
        
        if (this._onShowJson) {
            this._popupBehavior.set_onShow(this._onShowJson);
        }
        if (this._onHideJson) {
            this._popupBehavior.set_onHide(this._onHideJson);
        }

        this._focusHandler = Function.createDelegate(this, this._onFocus);
        this._popupClickHandler = Function.createDelegate(this, this._onPopupClick);
        this._bodyClickHandler = Function.createDelegate(this, this._onBodyClick);
        this._popupKeyDownHandler = Function.createDelegate(this, this._onPopupKeyDown);

        $addHandler(e, 'focus', this._focusHandler);
        $addHandler(e, 'click', this._focusHandler);  // So that a dismissed popup can be more easily re-popped
        $addHandler(document.body, 'click', this._bodyClickHandler);
        $addHandler(this._popupElement, 'click', this._popupClickHandler);
        $addHandler(this._popupElement, 'keydown', this._popupKeyDownHandler);

        this.registerPartialUpdateEvents();

        if(Sys.Extended.UI.PopupControlBehavior.__VisiblePopup && (this.get_id() == Sys.Extended.UI.PopupControlBehavior.__VisiblePopup.get_id())) {
            this._onFocus(null);
        }
    },

    dispose : function() {
        /// <summary>
        /// Dispose the behavior
        /// </summary>

        var e = this.get_element();
    
        this._onShowJson = null;
        this._onHideJson = null;

        if (this._popupBehavior) {
            this._popupBehavior.dispose();
            this._popupBehavior = null;
        }
        if (this._focusHandler) {
            $removeHandler(e, 'focus', this._focusHandler);
            $removeHandler(e, 'click', this._focusHandler);
            this._focusHandler = null;
        }
        if (this._bodyClickHandler) {
            $removeHandler(document.body, 'click', this._bodyClickHandler);
            this._bodyClickHandler = null;
        }
        if (this._popupClickHandler) {
            $removeHandler(this._popupElement, 'click', this._popupClickHandler);
            this._popupClickHandler = null;
        }
        if (this._popupKeyDownHandler) {
            $removeHandler(this._popupElement, 'keydown', this._popupKeyDownHandler);
            this._popupKeyDownHandler = null;
        }
        Sys.Extended.UI.PopupControlBehavior.callBaseMethod(this, 'dispose');
    },

    showPopup : function() {
        /// <summary>
        /// Display the popup
        /// </summary>

        var old = Sys.Extended.UI.PopupControlBehavior.__VisiblePopup;
        if (old && old._popupBehavior) {
            old.hidePopup();
        }

        Sys.Extended.UI.PopupControlBehavior.callBaseMethod(this, 'populate');
        
        this._popupBehavior.set_x(this._getLeftOffset());
        this._popupBehavior.set_y(this._getTopOffset());
        this._popupBehavior.show();
        
        this._popupVisible = true;
        Sys.Extended.UI.PopupControlBehavior.__VisiblePopup = this;
    },

    hidePopup : function() {
        /// <summary>
        /// Hide the popup
        /// </summary>
        
        this._popupBehavior.hide();
        this._popupVisible = false;
        Sys.Extended.UI.PopupControlBehavior.__VisiblePopup = null;
    },

    _onFocus : function(e) {
        /// <summary>
        /// Show the popup when its control is focused
        /// </summary>
        /// <param name="e" type="Sys.UI.DomEvent" mayBeNull="true">
        /// Event info
        /// </param>
        
        if (!this._popupVisible) {
            this.showPopup();
        }
        if (e) {
            e.stopPropagation();
        }
    },

    _onPopupKeyDown : function(e) {
        /// <summary>
        /// Handle key presses in the popup element
        /// </summary>
        /// <param name="e" type="Sys.UI.DomEvent">
        /// Event info
        /// </param>

        if (this._popupVisible && e.keyCode == 27 /* Escape */) {
            this.get_element().focus();
        }
    },

    _onPopupClick : function(e) {
        /// <summary>
        /// Click handler for the popup
        /// </summary>
        /// <param name="e" type="Sys.UI.DomEvent">
        /// Event info
        /// </param>
        e.stopPropagation();
    },

    _onBodyClick : function() {
        /// <summary>
        /// Handler for the HTML body tag's click event
        /// </summary>

        if (this._popupVisible) {
            this.hidePopup();
        }
    },

    _close : function(result) {
        /// <summary>
        /// Close the popup
        /// </summary>
        /// <param name="result" type="String">
        /// Result obtained from committing the popup
        /// </param>

        var e = this.get_element();

        if (null != result) {
            if ('$$CANCEL$$' != result) {
                if (this._commitProperty) {
                    e[this._commitProperty] = result;
                } else if ('text' == e.type) {
                    e.value = result;
                } else {
                    Sys.Debug.assert(false, String.format(Sys.Extended.UI.Resources.PopupControl_NoDefaultProperty, e.id, e.type));
                }
                if (this._commitScript) {
                    eval(this._commitScript);
                }
            }

            this.hidePopup();
        }
    },

    _partialUpdateEndRequest : function(sender, endRequestEventArgs) {
        /// <summary>
        /// Handler for UpdatePanel partial postback notifications
        /// </summary>
        /// <param name="sender" type="Object">
        /// Sender
        /// </param>
        /// <param name="endRequestEventArgs" type="Sys.WebForms.EndRequestEventArgs">
        /// Event arguments
        /// </param>
        Sys.Extended.UI.PopupControlBehavior.callBaseMethod(this, '_partialUpdateEndRequest', [sender, endRequestEventArgs]);

        if (this.get_element()) {
            var result = endRequestEventArgs.get_dataItems()[this.get_element().id];

            if ((undefined === result) &&
                Sys.Extended.UI.PopupControlBehavior.__VisiblePopup &&
                (this.get_id() == Sys.Extended.UI.PopupControlBehavior.__VisiblePopup.get_id())) {
                    result = endRequestEventArgs.get_dataItems()["_PopupControl_Proxy_ID_"];
            }

            if (undefined !== result) {
                this._close(result);
            }
        }
    },

    _onPopulated : function(sender, eventArgs) {
        /// <summary>
        /// Handler for DynamicPopulate completion
        /// </summary>
        /// <param name="sender" type="Object">
        /// Sender
        /// </param>
        /// <param name="eventArgs" type="Sys.EventArgs">
        /// Event arguments
        /// </param>
        Sys.Extended.UI.PopupControlBehavior.callBaseMethod(this, '_onPopulated', [sender, eventArgs]);

        if (this._popupVisible) {
            this._popupBehavior.show();
        }
    },

    _getLeftOffset : function() {
        /// <summary>
        /// Get the left offset for the popup
        /// </summary>
        /// <returns type="Number" integer="true">
        /// Left offset for the popup
        /// </returns>
 
        if (Sys.Extended.UI.PopupControlPopupPosition.Left == this._position) {
            return (-1 * this.get_element().offsetWidth) + this._offsetX;
        } else if (Sys.Extended.UI.PopupControlPopupPosition.Right == this._position) {
            return this.get_element().offsetWidth + this._offsetX;
        } else {
            return this._offsetX;
        }
    },

    _getTopOffset : function() {
        /// <summary>
        /// Get the top offset for the popup
        /// </summary>
        /// <returns type="Number" integer="true">
        /// Top offset for the popup
        /// </returns>

        var yoffSet;
        if(Sys.Extended.UI.PopupControlPopupPosition.Top == this._position) {
            yoffSet =  (-1 * this.get_element().offsetHeight) + this._offsetY;
        } else if (Sys.Extended.UI.PopupControlPopupPosition.Bottom == this._position) {
            yoffSet =  this.get_element().offsetHeight + this._offsetY;
        } else {
            yoffSet = this._offsetY;
        }
        
        return yoffSet;
    },
    
    get_onShow : function() {
        /// <value type="String" mayBeNull="true">
        /// Generic OnShow Animation's JSON definition
        /// </value>
        return this._popupBehavior ? this._popupBehavior.get_onShow() : this._onShowJson;
    },
    set_onShow : function(value) {
        if (this._popupBehavior) {
            this._popupBehavior.set_onShow(value)
        } else {
            this._onShowJson = value;
        }
        this.raisePropertyChanged('onShow');
    },
    get_onShowBehavior : function() {
        /// <value type="Sys.Extended.UI.Animation.GenericAnimationBehavior">
        /// Generic OnShow Animation's behavior
        /// </value>
        return this._popupBehavior ? this._popupBehavior.get_onShowBehavior() : null;
    },
    onShow : function() {
        /// <summary>
        /// Play the OnShow animation
        /// </summary>
        /// <returns />
        if (this._popupBehavior) {
            this._popupBehavior.onShow();
        }
    },
        
    get_onHide : function() {
        /// <value type="String" mayBeNull="true">
        /// Generic OnHide Animation's JSON definition
        /// </value>
        return this._popupBehavior ? this._popupBehavior.get_onHide() : this._onHideJson;
    },
    set_onHide : function(value) {
        if (this._popupBehavior) {
            this._popupBehavior.set_onHide(value)
        } else {
            this._onHideJson = value;
        }
        this.raisePropertyChanged('onHide');
    },
    get_onHideBehavior : function() {
        /// <value type="Sys.Extended.UI.Animation.GenericAnimationBehavior">
        /// Generic OnHide Animation's behavior
        /// </value>
        return this._popupBehavior ? this._popupBehavior.get_onHideBehavior() : null;
    },
    onHide : function() {
        /// <summary>
        /// Play the OnHide animation
        /// </summary>
        /// <returns />
        if (this._popupBehavior) {
            this._popupBehavior.onHide();
        }
    },
    
    get_PopupControlID : function() {
        /// <value type="String">
        /// The ID of the control to display
        /// </value>
        return this._popupControlID;
    },
    set_PopupControlID : function(value) {
        if (this._popupControlID != value) { 
            this._popupControlID = value;
            this.raisePropertyChanged('PopupControlID');
        }
    },

    get_CommitProperty : function() {
        /// <value type="String" mayBeNull="true" optional="true">
        /// The property on the control being extended that should be set with the result of the popup
        /// </value>
        return this._commitProperty;
    },
    set_CommitProperty : function(value) {
        if (this._commitProperty != value) {
            this._commitProperty = value;
            this.raisePropertyChanged('CommitProperty');
        }
    },

    get_CommitScript : function() {
        /// <value type="String" mayBeNull="true" optional="true">
        /// Additional script to run after setting the result of the popup
        /// </value>
        return this._commitScript;
    },
    set_CommitScript : function(value) {
        if (this._commitScript != value) {
            this._commitScript = value;
            this.raisePropertyChanged('CommitScript');
        }
    },

    get_Position : function() {
        /// <value type="Sys.Extended.UI.PopupControlPopupPosition">
        /// Where the popup should be positioned relative to the target control. (Left, Right, Top, Bottom, Center)
        /// </value>
        return this._position;
    },
    set_Position : function(value) {
        if (this._position != value) {
            this._position = value;
            this.raisePropertyChanged('Position');
        }
    },

    get_ExtenderControlID : function() {
        /// <value type="String">
        /// ID of the extender control
        /// </value>
        return this._extenderControlID;
    },
    set_ExtenderControlID : function(value) {
        if (this._extenderControlID != value) {
            this._extenderControlID = value;
            this.raisePropertyChanged('ExtenderControlID');
        }
    },

    get_OffsetX : function() {
        /// <value type="Number" integer="true">
        /// The number of pixels to horizontally offset the Popup from its default position
        /// </value>
        return this._offsetX;
    },
    set_OffsetX : function(value) {
        if (this._offsetX != value) {
            this._offsetX = value;
            this.raisePropertyChanged('OffsetX');
        }
    },

    get_OffsetY : function() {
        /// <value type="Number" integer="true">
        /// The number of pixels to vertically offset the Popup from its default position
        /// </value>
        return this._offsetY;
    },
    set_OffsetY : function(value) {
        if (this._offsetY != value) {
            this._offsetY = value;
            this.raisePropertyChanged('OffsetY');
        }
    },
    
    get_PopupVisible : function() {
        /// <value type="Boolean">
        /// Whether the popup control is currently visible
        /// </value>
        return this._popupVisible;
    },
    
    add_showing : function(handler) {
        /// <summary>
        /// Add an event handler for the showing event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        
        if (this._popupBehavior) {
            this._popupBehavior.add_showing(handler);
        }
    },
    remove_showing : function(handler) {
        /// <summary>
        /// Remove an event handler from the showing event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        
        if (this._popupBehavior) {
            this._popupBehavior.remove_showing(handler);
        }
    },
    raiseShowing : function(eventArgs) {
        /// <summary>
        /// Raise the showing event
        /// </summary>
        /// <param name="eventArgs" type="Sys.CancelEventArgs" mayBeNull="false">
        /// Event arguments for the showing event
        /// </param>
        /// <returns />
        
        if (this._popupBehavior) {
            this._popupBehavior.raiseShowing(eventArgs);
        }
    },
    
    add_shown : function(handler) {
        /// <summary>
        /// Add an event handler for the shown event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        
        if (this._popupBehavior) {
            this._popupBehavior.add_shown(handler);
        }
    },
    remove_shown : function(handler) {
        /// <summary>
        /// Remove an event handler from the shown event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        
        if (this._popupBehavior) {
            this._popupBehavior.remove_shown(handler);
        }
    },
    raiseShown : function(eventArgs) {
        /// <summary>
        /// Raise the shown event
        /// </summary>
        /// <param name="eventArgs" type="Sys.EventArgs" mayBeNull="false">
        /// Event arguments for the shown event
        /// </param>
        /// <returns />
        
        if (this._popupBehavior) {
            this._popupBehavior.raiseShown(eventArgs);
        }
    },    
    
    add_hiding : function(handler) {
        /// <summary>
        /// Add an event handler for the hiding event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        
        if (this._popupBehavior) {
            this._popupBehavior.add_hiding(handler);
        }
    },
    remove_hiding : function(handler) {
        /// <summary>
        /// Remove an event handler from the hiding event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        
        if (this._popupBehavior) {
            this._popupBehavior.remove_hiding(handler);
        }
    },
    raiseHiding : function(eventArgs) {
        /// <summary>
        /// Raise the hiding event
        /// </summary>
        /// <param name="eventArgs" type="Sys.CancelEventArgs" mayBeNull="false">
        /// Event arguments for the hiding event
        /// </param>
        /// <returns />
        
        if (this._popupBehavior) {
            this._popupBehavior.raiseHiding(eventArgs);
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
        
        if (this._popupBehavior) {
            this._popupBehavior.add_hidden(handler);
        }
    },
    remove_hidden : function(handler) {
        /// <summary>
        /// Remove an event handler from the hidden event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        
        if (this._popupBehavior) {
            this._popupBehavior.remove_hidden(handler);
        }
    },
    raiseHidden : function(eventArgs) {
        /// <summary>
        /// Raise the hidden event
        /// </summary>
        /// <param name="eventArgs" type="Sys.EventArgs" mayBeNull="false">
        /// Event arguments for the hidden event
        /// </param>
        /// <returns />
        
        if (this._popupBehavior) {
            this._popupBehavior.raiseHidden(eventArgs);
        }
    }
}
Sys.Extended.UI.PopupControlBehavior.registerClass('Sys.Extended.UI.PopupControlBehavior', Sys.Extended.UI.DynamicPopulateBehaviorBase);
Sys.registerComponent(Sys.Extended.UI.PopupControlBehavior, { name: "popupBehavior" });

Sys.Extended.UI.PopupControlBehavior.__VisiblePopup = null;


Sys.Extended.UI.PopupControlPopupPosition = function() {
    /// <summary>
    /// Position of the popup relative to the target control
    /// </summary>
    /// <field name="Center" type="Number" integer="true" />
    /// <field name="Top" type="Number" integer="true" />
    /// <field name="Left" type="Number" integer="true" />
    /// <field name="Bottom" type="Number" integer="true" />
    /// <field name="Right" type="Number" integer="true" />
    throw Error.invalidOperation();
}
Sys.Extended.UI.PopupControlPopupPosition.prototype = {
    Center : 0,
    Top : 1,
    Left : 2,
    Bottom : 3,
    Right : 4
}
Sys.Extended.UI.PopupControlPopupPosition.registerEnum("Sys.Extended.UI.PopupControlPopupPosition", false);

} // execute

if (window.Sys && Sys.loader) {
    Sys.loader.registerScript(scriptName, ["ExtendedDynamicPopulate", "ExtendedPopup", "ExtendedAnimationBehavior"], execute);
}
else {
    execute();
}

})();
