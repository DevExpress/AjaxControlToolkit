Type.registerNamespace('Sys.Extended.UI.Animation');

Sys.Extended.UI.Animation.UpdatePanelAnimationBehavior = function(element) {
    // Play animations just before and just after an UpdatePanel updates
    // "element" - updatePanel associated with the behavior
    Sys.Extended.UI.Animation.UpdatePanelAnimationBehavior.initializeBase(this, [element]);

    // Generic animation behaviors that automatically build animations from JSON descriptions
    this._onUpdating = new Sys.Extended.UI.Animation.GenericAnimationBehavior(element);
    this._onUpdated = new Sys.Extended.UI.Animation.GenericAnimationBehavior(element);

    this._postBackPending = null;
    this._pageLoadedHandler = null;
    this._alwaysFinishOnUpdatingAnimation = null;
    this._triggerControlsClientID = null;
};
Sys.Extended.UI.Animation.UpdatePanelAnimationBehavior.prototype = {
    initialize: function() {
        Sys.Extended.UI.Animation.UpdatePanelAnimationBehavior.callBaseMethod(this, 'initialize');

        // Wrap the UpdatePanel in another div (or span) that we'll do the animation with
        var element = this.get_element();
        var parentDiv = document.createElement(element.tagName);
        element.parentNode.insertBefore(parentDiv, element);
        parentDiv.appendChild(element);

        // Move the behavior from the UpdatePanel to the new parent div
        Array.remove(element._behaviors, this);
        Array.remove(element._behaviors, this._onUpdating);
        Array.remove(element._behaviors, this._onUpdated);
        if(parentDiv._behaviors) {
            Array.add(parentDiv._behaviors, this);
            Array.add(parentDiv._behaviors, this._onUpdating);
            Array.add(parentDiv._behaviors, this._onUpdated);
        } else {
            parentDiv._behaviors = [this, this._onUpdating, this._onUpdated];
        }
        this._element = this._onUpdating._element = this._onUpdated._element = parentDiv;

        // Initialize the generic animation behaviors
        this._onUpdating.initialize();
        this._onUpdated.initialize();

        // Attach to the beginRequest/pageLoaded events (and we'll get _pageRequestManager
        // from calling registerPartialUpdates)
        this.registerPartialUpdateEvents();
        this._pageLoadedHandler = Function.createDelegate(this, this._pageLoaded);
        this._pageRequestManager.add_pageLoaded(this._pageLoadedHandler);
    },

    dispose: function() {
        // Important: remove event handler before calling base dispose
        // (which will set _pageRequestManager to null)
        if(this._pageRequestManager && this._pageLoadedHandler) {
            this._pageRequestManager.remove_pageLoaded(this._pageLoadedHandler);
            this._pageLoadedHandler = null;
        }

        Sys.Extended.UI.Animation.UpdatePanelAnimationBehavior.callBaseMethod(this, 'dispose');
    },

    _partialUpdateBeginRequest: function(sender, beginRequestEventArgs) {
        // Method that will be called when a partial update (via an UpdatePanel) begins,
        // if registerPartialUpdateEvents() has been called.
        // "sender" - sender
        // "beginRequestEventArgs" - event arguments
        Sys.Extended.UI.Animation.UpdatePanelAnimationBehavior.callBaseMethod(this, '_partialUpdateBeginRequest', [sender, beginRequestEventArgs]);

        if(!this._postBackPending) {
            if(this._triggerControlsClientID.length == 0
                || this._triggerControlsClientID.indexOf(sender._activeElement.id) != -1)
            {
                this._postBackPending = true;
                this._onUpdated.quit();
                this._onUpdating.play();
            }
        }
    },

    _pageLoaded: function(sender, args) {
        // Method that will be called when a partial update (via an UpdatePanel) finishes
        // "sender" - sender
        // "args" - event arguments
        if(this._postBackPending) {
            this._postBackPending = false;

            var element = this.get_element();
            var panels = args.get_panelsUpdated();
            for(var i = 0; i < panels.length; i++) {
                if(panels[i].parentNode == element) {
                    if(this._alwaysFinishOnUpdatingAnimation) {
                        this._tryAndStopOnUpdating();
                    }
                    else {
                        this._onUpdating.quit();
                        this._onUpdated.play();
                    }
                    break;
                }
            }
        }
    },

    _tryAndStopOnUpdating: function() {
        if(this._onUpdating.get_animation().get_isPlaying()) {
            var context = this;
            window.setTimeout(function() { context._tryAndStopOnUpdating.apply(context); }, 200);
        }
        else {
            this._onUpdating.quit();
            this._onUpdated.play();
        }
    },

    /// <summary>
    /// Generic animation played as when any UpdatePanel begins updating
    /// </summary>
    /// <getter>get_onUpdating</getter>
    /// <setter>set_onUpdating</setter>
    /// <member name="cP:AjaxControlToolkit.UpdatePanelAnimationExtender.onUpdating" />
    get_onUpdating: function() {
        return this._onUpdating.get_json();
    },
    set_onUpdating: function(value) {
        this._onUpdating.set_json(value);
        this.raisePropertyChanged('onUpdating');
    },

    get_OnUpdating: function() {
        Sys.Extended.Deprecated("get_OnUpdating()", "get_onUpdating()");
        return this.get_onUpdating();
    },
    set_OnUpdating: function(value) {
        Sys.Extended.Deprecated("set_OnUpdating(value)", "set_onUpdating(value)");
        this.set_onUpdating();
    },

    /// <summary>
    /// Generic OnUpdating Animation's behavior
    /// </summary>
    /// <getter>get_onUpdatingBehavior</getter>
    /// <member name="cP:AjaxControlToolkit.UpdatePanelAnimationExtender.onUpdatingBehavior" />
    get_onUpdatingBehavior: function() {
        return this._onUpdating;
    },
    get_OnUpdatingBehavior: function() {
        Sys.Extended.Deprecated("get_OnUpdatingBehavior()", "get_onUpdatingBehavior()");
        return this.get_onUpdatingBehavior();
    },

    /// <summary>
    /// Generic animation played after the UpdatePanel has finished updating
    /// (but only if the UpdatePanel was changed)
    /// </summary>
    /// <getter>get_onUpdated</getter>
    /// <setter>set_onUpdated</setter>
    /// <member name="cP:AjaxControlToolkit.UpdatePanelAnimationExtender.onUpdated" />
    get_onUpdated: function() {
        return this._onUpdated.get_json();
    },
    set_onUpdated: function(value) {
        this._onUpdated.set_json(value);
        this.raisePropertyChanged('onUpdated');
    },

    get_OnUpdated: function() {
        Sys.Extended.Deprecated("get_OnUpdated()", "get_onUpdated()");
        return this.get_onUpdated();
    },
    set_OnUpdated: function(value) {
        Sys.Extended.Deprecated("set_OnUpdated(value)", "set_onUpdated(value)");
        this.set_onUpdated(value);
    },

    /// <summary>
    /// Generic OnUpdated Animation's behavior
    /// </summary>
    /// <getter>get_onUpdatedBehavior</getter>
    /// <member name="cP:AjaxControlToolkit.UpdatePanelAnimationExtender.onUpdatedBehavior" />
    get_onUpdatedBehavior: function() {
        return this._onUpdated;
    },
    get_OnUpdatedBehavior: function() {
        Sys.Extended.Deprecated("get_OnUpdatedBehavior()", "get_onUpdatedBehavior()");
        return this.get_onUpdatedBehavior();
    },

    /// <summary>
    /// An optional property that makes sure the OnUpdated event will fire
    /// only after the onUpdating event is completed
    /// </summary>
    /// <getter>get_alwaysFinishOnUpdatingAnimation</getter>
    /// <setter>set_alwaysFinishOnUpdatingAnimation</setter>
    /// <member name="cP:AjaxControlToolkit.UpdatePanelAnimationExtender.alwaysFinishOnUpdatingAnimation" />
    get_alwaysFinishOnUpdatingAnimation: function() {
        // Indicates whether to always finish play the OnUpating animation before the
        // OnUpdated animation starts.
        return this._alwaysFinishOnUpdatingAnimation;
    },
    set_alwaysFinishOnUpdatingAnimation: function(value) {
        if(this._alwaysFinishOnUpdatingAnimation != value) {
            this._alwaysFinishOnUpdatingAnimation = value;
            this.raisePropertyChanged('alwaysFinishOnUpdatingAnimation');
        }
    },

    get_AlwaysFinishOnUpdatingAnimation: function() {
        Sys.Extended.Deprecated("get_AlwaysFinishOnUpdatingAnimation()", "get_alwaysFinishOnUpdatingAnimation()");
        return this.get_alwaysFinishOnUpdatingAnimation();
    },
    set_AlwaysFinishOnUpdatingAnimation: function(value) {
        Sys.Extended.Deprecated("set_AlwaysFinishOnUpdatingAnimation(value)", "set_alwaysFinishOnUpdatingAnimation(value)");
        this.set_alwaysFinishOnUpdatingAnimation(value);
    },

    /// <summary>
    /// ClientIDs of the trigger controls
    /// </summary>
    /// <getter>get_triggerControlsClientID</getter>
    /// <setter>set_triggerControlsClientID</setter>
    /// <member name="cP:AjaxControlToolkit.UpdatePanelAnimationExtender.triggerControlsClientID" />
    get_triggerControlsClientID: function() {
        return this._triggerControlsClientID;;
    },
    set_triggerControlsClientID: function(value) {
        if(this._triggerControlsClientID != value) {
            this._triggerControlsClientID = value;
            this.raisePropertyChanged('triggerControlsClientID');
        }
    },

    get_TriggerControlsClientID: function() {
        Sys.Extended.Deprecated("get_TriggerControlsClientID()", "get_triggerControlsClientID()");
        return this._triggerControlsClientID;
    },
    set_TriggerControlsClientID: function(value) {
        Sys.Extended.Deprecated("set_TriggerControlsClientID(value)", "set_triggerControlsClientID(value)");
        this.set_triggerControlsClientID(value);
    }
};
Sys.Extended.UI.Animation.UpdatePanelAnimationBehavior.registerClass('Sys.Extended.UI.Animation.UpdatePanelAnimationBehavior', Sys.Extended.UI.BehaviorBase);