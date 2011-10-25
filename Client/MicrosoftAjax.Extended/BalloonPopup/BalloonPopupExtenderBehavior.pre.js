


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

        Type.registerNamespace('Sys.Extended.UI');

        Sys.Extended.UI.BalloonPopupControlBehavior = function (element) {
            /// <summary>
            /// The BalloonPopupControlBehavior opens a popup window next to the target element
            /// </summary>
            /// <param name="element" type="Sys.UI.DomElement" domElement="true">
            /// DOM element associated with the behavior
            /// </param>
            Sys.Extended.UI.BalloonPopupControlBehavior.initializeBase(this, [element]);

            // Properties
            this._balloonPopupControlID = null;
            this._position = Sys.Extended.UI.BalloonPopupPosition.Auto;
            this._balloonStyle = Sys.Extended.UI.BalloonPopupStyle.Rectangle;
            this._offsetX = 0;
            this._offsetY = 0;
            this._extenderControlID = null;
            this._width = 200;
            this._height = 125;
            this._displayOnMouseOver = false;
            this._displayOnFocus = false;
            this._displayOnClick = true;

            // Variables
            this._popupElement = null;
            this._popupBehavior = null;
            this._popupVisible = false;
            this._focusHandler = null;
            this._mouseOverHandler = null;
            this._clickHandler = null;
            this._popupClickHandler = null;
            this._bodyClickHandler = null;
            this._onShowJson = null;
            this._onHideJson = null;
        }
        Sys.Extended.UI.BalloonPopupControlBehavior.prototype = {
            initialize: function () {
                /// <summary>
                /// Initialize the behavior
                /// </summary>
                Sys.Extended.UI.BalloonPopupControlBehavior.callBaseMethod(this, 'initialize');

                // Identify popup element from control id
                var e = this.get_element();
                this.createPopupElement();
                // Hook up a PopupBehavior
                this._popupBehavior = $create(Sys.Extended.UI.PopupBehavior, { 'id': this.get_id() + 'BalloonPopupBehavior', 'parentElement': e }, null, null, this._popupElement);

                // Create the animations (if they were set before initialize was called)
                if (this._onShowJson) {
                    this._popupBehavior.set_onShow(this._onShowJson);
                }
                if (this._onHideJson) {
                    this._popupBehavior.set_onHide(this._onHideJson);
                }

                // Create delegates
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

                // Attach events
                if (this._displayOnFocus) {
                    $addHandler(e, 'focus', this._focusHandler);
                }
                if (this._displayOnMouseOver) {
                    $addHandler(e, 'mouseover', this._mouseOverHandler);
                }
                if (this._displayOnClick) {
                    $addHandler(e, 'click', this._clickHandler);
                }
                //$addHandler(e, 'click', this._focusHandler);  // So that a dismissed popup can be more easily re-popped
                $addHandler(document, 'click', this._bodyClickHandler);
                $addHandler(this._popupElement, 'click', this._popupClickHandler);
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
                    $removeHandler(e, 'focus', this._focusHandler);
                    this._focusHandler = null;
                }
                if (this._mouseOverHandler) {
                    $removeHandler(e, 'mouseover', this._mouseOverHandler);
                    this._mouseOverHandler = null;
                }
                if (this._clickHandler) {
                    $removeHandler(e, 'click', this._clickHandler);
                    this._clickHandler = null;
                }

                if (this._bodyClickHandler) {
                    $removeHandler(document, 'click', this._bodyClickHandler);
                    this._bodyClickHandler = null;
                }
                if (this._popupClickHandler) {
                    $removeHandler(this._popupElement, 'click', this._popupClickHandler);
                    this._popupClickHandler = null;
                }

                Sys.Extended.UI.BalloonPopupControlBehavior.callBaseMethod(this, 'dispose');
            },

            createPopupElement: function () {
                var e = this.get_element();
                // create main container for balloon popup
                var containerTemplate =
                 this._popupElement = $common.createElementFromTemplate({
                     nodeName: 'div',
                     properties: {
                         id: this.get_id() + '_balloonPopup'
                     }
                 }, e.parentNode);

                // create theme/style as per user's setting
                switch (this._balloonStyle) {
                    case Sys.Extended.UI.BalloonPopupStyle.Rectangle:
                        this._popupElement.setAttribute("class", "roundRectangle");
                        if (Sys.Extended.UI.BalloonPopupPosition.TopLeft == this._position || Sys.Extended.UI.BalloonPopupPosition.TopRight == this._position) {
                            this.createRectangleStyleBalloon();
                            this.addArrowPointer();
                        }
                        else {
                            this.addArrowPointer();
                            var clearElement = $common.createElementFromTemplate({
                                nodeName: 'div', cssClasses: ['clear']
                            }, this._popupElement);
                            this.createRectangleStyleBalloon();
                        }
                        break;
                    case Sys.Extended.UI.BalloonPopupStyle.Cloud:
                        this._popupElement.setAttribute("class", "cloudBox");
                        break;
                    default:
                        this._popupElement.setAttribute("class", "roundRectangle");
                        this.createRectangleStyleBalloon();
                        break;
                }

            },

            addArrowPointer: function () {
                var arrowElement = $common.createElementFromTemplate({
                    nodeName: 'div'
                }, this._popupElement);

                switch (this._position) {
                    case Sys.Extended.UI.BalloonPopupPosition.BottomLeft:
                        arrowElement.setAttribute("class", "down-left-arrow");
                        break;
                    case Sys.Extended.UI.BalloonPopupPosition.BottomRight:
                        arrowElement.setAttribute("class", "down-right-arrow");
                        break;
                    case Sys.Extended.UI.BalloonPopupPosition.TopLeft:
                        arrowElement.setAttribute("class", "up-left-arrow");
                        break;
                    case Sys.Extended.UI.BalloonPopupPosition.TopRight:
                        arrowElement.setAttribute("class", "up-right-arrow");
                        break;
                    default:
                        arrowElement.setAttribute("class", "up-right-arrow");
                        break;
                }

            },

            createRectangleStyleBalloon: function () {
                var roundedBox = $common.createElementFromTemplate({
                    nodeName: 'div',
                    properties: {
                        id: 'type2',
                        style: {
                            height: this._height + 'px',
                            width: this._width + 'px'                            
                        }
                    },
                    cssClasses: ['roundedBox']
                }, this._popupElement);
                var contentContainer = $common.createElementFromTemplate({
                    nodeName: 'div',
                    properties: {
                        style: {
                            height: '100%',
                            width: '100%',
                            overflow: 'auto'
                        }
                    }
                }, roundedBox);
                contentContainer.appendChild($get(this._balloonPopupControlID));
                var topLeftCorner = $common.createElementFromTemplate({
                    nodeName: 'div', cssClasses: ['corner topLeft']
                }, roundedBox);
                var topRightCorner = $common.createElementFromTemplate({
                    nodeName: 'div', cssClasses: ['corner topRight']
                }, roundedBox);
                var bottomLeftCorner = $common.createElementFromTemplate({
                    nodeName: 'div', cssClasses: ['corner bottomLeft']
                }, roundedBox);
                var bottomRightCorner = $common.createElementFromTemplate({
                    nodeName: 'div', cssClasses: ['corner bottomRight']
                }, roundedBox);

            },

            createCloudStyleBalloon: function () {

            },

            showPopup: function () {
                /// <summary>
                /// Display the ballon popup
                /// </summary>

                var old = Sys.Extended.UI.BalloonPopupControlBehavior.__VisiblePopup;
                if (old && old._popupBehavior) {
                    old.hidePopup();
                }

                Sys.Extended.UI.BalloonPopupControlBehavior.callBaseMethod(this, 'populate');

                this._popupBehavior.set_x(this._getLeftOffset());
                this._popupBehavior.set_y(this._getTopOffset());
                this._popupBehavior.show();

                this._popupVisible = true;
                Sys.Extended.UI.BalloonPopupControlBehavior.__VisiblePopup = this;
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

                // Set the popup position and display it
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

                // Set the popup position and display it                
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

                // Hide the popup if something other than our target or popup
                // was clicked (since each of these stop the event from bubbling
                // up to the body)
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
                Sys.Extended.UI.BalloonPopupControlBehavior.callBaseMethod(this, '_onPopulated', [sender, eventArgs]);

                // Dynamic populate may have added content; re-layout to accomodate it
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

                // Get the left offset for the balloon popup
                var xoffSet;
                if (Sys.Extended.UI.BalloonPopupPosition.BottomLeft == this._position || Sys.Extended.UI.BalloonPopupPosition.TopLeft == this._position) {
                    xoffSet = (-1 * (this._width + 30)) + this._offsetX;
                } else if (Sys.Extended.UI.BalloonPopupPosition.BottomRight == this._position || Sys.Extended.UI.BalloonPopupPosition.TopRight == this._position) {
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

                // Get the top offset for the balloon popup
                var yoffSet;
                if (Sys.Extended.UI.BalloonPopupPosition.TopLeft == this._position || Sys.Extended.UI.BalloonPopupPosition.TopRight == this._position) {
                    yoffSet = (this.get_element().offsetHeight - (this._height + 80)) + this._offsetY;
                } else if (Sys.Extended.UI.BalloonPopupPosition.BottomLeft == this._position || Sys.Extended.UI.BalloonPopupPosition.BottomRight == this._position) {
                    yoffSet = this.get_element().offsetHeight + this._offsetY;
                } else {
                    yoffSet = this._offsetY;
                }
                return yoffSet;
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
                this.raisePropertyChanged('onShow');
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
                this.raisePropertyChanged('onHide');
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
                    this.raisePropertyChanged('BalloonPopupControlID');
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
                    this.raisePropertyChanged('Position');
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
                    this.raisePropertyChanged('BalloonStyle');
                }
            },

            // TODO: Is this used anywhere?
            get_ExtenderControlID: function () {
                /// <value type="String">
                /// ID of the extender control
                /// </value>
                return this._extenderControlID;
            },
            set_ExtenderControlID: function (value) {
                if (this._extenderControlID != value) {
                    this._extenderControlID = value;
                    this.raisePropertyChanged('ExtenderControlID');
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
                    this.raisePropertyChanged('OffsetX');
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
                    this.raisePropertyChanged('OffsetY');
                }
            },

            get_Width: function () {
                /// <value type="Number" integer="true">
                /// The number of pixels for the balloon Popup width
                /// </value>
                return this._width;
            },

            set_Width: function (value) {
                if (this._width != value) {
                    this._width = value;
                    this.raisePropertyChanged('Width');
                }
            },

            get_Height: function () {
                /// <value type="Number" integer="true">
                /// The number of pixels for the balloon Popup height
                /// </value>
                return this._height;
            },

            set_Height: function (value) {
                if (this._height != value) {
                    this._height = value;
                    this.raisePropertyChanged('Height');
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
                    this.raisePropertyChanged('DisplayOnMouseOver');
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
                    this.raisePropertyChanged('DisplayOnFocus');
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
                    this.raisePropertyChanged('DisplayOnClick');
                }
            },

            get_PopupVisible: function () {
                /// <value type="Boolean">
                /// Whether the popup control is currently visible
                /// </value>
                return this._popupVisible;
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
            }
        }
        Sys.Extended.UI.BalloonPopupControlBehavior.registerClass('Sys.Extended.UI.BalloonPopupControlBehavior', Sys.Extended.UI.DynamicPopulateBehaviorBase);
        Sys.registerComponent(Sys.Extended.UI.BalloonPopupControlBehavior, { name: "balloonPopupBehavior" });

        // This global variable tracks the currently visible popup.  Automatically
        // hiding the popup when focus is lost does not work with our mechanism to
        // hide the popup when something else is clicked... So we will instead go for
        // the weaker strategy of letting at most one popup be visible at a time.
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
            Cloud: 1
        }
        Sys.Extended.UI.BalloonPopupStyle.registerEnum("Sys.Extended.UI.BalloonPopupStyle", false);

    } // execute

    if (window.Sys && Sys.loader) {
        Sys.loader.registerScript(scriptName, ["ExtendedDynamicPopulate", "ExtendedPopup", "ExtendedAnimationBehavior"], execute);
    }
    else {
        execute();
    }

})();
