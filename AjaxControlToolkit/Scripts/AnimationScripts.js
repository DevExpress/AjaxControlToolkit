Type.registerNamespace('Sys.Extended.UI.Animation');

// Create an alias for the namespace to save 25 chars each time it's used since
// this is a very long script and will take awhile to download
$AA = Sys.Extended.UI.Animation;

$AA.registerAnimation = function(name, type) {
    // Register an animation with the AJAX Control Toolkit animation framework. This serves a dual purpose:
    // 1) to add standard utility methods to the animation type (such as a play method that creates
    // an animation, plays it, and disposes it when the animation is over), and 2) to associate a name with the
    // type that will be used when creating animations from a JSON description.  This method can also be called
    // by other animation libraries to seamlessly interoperate with the AJAX Control Toolkit's animation
    // framework.
    //
    // "name" - name of the animation that will be used as the XML tag name in the XML animation description.  It
    // should be a valid XML tag (i.e. an alpha-numeric sequence with no spaces, special characters, etc.).
    // Make sure the type inherits from Sys.Extended.UI.Animation.Animation
    if(type && ((type === $AA.Animation) || (type.inheritsFrom && type.inheritsFrom($AA.Animation)))) {
        // We'll store the animation name/type mapping in a "static" object off of
        // Sys.Extended.UI.Animation.  If this __animations object hasn't been
        // created yet, demand create it on the first registration.
        if(!$AA.__animations) {
            $AA.__animations = {};
        }

        // Add the current type to the collection of animations
        $AA.__animations[name.toLowerCase()] = type;

        // Add a play function that will make it very easy to create, play, and
        // dispose of an animation.  This is effectively a "static" function on
        // each animation and will take the same parameters as that animation's
        // constructor.
        type.play = function() {
            // Create an animation, play it immediately, and dispose it when finished.
            // The play function takes the same parameters as the type's constructor

            // Create and initialize a new animation of the right type and pass in
            // any arguments given to the play function
            var animation = new type();
            type.apply(animation, arguments);
            animation.initialize();

            // Add an event handler to dispose the animation when it's finished
            var handler = Function.createDelegate(animation,
                function() {
                    // Dispose the animation after playing
                    animation.remove_ended(handler);
                    handler = null;
                    animation.dispose();
                });
            animation.add_ended(handler);

            // Once the animation has been created and initialized, play it and
            // dispose it as soon as it's finished
            animation.play();
        }
    } else {
        // Raise an error if someone registers an animation that doesn't inherit
        // from our base Animation class
        throw Error.argumentType('type', type, $AA.Animation, Sys.Extended.UI.Resources.Animation_InvalidBaseType);
    }
}

$AA.buildAnimation = function(json, defaultTarget) {
    // The buildAnimation function is used to turn a JSON animation description
    // into an actual animation object that can be played.
    //
    // "json" - JSON description of the animation in the format expected by createAnimation
    // "defaultTarget" - target of the animation if none is specified in the JSON description.  The semantics of
    // target assignment are provided in more detail in createAnimation.

    // Ensure we have a description to create an animation with
    if(!json || json === '') {
        return null;
    }

    // "Parse" the JSON so we can easily manipulate it
    // (we don't wrap it in a try/catch when debugging to raise any errors)
    var obj;
    json = '(' + json + ')';
    if(!Sys.Debug.isDebug) {
        try { obj = Sys.Serialization.JavaScriptSerializer.deserialize(json); } catch(ex) { }
    } else {
        obj = Sys.Serialization.JavaScriptSerializer.deserialize(json);
    }

    // Create a new instance of the animation
    return $AA.createAnimation(obj, defaultTarget);
}

$AA.createAnimation = function(obj, defaultTarget) {
    // The createAnimation function builds a new Sys.Extended.UI.Animation.Animation instance from an object
    // that describes it.
    // Exceptions are thrown when the AnimationName cannot be found.  Also,
    // any exceptions raised by setting properties or providing properties with invalid
    // names will only be raised when debugging.
    //
    // "obj" - the object provides a description of the animation to be be generated in
    // a very specific format. It has two special properties: AnimationName
    // and AnimationChildren. The AnimationName is required
    // and used to find the type of animation to create (this name should map to
    // one of the animation names supplied to registerAnimation).  The
    // AnimationChildren property supplies an optional array for
    // animations that use child animations (such as
    // Sys.Extended.UI.Animation.ParallelAnimation and
    // Sys.Extended.UI.Animation.SequenceAnimation). The elements of
    // the AnimationChildren array are valid
    // Sys.Extended.UI.Animation.Animation objects that meet these same
    // requirements. In order for an animation to support child animations, it must
    // derive from the Sys.Extended.UI.Animation.ParentAnimation class
    // which provides common methods like add, clear, etc. The
    // remaining properties of the object are used to set parameters specific to the type
    // of animation being created (e.g. duration, minimumOpacity,
    // startValue, etc.) and should have a corresponding property on the
    // animation. You can also assign an arbitrary JavaScript expression to any property
    // by adding 'Script' to the end of its name (i.e., Height="70" can be replaced by
    // HeightScript="$get('myElement').offsetHeight") and have the property set to the
    // result of evaluating the expression before the animation is played each time.
    // "defaultTarget" - the function also takes a defaultTarget parameter that is used as the
    // target of the animation if the object does not specify one.  This parameter should be
    // an instance of Sys.UI.DomElement and not just the name of an element.    

    // Create a default instance of the animation by looking up the AnimationName
    // in the global __animations object.
    if(!obj || !obj.AnimationName) {
        throw Error.argument('obj', Sys.Extended.UI.Resources.Animation_MissingAnimationName);
    }
    var type = $AA.__animations[obj.AnimationName.toLowerCase()];
    if(!type) {
        throw Error.argument('type', String.format(Sys.Extended.UI.Resources.Animation_UknownAnimationName, obj.AnimationName));
    }
    var animation = new type();

    // Set the animation's target if provided via defaultTarget (note that setting
    // it via AnimationTarget will happen during the regular property setting phase)
    if(defaultTarget) {
        animation.set_target(defaultTarget);
    }

    // If there is an AnimationChildren array and the animation inherits from
    // ParentAnimation, then we will recusively build the child animations.  It is
    // important that we create the child animations before setting the animation's
    // properties or initializing (because some properties and initialization may be
    // propogated down from parent to child).
    if(obj.AnimationChildren && obj.AnimationChildren.length) {
        if($AA.ParentAnimation.isInstanceOfType(animation)) {
            for(var i = 0; i < obj.AnimationChildren.length; i++) {
                var child = $AA.createAnimation(obj.AnimationChildren[i]);
                if(child) {
                    animation.add(child);
                }
            }
        } else {
            throw Error.argument('obj', String.format(Sys.Extended.UI.Resources.Animation_ChildrenNotAllowed, type.getName()));
        }
    }

    // Get the list of all properties available to set on the current animation's
    // type.  We create a mapping from the property's lowercase friendly name
    // (i.e., "duration") to the name of its setter (i.e., "set_duration").  This is
    // essentialy in setting properties so we only copy over valid values.
    var properties = type.__animationProperties;
    if(!properties) {
        // Get the properties for this type by walking its prototype - by doing
        // this we'll effectively ignore anything not defined in the prototype
        type.__animationProperties = {};
        type.resolveInheritance();
        for(var name in type.prototype) {
            if(name.startsWith('set_')) {
                type.__animationProperties[name.substr(4).toLowerCase()] = name;
            }
        }

        // Remove the 'id' property as it shouldn't be set by the animation
        // (NOTE: the 'target' proeprty shouldn't be set to a string value, but it
        // isn't removed because it can be used as a valid dynamic property - i.e.
        // Target="myElement" *DOES NOT WORK*, but it's OKAY to use
        // TargetScript="$get('myElement')".  Validation for this scenario will be
        // handled automatically by _validateParams when debugging as Target is required
        // to be a dom element.)
        delete type.__animationProperties['id'];
        properties = type.__animationProperties;
    }

    // Loop through each of the properties in the object and check if it's in the list
    // of valid property names.  We will check the type of the propertyName to make sure
    // it's a String (as other types can be added by the ASP.NET AJAX compatability
    // layers to all objects and cause errors if you don't exclude them).  We will first
    // try to set a property with the same name if it exists.  If we can't find one but
    // the name of the property ends in 'script', then we will try to set a corresponding
    // dynamic property.  If no matches can be found at all, we'll raise an error when
    // debugging.
    for(var property in obj) {
        // Ignore the special properties in the object that don't correspond
        // to any actual properties on the animation
        var prop = property.toLowerCase();
        if(prop == 'animationname' || prop == 'animationchildren') {
            continue;
        }

        var value = obj[property];

        // Try to directly set the value of this property
        var setter = properties[prop];
        if(setter && String.isInstanceOfType(setter) && animation[setter]) {
            // Ignore any exceptions raised by setting the property
            // unless we're debugging
            if(!Sys.Debug.isDebug) {
                try { animation[setter](value); } catch(ex) { }
            } else {
                animation[setter](value);
            }
        } else {
            // Try to set the value of a dynamic property
            if(prop.endsWith('script')) {
                setter = properties[prop.substr(0, property.length - 6)];
                if(setter && String.isInstanceOfType(setter) && animation[setter]) {
                    animation.DynamicProperties[setter] = value;
                } else if(Sys.Debug.isDebug) {
                    // Raise an error when debugging if we could not find a matching property
                    throw Error.argument('obj', String.format(Sys.Extended.UI.Resources.Animation_NoDynamicPropertyFound, property, property.substr(0, property.length - 5)));
                }
            } else if(Sys.Debug.isDebug) {
                // Raise an error when debugging if we could not find a matching property
                throw Error.argument('obj', String.format(Sys.Extended.UI.Resources.Animation_NoPropertyFound, property));
            }
        }
    }

    return animation;
}

// In the Xml comments for each of the animations below, there is a special <animation /> tag
// that describes how the animation is referenced from a generic XML animation description

///<summary>
/// Animation is an abstract base class used as a starting point for all the other animations.
/// It provides the basic mechanics for the animation (playing, pausing, stopping, timing, etc.)
/// and leaves the actual animation to be done in the abstract methods getAnimatedValue
/// and setValue.
///</summary>
///<member name="cT:AjaxControlToolkit.Animation" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.Animation.ctor" />
/// <param name="target" type="Object">Target of the animation.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
$AA.Animation = function(target, duration, fps) {
    // Animations need to be as fast as possible - even in debug mode.  Don't add validation code to
    // methods involved in every step of the animation.   
    //
    // The DynamicProperties collection is used to associate JavaScript expressions with
    // properties.  The expressions are evaluated just before the animation is played
    // everytime (in the base onStart method).  The object itself maps strings with the
    // names of property setters (like "set_verticalOffset") to JavaScript expressions
    // (like "$find('MyBehavior').get_element().offsetHeight").  Note specifically that
    // the dynamic properties are JavaScript expressions and not abitrary statements (i.e.
    // you can't include things like "return foo;"), although you can include anything
    // inside an anonymous function definition that you immediately invoke (i.e.,
    // "(function() { return foo; })()").  A dynamic property can be set in the generic
    // XML animation description by appending Script onto any legitimate property name
    // (for example, instead of Height="70" we could use
    // HeightScript="$find('MyBehavior').get_element().offsetHeight").  Any exceptions
    // raised when setting dynamic properties (including both JavaScript evaluation errors
    // and other exceptions raised by property setters) will only be propogated when
    // debugging.

    $AA.Animation.initializeBase(this);

    ///<summary>
    /// Length of the animation in seconds. The default is 1.
    ///</summary>
    ///<getter>get_duration</getter>
    ///<setter>set_duration</setter>
    ///<member name="cP:AjaxControlToolkit.Animation.duration" />
    this._duration = 1;

    ///<summary>
    /// Number of steps per second. The default is 25.
    ///</summary>
    ///<getter>get_fps</getter>
    ///<setter>set_fps</setter>
    ///<member name="cP:AjaxControlToolkit.Animation.fps" />
    this._fps = 25;

    ///<summary>
    /// Target Sys.UI.DomElement of the animation. If the target of this animation is null and
    /// the animation has a parent, then it will recursively use the target of
    /// the parent animation instead.
    ///</summary>
    /// <remarks>
    /// Do not set this property in a generic Xml animation description. It should be set
    /// using either the extender's TargetControlID or the AnimationTarget property (the latter
    /// maps to Sys.Extended.UI.Animation.set_animationTarget).  The only valid way to
    /// set this property in the generic Xml animation description is to use the dynamic
    /// property TargetScript="$get('myElement')".
    /// </remarks>
    ///<getter>get_target</getter>
    ///<setter>set_target</setter>
    ///<member name="cP:AjaxControlToolkit.Animation.target" />
    this._target = null;

    // Tick event handler
    this._tickHandler = null;

    // Animation timer
    this._timer = null;

    ///<summary>
    /// Percentage of the animation already played.
    ///</summary>
    ///<getter>get_percentComplete</getter>
    ///<setter>set_percentComplete</setter>
    ///<member name="cP:AjaxControlToolkit.Animation.percentComplete" />
    this._percentComplete = 0;

    // Percentage of the animation to play on each step
    this._percentDelta = null;

    // Reference to the animation that owns this animation (currently only set in 
    // ParallelAnimation.add).  This concept of ownership allows an entire animation
    // subtree to be driven off a single timer so all the operations are properly
    // synchronized.
    this._owner = null;

    // Reference to the animation that contains this as a child (this is set
    // in ParentAnimation.add).  The primary use of the parent animation is in
    // resolving the animation target when one isn't specified.
    this._parentAnimation = null;

    // The DynamicProperties collection is used to associate JavaScript expressions with
    // properties.  The expressions are evaluated just before the animation is played
    // everytime (in the base onStart method).  See the additional information in the
    // XML <field> comment above.
    this.DynamicProperties = {};

    // Set the target, duration, and fps if they were provided in the constructor
    if(target) {
        this.set_target(target);
    }
    if(duration) {
        this.set_duration(duration);
    }
    if(fps) {
        this.set_fps(fps);
    }
}

