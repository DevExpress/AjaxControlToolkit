Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.BoxCorners = function() {
    throw Error.invalidOperation();
}

Sys.Extended.UI.BoxCorners.prototype = {
    None: 0x00,

    TopLeft: 0x01,
    TopRight: 0x02,
    BottomRight: 0x04,
    BottomLeft: 0x08,

    Top: 0x01 | 0x02,
    Right: 0x02 | 0x04,
    Bottom: 0x04 | 0x08,
    Left: 0x08 | 0x01,
    All: 0x01 | 0x02 | 0x04 | 0x08
}

Sys.Extended.UI.BoxCorners.registerEnum("Sys.Extended.UI.BoxCorners", true);

Sys.Extended.UI.RoundedCornersBehavior = function(element) {
    // The RoundedCornersBehavior rounds the corners of its target element
    // "element" - DOM element associated with the behavior
    Sys.Extended.UI.RoundedCornersBehavior.initializeBase(this, [element]);

    this._corners = Sys.Extended.UI.BoxCorners.All;
    this._radius = 5;
    this._color = null;
    this._parentDiv = null;
    this._originalStyle = null;
    this._borderColor = null;
    this._isDirty = true;
}

Sys.Extended.UI.RoundedCornersBehavior.prototype = {
    initialize: function() {
        Sys.Extended.UI.RoundedCornersBehavior.callBaseMethod(this, 'initialize');
        this.update();
    },

    dispose: function() {
        this.disposeParentDiv();
        Sys.Extended.UI.RoundedCornersBehavior.callBaseMethod(this, 'dispose');
    },

    update: function() {
        // Create the surrounding div that will have rounded corners
        var e = this.get_element();

        if(!e || !this._isDirty || this.get_isUpdating())
            return;

        this.disposeParentDiv();

        // This works with IE and latest versions of Chrome
        if(e.style.borderRadius != undefined) {
            e.style.borderRadius = this._radius + "px";

            // if border color is not none then set 
            // border style to solid and border width to 1px
            if(this._borderColor) {
                e.style.border = "solid";
                e.style.borderWidth = "1px";
                e.style.borderColor = this._borderColor;
            }
            else {
                e.style.border = "none";
                e.style.borderWidth = "0";
            }

            // if TopLeft corner is unchecked then Top left corner will not be round
            if(!this.isCornerSet(Sys.Extended.UI.BoxCorners.TopLeft))
                e.style.borderTopLeftRadius = "0";

            // if BottomLeft corner is unchecked then Bottom left corner will not be round
            if(!this.isCornerSet(Sys.Extended.UI.BoxCorners.BottomLeft))
                e.style.borderBottomLeftRadius = "0";

            // if TopRight corner is unchecked then Top right corner will not be round
            if(!this.isCornerSet(Sys.Extended.UI.BoxCorners.TopRight))
                e.style.borderTopRightRadius = "0";

            // if BottomRight corner is unchecked then Bottom Right corner will not be round
            if(!this.isCornerSet(Sys.Extended.UI.BoxCorners.BottomRight))
                e.style.borderBottomRightRadius = "0";
        }
            // This works with FireFox
        else if(e.style.MozBorderRadius != undefined) {
            e.style.MozBorderRadius = this._radius + "px";

            // if border color is not none then set 
            // border style to solid and border width to 1px
            if(this._borderColor) {
                e.style.border = "solid";
                e.style.borderWidth = "1px";
                e.style.borderColor = this._borderColor;
            } else {
                e.style.border = "none";
                e.style.borderWidth = "0";
            }

            // if TopLeft corner is unchecked then Top left corner will not be round                                        
            if(!this.isCornerSet(Sys.Extended.UI.BoxCorners.TopLeft))
                e.style.MozBorderRadiusTopleft = "0";

            // if BottomLeft corner is unchecked then Bottom left corner will not be round
            if(!this.isCornerSet(Sys.Extended.UI.BoxCorners.BottomLeft))
                e.style.MozBorderRadiusBottomleft = "0";

            // if TopRight corner is unchecked then Top right corner will not be round
            if(!this.isCornerSet(Sys.Extended.UI.BoxCorners.TopRight))
                e.style.MozBorderRadiusTopright = "0";

            // if BottomRight corner is unchecked then Bottom Right corner will not be round
            if(!this.isCornerSet(Sys.Extended.UI.BoxCorners.BottomRight))
                e.style.MozBorderRadiusBottomright = "0";

        }
            // This works with older versions of google Chrome
        else if(e.style.WebkitBorderRadius != undefined) {
            e.style.WebkitBorderRadius = this._radius + "px";

            // if border color is not none then set 
            // border style to solid and border width to 1px
            if(this._borderColor) {
                e.style.border = "solid";
                e.style.borderWidth = "1px";
                e.style.borderColor = this._borderColor;
            } else {
                e.style.border = "none";
                e.style.borderWidth = "0";
            }

            // if TopLeft corner is unchecked then Top left corner will not be round                                        
            if(!this.isCornerSet(Sys.Extended.UI.BoxCorners.TopLeft))
                e.style.WebkitBorderRadiusTopLeft = "0";

            // if BottomLeft corner is unchecked then Bottom left corner will not be round
            if(!this.isCornerSet(Sys.Extended.UI.BoxCorners.BottomLeft))
                e.style.WebkitBorderRadiusBottomLeft = "0";

            // if TopRight corner is unchecked then Top right corner will not be round
            if(!this.isCornerSet(Sys.Extended.UI.BoxCorners.TopRight))
                e.style.WebkitBorderRadiusTopRight = "0";

            // if BottomRight corner is unchecked then Bottom Right corner will not be round
            if(!this.isCornerSet(Sys.Extended.UI.BoxCorners.BottomRight))
                e.style.WebkitBorderRadiusBottomRight = "0";
        }
            // if browser does not support css3 then continue old way to make corners round
        else {
            var color = this.getBackgroundColor(),
                originalWidth = e.offsetWidth,
                newParent = e.cloneNode(false);

            // move all children into the new div.
            this.moveChildren(e, newParent);

            // modify the target element to be transparent
            // and set up the new parent
            this._originalStyle = e.style.cssText;
            e.style.backgroundColor = "transparent";
            e.style.verticalAlign = "top";
            e.style.padding = "0";
            e.style.overflow = "";
            e.style.className = "";

            // Don't assume there is a numerical value for height.  A height of "auto" is possible.
            if(e.style.height && e.style.height != "auto")
                // Increase the height to account for the rounded corners
                e.style.height = parseInt($common.getCurrentStyle(e, 'height')) + (this._radius * 2) + "px";
            else
                // Note: Do NOT use $common.getCurrentStyle in the check below
                // because that breaks the work-around
                if(!e.style.width && (0 < originalWidth))
                    // The following line works around a problem where IE renders the first
                    // rounded DIV about 6 pixels too high if e doesn't have a width or height
                    e.style.width = originalWidth + "px";

            // these are properties we don't want cloned down to the new parent
            newParent.style.position = "";
            newParent.style.border = "";
            newParent.style.margin = "";
            newParent.style.width = "100%";
            if((newParent.style.overflow == "") && ($common.getCurrentStyle(e, "overflow") == "visible"))
                // If the style of the target element has not been set inline, 
                // and has not been set in a stylesheet to something other than "visible" 
                // (which is the default), then set it to "auto", so that any child block elements
                // do not cause the rounded corner divs to display as separated from the target div  
                newParent.style.overflow = "auto";

            newParent.id = "";
            newParent.removeAttribute("control");

            if(this._borderColor) {
                newParent.style.borderTopStyle = "none";
                newParent.style.borderBottomStyle = "none";
                newParent.style.borderLeftStyle = "solid";
                newParent.style.borderRightStyle = "solid";
                newParent.style.borderLeftColor = this._borderColor;
                newParent.style.borderRightColor = this._borderColor;
                newParent.style.borderLeftWidth = "1px";
                newParent.style.borderRightWidth = "1px";

                if(this._radius == 0) {
                    newParent.style.borderTopStyle = "solid";
                    newParent.style.borderBottomStyle = "solid";
                    newParent.style.borderTopColor = this._borderColor;
                    newParent.style.borderBottomColor = this._borderColor;
                    newParent.style.borderTopWidth = "1px";
                    newParent.style.borderBottomWidth = "1px";
                }
            } else {
                newParent.style.borderTopStyle = "none";
                newParent.style.borderBottomStyle = "none";
                newParent.style.borderLeftStyle = "none";
                newParent.style.borderRightStyle = "none";
            }

            // build a set of steps on each end to fake the corners.
            //  ------- (step 0)
            //  -------- (step n-1)
            //  --------- (step n)
            //  XXXXXXXXX (inner div)
            //  XXXXXXXXX
            //  --------- (bottom step n)
            //  --------  (bottom step n-1)
            //  ------    (bottom step 0)

            var lastDiv = null,
                radius = this._radius,
                lines = this._radius,
                lastDelta = 0;

            for(var i = lines; i > 0; i--) {
                // figure out how much we'll need to subtract from each item
                var angle = Math.acos(i / radius),
                    delta = radius - Math.round(Math.sin(angle) * radius);

                // build a 1 pixel tall div
                // that's delta pixels shorter on each end.

                // add the top one
                var newDiv = document.createElement("DIV");
                newDiv.__roundedDiv = true;
                newDiv.style.backgroundColor = color;
                newDiv.style.marginLeft = delta + "px";
                newDiv.style.marginRight = (delta - (this._borderColor ? 2 : 0)) + "px";
                newDiv.style.height = "1px";
                newDiv.style.fontSize = "1px"; // workaround for IE wierdness with 1px divs.
                newDiv.style.overflow = "hidden";

                if(this._borderColor) {
                    newDiv.style.borderLeftStyle = "solid";
                    newDiv.style.borderRightStyle = "solid";
                    newDiv.style.borderLeftColor = this._borderColor;
                    newDiv.style.borderRightColor = this._borderColor;

                    var offset = Math.max(0, lastDelta - delta - 1);
                    newDiv.style.borderLeftWidth = (offset + 1) + "px";
                    newDiv.style.borderRightWidth = (offset + 1) + "px";

                    if(i == lines) {
                        newDiv.__roundedDivNoBorder = true;
                        newDiv.style.backgroundColor = this._borderColor;
                    }
                }

                e.insertBefore(newDiv, lastDiv);

                var topDiv = newDiv;

                // add the bottom one one
                newDiv = newDiv.cloneNode(true);
                newDiv.__roundedDiv = true;

                e.insertBefore(newDiv, lastDiv);

                var bottomDiv = newDiv;

                lastDiv = newDiv;
                lastDelta = delta;

                if(!this.isCornerSet(Sys.Extended.UI.BoxCorners.TopLeft)) {
                    topDiv.style.marginLeft = "0";
                    if(this._borderColor)
                        topDiv.style.borderLeftWidth = "1px";
                }
                if(!this.isCornerSet(Sys.Extended.UI.BoxCorners.TopRight)) {
                    topDiv.style.marginRight = "0";
                    if(this._borderColor) {
                        topDiv.style.borderRightWidth = "1px";
                        topDiv.style.marginRight = "-2px";
                    }
                }
                if(!this.isCornerSet(Sys.Extended.UI.BoxCorners.BottomLeft)) {
                    bottomDiv.style.marginLeft = "0";
                    if(this._borderColor)
                        bottomDiv.style.borderLeftWidth = "1px";
                }
                if(!this.isCornerSet(Sys.Extended.UI.BoxCorners.BottomRight)) {
                    bottomDiv.style.marginRight = "0";
                    if(this._borderColor) {
                        bottomDiv.style.borderRightWidth = "1px";
                        bottomDiv.style.marginRight = "-2px";
                    }
                }
            }

            // finally, add the newParent (which has all the original content)
            // into the div.
            e.insertBefore(newParent, lastDiv);
            this._parentDiv = newParent;
            this._isDirty = false;
        }
    },

    disposeParentDiv: function() {
        // Dispose the surrounding div with rounded corners

        if(this._parentDiv) {
            // clean up the divs we added.
            var e = this.get_element(),
                children = e.childNodes;

            for(var i = children.length - 1; i >= 0; i--) {
                var child = children[i];
                if(child) {
                    if(child == this._parentDiv)
                        this.moveChildren(child, e);

                    try {
                        e.removeChild(child);
                    } catch(e) {
                        // Safari likes to throw NOT_FOUND_ERR (DOMException 8)
                        // but it seems to work fine anyway.
                    }
                }
            }

            // restore the original style
            if(this._originalStyle) {
                e.style.cssText = this._originalStyle;
                this._originalStyle = null;
            }
            this._parentDiv = null;
        }
    },

    /// <summary>
    /// Returns the background color of the target element
    /// </summary>
    /// <returns type="String">String contains the color of the target element</returns>
    /// <member name="cM:AjaxControlToolkit.RoundedCornersExtender.getBackgroundColor" />
    getBackgroundColor: function() {
        if(this._color)
            return this._color;
        return $common.getCurrentStyle(this.get_element(), 'backgroundColor');
    },

    moveChildren: function(src, dest) {
        // Move the child nodes from one element to another
        // "src" - DOM Element
        // "dest" - DOM Element
        var moveCount = 0;
        while(src.hasChildNodes()) {
            var child = src.childNodes[0];
            child = src.removeChild(child);
            dest.appendChild(child);
            moveCount++;
        }
        return moveCount;
    },

    /// <summary>
    /// Checks whether a flag for this corner has been set
    /// </summary>
    /// <param name="corner" type="Sys.Extended.UI.BoxCorners">Corner to check</param>
    /// <returns type="Boolean">True if the corner has been set; otherwise, false</returns>
    /// <member name="cM:AjaxControlToolkit.RoundedCornersExtender.isCornerSet" />
    isCornerSet: function(corner) {
        return (this._corners & corner) != Sys.Extended.UI.BoxCorners.None;
    },

    /// <summary>
    /// Sets a corner as one that should be rounded
    /// </summary>
    /// <param name="corner" type="Sys.Extended.UI.BoxCorners">Corner to set</param>
    /// <param name="value" type="Boolean">True to set the value, false to clear it</param>
    /// <member name="cM:AjaxControlToolkit.RoundedCornersExtender.setCorner" />
    setCorner: function(corner, value) {
        if(value)
            this.set_corners(this._corners | corner);
        else
            this.set_corners(this._corners & ~corner);
    },

    /// <summary>
    /// A string that contains the background color of the rounded corner areas
    /// </summary>
    /// <remarks>
    /// By default, this property gets the background color of the panel that it is attached to
    /// </remarks>
    /// <getter>get_color</getter>
    /// <setter>set_color</setter>
    /// <member name="cP:AjaxControlToolkit.RoundedCornersExtender.color" />
    get_color: function() {
        return this._color;
    },
    set_color: function(value) {
        if(value != this._color) {
            this._color = value;
            this._isDirty = true;
            this.update();
            this.raisePropertyChanged('color');
        }
    },

    get_Color: function() {
        Sys.Extended.Deprecated("get_Color()", "get_color()");
        return this.get_color();
    },
    set_Color: function(value) {
        Sys.Extended.Deprecated("set_Color(value)", "set_color(value)");
        this.set_color(value);
    },

    /// <summary>
    /// An integer value that specifies the radius of the corners (and the height of the added area). The default is 5
    /// The default is 5
    /// </summary>
    /// <getter>get_radius</getter>
    /// <setter>set_radius</setter>
    /// <member name="cP:AjaxControlToolkit.RoundedCornersExtender.radius" />
    get_radius: function() {
        return this._radius;
    },
    set_radius: function(value) {
        if(value != this._radius) {
            this._radius = value;
            this._isDirty = true;
            this.update();
            this.raisePropertyChanged('radius');
        }
    },

    get_Radius: function() {
        Sys.Extended.Deprecated("get_Radius()", "get_radius()");
        return this.get_radius();
    },
    set_Radius: function(value) {
        Sys.Extended.Deprecated("set_Radius(value)", "set_radius(value)");
        this.set_radius(value);
    },

    /// <summary>
    /// A Sys.Extended.UI.BoxCorners object that specifies which corners should be rounded
    /// </summary>
    /// <getter>get_corners</getter>
    /// <setter>set_corners</setter>
    /// <member name="cP:AjaxControlToolkit.RoundedCornersExtender.corners" />
    get_corners: function() {
        return this._corners;
    },
    set_corners: function(value) {
        if(value != this._corners) {
            this._corners = value;
            this._isDirty = true;
            this.update();
            this.raisePropertyChanged("corners");
        }
    },

    get_Corners: function() {
        Sys.Extended.Deprecated("get_Corners()", "get_corners()");
        return this.get_corners();
    },
    set_Corners: function(value) {
        Sys.Extended.Deprecated("set_Corners(value)", "set_corners(value)");
        this.set_corners(value);
    },

    /// <summary>
    /// A string that contains the color of the border and therefore of the rounded corners
    /// </summary>
    /// <getter>get_borderColor</getter>
    /// <setter>set_borderColor</setter>
    /// <member name="cP:AjaxControlToolkit.RoundedCornersExtender.borderColor" />
    get_borderColor: function() {
        return this._borderColor;
    },
    set_borderColor: function(value) {
        if(value != this._borderColor) {
            this._borderColor = value;
            this._isDirty = true;
            this.update();
            this.raisePropertyChanged("borderColor");
        }
    },

    get_BorderColor: function() {
        Sys.Extended.Deprecated("get_BorderColor()", "get_borderColor()");
        return this.get_borderColor();
    },
    set_BorderColor: function(value) {
        Sys.Extended.Deprecated("set_BorderColor(value)", "set_borderColor(value)");
        this.set_borderColor(value);
    }
}

Sys.Extended.UI.RoundedCornersBehavior.registerClass('Sys.Extended.UI.RoundedCornersBehavior', Sys.Extended.UI.BehaviorBase);