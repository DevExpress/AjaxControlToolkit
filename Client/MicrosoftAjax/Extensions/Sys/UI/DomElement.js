$type = Sys.UI.DomElement = function DomElement() {
    /// <summary locid="M:J#Sys.UI.DomElement.#ctor">This static class provides helpers to work with DOM elements.</summary>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
    //#if DEBUG
    throw Error.notImplemented();
    //#endif
}
$type.registerClass('Sys.UI.DomElement');

$type.addCssClass = function DomElement$addCssClass(element, className) {
    /// <summary locid="M:J#Sys.UI.DomElement.addCssClass">Adds a CSS class to an element if it doesn't already have it.</summary>
    /// <param name="element" domElement="true"></param>
    /// <param name="className" type="String">The name of the CSS class to add.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "className", type: String}
    ]);
    if (e) throw e;
    //#endif
    if (!Sys.UI.DomElement.containsCssClass(element, className)) {
        if (element.className === '') {
            element.className = className;
        }
        else {
            element.className += ' ' + className;
        }
    }
}

$type.containsCssClass = function DomElement$containsCssClass(element, className) {
    /// <summary locid="M:J#Sys.UI.DomElement.containsCssClass">Determines if an element has the specified CSS class.</summary>
    /// <param name="element" domElement="true"></param>
    /// <param name="className" type="String">The name of the CSS class to test.</param>
    /// <returns type="Boolean">True if the CSS class was found on the element.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "className", type: String}
    ]);
    if (e) throw e;
    //#endif
    return Array.contains(element.className.split(' '), className);
}

$type.getBounds = function DomElement$getBounds(element) {
    /// <summary locid="M:J#Sys.UI.DomElement.getBounds">Gets the coordinates, width and height of an element.</summary>
    /// <param name="element" domElement="true"></param>
    /// <returns type="Sys.UI.Bounds">A Bounds object with four fields, x, y, width and height, which contain the pixel coordinates,  width and height of the element.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true}
    ]);
    if (e) throw e;
    //#endif
    var offset = Sys.UI.DomElement.getLocation(element);

    return new Sys.UI.Bounds(offset.x, offset.y, element.offsetWidth || 0, element.offsetHeight || 0);
}

