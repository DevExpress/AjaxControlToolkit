Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI._MultiHandleSliderDragDropInternal = function() {
    Sys.Extended.UI._MultiHandleSliderDragDropInternal.initializeBase(this);
    this._instance = null;
};

Sys.Extended.UI._MultiHandleSliderDragDropInternal.prototype = {
    _getInstance: function() {
        // Do not use singleton pattern here; it will break the DragDropScripts.js implementation!
        this._instance = new Sys.Extended.UI.GenericDragDropManager();
        this._instance.initialize();
        this._instance.add_dragStart(Function.createDelegate(this, this._raiseDragStart));
        this._instance.add_dragStop(Function.createDelegate(this, this._raiseDragStop));

        return this._instance;
    }
};

Sys.Extended.UI._MultiHandleSliderDragDropInternal.registerClass('Sys.Extended.UI._MultiHandleSliderDragDropInternal', Sys.Extended.UI._DragDropManager);
Sys.Extended.UI.DragDrop = new Sys.Extended.UI._MultiHandleSliderDragDropInternal();

Sys.Extended.UI.MultiHandleInnerRailStyle = function() {
};

Sys.Extended.UI.MultiHandleInnerRailStyle.prototype = {
    AsIs: 0,
    SlidingDoors: 1
};

Sys.Extended.UI.MultiHandleInnerRailStyle.registerEnum('Sys.Extended.UI.MultiHandleInnerRailStyle', false);

Sys.Extended.UI.MultiHandleSliderOrientation = function() {
};

Sys.Extended.UI.MultiHandleSliderOrientation.prototype = {
    Horizontal: 0,
    Vertical: 1
};

Sys.Extended.UI.MultiHandleSliderOrientation.registerEnum('Sys.Extended.UI.MultiHandleSliderOrientation', false);

Sys.Extended.UI.MultiHandleSliderBehavior = function(element) {
    // A behavior that attaches a multi-handled slider to a TextBox control.

    Sys.Extended.UI.MultiHandleSliderBehavior.initializeBase(this, [element]);

    // Extender Properties
    this._isServerControl = false;
    this._minimum = null;
    this._maximum = null;
    this._orientation = Sys.Extended.UI.MultiHandleSliderOrientation.Horizontal;
    this._cssClass = null;
    this._multiHandleSliderTargets = null;
    this._length = 150;
    this._steps = 0;
    this._enableHandleAnimation = false;
    this._showInnerRail = false;
    this._showHoverStyle = false;
    this._showDragStyle = false;
    this._raiseChangeOnlyOnMouseUp = true;
    this._innerRailStyle = Sys.Extended.UI.MultiHandleInnerRailStyle.AsIs;
    this._enableInnerRangeDrag = false;
    this._enableRailClick = true;
    this._isReadOnly = false;
    this._increment = 1;
    this._enableKeyboard = true;
    this._enableMouseWheel = true;
    this._tooltipText = '';

    // Backwards-compatibility Properties
    this._boundControlID = null;
    this._handleCssClass = null;
    this._handleImageUrl = null;
    this._handleImage = null;
    this._railCssClass = null;
    this._decimals = 0;

    // Private Fields
    this._textBox = null;
    this._wrapper = null;
    this._outer = null;
    this._inner = null;
    this._handleData = null;
    this._handleAnimationDuration = 0.02;
    this._handles = 0;
    this._innerDragFlag = false;
    this._isVertical = false;

    // Global Handlers
    this._selectStartHandler = null;
    this._mouseUpHandler = null;
    this._mouseOutHandler = null;
    this._keyDownHandler = null;
    this._mouseWheelHandler = null;
    this._mouseOverHandler = null;

    // Callbacks

    // State
    this._animationPending = false;
    this._selectStartPending = false;
    this._initialized = false;
    this._handleUnderDrag = null;
    this._innerDrag = false;
    this._blockInnerClick = false;
};

