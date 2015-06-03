Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.ModalPopupRepositionMode = function() {
    // The ModalPopupRepositionMode enumeration describes how the modal popup repositions
    throw Error.invalidOperation();
};

Sys.Extended.UI.ModalPopupRepositionMode.prototype = {
    None: 0,
    RepositionOnWindowResize: 1,
    RepositionOnWindowScroll: 2,
    RepositionOnWindowResizeAndScroll: 3
};

Sys.Extended.UI.ModalPopupRepositionMode.registerEnum('Sys.Extended.UI.ModalPopupRepositionMode');

Sys.Extended.UI.ModalPopupBehavior = function(element) {
    // The ModalPopupBehavior is used to display the target element as a modal dialog
    Sys.Extended.UI.ModalPopupBehavior.initializeBase(this, [element]);

    // Properties
    this._PopupControlID = null;
    this._PopupDragHandleControlID = null;
    this._BackgroundCssClass = null;
    this._DropShadow = false;
    this._Drag = false;
    this._OkControlID = null;
    this._CancelControlID = null;
    this._OnOkScript = null;
    this._OnCancelScript = null;
    this._xCoordinate = -1;
    this._yCoordinate = -1;
    this._repositionMode = Sys.Extended.UI.ModalPopupRepositionMode.RepositionOnWindowResizeAndScroll;
    this._onShown = new Sys.Extended.UI.Animation.GenericAnimationBehavior(element); //element replaced later with popuptarget
    this._onHidden = new Sys.Extended.UI.Animation.GenericAnimationBehavior(element);
    this._onShowing = new Sys.Extended.UI.Animation.GenericAnimationBehavior(element);
    this._onHiding = new Sys.Extended.UI.Animation.GenericAnimationBehavior(element);

    // Variables
    this._backgroundElement = null;
    this._foregroundElement = null;
    this._relativeOrAbsoluteParentElement = null;
    this._popupElement = null;
    this._dragHandleElement = null;
    this._showHandler = null;
    this._okHandler = null;
    this._cancelHandler = null;
    this._scrollHandler = null;
    this._resizeHandler = null;
    this._windowHandlersAttached = false;
    this._dropShadowBehavior = null;
    this._dragBehavior = null;
    this._isIE6 = false;

    this._saveTabIndexes = new Array();
    this._saveDesableSelect = new Array();
    this._tagWithTabIndex = new Array('A', 'AREA', 'BUTTON', 'INPUT', 'OBJECT', 'SELECT', 'TEXTAREA', 'IFRAME');

    this._isAnimationJustEnded = false;
    this._hidingAnimationEndedHandler = null;
    this._showingAnimationEndedHandler = null;

};

