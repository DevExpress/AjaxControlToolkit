Type.registerNamespace("Sys.Extended.UI");

Sys.Extended.UI.BalloonPopupControlBehavior = function(element) {
    // The BalloonPopupControlBehavior opens a popup window next to the target element
    Sys.Extended.UI.BalloonPopupControlBehavior.initializeBase(this, [element]);

    /// <summary>
    /// The ID of the control to display
    /// </summary>
    /// <getter>get_balloonPopupControlID</getter>
    /// <setter>set_balloonPopupControlID</setter>
    /// <member name="cP:AjaxControlToolkit.BalloonPopupExtender.balloonPopopControlID" />
    this._balloonPopupControlID = null;

    /// <summary>
    /// Optional setting specifying where the popup should be positioned relative to the target control.
    /// Default value is Auto
    /// </summary>
    /// <getter>get_balloonPopupPosition</getter>
    /// <setter>set_balloonPopupPosition</setter>
    /// <member name="cP:AjaxControlToolkit.BalloonPopupExtender.balloonPopupPosition" />
    this._position = Sys.Extended.UI.BalloonPopupPosition.Auto;

    /// <summary>
    /// Optional setting specifying the theme of balloon popup.
    /// Default value is Rectangle
    /// </summary>
    /// <getter>get_balloonPopupStyle</getter>
    /// <setter>set_balloonPopupStyle</setter>
    /// <member name="cP:AjaxControlToolkit.BalloonPopupExtender.balloonPopupStyle" />
    this._balloonStyle = Sys.Extended.UI.BalloonPopupStyle.Rectangle;

    /// <summary>
    /// Optional X (horizontal) offset for the popup window (relative to the target control)
    /// </summary>
    /// <getter>get_offsetX</getter>
    /// <setter>set_offsetX</setter>
    /// <member name="cP:AjaxControlToolkit.BalloonPopupExtender.offsetX" />
    this._offsetX = 0;

    /// <summary>
    /// Optional Y (horizontal) offset for the popup window (relative to the target control)
    /// </summary>
    /// <getter>get_offsetY</getter>
    /// <setter>set_offsetY</setter>
    /// <member name="cP:AjaxControlToolkit.BalloonPopupExtender.offsetY" />
    this._offsetY = 0;

    /// <summary>
    /// Extender control ID
    /// </summary>
    /// <getter>get_extenderControlID</getter>
    /// <setter>set_extenderControlID</setter>
    /// <member name="cP:AjaxControlToolkit.BalloonPopupExtender.extenderControlID" />
    this._extenderControlID = null;

    /// <summary>
    /// Optional setting specifying whether to display balloon popup on the client onMouseOver event. Default value is false
    /// </summary>
    /// <getter>get_displayOnMouseOver</getter>
    /// <setter>set_displayOnMouseOver</setter>
    /// <member name="cP:AjaxControlToolkit.BalloonPopupExtender.displayOnMouseOver" />
    this._displayOnMouseOver = false;

    /// <summary>
    /// Optional setting specifying whether to display balloon popup on the client onFocus event. Default value is false
    /// </summary>
    /// <getter>get_displayOnFocus</getter>
    /// <setter>set_displayOnFocus</setter>
    /// <member name="cP:AjaxControlToolkit.BalloonPopupExtender.displayOnFocus" />
    this._displayOnFocus = false;

    /// <summary>
    /// Optional setting specifying whether to display balloon popup on the client onClick event. Default value is true
    /// </summary>
    /// <getter>get_displayOnClick</getter>
    /// <setter>set_displayOnClick</setter>
    /// <member name="cP:AjaxControlToolkit.BalloonPopupExtender.displayOnClick" />
    this._displayOnClick = true;

    /// <summary>
    /// Optional setting specifying the size of balloon popup. Default value is Small
    /// </summary>
    /// <getter>get_balloonSize</getter>
    /// <setter>set_balloonSize</setter>
    /// <member name="cP:AjaxControlToolkit.BalloonPopupExtender.balloonSize" />
    this._balloonSize = "small";

    /// <summary>
    /// Optional setting specifying whether to display shadow of balloon popup or not.
    /// Default value is true
    /// </summary>
    /// <getter>get_useShadow</getter>
    /// <setter>set_useShadow</setter>
    /// <member name="cP:AjaxControlToolkit.BalloonPopupExtender.useShadow" />
    this._shadow = true;

    /// <summary>
    /// Optional setting specifying whether to display scrollbar if contents are overflowing.
    /// Default value is Auto
    /// </summary>
    /// <getter>get_scrollBars</getter>
    /// <setter>set_scrollBars</setter>
    /// <member name="cP:AjaxControlToolkit.BalloonPopupExtender.scrollBars" />
    this._scrollBars = Sys.Extended.UI.ScrollBars.Auto;

    // Variables
    this._popupElement = null;
    this._styleElement = null;
    this._sizeElement = null;
    this._shadowElement = null;
    this._directionElement = null;
    this._contentElement = null;
    this._popupBehavior = null;

    /// <summary>
    /// Whether popup is visible.
    /// Default value is false
    /// </summary>
    /// <getter>get_popupVisible</getter>
    /// <member name="cP:AjaxControlToolkit.BalloonPopupExtender.popupVisible" />
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

    /// <summary>
    /// Shows the popup
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.BalloonPopupExtender.showPopup" />
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

    /// <summary>
    /// Hides the popup
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.BalloonPopupExtender.hidePopup" />
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

    /// <summary>
    /// Generic OnShow Animation's JSON definition
    /// </summary>
    /// <getter>get_onShow</getter>
    /// <setter>set_onShow</setter>
    /// <member name="cP:AjaxControlToolkit.BalloonPopupExtender.onShow" />
    get_onShow: function() {
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

    /// <summary>
    /// Generic OnShow Animation's behavior
    /// </summary>
    /// <getter>get_onShowBehavior</getter>
    /// <member name="cP:AjaxControlToolkit.BalloonPopupExtender.onShowBehavior" />
    get_onShowBehavior: function() {
        return this._popupBehavior ? this._popupBehavior.get_onShowBehavior() : null;
    },

    /// <summary>
    /// Play the OnShow animation
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.BalloonPopupExtender.onShow" />
    onShow: function() {
        if(this._popupBehavior) {
            this._popupBehavior.onShow();
        }
    },

    /// <summary>
    /// Generic OnHide Animation's JSON definition
    /// </summary>
    /// <getter>get_onHide</getter>
    /// <setter>set_onHide</setter>
    /// <member name="cP:AjaxControlToolkit.BalloonPopupExtender.onHide" />
    get_onHide: function() {
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

    /// <summary>
    /// Generic OnHide Animation's behavior
    /// </summary>
    /// <getter>get_onHideBehavior</getter>
    /// <member name="cM:AjaxControlToolkit.BalloonPopupExtender.onHideBehavior" />
    get_onHideBehavior: function() {
        return this._popupBehavior ? this._popupBehavior.get_onHideBehavior() : null;
    },

    /// <summary>
    /// Play the OnHide animation
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.BalloonPopupExtender.onHide" />
    onHide: function() {
        if(this._popupBehavior) {
            this._popupBehavior.onHide();
        }
    },

    get_balloonPopupControlID: function() {
        return this._balloonPopupControlID;
    },
    set_balloonPopupControlID: function(value) {
        if(this._balloonPopupControlID != value) {
            this._balloonPopupControlID = value;
            this.raisePropertyChanged("balloonPopupControlID");
        }
    },

    get_BalloonPopupControlID: function() {
        Sys.Extended.Deprecated("get_BalloonPopupControlID", "get_balloonPopupControlID");
        return this.get_balloonPopupControlID();
    },
    set_BalloonPopupControlID: function(value) {
        Sys.Extended.Deprecated("set_BalloonPopupControlID", "set_balloonPopupControlID");
        this.set_balloonPopupControlID(value);
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
            this.raisePropertyChanged("balloonStyle");
        }
    },

    get_extenderControlID: function() {
        return this._extenderControlID;
    },
    set_extenderControlID: function(value) {
        if(this._extenderControlID != value) {
            this._extenderControlID = value;
            this.raisePropertyChanged("extenderControlID");
        }
    },

    get_ExtenderControlID: function() {
        Sys.Extended.Deprecated("get_ExtenderControlID", "get_extenderControlID");
        return this.get_extenderControlID();
    },
    set_ExtenderControlID: function(value) {
        Sys.Extended.Deprecated("set_ExtenderControlID", "set_extenderControlID");
        this.set_extenderControlID(value);
    },

    get_offsetX: function() {
        return this._offsetX;
    },
    set_offsetX: function(value) {
        if(this._offsetX != value) {
            this._offsetX = value;
            this.raisePropertyChanged("offsetX");
        }
    },

    get_OffsetX: function() {
        Sys.Extended.Deprecated("get_OffsetX", "get_offsetX");
        return this.get_offsetX();
    },
    set_OffsetX: function(value) {
        Sys.Extended.Deprecated("set_OffsetX", "set_offsetX");
        this.set_offsetX(value);
    },

    get_offsetY: function() {
        return this._offsetY;
    },
    set_offsetY: function(value) {
        if(this._offsetY != value) {
            this._offsetY = value;
            this.raisePropertyChanged("offsetY");
        }
    },

    get_OffsetY: function() {
        Sys.Extended.Deprecated("get_OffsetY", "get_offsetY");
        return this.get_offsetY();
    },
    set_OffsetY: function(value) {
        Sys.Extended.Deprecated("set_OffsetY", "set_offsetY");
        this.set_offsetY(value);
    },

    get_displayOnMouseOver: function() {
        return this._displayOnMouseOver;
    },
    set_displayOnMouseOver: function(value) {
        if(this._displayOnMouseOver != value) {
            this._displayOnMouseOver = value;
            this.raisePropertyChanged("displayOnMouseOver");
        }
    },

    get_displayOnFocus: function() {
        return this._displayOnFocus;
    },
    set_displayOnFocus: function(value) {
        if(this._displayOnFocus != value) {
            this._displayOnFocus = value;
            this.raisePropertyChanged("displayOnFocus");
        }
    },

    get_displayOnClick: function() {
        return this._displayOnClick;
    },
    set_displayOnClick: function(value) {
        if(this._displayOnClick != value) {
            this._displayOnClick = value;
            this.raisePropertyChanged("displayOnClick");
        }
    },

    get_balloonSize: function() {
        // small, medium or large
        return this._balloonSize;
    },
    set_balloonSize: function(value) {
        if(this._balloonSize != value) {
            this._balloonSize = value;
            this.raisePropertyChanged("balloonSize");
        }
    },

    get_useShadow: function() {
        return this._shadow;
    },
    set_useShadow: function(value) {
        if(this._shadow != value) {
            this._shadow = value;
            this.raisePropertyChanged("useShadow");
        }
    },

    get_scrollBars: function() {
        return this._scrollBars;
    },
    set_scrollBars: function(value) {
        if(this._scrollBars != value) {
            this._scrollBars = value;
            this.raisePropertyChanged('scrollBars');
        }
    },

    get_popupVisible: function() {
        return this._popupVisible;
    },
    get_PopupVisible: function() {
        Sys.Extended.Deprecated("get_PopupVisible", "get_popupVisible");
        return this.get_popupVisible();
    },

    /// <summary>
    /// This is required if user choose BalloonStyle to Custom. This specifies the name of
    /// the css class for the custom theme
    /// </summary>
    /// <getter>get_customClassName</getter>
    /// <setter>set_customClassName</setter>
    /// <member name="cP:AjaxControlToolkit.BalloonPopupExtender.customClassName" />
    get_customClassName: function() {
        return this._customClassName;
    },
    set_customClassName: function(value) {
        if(this._customClassName != value) {
            this._customClassName = value;
            this.raisePropertyChanged("customClassName");
        }
    },

    /// <summary>
    /// Fires when popup is showing
    /// </summary>
    /// <event add="add_showing" remove="remove_showing" raise="raise_showing" />
    /// <member name="cE:AjaxControlToolkit.BalloonPopupExtender.showing" />
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
    /// Fires when popup is shown
    /// </summary>
    /// <event add="add_shown" remove="remove_shown" raise="raise_shown" />
    /// <member name="cE:AjaxControlToolkit.BalloonPopupExtender.shown" />
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
    /// Fires when popup is hiding
    /// </summary>
    /// <event add="add_hiding" remove="remove_hiding" raise="raise_hiding" />
    /// <member name="cE:AjaxControlToolkit.BalloonPopupExtender.hiding" />
    add_hiding: function(handler) {
        if(this._popupBehavior)
            this._popupBehavior.add_hiding(handler);
    },
    remove_hiding: function(handler) {
        if(this._popupBehavior)
            this._popupBehavior.remove_hiding(handler);
    },
    raise_hiding: function(eventArgs) {
        if(this._popupBehavior)
            this._popupBehavior.raise_hiding(eventArgs);
    },
    raiseHiding: function(eventArgs) {
        Sys.Extended.Deprecated("raiseHiding(eventArgs)", "raise_hiding(eventArgs)");
        this.raise_hiding(eventArgs);
    },

    /// <summary>
    /// Fires when popup is hidden
    /// </summary>
    /// <event add="add_hidden" remove="remove_hidden" raise="raise_hidden" />
    /// <member name="cE:AjaxControlToolkit.BalloonPopupExtender.hidden" />
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
    },

    /// <summary>
    /// Calculates popup top offset
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.BalloonPopupExtender.posTop" />
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

    /// <summary>
    /// Calculates popup left offset
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.BalloonPopupExtender.posLeft" />
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

    /// <summary>
    /// Calculates container height
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.BalloonPopupExtender.pageHeight" />
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

    /// <summary>
    /// Calculates container width
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.BalloonPopupExtender.pageWidth" />
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