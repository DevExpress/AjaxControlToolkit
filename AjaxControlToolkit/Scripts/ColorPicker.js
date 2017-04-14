Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.ColorPickerBehavior = function(element) {
    // A behavior that attaches a color picker to a textbox
    Sys.Extended.UI.ColorPickerBehavior.initializeBase(this, [element]);

    this._textbox = Sys.Extended.UI.TextBoxWrapper.get_Wrapper(element);
    this._button = null;
    this._sample = null;
    this._cssClass = "ajax__colorPicker";
    this._popupPosition = Sys.Extended.UI.PositioningMode.BottomLeft;
    this._paletteStyle = Sys.Extended.UI.ColorPickerPaletteStyle.Default;
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

    /// <summary>
    /// The Sys.UI.DomElement object that represents a button to use to show the color picker.
    /// </summary>
    /// <remarks>
    /// This property is optional.
    /// </remarks>
    /// <getter>get_button</getter>
    /// <setter>set_button</setter>
    /// <member name="cP:AjaxControlToolkit.ColorPickerExtender.button" />
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

    /// <summary>
    /// The Sys.UI.DomElement object that represents an element to use to preview the color that is currently selected or over which a user is holding the mouse pointer.
    /// </summary>
    /// <remarks>
    /// This property is optional.
    /// </remarks>
    /// <getter>get_sample</getter>
    /// <setter>set_sample</setter>
    /// <member name="cP:AjaxControlToolkit.ColorPickerExtender.sample" />
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

    /// <summary>
    /// A string that contains a color value that is represented by the text box.
    /// </summary>
    /// <getter>get_selectedColor</getter>
    /// <setter>set_selectedColor</setter>
    /// <member name="cP:AjaxControlToolkit.ColorPickerExtender.selectedColor" />
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

    /// <summary>
    /// A Boolean value that specifies whether or not ColorPicker behavior is available for the current element.
    /// </summary>
    /// <getter>get_enabled</getter>
    /// <setter>set_enabled</setter>
    /// <member name="cP:AjaxControlToolkit.ColorPickerExtender.enabled" />
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

    /// <summary>
    /// The Sys.Extended.UI.PositionMode object that represents where the popup should be positioned relative to the target control.
    /// The default is BottomLeft.
    /// </summary>
    /// <getter>get_popupPosition</getter>
    /// <setter>set_popupPosition</setter>
    /// <member name="cP:AjaxControlToolkit.ColorPickerExtender.popupPosition" />
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

    /// <summary>
    /// The Sys.Extended.UI.PaletteStyle object that represents which color palette is used.
    /// The default is Default.
    /// </summary>
    /// <getter>get_paletteStyle</getter>
    /// <setter>set_paletteStyle</setter>
    /// <member name="cP:AjaxControlToolkit.ColorPickerExtender.paletteStyle" />
    get_paletteStyle: function () {
        return this._paletteStyle;
    },
    set_paletteStyle: function (value) {
        if (this._paletteStyle !== value) {
            this._paletteStyle = value;
            this.raisePropertyChanged('paletteStyle');
        }
    },

    /// <summary>
    /// Fires when color selection is changed.
    /// </summary>
    /// <event add="add_colorSelectionChanged" remove="remove_colorSelectionChanged" raise="raise_colorSelectionChanged" />
    /// <member name="cE:AjaxControlToolkit.ColorPickerExtender.colorSelectionChanged" />
    add_colorSelectionChanged: function(handler) {
        this.get_events().addHandler("colorSelectionChanged", handler);
    },
    remove_colorSelectionChanged: function(handler) {
        this.get_events().removeHandler("colorSelectionChanged", handler);
    },
    raise_colorSelectionChanged: function() {
        var handlers = this.get_events().getHandler("colorSelectionChanged");
        if (handlers) {
            handlers(this, Sys.EventArgs.Empty);
        }
    },
    raiseColorSelectionChanged: function() {
        Sys.Extended.Deprecated("raiseColorSelectionChanged", "raise_colorSelectionChanged");
        this.raise_colorSelectionChanged();
    },

    /// <summary>
    /// Fires when the control is being shown.
    /// </summary>
    /// <event add="add_showing" remove="remove_showing" raise="raise_showing" />
    /// <member name="cE:AjaxControlToolkit.ColorPickerExtender.showing" />
    add_showing: function(handler) {
        this.get_events().addHandler("showing", handler);
    },
    remove_showing: function(handler) {
        this.get_events().removeHandler("showing", handler);
    },
    raise_showing: function(eventArgs) {
        var handler = this.get_events().getHandler('showing');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    raiseShowing: function(eventArgs) {
        Sys.Extended.Deprecated("raiseShowing", "raise_showing");
        this.raise_showing(eventArgs);
    },

    /// <summary>
    /// Fires after the control is shown.
    /// </summary>
    /// <event add="add_shown" remove="remove_shown" raise="raise_shown" />
    /// <member name="cE:AjaxControlToolkit.ColorPickerExtender.shown" />
    add_shown: function(handler) {
        this.get_events().addHandler("shown", handler);
    },
    remove_shown: function(handler) {
        this.get_events().removeHandler("shown", handler);
    },
    raise_shown: function() {
        var handlers = this.get_events().getHandler("shown");
        if (handlers) {
            handlers(this, Sys.EventArgs.Empty);
        }
    },
    raiseShown: function() {
        Sys.Extended.Deprecated("raiseShown", "raise_shown");
        this.raise_shown();
    },

    /// <summary>
    /// Fires when the control is being hidden.
    /// </summary>
    /// <event add="add_hiding" remove="remove_hiding" raise="raise_hiding" />
    /// <member name="cE:AjaxControlToolkit.ColorPickerExtender.hiding" />
    add_hiding: function(handler) {
        this.get_events().addHandler("hiding", handler);
    },
    remove_hiding: function(handler) {
        this.get_events().removeHandler("hiding", handler);
    },
    raise_hiding: function(eventArgs) {
        var handler = this.get_events().getHandler('hiding');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    raiseHiding: function(eventArgs) {
        Sys.Extended.Deprecated("raiseHiding", "raise_hiding");
        this.raise_hiding(eventArgs);
    },

    /// <summary>
    /// Fires after the control is hidden.
    /// </summary>
    /// <event add="add_hidden" remove="remove_hidden" raise="raise_hidden" />
    /// <member name="cE:AjaxControlToolkit.ColorPickerExtender.hidden" />
    add_hidden: function(handler) {
        this.get_events().addHandler("hidden", handler);
    },
    remove_hidden: function(handler) {
        this.get_events().removeHandler("hidden", handler);
    },
    raise_hidden: function() {
        var handlers = this.get_events().getHandler("hidden");
        if (handlers) {
            handlers(this, Sys.EventArgs.Empty);
        }
    },
    raiseHidden: function() {
        Sys.Extended.Deprecated("raiseHidden", "raise_hidden");
        this.raise_hidden();
    },

    /// <summary>
    /// Shows the color picker.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ColorPickerExtender.show" />
    show: function() {
        this._ensureColorPicker();

        if (!this._isOpen) {

            var eventArgs = new Sys.CancelEventArgs();
            this.raise_showing(eventArgs);
            if (eventArgs.get_cancel()) {
                return;
            }

            this._isOpen = true;
            this._popupBehavior.show();
            this.raise_shown();
        }
    },

    /// <summary>
    /// Hides the color picker.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ColorPickerExtender.hide" />
    hide: function() {
        if (this._isOpen) {
            var eventArgs = new Sys.CancelEventArgs();
            this.raise_hiding(eventArgs);
            if (eventArgs.get_cancel()) {
                return;
            }

            if (this._container) {
                this._popupBehavior.hide();
            }
            this._isOpen = false;
            this.raise_hidden();

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

        switch (this._paletteStyle) {
            case Sys.Extended.UI.ColorPickerPaletteStyle.Default:
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
                            this._createColorCell(color, colorsRow);
                        }
                    }
                }
                break;
            case Sys.Extended.UI.ColorPickerPaletteStyle.Continuous:
                var step = 100 / 12;
                for(var l = 0; l <= 100; l = l + step) {
                    var colorsRow = $common.createElementFromTemplate({ nodeName: "tr" }, this._colorsBody);
                    for (var h = 0; h < 360; h = h + 20) {
                        rgb = this._hslToRgb(h / 360, 1, l / 100);
                        color = this._rgbToHex(rgb[0], rgb[1], rgb[2]);
                        this._createColorCell(color, colorsRow);
                    }
                }                
                break;
        }
    },
    _rgbToHex: function(r, g, b){
        function padHex(n){
            var nHex = n.toString(16);
            return (n < 16) ? ("0" + nHex) : nHex;
        }

        return padHex(r) + padHex(g) + padHex(b);
    },
    _hslToRgb: function(h, s, l){
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        var r = this._hue2rgb(p, q, h + 1 / 3);
        var g = this._hue2rgb(p, q, h);
        var b = this._hue2rgb(p, q, h - 1 / 3);

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    },
    _hue2rgb: function(p, q, t){
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    },
    _createColorCell: function (color, colorsRow) {
        var cssColor = '#' + color;
        var colorCell = $common.createElementFromTemplate({ nodeName: "td" }, colorsRow);
        $common.createElementFromTemplate({
            nodeName: "div",
            properties: {
                color: color,
                title: cssColor,
                style: { backgroundColor: cssColor },
                innerHTML: "&nbsp;"
            },
            events: this._cell$delegates
        }, colorCell);
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
        this.raise_colorSelectionChanged();
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

Sys.Extended.UI.ColorPickerPaletteStyle = {
    Default: 0,
    Continuous: 1
}