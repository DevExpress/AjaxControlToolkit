Type.registerNamespace("Sys.Extended.UI");

Sys.Extended.UI.BalloonPopupControlBehavior = function(element) {
    // The BalloonPopupControlBehavior opens a popup window next to the target element
    Sys.Extended.UI.BalloonPopupControlBehavior.initializeBase(this, [element]);

    // Properties
    this._balloonPopupControlID = null;
    this._position = Sys.Extended.UI.BalloonPopupPosition.Auto;
    this._balloonStyle = Sys.Extended.UI.BalloonPopupStyle.Rectangle;
    this._offsetX = 0;
    this._offsetY = 0;
    this._extenderControlID = null;
    this._displayOnMouseOver = false;
    this._displayOnFocus = false;
    this._displayOnClick = true;
    this._balloonSize = "small";
    this._shadow = true;
    this._scrollBars = Sys.Extended.UI.ScrollBars.Auto;

    // Variables
    this._popupElement = null;
    this._styleElement = null;
    this._sizeElement = null;
    this._shadowElement = null;
    this._directionElement = null;
    this._contentElement = null;
    this._popupBehavior = null;
    this._popupVisible = false;
    this._focusHandler = null;
    this._mouseOverHandler = null;
    this._clickHandler = null;
    this._popupClickHandler = null;
    this._bodyClickHandler = null;
    this._onShowJson = null;
    this._onHideJson = null;
    this._popupWidth = 0;
    this._popupHeight = 0;
    this._AutoPosition = null; // to hold correct position when Position mode is auto
    this._directionClassName = null; // temporary store class names for direction and shadow elements
}
Sys.Extended.UI.BalloonPopupControlBehavior.prototype = {
    initialize: function() {
        Sys.Extended.UI.BalloonPopupControlBehavior.callBaseMethod(this, "initialize");

        // Identify popup element from control id
        var e = this.get_element();

        this.createPopupElement();
        // Hook up a PopupBehavior
        this._popupBehavior = $create(Sys.Extended.UI.PopupBehavior, { "id": this.get_id() + "BalloonPopupBehavior", "parentElement": e }, null, null, this._popupElement);

        // Create the animations (if they were set before initialize was called)
        if(this._onShowJson) {
            this._popupBehavior.set_onShow(this._onShowJson);
        }
        if(this._onHideJson) {
            this._popupBehavior.set_onHide(this._onHideJson);
        }

        // Create delegates
        if(this._displayOnFocus) {
            this._focusHandler = Function.createDelegate(this, this._onFocus);
        }
        if(this._displayOnMouseOver) {
            this._mouseOverHandler = Function.createDelegate(this, this._onMouseOver);
        }
        if(this._displayOnClick) {
            this._clickHandler = Function.createDelegate(this, this._onFocus);
        }

        this._popupClickHandler = Function.createDelegate(this, this._onPopupClick);
        this._bodyClickHandler = Function.createDelegate(this, this._onBodyClick);

        // Attach events
        if(this._displayOnFocus) {
            $addHandler(e, "focus", this._focusHandler);
        }
        if(this._displayOnMouseOver) {
            $addHandler(e, "mouseover", this._mouseOverHandler);
        }
        if(this._displayOnClick) {
            $addHandler(e, "click", this._clickHandler);
        }
        $addHandler(document, "click", this._bodyClickHandler);
        $addHandler(this._popupElement, "click", this._popupClickHandler);
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
            $removeHandler(e, "focus", this._focusHandler);
            this._focusHandler = null;
        }
        if(this._mouseOverHandler) {
            $removeHandler(e, "mouseover", this._mouseOverHandler);
            this._mouseOverHandler = null;
        }
        if(this._clickHandler) {
            $removeHandler(e, "click", this._clickHandler);
            this._clickHandler = null;
        }

        if(this._bodyClickHandler) {
            $removeHandler(document, "click", this._bodyClickHandler);
            this._bodyClickHandler = null;
        }
        if(this._popupClickHandler) {
            $removeHandler(this._popupElement, "click", this._popupClickHandler);
            this._popupClickHandler = null;
        }

        Sys.Extended.UI.BalloonPopupControlBehavior.callBaseMethod(this, "dispose");
    },

    createPopupElement: function() {
        var e = this.get_element();

        // create main container for balloon popup                
        this._popupElement = $common.createElementFromTemplate({
            nodeName: "div",
            properties: {
                id: this.get_id() + "_balloonPopup",
                style: {
                    display: "block",
                    position: "absolute"
                }
            },
            cssClasses: ["ajax__balloon_popup"]
        }, e.parentNode);

        // create element for theme/style
        this._styleElement = $common.createElementFromTemplate({
            nodeName: "span",
            Properties: {
                id: "ajax__style_wrapper"
            }
        }, this._popupElement);

        // create element for balloonpopup size
        this._sizeElement = $common.createElementFromTemplate({
            nodeName: "span",
            Properties: {
                id: "ajax__size_wrapper"
            }
        }, this._styleElement);

        // create element for shadow
        this._shadowElement = $common.createElementFromTemplate({
            nodeName: "div",
            Properties: {
                id: "ajax__shadow_wrapper"
            }
        }, this._sizeElement);

        // create element for direction of arrow
        this._directionElement = $common.createElementFromTemplate({
            nodeName: "div",
            Properties: {
                id: "ajax__direction_wrapper"
            }
        }, this._shadowElement);

        // create element to hold contents
        this._contentElement = $common.createElementFromTemplate({
            nodeName: "div",
            Properties: {
                id: "ajax__content"
            },
            cssClasses: ["ajax__content"]
        }, this._directionElement);

        if($get(this._balloonPopupControlID) == null)
            throw "Referred BalloonPopupControlId did not find.";
        $get(this._balloonPopupControlID).style.display = 'none';

        // set theme/style as per user's setting
        this.setStyle();
        // set size of balloon popup
        this.setSize();
        // set class name to directionElement to set height and width of balloon popup
        this._directionElement.className = this._directionClassName;

        this._popupWidth = this._directionElement.offsetWidth;
        this._popupHeight = this._directionElement.offsetHeight;

        if(this.get_balloonPopupPosition() != Sys.Extended.UI.BalloonPopupPosition.Auto) {
            // set position of arrow and drop shadow
            this.setPosition();
            this.setContentPadding();
            this.setScrollBar();
        }
    },

    setStyle: function() {
        switch(this.get_balloonPopupStyle()) {
            case Sys.Extended.UI.BalloonPopupStyle.Rectangle:
                this._styleElement.className = "rect";
                this._directionClassName = "rect";
                break;
            case Sys.Extended.UI.BalloonPopupStyle.Cloud:
                this._styleElement.className = "cloud";
                this._directionClassName = "cloud";
                break;
            case Sys.Extended.UI.BalloonPopupStyle.Custom:
                this._styleElement.className = this.get_customClassName();
                this._directionClassName = this.get_customClassName();
                break;
            default:
                this._styleElement.className = "rect";
                this._directionClassName = "rect";
                break;
        }
    },

    setSize: function() {
        switch(this.get_balloonSize()) {
            case Sys.Extended.UI.BalloonPopupSize.Small:
                this._sizeElement.className += " small";
                this._directionClassName += " small";
                break;
            case Sys.Extended.UI.BalloonPopupSize.Medium:
                this._sizeElement.className += " medium";
                this._directionClassName += " medium";
                break;
            case Sys.Extended.UI.BalloonPopupSize.Large:
                this._sizeElement.className += " large";
                this._directionClassName += " large";
                break;
            default:
                this._sizeElement.className += " small";
                this._directionClassName += " small";
                break;
        }
    },

    setPosition: function() {
        var currentPosition = null;
        if(this.get_balloonPopupPosition() == Sys.Extended.UI.BalloonPopupPosition.Auto) {
            currentPosition = this._autoPosition;
        }
        else {
            currentPosition = this.get_balloonPopupPosition();
        }

        switch(currentPosition) {
            case Sys.Extended.UI.BalloonPopupPosition.TopLeft:
                this._directionElement.className = this._directionClassName + " top_left";
                this._shadowElement.className = this._directionClassName + " top_left_shadow";
                break;
            case Sys.Extended.UI.BalloonPopupPosition.TopRight:
                this._directionElement.className = this._directionClassName + " top_right";
                this._shadowElement.className = this._directionClassName + " top_right_shadow";
                break;
            case Sys.Extended.UI.BalloonPopupPosition.BottomLeft:
                this._directionElement.className = this._directionClassName + " bottom_left";
                this._shadowElement.className = this._directionClassName + " bottom_left_shadow";
                break;
            case Sys.Extended.UI.BalloonPopupPosition.BottomRight:
                this._directionElement.className = this._directionClassName + " bottom_right";
                this._shadowElement.className = this._directionClassName + " bottom_right_shadow";
                break;
            default:
                this._directionElement.className = this._directionClassName + " top_right";
                this._shadowElement.className = this._directionClassName + " top_right_shadow";
                break;
        }
    },

    setContentPadding: function() {
        var contentPadding = $common.getPaddingBox(this._contentElement);
        var content = $get(this._balloonPopupControlID);
        $common.setBounds(content,
        {
            x: this._offsetX + contentPadding.left,
            y: this._offsetY + contentPadding.top,
            width: this._popupWidth - contentPadding.left - contentPadding.right,
            height: this._popupHeight - contentPadding.top - contentPadding.bottom
        });
    },

    setScrollBar: function() {
        // Set overflow style for balloon popup contents 
        var content = $get(this._balloonPopupControlID);
        switch(this.get_scrollBars()) {
            case Sys.Extended.UI.ScrollBars.Horizontal:
                $common.setStyle(content, { overflowX: "scroll", overflowY: "hidden" });
                break;
            case Sys.Extended.UI.ScrollBars.Vertical:
                $common.setStyle(content, { overflowY: "scroll", overflowX: "hidden" });
                break;
            case Sys.Extended.UI.ScrollBars.Both:
                $common.setStyle(content, { overflow: "scroll" });
                break;
            case Sys.Extended.UI.ScrollBars.None:
                $common.setStyle(content, { overflow: "hidden" });
                break;
            default:
                $common.setStyle(content, { overflow: "auto" });
                break;
        }
    },

    showPopup: function() {
        this._contentElement.appendChild($get(this._balloonPopupControlID));
        $get(this._balloonPopupControlID).style.display = 'block';

        if(Sys.Extended.UI.BalloonPopupPosition.Auto == this._position) {
            this._setAutoPosition();
            this.setPosition();
            this.setContentPadding();
            this.setScrollBar();
        }

        // don't display shadow if user set useShadow property to false
        if(!this._shadow) {
            this._shadowElement.className = "";
        }

        var old = Sys.Extended.UI.BalloonPopupControlBehavior.__VisiblePopup;
        if(old && old._popupBehavior) {
            old.hidePopup();
        }

        Sys.Extended.UI.BalloonPopupControlBehavior.callBaseMethod(this, "populate");

        this._popupBehavior.set_x(this._getLeftOffset());
        this._popupBehavior.set_y(this._getTopOffset());
        this._popupBehavior.show();

        this._popupVisible = true;
        Sys.Extended.UI.BalloonPopupControlBehavior.__VisiblePopup = this;

        // fix main background position demanded by IE7
        var bgPosX = $common.getCurrentStyle(this._directionElement, "backgroundPositionX");
        var bgPosY = $common.getCurrentStyle(this._directionElement, "backgroundPositionY");
        $common.setStyle(this._styleElement, { backgroundPositionX: bgPosX, backgroundPositionY: bgPosY });
    },

    hidePopup: function() {
        this._popupBehavior.hide();
        this._popupVisible = false;
        Sys.Extended.UI.BalloonPopupControlBehavior.__VisiblePopup = null;
    },

    _onFocus: function(e) {
        // Show the balloon popup when its control is focused

        // Set the popup position and display it
        if(!this._popupVisible) {
            this.showPopup();
        }
        if(e) {
            e.stopPropagation();
        }
    },

    _onMouseOver: function(e) {
        // Show the balloon popup when its control is mouse over

        // Set the popup position and display it                
        if(!this._popupVisible) {
            this.showPopup();
        }
        if(e) {
            e.stopPropagation();
        }
    },

    _onPopupClick: function(e) {
        e.stopPropagation();
    },

    _onBodyClick: function() {
        // Hide the popup if something other than our target or popup
        // was clicked (since each of these stop the event from bubbling
        // up to the body)
        if(this._popupVisible) {
            this.hidePopup();
        }
    },

    _onPopulated: function(sender, eventArgs) {
        Sys.Extended.UI.BalloonPopupControlBehavior.callBaseMethod(this, "_onPopulated", [sender, eventArgs]);

        // Dynamic populate may have added content; re-layout to accomodate it
        if(this._popupVisible) {
            this._popupBehavior.show();
        }
    },

    _getLeftOffset: function() {
        // Get the left offset for the balloon popup
        var xoffSet = 0;
        var currentPosition = Sys.Extended.UI.BalloonPopupPosition.Auto == this._position ? this._autoPosition : this._position;
        if(Sys.Extended.UI.BalloonPopupPosition.BottomLeft == currentPosition || Sys.Extended.UI.BalloonPopupPosition.TopLeft == currentPosition) {
            xoffSet = (-1 * (this._popupWidth)) + this._offsetX;
        } else if(Sys.Extended.UI.BalloonPopupPosition.BottomRight == currentPosition || Sys.Extended.UI.BalloonPopupPosition.TopRight == currentPosition) {
            xoffSet = this.get_element().offsetWidth + this._offsetX;
        } else {
            xoffSet = this._offsetX;
        }
        return xoffSet;
    },

    _getTopOffset: function() {
        var yoffSet = 0;
        var currentPosition = Sys.Extended.UI.BalloonPopupPosition.Auto == this._position ? this._autoPosition : this._position;
        if(Sys.Extended.UI.BalloonPopupPosition.TopLeft == currentPosition || Sys.Extended.UI.BalloonPopupPosition.TopRight == currentPosition) {
            yoffSet = (-1 * (this._popupHeight)) + this._offsetY;
        } else if(Sys.Extended.UI.BalloonPopupPosition.BottomLeft == currentPosition || Sys.Extended.UI.BalloonPopupPosition.BottomRight == currentPosition) {
            yoffSet = (this.get_element().offsetHeight) + this._offsetY;
        } else {
            yoffSet = this._offsetY;
        }
        return yoffSet;
    },

    _setAutoPosition: function() {
        // get elements absolute left and top position
        var _elementTopPosition = 0;
        var _elementLeftPosition = 0;
        var e = this.get_element();
        if(e.offsetParent) {
            do {
                _elementLeftPosition += e.offsetLeft;
                _elementTopPosition += e.offsetTop;
            } while(e = e.offsetParent);
        }

        var _pageTopPosition = this.posTop();
        var _pageLeftPosition = this.posLeft();
        var _pagewidth = this.pageWidth();
        var _pageHeight = this.pageHeight();
        var _pageBottom = _pageTopPosition + _pageHeight;
        var _pageRight = _pageLeftPosition + _pagewidth;

        var _popTopPosition = _elementTopPosition - this._popupHeight;
        var _popLeftPosition = _elementLeftPosition - this._popupWidth;
        var _popBottomPosition = _elementTopPosition + this.get_element().offsetHeight + this._popupHeight;
        var _popRightPosition = _elementLeftPosition + this.get_element().offsetWidth + this._popupWidth;

        if((_popTopPosition - _pageTopPosition) > 0 && ((_popTopPosition - _pageTopPosition) > (_pageBottom - _popBottomPosition))) {
            if(_pageRight < _popRightPosition) {
                this._autoPosition = Sys.Extended.UI.BalloonPopupPosition.TopLeft;
            }
            else {
                this._autoPosition = Sys.Extended.UI.BalloonPopupPosition.TopRight;
            }
        }
        else {
            if(_pageRight < _popRightPosition) {
                this._autoPosition = Sys.Extended.UI.BalloonPopupPosition.BottomLeft;
            }
            else {
                this._autoPosition = Sys.Extended.UI.BalloonPopupPosition.BottomRight;
            }
        }
    },

    get_onShow: function() {
        // Generic OnShow Animation's JSON definition
        return this._popupBehavior ? this._popupBehavior.get_onShow() : this._onShowJson;
    },
    set_onShow: function(value) {
        if(this._popupBehavior) {
            this._popupBehavior.set_onShow(value)
        } else {
            this._onShowJson = value;
        }
        this.raisePropertyChanged("onShow");
    },
    get_onShowBehavior: function() {
        // Generic OnShow Animation's behavior
        return this._popupBehavior ? this._popupBehavior.get_onShowBehavior() : null;
    },
    onShow: function() {
        // Play the OnShow animation
        if(this._popupBehavior) {
            this._popupBehavior.onShow();
        }
    },

    get_onHide: function() {
        // Generic OnHide Animation's JSON definition
        return this._popupBehavior ? this._popupBehavior.get_onHide() : this._onHideJson;
    },
    set_onHide: function(value) {
        if(this._popupBehavior) {
            this._popupBehavior.set_onHide(value)
        } else {
            this._onHideJson = value;
        }
        this.raisePropertyChanged("onHide");
    },
    get_onHideBehavior: function() {
        // Generic OnHide Animation's behavior
        return this._popupBehavior ? this._popupBehavior.get_onHideBehavior() : null;
    },
    onHide: function() {
        // Play the OnHide animation
        if(this._popupBehavior) {
            this._popupBehavior.onHide();
        }
    },

    get_BalloonPopupControlID: function() {
        return this._balloonPopupControlID;
    },
    set_BalloonPopupControlID: function(value) {
        if(this._balloonPopupControlID != value) {
            this._balloonPopupControlID = value;
            this.raisePropertyChanged("BalloonPopupControlID");
        }
    },

    get_balloonPopupPosition: function() {
        // Where the balloon popup should be positioned relative to the target control. (Left, Right, Top, Bottom)
        return this._position;
    },
    set_balloonPopupPosition: function(value) {
        if(this._position != value) {
            this._position = value;
            this.raisePropertyChanged("Position");
        }
    },

    get_balloonPopupStyle: function() {
        return this._balloonStyle;
    },

    set_balloonPopupStyle: function(value) {
        if(this._balloonStyle != value) {
            this._balloonStyle = value;
            this.raisePropertyChanged("BalloonStyle");
        }
    },

    get_ExtenderControlID: function() {
        return this._extenderControlID;
    },
    set_ExtenderControlID: function(value) {
        if(this._extenderControlID != value) {
            this._extenderControlID = value;
            this.raisePropertyChanged("ExtenderControlID");
        }
    },

    get_OffsetX: function() {
        return this._offsetX;
    },
    set_OffsetX: function(value) {
        if(this._offsetX != value) {
            this._offsetX = value;
            this.raisePropertyChanged("OffsetX");
        }
    },

    get_OffsetY: function() {
        return this._offsetY;
    },
    set_OffsetY: function(value) {
        if(this._offsetY != value) {
            this._offsetY = value;
            this.raisePropertyChanged("OffsetY");
        }
    },

    get_displayOnMouseOver: function() {
        return this._displayOnMouseOver;
    },

    set_displayOnMouseOver: function(value) {
        if(this._displayOnMouseOver != value) {
            this._displayOnMouseOver = value;
            this.raisePropertyChanged("DisplayOnMouseOver");
        }
    },

    get_displayOnFocus: function() {
        return this._displayOnFocus;
    },

    set_displayOnFocus: function(value) {
        if(this._displayOnFocus != value) {
            this._displayOnFocus = value;
            this.raisePropertyChanged("DisplayOnFocus");
        }
    },

    get_displayOnClick: function() {
        return this._displayOnClick;
    },

    set_displayOnClick: function(value) {
        if(this.displayOnClick != value) {
            this.displayOnClick = value;
            this.raisePropertyChanged("DisplayOnClick");
        }
    },

    get_balloonSize: function() {
        // small, medium or large
        return this._balloonSize;
    },

    set_balloonSize: function(value) {
        if(this._balloonSize != value) {
            this._balloonSize = value;
            this.raisePropertyChanged("BalloonSize");
        }
    },

    get_useShadow: function() {
        return this._shadow;
    },

    set_useShadow: function(value) {
        if(this._shadow != value) {
            this._shadow = value;
            this.raisePropertyChanged("UseShadow");
        }
    },

    get_scrollBars: function() {
        return this._scrollBars;
    },

    set_scrollBars: function(value) {
        if(this._scrollBars != value) {
            this._scrollBars = value;
            this.raisePropertyChanged('ScrollBars');
        }
    },

    get_PopupVisible: function() {
        return this._popupVisible;
    },

    get_customClassName: function() {
        return this._customClassName;
    },

    set_customClassName: function(value) {
        if(this._customClassName != value) {
            this._customClassName = value;
            this.raisePropertyChanged("CustomClassName");
        }
    },

    add_showing: function(handler) {
        if(this._popupBehavior) {
            this._popupBehavior.add_showing(handler);
        }
    },
    remove_showing: function(handler) {
        if(this._popupBehavior) {
            this._popupBehavior.remove_showing(handler);
        }
    },
    raiseShowing: function(eventArgs) {
        if(this._popupBehavior) {
            this._popupBehavior.raiseShowing(eventArgs);
        }
    },

    add_shown: function(handler) {
        if(this._popupBehavior) {
            this._popupBehavior.add_shown(handler);
        }
    },
    remove_shown: function(handler) {
        if(this._popupBehavior) {
            this._popupBehavior.remove_shown(handler);
        }
    },
    raiseShown: function(eventArgs) {
        if(this._popupBehavior) {
            this._popupBehavior.raiseShown(eventArgs);
        }
    },

    add_hiding: function(handler) {
        if(this._popupBehavior) {
            this._popupBehavior.add_hiding(handler);
        }
    },
    remove_hiding: function(handler) {
        if(this._popupBehavior) {
            this._popupBehavior.remove_hiding(handler);
        }
    },
    raiseHiding: function(eventArgs) {
        if(this._popupBehavior) {
            this._popupBehavior.raiseHiding(eventArgs);
        }
    },

    add_hidden: function(handler) {
        if(this._popupBehavior) {
            this._popupBehavior.add_hidden(handler);
        }
    },
    remove_hidden: function(handler) {
        if(this._popupBehavior) {
            this._popupBehavior.remove_hidden(handler);
        }
    },
    raiseHidden: function(eventArgs) {
        if(this._popupBehavior) {
            this._popupBehavior.raiseHidden(eventArgs);
        }
    },

    posTop: function() {
        var winTopPosition = 0;

        if(typeof window.pageYOffset != "undefined") {
            winTopPosition = window.pageYOffset;
        }
        else if(document.documentElement && document.documentElement.scrollTop) {
            winTopPosition = document.documentElement.scrollTop;
        }
        else if(document.body.scrollTop) {
            winTopPosition = document.body.scrollTop;
        }
        return winTopPosition;
    },

    posLeft: function() {
        var winLeftPosition = 0;

        if(typeof window.pageXOffset != "undefined") {
            winLeftPosition = window.pageXOffset;
        }
        else if(document.documentElement && document.documentElement.scrollLeft) {
            winLeftPosition = document.documentElement.scrollLeft;
        }
        else if(document.body.scrollLeft) {
            winLeftPosition = document.body.scrollLeft;
        }
        return winLeftPosition;
    },

    pageHeight: function() {
        var _height = null;

        if(window.innerHeight != null) {
            _height = window.innerHeight;
        }
        else if(document.documentElement && document.documentElement.clientHeight) {
            _height = document.documentElement.clientHeight;
        }
        else if(document.body != null) {
            _height = document.body.clientHeight;
        }
        return _height;
    },

    pageWidth: function() {
        var _width = null;

        if(window.innerWidth != null) {
            _width = window.innerWidth;
        }
        else if(document.documentElement && document.documentElement.clientWidth) {
            _width = document.documentElement.clientWidth;
        }
        else if(document.body != null) {
            _width = document.body.clientWidth;
        }
        return _width;
    }
}
Sys.Extended.UI.BalloonPopupControlBehavior.registerClass("Sys.Extended.UI.BalloonPopupControlBehavior", Sys.Extended.UI.DynamicPopulateBehaviorBase);