$AA.Animation.prototype = {
    dispose: function() {
        if(this._timer) {
            this._timer.dispose();
            this._timer = null;
        }

        this._tickHandler = null;
        this._target = null;

        $AA.Animation.callBaseMethod(this, 'dispose');
    },

    /// <summary>
    /// Play the animation from the beginning or where it was left off when paused.
    /// </summary>
    /// <remarks>
    /// If this animation is the child of another, you must call play on its parent instead.
    /// </remarks>
    /// <member name="cM:AjaxControlToolkit.Animation.play" />
    play: function() {
        // If ownership of this animation has been claimed, then we'll require the parent to
        // handle playing the animation (this is very important because then the entire animation
        // tree runs on the same timer and updates consistently)
        if(!this._owner) {
            var resume = true;
            if(!this._timer) {
                resume = false;

                if(!this._tickHandler) {
                    this._tickHandler = Function.createDelegate(this, this._onTimerTick);
                }

                this._timer = new Sys.Timer();
                this._timer.add_tick(this._tickHandler);

                this.onStart();

                this._timer.set_interval(1000 / this._fps);
                this._percentDelta = 100 / (this._duration * this._fps);
                this._updatePercentComplete(0, true);
            }

            this._timer.set_enabled(true);

            this.raisePropertyChanged('isPlaying');
            if(!resume) {
                this.raisePropertyChanged('isActive');
            }
        }
    },

    /// <summary>
    /// Pause the animation if it is playing. Calling play will resume where
    /// the animation left off.
    /// </summary>
    /// <remarks>
    /// If this animation is the child of another, you must call pause on its parent instead.
    /// </remarks>
    /// <member name="cM:AjaxControlToolkit.Animation.pause" />
    pause: function() {
        if(!this._owner) {
            if(this._timer) {
                this._timer.set_enabled(false);

                this.raisePropertyChanged('isPlaying');
            }
        }
    },

    /// <summary>
    /// Stop playing the animation.
    /// </summary>
    /// <remarks>
    /// If this animation is the child of another, you must call stop on
    /// its parent instead.
    /// </remarks>
    /// <member name="cM:AjaxControlToolkit.Animation.stop" />
    /// <param name="finish" type="Boolean">Whether or not stopping the animation should leave the target element in a state
    /// consistent with the animation playing completely by performing the last step.
    /// The default value is true.</param>
    stop: function(finish) {
        if(!this._owner) {
            var t = this._timer;
            this._timer = null;
            if(t) {
                t.dispose();

                if(this._percentComplete !== 100) {
                    this._percentComplete = 100;
                    this.raisePropertyChanged('percentComplete');
                    if(finish || finish === undefined) {
                        this.onStep(100);
                    }
                }
                this.onEnd();

                this.raisePropertyChanged('isPlaying');
                this.raisePropertyChanged('isActive');
            }
        }
    },

    /// <summary>
    /// The onStart method is called just before the animation is played each time.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.Animation.onStart" />
    onStart: function() {
        this.raise_started();

        // Initialize any dynamic properties
        for(var property in this.DynamicProperties) {
            try {
                // Invoke the property's setter on the evaluated expression
                this[property](eval(this.DynamicProperties[property]));
            } catch(ex) {
                // Propogate any exceptions if we're debugging, otherwise eat them
                if(Sys.Debug.isDebug) {
                    throw ex;
                }
            }
        }
    },

    /// <summary>
    /// The onStep method is called repeatedly to progress the animation through each frame.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.Animation.onStep" />
    /// <param name="percentage" type="Number">Percentage of the animation already complete.</param>
    onStep: function(percentage) {
        this.setValue(this.getAnimatedValue(percentage));
        this.raise_step();
    },

    /// <summary>
    /// The onEnd method is called just after the animation is played each time.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.Animation.onEnd" />
    onEnd: function() {
        this.raise_ended();
    },

    /// <summary>
    /// Determine the state of the animation after the given percentage of its duration has elapsed.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.Animation.getAnimatedValue" />
    /// <param name="percentage" type="Number">Percentage of the animation already complete.</param>
    getAnimatedValue: function(percentage) {
        // Returns state of the animation after the given percentage of its duration has elapsed that will
        // be passed to setValue
        throw Error.notImplemented();
    },

    /// <summary>
    /// Set the current state of the animation.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.Animation.setValue" />
    /// <param name="value" type="Object">Animation state.</param>
    setValue: function(value) {
        // Returns current state of the animation (as retreived from getAnimatedValue)
        throw Error.notImplemented();
    },

    /// <summary>
    /// The interpolate function is used to find the appropriate value between starting and
    /// ending values given the current percentage.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.Animation.interpolate" />
    /// <param name="start" type="Number">Start of the range to interpolate.</param>
    /// <param name="end" type="Number">End of the range to interpolate.</param>
    /// <param name="percentage" type="Number">Percentage completed in the range to interpolate.</param>
    interpolate: function(start, end, percentage) {
        // In the future, we hope to make several implementations of this available so we can dynamically
        // change the apparent speed of the animations, although it may make more sense to modify the
        // _updatePercentComplete function instead.
        // Returns the desired percentage between the start and end values        

        return start + (end - start) * (percentage / 100);
    },

    _onTimerTick: function() {
        // Handler for the tick event to move the animation along through its duration
        this._updatePercentComplete(this._percentComplete + this._percentDelta, true);
    },

    _updatePercentComplete: function(percentComplete, animate) {
        // Update the animation and its target given the current percentage of its duration that
        // has already elapsed
        //
        // "percentComplete" - percentage of the animation duration that has already elapsed
        // "animate" - whether or not updating the animation should visually modify the animation's target

        if(percentComplete > 100) {
            percentComplete = 100;
        }

        this._percentComplete = percentComplete;
        this.raisePropertyChanged('percentComplete');

        if(animate) {
            this.onStep(percentComplete);
        }

        if(percentComplete === 100) {
            this.stop(false);
        }
    },

    /// <summary>
    /// Makes this animation the child of another animation.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.Animation.setOwner" />
    /// <param name="owner" type="Object">Parent animation.</param>
    setOwner: function(owner) {
        this._owner = owner;
    },

    ///<summary>
    /// Occurs each time before animation starts playing.
    ///</summary>
    ///<member name="cE:AjaxControlToolkit.Animation.started" />
    ///<event add="add_started" remove="remove_started" raise="raise_started" />
    add_started: function(handler) {
        this.get_events().addHandler("started", handler);
    },
    remove_started: function(handler) {
        this.get_events().removeHandler("started", handler);
    },
    raise_started: function() {
        var handlers = this.get_events().getHandler('started');
        if(handlers)
            handlers(this, Sys.EventArgs.Empty);
    },
    raiseStarted: function() {
        Sys.Extended.Deprecated("raiseStarted()", "raise_started()");
        this.raise_started();
    },

    ///<summary>
    /// Occurs each time after animation stops playing.
    ///</summary>
    ///<member name="cE:AjaxControlToolkit.Animation.ended" />
    ///<event add="add_ended" remove="remove_ended" raise="raise_ended" />
    add_ended: function(handler) {
        this.get_events().addHandler("ended", handler);
    },
    remove_ended: function(handler) {
        this.get_events().removeHandler("ended", handler);
    },
    raise_ended: function() {
        var handlers = this.get_events().getHandler('ended');
        if(handlers)
            handlers(this, Sys.EventArgs.Empty);
    },
    raiseEnded: function() {
        Sys.Extended.Deprecated("raiseEnded()", "raise_ended()");
        this.raise_ended();
    },

    ///<summary>
    /// Occurs on animation's each frame.
    ///</summary>
    ///<member name="cE:AjaxControlToolkit.Animation.step" />
    ///<event add="add_step" remove="remove_step" raise="raise_step" />
    add_step: function(handler) {
        this.get_events().addHandler("step", handler);
    },
    remove_step: function(handler) {
        this.get_events().removeHandler("step", handler);
    },
    raise_step: function() {
        var handlers = this.get_events().getHandler('step');
        if(handlers)
            handlers(this, Sys.EventArgs.Empty);
    },
    raiseStep: function() {
        Sys.Extended.Deprecated("raiseStep()", "raise_step()");
        this.raise_ended();
    },

    get_target: function() {
        if(!this._target && this._parentAnimation) {
            return this._parentAnimation.get_target();
        }
        return this._target;
    },
    set_target: function(value) {
        if(this._target != value) {
            this._target = value;
            this.raisePropertyChanged('target');
        }
    },

    /// <summary>
    /// Set the animation target by its identifier.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.Animation.setAnimationTarget" />
    /// <param name="id" type="Object">ID of a Sys.UI.DomElement or Sys.UI.Control to use as the target of the animation
    /// If no Sys.UI.DomElement or Sys.UI.Control can be found for the given ID, an
    /// argument exception will be thrown.</param>
    setAnimationTarget: function(id) {
        // Try to find a Sys.UI.DomElement
        var target = null;
        var element = $get(id);
        if(element) {
            target = element;
        } else {
            // Try to find the control in the AJAX controls collection
            var ctrl = $find(id);
            if(ctrl) {
                element = ctrl.get_element();
                if(element) {
                    target = element;
                }
            }
        }

        // Use the new target if we have one, or raise an error if not
        if(target) {
            this.set_target(target);
        } else {
            throw Error.argument('id', String.format(Sys.Extended.UI.Resources.Animation_TargetNotFound, id));
        }
    },
    set_animationTarget: function(id) {
        Sys.Extended.Deprecated("setAnimationTarget(id)", "set_animationTarget(id)");
        this.setAnimationTarget(id);
    },

    get_duration: function() {
        return this._duration;
    },
    set_duration: function(value) {
        value = this._getFloat(value);
        if(this._duration != value) {
            this._duration = value;
            this.raisePropertyChanged('duration');
        }
    },

    get_fps: function() {
        return this._fps;
    },
    set_fps: function(value) {
        value = this._getInteger(value);
        if(this.fps != value) {
            this._fps = value;
            this.raisePropertyChanged('fps');
        }
    },

    ///<summary>
    /// A boolean value that determines whether or not animation is active.
    ///</summary>
    ///<getter>get_isActive</getter>
    ///<member name="cP:AjaxControlToolkit.Animation.isActive" />
    get_isActive: function() {
        return (this._timer !== null);
    },

    ///<summary>
    /// A boolean value that determines whether or not animation is currently playing.
    ///</summary>
    ///<getter>get_isPlaying</getter>
    ///<member name="cP:AjaxControlToolkit.Animation.isPlaying" />
    get_isPlaying: function() {
        return (this._timer !== null) && this._timer.get_enabled();
    },

    get_percentComplete: function() {
        return this._percentComplete;
    },

    _getBoolean: function(value) {
        if(String.isInstanceOfType(value)) {
            return Boolean.parse(value);
        }
        return value;
    },

    _getInteger: function(value) {
        if(String.isInstanceOfType(value)) {
            return parseInt(value);
        }
        return value;
    },

    _getFloat: function(value) {
        if(String.isInstanceOfType(value)) {
            return parseFloat(value);
        }
        return value;
    },

    _getEnum: function(value, type) {
        // Helper to convert strings to enum values for property setters
        // Returns value that has been converted if it was a string
        //
        // "value" - value to convert if it's a string
        // "type" - type of the enum to convert to

        if(String.isInstanceOfType(value) && type && type.parse) {
            return type.parse(value);
        }
        return value;
    }
}
$AA.Animation.registerClass('Sys.Extended.UI.Animation.Animation', Sys.Component);
$AA.registerAnimation('animation', $AA.Animation);