Sys.Extended.UI.ModalPopupBehavior.prototype = {

    initialize: function() {
        // <div superpopup - drag container resizable><div -- drag handle\dropshadow foreground></div></div>
        Sys.Extended.UI.ModalPopupBehavior.callBaseMethod(this, 'initialize');

        this._isIE6 = (Sys.Browser.agent == Sys.Browser.InternetExplorer && Sys.Browser.version < 7);
        if(this._PopupDragHandleControlID)
            this._dragHandleElement = $get(this._PopupDragHandleControlID);

        this._popupElement = $get(this._PopupControlID);
        if(this._DropShadow) {
            this._foregroundElement = document.createElement('div');
            this._foregroundElement.id = this.get_id() + '_foregroundElement';
            this._popupElement.parentNode.appendChild(this._foregroundElement);
            this._foregroundElement.appendChild(this._popupElement);
        } else {
            this._foregroundElement = this._popupElement;
        }

        this._backgroundElement = document.createElement('div');
        this._backgroundElement.id = this.get_id() + '_backgroundElement';
        this._backgroundElement.style.display = 'none';
        this._backgroundElement.style.position = 'fixed';
        this._backgroundElement.style.left = '0px';
        this._backgroundElement.style.top = '0px';

        // Want zIndex to big enough that the background sits above everything else
        // CSS 2.1 defines no bounds for the <integer> type, so pick arbitrarily
        this._backgroundElement.style.zIndex = Sys.Extended.UI.zIndex.ModalPopupBackground;
        if(this._BackgroundCssClass)
            this._backgroundElement.className = this._BackgroundCssClass;

        this._foregroundElement.parentNode.appendChild(this._backgroundElement);
        this._foregroundElement.style.display = 'none';
        this._foregroundElement.style.position = 'fixed';
        this._foregroundElement.style.zIndex = parseInt($common.getCurrentStyle(this._backgroundElement, 'zIndex', this._backgroundElement.style.zIndex)) + 1;

        this._showHandler = Function.createDelegate(this, this._onShow);
        $addHandler(this.get_element(), 'click', this._showHandler);

        if(this._OkControlID) {
            this._okHandler = Function.createDelegate(this, this._onOk);
            $addHandler($get(this._OkControlID), 'click', this._okHandler);
        }

        if(this._CancelControlID) {
            this._cancelHandler = Function.createDelegate(this, this._onCancel);
            $addHandler($get(this._CancelControlID), 'click', this._cancelHandler);
        }

        this._scrollHandler = Function.createDelegate(this, this._onLayout);
        this._resizeHandler = Function.createDelegate(this, this._onLayout);

        // Need to know when partial updates complete
        this.registerPartialUpdateEvents();

        // We initally set it to the element, but needs to be targeted at
        // the popup contorl
        this._resetAnimationsTarget();

        // attach to animation end events to signal hiding animation completed
        // an call hide()/show() to hide/show the  popup.        
        if(this._onHiding.get_animation()) {
            this._hidingAnimationEndedHandler = Function.createDelegate(this, function() {
                this._isAnimationJustEnded = true;
                this.hide();
            });
            this._onHiding.get_animation().add_ended(this._hidingAnimationEndedHandler);
        }

        if(this._onShowing.get_animation()) {
            this._showingAnimationEndedHandler = Function.createDelegate(this, function() {
                this._isAnimationJustEnded = true;
                this.show();
            });
            this._onShowing.get_animation().add_ended(this._showingAnimationEndedHandler);
        }
    },

    dispose: function() {
        // Going away; restore any changes to the page
        this._hideImplementation();

        if(this._foregroundElement && this._foregroundElement.parentNode) {
            // Remove background we added to the DOM
            this._foregroundElement.parentNode.removeChild(this._backgroundElement);

            if(this._DropShadow) {
                // Remove DIV wrapper added in initialize
                this._foregroundElement.parentNode.appendChild(this._popupElement);
                this._foregroundElement.parentNode.removeChild(this._foregroundElement);
            }
        }

        this._scrollHandler = null;
        this._resizeHandler = null;

        if(this._cancelHandler && $get(this._CancelControlID)) {
            $removeHandler($get(this._CancelControlID), 'click', this._cancelHandler);
            this._cancelHandler = null;
        }

        if(this._okHandler && $get(this._OkControlID)) {
            $removeHandler($get(this._OkControlID), 'click', this._okHandler);
            this._okHandler = null;
        }

        if(this._showHandler) {
            $removeHandler(this.get_element(), 'click', this._showHandler);
            this._showHandler = null;
        }

        if(this._hidingAnimationEndedHandler) {
            this._onHiding.get_animation().remove_ended(this._hidingAnimationEndedHandler);
        }

        if(this._showingAnimationEndedHandler) {
            this._onShowing.get_animation().remove_ended(this._showingAnimationEndedHandler);
        }

        Sys.Extended.UI.ModalPopupBehavior.callBaseMethod(this, 'dispose');
    },

    _attachPopup: function() {
        if(this._DropShadow && !this._dropShadowBehavior)
            this._dropShadowBehavior = $create(Sys.Extended.UI.DropShadowBehavior, {}, null, null, this._popupElement);

        if(this._dragHandleElement && !this._dragBehavior)
            this._dragBehavior = $create(Sys.Extended.UI.FloatingBehavior, { "handle": this._dragHandleElement }, null, null, this._foregroundElement);

        $addHandler(window, 'resize', this._resizeHandler);
        $addHandler(window, 'scroll', this._scrollHandler);

        this._windowHandlersAttached = true;
    },

    _detachPopup: function() {
        if(this._windowHandlersAttached) {
            if(this._scrollHandler)
                $removeHandler(window, 'scroll', this._scrollHandler);

            if(this._resizeHandler)
                $removeHandler(window, 'resize', this._resizeHandler);

            this._windowHandlersAttached = false;
        }

        if(this._dragBehavior) {
            this._dragBehavior.dispose();
            this._dragBehavior = null;
        }

        if(this._dropShadowBehavior) {
            this._dropShadowBehavior.dispose();
            this._dropShadowBehavior = null;
        }
    },

    _onShow: function(e) {
        // Handler for the target's click event
        if(!this.get_element().disabled) {
            this.show();
            e.preventDefault();

            return false;
        }
    },

    _onOk: function(e) {
        // Handler for the modal dialog's OK button click
        var element = $get(this._OkControlID);

        if(element && !element.disabled) {
            if(this.hide() && this._OnOkScript)
                window.setTimeout(this._OnOkScript, 0);

            e.preventDefault();

            return false;
        }
    },

    _onCancel: function(e) {
        // Handler for the modal dialog's Cancel button click
        var element = $get(this._CancelControlID);

        if(element && !element.disabled) {
            if(this.hide() && this._OnCancelScript)
                window.setTimeout(this._OnCancelScript, 0);

            e.preventDefault();

            return false;
        }
    },

    _onLayout: function(e) {
        // Handler for scrolling and resizing events that would require a repositioning of the modal dialog
        var positioning = this.get_repositionMode();

        if(((positioning === Sys.Extended.UI.ModalPopupRepositionMode.RepositionOnWindowScroll) ||
            (positioning === Sys.Extended.UI.ModalPopupRepositionMode.RepositionOnWindowResizeAndScroll)) && (e.type === 'scroll')) {
            this._layout();
        } else if(((positioning === Sys.Extended.UI.ModalPopupRepositionMode.RepositionOnWindowResize) ||
            (positioning === Sys.Extended.UI.ModalPopupRepositionMode.RepositionOnWindowResizeAndScroll)) && (e.type === 'resize')) {
            this._layout();
        } else {
            // Layout background element again to make sure it covers the whole background.
            // This needs to be called separately since _layout will not be always called
            // to reposition the popup depending on the RepositionMode but the background needs 
            // to handle the resize/scroll every time.
            this._layoutBackgroundElement();
        }
    },

    show: function() {
        // Display the element referenced by PopupControlID as a modal dialog
        if(!this._isAnimationJustEnded) {
            var eventArgs = new Sys.CancelEventArgs();
            this.raiseShowing(eventArgs);

            if(eventArgs.get_cancel()) {
                return;
            } else if(this._onShowing.get_animation()) {
                this._onShowing.play();
                return;
            }
        } else {
            this._isAnimationJustEnded = false;
        }

        this.populate();
        this._attachPopup();

        this._backgroundElement.style.display = '';
        this._foregroundElement.style.display = '';
        this._popupElement.style.display = '';

        if(this._isIE6) {
            this._foregroundElement.style.position = 'absolute';
            this._backgroundElement.style.position = 'absolute';

            // find the relative or absolute parent
            var tempRelativeOrAbsoluteParent = this._foregroundElement.parentNode;
            while(tempRelativeOrAbsoluteParent && (tempRelativeOrAbsoluteParent != document.documentElement)) {
                if((tempRelativeOrAbsoluteParent.style.position != 'relative') && (tempRelativeOrAbsoluteParent.style.position != 'absolute')) {
                    tempRelativeOrAbsoluteParent = tempRelativeOrAbsoluteParent.parentNode;
                } else {
                    this._relativeOrAbsoluteParentElement = tempRelativeOrAbsoluteParent;
                    break;
                }
            }
        }


        // Disable TAB
        this.disableTab();

        this._layout();
        // On pages that don't need scrollbars, Firefox and Safari act like
        // one or both are present the first time the layout code runs which
        // obviously leads to display issues - run the layout code a second
        // time to work around this problem
        this._layout();

        this.raiseShown(Sys.EventArgs.Empty);

        this._onShown.play();
    },

    disableTab: function() {
        // Change the tab indices so we only tab through the modal popup
        // (and hide SELECT tags in IE6)

        var i = 0,
            tagElements,
            tagElementsInPopUp = new Array();

        Array.clear(this._saveTabIndexes);

        //Save all popup's tag in tagElementsInPopUp
        for(var j = 0; j < this._tagWithTabIndex.length; j++) {
            tagElements = this._foregroundElement.getElementsByTagName(this._tagWithTabIndex[j]);

            for(var k = 0; k < tagElements.length; k++) {
                tagElementsInPopUp[i] = tagElements[k];
                i++;
            }
        }

        i = 0;
        for(var j = 0; j < this._tagWithTabIndex.length; j++) {
            tagElements = document.getElementsByTagName(this._tagWithTabIndex[j]);

            for(var k = 0; k < tagElements.length; k++) {
                if(Array.indexOf(tagElementsInPopUp, tagElements[k]) == -1) {
                    this._saveTabIndexes[i++] = { tag: tagElements[k], index: tagElements[k].tabIndex };
                    tagElements[k].tabIndex = "-1";
                }
            }
        }

        //IE6 Bug with SELECT element always showing up on top
        i = 0;
        if((Sys.Browser.agent === Sys.Browser.InternetExplorer) && (Sys.Browser.version < 7)) {
            //Save SELECT in PopUp
            var tagSelectInPopUp = new Array();

            for(var j = 0; j < this._tagWithTabIndex.length; j++) {
                tagElements = this._foregroundElement.getElementsByTagName('SELECT');

                for(var k = 0; k < tagElements.length; k++) {
                    tagSelectInPopUp[i] = tagElements[k];
                    i++;
                }
            }

            i = 0;
            Array.clear(this._saveDesableSelect);
            tagElements = document.getElementsByTagName('SELECT');

            for(var k = 0; k < tagElements.length; k++)
                if(Array.indexOf(tagSelectInPopUp, tagElements[k]) == -1) {
                    this._saveDesableSelect[i++] = { tag: tagElements[k], visib: $common.getCurrentStyle(tagElements[k], 'visibility') };
                    tagElements[k].style.visibility = 'hidden';
                }
        }
    },

    restoreTab: function() {
        // Restore the tab indices so we tab through the page like normal
        // (and restore SELECT tags in IE6)
        for(var i = 0; i < this._saveTabIndexes.length; i++) {
            this._saveTabIndexes[i].tag.tabIndex = this._saveTabIndexes[i].index;
        }
        Array.clear(this._saveTabIndexes);

        //IE6 Bug with SELECT element always showing up on top
        if((Sys.Browser.agent === Sys.Browser.InternetExplorer) && (Sys.Browser.version < 7)) {
            for(var k = 0; k < this._saveDesableSelect.length; k++)
                this._saveDesableSelect[k].tag.style.visibility = this._saveDesableSelect[k].visib;

            Array.clear(this._saveDesableSelect);
        }
    },

    hide: function() {
        // Hide the modal dialog
        if(!this._isAnimationJustEnded) {
            var eventArgs = new Sys.CancelEventArgs();
            this.raiseHiding(eventArgs);

            if(eventArgs.get_cancel())
                return false;
            else if(this._onHiding.get_animation()) {
                this._onHiding.play();
                return true;
            }
        } else {
            this._isAnimationJustEnded = false;
        }

        this._hideImplementation();
        this.raiseHidden(Sys.EventArgs.Empty);
        this._onHidden.play();

        return true;
    },

    _hideImplementation: function() {
        // Internal implementation to hide the modal dialog
        this._backgroundElement.style.display = 'none';
        this._foregroundElement.style.display = 'none';

        this.restoreTab();
        this._detachPopup();
    },

    _layout: function() {
        var scrollLeft = (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft),
            scrollTop = (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);

        var clientBounds = $common.getClientBounds(),
            clientWidth = clientBounds.width,
            clientHeight = clientBounds.height;

        // Setup the location of the background element
        this._layoutBackgroundElement();

        var xCoord = 0;
        var yCoord = 0;
        if(this._xCoordinate < 0) {
            var foregroundelementwidth = this._foregroundElement.offsetWidth ? this._foregroundElement.offsetWidth : this._foregroundElement.scrollWidth;
            xCoord = ((clientWidth - foregroundelementwidth) / 2);

            // workaround for drag behavior which calls setlocation which in turn
            // changes the position of the panel to be absolute and requiring us
            // to add the scrollLeft so that it is positioned correctly.
            if(this._foregroundElement.style.position == 'absolute')
                xCoord += scrollLeft;

            this._foregroundElement.style.left = xCoord + 'px';
        } else {
            if(this._isIE6) {
                this._foregroundElement.style.left = (this._xCoordinate + scrollLeft) + 'px';
                xCoord = this._xCoordinate + scrollLeft;
            } else {
                this._foregroundElement.style.left = this._xCoordinate + 'px';
                xCoord = this._xCoordinate;
            }
        }

        if(this._yCoordinate < 0) {
            var foregroundelementheight = this._foregroundElement.offsetHeight ? this._foregroundElement.offsetHeight : this._foregroundElement.scrollHeight;
            yCoord = ((clientHeight - foregroundelementheight) / 2);

            // workaround for drag behavior which calls setlocation which in turn
            // changes the position of the panel to be absolute and requiring us
            // to add the scrollLeft so that it is positioned correctly.
            if(this._foregroundElement.style.position == 'absolute')
                yCoord += scrollTop;

            this._foregroundElement.style.top = yCoord + 'px';
        } else {
            if(this._isIE6) {
                this._foregroundElement.style.top = (this._yCoordinate + scrollTop) + 'px';
                yCoord = this._yCoordinate + scrollTop;
            } else {
                this._foregroundElement.style.top = this._yCoordinate + 'px';
                yCoord = this._yCoordinate;
            }
        }

        // make sure get location agrees with the location of the foreground element
        this._layoutForegroundElement(xCoord, yCoord);

        if(this._dropShadowBehavior) {
            this._dropShadowBehavior.setShadow();
            window.setTimeout(Function.createDelegate(this, this._fixupDropShadowBehavior), 0);
        }

        // layout background element again to make sure it covers the whole background 
        // in case things moved around when laying out the foreground element
        this._layoutBackgroundElement();
    },

    _layoutForegroundElement: function(xCoord, yCoord) {
        // Set the correct location of the foreground element to ensure that it is absolutely 
        // positioned with respect to the browser. This is just a workaround for IE 6 since
        // elements nested in relative parents cause modal popup positioning issues and 'fixed'
        // is not supported by IE 6. Hence we manually compute the right location of the popup.

        if(this._isIE6 && this._relativeOrAbsoluteParentElement) {
            var foregroundLocation = $common.getLocation(this._foregroundElement),
                relativeParentLocation = $common.getLocation(this._relativeOrAbsoluteParentElement),
                getLocationXCoord = foregroundLocation.x;

            if(getLocationXCoord != xCoord)
                // offset it by that amount
                this._foregroundElement.style.left = (xCoord - relativeParentLocation.x) + 'px';

            var getLocationYCoord = foregroundLocation.y;
            if(getLocationYCoord != yCoord)
                // offset it by that amount
                this._foregroundElement.style.top = (yCoord - relativeParentLocation.y) + 'px';
        }
    },

    _layoutBackgroundElement: function() {
        // Set the correct location of the background element to ensure that it is absolutely 
        // positioned with respect to the browser.

        // Background element needs to cover the visible client area completely hence its
        // top and left coordinates need to be 0, and if relatively positioned its getlocation
        // value needs to be 0.
        if(this._isIE6) {
            var backgroundLocation = $common.getLocation(this._backgroundElement),
                backgroundXCoord = backgroundLocation.x;

            if(backgroundXCoord != 0)
                // offset it by that amount. This is assuming only one level of nesting. If
                // multiple parents with absolute/relative positioning are setup this may not 
                // cover the whole background.
                this._backgroundElement.style.left = (-backgroundXCoord) + 'px';

            var backgroundYCoord = backgroundLocation.y;
            if(backgroundYCoord != 0)
                // offset it by that amount. This is assuming only one level of nesting. If
                // multiple parents with absolute/relative positioning are setup this may not 
                // cover the whole background.
                this._backgroundElement.style.top = (-backgroundYCoord) + 'px';
        }

        var clientBounds = $common.getClientBounds(),
            clientWidth = clientBounds.width,
            clientHeight = clientBounds.height;

        this._backgroundElement.style.width = Math.max(Math.max(document.documentElement.scrollWidth, document.body.scrollWidth), clientWidth) + 'px';
        this._backgroundElement.style.height = Math.max(Math.max(document.documentElement.scrollHeight, document.body.scrollHeight), clientHeight) + 'px';
    },

    _fixupDropShadowBehavior: function() {
        // Some browsers don't update the location values immediately, so
        // the location of the drop shadow would always be a step behind
        // without this method
        if(this._dropShadowBehavior)
            this._dropShadowBehavior.setShadow();
    },

    _partialUpdateEndRequest: function(sender, endRequestEventArgs) {
        // Show the popup if requested during a partial postback
        Sys.Extended.UI.ModalPopupBehavior.callBaseMethod(this, '_partialUpdateEndRequest', [sender, endRequestEventArgs]);

        if(this.get_element()) {
            // Look up result by element's ID
            var action = endRequestEventArgs.get_dataItems()[this.get_element().id];

            if("show" == action)
                this.show();
            else if("hide" == action)
                this.hide();
        }

        // Async postback may have added content; re-layout to accomodate it
        this._layout();
    },

    _onPopulated: function(sender, eventArgs) {
        // Re-layout the popup after we've dynamically populated
        Sys.Extended.UI.ModalPopupBehavior.callBaseMethod(this, '_onPopulated', [sender, eventArgs]);

        // Dynamic populate may have added content; re-layout to accomodate it
        this._layout();
    },

    _replaceAnimationTarget: function(memberName, target) {
        var json = this[memberName].get_json();

        this[memberName] = new Sys.Extended.UI.Animation.GenericAnimationBehavior(target);
        this[memberName].set_json(json);
        this[memberName].initialize();
    },

    _resetAnimationsTarget: function() {
        var target = $get(this.get_PopupControlID());

        this._replaceAnimationTarget('_onShowing', target);
        this._replaceAnimationTarget('_onShown', target);
        this._replaceAnimationTarget('_onHiding', target);
        this._replaceAnimationTarget('_onHidden', target);
    },

    get_PopupControlID: function() {
        return this._PopupControlID;
    },

    set_PopupControlID: function(value) {
        if(this._PopupControlID != value) {
            this._PopupControlID = value;
            this.raisePropertyChanged('PopupControlID');
        }
    },

    get_X: function() {
        // The number of pixels from the left of the browser to position the modal popup.
        return this._xCoordinate;
    },

    set_X: function(value) {
        if(this._xCoordinate != value) {
            this._xCoordinate = value;
            this.raisePropertyChanged('X');
        }
    },

    get_Y: function() {
        // The number of pixels from the top of the browser to position the modal popup.
        return this._yCoordinate;
    },

    set_Y: function(value) {
        if(this._yCoordinate != value) {
            this._yCoordinate = value;
            this.raisePropertyChanged('Y');
        }
    },

    get_PopupDragHandleControlID: function() {
        return this._PopupDragHandleControlID;
    },

    set_PopupDragHandleControlID: function(value) {
        if(this._PopupDragHandleControlID != value) {
            this._PopupDragHandleControlID = value;
            this.raisePropertyChanged('PopupDragHandleControlID');
        }
    },

    get_BackgroundCssClass: function() {
        return this._BackgroundCssClass;
    },

    set_BackgroundCssClass: function(value) {
        if(this._BackgroundCssClass != value) {
            this._BackgroundCssClass = value;
            this.raisePropertyChanged('BackgroundCssClass');
        }
    },

    get_DropShadow: function() {
        // Whether or not a drop-shadow should be added to the modal popup
        return this._DropShadow;
    },

    set_DropShadow: function(value) {
        if(this._DropShadow != value) {
            this._DropShadow = value;
            this.raisePropertyChanged('DropShadow');
        }
    },

    get_Drag: function() {
        // Obsolete: Setting the _Drag property is a noop
        return this._Drag;
    },

    set_Drag: function(value) {
        if(this._Drag != value) {
            this._Drag = value;
            this.raisePropertyChanged('Drag');
        }
    },

    get_OkControlID: function() {
        return this._OkControlID;
    },

    set_OkControlID: function(value) {
        if(this._OkControlID != value) {
            this._OkControlID = value;
            this.raisePropertyChanged('OkControlID');
        }
    },

    get_CancelControlID: function() {
        return this._CancelControlID;
    },

    set_CancelControlID: function(value) {
        if(this._CancelControlID != value) {
            this._CancelControlID = value;
            this.raisePropertyChanged('CancelControlID');
        }
    },

    get_OnOkScript: function() {
        return this._OnOkScript;
    },

    set_OnOkScript: function(value) {
        if(this._OnOkScript != value) {
            this._OnOkScript = value;
            this.raisePropertyChanged('OnOkScript');
        }
    },

    get_OnCancelScript: function() {
        return this._OnCancelScript;
    },

    set_OnCancelScript: function(value) {
        if(this._OnCancelScript != value) {
            this._OnCancelScript = value;
            this.raisePropertyChanged('OnCancelScript');
        }
    },

    get_repositionMode: function() {
        // Determines if the ModalPopup should be repositioned on window resize/scroll
        return this._repositionMode;
    },

    set_repositionMode: function(value) {
        if(this._repositionMode !== value) {
            this._repositionMode = value;
            this.raisePropertyChanged('RepositionMode');
        }
    },

    get_OnShowing: function() {
        // Generic OnShowing Animation's JSON definition. Played before the Popup is being shown.
        return this._onShowing.get_json();
    },

    set_OnShowing: function(value) {
        this._onShowing.set_json(value);
        this.raisePropertyChanged('OnShowing');
    },

    get_OnShown: function() {
        // Generic OnShown Animation's JSON definition. Played once the Popup is shown.
        return this._onShown.get_json();
    },

    set_OnShown: function(value) {
        this._onShown.set_json(value);
        this.raisePropertyChanged('OnShown');
    },

    get_OnHiding: function() {
        // Generic OnHiding Animation's JSON definition. Played before the Popup is being hidden.
        return this._onHiding.get_json();
    },

    set_OnHiding: function(value) {
        this._onHiding.set_json(value);
        this.raisePropertyChanged('OnHiding');
    },

    get_OnHidden: function() {
        // Generic OnHidden Animation's JSON definition. Played once the Popup is hidden.
        return this._onHidden.get_json();
    },

    set_OnHidden: function(value) {
        this._onHidden.set_json(value);
        this.raisePropertyChanged('OnHidden');
    },

    add_showing: function(handler) {
        // Add an event handler for the showing event
        this.get_events().addHandler('showing', handler);
    },

    remove_showing: function(handler) {
        // Remove an event handler from the showing event
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
};

Sys.Extended.UI.ModalPopupBehavior.registerClass('Sys.Extended.UI.ModalPopupBehavior', Sys.Extended.UI.DynamicPopulateBehaviorBase);

Sys.Extended.UI.ModalPopupBehavior.invokeViaServer = function(behaviorID, show) {
    // This static function (that is intended to be called from script emitted
    // on the server) will show or hide the behavior associated with behaviorID
    // (i.e. to use this, the ModalPopupExtender must have an ID or BehaviorID) and
    // will either show or hide depending on the show parameter.
    var behavior = $find(behaviorID);

    if(behavior) {
        if(show)
            behavior.show();
        else
            behavior.hide();
    }
};
