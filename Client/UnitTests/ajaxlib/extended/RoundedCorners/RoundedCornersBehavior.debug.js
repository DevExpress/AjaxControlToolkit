// (c) 2010 CodePlex Foundation


/// <reference name="MicrosoftAjax.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />

(function () {
    var scriptName = "ExtendedRoundedCorners";

    function execute() {

        Type.registerNamespace('Sys.Extended.UI');

        Sys.Extended.UI.BoxCorners = function () {
            /// <summary>
            /// Corners of an element
            /// </summary>
            /// <field name="None" type="Number" integer="true" />
            /// <field name="TopLeft" type="Number" integer="true" />
            /// <field name="TopRight" type="Number" integer="true" />
            /// <field name="BottomRight" type="Number" integer="true" />
            /// <field name="BottomLeft" type="Number" integer="true" />
            /// <field name="Top" type="Number" integer="true" />
            /// <field name="Right" type="Number" integer="true" />
            /// <field name="Bottom" type="Number" integer="true" />
            /// <field name="Left" type="Number" integer="true" />
            /// <field name="All" type="Number" integer="true" />
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


        Sys.Extended.UI.RoundedCornersBehavior = function (element) {
            /// <summary>
            /// The RoundedCornersBehavior rounds the corners of its target element
            /// </summary>
            /// <param name="element" type="Sys.UI.DomElement" domElement="true">
            /// DOM element associated with the behavior
            /// </param>
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
            initialize: function () {
                /// <summary>
                /// Initialize the behavior
                /// </summary>
                Sys.Extended.UI.RoundedCornersBehavior.callBaseMethod(this, 'initialize');
                this.update();
            },

            dispose: function () {
                /// <summary>
                /// Dispose the behavior
                /// </summary>

                this.disposeParentDiv();
                Sys.Extended.UI.RoundedCornersBehavior.callBaseMethod(this, 'dispose');
            },

            update: function () {
                /// <summary>
                /// Create the surrounding div that will have rounded corners
                /// </summary>
                var e = this.get_element();

                if (!e || !this._isDirty || this.get_isUpdating()) return;

                this.disposeParentDiv();


                if (e.style.borderRadius != undefined) {
                    e.style.borderRadius = this._radius + "px";

                    if (this._borderColor) {
                        e.style.border = "solid";
                        e.style.borderWidth = "1px";
                        e.style.borderColor = this._borderColor;
                    }
                    else {
                        e.style.border = "none";
                        e.style.borderWidth = "0px";
                    }

                    if (!this.isCornerSet(Sys.Extended.UI.BoxCorners.TopLeft)) {
                        e.style.borderTopLeftRadius = "0px";
                    }

                    if (!this.isCornerSet(Sys.Extended.UI.BoxCorners.BottomLeft)) {
                        e.style.borderBottomLeftRadius = "0px";
                    }

                    if (!this.isCornerSet(Sys.Extended.UI.BoxCorners.TopRight)) {
                        e.style.borderTopRightRadius = "0px";
                    }

                    if (!this.isCornerSet(Sys.Extended.UI.BoxCorners.BottomRight)) {
                        e.style.borderBottomRightRadius = "0px";
                    }

                }
                else if (e.style.MozBorderRadius != undefined) {
                    e.style.MozBorderRadius = this._radius + "px";

                    if (this._borderColor) {
                        e.style.border = "solid";
                        e.style.borderWidth = "1px";
                        e.style.borderColor = this._borderColor;
                    }
                    else {
                        e.style.border = "none";
                        e.style.borderWidth = "0px";
                    }

                    if (!this.isCornerSet(Sys.Extended.UI.BoxCorners.TopLeft)) {
                        e.style.MozBorderRadiusTopleft = "0px";
                    }

                    if (!this.isCornerSet(Sys.Extended.UI.BoxCorners.BottomLeft)) {
                        e.style.MozBorderRadiusBottomleft = "0px";
                    }

                    if (!this.isCornerSet(Sys.Extended.UI.BoxCorners.TopRight)) {
                        e.style.MozBorderRadiusTopright = "0px";
                    }

                    if (!this.isCornerSet(Sys.Extended.UI.BoxCorners.BottomRight)) {
                        e.style.MozBorderRadiusBottomright = "0px";
                    }

                }
                else if (e.style.WebkitBorderRadius != undefined) {
                    e.style.WebkitBorderRadius = this._radius + "px";

                    if (this._borderColor) {
                        e.style.border = "solid";
                        e.style.borderWidth = "1px";
                        e.style.borderColor = this._borderColor;
                    }
                    else {
                        e.style.border = "none";
                        e.style.borderWidth = "0px";
                    }

                    if (!this.isCornerSet(Sys.Extended.UI.BoxCorners.TopLeft)) {
                        e.style.WebkitBorderRadiusTopLeft = "0px";
                    }

                    if (!this.isCornerSet(Sys.Extended.UI.BoxCorners.BottomLeft)) {
                        e.style.WebkitBorderRadiusBottomLeft = "0px";
                    }

                    if (!this.isCornerSet(Sys.Extended.UI.BoxCorners.TopRight)) {
                        e.style.WebkitBorderRadiusTopRight = "0px";
                    }

                    if (!this.isCornerSet(Sys.Extended.UI.BoxCorners.BottomRight)) {
                        e.style.WebkitBorderRadiusBottomRight = "0px";
                    }
                }
                else {

                    var color = this.getBackgroundColor();
                    var originalWidth = e.offsetWidth;
                    var newParent = e.cloneNode(false);

                    this.moveChildren(e, newParent);

                    this._originalStyle = e.style.cssText;
                    e.style.backgroundColor = "transparent";
                    e.style.verticalAlign = "top";
                    e.style.padding = "0";
                    e.style.overflow = "";
                    e.style.className = "";
                    if (e.style.height && e.style.height != "auto") {
                        e.style.height = parseInt($common.getCurrentStyle(e, 'height')) + (this._radius * 2) + "px";
                    } else {
                        if (!e.style.width && (0 < originalWidth)) {
                            e.style.width = originalWidth + "px";
                        }
                    }

                    newParent.style.position = "";
                    newParent.style.border = "";
                    newParent.style.margin = "";
                    newParent.style.width = "100%";
                    if ((newParent.style.overflow == "") && ($common.getCurrentStyle(e, "overflow") == "visible")) {
                        newParent.style.overflow = "auto";
                    }
                    newParent.id = "";
                    newParent.removeAttribute("control");

                    if (this._borderColor) {
                        newParent.style.borderTopStyle = "none";
                        newParent.style.borderBottomStyle = "none";
                        newParent.style.borderLeftStyle = "solid";
                        newParent.style.borderRightStyle = "solid";
                        newParent.style.borderLeftColor = this._borderColor;
                        newParent.style.borderRightColor = this._borderColor;
                        newParent.style.borderLeftWidth = "1px";
                        newParent.style.borderRightWidth = "1px";
                        if (this._radius == 0) {
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


                    var lastDiv = null;
                    var radius = this._radius;
                    var lines = this._radius;
                    var lastDelta = 0;

                    for (var i = lines; i > 0; i--) {

                        var angle = Math.acos(i / radius);
                        var delta = radius - Math.round(Math.sin(angle) * radius);


                        var newDiv = document.createElement("DIV");
                        newDiv.__roundedDiv = true;
                        newDiv.style.backgroundColor = color;
                        newDiv.style.marginLeft = delta + "px";
                        newDiv.style.marginRight = (delta - (this._borderColor ? 2 : 0)) + "px";
                        newDiv.style.height = "1px";
                        newDiv.style.fontSize = "1px"; // workaround for IE wierdness with 1px divs.
                        newDiv.style.overflow = "hidden";

                        if (this._borderColor) {
                            newDiv.style.borderLeftStyle = "solid";
                            newDiv.style.borderRightStyle = "solid";
                            newDiv.style.borderLeftColor = this._borderColor;
                            newDiv.style.borderRightColor = this._borderColor;

                            var offset = Math.max(0, lastDelta - delta - 1);
                            newDiv.style.borderLeftWidth = (offset + 1) + "px";
                            newDiv.style.borderRightWidth = (offset + 1) + "px";

                            if (i == lines) {
                                newDiv.__roundedDivNoBorder = true;
                                newDiv.style.backgroundColor = this._borderColor;
                            }
                        }

                        e.insertBefore(newDiv, lastDiv);

                        var topDiv = newDiv;

                        newDiv = newDiv.cloneNode(true);
                        newDiv.__roundedDiv = true;

                        e.insertBefore(newDiv, lastDiv);

                        var bottomDiv = newDiv;

                        lastDiv = newDiv;
                        lastDelta = delta;

                        if (!this.isCornerSet(Sys.Extended.UI.BoxCorners.TopLeft)) {
                            topDiv.style.marginLeft = "0";
                            if (this._borderColor) {
                                topDiv.style.borderLeftWidth = "1px";
                            }
                        }
                        if (!this.isCornerSet(Sys.Extended.UI.BoxCorners.TopRight)) {
                            topDiv.style.marginRight = "0";
                            if (this._borderColor) {
                                topDiv.style.borderRightWidth = "1px";
                                topDiv.style.marginRight = "-2px";
                            }
                        }
                        if (!this.isCornerSet(Sys.Extended.UI.BoxCorners.BottomLeft)) {
                            bottomDiv.style.marginLeft = "0";
                            if (this._borderColor) {
                                bottomDiv.style.borderLeftWidth = "1px";
                            }
                        }
                        if (!this.isCornerSet(Sys.Extended.UI.BoxCorners.BottomRight)) {
                            bottomDiv.style.marginRight = "0";
                            if (this._borderColor) {
                                bottomDiv.style.borderRightWidth = "1px";
                                bottomDiv.style.marginRight = "-2px";
                            }
                        }
                    }

                    e.insertBefore(newParent, lastDiv);
                    this._parentDiv = newParent;
                    this._isDirty = false;
                }
            },

            disposeParentDiv: function () {
                /// <summary>
                /// Dispose the surrounding div with rounded corners
                /// </summary>

                if (this._parentDiv) {
                    var e = this.get_element();
                    var children = e.childNodes;
                    for (var i = children.length - 1; i >= 0; i--) {
                        var child = children[i];
                        if (child) {
                            if (child == this._parentDiv) {
                                this.moveChildren(child, e);
                            }
                            try {
                                e.removeChild(child);
                            } catch (e) {
                            }
                        }
                    }

                    if (this._originalStyle) {
                        e.style.cssText = this._originalStyle;
                        this._originalStyle = null;
                    }
                    this._parentDiv = null;
                }
            },

            getBackgroundColor: function () {
                /// <summary>
                /// Get the background color of the target element
                /// </summary>
                if (this._color) {
                    return this._color;
                }
                return $common.getCurrentStyle(this.get_element(), 'backgroundColor');
            },

            moveChildren: function (src, dest) {
                /// <summary>
                /// Move the child nodes from one element to another
                /// </summary>
                /// <param name="src" type="Sys.UI.DomElement" domElement="true">
                /// DOM Element
                /// </param>
                /// <param name="dest" type="Sys.UI.DomElement" domElement="true">
                /// DOM Element
                /// </param>

                var moveCount = 0;
                while (src.hasChildNodes()) {
                    var child = src.childNodes[0];
                    child = src.removeChild(child);
                    dest.appendChild(child);
                    moveCount++;
                }
                return moveCount;
            },

            isCornerSet: function (corner) {
                /// <summary>
                /// Check whether the a flag for this corner has been set
                /// </summary>
                /// <param name="corner" type="AjaxControlTooolkit.BoxCorners">
                /// Corner to check
                /// </param>
                /// <returns type="Boolean">
                /// True if it is included in the flags, false otherwise
                /// </returns>
                return (this._corners & corner) != Sys.Extended.UI.BoxCorners.None;
            },

            setCorner: function (corner, value) {
                /// <summary>
                /// Set a corner as one that should be rounded
                /// </summary>
                /// <param name="corner" type="Sys.Extended.UI.BoxCorners">
                /// Corner to set
                /// </param>
                /// <param name="value" type="Boolean">
                /// True to set the value, False to clear it
                /// </param>
                if (value) {
                    this.set_Corners(this._corners | corner);
                } else {
                    this.set_Corners(this._corners & ~corner);
                }
            },

            get_Color: function () {
                /// <value type="String">
                /// The background color of the rounded area an corners.  By default this picks up the background color of the panel that it is attached to.
                /// </value>
                return this._color;
            },
            set_Color: function (value) {
                if (value != this._color) {
                    this._color = value;
                    this._isDirty = true;
                    this.update();
                    this.raisePropertyChanged('Color');
                }
            },

            get_Radius: function () {
                /// <value type="Number" integer="true">
                /// The radius of the corners (and height of the added area).  Default is 5.
                /// </value>
                return this._radius;
            },
            set_Radius: function (value) {
                if (value != this._radius) {
                    this._radius = value;
                    this._isDirty = true;
                    this.update();
                    this.raisePropertyChanged('Radius');
                }
            },

            get_Corners: function () {
                /// <value type="Sys.Extended.UI.BoxCorners">
                /// Corners that should be rounded
                /// </value>
                return this._corners;
            },
            set_Corners: function (value) {
                if (value != this._corners) {
                    this._corners = value;
                    this._isDirty = true;
                    this.update();
                    this.raisePropertyChanged("Corners");
                }
            },

            get_BorderColor: function () {
                /// <value type="String">
                /// Color of the border (and hence the rounded corners)
                /// </value>
                return this._borderColor;
            },
            set_BorderColor: function (value) {
                if (value != this._borderColor) {
                    this._borderColor = value;
                    this._isDirty = true;
                    this.update();
                    this.raisePropertyChanged("BorderColor");
                }
            }
        }
        Sys.Extended.UI.RoundedCornersBehavior.registerClass('Sys.Extended.UI.RoundedCornersBehavior', Sys.Extended.UI.BehaviorBase);
        Sys.registerComponent(Sys.Extended.UI.RoundedCornersBehavior, { name: "rounded" });

    } // execute

    if (window.Sys && Sys.loader) {
        Sys.loader.registerScript(scriptName, ["ExtendedBase", "ExtendedCommon"], execute);
    }
    else {
        execute();
    }

})();
