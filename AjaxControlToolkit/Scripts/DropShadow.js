Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.DropShadowBehavior = function(element) {
    // The DropShadowBehavior is used to attach a drop shadow to the element
    // "element" - DOM Element the behavior is associated with
    Sys.Extended.UI.DropShadowBehavior.initializeBase(this, [element]);

    // our property values
    this._opacity = 1.0;
    this._width = 5;

    // the div we create for the shadow.
    this._shadowDiv = null;

    // our timer for tracking position
    this._trackPosition = null;
    this._trackPositionDelay = 50;
    this._timer = null;
    this._tickHandler = null;
    this._roundedBehavior = null;
    this._shadowRoundedBehavior = null;

    this._rounded = false;
    this._radius = 5;

    // our cache of our last size and position for tracking
    this._lastX = null;
    this._lastY = null;
    this._lastW = null;
    this._lastH = null;
}

Sys.Extended.UI.DropShadowBehavior.prototype = {

    initialize: function() {
        Sys.Extended.UI.DropShadowBehavior.callBaseMethod(this, 'initialize');

        e = this.get_element();

        // flip the styles position to relative so that we z-order properly.
        if($common.getCurrentStyle(e, 'position', e.style.position) != "absolute")
            e.style.position = "relative";

        // set up our initial state
        if(this._rounded)
            this.setupRounded();

        if(this._trackPosition)
            this.startTimer();

        this.setShadow();
    },

    dispose: function() {
        this.stopTimer();
        this.disposeShadowDiv();

        Sys.Extended.UI.DropShadowBehavior.callBaseMethod(this, 'dispose');
    },

    buildShadowDiv: function() {
        // Create the div that we'll use as the shadow
        e = this.get_element();

        if(!this.get_isInitialized() || !e || !this._width)
            return;

        // check if browser does not support css3
        if(e.style.boxShadow == undefined && e.style.MozBoxShadow == undefined && e.style.WebkitBoxShadow == undefined) {
            var div = document.createElement("DIV");

            div.style.backgroundColor = "black";
            div.style.position = "absolute";

            if(e.id)
                div.id = e.id + "_DropShadow";

            // initialize a control around it, and
            // set up the opacity behavior and rounding
            this._shadowDiv = div;

            e.parentNode.appendChild(div);

            if(this._rounded) {
                this._shadowDiv.style.height = Math.max(0, e.offsetHeight - (2 * this._radius)) + "px";

                if(!this._shadowRoundedBehavior)
                    this._shadowRoundedBehavior = $create(Sys.Extended.UI.RoundedCornersBehavior, { "Radius": this._radius }, null, null, this._shadowDiv);
                else
                    this._shadowRoundedBehavior.set_radius(this._radius);
            } else if(this._shadowRoundedBehavior) {
                this._shadowRoundedBehavior.set_radius(0);
            }

            if(this._opacity != 1.0)
                this.setupOpacity();

            this.setShadow(false, true);
            this.updateZIndex();
        }
    },

    disposeShadowDiv: function() {
        // Dispose of the div we use as the shadow
        if(this._shadowDiv) {
            // on page teardown (or in an update panel, this may already
            // be gone)
            if(this._shadowDiv.parentNode)
                this._shadowDiv.parentNode.removeChild(this._shadowDiv);

            this._shadowDiv = null;
        }

        if(this._shadowRoundedBehavior) {
            this._shadowRoundedBehavior.dispose();
            this._shadowRoundedBehavior = null;
        }
    },

    onTimerTick: function() {
        // Timer's tick handler that is used to position the shadow when its target moves
        this.setShadow();
    },

    startTimer: function() {
        // Start the timer (and hence start tracking the bounds of the target element)
        if(!this._timer) {
            if(!this._tickHandler)
                this._tickHandler = Function.createDelegate(this, this.onTimerTick);

            this._timer = new Sys.Timer();
            this._timer.set_interval(this._trackPositionDelay);
            this._timer.add_tick(this._tickHandler);
            this._timer.set_enabled(true);
        }
    },

    stopTimer: function() {
        // Stop the timer (and hence stop tracking the bounds of the target element)

        // on stop, just clean the thing up completely
        if(this._timer) {
            this._timer.remove_tick(this._tickHandler);
            this._timer.set_enabled(false);
            this._timer.dispose();
            this._timer = null;
        }
    },

    ///<summary>
    /// Draws shadow around the control.
    ///</summary>
    /// <remarks>
    /// This function does most part of work when positioning and sizing the shadow. 
    /// It caches values to avoid extra work. 
    /// It's called on a timer so we need to keep its weight light.
    /// </remarks>
    /// <param name="force" type="Boolean">Whether to force the bounds change.</param>
    /// <param name="norecurse" type="Boolean">Whether to recurse if we need to recreate the shadow div</param>
    /// <member name="cM:AjaxControlToolkit.DropShadowExtender.setShadow" />
    setShadow: function(force, norecurse) {
        // This function does the heavy lifting of positioning and sizing the shadow.
        // It caches values to avoid extra work - it's called on a timer so we need to
        // keep it light weight.
        // "force" - whether to force the bounds change
        // "norecurse" - whether to recurse if we need to recreate the shadow div

        e = this.get_element();

        if(!this.get_isInitialized() || !e || (!this._width && !force))
            return;

        // execute if browser does not support css3
        if(e.style.boxShadow == undefined && e.style.MozBoxShadow == undefined && e.style.WebkitBoxShadow == undefined) {
            var existingShadow = this._shadowDiv;
            if(!existingShadow)
                this.buildShadowDiv();

            var location = { x: e.offsetLeft, y: e.offsetTop };

            if(force || this._lastX != location.x || this._lastY != location.y || !existingShadow) {
                this._lastX = location.x;
                this._lastY = location.y;

                var w = this.get_width();

                location.x += w;
                location.y += w;

                $common.setLocation(this._shadowDiv, location);
            }

            var h = e.offsetHeight,
                w = e.offsetWidth;

            if(force || h != this._lastH || w != this._lastW || !existingShadow) {
                this._lastW = w;
                this._lastH = h;

                if(!this._rounded || !existingShadow || norecurse) {
                    this._shadowDiv.style.width = w + "px";
                    this._shadowDiv.style.height = h + "px";
                } else {
                    // recurse if we need to redo the div
                    this.disposeShadowDiv();
                    this.setShadow();
                }
            }

            if(this._shadowDiv)
                this._shadowDiv.style.visibility = $common.getCurrentStyle(e, 'visibility');
        } else { // create dropshadow effect on div if browser supports css3

            var boxShadowVals;

            //To display effect of opacity set different color
            // on the basis of selected % of opacity 
            if(this._opacity == ".25")
                boxShadowVals = this._width + "px " + this._width + "px " + this._width + "px " + "#D3D3D3";
            else if(this._opacity == ".5")
                boxShadowVals = this._width + "px " + this._width + "px " + this._width + "px " + "#778899";
            else if(this._opacity == ".75")
                boxShadowVals = this._width + "px " + this._width + "px " + this._width + "px " + "#808080";
            else
                boxShadowVals = this._width + "px " + this._width + "px " + this._width + "px " + "#000";

            // this works in IE9 and Chrome latest versions
            if(e.style.boxShadow != undefined)
                e.style.boxShadow = boxShadowVals;
            else if(e.style.MozBoxShadow != undefined) // this works for Mozila Firefox
                e.style.MozBoxShadow = boxShadowVals; // this works for Chrome older version, Safari
            else if(e.style.WebkitBoxShadow != undefined)
                e.style.WebkitBoxShadow = boxShadowVals;
        }
    },

    setupOpacity: function() {
        // Set the opacity of the shadow div
        if(this.get_isInitialized() && this._shadowDiv)
            $common.setElementOpacity(this._shadowDiv, this._opacity);

    },

    setupRounded: function() {
        // Demand create and initialize the RoundedCornersBehavior
        if(!this._roundedBehavior && this._rounded)
            this._roundedBehavior = $create(Sys.Extended.UI.RoundedCornersBehavior, null, null, null, this.get_element());

        if(this._roundedBehavior)
            this._roundedBehavior.set_radius(this._rounded ? this._radius : 0);
    },

    updateZIndex: function() {
        // Update the z-Index so the shadow div remains behind the target element
        if(!this._shadowDiv)
            return;

        var e = this.get_element(),
            targetZIndex = e.style.zIndex,
            shadowZIndex = this._shadowDiv.style.zIndex;

        if(shadowZIndex && targetZIndex && targetZIndex > shadowZIndex) {
            return;
        } else {
            targetZIndex = Math.max(2, targetZIndex);
            shadowZIndex = targetZIndex - 1;
        }

        e.style.zIndex = targetZIndex;
        this._shadowDiv.style.zIndex = shadowZIndex;
    },

    updateRoundedCorners: function() {
        // Update the RoundedCorndersBehavior and recreate the shadow div so its corners are rounded as well
        if(this.get_isInitialized()) {
            this.setupRounded();
            this.disposeShadowDiv();
            this.setShadow();
        }
    },

    /// <summary>
    /// A number that represents the opacity of the drop shadow from 0 (fully transparent) to 1.0 (fully opaque).	
    /// </summary>
    /// <remarks>
    /// The default is .5.
    /// </remarks>
    /// <getter>get_opacity</getter>
    /// <setter>set_opacity</setter>
    /// <member name="cP:AjaxControlToolkit.DropShadowExtender.opacity" />
    get_opacity: function() {
        return this._opacity;
    },
    set_opacity: function(value) {
        if(this._opacity != value) {
            this._opacity = value;

            this.setShadow();
            this.setupOpacity();

            this.raisePropertyChanged('opacity');
        }
    },

    get_Opacity: function() {
        Sys.Extended.Deprecated("get_Opacity", "get_opacity");
        return this.get_opacity();
    },
    set_Opacity: function(value) {
        Sys.Extended.Deprecated("set_Opacity", "set_opacity");
        this.set_opacity(value);
    },

    /// <summary>
    /// A Boolean value that specifies whether or not corners of the target and drop shadow should be rounded.
    /// </summary>
    /// <getter>get_rounded</getter>
    /// <setter>set_rounded</setter>
    /// <member name="cP:AjaxControlToolkit.DropShadowExtender.rounded" />
    get_rounded: function() {
        return this._rounded;
    },
    set_rounded: function(value) {
        if(value != this._rounded) {
            this._rounded = value;

            this.updateRoundedCorners();
            this.raisePropertyChanged('rounded');
        }
    },

    get_Rounded: function() {
        Sys.Extended.Deprecated("get_Rounded", "get_rounded");
        return this.get_rounded();
    },
    set_Rounded: function(value) {
        Sys.Extended.Deprecated("set_Rounded", "set_rounded");
        this.set_rounded(value);
    },

    /// <summary>
    /// An integer that specifies the radius of rounded corners in pixels.
    /// </summary>
    /// <getter>get_radius</getter>
    /// <setter>set_radius</setter>
    /// <member name="cP:AjaxControlToolkit.DropShadowExtender.radius" />
    get_radius: function() {
        return this._radius;
    },
    set_radius: function(value) {
        if(value != this._radius) {
            this._radius = value;

            this.updateRoundedCorners();
            this.raisePropertyChanged('radius');
        }
    },

    get_Radius: function() {
        Sys.Extended.Deprecated("get_Radius", "get_radius");
        return this.get_radius();  
    },
    set_Radius: function(value) {
        Sys.Extended.Deprecated("set_Radius", "set_radius");
        this.set_radius(value);
    },

    /// <summary>
    /// An integer that specifies the drop shadow width in pixels.
    /// </summary>
    /// <remarks>
    /// The default is 5.
    /// </remarks>
    /// <getter>get_width</getter>
    /// <setter>set_width</setter>
    /// <member name="cP:AjaxControlToolkit.DropShadowExtender.width" />
    get_width: function() {
        return this._width;
    },
    set_width: function(value) {
        if(value != this._width) {
            this._width = value;

            if(this._shadowDiv)
                $common.setVisible(this._shadowDiv, value > 0);

            this.setShadow(true);
            this.raisePropertyChanged('width');
        }
    },

    get_Width: function() {
        Sys.Extended.Deprecated("get_Width", "get_width");
        return this.get_width();
    },
    set_Width: function(value) {
        Sys.Extended.Deprecated("set_Width", "set_width");
        this.set_width(value);
    },

    /// <summary>
    /// A number that specifies the length of the timer interval that is used when tracking the targer position.
    /// </summary>
    /// <getter>get_trackPositionDelay</getter>
    /// <setter>set_trackPositionDelay</setter>
    /// <member name="cP:AjaxControlToolkit.DropShadowExtender.trackPositionDelay" />
    get_trackPositionDelay: function() {
        return this._trackPositionDelay;
    },
    set_trackPositionDelay: function(value) {
        if(value != this._trackPositionDelay) {
            this._trackPositionDelay = value;

            if(!e)
                e = this.get_element();

            // execute if browser does not support css3
            if(e.style.boxShadow == undefined && e.style.MozBoxShadow == undefined && e.style.WebkitBoxShadow == undefined) {
                if(this._trackPosition) {
                    this.stopTimer();
                    this.startTimer();
                }

                this.raisePropertyChanged('trackPositionDelay');
            }
        }
    },

    get_TrackPositionDelay: function() {
        Sys.Extended.Deprecated("get_TrackPositionDelay", "get_trackPositionDelay");
        return this.get_trackPositionDelay();
    },
    set_TrackPositionDelay: function(value) {
        Sys.Extended.Deprecated("set_TrackPositionDelay", "set_trackPositionDelay");
        this.set_trackPositionDelay(value);
    },

    /// <summary>
    /// A Boolean value that specifies whether the drop shadow should track the position of the panel to which it is attached.
    /// </summary>
    /// <remarks>
    /// Set this property to true if the panel is absolutely positioned or if it might move at runtime. The default is false.
    /// </remarks>
    /// <getter>get_trackPosition</getter>
    /// <setter>set_trackPosition</setter>
    /// <member name="cP:AjaxControlToolkit.DropShadowExtender.trackPosition" />
    get_trackPosition: function() {
        // Whether the drop shadow should track the position of the panel it is attached to.
        // Use this if the panel is absolutely positioned or will otherwise move.
        return this._trackPosition;
    },
    set_trackPosition: function(value) {
        if(value != this._trackPosition) {
            this._trackPosition = value;

            if(!e)
                e = this.get_element();

            // execute if browser does not support css3
            if(e.style.boxShadow == undefined && e.style.MozBoxShadow == undefined && e.style.WebkitBoxShadow == undefined) {
                if(this.get_element()) {
                    if(value)
                        this.startTimer();
                    else
                        this.stopTimer();
                }

                this.raisePropertyChanged('trackPosition');
            }
        }
    },

    get_TrackPosition: function() {
        Sys.Extended.Deprecated("get_TrackPosition", "get_trackPosition");
        return this.get_trackPosition();
    },
    set_TrackPosition: function(value) {
        Sys.Extended.Deprecated("set_TrackPosition", "set_trackPosition");
        this.set_trackPosition(value);
    }
}

Sys.Extended.UI.DropShadowBehavior.registerClass('Sys.Extended.UI.DropShadowBehavior', Sys.Extended.UI.BehaviorBase);