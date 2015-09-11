Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.PopupControlBehavior = function(element) {

    // The PopupControlBehavior opens a popup window next to the target element    
    Sys.Extended.UI.PopupControlBehavior.initializeBase(this, [element]);

    // Properties
    this._popupControlID = null;
    this._commitProperty = null;
    this._commitScript = null;
    this._position = null;
    this._offsetX = 0;
    this._offsetY = 0;
    this._extenderControlID = null;

    // Variables
    this._popupElement = null;
    this._popupBehavior = null;
    this._popupVisible = false;
    this._focusHandler = null;
    this._popupKeyDownHandler = null;
    this._popupClickHandler = null;
    this._bodyClickHandler = null;
    this._onShowJson = null;
    this._onHideJson = null;
};

Sys.Extended.UI.PopupControlBehavior.prototype = {

    initialize: function() {
        Sys.Extended.UI.PopupControlBehavior.callBaseMethod(this, 'initialize');

        // Identify popup element from control id
        var e = this.get_element();
        this._popupElement = $get(this._popupControlID);

        // Hook up a PopupBehavior
        this._popupBehavior = $create(Sys.Extended.UI.PopupBehavior, { 'id': this.get_id() + 'PopupBehavior', 'parentElement': e }, null, null, this._popupElement);

        // Create the animations (if they were set before initialize was called)
        if(this._onShowJson)
            this._popupBehavior.set_onShow(this._onShowJson);

        if(this._onHideJson)
            this._popupBehavior.set_onHide(this._onHideJson);

        // Create delegates
        this._focusHandler = Function.createDelegate(this, this._onFocus);
        this._popupClickHandler = Function.createDelegate(this, this._onPopupClick);
        this._bodyClickHandler = Function.createDelegate(this, this._onBodyClick);
        this._popupKeyDownHandler = Function.createDelegate(this, this._onPopupKeyDown);

        // Attach events
        $addHandler(e, 'focus', this._focusHandler);
        $addHandler(e, 'click', this._focusHandler);  // So that a dismissed popup can be more easily re-popped
        $addHandler(document.body, 'click', this._bodyClickHandler);
        $addHandler(this._popupElement, 'click', this._popupClickHandler);
        $addHandler(this._popupElement, 'keydown', this._popupKeyDownHandler);

        // Need to know when partial updates complete
        this.registerPartialUpdateEvents();

        // If this popup was visible before what seems to have been a partial update,
        // make it visible again now
        if(Sys.Extended.UI.PopupControlBehavior.__VisiblePopup && (this.get_id() == Sys.Extended.UI.PopupControlBehavior.__VisiblePopup.get_id()))
            this._onFocus(null);
    },

    dispose: function() {
        var e = this.get_element();

        this._onShowJson = null;
        this._onHideJson = null;

        if(this._popupBehavior) {
            this._popupBehavior.dispose();
            this._popupBehavior = null;
        }

        if(this._focusHandler) {
            $removeHandler(e, 'focus', this._focusHandler);
            $removeHandler(e, 'click', this._focusHandler);
            this._focusHandler = null;
        }

        if(this._bodyClickHandler) {
            $removeHandler(document.body, 'click', this._bodyClickHandler);
            this._bodyClickHandler = null;
        }

        if(this._popupClickHandler) {
            $removeHandler(this._popupElement, 'click', this._popupClickHandler);
            this._popupClickHandler = null;
        }

        if(this._popupKeyDownHandler) {
            $removeHandler(this._popupElement, 'keydown', this._popupKeyDownHandler);
            this._popupKeyDownHandler = null;
        }

        Sys.Extended.UI.PopupControlBehavior.callBaseMethod(this, 'dispose');
    },

    /// <summary>
    /// Shows the popup
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.PopupControlExtender.showPopup" />
    showPopup: function() {
        var old = Sys.Extended.UI.PopupControlBehavior.__VisiblePopup;

        if(old && old._popupBehavior)
            old.hidePopup();

        Sys.Extended.UI.PopupControlBehavior.callBaseMethod(this, 'populate');

        this._popupBehavior.set_x(this._getLeftOffset());
        this._popupBehavior.set_y(this._getTopOffset());
        this._popupBehavior.show();
        this._popupVisible = true;

        Sys.Extended.UI.PopupControlBehavior.__VisiblePopup = this;
    },

    /// <summary>
    /// Hides the popup
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.PopupControlExtender.hidePopup" />
    hidePopup: function() {
        this._popupBehavior.hide();
        this._popupVisible = false;

        Sys.Extended.UI.PopupControlBehavior.__VisiblePopup = null;
    },

    _onFocus: function(e) {
        // Show the popup when its control is focused

        // Set the popup position and display it
        if(!this._popupVisible)
            this.showPopup();

        if(e) e.stopPropagation();
    },

    _onPopupKeyDown: function(e) {
        // Handle key presses in the popup element
        if(this._popupVisible && e.keyCode == 27 /* Escape */)
            // Return focus to the control
            this.get_element().focus();
    },

    _onPopupClick: function(e) {
        e.stopPropagation();
    },

    _onBodyClick: function() {
        // Handler for the HTML body tag's click event

        // Hide the popup if something other than our target or popup
        // was clicked (since each of these stop the event from bubbling
        // up to the body)
        if(this._popupVisible)
            this.hidePopup();
    },

    // Called automatically when a page load/postback happens
    _close: function(result) {
        // Look at result of popup
        var e = this.get_element();

        if(null != result) {
            if('$$CANCEL$$' != result) {
                // Result is to be committed
                if(this._commitProperty)
                    // Use the specified property
                    e[this._commitProperty] = result;
                else if('text' == e.type)
                    // Use the default property
                    e.value = result;
                else
                    Sys.Debug.assert(false, String.format(Sys.Extended.UI.Resources.PopupControl_NoDefaultProperty, e.id, e.type));

                // Additionally run commit script if present
                if(this._commitScript)
                    eval(this._commitScript);
            }

            // Hide the popup
            this.hidePopup();
        }
    },

    _partialUpdateEndRequest: function(sender, endRequestEventArgs) {
        // Handler for UpdatePanel partial postback notifications
        Sys.Extended.UI.PopupControlBehavior.callBaseMethod(this, '_partialUpdateEndRequest', [sender, endRequestEventArgs]);

        if(this.get_element()) {
            // Look up result by element's ID
            var result = endRequestEventArgs.get_dataItems()[this.get_element().id];

            // If unsuccessful, look up result by proxy ID
            if((undefined === result) &&
                Sys.Extended.UI.PopupControlBehavior.__VisiblePopup &&
                (this.get_id() == Sys.Extended.UI.PopupControlBehavior.__VisiblePopup.get_id())) {

                result = endRequestEventArgs.get_dataItems()["_PopupControl_Proxy_ID_"];
            }

            // If result available, apply it
            if(undefined !== result)
                this._close(result);
        }
    },

    _onPopulated: function(sender, eventArgs) {
        Sys.Extended.UI.PopupControlBehavior.callBaseMethod(this, '_onPopulated', [sender, eventArgs]);

        // Dynamic populate may have added content; re-layout to accomodate it
        if(this._popupVisible)
            this._popupBehavior.show();
    },

    _getLeftOffset: function() {
        // Get the left offset for the popup
        if(Sys.Extended.UI.PopupControlPopupPosition.Left == this._position)
            return (-1 * this.get_element().offsetWidth) + this._offsetX;
        else if(Sys.Extended.UI.PopupControlPopupPosition.Right == this._position)
            return this.get_element().offsetWidth + this._offsetX;
        else
            return this._offsetX;
    },

    _getTopOffset: function() {
        // Get the top offset for the popup
        var yoffSet;

        if(Sys.Extended.UI.PopupControlPopupPosition.Top == this._position)
            yoffSet = (-1 * this.get_element().offsetHeight) + this._offsetY;
        else if(Sys.Extended.UI.PopupControlPopupPosition.Bottom == this._position)
            yoffSet = this.get_element().offsetHeight + this._offsetY;
        else
            yoffSet = this._offsetY;

        return yoffSet;
    },

    /// <summary>
    /// A JSON definition of generic OnShow Animation
    /// </summary>
    /// <getter>get_onShow</getter>
    /// <setter>set_onShow</setter>
    /// <member name="cP:AjaxControlToolkit.PopupControlExtender.onShow" />
    get_onShow: function() {
        return this._popupBehavior ? this._popupBehavior.get_onShow() : this._onShowJson;
    },
    set_onShow: function(value) {
        if(this._popupBehavior)
            this._popupBehavior.set_onShow(value);
        else
            this._onShowJson = value;

        this.raisePropertyChanged('onShow');
    },

    /// <summary>
    /// Generic OnShow Animation behavior
    /// </summary>
    /// <getter>get_onShowBehavior</getter>
    /// <member name="cP:AjaxControlToolkit.PopupControlExtender.onShowBehavior" />
    get_onShowBehavior: function() {
        return this._popupBehavior ? this._popupBehavior.get_onShowBehavior() : null;
    },

    /// <summary>
    /// Plays OnShow animation
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.PopupControlExtender.onShow" />
    onShow: function() {
        if(this._popupBehavior)
            this._popupBehavior.onShow();
    },

    /// <summary>
    /// A JSON definition of generic OnHide Animation
    /// </summary>
    /// <getter>get_onHide</getter>
    /// <setter>set_onHide</setter>
    /// <member name="cP:AjaxControlToolkit.PopupControlExtender.onHide" />
    get_onHide: function() {
        return this._popupBehavior ? this._popupBehavior.get_onHide() : this._onHideJson;
    },
    set_onHide: function(value) {
        if(this._popupBehavior)
            this._popupBehavior.set_onHide(value);
        else
            this._onHideJson = value;

        this.raisePropertyChanged('onHide');
    },

    /// <summary>
    /// Generic OnHide Animation behavior
    /// </summary>
    /// <getter>get_onHideBehavior</getter>
    /// <member name="cP:AjaxControlToolkit.PopupControlExtender.onHideBehavior" />
    get_onHideBehavior: function() {
        return this._popupBehavior ? this._popupBehavior.get_onHideBehavior() : null;
    },

    /// <summary>
    /// Plays OnHide animation
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.PopupControlExtender.onHide" />
    onHide: function() {
        if(this._popupBehavior)
            this._popupBehavior.onHide();
    },

    /// <summary>
    /// The ID of the control to display
    /// </summary>
    /// <getter>get_popupControlID</getter>
    /// <setter>set_popupControlID</setter>
    /// <member name="cP:AjaxControlToolkit.PopupControlExtender.popupControlID" />
    get_popupControlID: function() {
        return this._popupControlID;
    },
    set_popupControlID: function(value) {
        if(this._popupControlID != value) {
            this._popupControlID = value;
            this.raisePropertyChanged('popupControlID');
        }
    },

    get_PopupControlID: function() {
        Sys.Extended.Deprecated("get_PopupControlID()", "get_popupControlID()");
        return this.get_popupControlID();
    },
    set_PopupControlID: function(value) {
        Sys.Extended.Deprecated("set_PopupControlID(value)", "set_popupControlID(value)");
        this.set_popupControlID(value);
    },

    /// <summary>
    /// The property of a control being extended that should be set with the result of the popup
    /// </summary>
    /// <getter>get_commitProperty</getter>
    /// <setter>set_commitProperty</setter>
    /// <member name="cP:AjaxControlToolkit.PopupControlExtender.commitProperty" />
    get_commitProperty: function() {
        return this._commitProperty;
    },
    set_commitProperty: function(value) {
        if(this._commitProperty != value) {
            this._commitProperty = value;
            this.raisePropertyChanged('commitProperty');
        }
    },

    get_CommitProperty: function() {
        Sys.Extended.Deprecated("get_CommitProperty()", "get_commitProperty()");
        return this.get_commitProperty();
    },
    set_CommitProperty: function(value) {
        Sys.Extended.Deprecated("set_CommitProperty(value)", "set_commitProperty(value)");
        this.set_commitProperty(value);
    },

    /// <summary>
    /// An additional script to run after the result of the popup is set
    /// </summary>
    /// <getter>get_commitScript</getter>
    /// <setter>set_commitScript</setter>
    /// <member name="cP:AjaxControlToolkit.PopupControlExtender.commitScript" />
    get_commitScript: function() {
        return this._commitScript;
    },
    set_commitScript: function(value) {
        if(this._commitScript != value) {
            this._commitScript = value;
            this.raisePropertyChanged('commitScript');
        }
    },

    get_CommitScript: function() {
        Sys.Extended.Deprecated("get_CommitScript()", "get_commitScript()");
        return this.get_commitScript();
    },
    set_CommitScript: function(value) {
        Sys.Extended.Deprecated("set_CommitScript(value)", "set_commitScript(value)");
        this.set_commitScript(value);
    },

    /// <summary>
    /// Determines where the popup should be positioned relative to the target control
    /// (Left, Right, Top, Bottom, or Center)
    /// </summary>
    /// <getter>get_position</getter>
    /// <setter>set_position</setter>
    /// <member name="cP:AjaxControlToolkit.PopupControlExtender.position" />
    get_position: function() {
        return this._position;
    },
    set_position: function(value) {
        if(this._position != value) {
            this._position = value;
            this.raisePropertyChanged('position');
        }
    },

    get_Position: function() {
        Sys.Extended.Deprecated("get_Position()", "get_position()");
        return this.get_position();
    },
    set_Position: function(value) {
        Sys.Extended.Deprecated("set_Position(value)", "set_position(value)");
        this.set_position(value);
    },

    /// <summary>
    /// The ID of the extender control
    /// </summary>
    /// <getter>get_extenderControlID</getter>
    /// <setter>set_extenderControlID</setter>
    /// <member name="cP:AjaxControlToolkit.PopupControlExtender.extenderControlID" />
    get_extenderControlID: function() {
        return this._extenderControlID;
    },
    set_extenderControlID: function(value) {
        if(this._extenderControlID != value) {
            this._extenderControlID = value;
            this.raisePropertyChanged('extenderControlID');
        }
    },

    get_ExtenderControlID: function() {
        Sys.Extended.Deprecated("get_ExtenderControlID()", "get_extenderControlID()");
        return this.get_extenderControlID();
    },
    set_ExtenderControlID: function(value) {
        Sys.Extended.Deprecated("set_ExtenderControlID(value)", "set_extenderControlID(value)");
        this.set_extenderControlID(value);
    },

    /// <summary>
    /// The number of pixels to horizontally offset the Popup from its default position
    /// </summary>
    /// <getter>get_offsetX</getter>
    /// <setter>set_offsetX</setter>
    /// <member name="cP:AjaxControlToolkit.PopupControlExtender.offsetX" />
    get_offsetX: function() {
        return this._offsetX;
    },
    set_offsetX: function(value) {
        if(this._offsetX != value) {
            this._offsetX = value;
            this.raisePropertyChanged('offsetX');
        }
    },

    get_OffsetX: function() {
        Sys.Extended.Deprecated("get_OffsetX()", "get_offsetX()");
        return this.get_offsetX();
    },
    set_OffsetX: function(value) {
        Sys.Extended.Deprecated("set_OffsetX(value)", "set_offsetX(value)");
        this.set_offsetX(value);
    },

    /// <summary>
    /// The number of pixels to vertically offset the Popup from its default position
    /// </summary>
    /// <getter>get_offsetY</getter>
    /// <setter>set_offsetY</setter>
    /// <member name="cP:AjaxControlToolkit.PopupControlExtender.offsetY" />
    get_offsetY: function() {
        return this._offsetY;
    },
    set_offsetY: function(value) {
        if(this._offsetY != value) {
            this._offsetY = value;
            this.raisePropertyChanged('offsetY');
        }
    },

    get_OffsetY: function() {
        Sys.Extended.Deprecated("get_OffsetY()", "get_offsetY()");
        return this.get_offsetY();
    },
    set_OffsetY: function(value) {
        Sys.Extended.Deprecated("set_OffsetY(value)", "set_offsetY(value)");
        this.set_offsetY(value);
    },

    /// <summary>
    /// Determines whether or not the popup is visible
    /// </summary>
    /// <getter>get_popupVisible</getter>
    /// <member name="cP:AjaxControlToolkit.PopupControlExtender.popupVisible" />
    get_popupVisible: function() {
        return this._popupVisible;
    },

    get_PopupVisible: function() {
        Sys.Extended.Deprecated("get_PopupVisible()", "get_popupVisible()");
        return this.get_popupVisible();
    },

    /// <summary>
    /// Fires when the popup is being shown
    /// </summary>
    /// <event add="add_showing" remove="remove_showing" raise="raise_showing" />
    /// <member name="cE:AjaxControlToolkit.PopupControlExtender.showing" />
    add_showing: function(handler) {
        if(this._popupBehavior)
            this._popupBehavior.add_showing(handler);
    },
    remove_showing: function(handler) {
        if(this._popupBehavior)
            this._popupBehavior.remove_showing(handler);
    },
    raise_showing: function(eventArgs) {
        if(this._popupBehavior)
            this._popupBehavior.raise_showing(eventArgs);
    },
    raiseShowing: function(eventArgs) {
        Sys.Extended.Deprecated("raiseShowing(eventArgs)", "raise_showing(eventArgs)");
        this.raise_showing(eventArgs);
    },

    /// <summary>
    /// Fires after the popup is shown
    /// </summary>
    /// <event add="add_shown" remove="remove_shown" raise="raise_shown" />
    /// <member name="cE:AjaxControlToolkit.PopupControlExtender.shown" />
    add_shown: function(handler) {
        if(this._popupBehavior)
            this._popupBehavior.add_shown(handler);
    },
    remove_shown: function(handler) {
        if(this._popupBehavior)
            this._popupBehavior.remove_shown(handler);
    },
    raise_shown: function(eventArgs) {
        if(this._popupBehavior)
            this._popupBehavior.raise_shown(eventArgs);
    },
    raiseShown: function(eventArgs) {
        Sys.Extended.Deprecated("raiseShown(eventArgs)", "raise_shown(eventArgs)");
        this.raise_shown(eventArgs);
    },

    /// <summary>
    /// Fires when the popup is being hidden
    /// </summary>
    /// <event add="add_hiding" remove="remove_hiding" raise="raise_hiding" />
    /// <member name="cE:AjaxControlToolkit.PopupControlExtender.hiding" />
    add_hiding: function(handler) {
        if(this._popupBehavior)
            this._popupBehavior.add_hiding(handler);
    },
    remove_hiding: function(handler) {
        if(this._popupBehavior)
            this._popupBehavior.remove_hiding(handler);
    },
    raise_hiding: function() {
        if(this._popupBehavior)
            this._popupBehavior.raise_hiding(eventArgs);
    },
    raiseHiding: function(eventArgs) {
        Sys.Extended.Deprecated("raiseHiding(eventArgs)", "raise_hiding(eventArgs)");
        this.raise_hiding(eventArgs);
    },

    /// <summary>
    /// Firs after the popup is hidden
    /// </summary>
    /// <event add="add_hidden" remove="remove_hidden" raise="raise_hidden" />
    /// <member name="cE:AjaxControlToolkit.PopupControlExtender.hidden" />
    add_hidden: function(handler) {
        if(this._popupBehavior)
            this._popupBehavior.add_hidden(handler);
    },
    remove_hidden: function(handler) {
        if(this._popupBehavior)
            this._popupBehavior.remove_hidden(handler);
    },
    raise_hidden: function(eventArgs) {
        if(this._popupBehavior)
            this._popupBehavior.raise_hidden(eventArgs);
    },
    raiseHidden: function(eventArgs) {
        Sys.Extended.Deprecated("raiseHidden(eventArgs)", "raise_hidden(eventArgs)");
        this.raise_hidden(eventArgs);
    }
};

Sys.Extended.UI.PopupControlBehavior.registerClass('Sys.Extended.UI.PopupControlBehavior', Sys.Extended.UI.DynamicPopulateBehaviorBase);

// This global variable tracks the currently visible popup.  Automatically
// hiding the popup when focus is lost does not work with our mechanism to
// hide the popup when something else is clicked... So we will instead go for
// the weaker strategy of letting at most one popup be visible at a time.
Sys.Extended.UI.PopupControlBehavior.__VisiblePopup = null;

Sys.Extended.UI.PopupControlPopupPosition = function() {
    // Position of the popup relative to the target control
    throw Error.invalidOperation();
};

Sys.Extended.UI.PopupControlPopupPosition.prototype = {
    Center: 0,
    Top: 1,
    Left: 2,
    Bottom: 3,
    Right: 4
};

Sys.Extended.UI.PopupControlPopupPosition.registerEnum("Sys.Extended.UI.PopupControlPopupPosition", false);