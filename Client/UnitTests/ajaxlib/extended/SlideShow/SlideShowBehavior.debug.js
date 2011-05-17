// (c) 2010 CodePlex Foundation



/// <reference name="MicrosoftAjax.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />
/// <reference path="../Compat/Timer/Timer.js" />

(function() {
var scriptName = "ExtendedSlideShow";

function execute() {

Type.registerNamespace('Sys.Extended.UI');
Sys.Extended.UI.SlideShowBehavior = function(element) {
        /// <summary>
        /// creates a new slide show behavior
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" DomElement="true" mayBeNull="false" />
        /// <returns />
        Sys.Extended.UI.SlideShowBehavior.initializeBase(this, [element]);
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

        this._clickNextHandler = null;
        this._clickPreviousHandler = null;
        this._clickPlayHandler = null;
        this._tickHandler = null;
        this._imageLoadedHandler = null;

}
Sys.Extended.UI.SlideShowBehavior.prototype = { 
    initialize : function() {
        ///<summary>
        /// Initialize the slide show.
        /// </summary>
        /// <returns />      
        
        Sys.Extended.UI.SlideShowBehavior.callBaseMethod(this, 'initialize');
        var e = this.get_element();
        this._elementImage = e;
        
        this._currentImageElement = document.createElement('IMG');
        this._currentImageElement.style.display = 'none';
        document.body.appendChild(this._currentImageElement);
        
        var _divContent = document.createElement('DIV');
        e.parentNode.insertBefore(_divContent, e);
        e.parentNode.removeChild(e);
        _divContent.appendChild(e);
        _divContent.align = 'center';    
        
        this.controlsSetup();
        if (this._bNext) {
            this._clickNextHandler = Function.createDelegate(this, this._onClickNext);
            $addHandler(this._bNext, 'click', this._clickNextHandler);
        }
        if (this._bPrevious) {
            this._clickPreviousHandler = Function.createDelegate(this, this._onClickPrevious);
            $addHandler(this._bPrevious, 'click', this._clickPreviousHandler);
        } 
        if (this._bPlay) {
            this._clickPlayHandler = Function.createDelegate(this, this._onClickPlay);
            $addHandler(this._bPlay, 'click', this._clickPlayHandler);
        } 
        
        this._imageLoadedHandler = Function.createDelegate(this, this._onImageLoaded);
        $addHandler(this._currentImageElement, 'load', this._imageLoadedHandler);
                
        this._slideShowInit();
    },
    
    dispose : function() {
        ///<summary>
        /// Dispose the handlers and perform other slide show cleanup.
        /// </summary>
        /// <returns />      
        
        if (this._clickNextHandler) {
            $removeHandler(this._bNext, 'click', this._clickNextHandler);
            this._clickNextHandler = null;
        }
        if (this._clickPreviousHandler) {
            $removeHandler(this._bPrevious, 'click', this._clickPreviousHandler);
            this._clickPreviousHandler = null;
        }
        if (this._clickPlayHandler) {
            $removeHandler(this._bPlay, 'click', this._clickPlayHandler);
            this._clickPlayHandler = null;
        }     
        if (this._imageLoadedHandler) {
            $removeHandler(this._currentImageElement, 'load', this._imageLoadedHandler);
            this._imageLoadedHandler = null;
        }
        if (this._timer) {
            this._timer.dispose();
            this._timer = null;
        }
        Sys.Extended.UI.SlideShowBehavior.callBaseMethod(this, 'dispose');
    },
        
    add_slideChanged : function(handler) {
        ///<summary>
        /// Add handler for the <code>slideChanged</code> Event.
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false" />   
        /// <returns />       
        this.get_events().addHandler('slideChanged', handler);
    },
    remove_slideChanged : function(handler) {
        ///<summary>
        /// Remove handler for the <code>slideChanged</code> Event.
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false"/>   
        /// <returns />     
        this.get_events().removeHandler('slideChanged', handler);
    },
    raiseSlideChanged : function(eventArgs) {
        ///<summary>
        /// Raise the <code>slideChanged</code> Event.
        /// </summary>
        /// <param name="eventArgs" type="Sys.EventArgs" mayBeNull="true"/>   
        /// <returns />      
        var handler = this.get_events().getHandler('slideChanged');
        if (handler) {
            if (!eventArgs) {
                eventArgs = Sys.EventArgs.Empty;
            }
            handler(this, eventArgs);
        }
    },
    
    add_slideChanging : function(handler) {
        ///<summary>
        /// Add handler for the <code>slideChanging</code> Event.
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false" />   
        /// <returns />      
        this.get_events().addHandler('slideChanging', handler);
    },
    remove_slideChanging : function(handler) {
        ///<summary>
        /// Remove handler for the <code>slideChanging</code> Event.
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false"/>   
        /// <returns />       
        this.get_events().removeHandler('slideChanging', handler);
    },
    raiseSlideChanging : function(previousSlide, newSlide) {
        ///<summary>
        /// Raise the <code>slideChanging</code> Event.
        /// </summary>
        /// <param name="previousSlide" type="Object" mayBeNull="true"/>   
        /// <param name="nextSlide" type="Object" mayBeNull="true"/>           
        /// <returns type="Boolean" />       
        var handler = this.get_events().getHandler('slideChanging');
        if (handler) {
            var eventArgs = new Sys.Extended.UI.SlideShowEventArgs(previousSlide, newSlide, this._currentIndex);
            handler(this, eventArgs);
            return eventArgs.get_cancel();
        }
        return false;
    },
    
    get_contextKey : function() {
        /// <value type="String" mayBeNull="true">
        /// User/page specific context provided to an optional overload of the
        /// web method described by ServiceMethod/ServicePath.  If the context
        /// key is used, it should have the same signature with an additional
        /// parameter named contextKey of type string.
        /// </value>
        return this._contextKey;
    },
    set_contextKey : function(value) {
        if (this._contextKey != value) {
            this._contextKey = value;
            this.set_useContextKey(true);
            if(this._elementImage) {
                this._slideShowInit();
            }
            this.raisePropertyChanged('contextKey');
        }
    },
    
    get_useContextKey : function() {
        /// <value type="Boolean">
        /// Whether or not the ContextKey property should be used.  This will be
        /// automatically enabled if the ContextKey property is ever set
        /// (on either the client or the server).  If the context key is used,
        /// it should have the same signature with an additional parameter
        /// named contextKey of type string.
        /// </value>
        return this._useContextKey;
    },
    set_useContextKey : function(value) {
        if (this._useContextKey != value) {
            this._useContextKey = value;
            this.raisePropertyChanged('useContextKey');
        }
    },
    
   
    controlsSetup : function() {
        /// <summary>
        /// Get handles to various slide show controls if specified.
        /// </summary>      
        /// <returns />
        if (this._previousButtonID) {
            this._bPrevious = document.getElementById(this._previousButtonID);
        }
        if (this._imageDescriptionLabelID) {
           this._imageDescriptionLabel = document.getElementById(this._imageDescriptionLabelID);
        }
        if (this._imageTitleLabelID) {
           this._imageTitleLabel = document.getElementById(this._imageTitleLabelID);
        }
        if (this._nextButtonID) {
            this._bNext = document.getElementById(this._nextButtonID);
        }
        if (this._playButtonID) {
            this._bPlay = document.getElementById(this._playButtonID);
            this._bPlay.value = this._playButtonValue;
        }
    },

    resetButtons : function() {
        /// <summary>
        /// Maintain the various buttons states.
        /// </summary>    
        /// <returns />  
                   
        if (!this._loop) {
            if (this._slides.length <= this._currentIndex + 1 ) {
                if (this._bNext) this._bNext.disabled = true;
                if (this._bPlay) this._bPlay.disabled = true;
                if (this._bPrevious) this._bPrevious.disabled = false;    
                this._inPlayMode = false;
                if (this._timer) {
                    this._timer.set_enabled(false);
                }
                if (this._bPlay) this._bPlay.value = this._playButtonValue; 
                                
            } else {
                if (this._bNext) this._bNext.disabled = false;
                if (this._bPlay) this._bPlay.disabled = false;            
            }
            if (this._currentIndex <= 0) {
                if (this._bPrevious) this._bPrevious.disabled = true;
            } else {
                if (this._bPrevious) this._bPrevious.disabled = false;
            }
        }
        else {
            if (this._slides.length == 0) {
                if (this._bPrevious) this._bPrevious.disabled = true;
                if (this._bNext) this._bNext.disabled = true;
                if (this._bPlay) this._bPlay.disabled = true;
            }
        } 
        if (this._inPlayMode) {
            this._timer.set_enabled(false);
            this._timer.set_enabled(true);            
        }
    },
    
    resetSlideShowButtonState : function() {
        /// <summary>
        /// Maintain the play button state to reflect whether the slide show is in play mode.
        /// </summary>       
        /// <returns />      
            
        if (this._inPlayMode) {
            if (this._bPlay) this._bPlay.value = this._stopButtonValue;
        }
        else {
            this.resetButtons();
            if (this._bPlay) this._bPlay.value = this._playButtonValue;
        }
    },
    
    setCurrentImage : function() {
        /// <summary>
        /// Retrieve the current image.
        /// </summary>  
        /// <returns />    
        if (this._slides[this._currentIndex]) {
            this._currentImageElement.src = this._slides[this._currentIndex].ImagePath;
        } else {
            this._currentImageElement.src = '';
        }
        if(Sys.Browser.agent == Sys.Browser.Opera) {   
            this._onImageLoaded(true);
        }
    },
        
    updateImage : function(value) {
        /// <summary>
        /// Set current image to be the specified Slide.
        /// </summary>  
        /// <param name="value" type="Object" mayBeNull="false" />
        /// <returns />
             
        if (value) {
            if (this.raiseSlideChanging(this._currentValue, value)) {
                return;
            }
            this._currentValue = value;
            this._elementImage.src = value.ImagePath;
            this._elementImage.alt = value.Name;
            
            if (this._imageDescriptionLabel) {
                this._imageDescriptionLabel.innerHTML = value.Description ? value.Description : "";
            }
            if (this._imageTitleLabel) {
                this._imageTitleLabel.innerHTML = value.Name ? value.Name : "";
            }
            this.raiseSlideChanged(value);
            this.resetButtons();
        }
    },
    
    get_imageDescriptionLabelID : function() {
        /// <value type="String" mayBeNull="true">    
        /// ID of the label that describes the current slide.
        /// </value>
        return this._imageDescriptionLabelID;
    },    
    set_imageDescriptionLabelID : function(value) {
        if (this._imageDescriptionLabelID != value) {
            this._imageDescriptionLabelID = value;
            this.raisePropertyChanged('imageDescriptionLabelID');
        }
    },
    
    get_imageTitleLabelID : function() {
        /// <value type="String" mayBeNull="true">    
        /// ID of the label that shows the title of the current slide.
        /// </value>
        return this._imageTitleLabelID;
    },
    set_imageTitleLabelID : function(value) {
        if (this._imageTitleLabelID != value) {
            this._imageTitleLabelID = value;
            this.raisePropertyChanged('imageTitleLabelID');
        }
    },
    
    get_nextButtonID : function() {
        /// <value type="String" mayBeNull="true">    
        /// ID on the next button.
        /// </value>        
        return this._nextButtonID;
    },
    set_nextButtonID : function(value) {
        if (this._nextButtonID != value) {
            this._nextButtonID = value;
            this.raisePropertyChanged('nextButtonID');
        }
    },
     
    get_playButtonID : function() {
        /// <value type="String" mayBeNull="true">    
        /// ID on the play button.    
        /// </value>        
        return this._playButtonID;
    },
    set_playButtonID : function(value) {
        if (this._playButtonID != value) {
            this._playButtonID = value;
            this.raisePropertyChanged('playButtonID');
        }
    },
       
    get_playButtonText : function() {
        /// <value type="String" mayBeNull="true">    
        /// Text in play button to play the slide show when it is not playing.    
        /// </value>        
        return this._playButtonValue;
    },
    set_playButtonText : function(value) {
        if (this._playButtonValue != value) {
            this._playButtonValue = value;
            this.raisePropertyChanged('playButtonText');
        }
    },    

    get_stopButtonText : function() {
        /// <value type="String" mayBeNull="true">    
        /// Text in play button to stop the slide show when it is playing.
        /// </value>        
        return this._stopButtonValue;
    },
    set_stopButtonText : function(value) {
        if (this._stopButtonValue != value) {
            this._stopButtonValue = value;
            this.raisePropertyChanged('stopButtonText');
        }
    },

    get_playInterval : function() {
        /// <value type="Number" integer="true" mayBeNull="true">    
        /// Interval in milliseconds between slide switches.
        /// </value>        
        return this._playInterval;
    },
    set_playInterval : function(value) {
        if (this._playInterval != value) {
            this._playInterval = value;
            this.raisePropertyChanged('playInterval');
        }
    },
    
    get_previousButtonID : function() {
        /// <value type="String" mayBeNull="true">
        /// ID of the previous button.
        /// </value>
        return this._previousButtonID;
    },
    set_previousButtonID : function(value) {
        if (this._previousButtonID != value) {
            this._previousButtonID = value;
            this.raisePropertyChanged('previousButtonID');
        }
    },
    
    get_slideShowServicePath : function() {
        /// <value type="String" mayBeNull="true">
        /// Slide show webservice path to pull the images.
        /// </value>        
        return this._slideShowServicePath;
    },
    
    set_slideShowServicePath : function(value) {
        if (this._slideShowServicePath != value) {
            this._slideShowServicePath = value;
            this.raisePropertyChanged('slideShowServicePath');
        }
    },
    
    get_slideShowServiceMethod : function() {
        /// <value type="String" mayBeNull="false">
        /// Slide show webservice methods that will return the slide images.
        /// </value>        
        return this._slideShowServiceMethod;
    },
    set_slideShowServiceMethod : function(value) {
        if (this._slideShowServiceMethod != value) {
            this._slideShowServiceMethod = value;
            this.raisePropertyChanged('slideShowServiceMethod');
        }
    },

    get_loop : function() {
        /// <value type="Boolean" mayBeNull="true">
        /// boolean to detect if slideshow should wrap around on hitting the first/last slides.
        /// </value>
        return this._loop;
    },
    set_loop : function(value) {
        if (this._loop != value) {
            this._loop = value;
            this.raisePropertyChanged('loop');
        }
    },
    
    get_autoPlay : function() {
        /// <value type="Boolean" mayBeNull="true">
        /// boolean to detect if slide show should start playing on render.
        /// </value>
        return this._autoPlay;
    },
    set_autoPlay : function(value) {
        if (this._autoPlay != value) {
            this._autoPlay = value;
            this.raisePropertyChanged('autoPlay');
        }
    },
    
    _onClickNext : function(e) {
        /// <summary>
        /// Next button click handler.
        /// </summary>      
        /// <param name="e" type="Sys.UI.DomEvent" mayBeNull="false" />   
        /// <returns />  
               
        e.preventDefault();
        e.stopPropagation();        
        this._clickNext();
    }, 
    
    _onImageLoaded : function(e) {
        /// <summary>
        /// Image loaded handler.
        /// </summary>
        /// <param name="e" type="Sys.UI.DomEvent" mayBeNull="false"/>   
        /// <returns />      
        this.updateImage(this._slides[this._currentIndex]);
        this.resetButtons();        
        this._cacheImages();
    },
    
    _clickNext : function() {
        /// <summary>
        /// Switches slide show to displaying the next slide.
        /// </summary>  
        /// <returns />  
                  
        if (this._slides) {
            if ((this._currentIndex + 1) < this._slides.length) {
                ++this._currentIndex;
            } else if (this._loop) {
                this._currentIndex = 0;
            } else {
                return false;
            }
            this.setCurrentImage();
            return true;
        }
        return false;    
    },
        
    _onClickPrevious : function(e) {
        /// <summary>
        /// Previous button click handler.
        /// </summary>
        /// <param name="e" type="Sys.UI.DomEvent" mayBeNull="false"/>   
        /// <returns />  
        
        e.preventDefault();
        e.stopPropagation();        
        this._clickPrevious();

    }, 
    
    _clickPrevious : function() {
        /// <summary>
        /// Switches slide show to displaying the previous slide.
        /// </summary>    
        /// <returns />          
        
        if (this._slides) {
            if ((this._currentIndex - 1) >= 0) {
                --this._currentIndex;
            }
            else if (this._loop) {
                this._currentIndex = this._slides.length - 1;
            } else {
                return false;
            }
            this.setCurrentImage();
            return true;
        }
        return false;
    },

    _onClickPlay : function(e) {
        /// <summary>
        /// Play button click handler.
        /// </summary>
        /// <param name="e" type="Sys.UI.DomEvent" mayBeNull="false"/>   
        /// <returns />
                
        e.preventDefault();
        e.stopPropagation();
        this._play();
    }, 
    
    _play : function() {
        /// <summary>
        /// Maintains timer state/slide show buttons state and creates handler to switch images in play mode
        /// if not already in play mode.
        /// </summary>   
        /// <returns />
        if (this._inPlayMode) {
            this._inPlayMode = false;
            this._timer.set_enabled(false);
            this.resetSlideShowButtonState();
        } else {
            this._inPlayMode = true;
            if (!this._timer) {
                this._timer = new Sys.Timer();
                this._timer.set_interval(this._playInterval);
                this._tickHandler = Function.createDelegate(this, this._onPlay);
                this._timer.add_tick(this._tickHandler);
            }
            this.resetSlideShowButtonState();
            this._timer.set_enabled(true);
        }
    },
    
    _onPlay : function(e) {
        /// <summary>
        /// Sets the slide show to the current image in play mode and maintains button state.
        /// </summary>   
        /// <param name="e" type="Sys.UI.DomEvent" mayBeNull="false"/>
        /// <returns type="Boolean" />
        if (this._slides) {
            if ((this._currentIndex + 1) < this._slides.length) {
                ++this._currentIndex;
                this.setCurrentImage();
                return true;
            } else if (this._loop) {
                this._currentIndex = 0;
                this.setCurrentImage();
                return true;
            } else {
                this._inPlayMode = false;
                this.resetSlideShowButtonState();
            }
        }
        return false;
    },
    
    _slideShowInit : function() {
        /// <summary>
        /// Initializes the slide show by invoking the webservice to retrieve the slides
        /// and sets the first slide.
        /// </summary>
        /// <returns />
        this._currentIndex = -1;
        this._cachedImageIndex = -1;
        this._inPlayMode = false;
        this._currentValue = null;
        this._images = null;
        var params = null;
        if (this._useContextKey) {
            params = { contextKey : this._contextKey };
        }
        
        Sys.Net.WebServiceProxy.invoke(
                this._slideShowServicePath, 
                this._slideShowServiceMethod, 
                false,
                params,
                Function.createDelegate(this, this._initSlides), 
                null, 
                null);
    },
    
    _initSlides : function(sender, eventArgs) {
        /// <summary>
        /// Initializes the slide show with the first image and configures the specified play settings.
        /// </summary>
        /// <param name="sender" type="Object" mayBeNull="true"/>
        /// <param name="eventArgs" type="Sys.EventArgs" mayBeNull="true" />
        /// <returns />

        this._slides = sender;
        if (this._slides) {
            this._images = new Array();
            this._clickNext();  
            if (this._autoPlay) {
                this._play();
            }
        }
    },
   
    _cacheImages : function() {
        /// <summary>
        /// Caches 4 more slides periodically.
        /// </summary>
        /// <returns />
        
        if ((this._currentIndex) % 3 == 0) {
            var oldCachedImageIndex = this._cachedImageIndex;
            for (var i = this._cachedImageIndex + 1; i < this._slides.length; i++) {
                if (this._slides[i]) {
                    this._images[i] = new Image();
                    this._images[i].src = this._slides[i].ImagePath;
                    this._cachedImageIndex = i;
                    if((oldCachedImageIndex + 4) <= i ) {
                        break;
                    }
                }
            }
        }
    }
    
}
Sys.Extended.UI.SlideShowBehavior.registerClass('Sys.Extended.UI.SlideShowBehavior', Sys.Extended.UI.BehaviorBase);
Sys.registerComponent(Sys.Extended.UI.SlideShowBehavior, { name: "slideShow" });
 
Sys.Extended.UI.SlideShowEventArgs = function(previousSlide, nextSlide, slideIndex) {
    /// <summary>
    /// Event arguments for the SlideShowBehavior's slideChanging event
    /// </summary>
    /// <param name="previousSlide" type="Object" mayBeNull="true" />
    /// <param name="nextSlide" type="Object" mayBeNull="true" />
    /// <param name="slideIndex" type="Integer" mayBeNull="true" />
    /// <returns />
    Sys.Extended.UI.SlideShowEventArgs.initializeBase(this);

    this._previousSlide = previousSlide;
    this._nextSlide = nextSlide;
    this._slideIndex = slideIndex;
}
Sys.Extended.UI.SlideShowEventArgs.prototype = {
    get_previousSlide : function() {
        /// <value type="Object">
        /// PreviousSlide
        /// </value>
        return this._previousSlide;
    },

    get_nextSlide : function() {
        /// <value type="Object">
        /// NextSlide
        /// </value>
        return this._nextSlide;
    },

    get_slideIndex : function () {
        /// <value type="Number" integer="true">    
        /// SlideIndex
        /// </value>
        return this._slideIndex;
    }
}
Sys.Extended.UI.SlideShowEventArgs.registerClass('Sys.Extended.UI.SlideShowEventArgs', Sys.CancelEventArgs);

} // execute

if (window.Sys && Sys.loader) {
    Sys.loader.registerScript(scriptName, ["ExtendedBase", "ExtendedCommon", "ExtendedTimer", "Network"], execute);
}
else {
    execute();
}

})();