///<summary>
/// The ParentAnimation serves as a base class for all animations that contain children (such as
/// Sys.Extended.UI.Animation.ParallelAnimation, Sys.Extended.UI.SequenceAnimation,
/// etc.). It does not actually play the animations, so any classes that inherit from it must do so.  Any animation
/// that requires nested child animations must inherit from this class, although it will likely want to inherit off of
/// Sys.Extended.UI.Animation.ParallelAnimation or Sys.Extended.UI.SequenceAnimation
/// which will actually play their child animations.
///</summary>
///<member name="cT:AjaxControlToolkit.ParentAnimation" base="AjaxControlToolkit.Animation" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.ParentAnimation.ctor" />
/// <param name="target" type="Object">Target of the animation.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="animations" type="Object">Array of child animations to be played.</param>
$AA.ParentAnimation = function(target, duration, fps, animations) {
    $AA.ParentAnimation.initializeBase(this, [target, duration, fps]);

    this._animations = [];

    // Add any child animations passed into the constructor
    if(animations && animations.length) {
        for(var i = 0; i < animations.length; i++) {
            this.add(animations[i]);
        }
    }
}
$AA.ParentAnimation.prototype = {
    initialize: function() {
        // Initialize the parent along with any child animations that have not yet been initialized themselves
        $AA.ParentAnimation.callBaseMethod(this, 'initialize');

        // Initialize all the uninitialized child animations
        if(this._animations) {
            for(var i = 0; i < this._animations.length; i++) {
                var animation = this._animations[i];
                if(animation && !animation.get_isInitialized) {
                    animation.initialize();
                }
            }
        }
    },

    dispose: function() {
        this.clear();
        this._animations = null;
        $AA.ParentAnimation.callBaseMethod(this, 'dispose');
    },

    ///<summary>
    /// Array of child animations to be played (there are no assumptions placed on order because it will matter for some
    /// derived animations like Sys.Extended.UI.Animation.SequenceAnimation, but not for
    /// others like Sys.Extended.UI.Animation.ParallelAnimation). To manipulate the child
    /// animations, use the functions add, clear, remove, and removeAt.
    ///</summary>
    ///<getter>get_target</getter>
    ///<member name="cP:AjaxControlToolkit.ParentAnimation.animations" />
    get_animations: function() {
        return this._animations;
    },

    /// <summary>
    /// Add an animation as a child of this animation.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ParentAnimation.add" />
    /// <param name="animation" type="Object">Child animation to add.</param>
    add: function(animation) {
        if(this._animations) {
            if(animation) {
                animation._parentAnimation = this;
            }
            Array.add(this._animations, animation);
            this.raisePropertyChanged('animations');
        }
    },

    /// <summary>
    /// Remove the animation from the array of child animations.
    /// This will dispose the removed animation.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ParentAnimation.remove" />
    /// <param name="animation" type="Object">Child animation to remove.</param>
    remove: function(animation) {
        if(this._animations) {
            if(animation) {
                animation.dispose();
            }
            Array.remove(this._animations, animation);
            this.raisePropertyChanged('animations');
        }
    },

    /// <summary>
    /// Remove the animation at a given index from the array of child animations.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ParentAnimation.removeAt" />
    /// <param name="index" type="Number">Index of the child animation to remove.</param>
    removeAt: function(index) {
        if(this._animations) {
            var animation = this._animations[index];
            if(animation) {
                animation.dispose();
            }
            Array.removeAt(this._animations, index);
            this.raisePropertyChanged('animations');
        }
    },

    /// <summary>
    /// Clear the array of child animations.
    /// This will dispose the cleared child animations.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ParentAnimation.clear" />
    clear: function() {
        if(this._animations) {
            for(var i = this._animations.length - 1; i >= 0; i--) {
                this._animations[i].dispose();
                this._animations[i] = null;
            }
            Array.clear(this._animations);
            this._animations = [];
            this.raisePropertyChanged('animations');
        }
    }
}
$AA.ParentAnimation.registerClass('Sys.Extended.UI.Animation.ParentAnimation', $AA.Animation);
$AA.registerAnimation('parent', $AA.ParentAnimation);

///<summary>
/// The ParallelAnimation plays several animations simultaneously. It inherits from
/// Sys.Extended.UI.Animation.ParentAnimation, but makes itself the owner of all
/// its child animations to allow the use a single timer and syncrhonization mechanisms shared with
/// all the children (in other words, the duration properties of any child animations
/// are ignored in favor of the parent's duration). It is very useful in creating
/// sophisticated effects through combination of simpler animations.
///</summary>
///<member name="cT:AjaxControlToolkit.ParallelAnimation" base="AjaxControlToolkit.ParentAnimation" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.ParallelAnimation.ctor" />
/// <param name="target" type="Object">Target of the animation.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="animations" type="Object">Array of child animations.</param>
$AA.ParallelAnimation = function(target, duration, fps, animations) {
    $AA.ParallelAnimation.initializeBase(this, [target, duration, fps, animations]);
}
$AA.ParallelAnimation.prototype = {
    /// <summary>
    /// Add an animation as a child of this animation and make ourselves its owner.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ParallelAnimation.add" />
    /// <param name="animation" type="Object">Child animation to add.</param>
    add: function(animation) {
        $AA.ParallelAnimation.callBaseMethod(this, 'add', [animation]);
        animation.setOwner(this);
    },

    /// <summary>
    /// Get the child animations ready to play.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ParallelAnimation.onStart" />
    onStart: function() {
        $AA.ParallelAnimation.callBaseMethod(this, 'onStart');
        var animations = this.get_animations();
        for(var i = 0; i < animations.length; i++) {
            animations[i].onStart();
        }
    },

    /// <summary>
    /// Progress the child animations through each frame.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ParallelAnimation.onStart" />
    /// <param name="percentage" type="Number">Percentage of the animation already complete.</param>
    onStep: function(percentage) {
        var animations = this.get_animations();
        for(var i = 0; i < animations.length; i++) {
            animations[i].onStep(percentage);
        }
    },

    /// <summary>
    /// Finish playing all of the child animations.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ParallelAnimation.onEnd" />
    onEnd: function() {
        var animations = this.get_animations();
        for(var i = 0; i < animations.length; i++) {
            animations[i].onEnd();
        }
        $AA.ParallelAnimation.callBaseMethod(this, 'onEnd');
    }
}
$AA.ParallelAnimation.registerClass('Sys.Extended.UI.Animation.ParallelAnimation', $AA.ParentAnimation);
$AA.registerAnimation('parallel', $AA.ParallelAnimation);

///<summary>
/// The SequenceAnimation runs several animations one after the other.  It can also
/// repeat the sequence of animations for a specified number of iterations (which defaults to a
/// single iteration, but will repeat forever if you specify zero or less iterations). Also, the
/// SequenceAnimation cannot be a child of a Sys.Extended.UI.Animation.ParallelAnimation
/// (or any animation inheriting from it).
///</summary>
///<member name="cT:AjaxControlToolkit.SequenceAnimation" base="AjaxControlToolkit.ParentAnimation" />

/// <summary>
/// The SequenceAnimation ignores the duration and fps
/// properties, and will let each of its child animations use any settings they please.
/// </summary>
/// <member name="cM:AjaxControlToolkit.SequenceAnimation.ctor" />
/// <param name="target" type="Object">Target of the animation.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="animations" type="Object">Array of child animations.</param>
/// <param name="iterations" type="Number">Number of times to repeatedly play the sequence. If zero or less iterations are specified, the sequence
/// will repeat forever. The default value is 1 iteration.</param>
$AA.SequenceAnimation = function(target, duration, fps, animations, iterations) {
    $AA.SequenceAnimation.initializeBase(this, [target, duration, fps, animations]);

    // Handler used to determine when an animation has finished
    this._handler = null;

    // Flags to note whether we're playing, paused, or stopped
    this._paused = false;
    this._playing = false;

    // Index of the currently executing animation in the sequence
    this._index = 0;

    // Counter used when playing the animation to determine the remaining number of times to play the entire sequence
    this._remainingIterations = 0;

    ///<summary>
    /// Number of times to repeatedly play the sequence. If zero or less iterations are specified, the sequence
    /// will repeat forever. The default value is 1 iteration.
    ///</summary>
    ///<getter>get_iterations</getter>
    ///<setter>set_iterations</setter>
    ///<member name="cP:AjaxControlToolkit.SequenceAnimation.iterations" />
    this._iterations = (iterations !== undefined) ? iterations : 1;
}
$AA.SequenceAnimation.prototype = {
    dispose: function() {
        this._handler = null;
        $AA.SequenceAnimation.callBaseMethod(this, 'dispose');
    },

    /// <summary>
    /// Stop playing the entire sequence of animations.
    /// </summary>
    /// <remarks>
    /// Stopping this animation will perform the last step of each child animation, thereby leaving their
    /// target elements in a state consistent with the animation playing completely. If this animation is
    /// the child of another, you must call stop on its parent instead.
    /// </remarks>
    /// <member name="cM:AjaxControlToolkit.SequenceAnimation.stop" />
    stop: function() {
        if(this._playing) {
            var animations = this.get_animations();
            if(this._index < animations.length) {
                // Remove the handler from the currently running animation
                animations[this._index].remove_ended(this._handler);
                // Call stop on all remaining animations to ensure their
                // effects will be seen
                for(var i = this._index; i < animations.length; i++) {
                    animations[i].stop();
                }
            }
            this._playing = false;
            this._paused = false;
            this.raisePropertyChanged('isPlaying');
            this.onEnd();
        }
    },

    /// <summary>
    /// Pause the animation if it is playing. Calling play will resume where
    /// the animation left off.
    /// </summary>
    /// <remarks>
    /// If this animation is the child of another, you must call pause on its parent instead.
    /// </remarks>
    /// <member name="cM:AjaxControlToolkit.SequenceAnimation.pause" />
    pause: function() {
        if(this.get_isPlaying()) {
            var current = this.get_animations()[this._index];
            if(current != null) {
                current.pause();
            }
            this._paused = true;
            this.raisePropertyChanged('isPlaying');
        }
    },

    /// <summary>
    /// Play the sequence of animations from the beginning or where it was left off when paused.
    /// </summary>
    /// <remarks>
    /// If this animation is the child of another, you must call play on its parent instead.
    /// </remarks>
    /// <member name="cM:AjaxControlToolkit.SequenceAnimation.play" />
    play: function() {
        var animations = this.get_animations();
        if(!this._playing) {
            this._playing = true;
            if(this._paused) {
                this._paused = false;
                var current = animations[this._index];
                if(current != null) {
                    current.play();
                    this.raisePropertyChanged('isPlaying');
                }
            } else {
                this.onStart();
                // Reset the index and attach the handler to the first
                this._index = 0;
                var first = animations[this._index];
                if(first) {
                    first.add_ended(this._handler);
                    first.play();
                    this.raisePropertyChanged('isPlaying');
                } else {
                    this.stop();
                }
            }
        }
    },

    /// <summary>
    /// The onStart method is called just before the animation is played each time.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.SequenceAnimation.onStart" />
    onStart: function() {
        $AA.SequenceAnimation.callBaseMethod(this, 'onStart');
        this._remainingIterations = this._iterations - 1;

        // Create the handler we attach to each animation as it plays to determine when we've finished with it
        if(!this._handler) {
            this._handler = Function.createDelegate(this, this._onEndAnimation);
        }
    },

    _onEndAnimation: function() {
        // Wait for the end of each animation, and then continue by playing the other animations remaining
        // in the sequence.  Stop when it reaches the last animation and there are no remaining iterations.

        // Remove the handler from the current animation
        var animations = this.get_animations();
        var current = animations[this._index++];
        if(current) {
            current.remove_ended(this._handler);
        }

        // Keep running animations and stop when we're out
        if(this._index < animations.length) {
            var next = animations[this._index];
            next.add_ended(this._handler);
            next.play();
        } else if(this._remainingIterations >= 1 || this._iterations <= 0) {
            this._remainingIterations--;
            this._index = 0;
            var first = animations[0];
            first.add_ended(this._handler);
            first.play();
        } else {
            this.stop();
        }
    },

    /// <summary>
    /// Raises an invalid operation exception because this will only be called if a SequenceAnimation
    /// has been nested inside an Sys.Extended.UI.Animation.ParallelAnimation (or a derived type).
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.SequenceAnimation.onStep" />
    /// <param name="percentage" type="Number">Percentage of the animation already complete.</param>
    onStep: function(percentage) {
        throw Error.invalidOperation(Sys.Extended.UI.Resources.Animation_CannotNestSequence);
    },

    /// <summary>
    /// The onEnd method is called just after the animation is played each time.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.SequenceAnimation.onEnd" />
    onEnd: function() {
        this._remainingIterations = 0;
        $AA.SequenceAnimation.callBaseMethod(this, 'onEnd');
    },

    get_isActive: function() {
        return true;
    },

    get_isPlaying: function() {
        return this._playing && !this._paused;
    },

    get_iterations: function() {
        return this._iterations;
    },
    set_iterations: function(value) {
        value = this._getInteger(value);
        if(this._iterations != value) {
            this._iterations = value;
            this.raisePropertyChanged('iterations');
        }
    },

    ///<summary>
    /// A boolean value that determines whether or not animation runs in an infinite loop until it is explicitly stopped.
    ///</summary>
    ///<getter>get_isInfinite</getter>
    ///<member name="cP:AjaxControlToolkit.SequenceAnimation.isInfinite" />
    get_isInfinite: function() {
        return this._iterations <= 0;
    }
}
$AA.SequenceAnimation.registerClass('Sys.Extended.UI.Animation.SequenceAnimation', $AA.ParentAnimation);
$AA.registerAnimation('sequence', $AA.SequenceAnimation);

