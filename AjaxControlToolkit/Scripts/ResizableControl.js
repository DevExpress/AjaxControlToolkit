Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.ResizableControlBehavior = function(element) {
    Sys.Extended.UI.ResizableControlBehavior.initializeBase(this, [element]);

    // Properties
    this._handleCssClass = "";
    this._resizableCssClass = "";
    this._handleOffsetX = 0;
    this._handleOffsetY = 0;
    this._minimumWidth = 0;
    this._minimumHeight = 0;
    this._maximumWidth = 100000;
    this._maximumHeight = 100000;

    // Variables
    this._frame = null;
    this._handle = null;
    this._handleHolder = null;
    this._lining = null;
    this._tracking = false;
    this._lastClientX = 0;
    this._lastClientY = 0;

    // Delegates
    this._onmouseoverDelegate = null;
    this._onmouseoutDelegate = null;
    this._onmousedownDelegate = null;
    this._onmousemoveDelegate = null;
    this._onmouseupDelegate = null;
    this._onselectstartDelegate = null;
}

Sys.Extended.UI.ResizableControlBehavior.prototype = {
    initialize: function() {
        Sys.Extended.UI.ResizableControlBehavior.callBaseMethod(this, 'initialize');

        this._frame = this.get_element();

        var savedSizeString = Sys.Extended.UI.ResizableControlBehavior.callBaseMethod(this, 'get_ClientState');
        if(savedSizeString && (-1 != savedSizeString.indexOf(','))) {
            var savedSize = savedSizeString.split(',');
            this._frame.style.width = savedSize[0] + 'px';
            this._frame.style.height = savedSize[1] + 'px';
        }

        // The this._lining lets us measure the interior of the this._frame easily and
        // protects the contents of this._frame (when resizing) from interactions
        // with the mouse (ex: IFRAME grabbing mouse capture in IE or Firefox)
        this._lining = document.createElement('DIV');
        this._lining.style.width = $common.getCurrentStyle(this._frame, 'width');
        this._lining.style.height = $common.getCurrentStyle(this._frame, 'height');
        this._lining.style.position = 'absolute';
        this._lining.style.backgroundColor = 'black';  // Keeps browsers from ignoring the content-free element
        this._lining.style.opacity = "0";  // Makes the lining invisible
        this._lining.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=0)";  // Ditto, for IE
        this._lining.style.visibility = 'hidden';
        this._frame.insertBefore(this._lining, this._frame.firstChild);

        // The this._handleHolder provedes a wrapper with absolute positioning
        // so that this._handle can be absolutely positioned relative to the
        // this._frame instead of the page
        this._handleHolder = document.createElement('DIV');
        this._handleHolder.style.width = '0px';
        this._handleHolder.style.height = '0px';
        this._handleHolder.style.position = ((Sys.Browser.agent === Sys.Browser.Opera) ? 'relative' : 'absolute');
        this._frame.insertBefore(this._handleHolder, this._frame.firstChild);

        // The this._handle represents the UI handle for the user to grab with
        // the mouse
        this._handle = document.createElement('DIV');
        this._handle.className = this._handleCssClass;
        this._handle.style.position = 'absolute';
        this._handleHolder.appendChild(this._handle);

        this._onmouseoverDelegate = Function.createDelegate(this, this._onmouseover);
        $addHandler(this._handle, 'mouseover', this._onmouseoverDelegate);
        this._onmouseoutDelegate = Function.createDelegate(this, this._onmouseout);
        $addHandler(this._handle, 'mouseout', this._onmouseoutDelegate);
        this._onmousedownDelegate = Function.createDelegate(this, this._onmousedown);
        $addHandler(this._handle, 'mousedown', this._onmousedownDelegate);
        this._onmousemoveDelegate = Function.createDelegate(this, this._onmousemove);
        this._onmouseupDelegate = Function.createDelegate(this, this._onmouseup);
        this._onselectstartDelegate = Function.createDelegate(this, this._onselectstart);

        this._resizeControl(0, 0, 0, 0);
        this._rememberSize();
    },

    dispose: function() {
        if(this._onmouseoverDelegate) {
            $removeHandler(this._handle, 'mouseover', this._onmouseoverDelegate);
            this._onmouseoverDelegate = null;
        }

        if(this._onmouseoutDelegate) {
            $removeHandler(this._handle, 'mouseout', this._onmouseoutDelegate);
            this._onmouseoutDelegate = null;
        }

        if(this._onmousedownDelegate) {
            $removeHandler(this._handle, 'mousedown', this._onmousedownDelegate);
            this._onmousedownDelegate = null;
        }

        if(this._onmousemoveDelegate) {
            if(this.tracking)
                $removeHandler(document, 'mousemove', this._onmousemoveDelegate);

            this._onmousemoveDelegate = null;
        }

        if(this._onmouseupDelegate) {
            if(this.tracking)
                $removeHandler(document, 'mouseup', this._onmouseupDelegate);

            this._onmouseupDelegate = null;
        }

        if(this._onselectstartDelegate) {
            if(this.tracking) {
                $removeHandler(document, 'selectstart', this._onselectstartDelegate);

                if(Sys.Browser.agent === Sys.Browser.Opera)
                    $removeHandler(document, 'mousedown', this._onselectstartDelegate);
            }
            this._onselectstartDelegate = null;
        }

        Sys.Extended.UI.ResizableControlBehavior.callBaseMethod(this, 'dispose');
    },

    _onmouseover: function() {
        Sys.UI.DomElement.addCssClass(this._frame, this._resizableCssClass);
    },

    _onmouseout: function() {
        if(!this._tracking)
            Sys.UI.DomElement.removeCssClass(this._frame, this._resizableCssClass);
    },

    _onmousedown: function(e) {
        // TODO: Fix for new event model
        if(!e) e = event;

        this._onmousedownImplementation(e.clientX, e.clientY);
    },

    _onmousedownImplementation: function(clientX, clientY) {
        this._tracking = true;
        this._resizeControl(clientX, clientY, 0, 0);
        this._lining.style.visibility = 'visible';  // Overlay resizing control to avoid interacting with it (ex: IFRAME)

        $addHandler(document, 'mousemove', this._onmousemoveDelegate);
        $addHandler(document, 'mouseup', this._onmouseupDelegate);
        $addHandler(document, 'selectstart', this._onselectstartDelegate);

        if(Sys.Browser.agent === Sys.Browser.Opera)
            $addHandler(document, 'mousedown', this._onselectstartDelegate);

        this.raise_resizeBegin();
    },

    _onmousemove: function(e) {
        // TODO: Fix for new event model
        if(!e) e = event;

        this._onmousemoveImplementation(e.clientX, e.clientY);
    },

    _onmousemoveImplementation: function(clientX, clientY) {
        if(this._tracking) {
            var deltaX = (clientX - this._lastClientX);
            var deltaY = (clientY - this._lastClientY);
            this._resizeControl(clientX, clientY, deltaX, deltaY);
        }
    },

    _onmouseup: function() {
        this._tracking = false;
        this._rememberSize();
        this._lining.style.visibility = 'hidden';

        $removeHandler(document, 'mousemove', this._onmousemoveDelegate);
        $removeHandler(document, 'mouseup', this._onmouseupDelegate);
        $removeHandler(document, 'selectstart', this._onselectstartDelegate);

        if(Sys.Browser.agent === Sys.Browser.Opera)
            $removeHandler(document, 'mousedown', this._onselectstartDelegate);

        Sys.UI.DomElement.removeCssClass(this._frame, this._resizableCssClass);
    },

    _onselectstart: function(e) {
        // Don't allow selection during drag
        e.preventDefault();

        return false;
    },

    _resizeControl: function(clientX, clientY, deltaX, deltaY) {
        // Save last client X/Y
        this._lastClientX = clientX;
        this._lastClientY = clientY;

        // Calculate new lining/frame width/height
        var _liningWidth = Math.min(Math.max(this._lining.offsetWidth + deltaX, Math.max(this._minimumWidth, this._handle.offsetWidth)), this._maximumWidth),
            _liningHeight = Math.min(Math.max(this._lining.offsetHeight + deltaY, Math.max(this._minimumHeight, this._handle.offsetHeight)), this._maximumHeight);

        // Set new lining/frame width/height
        this._lining.style.width = _liningWidth + 'px';
        this._lining.style.height = _liningHeight + 'px';
        this._frame.style.width = _liningWidth + 'px';
        this._frame.style.height = _liningHeight + 'px';

        // Calculate new handle left/top
        var _handleLeft = this._lining.offsetWidth - this._handle.offsetWidth + this._handleOffsetX,
            _handleTop = this._lining.offsetHeight - this._handle.offsetHeight + this._handleOffsetY;

        // Set new handle left/top
        this._handle.style.left = _handleLeft + 'px';
        this._handle.style.top = _handleTop + 'px';

        // Raise the resizing event
        this.raise_resizing();
    },

    _rememberSize: function() {
        var size = this.get_size();
        // save the size in ClientState
        Sys.Extended.UI.ResizableControlBehavior.callBaseMethod(this, 'set_ClientState', [size.width + ',' + size.height]);
        // Raise the resize event
        this.raise_resize();
    },

    _measurementToNumber: function(m) {
        // Get the magnitude of a measurement
        // "m" - Measurement
        // returns - magnitude of a measurement
        return m.replace('px', '');
    },

    /// <summary>
    /// The name of the CSS class to apply to the resize handle
    /// </summary>
    /// <getter>get_handleCssClass</getter>
    /// <setter>set_handleCssClass</setter>
    /// <member name="cP:AjaxControlToolkit.ResizableControlExtender.handleCssClass" />
    get_handleCssClass: function() {
        return this._handleCssClass;
    },
    set_handleCssClass: function(value) {
        if(this._handleCssClass)
            throw String.format(Sys.Extended.UI.Resources.ResizableControlBehavior_CannotChangeProperty, 'handleCssClass');

        this._handleCssClass = value;
        this.raisePropertyChanged('handleCssClass');
    },

    get_HandleCssClass: function() {
        Sys.Extended.Deprecated("get_HandleCssClass()", "get_handleCssClass()");
        return this.get_handleCssClass();
    },
    set_HandleCssClass: function(value) {
        Sys.Extended.Deprecated("set_HandleCssClass(value)", "set_handleCssClass(value)");
        this.set_handleCssClass(value);
    },

    /// <summary>
    /// The name of the CSS class to apply to the element when resizing
    /// </summary>
    /// <getter>get_resizableCssClass</getter>
    /// <setter>set_resizableCssClass</setter>
    /// <member name="cP:AjaxControlToolkir.ResizableControlExtender.resizableCssClass" />
    get_resizableCssClass: function() {
        return this._resizableCssClass;
    },
    set_resizableCssClass: function(value) {
        if(this._resizableCssClass)
            throw String.format(Sys.Extended.UI.Resources.ResizableControlBehavior_CannotChangeProperty, 'resizableCssClass');

        this._resizableCssClass = value;
        this.raisePropertyChanged('resizableCssClass');
    },

    get_ResizableCssClass: function() {
        Sys.Extended.Deprecated("get_ResizableCssClass()", "get_resizableCssClass()");
        return this.get_resizableCssClass();
    },
    set_ResizableCssClass: function(value) {
        Sys.Extended.Deprecated("set_ResizableCssClass(value)", "set_resizableCssClass(value)");
        this.set_resizableCssClass(value);
    },

    /// <summary>
    /// X-Offset to apply to the location of the resize handle
    /// </summary>
    /// <getter>get_handleOffsetX</getter>
    /// <setter>set_handleOffsetX</setter>
    /// <member name="cP:AjaxControlToolkit.ResizableControlExtender.handleOffsetX" />
    get_handleOffsetX: function() {
        return this._handleOffsetX;
    },
    set_handleOffsetX: function(value) {
        if(this._handleOffsetX != value) {
            this._handleOffsetX = value;
            this.raisePropertyChanged('handleOffsetX');
        }
    },

    get_HandleOffsetX: function() {
        Sys.Extended.Deprecated("get_HandleOffsetX()", "get_handleOffsetX()");
        return this.get_handleOffsetX();
    },
    set_HandleOffsetX: function(value) {
        Sys.Extended.Deprecated("set_HandleOffsetX(value)", "set_handleOffsetX(value)");
        this.set_handleOffsetX(value);
    },

    /// <summary>
    /// Y-Offset to apply to the location of the resize handle
    /// </summary>
    /// <getter>get_handleOffsetY</getter>
    /// <setter>set_handleOffsetY</setter>
    /// <member name="cP:AjaxControlToolkit.ResizableControlExtender.handleOffsetY" />
    get_handleOffsetY: function() {
        return this._handleOffsetY;
    },
    set_handleOffsetY: function(value) {
        if(this._handleOffsetY != value) {
            this._handleOffsetY = value;
            this.raisePropertyChanged('handleOffsetY');
        }
    },

    get_HandleOffsetY: function() {
        Sys.Extended.Deprecated("get_HandleOffsetY()", "get_handleOffsetY()");
        return this.get_handleOffsetY();
    },
    set_HandleOffsetY: function(value) {
        Sys.Extended.Deprecated("set_HandleOffsetY(value)", "set_handleOffsetY(value)");
        this.set_handleOffsetY(value);
    },

    /// <summary>
    /// Minimum width of the resizable element
    /// </summary>
    /// <getter>get_minimumWidth</getter>
    /// <setter>set_minimumWidth</setter>
    /// <member name="cP:AjaxControlToolkit.ResizableControlExtender.minimumWidth" />
    get_minimumWidth: function() {
        return this._minimumWidth;
    },
    set_minimumWidth: function(value) {
        if(this._minimumWidth != value) {
            this._minimumWidth = value;
            this.raisePropertyChanged('minimumWidth');
        }
    },

    get_MinimumWidth: function() {
        Sys.Extended.Deprecated("get_MinimumWidth()", "get_minimumWidth()");
        return this.get_minimumWidth();
    },
    set_MinimumWidth: function(value) {
        Sys.Extended.Deprecated("set_MinimumWidth(value)", "set_minimumWidth(value)");
        this.set_minimumWidth(value);
    },

    /// <summary>
    /// Minimum height of the resizable element
    /// </summary>
    /// <getter>get_minimumHeight</getter>
    /// <setter>set_minimumHeight</setter>
    /// <member name="cP:AjaxControlToolkit.ResizableControlExtender.minimumHeight" />
    get_minimumHeight: function() {
        return this._minimumHeight;
    },
    set_minimumHeight: function(value) {
        if(this._minimumHeight != value) {
            this._minimumHeight = value;
            this.raisePropertyChanged('minimumHeight');
        }
    },

    get_MinimumHeight: function() {
        Sys.Extended.Deprecated("get_MinimumHeight()", "get_minimumHeight()");
        return this.get_minimumHeight();
    },
    set_MinimumHeight: function(value) {
        Sys.Extended.Deprecated("set_MinimumHeight(value)", "set_minimumHeight(value)");
        this.set_minimumHeight(value);
    },

    /// <summary>
    /// Maximum width of the resizable element
    /// </summary>
    /// <getter>get_maximumWidth</getter>
    /// <setter>set_maximumWidth</setter>
    /// <member name="cP:AjaxControlToolkit.ResizableControlExtender.maximumWidth" />
    get_maximumWidth: function() {
        return this._maximumWidth;
    },
    set_maximumWidth: function(value) {
        if(this._maximumWidth != value) {
            this._maximumWidth = value;
            this.raisePropertyChanged('maximumWidth');
        }
    },

    get_MaximumWidth: function() {
        Sys.Extended.Deprecated("get_MaximumWidth()", "get_maximumWidth()");
        return this.get_maximumWidth();
    },
    set_MaximumWidth: function(value) {
        Sys.Extended.Deprecated("set_MaximumWidth(value)", "set_maximumWidth(value)");
        this.set_maximumWidth(value);
    },

    /// <summary>
    /// Maximum height of the resizable element
    /// </summary>
    /// <getter>get_maximumHeight</getter>
    /// <setter>set_maximumHeight</setter>
    /// <member name="cP:AjaxControlToolkit.ResizableControlExtender.maximumHeight" />
    get_maximumHeight: function() {
        return this._maximumHeight;
    },
    set_maximumHeight: function(value) {
        if(this._maximumHeight != value) {
            this._maximumHeight = value;
            this.raisePropertyChanged('maximumHeight');
        }
    },

    get_MaximumHeight: function() {
        Sys.Extended.Deprecated("get_MaximumHeight()", "get_maximumHeight()");
        return this.get_maximumHeight();
    },
    set_MaximumHeight: function(value) {
        Sys.Extended.Deprecated("set_MaximumHeight(value)", "set_maximumHeight(value)");
        this.set_maximumHeight(value);
    },

    /// <summary>
    /// Fires as the element is being resized
    /// </summary>
    /// <event add="add_resizing" remove="remove_resizing" raise="raise_resizing" />
    /// <member name="cE:AjaxControlToolkit.ResizableControlExtender.resizing" />
    add_resizing: function(handler) {
        this.get_events().addHandler("resizing", handler);
    },
    remove_resizing: function(handler) {
        this.get_events().removeHandler("resizing", handler);
    },
    raise_resizing: function() {
        var onResizingHandler = this.get_events().getHandler("resizing");
        if(onResizingHandler)
            onResizingHandler(this, Sys.EventArgs.Empty);
    },
    raiseResizing: function() {
        Sys.Extended.Deprecated("raiseResizing()", "raise_resizing()");
        this.raise_resizing();
    },

    /// <summary>
    /// The Resizing event handler
    /// </summary>
    /// <getter>get_resizing</getter>
    /// <setter>set_resizing</setter>
    /// <member name="cP:AjaxControlToolkit.ResizableControlExtender.resizing" />
    get_resizing: function() {
        // Function to invoke on resizing (can a Function, name of a Function, or expression that evaluates to a Function)
        return this.get_events().getHandler("resizing");
    },
    set_resizing: function(value) {
        if(value && (0 < value.length)) {
            var func = $common.resolveFunction(value);

            if(func)
                this.add_resizing(func);
            else
                throw Error.argumentType('value', typeof (value), 'Function', String.format(Sys.Extended.UI.Resources.ResizableControlBehavior_InvalidHandler, 'resizing'));
        }
    },

    /// <summary>
    /// Fires when the element has been resized
    /// </summary>
    /// <event add="add_resize" remove="remove_resize" raise="raise_resize" />
    /// <member name="cE:AjaxControlToolkit.ResizableControlExtender.resize" />
    add_resize: function(handler) {
        this.get_events().addHandler("resize", handler);
    },
    remove_resize: function(handler) {
        this.get_events().removeHandler("resize", handler);
    },
    raise_resize: function() {
        var onResizeHandler = this.get_events().getHandler("resize");
        if(onResizeHandler)
            onResizeHandler(this, Sys.EventArgs.Empty);
    },
    raiseResize: function() {
        Sys.Extended.Deprecated("raiseResize()", "raise_resize()");
        this.raise_resize();
    },

    /// <summary>
    /// The Resize event handler
    /// </summary>
    /// <getter>get_resize</getter>
    /// <setter>set_resize</setter>
    /// <member name="cP:AjaxControlToolkit.ResizableControlExtender.resize" />
    get_resize: function() {
        // Function to invoke on resize (can be a Function, name of a Function, or expression that evaluates to a Function)
        return this.get_events().getHandler("resize");
    },
    set_resize: function(value) {
        if(value && (0 < value.length)) {
            var func = $common.resolveFunction(value);

            if(func)
                this.add_resize(func);
            else
                throw Error.argumentType('value', typeof (value), 'Function', String.format(Sys.Extended.UI.Resources.ResizableControlBehavior_InvalidHandler, 'resize'));
        }
    },

    /// <summary>
    /// Fires when the element starts being resized
    /// </summary>
    /// <event add="add_resizeBegin" remove="remove_resizeBegin" raise="raise_resizeBegin" />
    /// <member name="cE:AjaxControlToolkit.ResizableControlExtender.resizeBegin" />
    add_resizeBegin: function(handler) {
        this.get_events().addHandler("resizeBegin", handler);
    },
    remove_resizeBegin: function(handler) {
        this.get_events().removeHandler("resizeBegin", handler);
    },
    raise_resizeBegin: function() {
        var onResizeBeginHandler = this.get_events().getHandler("resizeBegin");

        if(onResizeBeginHandler)
            onResizeBeginHandler(this, Sys.EventArgs.Empty);
    },

    add_resizebegin: function(handler) {
        Sys.Extended.Deprecated("add_resizebegin(handler)", "add_resizeBegin(handler)");
        this.add_resizeBegin(handler);
    },
    remove_resizebegin: function(handler) {
        Sys.Extended.Deprecated("remove_resizebegin(handler)", "remove_resizeBegin(handler)");
        this.remove_resizeBegin(handler);
    },
    raiseResizeBegin: function() {
        Sys.Extended.Deprecated("raiseResizeBegin()", "raise_resizeBegin()");
        this.raise_resizeBegin();
    },

    /// <summary>
    /// The ResizeBegin event handler
    /// </summary>
    /// <getter>get_resizeBegin</getter>
    /// <setter>set_resizeBegin</setter>
    /// <member name="cP:AjaxControlToolkit.ResizableControlExtender.resizeBegin" />
    get_resizeBegin: function() {
        // Function to invoke on resizebegin (can be a Function, name of a Function, or expression that evaluates to a Function)
        return this.get_events().getHandler("resizeBegin");
    },
    set_resizeBegin: function(value) {
        if(value && (0 < value.length)) {
            var func = $common.resolveFunction(value);

            if(func)
                this.add_resizeBegin(func);
            else
                throw Error.argumentType('value', typeof (value), 'Function', String.format(Sys.Extended.UI.Resources.ResizableControlBehavior_InvalidHandler, 'resizeBegin'));
        }
    },

    get_resizebegin: function() {
        Sys.Extended.Deprecated("get_resizebegin()", "get_resizeBegin()");
        return this.get_resizeBegin();
    },
    set_resizebegin: function(value) {
        Sys.Extended.Deprecated("set_resizebegin(value)", "set_resizeBegin(value)");
        this.set_resizeBegin(value);
    },

    /// <summary>
    /// Size of the target (of the form {width, height})
    /// </summary>
    /// <getter>get_size</getter>
    /// <setter>set_size</setter>
    /// <member name="cP:AjaxControlToolkit.ResizableControlExtender.size" />
    get_size: function() {
        return {
            width: this._measurementToNumber($common.getCurrentStyle(this._lining, 'width')),
            height: this._measurementToNumber($common.getCurrentStyle(this._lining, 'height'))
        };
    },
    set_size: function(value) {
        var deltaX = value.width - this._measurementToNumber($common.getCurrentStyle(this._lining, 'width')),
            deltaY = value.height - this._measurementToNumber($common.getCurrentStyle(this._lining, 'height'));

        this._resizeControl(0, 0, deltaX, deltaY);
        this._rememberSize();
        this.raisePropertyChanged('size');
    },

    get_Size: function() {
        Sys.Extended.Deprecated("get_Size()", "get_size()");
        return this.get_size();
    },
    set_Size: function(value) {
        Sys.Extended.Deprecated("set_Size(value)", "set_size(value)");
        this.set_size(value);
    }
}

Sys.Extended.UI.ResizableControlBehavior.registerClass('Sys.Extended.UI.ResizableControlBehavior', Sys.Extended.UI.BehaviorBase);