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
    this._popupControlID = null;
    this._popupDragHandleControlID = null;
    this._backgroundCssClass = null;
    this._dropShadow = false;
    this._drag = false;
    this._okControlID = null;
    this._cancelControlID = null;
    this._onOkScript = null;
    this._onCancelScript = null;
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
        if(this._popupDragHandleControlID)
            this._dragHandleElement = $get(this._popupDragHandleControlID);

        this._popupElement = $get(this._popupControlID);

        this._createDomElements();

        this._showHandler = Function.createDelegate(this, this._onShow);
        $addHandler(this.get_element(), 'click', this._showHandler);

        if(this._okControlID) {
            this._okHandler = Function.createDelegate(this, this._onOk);
            $addHandler($get(this._okControlID), 'click', this._okHandler);
        }

        if(this._cancelControlID) {
            this._cancelHandler = Function.createDelegate(this, this._onCancel);
            $addHandler($get(this._cancelControlID), 'click', this._cancelHandler);
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

            if(this._dropShadow) {
                // Remove DIV wrapper added in initialize
                this._foregroundElement.parentNode.appendChild(this._popupElement);
                this._foregroundElement.parentNode.removeChild(this._foregroundElement);
            }
        }

        this._scrollHandler = null;
        this._resizeHandler = null;

        if(this._cancelHandler && $get(this._cancelControlID)) {
            $removeHandler($get(this._cancelControlID), 'click', this._cancelHandler);
            this._cancelHandler = null;
        }

        if(this._okHandler && $get(this._okControlID)) {
            $removeHandler($get(this._okControlID), 'click', this._okHandler);
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

    _createDomElements: function() {
        if(this._dropShadow) {
            this._foregroundElement = document.createElement('div');
            this._foregroundElement.id = this.get_id() + '_foregroundElement';
            this._popupElement.parentNode.appendChild(this._foregroundElement);
            this._foregroundElement.appendChild(this._popupElement);
        } else {
            this._foregroundElement = this._popupElement;
        }

        this._backgroundElement = document.createElement('div');
        this._backgroundElement.setAttribute('data-act-control-type', 'modalPopupBackground');
        this._backgroundElement.id = this.get_id() + '_backgroundElement';
        this._backgroundElement.style.display = 'none';
        this._backgroundElement.style.position = 'fixed';
        this._backgroundElement.style.left = '0px';
        this._backgroundElement.style.top = '0px';

        if(this._backgroundCssClass)
            this._backgroundElement.className = this._backgroundCssClass;

        this._foregroundElement.parentNode.appendChild(this._backgroundElement);
        this._foregroundElement.style.display = 'none';
        this._foregroundElement.style.position = 'fixed';

        this._setZIndex();
    },

    _setZIndex: function() {
        var topModalPopupBackgroundZIndex = parseInt(this._findTopModalPopupBackgroundZIndex());
        // Want zIndex to big enough that the background sits above everything else
        // CSS 2.1 defines no bounds for the <integer> type, so pick arbitrarily
        this._backgroundElement.style.zIndex = topModalPopupBackgroundZIndex ? parseInt(topModalPopupBackgroundZIndex + 1) : parseInt(Sys.Extended.UI.zIndex.ModalPopupBackground);
        this._foregroundElement.style.zIndex = parseInt($common.getCurrentStyle(this._backgroundElement, 'zIndex', this._backgroundElement.style.zIndex)) + 1;
    },

    _getAllElementsWithAttribute: function(attribute) {
        var matchingElements = [];
        var allElements = document.getElementsByTagName('*');
        for(var i = 0, n = allElements.length; i < n; i++) {
            if(allElements[i].getAttribute(attribute) !== null) {
                matchingElements.push(allElements[i]);
            }
        }
        return matchingElements;
    },

    _findTopModalPopupBackgroundZIndex: function() {
        var actElements = this._getAllElementsWithAttribute("data-act-control-type");
        var backgrounds = [];

        for(var i = 0; i < actElements.length; i++) {
        	if (actElements[i].getAttribute('data-act-control-type') == 'modalPopupBackground')
                backgrounds.push(actElements[i]);
        }

        var backgroundsZindex = {};

        var topZIndex = undefined;

        for(var i = 0; i < backgrounds.length; i++) {
            if(topZIndex == undefined)
                topZIndex = backgrounds[i].style.zIndex;

            if(backgrounds[i].style.zIndex > topZIndex) {
                topZIndex = backgrounds[i].style.zIndex;
            }
        }

        return topZIndex;
    },

    _attachPopup: function() {
        if(this._dropShadow && !this._dropShadowBehavior)
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
        var element = $get(this._okControlID);

        if(element && !element.disabled) {
            if(this.hide() && this._onOkScript)
                window.setTimeout(this._onOkScript, 0);

            e.preventDefault();

            return false;
        }
    },

    _onCancel: function(e) {
        // Handler for the modal dialog's Cancel button click
        var element = $get(this._cancelControlID);

        if(element && !element.disabled) {
            if(this.hide() && this._onCancelScript)
                window.setTimeout(this._onCancelScript, 0);

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

    /// <summary>
    /// Displays an element that is referenced by the PopupControlID property as a modal dialog box
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ModalPopupExtender.show" />
    show: function() {
        // Display the element referenced by PopupControlID as a modal dialog
        if(!this._isAnimationJustEnded) {
            var eventArgs = new Sys.CancelEventArgs();
            this.raise_showing(eventArgs);

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

        this._setZIndex();

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

        this.raise_shown(Sys.EventArgs.Empty);

        this._onShown.play();
    },

    /// <summary>
    /// Changes tab indices so that tabbing moves focus only through the modal dialog box
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ModalPopupExtender.disableTab" />
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

    /// <summary>
    /// Restores tab indices from the page
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ModalPopupExtender.restoreTab" />
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

    /// <summary>
    /// Hides an element that is referenced by the PopupControlID property
    /// </summary>
    /// <returns type="Boolean">Whether the popup was hidden</returns>
    /// <member name="cM:AjaxControlToolkit.ModalPopupExtender.hide" />
    hide: function() {
        // Hide the modal dialog
        if(!this._isAnimationJustEnded) {
            var eventArgs = new Sys.CancelEventArgs();
            this.raise_hiding(eventArgs);

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
        this.raise_hidden(Sys.EventArgs.Empty);
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
        var target = $get(this.get_popupControlID());

        this._replaceAnimationTarget('_onShowing', target);
        this._replaceAnimationTarget('_onShown', target);
        this._replaceAnimationTarget('_onHiding', target);
        this._replaceAnimationTarget('_onHidden', target);
    },

    /// <summary>
    /// ID of an element to display as a modal popup
    /// </summary>
    /// <getter>get_popupControlID</getter>
    /// <setter>set_popupControlID</setter>
    /// <member name="cP:AjaxControlToolkit.ModalPopupExtender.popupControlID" />
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
    /// The distance from the left side of the modal popup to the left border of the browser window in pixels
    /// </summary>
    /// <getter>get_x</getter>
    /// <setter>set_x</setter>
    /// <member name="cP:AjaxControlToolkit.ModalPopupExtender.x" />
    get_x: function() {
        return this._xCoordinate;
    },
    set_x: function(value) {
        if(this._xCoordinate != value) {
            this._xCoordinate = value;
            this.raisePropertyChanged('x');
        }
    },

    get_X: function() {
        Sys.Extended.Deprecated("get_X()", "get_x()");
        return this.get_x();
    },
    set_X: function(value) {
        Sys.Extended.Deprecated("set_X(value)", "set_x(value)");
        this.set_x(value);
    },

    /// <summary>
    /// The distance from the top side of the modal popup to the top border of the browser window in pixels
    /// </summary>
    /// <getter>get_y</getter>
    /// <setter>set_y</setter>
    /// <member name="cP:AjaxControlToolkit.ModalPopupExtender.y" />
    get_y: function() {
        return this._yCoordinate;
    },
    set_y: function(value) {
        if(this._yCoordinate != value) {
            this._yCoordinate = value;
            this.raisePropertyChanged('y');
        }
    },

    get_Y: function() {
        Sys.Extended.Deprecated("get_Y()", "get_y()");
        return this.get_y();
    },
    set_Y: function(value) {
        Sys.Extended.Deprecated("set_Y(value)", "set_y(value)");
        this.set_y(value);
    },

    /// <summary>
    /// ID of an element to display as a drag handle for the modal popup
    /// </summary>
    /// <getter>get_popupDragHandleControlID</getter>
    /// <setter>set_popupDragHandleControlID</setter>
    /// <member name="cP:AjaxControlToolkit.ModalPopupExtender.popupDragHandleControlID" />
    get_popupDragHandleControlID: function() {
        return this._popupDragHandleControlID;
    },
    set_popupDragHandleControlID: function(value) {
        if(this._popupDragHandleControlID != value) {
            this._popupDragHandleControlID = value;
            this.raisePropertyChanged('popupDragHandleControlID');
        }
    },

    get_PopupDragHandleControlID: function() {
        Sys.Extended.Deprecated("get_PopupDragHandleControlID()", "get_popupDragHandleControlID()");
        return this.get_popupDragHandleControlID();
    },
    set_PopupDragHandleControlID: function(value) {
        Sys.Extended.Deprecated("set_PopupDragHandleControlID(value)", "set_popupDragHandleControlID(value)");
        this.set_popupDragHandleControlID(value);
    },

    /// <summary>
    /// A CSS class to apply to the background when the modal popup is displayed
    /// </summary>
    /// <getter>get_backgroundCssClass</getter>
    /// <setter>set_backgroundCssClass</setter>
    /// <member name="cP:AjaxControlToolkit.ModalPopupExtender.backgroundCssClass" />
    get_backgroundCssClass: function() {
        return this._backgroundCssClass;
    },
    set_backgroundCssClass: function(value) {
        if(this._backgroundCssClass != value) {
            this._backgroundCssClass = value;
            this.raisePropertyChanged('backgroundCssClass');
        }
    },

    get_BackgroundCssClass: function() {
        Sys.Extended.Deprecated("get_BackgroundCssClass()", "get_backgroundCssClass()");
        return this.get_backgroundCssClass();
    },
    set_BackgroundCssClass: function(value) {
        Sys.Extended.Deprecated("set_BackgroundCssClass(value)", "set_backgroundCssClass(value)");
        this.set_backgroundCssClass(value);
    },

    /// <summary>
    /// A Boolean value that specifies whether or not a drop shadow should be added to the modal popup
    /// </summary>
    /// <getter>get_dropShadow</getter>
    /// <setter>set_dropShadow</setter>
    /// <member name="cP:AjaxControlToolkit.ModalPopupExtender.dropShadow" />
    get_dropShadow: function() {
        return this._dropShadow;
    },
    set_dropShadow: function(value) {
        if(this._dropShadow != value) {
            this._dropShadow = value;
            this.raisePropertyChanged('dropShadow');
        }
    },

    get_DropShadow: function() {
        Sys.Extended.Deprecated("get_DropShadow()", "get_dropShadow()");
        return this.get_dropShadow();
    },
    set_DropShadow: function(value) {
        Sys.Extended.Deprecated("set_DropShadow(value)", "set_dropShadow(value)");
        this.set_dropShadow(value);
    },

    /// <summary>
    /// A Boolean value that specifies whether or not the modal popup can be dragged
    /// </summary>
    /// <remarks>
    /// This property is obsolete.
    /// </remarks>
    /// <getter>get_drag</getter>
    /// <setter>set_drag</setter>
    /// <member name="cP:AjaxControlToolkit.ModalPopupExtender.drag" />
    get_drag: function() {
        // Obsolete: Setting the _drag property is a noop
        return this._drag;
    },
    set_drag: function(value) {
        if(this._drag != value) {
            this._drag = value;
            this.raisePropertyChanged('drag');
        }
    },

    get_Drag: function() {
        Sys.Extended.Deprecated("get_Drag()", "get_drag()");
        return this.get_drag();
    },
    set_Drag: function(value) {
        Sys.Extended.Deprecated("set_Drag(value)", "set_drag(value)");
        this.set_drag(value);
    },

    /// <summary>
    /// ID of an element that dismisses the modal popup
    /// </summary>
    /// <getter>get_okControlID</getter>
    /// <setter>set_okControlID</setter>
    /// <member name="cP:AjaxControlToolkit.ModalPopupExtender.okControlID" />
    get_okControlID: function() {
        return this._okControlID;
    },
    set_okControlID: function(value) {
        if(this._okControlID != value) {
            this._okControlID = value;
            this.raisePropertyChanged('okControlID');
        }
    },

    get_OkControlID: function() {
        Sys.Extended.Deprecated("get_OkControlID()", "get_okControlID()");
        return this.get_okControlID();
    },
    set_OkControlID: function(value) {
        Sys.Extended.Deprecated("set_OkControlID(value)", "set_okControlID(value)");
        this.set_okControlID(value);
    },

    /// <summary>
    /// ID of an element that cancels the modal popup
    /// </summary>
    /// <getter>get_cancelControlID</getter>
    /// <setter>set_cancelControlID</setter>
    /// <member name="cP:AjaxControlToolkit.ModalPopupExtender.cancelControlID" />
    get_cancelControlID: function() {
        return this._cancelControlID;
    },
    set_cancelControlID: function(value) {
        if(this._cancelControlID != value) {
            this._cancelControlID = value;
            this.raisePropertyChanged('cancelControlID');
        }
    },

    get_CancelControlID: function() {
        Sys.Extended.Deprecated("get_CancelControlID()", "get_cancelControlID()");
        return this.get_cancelControlID();
    },
    set_CancelControlID: function(value) {
        Sys.Extended.Deprecated("set_CancelControlID(value)", "set_cancelControlID(value)");
        this.set_cancelControlID(value);
    },

    /// <summary>
    /// A script to run when the modal popup is dismissed by the element specified using the okControlID property
    /// </summary>
    /// <getter>get_onOkScript</getter>
    /// <setter>set_onOkScript</setter>
    /// <member name="cP:AjaxControlToolkit.ModalPopupExtender.onOkScript" />
    get_onOkScript: function() {
        return this._onOkScript;
    },
    set_onOkScript: function(value) {
        if(this._onOkScript != value) {
            this._onOkScript = value;
            this.raisePropertyChanged('onOkScript');
        }
    },

    get_OnOkScript: function() {
        Sys.Extended.Deprecated("get_OnOkScript()", "get_onOkScript()");
        return this.get_onOkScript();
    },
    set_OnOkScript: function(value) {
        Sys.Extended.Deprecated("set_OnOkScript(value)", "set_onOkScript(value)");
        this.set_onOkScript(value);
    },

    /// <summary>
    /// A script to run when the modal popup is dismissed by the element specified using the cancelControlID property
    /// </summary>
    /// <getter>get_onCancelScript</getter>
    /// <setter>set_onCancelScript</setter>
    /// <member name="cP:AjaxControlToolkit.ModalPopupExtender.onCancelScript" />
    get_onCancelScript: function() {
        return this._onCancelScript;
    },
    set_onCancelScript: function(value) {
        if(this._onCancelScript != value) {
            this._onCancelScript = value;
            this.raisePropertyChanged('onCancelScript');
        }
    },

    get_OnCancelScript: function() {
        Sys.Extended.Deprecated("get_OnCancelScript()", "get_onCancelScript()");
        return this.get_onCancelScript();
    },
    set_OnCancelScript: function(value) {
        Sys.Extended.Deprecated("set_OnCancelScript(value)", "set_onCancelScript(value)");
        this.set_onCancelScript(value);
    },

    /// <summary>
    /// The Sys.Extended.UI.ModalPopupRepositionMode object that determines whether the modal
    /// popup should be repositioned on window resize or scroll
    /// </summary>
    /// <getter>get_repositionMode</getter>
    /// <setter>set_repositionMode</setter>
    /// <member name="cP:AjaxControlToolkit.ModalPopupExtender.repositionMode" />
    get_repositionMode: function() {
        return this._repositionMode;
    },
    set_repositionMode: function(value) {
        if(this._repositionMode !== value) {
            this._repositionMode = value;
            this.raisePropertyChanged('repositionMode');
        }
    },

    /// <summary>
    /// A JSON definition of generic OnShowing Animation. Played before the Popup is being shown 
    /// </summary>
    /// <getter>get_onShowing</getter>
    /// <setter>set_onShowing</setter>
    /// <member name="cP:AjaxControlToolkit.ModalPopupExtender.onShowing" />
    get_onShowing: function() {
        return this._onShowing.get_json();
    },
    set_onShowing: function(value) {
        this._onShowing.set_json(value);
        this.raisePropertyChanged('onShowing');
    },

    get_OnShowing: function() {
        Sys.Extended.Deprecated("get_OnShowing()", "get_onShowing()");
        return this.get_onShowing();
    },
    set_OnShowing: function(value) {
        Sys.Extended.Deprecated("set_OnShowing(value)", "set_onShowing(value)");
        this.set_onShowing(value);
    },

    /// <summary>
    /// A JSON definition of generic OnShowing Animation. Played before the Popup is shown
    /// </summary>
    /// <getter>get_onShown</getter>
    /// <setter>set_onShown</setter>
    /// <member name="cP:AjaxControlToolkit.ModalPopupExtender.onShown" />
    get_onShown: function() {
        return this._onShown.get_json();
    },
    set_onShown: function(value) {
        this._onShown.set_json(value);
        this.raisePropertyChanged('onShown');
    },

    get_OnShown: function() {
        Sys.Extended.Deprecated("get_OnShown()", "get_onShown()");
        return this.get_onShown();
    },
    set_OnShown: function(value) {
        Sys.Extended.Deprecated("set_OnShown(value)", "set_onShown(value)");
        this.set_onShown(value);
    },

    /// <summary>
    /// A JSON definition of generic OnShowing Animation. Played before the Popup is being hidden
    /// </summary>
    /// <getter>get_onHiding</getter>
    /// <setter>set_onHiding</setter>
    /// <member name="cP:AjaxControlToolkit.ModalPopupExtender.onHiding" />
    get_onHiding: function() {
        return this._onHiding.get_json();
    },
    set_onHiding: function(value) {
        this._onHiding.set_json(value);
        this.raisePropertyChanged('onHiding');
    },

    get_OnHiding: function() {
        Sys.Extended.Deprecated("get_OnHiding()", "get_onHiding()");
        return this.get_onHiding();
    },
    set_OnHiding: function(value) {
        Sys.Extended.Deprecated("set_OnHiding(value)", "set_onHiding(value)");
        this.set_onHiding(value);
    },

    /// <summary>
    /// A JSON definition of generic OnShowing Animation. Played before the Popup is hidden
    /// </summary>
    /// <getter>get_onHidden</getter>
    /// <setter>set_onHidden</setter>
    /// <member name="cP:AjaxControlToolkit.ModalPopupExtender.onHidden" />
    get_onHidden: function() {
        return this._onHidden.get_json();
    },
    set_onHidden: function(value) {
        this._onHidden.set_json(value);
        this.raisePropertyChanged('onHidden');
    },

    get_OnHidden: function() {
        Sys.Extended.Deprecated("get_OnHidden()", "get_onHidden()");
        return this.get_onHidden();
    },
    set_OnHidden: function(value) {
        Sys.Extended.Deprecated("set_OnHidden(value)", "set_onHidden(value)");
        this.set_onHidden(value);
    },

    /// <summary>
    /// Fires when the popup is being shown
    /// </summary>
    /// <event add="add_showing" remove="remove_showing" raise="raise_showing" />
    /// <member name="cE:AjaxControlToolkit.ModalPopupExtender.showing" />
    add_showing: function(handler) {
        // Add an event handler for the showing event
        this.get_events().addHandler('showing', handler);
    },
    remove_showing: function(handler) {
        // Remove an event handler from the showing event
        this.get_events().removeHandler('showing', handler);
    },
    raise_showing: function(eventArgs) {
        var handler = this.get_events().getHandler('showing');

        if(handler)
            handler(this, eventArgs);
    },
    raiseShowing: function(eventArgs) {
        Sys.Extended.Deprecated("raiseShowing(eventArgs)", "raise_showing(eventArgs)");
        this.raise_showing(eventArgs);
    },

    /// <summary>
    /// Fires when the popup is shown
    /// </summary>
    /// <event add="add_shown" remove="remove_shown" raise="raise_shown" />
    /// <member name="cE:AjaxControlToolkit.ModalPopupExtender.shown" />
    add_shown: function(handler) {
        this.get_events().addHandler('shown', handler);
    },
    remove_shown: function(handler) {
        this.get_events().removeHandler('shown', handler);
    },
    raise_shown: function(eventArgs) {
        var handler = this.get_events().getHandler('shown');

        if(handler)
            handler(this, eventArgs);
    },
    raiseShown: function(eventArgs) {
        Sys.Extended.Deprecated("raiseShown(eventArgs)", "raise_shown(eventArgs)");
        this.raise_shown(eventArgs);
    },

    /// <summary>
    /// Fires when the popup is being hidden
    /// </summary>
    /// <event add="add_hiding" remove="remove_hiding" raise="raise_hiding" />
    /// <member name="cE:AjaxControlToolkit.ModalPopupExtender.hiding" />
    add_hiding: function(handler) {
        this.get_events().addHandler('hiding', handler);
    },
    remove_hiding: function(handler) {
        this.get_events().removeHandler('hiding', handler);
    },
    raise_hiding: function(eventArgs) {
        var handler = this.get_events().getHandler('hiding');

        if(handler)
            handler(this, eventArgs);
    },
    raiseHiding: function(eventArgs) {
        Sys.Extended.Deprecated("raiseHiding(eventArgs)", "raise_hiding(eventArgs)");
        this.raise_hiding(eventArgs);
    },

    /// <summary>
    /// Fires when the popup is hidden
    /// </summary>
    /// <event add="add_hidden" remove="remove_hidden" raise="raise_hidden" />
    /// <member name="cE:AjaxControlToolkit.ModalPopupExtender.hidden" />
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
        Sys.Extended.Deprecated("raiseHidden(eventArgs)", "raise_hidden(eventArgs)");
        this.raise_hidden(eventArgs);
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
