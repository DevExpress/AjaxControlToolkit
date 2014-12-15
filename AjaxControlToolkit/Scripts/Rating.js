Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.RatingBehavior = function(element) {
    // The RatingBehavior creates a sequence of stars used to rate an item
    Sys.Extended.UI.RatingBehavior.initializeBase(this, [element]);

    this._starCssClass = "rating_star";
    this._filledStarCssClass = "rating_filled";
    this._emptyStarCssClass = "rating_empty";
    this._waitingStarCssClass = null;
    this._isServerControl = false;
    this._readOnly = false;
    this._ratingValue = 0;
    this._currentRating = 0;
    this._maxRatingValue = 5;
    this._tag = "";
    this._ratingDirection = 0;
    this._stars = null;
    this._callbackID = null;
    this._mouseOutHandler = Function.createDelegate(this, this._onMouseOut);
    this._starClickHandler = Function.createDelegate(this, this._onStarClick);
    this._starMouseOverHandler = Function.createDelegate(this, this._onStarMouseOver);
    this._keyDownHandler = Function.createDelegate(this, this._onKeyDownBack);
    this._autoPostBack = false;
}

Sys.Extended.UI.RatingBehavior.prototype = {

    initialize: function() {
        Sys.Extended.UI.RatingBehavior.callBaseMethod(this, 'initialize');

        var elt = this.get_element();
        this._stars = [];

        for(var i = 1; i <= this._maxRatingValue; i++) {
            starElement = $get(elt.id + '_Star_' + i);
            starElement.value = i;
            Array.add(this._stars, starElement);

            $addHandler(starElement, 'click', this._starClickHandler);
            $addHandler(starElement, 'mouseover', this._starMouseOverHandler);
        }

        $addHandler(elt, 'mouseout', this._mouseOutHandler);
        $addHandler(elt, "keydown", this._keyDownHandler);

        this._update();
    },

    dispose: function() {
        var elt = this.get_element();

        if(this._stars) {
            for(var i = 0; i < this._stars.length; i++) {
                var starElement = this._stars[i];

                $removeHandler(starElement, 'click', this._starClickHandler);
                $removeHandler(starElement, 'mouseover', this._starMouseOverHandler);
            }
            this._stars = null;
        }

        $removeHandler(elt, 'mouseout', this._mouseOutHandler);
        $removeHandler(elt, "keydown", this._keyDownHandler);

        Sys.Extended.UI.RatingBehavior.callBaseMethod(this, 'dispose');
    },

    _onError: function(message, context) {
        alert(String.format(Sys.Extended.UI.Resources.Rating_CallbackError, message));
    },

    _receiveServerData: function(arg, context) {
        // Handler for successful return from callback
        context._waitingMode(false);
        context.raiseEndClientCallback(arg);
    },

    _onMouseOut: function(e) {
        if(this._readOnly)
            return;

        this._currentRating = this._ratingValue;
        this._update();
        this.raiseMouseOut(this._currentRating);
    },

    _onStarClick: function(e) {
        if(this._readOnly)
            return;

        if(this._ratingValue != this._currentRating)
            this.set_Rating(this._currentRating);
    },

    _onStarMouseOver: function(e) {
        if(this._readOnly)
            return;

        if(this._ratingDirection == 0)
            this._currentRating = e.target.value;
        else
            this._currentRating = this._maxRatingValue + 1 - e.target.value;

        this._update();
        this.raiseMouseOver(this._currentRating);
    },

    _onKeyDownBack: function(ev) {
        if(this._readOnly)
            return;

        var k = ev.keyCode ? ev.keyCode : ev.rawEvent.keyCode;
        if((k == Sys.UI.Key.right) || (k == Sys.UI.Key.up)) {
            this._currentRating = Math.min(this._currentRating + 1, this._maxRatingValue);
            this.set_Rating(this._currentRating);

            ev.preventDefault();
            ev.stopPropagation();
        } else if((k == Sys.UI.Key.left) || (k == Sys.UI.Key.down)) {
            this._currentRating = Math.max(this._currentRating - 1, 1);
            this.set_Rating(this._currentRating);

            ev.preventDefault();
            ev.stopPropagation();
        }
    },

    _waitingMode: function(activated) {
        // Update the display to indicate whether or not we are waiting
        for(var i = 0; i < this._maxRatingValue; i++) {
            var starElement;

            if(this._ratingDirection == 0)
                starElement = this._stars[i];
            else
                starElement = this._stars[this._maxRatingValue - i - 1];

            if(this._currentRating > i) {
                if(this._waitingStarCssClass)
                    if(activated) {
                        Sys.UI.DomElement.removeCssClass(starElement, this._filledStarCssClass);
                        Sys.UI.DomElement.addCssClass(starElement, this._waitingStarCssClass);
                    }
                    else {
                        Sys.UI.DomElement.removeCssClass(starElement, this._waitingStarCssClass);
                        Sys.UI.DomElement.addCssClass(starElement, this._filledStarCssClass);
                    }
            } else {
                if(this._waitingStarCssClass)
                    Sys.UI.DomElement.removeCssClass(starElement, this._waitingStarCssClass);

                Sys.UI.DomElement.removeCssClass(starElement, this._filledStarCssClass);
                Sys.UI.DomElement.addCssClass(starElement, this._emptyStarCssClass);
            }
        }
    },

    _update: function() {
        // Update title attribute element
        var elt = this.get_element();
        $get(elt.id + "_A").title = this._currentRating;

        for(var i = 0; i < this._maxRatingValue; i++) {
            var starElement;

            if(this._ratingDirection == 0)
                starElement = this._stars[i];
            else
                starElement = this._stars[this._maxRatingValue - i - 1];

            if(this._currentRating > i) {
                Sys.UI.DomElement.removeCssClass(starElement, this._emptyStarCssClass);
                Sys.UI.DomElement.addCssClass(starElement, this._filledStarCssClass);
            } else {
                Sys.UI.DomElement.removeCssClass(starElement, this._filledStarCssClass);
                Sys.UI.DomElement.addCssClass(starElement, this._emptyStarCssClass);
            }
        }
    },

    add_Rated: function(handler) {
        this.get_events().addHandler("Rated", handler);
    },

    remove_Rated: function(handler) {
        this.get_events().removeHandler("Rated", handler);
    },

    raiseRated: function(rating) {
        var handler = this.get_events().getHandler("Rated");

        if(handler)
            handler(this, new Sys.Extended.UI.RatingEventArgs(rating));
    },

    add_MouseOver: function(handler) {
        this.get_events().addHandler("MouseOver", handler);
    },

    remove_MouseOver: function(handler) {
        this.get_events().removeHandler("MouseOver", handler);
    },

    raiseMouseOver: function(rating_tmp) {
        var handler = this.get_events().getHandler("MouseOver");

        if(handler)
            handler(this, new Sys.Extended.UI.RatingEventArgs(rating_tmp));
    },

    add_MouseOut: function(handler) {
        this.get_events().addHandler("MouseOut", handler);
    },

    remove_MouseOut: function(handler) {
        this.get_events().removeHandler("MouseOut", handler);
    },

    raiseMouseOut: function(rating_old) {
        var handler = this.get_events().getHandler("MouseOut");

        if(handler)
            handler(this, new Sys.Extended.UI.RatingEventArgs(rating_old));
    },

    add_EndClientCallback: function(handler) {
        this.get_events().addHandler("EndClientCallback", handler);
    },

    remove_EndClientCallback: function(handler) {
        this.get_events().removeHandler("EndClientCallback", handler);
    },

    raiseEndClientCallback: function(result) {
        var handler = this.get_events().getHandler("EndClientCallback");

        if(handler)
            handler(this, new Sys.Extended.UI.RatingCallbackResultEventArgs(result));
    },

    get_AutoPostBack: function() {
        return this._autoPostBack;
    },

    set_AutoPostBack: function(value) {
        this._autoPostBack = value;
    },

    get_Stars: function() {
        return this._stars;
    },

    get_Tag: function() {
        // A custom parameter to pass to the ClientCallBack
        return this._tag;
    },

    set_Tag: function(value) {
        if(this._tag != value) {
            this._tag = value;
            this.raisePropertyChanged('Tag');
        }
    },

    get_CallbackID: function() {
        return this._callbackID;
    },

    set_CallbackID: function(value) {
        this._callbackID = value;
    },

    get_RatingDirection: function() {
        // RatingDirection - Orientation of the stars (LeftToRightTopToBottom or RightToLeftBottomToTop)
        // TODO: We should create an enum for this
        return this._ratingDirection;
    },

    set_RatingDirection: function(value) {
        if(this._ratingDirection != value) {
            this._ratingDirection = value;

            if(this.get_isInitialized())
                this._update();

            this.raisePropertyChanged('RatingDirection');
        }
    },

    get_EmptyStarCssClass: function() {
        return this._emptyStarCssClass;
    },

    set_EmptyStarCssClass: function(value) {
        if(this._emptyStarCssClass != value) {
            this._emptyStarCssClass = value;
            this.raisePropertyChanged('EmptyStarCssClass');
        }
    },

    get_FilledStarCssClass: function() {
        return this._filledStarCssClass;
    },

    set_FilledStarCssClass: function(value) {
        if(this._filledStarCssClass != value) {
            this._filledStarCssClass = value;
            this.raisePropertyChanged('FilledStarCssClass');
        }
    },

    get_WaitingStarCssClass: function() {
        return this._waitingStarCssClass;
    },

    set_WaitingStarCssClass: function(value) {
        if(this._waitingStarCssClass != value) {
            this._waitingStarCssClass = value;
            this.raisePropertyChanged('WaitingStarCssClass');
        }
    },

    get_Rating: function() {
        var hiddenValue = Sys.Extended.UI.RatingBehavior.callBaseMethod(this, 'get_ClientState');
        if(hiddenValue !== null && hiddenValue.length)
            this._ratingValue = hiddenValue

        if(this._ratingValue == '')
            this._ratingValue = null;

        return this._ratingValue;
    },

    set_Rating: function(value) {
        if(this._ratingValue != value) {
            this._ratingValue = value;
            this._currentRating = value;

            if(this.get_isInitialized()) {
                if((value < 0) || (value > this._maxRatingValue))
                    return;

                this._update();

                Sys.Extended.UI.RatingBehavior.callBaseMethod(this, 'set_ClientState', [this._ratingValue]);

                this.raisePropertyChanged('Rating');
                this.raiseRated(this._currentRating);

                if(this._isServerControl) {
                    this._waitingMode(true);

                    var args = this._currentRating + ";" + this._tag,
                        id = this._callbackID;

                    if(this._autoPostBack)
                        __doPostBack(id, args);
                    else
                        WebForm_DoCallback(id, args, this._receiveServerData, this, this._onError, true)
                }
            }
        }
    },

    get_MaxRating: function() {
        return this._maxRatingValue;
    },

    set_MaxRating: function(value) {
        if(this._maxRatingValue != value) {
            this._maxRatingValue = value;
            this.raisePropertyChanged('MaxRating');
        }
    },

    get_ReadOnly: function() {
        return this._readOnly;
    },

    set_ReadOnly: function(value) {
        if(this._readOnly != value) {
            this._readOnly = value;
            this.raisePropertyChanged('ReadOnly');
        }
    },

    get_StarCssClass: function() {
        return this._starCssClass;
    },

    set_StarCssClass: function(value) {
        if(this._starCssClass != value) {
            this._starCssClass = value;
            this.raisePropertyChanged('StarCssClass');
        }
    }
}

Sys.Extended.UI.RatingBehavior.registerClass('Sys.Extended.UI.RatingBehavior', Sys.Extended.UI.BehaviorBase);

Sys.Extended.UI.RatingEventArgs = function(rating) {
    Sys.Extended.UI.RatingEventArgs.initializeBase(this);

    this._rating = rating;
}

Sys.Extended.UI.RatingEventArgs.prototype = {
    get_Rating: function() {
        return this._rating;
    }
}

Sys.Extended.UI.RatingEventArgs.registerClass('Sys.Extended.UI.RatingEventArgs', Sys.EventArgs);

Sys.Extended.UI.RatingCallbackResultEventArgs = function(result) {
    Sys.Extended.UI.RatingCallbackResultEventArgs.initializeBase(this);

    this._result = result;
}

Sys.Extended.UI.RatingCallbackResultEventArgs.prototype = {
    get_CallbackResult: function() {
        return this._result;
    }
}

Sys.Extended.UI.RatingCallbackResultEventArgs.registerClass('Sys.Extended.UI.RatingCallbackResultEventArgs', Sys.EventArgs);