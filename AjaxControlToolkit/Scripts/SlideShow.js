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
        // Create handlers for slide show buttons clicks events and for image loaded events.
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

        // init slide show
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

    add_slideChanged: function(handler) {
        this.get_events().addHandler('slideChanged', handler);
    },
    remove_slideChanged: function(handler) {
        this.get_events().removeHandler('slideChanged', handler);
    },
    raiseSlideChanged: function(eventArgs) {
        var handler = this.get_events().getHandler('slideChanged');
        if(handler) {
            if(!eventArgs)
                eventArgs = Sys.EventArgs.Empty;
            handler(this, eventArgs);
        }
    },

    add_slideChanging: function(handler) {
        this.get_events().addHandler('slideChanging', handler);
    },
    remove_slideChanging: function(handler) {
        this.get_events().removeHandler('slideChanging', handler);
    },
    raiseSlideChanging: function(previousSlide, newSlide) {
        var handler = this.get_events().getHandler('slideChanging');
        if(handler) {
            var eventArgs = new Sys.Extended.UI.SlideShowEventArgs(previousSlide, newSlide, this._currentIndex);
            handler(this, eventArgs);
            return eventArgs.get_cancel();
        }
        return false;
    },

    get_contextKey: function() {
        // User/page specific context provided to an optional overload of the
        // web method described by ServiceMethod/ServicePath.  If the context
        // key is used, it should have the same signature with an additional
        // parameter named contextKey of type string.
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

    get_useContextKey: function() {
        // Whether or not the ContextKey property should be used.  This will be
        // automatically enabled if the ContextKey property is ever set
        // (on either the client or the server).  If the context key is used,
        // it should have the same signature with an additional parameter
        // named contextKey of type string.
        return this._useContextKey;
    },
    set_useContextKey: function(value) {
        if(this._useContextKey != value) {
            this._useContextKey = value;
            this.raisePropertyChanged('useContextKey');
        }
    },

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

    controlsSetup: function() {
        // Get handles to various slide show controls if specified.
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

    resetButtons: function() {
        // Maintain the various buttons states.

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

    resetSlideShowButtonState: function() {
        // Maintain the play button state to reflect whether the slide show is in play mode.

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

    updateImage: function(value) {        
        if(value) {
            if(this.raiseSlideChanging(this._currentValue, value))
                return;
            if(this._slideShowAnimationType == Sys.Extended.UI.SlideShowAnimationType.FadeInOut) {
                this._elementImage.className = "ajax__slide_show_fadeIn";
                var me = this;
                setTimeout(function() {
                    me._elementImage.className = "ajax__slide_show_fadeOut";
                    me.setImage(value);
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

    setImage: function(value) {
        this._currentValue = value;
        this._elementImage.src = value.ImagePath;
        this._elementImage.alt = value.Name;

        if(this._imageDescriptionLabel)
            this._imageDescriptionLabel.innerHTML = value.Description ? value.Description : "";
        if(this._imageTitleLabel)
            this._imageTitleLabel.innerHTML = value.Name ? value.Name : "";

        if(value.Url != null) {
            this._elementImage.style.cursor = 'pointer';
            this._elementImage.onclick = function() { window.open(value.Url); }
        }
        else {
            this._elementImage.style.cursor = 'auto';
            this._elementImage.onclick = function() { }
        }

        this.raiseSlideChanged(value);
        this.resetButtons();
    },

    get_imageDescriptionLabelID: function() {        
        return this._imageDescriptionLabelID;
    },
    set_imageDescriptionLabelID: function(value) {
        if(this._imageDescriptionLabelID != value) {
            this._imageDescriptionLabelID = value;
            this.raisePropertyChanged('imageDescriptionLabelID');
        }
    },

    get_imageTitleLabelID: function() {        
        return this._imageTitleLabelID;
    },
    set_imageTitleLabelID: function(value) {
        if(this._imageTitleLabelID != value) {
            this._imageTitleLabelID = value;
            this.raisePropertyChanged('imageTitleLabelID');
        }
    },

    get_nextButtonID: function() {        
        return this._nextButtonID;
    },
    set_nextButtonID: function(value) {
        if(this._nextButtonID != value) {
            this._nextButtonID = value;
            this.raisePropertyChanged('nextButtonID');
        }
    },

    get_playButtonID: function() {        
        return this._playButtonID;
    },
    set_playButtonID: function(value) {
        if(this._playButtonID != value) {
            this._playButtonID = value;
            this.raisePropertyChanged('playButtonID');
        }
    },

    get_playButtonText: function() {        
        return this._playButtonValue;
    },
    set_playButtonText: function(value) {
        if(this._playButtonValue != value) {
            this._playButtonValue = value;
            this.raisePropertyChanged('playButtonText');
        }
    },

    get_stopButtonText: function() {        
        return this._stopButtonValue;
    },
    set_stopButtonText: function(value) {
        if(this._stopButtonValue != value) {
            this._stopButtonValue = value;
            this.raisePropertyChanged('stopButtonText');
        }
    },

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

    get_previousButtonID: function() {
        return this._previousButtonID;
    },
    set_previousButtonID: function(value) {
        if(this._previousButtonID != value) {
            this._previousButtonID = value;
            this.raisePropertyChanged('previousButtonID');
        }
    },

    get_slideShowServicePath: function() {
        return this._slideShowServicePath;
    },

    set_slideShowServicePath: function(value) {
        if(this._slideShowServicePath != value) {
            this._slideShowServicePath = value;
            this.raisePropertyChanged('slideShowServicePath');
        }
    },

    get_slideShowServiceMethod: function() {
        return this._slideShowServiceMethod;
    },
    set_slideShowServiceMethod: function(value) {
        if(this._slideShowServiceMethod != value) {
            this._slideShowServiceMethod = value;
            this.raisePropertyChanged('slideShowServiceMethod');
        }
    },

    get_loop: function() {
        return this._loop;
    },
    set_loop: function(value) {
        if(this._loop != value) {
            this._loop = value;
            this.raisePropertyChanged('loop');
        }
    },

    get_autoPlay: function() {
        return this._autoPlay;
    },
    set_autoPlay: function(value) {
        if(this._autoPlay != value) {
            this._autoPlay = value;
            this.raisePropertyChanged('autoPlay');
        }
    },

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
        // Initializes the slide show by invoking the webservice to retrieve the slides
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