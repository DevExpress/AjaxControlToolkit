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

    get_onShow: function() {
        // Generic OnShow Animation's JSON definition
        return this._popupBehavior ? this._popupBehavior.get_onShow() : this._onShowJson;
    },

    set_onShow: function(value) {
        if(this._popupBehavior)
            this._popupBehavior.set_onShow(value);
        else
            this._onShowJson = value;

        this.raisePropertyChanged('onShow');
    },

    get_onShowBehavior: function() {
        // Generic OnShow Animation's behavior
        return this._popupBehavior ? this._popupBehavior.get_onShowBehavior() : null;
    },

    onShow: function() {
        // Play the OnShow animation
        if(this._popupBehavior)
            this._popupBehavior.onShow();
    },

    get_onHide: function() {
        // Generic OnHide Animation's JSON definition
        return this._popupBehavior ? this._popupBehavior.get_onHide() : this._onHideJson;
    },

    set_onHide: function(value) {
        if(this._popupBehavior)
            this._popupBehavior.set_onHide(value);
        else
            this._onHideJson = value;

        this.raisePropertyChanged('onHide');
    },

    get_onHideBehavior: function() {
        // Generic OnHide Animation's behavior
        return this._popupBehavior ? this._popupBehavior.get_onHideBehavior() : null;
    },

    onHide: function() {
        if(this._popupBehavior)
            this._popupBehavior.onHide();
    },

    get_PopupControlID: function() {
        return this._popupControlID;
    },

    set_PopupControlID: function(value) {
        if(this._popupControlID != value) {
            this._popupControlID = value;
            this.raisePropertyChanged('PopupControlID');
        }
    },

    get_CommitProperty: function() {
        // The property on the control being extended that should be set with the result of the popup
        return this._commitProperty;
    },

    set_CommitProperty: function(value) {
        if(this._commitProperty != value) {
            this._commitProperty = value;
            this.raisePropertyChanged('CommitProperty');
        }
    },

    get_CommitScript: function() {
        // Additional script to run after setting the result of the popup
        return this._commitScript;
    },

    set_CommitScript: function(value) {
        if(this._commitScript != value) {
            this._commitScript = value;
            this.raisePropertyChanged('CommitScript');
        }
    },

    get_Position: function() {
        // Where the popup should be positioned relative to the target control. (Left, Right, Top, Bottom, Center)
        return this._position;
    },

    set_Position: function(value) {
        if(this._position != value) {
            this._position = value;
            this.raisePropertyChanged('Position');
        }
    },

    get_ExtenderControlID: function() {
        return this._extenderControlID;
    },

    set_ExtenderControlID: function(value) {
        if(this._extenderControlID != value) {
            this._extenderControlID = value;
            this.raisePropertyChanged('ExtenderControlID');
        }
    },

    get_OffsetX: function() {
        // The number of pixels to horizontally offset the Popup from its default position
        return this._offsetX;
    },

    set_OffsetX: function(value) {
        if(this._offsetX != value) {
            this._offsetX = value;
            this.raisePropertyChanged('OffsetX');
        }
    },

    get_OffsetY: function() {
        // The number of pixels to vertically offset the Popup from its default position
        return this._offsetY;
    },

    set_OffsetY: function(value) {
        if(this._offsetY != value) {
            this._offsetY = value;
            this.raisePropertyChanged('OffsetY');
        }
    },

    get_PopupVisible: function() {
        return this._popupVisible;
    },

    add_showing: function(handler) {
        if(this._popupBehavior)
            this._popupBehavior.add_showing(handler);
    },

    remove_showing: function(handler) {
        if(this._popupBehavior)
            this._popupBehavior.remove_showing(handler);
    },

    raiseShowing: function(eventArgs) {
        if(this._popupBehavior)
            this._popupBehavior.raiseShowing(eventArgs);
    },

    add_shown: function(handler) {
        if(this._popupBehavior)
            this._popupBehavior.add_shown(handler);
    },

    remove_shown: function(handler) {
        if(this._popupBehavior)
            this._popupBehavior.remove_shown(handler);
    },
    raiseShown: function(eventArgs) {
        if(this._popupBehavior)
            this._popupBehavior.raiseShown(eventArgs);
    },

    add_hiding: function(handler) {
        if(this._popupBehavior)
            this._popupBehavior.add_hiding(handler);
    },

    remove_hiding: function(handler) {
        if(this._popupBehavior)
            this._popupBehavior.remove_hiding(handler);
    },

    raiseHiding: function(eventArgs) {
        if(this._popupBehavior)
            this._popupBehavior.raiseHiding(eventArgs);
    },

    add_hidden: function(handler) {
        if(this._popupBehavior)
            this._popupBehavior.add_hidden(handler);
    },

    remove_hidden: function(handler) {
        if(this._popupBehavior)
            this._popupBehavior.remove_hidden(handler);
    },

    raiseHidden: function(eventArgs) {
        if(this._popupBehavior)
            this._popupBehavior.raiseHidden(eventArgs);
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