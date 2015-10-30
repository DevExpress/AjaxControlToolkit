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
        context.raise_endClientCallback(arg);
    },

    _onMouseOut: function(e) {
        if(this._readOnly)
            return;

        this._currentRating = this._ratingValue;
        this._update();
        this.raise_mouseOut(this._currentRating);
    },

    _onStarClick: function(e) {
        if(this._readOnly)
            return;

        if(this._ratingValue != this._currentRating)
            this.set_rating(this._currentRating);

        this.doCallback();
    },

    _onStarMouseOver: function(e) {
        if(this._readOnly)
            return;

        if(this._ratingDirection == 0)
            this._currentRating = e.target.value;
        else
            this._currentRating = this._maxRatingValue + 1 - e.target.value;

        this._update();
        this.raise_mouseOver(this._currentRating);
    },

    _onKeyDownBack: function(ev) {
        if(this._readOnly)
            return;

        var k = ev.keyCode ? ev.keyCode : ev.rawEvent.keyCode;
        if((k == Sys.UI.Key.right) || (k == Sys.UI.Key.up)) {
            this._currentRating = Math.min(this._currentRating + 1, this._maxRatingValue);
            this.set_rating(this._currentRating);

            ev.preventDefault();
            ev.stopPropagation();
        } else if((k == Sys.UI.Key.left) || (k == Sys.UI.Key.down)) {
            this._currentRating = Math.max(this._currentRating - 1, 1);
            this.set_rating(this._currentRating);

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

    /// <summary>
    /// Fires when rating has been marked
    /// </summary>
    /// <event add="add_rated" remove="remove_rated" raise="raise_rated" />
    /// <member name="cE:AjaxControlToolkit.Rating.rated" />
    add_rated: function(handler) {
        this.get_events().addHandler("rated", handler);
    },
    remove_rated: function(handler) {
        this.get_events().removeHandler("rated", handler);
    },
    raise_rated: function(rating) {
        var handler = this.get_events().getHandler("rated");

        if(handler)
            handler(this, new Sys.Extended.UI.RatingEventArgs(rating));
    },

    add_Rated: function(handler) {
        Sys.Extended.Deprecated("add_Rated(handler)", "add_rated(handler)");
        this.add_rated(handler);
    },
    remove_Rated: function(handler) {
        Sys.Extended.Deprecated("remove_Rated(handler)", "remove_rated(handler)");
        this.remove_rated(handler);
    },
    raiseRated: function(rating) {
        Sys.Extended.Deprecated("raiseRated(rating)", "raise_rated(rating)");
        this.raise_rated(rating);
    },

    /// <summary>
    /// Fires when mouse is over the Rating control
    /// </summary>
    /// <event add="add_mouseOver" remove="remove_mouseOver" raise="raise_mouseOver" />
    /// <member name="cE:AjaxControlToolkit.Rating.mouseOver" />
    add_mouseOver: function(handler) {
        this.get_events().addHandler("mouseOver", handler);
    },
    remove_mouseOver: function(handler) {
        this.get_events().removeHandler("mouseOver", handler);
    },
    raise_mouseOver: function(ratingTmp) {
        var handler = this.get_events().getHandler("mouseOver");

        if(handler)
            handler(this, new Sys.Extended.UI.RatingEventArgs(rating_tmp));
    },

    add_MouseOver: function(handler) {
        Sys.Extended.Deprecated("add_MouseOver(handler)", "add_mouseOver(handler)");
        this.add_mouseOver(handler);
    },
    remove_MouseOver: function(handler) {
        Sys.Extended.Deprecated("remove_MouseOver(handler)", "remove_mouseOver(handler)");
        this.remove_mouseOver(handler);
    },
    raiseMouseOver: function(rating_tmp) {
        Sys.Extended.Deprecated("raiseMouseOver(rating_tmp)", "raise_mouseOver(ratingTmp)");
        this.raise_mouseOver(rating_tmp);
    },

    /// <summary>
    /// Fires when mouse pointer leaves the Rating element
    /// </summary>
    /// <event add="add_mouseOut" remove="remove_mouseOut" raise="raise_mouseOut" />
    /// <member name="cE:AjaxControlToolkit.Rating.mouseOut" />
    add_mouseOut: function(handler) {
        this.get_events().addHandler("mouseOut", handler);
    },
    remove_mouseOut: function(handler) {
        this.get_events().removeHandler("mouseOut", handler);
    },
    raise_mouseOut: function(ratingOld) {
        var handler = this.get_events().getHandler("mouseOut");

        if(handler)
            handler(this, new Sys.Extended.UI.RatingEventArgs(ratingOld));
    },

    add_MouseOut: function(handler) {
        Sys.Extended.Deprecated("add_MouseOut(handler)", "add_mouseOut(handler)");
        this.add_mouseOut(handler);
    },
    remove_MouseOut: function(handler) {
        Sys.Extended.Deprecated("remove_MouseOut(handler)", "remove_mouseOut(handler)");
        this.remove_mouseOut(handler);
    },
    raiseMouseOut: function(rating_old) {
        Sys.Extended.Deprecated("raiseMouseOut(rating_old)", "raise_mouseOut(ratingOld)");
        this.raise_mouseOut(rating_old);
    },

    /// <summary>
    /// Fires when rating is changed
    /// </summary>
    /// <event add="add_endClientCallback" remove="remove_endClientCallback" raise="raise_endClientCallback" />
    /// <member name="cE:AjaxControlToolkit.Rating.endClientCallback" />
    add_endClientCallback: function(handler) {
        this.get_events().addHandler("endClientCallback", handler);
    },
    remove_endClientCallback: function(handler) {
        this.get_events().removeHandler("endClientCallback", handler);
    },
    raise_endClientCallback: function(result) {
        var handler = this.get_events().getHandler("endClientCallback");

        if(handler)
            handler(this, new Sys.Extended.UI.RatingCallbackResultEventArgs(result));
    },

    add_EndClientCallback: function(handler) {
        Sys.Extended.Deprecated("add_EndClientCallback(handler)", "add_endClientCallback(handler)");
        this.add_endClientCallback(handler);
    },
    remove_EndClientCallback: function(handler) {
        Sys.Extended.Deprecated("remove_EndClientCallback(handler)", "remove_endClientCallback(handler)");
        this.remove_endClientCallback(handler);
    },
    raiseEndClientCallback: function(result) {
        Sys.Extended.Deprecated("raiseEndClientCallback()", "raise_endClientCallback()");
        this.raise_endClientCallback(result);
    },

    /// <summary>
    /// Set to True to cause a postback on rating item click
    /// </summary>
    /// <getter>get_autoPostBack</getter>
    /// <setter>set_autoPostBack</setter>
    /// <member name="cP:AjaxControlToolkit.Rating.autoPostBack" />
    get_autoPostBack: function() {
        return this._autoPostBack;
    },
    set_autoPostBack: function(value) {
        this._autoPostBack = value;
    },

    get_AutoPostBack: function() {
        Sys.Extended.Deprecated("get_AutoPostBack()", "get_autoPostBack()");
        return this.get_autoPostBack();
    },
    set_AutoPostBack: function(value) {
        Sys.Extended.Deprecated("set_AutoPostBack(value)", "set_autoPostBack(value)");
        this.set_autoPostBack(value);
    },

    /// <summary>
    /// An array of stars
    /// </summary>
    /// <getter>get_stars</getter>
    /// <member name="cP:AjaxControlToolkit.Rating.stars" />
    get_stars: function() {
        return this._stars;
    },
    get_Stars: function() {
        Sys.Extended.Deprecated("get_Stars()", "get_stars()");
        return this.get_stars();
    },

    /// <summary>
    /// A custom parameter to pass to the ClientCallBack
    /// </summary>
    /// <getter>get_tag</getter>
    /// <setter>set_tag</setter>
    /// <member name="cP:AjaxControlToolkit.Rating.tag" />
    get_tag: function() {
        return this._tag;
    },
    set_tag: function(value) {
        if(this._tag != value) {
            this._tag = value;
            this.raisePropertyChanged('tag');
        }
    },

    get_Tag: function() {
        Sys.Extended.Deprecated("get_Tag()", "get_tag()");
        return this.get_tag();
    },
    set_Tag: function(value) {
        Sys.Extended.Deprecated("set_Tag(value)", "set_tag(value)");
        this.set_tag(value);
    },

    /// <summary>
    /// ID of the callback
    /// </summary>
    /// <getter>get_callbackID</getter>
    /// <setter>set_callbackID</setter>
    /// <member name="cP:AjaxControlToolkit.Rating.callbackID" />
    get_callbackID: function() {
        return this._callbackID;
    },
    set_callbackID: function(value) {
        this._callbackID = value;
    },

    get_CallbackID: function() {
        Sys.Extended.Deprecated("get_CallbackID()", "get_callbackID()");
        return this.get_callbackID();
    },
    set_CallbackID: function(value) {
        Sys.Extended.Deprecated("set_CallbackID(value)", "set_callbackID(value)");
        this.set_callbackID(value);
    },

    /// <summary>
    /// Orientation of stars (LeftToRightTopToBottom or RightToLeftBottomToTop)
    /// </summary>
    /// <getter>get_ratingDirection</getter>
    /// <setter>set_ratingDirection</setter>
    /// <member name="cP:AjaxControlToolkit.Rating.ratingDirection" />
    get_ratingDirection: function() {
        // TODO: We should create an enum for this
        return this._ratingDirection;
    },
    set_ratingDirection: function(value) {
        if(this._ratingDirection != value) {
            this._ratingDirection = value;

            if(this.get_isInitialized())
                this._update();

            this.raisePropertyChanged('ratingDirection');
        }
    },

    get_RatingDirection: function() {
        Sys.Extended.Deprecated("get_RatingDirection()", "get_ratingDirection()");
        return this.get_ratingDirection();
    },
    set_RatingDirection: function(value) {
        Sys.Extended.Deprecated("set_RatingDirection(value)", "set_ratingDirection(value)");
        this.set_ratingDirection(value);
    },

    /// <summary>
    /// A CSS class for a star in empty mode
    /// </summary>
    /// <getter>get_emptyStarCssClass</getter>
    /// <setter>set_emptyStarCssClass</setter>
    /// <member name="cP:AjaxControlToolkit.Rating.emptyStarCssClass" />
    get_emptyStarCssClass: function() {
        return this._emptyStarCssClass;
    },
    set_emptyStarCssClass: function(value) {
        if(this._emptyStarCssClass != value) {
            this._emptyStarCssClass = value;
            this.raisePropertyChanged('emptyStarCssClass');
        }
    },

    get_EmptyStarCssClass: function() {
        Sys.Extended.Deprecated("get_EmptyStarCssClass()", "get_emptyStarCssClass()");
        return this.get_emptyStarCssClass();
    },
    set_EmptyStarCssClass: function(value) {
        Sys.Extended.Deprecated("set_EmptyStarCssClass(value)", "set_emptyStarCssClass(value)");
        this.set_emptyStarCssClass(value);  
    },

    /// <summary>
    /// A CSS class for star in filled mode
    /// </summary>
    /// <getter>get_filledStarCssClass</getter>
    /// <setter>set_filledStarCssClass</setter>
    /// <member name="cP:AjaxControlToolkit.Rating.filledStarCssClass" />
    get_filledStarCssClass: function() {
        return this._filledStarCssClass;
    },
    set_filledStarCssClass: function(value) {
        if(this._filledStarCssClass != value) {
            this._filledStarCssClass = value;
            this.raisePropertyChanged('filledStarCssClass');
        }
    },

    get_FilledStarCssClass: function() {
        Sys.Extended.Deprecated("get_FilledStarCssClass()", "get_filledStarCssClass()");
        return this.get_filledStarCssClass();
    },
    set_FilledStarCssClass: function(value) {
        Sys.Extended.Deprecated("set_FilledStarCssClass(value)", "set_filledStarCssClass(value)");
        this.set_filledStarCssClass(value);
    },

    /// <summary>
    /// A CSS class for a star in waiting mode
    /// </summary>
    /// <getter>get_waitingStarCssClass</getter>
    /// <setter>set_waitingStarCssClass</setter>
    /// <member name="cP:AjaxControlToolkit.Rating.waitingStarCssClass" />
    get_waitingStarCssClass: function() {
        return this._waitingStarCssClass;
    },
    set_waitingStarCssClass: function(value) {
        if(this._waitingStarCssClass != value) {
            this._waitingStarCssClass = value;
            this.raisePropertyChanged('waitingStarCssClass');
        }
    },

    get_WaitingStarCssClass: function() {
        Sys.Extended.Deprecated("get_WaitingStarCssClass()", "get_waitingStarCssClass()");
        return this.get_waitingStarCssClass();
    },
    set_WaitingStarCssClass: function(value) {
        Sys.Extended.Deprecated("set_WaitingStarCssClass(value)", "set_waitingStarCssClass(value)");
        this.set_waitingStarCssClass(value);
    },

    doCallback: function()
    {
        if (this._isServerControl) {
            this._waitingMode(true);

            var args = this._currentRating + ";" + this._tag,
                id = this._callbackID;

            if (this._autoPostBack)
                __doPostBack(id, args);
            else
                WebForm_DoCallback(id, args, this._receiveServerData, this, this._onError, true)
        }
    },

    /// <summary>
    /// A current rating value
    /// </summary>
    /// <getter>get_rating</getter>
    /// <setter>set_rating</setter>
    /// <member name="cP:AjaxControlToolkit.Rating.rating" />
    get_rating: function() {
        var hiddenValue = Sys.Extended.UI.RatingBehavior.callBaseMethod(this, 'get_ClientState');
        if(hiddenValue !== null && hiddenValue.length)
            this._ratingValue = hiddenValue

        if(this._ratingValue == '')
            this._ratingValue = null;

        return this._ratingValue;
    },
    set_rating: function(value) {
        if(this._ratingValue != value) {
            this._ratingValue = value;
            this._currentRating = value;

            if(this.get_isInitialized()) {
                if((value < 0) || (value > this._maxRatingValue))
                    return;

                this._update();

                Sys.Extended.UI.RatingBehavior.callBaseMethod(this, 'set_ClientState', [this._ratingValue]);

                this.raisePropertyChanged('rating');
                this.raise_rated(this._currentRating);

                this.doCallback();
            }
        }
    },

    get_Rating: function() {
        Sys.Extended.Deprecated("get_Rating()", "get_rating()");
        return this.get_rating();
    },
    set_Rating: function(value) {
        Sys.Extended.Deprecated("set_Rating(value)", "set_rating(value)");
        this.set_rating(value);
    },

    /// <summary>
    /// A maximum rating value
    /// </summary>
    /// <getter>get_maxRating</getter>
    /// <setter>set_maxRating</setter>
    /// <member name="cP:AjaxControlToolkit.Rating.maxRating" />
    get_maxRating: function() {
        return this._maxRatingValue;
    },
    set_maxRating: function(value) {
        if(this._maxRatingValue != value) {
            this._maxRatingValue = value;
            this.raisePropertyChanged('maxRating');
        }
    },

    get_MaxRating: function() {
        Sys.Extended.Deprecated("get_MaxRating()", "get_maxRating()");
        return this.get_maxRating();
    },
    set_MaxRating: function(value) {
        Sys.Extended.Deprecated("set_MaxRating(value)", "set_maxRating(value)");
        this.set_maxRating(value);
    },

    /// <summary>
    /// Whether or not the rating can be changed
    /// </summary>
    /// <getter>get_readOnly</getter>
    /// <setter>set_readOnly</setter>
    /// <member name="cP:AjaxControlToolkit.Rating.readOnly" />
    get_readOnly: function() {
        return this._readOnly;
    },
    set_readOnly: function(value) {
        if(this._readOnly != value) {
            this._readOnly = value;
            this.raisePropertyChanged('readOnly');
        }
    },

    get_ReadOnly: function() {
        Sys.Extended.Deprecated("get_ReadOnly()", "get_readOnly()");
        return this.get_readOnly();
    },
    set_ReadOnly: function(value) {
        Sys.Extended.Deprecated("set_ReadOnly(value)", "set_readOnly(value)");
        this.set_readOnly(value);
    },

    /// <summary>
    /// A CSS class for a visible star
    /// </summary>
    /// <getter>get_starCssClass</getter>
    /// <setter>set_starCssClass</setter>
    /// <member name="cP:AjaxControlToolkit.Rating.starCssClass" />
    get_starCssClass: function() {
        return this._starCssClass;
    },
    set_starCssClass: function(value) {
        if(this._starCssClass != value) {
            this._starCssClass = value;
            this.raisePropertyChanged('starCssClass');
        }
    },

    get_StarCssClass: function() {
        Sys.Extended.Deprecated("get_StarCssClass()", "get_starCssClass()");
        return this.get_starCssClass();
    },
    set_StarCssClass: function(value) {
        Sys.Extended.Deprecated("set_StarCssClass(value)", "set_starCssClass(value)");
        this.set_starCssClass(value);
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