// This global variable tracks the currently visible popup.  Automatically
// hiding the popup when focus is lost does not work with our mechanism to
// hide the popup when something else is clicked... So we will instead go for
// the weaker strategy of letting at most one popup be visible at a time.
Sys.Extended.UI.BalloonPopupControlBehavior.__VisiblePopup = null;


Sys.Extended.UI.BalloonPopupPosition = function() {
    // Position of the popup relative to the target control
    throw Error.invalidOperation();
}
Sys.Extended.UI.BalloonPopupPosition.prototype = {
    Auto: 0,
    TopRight: 1,
    TopLeft: 2,
    BottomRight: 3,
    BottomLeft: 4
}

Sys.Extended.UI.BalloonPopupPosition.registerEnum("Sys.Extended.UI.BalloonPopupPosition", false);

Sys.Extended.UI.BalloonPopupStyle = function() {
    // Style of the popup relative to the target control
    throw Error.invalidOperation();
}
Sys.Extended.UI.BalloonPopupStyle.prototype = {
    Rectangle: 0,
    Cloud: 1,
    Custom: 2
}

Sys.Extended.UI.BalloonPopupStyle.registerEnum("Sys.Extended.UI.BalloonPopupStyle", false);

Sys.Extended.UI.BalloonPopupSize = function() {
    throw Error.invalidOperation();
}
Sys.Extended.UI.BalloonPopupSize.prototype = {
    Small: 0,
    Medium: 1,
    Large: 2
}

Sys.Extended.UI.BalloonPopupSize.registerEnum("Sys.Extended.UI.BalloonPopupSize", false);