Type.registerNamespace("Sys.Extended.UI.HtmlEditor.Popups");

Sys.Extended.UI.HtmlEditor.Popups.AttachedPopup = function(element) {
    Sys.Extended.UI.HtmlEditor.Popups.AttachedPopup.initializeBase(this, [element]);

    this._relatedElement = null;
}

Sys.Extended.UI.HtmlEditor.Popups.AttachedPopup.prototype = {

    get_relatedElement: function() {
        return this._relatedElement;
    },

    set_relatedElement: function(value) {
        this._relatedElement = value;
    },

    open: function(callback) {
        if(this._relatedElement != null) {
            var popup = this;

            if(!this.checkCorrectLoaded(function() { popup.open(callback); }))
                return;

            var location = $common.getLocation(this._relatedElement),
                x = location.x,
                y = location.y + this._relatedElement.offsetHeight;

            var element = this.get_element().parentNode;
            while(element && element.tagName && element.tagName.toUpperCase() != "BODY") {
                var position = Sys.Extended.UI.HtmlEditor.getStyle(element, "position");

                if(position == "absolute" || position == "fixed") {
                    var top = parseInt(Sys.Extended.UI.HtmlEditor.getStyle(element, "top")),
                        left = parseInt(Sys.Extended.UI.HtmlEditor.getStyle(element, "left"));

                    if(!isNaN(top) && !isNaN(left)) {
                        x -= left;
                        y -= top;
                    }
                    break;
                } else if(position == "relative") {
                    var relativeLocation = $common.getLocation(element);

                    x -= relativeLocation.x;
                    y -= relativeLocation.y;
                }
                element = element.parentNode;
            }

            var viewportElement = Sys.Extended.UI.HtmlEditor.getClientViewportElement(this._iframe),
                theVisibleWidth = viewportElement.clientWidth + viewportElement.scrollLeft,
                theVisibleHeight = viewportElement.clientHeight + viewportElement.scrollTop;

            if(y < viewportElement.scrollTop)
                y = viewportElement.scrollTop;
            if(x < viewportElement.scrollLeft)
                x = viewportElement.scrollLeft;

            if(y + this._iframe.offsetHeight > theVisibleHeight)
                y -= y + this._iframe.offsetHeight - theVisibleHeight;
            if(x + this._iframe.offsetWidth > theVisibleWidth)
                x -= x + this._iframe.offsetWidth - theVisibleWidth;

            Sys.Extended.UI.HtmlEditor.Popups.AttachedPopup.callBaseMethod(this, "open", [callback, y, x]);
        }
    },

    close: function(callback) {
        Sys.Extended.UI.HtmlEditor.Popups.AttachedPopup.callBaseMethod(this, "close", [callback]);
    },

    initialize: function() {
        Sys.Extended.UI.HtmlEditor.Popups.AttachedPopup.callBaseMethod(this, "initialize");
    },

    dispose: function() {
        Sys.Extended.UI.HtmlEditor.Popups.AttachedPopup.callBaseMethod(this, "dispose");
    }
}

Sys.Extended.UI.HtmlEditor.Popups.AttachedPopup.registerClass("Sys.Extended.UI.HtmlEditor.Popups.AttachedPopup", Sys.Extended.UI.HtmlEditor.Popups.Popup);