$get = $type.getElementById = function DomElement$getElementById(id, element) {
    /// <summary locid="M:J#Sys.UI.DomElement.getElementById">Finds an element by id.</summary>
    /// <param name="id" type="String">The id of the element to find.</param>
    /// <param name="element" domElement="true" optional="true" mayBeNull="true"></param>
    /// <returns domElement="true" mayBeNull="true">The element, or null if it was not found.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "id", type: String},
        {name: "element", mayBeNull: true, domElement: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    return Sys.get("#" + id, element || null);
}

if (document.documentElement.getBoundingClientRect) {
    $type.getLocation = function DomElement$getLocation(element) {
        /// <summary locid="M:J#Sys.UI.DomElement.getLocation">Gets the coordinates of a DOM element.</summary>
        /// <param name="element" domElement="true"></param>
        /// <returns type="Sys.UI.Point">A Point object with two fields, x and y, which contain the pixel coordinates of the element.</returns>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "element", domElement: true}
        ]);
        if (e) throw e;
        //#endif
        // For a document element, body, or window, return zero.
        // In IE8, the boundingClientRect for body is influenced by the bounding rect of its content, and so may not be 0,0.
        // But for positioning purposes, elements positioned at 0,0 will be at the top even if the content has margins, etc, so
        // getlocation should return 0,0 for body.
        // In all browsers, detecting the body works by seeing if the element's parent ndoe is the element's own document's documentElement node.
        
        // window?        
        if (element.self || element.nodeType === 9 ||
            // documentElement?
            (element === document.documentElement) ||
            // body?
            (element.parentNode === element.ownerDocument.documentElement)) {
            return new Sys.UI.Point(0, 0);
        }        
        
        // Here there is a small inconsistency with what other browsers would give for wrapping elements:
        // the bounding rect can be different from the first rectangle. getBoundingRect is used here
        // because it's more consistent and because clientRects need to be offset by the coordinates
        // of the frame in the parent window, which is not always accessible to script (if it's in a different
        // domain in particular).
        var clientRect = element.getBoundingClientRect();
        if (!clientRect) {
            return new Sys.UI.Point(0,0);
        }
        // Firefox 3 can return decimals here, so round them.
        // This appears to be consistent with how the display engine actually places the element when there is a decimal.
        var ex, ownerDoc = element.ownerDocument, documentElement = ownerDoc.documentElement,
            offsetX = Math.round(clientRect.left) + (documentElement.scrollLeft || (ownerDoc.body ? ownerDoc.body.scrollLeft : 0)),
            offsetY = Math.round(clientRect.top) + (documentElement.scrollTop || (ownerDoc.body ? ownerDoc.body.scrollTop : 0));
        if (isBrowser("InternetExplorer")) {
            // When the window is an iframe, the frameborder needs to be added. This is only available from
            // script when the parent window is in the same domain as the frame, hence the try/catch.
            try {
                var f = element.ownerDocument.parentWindow.frameElement || null;
                if (f) {
                    f = f.frameBorder;
                    // frameBorder has a default of "1" so undefined must map to 0, and "0" and "no" to 2.
                    var offset = (f === "0" || f === "no") ? 2 : 0;
                    offsetX += offset;
                    offsetY += offset;
                }
            }
            catch(ex) {
            }
            if (Sys.Browser.version === 7 && !document.documentMode) {
                // IE7 reapplies the page zoom level when using the returned coordinates.
                // therefore we must divide by the zoom level to compensate. This is not perfect, but close.
                // NOTE: IE8 with document.documentMode === 7 does NOT emulate IE7 behavior, by design.
                // Also, this zoom detection does not work perfectly in IE8 compat mode, where we would want
                // it to be 100% always, so it is necessary that we ensure this only happens in ACTUAL IE7.
                // IE6 does not support zoom.
                var body = document.body,
                    rect = body.getBoundingClientRect(),
                    zoom = (rect.right-rect.left) / body.clientWidth;
                // zoom is not completely accurate, so snap to the previous 5% by multiplying by 100, rounding,
                // then subtracting zoom % 5, then dividing by 100 to get back to a multiplier.
                // It's not likely someone is zooming at 154%, for example, so that probably means it is actually 150%, whereas
                // 156% probably means 155% (the estimate tends to over-estimate).
                zoom = Math.round(zoom * 100);
                zoom = (zoom - zoom % 5) / 100;
                if (!isNaN(zoom) && (zoom !== 1)) {
                    offsetX = Math.round(offsetX / zoom);
                    offsetY = Math.round(offsetY / zoom);
                }
            }        
            if ((document.documentMode || 0) < 8) {
                offsetX -= documentElement.clientLeft;
                offsetY -= documentElement.clientTop;
            }
        }
        return new Sys.UI.Point(offsetX, offsetY);
    }
}
else if (isBrowser("Safari")) {
    $type.getLocation = function DomElement$getLocation_Safari(element) {
        /// <summary locid="M:J#Sys.UI.DomElement.getLocation">Gets the coordinates of a DOM element.</summary>
        /// <param name="element" domElement="true"></param>
        /// <returns type="Sys.UI.Point">A Point object with two fields, x and y, which contain the pixel coordinates of the element.</returns>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "element", domElement: true}
        ]);
        if (e) throw e;
        //#endif
        // For a document element, return zero.
        if ((element.window && (element.window === element)) || element.nodeType === 9) return new Sys.UI.Point(0,0);

        var offsetX = 0, offsetY = 0,
            parent,
            previous = null,
            previousStyle = null,
            currentStyle;
        for (parent = element; parent; previous = parent, previousStyle = currentStyle, parent = parent.offsetParent) {
            currentStyle = Sys.UI.DomElement._getCurrentStyle(parent);
            var tagName = parent.tagName ? parent.tagName.toUpperCase() : null;

            if ((parent.offsetLeft || parent.offsetTop) &&
                ((tagName !== "BODY") || (!previousStyle || previousStyle.position !== "absolute"))) {
                offsetX += parent.offsetLeft;
                offsetY += parent.offsetTop;
            }

            if (previous && Sys.Browser.version >= 3) {
                offsetX += parseInt(currentStyle.borderLeftWidth);
                offsetY += parseInt(currentStyle.borderTopWidth);
            }
        }

        currentStyle = Sys.UI.DomElement._getCurrentStyle(element);
        var elementPosition = currentStyle ? currentStyle.position : null;
        // If an element is absolutely positioned, its parent's scroll should not be subtracted
        if (elementPosition !== "absolute") {
            for (parent = element.parentNode; parent; parent = parent.parentNode) {
                tagName = parent.tagName ? parent.tagName.toUpperCase() : null;

                if ((tagName !== "BODY") && (tagName !== "HTML") && (parent.scrollLeft || parent.scrollTop)) {
                    offsetX -= (parent.scrollLeft || 0);
                    offsetY -= (parent.scrollTop || 0);
                }
                currentStyle = Sys.UI.DomElement._getCurrentStyle(parent);
                var parentPosition = currentStyle ? currentStyle.position : null;

                if (parentPosition && (parentPosition === "absolute")) break;
            }
        }
        return new Sys.UI.Point(offsetX, offsetY);
    }
}
else {
    $type.getLocation = function DomElement$getLocation_Generic(element) {
        /// <summary locid="M:J#Sys.UI.DomElement.getLocation">Gets the coordinates of a DOM element.</summary>
        /// <param name="element" domElement="true"></param>
        /// <returns type="Sys.UI.Point">A Point object with two fields, x and y, which contain the pixel coordinates of the element.</returns>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "element", domElement: true}
        ]);
        if (e) throw e;
        //#endif
        // For a document element, return zero.
        if ((element.window && (element.window === element)) || element.nodeType === 9) return new Sys.UI.Point(0,0);

        var offsetX = 0, offsetY = 0,
            parent,
            previous = null,
            previousStyle = null,
            currentStyle = null;
        for (parent = element; parent; previous = parent, previousStyle = currentStyle, parent = parent.offsetParent) {
            var tagName = parent.tagName ? parent.tagName.toUpperCase() : null;
            currentStyle = Sys.UI.DomElement._getCurrentStyle(parent);

            if ((parent.offsetLeft || parent.offsetTop) &&
                !((tagName === "BODY") &&
                (!previousStyle || previousStyle.position !== "absolute"))) {

                offsetX += parent.offsetLeft;
                offsetY += parent.offsetTop;
            }

            if (previous !== null && currentStyle) {
                if ((tagName !== "TABLE") && (tagName !== "TD") && (tagName !== "HTML")) {
                    offsetX += parseInt(currentStyle.borderLeftWidth) || 0;
                    offsetY += parseInt(currentStyle.borderTopWidth) || 0;
                }
                if (tagName === "TABLE" &&
                    (currentStyle.position === "relative" || currentStyle.position === "absolute")) {
                    offsetX += parseInt(currentStyle.marginLeft) || 0;
                    offsetY += parseInt(currentStyle.marginTop) || 0;
                }
            }
        }

        currentStyle = Sys.UI.DomElement._getCurrentStyle(element);
        var elementPosition = currentStyle ? currentStyle.position : null;
        // If an element is absolutely positioned, its parent's scroll should not be subtracted, except on Opera.
        if (elementPosition !== "absolute") {
            for (parent = element.parentNode; parent; parent = parent.parentNode) {
                tagName = parent.tagName ? parent.tagName.toUpperCase() : null;

                if ((tagName !== "BODY") && (tagName !== "HTML") && (parent.scrollLeft || parent.scrollTop)) {

                    offsetX -= (parent.scrollLeft || 0);
                    offsetY -= (parent.scrollTop || 0);

                    currentStyle = Sys.UI.DomElement._getCurrentStyle(parent);
                    if (currentStyle) {
                        offsetX += parseInt(currentStyle.borderLeftWidth) || 0;
                        offsetY += parseInt(currentStyle.borderTopWidth) || 0;
                    }
                }
            }
        }
        return new Sys.UI.Point(offsetX, offsetY);
    }
}

