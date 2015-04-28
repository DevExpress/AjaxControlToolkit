Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.PopupBehavior = function(element) {
    // The PopupBehavior is used to show/hide an element at a position
    // relative to another element
    // "element" - the DOM element the behavior is associated with
    Sys.Extended.UI.PopupBehavior.initializeBase(this, [element]);

    this._x = 0;
    this._y = 0;
    this._positioningMode = Sys.Extended.UI.PositioningMode.Absolute;
    this._parentElement = null;
    this._parentElementID = null;
    this._moveHandler = null;
    this._firstPopup = true;
    this._originalParent = null;
    this._visible = false;
    this._unselectable = null;

    // Generic animation behaviors that automatically build animations
    // from JSON descriptions
    this._onShow = null;
    this._onHide = null;

    this._onShowEndedHandler = Function.createDelegate(this, this._onShowEnded);
    this._onHideEndedHandler = Function.createDelegate(this, this._onHideEnded);
}

Sys.Extended.UI.PopupBehavior.prototype = {

    initialize: function() {
        Sys.Extended.UI.PopupBehavior.callBaseMethod(this, 'initialize');

        this._hidePopup();
        this.get_element().style.position = "absolute";
    },

    dispose: function() {
        var element = this.get_element();

        if(element) {
            if(this._visible)
                this.hide();

            if(this._originalParent) {
                element.parentNode.removeChild(element);
                this._originalParent.appendChild(element);
                this._originalParent = null;
            }

            // Remove expando properties
            element._hideWindowedElementsIFrame = null;
        }
        this._parentElement = null;

        // Remove the animation ended events and wipe the animations
        // (we don't need to dispose them because that will happen
        // automatically in our base dispose)
        if(this._onShow && this._onShow.get_animation())
            this._onShow.get_animation().remove_ended(this._onShowEndedHandler);

        this._onShow = null;
        if(this._onHide && this._onHide.get_animation())
            this._onHide.get_animation().remove_ended(this._onHideEndedHandler);

        this._onHide = null;

        Sys.Extended.UI.PopupBehavior.callBaseMethod(this, 'dispose');
    },

    show: function() {
        // Ignore requests to hide multiple times
        if(this._visible)
            return;

        var eventArgs = new Sys.CancelEventArgs();
        this.raiseShowing(eventArgs);

        if(eventArgs.get_cancel())
            return;

        // Either show the popup or play an animation that does
        // (note: even if we're animating, we still show and position
        // the popup before hiding it again and playing the animation
        // which makes the animation much simpler)
        this._visible = true;
        var element = this.get_element();
        $common.setVisible(element, true);
        this.setupPopup();

        if(this._onShow) {
            $common.setVisible(element, false);
            this.onShow();
        } else {
            this.raiseShown(Sys.EventArgs.Empty);
        }
    },

    hide: function() {
        // Ignore requests to hide multiple times
        if(!this._visible)
            return;

        var eventArgs = new Sys.CancelEventArgs();
        this.raiseHiding(eventArgs);
        if(eventArgs.get_cancel())
            return;

        // Either hide the popup or play an animation that does
        this._visible = false;
        if(this._onHide) {
            this.onHide();
        } else {
            this._hidePopup();
            this._hideCleanup();
        }
    },

    getBounds: function() {
        // Get the expected bounds of the popup relative to its parent
        // returns bounds of the popup relative to its parent

        // The actual final position can only be calculated after it is
        // initially set and we can verify it doesn't bleed off the edge
        // of the screen.
        var element = this.get_element();

        // offsetParent (doc element if absolutely positioned or no offsetparent available)
        var offsetParent = element.offsetParent || document.documentElement;

        // diff = difference in position between element's offsetParent and the element we will attach popup to.
        // this is basically so we can position the popup in the right spot even though it may not be absolutely positioned
        var diff;
        var parentBounds;

        if(this.get_parentElement()) {
            // we will be positioning the element against the assigned parent
            parentBounds = $common.getBounds(this.get_parentElement());
            var offsetParentLocation = $common.getLocation(offsetParent);
            diff = { x: parentBounds.x - offsetParentLocation.x, y: parentBounds.y - offsetParentLocation.y };
        } else {
            // we will be positioning the element against the offset parent by default, since no parent element given
            parentBounds = $common.getBounds(offsetParent);
            diff = { x: 0, y: 0 };
        }

        // width/height of the element, needed for calculations that involve width like centering
        var width = element.offsetWidth - (element.clientLeft ? element.clientLeft * 2 : 0),
            height = element.offsetHeight - (element.clientTop ? element.clientTop * 2 : 0);

        // Setting the width causes the element to grow by border+passing every
        // time.  But not setting it causes strange behavior in safari. Just set it once.
        if(this._firstpopup) {
            element.style.width = width + "px";
            this._firstpopup = false;
        }

        var position, pos;
        switch(this._positioningMode) {
            case Sys.Extended.UI.PositioningMode.Center:
                pos = {
                    x: Math.round(parentBounds.width / 2 - width / 2),
                    y: Math.round(parentBounds.height / 2 - height / 2),
                    altX: Math.round(parentBounds.width / 2 - width / 2),
                    altY: Math.round(parentBounds.height / 2 - height / 2)
                };
                break;
            case Sys.Extended.UI.PositioningMode.BottomLeft:
                pos = {
                    x: 0,
                    y: parentBounds.height,
                    altX: parentBounds.width - width,
                    altY: 0 - height
                }
                break;
            case Sys.Extended.UI.PositioningMode.BottomRight:
                pos = {
                    x: parentBounds.width - width,
                    y: parentBounds.height,
                    altX: 0,
                    altY: 0 - height
                }
                break;
            case Sys.Extended.UI.PositioningMode.TopLeft:
                pos = {
                    x: 0,
                    y: -element.offsetHeight,
                    altX: parentBounds.width - width,
                    altY: parentBounds.height
                }
                break;
            case Sys.Extended.UI.PositioningMode.TopRight:
                pos = {
                    x: parentBounds.width - width,
                    y: -element.offsetHeight,
                    altX: 0,
                    altY: parentBounds.height
                }
                break;
            case Sys.Extended.UI.PositioningMode.Right:
                pos = {
                    x: parentBounds.width,
                    y: 0,
                    altX: -element.offsetWidth,
                    altY: parentBounds.height - height
                }
                break;
            case Sys.Extended.UI.PositioningMode.Left:
                pos = {
                    x: -element.offsetWidth,
                    y: 0,
                    altX: parentBounds.width,
                    altY: parentBounds.height - height
                }
                break;
            default:
                pos = { x: 0, y: 0, altX: 0, altY: 0 };
        }

        pos.x += this._x + diff.x;
        pos.altX += this._x + diff.x;
        pos.y += this._y + diff.y;
        pos.altY += this._y + diff.y;

        position = this._verifyPosition(pos, width, height, parentBounds);

        return new Sys.UI.Bounds(position.x, position.y, width, height);
    },

    _verifyPosition: function(pos, elementWidth, elementHeight, parentBounds) {
        //Checks whether the popup is entirely visible and attempts to change its position to make it entirely visible.
        var newX = 0, newY = 0;
        var windowBounds = this._getWindowBounds();

        // Check horizontal positioning
        if(!((pos.x + elementWidth > windowBounds.x + windowBounds.width) || (pos.x < windowBounds.x))) {
            newX = pos.x;
        } else {
            newX = pos.altX;

            if(pos.altX < windowBounds.x) {
                if(pos.x > pos.altX)
                    newX = pos.x;
            } else if(windowBounds.width + windowBounds.x - pos.altX < elementWidth) {
                var xDiff = pos.x > pos.altX ? Math.abs(windowBounds.x - pos.x) : (windowBounds.x - pos.x);
                if(xDiff < elementWidth - windowBounds.width - windowBounds.x + pos.altX)
                    newX = pos.x;
            }
        }

        // Check vertical positioning
        if(!((pos.y + elementHeight > windowBounds.y + windowBounds.height) || (pos.y < windowBounds.y))) {
            newY = pos.y;
        } else {
            newY = pos.altY;

            if(pos.altY < windowBounds.y) {
                if(windowBounds.y - pos.altY > elementHeight - windowBounds.height - windowBounds.y + pos.y)
                    newY = pos.y;
            } else if(windowBounds.height + windowBounds.y - pos.altY < elementHeight) {
                if(windowBounds.y - pos.y < elementHeight - windowBounds.height - windowBounds.y + pos.altY)
                    newY = pos.y;
            }
        }

        return { x: newX, y: newY };
    },

    _getWindowBounds: function() {
        var bounds = {
            x: this._getWindowScrollLeft(),
            y: this._getWindowScrollTop(),
            width: this._getWindowWidth(),
            height: this._getWindowHeight()
        };

        return bounds;
    },

    _getWindowHeight: function() {
        var windowHeight = 0;

        if(document.documentElement && document.documentElement.clientHeight)
            windowHeight = document.documentElement.clientHeight;
        else if(document.body && document.body.clientHeight)
            windowHeight = document.body.clientHeight;

        return windowHeight;
    },

    _getWindowWidth: function() {
        var windowWidth = 0;

        if(document.documentElement && document.documentElement.clientWidth)
            windowWidth = document.documentElement.clientWidth;
        else if(document.body && document.body.clientWidth)
            windowWidth = document.body.clientWidth;

        return windowWidth;
    },

    _getWindowScrollTop: function() {
        var scrollTop = 0;

        if(typeof (window.pageYOffset) == 'number')
            scrollTop = window.pageYOffset;
        if(document.body && document.body.scrollTop)
            scrollTop = document.body.scrollTop;
        else if(document.documentElement && document.documentElement.scrollTop)
            scrollTop = document.documentElement.scrollTop;

        return scrollTop;
    },

    _getWindowScrollLeft: function() {
        var scrollLeft = 0;

        if(typeof (window.pageXOffset) == 'number')
            scrollLeft = window.pageXOffset;
        else if(document.body && document.body.scrollLeft)
            scrollLeft = document.body.scrollLeft;
        else if(document.documentElement && document.documentElement.scrollLeft)
            scrollLeft = document.documentElement.scrollLeft;

        return scrollLeft;
    },

    adjustPopupPosition: function(bounds) {
        // Adjust the position of the popup after it's originally bet set
        // to make sure that it's visible on the page.
        // "bounds" - original bounds of the parent element
        var element = this.get_element();
        if(!bounds)
            bounds = this.getBounds();

        // Get the new bounds now that we've shown the popup
        var newPosition = $common.getBounds(element),
            updateNeeded = false;

        if(newPosition.x < 0) {
            bounds.x -= newPosition.x;
            updateNeeded = true;
        }
        if(newPosition.y < 0) {
            bounds.y -= newPosition.y;
            updateNeeded = true;
        }

        // If the popup was off the screen, reposition it
        if(updateNeeded)
            $common.setLocation(element, bounds);
    },

    addBackgroundIFrame: function() {
        // Add an empty IFRAME behind the popup (for IE6 only) so that SELECT, etc., won't
        // show through the popup.

        // Get the child frame
        var element = this.get_element();
        if((Sys.Browser.agent === Sys.Browser.InternetExplorer) && (Sys.Browser.version < 7)) {
            var childFrame = element._hideWindowedElementsIFrame;

            // Create the child frame if it wasn't found
            if(!childFrame) {
                childFrame = document.createElement("iframe");
                childFrame.src = "javascript:'<html></html>';";
                childFrame.style.position = "absolute";
                childFrame.style.display = "none";
                childFrame.scrolling = "no";
                childFrame.frameBorder = "0";
                childFrame.tabIndex = "-1";
                childFrame.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)";
                element.parentNode.insertBefore(childFrame, element);
                element._hideWindowedElementsIFrame = childFrame;
                this._moveHandler = Function.createDelegate(this, this._onMove);
                Sys.UI.DomEvent.addHandler(element, "move", this._moveHandler);
            }

            // Position the frame exactly behind the element
            $common.setBounds(childFrame, $common.getBounds(element));

            childFrame.style.left = element.style.left;
            childFrame.style.top = element.style.top;
            childFrame.style.display = element.style.display;

            if(element.currentStyle && element.currentStyle.zIndex)
                childFrame.style.zIndex = element.currentStyle.zIndex;
            else if(element.style.zIndex)
                childFrame.style.zIndex = element.style.zIndex;
        }
    },

    setupPopup: function() {
        // Position the popup relative to its parent
        var element = this.get_element();
        var bounds = this.getBounds();
        $common.setLocation(element, bounds);

        // Tweak the position, set the zIndex, and add the background iframe in IE6
        this.adjustPopupPosition(bounds);
        element.style.zIndex = 1000;
        this.addBackgroundIFrame();
    },

    _hidePopup: function() {
        var element = this.get_element();
        $common.setVisible(element, false);
        
        if(element.originalWidth) {
            element.style.width = element.originalWidth + "px";
            element.originalWidth = null;
        }
    },

    _hideCleanup: function() {
        // Perform cleanup after hiding the element
        var element = this.get_element();

        // Remove the tracking handler
        if(this._moveHandler) {
            Sys.UI.DomEvent.removeHandler(element, "move", this._moveHandler);
            this._moveHandler = null;
        }

        // Hide the child frame
        if(Sys.Browser.agent === Sys.Browser.InternetExplorer) {
            var childFrame = element._hideWindowedElementsIFrame;
            if(childFrame)
                childFrame.style.display = "none";
        }

        this.raiseHidden(Sys.EventArgs.Empty);
    },

    _onMove: function() {
        // Track the popup's movements so the hidden IFrame (IE6 only) can
        // be moved along with it

        var element = this.get_element();
        if(element._hideWindowedElementsIFrame) {
            element.parentNode.insertBefore(element._hideWindowedElementsIFrame, element);
            element._hideWindowedElementsIFrame.style.top = element.style.top;
            element._hideWindowedElementsIFrame.style.left = element.style.left;
        }
    },

    get_onShow: function() {
        // Generic OnShow Animation's JSON definition
        return this._onShow ? this._onShow.get_json() : null;
    },

    set_onShow: function(value) {
        if(!this._onShow) {
            this._onShow = new Sys.Extended.UI.Animation.GenericAnimationBehavior(this.get_element());
            this._onShow.initialize();
        }

        this._onShow.set_json(value);
        var animation = this._onShow.get_animation();

        if(animation)
            animation.add_ended(this._onShowEndedHandler);

        this.raisePropertyChanged('onShow');
    },

    get_onShowBehavior: function() {
        // Generic OnShow Animation's behavior
        return this._onShow;
    },

    onShow: function() {
        if(this._onShow) {
            if(this._onHide)
                this._onHide.quit();

            this._onShow.play();
        }
    },

    _onShowEnded: function() {
        // Make sure the popup is where it belongs
        this.adjustPopupPosition();
        this.addBackgroundIFrame();

        this.raiseShown(Sys.EventArgs.Empty);
    },

    get_onHide: function() {
        // Generic OnHide Animation's JSON definition
        return this._onHide ? this._onHide.get_json() : null;
    },

    set_onHide: function(value) {
        if(!this._onHide) {
            this._onHide = new Sys.Extended.UI.Animation.GenericAnimationBehavior(this.get_element());
            this._onHide.initialize();
        }

        this._onHide.set_json(value);
        var animation = this._onHide.get_animation();

        if(animation)
            animation.add_ended(this._onHideEndedHandler);

        this.raisePropertyChanged('onHide');
    },

    get_onHideBehavior: function() {
        // Generic OnHide Animation's behavior
        return this._onHide;
    },

    onHide: function() {
        if(this._onHide) {
            if(this._onShow)
                this._onShow.quit();

            this._onHide.play();
        }
    },

    _onHideEnded: function() {
        this._hideCleanup();
    },

    get_parentElement: function() {
        if(!this._parentElement && this._parentElementID)
            this.set_parentElement($get(this._parentElementID));

        return this._parentElement;
    },

    set_parentElement: function(element) {
        this._parentElement = element;
        this.raisePropertyChanged('parentElement');
    },

    get_parentElementID: function() {
        if(this._parentElement)
            return this._parentElement.id

        return this._parentElementID;
    },

    set_parentElementID: function(elementID) {
        this._parentElementID = elementID;

        if(this.get_isInitialized())
            this.set_parentElement($get(elementID));
    },

    get_positioningMode: function() {
        return this._positioningMode;
    },

    set_positioningMode: function(mode) {
        this._positioningMode = mode;
        this.raisePropertyChanged('positioningMode');
    },

    get_x: function() {
        return this._x;
    },

    set_x: function(value) {
        if(value != this._x) {
            this._x = value;

            // Reposition the popup if it's already showing
            if(this._visible)
                this.setupPopup();

            this.raisePropertyChanged('x');
        }
    },

    get_y: function() {
        return this._y;
    },

    set_y: function(value) {
        if(value != this._y) {
            this._y = value;

            // Reposition the popup if it's already showing
            if(this._visible)
                this.setupPopup();

            this.raisePropertyChanged('y');
        }
    },

    get_visible: function() {
        return this._visible;
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
    },

    get_unselectable: function()
    {
        return this._unselectable;
    },

    set_unselectable: function(value)
    {
        this._unselectable = value;
        // TODO: _this.setAttribute('unselectable', 'on');
        this.raisePropertyChanged('unselectable');
    }
}
Sys.Extended.UI.PopupBehavior.registerClass('Sys.Extended.UI.PopupBehavior', Sys.Extended.UI.BehaviorBase);

Sys.Extended.UI.PositioningMode = function() {
    throw Error.invalidOperation();
}

Sys.Extended.UI.PositioningMode.prototype = {
    Absolute: 0,
    Center: 1,
    BottomLeft: 2,
    BottomRight: 3,
    TopLeft: 4,
    TopRight: 5,
    Right: 6,
    Left: 7
}

Sys.Extended.UI.PositioningMode.registerEnum('Sys.Extended.UI.PositioningMode');