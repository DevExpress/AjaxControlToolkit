Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.HoverMenuBehavior = function(element) {
    // The HoverMenuBehavior is used to display a popup whenever the target is hovered over
    Sys.Extended.UI.HoverMenuBehavior.initializeBase(this, [element]);

    // Encapsulated behaviors
    this._hoverBehavior = null;
    this._popupBehavior = null;

    // Handler delegates
    this._mouseEnterHandler = null;
    this._mouseLeaveHandler = null;
    this._unhoverHandler = null;
    this._hoverHandler = null;

    // State variables
    this._inHover = null;
    this._oldClass = null;
    this._popupElement = null;
    this._onShowJson = null;
    this._onHideJson = null;

    // Property values
    this._popupElement = null;
    this._hoverCssClass = null;
    this._offsetX = 0;
    this._offsetY = 0;
    this._popDelay = 100;
    this._hoverDelay = 0;
    this._popupPosition = null;
}

Sys.Extended.UI.HoverMenuBehavior.prototype = {

    initialize: function() {
        Sys.Extended.UI.HoverMenuBehavior.callBaseMethod(this, 'initialize');

        // set up our delegates and handlers
        this._hoverHandler = Function.createDelegate(this, this._onHover);
        this._unhoverHandler = Function.createDelegate(this, this._onUnhover);
        this._mouseEnterHandler = Function.createDelegate(this, this._onmouseover);
        this._mouseLeaveHandler = Function.createDelegate(this, this._onmouseout);

        var e = this.get_element();
        $addHandler(e, "mouseover", this._mouseEnterHandler);
        $addHandler(e, "mouseout", this._mouseLeaveHandler);

        if(this._popupElement) {
            // setup the popup behavior
            this._popupBehavior = $create(Sys.Extended.UI.PopupBehavior, { "id": this.get_id() + "_PopupBehavior" }, null, null, this._popupElement);
            if(this._popupPosition)
                this._popupBehavior.set_positioningMode(Sys.Extended.UI.HoverMenuPopupPosition.Absolute);
            else
                this._popupBehavior.set_positioningMode(Sys.Extended.UI.HoverMenuPopupPosition.Center);

            // Create the animations (if they were set before initialize was called)
            if(this._onShowJson)
                this._popupBehavior.set_onShow(this._onShowJson);

            if(this._onHideJson)
                this._popupBehavior.set_onHide(this._onHideJson);

            // set up the hover behavior
            this._hoverBehavior = $create(Sys.Extended.UI.HoverBehavior, { "id": this.get_id() + "_HoverBehavior", "hoverDelay": this._hoverDelay, "unhoverDelay": this._popDelay, "hoverElement": this._popupElement }, null, null, e);
            this._hoverBehavior.add_hover(this._hoverHandler);
            this._hoverBehavior.add_unhover(this._unhoverHandler);
        }
    },

    dispose: function() {
        // do cleanup
        this._onShowJson = null;
        this._onHideJson = null;

        if(this._popupBehavior) {
            this._popupBehavior.dispose();
            this._popupBehavior = null;
        }

        if(this._popupElement)
            this._popupElement = null;

        if(this._mouseEnterHandler)
            $removeHandler(this.get_element(), "mouseover", this._mouseEnterHandler);

        if(this._mouseLeaveHandler)
            $removeHandler(this.get_element(), "mouseout", this._mouseLeaveHandler);

        if(this._hoverBehavior) {
            if(this._hoverHandler) {
                this._hoverBehavior.remove_hover(this._hoverHandler);
                this._hoverHandler = null;
            }

            if(this._unhoverHandler) {
                this._hoverBehavior.remove_hover(this._unhoverHandler);
                this._unhoverHandler = null;
            }

            this._hoverBehavior.dispose();
            this._hoverBehavior = null;
        }

        Sys.Extended.UI.HoverMenuBehavior.callBaseMethod(this, 'dispose');
    },

    _getLeftOffset: function() {
        var defaultLeft = $common.getLocation(this.get_element()).x,
            offsetLeft = $common.getLocation(this.get_popupElement().offsetParent).x,
            delta = 0;

        // this offset is always relative to the left edge of the hover element.
        switch(this._popupPosition) {
            case Sys.Extended.UI.HoverMenuPopupPosition.Left:
                // if it's positioned left, it's the width of the popup plus the offset
                delta = (-1 * this._popupElement.offsetWidth);
                break;
            case Sys.Extended.UI.HoverMenuPopupPosition.Right:
                // if it's to the right, it's the width of the hover element plus the offset.
                delta = this.get_element().offsetWidth;
                break;
        }

        return delta + defaultLeft - offsetLeft + this._offsetX;
    },

    _getTopOffset: function() {
        var defaultTop = $common.getLocation(this.get_element()).y,
            offsetTop = $common.getLocation(this.get_popupElement().offsetParent).y,
            delta = 0;

        // this offset is always relative to the top edge of the hover element.
        switch(this._popupPosition) {
            case Sys.Extended.UI.HoverMenuPopupPosition.Top:
                // if it's Top positioned, it's the height of the popup plus the offset.
                delta = (-1 * this._popupElement.offsetHeight);
                break;
            case Sys.Extended.UI.HoverMenuPopupPosition.Bottom:
                // if it's bottom positioned it's the height of the hover element plus the offset
                delta = this.get_element().offsetHeight;
                break;
        }

        return defaultTop - offsetTop + delta + this._offsetY;
    },

    _onHover: function() {
        if(this._inHover)
            return;

        var eventArgs = new Sys.CancelEventArgs();
        this.raiseShowing(eventArgs);

        if(eventArgs.get_cancel())
            return;

        this._inHover = true;
        this.populate();

        this._popupBehavior.show();
        if($common.getCurrentStyle(this._popupElement, 'display') == 'none')
            this._popupElement.style.display = 'block';

        this._popupBehavior.set_x(this._getLeftOffset());
        this._popupBehavior.set_y(this._getTopOffset());
        this.raiseShown(Sys.EventArgs.Empty);
    },

    _onUnhover: function() {
        var eventArgs = new Sys.CancelEventArgs();
        this.raiseHiding(eventArgs);

        if(eventArgs.get_cancel())
            return;

        this._inHover = false;
        this._resetCssClass();
        this._popupBehavior.hide();
        this.raiseHidden(Sys.EventArgs.Empty);
    },

    _onmouseover: function() {
        // Handler to change the CSS class when hovered over

        // set up the CSS class
        var e = this.get_element();
        if(this._hoverCssClass && e.className != this._hoverCssClass) {
            this._oldClass = e.className;
            e.className = this._hoverCssClass;
        }
    },

    _onmouseout: function() {
        this._resetCssClass();
    },

    _resetCssClass: function() {
        // Reset the CSS class if we changed it while hovering

        // make sure we're not still in hover mode, and that the class is
        // currently the hover class.
        var e = this.get_element();
        if(!this._inHover && this._hoverCssClass && e.className == this._hoverCssClass)
            e.className = this._oldClass;
    },

    get_onShow: function() {
        // Generic OnShow Animation's JSON definition
        return this._popupBehavior ? this._popupBehavior.get_onShow() : this._onShowJson;
    },

    set_onShow: function(value) {
        if(this._popupBehavior)
            this._popupBehavior.set_onShow(value)
        else
            this._onShowJson = value;

        this.raisePropertyChanged('onShow');
    },

    get_onShowBehavior: function() {
        // Generic OnShow Animation's behavior
        return this._popupBehavior ? this._popupBehavior.get_onShowBehavior() : null;
    },

    onShow: function() {
        if(this._popupBehavior)
            this._popupBehavior.onShow();
    },

    get_onHide: function() {
        // Generic OnHide Animation's JSON definition
        return this._popupBehavior ? this._popupBehavior.get_onHide() : this._onHideJson;
    },

    set_onHide: function(value) {
        if(this._popupBehavior)
            this._popupBehavior.set_onHide(value)
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

    get_popupElement: function() {
        // Popup that is displayed when hovering
        return this._popupElement;
    },

    set_popupElement: function(value) {
        if(this._popupElement != value) {
            this._popupElement = value;

            if(this.get_isInitialized() && this._hoverBehavior)
                this._hoverBehavior.set_hoverElement(this._popupElement);

            this.raisePropertyChanged('popupElement');
        }
    },

    get_HoverCssClass: function() {
        return this._hoverCssClass;
    },

    set_HoverCssClass: function(value) {
        if(this._hoverCssClass != value) {
            this._hoverCssClass = value;
            this.raisePropertyChanged('HoverCssClass');
        }
    },

    get_OffsetX: function() {
        // The number of pixels to offset the popup from it's default position horizontally
        return this._offsetX;
    },

    set_OffsetX: function(value) {
        if(this._offsetX != value) {
            this._offsetX = value;
            this.raisePropertyChanged('OffsetX');
        }
    },

    get_OffsetY: function() {
        // The number of pixels to offset the popup from it's default position vertically
        return this._offsetY;
    },

    set_OffsetY: function(value) {
        if(this._offsetY != value) {
            this._offsetY = value;
            this.raisePropertyChanged('OffsetY');
        }
    },

    get_PopupPosition: function() {
        // Where the popup should be positioned relative to the target control.
        // Can be Left (Default), Right, Top, Bottom, Center.
        return this._popupPosition;
    },

    set_PopupPosition: function(value) {
        if(this._popupPosition != value) {
            this._popupPosition = value;
            this.raisePropertyChanged('PopupPosition');
        }
    },

    get_PopDelay: function() {
        // The time delay from when the mouse enters the target to when the popup is shown, in milliseconds. Default is 100.
        return this._popDelay;
    },

    set_PopDelay: function(value) {
        if(this._popDelay != value) {
            this._popDelay = value;
            this.raisePropertyChanged('PopDelay');
        }
    },

    get_HoverDelay: function() {
        // The time delay after the mouse enters the target and before the popup is shown, in milliseconds. Default is 0.
        return this._hoverDelay;
    },

    set_HoverDelay: function(value) {
        if(this._hoverDelay != value) {
            this._hoverDelay = value;
            this.raisePropertyChanged('HoverDelay');
        }
    },

    add_showing: function(handler) {
        this.get_events().addHandler('showing', handler);
    },

    remove_showing: function(handler) {
        this.get_events().removeHandler('showing', handler);
    },

    raiseShowing: function(eventArgs) {
        var handler = this.get_events().getHandler('showing');
        if(handler)
            handler(this, eventArgs);
    },

    add_shown: function(handler) {
        this.get_events().addHandler('shown', handler);
    },

    remove_shown: function(handler) {
        this.get_events().removeHandler('shown', handler);
    },

    raiseShown: function(eventArgs) {
        var handler = this.get_events().getHandler('shown');
        if(handler)
            handler(this, eventArgs);
    },

    add_hiding: function(handler) {
        this.get_events().addHandler('hiding', handler);
    },

    remove_hiding: function(handler) {
        this.get_events().removeHandler('hiding', handler);
    },

    raiseHiding: function(eventArgs) {
        var handler = this.get_events().getHandler('hiding');
        if(handler)
            handler(this, eventArgs);
    },

    add_hidden: function(handler) {
        this.get_events().addHandler('hidden', handler);
    },

    remove_hidden: function(handler) {
        this.get_events().removeHandler('hidden', handler);
    },

    raiseHidden: function(eventArgs) {
        var handler = this.get_events().getHandler('hidden');
        if(handler)
            handler(this, eventArgs);
    }
}

Sys.Extended.UI.HoverMenuBehavior.registerClass('Sys.Extended.UI.HoverMenuBehavior', Sys.Extended.UI.DynamicPopulateBehaviorBase);

Sys.Extended.UI.HoverMenuPopupPosition = function() {
    // Where the popup should be positioned relative to the target control
    throw Error.invalidOperation();
}

Sys.Extended.UI.HoverMenuPopupPosition.prototype = {
    Center: 0,
    Top: 1,
    Left: 2,
    Bottom: 3,
    Right: 4
}

Sys.Extended.UI.HoverMenuPopupPosition.registerEnum('Sys.Extended.UI.HoverMenuPopupPosition');