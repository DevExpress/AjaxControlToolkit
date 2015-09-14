Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.SlideShowBehavior = function(element) {    
    Sys.Extended.UI.SlideShowBehavior.initializeBase(this, [element]);
    // Properties
    this._nextButtonID = null;
    this._previousButtonID = null;
    this._imageDescriptionLabelID = null;
    this._imageTitleLabelID = null;
    this._playButtonID = null;
    this._playButtonValue = '||>';
    this._stopButtonValue = '[]';
    this._slideShowServicePath = location.pathname;
    this._slideShowServiceMethod = null;
    this._contextKey = null;
    this._useContextKey = false;
    this._playInterval = 3000;
    this._tickHandler = null;
    this._loop = false;
    this._autoPlay = false;
    this._slideShowAnimationType = Sys.Extended.UI.SlideShowAnimationType.None;
    this._imageHeight = 300;
    this._imageWidth = 400;

    // Variables
    this._inPlayMode = false;
    this._elementImage = null;
    this._bNext = null;
    this._bPrevious = null;
    this._currentIndex = -1;
    this._currentValue = null;
    this._imageDescriptionLabel = null;
    this._imageTitleLabel = null;
    this._bPlay = null;
    this._slides = null;
    this._timer = null;
    this._currentImageElement = null;
    this._images = null;
    this._cachedImageIndex = -1;
    this._current = 0;
    this._previousImage = null;
    this._currentImage = null;
    this._nextImage = null;
    this._isNext = false;

    // Delegates
    this._clickNextHandler = null;
    this._clickPreviousHandler = null;
    this._clickPlayHandler = null;
    this._tickHandler = null;
    this._imageLoadedHandler = null;
}