///<summary>
/// The SelectionAnimation will run a single animation chosen from of its child animations. It is
/// important to note that the SelectionAnimation ignores the duration and fps
/// properties, and will let each of its child animations use any settings they please.  This is a base class with no
/// functional implementation, so consider using ConditionAnimation or CaseAnimation instead.
///</summary>
///<member name="cT:AjaxControlToolkit.SelectionAnimation" base="AjaxControlToolkit.ParentAnimation" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.SelectionAnimation.ctor" />
/// <param name="target" type="Object">Target of the animation.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="animations" type="Object">Array of child animations to be played.</param>
$AA.SelectionAnimation = function(target, duration, fps, animations) {
    $AA.SelectionAnimation.initializeBase(this, [target, duration, fps, animations]);

    // Index of the animation selected to play
    this._selectedIndex = -1;

    // Reference to the animation selected to play
    this._selected = null;
}
$AA.SelectionAnimation.prototype = {
    /// <summary>
    /// Get the index of the animation that is selected to be played. If this returns an index outside the bounds of
    /// the child animations array, then nothing is played.    
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.SelectionAnimation.getSelectedIndex" />
    getSelectedIndex: function() {
        throw Error.notImplemented();
    },

    /// <summary>
    /// The onStart method is called just before the animation is played each time.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.SelectionAnimation.onStart" />
    onStart: function() {
        $AA.SelectionAnimation.callBaseMethod(this, 'onStart');

        var animations = this.get_animations();
        this._selectedIndex = this.getSelectedIndex();
        if(this._selectedIndex >= 0 && this._selectedIndex < animations.length) {
            this._selected = animations[this._selectedIndex];
            if(this._selected) {
                this._selected.setOwner(this);
                this._selected.onStart();
            }
        }
    },

    /// <summary>
    /// The onStep method is called repeatedly to progress the animation through each frame.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.SelectionAnimation.onStep" />
    /// <param name="percentage" type="Number">Percentage of the animation already complete.</param>
    onStep: function(percentage) {
        if(this._selected) {
            this._selected.onStep(percentage);
        }
    },

    /// <summary>
    /// The onEnd method is called just after the animation is played each time.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.SelectionAnimation.onEnd" />
    onEnd: function() {
        if(this._selected) {
            this._selected.onEnd();
            this._selected.setOwner(null);
        }
        this._selected = null;
        this._selectedIndex = null;
        $AA.SelectionAnimation.callBaseMethod(this, 'onEnd');
    }
}
$AA.SelectionAnimation.registerClass('Sys.Extended.UI.Animation.SelectionAnimation', $AA.ParentAnimation);
$AA.registerAnimation('selection', $AA.SelectionAnimation);

///<summary>
/// The ConditionAnimation is used as a control structure to play a specific child animation
/// depending on the result of executing the conditionScript.  If the conditionScript
/// evaluates to true, the first child animation is played.  If it evaluates to false,
/// the second child animation is played (although nothing is played if a second animation is not present).
///</summary>
///<member name="cT:AjaxControlToolkit.ConditionAnimation" base="AjaxControlToolkit.SelectionAnimation" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.ConditionAnimation.ctor" />
/// <param name="target" type="Object">Target of the animation.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="animations" type="Object">Array of child animations to be played.</param>
/// <param name="conditionScript" type="Object">JavaScript that should evaluate to true or false to determine which child
/// animation to play.</param>
$AA.ConditionAnimation = function(target, duration, fps, animations, conditionScript) {
    $AA.ConditionAnimation.initializeBase(this, [target, duration, fps, animations]);

    // Condition to determine which index we will play
    this._conditionScript = conditionScript;
}
$AA.ConditionAnimation.prototype = {
    /// <summary>
    /// Get the index of the animation that is selected to be played. If this returns an index outside the bounds of
    /// the child animations array, then nothing is played.    
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ConditionAnimation.getSelectedIndex" />
    getSelectedIndex: function() {
        var selected = -1;
        if(this._conditionScript && this._conditionScript.length > 0) {
            try {
                selected = eval(this._conditionScript) ? 0 : 1;
            } catch(ex) {
            }
        }
        return selected;
    },

    /// <summary>
    /// JavaScript that should evaluate to true or false to determine which
    /// child animation to play.
    /// </summary>
    /// <getter>get_conditionScript</getter>
    /// <setter>set_conditionScript</setter>
    /// <member name="cP:AjaxControlToolkit.ConditionAnimation.conditionScript" />
    get_conditionScript: function() {
        return this._conditionScript;
    },
    set_conditionScript: function(value) {
        if(this._conditionScript != value) {
            this._conditionScript = value;
            this.raisePropertyChanged('conditionScript');
        }
    }
}
$AA.ConditionAnimation.registerClass('Sys.Extended.UI.Animation.ConditionAnimation', $AA.SelectionAnimation);
$AA.registerAnimation('condition', $AA.ConditionAnimation);

///<summary>
/// The CaseAnimation is used as a control structure to play a specific child animation depending on
/// the result of executing the selectScript, which should return the index of the child animation to
/// play (this is similar to the case or select statements in C#/VB, etc.). If the provided
/// index is outside the bounds of the child animations array (or if nothing was returned) then we will not play anything.
///</summary>
///<member name="cT:AjaxControlToolkit.CaseAnimation" base="AjaxControlToolkit.SelectionAnimation" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.CaseAnimation.ctor" />
/// <param name="target" type="Object">Target of the animation.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="animations" type="Object">Array of child animations to be played.</param>
/// <param name="selectScript" type="Object">JavaScript that should evaluate to the index of the appropriate child animation to play.  
/// If this returns an index outside the bounds of the child animations array, then nothing is played.</param>
$AA.CaseAnimation = function(target, duration, fps, animations, selectScript) {
    $AA.CaseAnimation.initializeBase(this, [target, duration, fps, animations]);

    // Condition to determine which index we will play
    this._selectScript = selectScript;
}
$AA.CaseAnimation.prototype = {
    /// <summary>
    /// Get the index of the animation that is selected to be played. If this returns an index outside the bounds of
    /// the child animations array, then nothing is played.    
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.CaseAnimation.getSelectedIndex" />
    getSelectedIndex: function() {
        var selected = -1;
        if(this._selectScript && this._selectScript.length > 0) {
            try {
                var result = eval(this._selectScript)
                if(result !== undefined)
                    selected = result;
            } catch(ex) {
            }
        }
        return selected;
    },

    /// <summary>
    /// JavaScript that should evaluate to the index of the appropriate child animation to play.  
    /// If this returns an index outside the bounds of the child animations array, then nothing is played.
    /// </summary>
    /// <getter>get_selectScript</getter>
    /// <setter>set_selectScript</setter>
    /// <member name="cP:AjaxControlToolkit.CaseAnimation.selectScript" />
    get_selectScript: function() {
        return this._selectScript;
    },
    set_selectScript: function(value) {
        if(this._selectScript != value) {
            this._selectScript = value;
            this.raisePropertyChanged('selectScript');
        }
    }
}
$AA.CaseAnimation.registerClass('Sys.Extended.UI.Animation.CaseAnimation', $AA.SelectionAnimation);
$AA.registerAnimation('case', $AA.CaseAnimation);


$AA.FadeEffect = function() {
    // The FadeEffect enumeration determines whether a fade animation is used to fade in or fade out.
    throw Error.invalidOperation();
}
$AA.FadeEffect.prototype = {
    FadeIn: 0,
    FadeOut: 1
}
$AA.FadeEffect.registerEnum("Sys.Extended.UI.Animation.FadeEffect", false);

///<summary>
/// The FadeAnimation is used to fade an element in or out of view, depending on the
/// provided Sys.Extended.UI.Animation.FadeEffect, by settings its opacity.
/// The minimum and maximum opacity values can be specified to precisely control the fade.
/// You may also consider using FadeInAnimation or FadeOutAnimation if you know the only direction you
/// are fading.
///</summary>
///<member name="cT:AjaxControlToolkit.FadeAnimation" base="AjaxControlToolkit.Animation" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.FadeAnimation.ctor" />
/// <param name="target" type="Object">Length of the animation in seconds. The default is 1.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="effect" type="Object">determine whether to fade the element in or fade the element out. The possible values are FadeIn
/// and FadeOut. The default value is FadeOut.</param>
/// <param name="minimumOpacity" type="Number">Minimum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 0.</param>
/// <param name="maximumOpacity" type="Number">Maximum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 1.</param>
/// <param name="forceLayoutInIE" type="Boolean">whether or not we should force a layout to be created for Internet Explorer by giving it a width and setting its
/// background color (the latter is required in case the user has ClearType enabled). The default value is true.
/// This is obviously ignored when working in other browsers.</param>
$AA.FadeAnimation = function(target, duration, fps, effect, minimumOpacity, maximumOpacity, forceLayoutInIE) {
    $AA.FadeAnimation.initializeBase(this, [target, duration, fps]);

    // The effect determines whether or not we fade in or out
    this._effect = (effect !== undefined) ? effect : $AA.FadeEffect.FadeIn;

    // Maximum and minimum opacities default to 100% and 0%
    this._max = (maximumOpacity !== undefined) ? maximumOpacity : 1;
    this._min = (minimumOpacity !== undefined) ? minimumOpacity : 0;

    // Starting and ending opacities
    this._start = this._min;
    this._end = this._max;

    // Whether the a layout has already been created (to work around IE
    // problems).
    this._layoutCreated = false;

    // Whether or not we should force a layout to be created for IE by giving it a width
    // and setting its background color (the latter is required in case the user has ClearType enabled).
    // http://msdn.microsoft.com/library/default.asp?url=/workshop/author/filter/reference/filters/alpha.asp
    this._forceLayoutInIE = (forceLayoutInIE === undefined || forceLayoutInIE === null) ? true : forceLayoutInIE;

    // Current target of the animation that is cached before the animation plays (since looking up
    // the target could mean walking all the way up to the root of the animation's tree, which we don't
    // want to do for every step of the animation)
    this._currentTarget = null;

    // Properly set up the min/max values provided by the constructor
    this._resetOpacities();
}
$AA.FadeAnimation.prototype = {
    _resetOpacities: function() {
        // Set the starting and ending opacity values based on the effect (i.e. when we're fading
        // in we go from _min to _max, but we go _max to
        // _min when fading out)

        if(this._effect == $AA.FadeEffect.FadeIn) {
            this._start = this._min;
            this._end = this._max;
        } else {
            this._start = this._max;
            this._end = this._min;
        }
    },

    _createLayout: function() {
        // Create a layout when using Internet Explorer (which entails setting a width and also
        // a background color if it currently has neither)

        var element = this._currentTarget;
        if(element) {
            // Get the original width/height/back color
            this._originalWidth = $common.getCurrentStyle(element, 'width');
            var originalHeight = $common.getCurrentStyle(element, 'height');
            this._originalBackColor = $common.getCurrentStyle(element, 'backgroundColor');

            // Set the width which will force the creation of a layout
            if((!this._originalWidth || this._originalWidth == '' || this._originalWidth == 'auto') &&
                (!originalHeight || originalHeight == '' || originalHeight == 'auto')) {
                element.style.width = element.offsetWidth + 'px';
            }

            // Set the back color to avoid ClearType problems
            if(!this._originalBackColor || this._originalBackColor == '' || this._originalBackColor == 'transparent' || this._originalBackColor == 'rgba(0, 0, 0, 0)') {
                element.style.backgroundColor = $common.getInheritedBackgroundColor(element);
            }

            // Mark that we've created the layout so we only do it once
            this._layoutCreated = true;
        }
    },

    /// <summary>
    /// The onStart method is called just before the animation is played each time.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.FadeAnimation.onStart" />
    onStart: function() {
        $AA.FadeAnimation.callBaseMethod(this, 'onStart');

        this._currentTarget = this.get_target();
        this.setValue(this._start);

        // Force the creation of a layout in IE if we're supposed to and the current browser is Internet Explorer
        if(this._forceLayoutInIE && !this._layoutCreated && Sys.Browser.agent == Sys.Browser.InternetExplorer) {
            this._createLayout();
        }
    },

    /// <summary>
    /// Determine the current opacity after the given percentage of its duration has elapsed.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.FadeAnimation.getAnimatedValue" />
    /// <param name="percentage" type="Number">Percentage of the animation already complete.</param>
    getAnimatedValue: function(percentage) {
        return this.interpolate(this._start, this._end, percentage);
    },

    /// <summary>
    /// Set the current opacity of the element.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.FadeAnimation.setValue" />
    /// <param name="value" type="Number">Current opacity (as retreived from getAnimatedValue).</param>
    setValue: function(value) {
        // This method will be replaced by a dynamically generated function that requires no logic
        // to determine whether it should use filters or the style's opacity.
        if(this._currentTarget) {
            $common.setElementOpacity(this._currentTarget, value);
        }
    },

    ///<summary>
    /// Determine whether to fade the element in or fade the element out. The possible values are
    /// FadeIn and FadeOut. The default value is FadeOut.
    ///</summary>
    ///<getter>get_effect</getter>
    ///<setter>set_effect</setter>
    ///<member name="cP:AjaxControlToolkit.FadeAnimation.effect" />
    get_effect: function() {
        return this._effect;
    },
    set_effect: function(value) {
        value = this._getEnum(value, $AA.FadeEffect);
        if(this._effect != value) {
            this._effect = value;
            this._resetOpacities();
            this.raisePropertyChanged('effect');
        }
    },

    ///<summary>
    /// Minimum opacity to use when fading in or out. Its value can range from between 0 to 1.
    /// The default value is 0.
    ///</summary>
    ///<getter>get_minimumOpacity</getter>
    ///<setter>set_minimumOpacity</setter>
    ///<member name="cP:AjaxControlToolkit.FadeAnimation.minimumOpacity" />
    get_minimumOpacity: function() {
        return this._min;
    },
    set_minimumOpacity: function(value) {
        value = this._getFloat(value);
        if(this._min != value) {
            this._min = value;
            this._resetOpacities();
            this.raisePropertyChanged('minimumOpacity');
        }
    },

    ///<summary>
    /// Maximum opacity to use when fading in or out. Its value can range from between 0 to 1.
    /// The default value is 1.
    ///</summary>
    ///<getter>get_maximumOpacity</getter>
    ///<setter>set_maximumOpacity</setter>
    ///<member name="cP:AjaxControlToolkit.FadeAnimation.maximumOpacity" />
    get_maximumOpacity: function() {
        return this._max;
    },
    set_maximumOpacity: function(value) {
        value = this._getFloat(value);
        if(this._max != value) {
            this._max = value;
            this._resetOpacities();
            this.raisePropertyChanged('maximumOpacity');
        }
    },

    ///<summary>
    /// Whether or not we should force a layout to be created for Internet Explorer by giving it a width and setting its
    /// background color (the latter is required in case the user has ClearType enabled). The default value is true.
    /// This is obviously ignored when working in other browsers.
    ///</summary>
    ///<getter>get_forceLayoutInIE</getter>
    ///<setter>set_forceLayoutInIE</setter>
    ///<member name="cP:AjaxControlToolkit.FadeAnimation.forceLayoutInIE" />
    get_forceLayoutInIE: function() {
        return this._forceLayoutInIE;
    },
    set_forceLayoutInIE: function(value) {
        value = this._getBoolean(value);
        if(this._forceLayoutInIE != value) {
            this._forceLayoutInIE = value;
            this.raisePropertyChanged('forceLayoutInIE');
        }
    },

    /// <summary>
    /// Set the start value (so that child animations can set the current opacity as the start value when fading in or out).
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.FadeAnimation.setStartValue" />
    /// <param name="value" type="Number">Opacity to start fade animation with.</param>
    setStartValue: function(value) {
        value = this._getFloat(value);
        this._start = value;
    },
    set_startValue: function(value) {
        Sys.Extended.Deprecated("setStartValue(value)", "set_startValue(value)");
        this.setStartValue(value);
    }
}
$AA.FadeAnimation.registerClass('Sys.Extended.UI.Animation.FadeAnimation', $AA.Animation);
$AA.registerAnimation('fade', $AA.FadeAnimation);

