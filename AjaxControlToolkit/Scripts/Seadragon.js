Type.registerNamespace('Sys.Extended.UI.Seadragon');
Type.registerNamespace('Seadragon');

Seadragon.Utils = function() {

    // Enumerations
    var Browser = {
        UNKNOWN: 0,
        IE: 1,
        FIREFOX: 2,
        SAFARI: 3,
        CHROME: 4,
        OPERA: 5
    };

    Seadragon.Browser = Browser;

    // Fields
    var self = this;

    var arrActiveX = ["Msxml2.XMLHTTP", "Msxml3.XMLHTTP", "Microsoft.XMLHTTP"];
    var fileFormats = {
        "bmp": false,
        "jpeg": true,
        "jpg": true,
        "png": true,
        "tif": false,
        "wdp": false
    };

    var browser = Browser.UNKNOWN;
    var browserVersion = 0;
    var badAlphaBrowser = false; // updated in constructor

    var urlParams = {};

    // Constructor
    (function() {

        // Browser detect
        var app = navigator.appName;
        var ver = navigator.appVersion;
        var ua = navigator.userAgent;

        if(app == "Microsoft Internet Explorer" &&
                !!window.attachEvent && !!window.ActiveXObject) {

            var ieOffset = ua.indexOf("MSIE");
            browser = Browser.IE;
            browserVersion = parseFloat(
                    ua.substring(ieOffset + 5, ua.indexOf(";", ieOffset)));
        } else if(app == "Netscape" && !!window.addEventListener) {

            var ffOffset = ua.indexOf("Firefox");
            var saOffset = ua.indexOf("Safari");
            var chOffset = ua.indexOf("Chrome");

            if(ffOffset >= 0) {
                browser = Browser.FIREFOX;
                browserVersion = parseFloat(ua.substring(ffOffset + 8));
            } else if(saOffset >= 0) {
                var slash = ua.substring(0, saOffset).lastIndexOf("/");
                browser = (chOffset >= 0) ? Browser.CHROME : Browser.SAFARI;
                browserVersion = parseFloat(ua.substring(slash + 1, saOffset));
            }
        } else if(app == "Opera" && !!window.opera && !!window.attachEvent) {
            browser = Browser.OPERA;
            browserVersion = parseFloat(ver);
        }

        // Url parameters
        var query = window.location.search.substring(1); // ignore '?'
        var parts = query.split('&');

        for(var i = 0; i < parts.length; i++) {
            var part = parts[i];
            var sep = part.indexOf('=');

            if(sep > 0)
                urlParams[part.substring(0, sep)] = decodeURIComponent(part.substring(sep + 1));
        }

        // Browser behaviors

        // update: chrome 2 no longer has this problem!
        badAlphaBrowser = (browser == Browser.IE || (browser == Browser.CHROME && browserVersion < 2));
    })();

    // Helpers

    function getOffsetParent(elmt, isFixed) {
        // IE and Opera "fixed" position elements don't have offset parents.
        // regardless, if it's fixed, its offset parent is the body.
        if(isFixed && elmt != document.body)
            return document.body;
        else
            return elmt.offsetParent;
    }

    // Methods

    this.getBrowser = function() {
        return browser;
    };

    this.getBrowserVersion = function() {
        return browserVersion;
    };

    this.getElement = function(elmt) {
        if(typeof (elmt) == "string")
            elmt = document.getElementById(elmt);

        return elmt;
    };

    this.getElementPosition = function(elmt) {
        var elmt = self.getElement(elmt);
        var result = new Seadragon.Point();

        // technique from:
        // http://www.quirksmode.org/js/findpos.html
        // with special check for "fixed" elements.

        var isFixed = self.getElementStyle(elmt).position == "fixed";
        var offsetParent = getOffsetParent(elmt, isFixed);

        while(offsetParent) {
            result.x += elmt.offsetLeft;
            result.y += elmt.offsetTop;

            if(isFixed)
                result = result.plus(self.getPageScroll());

            elmt = offsetParent;
            isFixed = self.getElementStyle(elmt).position == "fixed";
            offsetParent = getOffsetParent(elmt, isFixed);
        }

        return result;
    };

    this.getElementSize = function(elmt) {
        var elmt = self.getElement(elmt);
        return new Seadragon.Point(elmt.clientWidth, elmt.clientHeight);
    };

    this.getElementStyle = function(elmt) {
        var elmt = self.getElement(elmt);

        if(elmt.currentStyle)
            return elmt.currentStyle;
        else if(window.getComputedStyle)
            return window.getComputedStyle(elmt, "");
        else
            Seadragon.Debug.fail("Unknown element style, no known technique.");
    };

    this.getEvent = function(event) {
        return event ? event : window.event;
    };

    this.getMousePosition = function(event) {
        var event = self.getEvent(event);
        var result = new Seadragon.Point();

        // technique from:
        // http://www.quirksmode.org/js/events_properties.html

        if(typeof (event.pageX) == "number") {
            result.x = event.pageX;
            result.y = event.pageY;
        } else if(typeof (event.clientX) == "number") {
            result.x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            result.y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        } else {
            Seadragon.Debug.fail("Unknown event mouse position, no known technique.");
        }

        return result;
    };

    this.getPageScroll = function() {
        var result = new Seadragon.Point();
        var docElmt = document.documentElement || {};
        var body = document.body || {};

        // technique from:
        // http://www.howtocreate.co.uk/tutorials/javascript/browserwindow

        if(typeof (window.pageXOffset) == "number") {
            // most browsers
            result.x = window.pageXOffset;
            result.y = window.pageYOffset;
        } else if(body.scrollLeft || body.scrollTop) {
            // W3C spec, IE6+ in quirks mode
            result.x = body.scrollLeft;
            result.y = body.scrollTop;
        } else if(docElmt.scrollLeft || docElmt.scrollTop) {
            // IE6+ in standards mode
            result.x = docElmt.scrollLeft;
            result.y = docElmt.scrollTop;
        }

        // note: we specifically aren't testing for typeof here, because IE sets
        // the appropriate variables undefined instead of 0 under certain
        // conditions. this means we also shouldn't fail if none of the three
        // cases are hit; we'll just assume the page scroll is 0.

        return result;
    };

    this.getWindowSize = function() {
        var result = new Seadragon.Point();
        var docElmt = document.documentElement || {};
        var body = document.body || {};

        // technique from:
        // http://www.howtocreate.co.uk/tutorials/javascript/browserwindow

        // important: i originally cleaned up the second and third IE checks to
        // check if the typeof was number. but this fails for quirks mode,
        // because docElmt.clientWidth is indeed a number, but it's incorrectly
        // zero. so no longer checking typeof is number for those cases.

        if(typeof (window.innerWidth) == 'number') {
            // non-IE browsers
            result.x = window.innerWidth;
            result.y = window.innerHeight;
        } else if(docElmt.clientWidth || docElmt.clientHeight) {
            // IE6+ in standards mode
            result.x = docElmt.clientWidth;
            result.y = docElmt.clientHeight;
        } else if(body.clientWidth || body.clientHeight) {
            // IE6+ in quirks mode
            result.x = body.clientWidth;
            result.y = body.clientHeight;
        } else {
            Seadragon.Debug.fail("Unknown window size, no known technique.");
        }

        return result;
    };

    this.imageFormatSupported = function(ext) {
        var ext = ext ? ext : "";
        return !!fileFormats[ext.toLowerCase()];
    };

    this.makeCenteredNode = function(elmt) {
        var elmt = Seadragon.Utils.getElement(elmt);
        var div = self.makeNeutralElement("div");
        var html = [];

        // technique for vertically centering (in IE!!!) from:
        // http://www.jakpsatweb.cz/css/css-vertical-center-solution.html
        // with explicit neutralizing of styles added by me.
        html.push('<div style="display:table; height:100%; width:100%;');
        html.push('border:none; margin:0px; padding:0px;'); // neutralizing
        html.push('#position:relative; overflow:hidden; text-align:left;">');
        // the text-align:left guards against incorrect centering in IE
        html.push('<div style="#position:absolute; #top:50%; width:100%; ');
        html.push('border:none; margin:0px; padding:0px;'); // neutralizing
        html.push('display:table-cell; vertical-align:middle;">');
        html.push('<div style="#position:relative; #top:-50%; width:100%; ');
        html.push('border:none; margin:0px; padding:0px;'); // neutralizing
        html.push('text-align:center;"></div></div></div>');

        div.innerHTML = html.join('');
        div = div.firstChild;

        // now add the element as a child to the inner-most div
        var innerDiv = div;
        var innerDivs = div.getElementsByTagName("div");
        while(innerDivs.length > 0) {
            innerDiv = innerDivs[0];
            innerDivs = innerDiv.getElementsByTagName("div");
        }

        innerDiv.appendChild(elmt);

        return div;
    };

    this.makeNeutralElement = function(tagName) {
        var elmt = document.createElement(tagName);
        var style = elmt.style;

        // TODO reset neutral element's style in a better way
        style.background = "transparent none";
        style.border = "none";
        style.margin = "0px";
        style.padding = "0px";
        style.position = "static";

        return elmt;
    };

    this.makeTransparentImage = function(src) {
        var img = self.makeNeutralElement("img");
        var elmt = null;

        if(browser == Browser.IE && browserVersion < 7) {
            elmt = self.makeNeutralElement("span");
            elmt.style.display = "inline-block";

            // to size span correctly, load image and get natural size,
            // but don't override any user-set CSS values
            img.onload = function() {
                elmt.style.width = elmt.style.width || img.width + "px";
                elmt.style.height = elmt.style.height || img.height + "px";

                img.onload = null;
                img = null;     // to prevent memory leaks in IE
            };

            img.src = src;
            elmt.style.filter =
                    "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" +
                    src + "', sizingMethod='scale')";
        } else {
            elmt = img;
            elmt.src = src;
        }

        return elmt;
    };

    this.setElementOpacity = function(elmt, opacity, usesAlpha) {
        var elmt = self.getElement(elmt);

        if(usesAlpha && badAlphaBrowser)
            // images with alpha channels won't fade well, so round
            opacity = Math.round(opacity);

        // for CSS opacity browsers, remove opacity value if it's unnecessary
        if(opacity < 1)
            elmt.style.opacity = opacity;
        else
            elmt.style.opacity = "";

        // for CSS filter browsers (IE), remove alpha filter if it's unnecessary
        if(opacity == 1) {
            var prevFilter = elmt.style.filter || "";
            elmt.style.filter = prevFilter.replace(/alpha\(.*?\)/g, "");
            // important: note the lazy star! this protects against
            // multiple filters; we don't want to delete the other ones.
            return;
        }

        var ieOpacity = Math.round(100 * opacity);
        var ieFilter = " alpha(opacity=" + ieOpacity + ") ";

        // check if this element has filters associated with it (IE only),
        // but prevent bug where IE throws error "Member not found" sometimes.
        try {
            if(elmt.filters && elmt.filters.alpha)
                elmt.filters.alpha.opacity = ieOpacity;
            else
                elmt.style.filter += ieFilter;
        } catch(e) {
            elmt.style.filter += ieFilter;
        }
    };

    this.addEvent = function(elmt, eventName, handler, useCapture) {
        var elmt = self.getElement(elmt);

        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/

        if(elmt.addEventListener) {
            elmt.addEventListener(eventName, handler, useCapture);
        } else if(elmt.attachEvent) {
            elmt.attachEvent("on" + eventName, handler);
            if(useCapture && elmt.setCapture)
                elmt.setCapture();
        } else {
            Seadragon.Debug.fail("Unable to attach event handler, no known technique.");
        }
    };

    this.removeEvent = function(elmt, eventName, handler, useCapture) {
        var elmt = self.getElement(elmt);

        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/

        if(elmt.removeEventListener) {
            elmt.removeEventListener(eventName, handler, useCapture);
        } else if(elmt.detachEvent) {
            elmt.detachEvent("on" + eventName, handler);
            if(useCapture && elmt.releaseCapture)
                elmt.releaseCapture();
        } else {
            Seadragon.Debug.fail("Unable to detach event handler, no known technique.");
        }
    };

    this.cancelEvent = function(event) {
        var event = self.getEvent(event);

        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/

        if(event.preventDefault)
            event.preventDefault();     // W3C for preventing default

        event.cancel = true;            // legacy for preventing default
        event.returnValue = false;      // IE for preventing default
    };

    this.stopEvent = function(event) {
        var event = self.getEvent(event);

        // technique from:
        // http://blog.paranoidferret.com/index.php/2007/08/10/javascript-working-with-events/

        if(event.stopPropagation) {
            event.stopPropagation();    // W3C for stopping propagation
        }

        event.cancelBubble = true;      // IE for stopping propagation
    };

    this.createCallback = function(object, method) {
        // create callback args
        var initialArgs = [];
        for(var i = 2; i < arguments.length; i++)
            initialArgs.push(arguments[i]);

        // create closure to apply method
        return function() {
            // concatenate new args, but make a copy of initialArgs first
            var args = initialArgs.concat([]);
            for(var i = 0; i < arguments.length; i++)
                args.push(arguments[i]);

            return method.apply(object, args);
        };
    };

    this.getUrlParameter = function(key) {
        var value = urlParams[key];
        return value ? value : null;
    };

    this.makeAjaxRequest = function(url, callback) {
        var async = typeof (callback) == "function";
        var req = null;

        if(async) {
            var actual = callback;
            var callback = function() {
                window.setTimeout(Seadragon.Utils.createCallback(null, actual, req), 1);
            };
        }

        if(window.ActiveXObject)
            for(var i = 0; i < arrActiveX.length; i++)
                try {
                    req = new ActiveXObject(arrActiveX[i]);
                    break;
                } catch(e) {
                    continue;
                }
        else if(window.XMLHttpRequest)
            req = new XMLHttpRequest();

        if(!req)
            Seadragon.Debug.fail("Browser doesn't support XMLHttpRequest.");

        if(async)
            req.onreadystatechange = function() {
                if(req.readyState == 4) {
                    // prevent memory leaks by breaking circular reference now
                    req.onreadystatechange = new Function();
                    callback();
                }
            };

        try {
            req.open("GET", url, async);
            req.send(null);
        } catch(e) {
            Seadragon.Debug.log(e.name + " while making AJAX request: " + e.message);

            req.onreadystatechange = null;
            req = null;

            if(async)
                callback();
        }

        return async ? null : req;
    };

    this.parseXml = function(string) {
        var xmlDoc = null;

        if(window.ActiveXObject)
            try {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(string);
            } catch(e) {
                Seadragon.Debug.log(e.name + " while parsing XML (ActiveX): " + e.message);
            }
        else if(window.DOMParser)
            try {
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(string, "text/xml");
            } catch(e) {
                Seadragon.Debug.log(e.name + " while parsing XML (DOMParser): " + e.message);
            }
        else
            Seadragon.Debug.fail("Browser doesn't support XML DOM.");

        return xmlDoc;
    };

};
// Seadragon.Utils is a static class, so make it singleton instance
Seadragon.Utils = new Seadragon.Utils();


Sys.Extended.UI.Seadragon.ButtonState = function() {
    throw Error.invalidOperation();
};
Sys.Extended.UI.Seadragon.ButtonState.prototype = {
    REST: 0,
    GROUP: 1,
    HOVER: 2,
    DOWN: 3
};
Sys.Extended.UI.Seadragon.ButtonState.registerEnum("Sys.Extended.UI.Seadragon.ButtonState", false);

