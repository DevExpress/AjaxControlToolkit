Type.registerNamespace('Sys.Extended.UI.Animation');

Sys.Extended.UI.Animation.AnimationBehavior = function(element) {
    // The AnimationBehavior allows us to associate animations (described by JSON) with events and
    // have them play when the events are fired.  It relies heavily on the AJAX Control Toolkit
    // animation framework provided in Animation.js, and the GenericAnimationBehavior defined below.
    Sys.Extended.UI.Animation.AnimationBehavior.initializeBase(this, [element]);

    // Generic animation behaviors that automatically build animations from JSON descriptions

    /// <summary>
    /// Generic OnLoad Animation's JSON definition.
    /// Setting the OnLoad property will cause it to be played immediately
    /// </summary>
    /// <getter>get_onLoad</getter>
    /// <setter>set_onLoad</setter>
    /// <member name="cP:AjaxControlToolkit.AnimationExtender.onLoad" />
    this._onLoad = null;

    /// <summary>
    /// Generic OnClick Animation's JSON definition
    /// </summary>
    /// <getter>get_onClick</getter>
    /// <setter>set_onClick</setter>
    /// <member name="cP:AjaxControlToolkit.AnimationExtender.onClick" />
    this._onClick = null;

    /// <summary>
    /// Generic OnMouseOver Animation's JSON definition
    /// </summary>
    /// <getter>get_onMouseOver</getter>
    /// <setter>set_onMouseOver</setter>
    /// <member name="cP:AjaxControlToolkit.AnimationExtender.onMouseOver" />
    this._onMouseOver = null;

    /// <summary>
    /// Generic OnMouseOut Animation's JSON definition
    /// </summary>
    /// <getter>get_onMouseOut</getter>
    /// <setter>set_onMouseOut</setter>
    /// <member name="cP:AjaxControlToolkit.AnimationExtender.onMouseOut" />
    this._onMouseOut = null;

    /// <summary>
    /// Generic OnHoverOver Animation's JSON definition
    /// </summary>
    /// <getter>get_onHoverOver</getter>
    /// <setter>set_onHoverOver</setter>
    /// <member name="cP:AjaxControlToolkit.AnimationExtender.onHoverOver" />
    this._onHoverOver = null;

    /// <summary>
    /// Generic OnHoverOut Animation's JSON definition
    /// </summary>
    /// <getter>get_onHoverOut</getter>
    /// <setter>set_onHoverOut</setter>
    /// <member name="cP:AjaxControlToolkit.AnimationExtender.onHoverOut" />
    this._onHoverOut = null;

    // Handlers for the events
    this._onClickHandler = null;
    this._onMouseOverHandler = null;
    this._onMouseOutHandler = null;
}
Sys.Extended.UI.Animation.AnimationBehavior.prototype = {
    initialize: function() {
        Sys.Extended.UI.Animation.AnimationBehavior.callBaseMethod(this, 'initialize');

        // Wireup the event handlers
        var element = this.get_element();
        if(element) {
            this._onClickHandler = Function.createDelegate(this, this.playOnClick);
            $addHandler(element, 'click', this._onClickHandler);
            this._onMouseOverHandler = Function.createDelegate(this, this.playOnMouseOver);
            $addHandler(element, 'mouseover', this._onMouseOverHandler);
            this._onMouseOutHandler = Function.createDelegate(this, this.playOnMouseOut);
            $addHandler(element, 'mouseout', this._onMouseOutHandler);
        }
    },

    dispose: function() {
        // Remove the event handlers
        var element = this.get_element();
        if(element) {
            if(this._onClickHandler) {
                $removeHandler(element, 'click', this._onClickHandler);
                this._onClickHandler = null;
            }
            if(this._onMouseOverHandler) {
                $removeHandler(element, 'mouseover', this._onMouseOverHandler);
                this._onMouseOverHandler = null;
            }
            if(this._onMouseOutHandler) {
                $removeHandler(element, 'mouseout', this._onMouseOutHandler);
                this._onMouseOutHandler = null;
            }
        }

        // Wipe the behaviors (we don't need to dispose them because
        // that will happen automatically in our base dispose)
        this._onLoad = null;
        this._onClick = null;
        this._onMouseOver = null;
        this._onMouseOut = null;
        this._onHoverOver = null;
        this._onHoverOut = null;

        Sys.Extended.UI.Animation.AnimationBehavior.callBaseMethod(this, 'dispose');
    },

    get_onLoad: function() {
        return this._onLoad ? this._onLoad.get_json() : null;
    },
    get_OnLoad: function() {
        Sys.Extended.Deprecated("get_OnLoad()", "get_onLoad()");
        return this.get_onLoad();
    },
    set_onLoad: function(value) {
        if(!this._onLoad) {
            this._onLoad = new Sys.Extended.UI.Animation.GenericAnimationBehavior(this.get_element());
            this._onLoad.initialize();
        }
        this._onLoad.set_json(value);
        this.raisePropertyChanged('OnLoad');
        this._onLoad.play();
    },
    set_OnLoad: function(value) {
        Sys.Extended.Deprecated("set_OnLoad(value)", "set_onLoad(value)");
        this.set_onLoad(value);
    },

    /// <summary>
    /// Generic OnLoad Animation's behavior
    /// </summary>
    /// <getter>get_onLoadBehavior</getter>
    /// <member name="cP:AjaxControlToolkit.AnimationExtender.onLoadBehavior" />
    get_onLoadBehavior: function() {
        return this._onLoad;
    },
    get_OnLoadBehavior: function() {
        Sys.Extended.Deprecated("get_OnLoadBehavior()", "get_OnLoadBehavior()");
        return this.get_onLoadBehavior();
    },

    get_onClick: function() {
        return this._onClick ? this._onClick.get_json() : null;
    },
    get_OnClick: function() {
        Sys.Extended.Deprecated("get_OnClick()", "get_onClick()");
        return this.get_onClick();
    },
    set_OnClick: function(value) {
        Sys.Extended.Deprecated("set_OnClick(value)", "set_onClick(value)");
        this.set_onClick(value);
    },
    set_onClick: function(value) {
        if(!this._onClick) {
            this._onClick = new Sys.Extended.UI.Animation.GenericAnimationBehavior(this.get_element());
            this._onClick.initialize();
        }
        this._onClick.set_json(value);
        this.raisePropertyChanged('OnClick');
    },

    /// <summary>
    /// Generic OnClick Animation's behavior
    /// </summary>
    /// <getter>get_onClickBehavior</getter>
    /// <member name="cP:AjaxControlToolkit.AnimationExtender.onClickBehavior" />
    get_onClickBehavior: function() {
        return this._onClick;
    },
    get_OnClickBehavior: function() {
        Sys.Extended.Deprecated("get_OnClickBehavior()", "get_onClickBehavior()");
        return this.get_onClickBehavior();
    },

    /// <summary>
    /// Plays animation.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.AnimationExtender.playOnClick" />
    OnClick: function() {
        Sys.Extended.Deprecated("OnClick()");
        this.playOnClick();
    },
    playOnClick: function() {
        if(this._onClick) {
            this._onClick.play();
        }
    },

    get_onMouseOver: function() {
        return this._onMouseOver ? this._onMouseOver.get_json() : null;
    },
    get_OnMouseOver: function() {
        Sys.Extended.Deprecated("get_OnMouseOver()", "get_onMouseOver()");
        return this.get_onMouseOver();
    },
    set_onMouseOver: function(value) {
        if(!this._onMouseOver) {
            this._onMouseOver = new Sys.Extended.UI.Animation.GenericAnimationBehavior(this.get_element());
            this._onMouseOver.initialize();
        }
        this._onMouseOver.set_json(value);
        this.raisePropertyChanged('OnMouseOver');
    },
    set_OnMouseOver: function(value) {
        Sys.Extended.Deprecated("set_OnMouseOver(value)", "set_onMouseOver(value)");
        this.set_onMouseOver(value);
    },

    /// <summary>
    /// Generic OnMouseOver Animation's behavior
    /// </summary>
    /// <getter>get_onMouseOverBehavior</getter>
    /// <member name="cP:AjaxControlToolkit.AnimationExtender.onMouseOverBehavior" />
    get_onMouseOverBehavior: function() {
        return this._onMouseOver;
    },
    get_OnMouseOverBehavior: function() {
        Sys.Extended.Deprecated("get_OnMouseOverBehavior()", "get_onMouseOverBehavior()");
    },

    /// <summary>
    /// Plays OnMouseOver/OnHoverOver animations
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.AnimationExtender.playOnMouseOver" />
    OnMouseOver: function() {
        Sys.Extended.Deprecated("OnMouseOver()");
        this.playOnMouseOver();
    },
    playOnMouseOver: function() {
        // Private property to track whether a mouseOver event has already occured, and thus eliminate dups
        if(this._mouseHasEntered) {
            // This is an additional onMouseOver triggered by child content
            return;
        }
        if(this._onMouseOver) {
            this._onMouseOver.play();
        }
        if(this._onHoverOver) {
            if(this._onHoverOut) {
                this._onHoverOut.quit();
            }
            this._onHoverOver.play();
        }
        this._mouseHasEntered = true;
    },

    
    get_onMouseOut: function() {
        return this._onMouseOut ? this._onMouseOut.get_json() : null;
    },
    get_OnMouseOut: function() {
        Sys.Extended.Deprecated("get_OnMouseOut()", "get_onMouseOut()");
        return this.get_onMouseOut();
    },
    set_onMouseOut: function(value) {
        if(!this._onMouseOut) {
            this._onMouseOut = new Sys.Extended.UI.Animation.GenericAnimationBehavior(this.get_element());
            this._onMouseOut.initialize();
        }
        this._onMouseOut.set_json(value);
        this.raisePropertyChanged('OnMouseOut');
    },
    set_OnMouseOut: function(value) {
        Sys.Extended.Deprecated("set_OnMouseOut(value)", "set_OnMouseOut(value)");
        this.set_onMouseOut(value);
    },

    /// <summary>
    /// Generic OnMouseOut Animation's behavior
    /// </summary>
    /// <getter>get_onMouseOutBehavior</getter>
    /// <member name="cP:AjaxControlToolkit.AnimationExtender.onMouseOutBehavior" />
    get_onMouseOutBehavior: function() {
        return this._onMouseOut;
    },
    get_OnMouseOutBehavior: function() {
        Sys.Extended.Deprecated("get_OnMouseOutBehavior()", "get_onMouseOutBehavior");
        return this.get_onMouseOutBehavior();
    },

    /// <summary>
    /// Plays OnMouseOver/OnHoverOver animations
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.AnimationExtender.playOnMouseOut" />
    OnMouseOut: function(e) {
        Sys.Extended.Deprecated("OnMouseOut()");
        this.playOnMouseOut();
    },
    playOnMouseOut: function(e) {
        var ev = e.rawEvent;
        var pt = this.get_element();
        var tg = e.target;
        if(tg.nodeName !== pt.nodeName) return;

        var rel = ev.relatedTarget || ev.toElement;
        if(pt != rel && !this._isChild(pt, rel)) {
            this._mouseHasEntered = false;
            if(this._onMouseOut) {
                this._onMouseOut.play();
            }
            if(this._onHoverOut) {
                if(this._onHoverOver) {
                    this._onHoverOver.quit();
                }
                this._onHoverOut.play();
            }
        }
    },

    _isChild: function(elmtA, elmtB) {
        var body = document.body;
        while(elmtB && elmtA != elmtB && body != elmtB) {
            try {
                elmtB = elmtB.parentNode;
            } catch(e) {
                // Firefox sometimes fires events for XUL elements, which throws
                // a "permission denied" error. so this is not a child.
                return false;
            }
        }
        return elmtA == elmtB;
    },
    get_onHoverOver: function() {
        return this._onHoverOver ? this._onHoverOver.get_json() : null;
    },
    get_OnHoverOver: function() {
        Sys.Extended.Deprecated("get_OnHoverOver()", "get_onHoverOver");
        return this.get_onHoverOver();
    },
    set_onHoverOver: function(value) {
        if(!this._onHoverOver) {
            this._onHoverOver = new Sys.Extended.UI.Animation.GenericAnimationBehavior(this.get_element());
            this._onHoverOver.initialize();
        }
        this._onHoverOver.set_json(value);
        this.raisePropertyChanged('OnHoverOver');
    },
    set_OnHoverOver: function(value) {
        Sys.Extended.Deprecated("set_OnHoverOver(value)", "set_OnHoverOver(value)");
        this.set_onHoverOver(value);
    },

    /// <summary>
    /// Generic OnHoverOver Animation's behavior
    /// </summary>
    /// <getter>get_onHoverOverBehavior</getter>
    /// <member name="cP:AjaxControlToolkit.AnimationExtender.onHoverOverBehavior" />
    get_onHoverOverBehavior: function() {
        return this._onHoverOver;
    },
    get_OnHoverOverBehavior: function() {
        Sys.Extended.Deprecated("get_OnHoverOverBehavior()", "get_onHoverOverBehavior()");
        return this.get_onHoverOverBehavior();
    },

    get_onHoverOut: function() {
        return this._onHoverOut ? this._onHoverOut.get_json() : null;
    },
    get_OnHoverOut: function() {
        Sys.Extended.Deprecated("get_OnHoverOut()", "get_onHoverOut()");
        return this.get_onHoverOut();
    },
    set_onHoverOut: function(value) {
        if(!this._onHoverOut) {
            this._onHoverOut = new Sys.Extended.UI.Animation.GenericAnimationBehavior(this.get_element());
            this._onHoverOut.initialize();
        }
        this._onHoverOut.set_json(value);
        this.raisePropertyChanged('OnHoverOut');
    },
    set_OnHoverOut: function(value) {
        Sys.Extended.Deprecated("set_OnHoverOut(value)", "set_onHoverOut(value)");
        this.set_onHoverOut(value);
    },

    /// <summary>
    /// Generic OnHoverOut Animation's behavior
    /// </summary>
    /// <getter>get_onHoverOutBehavior</getter>
    /// <member name="cP:AjaxControlToolkit.AnimationExtender.onHoverOutBehavior" />
    get_onHoverOutBehavior: function() {
        return this._onHoverOut;
    },
    get_OnHoverOutBehavior: function() {
        Sys.Extended.Deprecated("get_OnHoverOutBehavior()", "get_onHoverOutBehavior()");
        return this.get_onHoverOutBehavior();
    }
}
Sys.Extended.UI.Animation.AnimationBehavior.registerClass('Sys.Extended.UI.Animation.AnimationBehavior', Sys.Extended.UI.BehaviorBase);