///<summary>
/// The FadeInAnimation will fade the target in by moving from hidden to visible.
/// It starts the animation the target's current opacity.
///</summary>
///<member name="cT:AjaxControlToolkit.FadeInAnimation" base="AjaxControlToolkit.FadeAnimation" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.FadeInAnimation.ctor" />
/// <param name="target" type="Object">Target of the animation.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="minimumOpacity" type="Number">Minimum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 0.</param>
/// <param name="maximumOpacity" type="Number">Maximum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 1.</param>
/// <param name="forceLayoutInIE" type="Boolean">whether or not we should force a layout to be created for Internet Explorer by giving it a width and setting its
/// background color (the latter is required in case the user has ClearType enabled). The default value is true.
/// This is obviously ignored when working in other browsers.</param>
$AA.FadeInAnimation = function(target, duration, fps, minimumOpacity, maximumOpacity, forceLayoutInIE) {
    $AA.FadeInAnimation.initializeBase(this, [target, duration, fps, $AA.FadeEffect.FadeIn, minimumOpacity, maximumOpacity, forceLayoutInIE]);
}
$AA.FadeInAnimation.prototype = {
    /// <summary>
    /// The onStart method is called just before the animation is played each time.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.FadeInAnimation.onStart" />
    onStart: function() {
        $AA.FadeInAnimation.callBaseMethod(this, 'onStart');

        if(this._currentTarget) {
            this.set_startValue($common.getElementOpacity(this._currentTarget));
        }
    }
}
$AA.FadeInAnimation.registerClass('Sys.Extended.UI.Animation.FadeInAnimation', $AA.FadeAnimation);
$AA.registerAnimation('fadeIn', $AA.FadeInAnimation);


///<summary>
/// The FadeOutAnimation will fade the element out by moving from visible to hidden. It starts the animation
/// at the element's current opacity.
///</summary>
///<member name="cT:AjaxControlToolkit.FadeOutAnimation" base="AjaxControlToolkit.FadeAnimation" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.FadeOutAnimation.ctor" />
/// <param name="target" type="Object">Target of the animation.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="minimumOpacity" type="Number">Minimum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 0.</param>
/// <param name="maximumOpacity" type="Number">Maximum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 1.</param>
/// <param name="forceLayoutInIE" type="Boolean">whether or not we should force a layout to be created for Internet Explorer by giving it a width and setting its
/// background color (the latter is required in case the user has ClearType enabled). The default value is true.
/// This is obviously ignored when working in other browsers.</param>
$AA.FadeOutAnimation = function(target, duration, fps, minimumOpacity, maximumOpacity, forceLayoutInIE) {
    $AA.FadeOutAnimation.initializeBase(this, [target, duration, fps, $AA.FadeEffect.FadeOut, minimumOpacity, maximumOpacity, forceLayoutInIE]);
}
$AA.FadeOutAnimation.prototype = {
    /// <summary>
    /// The onStart method is called just before the animation is played each time.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.FadeOutAnimation.onStart" />
    onStart: function() {
        $AA.FadeOutAnimation.callBaseMethod(this, 'onStart');

        if(this._currentTarget) {
            this.set_startValue($common.getElementOpacity(this._currentTarget));
        }
    }
}
$AA.FadeOutAnimation.registerClass('Sys.Extended.UI.Animation.FadeOutAnimation', $AA.FadeAnimation);
$AA.registerAnimation('fadeOut', $AA.FadeOutAnimation);

///<summary>
/// The PulseAnimation fades an element in and our repeatedly to create a pulsating
/// effect.  The iterations determines how many pulses there will be (which defaults
/// to three, but it will repeat infinitely if given zero or less). The duration
/// property defines the duration of each fade in or fade out, not the duration of
/// the animation as a whole.
///</summary>
///<member name="cT:AjaxControlToolkit.PulseAnimation" base="AjaxControlToolkit.SequenceAnimation" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.PulseAnimation.ctor" />
/// <param name="target" type="Object">Target of the animation.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="iterations" type="Number">Number of times to repeatedly play the sequence. If zero or less iterations are specified, the sequence
/// will repeat forever. The default value is 1 iteration.</param>
/// <param name="minimumOpacity" type="Number">Minimum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 0.</param>
/// <param name="maximumOpacity" type="Number">Maximum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 1.</param>
/// <param name="forceLayoutInIE" type="Boolean">whether or not we should force a layout to be created for Internet Explorer by giving it a width and setting its
/// background color (the latter is required in case the user has ClearType enabled). The default value is true.
/// This is obviously ignored when working in other browsers.</param>
$AA.PulseAnimation = function(target, duration, fps, iterations, minimumOpacity, maximumOpacity, forceLayoutInIE) {
    $AA.PulseAnimation.initializeBase(this, [target, duration, fps, null, ((iterations !== undefined) ? iterations : 3)]);

    // Create the FadeOutAnimation
    this._out = new $AA.FadeOutAnimation(target, duration, fps, minimumOpacity, maximumOpacity, forceLayoutInIE);
    this.add(this._out);

    // Create the FadeInAnimation
    this._in = new $AA.FadeInAnimation(target, duration, fps, minimumOpacity, maximumOpacity, forceLayoutInIE);
    this.add(this._in);
}
$AA.PulseAnimation.prototype = {
    ///<summary>
    /// Minimum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 0.
    ///</summary>
    ///<getter>get_minimumOpacity</getter>
    ///<setter>set_minimumOpacity</setter>
    ///<member name="cP:AjaxControlToolkit.PulseAnimation.minimumOpacity" />
    get_minimumOpacity: function() {
        return this._out.get_minimumOpacity();
    },
    set_minimumOpacity: function(value) {
        value = this._getFloat(value);
        this._out.set_minimumOpacity(value);
        this._in.set_minimumOpacity(value);
        this.raisePropertyChanged('minimumOpacity');
    },

    ///<summary>
    /// Maximum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 1.
    ///</summary>
    ///<getter>get_maximumOpacity</getter>
    ///<setter>set_maximumOpacity</setter>
    ///<member name="cP:AjaxControlToolkit.PulseAnimation.maximumOpacity" />
    get_maximumOpacity: function() {
        return this._out.get_maximumOpacity();
    },
    set_maximumOpacity: function(value) {
        value = this._getFloat(value);
        this._out.set_maximumOpacity(value);
        this._in.set_maximumOpacity(value);
        this.raisePropertyChanged('maximumOpacity');
    },

    ///<summary>
    /// Whether or not we should force a layout to be created for Internet Explorer by giving it a width and setting its
    /// background color (the latter is required in case the user has ClearType enabled). The default value is true.
    /// This is obviously ignored when working in other browsers.
    ///</summary>
    ///<getter>get_forceLayoutInIE</getter>
    ///<setter>set_forceLayoutInIE</setter>
    ///<member name="cP:AjaxControlToolkit.PulseAnimation.forceLayoutInIE" />
    get_forceLayoutInIE: function() {
        return this._out.get_forceLayoutInIE();
    },
    set_forceLayoutInIE: function(value) {
        value = this._getBoolean(value);
        this._out.set_forceLayoutInIE(value);
        this._in.set_forceLayoutInIE(value);
        this.raisePropertyChanged('forceLayoutInIE');
    },

    /// <summary>
    /// Override the duration property.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.PulseAnimation.setDuration" />
    /// <param name="value" type="Number">Length of the animation in seconds.</param>
    setDuration: function(value) {
        value = this._getFloat(value);
        $AA.PulseAnimation.callBaseMethod(this, 'set_duration', [value]);
        this._in.set_duration(value);
        this._out.set_duration(value);
    },
    set_duration: function(value) {
        Sys.Extended.Deprecated("setDuration(value)", "set_duration(value)");
        this.setDuration(value);
    },

    /// <summary>
    /// Override the fps property.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.PulseAnimation.setFps" />
    /// <param name="value" type="Number">Number of steps per second..</param>
    setFps: function(value) {
        value = this._getInteger(value);
        $AA.PulseAnimation.callBaseMethod(this, 'set_fps', [value]);
        this._in.set_fps(value);
        this._out.set_fps(value);
    },
    set_fps: function(value) {
        Sys.Extended.Deprecated("setFps(value)", "set_fps(value)");
        this.setFps(value);
    }

}
$AA.PulseAnimation.registerClass('Sys.Extended.UI.Animation.PulseAnimation', $AA.SequenceAnimation);
$AA.registerAnimation('pulse', $AA.PulseAnimation);

