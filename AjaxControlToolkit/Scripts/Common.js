Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.BoxSide = function() {
    // The BoxSide enumeration describes the sides of a DOM element
}
Sys.Extended.UI.BoxSide.prototype = {
    Top : 0,
    Right : 1,
    Bottom : 2,
    Left : 3
}
Sys.Extended.UI.BoxSide.registerEnum("Sys.Extended.UI.BoxSide", false);


Sys.Extended.UI._CommonToolkitScripts = function() {
    // The _CommonToolkitScripts class contains functionality utilized across a number
    // of controls (but not universally)
    // You should not create new instances of _CommonToolkitScripts.  Instead you should use the shared instance CommonToolkitScripts (or Sys.Extended.UI.CommonToolkitScripts).
}
Sys.Extended.UI._CommonToolkitScripts.prototype = {
    // The order of these lookup tables is directly linked to the BoxSide enum defined above
    _borderStyleNames: ["borderTopStyle", "borderRightStyle", "borderBottomStyle", "borderLeftStyle"],
    _borderWidthNames: ["borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"],
    _paddingWidthNames: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
    _marginWidthNames: ["marginTop", "marginRight", "marginBottom", "marginLeft"],

    getCurrentStyle: function(element, attribute, defaultValue) {
        // CommonToolkitScripts.getCurrentStyle is used to compute the value of a style attribute on an
        // element that is currently being displayed.  This is especially useful for scenarios where
        // several CSS classes and style attributes are merged, or when you need information about the
        // size of an element (such as its padding or margins) that is not exposed in any other fashion.
        // "element" - live DOM element to check style of
        // "attribute" - the style attribute's name is expected to be in a camel-cased form that you would use when
        // accessing a JavaScript property instead of the hyphenated form you would use in a CSS
        // stylesheet (i.e. it should be "backgroundColor" and not "background-color").
        // "defaultValue" - in the event of a problem (i.e. a null element or an attribute that cannot be found) we
        // return this object (or null if none if not specified).
        // "Object" - ñurrent style of the element's attribute

        var currentValue = null;
        if (element) {
            if (element.currentStyle) {
                currentValue = element.currentStyle[attribute];
            } else if (document.defaultView && document.defaultView.getComputedStyle) {
                var style = document.defaultView.getComputedStyle(element, null);
                if (style) {
                    currentValue = style[attribute];
                }
            }

            if (!currentValue && element.style.getPropertyValue) {
                currentValue = element.style.getPropertyValue(attribute);
            }
            else if (!currentValue && element.style.getAttribute) {
                currentValue = element.style.getAttribute(attribute);
            }
        }

        if ((!currentValue || currentValue == "" || typeof (currentValue) === 'undefined')) {
            if (typeof (defaultValue) != 'undefined') {
                currentValue = defaultValue;
            }
            else {
                currentValue = null;
            }
        }
        return currentValue;
    },

    getInheritedBackgroundColor: function(element) {
        // CommonToolkitScripts.getInheritedBackgroundColor provides the ability to get the displayed
        // background-color of an element.  In most cases calling CommonToolkitScripts.getCurrentStyle
        // won't do the job because it will return "transparent" unless the element has been given a
        // specific background color.  This function will walk up the element's parents until it finds
        // a non-transparent color.  If we get all the way to the top of the document or have any other
        // problem finding a color, we will return the default value '#FFFFFF'.  This function is
        // especially important when we're using opacity in IE (because ClearType will make text look
        // horrendous if you fade it with a transparent background color).
        // Returns background color of the element.
        // "element" - live DOM element to get the background color of

        if (!element) return '#FFFFFF';
        var background = this.getCurrentStyle(element, 'backgroundColor');
        try {
            while (!background || background == '' || background == 'transparent' || background == 'rgba(0, 0, 0, 0)') {
                element = element.parentNode;
                if (!element) {
                    background = '#FFFFFF';
                } else {
                    background = this.getCurrentStyle(element, 'backgroundColor');
                }
            }
        } catch (ex) {
            background = '#FFFFFF';
        }
        return background;
    },

    getLocation: function(element) {
        // Gets the coordinates of a DOM element.
        // Returns a Point object with two fields, x and y, which contain the pixel coordinates of the element.
        return Sys.UI.DomElement.getLocation(element);
    },

    setLocation: function(element, point) {
        // Sets the current location for an element.
        // This method does not attempt to set the positioning mode of an element.
        // The position is relative from the elements nearest position:relative or
        // position:absolute element.
        // "element" - DOM element
        // "point" - Point object (of the form {x,y})

        Sys.UI.DomElement.setLocation(element, point.x, point.y);
    },

    getContentSize: function(element) {
        // Gets the "content-box" size of an element.
        // The "content-box" is the size of the content area *inside* of the borders and
        // padding of an element. The "content-box" size does not include the margins around
        // the element.
        // "element" - DOM element
        // Returns size of the element (in the form {width,height})

        if (!element) {
            throw Error.argumentNull('element');
        }
        var size = this.getSize(element);
        var borderBox = this.getBorderBox(element);
        var paddingBox = this.getPaddingBox(element);
        return {
            width: size.width - borderBox.horizontal - paddingBox.horizontal,
            height: size.height - borderBox.vertical - paddingBox.vertical
        }
    },

    getSize: function(element) {
        // Gets the "border-box" size of an element.
        // The "border-box" is the size of the content area *outside* of the borders and
        // padding of an element.  The "border-box" size does not include the margins around
        // the element.
        // "element" - DOM element
        // Returns size of the element (in the form {width,height})

        if (!element) {
            throw Error.argumentNull('element');
        }
        return {
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    },

    setContentSize: function(element, size) {
        // Sets the "content-box" size of an element.
        // The "content-box" is the size of the content area *inside* of the borders and
        // padding of an element. The "content-box" size does not include the margins around
        // the element.
        // "element" - DOM element
        // "size" - size of the element (in the form {width,height})

        if (!element) {
            throw Error.argumentNull('element');
        }
        if (!size) {
            throw Error.argumentNull('size');
        }
        // FF respects -moz-box-sizing css extension, so adjust the box size for the border-box
        if (this.getCurrentStyle(element, 'MozBoxSizing') == 'border-box' || this.getCurrentStyle(element, 'BoxSizing') == 'border-box') {
            var borderBox = this.getBorderBox(element);
            var paddingBox = this.getPaddingBox(element);
            size = {
                width: size.width + borderBox.horizontal + paddingBox.horizontal,
                height: size.height + borderBox.vertical + paddingBox.vertical
            };
        }
        element.style.width = size.width.toString() + 'px';
        element.style.height = size.height.toString() + 'px';
    },

    setSize: function(element, size) {
        // Sets the "border-box" size of an element.
        // The "border-box" is the size of the content area *outside* of the borders and 
        // padding of an element.  The "border-box" size does not include the margins around
        // the element.
        // "element" - DOM element
        // "size" - size of the element (in the form {width,height})</param>

        if (!element) {
            throw Error.argumentNull('element');
        }
        if (!size) {
            throw Error.argumentNull('size');
        }
        var borderBox = this.getBorderBox(element);
        var paddingBox = this.getPaddingBox(element);
        var contentSize = {
            width: size.width - borderBox.horizontal - paddingBox.horizontal,
            height: size.height - borderBox.vertical - paddingBox.vertical
        };
        this.setContentSize(element, contentSize);
    },

    getBounds: function(element) {
        // Gets the coordinates, width and height of an element.
        // Returns a Bounds object with four fields, x, y, width and height, which contain the pixel coordinates,
        // width and height of the element.
        return Sys.UI.DomElement.getBounds(element);
    },

    setBounds: function(element, bounds) {
        // Sets the "border-box" bounds of an element
        // The "border-box" is the size of the content area *outside* of the borders and
        // padding of an element.  The "border-box" size does not include the margins around
        // the element.
        // "element" - DOM element
        // "bounds" - bounds of the element (of the form {x,y,width,height})

        if (!element) {
            throw Error.argumentNull('element');
        }
        if (!bounds) {
            throw Error.argumentNull('bounds');
        }
        this.setSize(element, bounds);
        $common.setLocation(element, bounds);
    },

    getClientBounds: function() {
        // Gets the width and height of the browser client window (excluding scrollbars)
        // Returns browser's client width and height

        var clientWidth;
        var clientHeight;

        // getClientBounds must return dimensions excluding scrollbars, so cannot use window.innerWidth and window.innerHeight.
        if (document.compatMode == "CSS1Compat") {
            // Standards-compliant mode
            clientWidth = document.documentElement.clientWidth;
            clientHeight = document.documentElement.clientHeight;
        }
        else {
            // Quirks mode
            clientWidth = document.body.clientWidth;
            clientHeight = document.body.clientHeight;
        }
        return new Sys.UI.Bounds(0, 0, clientWidth, clientHeight);
    },

    getMarginBox: function(element) {
        // Gets the entire margin box sizes.
        // "element" - DOM element
        // Returns - element's margin box sizes (of the form {top,left,bottom,right,horizontal,vertical})

        if (!element) {
            throw Error.argumentNull('element');
        }
        var box = {
            top: this.getMargin(element, Sys.Extended.UI.BoxSide.Top),
            right: this.getMargin(element, Sys.Extended.UI.BoxSide.Right),
            bottom: this.getMargin(element, Sys.Extended.UI.BoxSide.Bottom),
            left: this.getMargin(element, Sys.Extended.UI.BoxSide.Left)
        };
        box.horizontal = box.left + box.right;
        box.vertical = box.top + box.bottom;
        return box;
    },

    getBorderBox: function(element) {
        // Gets the entire border box sizes.
        // Returns element's border box sizes (of the form {top,left,bottom,right,horizontal,vertical})
        // "element" - DOM element

        if (!element) {
            throw Error.argumentNull('element');
        }
        var box = {
            top: this.getBorderWidth(element, Sys.Extended.UI.BoxSide.Top),
            right: this.getBorderWidth(element, Sys.Extended.UI.BoxSide.Right),
            bottom: this.getBorderWidth(element, Sys.Extended.UI.BoxSide.Bottom),
            left: this.getBorderWidth(element, Sys.Extended.UI.BoxSide.Left)
        };
        box.horizontal = box.left + box.right;
        box.vertical = box.top + box.bottom;
        return box;
    },

    getPaddingBox: function(element) {
        // Gets the entire padding box sizes.
        // Returns element's padding box sizes (of the form {top,left,bottom,right,horizontal,vertical})
        // "element" - DOM element

        if (!element) {
            throw Error.argumentNull('element');
        }
        var box = {
            top: this.getPadding(element, Sys.Extended.UI.BoxSide.Top),
            right: this.getPadding(element, Sys.Extended.UI.BoxSide.Right),
            bottom: this.getPadding(element, Sys.Extended.UI.BoxSide.Bottom),
            left: this.getPadding(element, Sys.Extended.UI.BoxSide.Left)
        };
        box.horizontal = box.left + box.right;
        box.vertical = box.top + box.bottom;
        return box;
    },

    isBorderVisible: function(element, boxSide) {
        // Gets whether the current border style for an element on a specific boxSide is not 'none'.
        // "element" - DOM element
        // "boxSide" - side of the element

        if (!element) {
            throw Error.argumentNull('element');
        }
        if (boxSide < Sys.Extended.UI.BoxSide.Top || boxSide > Sys.Extended.UI.BoxSide.Left) {
            throw Error.argumentOutOfRange(String.format(Sys.Res.enumInvalidValue, boxSide, 'Sys.Extended.UI.BoxSide'));
        }
        var styleName = this._borderStyleNames[boxSide];
        var styleValue = this.getCurrentStyle(element, styleName);
        return styleValue != "none";
    },

    getMargin: function(element, boxSide) {
        // Gets the margin thickness of an element on a specific boxSide.
        // "element" - DOM element
        // "boxSide" - side of the element
        // Returns margin thickness on the element's specified side

        if (!element) {
            throw Error.argumentNull('element');
        }
        if (boxSide < Sys.Extended.UI.BoxSide.Top || boxSide > Sys.Extended.UI.BoxSide.Left) {
            throw Error.argumentOutOfRange(String.format(Sys.Res.enumInvalidValue, boxSide, 'Sys.Extended.UI.BoxSide'));
        }
        var styleName = this._marginWidthNames[boxSide];
        var styleValue = this.getCurrentStyle(element, styleName);
        try { return this.parsePadding(styleValue); } catch (ex) { return 0; }
    },

    getBorderWidth: function(element, boxSide) {
        // Gets the border thickness of an element on a specific boxSide.
        // "element" - DOM element
        // "boxSide" - side of the element

        if (!element) {
            throw Error.argumentNull('element');
        }
        if (boxSide < Sys.Extended.UI.BoxSide.Top || boxSide > Sys.Extended.UI.BoxSide.Left) {
            throw Error.argumentOutOfRange(String.format(Sys.Res.enumInvalidValue, boxSide, 'Sys.Extended.UI.BoxSide'));
        }
        if (!this.isBorderVisible(element, boxSide)) {
            return 0;
        }
        var styleName = this._borderWidthNames[boxSide];
        var styleValue = this.getCurrentStyle(element, styleName);
        return this.parseBorderWidth(styleValue);
    },

    getPadding: function(element, boxSide) {
        // Gets the padding thickness of an element on a specific boxSide.
        // "element" - DOM element        
        // "boxSide" - side of the element

        if (!element) {
            throw Error.argumentNull('element');
        }
        if (boxSide < Sys.Extended.UI.BoxSide.Top || boxSide > Sys.Extended.UI.BoxSide.Left) {
            throw Error.argumentOutOfRange(String.format(Sys.Res.enumInvalidValue, boxSide, 'Sys.Extended.UI.BoxSide'));
        }
        var styleName = this._paddingWidthNames[boxSide];
        var styleValue = this.getCurrentStyle(element, styleName);
        return this.parsePadding(styleValue);
    },

    parseBorderWidth: function(borderWidth) {
        // Parses a border-width string into a pixel size
        // Returns number of pixels in the border-width
        // "borderWidth" - type of border ('thin','medium','thick','inherit',px unit,null,'')

        if (!this._borderThicknesses) {

            // Populate the borderThicknesses lookup table
            var borderThicknesses = {};
            var div0 = document.createElement('div');
            div0.style.visibility = 'hidden';
            div0.style.position = 'absolute';
            div0.style.fontSize = '1px';
            document.body.appendChild(div0)
            var div1 = document.createElement('div');
            div1.style.height = '0px';
            div1.style.overflow = 'hidden';
            div0.appendChild(div1);
            var base = div0.offsetHeight;
            div1.style.borderTop = 'solid black';
            div1.style.borderTopWidth = 'thin';
            borderThicknesses['thin'] = div0.offsetHeight - base;
            div1.style.borderTopWidth = 'medium';
            borderThicknesses['medium'] = div0.offsetHeight - base;
            div1.style.borderTopWidth = 'thick';
            borderThicknesses['thick'] = div0.offsetHeight - base;
            div0.removeChild(div1);
            document.body.removeChild(div0);
            this._borderThicknesses = borderThicknesses;
        }

        if (borderWidth) {
            switch (borderWidth) {
                case 'thin':
                case 'medium':
                case 'thick':
                    return this._borderThicknesses[borderWidth];
                case 'inherit':
                    return 0;
            }
            var unit = this.parseUnit(borderWidth);
            Sys.Debug.assert(unit.type == 'px', String.format(Sys.Extended.UI.Resources.Common_InvalidBorderWidthUnit, unit.type));
            return unit.size;
        }
        return 0;
    },

    parsePadding: function(padding) {
        // Parses a padding string into a pixel size
        // "padding" - padding to parse ('inherit',px unit,null,'')
        // Returns number of pixels in the padding

        if (padding) {
            if (padding == 'inherit') {
                return 0;
            }
            var unit = this.parseUnit(padding);
            if (unit.type !== 'px') {
                Sys.Debug.fail(String.format(Sys.Extended.UI.Resources.Common_InvalidPaddingUnit, unit.type));
            }
            return unit.size;
        }
        return 0;
    },

    parseUnit: function(value) {
        // Parses a unit string into a unit object
        // Returns parsed unit (of the form {size,type})
        // "value" - value to parse (of the form px unit,% unit,em unit,...)
        
        if (!value) {
            throw Error.argumentNull('value');
        }

        value = value.trim().toLowerCase();
        var l = value.length;
        var s = -1;
        for (var i = 0; i < l; i++) {
            var ch = value.substr(i, 1);
            if ((ch < '0' || ch > '9') && ch != '-' && ch != '.' && ch != ',') {
                break;
            }
            s = i;
        }
        if (s == -1) {
            throw Error.create(Sys.Extended.UI.Resources.Common_UnitHasNoDigits);
        }
        var type;
        var size;
        if (s < (l - 1)) {
            type = value.substring(s + 1).trim();
        } else {
            type = 'px';
        }
        size = parseFloat(value.substr(0, s + 1));
        if (type == 'px') {
            size = Math.floor(size);
        }
        return {
            size: size,
            type: type
        };
    },

    getElementOpacity: function(element) {
        // Get the element's opacity
        // "element" - element

        if (!element) {
            throw Error.argumentNull('element');
        }

        var hasOpacity = false;
        var opacity;

        if (element.filters) {
            var filters = element.filters;
            if (filters.length !== 0) {
                var alphaFilter = filters['DXImageTransform.Microsoft.Alpha'];
                if (alphaFilter) {
                    opacity = alphaFilter.opacity / 100.0;
                    hasOpacity = true;
                }
            }
        }
        else {
            opacity = this.getCurrentStyle(element, 'opacity', 1);
            hasOpacity = true;
        }

        if (hasOpacity === false) {
            return 1.0;
        }
        return parseFloat(opacity);
    },

    setElementOpacity: function(element, value) {
        // Set the element's opacity
        // "element" - element
        // "value" -  opacity of the element

        if (!element) {
            throw Error.argumentNull('element');
        }

        if (element.filters) {
            var filters = element.filters;
            var createFilter = true;
            if (filters.length !== 0) {
                var alphaFilter = filters['DXImageTransform.Microsoft.Alpha'];
                if (alphaFilter) {
                    createFilter = false;
                    alphaFilter.opacity = value * 100;
                }
            }
            if (createFilter) {
                element.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + (value * 100) + ')';
            }
        }
        else {
            element.style.opacity = value;
        }
    },

    getVisible: function(element) {
        // Check if an element is visible
        // Returns true if the element is visible, false otherwise
        // element"- element
        // Note: reference to CommonToolkitScripts must be left intact (i.e. don't
        // replace with 'this') because this function will be aliased

        return (element &&
                ("none" != $common.getCurrentStyle(element, "display")) &&
                ("hidden" != $common.getCurrentStyle(element, "visibility")));
    },

    setVisible: function(element, value) {
        // Check if an element is visible
        // "element" - element
        // "value" - true to make the element visible, false to hide it
        // Note: reference to CommonToolkitScripts must be left intact (i.e. don't
        // replace with 'this') because this function will be aliased

        if (element && value != $common.getVisible(element)) {
            if (value) {
                if (element.style.removeAttribute) {
                    element.style.removeAttribute("display");
                } else {
                    element.style.removeProperty("display");
                }
            } else {
                element.style.display = 'none';
            }
            element.style.visibility = value ? 'visible' : 'hidden';
        }
    },

    resolveFunction: function(value) {
        // Returns a function reference that corresponds to the provided value
        // Returns reference to the function, or null if not found
        // "value" - the value can either be a Function, the name of a function (that can be found using window['name']),
        // or an expression that evaluates to a function.

        if (value) {
            if (value instanceof Function) {
                return value;
            } else if (String.isInstanceOfType(value) && value.length > 0) {
                var func;
                if ((func = window[value]) instanceof Function) {
                    return func;
                } else if ((func = eval(value)) instanceof Function) {
                    return func;
                }
            }
        }
        return null;
    },

    addCssClasses: function(element, classNames) {
        // Adds multiple css classes to a DomElement
        // "element"- the element to modify
        // "classNames" - the class names to add

        for (var i = 0; i < classNames.length; i++) {
            Sys.UI.DomElement.addCssClass(element, classNames[i]);
        }
    },
    removeCssClasses: function(element, classNames) {
        // Removes multiple css classes to a DomElement
        // "element" - the element to modify
        // "classNames" - the class names to remove

        for (var i = 0; i < classNames.length; i++) {
            Sys.UI.DomElement.removeCssClass(element, classNames[i]);
        }
    },
    setStyle: function(element, style) {
        // Sets the style of the element using the supplied style template object
        // "element" - the element to modify
        // "style" - the template

        $common.applyProperties(element.style, style);
    },
    removeHandlers: function(element, events) {
        // Removes a set of event handlers from an element
        // This is NOT the same as $clearHandlers which removes all delegates from a DomElement. This rather removes select delegates 
        // from a specified element and has a matching signature as $addHandlers
        // "element" - the element to modify
        // "events" - the template object that contains event names and delegates

        for (var name in events) {
            $removeHandler(element, name, events[name]);
        }
    },

    overlaps: function(r1, r2) {
        // Determine if two rectangles overlap
        // "r1" - rectangle
        // "r2" - rectangle
        // Returns true if the rectangles overlap, false otherwise

        return r1.x < (r2.x + r2.width)
                && r2.x < (r1.x + r1.width)
                && r1.y < (r2.y + r2.height)
                && r2.y < (r1.y + r1.height);
    },

    containsPoint: function(rect, x, y) {
        // Tests whether a point (x,y) is contained within a rectangle
        // "rect" - the rectangle
        // "x" - the x coordinate of the point
        // "y" - the y coordinate of the point

        return x >= rect.x && x < (rect.x + rect.width) && y >= rect.y && y < (rect.y + rect.height);
    },

    isKeyDigit: function(keyCode) {
        // Gets whether the supplied key-code is a digit
        // "keyCode" - the key code of the event (from Sys.UI.DomEvent)

        return (0x30 <= keyCode && keyCode <= 0x39);
    },

    isKeyNavigation: function(keyCode) {
        // Gets whether the supplied key-code is a navigation key
        // "keyCode" - the key code of the event (from Sys.UI.DomEvent)

        return (Sys.UI.Key.left <= keyCode && keyCode <= Sys.UI.Key.down);
    },

    padLeft: function(text, size, ch, truncate) {
        // Pads the left hand side of the supplied text with the specified pad character up to the requested size
        // "text" - the text to pad
        // "size" - the size to pad the text (default is 2)
        // "ch" - the single character to use as the pad character (default is ' ')
        // "truncate" - whether to truncate the text to size (default is false)

        return $common._pad(text, size || 2, ch || ' ', 'l', truncate || false);
    },

    padRight: function(text, size, ch, truncate) {
        // Pads the right hand side of the supplied text with the specified pad character up to the requested size
        // "text" - the text to pad
        // "size" - the size to pad the text (default is 2)
        // "ch" - the single character to use as the pad character (default is ' ')
        // "truncate" - whether to truncate the text to size (default is false)

        return $common._pad(text, size || 2, ch || ' ', 'r', truncate || false);
    },

    _pad: function(text, size, ch, side, truncate) {
        // Pads supplied text with the specified pad character up to the requested size
        // "text" - the text to pad<
        // "size" - the size to pad the text
        // "ch" - the single character to use as the pad character
        // "side" - either 'l' or 'r' to siginfy whether to pad the Left or Right side respectively
        // "truncate" - whether to truncate the text to size

        text = text.toString();
        var length = text.length;
        var builder = new Sys.StringBuilder();
        if (side == 'r') {
            builder.append(text);
        }
        while (length < size) {
            builder.append(ch);
            length++;
        }
        if (side == 'l') {
            builder.append(text);
        }
        var result = builder.toString();
        if (truncate && result.length > size) {
            if (side == 'l') {
                result = result.substr(result.length - size, size);
            } else {
                result = result.substr(0, size);
            }
        }
        return result;
    },

    __DOMEvents: {
        focusin: { eventGroup: "UIEvents", init: function(e, p) { e.initUIEvent("focusin", true, false, window, 1); } },
        focusout: { eventGroup: "UIEvents", init: function(e, p) { e.initUIEvent("focusout", true, false, window, 1); } },
        activate: { eventGroup: "UIEvents", init: function(e, p) { e.initUIEvent("activate", true, true, window, 1); } },
        focus: { eventGroup: "UIEvents", init: function(e, p) { e.initUIEvent("focus", false, false, window, 1); } },
        blur: { eventGroup: "UIEvents", init: function(e, p) { e.initUIEvent("blur", false, false, window, 1); } },
        click: { eventGroup: "MouseEvents", init: function(e, p) { e.initMouseEvent("click", true, true, window, 1, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null); } },
        dblclick: { eventGroup: "MouseEvents", init: function(e, p) { e.initMouseEvent("click", true, true, window, 2, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null); } },
        mousedown: { eventGroup: "MouseEvents", init: function(e, p) { e.initMouseEvent("mousedown", true, true, window, 1, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null); } },
        mouseup: { eventGroup: "MouseEvents", init: function(e, p) { e.initMouseEvent("mouseup", true, true, window, 1, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null); } },
        mouseover: { eventGroup: "MouseEvents", init: function(e, p) { e.initMouseEvent("mouseover", true, true, window, 1, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null); } },
        mousemove: { eventGroup: "MouseEvents", init: function(e, p) { e.initMouseEvent("mousemove", true, true, window, 1, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null); } },
        mouseout: { eventGroup: "MouseEvents", init: function(e, p) { e.initMouseEvent("mousemove", true, true, window, 1, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null); } },
        load: { eventGroup: "HTMLEvents", init: function(e, p) { e.initEvent("load", false, false); } },
        unload: { eventGroup: "HTMLEvents", init: function(e, p) { e.initEvent("unload", false, false); } },
        select: { eventGroup: "HTMLEvents", init: function(e, p) { e.initEvent("select", true, false); } },
        change: { eventGroup: "HTMLEvents", init: function(e, p) { e.initEvent("change", true, false); } },
        submit: { eventGroup: "HTMLEvents", init: function(e, p) { e.initEvent("submit", true, true); } },
        reset: { eventGroup: "HTMLEvents", init: function(e, p) { e.initEvent("reset", true, false); } },
        resize: { eventGroup: "HTMLEvents", init: function(e, p) { e.initEvent("resize", true, false); } },
        scroll: { eventGroup: "HTMLEvents", init: function(e, p) { e.initEvent("scroll", true, false); } }
    },

    tryFireRawEvent: function(element, rawEvent) {
        // Attempts to fire a raw DOM event on an element
        // Returns true if the event was successfully fired, otherwise false
        // "element" - the element to fire the event
        // "rawEvent" - the raw DOM event object to fire. Must not be Sys.UI.DomEvent

        try {
            if (element.fireEvent) {
                element.fireEvent("on" + rawEvent.type, rawEvent);
                return true;
            } else if (element.dispatchEvent) {
                element.dispatchEvent(rawEvent);
                return true;
            }
        } catch (e) {
        }
        return false;
    },

    tryFireEvent: function(element, eventName, properties) {
        // Attempts to fire a DOM event on an element
        // Returns true if the event was successfully fired, otherwise false<
        // "element" - the element to fire the event
        // "eventName" - the name of the event to fire (without an 'on' prefix)
        // "properties"- properties to add to the event

        try {
            if (document.createEventObject) {
                var e = document.createEventObject();
                $common.applyProperties(e, properties || {});
                element.fireEvent("on" + eventName, e);
                return true;
            } else if (document.createEvent) {
                var def = $common.__DOMEvents[eventName];
                if (def) {
                    var e = document.createEvent(def.eventGroup);
                    def.init(e, properties || {});
                    element.dispatchEvent(e);
                    return true;
                }
            }
        } catch (e) {
        }
        return false;
    },

    wrapElement: function(innerElement, newOuterElement, newInnerParentElement) {
        // Wraps an inner element with a new outer element at the same DOM location as the inner element
        // "innerElement" - the element to be wrapped
        // "newOuterElement" - the new parent for the element

        var parent = innerElement.parentNode;
        parent.replaceChild(newOuterElement, innerElement);
        (newInnerParentElement || newOuterElement).appendChild(innerElement);
    },

    unwrapElement: function(innerElement, oldOuterElement) {
        // Unwraps an inner element from an outer element at the same DOM location as the outer element
        // "innerElement" - the element to be wrapped
        // "newOuterElement" - the new parent for the element

        var parent = oldOuterElement.parentNode;
        if (parent != null) {
            $common.removeElement(innerElement);
            parent.replaceChild(innerElement, oldOuterElement);
        }
    },

    removeElement: function(element) {
        // Removes an element from the DOM tree
        // "element" - the element to be removed

        var parent = element.parentNode;
        if (parent != null) {
            parent.removeChild(element);
        }
    },

    applyProperties: function(target, properties) {
        // Quick utility method to copy properties from a template object to a target object
        // "target" - the object to apply to
        // "properties" - the template to copy values from<

        for (var p in properties) {
            var pv = properties[p];
            if (pv != null && Object.getType(pv) === Object) {
                var tv = target[p];
                $common.applyProperties(tv, pv);
            } else {
                target[p] = pv;
            }
        }
    },

    createElementFromTemplate: function(template, appendToParent, nameTable) {
        // Creates an element for the current document based on a template object
        // "template" - the template from which to create the element
        // "appendToParent" - a DomElement under which to append this element
        // "nameTable" - an object to use as the storage for the element using template.name as the key
        // This method is useful if you find yourself using the same or similar DomElement constructions throughout a class.  You can even set the templates
        // as static properties for a type to cut down on overhead.  This method is often called with a JSON style template:
        // <code>
        // var elt = $common.createElementFromTemplate({
        //     nodeName : "div",
        //     properties : {
        //         style : {
        //             height : "100px",
        //             width : "100px",
        //             backgroundColor : "white"
        //         },
        //         expandoAttribute : "foo"
        //     },
        //     events : {
        //         click : function() { alert("foo"); },
        //         mouseover : function() { elt.backgroundColor = "silver"; },
        //         mouseout : function() { elt.backgroundColor = "white"; }
        //     },
        //     cssClasses : [ "class0", "class1" ],
        //     visible : true,
        //     opacity : .5
        // }, someParent);
        // </code>

        // if we wish to override the name table we do so here
        if (typeof (template.nameTable) != 'undefined') {
            var newNameTable = template.nameTable;
            if (String.isInstanceOfType(newNameTable)) {
                newNameTable = nameTable[newNameTable];
            }
            if (newNameTable != null) {
                nameTable = newNameTable;
            }
        }

        // get a name for the element in the nameTable
        var elementName = null;
        if (typeof (template.name) !== 'undefined') {
            elementName = template.name;
        }

        // create or acquire the element
        var elt = document.createElement(template.nodeName);

        // if our element is named, add it to the name table
        if (typeof (template.name) !== 'undefined' && nameTable) {
            nameTable[template.name] = elt;
        }

        // if we wish to supply a default parent we do so here
        if (typeof (template.parent) !== 'undefined' && appendToParent == null) {
            var newParent = template.parent;
            if (String.isInstanceOfType(newParent)) {
                newParent = nameTable[newParent];
            }
            if (newParent != null) {
                appendToParent = newParent;
            }
        }

        // properties are applied as expando values to the element
        if (typeof (template.properties) !== 'undefined' && template.properties != null) {
            $common.applyProperties(elt, template.properties);
        }

        // css classes are added to the element's className property
        if (typeof (template.cssClasses) !== 'undefined' && template.cssClasses != null) {
            $common.addCssClasses(elt, template.cssClasses);
        }

        // events are added to the dom element using $addHandlers
        if (typeof (template.events) !== 'undefined' && template.events != null) {
            $addHandlers(elt, template.events);
        }

        // if the element is visible or not its visibility is set
        if (typeof (template.visible) !== 'undefined' && template.visible != null) {
            this.setVisible(elt, template.visible);
        }

        // if we have an appendToParent we will now append to it
        if (appendToParent) {
            appendToParent.appendChild(elt);
        }

        // if we have opacity, apply it
        if (typeof (template.opacity) !== 'undefined' && template.opacity != null) {
            $common.setElementOpacity(elt, template.opacity);
        }

        // if we have child templates, process them
        if (typeof (template.children) !== 'undefined' && template.children != null) {
            for (var i = 0; i < template.children.length; i++) {
                var subtemplate = template.children[i];
                $common.createElementFromTemplate(subtemplate, elt, nameTable);
            }
        }

        // if we have a content presenter for the element get it (the element itself is the default presenter for content)
        var contentPresenter = elt;
        if (typeof (template.contentPresenter) !== 'undefined' && template.contentPresenter != null) {
            contentPresenter = nameTable[contentPresenter];
        }

        // if we have content, add it
        if (typeof (template.content) !== 'undefined' && template.content != null) {
            var content = template.content;
            if (String.isInstanceOfType(content)) {
                content = nameTable[content];
            }
            if (content.parentNode) {
                $common.wrapElement(content, elt, contentPresenter);
            } else {
                contentPresenter.appendChild(content);
            }
        }

        // return the created element
        return elt;
    },

    prepareHiddenElementForATDeviceUpdate: function() {
        // JAWS, an Assistive Technology device responds to updates to form elements 
        // and refreshes its document buffer to what is showing live
        // in the browser. To ensure that Toolkit controls that make XmlHttpRequests to
        // retrieve content are useful to users with visual disabilities, we update a
        // hidden form element to ensure that JAWS conveys what is in
        // the browser. See this article for more details: 
        // http://juicystudio.com/article/improving-ajax-applications-for-jaws-users.php
        // This method creates a hidden input on the screen for any page that uses a Toolkit
        // control that will perform an XmlHttpRequest.
        var objHidden = document.getElementById('hiddenInputToUpdateATBuffer_CommonToolkitScripts');
        if (!objHidden) {
            var objHidden = document.createElement('input');
            objHidden.setAttribute('type', 'hidden');
            objHidden.setAttribute('value', '1');
            objHidden.setAttribute('id', 'hiddenInputToUpdateATBuffer_CommonToolkitScripts');
            objHidden.setAttribute('name', 'hiddenInputToUpdateATBuffer_CommonToolkitScripts');
            if (document.forms[0]) {
                document.forms[0].appendChild(objHidden);
            }
        }
    },

    updateFormToRefreshATDeviceBuffer: function() {
        // Updates the hidden buffer to ensure that the latest document stream is picked up
        // by the screen reader.
        var objHidden = document.getElementById('hiddenInputToUpdateATBuffer_CommonToolkitScripts');

        if (objHidden) {
            if (objHidden.getAttribute('value') == '1') {
                objHidden.setAttribute('value', '0');
            } else {
                objHidden.setAttribute('value', '1');
            }
        }
    },

    appendElementToFormOrBody: function(element) {
        // Tries to append an element to the current form. If no form exists, the element will be appended to the body element.
        // "element" - the element to append.
        if (document.forms && document.forms[0]) {
            document.forms[0].appendChild(element);
        } else {
            document.body.appendChild(element);
        }
    },

    setText: function (element, text) {
        if (document.all)
            element.innerText = text;
        else
            element.textContent = text;
    }
}

// Create the singleton instance of the CommonToolkitScripts
CommonToolkitScripts = Sys.Extended.UI.CommonToolkitScripts = new Sys.Extended.UI._CommonToolkitScripts();
$common = CommonToolkitScripts;

// Alias functions that were moved from BlockingScripts into Common
Sys.UI.DomElement.getVisible = $common.getVisible;
Sys.UI.DomElement.setVisible = $common.setVisible;
Sys.UI.Control.overlaps = $common.overlaps;

Sys.Extended.UI._DomUtility = function() {
    // Utility functions for manipulating the DOM
}
Sys.Extended.UI._DomUtility.prototype = {
    isDescendant : function(ancestor, descendant) {
        // Whether the specified element is a descendant of the ancestor
        // "ancestor" - ancestor node
        // "descendant" - possible descendant node
        
        for (var n = descendant.parentNode; n != null; n = n.parentNode) {
            if (n == ancestor) return true;
        }
        return false;
    },
    isDescendantOrSelf : function(ancestor, descendant) {
        // Whether the specified element is a descendant of the ancestor or the same as the ancestor
        // "ancestor" - ancestor node
        // "descendant" - possible descendant node

        if (ancestor === descendant) 
            return true;
        return Sys.Extended.UI.DomUtility.isDescendant(ancestor, descendant);
    },
    isAncestor : function(descendant, ancestor) {
        // Whether the specified element is an ancestor of the descendant
        // "descendant" - descendant node
        // "ancestor" - possible ancestor node

        return Sys.Extended.UI.DomUtility.isDescendant(ancestor, descendant);
    },
    isAncestorOrSelf : function(descendant, ancestor) {
        // Whether the specified element is an ancestor of the descendant or the same as the descendant
        // "descendant" - descendant node
        // "ancestor" - possible ancestor node
        
        if (descendant === ancestor)
            return true;
            
        return Sys.Extended.UI.DomUtility.isDescendant(ancestor, descendant);
    },
    isSibling : function(self, sibling) {
        // Whether the specified element is a sibling of the self element
        // "self" - self node
        // "sibling" - possible sibling node        
        
        var parent = self.parentNode;
        for (var i = 0; i < parent.childNodes.length; i++) {
            if (parent.childNodes[i] == sibling) return true;
        }
        return false;
    }
}
Sys.Extended.UI._DomUtility.registerClass("Sys.Extended.UI._DomUtility");
Sys.Extended.UI.DomUtility = new Sys.Extended.UI._DomUtility();


Sys.Extended.UI.TextBoxWrapper = function(element) {
    // Class that wraps a TextBox (INPUT type="text") to abstract-out the
    // presence of a watermark (which may be visible to the user but which
    // should never be read by script.
    // "element" - the DOM element the behavior is associated with
    Sys.Extended.UI.TextBoxWrapper.initializeBase(this, [element]);
    this._current = element.value;
    this._watermark = null;
    this._isWatermarked = false;
}

Sys.Extended.UI.TextBoxWrapper.prototype = {

    dispose : function() {
        this.get_element().TextBoxWrapper = null;
        Sys.Extended.UI.TextBoxWrapper.callBaseMethod(this, 'dispose');
    },

    get_Current : function() {
        // Current value actually in the TextBox (i.e., TextBox.value)
        this._current = this.get_element().value;
        return this._current;
    },
    set_Current : function(value) {
        this._current = value;
        this._updateElement();
    },

    get_Value : function() {
        // Conceptual "value" of the TextBox - its contents if no watermark is present
        // or "" if one is
        if (this.get_IsWatermarked()) {
            return "";
        } else {
            return this.get_Current();
        }
    },
    set_Value : function(text) {
        this.set_Current(text);
        if (!text || (0 == text.length)) {
            if (null != this._watermark) {
                this.set_IsWatermarked(true);
            }
        } else {
            this.set_IsWatermarked(false);
        }
    },

    get_Watermark : function() {
        // Text of the watermark for the TextBox
        return this._watermark;
    },
    set_Watermark : function(value) {
        this._watermark = value;
        this._updateElement();
    },

    get_IsWatermarked : function() {
        // true iff the TextBox is watermarked
        return this._isWatermarked;
    },
    set_IsWatermarked : function(isWatermarked) {
        if (this._isWatermarked != isWatermarked) {
            this._isWatermarked = isWatermarked;
            this._updateElement();
            this._raiseWatermarkChanged();
        }
    },

    _updateElement : function() {
        // Updates the actual contents of the TextBox according to what should be there
        var element = this.get_element();
        if (this._isWatermarked) {
            if (element.value != this._watermark) {
                element.value = this._watermark;
            }
        } else {
            if (element.value != this._current) {
                element.value = this._current;
            }
        }
    },

    add_WatermarkChanged : function(handler) {
        // Adds a handler for the WatermarkChanged event
        // "handler" - handler
        this.get_events().addHandler("WatermarkChanged", handler);
    },
    remove_WatermarkChanged : function(handler) {
        // Removes a handler for the WatermarkChanged event
        // "handler" - handler
        this.get_events().removeHandler("WatermarkChanged", handler);
    },
    _raiseWatermarkChanged : function() {
        // Raises the WatermarkChanged event
        var onWatermarkChangedHandler = this.get_events().getHandler("WatermarkChanged");
        if (onWatermarkChangedHandler) {
            onWatermarkChangedHandler(this, Sys.EventArgs.Empty);
        }
    }
}
Sys.Extended.UI.TextBoxWrapper.get_Wrapper = function(element) {
    // Gets (creating one if necessary) the TextBoxWrapper for the specified TextBox
    // Returns - TextBoxWrapper instance
    // "element" - textBox for which to get the wrapper
    
    if (null == element.TextBoxWrapper) {
        element.TextBoxWrapper = new Sys.Extended.UI.TextBoxWrapper(element);
    }
    return element.TextBoxWrapper;
}
Sys.Extended.UI.TextBoxWrapper.registerClass('Sys.Extended.UI.TextBoxWrapper', Sys.UI.Behavior);

Sys.Extended.UI.TextBoxWrapper.validatorGetValue = function(id) {
    // Wrapper for ASP.NET's validatorGetValue to return the value from the wrapper if present
    // Returns value from the wrapper or result of original ValidatorGetValue
    // "id" - id of the element
    
    var control = $get(id);
    if (control && control.TextBoxWrapper) {
        return control.TextBoxWrapper.get_Value();
    }
    return Sys.Extended.UI.TextBoxWrapper._originalValidatorGetValue(id);
}

// Wrap ASP.NET's ValidatorGetValue with Sys.Extended.UI.TextBoxWrapper.validatorGetValue
// to make validators work properly with watermarked TextBoxes
if (typeof(ValidatorGetValue) == 'function') {
    Sys.Extended.UI.TextBoxWrapper._originalValidatorGetValue = ValidatorGetValue;
    ValidatorGetValue = Sys.Extended.UI.TextBoxWrapper.validatorGetValue;
}


// Temporary fix null reference bug in Sys.CultureInfo._getAbbrMonthIndex
if (Sys.CultureInfo && Sys.CultureInfo.prototype._getAbbrMonthIndex) {
    Sys.CultureInfo.prototype._getAbbrMonthIndex = function(value) {
        if (!this._upperAbbrMonths) {
            this._upperAbbrMonths = this._toUpperArray(this.dateTimeFormat.AbbreviatedMonthNames);
        }
        return Array.indexOf(this._upperAbbrMonths, this._toUpper(value));
    }
    Sys.CultureInfo.CurrentCulture._getAbbrMonthIndex = Sys.CultureInfo.prototype._getAbbrMonthIndex;
    Sys.CultureInfo.InvariantCulture._getAbbrMonthIndex = Sys.CultureInfo.prototype._getAbbrMonthIndex;
}

Sys.Extended.UI.ScrollBars = function () { throw Error.invalidOperation(); }
Sys.Extended.UI.ScrollBars.prototype = {
    None: 0x00,
    Horizontal: 0x01,
    Vertical: 0x02,
    Both: 0x03,
    Auto: 0x04
}
Sys.Extended.UI.ScrollBars.registerEnum("Sys.Extended.UI.ScrollBars", false);