Sys.Extended.UI.MultiHandleSliderBehavior.prototype = {

    initialize: function() {
        Sys.Extended.UI.MultiHandleSliderBehavior.callBaseMethod(this, 'initialize');

        // Determine internal variables from configuration
        if(this._boundControlID && !this._multiHandleSliderTargets) {
            // Backwards compatibility support for upgrading existing SliderExtenders
            this._multiHandleSliderTargets = [{
                "ControlID": this._boundControlID,
                "HandleCssClass": this._handleCssClass,
                "HandleImageUrl": this._handleImageUrl,
                "Decimals": this._decimals
            }];
        }

        this._handles = this._multiHandleSliderTargets ? this._multiHandleSliderTargets.length : 0;
        if(this._handles === 0) {
            // Support a boundless extender
            var boundless = document.createElement("INPUT");
            boundless.id = "boundless";
            boundless.style.display = "none";
            boundless.value = this.get_minimum();
            document.forms[0].appendChild(boundless);

            this._multiHandleSliderTargets = [{
                "ControlID": boundless.id,
                "HandleCssClass": this._handleCssClass,
                "HandleImageUrl": this._handleImageUrl,
                "Decimals": this._decimals
            }];
            this._boundControlID = boundless.id;
            this._handles = 1;
        }

        this._isVertical = this._orientation === Sys.Extended.UI.MultiHandleSliderOrientation.Vertical;

        this._resolveNamingContainer();
        this._createWrapper();
        this._createOuterRail();
        this._createHandles();
        this._createInnerRail();
        this._setRailStyles();

        if(this._length)
            if(!this._cssClass && this._innerRailStyle !== Sys.Extended.UI.MultiHandleInnerRailStyle.SlidingDoors)
                if(this._isVertical)
                    this._outer.style.height = this._length + "px";
                else
                    this._outer.style.width = this._length + "px";

        this._build();
        this._enforceElementPositioning();
        this._initializeSlider();
    },

    // Public Methods

    dispose: function() {
        this._disposeHandlers();
        this._disposeMultiHandleSliderTargets();

        if(this._enableHandleAnimation && this._handleAnimation)
            this._handleAnimation.dispose();

        Sys.Extended.UI.MultiHandleSliderBehavior.callBaseMethod(this, 'dispose');
    },

    get_SliderInitialized: function() {
        // Gets whether this slider is initialized. This is here for backwards compatibility
        // with the original Slider.
        return this._initialized;
    },

    getValue: function(index) {
        // Gets the value of a specific slider handle programmatically by index.
        var multiHandleSliderTarget = $get(this._multiHandleSliderTargets[index].ControlID);
        return multiHandleSliderTarget.value;
    },

    setValue: function(index, value) {
        // Sets the value of a specific slider handle programmatically by index.
        var multiHandleSliderTarget = $get(this._multiHandleSliderTargets[index].ControlID);
        if(multiHandleSliderTarget) {
            this.beginUpdate();
            this._setMultiHandleSliderTargetValue(multiHandleSliderTarget, this._getNearestStepValue(value));
            this.endUpdate();
        }
    },

    get_values: function() {
        // Gets all handle values as a comma-delimited string. This is required
        // for the automated toolkit test behavior.
        // returns a comma-delimited string of handle values.

        var values = [this._handles];
        for(var i = 0; i < this._handles; i++) {
            var control = this._multiHandleSliderTargets[i];
            values[i] = control.value;
        }

        return values.join(',');
    },

    // Private Methods    

    _build: function() {
        // Assembles the generated slider DOM elements on the page.

        this._textBox = this.get_element();
        this._textBox.parentNode.insertBefore(this._wrapper, this._textBox);
        this._wrapper.appendChild(this._outer);

        if(this._inner && this._showInnerRail)
            this._outer.appendChild(this._inner);

        this._textBox.style.display = 'none';
    },

    _calculateInnerRailOffset: function(e) {
        // Calculates the offset of the inner rail.

        var edge = this._isVertical ? this._inner.style.top : this._inner.style.left;
        var offset = this._isVertical ? e.offsetY : e.offsetX;
        offset += parseInt(edge, 10);

        return offset;
    },

    _calculateClick: function(offset) {
        // Calculates where to move a handle during a rail click event.

        var railBounds = this._getOuterBounds(),
            closestHandle = this._handleData[0];

        var handleBounds = this._getBoundsInternal(closestHandle);
        closestHandle = this._calculateClosestHandle(offset);

        var minOffset = handleBounds.width / 2,
            maxOffset = railBounds.width - minOffset;

        offset = (offset < minOffset) ? minOffset : (offset > maxOffset) ? maxOffset : offset;

        var multiHandleSliderTarget = $get(closestHandle.multiHandleSliderTargetID);
        this._calculateMultiHandleSliderTargetValue(multiHandleSliderTarget, offset, true);
        $common.tryFireEvent(this.get_element(), "change");
    },

    _calculateClosestHandle: function(offset) {
        // Calculates the closest handle to a mouse click.

        var closestHandle = this._handleData[0],
            distances = [this._handles],
            outer = this._getOuterBounds();

        for(var i = 0; i < this._handles; i++) {
            var handle = this._handleData[i],
                bounds = this._getBoundsInternal(handle);

            var pos = this._isVertical ? handle.offsetTop : bounds.x - outer.x;
            distances[i] = Math.abs(pos - offset);
        }

        var delta = distances[0];
        for(i = 0; i < this._handles; i++) {
            var d = distances[i];

            if(d < delta) {
                handle = this._handleData[i];
                delta = d;
                closestHandle = handle;
            }
        }

        // Determine precedent inner range
        if(this._innerDrag) {
            var index = Array.indexOf(this._handleData, closestHandle),
                location = Sys.UI.DomElement.getLocation(closestHandle),
                locationOffset = this._isVertical ? location.y : location.x - outer.x;

            if(locationOffset >= (offset + distances[index])) {
                // Get the handle before the one we chose
                var newHandle = this._handleData[index - 1];

                if(newHandle)
                    closestHandle = newHandle;
            }
        }

        return closestHandle;
    },

    _calculateMultiHandleSliderTargetValue: function(multiHandleSliderTarget, mouseOffset, computed) {
        // Determines the closest value to set a bound control
        var secondaryHandle,
            secondaryMultiHandleSliderTarget,
            min = this._minimum,
            max = this._maximum;

        if(this._handleUnderDrag && !multiHandleSliderTarget) {
            handle = this._handleUnderDrag;
            multiHandleSliderTarget = $get(this._handleUnderDrag.multiHandleSliderTargetID);

            if(this._innerDrag) {
                var primary = Array.indexOf(this._handleData, handle);
                secondaryHandle = this._handleData[primary + 1];

                if(!secondaryHandle)
                    // On the last handle; use the previous instead
                    secondaryHandle = this._handleData[primary - 1];

                secondaryMultiHandleSliderTarget = $get(secondaryHandle.multiHandleSliderTargetID);
            }
        }

        var handle = multiHandleSliderTarget.Handle, value = multiHandleSliderTarget.value;

        if(value && !computed) {
            if(typeof (value) !== 'number')
                try {
                    value = parseFloat(value);
                } catch(ex) {
                    value = Number.NaN;
                }

            if(isNaN(value))
                value = this._minimum;

            // Range constraints
            val = Math.max(Math.min(value, max), min);
        } else {
            var handleBounds = this._getBoundsInternal(handle),
                railBounds = this._getOuterBounds(),
                mark = (mouseOffset) ? mouseOffset - handleBounds.width / 2 : handleBounds.x - railBounds.x,
                extent = railBounds.width - handleBounds.width, percent = mark / extent;

            val = Math.max(Math.min(value, max), min);
            val = (mark === 0) ? min : (mark === (railBounds.width - handleBounds.width)) ? max : min + percent * (max - min);
        }

        // Steps
        if(this._steps > 0)
            val = this._getNearestStepValue(val);

        // Range constraints
        val = Math.max(Math.min(val, max), min);

        // Collision
        var previousControls = [],
            nextControls = [],
            cp = 0,
            cn = 0,
            block,
            prev = true;

        for(var i = 0; i < this._handles; i++) {
            var vc = this._multiHandleSliderTargets[i];

            if(!vc.ControlID.match(multiHandleSliderTarget.id)) {
                if(prev) {
                    previousControls[cp] = this._multiHandleSliderTargets[i];
                    cp++;
                } else {
                    nextControls[cn] = this._multiHandleSliderTargets[i];
                    cn++;
                }
            } else {
                prev = false;
            }
        }

        if(cp > 0) {
            var p = parseFloat($get(previousControls[cp - 1].ControlID).value);
            val = Math.max(val, p);
            block = val === p;
        }

        if(cn > 0) {
            var n = parseFloat($get(nextControls[0].ControlID).value);
            val = Math.min(val, n);
            block = val === n;
        }

        if(secondaryHandle) {
            var delta = val - parseFloat(value),
                secondaryValue = parseFloat(secondaryMultiHandleSliderTarget.value),
                secondaryVal = secondaryValue + delta;

            // Find next maximum if there are other handles
            var nextIndex = Array.indexOf(this._handleData, secondaryHandle) + 1;
            if(nextIndex < this._multiHandleSliderTargets.length)
                var nextMultiHandleSliderTargetID = this._multiHandleSliderTargets[nextIndex].ControlID;

            if(nextMultiHandleSliderTargetID)
                var nextMultiHandleSliderTarget = $get(nextMultiHandleSliderTargetID);

            if(nextMultiHandleSliderTarget)
                var nextValue = nextMultiHandleSliderTarget.value;

            if(secondaryVal > (nextValue || max)) {
                secondaryVal = secondaryValue;
                val = value;
                block = true;
            }
        }

        if(!block && (Math.max(val, max) === max && Math.min(val, min) === min)) {
            this.beginUpdate();

            val = Math.max(Math.min(val, max), min);
            this._setMultiHandleSliderTargetValue(multiHandleSliderTarget, val);

            if(secondaryHandle)
                this._setMultiHandleSliderTargetValue(secondaryMultiHandleSliderTarget, secondaryVal);

            this.endUpdate();
        } else {
            this.beginUpdate();

            if(this._handles === 1) {
                this._setMultiHandleSliderTargetValue(multiHandleSliderTarget, val);
            } else {
                multiHandleSliderTarget.value = val;
                handle.Value = val;
                this._setHandlePosition(handle, true);
            }

            if(secondaryHandle) {
                secondaryMultiHandleSliderTarget.value = secondaryVal;
                secondaryHandle.Value = secondaryVal;
                this._setHandlePosition(secondaryHandle, true);
            }

            this.endUpdate();
        }

        return val;
    },

    _cancelDrag: function() {
        if(Sys.Extended.UI.MultiHandleSliderBehavior.DropPending === this) {
            Sys.Extended.UI.MultiHandleSliderBehavior.DropPending = null;

            if(this._selectStartPending)
                $removeHandler(document, 'selectstart', this._selectStartHandler);
        }
    },

    _createHandles: function() {
        // Creates the handles elements and hover and drag effect callbacks.

        // Create handle DOM elements
        for(var i = 0; i < this._handles; i++) {
            // Assemble the handle data
            var handleName = this.get_id() + "_handle_" + i,
                v = this._isVertical,
                hideStyle = '',
                hoverStyle = '',
                dragStyle = '';

            // Backwards compatibility: Single handled slider image by URL
            if(this._handles === 1 && this._handleImageUrl)
                var img = "<img id='" + this.get_id() + "_handleImage' src='" + this._handleImageUrl + "' alt='' />";

            // Assemble the handle markup
            var anchorStart = "<a id='" + handleName + "' ",
                innerImg = img ? img : "",
                anchorEnd = "><div>" + innerImg + "</div></a>";

            this._outer.innerHTML += anchorStart + anchorEnd;
        }

        // Create handle data container
        this._handleData = [this._handles];

        for(i = 0; i < this._handles; i++) {
            // Detect handle style and events
            var styleInfo = this._cssClass ? this._cssClass : "ajax__multi_slider_default",
                handleCss = this._multiHandleSliderTargets[i].HandleCssClass;

            if(handleCss || this._cssClass) {
                // Resolve custom class
                hideStyle = handleCss ? handleCss + " " : this._cssClass + " ";
                hoverStyle = hideStyle;
                dragStyle = hideStyle;

                var dragCss = handleCss,
                    hoverCss = handleCss;

                hideStyle = !handleCss ? hideStyle + this._isVertical ? 'handle_vertical' : 'handle_horizontal' : hideStyle + handleCss;
                hoverStyle = !hoverCss ? hoverStyle + this._isVertical ? 'handle_vertical_hover' : 'handle_horizontal_hover' : hoverStyle + hoverCss;
                dragStyle = !dragCss ? dragStyle + this._isVertical ? 'handle_vertical_down' : 'handle_horizontal_down' : dragStyle + dragCss;
            }

            // Build the handle hover effects from callbacks
            this._handleCallbacks = {
                mouseover: Function.createCallback(this._onShowHover, { vertical: v, custom: hoverStyle }),
                mouseout: Function.createCallback(this._onHideHover, { vertical: v, custom: hideStyle }),
                mousedown: Function.createCallback(this._onShowDrag, { vertical: v, custom: dragStyle }),
                mouseup: Function.createCallback(this._onHideDrag, { vertical: v, custom: hideStyle })
            };

            // Assign element to container
            this._handleData[i] = this._outer.childNodes[i];
            this._handleData[i].style.overflow = 'hidden';

            // Attach callbacks as events to given handle
            $addHandlers(this._handleData[i], this._handleCallbacks);

            // Process handle styles
            handleCss = this._multiHandleSliderTargets[i].HandleCssClass;
            if(handleCss) {
                Sys.UI.DomElement.addCssClass(this._handleData[i], styleInfo);
                Sys.UI.DomElement.addCssClass(this._handleData[i], handleCss);
            } else {
                // Don't try this for custom styles; they might have arbitrary graphics
                this._handleData[i].className = this._isVertical ? 'handle_vertical' : 'handle_horizontal';
            }

            // Map handle targets
            if(this._multiHandleSliderTargets) {
                var multiHandleSliderTargetID = this._multiHandleSliderTargets[i].ControlID;
                this._handleData[i].multiHandleSliderTargetID = multiHandleSliderTargetID;
            }

            // Opera-friendly explicit style settings
            this._handleData[i].style.left = '0px';
            this._handleData[i].style.top = '0px';

            // Animation
            if(this._steps < 1) {
                if(this._enableHandleAnimation) {
                    var animation = new Sys.Extended.UI.Animation.LengthAnimation(this._handleData[i], this._handleAnimationDuration, 100, 'style');

                    animation.add_ended(Function.createDelegate(this, this._onAnimationEnded));
                    animation.add_step(Function.createDelegate(this, this._onAnimationStep));
                    this._handleData[i].Animation = animation;
                }
            } else {
                this._enableHandleAnimation = false;
            }
        }
    },

    _createInnerRail: function() {
        if(this._handles > 1 && this._showInnerRail) {
            this._inner = document.createElement('DIV');
            this._inner.id = this.get_id() + '_inner';
            this._inner.style.outline = "none";
            this._inner.tabIndex = -1;
        }
    },

    _createOuterRail: function() {
        this._outer = document.createElement('DIV');
        this._outer.id = this.get_id() + '_outer';
        this._outer.style.outline = "none";
        this._outer.tabIndex = -1;
    },

    _createWrapper: function() {
        // Creates the relatively positioned wrapper DIV to contain the slider.
        this._wrapper = document.createElement("DIV");
        this._wrapper.style.position = "relative";
        this._wrapper.style.outline = "none";
    },

    _disposeHandlers: function() {
        if(!this._isReadOnly) {
            // Global Handlers
            $removeHandler(document, 'mouseup', this._mouseUpHandler);
            $removeHandler(document, 'mouseout', this._mouseOutHandler);

            if(this._outer) {
                // Mouse wheel support
                if(this._outer.addEventListener)
                    this._outer.removeEventListener('DOMMouseScroll', this._mouseWheelHandler, false);
                else
                    this._outer.detachEvent('onmousewheel', this._mouseWheelHandler);

                $common.removeHandlers(this._outer, this._outerDelegates);
            }

            for(var i = 0; i < this._handles; i++) {
                if(this._handleDelegates)
                    $common.removeHandlers(this._handleData[i], this._handleDelegates);

                if(this._handleCallbacks)
                    $clearHandlers(this._handleData[i]);
            }

            this._handleDelegates = null;
            this._handleCallbacks = null;

            if(this._inner && this._showInnerRail && this._innerDelegates)
                $common.removeHandlers(this._inner, this._innerDelegates);

            // Global Handlers
            this._selectStartHandler = null;
            this._mouseUpHandler = null;
            this._mouseOutHandler = null;
            this._mouseWheelHandler = null;
            this._mouseOverHandler = null;
            this._keyDownHandler = null;
        }
    },

    _disposeMultiHandleSliderTargets: function() {
        if(this._multiHandleSliderTargets) {
            for(var i = 0; i < this._handles; i++) {
                var multiHandleSliderTarget = this._multiHandleSliderTargets[i];
                var isInput = multiHandleSliderTarget && multiHandleSliderTarget.nodeName === 'INPUT';

                if(isInput) {
                    $removeHandler(multiHandleSliderTarget, 'change', multiHandleSliderTarget.ChangeHandler);
                    $removeHandler(multiHandleSliderTarget, 'keypress', multiHandleSliderTarget.KeyPressHandler);

                    multiHandleSliderTarget.ChangeHandler = null;
                    multiHandleSliderTarget.KeyPressHandler = null;
                }
            }
        }
    },

    _ensureBinding: function(multiHandleSliderTarget) {
        // Ensures control binding to a Label or TextBox element.

        if(multiHandleSliderTarget) {
            var value = multiHandleSliderTarget.value;

            if(value >= this._minimum || value <= this._maximum) {
                var isInputElement = multiHandleSliderTarget && multiHandleSliderTarget.nodeName === 'INPUT';

                if(isInputElement)
                    multiHandleSliderTarget.value = value;
                else if(multiHandleSliderTarget)
                    multiHandleSliderTarget.innerHTML = value;
            }
        }
    },

    _enforceElementPositioning: function() {
        // Copies any styles from the parent element to the slider wrapper.

        var tbPosition = {
            position: this.get_element().style.position,
            top: this.get_element().style.top,
            right: this.get_element().style.right,
            bottom: this.get_element().style.bottom,
            left: this.get_element().style.left
        };

        if(tbPosition.position !== '')
            this._wrapper.style.position = tbPosition.position;

        if(tbPosition.top !== '')
            this._wrapper.style.top = tbPosition.top;

        if(tbPosition.right !== '')
            this._wrapper.style.right = tbPosition.right;

        if(tbPosition.bottom !== '')
            this._wrapper.style.bottom = tbPosition.bottom;

        if(tbPosition.left !== '')
            this._wrapper.style.left = tbPosition.left;
    },

    _getNearestStepValue: function(value) {
        // Determines the closest discrete step value from a given value.
        // param valueis the value to check against steps
        // returns the nearest discrete step value from the specified value.

        if(this._steps === 0)
            return value;

        var extent = this._maximum - this._minimum;
        if(extent === 0)
            return value;

        if((this._steps - 1) !== 0)
            var delta = extent / (this._steps - 1);
        else
            return value;

        return Math.round(value / delta) * delta;
    },

    _getStepValues: function() {
        // Computes a list of possible slider values based on steps and constraints.

        var steps = [this._steps],
            extent = this._maximum - this._minimum;

        var increment = extent / (this._steps - 1);
        steps[0] = this._minimum;

        for(var i = 1; i < this._steps; i++)
            steps[i] = this._minimum + (increment * i);

        return steps;
    },

    _handleSlide: function(decrement) {
        // Increments or decrements the value of all handles.
        // If param decrement is true, decrement the slider value; otherwise, increment it.</param>

        // Test the first handle when decrementing, last if incrementing
        var index = decrement ? 0 : this._handles - 1,
            start = decrement ? 1 : 0,
            end = decrement ? this._handles : this._handles - 1,
            multiHandleSliderTargetID = this._handleData[index].multiHandleSliderTargetID;

        if(this._slideMultiHandleSliderTarget(multiHandleSliderTargetID, decrement)) {
            // Increment
            for(var i = start; i < end; i++) {
                multiHandleSliderTargetID = this._handleData[i].multiHandleSliderTargetID;
                this._slideMultiHandleSliderTarget(multiHandleSliderTargetID, decrement);
            }
        }
        this._initializeInnerRail();
    },

    _initializeDragHandle: function(handle) {
        // Creates a hidden drag handle element for managing drag functions.
        // This hidden element is appended to the document's first form.

        var dragHandle = handle.DragHandle = document.createElement('DIV');

        dragHandle.style.position = 'absolute';
        dragHandle.style.width = '1px';
        dragHandle.style.height = '1px';
        dragHandle.style.overflow = 'hidden';
        dragHandle.style.background = 'none';

        // Adding to the body can produce style breaks in some layouts
        document.forms[0].appendChild(handle.DragHandle);
    },

    _initializeHandlers: function() {
        if(!this._isReadOnly) {
            // Global Handlers
            this._selectStartHandler = Function.createDelegate(this, this._onSelectStart);
            this._mouseUpHandler = Function.createDelegate(this, this._onMouseUp);
            this._mouseOutHandler = Function.createDelegate(this, this._onMouseOut);
            this._mouseWheelHandler = Function.createDelegate(this, this._onMouseWheel);
            this._mouseOverHandler = Function.createDelegate(this, this._onMouseOver);
            this._keyDownHandler = Function.createDelegate(this, this._onKeyDown);

            $addHandler(document, 'mouseup', this._mouseUpHandler);
            $addHandler(document, 'mouseout', this._mouseOutHandler);

            this._handleDelegates = {
                mousedown: Function.createDelegate(this, this._onMouseDown),
                dragstart: Function.createDelegate(this, this._IEDragDropHandler),
                drag: Function.createDelegate(this, this._IEDragDropHandler),
                dragEnd: Function.createDelegate(this, this._IEDragDropHandler)
            };

            for(var i = 0; i < this._handles; i++)
                $addHandlers(this._handleData[i], this._handleDelegates);

            if(this._outer) {
                // Mouse wheel support
                if(this._enableMouseWheel)
                    if(this._outer.addEventListener)
                        this._outer.addEventListener('DOMMouseScroll', this._mouseWheelHandler, false);
                    else
                        this._outer.attachEvent('onmousewheel', this._mouseWheelHandler);

                this._outerDelegates = {
                    click: Function.createDelegate(this, this._onOuterRailClick),
                    mouseover: Function.createDelegate(this, this._mouseOverHandler),
                    keydown: Function.createDelegate(this, this._keyDownHandler)
                };

                $addHandlers(this._outer, this._outerDelegates);
            }

            if(this._inner && this._showInnerRail) {
                this._innerDelegates = {
                    click: Function.createDelegate(this, this._onInnerRailClick),
                    mousedown: Function.createDelegate(this, this._onMouseDownInner),
                    mouseup: Function.createDelegate(this, this._onMouseUpInner),
                    mouseout: Function.createDelegate(this, this._onMouseOutInner),
                    mousemove: Function.createDelegate(this, this._onMouseMoveInner),
                    dragStart: Function.createDelegate(this, this._IEDragDropHandler),
                    drag: Function.createDelegate(this, this._IEDragDropHandler),
                    dragEnd: Function.createDelegate(this, this._IEDragDropHandler)
                };

                $addHandlers(this._inner, this._innerDelegates);
            }
        }
    },

    _initializeHandles: function() {
        // Initializes data and events on handle elements.

        // Restore client state
        var state = this.get_ClientState();
        if(state)
            var handleStates = state.split(',', this._handles);

        for(var i = 0; i < this._handles; i++) {
            var handle = this._handleData[i],
                decimalPlaces = this._multiHandleSliderTargets[i].Decimals;

            if(handleStates)
                handle.Value = parseFloat(handleStates[i]);

            this._initializeMultiHandleSliderTarget(handle.multiHandleSliderTargetID, decimalPlaces, handle);
            this._initializeHandleValue(handle);
            this._setHandlePosition(handle, true);
            this._initializeDragHandle(handle);
        }
    },

    _initializeHandleValue: function(handle) {
        // Initializes the starting value of a given handle.

        // Check if value already exists from state
        if(!handle.Value) {
            try {
                var multiHandleSliderTarget = $get(handle.multiHandleSliderTargetID),
                    isInput = multiHandleSliderTarget && multiHandleSliderTarget.nodeName === 'INPUT',
                    handleValue = parseFloat(isInput ? multiHandleSliderTarget.value : multiHandleSliderTarget.innerHTML);
            } catch(ex) {
                handleValue = Number.NaN;
            }

            // Differentiate between a label and a textbox
            if(isNaN(handleValue)) {
                handle.Value = this._minimum;

                if(isInput)
                    multiHandleSliderTarget.value = handle.Value;
                else
                    multiHandleSliderTarget.innerHTML = handle.Value;
            } else {
                handle.Value = handleValue;
            }
        }
    },

    _initializeInnerRail: function() {
        // Initializes the appearance and location of the inner rail. Called multiple times to
        // recalculate the inner rail's position.

        if(this._inner && this._showInnerRail) {
            var firstIndex = 0, lastIndex = this._handles - 1,
                handle = this._handleData[firstIndex],
                lastHandle = this._handles > 1 ? this._handleData[lastIndex] : null;

            // Set the inner rail
            if(lastHandle) {
                // firstOffset and lastOffset account for user-defined offset handle width
                var handleWidth = parseInt(this._getBoundsInternal(handle).width, 10),
                    handleLeft = parseInt(this._isVertical ? handle.style.top : handle.style.left, 10),
                    handleRight = parseInt(this._isVertical ? lastHandle.style.top : lastHandle.style.left, 10),
                    firstOffset = parseInt(this._multiHandleSliderTargets[firstIndex].Offset, 10),
                    lastOffset = parseInt(this._multiHandleSliderTargets[lastIndex].Offset, 10);

                handleLeft += firstOffset;
                handleRight += lastOffset;

                if(this._isVertical) {
                    this._inner.style.top = handleLeft + "px";
                    this._inner.style.height = handleRight + handleWidth - handleLeft + "px";
                } else {
                    this._inner.style.left = handleLeft + "px";
                    this._inner.style.width = (handleRight + handleWidth - handleLeft) + "px";
                }

                // Slide the door
                if(this._innerRailStyle === Sys.Extended.UI.MultiHandleInnerRailStyle.SlidingDoors)
                    this._inner.style.backgroundPosition = this._isVertical ? "0 -" + handleLeft + "px" : "-" + handleLeft + "px 0";
            }
        }
    },

    _initializeMultiHandleSliderTarget: function(multiHandleSliderTargetID, decimalPlaces, handle) {
        // Initializes a given element that is bound to a handle.

        if(multiHandleSliderTargetID) {
            var multiHandleSliderTarget = $get(multiHandleSliderTargetID);

            if(handle.Value)
                // Set from state
                multiHandleSliderTarget.value = handle.Value;

            multiHandleSliderTarget.Handle = handle;
            multiHandleSliderTarget.Decimals = decimalPlaces;
            multiHandleSliderTarget.OldValue = multiHandleSliderTarget.value;
            multiHandleSliderTarget.onchange = "setValue(this, " + multiHandleSliderTarget.value + ")";

            if(!multiHandleSliderTarget.Decimals)
                multiHandleSliderTarget.Decimals = 0;

            var isInput = multiHandleSliderTarget && multiHandleSliderTarget.nodeName === 'INPUT';
            if(isInput) {
                multiHandleSliderTarget.KeyPressHandler = Function.createDelegate(this, this._onMultiHandleSliderTargetKeyPressed);
                multiHandleSliderTarget.ChangeHandler = Function.createDelegate(this, this._onMultiHandleSliderTargetChange);

                $addHandler(multiHandleSliderTarget, 'keypress', multiHandleSliderTarget.KeyPressHandler);
                $addHandler(multiHandleSliderTarget, 'change', multiHandleSliderTarget.ChangeHandler);
            }
        }
    },

    _initializeSlider: function() {
        // Creates the generated slider DOM components.

        Sys.Extended.UI.DragDrop.registerDropTarget(this);

        this._initializeHandles();
        this._initializeHandlers();
        this._initializeInnerRail();
        this._initialized = true;

        this._raiseEvent('load');
    },

    _resetDragHandle: function(handle) {
        // Resets the position of the hidden drag handle.
        var handleBounds = $common.getBounds(handle);

        $common.setLocation(handle.DragHandle, {
            x: handleBounds.x,
            y: handleBounds.y
        });
    },

    _resolveNamingContainer: function() {
        // Uses the behavior name and client state to resolve the inner control IDs.
        if(this._isServerControl && this._multiHandleSliderTargets && !this._boundControlID) {
            var index = this._clientStateFieldID.lastIndexOf(this._id),
                token = this._clientStateFieldID.substring(0, index);

            for(var i = 0; i < this._handles; i++)
                this._multiHandleSliderTargets[i].ControlID = token + this._multiHandleSliderTargets[i].ControlID;
        }
    },

    _saveState: function() {
        // Sets the values of all handle controls in client state.
        var state = [this._handles];
        for(var i = 0; i < this._handles; i++)
            state[i] = $get(this._multiHandleSliderTargets[i].ControlID).value;

        this.set_ClientState(state.join(','));
    },

    _setHandlePosition: function(handle, allowAnimation) {
        // Sets the location of the handle when changing slider values.

        var min = this._minimum, max = this._maximum, value = handle.Value,
            animate = this._enableHandleAnimation && this._animationPending && allowAnimation,
            handleBounds = this._getBoundsInternal(handle),
            railBounds = this._getOuterBounds();

        if(handleBounds.width <= 0 && railBounds.width <= 0) {
            handleBounds.width = parseInt($common.getCurrentStyle(handle, 'width'), 10);
            railBounds.width = parseInt($common.getCurrentStyle(this._outer, 'width'), 10);

            if(handleBounds.width <= 0 || railBounds.width <= 0)
                throw Error.argument('width', Sys.Extended.UI.Resources.MultiHandleSlider_CssHeightWidthRequired);
        }

        var extent = max - min, fraction = (value - min) / extent,
            o = Math.round(fraction * (railBounds.width - handleBounds.width)),
            offset = (value === min) ? 0 : (value === max) ? (railBounds.width - handleBounds.width) : o;

        if(animate) {
            handle.Animation.set_startValue(handleBounds.x - railBounds.x);
            handle.Animation.set_endValue(offset);
            handle.Animation.set_propertyKey(this._isVertical ? 'top' : 'left');
            handle.Animation.play();

            this._animationPending = false;
        } else {
            o = offset + 'px';

            if(this._isVertical)
                handle.style.top = o;
            else
                handle.style.left = o;
        }
    },

    _setRailStyles: function() {
        // Determines from configuration the class names to use for slider elements.

        // Backwards-compatibility: rail style on single handle slider
        if(!this._inner && this._railCssClass) {
            this._outer.className = this._railCssClass;
            return;
        }
        var styleInfo = this._cssClass ? this._cssClass : "ajax__multi_slider_default";

        Sys.UI.DomElement.addCssClass(this.get_element(), styleInfo);
        Sys.UI.DomElement.addCssClass(this._outer, styleInfo);
        Sys.UI.DomElement.addCssClass(this._wrapper, styleInfo);

        if(this._inner) {
            Sys.UI.DomElement.addCssClass(this._inner, styleInfo);

            var outer = this._isVertical ? 'outer_rail_vertical' : 'outer_rail_horizontal',
                inner = this._isVertical ? 'inner_rail_vertical' : 'inner_rail_horizontal';

            Sys.UI.DomElement.addCssClass(this._outer, outer);
            Sys.UI.DomElement.addCssClass(this._inner, inner);
        } else {
            outer = this._isVertical ? 'inner_rail_vertical' : 'inner_rail_horizontal';

            Sys.UI.DomElement.addCssClass(this._outer, outer);
        }
    },

    _setMultiHandleSliderTargetValue: function(multiHandleSliderTarget, value) {
        // Sets the value of a bound control.
        var oldValue = multiHandleSliderTarget.OldValue, newValue = value;

        if(oldValue === newValue && this._isReadOnly) {
            multiHandleSliderTarget.value = oldValue;
        } else {
            if(!this.get_isUpdating())
                newValue = this._calculateMultiHandleSliderTargetValue(multiHandleSliderTarget);

            multiHandleSliderTarget.value = newValue.toFixed(multiHandleSliderTarget.Decimals);
            this._ensureBinding(multiHandleSliderTarget);

            if(!Number.isInstanceOfType(multiHandleSliderTarget.value))
                try {
                    multiHandleSliderTarget.value = parseFloat(multiHandleSliderTarget.value);
                } catch(ex) {
                    multiHandleSliderTarget.value = Number.NaN;
                }

            if(this._tooltipText) {
                var handle = multiHandleSliderTarget.Handle;
                handle.alt = handle.title = String.format(this._tooltipText, multiHandleSliderTarget.value);
            }

            if(this._initialized) {
                multiHandleSliderTarget.Handle.Value = newValue;
                this._setHandlePosition(multiHandleSliderTarget.Handle, true);

                // Backwards compatibility for single-handled slider: set element value
                if(this._handles === 1)
                    this.get_element().value = newValue;

                if(multiHandleSliderTarget.value !== oldValue) {
                    multiHandleSliderTarget.OldValue = multiHandleSliderTarget.value;
                    this._initializeInnerRail();

                    // Prevent click after drag
                    if(this._innerDrag)
                        this._blockInnerClick = true;

                    this._raiseEvent('valueChanged');

                    if(this.get_isUpdating())
                        if(!this._raiseChangeOnlyOnMouseUp)
                            $common.tryFireEvent(this.get_element(), "change");
                }
            }
        }

        // Store all values in client state
        this._saveState();
    },

    _setValueFromMultiHandleSliderTarget: function(multiHandleSliderTarget) {
        // Sets the value of the slider based on the value inside a bound control.

        this.beginUpdate();
        if(multiHandleSliderTarget) {
            if(!this._isReadOnly) {
                if(this._handles === 1 && this._steps > 0)
                    // Bypass all the calculations since we already know the discrete value
                    this._setMultiHandleSliderTargetValue(multiHandleSliderTarget, multiHandleSliderTarget.value);

                this._calculateMultiHandleSliderTargetValue(multiHandleSliderTarget);
            } else {
                this._setMultiHandleSliderTargetValue(multiHandleSliderTarget, multiHandleSliderTarget.OldValue);
            }
        }

        this.endUpdate();
    },

    _slideMultiHandleSliderTarget: function(multiHandleSliderTargetID, decrement) {
        // Increments the value of a bound control.

        var multiHandleSliderTarget = $get(multiHandleSliderTargetID),
            oldValue = multiHandleSliderTarget.value,
            newValue, i;

        if(this._steps > 0) {
            var stepValues = this._getStepValues(),
                oldStep = this._getNearestStepValue(oldValue);

            newValue = oldStep;

            if(decrement) {
                // Decrement
                for(i = this._steps - 1; i > -1; i--)
                    if(stepValues[i] < oldStep) {
                        newValue = stepValues[i];
                        break;
                    }
            } else {
                // Increment
                for(i = 0; i < this._steps; i++)
                    if(stepValues[i] > oldStep) {
                        newValue = stepValues[i];
                        break;
                    }
            }
        } else {
            var prevValue = parseFloat(multiHandleSliderTarget.value);
            newValue = decrement ? prevValue - parseFloat(this._increment) : prevValue + parseFloat(this._increment);
        }

        multiHandleSliderTarget.value = newValue;
        this._setValueFromMultiHandleSliderTarget(multiHandleSliderTarget);
        return multiHandleSliderTarget.value == newValue;
    },

    _startDragDrop: function(handle) {
        // Begins a drag and drop operation on the specified handle. Drag operations
        // affect the hidden drag handle on the element, not the element itself.
        this._resetDragHandle(handle);
        this._handleUnderDrag = handle;

        Sys.Extended.UI.DragDrop.startDragDrop(this, handle.DragHandle, null);
    },

    // Event Handlers

    _onAnimationEnded: function() {
        this._initializeInnerRail();
    },

    _onAnimationStep: function() {
        this._initializeInnerRail();
    },

    _onHideDrag: function(e, p) {
        // Reverses the class name used for drag effects when the callback event is raised.
        // param p is the callback parameter object, containing custom style and orientation fields.
        this.className = p.custom && p.custom.length > 0 ? p.custom : p.vertical ? 'handle_vertical' : 'handle_horizontal';
    },

    _onHideHover: function(e, p) {
        // Reverses the class name used for hover effects when the callback event is raised.
        // param p is the callback parameter object, containing custom style and orientation fields.
        this.className = p.custom && p.custom.length > 0 ? p.custom : p.vertical ? 'ajax__multi_slider_default handle_vertical' : 'ajax__multi_slider_default handle_horizontal';
    },

    _onInnerRailClick: function(e) {
        // Handler for the inner rail's click event.
        if(this._enableRailClick) {
            var target = e.target;

            if(target === this._inner && !this._blockInnerClick) {
                this._animationPending = true;
                this._onInnerRailClicked(e);
            } else {
                this._blockInnerClick = false;
            }
        }
    },

    _onInnerRailClicked: function(e) {
        // Called when the inner rail's click event is handled.
        var offset = this._calculateInnerRailOffset(e);
        this._calculateClick(offset);
    },

    _onKeyDown: function(e) {
        if(this._enableKeyboard) {
            var evt = new Sys.UI.DomEvent(e),
                handled = false;

            switch(evt.keyCode || evt.rawEvent.keyCode) {
                case Sys.UI.Key.up:
                case Sys.UI.Key.left:
                    if(!handled) {
                        this._handleSlide(true);
                        evt.preventDefault();
                        handled = true;
                    }
                    return false;
                case Sys.UI.Key.down:
                case Sys.UI.Key.right:
                    if(!handled) {
                        this._handleSlide(false);
                        evt.preventDefault();
                        handled = true;
                    }
                    return false;
                default:
                    return false;
            }
        }
    },

    _onMouseOver: function(e) {
        this._outer.focus();
    },

    _onMouseWheel: function(e) {
        var delta = 0;

        if(e.wheelDelta) {
            delta = e.wheelDelta / 120;

            if(Sys.Browser.agent === Sys.Browser.Opera)
                delta = -delta;
        } else if(e.detail) {
            delta = -e.detail / 3;
        }

        if(delta)
            this._handleSlide(delta <= 0);

        if(e.preventDefault)
            e.preventDefault();

        return false;
    },

    _onMouseUp: function(e) {
        window._event = e;
        e.preventDefault();

        this._cancelDrag();
    },

    _onMouseOut: function(e) {
        window._event = e;
        e.preventDefault();

        this._outer.blur();
        if(this._handleUnderDrag)
            this._cancelDrag();
    },

    _onMouseOutInner: function(e) {
        window._event = e;
        e.preventDefault();

        this._inner.blur();
        if(this._innerDrag)
            this._cancelDrag();
    },

    _onMouseDown: function(e) {
        window._event = e;
        e.preventDefault();

        if(!Sys.Extended.UI.MultiHandleSliderBehavior.DropPending) {
            Sys.Extended.UI.MultiHandleSliderBehavior.DropPending = this;

            $addHandler(document, 'selectstart', this._selectStartHandler);
            this._selectStartPending = true;

            var handle = e.target;
            this._startDragDrop(handle);
        }
    },

    _onMouseDownInner: function(e) {
        window._event = e;
        e.preventDefault();

        if(this._enableInnerRangeDrag)
            if(!this._innerDragFlag)
                this._innerDragFlag = true;
    },

    _onMouseUpInner: function(e) {
        if(this._enableInnerRangeDrag)
            this._innerDragFlag = false;
    },

    _onMouseMoveInner: function(e) {
        window._event = e;
        e.preventDefault();

        if(this._enableInnerRangeDrag) {
            if(!this._innerDrag && this._innerDragFlag) {
                this._innerDragFlag = false;

                // Begin drag and drop operation for the inner rail
                if(!Sys.Extended.UI.MultiHandleSliderBehavior.DropPending) {
                    Sys.Extended.UI.MultiHandleSliderBehavior.DropPending = this;

                    $addHandler(document, 'selectstart', this._selectStartHandler);
                    this._selectStartPending = true;

                    // Dragging inner handles
                    this._innerDrag = true;

                    // Get nearest primary handle
                    var offset = this._calculateInnerRailOffset(e);
                    var handle = this._calculateClosestHandle(offset);

                    // Start drag
                    this._startDragDrop(handle);
                }
            }
        }
    },

    _onMultiHandleSliderTargetChange: function(e) {
        // Handler for when a slider value changes programmatically.
        this._animationPending = true;
        var multiHandleSliderTarget = e.target;
        this._setValueFromMultiHandleSliderTarget(multiHandleSliderTarget);
        this._initializeInnerRail();

        e.preventDefault();
    },

    _onMultiHandleSliderTargetKeyPressed: function(e) {
        var evt = new Sys.UI.DomEvent(e);

        if(evt.charCode === 13) {
            this._animationPending = true;
            var multiHandleSliderTarget = evt.target;
            this._setValueFromMultiHandleSliderTarget(multiHandleSliderTarget);
            this._initializeInnerRail();

            evt.preventDefault();
        }
    },

    _onOuterRailClick: function(e) {
        if(this._enableRailClick) {
            var target = e.target;

            if(target === this._outer) {
                this._animationPending = true;
                this._onOuterRailClicked(e);
            }
        }
    },

    _onOuterRailClicked: function(e) {
        var offset = this._isVertical ? e.offsetY : e.offsetX;
        this._calculateClick(offset);
    },

    _onShowDrag: function(e, p) {
        // Sets the class name used for drag effects when the callback event is raised.
        // param p is the callback parameter object, containing custom style and orientation fields
        this.className = p.custom && p.custom.length > 0 ? p.custom : p.vertical ? 'ajax__multi_slider_default handle_vertical_down' : 'ajax__multi_slider_default handle_horizontal_down';
    },

    _onShowHover: function(e, p) {
        // Sets the class name used for hover effects when the callback event is raised.
        // param p the callback parameter object, containing custom style and orientation fields.
        this.className = p.custom && p.custom.length > 0 ? p.custom : p.vertical ? 'ajax__multi_slider_default handle_vertical_hover' : 'ajax__multi_slider_default handle_horizontal_hover';
    },

    // IDragSource Implementation

    get_dragDataType: function() {
        return 'HTML';
    },

    getDragData: function() {
        return this._handleUnderDrag;
    },

    get_dragMode: function() {
        return Sys.Extended.UI.DragMode.Move;
    },

    onDragStart: function() {
        this._resetDragHandle(this._handleUnderDrag);
        this._raiseEvent('dragStart');
    },

    onDrag: function() {
        var dragHandleBounds = this._getBoundsInternal(this._handleUnderDrag.DragHandle),
            handleBounds = this._getBoundsInternal(this._handleUnderDrag),
            railBounds = this._getOuterBounds(),
            handlePosition;

        if(this._isVertical) {
            handlePosition = {
                y: dragHandleBounds.x - railBounds.x,
                x: 0
            };
        } else {
            handlePosition = {
                x: dragHandleBounds.x - railBounds.x,
                y: 0
            };
        }

        $common.setLocation(this._handleUnderDrag, handlePosition);

        this._calculateMultiHandleSliderTargetValue(null, null, true);

        if(this._steps > 1)
            this._setHandlePosition(this._handleUnderDrag, false);

        this._raiseEvent('drag');
    },

    onDragEnd: function() {
        this._initializeInnerRail();

        if(this._raiseChangeOnlyOnMouseUp)
            $common.tryFireEvent(this.get_element(), "change");

        this._innerDrag = false;
        this._handleUnderDrag = null;
        this._raiseEvent('dragEnd');
    },

    // IDropTarget Implementation

    get_dropTargetElement: function() {
        return document.forms[0];
    },

    canDrop: function(dragMode, dataType) {
        return dataType == 'HTML';
    },

    // Not implemented
    drop: Function.emptyMethod,
    onDragEnterTarget: Function.emptyMethod,
    onDragLeaveTarget: Function.emptyMethod,
    onDragInTarget: Function.emptyMethod,

    _IEDragDropHandler: function(e) {
        e.preventDefault();
    },

    _onSelectStart: function(e) {
        // Handler for when the parent element is selected.
        e.preventDefault();

        return false;
    },

    // Helper Methods

    _getOuterBounds: function() {
        return this._getBoundsInternal(this._outer);
    },

    _getInnerBounds: function() {
        return this._getBoundsInternal(this._inner);
    },

    _getBoundsInternal: function(element) {
        var bounds = $common.getBounds(element);

        if(this._isVertical) {
            bounds = {
                x: bounds.y,
                y: bounds.x,
                height: bounds.width,
                width: bounds.height,
                right: bounds.right,
                left: bounds.left,
                bottom: bounds.bottom,
                location: {
                    x: bounds.y,
                    y: bounds.x
                },
                size: {
                    width: bounds.height,
                    height: bounds.width
                }
            };
        } else {
            bounds = {
                x: bounds.x,
                y: bounds.y,
                height: bounds.height,
                width: bounds.width,
                right: bounds.right,
                left: bounds.left,
                bottom: bounds.bottom,
                location: {
                    x: bounds.x,
                    y: bounds.y
                },
                size: {
                    width: bounds.width,
                    height: bounds.height
                }
            };
        }

        return bounds;
    },

    _raiseEvent: function(eventName, eventArgs) {
        var handler = this.get_events().getHandler(eventName);

        if(handler) {
            if(!eventArgs)
                eventArgs = Sys.EventArgs.Empty;

            handler(this, eventArgs);
        }
    },

    // Backwards-compatible Property Accessors

    get_Value: function() {
        // Gets the value of a single bound control for backwards compatibility
        // of existing slider and tests. Only to be used in this context.
        var bound = $get(this._boundControlID);
        return bound.value ? bound.value : 0;
    },

    set_Value: function(value) {
        // Sets the value of a single bound control for backwards compatibility
        // of existing slider and tests. Only to be used in this context.
        var multiHandleSliderTarget = $get(this._multiHandleSliderTargets[0].ControlID);

        this.beginUpdate();
        this._setMultiHandleSliderTargetValue(multiHandleSliderTarget, this._getNearestStepValue(value));
        this.endUpdate();

        // Raise an event after a hard set to enforce any constraints after the fact
        $common.tryFireEvent(multiHandleSliderTarget, "change");
    },

    // Property Accessors

    get_minimum: function() {
        return this._minimum;
    },

    set_minimum: function(value) {
        if(value !== this._minimum) {
            this._minimum = value;
            this.raisePropertyChanged('minimum');
        }
    },

    get_maximum: function() {
        return this._maximum;
    },

    set_maximum: function(value) {
        if(value !== this._maximum) {
            this._maximum = value;
            this.raisePropertyChanged('maximum');
        }
    },

    get_length: function() {
        return this._length;
    },

    set_length: function(value) {
        if(value !== this._length) {
            this._length = value;
            this.raisePropertyChanged('length');
        }
    },

    get_steps: function() {
        // Determines number of discrete locations on the slider; otherwise, the slider is continous.
        return this._steps;
    },

    set_steps: function(value) {
        // Determines number of discrete locations on the slider; otherwise, the slider is continous.
        var oldValue = this._steps;
        this._steps = Math.abs(value);
        this._steps = (this._steps === 1) ? 2 : this._steps;

        if(oldValue !== this._steps)
            this.raisePropertyChanged('steps');
    },

    get_orientation: function() {
        return this._isVertical;
    },

    set_orientation: function(value) {
        if(value !== this._isVertical) {
            this._orientation = value;
            this.raisePropertyChanged('orientation');
        }
    },

    get_enableHandleAnimation: function() {
        // Determines if the slider handles display an animation effect when changing position.
        return this._enableHandleAnimation;
    },

    set_enableHandleAnimation: function(value) {
        // Determines if the slider handles display an animation effect when changing position.
        if(value !== this._enableHandleAnimation) {
            this._enableHandleAnimation = value;
            this.raisePropertyChanged('enableHandleAnimation');
        }
    },

    get_handleAnimationDuration: function() {
        // Determines the total duration of the animation effect, in seconds.
        return this._handleAnimationDuration;
    },

    set_handleAnimationDuration: function(value) {
        // Determines the total duration of the animation effect, in seconds.
        if(value !== this._handleAnimationDuration) {
            this._handleAnimationDuration = value;
            this.raisePropertyChanged('handleAnimationDuration');
        }
    },

    get_raiseChangeOnlyOnMouseUp: function() {
        // Determines if changes to the slider's values are raised as an event when dragging; otherwise, they are raised on drag end.
        return this._raiseChangeOnlyOnMouseUp;
    },

    set_raiseChangeOnlyOnMouseUp: function(value) {
        // Determines if changes to the slider's values are raised as an event when dragging; otherwise, they are raised on drag end.
        if(value !== this._raiseChangeOnlyOnMouseUp) {
            this._raiseChangeOnlyOnMouseUp = value;
            this.raisePropertyChanged('raiseChangeOnlyOnMouseUp');
        }
    },

    get_showInnerRail: function() {
        // Determines if the slider will show an inner selected range rail; otherwise, it will display as a uniform rail.
        return this._showInnerRail;
    },

    set_showInnerRail: function(value) {
        // Determines if the slider will show an inner selected range rail; otherwise, it will display as a uniform rail.
        if(value !== this._showInnerRail) {
            this._showInnerRail = value;
            this.raisePropertyChanged('showInnerRail');
        }
    },

    get_showHandleHoverStyle: function() {
        // Determines if the slider handles will show a style effect when they are hovered over.
        return this._showHoverStyle;
    },

    set_showHandleHoverStyle: function(value) {
        // Determines if the slider handles will show a style effect when they are hovered over.
        if(value !== this._showHoverStyle) {
            this._showHoverStyle = value;
            this.raisePropertyChanged('showHoverStyle');
        }
    },

    get_showHandleDragStyle: function() {
        // Determines if the slider handles will show a style effect when they are being dragged.
        return this._showDragStyle;
    },

    set_showHandleDragStyle: function(value) {
        // Determines if the slider handles will show a style effect when they are being dragged.
        if(value !== this._showDragStyle) {
            this._showDragStyle = value;
            this.raisePropertyChanged('showDragStyle');
        }
    },

    get_innerRailStyle: function() {
        // Determines how the inner rail style is handled.
        return this._innerRailStyle;
    },

    set_innerRailStyle: function(value) {
        // Determines how the inner rail style is handled.
        if(value !== this._innerRailStyle) {
            this._innerRailStyle = value;
            this.raisePropertyChanged('innerRailStyle');
        }
    },

    get_enableInnerRangeDrag: function() {
        // Determines if the inner rail range can be dragged as a whole, moving both handles defining it.
        return this._enableInnerRangeDrag;
    },

    set_enableInnerRangeDrag: function(value) {
        // Determines if the inner rail range can be dragged as a whole, moving both handles defining it.
        if(value !== this._enableInnerRangeDrag) {
            this._enableInnerRangeDrag = value;
            this.raisePropertyChanged('allowInnerRangeDrag');
        }
    },

    get_enableRailClick: function() {
        // Determines if clicking on the rail will detect and move the closest handle.
        return this._enableRailClick;
    },

    set_enableRailClick: function(value) {
        // Determines if clicking on the rail will detect and move the closest handle.
        if(value !== this._enableRailClick) {
            this._enableRailClick = value;
            this.raisePropertyChanged('allowRailClick');
        }
    },

    get_isReadOnly: function() {
        return this._isReadOnly;
    },

    set_isReadOnly: function(value) {
        if(value !== this._isReadOnly) {
            this._isReadOnly = value;
            this.raisePropertyChanged('isReadOnly');
        }
    },

    get_enableKeyboard: function() {
        return this._enableKeyboard;
    },

    set_enableKeyboard: function(value) {
        if(value !== this._enableKeyboard) {
            this._enableKeyboard = value;
            this.raisePropertyChanged('enableKeyboard');
        }
    },

    get_enableMouseWheel: function() {
        return this._enableMouseWheel;
    },

    set_enableMouseWheel: function(value) {
        if(value !== this._enableMouseWheel) {
            this._enableMouseWheel = value;
            this.raisePropertyChanged('enableMouseWheel');
        }
    },

    get_increment: function() {
        // Determines the number of points to increment or decrement the slider using the keyboard or mousewheel; ignored if steps is used.
        return this._increment;
    },

    set_increment: function(value) {
        // Determines the number of points to increment or decrement the slider using the keyboard or mousewheel; ignored if steps is used.
        if(value !== this._increment) {
            this._increment = value;
            this.raisePropertyChanged('increment');
        }
    },

    get_tooltipText: function() {
        // {0} denotes the current handle's value in the format string.
        return this._tooltipText;
    },

    set_tooltipText: function(value) {
        // {0} denotes the current handle's value in the format string.
        if(value !== this._tooltipText) {
            this._tooltipText = value;
            this.raisePropertyChanged('tooltipText');
        }
    },

    get_multiHandleSliderTargets: function() {
        return this._multiHandleSliderTargets;
    },

    set_multiHandleSliderTargets: function(value) {
        if(value !== this._multiHandleSliderTargets) {
            this._multiHandleSliderTargets = value;
            this.raisePropertyChanged('multiHandleSliderTargets');
        }
    },

    get_cssClass: function() {
        return this._cssClass;
    },

    set_cssClass: function(value) {
        if(value !== this._cssClass) {
            this._cssClass = value;
            this.raisePropertyChanged('cssClass');
        }
    },

    get_boundControlID: function() {
        // Gets the ID of a control to use for a single handle.
        return this._boundControlID;
    },

    set_boundControlID: function(value) {
        // Sets the ID of a control to use for a single handle.
        this._boundControlID = value;

        if(this._boundControlID)
            this._boundControl = $get(this._boundControlID);
        else
            this._boundControl = null;
    },

    get_handleCssClass: function() {
        return this._handleCssClass;
    },

    set_handleCssClass: function(value) {
        this._handleCssClass = value;
    },

    get_handleImageUrl: function() {
        return this._handleImageUrl;
    },

    set_handleImageUrl: function(value) {
        this._handleImageUrl = value;
    },

    get_railCssClass: function() {
        return this._railCssClass;
    },

    set_railCssClass: function(value) {
        this._railCssClass = value;
    },

    get_decimals: function() {
        // Get the number of decimal digits in a single slider's value.
        return this._decimals;
    },

    set_decimals: function(value) {
        // Set the number of decimal digits in a single slider's value.
        this._decimals = value;
    },

    // Event Accessors

    add_load: function(handler) {
        this.get_events().addHandler('load', handler);
    },

    remove_load: function(handler) {
        this.get_events().removeHandler('load', handler);
    },

    add_dragStart: function(handler) {
        this.get_events().addHandler('dragStart', handler);
    },

    remove_dragStart: function(handler) {
        this.get_events().removeHandler('dragStart', handler);
    },

    add_drag: function(handler) {
        this.get_events().addHandler('drag', handler);
    },

    remove_drag: function(handler) {
        this.get_events().removeHandler('drag', handler);
    },

    add_dragEnd: function(handler) {
        this.get_events().addHandler('dragEnd', handler);
    },

    remove_dragEnd: function(handler) {
        this.get_events().removeHandler('dragEnd', handler);
    },

    add_valueChanged: function(handler) {
        this.get_events().addHandler('valueChanged', handler);
    },

    remove_valueChanged: function(handler) {
        this.get_events().removeHandler('valueChanged', handler);
    }
};

Sys.Extended.UI.MultiHandleSliderBehavior.DropPending = null;
Sys.Extended.UI.MultiHandleSliderBehavior.registerClass('Sys.Extended.UI.MultiHandleSliderBehavior', Sys.Extended.UI.BehaviorBase);