$type.isDomElement = function DomElement$isDomElement(obj) {
    /// <summary locid="M:J#Sys.UI.DomElement.isDomElement">Determines if the given argument is a DOM element.</summary>
    /// <param name="obj"></param>
    /// <returns type="Boolean">True if the object is a DOM element, otherwise false.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "obj"}
    ]);
    if (e) throw e;
    //#endif
    return Sys._isDomElement(obj);
}

$type.removeCssClass = function DomElement$removeCssClass(element, className) {
    /// <summary locid="M:J#Sys.UI.DomElement.removeCssClass">Removes a CSS class from an element.</summary>
    /// <param name="element" domElement="true"></param>
    /// <param name="className" type="String">The name of the CSS class to remove.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "className", type: String}
    ]);
    if (e) throw e;
    //#endif
    var currentClassName = ' ' + element.className + ' ';
    var index = currentClassName.indexOf(' ' + className + ' ');
    if (index >= 0) {
        element.className = (currentClassName.substr(0, index) + ' ' +
            currentClassName.substring(index + className.length + 1, currentClassName.length)).trim();
    }
}

$type.resolveElement = function DomElement$resolveElement(elementOrElementId, containerElement) {
    /// <summary locid="M:J#Sys.UI.DomElement.resolveElement">Returns the element with the specified Id in the specified container, or the element if it is already an element.</summary>
    /// <param name="elementOrElementId" mayBeNull="true"></param>
    /// <param name="containerElement" domElement="true" optional="true" mayBeNull="true"></param>
    /// <returns domElement="true"></returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "elementOrElementId", mayBeNull: true},
        {name: "containerElement", mayBeNull: true, domElement: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    var el = elementOrElementId;
    if (!el) return null;
    if (typeof(el) === "string") {
        el = Sys.get("#" + el, containerElement);
        //#if DEBUG
        if (!el) {
            throw Error.argument("elementOrElementId", String.format(Sys.Res.elementNotFound, elementOrElementId));
        }
        //#endif
    }
    //#if DEBUG
    else if(!Sys.UI.DomElement.isDomElement(el)) {
        throw Error.argument("elementOrElementId", Sys.Res.expectedElementOrId);
    }
    //#endif
    return el;
}

$type.raiseBubbleEvent = function DomElement$raiseBubbleEvent(source, args) {
    /// <summary locid="M:J#Sys.UI.DomElement.raiseBubbleEvent">Raises a bubble event.</summary>
    /// <param name="source" domElement="true">The DOM element that triggers the event.</param>
    /// <param name="args" type="Sys.EventArgs">The event arguments.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "source", domElement: true},
        {name: "args", type: Sys.EventArgs}
    ]);
    if (e) throw e;
    //#endif
    var target = source;
    while (target) {
        var control = target.control;
        if (control && control.onBubbleEvent && control.raiseBubbleEvent) {
            if (!control.onBubbleEvent(source, args)) {
                control._raiseBubbleEvent(source, args);
            }
            return;
        }
        target = target.parentNode;
    }
}

