Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI._SliderDragDropManagerInternal = function() {
    Sys.Extended.UI._SliderDragDropManagerInternal.initializeBase(this);

    this._instance = null;
}
Sys.Extended.UI._SliderDragDropManagerInternal.prototype = {
    _getInstance: function() {
        this._instance = new Sys.Extended.UI.GenericDragDropManager();

        this._instance.initialize();
        this._instance.add_dragStart(Function.createDelegate(this, this._raiseDragStart));
        this._instance.add_dragStop(Function.createDelegate(this, this._raiseDragStop));

        return this._instance;
    }
}
Sys.Extended.UI._SliderDragDropManagerInternal.registerClass('Sys.Extended.UI._SliderDragDropManagerInternal', Sys.Extended.UI._DragDropManager);
Sys.Extended.UI.SliderDragDropManagerInternal = new Sys.Extended.UI._SliderDragDropManagerInternal();

Sys.Extended.UI.SliderOrientation = function() {

}
Sys.Extended.UI.SliderOrientation.prototype = {
    Horizontal: 0,
    Vertical: 1
}
Sys.Extended.UI.SliderOrientation.registerEnum('Sys.Extended.UI.SliderOrientation', false);

Sys.Extended.UI.SliderBehavior = function(element) {
    Sys.Extended.UI.SliderBehavior.initializeBase(this, [element]);

    this._minimum = 0;
    this._maximum = 100;
    this._value = null;
    this._steps = 0;
    this._decimals = 0;
    this._orientation = Sys.Extended.UI.SliderOrientation.Horizontal;
    this._railElement = null;
    this._railCssClass = null;
    this._isHorizontal = true;
    this._isUpdatingInternal = false;
    this._isInitializedInternal = false;
    this._enableHandleAnimation = false;
    this._handle = null;
    this._handleImage = null;
    this._handleAnimation = null;
    this._handleAnimationDuration = 0.1;
    this._handleImageUrl = null;
    this._handleCssClass = null;
    this._dragHandle = null;
    this._mouseupHandler = null;
    this._selectstartHandler = null;
    this._boundControlChangeHandler = null;
    this._boundControlKeyPressHandler = null;
    this._boundControlID = null;
    this._boundControl = null;
    this._length = null;
    this._raiseChangeOnlyOnMouseUp = true;
    this._animationPending = false;
    this._selectstartPending = false;
    this._tooltipText = '';

    this._enableKeyboard = true;

    this._keyDownHandler = null;

}
Sys.Extended.UI.SliderBehavior.prototype = {

    initialize: function() {
        Sys.Extended.UI.SliderBehavior.callBaseMethod(this, 'initialize');

        this._initializeLayout();
    },

    dispose: function() {
        this._disposeHandlers();

        this._disposeBoundControl();

        if(this._enableHandleAnimation && this._handleAnimation)
            this._handleAnimation.dispose();

        Sys.Extended.UI.SliderBehavior.callBaseMethod(this, 'dispose');
    },

    _initializeLayout: function() {
        this._railElement = document.createElement('DIV');
        this._railElement.id = this.get_id() + '_railElement';

        this._railElement.tabIndex = -1;

        this._railElement.innerHTML = '<div></div>';
        this._handle = this._railElement.childNodes[0];
        this._handle.style.overflow = 'hidden';
        this._handle.style.position = 'absolute';

        if(Sys.Browser.agent == Sys.Browser.Opera) {
            this._handle.style.left = '0px';
            this._handle.style.top = '0px';
        }

        var textBoxElement = this.get_element();
        var textBoxElementBounds = $common.getBounds(textBoxElement);
        textBoxElement.parentNode.insertBefore(this._railElement, textBoxElement);

        this._isHorizontal = (this._orientation == Sys.Extended.UI.SliderOrientation.Horizontal);

        var defaultRailCssClass = (this._isHorizontal) ? 'ajax__slider_h_rail' : 'ajax__slider_v_rail';
        var defaultHandleCssClass = (this._isHorizontal) ? 'ajax__slider_h_handle' : 'ajax__slider_v_handle';
        var defaultHandleImageUrl = (this._isHorizontal)
            ? Sys.Extended.UI.Images["Slider.Handle-Horizontal.gif"]
            : Sys.Extended.UI.Images["Slider.Handle-Vertical.gif"];

        this._railElement.className = (this._railCssClass) ? this._railCssClass : defaultRailCssClass;
        this._handle.className = (this._handleCssClass) ? this._handleCssClass : defaultHandleCssClass;
        if(!this._handleImageUrl)
            this._handleImageUrl = defaultHandleImageUrl;

        if(this._isHorizontal) {
            if(this._length)
                this._railElement.style.width = this._length;
        }
        else {
            if(this._length)
                this._railElement.style.height = this._length;
        }

        this._loadHandleImage();
        this._enforceTextBoxElementPositioning();
        this._hideTextBoxElement();
        this._initializeSlider();
    },

    _enforceTextBoxElementPositioning: function() {
        var tbPosition = {
            position: this.get_element().style.position,
            top: this.get_element().style.top,
            right: this.get_element().style.right,
            bottom: this.get_element().style.bottom,
            left: this.get_element().style.left
        };

        if(tbPosition.position != '')
            this._railElement.style.position = tbPosition.position;
        if(tbPosition.top != '')
            this._railElement.style.top = tbPosition.top;
        if(tbPosition.right != '')
            this._railElement.style.right = tbPosition.right;
        if(tbPosition.bottom != '')
            this._railElement.style.bottom = tbPosition.bottom;
        if(tbPosition.left != '')
            this._railElement.style.left = tbPosition.left;
    },

    _hideTextBoxElement: function() {
        var textBoxElement = this.get_element();

        textBoxElement.readOnly = true;

        var dimension = '0px';

        if(Sys.Browser.agent == Sys.Browser.Safari)
            dimension = '1px';

        textBoxElement.style.width = dimension;
        textBoxElement.style.height = dimension;
        textBoxElement.style.border = '0px';
        textBoxElement.style.padding = '0px';
        textBoxElement.style.margin = '0px';
        textBoxElement.style.fontSize = '1px';
        textBoxElement.style.lineHeight = '1px';
        textBoxElement.style.outline = '0';

        textBoxElement.style.position = 'absolute';
    },

    _loadHandleImage: function() {
        this._handleImage = document.createElement('IMG');
        this._handleImage.id = this.get_id() + '_handleImage';
        this._handle.appendChild(this._handleImage);
        this._handleImage.src = this._handleImageUrl;
    },

    _initializeSlider: function() {
        this._initializeBoundControl();

        var _elementValue;
        try {
            _elementValue = parseFloat(this.get_element().value);
        } catch(ex) {
            _elementValue = Number.NaN;
        }

        this.set_Value(_elementValue);
        this._setHandleOffset(this._value);
        this._initializeDragHandle();

        Sys.Extended.UI.SliderDragDropManagerInternal.registerDropTarget(this);

        this._initializeHandlers();
        this._initializeHandleAnimation();

        this._isInitializedInternal = true;
        this._raiseEvent('sliderInitialized');
    },

    _initializeBoundControl: function() {
        if(this._boundControl) {
            var isInputElement = this._boundControl.nodeName == 'INPUT';

            if(isInputElement) {
                this._boundControlChangeHandler = Function.createDelegate(this, this._onBoundControlChange);
                this._boundControlKeyPressHandler = Function.createDelegate(this, this._onBoundControlKeyPress);

                $addHandler(this._boundControl, 'change', this._boundControlChangeHandler);
                $addHandler(this._boundControl, 'keypress', this._boundControlKeyPressHandler);
            }
        }
    },

    _disposeBoundControl: function() {
        if(this._boundControl) {;
            var isInputElement = this._boundControl.nodeName == 'INPUT';

            if(isInputElement) {
                $removeHandler(this._boundControl, 'change', this._boundControlChangeHandler);
                $removeHandler(this._boundControl, 'keypress', this._boundControlKeyPressHandler);
            }
        }
    },

    _onBoundControlChange: function(evt) {
        this._animationPending = true;
        this._setValueFromBoundControl();
    },

    _onBoundControlKeyPress: function(evt) {
        if(evt.charCode == 13) {
            this._animationPending = true;
            this._setValueFromBoundControl();
            evt.preventDefault();
        }
    },

    _setValueFromBoundControl: function() {
        this._isUpdatingInternal = true;

        if(this._boundControlID)
            this._calcValue($get(this._boundControlID).value);

        this._isUpdatingInternal = false;
    },

    _initializeHandleAnimation: function() {
        if(this._steps > 0) {
            this._enableHandleAnimation = false;
            return;
        }

        if(this._enableHandleAnimation)
            this._handleAnimation = new Sys.Extended.UI.Animation.LengthAnimation(
                    this._handle, this._handleAnimationDuration, 100, 'style');
    },

    _ensureBinding: function() {
        if(this._boundControl) {
            var value = this._value;

            if(value >= this._minimum || value <= this._maximum) {
                var isInputElement = this._boundControl.nodeName == 'INPUT';

                if(isInputElement)
                    this._boundControl.value = value;
                else if(this._boundControl)
                    this._boundControl.innerHTML = value;
            }
        }
    },

    _getBoundsInternal: function(element) {
        var bounds = $common.getBounds(element);

        function hasSize() {
            return bounds.width > 0 && bounds.height > 0;
        }

        if(!hasSize()) {
            bounds.width = parseInt($common.getCurrentStyle(element, 'width'));
            bounds.height = parseInt($common.getCurrentStyle(element, 'height'));

            if(!hasSize()) {
                var tempNode = element.cloneNode(true);
                tempNode.visibility = 'hidden';
                document.body.appendChild(tempNode);

                bounds.width = parseInt($common.getCurrentStyle(tempNode, 'width'));
                bounds.height = parseInt($common.getCurrentStyle(tempNode, 'height'));
                document.body.removeChild(tempNode);

                if(!hasSize())
                    throw Error.argument('element size', Sys.Extended.UI.Resources.Slider_NoSizeProvided);
            }
        }

        if(this._orientation == Sys.Extended.UI.SliderOrientation.Vertical) {
            bounds = {
                x: bounds.y,
                y: bounds.x,
                height: bounds.width,
                width: bounds.height,
                right: bounds.right,
                bottom: bounds.bottom,
                location: { x: bounds.y, y: bounds.x },
                size: { width: bounds.height, height: bounds.width }
            };
        }

        return bounds;
    },

    _getRailBounds: function() {
        var bounds = this._getBoundsInternal(this._railElement);

        return bounds;
    },

    _getHandleBounds: function() {
        return this._getBoundsInternal(this._handle);
    },

    _initializeDragHandle: function() {
        var dh = this._dragHandle = document.createElement('DIV');

        dh.style.position = 'absolute';
        dh.style.width = '1px';
        dh.style.height = '1px';
        dh.style.overflow = 'hidden';
        dh.style.zIndex = '999';
        dh.style.background = 'none';

        document.body.appendChild(this._dragHandle);
    },

    _resetDragHandle: function() {
        var handleBounds = $common.getBounds(this._handle);

        $common.setLocation(this._dragHandle, { x: handleBounds.x, y: handleBounds.y });
    },

    _initializeHandlers: function() {
        this._selectstartHandler = Function.createDelegate(this, this._onSelectStart);
        this._mouseupHandler = Function.createDelegate(this, this._onMouseUp);

        this._keyDownHandler = Function.createDelegate(this, this._onKeyDown);

        $addHandler(document, 'mouseup', this._mouseupHandler);

        $addHandler(this.get_element(), 'keydown', this._keyDownHandler);

        $addHandlers(this._handle, {
            'mousedown': this._onMouseDown,
            'dragstart': this._IEDragDropHandler,
            'drag': this._IEDragDropHandler,
            'dragend': this._IEDragDropHandler
        },
            this);

        $addHandlers(this._railElement, {
            'click': this._onRailClick
        },
            this);
    },

    _disposeHandlers: function() {
        $clearHandlers(this._handle);
        $clearHandlers(this._railElement);

        $removeHandler(this.get_element(), 'keydown', this._keyDownHandler);

        $removeHandler(document, 'mouseup', this._mouseupHandler);

        this._keyDownHandler = null;
        this._mouseupHandler = null;
        this._selectstartHandler = null;
    },

    startDragDrop: function(dragVisual) {
        this._resetDragHandle();

        Sys.Extended.UI.SliderDragDropManagerInternal.startDragDrop(this, dragVisual, null);
    },

    _onMouseDown: function(evt) {
        window._event = evt;
        evt.preventDefault();

        if(!Sys.Extended.UI.SliderBehavior.DropPending) {
            Sys.Extended.UI.SliderBehavior.DropPending = this;

            $addHandler(document, 'selectstart', this._selectstartHandler);
            this._selectstartPending = true;

            this.startDragDrop(this._dragHandle);
        }
    },

    _onMouseUp: function(evt) {
        var srcElement = evt.target;

        if(Sys.Extended.UI.SliderBehavior.DropPending == this) {
            Sys.Extended.UI.SliderBehavior.DropPending = null;

            if(this._selectstartPending)
                $removeHandler(document, 'selectstart', this._selectstartHandler);
        }
    },

    _onKeyDown: function(e) {
        if(this._enableKeyboard) {
            var evt = new Sys.UI.DomEvent(e);

            switch(evt.keyCode || evt.rawEvent.keyCode) {
                case Sys.UI.Key.up:
                case Sys.UI.Key.left:
                    this._handleSlide(true);
                    evt.preventDefault();
                    return;
                case Sys.UI.Key.down:
                case Sys.UI.Key.right:
                    this._handleSlide(false);
                    evt.preventDefault();
                    return false;
                default:
                    return false;
            }
        }
    },

    _handleSlide: function(decrement) {
        this._animationPending = true;

        this._isUpdatingInternal = true;

        var currentValue = this.get_Value();
        var increment;

        if(this._steps > 0) {
            var extent = this._maximum - this._minimum;

            var delta = (extent / (this._steps - 1)).toFixed(this._decimals);

            increment = delta;
        } else {
            increment = this._decimals == 0 ? 1 : 1 / Math.pow(10, this._decimals);
        }

        if(decrement)
            increment = 0 - increment

        this._calcValue(parseFloat(currentValue) + parseFloat(increment));
        this._isUpdatingInternal = false;
        this._fireTextBoxChangeEvent();
    },

    _onRailClick: function(evt) {
        if(evt.target == this._railElement) {
            this._animationPending = true;
            this._onRailClicked(evt);
        }
    },

    _IEDragDropHandler: function(evt) {
        evt.preventDefault();
    },

    _onSelectStart: function(evt) {
        evt.preventDefault();
    },

    _calcValue: function(value, mouseOffset) {
        var val;

        if(value != null) {
            if(!Number.isInstanceOfType(value)) {
                try {
                    value = parseFloat(value);
                } catch(ex) {
                    value = Number.NaN;
                }
            }

            if(isNaN(value))
                value = this._minimum;

            val = (value < this._minimum) ? this._minimum
                : (value > this._maximum) ? this._maximum
                : value;
        }
        else {
            var _minimum = this._minimum;
            var _maximum = this._maximum;
            var handleBounds = this._getHandleBounds();
            var sliderBounds = this._getRailBounds();
            var handleX = (mouseOffset) ? mouseOffset - handleBounds.width / 2
                                        : handleBounds.x - sliderBounds.x;
            var extent = sliderBounds.width - handleBounds.width;
            var percent = handleX / extent;

            val = (handleX == 0) ? _minimum
                : (handleX == (sliderBounds.width - handleBounds.width)) ? _maximum
                : _minimum + percent * (_maximum - _minimum);
        }

        if(this._steps > 0)
            val = this._getNearestStepValue(val);

        val = (val < this._minimum) ? this._minimum
            : (val > this._maximum) ? this._maximum
            : val;

        this._isUpdatingInternal = true;
        this.set_Value(val);
        this._isUpdatingInternal = false;

        return val;
    },

    _setHandleOffset: function(value, playHandleAnimation) {
        var _minimum = this._minimum;
        var _maximum = this._maximum;
        var handleBounds = this._getHandleBounds();
        var sliderBounds = this._getRailBounds();

        var extent = _maximum - _minimum;
        var fraction = (value - _minimum) / extent;
        var hypOffset = Math.round(fraction * (sliderBounds.width - handleBounds.width));

        var offset = (value == _minimum) ? 0
                   : (value == _maximum) ? (sliderBounds.width - handleBounds.width)
                   : hypOffset;

        if(playHandleAnimation) {
            this._handleAnimation.set_startValue(handleBounds.x - sliderBounds.x);
            this._handleAnimation.set_endValue(offset);
            this._handleAnimation.set_propertyKey((this._isHorizontal) ? 'left' : 'top');
            this._handleAnimation.play();

            this._animationPending = false;
        }
        else {
            if(this._isHorizontal)
                this._handle.style.left = offset + 'px';
            else
                this._handle.style.top = offset + 'px';
        }
    },

    _getNearestStepValue: function(value) {
        if(this._steps == 0)
            return value;

        var extent = this._maximum - this._minimum;
        if(extent == 0)
            return value;

        var delta = extent / (this._steps - 1);

        return Math.round(value / delta) * delta;
    },

    _onHandleReleased: function() {
        if(this._raiseChangeOnlyOnMouseUp)
            this._fireTextBoxChangeEvent();

        this._raiseEvent('slideEnd');
    },

    _onRailClicked: function(evt) {
        var handleBounds = this._getHandleBounds();
        var sliderBounds = this._getRailBounds();
        var offset = (this._isHorizontal) ? evt.offsetX : evt.offsetY;
        var minOffset = handleBounds.width / 2;
        var maxOffset = sliderBounds.width - minOffset;

        offset = (offset < minOffset) ? minOffset
               : (offset > maxOffset) ? maxOffset
               : offset;

        this._calcValue(null, offset, true);

        this.get_element().focus();

        this._fireTextBoxChangeEvent();
    },

    _fireTextBoxChangeEvent: function() {
        if(document.createEvent) {
            var onchangeEvent = document.createEvent('HTMLEvents');
            onchangeEvent.initEvent('change', true, false);

            this.get_element().dispatchEvent(onchangeEvent);
        }
        else if(document.createEventObject) {
            this.get_element().fireEvent('onchange');
        }
    },

    get_dragDataType: function() {
        return 'HTML';
    },

    getDragData: function() {
        return this._handle;
    },

    get_dragMode: function() {
        return Sys.Extended.UI.DragMode.Move;
    },

    onDragStart: function() {
        this.get_element().focus();

        this._resetDragHandle();
        this._raiseEvent('slideStart');
    },

    onDrag: function() {
        var dragHandleBounds = this._getBoundsInternal(this._dragHandle);
        var handleBounds = this._getHandleBounds();
        var sliderBounds = this._getRailBounds();

        var handlePosition;
        if(this._isHorizontal)
            handlePosition = { x: dragHandleBounds.x - sliderBounds.x, y: 0 };
        else
            handlePosition = { y: dragHandleBounds.x - sliderBounds.x, x: 0 };

        $common.setLocation(this._handle, handlePosition);

        this._calcValue(null, null);

        if(this._steps > 1)
            this._setHandleOffset(this.get_Value(), false);
    },

    onDragEnd: function() {
        this._onHandleReleased();
    },

    get_dropTargetElement: function() {
        return document.body;
    },

    canDrop: function(dragMode, dataType) {
        return dataType == 'HTML';
    },

    drop: Function.emptyMethod,

    onDragEnterTarget: Function.emptyMethod,

    onDragLeaveTarget: Function.emptyMethod,

    onDragInTarget: Function.emptyMethod,

    add_sliderInitialized: function(handler) {
        this.get_events().addHandler('sliderInitialized', handler);
    },

    remove_sliderInitialized: function(handler) {
        this.get_events().removeHandler('sliderInitialized', handler);
    },

    add_valueChanged: function(handler) {
        this.get_events().addHandler('valueChanged', handler);
    },

    remove_valueChanged: function(handler) {
        this.get_events().removeHandler('valueChanged', handler);
    },

    add_slideStart: function(handler) {
        this.get_events().addHandler('slideStart', handler);
    },

    remove_slideStart: function(handler) {
        this.get_events().removeHandler('slideStart', handler);
    },

    add_slideEnd: function(handler) {
        this.get_events().addHandler('slideEnd', handler);
    },

    remove_slideEnd: function(handler) {
        this.get_events().removeHandler('slideEnd', handler);
    },

    _raiseEvent: function(eventName, eventArgs) {
        var handler = this.get_events().getHandler(eventName);
        if(handler) {
            if(!eventArgs)
                eventArgs = Sys.EventArgs.Empty;
            handler(this, eventArgs);
        }
    },

    get_Value: function() {
        return this._value;
    },

    set_Value: function(value) {
        var oldValue = this._value;
        var newValue = value;

        if(!this._isUpdatingInternal)
            newValue = this._calcValue(value);

        this.get_element().value = this._value = newValue.toFixed(this._decimals);

        this._ensureBinding();

        if(!Number.isInstanceOfType(this._value)) {
            try {
                this._value = parseFloat(this._value);
            } catch(ex) {
                this._value = Number.NaN;
            }
        }

        if(this._tooltipText)
            this._handle.alt = this._handle.title = String.format(this._tooltipText, this._value);

        if(this._isInitializedInternal) {
            this._setHandleOffset(newValue, this._enableHandleAnimation && this._animationPending);

            if(this._isUpdatingInternal)
                if(!this._raiseChangeOnlyOnMouseUp)
                    this._fireTextBoxChangeEvent();

            if(this._value != oldValue)
                this._raiseEvent('valueChanged');
        }
    },

    get_RailCssClass: function() {
        return this._railCssClass;
    },

    set_RailCssClass: function(value) {
        this._railCssClass = value;
    },

    get_HandleImageUrl: function() {
        return this._handleImageUrl;
    },

    set_HandleImageUrl: function(value) {
        this._handleImageUrl = value;
    },

    get_HandleCssClass: function() {
        return this._handleCssClass;
    },

    set_HandleCssClass: function(value) {
        this._handleCssClass = value;
    },

    get_Minimum: function() {
        return this._minimum;
    },

    set_Minimum: function(value) {
        this._minimum = value;
    },

    get_Maximum: function() {
        return this._maximum;
    },

    set_Maximum: function(value) {
        this._maximum = value;
    },

    get_Orientation: function() {
        return this._orientation;
    },

    set_Orientation: function(value) {
        this._orientation = value;
    },

    get_Steps: function() {
        return this._steps;
    },

    set_Steps: function(value) {
        this._steps = Math.abs(value);
        this._steps = (this._steps == 1) ? 2 : this._steps;
    },

    get_Decimals: function() {
        return this._decimals;
    },

    set_Decimals: function(value) {
        this._decimals = Math.abs(value);
    },

    get_EnableHandleAnimation: function() {
        return this._enableHandleAnimation;
    },

    set_EnableHandleAnimation: function(value) {
        this._enableHandleAnimation = value;
    },

    get_HandleAnimationDuration: function() {
        return this._handleAnimationDuration;
    },

    set_HandleAnimationDuration: function(value) {
        this._handleAnimationDuration = value;
    },

    get_BoundControlID: function() {
        return this._boundControlID;
    },

    set_BoundControlID: function(value) {
        this._boundControlID = value;
        if(this._boundControlID)
            this._boundControl = $get(this._boundControlID);
        else
            this._boundControl = null;
    },

    get_Length: function() {
        return this._length;
    },

    set_Length: function(value) {
        this._length = value + 'px';
    },

    get_SliderInitialized: function() {
        return this._isInitializedInternal;
    },

    get_RaiseChangeOnlyOnMouseUp: function() {
        return this._raiseChangeOnlyOnMouseUp;
    },

    set_RaiseChangeOnlyOnMouseUp: function(value) {
        this._raiseChangeOnlyOnMouseUp = value;
    },

    get_TooltipText: function() {
        return this._tooltipText;
    },

    set_TooltipText: function(value) {
        this._tooltipText = value;
    },

    get_enableKeyboard: function() {
        // Determines if the slider will respond to arrow keys when it has focus.
        return this._enableKeyboard;
    },
    set_enableKeyboard: function(value) {
        // Determines if the slider will respond to arrow keys when it has focus.
        if(value !== this._enableKeyboard) {
            this._enableKeyboard = value;
            this.raisePropertyChanged('enableKeyboard');
        }
    },

    getClientState: function() {
        var value = Sys.Extended.UI.SliderBehavior.callBaseMethod(this, 'get_ClientState');
        if(value == '')
            value = null;
        return value;
    },

    setClientState: function(value) {
        return Sys.Extended.UI.SliderBehavior.callBaseMethod(this, 'set_ClientState', [value]);
    }
}

Sys.Extended.UI.SliderBehavior.DropPending = null; // Global, used to work around an issue when using the GenericDragDropManager in IE.
Sys.Extended.UI.SliderBehavior.registerClass('Sys.Extended.UI.SliderBehavior', Sys.Extended.UI.BehaviorBase, Sys.Extended.UI.IDragSource, Sys.Extended.UI.IDropTarget);
