// (c) 2010 CodePlex Foundation



/// <reference name="MicrosoftAjax.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />

(function() {
var scriptName = "ExtendedResizable";

function execute() {

Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.ResizableControlBehavior = function(element) {
    /// <summary>
    /// The ResizableControlBehavior makes the target element resizable
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" domElement="true">
    /// DOM element associated with the behaviro
    /// </param>
    Sys.Extended.UI.ResizableControlBehavior.initializeBase(this, [element]);
    
    this._HandleCssClass = "";
    this._ResizableCssClass = "";
    this._HandleOffsetX = 0;
    this._HandleOffsetY = 0;
    this._MinimumWidth = 0;
    this._MinimumHeight = 0;
    this._MaximumWidth = 100000;
    this._MaximumHeight = 100000;

    this._frame = null;
    this._handle = null;
    this._handleHolder = null;
    this._lining = null;
    this._tracking = false;
    this._lastClientX = 0;
    this._lastClientY = 0;

    this._onmouseoverDelegate = null;
    this._onmouseoutDelegate = null;
    this._onmousedownDelegate = null;
    this._onmousemoveDelegate = null;
    this._onmouseupDelegate = null;
    this._onselectstartDelegate = null;
}
Sys.Extended.UI.ResizableControlBehavior.prototype = {
    initialize : function() {
        /// <summary>
        /// Initialize the behavior
        /// </summary>
        Sys.Extended.UI.ResizableControlBehavior.callBaseMethod(this, 'initialize');

        this._frame = this.get_element();

        var savedSizeString = Sys.Extended.UI.ResizableControlBehavior.callBaseMethod(this, 'get_ClientState');
        if (savedSizeString && (-1 != savedSizeString.indexOf(','))) {
            var savedSize = savedSizeString.split(',');
            this._frame.style.width = savedSize[0]+'px';
            this._frame.style.height = savedSize[1]+'px';
        }

        this._lining = document.createElement('DIV');
        this._lining.style.width = $common.getCurrentStyle(this._frame, 'width');
        this._lining.style.height = $common.getCurrentStyle(this._frame, 'height');
        this._lining.style.position = 'absolute';
        this._lining.style.backgroundColor = 'black';  // Keeps browsers from ignoring the content-free element
        this._lining.style.opacity = "0";  // Makes the lining invisible
        this._lining.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=0)";  // Ditto, for IE
        this._lining.style.visibility = 'hidden';
        this._frame.insertBefore(this._lining, this._frame.firstChild);

        this._handleHolder = document.createElement('DIV');
        this._handleHolder.style.width = '0px';
        this._handleHolder.style.height = '0px';
        this._handleHolder.style.position = ((Sys.Browser.agent === Sys.Browser.Opera) ? 'relative' : 'absolute');
        this._frame.insertBefore(this._handleHolder, this._frame.firstChild);

        this._handle = document.createElement('DIV');
        this._handle.className = this._HandleCssClass;
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

    dispose : function() {
        /// <summary>
        /// Dispose the behavior
        /// </summary>
        if (this._onmouseoverDelegate) {
            $removeHandler(this._handle, 'mouseover', this._onmouseoverDelegate);
            this._onmouseoverDelegate = null;
        }

        if (this._onmouseoutDelegate) {
            $removeHandler(this._handle, 'mouseout', this._onmouseoutDelegate);
            this._onmouseoutDelegate = null;
        }

        if (this._onmousedownDelegate) {
            $removeHandler(this._handle, 'mousedown', this._onmousedownDelegate);
            this._onmousedownDelegate = null;
        }

        if (this._onmousemoveDelegate) {
            if (this.tracking) {
                $removeHandler(document, 'mousemove', this._onmousemoveDelegate);
            }
            this._onmousemoveDelegate = null;
        }

        if (this._onmouseupDelegate) {
            if (this.tracking) {
                $removeHandler(document, 'mouseup', this._onmouseupDelegate);
            }
            this._onmouseupDelegate = null;
        }

        if (this._onselectstartDelegate) {
            if (this.tracking) {
                $removeHandler(document, 'selectstart', this._onselectstartDelegate);
                if (Sys.Browser.agent === Sys.Browser.Opera) {
                    $removeHandler(document, 'mousedown', this._onselectstartDelegate);
                }
            }
            this._onselectstartDelegate = null;
        }

        Sys.Extended.UI.ResizableControlBehavior.callBaseMethod(this, 'dispose');
    },

    _onmouseover : function() {
        /// <summary>
        /// Handler for the handle's mouseover event
        /// </summary>
        Sys.UI.DomElement.addCssClass(this._frame, this._ResizableCssClass);
    },

    _onmouseout : function() {
        /// <summary>
        /// Handler for the handle's mouseout event
        /// </summary>
        if (!this._tracking) {
            Sys.UI.DomElement.removeCssClass(this._frame, this._ResizableCssClass);
        }
    },

    _onmousedown : function(e) {
        /// <summary>
        /// Handler for the handle's mousedown event
        /// </summary>

        if (!e) {
            e = event;
        }
        this._onmousedownImplementation(e.clientX, e.clientY);
    },
    
    _onmousedownImplementation : function(clientX, clientY) {
        /// <summary>
        /// Setup the target for resizing when its handle receives a mousedown event
        /// </summary>
        /// <param name="clientX" type="Number" integer="true">
        /// X coordinate of the click
        /// </param>
        /// <param name="clientY" type="Number" integer="true">
        /// Y coordinate of the click
        /// </param>

        this._tracking = true;
        this._resizeControl(clientX, clientY, 0, 0);
        this._lining.style.visibility = 'visible';  // Overlay resizing control to avoid interacting with it (ex: IFRAME)
        $addHandler(document, 'mousemove', this._onmousemoveDelegate);
        $addHandler(document, 'mouseup', this._onmouseupDelegate);
        $addHandler(document, 'selectstart', this._onselectstartDelegate);
        if (Sys.Browser.agent === Sys.Browser.Opera) {
            $addHandler(document, 'mousedown', this._onselectstartDelegate);
        }
        this.raiseResizeBegin();
    },

    _onmousemove : function(e) {
        /// <summary>
        /// Handler for the handle's mousemove event
        /// </summary>

        if (!e) {
            e = event;
        }
        this._onmousemoveImplementation(e.clientX, e.clientY);
    },
    
    _onmousemoveImplementation : function(clientX, clientY) {
        /// <summary>
        /// Resize the target when the handle receives mousemove events
        /// </summary>
        /// <param name="clientX" type="Number" integer="true">
        /// X coordinate of the click
        /// </param>
        /// <param name="clientY" type="Number" integer="true">
        /// Y coordinate of the click
        /// </param>

        if (this._tracking) {
            var deltaX = (clientX-this._lastClientX);
            var deltaY = (clientY-this._lastClientY);
            this._resizeControl(clientX, clientY, deltaX, deltaY);
        }
    },

    _onmouseup : function() {
        /// <summary>
        /// Handler for the handle's mouseup event
        /// </summary>

        this._tracking = false;
        this._rememberSize();
        this._lining.style.visibility = 'hidden';
        $removeHandler(document, 'mousemove', this._onmousemoveDelegate);
        $removeHandler(document, 'mouseup', this._onmouseupDelegate);
        $removeHandler(document, 'selectstart', this._onselectstartDelegate);
        if (Sys.Browser.agent === Sys.Browser.Opera) {
            $removeHandler(document, 'mousedown', this._onselectstartDelegate);
        }
        Sys.UI.DomElement.removeCssClass(this._frame, this._ResizableCssClass);
    },

    _onselectstart : function(e) {
        /// <summary>
        /// Handler for the target's selectstart event
        /// </summary>
        /// <param name="e" type="Sys.UI.DomEvent">
        /// Event info
        /// </param>

        e.preventDefault();
        return false;
    },

    _resizeControl : function(clientX, clientY, deltaX, deltaY) {
        /// <summary>
        /// Resize the target
        /// </summary>
        /// <param name="clientX" type="Number" integer="true">
        /// Starting X coordinate
        /// </param>
        /// <param name="clientY" type="Number" integer="true">
        /// Starting Y coordinate
        /// </param>
        /// <param name="deltaX" type="Number" integer="true">
        /// Change in the width
        /// </param>
        /// <param name="deltaY" type="Number" integer="true">
        /// Change in the height
        /// </param>

        this._lastClientX = clientX;
        this._lastClientY = clientY;
        var _liningWidth = Math.min(Math.max(this._lining.offsetWidth+deltaX, Math.max(this._MinimumWidth, this._handle.offsetWidth)), this._MaximumWidth);
        var _liningHeight = Math.min(Math.max(this._lining.offsetHeight+deltaY, Math.max(this._MinimumHeight, this._handle.offsetHeight)), this._MaximumHeight);
        this._lining.style.width = _liningWidth+'px';
        this._lining.style.height = _liningHeight+'px';
        this._frame.style.width = _liningWidth+'px';
        this._frame.style.height = _liningHeight+'px';
        var _handleLeft = this._lining.offsetWidth-this._handle.offsetWidth+this._HandleOffsetX;
        var _handleTop = this._lining.offsetHeight-this._handle.offsetHeight+this._HandleOffsetY;
        this._handle.style.left = _handleLeft+'px';
        this._handle.style.top = _handleTop+'px';
        this.raiseResizing();
    },

    _rememberSize : function() {
        /// <summary>
        /// Save the size in ClientState
        /// </summary>
        var size = this.get_Size();
        Sys.Extended.UI.ResizableControlBehavior.callBaseMethod(this, 'set_ClientState', [ size.width+','+size.height ]);
        this.raiseResize();
    },

    _measurementToNumber : function(m) {
        /// <summary>
        /// Get the magnitude of a measurement
        /// </summary>
        /// <param name="m" type="String">
        /// Measurement
        /// </param>
        /// <returns type="String">
        /// Magnitude of a measurement
        /// </returns>
        return m.replace('px', '');
    },

    get_HandleCssClass : function() {
        /// <value type="String">
        /// The name of the CSS class to apply to the resize handle
        /// </value>
        return this._HandleCssClass;
    },
    set_HandleCssClass : function(value) {
        if (this._HandleCssClass) {
            throw String.format(Sys.Extended.UI.Resources.ResizableControlBehavior_CannotChangeProperty, 'HandleCssClass');
        }
        this._HandleCssClass = value;
        this.raisePropertyChanged('HandleCssClass');
    },

    get_ResizableCssClass : function() {
        /// <value type="String">
        /// name of the CSS class to apply to the element when resizing
        /// </value>
        return this._ResizableCssClass;
    },
    set_ResizableCssClass : function(value) {
        if (this._ResizableCssClass) {
            throw String.format(Sys.Extended.UI.Resources.ResizableControlBehavior_CannotChangeProperty, 'ResizableCssClass');
        }
        this._ResizableCssClass = value;
        this.raisePropertyChanged('ResizableCssClass');
    },

    get_HandleOffsetX : function() {
        /// <value type="Number" integer="true">
        /// Horizontal offset to apply to the location of the resize handle
        /// </value>
        return this._HandleOffsetX;
    },
    set_HandleOffsetX : function(value) {
        if (this._HandleOffsetX != value) {
            this._HandleOffsetX = value;
            this.raisePropertyChanged('HandleOffsetX');
        }
    },

    get_HandleOffsetY : function() {
        /// <value type="Number" integer="true">
        /// Vertical offset to apply to the location of the resize handle
        /// </value>
        return this._HandleOffsetY;
    },
    set_HandleOffsetY : function(value) {
        if (this._HandleOffsetY != value) {
            this._HandleOffsetY = value;
            this.raisePropertyChanged('HandleOffsetY');
        }
    },

    get_MinimumWidth : function() {
        /// <value type="Number" integer="true">
        /// Minimum width of the resizable element
        /// </value>
        return this._MinimumWidth;
    },
    set_MinimumWidth : function(value) {
        if (this._MinimumWidth != value) {
            this._MinimumWidth = value;
            this.raisePropertyChanged('MinimumWidth');
        }
    },

    get_MinimumHeight : function() {
        /// <value type="Number" integer="true">
        /// Minimum height of the resizable element
        /// </value>
        return this._MinimumHeight;
    },
    set_MinimumHeight : function(value) {
        if (this._MinimumHeight != value) {
            this._MinimumHeight = value;
            this.raisePropertyChanged('MinimumHeight');
        }
    },

    get_MaximumWidth : function() {
        /// <value type="Number" integer="true">
        /// Maximum width of the resizing element
        /// </value>
        return this._MaximumWidth;
    },
    set_MaximumWidth : function(value) {
        if (this._MaximumWidth != value) { 
            this._MaximumWidth = value;
            this.raisePropertyChanged('MaximumWidth');
        }
    },

    get_MaximumHeight : function() {
        /// <value type="Number" integer="true">
        /// Maximum height of the resizing element
        /// </value>
        return this._MaximumHeight;
    },
    set_MaximumHeight : function(value) {
        if (this._MaximumHeight != value) {
            this._MaximumHeight = value;
            this.raisePropertyChanged('MaximumHeight');
        }
    },

    add_resizing : function(handler) {
        /// <summary>
        /// Add a handler to the resizing event
        /// </summary>
        /// <param name="handler" type="Function">
        /// Handler
        /// </param>
        this.get_events().addHandler("resizing", handler);
    },
    remove_resizing : function(handler) {
        /// <summary>
        /// Remove a handler from the resizing event
        /// </summary>
        /// <param name="handler" type="Function">
        /// Handler
        /// </param>
        this.get_events().removeHandler("resizing", handler);
    },
    raiseResizing : function() {
        /// <summary>
        /// Raise the resizing event
        /// </summary>
        var onResizingHandler = this.get_events().getHandler("resizing");
        if (onResizingHandler) {
            onResizingHandler(this, Sys.EventArgs.Empty);
        }
    },

    get_resizing : function() {
        /// <value type="Object">
        /// Function to invoke on resizing (can a Function, name of a Function, or expression that evaluates to a Function)
        /// </value>
        return this.get_events().getHandler("resizing");
    },
    set_resizing : function(value) {
        if (value && (0 < value.length)) {
            var func = $common.resolveFunction(value);
            if (func) { 
                this.add_resizing(func);
            } else {
                throw Error.argumentType('value', typeof(value), 'Function', String.format(Sys.Extended.UI.Resources.ResizableControlBehavior_InvalidHandler, 'resizing'));
            }
        }
    },

    add_resize : function(handler) {
        /// <summary>
        /// Add a handler to the resize event
        /// </summary>
        /// <param name="handler" type="Function">
        /// Handler
        /// </param>
        this.get_events().addHandler("resize", handler);
    },
    remove_resize : function(handler) {
        /// <summary>
        /// Remove a handler from the resize event
        /// </summary>
        /// <param name="handler" type="Function">
        /// Handler
        /// </param>
        this.get_events().removeHandler("resize", handler);
    },
    raiseResize : function() {
        /// <summary>
        /// Raise the resize event
        /// </summary>
        var onResizeHandler = this.get_events().getHandler("resize");
        if (onResizeHandler) {
            onResizeHandler(this, Sys.EventArgs.Empty);
        }
    },

    get_resize : function() {
        /// <value type="Object">
        /// Function to invoke on resize (can be a Function, name of a Function, or expression that evaluates to a Function)
        /// </value>
        return this.get_events().getHandler("resize");
    },
    set_resize : function(value) {
        if (value && (0 < value.length)) {
            var func = $common.resolveFunction(value);
            if (func) { 
                this.add_resize(func);
            } else {
                throw Error.argumentType('value', typeof(value), 'Function', String.format(Sys.Extended.UI.Resources.ResizableControlBehavior_InvalidHandler, 'resize'));
            }
        }
    },

    add_resizebegin : function(handler) {
        /// <summary>
        /// Add a handler to the resizebegin event
        /// </summary>
        /// <param name="handler" type="Function">
        /// Handler
        /// </param>
        this.get_events().addHandler("resizebegin", handler);
    },
    remove_resizebegin : function(handler) {
        /// <summary>
        /// Remove a handler from the resizebegin event
        /// </summary>
        /// <param name="handler" type="Function">
        /// Handler
        /// </param>
        this.get_events().removeHandler("resizebegin", handler);
    },
    raiseResizeBegin : function() {
        /// <summary>
        /// Raise the resizebegin event
        /// </summary>
        var onresizebeginHandler = this.get_events().getHandler("resizebegin");
        if (onresizebeginHandler) {
            onresizebeginHandler(this, Sys.EventArgs.Empty);
        }
    },

    get_resizebegin : function() {
        /// <value type="Object">
        /// Function to invoke on resizebegin (can be a Function, name of a Function, or expression that evaluates to a Function)
        /// </value>
        return this.get_events().getHandler("resizebegin");
    },
    set_resizebegin : function(value) {
        if (value && (0 < value.length)) {
            var func = $common.resolveFunction(value);
            if (func) { 
                this.add_resizebegin(func);
            } else {
                throw Error.argumentType('value', typeof(value), 'Function', String.format(Sys.Extended.UI.Resources.ResizableControlBehavior_InvalidHandler, 'resizebegin'));
            }
        }
    },

    get_Size : function() {
        /// <value type="Object">
        /// Size of the target (of the form {width, height})
        /// </value>
        return { width: this._measurementToNumber($common.getCurrentStyle(this._lining, 'width')),
            height: this._measurementToNumber($common.getCurrentStyle(this._lining, 'height'))};
    },
    set_Size : function(value) {
        var deltaX = value.width-this._measurementToNumber($common.getCurrentStyle(this._lining, 'width'));
        var deltaY = value.height-this._measurementToNumber($common.getCurrentStyle(this._lining, 'height'));
        this._resizeControl(0, 0, deltaX, deltaY);
        this._rememberSize();
        this.raisePropertyChanged('Size');
    }
}
Sys.Extended.UI.ResizableControlBehavior.registerClass('Sys.Extended.UI.ResizableControlBehavior', Sys.Extended.UI.BehaviorBase);
Sys.registerComponent(Sys.Extended.UI.ResizableControlBehavior, { name: "resizable" });


} // execute

if (window.Sys && Sys.loader) {
    Sys.loader.registerScript(scriptName, ["ExtendedBase", "ExtendedCommon"], execute);
}
else {
    execute();
}

})();