$type._ensureGet = function DomElement$_ensureGet(selector, context, arg) {
    var ret = Sys.get(selector, context);
    //#if DEBUG
    if (!ret && typeof(selector) === "string") {
        throw Error.invalidOperation(String.format(Sys.Res.selectorNotFound, selector));
    }
    else if (ret && !this.isDomElement(ret)) {
        throw Error.invalidOperation(String.format(Sys.Res.expectedDomElementOrSelector, arg));
    }
    //#endif
    return ret;
}

$type.setLocation = function DomElement$setLocation(element, x, y) {
    /// <summary locid="M:J#Sys.UI.DomElement.setLocation">Sets the position of an element.</summary>
    /// <param name="element" domElement="true"></param>
    /// <param name="x" type="Number" integer="true"></param>
    /// <param name="y" type="Number" integer="true"></param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "x", type: Number, integer: true},
        {name: "y", type: Number, integer: true}
    ]);
    if (e) throw e;
    //#endif
    var style = element.style;
    style.position = 'absolute';
    style.left = x + "px";
    style.top = y + "px";
}

$type.toggleCssClass = function DomElement$toggleCssClass(element, className) {
    /// <summary locid="M:J#Sys.UI.DomElement.toggleCssClass">Toggles a CSS class on and off o an element.</summary>
    /// <param name="element" domElement="true"></param>
    /// <param name="className" type="String">The name of the CSS class to toggle.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "className", type: String}
    ]);
    if (e) throw e;
    //#endif
    if (Sys.UI.DomElement.containsCssClass(element, className)) {
        Sys.UI.DomElement.removeCssClass(element, className);
    }
    else {
        Sys.UI.DomElement.addCssClass(element, className);
    }
}

