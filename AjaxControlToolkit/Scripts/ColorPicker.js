Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.ColorPickerBehavior = function(element) {
    // A behavior that attaches a color picker to a textbox
    Sys.Extended.UI.ColorPickerBehavior.initializeBase(this, [element]);

    this._textbox = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(element);
    this._button = null;
    this._sample = null;
    this._cssClass = "ajax__colorPicker";
    this._popupPosition = Sys.Extended.UI.PositioningMode.BottomLeft;
    this._selectedColor = null;

    this._enabled = true;
    this._selectedColorChanging = false;
    this._popupMouseDown = false;
    this._isOpen = false;
    this._blur = new Sys.Extended.UI.DeferredOperation(1, this, this._doBlur);

    this._popupBehavior = null;
    this._container = null;
    this._popupDiv = null;
    this._colorsTable = null;
    this._colorsBody = null;

    this._button$delegates = {
        click: Function.createDelegate(this, this._button_onclick),
        keypress: Function.createDelegate(this, this._button_onkeypress),
        blur: Function.createDelegate(this, this._button_onblur)
    };
    this._element$delegates = {
        change: Function.createDelegate(this, this._element_onchange),
        keypress: Function.createDelegate(this, this._element_onkeypress),
        click: Function.createDelegate(this, this._element_onclick),
        focus: Function.createDelegate(this, this._element_onfocus),
        blur: Function.createDelegate(this, this._element_onblur)
    };
    this._popup$delegates = {
        mousedown: Function.createDelegate(this, this._popup_onmousedown),
        mouseup: Function.createDelegate(this, this._popup_onmouseup),
        drag: Function.createDelegate(this, this._popup_onevent),
        dragstart: Function.createDelegate(this, this._popup_onevent),
        select: Function.createDelegate(this, this._popup_onevent)
    };
    this._cell$delegates = {
        mouseover: Function.createDelegate(this, this._cell_onmouseover),
        mouseout: Function.createDelegate(this, this._cell_onmouseout),
        click: Function.createDelegate(this, this._cell_onclick)
    };
}

