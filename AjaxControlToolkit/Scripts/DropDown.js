Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.DropDownBehavior = function(element) {
    Sys.Extended.UI.DropDownBehavior.initializeBase(this, [element]);
    this._dropDownControl = null;
    this._highlightBorderColor = "#2353B2";
    this._highlightBackgroundColor = "#FFF3DB";
    this._dropArrowBackgroundColor = "#C6E1FF";
    this._dropArrowImageUrl = null;
    this._dropArrowWidth = "16px";
    this._oldBackgroundColor = null;
    this._dropFrame = null;
    this._dropArrow = null;
    this._dropArrowImage = null;
    this._dropWrapper = null;
    this._isOpen = false;
    this._isOver = false;
    this._wasClicked = null;
    this._dropWrapperHoverBehavior = null;
    this._dropPopupPopupBehavior = null;
    this._onShowJson = null;
    this._onHideJson = null;

    this._dropDownControl$delegates = {
        click: Function.createDelegate(this, this._dropDownControl_onclick),
        contextmenu: Function.createDelegate(this, this._dropDownControl_oncontextmenu)
    }

    this._dropFrame$delegates = {
        click: Function.createDelegate(this, this._dropFrame_onclick),
        contextmenu: Function.createDelegate(this, this._dropFrame_oncontextmenu)
    }

    this._dropWrapper$delegates = {
        click: Function.createDelegate(this, this._dropWrapper_onclick),
        contextmenu: Function.createDelegate(this, this._dropWrapper_oncontextmenu)
    }

    this._document$delegates = {
        click: Function.createDelegate(this, this._document_onclick),
        contextmenu: Function.createDelegate(this, this._document_oncontextmenu)
    }

    this._dropWrapperHoverBehavior$delegates = {
        hover: Function.createDelegate(this, this._dropWrapperHoverBehavior_onhover),
        unhover: Function.createDelegate(this, this._dropWrapperHoverBehavior_onunhover)
    }
}