///<summary>
/// The PropertyAnimation is a useful base animation that will assign the value from
/// getAnimatedValue to a specified property. You can provide the name of
/// a property alongside an optional propertyKey (which indicates the value
/// property[propertyKey], like style['backgroundColor']).
///</summary>
///<member name="cT:AjaxControlToolkit.PropertyAnimation" base="AjaxControlToolkit.Animation" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.PropertyAnimation.ctor" />
/// <param name="target" type="Object">Length of the animation in seconds. The default is 1.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="property" type="Object">Property of the target element to set when animating.</param>
/// <param name="propertyKey" type="Object">optional key of the property to be set (which indicates the value property[propertyKey], 
/// like style['backgroundColor']). Note that for the style property, the key must be in a JavaScript friendly 
/// format (i.e. backgroundColor instead of background-color).</param>
$AA.PropertyAnimation = function(target, duration, fps, property, propertyKey) {
    $AA.PropertyAnimation.initializeBase(this, [target, duration, fps]);

    // Name of the property to set
    this._property = property;

    // Optional Key of the property to set (i.e., if the property were "style" then
    // this might be "backgroundColor")
    this._propertyKey = propertyKey;

    // Current target of the animation that is cached before the animation plays (since looking up
    // the target could mean walking all the way up to the root of the animation's tree, which we don't
    // want to do for every step of the animation)
    this._currentTarget = null;
}
$AA.PropertyAnimation.prototype = {
    /// <summary>
    /// The onStart method is called just before the animation is played each time.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.PropertyAnimation.onStart" />
    onStart: function() {
        $AA.PropertyAnimation.callBaseMethod(this, 'onStart');

        this._currentTarget = this.get_target();
    },

    /// <summary>
    /// Set the property's value.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.PropertyAnimation.setValue" />
    /// <param name="value" type="Object">Value to set.</param>
    setValue: function(value) {
        var element = this._currentTarget;
        if(element && this._property && this._property.length > 0) {
            if(this._propertyKey && this._propertyKey.length > 0 && element[this._property]) {
                element[this._property][this._propertyKey] = value;
            } else {
                element[this._property] = value;
            }
        }
    },

    /// <summary>
    /// Get the property's current value.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.PropertyAnimation.getValue" />
    getValue: function() {
        var element = this.get_target();
        if(element && this._property && this._property.length > 0) {
            var property = element[this._property];
            if(property) {
                if(this._propertyKey && this._propertyKey.length > 0) {
                    return property[this._propertyKey];
                }
                return property;
            }
        }
        return null;
    },

    /// <summary>
    /// A string value specifying the name of the target element's property to be set when animation plays.
    /// </summary>
    /// <getter>get_property</getter>
    /// <setter>set_property</setter>
    /// <member name="cP:AjaxControlToolkit.PropertyAnimation.property" />
    get_property: function() {
        return this._property;
    },
    set_property: function(value) {
        if(this._property != value) {
            this._property = value;
            this.raisePropertyChanged('property');
        }
    },

    /// <summary>
    /// Optional key of the property to be set (which indicates the value property[propertyKey], like style['backgroundColor']). 
    /// Note that for the style property, the key must be in a JavaScript friendly format (i.e. backgroundColor instead of background-color).
    /// </summary>
    /// <getter>get_propertyKey</getter>
    /// <setter>set_propertyKey</setter>
    /// <member name="cP:AjaxControlToolkit.PropertyAnimation.propertyKey" />
    get_propertyKey: function() {
        return this._propertyKey;
    },
    set_propertyKey: function(value) {
        if(this._propertyKey != value) {
            this._propertyKey = value;
            this.raisePropertyChanged('propertyKey');
        }
    }
}
$AA.PropertyAnimation.registerClass('Sys.Extended.UI.Animation.PropertyAnimation', $AA.Animation);
$AA.registerAnimation('property', $AA.PropertyAnimation);

///<summary>
/// The DiscreteAnimation inherits from Sys.Extended.UI.Animation.PropertyAnimation
/// and sets the value of the property to the elements in a provided array of values.
///</summary>
///<member name="cT:AjaxControlToolkit.DiscreteAnimation" base="AjaxControlToolkit.PropertyAnimation" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.DiscreteAnimation.ctor" />
/// <param name="target" type="Object">Length of the animation in seconds. The default is 1.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="property" type="Object">Property of the target element to set when animating.</param>
/// <param name="propertyKey" type="Object">optional key of the property to be set (which indicates the value property[propertyKey], 
/// like style['backgroundColor']). Note that for the style property, the key must be in a JavaScript friendly 
/// format (i.e. backgroundColor instead of background-color).</param>
/// <param name="values" type="Object">Array of possible values of the property that will be iterated over as the animation is played.</param>
$AA.DiscreteAnimation = function(target, duration, fps, property, propertyKey, values) {
    $AA.DiscreteAnimation.initializeBase(this, [target, duration, fps, property, propertyKey]);

    // Values to assign to the property
    this._values = (values && values.length) ? values : [];
}
$AA.DiscreteAnimation.prototype = {
    /// <summary>
    /// Assign the value whose index corresponds to the current percentage.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.DiscreteAnimation.getAnimatedValue" />
    /// <param name="percentage" type="Number">Percentage of the animation already complete.</param>
    getAnimatedValue: function(percentage) {
        var index = Math.floor(this.interpolate(0, this._values.length - 1, percentage));
        return this._values[index];
    },

    /// <summary>
    /// Array of possible values of the property that will be iterated over as the animation is played
    /// </summary>
    /// <getter>get_values</getter>
    /// <setter>set_values</setter>
    /// <member name="cP:AjaxControlToolkit.DiscreteAnimation.values" />
    get_values: function() {
        return this._values;
    },
    set_values: function(value) {
        if(this._values != value) {
            this._values = value;
            this.raisePropertyChanged('values');
        }
    }
}
$AA.DiscreteAnimation.registerClass('Sys.Extended.UI.Animation.DiscreteAnimation', $AA.PropertyAnimation);
$AA.registerAnimation('discrete', $AA.DiscreteAnimation);

///<summary>
/// The InterpolatedAnimation assigns a range of values between startValue
/// and endValue to the designated property.
///</summary>
///<member name="cT:AjaxControlToolkit.InterpolatedAnimation" base="AjaxControlToolkit.PropertyAnimation" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.InterpolatedAnimation.ctor" />
/// <param name="target" type="Object">Length of the animation in seconds. The default is 1.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="property" type="Object">Property of the target element to set when animating.</param>
/// <param name="propertyKey" type="Object">optional key of the property to be set (which indicates the value property[propertyKey], 
/// like style['backgroundColor']). Note that for the style property, the key must be in a JavaScript friendly 
/// format (i.e. backgroundColor instead of background-color).</param>
/// <param name="startValue" type="Object">Start of the range of values.</param>
/// <param name="endValue" type="Object">End of the range of values.</param>
$AA.InterpolatedAnimation = function(target, duration, fps, property, propertyKey, startValue, endValue) {
    $AA.InterpolatedAnimation.initializeBase(this, [target, duration, fps, ((property !== undefined) ? property : 'style'), propertyKey]);

    // Start and end values
    this._startValue = startValue;
    this._endValue = endValue;
}
$AA.InterpolatedAnimation.prototype = {
    /// <summary>
    /// Specifies the start value of the value range.
    /// </summary>
    /// <getter>get_startValue</getter>
    /// <setter>set_startValue</setter>
    /// <member name="cP:AjaxControlToolkit.InterpolatedAnimation.startValue" />
    get_startValue: function() {
        return this._startValue;
    },
    set_startValue: function(value) {
        value = this._getFloat(value);
        if(this._startValue != value) {
            this._startValue = value;
            this.raisePropertyChanged('startValue');
        }
    },

    /// <summary>
    /// Specifies the end value of the value range.
    /// </summary>
    /// <getter>get_endValue</getter>
    /// <setter>set_endValue</setter>
    /// <member name="cP:AjaxControlToolkit.InterpolatedAnimation.endValue" />
    get_endValue: function() {
        return this._endValue;
    },
    set_endValue: function(value) {
        value = this._getFloat(value);
        if(this._endValue != value) {
            this._endValue = value;
            this.raisePropertyChanged('endValue');
        }
    }
}
$AA.InterpolatedAnimation.registerClass('Sys.Extended.UI.Animation.InterpolatedAnimation', $AA.PropertyAnimation);
$AA.registerAnimation('interpolated', $AA.InterpolatedAnimation);

///<summary>
/// The ColorAnimation transitions the value of the property between
/// two colors (although it does ignore the alpha channel). The colors must be 7-character hex strings
/// (like #246ACF).
///</summary>
///<member name="cT:AjaxControlToolkit.ColorAnimation" base="AjaxControlToolkit.InterpolatedAnimation" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.ColorAnimation.ctor" />
/// <param name="target" type="Object">Length of the animation in seconds. The default is 1.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="property" type="Object">Property of the target element to set when animating.</param>
/// <param name="propertyKey" type="Object">optional key of the property to be set (which indicates the value property[propertyKey], 
/// like style['backgroundColor']). Note that for the style property, the key must be in a JavaScript friendly 
/// format (i.e. backgroundColor instead of background-color).</param>
/// <param name="startValue" type="Object">Start of the range of values.</param>
/// <param name="endValue" type="Object">End of the range of values.</param>
$AA.ColorAnimation = function(target, duration, fps, property, propertyKey, startValue, endValue) {
    $AA.ColorAnimation.initializeBase(this, [target, duration, fps, property, propertyKey, startValue, endValue]);

    // Cached start/end RBG triplets
    this._start = null;
    this._end = null;

    // Flags indicating whether each dimension of color will be interpolated
    this._interpolateRed = false;
    this._interpolateGreen = false;
    this._interpolateBlue = false;
}
$AA.ColorAnimation.prototype = {
    /// <summary>
    /// Determine which dimensions of color will be animated.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ColorAnimation.onStart" />
    onStart: function() {
        $AA.ColorAnimation.callBaseMethod(this, 'onStart');

        this._start = $AA.ColorAnimation.getRGB(this.get_startValue());
        this._end = $AA.ColorAnimation.getRGB(this.get_endValue());

        this._interpolateRed = (this._start.Red != this._end.Red);
        this._interpolateGreen = (this._start.Green != this._end.Green);
        this._interpolateBlue = (this._start.Blue != this._end.Blue);
    },

    /// <summary>
    /// Get the interpolated color values.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ColorAnimation.getAnimatedValue" />
    /// <param name="percentage" type="Number">Percentage of the animation already complete.</param>
    getAnimatedValue: function(percentage) {
        var r = this._start.Red;
        var g = this._start.Green;
        var b = this._start.Blue;

        if(this._interpolateRed)
            r = Math.round(this.interpolate(r, this._end.Red, percentage));

        if(this._interpolateGreen)
            g = Math.round(this.interpolate(g, this._end.Green, percentage));

        if(this._interpolateBlue)
            b = Math.round(this.interpolate(b, this._end.Blue, percentage));

        return $AA.ColorAnimation.toColor(r, g, b);
    },

    /// <summary>
    /// Starting color of the transition formatted as a 7-character hex string (like #246ACF).
    /// </summary>
    /// <setter>set_startValue</setter>
    /// <member name="cP:AjaxControlToolkit.ColorAnimation.startValue" />
    set_startValue: function(value) {
        if(this._startValue != value) {
            this._startValue = value;
            this.raisePropertyChanged('startValue');
        }
    },

    /// <summary>
    /// Ending color of the transition formatted as a 7-character hex string (like #246ACF).
    /// </summary>
    /// <setter>set_startValue</setter>
    /// <member name="cP:AjaxControlToolkit.ColorAnimation.endValue" />
    set_endValue: function(value) {
        if(this._endValue != value) {
            this._endValue = value;
            this.raisePropertyChanged('endValue');
        }
    }
}

/// <summary>
/// Convert the color to an RGB triplet.
/// </summary>
/// <member name="cM:AjaxControlToolkit.ColorAnimation.getRGB" static="true" />
/// <param name="color" type="String">Color formatted as a 7-character hex string (like #246ACF).</param>
$AA.ColorAnimation.getRGB = function(color) {
    if(!color || color.length != 7) {
        throw String.format(Sys.Extended.UI.Resources.Animation_InvalidColor, color);
    }
    return {
        'Red': parseInt(color.substr(1, 2), 16),
        'Green': parseInt(color.substr(3, 2), 16),
        'Blue': parseInt(color.substr(5, 2), 16)
    };
}

/// <summary>
/// Convert an RBG triplet into a 7-character hex string (like #246ACF).
/// </summary>
/// <member name="cM:AjaxControlToolkit.ColorAnimation.toColor" static="true" />
/// <param name="red" type="Object">Value of the color's red dimension.</param>
/// <param name="green" type="Object">Value of the color's green dimension.</param>
/// <param name="blue" type="Object">Value of the color's blue dimension.</param>
$AA.ColorAnimation.toColor = function(red, green, blue) {
    var r = red.toString(16);
    var g = green.toString(16);
    var b = blue.toString(16);
    if(r.length == 1) r = '0' + r;
    if(g.length == 1) g = '0' + g;
    if(b.length == 1) b = '0' + b;
    return '#' + r + g + b;
}
$AA.ColorAnimation.registerClass('Sys.Extended.UI.Animation.ColorAnimation', $AA.InterpolatedAnimation);
$AA.registerAnimation('color', $AA.ColorAnimation);