$type.getVisibilityMode = function DomElement$getVisibilityMode(element) {
    /// <summary locid="M:J#Sys.UI.DomElement.getVisibilityMode"></summary>
    /// <param name="element" domElement="true"></param>
    /// <returns type="Sys.UI.VisibilityMode"></returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true}
    ]);
    if (e) throw e;
    //#endif
    return (element._visibilityMode === Sys.UI.VisibilityMode.hide) ?
        Sys.UI.VisibilityMode.hide :
        Sys.UI.VisibilityMode.collapse;
}
$type.setVisibilityMode = function DomElement$setVisibilityMode(element, value) {
    /// <summary locid="M:J#Sys.UI.DomElement.setVisibilityMode"></summary>
    /// <param name="element" domElement="true"></param>
    /// <param name="value" type="Sys.UI.VisibilityMode"></param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "value", type: Sys.UI.VisibilityMode}
    ]);
    if (e) throw e;
    //#endif
    Sys.UI.DomElement._ensureOldDisplayMode(element);
    if (element._visibilityMode !== value) {
        element._visibilityMode = value;
        if (Sys.UI.DomElement.getVisible(element) === false) {
            element.style.display = (value === Sys.UI.VisibilityMode.hide) ? element._oldDisplayMode : 'none';
        }
    }
}

$type.getVisible = function DomElement$getVisible(element) {
    /// <summary locid="M:J#Sys.UI.DomElement.getVisible"></summary>
    /// <param name="element" domElement="true"></param>
    /// <returns type="Boolean"></returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true}
    ]);
    if (e) throw e;
    //#endif
    var style = element.currentStyle || Sys.UI.DomElement._getCurrentStyle(element);
    return style ? (style.visibility !== 'hidden') && (style.display !== 'none') : true;
}
$type.setVisible = function DomElement$setVisible(element, value) {
    /// <summary locid="M:J#Sys.UI.DomElement.setVisible"></summary>
    /// <param name="element" domElement="true"></param>
    /// <param name="value" type="Boolean"></param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "element", domElement: true},
        {name: "value", type: Boolean}
    ]);
    if (e) throw e;
    //#endif
    if (value !== Sys.UI.DomElement.getVisible(element)) {
        Sys.UI.DomElement._ensureOldDisplayMode(element);
        var style = element.style;
        style.visibility = value ? 'visible' : 'hidden';
        style.display = (value || (element._visibilityMode === Sys.UI.VisibilityMode.hide)) ? element._oldDisplayMode : 'none';
    }
}

