// (c) 2010 CodePlex Foundation



/// <reference name="MicrosoftAjax.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />
/// <reference path="../DynamicPopulate/DynamicPopulateBehavior.js" />
/// <reference path="../Animation/Animations.js" />
/// <reference path="../Animation/AnimationBehavior.js" />
/// <reference path="../PopupExtender/PopupBehavior.js" />

(function () {
    var scriptName = "ExtendedBalloonPopupBehavior";

    function execute() {

        Type.registerNamespace("Sys.Extended.UI");

        Sys.Extended.UI.BalloonPopupControlBehavior = function (element) {
            /// <summary>
            /// The BalloonPopupControlBehavior opens a popup window next to the target element
            /// </summary>
            /// <param name="element" type="Sys.UI.DomElement" domElement="true">
            /// DOM element associated with the behavior
            /// </param>
            Sys.Extended.UI.BalloonPopupControlBehavior.initializeBase(this, [element]);

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
            initialize: function () {
                /// <summary>
                /// Initialize the behavior
                /// </summary>
                Sys.Extended.UI.BalloonPopupControlBehavior.callBaseMethod(this, "initialize");

                var e = this.get_element();

                this.createPopupElement();
                this._popupBehavior = $create(Sys.Extended.UI.PopupBehavior, { "id": this.get_id() + "BalloonPopupBehavior", "parentElement": e }, null, null, this._popupElement);

                if (this._onShowJson) {
                    this._popupBehavior.set_onShow(this._onShowJson);
                }
                if (this._onHideJson) {
                    this._popupBehavior.set_onHide(this._onHideJson);
                }

                if (this._displayOnFocus) {
                    this._focusHandler = Function.createDelegate(this, this._onFocus);
                }
                if (this._displayOnMouseOver) {
                    this._mouseOverHandler = Function.createDelegate(this, this._onMouseOver);
                }
                if (this._displayOnClick) {
                    this._clickHandler = Function.createDelegate(this, this._onFocus);
                }

                this._popupClickHandler = Function.createDelegate(this, this._onPopupClick);
                this._bodyClickHandler = Function.createDelegate(this, this._onBodyClick);

                if (this._displayOnFocus) {
                    $addHandler(e, "focus", this._focusHandler);
                }
                if (this._displayOnMouseOver) {
                    $addHandler(e, "mouseover", this._mouseOverHandler);
                }
                if (this._displayOnClick) {
                    $addHandler(e, "click", this._clickHandler);
                }
                $addHandler(document, "click", this._bodyClickHandler);
                $addHandler(this._popupElement, "click", this._popupClickHandler);
            },

            dispose: function () {
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
                    $removeHandler(e, "focus", this._focusHandler);
                    this._focusHandler = null;
                }
                if (this._mouseOverHandler) {
                    $removeHandler(e, "mouseover", this._mouseOverHandler);
                    this._mouseOverHandler = null;
                }
                if (this._clickHandler) {
                    $removeHandler(e, "click", this._clickHandler);
                    this._clickHandler = null;
                }

                if (this._bodyClickHandler) {
                    $removeHandler(document, "click", this._bodyClickHandler);
                    this._bodyClickHandler = null;
                }
                if (this._popupClickHandler) {
                    $removeHandler(this._popupElement, "click", this._popupClickHandler);
                    this._popupClickHandler = null;
                }

                Sys.Extended.UI.BalloonPopupControlBehavior.callBaseMethod(this, "dispose");
            },

            createPopupElement: function () {
                var e = this.get_element();

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

                this._styleElement = $common.createElementFromTemplate({
                    nodeName: "span",
                    Properties: {
                        id: "ajax__style_wrapper"
                    }
                }, this._popupElement);

                this._sizeElement = $common.createElementFromTemplate({
                    nodeName: "span",
                    Properties: {
                        id: "ajax__size_wrapper"
                    }
                }, this._styleElement);

                this._shadowElement = $common.createElementFromTemplate({
                    nodeName: "div",
                    Properties: {
                        id: "ajax__shadow_wrapper"
                    }
                }, this._sizeElement);

                this._directionElement = $common.createElementFromTemplate({
                    nodeName: "div",
                    Properties: {
                        id: "ajax__direction_wrapper"
                    }
                }, this._shadowElement);

                this._contentElement = $common.createElementFromTemplate({
                    nodeName: "div",
                    Properties: {
                        id: "ajax__content"
                    },
                    cssClasses: ["ajax__content"]
                }, this._directionElement);

                if ($get(this._balloonPopupControlID) == null)
                    throw "Referred BalloonPopupControlId did not find.";
                $get(this._balloonPopupControlID).style.display = 'none';
                                

                this.setStyle();
                this.setSize();
                this._directionElement.className = this._directionClassName;

                this._popupWidth = this._directionElement.offsetWidth;
                this._popupHeight = this._directionElement.offsetHeight;

                if (this.get_balloonPopupPosition() != Sys.Extended.UI.BalloonPopupPosition.Auto) {
                    this.setPosition();
                    this.setContentPadding();
                    this.setScrollBar();
                }

            },

            setStyle: function () {
                /// <summary>
                /// Set theme for balloon popup control. 
                /// </summary>
                switch (this.get_balloonPopupStyle()) {
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

            setSize: function () {
                /// <summary>
                /// Set size of balloon popup control. 
                /// </summary>
                switch (this.get_balloonSize()) {
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

            setPosition: function () {
                /// <summary>
                /// Set position of balloon popup control. 
                /// </summary>
                var currentPosition = null;
                if (this.get_balloonPopupPosition() == Sys.Extended.UI.BalloonPopupPosition.Auto) {
                    currentPosition = this._autoPosition;
                }
                else {
                    currentPosition = this.get_balloonPopupPosition();
                }

                switch (currentPosition) {
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

            setContentPadding: function () {
                /// <summary>
                /// Set padding style for balloon popup contents 
                /// </summary>
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

            setScrollBar: function () {
                /// <summary>
                /// Set overflow style for balloon popup contents 
                /// </summary>
                var content = $get(this._balloonPopupControlID);
                switch (this.get_scrollBars()) {
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



            showPopup: function () {
                /// <summary>
                /// Display the ballon popup
                /// </summary>                
                                
                this._contentElement.appendChild($get(this._balloonPopupControlID));
                $get(this._balloonPopupControlID).style.display = 'block';
                                
                if (Sys.Extended.UI.BalloonPopupPosition.Auto == this._position) {
                    this._setAutoPosition();
                    this.setPosition();
                    this.setContentPadding();
                    this.setScrollBar();
                }

                if (!this._shadow) {
                    this._shadowElement.className = "";
                }

                var old = Sys.Extended.UI.BalloonPopupControlBehavior.__VisiblePopup;
                if (old && old._popupBehavior) {
                    old.hidePopup();
                }

                Sys.Extended.UI.BalloonPopupControlBehavior.callBaseMethod(this, "populate");

                this._popupBehavior.set_x(this._getLeftOffset());
                this._popupBehavior.set_y(this._getTopOffset());
                this._popupBehavior.show();

                this._popupVisible = true;
                Sys.Extended.UI.BalloonPopupControlBehavior.__VisiblePopup = this;

                var bgPosX = $common.getCurrentStyle(this._directionElement, "backgroundPositionX");
                var bgPosY = $common.getCurrentStyle(this._directionElement, "backgroundPositionY");
                $common.setStyle(this._styleElement, { backgroundPositionX: bgPosX, backgroundPositionY: bgPosY });
            },

            hidePopup: function () {
                /// <summary>
                /// Hide the popup
                /// </summary>

                this._popupBehavior.hide();
                this._popupVisible = false;
                Sys.Extended.UI.BalloonPopupControlBehavior.__VisiblePopup = null;
            },

            _onFocus: function (e) {
                /// <summary>
                /// Show the balloon popup when its control is focused
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

            _onMouseOver: function (e) {
                /// <summary>
                /// Show the balloon popup when its control is mouse over
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

            _onPopupClick: function (e) {
                /// <summary>
                /// Click handler for the popup
                /// </summary>
                /// <param name="e" type="Sys.UI.DomEvent">
                /// Event info
                /// </param>
                e.stopPropagation();
            },

            _onBodyClick: function () {
                /// <summary>
                /// Handler for the HTML body tag's click event
                /// </summary>

                if (this._popupVisible) {
                    this.hidePopup();
                }
            },

            _onPopulated: function (sender, eventArgs) {
                /// <summary>
                /// Handler for DynamicPopulate completion
                /// </summary>
                /// <param name="sender" type="Object">
                /// Sender
                /// </param>
                /// <param name="eventArgs" type="Sys.EventArgs">
                /// Event arguments
                /// </param>
                Sys.Extended.UI.BalloonPopupControlBehavior.callBaseMethod(this, "_onPopulated", [sender, eventArgs]);

                if (this._popupVisible) {
                    this._popupBehavior.show();
                }
            },

            _getLeftOffset: function () {
                /// <summary>
                /// Get the left offset for the balloon popup
                /// </summary>
                /// <returns type="Number" integer="true">
                /// Left offset for the balloon popup
                /// </returns>

                var xoffSet = 0;
                var currentPosition = Sys.Extended.UI.BalloonPopupPosition.Auto == this._position ? this._autoPosition : this._position;
                if (Sys.Extended.UI.BalloonPopupPosition.BottomLeft == currentPosition || Sys.Extended.UI.BalloonPopupPosition.TopLeft == currentPosition) {
                    xoffSet = (-1 * (this._popupWidth)) + this._offsetX;
                } else if (Sys.Extended.UI.BalloonPopupPosition.BottomRight == currentPosition || Sys.Extended.UI.BalloonPopupPosition.TopRight == currentPosition) {
                    xoffSet = this.get_element().offsetWidth + this._offsetX;
                } else {
                    xoffSet = this._offsetX;
                }
                return xoffSet;
            },

            _getTopOffset: function () {
                /// <summary>
                /// Get the top offset for the balloon popup
                /// </summary>
                /// <returns type="Number" integer="true">
                /// Top offset for the balloon popup
                /// </returns>

                var yoffSet = 0;
                var currentPosition = Sys.Extended.UI.BalloonPopupPosition.Auto == this._position ? this._autoPosition : this._position;
                if (Sys.Extended.UI.BalloonPopupPosition.TopLeft == currentPosition || Sys.Extended.UI.BalloonPopupPosition.TopRight == currentPosition) {
                    yoffSet = (-1 * (this._popupHeight)) + this._offsetY;
                } else if (Sys.Extended.UI.BalloonPopupPosition.BottomLeft == currentPosition || Sys.Extended.UI.BalloonPopupPosition.BottomRight == currentPosition) {
                    yoffSet = (this.get_element().offsetHeight) + this._offsetY;
                } else {
                    yoffSet = this._offsetY;
                }
                return yoffSet;
            },

            _setAutoPosition: function () {
                var _elementTopPosition = 0;
                var _elementLeftPosition = 0;
                var e = this.get_element();
                if (e.offsetParent) {
                    do {
                        _elementLeftPosition += e.offsetLeft;
                        _elementTopPosition += e.offsetTop;
                    } while (e = e.offsetParent);
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

                if ((_popTopPosition - _pageTopPosition) > 0 && ((_popTopPosition - _pageTopPosition) > (_pageBottom - _popBottomPosition))) {
                    if (_pageRight < _popRightPosition) {
                        this._autoPosition = Sys.Extended.UI.BalloonPopupPosition.TopLeft;
                    }
                    else {
                        this._autoPosition = Sys.Extended.UI.BalloonPopupPosition.TopRight;
                    }
                }
                else {
                    if (_pageRight < _popRightPosition) {
                        this._autoPosition = Sys.Extended.UI.BalloonPopupPosition.BottomLeft;
                    }
                    else {
                        this._autoPosition = Sys.Extended.UI.BalloonPopupPosition.BottomRight;
                    }
                }
            },

            get_onShow: function () {
                /// <value type="String" mayBeNull="true">
                /// Generic OnShow Animation's JSON definition
                /// </value>
                return this._popupBehavior ? this._popupBehavior.get_onShow() : this._onShowJson;
            },
            set_onShow: function (value) {
                if (this._popupBehavior) {
                    this._popupBehavior.set_onShow(value)
                } else {
                    this._onShowJson = value;
                }
                this.raisePropertyChanged("onShow");
            },
            get_onShowBehavior: function () {
                /// <value type="Sys.Extended.UI.Animation.GenericAnimationBehavior">
                /// Generic OnShow Animation's behavior
                /// </value>
                return this._popupBehavior ? this._popupBehavior.get_onShowBehavior() : null;
            },
            onShow: function () {
                /// <summary>
                /// Play the OnShow animation
                /// </summary>
                /// <returns />
                if (this._popupBehavior) {
                    this._popupBehavior.onShow();
                }
            },

            get_onHide: function () {
                /// <value type="String" mayBeNull="true">
                /// Generic OnHide Animation's JSON definition
                /// </value>
                return this._popupBehavior ? this._popupBehavior.get_onHide() : this._onHideJson;
            },
            set_onHide: function (value) {
                if (this._popupBehavior) {
                    this._popupBehavior.set_onHide(value)
                } else {
                    this._onHideJson = value;
                }
                this.raisePropertyChanged("onHide");
            },
            get_onHideBehavior: function () {
                /// <value type="Sys.Extended.UI.Animation.GenericAnimationBehavior">
                /// Generic OnHide Animation's behavior
                /// </value>
                return this._popupBehavior ? this._popupBehavior.get_onHideBehavior() : null;
            },
            onHide: function () {
                /// <summary>
                /// Play the OnHide animation
                /// </summary>
                /// <returns />
                if (this._popupBehavior) {
                    this._popupBehavior.onHide();
                }
            },

            get_BalloonPopupControlID: function () {
                /// <value type="String">
                /// The ID of the control to display
                /// </value>
                return this._balloonPopupControlID;
            },
            set_BalloonPopupControlID: function (value) {
                if (this._balloonPopupControlID != value) {
                    this._balloonPopupControlID = value;
                    this.raisePropertyChanged("BalloonPopupControlID");
                }
            },

            get_balloonPopupPosition: function () {
                /// <value type="Sys.Extended.UI.BalloonPopupPosition">
                /// Where the balloon popup should be positioned relative to the target control. (Left, Right, Top, Bottom)
                /// </value>
                return this._position;
            },
            set_balloonPopupPosition: function (value) {
                if (this._position != value) {
                    this._position = value;
                    this.raisePropertyChanged("Position");
                }
            },

            get_balloonPopupStyle: function () {
                /// <value type="Sys.Extended.UI.BalloonPopupStyle">
                /// Theme/style of balloon popup control (Rectangle, Cloud)
                /// </value>
                return this._balloonStyle;
            },

            set_balloonPopupStyle: function (value) {
                if (this._balloonStyle != value) {
                    this._balloonStyle = value;
                    this.raisePropertyChanged("BalloonStyle");
                }
            },

            get_ExtenderControlID: function () {
                /// <value type="String">
                /// ID of the extender control
                /// </value>
                return this._extenderControlID;
            },
            set_ExtenderControlID: function (value) {
                if (this._extenderControlID != value) {
                    this._extenderControlID = value;
                    this.raisePropertyChanged("ExtenderControlID");
                }
            },

            get_OffsetX: function () {
                /// <value type="Number" integer="true">
                /// The number of pixels to horizontally offset the balloon Popup from its default position
                /// </value>
                return this._offsetX;
            },
            set_OffsetX: function (value) {
                if (this._offsetX != value) {
                    this._offsetX = value;
                    this.raisePropertyChanged("OffsetX");
                }
            },

            get_OffsetY: function () {
                /// <value type="Number" integer="true">
                /// The number of pixels to vertically offset the balloon Popup from its default position
                /// </value>
                return this._offsetY;
            },
            set_OffsetY: function (value) {
                if (this._offsetY != value) {
                    this._offsetY = value;
                    this.raisePropertyChanged("OffsetY");
                }
            },

            get_displayOnMouseOver: function () {
                /// <value type="bool">
                /// get whether to display balloon popup onmouseover or not
                /// </value>
                return this._displayOnMouseOver;
            },

            set_displayOnMouseOver: function (value) {
                if (this._displayOnMouseOver != value) {
                    this._displayOnMouseOver = value;
                    this.raisePropertyChanged("DisplayOnMouseOver");
                }
            },

            get_displayOnFocus: function () {
                /// <value type="bool">
                /// get whether to display balloon popup onfocus or not
                /// </value>
                return this._displayOnFocus;
            },

            set_displayOnFocus: function (value) {
                if (this._displayOnFocus != value) {
                    this._displayOnFocus = value;
                    this.raisePropertyChanged("DisplayOnFocus");
                }
            },

            get_displayOnClick: function () {
                /// <value type="bool">
                /// get whether to display balloon popup onClick or not
                /// </value>
                return this._displayOnClick;
            },

            set_displayOnClick: function (value) {
                if (this.displayOnClick != value) {
                    this.displayOnClick = value;
                    this.raisePropertyChanged("DisplayOnClick");
                }
            },

            get_balloonSize: function () {
                /// <value type="Sys.Extended.UI.BalloonPopupSize">
                /// get the size of balloon popup whether small, medium or large
                /// </value>
                return this._balloonSize;
            },

            set_balloonSize: function (value) {
                if (this._balloonSize != value) {
                    this._balloonSize = value;
                    this.raisePropertyChanged("BalloonSize");
                }
            },

            get_useShadow: function () {
                /// <value type="bool">
                /// get whether to display shadow or not
                /// </value>
                return this._shadow;
            },

            set_useShadow: function (value) {
                if (this._shadow != value) {
                    this._shadow = value;
                    this.raisePropertyChanged("UseShadow");
                }
            },

            get_scrollBars: function () {
                /// <value type="Sys.Extended.UI.ScrollBars">
                /// get scroll bars behavior when content is overflow
                /// </value>
                return this._scrollBars;
            },

            set_scrollBars: function (value) {
                if (this._scrollBars != value) {
                    this._scrollBars = value;
                    this.raisePropertyChanged('ScrollBars');
                }
            },

            get_PopupVisible: function () {
                /// <value type="Boolean">
                /// Whether the popup control is currently visible
                /// </value>
                return this._popupVisible;
            },

            get_customClassName: function () {
                /// <value type="bool">
                /// Name of the css class that will be used for the custom theme.
                /// </value>
                return this._customClassName;
            },

            set_customClassName: function (value) {
                if (this._customClassName != value) {
                    this._customClassName = value;
                    this.raisePropertyChanged("CustomClassName");
                }
            },

            add_showing: function (handler) {
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
            remove_showing: function (handler) {
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
            raiseShowing: function (eventArgs) {
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

            add_shown: function (handler) {
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
            remove_shown: function (handler) {
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
            raiseShown: function (eventArgs) {
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

            add_hiding: function (handler) {
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
            remove_hiding: function (handler) {
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
            raiseHiding: function (eventArgs) {
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

            add_hidden: function (handler) {
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
            remove_hidden: function (handler) {
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
            raiseHidden: function (eventArgs) {
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
            },

            posTop: function () {
                var winTopPosition = 0;

                if (typeof window.pageYOffset != "undefined") {
                    winTopPosition = window.pageYOffset;
                }
                else if (document.documentElement && document.documentElement.scrollTop) {
                    winTopPosition = document.documentElement.scrollTop;
                }
                else if (document.body.scrollTop) {
                    winTopPosition = document.body.scrollTop;
                }
                return winTopPosition;
            },

            posLeft: function () {
                var winLeftPosition = 0;

                if (typeof window.pageXOffset != "undefined") {
                    winLeftPosition = window.pageXOffset;
                }
                else if (document.documentElement && document.documentElement.scrollLeft) {
                    winLeftPosition = document.documentElement.scrollLeft;
                }
                else if (document.body.scrollLeft) {
                    winLeftPosition = document.body.scrollLeft;
                }
                return winLeftPosition;
            },

            pageHeight: function () {
                var _height = null;

                if (window.innerHeight != null) {
                    _height = window.innerHeight;
                }
                else if (document.documentElement && document.documentElement.clientHeight) {
                    _height = document.documentElement.clientHeight;
                }
                else if (document.body != null) {
                    _height = document.body.clientHeight;
                }
                return _height;
            },

            pageWidth: function () {
                var _width = null;

                if (window.innerWidth != null) {
                    _width = window.innerWidth;
                }
                else if (document.documentElement && document.documentElement.clientWidth) {
                    _width = document.documentElement.clientWidth;
                }
                else if (document.body != null) {
                    _width = document.body.clientWidth;
                }
                return _width;
            }
        }
        Sys.Extended.UI.BalloonPopupControlBehavior.registerClass("Sys.Extended.UI.BalloonPopupControlBehavior", Sys.Extended.UI.DynamicPopulateBehaviorBase);
        Sys.registerComponent(Sys.Extended.UI.BalloonPopupControlBehavior, { name: "balloonPopupBehavior" });

        Sys.Extended.UI.BalloonPopupControlBehavior.__VisiblePopup = null;


        Sys.Extended.UI.BalloonPopupPosition = function () {
            /// <summary>
            /// Position of the popup relative to the target control
            /// </summary>            
            /// <field name="TopRight" type="Number" integer="true" />
            /// <field name="TopLeft" type="Number" integer="true" />
            /// <field name="BottomRight" type="Number" integer="true" />
            /// <field name="BottomLeft" type="Number" integer="true" />
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

        Sys.Extended.UI.BalloonPopupStyle = function () {
            /// <summary>
            /// Position of the popup relative to the target control
            /// </summary>            
            /// <field name="Rectangle" type="Number" integer="true" />
            /// <field name="Cloud" type="Number" integer="true" />            
            throw Error.invalidOperation();
        }
        Sys.Extended.UI.BalloonPopupStyle.prototype = {
            Rectangle: 0,
            Cloud: 1,
            Custom: 2
        }

        Sys.Extended.UI.BalloonPopupStyle.registerEnum("Sys.Extended.UI.BalloonPopupStyle", false);

        Sys.Extended.UI.BalloonPopupSize = function () {
            /// <summary>
            /// Size of the popup 
            /// </summary>            
            /// <field name="Small" type="Number" integer="true" />
            /// <field name="Medium" type="Number" integer="true" />
            /// <field name="Large" type="Number" integer="true" />            
            throw Error.invalidOperation();
        }
        Sys.Extended.UI.BalloonPopupSize.prototype = {
            Small: 0,
            Medium: 1,
            Large: 2
        }

        Sys.Extended.UI.BalloonPopupSize.registerEnum("Sys.Extended.UI.BalloonPopupSize", false);

    } // execute

    if (window.Sys && Sys.loader) {
        Sys.loader.registerScript(scriptName, ["ExtendedDynamicPopulate", "ExtendedPopup", "ExtendedAnimationBehavior"], execute);
    }
    else {
        execute();
    }

})();
