if (!window.SIGNAL)
    window.SIGNAL = "----seadragon----";

Type.registerNamespace('Sys.Extended.UI.Seadragon');
Type.registerNamespace('Seadragon');

Sys.Extended.UI.Seadragon.ControlAnchor = function() {
    throw Error.invalidOperation();
};
Sys.Extended.UI.Seadragon.ControlAnchor.prototype = {
    NONE: 0,
    TOP_LEFT: 1,
    TOP_RIGHT: 2,
    BOTTOM_RIGHT: 3,
    BOTTOM_LEFT: 4
};
Sys.Extended.UI.Seadragon.ControlAnchor.registerEnum("Sys.Extended.UI.Seadragon.ControlAnchor", false);

Seadragon.ControlAnchor = Sys.Extended.UI.Seadragon.ControlAnchor;

Sys.Extended.UI.Seadragon.OverlayPlacement = function() {
    throw Error.invalidOperation();
};
Sys.Extended.UI.Seadragon.OverlayPlacement.prototype = {
    CENTER: 0,
    TOP_LEFT: 1,
    TOP: 2,
    TOP_RIGHT: 3,
    RIGHT: 4,
    BOTTOM_RIGHT: 5,
    BOTTOM: 6,
    BOTTOM_LEFT: 7,
    LEFT: 8
};
Sys.Extended.UI.Seadragon.OverlayPlacement.registerEnum("Sys.Extended.UI.Seadragon.OverlayPlacement", false);
Seadragon.OverlayPlacement = Sys.Extended.UI.Seadragon.OverlayPlacement;

