Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.HorizontalSide = function() {
    // The HorizontalSide enumeration describes the horizontal side
    // of the window used to anchor the element
    throw Error.invalidOperation();
}
Sys.Extended.UI.HorizontalSide.prototype = {
    Left : 0,
    Center : 1,
    Right : 2
}
Sys.Extended.UI.HorizontalSide.registerEnum("Sys.Extended.UI.HorizontalSide", false);


Sys.Extended.UI.VerticalSide = function() {
    // The VerticalSide enumeration describes the vertical side
    // of the window used to anchor the element
    throw Error.invalidOperation();
}
Sys.Extended.UI.VerticalSide.prototype = {
    Top : 0,
    Middle : 1,
    Bottom : 2
}
Sys.Extended.UI.VerticalSide.registerEnum("Sys.Extended.UI.VerticalSide", false);


Sys.Extended.UI.AlwaysVisibleControlBehavior = function(element) {
    // The AlwaysVisibleControl behavior is used to fix a particular control a specified distance
    // from the top/left corner at all times regardless of how the users scrolls or sizes the window.
    Sys.Extended.UI.AlwaysVisibleControlBehavior.initializeBase(this, [element]);
    
    // Desired offset from the horizontal edge of the window
    this._horizontalOffset = 0;
    
    // Vertical side of the window used to anchor the element
    this._horizontalSide = Sys.Extended.UI.HorizontalSide.Left;
    
    // Desired offset from the vertical edge of the window
    this._verticalOffset = 0;
    
    // Vertical side of the window used to anchor the element
    this._verticalSide = Sys.Extended.UI.VerticalSide.Top;
    
    // Custom property indicating the desired
    // duration of the scrolling effect
    this._scrollEffectDuration = .1;
    
    // Member variable used to handle the window's scroll and resize events
    this._repositionHandler = null;
    
    // The _animate flag is used to decide if we should play the animations whenever
    // the page is scrolled or resized.  We only need to do this on browsers that don't
    // support CSS position: fixed (i.e., IE <= 6).  Other browsers can opt in.
    this._animate = false;
    
    // Animation to handle moving the element
    this._animation = null;
}
Sys.Extended.UI.AlwaysVisibleControlBehavior.prototype = {
    initialize : function() {
        Sys.Extended.UI.AlwaysVisibleControlBehavior.callBaseMethod(this, 'initialize');
        
        var element = this.get_element();
        if (!element) throw Error.invalidOperation(Sys.Extended.UI.Resources.AlwaysVisible_ElementRequired);
        
        // Create the resposition handler used to place the element
        this._repositionHandler = Function.createDelegate(this, this._reposition);
        
        // Determine whether or not to use animations (i.e. whether or not the browser
        // supports CSS position: fixed).  All major browsers except IE 6 or earlier support it.
        // Otherwise we'll only animate if desired.
        if (Sys.Browser.agent == Sys.Browser.InternetExplorer && Sys.Browser.version < 7) {
            this._animate = true;
        }
        if (this._animate) {
            // Initialize the animations to use the actual properties
            this._animation = new Sys.Extended.UI.Animation.MoveAnimation(
                element, this._scrollEffectDuration, 25, 0, 0, false, 'px');

            // Make the control use absolute positioning to hover
            // appropriately and move it to its new home
            element.style.position = 'absolute';
        } else {
            // Make the control use fixed positioning to keep it from moving
            // while the content behind it slides around
            element.style.position = 'fixed';
        }
        
        // Attach the onResize handler
        $addHandler(window, 'resize', this._repositionHandler);
        
        // Attach the onscroll event handler for the animations
        if (this._animate) {
            $addHandler(window, 'scroll', this._repositionHandler);
        }
        
        // Move to the initial position
        this._reposition();
    },
    
    dispose : function() {
        // Detach the event and wipe the delegate
        if (this._repositionHandler) {
            if (this._animate) {
                $removeHandler(window, 'scroll', this._repositionHandler);
            }
            $removeHandler(window, 'resize', this._repositionHandler);
            this._repositionHandler = null;
        }
        
        // Dispose the animation
        if (this._animation) {
            this._animation.dispose();
            this._animation = null;
        }
        
        Sys.Extended.UI.AlwaysVisibleControlBehavior.callBaseMethod(this, 'dispose');
    },

    _reposition : function(eventObject) {
        // Handler to reposition the element and place it where it actually belongs
        // whenever the browser is scrolled or resized
        var element = this.get_element();
        if (!element) return;
        
        this.raiseRepositioning(Sys.EventArgs.Empty);
        
        var x = 0;
        var y = 0;
        
        // Compute the initial offset if we're animating
        if (this._animate) {
            if (document.documentElement && document.documentElement.scrollTop) {
                x = document.documentElement.scrollLeft;
                y = document.documentElement.scrollTop;
            } else {
                x = document.body.scrollLeft;
                y = document.body.scrollTop;
            }
        }
        
        // Compute the width and height of the client
        var clientBounds = $common.getClientBounds();
        var width = clientBounds.width;
        var height = clientBounds.height;
        
        // Compute the horizontal coordinate
        switch (this._horizontalSide) {
            case Sys.Extended.UI.HorizontalSide.Center :
                x = Math.max(0, Math.floor(x + width / 2.0 - element.offsetWidth / 2.0 - this._horizontalOffset));
                break;
            case Sys.Extended.UI.HorizontalSide.Right :
                x = Math.max(0, x + width - element.offsetWidth - this._horizontalOffset);
                break;
            case Sys.Extended.UI.HorizontalSide.Left :
            default :
                x += this._horizontalOffset;
                break;
        }            
           
        // Compute the vertical coordinate
        switch (this._verticalSide) {
            case Sys.Extended.UI.VerticalSide.Middle :
                y = Math.max(0, Math.floor(y + height / 2.0 - element.offsetHeight / 2.0 - this._verticalOffset));
                break;
            case Sys.Extended.UI.VerticalSide.Bottom :
                y = Math.max(0, y + height - element.offsetHeight - this._verticalOffset);
                break;
            case Sys.Extended.UI.VerticalSide.Top :
            default :
                y += this._verticalOffset;
                break;
        }
        
        // Move the element to its new position
        if (this._animate && this._animation) {
            this._animation.stop();
            this._animation.set_horizontal(x);
            this._animation.set_vertical(y);
            this._animation.play();
        } else {
            element.style.left = x + 'px';
            element.style.top = y + 'px';
        }
        
        this.raiseRepositioned(Sys.EventArgs.Empty);
    },
    
    get_HorizontalOffset : function() {
        // Distance to the horizontal edge of the browser in pixels from the same side of the target control. The default is 0 pixels.
        return this._horizontalOffset;
    },
    set_HorizontalOffset : function(value) {
        if (this._horizontalOffset != value) {
            this._horizontalOffset = value;
            this._reposition();
            this.raisePropertyChanged('HorizontalOffset');
        }
    },
    
    get_HorizontalSide : function() {
        // Horizontal side of the browser to anchor the control against.  The default is the Left side.
        return this._horizontalSide;
    },
    set_HorizontalSide : function(value) {
        if (this._horizontalSide != value) {
            this._horizontalSide = value;
            this._reposition();
            this.raisePropertyChanged('HorizontalSide');
        }
    },
    
    get_VerticalOffset : function() {
        // Distance to the vertical edge of the browser in pixels from the same side of the target control. The default is 0 pixels.
        return this._verticalOffset;
    },
    set_VerticalOffset : function(value) {
        if (this._verticalOffset != value) {
            this._verticalOffset = value;
            this._reposition();
            this.raisePropertyChanged('VerticalOffset');
        }
    },
    
    get_VerticalSide : function() {
        // Vertical side of the browser to anchor the control against.  The default is the Top side.
        return this._verticalSide;
    },
    set_VerticalSide : function(value) {
        if (this._verticalSide != value) {
            this._verticalSide = value;
            this._reposition();
            this.raisePropertyChanged('VerticalSide');
        }
    },
    
    get_ScrollEffectDuration : function() {
        // Length in seconds for the scrolling effect to last when the target control is repositioned. The default is .1 seconds.
        return this._scrollEffectDuration;
    },
    set_ScrollEffectDuration : function(value) {
        if (this._scrollEffectDuration != value) {
            this._scrollEffectDuration = value;
            if (this._animation) {
                this._animation.set_duration(value); 
            }
            this.raisePropertyChanged('ScrollEffectDuration');
        }
    },
    
    get_useAnimation : function() {
        // Whether or not to animate the element into position. (note:
        // this value should always be true in IE6).
        return this._animate;
    },
    set_useAnimation : function(value) {
        value |= (Sys.Browser.agent == Sys.Browser.InternetExplorer && Sys.Browser.version < 7);
        if (this._animate != value) {
            this._animate = value;
            this.raisePropertyChanged('useAnimation');
        }
    },
    
    add_repositioning : function(handler) {
        // Add an event handler for the repositioning event
        this.get_events().addHandler('repositioning', handler);
    },
    remove_repositioning : function(handler) {
        this.get_events().removeHandler('repositioning', handler);
    },
    raiseRepositioning : function(eventArgs) {
        var handler = this.get_events().getHandler('repositioning');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_repositioned : function(handler) {
        this.get_events().addHandler('repositioned', handler);
    },
    remove_repositioned : function(handler) {
        this.get_events().removeHandler('repositioned', handler);
    },
    raiseRepositioned : function(eventArgs) {
        var handler = this.get_events().getHandler('repositioned');
        if (handler) {
            handler(this, eventArgs);
        }
    }
}
Sys.Extended.UI.AlwaysVisibleControlBehavior.registerClass('Sys.Extended.UI.AlwaysVisibleControlBehavior', Sys.Extended.UI.BehaviorBase);