Sys.Extended.UI.Seadragon.Button = function() {
    Sys.Extended.UI.Seadragon.Button.initializeBase(this);

    this._tooltip = null;
    this._srcRest = null;
    this._srcGroup = null;
    this._srcHover = null;
    this._srcDown = null;
    this._button = null;
    this.config = null;

};
Sys.Extended.UI.Seadragon.Button.prototype = {
    initialize: function() {
        Sys.Extended.UI.Seadragon.Button.callBaseMethod(this, 'initialize');

        this._button = Seadragon.Utils.makeNeutralElement("span");
        this._currentState = Sys.Extended.UI.Seadragon.ButtonState.GROUP;
        this._tracker = new Seadragon.MouseTracker(this._button, this.config.clickTimeThreshold, this.config.clickDistThreshold);
        this._imgRest = Seadragon.Utils.makeTransparentImage(this._srcRest);
        this._imgGroup = Seadragon.Utils.makeTransparentImage(this._srcGroup);
        this._imgHover = Seadragon.Utils.makeTransparentImage(this._srcHover);
        this._imgDown = Seadragon.Utils.makeTransparentImage(this._srcDown);

        this._fadeDelay = 0; // begin fading immediately
        this._fadeLength = 2000; // fade over a period of 2 seconds
        this._fadeBeginTime = null;
        this._shouldFade = false;

        this._button.style.display = "inline-block";
        this._button.style.position = "relative";
        this._button.title = this._tooltip;

        this._button.appendChild(this._imgRest);
        this._button.appendChild(this._imgGroup);
        this._button.appendChild(this._imgHover);
        this._button.appendChild(this._imgDown);

        var styleRest = this._imgRest.style;
        var styleGroup = this._imgGroup.style;
        var styleHover = this._imgHover.style;
        var styleDown = this._imgDown.style;

        // DON'T position imgRest absolutely -- let it be inline so it fills
        // up the div, sizing the div appropriately
        styleGroup.position = styleHover.position = styleDown.position = "absolute";
        styleGroup.top = styleHover.top = styleDown.top = "0px";
        styleGroup.left = styleHover.left = styleDown.left = "0px";
        styleHover.visibility = styleDown.visibility = "hidden";
        // rest and group are always visible

        // FF2 is very buggy with inline-block. it squashes the button div,
        // making the group-pressed states' images lower than rest. but
        // apparently, clearing the "top" style fixes this. (note that this
        // breaks the buttons in every other browser, so we're not clearing
        // the "top" style by default...)
        if(Seadragon.Utils.getBrowser() == Seadragon.Browser.FIREFOX &&
                    Seadragon.Utils.getBrowserVersion() < 3)
            styleGroup.top = styleHover.top = styleDown.top = "";

        this._tracker.enterHandler = Function.createDelegate(this, this._enterHandler);
        this._tracker.exitHandler = Function.createDelegate(this, this._exitHandler);
        this._tracker.pressHandler = Function.createDelegate(this, this._pressHandler);
        this._tracker.releaseHandler = Function.createDelegate(this, this._releaseHandler);
        this._tracker.clickHandler = Function.createDelegate(this, this._clickHandler);

        this._tracker.setTracking(true);
        this._outTo(Sys.Extended.UI.Seadragon.ButtonState.REST);
    },
    dispose: function() {
    },
    _scheduleFade: function() {
        window.setTimeout(Function.createDelegate(this, this._updateFade), 20);
    },
    _updateFade: function() {
        if(this._shouldFade) {
            var currentTime = new Date().getTime();
            var deltaTime = currentTime - this._fadeBeginTime;
            var opacity = 1.0 - deltaTime / this._fadeLength;

            opacity = Math.min(1.0, opacity);
            opacity = Math.max(0.0, opacity);

            Seadragon.Utils.setElementOpacity(this._imgGroup, opacity, true);
            if(opacity > 0)
                this._scheduleFade(); // fade again
        }
    },
    _beginFading: function() {
        this._shouldFade = true;
        this._fadeBeginTime = new Date().getTime() + this._fadeDelay;
        window.setTimeout(Function.createDelegate(this, this._scheduleFade), this._fadeDelay);
    },
    _stopFading: function() {
        this._shouldFade = false;
        Seadragon.Utils.setElementOpacity(this._imgGroup, 1.0, true);
    },
    _inTo: function(newState) {
        if(newState >= Sys.Extended.UI.Seadragon.ButtonState.GROUP && this._currentState == Sys.Extended.UI.Seadragon.ButtonState.REST) {
            this._stopFading();
            this._currentState = Sys.Extended.UI.Seadragon.ButtonState.GROUP;
        }

        if(newState >= Sys.Extended.UI.Seadragon.ButtonState.HOVER && this._currentState == Sys.Extended.UI.Seadragon.ButtonState.GROUP) {
            // important: don't explicitly say "visibility: visible".
            // see note in Viewer.setVisible() for explanation.
            this._imgHover.style.visibility = "";
            this._currentState = Sys.Extended.UI.Seadragon.ButtonState.HOVER;
        }

        if(newState >= Sys.Extended.UI.Seadragon.ButtonState.DOWN && this._currentState == Sys.Extended.UI.Seadragon.ButtonState.HOVER) {
            // important: don't explicitly say "visibility: visible".
            // see note in Viewer.setVisible() for explanation.
            this._imgDown.style.visibility = "";
            this._currentState = Sys.Extended.UI.Seadragon.ButtonState.DOWN;
        }
    },
    _outTo: function(newState) {
        if(newState <= Sys.Extended.UI.Seadragon.ButtonState.HOVER && this._currentState == Sys.Extended.UI.Seadragon.ButtonState.DOWN) {
            this._imgDown.style.visibility = "hidden";
            this._currentState = Sys.Extended.UI.Seadragon.ButtonState.HOVER;
        }

        if(newState <= Sys.Extended.UI.Seadragon.ButtonState.GROUP && this._currentState == Sys.Extended.UI.Seadragon.ButtonState.HOVER) {
            this._imgHover.style.visibility = "hidden";
            this._currentState = Sys.Extended.UI.Seadragon.ButtonState.GROUP;
        }

        if(this._newState <= Sys.Extended.UI.Seadragon.ButtonState.REST && this._currentState == Sys.Extended.UI.Seadragon.ButtonState.GROUP) {
            this._beginFading();
            this._currentState = Sys.Extended.UI.Seadragon.ButtonState.REST;
        }
    },
    _enterHandler: function(tracker, position, buttonDownElmt, buttonDownAny) {
        if(buttonDownElmt) {
            this._inTo(Sys.Extended.UI.Seadragon.ButtonState.DOWN);
            this._raiseEvent("onEnter", this);
        } else if(!buttonDownAny) {
            this._inTo(Sys.Extended.UI.Seadragon.ButtonState.HOVER);
        }
    },
    _exitHandler: function(tracker, position, buttonDownElmt, buttonDownAny) {
        this._outTo(Sys.Extended.UI.Seadragon.ButtonState.GROUP);
        if(buttonDownElmt)
            this._raiseEvent("onExit", this);
    },
    _pressHandler: function(tracker, position) {
        this._inTo(Sys.Extended.UI.Seadragon.ButtonState.DOWN);
        this._raiseEvent("onPress", this);
    },
    _releaseHandler: function(tracker, position, insideElmtPress, insideElmtRelease) {
        if(insideElmtPress && insideElmtRelease) {
            this._outTo(Sys.Extended.UI.Seadragon.ButtonState.HOVER);
            this._raiseEvent("onRelease", this);
        } else if(insideElmtPress) {
            this._outTo(Sys.Extended.UI.Seadragon.ButtonState.GROUP);
        } else {
            // pressed elsewhere, but released on it. if we ignored the
            // enter event because a button was down, activate hover now
            this._inTo(Sys.Extended.UI.Seadragon.ButtonState.HOVER);
        }
    },
    _clickHandler: function(tracker, position, quick, shift) {
        if(quick)
            this._raiseEvent("onClick", this);
    },
    _raiseEvent: function(eventName, eventArgs) {
        // Get handler for event.
        var handler = this.get_events().getHandler(eventName);

        if(handler) {
            if(!eventArgs)
                eventArgs = Sys.EventArgs.Empty;

            // Fire event.
            handler(this, eventArgs);
        }
    },
    get_element: function() {
        return this._button;
    },
    get_tooltip: function() {
        return this._tooltip;
    },
    set_tooltip: function(value) {
        this._tooltip = value;
    },
    get_config: function() {
        return this.config;
    },
    set_config: function(value) {
        this.config = value;
    },
    get_srcRest: function() {
        return this._srcRest;
    },
    set_srcRest: function(value) {
        this._srcRest = value;
    },
    get_srcGroup: function() {
        return this._srcGroup;
    },
    set_srcGroup: function(value) {
        this._srcGroup = value;
    },
    get_srcHover: function() {
        return this._srcHover;
    },
    set_srcHover: function(value) {
        this._srcHover = value;
    },
    get_srcDown: function() {
        return this._srcDown;
    },
    set_srcDown: function(value) {
        this._srcDown = value;
    },
    add_onPress: function(handler) {
        this.get_events().addHandler("onPress", handler);
    },
    remove_onPress: function(handler) {
        this.get_events().removeHandler("onPress", handler);
    },
    add_onClick: function(handler) {
        this.get_events().addHandler("onClick", handler);
    },
    remove_onClick: function(handler) {
        this.get_events().removeHandler("onClick", handler);
    },
    add_onEnter: function(handler) {
        this.get_events().addHandler("onEnter", handler);
    },
    remove_onEnter: function(handler) {
        this.get_events().removeHandler("onEnter", handler);
    },
    add_onRelease: function(handler) {
        this.get_events().addHandler("onRelease", handler);
    },
    remove_onRelease: function(handler) {
        this.get_events().removeHandler("onRelease", handler);
    },
    add_onExit: function(handler) {
        this.get_events().addHandler("onExit", handler);
    },
    remove_onExit: function(handler) {
        this.get_events().removeHandler("onExit", handler);
    },
    notifyGroupEnter: function() {
        this._inTo(Sys.Extended.UI.Seadragon.ButtonState.GROUP);
    },
    notifyGroupExit: function() {
        this._outTo(Sys.Extended.UI.Seadragon.ButtonState.REST);
    }
};
Sys.Extended.UI.Seadragon.Button.registerClass('Sys.Extended.UI.Seadragon.Button', Sys.Component);

Sys.Extended.UI.Seadragon.ButtonGroup = function() {
    Sys.Extended.UI.Seadragon.ButtonGroup.initializeBase(this);

    this._buttons = null;
    this._group = null;
    this.config = null;
};
Sys.Extended.UI.Seadragon.ButtonGroup.prototype = {
    initialize: function() {
        Sys.Extended.UI.Seadragon.ButtonGroup.callBaseMethod(this, 'initialize');

        this._group = Seadragon.Utils.makeNeutralElement("span");
        var buttons = this._buttons.concat([]);   // copy
        var tracker = new Seadragon.MouseTracker(this._group, this.config.clickTimeThreshold, this.config.clickDistThreshold);
        this._group.style.display = "inline-block";

        for(var i = 0; i < buttons.length; i++)
            this._group.appendChild(buttons[i].get_element());

        tracker.enterHandler = Function.createDelegate(this, this._enterHandler);
        tracker.exitHandler = Function.createDelegate(this, this._exitHandler);
        tracker.releaseHandler = Function.createDelegate(this, this._releaseHandler);

        tracker.setTracking(true);
    },
    dispose: function() {
    },
    get_buttons: function() {
        return this._buttons;
    },
    set_buttons: function(value) {
        this._buttons = value;
    },
    get_element: function() {
        return this._group;
    },
    get_config: function() {
        return this.config;
    },
    set_config: function(value) {
        this.config = value;
    },
    _enterHandler: function(tracker, position, buttonDownElmt, buttonDownAny) {
        // somewhat office ribbon style -- we do this regardless of whether
        // the mouse is down from elsewhere. it's a nice soft glow effect.
        for(var i = 0; i < this._buttons.length; i++)
            this._buttons[i].notifyGroupEnter();
    },
    _exitHandler: function(tracker, position, buttonDownElmt, buttonDownAny) {
        if(!buttonDownElmt)
            // only go to rest if the mouse isn't down from a button
            for(var i = 0; i < this._buttons.length; i++)
                this._buttons[i].notifyGroupExit();
    },
    _releaseHandler: function(tracker, position, insideElmtPress, insideElmtRelease) {

        if(!insideElmtRelease)
            // this means was the mouse was inside the div during press, so
            // since it's no longer inside the div during release, it left
            // the div. but onDivExit() ignored it since the mouse was down
            // from the div, so we'll go out to rest state now.
            for(var i = 0; i < this._buttons.length; i++)
                this._buttons[i].notifyGroupExit();
    },
    emulateEnter: function() {
        this._enterHandler();
    },

    emulateExit: function() {
        this._exitHandler();
    }
};
Sys.Extended.UI.Seadragon.ButtonGroup.registerClass('Sys.Extended.UI.Seadragon.ButtonGroup', Sys.Component);

Sys.Extended.UI.Seadragon.Config = function() {

    this.debugMode = true;
    this.animationTime = 1.5;
    this.blendTime = 0.5;
    this.alwaysBlend = false;
    this.autoHideControls = true;
    this.immediateRender = false;
    this.wrapHorizontal = false;
    this.wrapVertical = false;
    this.minZoomDimension = 0.8;
    this.maxZoomPixelRatio = 2;
    this.visibilityRatio = 0.5;
    this.springStiffness = 5.0;
    this.imageLoaderLimit = 2;
    this.clickTimeThreshold = 200;
    this.clickDistThreshold = 5;
    this.zoomPerClick = 2.0;
    this.zoomPerSecond = 2.0;
    this.showNavigationControl = true;
    this.maxImageCacheCount = 100;
    this.minPixelRatio = 0.5;
    this.mouseNavEnabled = true;

    this.navImages = {
        zoomIn: {
            REST: Sys.Extended.UI.Images["Seadragon.ZoomIn-Rest.png"],
            GROUP: Sys.Extended.UI.Images["Seadragon.ZoomIn-Grouphover.png"],
            HOVER: Sys.Extended.UI.Images["Seadragon.ZoomIn-Hover.png"],
            DOWN: Sys.Extended.UI.Images["Seadragon.ZoomIn-Pressed.png"]
        },
        zoomOut: {
            REST: Sys.Extended.UI.Images["Seadragon.ZoomOut-Rest.png"],
            GROUP: Sys.Extended.UI.Images["Seadragon.ZoomOut-Grouphover.png"],
            HOVER: Sys.Extended.UI.Images["Seadragon.ZoomOut-Hover.png"],
            DOWN: Sys.Extended.UI.Images["Seadragon.ZoomOut-Pressed.png"]
        },
        home: {
            REST: Sys.Extended.UI.Images["Seadragon.Home-Rest.png"],
            GROUP: Sys.Extended.UI.Images["Seadragon.Home-Grouphover.png"],
            HOVER: Sys.Extended.UI.Images["Seadragon.Home-Hover.png"],
            DOWN: Sys.Extended.UI.Images["Seadragon.Home-Pressed.png"]
        },
        fullpage: {
            REST: Sys.Extended.UI.Images["Seadragon.Fullscreen-Rest.png"],
            GROUP: Sys.Extended.UI.Images["Seadragon.Fullscreen-Grouphover.png"],
            HOVER: Sys.Extended.UI.Images["Seadragon.Fullscreen-Hover.png"],
            DOWN: Sys.Extended.UI.Images["Seadragon.Fullscreen-Pressed.png"]
        }
    };
};
Sys.Extended.UI.Seadragon.Config.registerClass('Sys.Extended.UI.Seadragon.Config', null, Sys.IDisposable);