Sys.Extended.UI.DropDownBehavior.prototype = {

    initialize: function() {
        Sys.Extended.UI.DropDownBehavior.callBaseMethod(this, 'initialize');

        var elt = this.get_element(),
            parent = elt.parentNode;

        // _dropDownControl
        if(this._dropDownControl == null) {
            $common.createElementFromTemplate({
                parent: parent,
                nameTable: this,
                name: "_dropDownControl",
                nodeName: "div",
                visible: false,
                cssClasses: this._dropDownControl ? null : ["ajax__dropdown_panel"],
                properties: {
                    __GENERATED: true
                }
            });
        }
        $addHandlers(this._dropDownControl, this._dropDownControl$delegates);

        // _dropFrame
        // _dropArrow
        // _dropArrowWrapper
        // _dropArrowImage
        var dropArrowImageProperties = {};
        if(this._dropArrowImageUrl)
            // Only set src if it has a value - otherwise IE gets a HTTP 404 response
            dropArrowImageProperties["src"] = this._dropArrowImageUrl;

        $common.createElementFromTemplate({
            parent: parent,
            nameTable: this,
            name: "_dropFrame",
            nodeName: "span",
            visible: false,
            children: [{
                name: "_dropFrameTop",
                nodeName: "div",
                cssClasses: ["ajax__dropdown_frame_line"]
            }, {
                name: "_dropFrameRight",
                nodeName: "div",
                cssClasses: ["ajax__dropdown_frame_line"]
            }, {
                name: "_dropFrameBottom",
                nodeName: "div",
                cssClasses: ["ajax__dropdown_frame_line"]
            }, {
                name: "_dropFrameLeft",
                nodeName: "div",
                cssClasses: ["ajax__dropdown_frame_line"]
            }, {
                name: "_dropArrow",
                nodeName: "div",
                cssClasses: (!this._dropArrowImageUrl) ? ["ajax__dropdown_arrow", "ajax__dropdown_arrow_image"] : ["ajax__dropdown_arrow"],
                properties: {
                    style: {
                        width: this._dropArrowWidth,
                        backgroundColor: this._dropArrowBackgroundColor
                    }
                },
                events: this._dropFrame$delegates,
                children: [{
                    name: "_dropArrowWrapper",
                    nodeName: "div",
                    visible: !!this._dropArrowImageUrl,
                    cssClasses: ["ajax__dropdown_arrow_wrapper"],
                    children: [{
                        name: "_dropArrowImage",
                        nodeName: "img",
                        properties: dropArrowImageProperties
                    }]
                }]
            }]
        });

        // _dropWrapper
        $common.createElementFromTemplate({
            parent: null,
            nameTable: this,
            name: "_dropWrapper",
            nodeName: "span",
            properties: {
                id: elt.id + "_dropWrapper",
                style: {
                    cursor: "default"
                }
            },
            events: this._dropWrapper$delegates,
            content: elt
        });

        // _dropPopupPopupBehavior
        this._dropPopupPopupBehavior = $create(Sys.Extended.UI.PopupBehavior, {
            positioningMode: Sys.Extended.UI.PositioningMode.BottomRight,
            parentElement: elt,
            y: -1
        }, null, null, this._dropDownControl);

        // Create the animations (if they were set before initialize was called)
        if(this._onShowJson)
            this._dropPopupPopupBehavior.set_onShow(this._onShowJson);

        if(this._onHideJson)
            this._dropPopupPopupBehavior.set_onHide(this._onHideJson);

        // _dropWrapperHoverBehavior
        this._dropWrapperHoverBehavior = $create(Sys.Extended.UI.HoverBehavior, {
            hoverElement: this._dropFrame
        }, this._dropWrapperHoverBehavior$delegates, null, this._dropWrapper);

        // wire events
        $addHandlers(document, this._document$delegates);
    },

    dispose: function() {
        var elt = this.get_element();
        if(this._isOpen) {
            this.hide();
            this.unhover();
            this._isOpen = false;
        }

        $common.removeHandlers(document, this._document$delegates);
        this._onShowJson = null;
        this._onHideJson = null;

        if(this._dropPopupPopupBehavior) {
            this._dropPopupPopupBehavior.dispose();
            this._dropPopupPopupBehavior = null;
        }

        if(this._dropWrapperHoverBehavior) {
            this._dropWrapperHoverBehavior.dispose();
            this._dropWrapperHoverBehavior = null;
        }

        if(this._dropFrame) {
            $common.removeElement(this._dropFrame);
            this._dropFrame = null;
            this._dropFrameTop = null;
            this._dropFrameRight = null;
            this._dropFrameBottom = null;
            this._dropFrameLeft = null;
            this._dropArrow = null;
            this._dropArrowWrapper = null;
            this._dropArrowImage = null;
        }

        if(this._dropWrapper) {
            $common.removeHandlers(this._dropWrapper, this._dropWrapper$delegates);
            $common.unwrapElement(elt, this._dropWrapper);

            this._dropWrapper = null;
        }

        if(this._dropDownControl) {
            $common.removeHandlers(this._dropDownControl, this._dropDownControl$delegates);

            if(this._dropDownControl.__GENERATED)
                $common.removeElement(this._dropDownControl);

            this._dropDownControl = null;
        }

        Sys.Extended.UI.DropDownBehavior.callBaseMethod(this, 'dispose');
    },

    hover: function() {
        var elt = this.get_element();
        if(!this._isOver) {
            this._isOver = true;
            this.raiseHoverOver(Sys.EventArgs.Empty);

            var bounds = $common.getBounds(elt);

            // measure the offset caused by absolute/relative positioning:
            // - set position to (0,0)
            $common.setLocation(this._dropFrame, { x: 0, y: 0 });

            // - show element
            $common.setVisible(this._dropFrame, true);

            // - get the actual position
            var offset = $common.getLocation(this._dropFrame);

            // - hide element
            $common.setVisible(this._dropFrame, false);

            // apply the measured offset
            bounds.x -= offset.x;
            bounds.y -= offset.y;

            $common.setBounds(this._dropFrameTop, {
                x: bounds.x,
                y: bounds.y,
                width: bounds.width,
                height: 1
            });
            $common.setBounds(this._dropFrameRight, {
                x: bounds.x + bounds.width - 1,
                y: bounds.y,
                width: 1,
                height: bounds.height
            });
            $common.setBounds(this._dropFrameBottom, {
                x: bounds.x,
                y: bounds.y + bounds.height - 1,
                width: bounds.width,
                height: 1
            });
            $common.setBounds(this._dropFrameLeft, {
                x: bounds.x,
                y: bounds.y,
                width: 1,
                height: bounds.height
            });
            $common.setBounds(this._dropArrow, {
                x: bounds.x + bounds.width - 17,
                y: bounds.y + 1,
                width: 16,
                height: bounds.height - 2
            });

            this._dropFrameTop.style.backgroundColor = this._highlightBorderColor;
            this._dropFrameRight.style.backgroundColor = this._highlightBorderColor;
            this._dropFrameBottom.style.backgroundColor = this._highlightBorderColor;
            this._dropFrameLeft.style.backgroundColor = this._highlightBorderColor;

            $common.setVisible(this._dropFrame, true);
            if(!this._oldBackgroundColor)
                this._oldBackgroundColor = $common.getCurrentStyle(elt, 'backgroundColor');

            var rgbColorRegEx = /\d{0,3},\s*\d{0,3},\s*\d{0,3}/;
            if(rgbColorRegEx.test(this._highlightBackgroundColor))
                elt.style.backgroundColor = "rgb(" + this._highlightBackgroundColor + ")";
            else
                elt.style.backgroundColor = this._highlightBackgroundColor;
        }
    },

    unhover: function() {
        var elt = this.get_element();
        if(this._isOver || !this._isOpen) {
            this._isOver = false;

            if(!this._isOpen) {
                $common.setVisible(this._dropFrame, false);

                if(this._oldBackgroundColor) {
                    elt.style.backgroundColor = this._oldBackgroundColor;
                    this._oldBackgroundColor = null;
                } else {
                    elt.style.backgroundColor = "transparent";
                }
            }

            this.raise_hoverOut(Sys.EventArgs.Empty);
        }
    },

    /// <summary>
    /// Shows a drop-down list.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.DropDownExtender.show" />
    show: function() {
        if(!this._isOpen) {
            this.hover();

            var eventArgs = new Sys.CancelEventArgs();
            this.raise_showing(eventArgs);
            this.raise_popup(eventArgs);
            if(eventArgs.get_cancel())
                return;

            this._isOpen = true;
            this.populate();

            if(!this._dynamicPopulateBehavior || (this._dynamicPopulateBehavior._populated && this._cacheDynamicResults))
                this._showPopup();
        }
    },

    _showPopup: function() {
        this._dropPopupPopupBehavior.show();
        this.raise_shown(Sys.EventArgs.Empty);
    },

    /// <summary>
    /// Hides a drop-down list.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.DropDownExtender.hide" />
    hide: function() {
        if(this._isOpen) {
            var eventArgs = new Sys.CancelEventArgs();
            this.raise_hiding(eventArgs);

            if(eventArgs.get_cancel())
                return;

            this._isOpen = false;
            this._dropPopupPopupBehavior.hide();
            this.raise_hidden(Sys.EventArgs.Empty);
        }
    },

    _dropWrapperHoverBehavior_onhover: function(sender, e) {
        this.hover();
    },

    _dropWrapperHoverBehavior_onunhover: function(sender, e) {
        this.unhover();
    },

    _dropWrapper_onclick: function(e) {
        if(e.target.tagName != "A") {
            if(!this._isOpen)
                this.show();
            else
                this.hide();

            this._wasClicked = true;
        }
    },

    _dropWrapper_oncontextmenu: function(e) {
        if(e.target.tagName != "A") {
            this._wasClicked = true;
            e.preventDefault();
            this.show();
        }
    },

    _dropFrame_onclick: function(e) {
        if(!this._isOpen)
            this.show();
        else
            this.hide();

        this._wasClicked = true;
    },

    _dropFrame_oncontextmenu: function(e) {
        this._wasClicked = true;
        e.preventDefault();
        this.show();
    },

    _dropDownControl_onclick: function(e) {
        //this._wasClicked = true;
    },

    _dropDownControl_oncontextmenu: function(e) {
        this._wasClicked = true;
        e.preventDefault();
    },

    _document_onclick: function(e) {
        if(this._wasClicked) {
            this._wasClicked = false;
        } else if(this._isOpen) {
            this.hide();
            this.unhover();
        }
    },

    _document_oncontextmenu: function(e) {
        if(this._wasClicked) {
            this._wasClicked = false;
        } else if(this._isOpen) {
            this.hide();
            this.unhover();
        }
    },

    _onPopulated: function(sender, eventArgs) {
        Sys.Extended.UI.DropDownBehavior.callBaseMethod(this, '_onPopulated', [sender, eventArgs]);

        if(this._isOpen)
            this._showPopup();
    },

    /// <summary>
    /// A JSON definition of a generic OnShow animation.
    /// </summary>
    /// <getter>get_onShow</getter>
    /// <setter>set_onShow</setter>
    /// <member name="cP:AjaxControlToolkit.DropDownExtender.onShow" />
    get_onShow: function() {
        return this._dropPopupPopupBehavior ? this._dropPopupPopupBehavior.get_onShow() : this._onShowJson;
    },
    set_onShow: function(value) {
        if(this._dropPopupPopupBehavior)
            this._dropPopupPopupBehavior.set_onShow(value)
        else
            this._onShowJson = value;

        this.raisePropertyChanged('onShow');
    },

    /// <summary>
    /// The Sys.Extended.UI.Animation.GenericAnimationBehavior object containing the generic OnShow animation behavior.
    /// </summary>
    /// <getter>get_onShowBehaior</getter>
    /// <member name="cP:AjaxControlToolkit.DropDownExtender.onShowBehavior" />
    get_onShowBehavior: function() {
        return this._dropPopupPopupBehavior ? this._dropPopupPopupBehavior.get_onShowBehavior() : null;
    },

    /// <summary>
    /// Plays OnShow animation.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.DropDownExtender.onShow" />
    onShow: function() {
        if(this._dropPopupPopupBehavior)
            this._dropPopupPopupBehavior.onShow();
    },

    /// <summary>
    /// A JSON definition of a generic OnHide animation.
    /// </summary>
    /// <getter>get_onHide</getter>
    /// <setter>set_onHide</setter>
    /// <member name="cP:AjaxControlToolkit.DropDownExtender.onHide" />
    get_onHide: function() {
        // Generic OnHide Animation's JSON definition
        return this._dropPopupPopupBehavior ? this._dropPopupPopupBehavior.get_onHide() : this._onHideJson;
    },
    set_onHide: function(value) {
        if(this._dropPopupPopupBehavior)
            this._dropPopupPopupBehavior.set_onHide(value)
        else
            this._onHideJson = value;

        this.raisePropertyChanged('onHide');
    },

    /// <summary>
    /// The Sys.Extended.UI.Animation.GenericAnimationBehavior object containing the generic OnHide animation behavior.
    /// </summary>
    /// <getter>get_onHideBehavior</getter>
    /// <member name="cP:AjaxControlToolkit.DropDownExtender.onHideBehavior" />
    get_onHideBehavior: function() {
        return this._dropPopupPopupBehavior ? this._dropPopupPopupBehavior.get_onHideBehavior() : null;
    },

    /// <summary>
    /// Play OnHide animation.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.DropDownExtender.onHide" />
    onHide: function() {
        if(this._dropPopupPopupBehavior)
            this._dropPopupPopupBehavior.onHide();
    },

    /// <summary>
    /// A drop-down control.
    /// </summary>
    /// <getter>get_dropDownControl</getter>
    /// <setter>set_dropDownControl</setter>
    /// <member name="cP:AjaxControlToolkit.DropDownExtender.dropDownControl" />
    get_dropDownControl: function() {
        return this._dropDownControl;
    },
    set_dropDownControl: function(value) {
        if(this._dropDownControl != value) {
            this._dropDownControl = value;
            this.raisePropertyChanged("dropDownControl");
        }
    },

    /// <summary>
    /// TThe highlighted border color of the DropDown control.
    /// </summary>
    /// <getter>get_highlightBorderColor</getter>
    /// <setter>set_highlightBorderColor</setter>
    /// <member name="cP:AjaxControlToolkit.DropDownExtender.highlightBorderColor" />
    get_highlightBorderColor: function() {
        return this._highlightBorderColor;
    },
    set_highlightBorderColor: function(value) {
        if(this._highlightBorderColor != value) {
            this._highlightBorderColor = value;
            this.raisePropertyChanged("highlightBorderColor");
        }
    },

    /// <summary>
    /// The highlighted background color of the DropDown control.
    /// </summary>
    /// <getter>get_highlightBackgroundColor</getter>
    /// <setter>set_highlightBackgroundColor</setter>
    /// <member name="cP:AjaxControlToolkit.DropDownExtender.highlightBackgroundColor" />
    get_highlightBackgroundColor: function() {
        return this._highlightBackgroundColor;
    },
    set_highlightBackgroundColor: function(value) {
        if(this._highlightBackgroundColor != value) {
            this._highlightBackgroundColor = value;

            if(this.get_isInitialized() && this._isOpen)
                this._dropWrapper.style.backgroundColor = value;

            this.raisePropertyChanged("highlightBackgroundColor");
        }
    },

    /// <summary>
    /// The arrow's background color of the DropDown control.
    /// </summary>
    /// <getter>get_dropArrowBackgroundColor</getter>
    /// <setter>set_dropArrowBackgroundColor</setter>
    /// <member name="cP:AjaxControlToolkit.DropDownExtender.dropArrowBackgroundColor" />
    get_dropArrowBackgroundColor: function() {
        return this._dropArrowBackgroundColor;
    },
    set_dropArrowBackgroundColor: function(value) {
        if(this._dropArrowBackgroundColor != value) {
            this._dropArrowBackgroundColor = value;

            if(this.get_isInitialized())
                this._dropArrow.style.backgroundColor = value;

            this.raisePropertyChanged("dropArrowBackgroundColor");
        }
    },

    /// <summary>
    /// The arrow image URL of the DropDown control.
    /// </summary>
    /// <getter>get_dropArrowImageUrl</getter>
    /// <setter>set_dropArrowImageUrl</setter>
    /// <member name="cP:AjaxControlToolkit.DropDownExtender.dropArrowImageUrl" />
    get_dropArrowImageUrl: function() {
        return this._dropArrowImageUrl;
    },
    set_dropArrowImageUrl: function(value) {
        if(this._dropArrowImageUrl != value) {
            this._dropArrowImageUrl = value;

            if(this.get_isInitialized()) {
                if(this._dropArrow.className) {
                    this._dropArrow.className = "";
                    this._dropArrowWrapper.style.display = 'block';
                }

                this._dropArrowImage.src = value;
            }

            this.raisePropertyChanged("dropArrowImageUrl");
        }
    },

    /// <summary>
    /// The arrow width of the DropDown control.
    /// </summary>
    /// <getter>get_dropArrowWidth</getter>
    /// <setter>set_dropArrowWidth</setter>
    /// <member name="cP:AjaxControlToolkit.DropDownExtender.dropArrowWidth" />
    get_dropArrowWidth: function() {
        return this._dropArrowWidth;
    },
    set_dropArrowWidth: function(value) {
        if(this._dropArrowWidth != value) {
            this._dropArrowWidth = value;

            if(this.get_isInitialized())
                this._dropArrow.style.width = value;

            this.raisePropertyChanged("dropArrowWidth");
        }
    },

    /// <summary>
    /// A Boolean value that specifies whether or not the cursor is over the DropDown control.
    /// </summary>
    /// <getter>get_isOver</getter>
    /// <member name="cP:AjaxControlToolkit.DropDownExtender.isOver" />
    get_isOver: function() {
        return this._isOver;
    },

    /// <summary>
    /// A Boolean value that specifies whether the DropDown control is open.
    /// </summary>
    /// <getter>get_isOpen</getter>
    /// <member name="cP:AjaxControlToolkit.DropDownExtender.isOpen" />
    get_isOpen: function() {
        return this._isOpen;
    },

    /// <summary>
    /// Fires when the control is being shown.
    /// </summary>
    /// <event add="add_showing" remove="remove_showing" raise="raise_showing" />
    /// <member name="cE:AjaxControlToolkit.DropDownExtender.showing" />
    add_showing: function(handler) {
        this.get_events().addHandler('showing', handler);
    },
    remove_showing: function(handler) {
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
    /// Fires after the control is shown.	
    /// </summary>
    /// <event add="add_shown" remove="remove_shown" raise="raise_shown" />
    /// <member name="cE:AjaxControlToolkit.DropDownExtender.shown" />
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
    /// Fires when the popup is shown.
    /// </summary>
    /// <event add="add_popup" remove="remove_popup" raise="raise_popup" />
    /// <member name="cE:AjaxControlToolkit.DropDownExtender.popup" />
    add_popup: function(handler) {
        this.get_events().addHandler('popup', handler);
    },
    remove_popup: function(handler) {
        this.get_events().removeHandler('popup', handler);
    },
    raise_popup: function(eventArgs) {
        var handler = this.get_events().getHandler('popup');
        if(handler)
            handler(this, eventArgs);
    },
    raisePopup: function(eventArgs) {
        Sys.Extended.Deprecated("raisePopup(eventArgs)", "raise_popup(eventArgs)");
        this.raise_popup(eventArgs);
    },

    /// <summary>
    /// Fires when the control is being hidden.
    /// </summary>
    /// <event add="add_hiding" remove="remove_hiding" raise="raise_hiding" />
    /// <member name="cE:AjaxControlToolkit.DropDownExtender.hiding" />
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
    /// Fires after the control is hidden.
    /// </summary>
    /// <event add="add_hidden" remove="remove_hidden" raise="raise_hidden" />
    /// <member name="cE:AjaxControlToolkit.DropDownExtender.hidden" />
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
    },

    /// <summary>
    /// Fires on hovering over the control.
    /// </summary>
    /// <event add="add_hoverOver" remove="remove_hoverOver" raise="raise_hoverOver" />
    /// <member name="cE:AjaxControlToolkit.DropDownExtender.hoverOver" />
    add_hoverOver: function(handler) {
        this.get_events().addHandler('hoverOver', handler);
    },
    remove_hoverOver: function(handler) {
        this.get_events().removeHandler('hoverOver', handler);
    },
    raise_hoverOver: function(eventArgs) {
        var handler = this.get_events().getHandler('hoverOver');
        if(handler)
            handler(this, eventArgs);
    },
    raiseHoverOver: function(eventArgs) {
        Sys.Extended.Deprecated("raiseHoverOver(eventArgs)", "raise_hoverOver(eventArgs)");
        this.raise_hoverOver(eventArgs);
    },

    /// <summary>
    /// Fires on hovering out of the control.
    /// </summary>
    /// <event add="add_hoverOut" remove="remove_hoverOut" raise="raise_hoverOut" />
    /// <member name="cE:AjaxControlToolkit.DropDownExtender.hoverOut" />
    add_hoverOut: function(handler) {
        this.get_events().addHandler('hoverOut', handler);
    },
    remove_hoverOut: function(handler) {
        this.get_events().removeHandler('hoverOut', handler);
    },
    raise_hoverOut: function(eventArgs) {
        var handler = this.get_events().getHandler('hoverOut');
        if(handler)
            handler(this, eventArgs);
    },
    raiseHoverOut: function(eventArgs) {
        Sys.Extended.Deprecated("raiseHoverOut(eventArgs)", "raise_hoverOut(eventArgs)");
        this.raise_hoverOut(eventArgs);
    }
}

Sys.Extended.UI.DropDownBehavior.registerClass('Sys.Extended.UI.DropDownBehavior', Sys.Extended.UI.DynamicPopulateBehaviorBase);