Sys.Extended.UI.Seadragon.NavControl = function(viewer) {
    this._group = null;
    this._zooming = false;    // whether we should be continuously zooming
    this._zoomFactor = null;  // how much we should be continuously zooming by
    this._lastZoomTime = null;
    this._viewer = viewer;
    this.config = this._viewer.config;

    this.elmt = null;
    this.initialize();
};
Sys.Extended.UI.Seadragon.NavControl.prototype = {
    initialize: function() {
        var beginZoomingInHandler = Function.createDelegate(this, this._beginZoomingIn);
        var endZoomingHandler = Function.createDelegate(this, this._endZooming);
        var doSingleZoomInHandler = Function.createDelegate(this, this._doSingleZoomIn);
        var beginZoomingOutHandler = Function.createDelegate(this, this._beginZoomingOut);
        var doSingleZoomOutHandler = Function.createDelegate(this, this._doSingleZoomOut);
        var onHomeHandler = Function.createDelegate(this, this._onHome);
        var onFullPageHandler = Function.createDelegate(this, this._onFullPage);

        var navImages = this._viewer.config.navImages;
        var zoomIn = $create(Sys.Extended.UI.Seadragon.Button,
                    { config: this._viewer.config, tooltip: Seadragon.Strings.getString("Tooltips.ZoomIn"), srcRest: this._resolveUrl(navImages.zoomIn.REST), srcGroup: this._resolveUrl(navImages.zoomIn.GROUP), srcHover: this._resolveUrl(navImages.zoomIn.HOVER), srcDown: this._resolveUrl(navImages.zoomIn.DOWN) },
                    { onPress: beginZoomingInHandler, onRelease: endZoomingHandler, onClick: doSingleZoomInHandler, onEnter: beginZoomingInHandler, onExit: endZoomingHandler }, null, null);
        var zoomOut = $create(Sys.Extended.UI.Seadragon.Button,
                    { config: this._viewer.config, tooltip: Seadragon.Strings.getString("Tooltips.ZoomOut"), srcRest: this._resolveUrl(navImages.zoomOut.REST), srcGroup: this._resolveUrl(navImages.zoomOut.GROUP), srcHover: this._resolveUrl(navImages.zoomOut.HOVER), srcDown: this._resolveUrl(navImages.zoomOut.DOWN) },
                    { onPress: beginZoomingOutHandler, onRelease: endZoomingHandler, onClick: doSingleZoomOutHandler, onEnter: beginZoomingOutHandler, onExit: endZoomingHandler }, null, null);
        var goHome = $create(Sys.Extended.UI.Seadragon.Button,
                    { config: this._viewer.config, tooltip: Seadragon.Strings.getString("Tooltips.Home"), srcRest: this._resolveUrl(navImages.home.REST), srcGroup: this._resolveUrl(navImages.home.GROUP), srcHover: this._resolveUrl(navImages.home.HOVER), srcDown: this._resolveUrl(navImages.home.DOWN) },
                    { onRelease: onHomeHandler }, null, null);
        var fullPage = $create(Sys.Extended.UI.Seadragon.Button,
                    { config: this._viewer.config, tooltip: Seadragon.Strings.getString("Tooltips.FullPage"), srcRest: this._resolveUrl(navImages.fullpage.REST), srcGroup: this._resolveUrl(navImages.fullpage.GROUP), srcHover: this._resolveUrl(navImages.fullpage.HOVER), srcDown: this._resolveUrl(navImages.fullpage.DOWN) },
                    { onRelease: onFullPageHandler }, null, null);
        this._group = $create(Sys.Extended.UI.Seadragon.ButtonGroup,
                    { config: this._viewer.config, buttons: [zoomIn, zoomOut, goHome, fullPage] }, null, null, null);

        this.elmt = this._group.get_element();
        this.elmt[SIGNAL] = true;   // hack to get our controls to fade
        this._viewer.add_open(Function.createDelegate(this, this._lightUp));
    },
    dispose: function() {
    },
    _resolveUrl: function(url) {
        return String.format("{1}", this._viewer.get_prefixUrl(), url);
    },
    _beginZoomingIn: function() {
        this._lastZoomTime = new Date().getTime();
        this._zoomFactor = this.config.zoomPerSecond;
        this._zooming = true;
        this._scheduleZoom();
    },
    _beginZoomingOut: function() {
        this._lastZoomTime = new Date().getTime();
        this._zoomFactor = 1.0 / this.config.zoomPerSecond;
        this._zooming = true;
        this._scheduleZoom();
    },

    _endZooming: function() {
        this._zooming = false;
    },
    _scheduleZoom: function() {
        window.setTimeout(Function.createDelegate(this, this._doZoom), 10);
    },
    _doZoom: function() {
        if (this._zooming && this._viewer.viewport) {
            var currentTime = new Date().getTime();
            var deltaTime = currentTime - this._lastZoomTime;
            var adjustedFactor = Math.pow(this._zoomFactor, deltaTime / 1000);

            this._viewer.viewport.zoomBy(adjustedFactor);
            this._viewer.viewport.applyConstraints();
            this._lastZoomTime = currentTime;
            this._scheduleZoom();
        }
    },
    _doSingleZoomIn: function() {
        if (this._viewer.viewport) {
            this._zooming = false;
            this._viewer.viewport.zoomBy(this.config.zoomPerClick / 1.0);
            this._viewer.viewport.applyConstraints();
        }
    },
    _doSingleZoomOut: function() {
        if (this._viewer.viewport) {
            this._zooming = false;
            this._viewer.viewport.zoomBy(1.0 / this.config.zoomPerClick);
            this._viewer.viewport.applyConstraints();
        }
    },
    _lightUp: function() {
        this._group.emulateEnter();
        this._group.emulateExit();
    },
    _onHome: function() {
        if (this._viewer.viewport) {
            this._viewer.viewport.goHome();
        }
    },
    _onFullPage: function() {
        this._viewer.setFullPage(!this._viewer.isFullPage());
        this._group.emulateExit();  // correct for no mouseout event on change

        if (this._viewer.viewport) {
            this._viewer.viewport.applyConstraints();
        }
    }
};
Sys.Extended.UI.Seadragon.NavControl.registerClass('Sys.Extended.UI.Seadragon.NavControl', null, Sys.IDisposable);

Sys.Extended.UI.Seadragon.Control = function(elmt, anchor, container) {
    // Properties
    this.elmt = elmt;
    this.anchor = anchor;
    this.container = container;
    this.wrapper = Seadragon.Utils.makeNeutralElement("span");
    this.initialize();
};
Sys.Extended.UI.Seadragon.Control.prototype = {
    initialize: function() {
        this.wrapper = Seadragon.Utils.makeNeutralElement("span");
        // Constructor
        this.wrapper.style.display = "inline-block";
        this.wrapper.appendChild(this.elmt);
        if (this.anchor == Seadragon.ControlAnchor.NONE) {
            this.wrapper.style.width = this.wrapper.style.height = "100%";    // IE6 fix
        }
        this.addToAnchor();
    },
    addToAnchor: function() {
        if (this.anchor == Seadragon.ControlAnchor.TOP_RIGHT || this.anchor == Seadragon.ControlAnchor.BOTTOM_RIGHT) {
            this.container.insertBefore(this.elmt, this.container.firstChild);
        } else {
            this.container.appendChild(this.elmt);
        }
    },
    destroy: function() {
        this.wrapper.removeChild(this.elmt);
        this.container.removeChild(this.wrapper);
    },
    isVisible: function() {
        // see note in setVisible() below about using "display: none"
        return this.wrapper.style.display != "none";
    },
    setVisible: function(visible) {
        // using "display: none" instead of "visibility: hidden" so that mouse
        // events are no longer blocked by this invisible control.
        this.wrapper.style.display = visible ? "inline-block" : "none";
    },
    setOpacity: function(opacity) {
        // like with setVisible() above, we really should be working with the
        // wrapper element and not the passed in element directly, so that we
        // don't conflict with the developer's own opacity settings. but this
        // doesn't work in IE always, so for our controls, use a hack for now...
        if (this.elmt[SIGNAL] && Seadragon.Utils.getBrowser() == Seadragon.Browser.IE) {
            Seadragon.Utils.setElementOpacity(this.elmt, opacity, true);
        } else {
            Seadragon.Utils.setElementOpacity(this.wrapper, opacity, true);
        }
    }
};
Sys.Extended.UI.Seadragon.Control.registerClass('Sys.Extended.UI.Seadragon.Control', null, Sys.IDisposable);