if(!window.SIGNAL)
    window.SIGNAL = "----seadragon----";


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
        if(this._zooming && this._viewer.viewport) {
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
        if(this._viewer.viewport) {
            this._zooming = false;
            this._viewer.viewport.zoomBy(this.config.zoomPerClick / 1.0);
            this._viewer.viewport.applyConstraints();
        }
    },
    _doSingleZoomOut: function() {
        if(this._viewer.viewport) {
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
        if(this._viewer.viewport)
            this._viewer.viewport.goHome();
    },
    _onFullPage: function() {
        this._viewer.setFullPage(!this._viewer.isFullPage());
        this._group.emulateExit();  // correct for no mouseout event on change

        if(this._viewer.viewport)
            this._viewer.viewport.applyConstraints();
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
        if(this.anchor == Seadragon.ControlAnchor.NONE)
            this.wrapper.style.width = this.wrapper.style.height = "100%";    // IE6 fix
        this.addToAnchor();
    },
    addToAnchor: function() {
        if(this.anchor == Seadragon.ControlAnchor.TOP_RIGHT || this.anchor == Seadragon.ControlAnchor.BOTTOM_RIGHT)
            this.container.insertBefore(this.elmt, this.container.firstChild);
        else
            this.container.appendChild(this.elmt);
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
        if(this.elmt[SIGNAL] && Seadragon.Utils.getBrowser() == Seadragon.Browser.IE)
            Seadragon.Utils.setElementOpacity(this.elmt, opacity, true);
        else
            Seadragon.Utils.setElementOpacity(this.wrapper, opacity, true);
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
        if(this.get_showNavigationControl()) {
            navControl = (new Sys.Extended.UI.Seadragon.NavControl(this)).elmt;
            navControl.style.marginRight = "4px";
            navControl.style.marginBottom = "4px";
            this.addControl(navControl, Sys.Extended.UI.Seadragon.ControlAnchor.BOTTOM_RIGHT);
        }
        for(var i = 0; i < this._customControls.length; i++)
            this.addControl(this._customControls[i].id, this._customControls[i].anchor);

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
        this.get_element().appendChild(this._container);

        if(this._xmlPath)
            this.openDzi(this._xmlPath);
    },
    _raiseEvent: function(eventName, eventArgs) {
        // Get handler for event.
        var handler = this.get_events().getHandler(eventName);

        if(handler) {
            if(!eventArgs)
                eventArgs = Sys.EventArgs.Empty;

            // Fire event.                          
            handler(this, eventArgs);
        }
    },
    _beginControlsAutoHide: function() {
        if(!this.config.autoHideControls)
            return;

        this._controlsShouldFade = true;
        this._controlsFadeBeginTime = new Date().getTime() + this._controlsFadeDelay;
        window.setTimeout(Function.createDelegate(this, this._scheduleControlsFade), this._controlsFadeDelay);
    },
    _scheduleControlsFade: function() {
        window.setTimeout(Function.createDelegate(this, this._updateControlsFade), 20);
    },
    _updateControlsFade: function() {
        if(this._controlsShouldFade) {
            var currentTime = new Date().getTime();
            var deltaTime = currentTime - this._controlsFadeBeginTime;
            var opacity = 1.0 - deltaTime / this._controlsFadeLength;

            opacity = Math.min(1.0, opacity);
            opacity = Math.max(0.0, opacity);

            for(var i = this._controls.length - 1; i >= 0; i--)
                this._controls[i].setOpacity(opacity);

            if(opacity > 0)
                this._scheduleControlsFade();    // fade again
        }
    },
    _onCanvasClick: function(tracker, position, quick, shift) {
        if(this.viewport && quick) {    // ignore clicks where mouse moved			
            var zoomPerClick = this.config.zoomPerClick;
            var factor = shift ? 1.0 / zoomPerClick : zoomPerClick;
            this.viewport.zoomBy(factor, this.viewport.pointFromPixel(position, true));
            this.viewport.applyConstraints();
        }
    },
    _onCanvasDrag: function(tracker, position, delta, shift) {
        if(this.viewport)
            // negate since dragging is opposite of panning.
            // analogy: in adobe pdf, dragging vs using scrollbars.
            this.viewport.panBy(this.viewport.deltaPointsFromPixels(delta.negate()));
    },
    _onCanvasRelease: function(tracker, position, insideElmtPress, insideElmtRelease) {
        if(insideElmtPress && this.viewport)
            this.viewport.applyConstraints();
    },
    _onContainerExit: function(tracker, position, buttonDownElmt, buttonDownAny) {
        // fade controls out over time, only if the mouse isn't down from
        // within the container (e.g. panning, or using a control)
        if(!buttonDownElmt) {
            this._mouseInside = false;
            if(!this._animating)
                this._beginControlsAutoHide();
        }
    },
    _onContainerRelease: function(tracker, position, insideElmtPress, insideElmtRelease) {
        // the mouse may have exited the container and we ignored it if the
        // mouse was down from within the container. now when the mouse is
        // released, we should fade the controls out now.
        if(!insideElmtRelease) {
            this._mouseInside = false;
            if(!this._animating)
                this._beginControlsAutoHide();
        }
    },
    _getControlIndex: function(elmt) {
        for(var i = this._controls.length - 1; i >= 0; i--)
            if(this._controls[i].elmt == elmt)
                return i;

        return -1;
    },
    _abortControlsAutoHide: function() {
        this._controlsShouldFade = false;
        for(var i = this._controls.length - 1; i >= 0; i--)
            this._controls[i].setOpacity(1.0);
    },
    _onContainerEnter: function(tracker, position, buttonDownElmt, buttonDownAny) {
        this._mouseInside = true;
        this._abortControlsAutoHide();
    },
    _updateOnce: function() {
        if(!this.source)
            return;

        this.profiler.beginUpdate();

        var containerSize = Seadragon.Utils.getElementSize(this._container);

        if(!containerSize.equals(this._prevContainerSize)) {
            this.viewport.resize(containerSize, true); // maintain image position
            this._prevContainerSize = containerSize;
            this._raiseEvent("resize", this);
        }

        var animated = this.viewport.update();

        if(!this._animating && animated) {
            // we weren't animating, and now we did ==> animation start
            this._raiseEvent("animationstart", self);
            this._abortControlsAutoHide();
        }

        if(animated) {
            // viewport moved
            this.drawer.update();
            this._raiseEvent("animation", self);
        } else if(this._forceRedraw || this.drawer.needsUpdate()) {
            // need to load or blend images, etc.
            this.drawer.update();
            this._forceRedraw = false;
        } else {
            // no changes, so preload images, etc.
            this.drawer.idle();
        }

        if(this._animating && !animated) {
            // we were animating, and now we're not anymore ==> animation finish
            this._raiseEvent("animationfinish", this);

            // if the mouse has left the container, begin fading controls
            if(!this._mouseInside)
                this._beginControlsAutoHide();
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
        if(this.source)
            this._onClose();

        this._lastOpenStartTime = new Date().getTime();   // to ignore earlier opens

        // show loading message after a delay if it still hasn't loaded
        window.setTimeout(Function.createDelegate(this, function() {
            if(this._lastOpenStartTime > this._lastOpenEndTime)
                this._setMessage(Seadragon.Strings.getString("Messages.Loading"));
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

        if(time < this._lastOpenStartTime) {
            Seadragon.Debug.log("Ignoring out-of-date open.");
            this._raiseEvent("ignore");
            return;
        } else if(!_source) {
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

        for(var i = 0; i < this._overlayControls.length; i++) {
            var overlay = this._overlayControls[i];
            if(overlay.point != null)
                this.drawer.addOverlay(overlay.id, new Sys.Extended.UI.Seadragon.Point(overlay.point.X, overlay.point.Y), Sys.Extended.UI.Seadragon.OverlayPlacement.TOP_LEFT);
            else
                this.drawer.addOverlay(overlay.id, new Sys.Extended.UI.Seadragon.Rect(overlay.rect.Point.X, overlay.rect.Point.Y, overlay.rect.Width, overlay.rect.Height), overlay.placement);
        }
        this._raiseEvent("open");
    },
    _scheduleUpdate: function(updateFunc, prevUpdateTime) {
        // if we're animating, update as fast as possible to stay smooth
        if(this._animating)
            return window.setTimeout(Function.createDelegate(this, updateFunc), 1);

        // if no previous update, consider this an update
        var currentTime = new Date().getTime();
        var prevUpdateTime = prevUpdateTime ? prevUpdateTime : currentTime;
        var targetTime = prevUpdateTime + 1000 / 60;    // 60 fps ideal

        // calculate delta time to be a positive number
        var deltaTime = Math.max(1, targetTime - currentTime);
        return window.setTimeout(Function.createDelegate(this, updateFunc), deltaTime);
    },
    _updateMulti: function() {
        if(!this.source)
            return;

        var beginTime = new Date().getTime();

        this._updateOnce();
        this._scheduleUpdate(arguments.callee, beginTime);
    },
    _updateOnce: function() {
        if(!this.source)
            return;

        this.profiler.beginUpdate();

        var containerSize = Seadragon.Utils.getElementSize(this._container);

        if(!containerSize.equals(this._prevContainerSize)) {
            this.viewport.resize(containerSize, true); // maintain image position
            this._prevContainerSize = containerSize;
            this._raiseEvent("resize");
        }

        var animated = this.viewport.update();

        if(!this._animating && animated) {
            // we weren't animating, and now we did ==> animation start
            this._raiseEvent("animationstart");
            this._abortControlsAutoHide();
        }

        if(animated) {
            // viewport moved
            this.drawer.update();
            this._raiseEvent("animation");
        } else if(this._forceRedraw || this.drawer.needsUpdate()) {
            // need to load or blend images, etc.
            this.drawer.update();
            this._forceRedraw = false;
        } else {
            // no changes, so preload images, etc.
            this.drawer.idle();
        }

        if(this._animating && !animated) {
            // we were animating, and now we're not anymore ==> animation finish
            this._raiseEvent("animationfinish");

            // if the mouse has left the container, begin fading controls
            if(!this._mouseInside)
                this._beginControlsAutoHide();
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

        if(this._getControlIndex(elmt) >= 0)
            return;     // they're trying to add a duplicate control

        var div = null;

        switch(anchor) {
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
        if(!this.source)
            return;

        this._onClose();
    },
    removeControl: function(elmt) {
        var elmt = Seadragon.Utils.getElement(elmt);
        var i = this._getControlIndex(elmt);

        if(i >= 0) {
            this._controls[i].destroy();
            this._controls.splice(i, 1);
        }
    },
    clearControls: function() {
        while(this._controls.length > 0)
            this._controls.pop().destroy();
    },
    isDashboardEnabled: function() {
        for(var i = this._controls.length - 1; i >= 0; i--)
            if(this._controls[i].isVisible())
                return true;

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
        for(var i = this._controls.length - 1; i >= 0; i--)
            this._controls[i].setVisible(enabled);
    },

    setFullPage: function(fullPage) {
        if(fullPage == this.isFullPage())
            return;

        // copy locally to improve perf
        var body = document.body;
        var bodyStyle = body.style;
        var docStyle = document.documentElement.style;
        var containerStyle = this._container.style;
        var canvasStyle = this._canvas.style;

        if(fullPage) {
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
        if(this.viewport) {
            var oldBounds = this.viewport.getBounds();
            this.viewport.resize(this._prevContainerSize);
            var newBounds = this.viewport.getBounds();

            if(fullPage) {
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

(function() {

    // DUPLICATION CHECK -- necessary here because of private static state
    if(Seadragon.MouseTracker)
        return;

    // Constants
    var isIE = Seadragon.Utils.getBrowser() == Seadragon.Browser.IE;

    // Static fields

    var buttonDownAny = false;
    var ieCapturingAny = false;
    var ieTrackersActive = {};      // dictionary from hash to MouseTracker
    var ieTrackersCapturing = [];   // list of trackers interested in capture

    // Static helpers

    function getMouseAbsolute(event) {
        return Seadragon.Utils.getMousePosition(event);
    }

    function getMouseRelative(event, elmt) {
        var mouse = Seadragon.Utils.getMousePosition(event);
        var offset = Seadragon.Utils.getElementPosition(elmt);

        return mouse.minus(offset);
    }

    /**
	* Returns true if elmtB is a child node of elmtA, or if they're equal.
	*/
    function isChild(elmtA, elmtB) {
        var body = document.body;
        while(elmtB && elmtA != elmtB && body != elmtB)
            try {
                elmtB = elmtB.parentNode;
            } catch(e) {
            // Firefox sometimes fires events for XUL elements, which throws
            // a "permission denied" error. so this is not a child.
                return false;
            }

        return elmtA == elmtB;
    }

    function onGlobalMouseDown() {
        buttonDownAny = true;
    }

    function onGlobalMouseUp() {
        buttonDownAny = false;
    }

    // Static constructor

    (function() {
        // the W3C event model lets us listen to the capture phase of events, so
        // to know if the mouse is globally up or down, we'll listen to the
        // capture phase of the window's events. we can't do this in IE, so
        // we'll give it a best effort by listening to the regular bubble phase,
        // and on the document since window isn't legal in IE for mouse events.
        if(isIE) {
            Seadragon.Utils.addEvent(document, "mousedown", onGlobalMouseDown, false);
            Seadragon.Utils.addEvent(document, "mouseup", onGlobalMouseUp, false);
        } else {
            Seadragon.Utils.addEvent(window, "mousedown", onGlobalMouseDown, true);
            Seadragon.Utils.addEvent(window, "mouseup", onGlobalMouseUp, true);
        }
    })();

    // Class

    Seadragon.MouseTracker = function(elmt, clickTimeThreshold, clickDistThreshold) {

        // Fields

        var self = this;
        var ieSelf = null;

        var hash = Math.random();     // a unique hash for this tracker
        var elmt = Seadragon.Utils.getElement(elmt);

        var tracking = false;
        var capturing = false;
        var buttonDownElmt = false;
        var insideElmt = false;

        var lastPoint = null;           // position of last mouse down/move
        var lastMouseDownTime = null;   // time of last mouse down
        var lastMouseDownPoint = null;  // position of last mouse down
        var clickTimeThreshold = clickTimeThreshold;
        var clickDistThreshold = clickDistThreshold;

        // Properties

        this.target = elmt;
        this.enterHandler = null;       // function(tracker, position, buttonDownElmt, buttonDownAny)
        this.exitHandler = null;        // function(tracker, position, buttonDownElmt, buttonDownAny)
        this.pressHandler = null;       // function(tracker, position)
        this.releaseHandler = null;     // function(tracker, position, insideElmtPress, insideElmtRelease)
        this.clickHandler = null;       // function(tracker, position, quick, shift)
        this.dragHandler = null;        // function(tracker, position, delta, shift)

        // Helpers

        function startTracking() {
            if(!tracking) {
                Seadragon.Utils.addEvent(elmt, "mouseover", onMouseOver, false);
                Seadragon.Utils.addEvent(elmt, "mouseout", onMouseOut, false);
                Seadragon.Utils.addEvent(elmt, "mousedown", onMouseDown, false);
                Seadragon.Utils.addEvent(elmt, "mouseup", onMouseUp, false);
                Seadragon.Utils.addEvent(elmt, "click", onMouseClick, false);

                tracking = true;
                ieTrackersActive[hash] = ieSelf;
            }
        }

        function stopTracking() {
            if(tracking) {
                Seadragon.Utils.removeEvent(elmt, "mouseover", onMouseOver, false);
                Seadragon.Utils.removeEvent(elmt, "mouseout", onMouseOut, false);
                Seadragon.Utils.removeEvent(elmt, "mousedown", onMouseDown, false);
                Seadragon.Utils.removeEvent(elmt, "mouseup", onMouseUp, false);
                Seadragon.Utils.removeEvent(elmt, "click", onMouseClick, false);

                releaseMouse();
                tracking = false;
                delete ieTrackersActive[hash];
            }
        }

        function captureMouse() {
            if(!capturing) {
                // IE lets the element capture the mouse directly, but other
                // browsers use the capture phase on the highest element.
                if(isIE) {
                    // we need to capture the mouse, but we also don't want to
                    // handle mouseup like normally (special case for bubbling)
                    Seadragon.Utils.removeEvent(elmt, "mouseup", onMouseUp, false);
                    Seadragon.Utils.addEvent(elmt, "mouseup", onMouseUpIE, true);
                    Seadragon.Utils.addEvent(elmt, "mousemove", onMouseMoveIE, true);
                } else {
                    Seadragon.Utils.addEvent(window, "mouseup", onMouseUpWindow, true);
                    Seadragon.Utils.addEvent(window, "mousemove", onMouseMove, true);
                }

                capturing = true;
            }
        }

        function releaseMouse() {
            if(capturing) {
                // similar reasoning as captureMouse()
                if(isIE) {
                    // we need to release the mouse, and also go back to handling
                    // mouseup like normal (no longer a hack for capture phase)
                    Seadragon.Utils.removeEvent(elmt, "mousemove", onMouseMoveIE, true);
                    Seadragon.Utils.removeEvent(elmt, "mouseup", onMouseUpIE, true);
                    Seadragon.Utils.addEvent(elmt, "mouseup", onMouseUp, false);
                } else {
                    Seadragon.Utils.removeEvent(window, "mousemove", onMouseMove, true);
                    Seadragon.Utils.removeEvent(window, "mouseup", onMouseUpWindow, true);
                }

                capturing = false;
            }
        }

        // IE-specific helpers

        function triggerOthers(eventName, event) {
            // update: protecting against properties added to the Object class's
            // prototype, which can and does happen (e.g. through js libraries)
            var trackers = ieTrackersActive;
            for(var otherHash in trackers)
                if(trackers.hasOwnProperty(otherHash) && hash != otherHash)
                    trackers[otherHash][eventName](event);
        }

        function hasMouse() {
            return insideElmt;
        }

        // Listeners

        function onMouseOver(event) {
            var event = Seadragon.Utils.getEvent(event);

            // IE capturing model doesn't raise or bubble the events on any
            // other element if we're capturing currently. so pass this event to
            // other elements being tracked so they can adjust if the element
            // was from them or from a child. however, IE seems to always fire
            // events originating from parents to those parents, so don't double
            // fire the event if the event originated from a parent.
            if(isIE && capturing && !isChild(event.srcElement, elmt))
                triggerOthers("onMouseOver", event);

            // similar to onMouseOut() tricky bubbling case...
            var to = event.target ? event.target : event.srcElement;
            var from = event.relatedTarget ? event.relatedTarget : event.fromElement;
            if(!isChild(elmt, to) || isChild(elmt, from))
                // the mouseover needs to end on this or a child node, and it
                // needs to start from this or an outer node.
                return;

            insideElmt = true;

            if(typeof (self.enterHandler) == "function")
                try {
                    self.enterHandler(self, getMouseRelative(event, elmt),
                            buttonDownElmt, buttonDownAny);
                } catch(e) {
                // handler threw an error, ignore
                    Seadragon.Debug.error(e.name +
                            " while executing enter handler: " + e.message, e);
                }
        }

        function onMouseOut(event) {
            var event = Seadragon.Utils.getEvent(event);

            // similar to onMouseOver() case for IE capture model
            if(isIE && capturing && !isChild(event.srcElement, elmt))
                triggerOthers("onMouseOut", event);

            // we have to watch out for a tricky case: a mouseout occurs on a
            // child element, but the mouse is still inside the parent element.
            // the mouseout event will bubble up to us. this happens in all
            // browsers, so we need to correct for this. technique from:
            // http://www.quirksmode.org/js/events_mouse.html
            var from = event.target ? event.target : event.srcElement;
            var to = event.relatedTarget ? event.relatedTarget : event.toElement;
            if(!isChild(elmt, from) || isChild(elmt, to))
                // the mouseout needs to start from this or a child node, and it
                // needs to end on this or an outer node.
                return;

            insideElmt = false;

            if(typeof (self.exitHandler) == "function")
                try {
                    self.exitHandler(self, getMouseRelative(event, elmt),
                            buttonDownElmt, buttonDownAny);
                } catch(e) {
                // handler threw an error, ignore
                    Seadragon.Debug.error(e.name +
                            " while executing exit handler: " + e.message, e);
                }
        }

        function onMouseDown(event) {
            var event = Seadragon.Utils.getEvent(event);

            // don't consider right-clicks (fortunately this is cross-browser)
            if(event.button == 2)
                return;

            buttonDownElmt = true;

            lastPoint = getMouseAbsolute(event);
            lastMouseDownPoint = lastPoint;
            lastMouseDownTime = new Date().getTime();

            if(typeof (self.pressHandler) == "function")
                try {
                    self.pressHandler(self, getMouseRelative(event, elmt));
                } catch(e) {
                // handler threw an error, ignore
                    Seadragon.Debug.error(e.name +
                            " while executing press handler: " + e.message, e);
                }

            if(self.pressHandler || self.dragHandler)
                // if a press or drag handler is registered, don't drag-drop images, etc.
                Seadragon.Utils.cancelEvent(event);

            if(!isIE || !ieCapturingAny) {
                captureMouse();
                ieCapturingAny = true;
                ieTrackersCapturing = [ieSelf];     // reset to empty & add us
            } else if(isIE) {
                ieTrackersCapturing.push(ieSelf);   // add us to the list
            }
        }

        function onMouseUp(event) {
            var event = Seadragon.Utils.getEvent(event);
            var insideElmtPress = buttonDownElmt;
            var insideElmtRelease = insideElmt;

            // don't consider right-clicks (fortunately this is cross-browser)
            if(event.button == 2)
                return;

            buttonDownElmt = false;

            if(typeof (self.releaseHandler) == "function")
                try {
                    self.releaseHandler(self, getMouseRelative(event, elmt),
                            insideElmtPress, insideElmtRelease);
                } catch(e) {
                // handler threw an error, ignore
                    Seadragon.Debug.error(e.name +
                            " while executing release handler: " + e.message, e);
                }

            // some browsers sometimes don't fire click events when we're also
            // listening for mouseup events. i'm not sure why, it could be
            // something i'm doing. in the meantime, this is a temporary fix.
            if(insideElmtPress && insideElmtRelease)
                handleMouseClick(event);
        }

        /**
		* Only triggered once by the deepest element that initially received
		* the mouse down event. We want to make sure THIS event doesn't bubble.
		* Instead, we want to trigger the elements that initially received the
		* mouse down event (including this one) only if the mouse is no longer
		* inside them. Then, we want to release capture, and emulate a regular
		* mouseup on the event that this event was meant for.
		*/
        function onMouseUpIE(event) {
            var event = Seadragon.Utils.getEvent(event);

            // don't consider right-clicks (fortunately this is cross-browser)
            if(event.button == 2)
                return;

            // first trigger those that were capturing
            for(var i = 0; i < ieTrackersCapturing.length; i++) {
                var tracker = ieTrackersCapturing[i];
                if(!tracker.hasMouse())
                    tracker.onMouseUp(event);
            }

            // then release capture and emulate a regular event
            releaseMouse();
            ieCapturingAny = false;
            event.srcElement.fireEvent("on" + event.type, document.createEventObject(event));

            // make sure to stop this event -- shouldn't bubble up
            Seadragon.Utils.stopEvent(event);
        }

        /**
		* Only triggered in W3C browsers by elements within which the mouse was
		* initially pressed, since they are now listening to the window for
		* mouseup during the capture phase. We shouldn't handle the mouseup
		* here if the mouse is still inside this element, since the regular
		* mouseup handler will still fire.
		*/
        function onMouseUpWindow(event) {
            if(!insideElmt)
                onMouseUp(event);

            releaseMouse();
        }

        function onMouseClick(event) {
            // see onMouseUp() bug -- handleClick() is already called by
            // onMouseUp() as a temporary fix, so don't duplicate the call here.

            if(self.clickHandler)
                // since a click handler was registered, don't follow href's, etc.
                Seadragon.Utils.cancelEvent(event);
        }

        function handleMouseClick(event) {
            var event = Seadragon.Utils.getEvent(event);

            // don't consider right-clicks (fortunately this is cross-browser)
            if(event.button == 2)
                return;

            var time = new Date().getTime() - lastMouseDownTime;
            var point = getMouseAbsolute(event);
            var distance = lastMouseDownPoint.distanceTo(point);
            var quick = time <= clickTimeThreshold && distance <= clickDistThreshold;

            if(typeof (self.clickHandler) == "function")
                try {
                    self.clickHandler(self, getMouseRelative(event, elmt),
                            quick, event.shiftKey);
                } catch(e) {
                // handler threw an error, ignore
                    Seadragon.Debug.error(e.name +
                            " while executing click handler: " + e.message, e);
                }
        }

        function onMouseMove(event) {
            var event = Seadragon.Utils.getEvent(event);
            var point = getMouseAbsolute(event);
            var delta = point.minus(lastPoint);

            lastPoint = point;

            if(typeof (self.dragHandler) == "function") {
                try {
                    self.dragHandler(self, getMouseRelative(event, elmt), delta, event.shiftKey);
                } catch(e) {
                    // handler threw an error, ignore
                    Seadragon.Debug.error(e.name + " while executing drag handler: " + e.message, e);
                }

                // since a drag handler was registered, don't allow highlighting, etc.
                Seadragon.Utils.cancelEvent(event);
            }
        }

        /**
		* Only triggered once by the deepest element that initially received
		* the mouse down event. Since no other element has captured the mouse,
		* we want to trigger the elements that initially received the mouse
		* down event (including this one).
		*/
        function onMouseMoveIE(event) {
            // manually trigger those that are capturing
            for(var i = 0; i < ieTrackersCapturing.length; i++)
                ieTrackersCapturing[i].onMouseMove(event);

            // make sure to stop this event -- shouldn't bubble up. note that at
            // the time of this writing, there is no harm in letting it bubble,
            // but a minor change to our implementation would necessitate this.
            Seadragon.Utils.stopEvent(event);
        }

        // Constructor

        (function() {
            ieSelf = {
                hasMouse: hasMouse,
                onMouseOver: onMouseOver,
                onMouseOut: onMouseOut,
                onMouseUp: onMouseUp,
                onMouseMove: onMouseMove
            };
        })();

        // Methods

        this.isTracking = function() {
            return tracking;
        };

        this.setTracking = function(track) {
            if(track)
                startTracking();
            else
                stopTracking();
        };
    };
})();

Seadragon.Point = Sys.Extended.UI.Seadragon.Point = function(x, y) {
    this.x = typeof (x) == "number" ? x : 0;
    this.y = typeof (y) == "number" ? y : 0;
};
Sys.Extended.UI.Seadragon.Point.prototype = {
    // Methods

    plus: function(point) {
        return new Sys.Extended.UI.Seadragon.Point(this.x + point.x, this.y + point.y);
    },

    minus: function(point) {
        return new Sys.Extended.UI.Seadragon.Point(this.x - point.x, this.y - point.y);
    },

    times: function(factor) {
        return new Sys.Extended.UI.Seadragon.Point(this.x * factor, this.y * factor);
    },

    divide: function(factor) {
        return new Sys.Extended.UI.Seadragon.Point(this.x / factor, this.y / factor);
    },

    negate: function() {
        return new Sys.Extended.UI.Seadragon.Point(-this.x, -this.y);
    },

    distanceTo: function(point) {
        return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
    },

    apply: function(func) {
        return new Sys.Extended.UI.Seadragon.Point(func(this.x), func(this.y));
    },

    equals: function(point) {
        return (point instanceof Sys.Extended.UI.Seadragon.Point) && (this.x === point.x) && (this.y === point.y);
    },

    toString: function() {
        return "(" + this.x + "," + this.y + ")";
    }
};
Sys.Extended.UI.Seadragon.Point.registerClass('Sys.Extended.UI.Seadragon.Point', null, Sys.IDisposable);

Sys.Extended.UI.Seadragon.Strings = {
    Errors: {
        Failure: "Sorry, but Seadragon Ajax can't run on your browser!\n" +
                    "Please try using IE 7 or Firefox 3.\n",
        Dzc: "Sorry, we don't support Deep Zoom Collections!",
        Dzi: "Hmm, this doesn't appear to be a valid Deep Zoom Image.",
        Xml: "Hmm, this doesn't appear to be a valid Deep Zoom Image.",
        Empty: "You asked us to open nothing, so we did just that.",
        ImageFormat: "Sorry, we don't support {0}-based Deep Zoom Images.",
        Security: "It looks like a security restriction stopped us from " +
                    "loading this Deep Zoom Image.",
        Status: "This space unintentionally left blank ({0} {1}).",
        Unknown: "Whoops, something inexplicably went wrong. Sorry!"
    },

    Messages: {
        Loading: "Loading..."
    },

    Tooltips: {
        FullPage: "Toggle full page",
        Home: "Go home",
        ZoomIn: "Zoom in",
        ZoomOut: "Zoom out"
    },
    getString: function(prop) {
        var props = prop.split('.');
        var string = Sys.Extended.UI.Seadragon.Strings;

        // get property, which may contain dots, meaning subproperty
        for(var i = 0; i < props.length; i++)
            string = string[props[i]] || {};    // in case not a subproperty

        // in case the string didn't exist
        if(typeof (string) != "string")
            string = "";

        // regular expression and lambda technique from:
        // http://frogsbrain.wordpress.com/2007/04/28/javascript-stringformat-method/#comment-236
        var args = arguments;
        return string.replace(/\{\d+\}/g, function(capture) {
            var i = parseInt(capture.match(/\d+/)) + 1;
            return i < args.length ? args[i] : "";
        });
    },

    setString: function(prop, value) {
        var props = prop.split('.');
        var container = Seadragon.Strings;

        // get property's container, up to but not after last dot
        for(var i = 0; i < props.length - 1; i++)
            if(!container[props[i]])
                container[props[i]] = {};
        container = container[props[i]];

        container[props[i]] = value;
    }

};
Seadragon.Strings = Sys.Extended.UI.Seadragon.Strings;

// Constants

var QUOTA = 100;    // the max number of images we should keep in memory
var MIN_PIXEL_RATIO = 0.5;  // the most shrunk a tile should be

// Method of drawing

var browser = Seadragon.Utils.getBrowser();
var browserVer = Seadragon.Utils.getBrowserVersion();

// only Firefox and Opera implement <canvas> with subpixel rendering.
// update: safari 4 does too now! update: and chrome 2!
var subpixelRenders = browser == Seadragon.Browser.FIREFOX ||
            browser == Seadragon.Browser.OPERA ||
            (browser == Seadragon.Browser.SAFARI && browserVer >= 4) ||
            (browser == Seadragon.Browser.CHROME && browserVer >= 2);

// make sure browser supports <canvas>, and only use it if we know browser
// does subpixel rendering with <canvas> (that's the main advantage)
var useCanvas =
            typeof (document.createElement("canvas").getContext) == "function" &&
            subpixelRenders;
Sys.Extended.UI.Seadragon.Tile = function(level, x, y, bounds, exists, url) {
    // Core
    this.level = level;
    this.x = x;
    this.y = y;
    this.bounds = bounds;   // where this tile fits, in normalized coordinates
    this.exists = exists;   // part of sparse image? tile hasn't failed to load?
    this.loaded = false;    // is this tile loaded?
    this.loading = false;   // or is this tile loading?

    // Image
    this.elmt = null;       // the HTML element for this tile
    this.image = null;      // the Image object for this tile
    this.url = url;         // the URL of this tile's image

    // Drawing
    this.style = null;      // alias of this.elmt.style
    this.position = null;   // this tile's position on screen, in pixels
    this.size = null;       // this tile's size on screen, in pixels
    this.blendStart = null; // the start time of this tile's blending
    this.opacity = null;    // the current opacity this tile should be
    this.distance = null;   // the distance of this tile to the viewport center
    this.visibility = null; // the visibility score of this tile

    // Caching
    this.beingDrawn = false; // whether this tile is currently being drawn
    this.lastTouchTime = 0; // the time that tile was last touched
};
Sys.Extended.UI.Seadragon.Tile.prototype = {
    dispose: function() {
    },
    toString: function() {
        return this.level + "/" + this.x + "_" + this.y;
    },
    drawHTML: function(container) {
        if(!this.loaded) {
            Seadragon.Debug.error("Attempting to draw tile " + this.toString() +
                    " when it's not yet loaded.");
            return;
        }

        // initialize if first time
        if(!this.elmt) {
            this.elmt = Seadragon.Utils.makeNeutralElement("img");
            this.elmt.src = this.url;
            this.style = this.elmt.style;
            this.style.position = "absolute";
            this.style.msInterpolationMode = "nearest-neighbor";
            // IE only property. bicubic is ideal, but it causes seams.
            // explicitly use nearest-neighbor so it's not overridden to
            // bicubic on page zoom.
        }

        var elmt = this.elmt;
        var style = this.style;
        var position = this.position.apply(Math.floor);
        var size = this.size.apply(Math.ceil);

        // this was an alternate idea to hopefully make the rendering more
        // accurate, by prioritizing the edges of the image and not the size,
        // but it hasn't seemed to make any difference.
        //var topLeft = this.position;
        //var bottomRight = topLeft.plus(this.size);
        //var position = topLeft.apply(Math.floor);
        //var size = bottomRight.minus(topLeft).apply(Math.floor);

        if(elmt.parentNode != container)
            container.appendChild(elmt);

        style.left = position.x + "px";
        style.top = position.y + "px";
        style.width = size.x + "px";
        style.height = size.y + "px";

        Seadragon.Utils.setElementOpacity(elmt, this.opacity);
    },
    drawCanvas: function(context) {
        if(!this.loaded) {
            Seadragon.Debug.error("Attempting to draw tile " + this.toString() +
                    " when it's not yet loaded.");
            return;
        }

        var position = this.position;
        var size = this.size;

        context.globalAlpha = this.opacity;
        context.drawImage(this.image, position.x, position.y, size.x, size.y);
    },
    unload: function() {
        if(this.elmt && this.elmt.parentNode)
            this.elmt.parentNode.removeChild(this.elmt);

        this.elmt = null;
        this.image = null;
        this.loaded = false;
        this.loading = false;
    }
};
Sys.Extended.UI.Seadragon.Tile.registerClass('Sys.Extended.UI.Seadragon.Tile', null, Sys.IDisposable);

Sys.Extended.UI.Seadragon.Overlay = function(elmt, loc, placement) {
    // Core
    this.elmt = elmt;
    this.scales = (loc instanceof Sys.Extended.UI.Seadragon.Rect);
    this.bounds = new Sys.Extended.UI.Seadragon.Rect(loc.x, loc.y, loc.width, loc.height);
    // Drawing
    this.placement = loc instanceof Sys.Extended.UI.Seadragon.Point ? placement : Sys.Extended.UI.Seadragon.OverlayPlacement.TOP_LEFT;    // rects are always top-left
    this.position = new Sys.Extended.UI.Seadragon.Point(loc.x, loc.y);
    this.size = new Sys.Extended.UI.Seadragon.Point(loc.width, loc.height);
    this.style = elmt.style;
};
Sys.Extended.UI.Seadragon.Overlay.prototype = {

    adjust: function(position, size) {
        switch(this.placement) {
            case Sys.Extended.UI.Seadragon.OverlayPlacement.TOP_LEFT:
                break;
            case Sys.Extended.UI.Seadragon.OverlayPlacement.TOP:
                position.x -= size.x / 2;
                break;
            case Sys.Extended.UI.Seadragon.OverlayPlacement.TOP_RIGHT:
                position.x -= size.x;
                break;
            case Sys.Extended.UI.Seadragon.OverlayPlacement.RIGHT:
                position.x -= size.x;
                position.y -= size.y / 2;
                break;
            case Sys.Extended.UI.Seadragon.OverlayPlacement.BOTTOM_RIGHT:
                position.x -= size.x;
                position.y -= size.y;
                break;
            case Sys.Extended.UI.Seadragon.OverlayPlacement.BOTTOM:
                position.x -= size.x / 2;
                position.y -= size.y;
                break;
            case Sys.Extended.UI.Seadragon.OverlayPlacement.BOTTOM_LEFT:
                position.y -= size.y;
                break;
            case Sys.Extended.UI.Seadragon.OverlayPlacement.LEFT:
                position.y -= size.y / 2;
                break;
            case Sys.Extended.UI.Seadragon.OverlayPlacement.CENTER:
            default:
                position.x -= size.x / 2;
                position.y -= size.y / 2;
                break;
        }
    },
    destroy: function() {
        var elmt = this.elmt;
        var style = this.style;

        if(elmt.parentNode)
            elmt.parentNode.removeChild(elmt);

        style.top = "";
        style.left = "";
        style.position = "";

        if(this.scales) {
            style.width = "";
            style.height = "";
        }
    },
    drawHTML: function(container) {
        var elmt = this.elmt;
        var style = this.style;
        var scales = this.scales;

        if(elmt.parentNode != container)
            container.appendChild(elmt);

        // override calculated size if this element doesn't scale with image
        if(!scales)
            this.size = Seadragon.Utils.getElementSize(elmt);

        var position = this.position;
        var size = this.size;

        // adjust position based on placement (default is center)
        this.adjust(position, size);

        position = position.apply(Math.floor);
        size = size.apply(Math.ceil);

        style.left = position.x + "px";
        style.top = position.y + "px";
        style.position = "absolute";

        if(scales) {
            style.width = size.x + "px";
            style.height = size.y + "px";
        }
    },
    update: function(loc, placement) {
        this.scales = (loc instanceof Sys.Extended.UI.Seadragon.Rect);
        this.bounds = new Sys.Extended.UI.Seadragon.Rect(loc.x, loc.y, loc.width, loc.height);
        this.placement = loc instanceof Sys.Extended.UI.Seadragon.Point ?
            placement : Sys.Extended.UI.Seadragon.OverlayPlacement.TOP_LEFT;    // rects are always top-left
    }

};
Sys.Extended.UI.Seadragon.Overlay.registerClass('Sys.Extended.UI.Seadragon.Overlay', null, Sys.IDisposable);

Sys.Extended.UI.Seadragon.Drawer = function(source, viewport, elmt) {
    this._container = Seadragon.Utils.getElement(elmt);
    this._canvas = Seadragon.Utils.makeNeutralElement(useCanvas ? "canvas" : "div");
    this._context = useCanvas ? this._canvas.getContext("2d") : null;
    this._viewport = viewport;
    this._source = source;
    this.config = this._viewport.config;

    this._imageLoader = new Sys.Extended.UI.Seadragon.ImageLoader(this.config.imageLoaderLimit);
    this._profiler = new Sys.Extended.UI.Seadragon.Profiler();

    this._minLevel = source.minLevel;
    this._maxLevel = source.maxLevel;
    this._tileSize = source.tileSize;
    this._tileOverlap = source.tileOverlap;
    this._normHeight = source.dimensions.y / source.dimensions.x;

    this._cacheNumTiles = {};     // 1d dictionary [level] --> Point
    this._cachePixelRatios = {};  // 1d dictionary [level] --> Point
    this._tilesMatrix = {};       // 3d dictionary [level][x][y] --> Tile
    this._tilesLoaded = [];       // unordered list of Tiles with loaded images
    this._coverage = {};          // 3d dictionary [level][x][y] --> Boolean

    this._overlays = [];          // unordered list of Overlays added
    this._lastDrawn = [];         // unordered list of Tiles drawn last frame
    this._lastResetTime = 0;
    this._midUpdate = false;
    this._updateAgain = true;

    // Properties
    this.elmt = this._container;

    // Constructor
    this._init();
};
Sys.Extended.UI.Seadragon.Drawer.prototype = {
    dispose: function() {
    },
    _init: function() {
        this._canvas.style.width = "100%";
        this._canvas.style.height = "100%";
        this._canvas.style.position = "absolute";
        this._container.style.textAlign = "left";    // explicit left-align
        this._container.appendChild(this._canvas);
    },
    _compareTiles: function(prevBest, tile) {
        // figure out if this tile is better than the previous best tile...
        // note that if there is no prevBest, this is automatically better.
        if(!prevBest)
            return tile;

        if(tile.visibility > prevBest.visibility)
            return tile;
        else if(tile.visibility == prevBest.visibility)
            if(tile.distance < prevBest.distance)
                return tile;

        return prevBest;
    },
    _getNumTiles: function(level) {
        if(!this._cacheNumTiles[level])
            this._cacheNumTiles[level] = this._source.getNumTiles(level);

        return this._cacheNumTiles[level];
    },

    _getPixelRatio: function(level) {
        if(!this._cachePixelRatios[level])
            this._cachePixelRatios[level] = this._source.getPixelRatio(level);

        return this._cachePixelRatios[level];
    },

    // Helpers -- TILES

    _getTile: function(level, x, y, time, numTilesX, numTilesY) {
        if(!this._tilesMatrix[level])
            this._tilesMatrix[level] = {};

        if(!this._tilesMatrix[level][x])
            this._tilesMatrix[level][x] = {};

        // initialize tile object if first time
        if(!this._tilesMatrix[level][x][y]) {
            // where applicable, adjust x and y to support wrapping.
            var xMod = (numTilesX + (x % numTilesX)) % numTilesX;
            var yMod = (numTilesY + (y % numTilesY)) % numTilesY;
            var bounds = this._source.getTileBounds(level, xMod, yMod);
            var exists = this._source.tileExists(level, xMod, yMod);
            var url = this._source.getTileUrl(level, xMod, yMod);

            // also adjust bounds to support wrapping.
            bounds.x += 1.0 * (x - xMod) / numTilesX;
            bounds.y += this._normHeight * (y - yMod) / numTilesY;

            this._tilesMatrix[level][x][y] = new Sys.Extended.UI.Seadragon.Tile(level, x, y, bounds, exists, url);
        }

        var tile = this._tilesMatrix[level][x][y];

        // mark tile as touched so we don't reset it too soon
        tile.lastTouchTime = time;

        return tile;
    },

    _loadTile: function(tile, time) {
        tile.loading = this._imageLoader.loadImage(tile.url,
                    Seadragon.Utils.createCallback(null, Function.createDelegate(this, this._onTileLoad), tile, time));
    },

    _onTileLoad: function(tile, time, image) {
        tile.loading = false;

        if(this._midUpdate) {
            Seadragon.Debug.error("Tile load callback in middle of drawing routine.");
            return;
        } else if(!image) {
            Seadragon.Debug.log("Tile " + tile + " failed to load: " + tile.url);
            tile.exists = false;
            return;
        } else if(time < this._lastResetTime) {
            Seadragon.Debug.log("Ignoring tile " + tile + " loaded before reset: " + tile.url);
            return;
        }

        tile.loaded = true;
        tile.image = image;

        var insertionIndex = this._tilesLoaded.length;

        if(this._tilesLoaded.length >= QUOTA) {
            var cutoff = Math.ceil(Math.log(this._tileSize) / Math.log(2));
            // don't delete any single-tile levels. this takes priority.

            var worstTile = null;
            var worstTileIndex = -1;

            for(var i = this._tilesLoaded.length - 1; i >= 0; i--) {
                var prevTile = this._tilesLoaded[i];

                if(prevTile.level <= this._cutoff || prevTile.beingDrawn) {
                    continue;
                } else if(!worstTile) {
                    worstTile = prevTile;
                    worstTileIndex = i;
                    continue;
                }

                var prevTime = prevTile.lastTouchTime;
                var worstTime = worstTile.lastTouchTime;
                var prevLevel = prevTile.level;
                var worstLevel = worstTile.level;

                if(prevTime < worstTime ||
                            (prevTime == worstTime && prevLevel > worstLevel)) {
                    worstTile = prevTile;
                    worstTileIndex = i;
                }
            }

            if(worstTile && worstTileIndex >= 0) {
                worstTile.unload();
                insertionIndex = worstTileIndex;
                // note: we don't want or need to delete the actual Tile
                // object from tilesMatrix; that's negligible memory.
            }
        }

        this._tilesLoaded[insertionIndex] = tile;
        this._updateAgain = true;
    },

    _clearTiles: function() {
        this._tilesMatrix = {};
        this._tilesLoaded = [];
    },

    // Helpers -- COVERAGE

    // Coverage scheme: it's required that in the draw routine, coverage for
    // every tile within the viewport is initially explicitly set to false.
    // This way, if a given level's coverage has been initialized, and a tile
    // isn't found, it means it's offscreen and thus provides coverage (since
    // there's no content needed to be covered). And if every tile that is found
    // does provide coverage, the entire visible level provides coverage.

    // Returns true if the given tile provides coverage to lower-level tiles of
    // lower resolution representing the same content. If neither x nor y is
    // given, returns true if the entire visible level provides coverage.
    // 
    // Note that out-of-bounds tiles provide coverage in this sense, since
    // there's no content that they would need to cover. Tiles at non-existent
    // levels that are within the image bounds, however, do not.
    _providesCoverage: function(level, x, y) {
        if(!this._coverage[level])
            return false;

        if(x === undefined || y === undefined) {
            // check that every visible tile provides coverage.
            // update: protecting against properties added to the Object
            // class's prototype, which can definitely (and does) happen.
            var rows = this._coverage[level];
            for(var i in rows)
                if(rows.hasOwnProperty(i)) {
                    var cols = rows[i];
                    for(var j in cols)
                        if(cols.hasOwnProperty(j) && !cols[j])
                            return false;
                }

            return true;
        }

        return (this._coverage[level][x] === undefined ||
                    this._coverage[level][x][y] === undefined ||
                    this._coverage[level][x][y] === true);
    },

    // Returns true if the given tile is completely covered by higher-level
    // tiles of higher resolution representing the same content. If neither x
    // nor y is given, returns true if the entire visible level is covered.
    _isCovered: function(level, x, y) {
        if(x === undefined || y === undefined)
            return this._providesCoverage(level + 1);
        else
            return (this._providesCoverage(level + 1, 2 * x, 2 * y) &&
                        this._providesCoverage(level + 1, 2 * x, 2 * y + 1) &&
                        this._providesCoverage(level + 1, 2 * x + 1, 2 * y) &&
                        this._providesCoverage(level + 1, 2 * x + 1, 2 * y + 1));
    },

    // Sets whether the given tile provides coverage or not.
    _setCoverage: function(level, x, y, covers) {
        if(!this._coverage[level]) {
            Seadragon.Debug.error("Setting coverage for a tile before its " +
                        "level's coverage has been reset: " + level);
            return;
        }

        if(!this._coverage[level][x])
            this._coverage[level][x] = {};

        this._coverage[level][x][y] = covers;
    },

    // Resets coverage information for the given level. This should be called
    // after every draw routine. Note that at the beginning of the next draw
    // routine, coverage for every visible tile should be explicitly set. 
    _resetCoverage: function(level) {
        this._coverage[level] = {};
    },

    // Helpers -- SCORING

    _compareTiles: function(prevBest, tile) {
        // figure out if this tile is better than the previous best tile...
        // note that if there is no prevBest, this is automatically better.
        if(!prevBest)
            return tile;

        if(tile.visibility > prevBest.visibility)
            return tile;
        else if(tile.visibility == prevBest.visibility)
            if(tile.distance < prevBest.distance)
                return tile;

        return prevBest;
    },

    // Helpers -- OVERLAYS

    _getOverlayIndex: function(elmt) {
        for(var i = this._overlays.length - 1; i >= 0; i--)
            if(this._overlays[i].elmt == elmt)
                return i;

        return -1;
    },

    // Helpers -- CORE

    _updateActual: function() {
        // assume we won't need to update again after this update.
        // we'll set this if we find a reason to update again.
        this._updateAgain = false;

        // make local references to variables & functions referenced in
        // loops in order to improve perf
        var _canvas = this._canvas,
            _context = this._context,
            _container = this._container,
            _useCanvas = useCanvas,
            _lastDrawn = this._lastDrawn;

        // the tiles that were drawn last frame, but won't be this frame,
        // can be cleared from the cache, so they should be marked as such.
        while(_lastDrawn.length > 0) {
            var tile = _lastDrawn.pop();
            tile.beingDrawn = false;
        }

        // we need the size of the viewport (in pixels) in multiple places
        var viewportSize = this._viewport.getContainerSize(),
            viewportWidth = viewportSize.x,
            viewportHeight = viewportSize.y;

        // clear canvas, whether in <canvas> mode or HTML mode.
        // this is important as scene may be empty this frame.
        _canvas.innerHTML = "";
        if(_useCanvas) {
            _canvas.width = viewportWidth;
            _canvas.height = viewportHeight;
            _context.clearRect(0, 0, viewportWidth, viewportHeight);
            // this last line shouldn't be needed. setting the width and
            // height should clear <canvas>, but Firefox doesn't always.
        }

        // if viewport is off image entirely, don't bother drawing.
        // UPDATE: logic modified to support horizontal/vertical wrapping.
        var viewportBounds = this._viewport.getBounds(true),
            viewportTL = viewportBounds.getTopLeft(),
            viewportBR = viewportBounds.getBottomRight();
        if(!this.config.wrapHorizontal && (viewportBR.x < 0 || viewportTL.x > 1))
            // we're not wrapping horizontally, and viewport is off in x
            return;
        else if(!this.config.wrapVertical && (viewportBR.y < 0 || viewportTL.y > this._normHeight))
            // we're not wrapping vertically, and viewport is off in y
            return;

        // the below section is commented out because it's more relevant to
        // collections, where you don't want 10 items to all load their xml
        // at the same time when 9 of them won't be in the viewport soon.

        // same for Math functions
        var _abs = Math.abs,
            _ceil = Math.ceil,
            _floor = Math.floor,
            _log = Math.log,
            _max = Math.max,
            _min = Math.min;

        var alwaysBlend = this.config.alwaysBlend,
            blendTimeMillis = 1000 * this.config.blendTime,
            immediateRender = this.config.immediateRender,
            minDimension = this.config.minZoomDimension,   // for backwards compatibility
            minImageRatio = this.config.minImageRatio,
            wrapHorizontal = this.config.wrapHorizontal,
            wrapVertical = this.config.wrapVertical;

        // restrain bounds of viewport relative to image.
        // UPDATE: logic modified to support horizontal/vertical wrapping.
        if(!wrapHorizontal) {
            viewportTL.x = _max(viewportTL.x, 0);
            viewportBR.x = _min(viewportBR.x, 1);
        }
        if(!wrapVertical) {
            viewportTL.y = _max(viewportTL.y, 0);
            viewportBR.y = _min(viewportBR.y, this._normHeight);
        }

        var best = null,
            haveDrawn = false,
            currentTime = new Date().getTime();

        // calculate values for scoring -- this is based on TARGET values
        var viewportCenter = this._viewport.pixelFromPoint(this._viewport.getCenter()),
            zeroRatioT = this._viewport.deltaPixelsFromPoints(this._source.getPixelRatio(0), false).x,
            optimalPixelRatio = immediateRender ? 1 : zeroRatioT;

        // adjust levels to iterate over -- this is based on CURRENT values
        // TODO change this logic to use minImageRatio, but for backwards
        // compatibility, use minDimension if it's been explicitly set.
        // TEMP for now, original minDimension logic with default 64.
        minDimension = minDimension || 64;
        var lowestLevel = _max(this._minLevel, _floor(_log(minDimension) / _log(2))),
            zeroRatioC = this._viewport.deltaPixelsFromPoints(this._source.getPixelRatio(0), true).x,
            highestLevel = _min(this._maxLevel, _floor(_log(zeroRatioC / MIN_PIXEL_RATIO) / _log(2)));

        // with very small images, this edge case can occur...
        lowestLevel = _min(lowestLevel, highestLevel);

        for(var level = highestLevel; level >= lowestLevel; level--) {
            var drawLevel = false;
            var renderPixelRatioC = this._viewport.deltaPixelsFromPoints(this._source.getPixelRatio(level), true).x; // note the .x!

            // if we haven't drawn yet, only draw level if tiles are big enough
            if((!haveDrawn && renderPixelRatioC >= MIN_PIXEL_RATIO) || level == lowestLevel) {
                drawLevel = true;
                haveDrawn = true;
            } else if(!haveDrawn) {
                continue;
            }

            this._resetCoverage(level);

            // calculate scores applicable to all tiles on this level --
            // note that we're basing visibility on the TARGET pixel ratio
            var levelOpacity = _min(1, (renderPixelRatioC - 0.5) / 0.5),
                renderPixelRatioT = this._viewport.deltaPixelsFromPoints(this._source.getPixelRatio(level), false).x,
                levelVisibility = optimalPixelRatio / _abs(optimalPixelRatio - renderPixelRatioT);

            // only iterate over visible tiles
            var tileTL = this._source.getTileAtPoint(level, viewportTL),
                tileBR = this._source.getTileAtPoint(level, viewportBR),
                numTiles = this._getNumTiles(level),
                numTilesX = numTiles.x,
                numTilesY = numTiles.y;

            if(!wrapHorizontal)
                tileBR.x = _min(tileBR.x, numTilesX - 1);
            if(!wrapVertical)
                tileBR.y = _min(tileBR.y, numTilesY - 1);

            for(var x = tileTL.x; x <= tileBR.x; x++) {
                for(var y = tileTL.y; y <= tileBR.y; y++) {
                    var tile = this._getTile(level, x, y, currentTime, numTilesX, numTilesY);
                    var drawTile = drawLevel;

                    // assume this tile doesn't cover initially
                    this._setCoverage(level, x, y, false);

                    if(!tile.exists)
                        // not part of sparse image, or failed to load
                        continue;

                    // if we've drawn a higher-resolution level and we're not
                    // going to draw this level, then say this tile does cover
                    // if it's covered by higher-resolution tiles. if we're not
                    // covered, then we should draw this tile regardless.
                    if(haveDrawn && !drawTile)
                        if(this._isCovered(level, x, y))
                            this._setCoverage(level, x, y, true);
                        else
                            drawTile = true;

                    if(!drawTile)
                        continue;

                    // calculate tile's position and size in pixels
                    var boundsTL = tile.bounds.getTopLeft(),
                        boundsSize = tile.bounds.getSize(),
                        positionC = this._viewport.pixelFromPoint(boundsTL, true),
                        sizeC = this._viewport.deltaPixelsFromPoints(boundsSize, true);

                    // if there is no tile overlap, we need to oversize the
                    // tiles by 1px to prevent seams at imperfect zooms.
                    // fortunately, this is not an issue with regular dzi's
                    // created from Deep Zoom Composer, which uses overlap.
                    if(!this._tileOverlap)
                        sizeC = sizeC.plus(new Sys.Extended.UI.Seadragon.Point(1, 1));

                    // calculate distance from center of viewport -- note
                    // that this is based on tile's TARGET position
                    var positionT = this._viewport.pixelFromPoint(boundsTL, false),
                        sizeT = this._viewport.deltaPixelsFromPoints(boundsSize, false),
                        tileCenter = positionT.plus(sizeT.divide(2)),
                        tileDistance = viewportCenter.distanceTo(tileCenter);

                    // update tile's scores and values
                    tile.position = positionC;
                    tile.size = sizeC;
                    tile.distance = tileDistance;
                    tile.visibility = levelVisibility;

                    if(tile.loaded) {
                        if(!tile.blendStart)
                            // image was just added, blend it
                            tile.blendStart = currentTime;

                        var deltaTime = currentTime - tile.blendStart;
                        var opacity = _min(1, deltaTime / blendTimeMillis);

                        if(alwaysBlend)
                            opacity *= levelOpacity;

                        tile.opacity = opacity;

                        // queue tile for drawing in reverse order
                        _lastDrawn.push(tile);

                        // if fully blended in, this tile now provides coverage,
                        // otherwise we need to update again to keep blending
                        if(opacity == 1)
                            this._setCoverage(level, x, y, true);
                        else if(deltaTime < blendTimeMillis)
                            updateAgain = true;
                    } else if(tile.Loading) {
                        // nothing to see here, move on
                    } else {
                        // means tile isn't loaded yet, so score it
                        best = this._compareTiles(best, tile);
                    }
                }
            }

            // we may not need to draw any more lower-res levels
            if(this._providesCoverage(level))
                break;
        }

        // now draw the tiles, but in reverse order since we want higher-res
        // tiles to be drawn on top of lower-res ones. also mark each tile
        // as being drawn so it won't get cleared from the cache.
        for(var i = _lastDrawn.length - 1; i >= 0; i--) {
            var tile = _lastDrawn[i];

            if(_useCanvas)
                tile.drawCanvas(_context);
            else
                tile.drawHTML(_canvas);

            tile.beingDrawn = true;
        }

        // draw the overlays -- TODO optimize based on viewport like tiles,
        // but this is tricky for non-scaling overlays like pins...
        var numOverlays = this._overlays.length;
        for(var i = 0; i < numOverlays; i++) {
            var overlay = this._overlays[i],
                bounds = overlay.bounds;

            overlay.position = this._viewport.pixelFromPoint(bounds.getTopLeft(), true);
            overlay.size = this._viewport.deltaPixelsFromPoints(bounds.getSize(), true);
            overlay.drawHTML(_container);
        }

        // load next tile if there is one to load
        if(best) {
            this._loadTile(best, currentTime);
            this._updateAgain = true; // because we haven't finished drawing, so
            // we should be re-evaluating and re-scoring
        }
    },

    // Methods -- OVERLAYS

    addOverlay: function(elmt, loc, placement) {
        var elmt = Seadragon.Utils.getElement(elmt);

        if(this._getOverlayIndex(elmt) >= 0)
            return;     // they're trying to add a duplicate overlay

        this._overlays.push(new Sys.Extended.UI.Seadragon.Overlay(elmt, loc, placement));
        this._updateAgain = true;
    },

    updateOverlay: function(elmt, loc, placement) {
        var elmt = Seadragon.Utils.getElement(elmt),
            i = this._getOverlayIndex(elmt);

        if(i >= 0) {
            this._overlays[i].update(loc, placement);
            this._updateAgain = true;
        }
    },

    removeOverlay: function(elmt) {
        var elmt = Seadragon.Utils.getElement(elmt),
            i = this._getOverlayIndex(elmt);

        if(i >= 0) {
            this._overlays[i].destroy();
            this._overlays.splice(i, 1);
            this._updateAgain = true;
        }
    },

    clearOverlays: function() {
        while(this._overlays.length > 0) {
            this._overlays.pop().destroy();
            this._updateAgain = true;
        }
    },

    // Methods -- CORE

    needsUpdate: function() {
        return this._updateAgain;
    },

    numTilesLoaded: function() {
        return this._tilesLoaded.length;
    },

    reset: function() {
        this._clearTiles();
        this._lastResetTime = new Date().getTime();
        this._updateAgain = true;
    },

    update: function() {
        this._profiler.beginUpdate();
        this._midUpdate = true;
        this._updateActual();
        this._midUpdate = false;
        this._profiler.endUpdate();
    },

    idle: function() {
        // TODO idling function
    }
};
Sys.Extended.UI.Seadragon.Drawer.registerClass('Sys.Extended.UI.Seadragon.Drawer', null, Sys.IDisposable);

Sys.Extended.UI.Seadragon.TileSource = function(width, height, tileSize, tileOverlap, minLevel, maxLevel) {
    this.aspectRatio = width / height;
    this.dimensions = new Sys.Extended.UI.Seadragon.Point(width, height);
    this.minLevel = minLevel ? minLevel : 0;
    this.maxLevel = maxLevel ? maxLevel : Math.ceil(Math.log(Math.max(width, height)) / Math.log(2));
    this.tileSize = tileSize ? tileSize : 0;
    this.tileOverlap = tileOverlap ? tileOverlap : 0;
};
Sys.Extended.UI.Seadragon.TileSource.prototype = {
    getLevelScale: function(level) {
        // equivalent to Math.pow(0.5, numLevels - level);
        return 1 / (1 << (this.maxLevel - level));
    },

    getNumTiles: function(level) {
        var scale = this.getLevelScale(level),
            x = Math.ceil(scale * this.dimensions.x / this.tileSize),
            y = Math.ceil(scale * this.dimensions.y / this.tileSize);

        return new Sys.Extended.UI.Seadragon.Point(x, y);
    },

    getPixelRatio: function(level) {
        var imageSizeScaled = this.dimensions.times(this.getLevelScale(level)),
            rx = 1.0 / imageSizeScaled.x,
            ry = 1.0 / imageSizeScaled.y;

        return new Sys.Extended.UI.Seadragon.Point(rx, ry);
    },

    getTileAtPoint: function(level, point) {
        var pixel = point.times(this.dimensions.x).times(this.getLevelScale(level));

        var tx = Math.floor(pixel.x / this.tileSize),
            ty = Math.floor(pixel.y / this.tileSize);

        return new Sys.Extended.UI.Seadragon.Point(tx, ty);
    },

    getTileBounds: function(level, x, y) {
        // work in scaled pixels for this level
        var dimensionsScaled = this.dimensions.times(this.getLevelScale(level));

        // find position, adjust for no overlap data on top and left edges
        var px = (x === 0) ? 0 : this.tileSize * x - this.tileOverlap,
            py = (y === 0) ? 0 : this.tileSize * y - this.tileOverlap;

        // find size, adjust for no overlap data on top and left edges
        var sx = this.tileSize + (x === 0 ? 1 : 2) * this.tileOverlap,
            sy = this.tileSize + (y === 0 ? 1 : 2) * this.tileOverlap;

        // adjust size for single-tile levels where the image size is smaller
        // than the regular tile size, and for tiles on the bottom and right
        // edges that would exceed the image bounds
        sx = Math.min(sx, dimensionsScaled.x - px);
        sy = Math.min(sy, dimensionsScaled.y - py);

        // finally, normalize...
        // note that isotropic coordinates ==> only dividing by scaled x!
        var scale = 1.0 / dimensionsScaled.x;

        return new Sys.Extended.UI.Seadragon.Rect(px * scale, py * scale, sx * scale, sy * scale);
    },

    getTileUrl: function(level, x, y) {
        throw new Error("Method not implemented.");
    },

    tileExists: function(level, x, y) {
        var numTiles = this.getNumTiles(level);
        return level >= this.minLevel && level <= this.maxLevel &&
                x >= 0 && y >= 0 && x < numTiles.x && y < numTiles.y;
    }
};
Sys.Extended.UI.Seadragon.TileSource.registerClass('Sys.Extended.UI.Seadragon.TileSource', null, Sys.IDisposable);

Sys.Extended.UI.Seadragon.DziError = function(message) {
    Sys.Extended.UI.Seadragon.DziError.initializeBase(this, [message]);
    this.message = message;
};
Sys.Extended.UI.Seadragon.DziError.registerClass('Sys.Extended.UI.Seadragon.DziError', Error);

Sys.Extended.UI.Seadragon.DziTileSource = function(width, height, tileSize, tileOverlap, tilesUrl, fileFormat, displayRects) {
    Sys.Extended.UI.Seadragon.DziTileSource.initializeBase(this, [width, height, tileSize, tileOverlap, null, null]);
    this._levelRects = {};
    this.tilesUrl = tilesUrl;

    this.fileFormat = fileFormat;
    this.displayRects = displayRects;
    this._init();
};
Sys.Extended.UI.Seadragon.DziTileSource.prototype = {
    _init: function() {
        if(!this.displayRects)
            return;

        for(var i = this.displayRects.length - 1; i >= 0; i--) {
            var rect = this.displayRects[i];
            for(var level = rect.minLevel; level <= rect.maxLevel; level++) {
                if(!this._levelRects[level])
                    this._levelRects[level] = [];
                this._levelRects[level].push(rect);
            }
        }
    },
    getTileUrl: function(level, x, y) {
        // using array join because it's faster than string concatenation
        return [this.tilesUrl, level, '/', x, '_', y, '.', this.fileFormat].join('');
    },

    tileExists: function(level, x, y) {
        var rects = this._levelRects[level];

        if(!rects || !rects.length)
            return true;

        for(var i = rects.length - 1; i >= 0; i--) {
            var rect = rects[i];

            // check level
            if(level < rect.minLevel || level > rect.maxLevel)
                continue;

            // transform rectangle coordinates to this level
            var scale = this.getLevelScale(level),
                xMin = rect.x * scale,
                yMin = rect.y * scale,
                xMax = xMin + rect.width * scale,
                yMax = yMin + rect.height * scale;

            // convert to rows and columns -- note that we're ignoring tile
            // overlap, but it's a reasonable approximation. it errs on the side
            // of false positives, which is much better than false negatives.
            xMin = Math.floor(xMin / this.tileSize);
            yMin = Math.floor(yMin / this.tileSize);
            xMax = Math.ceil(xMax / this.tileSize);
            yMax = Math.ceil(yMax / this.tileSize);

            if(xMin <= x && x < xMax && yMin <= y && y < yMax)
                return true;
        }

        return false;
    }
};
Sys.Extended.UI.Seadragon.DziTileSource.registerClass('Sys.Extended.UI.Seadragon.DziTileSource', Sys.Extended.UI.Seadragon.TileSource);
Sys.Extended.UI.Seadragon._DziTileSourceHelper = function() {

};
Sys.Extended.UI.Seadragon._DziTileSourceHelper.prototype = {
    createFromXml: function(xmlUrl, xmlString, callback) {
        var async = typeof (callback) == "function",
            error = null;

        if(!xmlUrl) {
            this.error = Seadragon.Strings.getString("Errors.Empty");
            if(async) {
                window.setTimeout(function() {
                    callback(null, error);
                }, 1);
                return null;
            }
            throw new Sys.Extended.UI.Seadragon.DziError(error);
        }

        // extract tile url
        var urlParts = xmlUrl.split('/'),
            filename = urlParts[urlParts.length - 1],
            lastDot = filename.lastIndexOf('.');

        if(lastDot > -1)
            urlParts[urlParts.length - 1] = filename.slice(0, lastDot);

        var tilesUrl = urlParts.join('/') + "_files/";
        function finish(func, obj) {
            try {
                return func(obj, tilesUrl);
            } catch(e) {
                if(async) {
                    error = this.getError(e).message;
                    return null;
                } else {
                    throw this.getError(e);
                }
            }
        }

        if(async) {
            if(xmlString) {
                var handler = Function.createDelegate(this, this.processResponse);
                window.setTimeout(function() {
                    var source = finish(handler, Seadragon.Utils.parseXml(xmlString));
                    callback(source, error);    // call after finish sets error
                }, 1);
            } else {
                var handler = Function.createDelegate(this, this.processResponse);
                Seadragon.Utils.makeAjaxRequest(xmlUrl, function(xhr) {
                    var source = finish(handler, xhr);
                    callback(source, error);    // call after finish sets error
                });
            }

            return null;
        }

        // synchronous version
        if(xmlString)
            return finish(Function.createDelegate(this, this.processXml), Seadragon.Utils.parseXml(xmlString));
        else
            return finish(Function.createDelegate(this, this.processResponse), Seadragon.Utils.makeAjaxRequest(xmlUrl));
    },
    processResponse: function(xhr, tilesUrl) {
        if(!xhr) {
            throw new Sys.Extended.UI.Seadragon.DziError(Seadragon.Strings.getString("Errors.Security"));
        } else if(xhr.status !== 200 && xhr.status !== 0) {
            // chrome has bug where it sends "OK" for 404
            var status = xhr.status;
            var statusText = (status == 404) ? "Not Found" : xhr.statusText;
            throw new Sys.Extended.UI.Seadragon.DziError(Seadragon.Strings.getString("Errors.Status", status, statusText));
        }

        var doc = null;

        if(xhr.responseXML && xhr.responseXML.documentElement)
            doc = xhr.responseXML;
        else if(xhr.responseText)
            doc = Seadragon.Utils.parseXml(xhr.responseText);

        return this.processXml(doc, tilesUrl);
    },

    processXml: function(xmlDoc, tilesUrl) {
        if(!xmlDoc || !xmlDoc.documentElement)
            throw new Sys.Extended.UI.Seadragon.DziError(Seadragon.Strings.getString("Errors.Xml"));

        var root = xmlDoc.documentElement,
            rootName = root.tagName;

        if(rootName == "Image")
            try {
                return this.processDzi(root, tilesUrl);
            } catch(e) {
                var defMsg = Seadragon.Strings.getString("Errors.Dzi");
                throw (e instanceof Sys.Extended.UI.Seadragon.DziError) ? e : new Sys.Extended.UI.Seadragon.DziError(defMsg);
            }
        else if(rootName == "Collection")
            throw new Sys.Extended.UI.Seadragon.DziError(Seadragon.Strings.getString("Errors.Dzc"));
        else if(rootName == "Error")
            return this.processError(root);

        throw new Sys.Extended.UI.Seadragon.DziError(Seadragon.Strings.getString("Errors.Dzi"));
    },

    processDzi: function(imageNode, tilesUrl) {
        var fileFormat = imageNode.getAttribute("Format");

        if(!Seadragon.Utils.imageFormatSupported(fileFormat))
            throw new Sys.Extended.UI.Seadragon.DziError(Seadragon.Strings.getString("Errors.ImageFormat", fileFormat.toUpperCase()));

        var sizeNode = imageNode.getElementsByTagName("Size")[0],
            dispRectNodes = imageNode.getElementsByTagName("DisplayRect");

        var width = parseInt(sizeNode.getAttribute("Width"), 10),
            height = parseInt(sizeNode.getAttribute("Height"), 10),
            tileSize = parseInt(imageNode.getAttribute("TileSize")),
            tileOverlap = parseInt(imageNode.getAttribute("Overlap")),
            dispRects = [];

        for(var i = 0; i < dispRectNodes.length; i++) {
            var dispRectNode = dispRectNodes[i],
                rectNode = dispRectNode.getElementsByTagName("Rect")[0];

            dispRects.push(new Seadragon.DisplayRect(
                parseInt(rectNode.getAttribute("X"), 10),
                parseInt(rectNode.getAttribute("Y"), 10),
                parseInt(rectNode.getAttribute("Width"), 10),
                parseInt(rectNode.getAttribute("Height"), 10),
                0,  // ignore MinLevel attribute, bug in Deep Zoom Composer
                parseInt(dispRectNode.getAttribute("MaxLevel"), 10)
            ));
        }
        return new Sys.Extended.UI.Seadragon.DziTileSource(width, height, tileSize, tileOverlap,
                tilesUrl, fileFormat, dispRects);
    },

    processError: function(errorNode) {
        var messageNode = errorNode.getElementsByTagName("Message")[0],
            message = messageNode.firstChild.nodeValue;

        throw new Sys.Extended.UI.Seadragon.DziError(message);
    },
    getError: function(e) {
        if(!(e instanceof DziError)) {
            // shouldn't happen, but if it does, fail fast or at least log it
            Seadragon.Debug.error(e.name + " while creating DZI from XML: " + e.message);
            e = new Sys.Extended.UI.Seadragon.DziError(Seadragon.Strings.getString("Errors.Unknown"));
        }

    }
};
//Static objects
Sys.Extended.UI.Seadragon.DziTileSourceHelper = new Sys.Extended.UI.Seadragon._DziTileSourceHelper();

Sys.Extended.UI.Seadragon.Rect = function(x, y, width, height) {
    // Properties
    this.x = typeof (x) == "number" ? x : 0;
    this.y = typeof (y) == "number" ? y : 0;
    this.width = typeof (width) == "number" ? width : 0;
    this.height = typeof (height) == "number" ? height : 0;
};
Sys.Extended.UI.Seadragon.Rect.prototype = {
    getAspectRatio: function() {
        return this.width / this.height;
    },

    getTopLeft: function() {
        return new Sys.Extended.UI.Seadragon.Point(this.x, this.y);
    },

    getBottomRight: function() {
        return new Sys.Extended.UI.Seadragon.Point(this.x + this.width, this.y + this.height);
    },

    getCenter: function() {
        return new Sys.Extended.UI.Seadragon.Point(this.x + this.width / 2.0, this.y + this.height / 2.0);
    },

    getSize: function() {
        return new Sys.Extended.UI.Seadragon.Point(this.width, this.height);
    },

    equals: function(other) {
        return (other instanceof Seadragon.Rect) &&
                (this.x === other.x) && (this.y === other.y) &&
                (this.width === other.width) && (this.height === other.height);
    },

    toString: function() {
        return "[" + this.x + "," + this.y + "," + this.width + "x" + this.height + "]";
    }
};
Sys.Extended.UI.Seadragon.Rect.registerClass('Sys.Extended.UI.Seadragon.Rect', null, Sys.IDisposable);

Sys.Extended.UI.Seadragon.Job = function(src, callback) {
    this._image = null;
    this._timeout = null;
    this._src = src;
    this._callback = callback;
    this.TIMEOUT = 5000;
};
Sys.Extended.UI.Seadragon.Job.prototype = {
    _finish: function(success) {
        this._image.onload = null;
        this._image.onabort = null;
        this._image.onerror = null;

        if(this._timeout)
            window.clearTimeout(this._timeout);

        // call on a timeout to ensure asynchronous behavior
        var image = this._image,
            callback = this._callback;

        window.setTimeout(function() {
            callback(this._src, success ? image : null);
        }, 1);
    },
    _onloadHandler: function() {
        this._finish(true);
    },
    _onerrorHandler: function() {
        this._finish(false);
    },
    start: function() {
        this._image = new Image();
        this._image.onload = Function.createDelegate(this, this._onloadHandler);
        this._image.onabort = Function.createDelegate(this, this._onerrorHandler);
        this._image.onerror = Function.createDelegate(this, this._onerrorHandler);

        // consider it a failure if the image times out.
        this._timeout = window.setTimeout(Function.createDelegate(this, this._onerrorHandler), this.TIMEOUT);

        this._image.src = this._src;
    }
};
Sys.Extended.UI.Seadragon.Job.registerClass('Sys.Extended.UI.Seadragon.Job', null, Sys.IDisposable);

Sys.Extended.UI.Seadragon.ImageLoader = function(imageLoaderLimit) {
    this._downloading = 0;
    this.imageLoaderLimit = imageLoaderLimit;
};
Sys.Extended.UI.Seadragon.ImageLoader.prototype = {
    _onComplete: function(callback, src, image) {
        this._downloading--;
        if(typeof (callback) == "function")
            try {
                callback(image);
            } catch(e) {
                Seadragon.Debug.error(e.name + " while executing " + src + " callback: " + e.message, e);
            }
    },
    loadImage: function(src, callback) {
        if(this._downloading >= this.imageLoaderLimit)
            return false;

        var func = Seadragon.Utils.createCallback(null, Function.createDelegate(this, this._onComplete), callback),
            job = new Sys.Extended.UI.Seadragon.Job(src, func);

        this._downloading++;
        job.start();

        return true;
    }
};
Sys.Extended.UI.Seadragon.ImageLoader.registerClass('Sys.Extended.UI.Seadragon.ImageLoader', null, Sys.IDisposable);

Sys.Extended.UI.Seadragon.Profiler = function() {
    this._midUpdate = false;
    this._numUpdates = 0;

    this._lastBeginTime = null;
    this._lastEndTime = null;

    this._minUpdateTime = Infinity;
    this._avgUpdateTime = 0;
    this._maxUpdateTime = 0;

    this._minIdleTime = Infinity;
    this._avgIdleTime = 0;
    this._maxIdleTime = 0;
};
Sys.Extended.UI.Seadragon.Profiler.prototype = {
    // Methods -- UPDATE TIME ACCESSORS

    getAvgUpdateTime: function() {
        return this._avgUpdateTime;
    },

    getMinUpdateTime: function() {
        return this._minUpdateTime;
    },

    getMaxUpdateTime: function() {
        return this._maxUpdateTime;
    },

    // Methods -- IDLING TIME ACCESSORS

    getAvgIdleTime: function() {
        return this._avgIdleTime;
    },

    getMinIdleTime: function() {
        return this._minIdleTime;
    },

    getMaxIdleTime: function() {
        return this._maxIdleTime;
    },

    // Methods -- GENERAL ACCESSORS 

    isMidUpdate: function() {
        return this._midUpdate;
    },

    getNumUpdates: function() {
        return this._numUpdates;
    },

    // Methods -- MODIFIERS

    beginUpdate: function() {
        if(this._midUpdate)
            this.endUpdate();

        this._midUpdate = true;
        this._lastBeginTime = new Date().getTime();

        if(this._numUpdates < 1)
            return; // this is the first update

        var time = this._lastBeginTime - this._lastEndTime;

        this._avgIdleTime = (this._avgIdleTime * (this._numUpdates - 1) + time) / this._numUpdates;

        if(time < this._minIdleTime)
            this._minIdleTime = time;
        if(time > this._maxIdleTime)
            this._maxIdleTime = time;
    },

    endUpdate: function() {
        if(!this._midUpdate)
            return;

        this._lastEndTime = new Date().getTime();
        this._midUpdate = false;

        var time = this._lastEndTime - this._lastBeginTime;

        this._numUpdates++;
        this._avgUpdateTime = (this._avgUpdateTime * (this._numUpdates - 1) + time) / this._numUpdates;

        if(time < this._minUpdateTime)
            this._minUpdateTime = time;
        if(time > this._maxUpdateTime)
            this._maxUpdateTime = time;
    },

    clearProfile: function() {
        this._midUpdate = false;
        this._numUpdates = 0;

        this._lastBeginTime = null;
        this._lastEndTime = null;

        this._minUpdateTime = Infinity;
        this._avgUpdateTime = 0;
        this._maxUpdateTime = 0;

        this._minIdleTime = Infinity;
        this._avgIdleTime = 0;
        this._maxIdleTime = 0;
    }
};
Sys.Extended.UI.Seadragon.Profiler.registerClass('Sys.Extended.UI.Seadragon.Profiler', null, Sys.IDisposable);

Seadragon.Spring = Sys.Extended.UI.Seadragon.Spring = function(initialValue, config) {
    this._currentValue = typeof (initialValue) == "number" ? initialValue : 0;
    this._startValue = this._currentValue;
    this._targetValue = this._currentValue;
    this.config = config;

    this._currentTime = new Date().getTime(); // always work in milliseconds
    this._startTime = this._currentTime;
    this._targetTime = this._currentTime;
};
Sys.Extended.UI.Seadragon.Spring.prototype = {
    _transform: function(x) {
        var s = this.config.springStiffness;
        return (1.0 - Math.exp(-x * s)) / (1.0 - Math.exp(-s));
    },
    getCurrent: function() {
        return this._currentValue;
    },

    getTarget: function() {
        return this._targetValue;
    },

    resetTo: function(target) {
        this._targetValue = target;
        this._targetTime = this._currentTime;
        this._startValue = this._targetValue;
        this._startTime = this._targetTime;
    },

    springTo: function(target) {
        this._startValue = this._currentValue;
        this._startTime = this._currentTime;
        this._targetValue = target;
        this._targetTime = this._startTime + 1000 * this.config.animationTime;
    },

    shiftBy: function(delta) {
        this._startValue += delta;
        this._targetValue += delta;
    },

    update: function() {
        this._currentTime = new Date().getTime();
        this._currentValue = (this._currentTime >= this._targetTime) ? this._targetValue :
                this._startValue + (this._targetValue - this._startValue) *
                this._transform((this._currentTime - this._startTime) / (this._targetTime - this._startTime));
    }
};
Sys.Extended.UI.Seadragon.Spring.registerClass('Sys.Extended.UI.Seadragon.Spring', null, Sys.IDisposable);

Sys.Extended.UI.Seadragon.Viewport = function(containerSize, contentSize, config) {
    this.zoomPoint = null;
    this.config = config;
    this._containerSize = containerSize;
    this._contentSize = contentSize;
    this._contentAspect = contentSize.x / contentSize.y;
    this._contentHeight = contentSize.y / contentSize.x;
    this._centerSpringX = new Seadragon.Spring(0, this.config);
    this._centerSpringY = new Seadragon.Spring(0, this.config);
    this._zoomSpring = new Seadragon.Spring(1, this.config);
    this._homeBounds = new Sys.Extended.UI.Seadragon.Rect(0, 0, 1, this._contentHeight);
    this.goHome(true);
    this.update();
};
Sys.Extended.UI.Seadragon.Viewport.prototype = {
    _getHomeZoom: function() {
        var aspectFactor = this._contentAspect / this.getAspectRatio();
        // if content is wider, we'll fit width, otherwise height
        return (aspectFactor >= 1) ? 1 : aspectFactor;
    },

    _getMinZoom: function() {
        var homeZoom = this._getHomeZoom();

        // for backwards compatibility, respect minZoomDimension if present
        if(this.config.minZoomDimension)
            var zoom = (this._contentSize.x <= this._contentSize.y) ?
                this.config.minZoomDimension / this._containerSize.x :
                this.config.minZoomDimension / (this._containerSize.x * this._contentHeight);
        else
            var zoom = this.config.minZoomImageRatio * homeZoom;

        return Math.min(zoom, homeZoom);
    },

    _getMaxZoom: function() {
        var zoom = this._contentSize.x * this.config.maxZoomPixelRatio / this._containerSize.x;
        return Math.max(zoom, this._getHomeZoom());
    },
    getAspectRatio: function() {
        return this._containerSize.x / this._containerSize.y;
    },
    getContainerSize: function() {
        return new Sys.Extended.UI.Seadragon.Point(this._containerSize.x, this._containerSize.y);
    },

    getBounds: function(current) {
        var center = this.getCenter(current),
            width = 1.0 / this.getZoom(current),
            height = width / this.getAspectRatio();

        return new Sys.Extended.UI.Seadragon.Rect(center.x - width / 2.0, center.y - height / 2.0, width, height);
    },

    getCenter: function(current) {
        var centerCurrent = new Sys.Extended.UI.Seadragon.Point(this._centerSpringX.getCurrent(), this._centerSpringY.getCurrent()),
            centerTarget = new Sys.Extended.UI.Seadragon.Point(this._centerSpringX.getTarget(), this._centerSpringY.getTarget());

        if(current)
            return centerCurrent;
        else if(!this.zoomPoint)
            // no adjustment necessary since we're not zooming
            return centerTarget;

        // to get the target center, we need to adjust for the zoom point.
        // we'll do this in the same way as the update() method.
        var oldZoomPixel = this.pixelFromPoint(this.zoomPoint, true);

        // manually calculate bounds based on this unadjusted target center.
        // this is mostly a duplicate of getBounds() above. note that this is
        // based on the TARGET zoom but the CURRENT center.
        var zoom = this.getZoom(),
            width = 1.0 / zoom,
            height = width / this.getAspectRatio(),
            bounds = new Sys.Extended.UI.Seadragon.Rect(centerCurrent.x - width / 2.0, centerCurrent.y - height / 2.0, width, height);

        // the conversions here are identical to the pixelFromPoint() and
        // deltaPointsFromPixels() methods.
        var newZoomPixel = this.zoomPoint.minus(bounds.getTopLeft()).times(this._containerSize.x / bounds.width),
            deltaZoomPixels = newZoomPixel.minus(oldZoomPixel),
            deltaZoomPoints = deltaZoomPixels.divide(this._containerSize.x * zoom);

        // finally, shift center to negate the change.
        return centerTarget.plus(deltaZoomPoints);
    },

    getZoom: function(current) {
        if(current)
            return this._zoomSpring.getCurrent();
        else
            return this._zoomSpring.getTarget();
    },

    // Methods -- MODIFIERS

    applyConstraints: function(immediately) {
        // first, apply zoom constraints
        var actualZoom = this.getZoom();
        var constrainedZoom = Math.max(Math.min(actualZoom, this._getMaxZoom()), this._getMinZoom());
        if(actualZoom != constrainedZoom)
            this.zoomTo(constrainedZoom, this.zoomPoint, immediately);

        // then, apply pan constraints
        var bounds = this.getBounds(),
            visibilityRatio = this.config.visibilityRatio;

        // threshold in normalized coordinates
        var horThres = visibilityRatio * bounds.width,
            verThres = visibilityRatio * bounds.height;

        // amount visible in normalized coordinates
        var left = bounds.x + bounds.width,
            right = 1 - bounds.x,
            top = bounds.y + bounds.height,
            bottom = this._contentHeight - bounds.y;

        // adjust viewport horizontally -- in normalized coordinates!
        var dx = 0;
        if(this.config.wrapHorizontal) { }
            // nothing to constrain
        else if(left < horThres)
            dx = horThres - left;
        else if(right < horThres)
            dx = right - horThres;

        // adjust viewport vertically -- in normalized coordinates!
        var dy = 0;
        if(this.config.wrapVertical) { }
            // nothing to constrain
        else if(top < verThres)
            dy = verThres - top;
        else if(bottom < verThres)
            dy = bottom - verThres;

        // pan if we aren't zooming, otherwise set the zoom point if we are.
        // we've already implemented logic in fitBounds() for this.
        if(dx || dy) {
            bounds.x += dx;
            bounds.y += dy;
            this.fitBounds(bounds, immediately);
        }
    },

    ensureVisible: function(immediately) {
        // for backwards compatibility
        this.applyConstraints(immediately);
    },

    fitBounds: function(bounds, immediately) {
        var aspect = this.getAspectRatio(),
            center = bounds.getCenter();

        // resize bounds to match viewport's aspect ratio, maintaining center.
        // note that zoom = 1/width, and width = height*aspect.
        var newBounds = new Sys.Extended.UI.Seadragon.Rect(bounds.x, bounds.y, bounds.width, bounds.height);
        if(newBounds.getAspectRatio() >= aspect) {
            // width is bigger relative to viewport, resize height
            newBounds.height = bounds.width / aspect;
            newBounds.y = center.y - newBounds.height / 2;
        } else {
            // height is bigger relative to viewport, resize width
            newBounds.width = bounds.height * aspect;
            newBounds.x = center.x - newBounds.width / 2;
        }

        // stop movement first! this prevents the operation from missing
        this.panTo(this.getCenter(true), true);
        this.zoomTo(this.getZoom(true), null, true);

        // capture old values for bounds and width. we need both, but we'll
        // also use both for redundancy, to protect against precision errors.
        // note: use target bounds, since update() hasn't been called yet!
        var oldBounds = this.getBounds(),
            oldZoom = this.getZoom();

        // if we're already at the correct zoom, just pan and we're done.
        // we'll check both zoom and bounds for redundancy, to protect against
        // precision errors (see note below).
        var newZoom = 1.0 / newBounds.width;
        if(newZoom == oldZoom || newBounds.width == oldBounds.width) {
            this.panTo(center, immediately);
            return;
        }

        // otherwise, we need to zoom about the only point whose pixel transform
        // is constant between the old and new bounds. this is just tricky math.
        var refPoint = oldBounds.getTopLeft().times(this._containerSize.x / oldBounds.width).minus(
                newBounds.getTopLeft().times(this._containerSize.x / newBounds.width)).divide(
                this._containerSize.x / oldBounds.width - this._containerSize.x / newBounds.width);

        // note: that last line (cS.x / oldB.w - cS.x / newB.w) was causing a
        // divide by 0 in the case that oldBounds.width == newBounds.width.
        // that should have been picked up by the zoom check, but in certain
        // cases, the math is slightly off and the zooms are different. so now,
        // the zoom check has an extra check added.
        this.zoomTo(newZoom, refPoint, immediately);
    },

    goHome: function(immediately) {
        // calculate center adjusted for zooming
        var center = this.getCenter();

        // if we're wrapping horizontally, "unwind" the horizontal spring
        if(this.config.wrapHorizontal) {
            // this puts center.x into the range [0, 1) always
            center.x = (1 + (center.x % 1)) % 1;
            this._centerSpringX.resetTo(center.x);
            this._centerSpringX.update();
        }

        // if we're wrapping vertically, "unwind" the vertical spring
        if(this.config.wrapVertical) {
            // this puts center.y into the range e.g. [0, 0.75) always
            center.y = (this._contentHeight + (center.y % this._contentHeight)) % this._contentHeight;
            this._centerSpringY.resetTo(center.y);
            this._centerSpringY.update();
        }

        this.fitBounds(this._homeBounds, immediately);
    },

    panBy: function(delta, immediately) {
        // this breaks if we call self.getCenter(), since that adjusts the
        // center for zoom. we don't want that, so use the unadjusted center.
        var center = new Sys.Extended.UI.Seadragon.Point(this._centerSpringX.getTarget(),
                this._centerSpringY.getTarget());
        this.panTo(center.plus(delta), immediately);
    },

    panTo: function(center, immediately) {
        if(immediately) {
            this._centerSpringX.resetTo(center.x);
            this._centerSpringY.resetTo(center.y);
        } else {
            this._centerSpringX.springTo(center.x);
            this._centerSpringY.springTo(center.y);
        }
    },

    zoomBy: function(factor, refPoint, immediately) {
        this.zoomTo(this._zoomSpring.getTarget() * factor, refPoint, immediately);
    },

    zoomTo: function(zoom, refPoint, immediately) {
        // we used to constrain zoom automatically here; now it needs to be
        // explicitly constrained, via applyConstraints().
        //zoom = Math.max(zoom, getMinZoom());
        //zoom = Math.min(zoom, getMaxZoom());

        if(immediately)
            this._zoomSpring.resetTo(zoom);
        else
            this._zoomSpring.springTo(zoom);

        this.zoomPoint = refPoint instanceof Sys.Extended.UI.Seadragon.Point ? refPoint : null;
    },

    resize: function(newContainerSize, maintain) {
        // default behavior: just ensure the visible content remains visible.
        // note that this keeps the center (relative to the content) constant.
        var oldBounds = this.getBounds(),
            newBounds = oldBounds,
            widthDeltaFactor = newContainerSize.x / this._containerSize.x;

        // update container size, but make copy first
        this._containerSize = new Sys.Extended.UI.Seadragon.Point(newContainerSize.x, newContainerSize.y);

        if(maintain) {
            // no resize relative to screen, resize relative to viewport.
            // keep origin constant, zoom out (increase bounds) by delta factor.
            newBounds.width = oldBounds.width * widthDeltaFactor;
            newBounds.height = newBounds.width / this.getAspectRatio();
        }

        this.fitBounds(newBounds, true);
    },

    update: function() {
        var oldCenterX = this._centerSpringX.getCurrent(),
            oldCenterY = this._centerSpringY.getCurrent(),
            oldZoom = this._zoomSpring.getCurrent();

        // remember position of zoom point
        if(this.zoomPoint)
            var oldZoomPixel = this.pixelFromPoint(this.zoomPoint, true);

        // now update zoom only, don't update pan yet
        this._zoomSpring.update();

        // adjust for change in position of zoom point, if we've zoomed
        if(this.zoomPoint && this._zoomSpring.getCurrent() != oldZoom) {
            var newZoomPixel = this.pixelFromPoint(this.zoomPoint, true),
                deltaZoomPixels = newZoomPixel.minus(oldZoomPixel),
                deltaZoomPoints = this.deltaPointsFromPixels(deltaZoomPixels, true);

            // shift pan to negate the change
            this._centerSpringX.shiftBy(deltaZoomPoints.x);
            this._centerSpringY.shiftBy(deltaZoomPoints.y);
        } else {
            // don't try to adjust next time; this improves performance
            this.zoomPoint = null;
        }

        // now after adjustment, update pan
        this._centerSpringX.update();
        this._centerSpringY.update();

        return this._centerSpringX.getCurrent() != oldCenterX ||
                this._centerSpringY.getCurrent() != oldCenterY ||
                this._zoomSpring.getCurrent() != oldZoom;
    },

    // Methods -- CONVERSION HELPERS

    deltaPixelsFromPoints: function(deltaPoints, current) {
        return deltaPoints.times(this._containerSize.x * this.getZoom(current));
    },

    deltaPointsFromPixels: function(deltaPixels, current) {
        return deltaPixels.divide(this._containerSize.x * this.getZoom(current));
    },

    pixelFromPoint: function(point, current) {
        var bounds = this.getBounds(current);
        return point.minus(bounds.getTopLeft()).times(this._containerSize.x / bounds.width);
    },

    pointFromPixel: function(pixel, current) {
        var bounds = this.getBounds(current);
        return pixel.divide(this._containerSize.x / bounds.width).plus(bounds.getTopLeft());
    }
};
Sys.Extended.UI.Seadragon.Viewport.registerClass('Sys.Extended.UI.Seadragon.Viewport', null, Sys.IDisposable);

Sys.Extended.UI.Seadragon.DisplayRect = function(x, y, width, height, minLevel, maxLevel) {
    Sys.Extended.UI.Seadragon.DisplayRect.initializeBase(this, [x, y, width, height]);

    this.minLevel = minLevel;
    this.maxLevel = maxLevel;
};
Sys.Extended.UI.Seadragon.DisplayRect.registerClass('Sys.Extended.UI.Seadragon.DisplayRect', Sys.Extended.UI.Seadragon.Rect);