///<summary>
/// The LengthAnimation is identical to Sys.Extended.UI.Animation.InterpolatedAnimation
/// except it adds a unit to the value before assigning it to the property.
///</summary>
///<member name="cT:AjaxControlToolkit.LengthAnimation" base="AjaxControlToolkit.InterpolatedAnimation" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.LengthAnimation.ctor" />
/// <param name="target" type="Object">Length of the animation in seconds. The default is 1.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="property" type="Object">Property of the target element to set when animating.</param>
/// <param name="propertyKey" type="Object">optional key of the property to be set (which indicates the value property[propertyKey], 
/// like style['backgroundColor']). Note that for the style property, the key must be in a JavaScript friendly 
/// format (i.e. backgroundColor instead of background-color).</param>
/// <param name="startValue" type="Object">Start of the range of values.</param>
/// <param name="endValue" type="Object">End of the range of values.</param>
/// <param name="unit" type="String">Unit of the interpolated values. The default value is 'px'.</param>
$AA.LengthAnimation = function(target, duration, fps, property, propertyKey, startValue, endValue, unit) {
    $AA.LengthAnimation.initializeBase(this, [target, duration, fps, property, propertyKey, startValue, endValue]);

    // Unit of length (which defaults to px)
    this._unit = (unit != null) ? unit : 'px';
}
$AA.LengthAnimation.prototype = {
    /// <summary>
    /// Get the interpolated length value.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.LengthAnimation.getAnimatedValue" />
    /// <param name="percentage" type="Number">Percentage of the animation already complete.</param>    
    getAnimatedValue: function(percentage) {
        var value = this.interpolate(this.get_startValue(), this.get_endValue(), percentage);
        return Math.round(value) + this._unit;
    },

    /// <summary>
    /// Unit of the interpolated values.  The default value is 'px'.
    /// </summary>
    /// <getter>get_unit</getter>
    /// <setter>set_unit</setter>
    /// <member name="cP:AjaxControlToolkit.LengthAnimation.unit" />   
    get_unit: function() {
        return this._unit;
    },
    set_unit: function(value) {
        if(this._unit != value) {
            this._unit = value;
            this.raisePropertyChanged('unit');
        }
    }
}
$AA.LengthAnimation.registerClass('Sys.Extended.UI.Animation.LengthAnimation', $AA.InterpolatedAnimation);
$AA.registerAnimation('length', $AA.LengthAnimation);

///<summary>
/// The MoveAnimation is used to move the target element. If the
/// relative flag is set to true, then it treats the horizontal
/// and vertical properties as offsets to move the element. If the relative
/// flag is false, then it will treat the horizontal and vertical
/// properties as coordinates on the page where the target element should be moved. It is
/// important to note that the target must be positioned (i.e. absolutely) so
/// that settings its top/left style attributes will change its location.
///</summary>
///<member name="cT:AjaxControlToolkit.MoveAnimation" base="AjaxControlToolkit.ParallelAnimation" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.MoveAnimation.ctor" />
/// <param name="target" type="Object">Length of the animation in seconds. The default is 1.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="horizontal" type="Number">If relative  is true, this is the offset to move horizontally. Otherwise this is the x
/// coordinate on the page where the target should be moved.</param>
/// <param name="vertical" type="Number">if relative is true, this is the offset to move vertically. Otherwise this is the y
/// coordinate on the page where the target should be moved.</param>
/// <param name="relative" type="Boolean">true if we are moving relative to the current position, false if we are moving absolutely.</param>
/// <param name="unit" type="String">Unit of the interpolated values. The default value is 'px'.</param>
$AA.MoveAnimation = function(target, duration, fps, horizontal, vertical, relative, unit) {
    $AA.MoveAnimation.initializeBase(this, [target, duration, fps, null]);

    // Distance to move horizontally and vertically
    this._horizontal = horizontal ? horizontal : 0;
    this._vertical = vertical ? vertical : 0;
    this._relative = (relative === undefined) ? true : relative;

    // Length animations representing the movememnts
    this._horizontalAnimation = new $AA.LengthAnimation(target, duration, fps, 'style', 'left', null, null, unit);
    this._verticalAnimation = new $AA.LengthAnimation(target, duration, fps, 'style', 'top', null, null, unit);
    this.add(this._verticalAnimation);
    this.add(this._horizontalAnimation);
}
$AA.MoveAnimation.prototype = {
    /// <summary>
    /// The onStart method is called just before the animation is played each time.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.MoveAnimation.onStart" />
    onStart: function() {
        // Use the target's current position as the starting point for the animation
        $AA.MoveAnimation.callBaseMethod(this, 'onStart');

        // Set the start and end values of the animations by getting
        // the element's current position and applying the offsets
        var element = this.get_target();
        this._horizontalAnimation.set_startValue(element.offsetLeft);
        this._horizontalAnimation.set_endValue(this._relative ? element.offsetLeft + this._horizontal : this._horizontal);
        this._verticalAnimation.set_startValue(element.offsetTop);
        this._verticalAnimation.set_endValue(this._relative ? element.offsetTop + this._vertical : this._vertical);
    },

    get_horizontal: function() {
        // If relative  is true, this is the offset to move horizontally. Otherwise this is the x
        // coordinate on the page where the target should be moved.
        return this._horizontal;
    },
    set_horizontal: function(value) {
        value = this._getFloat(value);
        if(this._horizontal != value) {
            this._horizontal = value;
            this.raisePropertyChanged('horizontal');
        }
    },

    get_vertical: function() {
        // If relative is true, this is the offset to move vertically. Otherwise this is the y
        // coordinate on the page where the target should be moved.
        return this._vertical;
    },
    set_vertical: function(value) {
        value = this._getFloat(value);
        if(this._vertical != value) {
            this._vertical = value;
            this.raisePropertyChanged('vertical');
        }
    },

    get_relative: function() {
        // true if we are moving relative to the current position, false if we are moving absolutely
        return this._relative;
    },
    set_relative: function(value) {
        value = this._getBoolean(value);
        if(this._relative != value) {
            this._relative = value;
            this.raisePropertyChanged('relative');
        }
    },

    get_unit: function() {
        // Length unit for the size of the target. The default value is 'px'.
        this._horizontalAnimation.get_unit();
    },
    set_unit: function(value) {
        var unit = this._horizontalAnimation.get_unit();
        if(unit != value) {
            this._horizontalAnimation.set_unit(value);
            this._verticalAnimation.set_unit(value);
            this.raisePropertyChanged('unit');
        }
    }
}
$AA.MoveAnimation.registerClass('Sys.Extended.UI.Animation.MoveAnimation', $AA.ParallelAnimation);
$AA.registerAnimation('move', $AA.MoveAnimation);

///<summary>
/// The ResizeAnimation changes the size of the target from its
/// current value to the specified width and height.
///</summary>
///<member name="cT:AjaxControlToolkit.ResizeAnimation" base="AjaxControlToolkit.ParallelAnimation" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.ResizeAnimation.ctor" />
/// <param name="target" type="Object">Target of the animation.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="width" type="Number">New width of the target.</param>
/// <param name="height" type="Number">New height of the target.</param>
/// <param name="unit" type="String">Length unit for the size of the target. The default value is 'px'.</param>
$AA.ResizeAnimation = function(target, duration, fps, width, height, unit) {
    $AA.ResizeAnimation.initializeBase(this, [target, duration, fps, null]);

    // New size of the element
    this._width = width;
    this._height = height;

    // Animations to set the size across both dimensions
    this._horizontalAnimation = new $AA.LengthAnimation(target, duration, fps, 'style', 'width', null, null, unit);
    this._verticalAnimation = new $AA.LengthAnimation(target, duration, fps, 'style', 'height', null, null, unit);
    this.add(this._horizontalAnimation);
    this.add(this._verticalAnimation);
}
$AA.ResizeAnimation.prototype = {
    /// <summary>
    /// The onStart method is called just before the animation is played each time.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ResizeAnimation.onStart" />
    onStart: function() {
        // Use the target's current size as the starting point for the animation
        $AA.ResizeAnimation.callBaseMethod(this, 'onStart');

        // Set the start and end values of the animations by getting
        // the element's current width and height
        var element = this.get_target();
        this._horizontalAnimation.set_startValue(element.offsetWidth);
        this._verticalAnimation.set_startValue(element.offsetHeight);
        this._horizontalAnimation.set_endValue((this._width !== null && this._width !== undefined) ?
            this._width : element.offsetWidth);
        this._verticalAnimation.set_endValue((this._height !== null && this._height !== undefined) ?
            this._height : element.offsetHeight);
    },

    ///<summary>
    /// New width of the element.
    ///</summary>
    ///<getter>get_width</getter>
    ///<setter>set_width</setter>
    ///<member name="cP:AjaxControlToolkit.ResizeAnimation.width" />
    get_width: function() {
        return this._width;
    },
    set_width: function(value) {
        value = this._getFloat(value);
        if(this._width != value) {
            this._width = value;
            this.raisePropertyChanged('width');
        }
    },

    ///<summary>
    /// New height of the element.
    ///</summary>
    ///<getter>get_height</getter>
    ///<setter>set_height</setter>
    ///<member name="cP:AjaxControlToolkit.ResizeAnimation.height" />
    get_height: function() {
        return this._height;
    },
    set_height: function(value) {
        value = this._getFloat(value);
        if(this._height != value) {
            this._height = value;
            this.raisePropertyChanged('height');
        }
    },

    ///<summary>
    /// Length unit for the size of the target. The default value is 'px'.
    ///</summary>
    ///<getter>get_unit</getter>
    ///<setter>set_unit</setter>
    ///<member name="cP:AjaxControlToolkit.ResizeAnimation.unit" />
    get_unit: function() {
        this._horizontalAnimation.get_unit();
    },
    set_unit: function(value) {
        var unit = this._horizontalAnimation.get_unit();
        if(unit != value) {
            this._horizontalAnimation.set_unit(value);
            this._verticalAnimation.set_unit(value);
            this.raisePropertyChanged('unit');
        }
    }
}
$AA.ResizeAnimation.registerClass('Sys.Extended.UI.Animation.ResizeAnimation', $AA.ParallelAnimation);
$AA.registerAnimation('resize', $AA.ResizeAnimation);

///<summary>
/// The ScaleAnimation scales the size of the target element by the given scaleFactor
/// (i.e. a scaleFactor of .5 will shrink it in half and a scaleFactor of 2.0
/// will double it).  If scaleFont is true, the size of the font will also scale with the element. If
/// center is true, then the element's center will not move as it is scaled.  It is important to note that
/// the target must be positioned (i.e. absolutely) so that setting its top/left properties will change
/// its location in order for center to have an effect.
///</summary>
///<member name="cT:AjaxControlToolkit.ScaleAnimation" base="AjaxControlToolkit.Animation" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.ScaleAnimation.ctor" />
/// <param name="target" type="Object">Target of the animation.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="scaleFactor" type="Number">The amount to scale the target (a scaleFactor of .5 will
/// shrink it in half and a scaleFactor of 2.0 will double it). The default value is
/// 1, which does no scaling.</param>
/// <param name="unit" type="String">Length unit for the size of the target. The default value is 'px'.</param>
/// <param name="center" type="Boolean">Whether the target should stay centered while scaling.</param>
/// <param name="scaleFont" type="Boolean">Whether the font should be scaled along with the size.</param>
/// <param name="fontUnit" type="String">Unit of the font, which is only used if scaleFont is true.
/// The default value is 'pt'.</param>
$AA.ScaleAnimation = function(target, duration, fps, scaleFactor, unit, center, scaleFont, fontUnit) {
    $AA.ScaleAnimation.initializeBase(this, [target, duration, fps]);

    // Percentage to scale
    this._scaleFactor = (scaleFactor !== undefined) ? scaleFactor : 1;
    this._unit = (unit !== undefined) ? unit : 'px';

    // Center the content while scaling
    this._center = center;

    // Scale the font size as well
    this._scaleFont = scaleFont;
    this._fontUnit = (fontUnit !== undefined) ? fontUnit : 'pt';

    // Initial values
    this._element = null;
    this._initialHeight = null;
    this._initialWidth = null;
    this._initialTop = null;
    this._initialLeft = null;
    this._initialFontSize = null;
}
$AA.ScaleAnimation.prototype = {
    /// <summary>
    /// Get the amount to scale the target.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ScaleAnimation.getAnimatedValue" />
    /// <param name="percentage" type="Number">Percentage of the animation already complete.</param>
    getAnimatedValue: function(percentage) {
        return this.interpolate(1.0, this._scaleFactor, percentage);
    },

    /// <summary>
    /// The onStart method is called just before the animation is played each time.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ScaleAnimation.onStart" />
    onStart: function() {
        // Cache the initial size because it will be used to determine how much to scale the element at each step of the animation
        $AA.ScaleAnimation.callBaseMethod(this, 'onStart');

        this._element = this.get_target();
        if(this._element) {
            this._initialHeight = this._element.offsetHeight;
            this._initialWidth = this._element.offsetWidth;
            if(this._center) {
                this._initialTop = this._element.offsetTop;
                this._initialLeft = this._element.offsetLeft;
            }
            if(this._scaleFont) {
                // Note: we're assuming this is in the same units as fontUnit
                this._initialFontSize = parseFloat(
                    $common.getCurrentStyle(this._element, 'fontSize'));
            }
        }
    },

    /// <summary>
    /// Scale the target by the given percentage.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ScaleAnimation.setValue" />
    /// <param name="scale" type="Number">Percentage to scale the target.</param>
    setValue: function(scale) {
        if(this._element) {
            var width = Math.round(this._initialWidth * scale);
            var height = Math.round(this._initialHeight * scale);
            this._element.style.width = width + this._unit;
            this._element.style.height = height + this._unit;

            if(this._center) {
                this._element.style.top = (this._initialTop +
                    Math.round((this._initialHeight - height) / 2)) + this._unit;
                this._element.style.left = (this._initialLeft +
                    Math.round((this._initialWidth - width) / 2)) + this._unit;
            }

            if(this._scaleFont) {
                var size = this._initialFontSize * scale;
                if(this._fontUnit == 'px' || this._fontUnit == 'pt') {
                    size = Math.round(size);
                }
                this._element.style.fontSize = size + this._fontUnit;
            }
        }
    },

    /// <summary>
    /// The onEnd method is called just after the animation is played each time.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ScaleAnimation.onEnd" />    
    onEnd: function() {
        // Wipe the cached values after the animation completes
        this._element = null;
        this._initialHeight = null;
        this._initialWidth = null;
        this._initialTop = null;
        this._initialLeft = null;
        this._initialFontSize = null;
        $AA.ScaleAnimation.callBaseMethod(this, 'onEnd');
    },

    ///<summary>
    /// The amount to scale the target (a scaleFactor of .5 will
    /// shrink it in half and a scaleFactor of 2.0 will double it). The default value is
    /// 1, which does no scaling.
    ///</summary>
    ///<getter>get_scaleFactore</getter>
    ///<setter>set_scaleFactore</setter>
    ///<member name="cP:AjaxControlToolkit.ScaleAnimation.scaleFactor" />
    get_scaleFactor: function() {
        return this._scaleFactor;
    },
    set_scaleFactor: function(value) {
        value = this._getFloat(value);
        if(this._scaleFactor != value) {
            this._scaleFactor = value;
            this.raisePropertyChanged('scaleFactor');
        }
    },

    ///<summary>
    /// Length unit for the size of the target. The default value is 'px'.
    ///</summary>
    ///<getter>get_unit</getter>
    ///<setter>set_unit</setter>
    ///<member name="cP:AjaxControlToolkit.ScaleAnimation.unit" />
    get_unit: function() {
        return this._unit;
    },
    set_unit: function(value) {
        if(this._unit != value) {
            this._unit = value;
            this.raisePropertyChanged('unit');
        }
    },

    ///<summary>
    /// Whether the target should stay centered while scaling.
    ///</summary>
    ///<getter>get_center</getter>
    ///<setter>set_center</setter>
    ///<member name="cP:AjaxControlToolkit.ScaleAnimation.center" />
    get_center: function() {
        return this._center;
    },
    set_center: function(value) {
        value = this._getBoolean(value);
        if(this._center != value) {
            this._center = value;
            this.raisePropertyChanged('center');
        }
    },

    ///<summary>
    /// Whether the font should be scaled along with the size.
    ///</summary>
    ///<getter>get_scaleFont</getter>
    ///<setter>set_scaleFont</setter>
    ///<member name="cP:AjaxControlToolkit.ScaleAnimation.scaleFont" />
    get_scaleFont: function() {
        return this._scaleFont;
    },
    set_scaleFont: function(value) {
        value = this._getBoolean(value);
        if(this._scaleFont != value) {
            this._scaleFont = value;
            this.raisePropertyChanged('scaleFont');
        }
    },

    ///<summary>
    /// Unit of the font, which is only used if scaleFont is true.
    /// The default value is 'pt'.
    ///</summary>
    ///<getter>get_fontUnit</getter>
    ///<setter>set_fontUnit</setter>
    ///<member name="cP:AjaxControlToolkit.ScaleAnimation.fontUnit" />
    get_fontUnit: function() {
        return this._fontUnit;
    },
    set_fontUnit: function(value) {
        if(this._fontUnit != value) {
            this._fontUnit = value;
            this.raisePropertyChanged('fontUnit');
        }
    }
}
$AA.ScaleAnimation.registerClass('Sys.Extended.UI.Animation.ScaleAnimation', $AA.Animation);
$AA.registerAnimation('scale', $AA.ScaleAnimation);