Sys.Extended.UI.Animation.GenericAnimationBehavior = function(element) {
    // The GenericAnimationBehavior handles the creation, playing, and disposing of animations
    // created from a JSON description.  As we intend to expose a lot of generic animations
    // across the Toolkit, this behavior serves to simplify the amount of work required.
    Sys.Extended.UI.Animation.GenericAnimationBehavior.initializeBase(this, [element]);

    // JSON description of the animation that will be used to create it
    this._json = null;

    // Animation created from the JSON description that will be played
    this._animation = null;
}
Sys.Extended.UI.Animation.GenericAnimationBehavior.prototype = {
    dispose: function() {
        // Dispose the behavior and its animation
        this.disposeAnimation();
        Sys.Extended.UI.Animation.GenericAnimationBehavior.callBaseMethod(this, 'dispose');
    },

    disposeAnimation: function() {
        if(this._animation) {
            this._animation.dispose();
        }
        this._animation = null;
    },

    play: function() {
        // Play the animation if it isn't already playing.  If it's already playing, this does nothing.
        if(this._animation && !this._animation.get_isPlaying()) {
            this.stop();
            this._animation.play();
        }
    },

    stop: function() {
        if(this._animation) {
            if(this._animation.get_isPlaying()) {
                this._animation.stop(true);
            }
        }
    },

    quit: function() {
        // Quit playing the animation without updating the final state (i.e. if
        // the animation was moving, this would leave it in the middle of its path).
        // This differs from the stop function which will update the final state.  The
        // quit function is most useful for scenarios where you're toggling back and forth
        // between two animations (like those used in OnHoverOver/OnHoverOut) and you don't
        // want to completely finish one animation if its counterpart is triggered.
        if(this._animation) {
            if(this._animation.get_isPlaying()) {
                this._animation.stop(false);
            }
        }
    },

    get_json: function() {
        return this._json;
    },
    set_json: function(value) {
        // Only wipe and rebuild if they're changing the value
        if(this._json != value) {
            this._json = value;
            this.raisePropertyChanged('json');

            // Build the new animation
            this.disposeAnimation();
            var element = this.get_element();
            if(element) {
                this._animation = Sys.Extended.UI.Animation.buildAnimation(this._json, element);
                if(this._animation) {
                    this._animation.initialize();
                }
                this.raisePropertyChanged('animation');
            }
        }
    },

    get_animation: function() {
        // Animation created from the JSON description
        return this._animation;
    }
}
Sys.Extended.UI.Animation.GenericAnimationBehavior.registerClass('Sys.Extended.UI.Animation.GenericAnimationBehavior', Sys.Extended.UI.BehaviorBase);