Sys.Extended.UI.ColorPickerBehavior.prototype = {
    initialize: function() {
        Sys.Extended.UI.ColorPickerBehavior.callBaseMethod(this, 'initialize');

        // Store the color validation Regex in a "static" object off of
        // Sys.Extended.UI.ColorPickerBehavior.  If this _colorRegex object hasn't been
        // created yet, initialize it for the first time.
        if (!Sys.Extended.UI.ColorPickerBehavior._colorRegex) {
            Sys.Extended.UI.ColorPickerBehavior._colorRegex = new RegExp('^[A-Fa-f0-9]{6}$');
        }

        var elt = this.get_element();
        $addHandlers(elt, this._element$delegates);

        if (this._button) {
            $addHandlers(this._button, this._button$delegates);
        }

        var value = this.get_selectedColor();
        if (value) {
            this.set_selectedColor(value);
        }
        this._restoreSample();
    },

    dispose: function() {
        this._sample = null;
        if (this._button) {
            $clearHandlers(this._button);
            this._button = null;
        }

        if (this._popupBehavior) {
            this._popupBehavior.dispose();
            this._popupBehavior = null;
        }
        if (this._container) {
            if (this._container.parentNode) {
                this._container.parentNode.removeChild(this._container);
            }
            this._container = null;
        }
        if (this._popupDiv) {
            $clearHandlers(this._popupDiv);
            this._popupDiv = null;
        }
        if (this._colorsBody) {
            for (var i = 0; i < this._colorsBody.rows.length; i++) {
                var row = this._colorsBody.rows[i];
                for (var j = 0; j < row.cells.length; j++) {
                    $clearHandlers(row.cells[j].firstChild);
                }
            }
            this._colorsBody = null;
        }
        this._colorsTable = null;

        var elt = this.get_element();
        if (elt) {
            $clearHandlers(elt);
        }

        Sys.Extended.UI.ColorPickerBehavior.callBaseMethod(this, 'dispose');
    },

    get_button: function() {
        // The button to use to show the color picker (optional)
        return this._button;
    },
    set_button: function(value) {
        if (this._button !== value) {
            if (this._button && this.get_isInitialized()) {
                $common.removeHandlers(this._button, this._button$delegates);
            }
            this._button = value;
            if (this._button && this.get_isInitialized()) {
                $addHandlers(this._button, this._button$delegates);
            }
            this.raisePropertyChanged("button");
        }
    },

    get_sample: function() {
        // The element is to sample the color currently being hovered or selected (optional)
        return this._sample;
    },
    set_sample: function(value) {
        if (this._sample !== value) {
            this._sample = value;
            this.raisePropertyChanged("sample");
        }
    },

    get_selectedColor: function() {
        if (this._selectedColor === null) {
            var value = this._textbox.get_Value();
            if (this._validate(value)) {
                this._selectedColor = value;
            }
        }
        return this._selectedColor;
    },
    set_selectedColor: function(value) {
        if (this._selectedColor !== value && this._validate(value)) {
            this._selectedColor = value;
            this._selectedColorChanging = true;
            if (value !== this._textbox.get_Value()) {
                this._textbox.set_Value(value);
            }
            this._showSample(value);
            this._selectedColorChanging = false;
            this.raisePropertyChanged("selectedColor");
        }
    },

    get_enabled: function() {
        // Whether this behavior is available for the current element

        return this._enabled;
    },
    set_enabled: function(value) {
        if (this._enabled !== value) {
            this._enabled = value;
            this.raisePropertyChanged("enabled");
        }
    },

    get_popupPosition: function() {
        // Where the popup should be positioned relative to the target control.

        return this._popupPosition;
    },
    set_popupPosition: function(value) {
        if (this._popupPosition !== value) {
            this._popupPosition = value;
            this.raisePropertyChanged('popupPosition');
        }
    },

    add_colorSelectionChanged: function(handler) {
        this.get_events().addHandler("colorSelectionChanged", handler);
    },
    remove_colorSelectionChanged: function(handler) {
        this.get_events().removeHandler("colorSelectionChanged", handler);
    },
    raiseColorSelectionChanged: function() {
        var handlers = this.get_events().getHandler("colorSelectionChanged");
        if (handlers) {
            handlers(this, Sys.EventArgs.Empty);
        }
    },

    add_showing: function(handler) {
        this.get_events().addHandler("showing", handler);
    },
    remove_showing: function(handler) {
        this.get_events().removeHandler("showing", handler);
    },
    raiseShowing: function(eventArgs) {
        var handler = this.get_events().getHandler('showing');
        if (handler) {
            handler(this, eventArgs);
        }
    },

    add_shown: function(handler) {
        this.get_events().addHandler("shown", handler);
    },
    remove_shown: function(handler) {
        this.get_events().removeHandler("shown", handler);
    },
    raiseShown: function() {
        var handlers = this.get_events().getHandler("shown");
        if (handlers) {
            handlers(this, Sys.EventArgs.Empty);
        }
    },

    add_hiding: function(handler) {
        this.get_events().addHandler("hiding", handler);
    },
    remove_hiding: function(handler) {
        this.get_events().removeHandler("hiding", handler);
    },
    raiseHiding: function(eventArgs) {
        var handler = this.get_events().getHandler('hiding');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    add_hidden: function(handler) {
        this.get_events().addHandler("hidden", handler);
    },
    remove_hidden: function(handler) {
        this.get_events().removeHandler("hidden", handler);
    },
    raiseHidden: function() {
        var handlers = this.get_events().getHandler("hidden");
        if (handlers) {
            handlers(this, Sys.EventArgs.Empty);
        }
    },

    show: function() {
        this._ensureColorPicker();

        if (!this._isOpen) {

            var eventArgs = new Sys.CancelEventArgs();
            this.raiseShowing(eventArgs);
            if (eventArgs.get_cancel()) {
                return;
            }

            this._isOpen = true;
            this._popupBehavior.show();
            this.raiseShown();
        }
    },
    hide: function() {
        if (this._isOpen) {
            var eventArgs = new Sys.CancelEventArgs();
            this.raiseHiding(eventArgs);
            if (eventArgs.get_cancel()) {
                return;
            }

            if (this._container) {
                this._popupBehavior.hide();
            }
            this._isOpen = false;
            this.raiseHidden();

            // make sure we clean up the flag due to issues with alert/alt-tab/etc
            this._popupMouseDown = false;
        }
    },
    _focus: function() {
        if (this._button) {
            this._button.focus();
        } else {
            this.get_element().focus();
        }
    },
    _doBlur: function(force) {
        if (!force && Sys.Browser.agent === Sys.Browser.Opera) {
            this._blur.post(true);
        } else {
            if (!this._popupMouseDown) {
                this.hide();
            }
            // make sure we clean up the flag due to issues with alert/alt-tab/etc
            this._popupMouseDown = false;
        }
    },
    _buildColorPicker: function() {
        // Builds the color picker's layout

        var elt = this.get_element();
        var id = this.get_id();

        this._container = $common.createElementFromTemplate({
            nodeName: "div",
            properties: { id: id + "_container" },
            cssClasses: [this._cssClass]
        }, elt.parentNode);

        this._popupDiv = $common.createElementFromTemplate({
            nodeName: "div",
            events: this._popup$delegates,
            properties: {
                id: id + "_popupDiv"
            },
            cssClasses: ["ajax__colorPicker_container"],
            visible: false
        }, this._container);
    },
    _buildColors: function() {
        // Builds a table of colors for the popup

        var id = this.get_id();

        this._colorsTable = $common.createElementFromTemplate({
            nodeName: "table",
            properties: {
                id: id + "_colorsTable",
                style: { margin: "auto" }
            }
        }, this._popupDiv);

        this._colorsBody = $common.createElementFromTemplate({
            nodeName: "tbody",
            properties: { id: id + "_colorsBody" }
        }, this._colorsTable);

        var rgb = ['00', '99', '33', '66', 'FF', 'CC'], color, cssColor;
        var l = rgb.length;

        for (var r = 0; r < l; r++) {
            var colorsRow = $common.createElementFromTemplate({ nodeName: "tr" }, this._colorsBody);
            for (var g = 0; g < l; g++) {
                if (g === 3) {
                    colorsRow = $common.createElementFromTemplate({ nodeName: "tr" }, this._colorsBody);
                }
                for (var b = 0; b < l; b++) {
                    color = rgb[r] + rgb[g] + rgb[b];
                    cssColor = '#' + color;
                    var colorCell = $common.createElementFromTemplate({ nodeName: "td" }, colorsRow);
                    var colorDiv = $common.createElementFromTemplate({
                        nodeName: "div",
                        properties: {
                            id: id + "_color_" + color,
                            color: color,
                            title: cssColor,
                            style: { backgroundColor: cssColor },
                            innerHTML: "&nbsp;"
                        },
                        events: this._cell$delegates
                    }, colorCell);
                }
            }
        }
    },
    _ensureColorPicker: function() {

        if (!this._container) {

            var elt = this.get_element();

            this._buildColorPicker();
            this._buildColors();

            this._popupBehavior = new $create(Sys.Extended.UI.PopupBehavior, { parentElement: elt }, {}, {}, this._popupDiv);
            this._popupBehavior.set_positioningMode(this._popupPosition);
        }
    },
    _showSample: function(value) {
        if (this._sample) {
            var color = "";
            if (value) {
                color = "#" + value;
            }
            this._sample.style.backgroundColor = color;
        }
    },
    _restoreSample: function() {
        this._showSample(this._selectedColor);
    },
    _validate: function(value) {
        return value && Sys.Extended.UI.ColorPickerBehavior._colorRegex.test(value);
    },

    _element_onfocus: function(e) {
        if (!this._enabled) { return; }
        if (!this._button) {
            this.show();
            // make sure we clean up the flag due to issues with alert/alt-tab/etc
            this._popupMouseDown = false;
        }
    },
    _element_onblur: function(e) {
        if (!this._enabled) { return; }
        if (!this._button) {
            this._doBlur();
        }
    },
    _element_onchange: function(e) {
        if (!this._selectedColorChanging) {
            var value = this._textbox.get_Value();
            if (this._validate(value) || value === "") {
                this._selectedColor = value;
                this._restoreSample();
            }
        }
    },
    _element_onkeypress: function(e) {
        if (!this._enabled) { return; }
        if (!this._button && e.charCode === Sys.UI.Key.esc) {
            e.stopPropagation();
            e.preventDefault();
            this.hide();
        }
    },
    _element_onclick: function(e) {
        if (!this._enabled) { return; }
        if (!this._button) {
            this.show();
            // make sure we clean up the flag due to issues with alert/alt-tab/etc
            this._popupMouseDown = false;
        }
    },

    _popup_onevent: function(e) {
        e.stopPropagation();
        e.preventDefault();
    },
    _popup_onmousedown: function(e) {
        // signal that the popup has received a mousedown event, this handles
        // onblur issues on browsers like FF, OP, and SF
        this._popupMouseDown = true;
    },
    _popup_onmouseup: function(e) {
        // signal that the popup has received a mouseup event, this handles
        // onblur issues on browsers like FF, OP, and SF
        if (Sys.Browser.agent === Sys.Browser.Opera && this._blur.get_isPending()) {
            this._blur.cancel();
        }
        this._popupMouseDown = false;
        this._focus();
    },

    _cell_onmouseover: function(e) {
        e.stopPropagation();
        var target = e.target;
        this._showSample(target.color);
    },
    _cell_onmouseout: function(e) {
        e.stopPropagation();
        this._restoreSample();
    },
    _cell_onclick: function(e) {
        e.stopPropagation();
        e.preventDefault();

        if (!this._enabled) {
            return;
        }

        var target = e.target;

        this.set_selectedColor(target.color);
        this._blur.post(true);
        this.raiseColorSelectionChanged();
    },

    _button_onclick: function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this._enabled) {
            return;
        }

        if (!this._isOpen) {
            this.show();
        } else {
            this.hide();
        }
        this._focus();
        // make sure we clean up the flag due to issues with alert/alt-tab/etc
        this._popupMouseDown = false;
    },
    _button_onblur: function(e) {
        if (!this._enabled) {
            return;
        }
        if (!this._popupMouseDown) {
            this.hide();
        }
        // make sure we clean up the flag due to issues with alert/alt-tab/etc
        this._popupMouseDown = false;
    },
    _button_onkeypress: function(e) {
        if (!this._enabled) {
            return;
        }
        if (e.charCode === Sys.UI.Key.esc) {
            e.stopPropagation();
            e.preventDefault();
            this.hide();
        }
        // make sure we clean up the flag due to issues with alert/alt-tab/etc
        this._popupMouseDown = false;
    }
}
Sys.Extended.UI.ColorPickerBehavior.registerClass('Sys.Extended.UI.ColorPickerBehavior', Sys.Extended.UI.BehaviorBase);