///<summary>
/// Action is a base class for all "non-animating" animations that provides empty implementations
/// for abstract methods and adds a doAction method that will be called to perform the action's
/// operation.  While regular animations perform an operation in a sequence of small steps spread over an interval,
/// the actions perform a single operation instantaneously.  By default, all actions have a duration
/// of zero.  The actions are very useful for defining complex animations.
///</summary>
///<member name="cT:AjaxControlToolkit.Action" base="AjaxControlToolkit.Animation" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.Action.ctor" />
/// <param name="target" type="Object">Target of the animation.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
$AA.Action = function(target, duration, fps) {
    $AA.Action.initializeBase(this, [target, duration, fps]);

    // Set the duration to 0 if it wasn't specified
    if(duration === undefined) {
        this.set_duration(0);
    }
}
$AA.Action.prototype = {
    /// <summary>
    /// Calls the doAction method when the animation completes.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.Action.onEnd" />
    onEnd: function() {
        this.doAction();
        $AA.Action.callBaseMethod(this, 'onEnd');
    },

    /// <summary>
    /// The doAction method must be implemented by all actions.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.Action.doAction" />
    doAction: function() {
        throw Error.notImplemented();
    },

    /// <summary>
    /// Empty implementation of required abstract method.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.Action.getAnimatedValue" />
    getAnimatedValue: function() {
    },

    /// <summary>
    /// Empty implementation of required abstract method.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.Action.setValue" />
    setValue: function() {
    }
}
$AA.Action.registerClass('Sys.Extended.UI.Animation.Action', $AA.Animation);
$AA.registerAnimation('action', $AA.Action);

///<summary>
/// The EnableAction changes whether or not the target is disabled.
///</summary>
///<member name="cT:AjaxControlToolkit.EnableAction" base="AjaxControlToolkit.Action" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.EnableAction.ctor" />
/// <param name="target" type="Object">Target of the animation.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="enabled" type="Boolean">Whether or not the target is disabled. The default value is true.</param>
$AA.EnableAction = function(target, duration, fps, enabled) {
    $AA.EnableAction.initializeBase(this, [target, duration, fps]);

    // Whether to enable or disable
    this._enabled = (enabled !== undefined) ? enabled : true;
}
$AA.EnableAction.prototype = {
    /// <summary>
    /// Sets the enabled property of the target.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.EnableAction.doAction" />
    doAction: function() {
        var element = this.get_target();
        if(element) {
            element.disabled = !this._enabled;
        }
    },

    ///<summary>
    /// Whether or not the target is disabled. The default value is true.
    ///</summary>
    ///<getter>get_enabled</getter>
    ///<setter>set_enabled</setter>
    ///<member name="cP:AjaxControlToolkit.EnableAction.enabled" />
    get_enabled: function() {
        return this._enabled;
    },
    set_enabled: function(value) {
        value = this._getBoolean(value);
        if(this._enabled != value) {
            this._enabled = value;
            this.raisePropertyChanged('enabled');
        }
    }
}
$AA.EnableAction.registerClass('Sys.Extended.UI.Animation.EnableAction', $AA.Action);
$AA.registerAnimation('enableAction', $AA.EnableAction);

///<summary>
/// The HideAction simply hides the target from view
/// (by setting its style's display attribute to 'none')
///</summary>
///<member name="cT:AjaxControlToolkit.HideAction" base="AjaxControlToolkit.Action" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.HideAction.ctor" />
/// <param name="target" type="Object">Target of the animation.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="visible" type="Boolean">true to show the target, false to hide it. The default value is false.</param>
$AA.HideAction = function(target, duration, fps, visible) {
    $AA.HideAction.initializeBase(this, [target, duration, fps]);

    this._visible = visible;
}
$AA.HideAction.prototype = {
    /// <summary>
    /// Hides the target element.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.HideAction.doAction" />
    doAction: function() {
        var element = this.get_target();
        if(element) {
            $common.setVisible(element, this._visible);
        }
    },

    ///<summary>
    /// True to show the target, false to hide it. The default value is false.
    ///</summary>
    ///<getter>get_visible</getter>
    ///<setter>set_visible</setter>
    ///<member name="cP:AjaxControlToolkit.HideAction.visible" />
    get_visible: function() {
        return this._visible;
    },
    set_visible: function(value) {
        if(this._visible != value) {
            this._visible = value;
            this.raisePropertyChanged('visible');
        }
    }
}
$AA.HideAction.registerClass('Sys.Extended.UI.Animation.HideAction', $AA.Action);
$AA.registerAnimation('hideAction', $AA.HideAction);

///<summary>
/// The StyleAction is used to set a particular attribute of the target's style.
///</summary>
///<member name="cT:AjaxControlToolkit.StyleAction" base="AjaxControlToolkit.Action" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.StyleAction.ctor" />
/// <param name="target" type="Object">Target of the animation.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="attribute" type="String">Style attribute to set (this must be in a JavaScript friendly format, i.e. backgroundColor
/// instead of background-color).</param>
/// <param name="value" type="Object">Value to set the attribute.</param>
$AA.StyleAction = function(target, duration, fps, attribute, value) {
    $AA.StyleAction.initializeBase(this, [target, duration, fps]);

    // Style attribute (like "backgroundColor" or "borderWidth"
    this._attribute = attribute;

    // Value to assign to the style attribute
    this._value = value;

}
$AA.StyleAction.prototype = {
    /// <summary>
    /// Assigns the value to the style's attribute.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.StyleAction.doAction" />
    doAction: function() {
        var element = this.get_target();
        if(element) {
            element.style[this._attribute] = this._value;
        }
    },

    ///<summary>
    /// Style attribute to set (this must be in a JavaScript friendly format, i.e. backgroundColor
    /// instead of background-color).
    ///</summary>
    ///<getter>get_attribute</getter>
    ///<setter>set_attribute</setter>
    ///<member name="cP:AjaxControlToolkit.StyleAction.attribute" />
    get_attribute: function() {
        return this._attribute;
    },
    set_attribute: function(value) {
        if(this._attribute != value) {
            this._attribute = value;
            this.raisePropertyChanged('attribute');
        }
    },

    ///<summary>
    /// The attribute's value.
    ///</summary>
    ///<getter>get_value</getter>
    ///<setter>set_value</setter>
    ///<member name="cP:AjaxControlToolkit.StyleAction.value" />
    get_value: function() {
        return this._value;
    },
    set_value: function(value) {
        if(this._value != value) {
            this._value = value;
            this.raisePropertyChanged('value');
        }
    }
}
$AA.StyleAction.registerClass('Sys.Extended.UI.Animation.StyleAction', $AA.Action);
$AA.registerAnimation('styleAction', $AA.StyleAction);

///<summary>
/// OpacityAction allows you to set the opacity of the target.
///</summary>
///<member name="cT:AjaxControlToolkit.OpacityAction" base="AjaxControlToolkit.Action" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.OpacityAction.ctor" />
/// <param name="target" type="Object">Target of the animation.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="opacity" type="Number">Opacity to set the target.</param>
$AA.OpacityAction = function(target, duration, fps, opacity) {
    $AA.OpacityAction.initializeBase(this, [target, duration, fps]);

    // Opacity
    this._opacity = opacity;
}
$AA.OpacityAction.prototype = {
    /// <summary>
    /// Sets the target element's opacity.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.OpacityAction.doAction" />
    doAction: function() {
        var element = this.get_target();
        if(element) {
            $common.setElementOpacity(element, this._opacity);
        }
    },

    ///<summary>
    /// The opacity value to set to the target element.
    ///</summary>
    ///<getter>get_opacity</getter>
    ///<setter>set_opacity</setter>
    ///<member name="cP:AjaxControlToolkit.OpacityAction.opacity" />
    get_opacity: function() {
        return this._opacity;
    },
    set_opacity: function(value) {
        value = this._getFloat(value);
        if(this._opacity != value) {
            this._opacity = value;
            this.raisePropertyChanged('opacity');
        }
    }
}
$AA.OpacityAction.registerClass('Sys.Extended.UI.Animation.OpacityAction', $AA.Action);
$AA.registerAnimation('opacityAction', $AA.OpacityAction);

///<summary>
/// The ScriptAction is used to execute arbitrary JavaScript.
///</summary>
///<member name="cT:AjaxControlToolkit.ScriptAction" base="AjaxControlToolkit.Action" />

/// <summary />
/// <member name="cM:AjaxControlToolkit.ScriptAction.ctor" />
/// <param name="target" type="Object">Target of the animation.</param>
/// <param name="duration" type="Number">Length of the animation in seconds. The default is 1.</param>
/// <param name="fps" type="Number">Number of steps per second. The default is 25.</param>
/// <param name="script" type="String">JavaScript to execute.</param>
$AA.ScriptAction = function(target, duration, fps, script) {
    $AA.ScriptAction.initializeBase(this, [target, duration, fps]);

    // Script to execute
    this._script = script;
}
$AA.ScriptAction.prototype = {
    /// <summary>
    /// Executes the script.
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.ScriptAction.doAction" />
    doAction: function() {
        try {
            eval(this._script);
        } catch(ex) {
        }
    },

    ///<summary>
    /// JavaScript code to execute.
    ///</summary>
    ///<getter>get_script</getter>
    ///<setter>set_script</setter>
    ///<member name="cP:AjaxControlToolkit.ScriptAction.script" />
    get_script: function() {
        return this._script;
    },
    set_script: function(value) {
        if(this._script != value) {
            this._script = value;
            this.raisePropertyChanged('script');
        }
    }
}
$AA.ScriptAction.registerClass('Sys.Extended.UI.Animation.ScriptAction', $AA.Action);
$AA.registerAnimation('scriptAction', $AA.ScriptAction);

// globals
var $AA;