Sys.Extended.UI.SlideShowBehavior.prototype = {
    initialize: function() {
        
        Sys.Extended.UI.SlideShowBehavior.callBaseMethod(this, 'initialize');
        var e = this.get_element();
        this._elementImage = e;

        // check if browser supports animation or not.
        if(!this.supportsAnimation('transition'))
            this._slideShowAnimationType = Sys.Extended.UI.SlideShowAnimationType.None;

        if(this._slideShowAnimationType != Sys.Extended.UI.SlideShowAnimationType.SlideRight ||
            this._slideShowAnimationType != Sys.Extended.UI.SlideShowAnimationType.SlideDown) {

            // create an invisible img element
            this._currentImageElement = document.createElement('IMG');
            this._currentImageElement.style.display = 'none';
            document.body.appendChild(this._currentImageElement);

            //Create a new parent for Image
            var _divContent = document.createElement('DIV');
            e.parentNode.insertBefore(_divContent, e);
            e.parentNode.removeChild(e);
            _divContent.appendChild(e);
            _divContent.align = 'center';

            this._imageLoadedHandler = Function.createDelegate(this, this._onImageLoaded);
            $addHandler(this._currentImageElement, 'load', this._imageLoadedHandler);
        }

        this.controlsSetup();
        // Create handlers for slideshow buttons clicks events and for image loaded events.
        if(this._bNext) {
            this._clickNextHandler = Function.createDelegate(this, this._onClickNext);
            $addHandler(this._bNext, 'click', this._clickNextHandler);
        }
        if(this._bPrevious) {
            this._clickPreviousHandler = Function.createDelegate(this, this._onClickPrevious);
            $addHandler(this._bPrevious, 'click', this._clickPreviousHandler);
        }
        if(this._bPlay) {
            this._clickPlayHandler = Function.createDelegate(this, this._onClickPlay);
            $addHandler(this._bPlay, 'click', this._clickPlayHandler);
        }

        // init slideshow
        this._slideShowInit();
    },

    dispose: function() {
        if(this._clickNextHandler) {
            $removeHandler(this._bNext, 'click', this._clickNextHandler);
            this._clickNextHandler = null;
        }
        if(this._clickPreviousHandler) {
            $removeHandler(this._bPrevious, 'click', this._clickPreviousHandler);
            this._clickPreviousHandler = null;
        }
        if(this._clickPlayHandler) {
            $removeHandler(this._bPlay, 'click', this._clickPlayHandler);
            this._clickPlayHandler = null;
        }
        if(this._imageLoadedHandler) {
            $removeHandler(this._currentImageElement, 'load', this._imageLoadedHandler);
            this._imageLoadedHandler = null;
        }
        if(this._timer) {
            this._timer.dispose();
            this._timer = null;
        }
        Sys.Extended.UI.SlideShowBehavior.callBaseMethod(this, 'dispose');
    },

    /// <summary>
    /// Fires when a slide changes
    /// </summary>
    /// <event add="add_slideChanged" remove="remove_slideChanged" raise="raise_slideChanged" />
    /// <member name="cE:AjaxControlToolkit.SlideShowExtender.slideChanged" />
    add_slideChanged: function(handler) {
        this.get_events().addHandler('slideChanged', handler);
    },
    remove_slideChanged: function(handler) {
        this.get_events().removeHandler('slideChanged', handler);
    },
    raise_slideChanged: function(eventArgs) {
        var handler = this.get_events().getHandler('slideChanged');
        if(handler) {
            if(!eventArgs)
                eventArgs = Sys.EventArgs.Empty;
            handler(this, eventArgs);
        }
    },
    raiseSlideChanged: function(eventArgs) {
        Sys.Extended.Deprecated("raiseSlideChanged(eventArgs)", "raise_slideChanged(eventArgs)");
        this.raise_slideChanged(eventArgs);
    },

    /// <summary>
    /// Fires when a slide begins to change
    /// </summary>
    /// <event add="add_slideChanging" remove="remove_slideChanging" raise="raise_slideChanging" />
    /// <member name="cE:AjaxControlToolkit.SlideShowExtender.slideChanging" />
    add_slideChanging: function(handler) {
        this.get_events().addHandler('slideChanging', handler);
    },
    remove_slideChanging: function(handler) {
        this.get_events().removeHandler('slideChanging', handler);
    },
    raise_slideChanging: function(previousSlide, newSlide) {
        var handler = this.get_events().getHandler('slideChanging');
        if(handler) {
            var eventArgs = new Sys.Extended.UI.SlideShowEventArgs(previousSlide, newSlide, this._currentIndex);
            handler(this, eventArgs);
            return eventArgs.get_cancel();
        }
        return false;
    },
    raiseSlideChanging: function(previousSlide, newSlide) {
        Sys.Extended.Deprecated("raiseSlideChanging(previousSlide, newSlide)", "raise_slideChanging(previousSlide, newSlide)");
        return this.raise_slideChanging(previousSlide, newSlide);
    },

    /// <summary>
    /// User/page specific context provided to an optional overload of the web
    /// method described by ServiceMethod/ServicePath
    /// </summary>
    /// <remarks>
    /// If the context key is used, it should have the same signature with an
    /// additional parameter named contextKey of the string type
    /// </remarks>
    /// <getter>get_contextKey</getter>
    /// <setter>set_contextKey</setter>
    /// <member name="cP:AjaxControlToolkit.SlideShowExtender.contextKey" />
    get_contextKey: function() {
        return this._contextKey;
    },
    set_contextKey: function(value) {
        if(this._contextKey != value) {
            this._contextKey = value;
            this.set_useContextKey(true);
            // if initialize has not been called
            // then do not reset the slideshow.
            if(this._elementImage)
                this._slideShowInit();
            this.raisePropertyChanged('contextKey');
        }
    },

    /// <summary>
    /// Whether or not the ContextKey property should be used
    /// </summary>
    /// <remarks>
    /// This will be automatically enabled if the ContextKey property is ever set
    /// (on either the client or the server). If the context key is used, it should have
    /// the same signature with an additional parameter named contextKey of the string type
    /// </remarks>
    /// <getter>get_useContextKey</getter>
    /// <setter>set_useContextKey</setter>
    /// <member name="cP:AjaxControlToolkit.SlideShowExtender.useContextKey" />
    get_useContextKey: function() {
        return this._useContextKey;
    },
    set_useContextKey: function(value) {
        if(this._useContextKey != value) {
            this._useContextKey = value;
            this.raisePropertyChanged('useContextKey');
        }
    },

    /// <summary>
    /// Width of the image container to animate slides smoothly from left to right or right to left
    /// </summary>
    /// <getter>get_imageWidth</getter>
    /// <setter>set_imageWidth</setter>
    /// <member name="cP:AjaxControlToolkit.SlideShowExtender.imageWidth" />
    get_imageWidth: function() {
        // To fix the size of container to display slides smoothly.
        return this._imageWidth;
    },
    set_imageWidth: function(value) {
        if(this._imageWidth != value) {
            this._imageWidth = value;
            this.raisePropertyChanged('imageWidth');
        }
    },

    /// <summary>
    /// Height of the image container to animate slides smoothly from up to down or down to up
    /// </summary>
    /// <getter>get_imageHeight</getter>
    /// <setter>set_imageHeight</setter>
    /// <member name="cP:AjaxControlToolkit.SlideShowExtender.imageHeight" />
    get_imageHeight: function() {
        // To fix the size of container to display slides smoothly.
        return this._imageHeight;
    },
    set_imageHeight: function(value) {
        if(this._imageHeight != value) {
            this._imageHeight = value;
            this.raisePropertyChanged('imageHeight');
        }
    },

    /// <summary>
    /// Gets handles to various slideshow controls if specified
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.SlideShowExtender.controlsSetup" />
    controlsSetup: function() {
        if(this._previousButtonID) {
            this._bPrevious = document.getElementById(this._previousButtonID);
        }
        if(this._imageDescriptionLabelID) {
            this._imageDescriptionLabel = document.getElementById(this._imageDescriptionLabelID);
        }
        if(this._imageTitleLabelID) {
            this._imageTitleLabel = document.getElementById(this._imageTitleLabelID);
        }
        if(this._nextButtonID) {
            this._bNext = document.getElementById(this._nextButtonID);
        }
        if(this._playButtonID) {
            this._bPlay = document.getElementById(this._playButtonID);
            this._bPlay.value = this._playButtonValue;
        }
    },

    /// <summary>
    /// Maintains various button states
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.SlideShowExtender.resetButtons" />
    resetButtons: function() {
        if(!this._loop) {
            // at the last slide
            if(this._slides.length <= this._currentIndex + 1) {
                if(this._bNext) this._bNext.disabled = true;
                if(this._bPlay) this._bPlay.disabled = true;
                if(this._bPrevious) this._bPrevious.disabled = false;

                // turn off play mode if on
                this._inPlayMode = false;
                if(this._timer)
                    this._timer.set_enabled(false);
                if(this._bPlay)
                    this._bPlay.value = this._playButtonValue;

            } else {
                if(this._bNext)
                    this._bNext.disabled = false;
                if(this._bPlay)
                    this._bPlay.disabled = false;
            }
            // at the first slide
            if(this._currentIndex <= 0) {
                if(this._bPrevious)
                    this._bPrevious.disabled = true;
            } else {
                if(this._bPrevious)
                    this._bPrevious.disabled = false;
            }
        }
        else {
            if(this._slides.length == 0) {
                if(this._bPrevious)
                    this._bPrevious.disabled = true;
                if(this._bNext)
                    this._bNext.disabled = true;
                if(this._bPlay)
                    this._bPlay.disabled = true;
            }
        }
        if(this._inPlayMode) {
            // restart timer
            this._timer.set_enabled(false);
            this._timer.set_enabled(true);
        }
    },

    /// <summary>
    /// Maintains the play button state to reflect whether the slideshow is in play mode
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.SlideShowExtender.resetSlideShowButtonState" />
    resetSlideShowButtonState: function() {
        if(this._inPlayMode) {
            if(this._bPlay)
                this._bPlay.value = this._stopButtonValue;
        }
        else {
            this.resetButtons();
            if(this._bPlay)
                this._bPlay.value = this._playButtonValue;
        }
    },

    /// <summary>
    /// Maintains a slideshow current image
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.SlideShowExtender.setCurrentImage" />
    setCurrentImage: function() {
        if(this._slides[this._currentIndex]) {
            this._currentImageElement.src = this._slides[this._currentIndex].ImagePath;
            if(this._slides[this._currentIndex].Url != null) {
                this._currentImageElement.style.cursor = 'pointer';
                this._currentImageElement.onclick = function() { window.open(this._slides[this._currentIndex].Url); };
            }
            else {
                this._currentImageElement.style.cursor = 'auto';
                this._currentImageElement.onclick = function() { };
            }
        } else {
            this._currentImageElement.src = '';
        }
        if(Sys.Browser.agent == Sys.Browser.Opera) {
            // call the handler explicitly for opera
            this._onImageLoaded(true);
        }
    },

    _getXYPosition: function(element) {
        if (!element)
           return { x : 0, y : 0 };

        var xy = {
            "x" : element.offsetLeft,
            "y" : element.offsetTop
        }

        var parent = this._getXYPosition(element.offsetParent);
        for (var key in parent)
           xy[key] += parent[key];

        return xy;
    },

    _placeImageOver: function(underImage, overImage) {
        overImage.style.border = null;
        overImage.style.position = "absolute";

        var coordinates = this._getXYPosition(underImage);
        var x = coordinates.x;
        var y = coordinates.y;

        overImage.style.left = x + "px";
        overImage.style.top = y + "px";
        overImage.alt = "";

        overImage.style.marginLeft = "1px";
        overImage.style.marginTop = "1px";

        underImage.parentNode.appendChild(overImage);
    },

    _fadeIn: function(image) {
        image.className += " invisible";
        setTimeout(function() {
            image.className = "ajax__slide_show_fadeIn";
        }, 20);
    },

    _fadeOut: function(image) {
        image.className += " visible";
        setTimeout(function() {
            image.className = "ajax__slide_show_fadeOut";
        }, 20);
    },

    /// <summary>
    /// Updates a slideshow current image
    /// </summary>
    /// <param name="value" type="Slide">Image to update</param>
    /// <member name="cM:AjaxControlToolkit.SlideShowExtender.updateImage" />
    updateImage: function(value) { 
        if(value) {
            if(this.raise_slideChanging(this._currentValue, value))
                return;

            if(this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.FadeInOut) {
                var fadeOutImage = this._elementImage.cloneNode(),
                    fadeInImage = this._elementImage;

                this._placeImageOver(fadeInImage, fadeOutImage);

                this.setImage(value);

                this._fadeIn(fadeInImage);
                this._fadeOut(fadeOutImage);

                setTimeout(function() {
                    fadeInImage.parentNode.removeChild(fadeOutImage);
                }, 1000);
            }
            else if(this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.ScaleX) {
                this._elementImage.className = "ajax__slide_show_Animation ajax__slide_show_scaleX";
                var me = this;
                setTimeout(function() {
                    me._elementImage.className = "ajax__slide_show_Animation";
                    me.setImage(value);
                }, 1000);
            }
            else if(this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.ScaleY) {
                this._elementImage.className = "ajax__slide_show_Animation ajax__slide_show_scaleY";
                var me = this;
                setTimeout(function() {
                    me._elementImage.className = "ajax__slide_show_Animation";
                    me.setImage(value);
                }, 1000);
            }
            else if(this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.ZoomInOut) {
                this._elementImage.className = "ajax__slide_show_Animation ajax__slide_show_zoomOut";
                var me = this;
                setTimeout(function() {
                    me._elementImage.className = "ajax__slide_show_Animation ajax__slide_show_zoomIn";
                    me.setImage(value);
                }, 1000);
            }
            else if(this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.Rotate) {
                this._elementImage.className = "ajax__slide_show_Animation ajax__slide_show_rotate";
                var me = this;
                setTimeout(function() {
                    me._elementImage.className = "ajax__slide_show_Animation";
                    me.setImage(value);
                }, 1000);
            }
            else {
                this.setImage(value);
            }
        }
    },

    /// <summary>
    /// Sets a slideshow image
    /// </summary>
    /// <param name="value" type="Slide">Image to set</param>
    /// <member name="cM:AjaxControlToolkit.SlideShowExtender.setImage" />
    setImage: function(value) {
        this._currentValue = value;

        this._elementImage.src = value.ImagePath;
        this._elementImage.alt = value.Name;

        if(this._imageDescriptionLabel)
            this._imageDescriptionLabel.innerHTML = value.Description || "";

        if(this._imageTitleLabel)
            this._imageTitleLabel.innerHTML = value.Name || "";

        if(value.Url) {
            this._elementImage.style.cursor = 'pointer';
            this._elementImage.onclick = function() { window.open(value.Url); }
        } else {
            this._elementImage.style.cursor = 'auto';
            this._elementImage.onclick = function() { }
        }

        this.raise_slideChanged(value);
        this.resetButtons();
    },

    /// <summary>
    /// ID of Label describing the current picture
    /// </summary>
    /// <getter>get_imageDescriptionLabelID</getter>
    /// <setter>set_imageDescriptionLabelID</setter>
    /// <member name="cP:AjaxControlToolkit.SlideShowExtender.imageDescriptionLabelID" />
    get_imageDescriptionLabelID: function() {
        return this._imageDescriptionLabelID;
    },
    set_imageDescriptionLabelID: function(value) {
        if(this._imageDescriptionLabelID != value) {
            this._imageDescriptionLabelID = value;
            this.raisePropertyChanged('imageDescriptionLabelID');
        }
    },

    /// <summary>
    /// ID of Label displaying the current picture's title
    /// </summary>
    /// <getter>get_imageTitleLabelID</getter>
    /// <setter>set_imageTitleLabelID</setter>
    /// <member name="cP:AjaxControlToolkit.SlideShowExtender.imageTitleLabelID" />
    get_imageTitleLabelID: function() {
        return this._imageTitleLabelID;
    },
    set_imageTitleLabelID: function(value) {
        if(this._imageTitleLabelID != value) {
            this._imageTitleLabelID = value;
            this.raisePropertyChanged('imageTitleLabelID');
        }
    },

    /// <summary>
    /// ID of the button that will allow you to see the next picture
    /// </summary>
    /// <getter>get_nextButtonID</getter>
    /// <setter>set_nextButtonID</setter>
    /// <member name="cP:AjaxControlToolkit.SlideShowExtender.nextButtonID" />
    get_nextButtonID: function() {
        return this._nextButtonID;
    },
    set_nextButtonID: function(value) {
        if(this._nextButtonID != value) {
            this._nextButtonID = value;
            this.raisePropertyChanged('nextButtonID');
        }
    },

    /// <summary>
    /// ID of the button that will allow you to play/stop the slideshow
    /// </summary>
    /// <getter>get_playButtonID</getter>
    /// <setter>set_playButtonID</setter>
    /// <member name="cP:AjaxControlToolkit.SlideShowExtender.playButtonID" />
    get_playButtonID: function() {
        return this._playButtonID;
    },
    set_playButtonID: function(value) {
        if(this._playButtonID != value) {
            this._playButtonID = value;
            this.raisePropertyChanged('playButtonID');
        }
    },

    /// <summary>
    /// The text to be shown in the play button to play the slideshow
    /// </summary>
    /// <getter>get_playButtonText</getter>
    /// <setter>set_playButtonText</setter>
    /// <member name="cP:AjaxControlToolkit.SlideShowExtender.playButtonText" />
    get_playButtonText: function() {
        return this._playButtonValue;
    },
    set_playButtonText: function(value) {
        if(this._playButtonValue != value) {
            this._playButtonValue = value;
            this.raisePropertyChanged('playButtonText');
        }
    },

    /// <summary>
    /// The text to be shown in the play button to stop the slideshow
    /// </summary>
    /// <getter>get_stopButtonText</getter>
    /// <setter>set_stopButtonText</setter>
    /// <member name="cP:AjaxControlToolkit.SlideShowExtender.stopButtonText" />
    get_stopButtonText: function() {
        return this._stopButtonValue;
    },
    set_stopButtonText: function(value) {
        if(this._stopButtonValue != value) {
            this._stopButtonValue = value;
            this.raisePropertyChanged('stopButtonText');
        }
    },

    /// <summary>
    /// An interval in milliseconds between slide transitions in play mode
    /// </summary>
    /// <getter>get_playInterval</getter>
    /// <setter>set_playInterval</setter>
    /// <member name="cP:AjaxControlToolkit.SlideShowExtender.playInterval" />
    get_playInterval: function() {
        // Interval in milliseconds between slide switches.
        return this._playInterval;
    },
    set_playInterval: function(value) {
        if(this._playInterval != value) {
            this._playInterval = value;
            this.raisePropertyChanged('playInterval');
        }
    },

    /// <summary>
    /// ID of the button that will allow you to see the previous picture
    /// </summary>
    /// <getter>get_previousButtonID</getter>
    /// <setter>set_previousButtonID</setter>
    /// <member name="cP:AjaxControlToolkit.SlideShowExtender.previousButtonID" />
    get_previousButtonID: function() {
        return this._previousButtonID;
    },
    set_previousButtonID: function(value) {
        if(this._previousButtonID != value) {
            this._previousButtonID = value;
            this.raisePropertyChanged('previousButtonID');
        }
    },

    /// <summary>
    /// The path to the webservice that the extender will pull the images from
    /// </summary>
    /// <getter>get_slideShowServicePath</getter>
    /// <setter>set_slideShowServicePath</setter>
    /// <member name="cP:AjaxControlToolkit.SlideShowExtender.slideShowServicePath" />
    get_slideShowServicePath: function() {
        return this._slideShowServicePath;
    },

    set_slideShowServicePath: function(value) {
        if(this._slideShowServicePath != value) {
            this._slideShowServicePath = value;
            this.raisePropertyChanged('slideShowServicePath');
        }
    },

    /// <summary>
    /// The webservice method that will be called to supply images
    /// </summary>
    /// <getter>get_slideShowServiceMethod</getter>
    /// <setter>set_slideShowServiceMethod</setter>
    /// <member name="cP:AjaxControlToolkit.SlideShowExtender.slideShowServiceMethod" />
    get_slideShowServiceMethod: function() {
        return this._slideShowServiceMethod;
    },
    set_slideShowServiceMethod: function(value) {
        if(this._slideShowServiceMethod != value) {
            this._slideShowServiceMethod = value;
            this.raisePropertyChanged('slideShowServiceMethod');
        }
    },

    /// <summary>
    /// Setting it to true will allow displaying pictures in cycle
    /// </summary>
    /// <getter>get_loop</getter>
    /// <setter>set_loop</setter>
    /// <member name="cP:AjaxControlToolkit.SlideShowExtender.loop" />
    get_loop: function() {
        return this._loop;
    },
    set_loop: function(value) {
        if(this._loop != value) {
            this._loop = value;
            this.raisePropertyChanged('loop');
        }
    },

    /// <summary>
    /// Setting it to true will play the slideshow automatically on render
    /// </summary>
    /// <getter>get_autoPlay</getter>
    /// <setter>set_autoPlay</setter>
    /// <member name="cP:AjaxControlToolkit.SlideShowExtender.autoPlay" />
    get_autoPlay: function() {
        return this._autoPlay;
    },
    set_autoPlay: function(value) {
        if(this._autoPlay != value) {
            this._autoPlay = value;
            this.raisePropertyChanged('autoPlay');
        }
    },

    /// <summary>
    /// Type of animation used on changing one slide to another
    /// </summary>
    /// <remarks>
    /// If you set SlideShowAnimationType to either SlideDown or SlideRight, then you must
    /// set both the Height and Width properties on the Image control being extended by
    /// the SlideShow extender
    /// </remarks>
    /// <getter>get_slideShowAnimationType</getter>
    /// <setter>set_slideShowAnimationType</setter>
    /// <member name="cP:AjaxControlToolkit.SlideShowExtender.slideShowAnimationType" />
    get_slideShowAnimationType: function() {
        return this._slideShowAnimationType;
    },
    set_slideShowAnimationType: function(value) {
        if(this._slideShowAnimationType != value) {
            this._slideShowAnimationType = value;
            this.raisePropertyChanged('slideShowAnimationType');
        }
    },

    _onClickNext: function(e) {
        // prevent server post-back for asp.net buttons.
        e.preventDefault();
        e.stopPropagation();
        this._clickNext();
    },

    _onImageLoaded: function(e) {
        this.updateImage(this._slides[this._currentIndex]);
        this.resetButtons();
        this._cacheImages();
    },

    _clickNext: function() {
        if(this._slides) {
            if((this._currentIndex + 1) < this._slides.length)
                ++this._currentIndex;
            else if(this._loop)
                this._currentIndex = 0;
            else
                return false;

            if(this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.SlideRight ||
                this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.SlideDown) {
                this._isNext = true;
                this.setCurrentSlide();
            }
            else {
                this.setCurrentImage();
            }
            return true;
        }
        return false;
    },

    _onClickPrevious: function(e) {
        // prevent server post-back for asp.net buttons.
        e.preventDefault();
        e.stopPropagation();
        this._clickPrevious();
    },

    _clickPrevious: function() {
        if(this._slides) {
            if((this._currentIndex - 1) >= 0)
                --this._currentIndex;
            else if(this._loop)
                this._currentIndex = this._slides.length - 1;
            else
                return false;

            if(this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.SlideRight ||
                this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.SlideDown) {
                this._isNext = false;
                this.setCurrentSlide();
            }
            else {
                this.setCurrentImage();
            }
            return true;
        }
        return false;
    },

    _onClickPlay: function(e) {
        // prevent server post-back for asp.net buttons.
        e.preventDefault();
        e.stopPropagation();
        this._play();
    },

    _play: function() {
        if(this._inPlayMode) {
            this._inPlayMode = false;
            this._timer.set_enabled(false);
            this.resetSlideShowButtonState();
            if(this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.SlideRight || this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.SlideDown) {
                if(this._bNext)
                    this._bNext.disabled = false;
                if(this._bPrevious)
                    this._bPrevious.disabled = false;
            }
        } else {
            // play the side show
            this._inPlayMode = true;
            if(!this._timer) {
                this._timer = new Sys.Timer();
                this._timer.set_interval(this._playInterval);
                this._tickHandler = Function.createDelegate(this, this._onPlay);
                this._timer.add_tick(this._tickHandler);
            }
            if(this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.SlideRight || this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.SlideDown) {
                if(this._bNext)
                    this._bNext.disabled = true;
                if(this._bPrevious)
                    this._bPrevious.disabled = true;
            }
            this.resetSlideShowButtonState();
            this._timer.set_enabled(true);
        }
    },

    _onPlay: function(e) {
        if(this._slides) {
            if((this._currentIndex + 1) < this._slides.length) {
                ++this._currentIndex;
                if(this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.SlideRight ||
                    this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.SlideDown) {
                    this._isNext = true;
                    this.setCurrentSlide();
                }
                else {
                    this.setCurrentImage();
                }
                return true;
            } else if(this._loop) {
                this._currentIndex = 0;
                if(this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.SlideRight ||
                    this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.SlideDown) {
                    this._isNext = true;
                    this.setCurrentSlide();
                }
                else {
                    this.setCurrentImage();
                }
                return true;
            } else {
                this._inPlayMode = false;
                this.resetSlideShowButtonState();
            }
        }
        return false;
    },

    _slideShowInit: function() {
        // Initializes the slideshow by invoking the webservice to retrieve the slides
        // and sets the first slide.

        // clear the state of the slideshow
        this._currentIndex = -1;
        this._cachedImageIndex = -1;
        this._inPlayMode = false;
        this._currentValue = null;
        // clear the cache
        this._images = null;
        // Create the service parameters and optionally add the context parameter
        // (thereby determining which method signature we're expecting...)
        var params = null;
        if(this._useContextKey)
            params = { contextKey: this._contextKey };

        Sys.Net.WebServiceProxy.invoke(
            this._slideShowServicePath,
            this._slideShowServiceMethod,
            false,
            params,
            Function.createDelegate(this, this._initSlides),
            null,
            null);
        },

    _initSlides: function(sender, eventArgs) {
        this._slides = sender;
        if(this._slides) {
            // create image containers if animation is of type LeftRight or UpDown.
            if(this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.SlideRight) {
                this._createElementsForSlideRight();
                this._setInitialState();
            }
            else if(this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.SlideDown) {
                this._createElementsForSlideDown();
                this._setInitialState();
            }
            else {
                this._images = new Array();
                this._clickNext();
            }
            if(this._autoPlay) {
                this._isNext = true;
                this._play();
            }
        }
    },

    _cacheImages: function() {
        // Caches 4 more slides periodically.

        // cache if current index is divisible by 3
        if((this._currentIndex) % 3 == 0) {
            var oldCachedImageIndex = this._cachedImageIndex;
            for(var i = this._cachedImageIndex + 1; i < this._slides.length; i++)
                if(this._slides[i]) {
                    this._images[i] = new Image();
                    this._images[i].src = this._slides[i].ImagePath;
                    this._cachedImageIndex = i;

                    if((oldCachedImageIndex + 4) <= i)
                        // cached 4 slides
                        break;
                }
        }
    },

    _createElementsForSlideRight: function() {
        var e = this.get_element();
        // create parent container
        var _divContainer = document.createElement('DIV');
        _divContainer.id = e.id + '_slider';
        _divContainer.className = 'ajax__slide_show_container';
        _divContainer.style.width = this._imageWidth + 'px';
        _divContainer.style.height = this._imageHeight + 'px';
        e.parentNode.insertBefore(_divContainer, e);
        e.parentNode.removeChild(e);
        _divContainer.appendChild(e);
        _divContainer.align = 'center';

        // create container for mask
        var _divMask = document.createElement('DIV');
        _divMask.id = e.id + '_mask';
        _divMask.style.width = this._imageWidth + 'px';
        _divContainer.appendChild(_divMask);

        // create array to keep all images
        this._images = new Array();
        for(var i = 0; i < this._slides.length; i++) {
            // create div to hold image
            var _divImage = document.createElement('DIV');
            _divImage.id = e.id + '_imageDiv' + i;
            _divImage.style.position = 'absolute';
            _divImage.style.top = '0px';
            _divImage.className = 'ajax__slide_show_slideAnimation';
            _divMask.appendChild(_divImage);

            // create hyperlink for image
            if(this._slides[i].Url != null) {
                var _imageLink = document.createElement('A');
                _imageLink.href = this._slides[i].Url;
                _imageLink.target = '_blank';
                _divImage.appendChild(_imageLink);
            }

            // create image element
            var _imageElement = document.createElement('IMG');
            _imageElement.style.width = this._imageWidth + 'px';
            _imageElement.style.height = this._imageHeight + 'px';
            _imageElement.src = this._slides[i].ImagePath;
            if(this._slides[i].Url != null)
                _imageLink.appendChild(_imageElement);
            else
                _divImage.appendChild(_imageElement);

            this._images[i] = _divImage;
        }
    },

    _createElementsForSlideDown: function() {
        var e = this.get_element();

        // create parent container
        var _divContainer = document.createElement('DIV');
        _divContainer.id = e.id + '_slider';
        _divContainer.className = 'ajax__slide_show_container';
        _divContainer.style.width = this._imageWidth + 'px';
        _divContainer.style.height = this._imageHeight + 'px';
        e.parentNode.insertBefore(_divContainer, e);
        e.parentNode.removeChild(e);
        _divContainer.appendChild(e);
        _divContainer.align = 'center';

        // create container for mask
        var _divMask = document.createElement('DIV');
        _divMask.style.width = this._imageWidth + 'px';
        _divContainer.appendChild(_divMask);

        var _ULContainer = document.createElement('UL');
        _ULContainer.style.className = 'ajax__slide_show_sliderUL';
        _divMask.appendChild(_ULContainer);

        // create array to keep all images
        this._images = new Array();
        for(var i = 0; i < this._slides.length; i++) {
            // create div to hold image
            var _LIImage = document.createElement('LI');
            _LIImage.id = e.id + '_imageDiv' + i;
            _LIImage.style.position = 'absolute';
            _LIImage.className = 'ajax__slide_show_slideAnimation';
            _ULContainer.appendChild(_LIImage);

            // create hyperlink for image
            if(this._slides[i].Url != null) {
                var _imageLink = document.createElement('A');
                _imageLink.href = this._slides[i].Url;
                _imageLink.target = '_blank';
                _LIImage.appendChild(_imageLink);
            }

            // create image element
            var _imageElement = document.createElement('IMG');
            _imageElement.style.width = this._imageWidth + 'px';
            _imageElement.style.height = this._imageHeight + 'px';
            _imageElement.src = this._slides[i].ImagePath;

            if(this._slides[i].Url != null)
                _imageLink.appendChild(_imageElement);
            else
                _LIImage.appendChild(_imageElement);

            this._images[i] = _LIImage;
        }
    },

    _setInitialState: function() {
        this._currentIndex++;
        this._currentImage = this._images[this._currentIndex];
        this._nextImage = this._images.length > 1 ? this._images[this._currentIndex + 1] : this._images[this._currentIndex];

        if(this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.SlideRight) {
            this._currentImage.style.left = '0px';
            for(var i = 1; i < this._images.length; i++)
                this._images[i].style.left = '-' + (this._imageWidth + 5) + 'px';
        }
        else {
            this._currentImage.style.top = '0px';
            for(var i = 0; i < this._images.length; i++)
                this._images[i].style.left = '0px';
        }

        this._previousImage = this._images[this._images.length - 1];

        this._currentImage.style.width = this._imageWidth + 'px';
        this._nextImage.style.width = this._imageWidth + 'px';
        this._previousImage.style.width = this._imageWidth + 'px';

        this._currentImage.style.height = this._imageHeight + 'px';
        this._nextImage.style.height = this._imageHeight + 'px';
        this._previousImage.style.height = this._imageHeight + 'px';

        if(this._imageDescriptionLabel)
            this._imageDescriptionLabel.innerHTML = this._slides[this._currentIndex].Description ? this._slides[this._currentIndex].Description : "";
        if(this._imageTitleLabel)
            this._imageTitleLabel.innerHTML = this._slides[this._currentIndex].Name ? this._slides[this._currentIndex].Name : "";
    },

    /// <summary>
    /// Maintains a slideshow current slide
    /// </summary>
    /// <member name="cM:AjaxControlToolkit.SlideShowExtender.setCurrentSlide" />
    setCurrentSlide: function() {
        if(this._isNext) {
            if(this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.SlideRight) {
                this._nextImage = this._images[this._currentIndex];
                this._elementImage.alt = this._nextImage.Name;

                this._nextImage.className = '';
                this._nextImage.style.left = '-' + (this._imageWidth + 5) + 'px';

                var me = this;
                setTimeout(function() {
                    me._nextImage.className = 'ajax__slide_show_slideAnimation';

                    if(me._imageDescriptionLabel)
                        me._imageDescriptionLabel.innerHTML = me._slides[me._currentIndex].Description ? me._slides[me._currentIndex].Description : "";
                    if(me._imageTitleLabel)
                        me._imageTitleLabel.innerHTML = me._slides[me._currentIndex].Name ? me._slides[me._currentIndex].Name : "";

                    me._currentImage.style.left = me._imageWidth + 'px';
                    me._nextImage.style.left = '0px';
                }, 200);

                setTimeout(function() {
                    me._previousImage = me._currentImage;
                    me._currentImage = me._nextImage;
                    me._previousImage.className = '';
                    me._previousImage.style.left = '-' + (me._imageWidth + 5) + 'px';
                    setTimeout(function() {
                        me._previousImage.className = 'ajax__slide_show_slideAnimation';
                        this._isNext = false;
                    }, 1000);
                }, 1200);
            }
            else if(this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.SlideDown) {
                this._nextImage = this._images[this._currentIndex];
                this._nextImage.className = '';
                this._nextImage.style.top = '-' + (this._imageHeight + 5) + 'px';

                var me = this;
                setTimeout(function() {
                    me._nextImage.className = 'ajax__slide_show_slideAnimation';
                    
                    if(me._imageDescriptionLabel)
                        me._imageDescriptionLabel.innerHTML = me._slides[me._currentIndex].Description ? me._slides[me._currentIndex].Description : "";
                    if(me._imageTitleLabel)
                        me._imageTitleLabel.innerHTML = me._slides[me._currentIndex].Name ? me._slides[me._currentIndex].Name : "";

                    me._currentImage.style.top = me._imageHeight + 'px';
                    me._nextImage.style.top = '0px';
                }, 200);

                setTimeout(function() {
                    me._previousImage = me._currentImage;
                    me._currentImage = me._nextImage;
                    me._previousImage.className = '';
                    me._previousImage.style.top = '-' + (me._imageHeight + 5) + 'px';
                    setTimeout(function() {
                        me._previousImage.className = 'ajax__slide_show_slideAnimation';
                        this._isNext = false;
                    }, 1000);
                }, 1200);
            }
        }
        else {
            if(this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.SlideRight) {
                this._previousImage = this._images[this._currentIndex];
                this._previousImage.className = '';
                this._previousImage.style.left = (this._imageWidth + 5) + 'px';

                var me = this;
                setTimeout(function() {
                    me._previousImage.className = 'ajax__slide_show_slideAnimation';

                    if(me._imageDescriptionLabel)
                        me._imageDescriptionLabel.innerHTML = me._slides[me._currentIndex].Description ? me._slides[me._currentIndex].Description : "";
                    if(me._imageTitleLabel)
                        me._imageTitleLabel.innerHTML = me._slides[me._currentIndex].Name ? me._slides[me._currentIndex].Name : "";

                    me._currentImage.style.left = '-' + (me._imageWidth + 5) + 'px';
                    me._previousImage.style.left = '0px';
                }, 200);

                setTimeout(function() {
                    me._nextImage = me._currentImage;
                    me._currentImage = me._previousImage;
                    me._nextImage.className = '';
                    me._nextImage.style.left = (me._imageWidth + 5) + 'px';
                    setTimeout(function() {
                        me._nextImage.className = 'ajax__slide_show_slideAnimation';
                        this._isNext = false;
                    }, 1000);
                }, 1200);
            }
            else if(this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.SlideDown) {
                this._previousImage = this._images[this._currentIndex];
                this._previousImage.className = '';
                this._previousImage.style.top = (this._imageHeight + 5) + 'px';

                var me = this;
                setTimeout(function() {
                    me._previousImage.className = 'ajax__slide_show_slideAnimation';

                    if(me._imageDescriptionLabel)
                        me._imageDescriptionLabel.innerHTML = me._slides[me._currentIndex].Description ? me._slides[me._currentIndex].Description : "";
                    if(me._imageTitleLabel)
                        me._imageTitleLabel.innerHTML = me._slides[me._currentIndex].Name ? me._slides[me._currentIndex].Name : "";

                    me._currentImage.style.top = '-' + (me._imageHeight + 5) + 'px';
                    me._previousImage.style.top = '0px';
                }, 200);

                setTimeout(function() {
                    me._nextImage = me._currentImage;
                    me._currentImage = me._previousImage;
                    me._nextImage.className = '';
                    me._nextImage.style.top = (me._imageHeight + 5) + 'px';
                    setTimeout(function() {
                        me._nextImage.className = 'ajax__slide_show_slideAnimation';
                        this._isNext = false;
                    }, 1000);
                }, 1200);
            }
        }
    },

    /// <summary>
    /// Whether a slideshow supports a given animation name
    /// </summary>
    /// <param name="animationName" type="String">Name of the animation</param>
    /// <returns type="Boolean">Boolean value indicates that given animation name is supported</returns>
    /// <member name="cM:AjaxControlToolkit.SlideShowExtender.supportsAnimation" />
    supportsAnimation: function(animationName) {
        var isSupport = false,
        domPrefixes = 'Webkit Moz ms O'.split(' '),
        elm = document.createElement('div'),
        animationNameCapital = null;

        animationName = animationName.toLowerCase();

        if(elm.style[animationName])
            isSupport = true;

        if(isSupport === false) {
            animationNameCapital = animationName.charAt(0).toUpperCase() + animationName.substr(1);
            for(var i = 0; i < domPrefixes.length; i++)
                if(elm.style[domPrefixes[i] + animationNameCapital] !== undefined) {
                    isSupport = true;
                    break;
                }
        }
        return isSupport;
    }

}
Sys.Extended.UI.SlideShowBehavior.registerClass('Sys.Extended.UI.SlideShowBehavior', Sys.Extended.UI.BehaviorBase);

Sys.Extended.UI.SlideShowEventArgs = function(previousSlide, nextSlide, slideIndex) {    
    Sys.Extended.UI.SlideShowEventArgs.initializeBase(this);

    this._previousSlide = previousSlide;
    this._nextSlide = nextSlide;
    this._slideIndex = slideIndex;
}
Sys.Extended.UI.SlideShowEventArgs.prototype = {
    get_previousSlide: function() {
        return this._previousSlide;
    },

    get_nextSlide: function() {
        return this._nextSlide;
    },

    get_slideIndex: function() {
        return this._slideIndex;
    }
}
Sys.Extended.UI.SlideShowEventArgs.registerClass('Sys.Extended.UI.SlideShowEventArgs', Sys.CancelEventArgs);

Sys.Extended.UI.SlideShowAnimationType = function() {    
    throw Error.invalidOperation();
}
Sys.Extended.UI.SlideShowAnimationType.prototype = {
    None: 0,
    FadeInOut: 1,
    ScaleX: 2,
    ScaleY: 3,
    ZoomInOut: 4,
    Rotate: 5,
    SlideRight: 6,
    SlideDown: 7
}

Sys.Extended.UI.SlideShowAnimationType.registerEnum("Sys.Extended.UI.SlideShowAnimationType", false);