Sys.Extended.UI.Seadragon.Viewer = function(element) {
    Sys.Extended.UI.Seadragon.Viewer.initializeBase(this, [element]);
    //Fields

    this.config = new Sys.Extended.UI.Seadragon.Config();
    this._prefixUrl = null;

    this._controls = [];
    this._customControls = null;
    this._overlays = [];
    this._overlayControls = null;
    this._container = null;
    this._canvas = null;
    this._controlsTL = null;
    this._controlsTR = null;
    this._controlsBR = null;
    this._controlsBL = null;
    this._bodyWidth = null;
    this._bodyHeight = null;
    this._bodyOverflow = null;
    this._docOverflow = null;
    this._fsBoundsDelta = null;
    this._prevContainerSize = null;
    this._lastOpenStartTime = 0;
    this._lastOpenEndTime = 0;
    this._animating = false;
    this._forceRedraw = false;
    this._mouseInside = false;
    this._xmlPath = null;

    //Public fields
    this.source = null;
    this.drawer = null;
    this.viewport = null;
    this.profiler = null;

};
Sys.Extended.UI.Seadragon.Viewer.prototype = {
    initialize: function() {
        Sys.Extended.UI.Seadragon.Viewer.callBaseMethod(this, 'initialize');

        this._container = Seadragon.Utils.makeNeutralElement("div");
        this._canvas = Seadragon.Utils.makeNeutralElement("div");

        this._controlsTL = Seadragon.Utils.makeNeutralElement("div");
        this._controlsTR = Seadragon.Utils.makeNeutralElement("div");
        this._controlsBR = Seadragon.Utils.makeNeutralElement("div");
        this._controlsBL = Seadragon.Utils.makeNeutralElement("div");

        var innerTracker = new Seadragon.MouseTracker(this._canvas, this.config.clickTimeThreshold, this.config.clickDistThreshold);
        var outerTracker = new Seadragon.MouseTracker(this._container, this.config.clickTimeThreshold, this.config.clickDistThreshold);

        this._bodyWidth = document.body.style.width;
        this._bodyHeight = document.body.style.height;
        this._bodyOverflow = document.body.style.overflow;
        this._docOverflow = document.documentElement.style.overflow;

        this._fsBoundsDelta = new Sys.Extended.UI.Seadragon.Point(1, 1);

        var canvasStyle = this._canvas.style;
        var containerStyle = this._container.style;
        var controlsTLStyle = this._controlsTL.style;
        var controlsTRStyle = this._controlsTR.style;
        var controlsBRStyle = this._controlsBR.style;
        var controlsBLStyle = this._controlsBL.style;

        containerStyle.width = "100%";
        containerStyle.height = "100%";
        containerStyle.position = "relative";
        containerStyle.left = "0px";
        containerStyle.top = "0px";
        containerStyle.textAlign = "left";  // needed to protect against
        // incorrect centering

        canvasStyle.width = "100%";
        canvasStyle.height = "100%";
        canvasStyle.overflow = "hidden";
        canvasStyle.position = "absolute";
        canvasStyle.top = "0px";
        canvasStyle.left = "0px";

        controlsTLStyle.position = controlsTRStyle.position =
                    controlsBRStyle.position = controlsBLStyle.position =
                    "absolute";

        controlsTLStyle.top = controlsTRStyle.top = "0px";
        controlsTLStyle.left = controlsBLStyle.left = "0px";
        controlsTRStyle.right = controlsBRStyle.right = "0px";
        controlsBLStyle.bottom = controlsBRStyle.bottom = "0px";

        // mouse tracker handler for canvas (pan and zoom)
        innerTracker.clickHandler = Function.createDelegate(this, this._onCanvasClick);
        innerTracker.dragHandler = Function.createDelegate(this, this._onCanvasDrag);
        innerTracker.releaseHandler = Function.createDelegate(this, this._onCanvasRelease);
        innerTracker.setTracking(true);     // default state

        // create default navigation control
        if (this.get_showNavigationControl()) {
            navControl = (new Sys.Extended.UI.Seadragon.NavControl(this)).elmt;
            navControl.style.marginRight = "4px";
            navControl.style.marginBottom = "4px";
            this.addControl(navControl, Sys.Extended.UI.Seadragon.ControlAnchor.BOTTOM_RIGHT);
        }
        for (var i = 0; i < this._customControls.length; i++) {
            this.addControl(this._customControls[i].id, this._customControls[i].anchor);
        }

        // mouse tracker handler for container (controls fading)
        outerTracker.enterHandler = Function.createDelegate(this, this._onContainerEnter);
        outerTracker.exitHandler = Function.createDelegate(this, this._onContainerExit);
        outerTracker.releaseHandler = Function.createDelegate(this, this._onContainerRelease);
        outerTracker.setTracking(true); // always tracking
        window.setTimeout(Function.createDelegate(this, this._beginControlsAutoHide), 1);    // initial fade out

        //append to DOM only at end
        this._container.appendChild(this._canvas);
        this._container.appendChild(this._controlsTL);
        this._container.appendChild(this._controlsTR);
        this._container.appendChild(this._controlsBR);
        this._container.appendChild(this._controlsBL);
        //this.get_element().innerHTML = "";          // clear any existing content...
        this.get_element().appendChild(this._container);

        if (this._xmlPath)
            this.openDzi(this._xmlPath);
    },
    _raiseEvent: function(eventName, eventArgs) {
        // Get handler for event.
        var handler = this.get_events().getHandler(eventName);

        if (handler) {
            if (!eventArgs) {
                eventArgs = Sys.EventArgs.Empty;
            }

            // Fire event.                          
            handler(this, eventArgs);
        }
    },
    _beginControlsAutoHide: function() {
        if (!this.config.autoHideControls) {
            return;
        }

        this._controlsShouldFade = true;
        this._controlsFadeBeginTime = new Date().getTime() + this._controlsFadeDelay;
        window.setTimeout(Function.createDelegate(this, this._scheduleControlsFade), this._controlsFadeDelay);
    },
    _scheduleControlsFade: function() {
        window.setTimeout(Function.createDelegate(this, this._updateControlsFade), 20);
    },
    _updateControlsFade: function() {
        if (this._controlsShouldFade) {
            var currentTime = new Date().getTime();
            var deltaTime = currentTime - this._controlsFadeBeginTime;
            var opacity = 1.0 - deltaTime / this._controlsFadeLength;

            opacity = Math.min(1.0, opacity);
            opacity = Math.max(0.0, opacity);

            for (var i = this._controls.length - 1; i >= 0; i--) {
                this._controls[i].setOpacity(opacity);
            }

            if (opacity > 0) {
                this._scheduleControlsFade();    // fade again
            }
        }
    },
    _onCanvasClick: function(tracker, position, quick, shift) {
        if (this.viewport && quick) {    // ignore clicks where mouse moved			
            var zoomPerClick = this.config.zoomPerClick;
            var factor = shift ? 1.0 / zoomPerClick : zoomPerClick;
            this.viewport.zoomBy(factor, this.viewport.pointFromPixel(position, true));
            this.viewport.applyConstraints();
        }
    },
    _onCanvasDrag: function(tracker, position, delta, shift) {
        if (this.viewport) {
            // negate since dragging is opposite of panning.
            // analogy: in adobe pdf, dragging vs using scrollbars.
            this.viewport.panBy(this.viewport.deltaPointsFromPixels(delta.negate()));
        }
    },
    _onCanvasRelease: function(tracker, position, insideElmtPress, insideElmtRelease) {
        if (insideElmtPress && this.viewport) {
            this.viewport.applyConstraints();
        }
    },
    _onContainerExit: function(tracker, position, buttonDownElmt, buttonDownAny) {
        // fade controls out over time, only if the mouse isn't down from
        // within the container (e.g. panning, or using a control)
        if (!buttonDownElmt) {
            this._mouseInside = false;
            if (!this._animating) {
                this._beginControlsAutoHide();
            }
        }
    },
    _onContainerRelease: function(tracker, position, insideElmtPress, insideElmtRelease) {
        // the mouse may have exited the container and we ignored it if the
        // mouse was down from within the container. now when the mouse is
        // released, we should fade the controls out now.
        if (!insideElmtRelease) {
            this._mouseInside = false;
            if (!this._animating) {
                this._beginControlsAutoHide();
            }
        }
    },
    _getControlIndex: function(elmt) {
        for (var i = this._controls.length - 1; i >= 0; i--) {
            if (this._controls[i].elmt == elmt) {
                return i;
            }
        }

        return -1;
    },
    _abortControlsAutoHide: function() {
        this._controlsShouldFade = false;
        for (var i = this._controls.length - 1; i >= 0; i--) {
            this._controls[i].setOpacity(1.0);
        }
    },
    _onContainerEnter: function(tracker, position, buttonDownElmt, buttonDownAny) {
        this._mouseInside = true;
        this._abortControlsAutoHide();
    },
    _updateOnce: function() {
        if (!this.source) {
            return;
        }

        this.profiler.beginUpdate();

        var containerSize = Seadragon.Utils.getElementSize(this._container);

        if (!containerSize.equals(this._prevContainerSize)) {
            this.viewport.resize(containerSize, true); // maintain image position
            this._prevContainerSize = containerSize;
            this._raiseEvent("resize", this);
        }

        var animated = this.viewport.update();

        if (!this._animating && animated) {
            // we weren't animating, and now we did ==> animation start
            this._raiseEvent("animationstart", self);
            this._abortControlsAutoHide();
        }

        if (animated) {
            // viewport moved
            this.drawer.update();
            this._raiseEvent("animation", self);
        } else if (this._forceRedraw || this.drawer.needsUpdate()) {
            // need to load or blend images, etc.
            this.drawer.update();
            this._forceRedraw = false;
        } else {
            // no changes, so preload images, etc.
            this.drawer.idle();
        }

        if (this._animating && !animated) {
            // we were animating, and now we're not anymore ==> animation finish
            this._raiseEvent("animationfinish", this);

            // if the mouse has left the container, begin fading controls
            if (!this._mouseInside) {
                this._beginControlsAutoHide();
            }
        }

        this._animating = animated;

        this.profiler.endUpdate();
    },
    _onClose: function() {
        // TODO need destroy() methods to prevent leaks? check for null if so.

        // nullify fields and properties
        this.source = null;
        this.viewport = null;
        this.drawer = null;
        this.profiler = null;

        // clear all tiles and any message
        this._canvas.innerHTML = "";
    },
    _beforeOpen: function() {
        if (this.source) {
            this._onClose();
        }

        this._lastOpenStartTime = new Date().getTime();   // to ignore earlier opens

        // show loading message after a delay if it still hasn't loaded
        window.setTimeout(Function.createDelegate(this, function() {
            if (this._lastOpenStartTime > this._lastOpenEndTime) {
                this._setMessage(Seadragon.Strings.getString("Messages.Loading"));
            }
        }), 2000);

        return this._lastOpenStartTime;
    },
    _setMessage: function(message) {
        var textNode = document.createTextNode(message);

        this._canvas.innerHTML = "";
        this._canvas.appendChild(Seadragon.Utils.makeCenteredNode(textNode));

        var textStyle = textNode.parentNode.style;

        // explicit styles for error message
        textStyle.color = "white";
        textStyle.fontFamily = "verdana";
        textStyle.fontSize = "13px";
        textStyle.fontSizeAdjust = "none";
        textStyle.fontStyle = "normal";
        textStyle.fontStretch = "normal";
        textStyle.fontVariant = "normal";
        textStyle.fontWeight = "normal";
        textStyle.lineHeight = "1em";
        textStyle.textAlign = "center";
        textStyle.textDecoration = "none";
    },
    _onOpen: function(time, _source, error) {
        this._lastOpenEndTime = new Date().getTime();

        if (time < this._lastOpenStartTime) {
            Seadragon.Debug.log("Ignoring out-of-date open.");
            this._raiseEvent("ignore");
            return;
        } else if (!_source) {
            this._setMessage(error);
            this._raiseEvent("error");
            return;
        }

        // clear any previous message
        this._canvas.innerHTML = "";
        this._prevContainerSize = Seadragon.Utils.getElementSize(this._container);

        // assign fields
        this.source = _source;
        this.viewport = new Sys.Extended.UI.Seadragon.Viewport(this._prevContainerSize, this.source.dimensions, this.config);
        this.drawer = new Sys.Extended.UI.Seadragon.Drawer(this.source, this.viewport, this._canvas);
        this.profiler = new Sys.Extended.UI.Seadragon.Profiler();

        // begin updating
        this._animating = false;
        this._forceRedraw = true;
        this._scheduleUpdate(this._updateMulti);

        for (var i = 0; i < this._overlayControls.length; i++) {
            var overlay = this._overlayControls[i];
            if (overlay.point != null) {
                this.drawer.addOverlay(overlay.id, new Sys.Extended.UI.Seadragon.Point(overlay.point.X, overlay.point.Y), Sys.Extended.UI.Seadragon.OverlayPlacement.TOP_LEFT);
            }
            else {
                this.drawer.addOverlay(overlay.id, new Sys.Extended.UI.Seadragon.Rect(overlay.rect.Point.X, overlay.rect.Point.Y, overlay.rect.Width, overlay.rect.Height), overlay.placement);
            }
        }
        this._raiseEvent("open");
    },
    _scheduleUpdate: function(updateFunc, prevUpdateTime) {
        // if we're animating, update as fast as possible to stay smooth
        if (this._animating) {
            return window.setTimeout(Function.createDelegate(this, updateFunc), 1);
        }

        // if no previous update, consider this an update
        var currentTime = new Date().getTime();
        var prevUpdateTime = prevUpdateTime ? prevUpdateTime : currentTime;
        var targetTime = prevUpdateTime + 1000 / 60;    // 60 fps ideal

        // calculate delta time to be a positive number
        var deltaTime = Math.max(1, targetTime - currentTime);
        return window.setTimeout(Function.createDelegate(this, updateFunc), deltaTime);
    },
    _updateMulti: function() {
        if (!this.source) {
            return;
        }

        var beginTime = new Date().getTime();

        this._updateOnce();
        this._scheduleUpdate(arguments.callee, beginTime);
    },
    _updateOnce: function() {
        if (!this.source) {
            return;
        }

        this.profiler.beginUpdate();

        var containerSize = Seadragon.Utils.getElementSize(this._container);

        if (!containerSize.equals(this._prevContainerSize)) {
            this.viewport.resize(containerSize, true); // maintain image position
            this._prevContainerSize = containerSize;
            this._raiseEvent("resize");
        }

        var animated = this.viewport.update();

        if (!this._animating && animated) {
            // we weren't animating, and now we did ==> animation start
            this._raiseEvent("animationstart");
            this._abortControlsAutoHide();
        }

        if (animated) {
            // viewport moved
            this.drawer.update();
            this._raiseEvent("animation");
        } else if (this._forceRedraw || this.drawer.needsUpdate()) {
            // need to load or blend images, etc.
            this.drawer.update();
            this._forceRedraw = false;
        } else {
            // no changes, so preload images, etc.
            this.drawer.idle();
        }

        if (this._animating && !animated) {
            // we were animating, and now we're not anymore ==> animation finish
            this._raiseEvent("animationfinish");

            // if the mouse has left the container, begin fading controls
            if (!this._mouseInside) {
                this._beginControlsAutoHide();
            }
        }

        this._animating = animated;

        this.profiler.endUpdate();
    },

    getNavControl: function() {
        return this._navControl;
    },
    get_xmlPath: function() {
        return this._xmlPath;
    },
    set_xmlPath: function(value) {
        this._xmlPath = value;
    },
    get_debugMode: function() {
        return this.config.debugMode;
    },
    set_debugMode: function(value) {
        this.config.debugMode = value;
    },
    get_animationTime: function() {
        return this.config.animationTime;
    },
    set_animationTime: function(value) {
        this.config.animationTime = value;
    },
    get_blendTime: function() {
        return this.config.blendTime;
    },
    set_blendTime: function(value) {
        this.config.blendTime = value;
    },
    get_alwaysBlend: function() {
        return this.config.alwaysBlend;
    },
    set_alwaysBlend: function(value) {
        this.config.alwaysBlend = value;
    },
    get_autoHideControls: function() {
        return this.config.autoHideControls;
    },
    set_autoHideControls: function(value) {
        this.config.autoHideControls = value;
    },
    get_immediateRender: function() {
        return this.config.immediateRender;
    },
    set_immediateRender: function(value) {
        this.config.immediateRender = value;
    },
    get_wrapHorizontal: function() {
        return this.config.wrapHorizontal;
    },
    set_wrapHorizontal: function(value) {
        this.config.wrapHorizontal = value;
    },
    get_wrapVertical: function() {
        return this.config.wrapVertical;
    },
    set_wrapVertical: function(value) {
        this.config.wrapVertical = value;
    },
    get_minZoomDimension: function() {
        return this.config.minZoomDimension;
    },
    set_minZoomDimension: function(value) {
        this.config.minZoomDimension = value;
    },
    get_maxZoomPixelRatio: function() {
        return this.config.maxZoomPixelRatio;
    },
    set_maxZoomPixelRatio: function(value) {
        this.config.maxZoomPixelRatio = value;
    },
    get_visibilityRatio: function() {
        return this.config.visibilityRatio;
    },
    set_visibilityRatio: function(value) {
        this.config.visibilityRatio = value;
    },
    get_springStiffness: function() {
        return this.config.springStiffness;
    },
    set_springStiffness: function(value) {
        this.config.springStiffness = value;
    },
    get_imageLoaderLimit: function() {
        return this.config.imageLoaderLimit;
    },
    set_imageLoaderLimit: function(value) {
        this.config.imageLoaderLimit = value;
    },
    get_clickTimeThreshold: function() {
        return this.config.clickTimeThreshold;
    },
    set_clickTimeThreshold: function(value) {
        this.config.clickTimeThreshold = value;
    },
    get_clickDistThreshold: function() {
        return this.config.clickDistThreshold;
    },
    set_clickDistThreshold: function(value) {
        this.config.clickDistThreshold = value;
    },
    get_zoomPerClick: function() {
        return this.config.zoomPerClick;
    },
    set_zoomPerClick: function(value) {
        this.config.zoomPerClick = value;
    },
    get_zoomPerSecond: function() {
        return this.config.zoomPerSecond;
    },
    set_zoomPerSecond: function(value) {
        this.config.zoomPerSecond = value;
    },
    get_maxImageCacheCount: function() {
        return this.config.maxImageCacheCount;
    },
    set_maxImageCacheCount: function(value) {
        this.config.maxImageCacheCount = value;
    },
    get_showNavigationControl: function() {
        return this.config.showNavigationControl;
    },
    set_showNavigationControl: function(value) {
        this.config.showNavigationControl = value;
    },
    get_minPixelRatio: function() {
        return this.config.minPixelRatio;
    },
    set_minPixelRatio: function(value) {
        this.config.minPixelRatio = value;
    },
    get_mouseNavEnabled: function() {
        return this.config.mouseNavEnabled;
    },
    set_mouseNavEnabled: function(value) {
        this.config.mouseNavEnabled = value;
    },
    get_controls: function() {
        return this._customControls;
    },
    set_controls: function(value) {
        this._customControls = value;
    },
    get_overlays: function() {
        return this._overlayControls;
    },
    set_overlays: function(value) {
        this._overlayControls = value;
    },
    get_prefixUrl: function() {
        return this._prefixUrl;
    },
    set_prefixUrl: function(value) {
        this._prefixUrl = value;
    },
    add_open: function(handler) {
        this.get_events().addHandler("open", handler);
    },
    remove_open: function(handler) {
        this.get_events().removeHandler("open", handler);
    },
    add_error: function(handler) {
        this.get_events().addHandler("error", handler);
    },
    remove_error: function(handler) {
        this.get_events().removeHandler("error", handler);
    },
    add_ignore: function(handler) {
        this.get_events().addHandler("ignore", handler);
    },
    remove_ignore: function(handler) {
        this.get_events().removeHandler("ignore", handler);
    },
    add_resize: function(handler) {
        this.get_events().addHandler("resize", handler);
    },
    remove_resize: function(handler) {
        this.get_events().removeHandler("resize", handler);
    },
    add_animationstart: function(handler) {
        this.get_events().addHandler("animationstart", handler);
    },
    remove_animationstart: function(handler) {
        this.get_events().removeHandler("animationstart", handler);
    },
    add_animationend: function(handler) {
        this.get_events().addHandler("animationend", handler);
    },
    remove_animationend: function(handler) {
        this.get_events().removeHandler("animationend", handler);
    },
    addControl: function(elmt, anchor) {
        var elmt = Seadragon.Utils.getElement(elmt);

        if (this._getControlIndex(elmt) >= 0) {
            return;     // they're trying to add a duplicate control
        }

        var div = null;

        switch (anchor) {
            case Sys.Extended.UI.Seadragon.ControlAnchor.TOP_RIGHT:
                div = this._controlsTR;
                elmt.style.position = "relative";
                break;
            case Sys.Extended.UI.Seadragon.ControlAnchor.BOTTOM_RIGHT:
                div = this._controlsBR;
                elmt.style.position = "relative";
                break;
            case Sys.Extended.UI.Seadragon.ControlAnchor.BOTTOM_LEFT:
                div = this._controlsBL;
                elmt.style.position = "relative";
                break;
            case Sys.Extended.UI.Seadragon.ControlAnchor.TOP_LEFT:
                div = this._controlsTL;
                elmt.style.position = "relative";
                break;
            case Sys.Extended.UI.Seadragon.ControlAnchor.NONE:
            default:
                div = this._container;
                elmt.style.position = "absolute";
                break;
        }

        this._controls.push(new Sys.Extended.UI.Seadragon.Control(elmt, anchor, div));
    },
    isOpen: function() {
        return !!this.source;
    },
    openDzi: function(xmlUrl, xmlString) {
        var currentTime = this._beforeOpen();
        Sys.Extended.UI.Seadragon.DziTileSourceHelper.createFromXml(xmlUrl, xmlString,
                    Seadragon.Utils.createCallback(null, Function.createDelegate(this, this._onOpen), currentTime));
    },
    openTileSource: function(tileSource) {
        var currentTime = this._beforeOpen();
        window.setTimeout(Function.createDelegate(this, function() {
            this._onOpen(currentTime, tileSource);
        }), 1);
    },
    close: function() {
        if (!this.source) {
            return;
        }

        this._onClose();
    },
    removeControl: function(elmt) {
        var elmt = Seadragon.Utils.getElement(elmt);
        var i = this._getControlIndex(elmt);

        if (i >= 0) {
            this._controls[i].destroy();
            this._controls.splice(i, 1);
        }
    },
    clearControls: function() {
        while (this._controls.length > 0) {
            this._controls.pop().destroy();
        }
    },
    isDashboardEnabled: function() {
        for (var i = this._controls.length - 1; i >= 0; i--) {
            if (this._controls[i].isVisible()) {
                return true;
            }
        }

        return false;
    },

    isFullPage: function() {
        return this._container.parentNode == document.body;
    },

    isMouseNavEnabled: function() {
        return this._innerTracker.isTracking();
    },

    isVisible: function() {
        return this._container.style.visibility != "hidden";
    },

    setDashboardEnabled: function(enabled) {
        for (var i = this._controls.length - 1; i >= 0; i--) {
            this._controls[i].setVisible(enabled);
        }
    },

    setFullPage: function(fullPage) {
        if (fullPage == this.isFullPage()) {
            return;
        }

        // copy locally to improve perf
        var body = document.body;
        var bodyStyle = body.style;
        var docStyle = document.documentElement.style;
        var containerStyle = this._container.style;
        var canvasStyle = this._canvas.style;

        if (fullPage) {
            // change overflow, but preserve what current values are
            bodyOverflow = bodyStyle.overflow;
            docOverflow = docStyle.overflow;
            bodyStyle.overflow = "hidden";
            docStyle.overflow = "hidden";

            // IE6 needs the body width/height to be 100% also
            bodyWidth = bodyStyle.width;
            bodyHeight = bodyStyle.height;
            bodyStyle.width = "100%";
            bodyStyle.height = "100%";

            // always show black background, etc., for fullpage
            canvasStyle.backgroundColor = "black";
            canvasStyle.color = "white";

            // make container attached to the window, immune to scrolling,
            // and above any other things with a z-index set.
            containerStyle.position = "fixed";
            containerStyle.zIndex = "99999999";

            body.appendChild(this._container);
            this._prevContainerSize = Seadragon.Utils.getWindowSize();

            this._onContainerEnter();     // mouse will be inside container now
        } else {
            // restore previous values for overflow
            bodyStyle.overflow = bodyOverflow;
            docStyle.overflow = docOverflow;

            // IE6 needed to overwrite the body width/height also
            bodyStyle.width = bodyWidth;
            bodyStyle.height = bodyHeight;

            // return to inheriting style
            canvasStyle.backgroundColor = "";
            canvasStyle.color = "";

            // make container be inline on page again, and auto z-index
            containerStyle.position = "relative";
            containerStyle.zIndex = "";

            this.get_element().appendChild(this._container);
            this._prevContainerSize = Seadragon.Utils.getElementSize(this.get_element());

            this._onContainerExit();      // mouse will likely be outside now
        }
        if (this.viewport) {
            var oldBounds = this.viewport.getBounds();
            this.viewport.resize(this._prevContainerSize);
            var newBounds = this.viewport.getBounds();

            if (fullPage) {
                // going to fullpage, remember how much bounds changed by.
                this._fsBoundsDelta = new Sys.Extended.UI.Seadragon.Point(newBounds.width / oldBounds.width,
                        newBounds.height / oldBounds.height);
            } else {
                // leaving fullpage, negate how much the fullpage zoomed by.
                // note that we have to negate the bigger of the two changes.
                // we have to zoom about the center of the new bounds, but
                // that's NOT the zoom point. so we have to manually update
                // first so that that center becomes the viewport center.
                this.viewport.update();
                this.viewport.zoomBy(Math.max(this._fsBoundsDelta.x, this._fsBoundsDelta.y),
                            null, true);
            }

            this._forceRedraw = true;
            this._raiseEvent("resize", this);
            this._updateOnce();
        }
    },

    setMouseNavEnabled: function(enabled) {
        this._innerTracker.setTracking(enabled);
    },

    setVisible: function(visible) {
        // important: don't explicitly say "visibility: visible", because
        // the W3C spec actually says children of hidden elements that have
        // "visibility: visible" should still be rendered. that's usually
        // not what we (or developers) want. browsers are inconsistent in
        // this regard, but IE seems to follow this spec.
        this._container.style.visibility = visible ? "" : "hidden";
    }

};
Sys.Extended.UI.Seadragon.Viewer.registerClass('Sys.Extended.UI.Seadragon.Viewer', Sys.UI.Control);
