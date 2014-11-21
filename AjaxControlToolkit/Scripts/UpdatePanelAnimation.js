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
    this._AlwaysFinishOnUpdatingAnimation = null;
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
            this._postBackPending = true;
            this._onUpdated.quit();
            this._onUpdating.play();
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
                if(panels[i].parentNode == element)
                    if(this._AlwaysFinishOnUpdatingAnimation) {
                        this._tryAndStopOnUpdating();
                    }
                    else {
                        this._onUpdating.quit();
                        this._onUpdated.play();
                    }
                    break;
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

    get_OnUpdating: function() {
        // Generic OnUpdating Animation's JSON definition
        return this._onUpdating.get_json();
    },
    set_OnUpdating: function(value) {
        this._onUpdating.set_json(value);
        this.raisePropertyChanged('OnUpdating');
    },

    get_OnUpdatingBehavior: function() {
        // Generic OnUpdating Animation's behavior
        return this._onUpdating;
    },


    get_OnUpdated: function() {
        // Generic OnUpdated Animation's JSON definition
        return this._onUpdated.get_json();
    },
    set_OnUpdated: function(value) {
        this._onUpdated.set_json(value);
        this.raisePropertyChanged('OnUpdated');
    },

    get_OnUpdatedBehavior: function() {
        // Generic OnUpdated Animation's behavior
        return this._onUpdated;
    },

    get_AlwaysFinishOnUpdatingAnimation: function() {
        // Indicates whether to always finish play the OnUpating animation before the
        // OnUpdated animation starts.
        return this._AlwaysFinishOnUpdatingAnimation;
    },
    set_AlwaysFinishOnUpdatingAnimation: function(value) {
        if(this._AlwaysFinishOnUpdatingAnimation != value) {
            this._AlwaysFinishOnUpdatingAnimation = value;
            this.raisePropertyChanged('AlwaysFinishOnUpdatingAnimation');
        }
    }
};
Sys.Extended.UI.Animation.UpdatePanelAnimationBehavior.registerClass('Sys.Extended.UI.Animation.UpdatePanelAnimationBehavior', Sys.Extended.UI.BehaviorBase);