$type.setCommand = function DomElement$setCommand(commandSource, commandName, commandArgument, commandTarget) {
    /// <summary locid="M:J#Sys.UI.DomElement.setCommand">Causes a DOM element to raise a bubble event when clicked.</summary>
    /// <param name="commandSource">The DOM element, array of DOM elements, or DOM element selectors that causes the event when clicked.</param>
    /// <param name="commandName" type="String" mayBeNull="true">The name of the command to raise.</param>
    /// <param name="commandArgument" mayBeNull="true" optional="true">Optional command argument.</param>
    /// <param name="commandTarget" optional="true" mayBeNull="true">DOM element from which the command should start bubbling up.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "commandSource"},
        {name: "commandName", type: String, mayBeNull: true},
        {name: "commandArgument", mayBeNull: true, optional: true},
        {name: "commandTarget", mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    Sys.UI.DomEvent.addHandler(commandSource, 'click', function(ev) {
        // this == dom element
        var source = commandTarget || this;
        Sys.UI.DomElement.raiseBubbleEvent(source, new Sys.CommandEventArgs(commandName, commandArgument, this, ev)); 
    }, true /*autoRemove*/);
}

Sys.registerPlugin({
    name: "setCommand",
    dom: true,
    //#if DEBUG
    returnType: "Sys.ElementSet",
    description: "Causes a DOM element to raise a bubble event when clicked.",
    parameters: [
        {name: "commandName", type:"String", description: "The name of the command to raise."},
        {name: "commandArgument", description: "Optional command argument."},
        {name: "commandTarget", description: "DOM element from which the command should start bubbling up."}
    ],
    //#endif
    plugin: function(commandName, commandArgument, commandTarget) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "commandName", type: String, mayBeNull: true},
            {name: "commandArgument", mayBeNull: true, optional: true},
            {name: "commandTarget", mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        //#endif
        return this.addHandler('click', function(ev) {
            // this == dom element
            var source = commandTarget || this;
            Sys.UI.DomElement.raiseBubbleEvent(source, new Sys.CommandEventArgs(commandName, commandArgument, this, ev)); 
        }, true /*autoRemove*/);
    }
});

$type._ensureOldDisplayMode = function DomElement$_ensureOldDisplayMode(element) {
    if (!element._oldDisplayMode) {
        var style = element.currentStyle || this._getCurrentStyle(element);
        element._oldDisplayMode = style ? style.display : null;
        if (!element._oldDisplayMode || element._oldDisplayMode === 'none') {
            // Default is different depending on the tag name (omitting deprecated and non-standard tags)
            var tagName = element.tagName,
                mode = 'inline';
            if (/^(DIV|P|ADDRESS|BLOCKQUOTE|BODY|COL|COLGROUP|DD|DL|DT|FIELDSET|FORM|H1|H2|H3|H4|H5|H6|HR|IFRAME|LEGEND|OL|PRE|TABLE|TD|TH|TR|UL)$/i.test(tagName)) {
                mode = 'block';
            }
            else if (tagName.toUpperCase() === "LI") {
                mode = 'list-item';
            }
            element._oldDisplayMode = mode;
        }
    }
}

$type._getWindow = function DomElement$_getWindow(element) {
    var doc = element.ownerDocument || element.document || element;
    return doc.defaultView || doc.parentWindow;
}

$type._getCurrentStyle = function DomElement$_getCurrentStyle(element) {
    if (element.nodeType === 3) return null;
    var w = this._getWindow(element);
    if (element.documentElement) element = element.documentElement;
    var computedStyle = (w && (element !== w) && w.getComputedStyle) ?
        w.getComputedStyle(element, null) :
        element.currentStyle || element.style;
    return computedStyle;
}

$type._onDispose = function DomElement$_onDispose(element, fn) {
    var queue, d = element.dispose;
    if (d !== Sys.UI.DomElement._dispose) {
        element.dispose = Sys.UI.DomElement._dispose;
        element.__msajaxdispose = queue = [];
        if (typeof(d) === "function") {
            queue.push(d);
        }
    }
    else {
        queue = element.__msajaxdispose;
    }
    queue.push(fn);
}

$type._dispose = function DomElement$_dispose() {
    var queue = this.__msajaxdispose;
    if (queue) {
        for (var i = 0, l = queue.length; i < l; i++) {
            queue[i].apply(this);
        }
    }
    // Also dispose all the control that are attached to this element.
    if (this.control && typeof(this.control.dispose) === "function") {
        this.control.dispose();
    }
    this.__msajaxdispose = null;
    this.dispose = null;
}
