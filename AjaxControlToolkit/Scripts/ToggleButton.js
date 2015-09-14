Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.ToggleButtonBehavior = function(element) {
    // The ToggleButtonBehavior is used to replace a checkbox with a pair of images
    Sys.Extended.UI.ToggleButtonBehavior.initializeBase(this, [element]);

    // "Constants"
    this._idDecoration = '_ToggleButton';

    // Properties
    this._imageWidth = null;
    this._imageHeight = null;
    this._uncheckedImageUrl = null;
    this._checkedImageUrl = null;
    this._disabledUncheckedImageUrl = null;
    this._disabledCheckedImageUrl = null;
    this._checkedImageOverUrl = null;
    this._uncheckedImageOverUrl = null;
    this._uncheckedImageAlternateText = null;
    this._checkedImageAlternateText = null;
    this._checkedImageOverAlternateText = null;
    this._uncheckedImageOverAlternateText = null;

    // Member variables
    this._decoyElement = null;
    this._decoyElementClickHandler = null;
    this._checkChangedHandler = null;
    this._divContent = null;
    this._clickHandler = null;
    this._decoyElementMouseOverHandler = null;
    this._decoyElementMouseOutHandler = null;
}
Sys.Extended.UI.ToggleButtonBehavior.prototype = {
    initialize: function() {
        Sys.Extended.UI.ToggleButtonBehavior.callBaseMethod(this, 'initialize');

        var e = this.get_element();

        // Create a decoy element to overlay the checkbox graphic and click it when clicked
        this._divContent = document.createElement('div');
        this._divContent.style.position = 'relative';
        this._decoyElement = document.createElement('a');
        e.parentNode.insertBefore(this._divContent, e);
        this._decoyElement.id = e.id + this._idDecoration;
        this._decoyElement.href = '';
        this._divContent.appendChild(this._decoyElement);

        // Set the style of the checkbox to size it and hide it
        e.style.visibility = 'hidden';
        // Set the style of the decoy element to position absolutely over the checkbox graphic
        var decoyElementStyle = this._decoyElement.style;
        decoyElementStyle.position = 'absolute';
        // Initialize left and top to 0px for Opera
        decoyElementStyle.left = '0px';
        decoyElementStyle.top = '0px';
        decoyElementStyle.width = this._imageWidth + 'px';
        decoyElementStyle.height = this._imageHeight + 'px';

        //Firefox uses fontSize to determine the height of href
        decoyElementStyle.fontSize = this._imageHeight + 'px';

        // Make the decoy element look right
        decoyElementStyle.backgroundRepeat = 'no-repeat';
        this._onClick();

        // Create delegates
        this._clickHandler = Function.createDelegate(this, this._onClick);
        this._checkChangedHandler = Function.createDelegate(this, this._onClick);
        this._decoyElementClickHandler = Function.createDelegate(this, this._onDecoyElementClick);
        this._decoyElementMouseOverHandler = Function.createDelegate(this, this._onDecoyElementMouseOver);
        this._decoyElementMouseOutHandler = Function.createDelegate(this, this._onDecoyElementMouseOut);

        // Attach events
        $addHandler(e, "click", this._clickHandler);
        $addHandler(e, "change", this._checkChangedHandler);
        $addHandler(this._decoyElement, "click", this._decoyElementClickHandler);
        $addHandler(this._decoyElement, "mouseover", this._decoyElementMouseOverHandler);
        $addHandler(this._decoyElement, "mouseout", this._decoyElementMouseOutHandler);

        // Find any any label elements "for" the checkbox and update them to be "for" the decoy element
        // Only for Internet Explorer
        if(Sys.Browser.agent === Sys.Browser.InternetExplorer) {
            var labels = this._divContent.parentNode.getElementsByTagName('label');
            for(i = 0 ; i < labels.length ; i++)
                if(e.id == labels[i].htmlFor)
                    labels[i].htmlFor = e.id + this._idDecoration;
        }
    },

    dispose: function() {
        // Detach events
        if(this._decoyElementClickHandler) {
            $removeHandler(this._decoyElement, "click", this._decoyElementClickHandler);
            this._decoyElementClickHandler = null;
        }
        if(this._checkChangedHandler) {
            $removeHandler(this.get_element(), "change", this._checkChangedHandler);
            this._checkChangedHandler = null;
        }
        if(this._clickHandler) {
            $removeHandler(this.get_element(), "click", this._clickHandler);
            this._clickHandler = null;
        }
        if(this._decoyElementMouseOverHandler) {
            $removeHandler(this._decoyElement, "mouseover", this._decoyElementMouseOverHandler);
            this._decoyElementMouseOverHandler = null;
        }
        if(this._decoyElementMouseOutHandler) {
            $removeHandler(this._decoyElement, "mouseout", this._decoyElementMouseOutHandler);
            this._decoyElementMouseOutHandler = null;
        }

        Sys.Extended.UI.ToggleButtonBehavior.callBaseMethod(this, 'dispose');
    },

    _onClick: function() {
        if(this.get_element().checked) {
            this._decoyElement.style.backgroundImage = 'url(' + (this.get_element().disabled ? this.get_disabledCheckedImageUrl() : this._checkedImageUrl) + ')';
            if(this._checkedImageAlternateText)
                this._decoyElement.title = this._checkedImageAlternateText;
        } else {
            this._decoyElement.style.backgroundImage = 'url(' + (this.get_element().disabled ? this.get_disabledUncheckedImageUrl() : this._uncheckedImageUrl) + ')';
            if(this._uncheckedImageAlternateText)
                this._decoyElement.title = this._uncheckedImageAlternateText;
        }
    },

    _onDecoyElementClick: function(e) {
        this.get_element().click();
        e.preventDefault();
        return false;
    },

    _onDecoyElementMouseOver: function(e) {
        var e = this.get_element();
        if(e && !e.disabled)
            if(e.checked && this._checkedImageOverUrl) {
                this._decoyElement.style.backgroundImage = 'url(' + this._checkedImageOverUrl + ')';
                if(this._checkedImageOverAlternateText)
                    this._decoyElement.title = this._checkedImageOverAlternateText;
            } else if(!e.checked && this._uncheckedImageOverUrl) {
                this._decoyElement.style.backgroundImage = 'url(' + this._uncheckedImageOverUrl + ')';
                if(this._uncheckedImageOverAlternateText)
                    this._decoyElement.title = this._uncheckedImageOverAlternateText;
            }
    },

    _onDecoyElementMouseOut: function(e) {
        // Call _onClick because it restores the correct image
        this._onClick();
    },

    /// <summary>
    /// The width of an image
    /// </summary>
    /// <getter>get_imageWidth</getter>
    /// <setter>set_imageWidth</setter>
    /// <member name="cP:AjaxControlToolkit.ToggleButtonExtender.imageWidth" />
    get_imageWidth: function() {
        return this._imageWidth;
    },
    set_imageWidth: function(value) {
        if(this._imageWidth != value) {
            this._imageWidth = value;
            this.raisePropertyChanged('imageWidth');
        }
    },

    get_ImageWidth: function() {
        Sys.Extended.Deprecated("get_ImageWidth()", "get_imageWidth()");
        return this.get_imageWidth();
    },
    set_ImageWidth: function(value) {
        Sys.Extended.Deprecated("set_ImageWidth(value)", "set_imageWidth(value)");
        this.set_imageWidth(value);
    },

    /// <summary>
    /// The height of an image
    /// </summary>
    /// <getter>get_imageHeight</getter>
    /// <setter>set_imageHeight</setter>
    /// <member name="cP:AjaxControlToolkit.ToggleButtonExtender.imageHeight" />
    get_imageHeight: function() {
        return this._imageHeight;
    },
    set_imageHeight: function(value) {
        if(this._imageHeight != value) {
            this._imageHeight = value;
            this.raisePropertyChanged('imageHeight');
        }
    },

    get_ImageHeight: function() {
        Sys.Extended.Deprecated("get_ImageHeight()", "get_imageHeight()");
        return this.get_imageHeight();
    },
    set_ImageHeight: function(value) {
        Sys.Extended.Deprecated("set_ImageHeight(value)", "set_imageHeight(value)");
        this.set_imageHeight(value);
    },

    /// <summary>
    /// The URL of an image to show when the toggle button is in the unchecked state
    /// </summary>
    /// <getter>get_uncheckedImageUrl</getter>
    /// <setter>set_uncheckedImageUrl</setter>
    /// <member name="cP:AjaxControlToolkit.ToggleButtonExtender.uncheckedImageUrl" />
    get_uncheckedImageUrl: function() {
        return this._uncheckedImageUrl;
    },
    set_uncheckedImageUrl: function(value) {
        if(this._uncheckedImageUrl != value) {
            this._uncheckedImageUrl = value;
            this.raisePropertyChanged('uncheckedImageUrl');
        }
    },

    get_UncheckedImageUrl: function() {
        Sys.Extended.Deprecated("get_UncheckedImageUrl()", "get_uncheckedImageUrl()");
        return this.get_uncheckedImageUrl();
    },
    set_UncheckedImageUrl: function(value) {
        Sys.Extended.Deprecated("set_UncheckedImageUrl(value)", "set_uncheckedImageUrl(value)");
        this.set_uncheckedImageUrl(value);
    },

    /// <summary>
    /// The URL of an image to show when the toggle button is in the checked state
    /// </summary>
    /// <getter>get_checkedImageUrl</getter>
    /// <setter>set_checkedImageUrl</setter>
    /// <member name="cP:AjaxControlToolkit.ToggleButtonExtender.checkedImageUrl" />
    get_checkedImageUrl: function() {
        return this._checkedImageUrl;
    },
    set_checkedImageUrl: function(value) {
        if(this._checkedImageUrl != value) {
            this._checkedImageUrl = value;
            this.raisePropertyChanged('checkedImageUrl');
        }
    },

    get_CheckedImageUrl: function() {
        Sys.Extended.Deprecated("get_CheckedImageUrl()", "get_checkedImageUrl()");
        return this.get_checkedImageUrl();
    },
    set_CheckedImageUrl: function(value) {
        Sys.Extended.Deprecated("set_CheckedImageUrl(value)", "set_checkedImageUrl(value)");
        this.set_checkedImageUrl(value);
    },

    /// <summary>
    /// The URL of an image to show when the toggle button is disabled and in the unchecked state
    /// </summary>
    /// <getter>get_disabledUncheckedImageUrl</getter>
    /// <setter>set_disabledUncheckedImageUrl</setter>
    /// <member name="cP:AjaxControlToolkit.ToggleButtonExtender.disabledUncheckedImageUrl" />
    get_disabledUncheckedImageUrl: function() {
        return (this._disabledUncheckedImageUrl != undefined) ?
            this._disabledUncheckedImageUrl : this._uncheckedImageUrl;
    },
    set_disabledUncheckedImageUrl: function(value) {
        if(this._disabledUncheckedImageUrl != value) {
            this._disabledUncheckedImageUrl = value;
            this.raisePropertyChanged('disabledUncheckedImageUrl');
        }
    },

    get_DisabledUncheckedImageUrl: function() {
        Sys.Extended.Deprecated("get_DisabledUncheckedImageUrl()", "get_disabledUncheckedImageUrl()");
        return this.get_disabledUncheckedImageUrl();
    },
    set_DisabledUncheckedImageUrl: function(value) {
        Sys.Extended.Deprecated("set_DisabledUncheckedImageUrl(value)", "set_disabledUncheckedImageUrl(value)");
        this.set_disabledUncheckedImageUrl(value);
    },

    /// <summary>
    /// The URL of an image to show when the toggle button is disabled and in the checked state
    /// </summary>
    /// <getter>get_disabledCheckedImageUrl</getter>
    /// <setter>set_disabledCheckedImageUrl</setter>
    /// <member name="cP:AjaxControlToolkit.ToggleButtonExtender.disabledCheckedImageUrl" />
    get_disabledCheckedImageUrl: function() {
        return (this._disabledUncheckedImageUrl != undefined) ?
            this._disabledCheckedImageUrl : this._checkedImageUrl;
    },
    set_disabledCheckedImageUrl: function(value) {
        if(this._disabledCheckedImageUrl != value) {
            this._disabledCheckedImageUrl = value;
            this.raisePropertyChanged('disabledCheckedImageUrl');
        }
    },

    get_DisabledCheckedImageUrl: function() {
        Sys.Extended.Deprecated("get_DisabledCheckedImageUrl()", "get_disabledCheckedImageUrl()");
        return this.get_disabledCheckedImageUrl();
    },
    set_DisabledCheckedImageUrl: function(value) {
        Sys.Extended.Deprecated("set_DisabledCheckedImageUrl(value)", "set_disabledCheckedImageUrl(value)");
        this.set_disabledCheckedImageUrl(value);
    },

    /// <summary>
    /// The URL of an image to show when the toggle button is in the checked
    /// state and the mouse is over the button
    /// </summary>
    /// <getter>get_checkedImageOverUrl</getter>
    /// <setter>set_checkedImageOverUrl</setter>
    /// <member name="cP:AjaxControlToolkit.ToggleButtonExtender.checkedImageOverUrl" />
    get_checkedImageOverUrl: function() {
        return this._checkedImageOverUrl;
    },
    set_checkedImageOverUrl: function(value) {
        if(this._checkedImageOverUrl != value) {
            this._checkedImageOverUrl = value;
            this.raisePropertyChanged('checkedImageOverUrl');
        }
    },

    get_CheckedImageOverUrl: function() {
        Sys.Extended.Deprecated("get_CheckedImageOverUrl()", "get_checkedImageOverUrl()");
        return this.get_checkedImageOverUrl();
    },
    set_CheckedImageOverUrl: function(value) {
        Sys.Extended.Deprecated("set_CheckedImageOverUrl(value)", "set_checkedImageOverUrl(value)");
        this.set_checkedImageOverUrl(value);
    },

    /// <summary>
    /// The URL of an image to show when the toggle button is in the unchecked
    /// state and the mouse is over the button
    /// </summary>
    /// <getter>get_uncheckedImageOverUrl</getter>
    /// <setter>set_uncheckedImageOverurl</setter>
    /// <member name="cP:AjaxControlToolkit.ToggleButtonExtender.uncheckedImageOverUrl" />
    get_uncheckedImageOverUrl: function() {
        return this._uncheckedImageOverUrl;
    },
    set_uncheckedImageOverUrl: function(value) {
        if(this._uncheckedImageOverUrl != value) {
            this._uncheckedImageOverUrl = value;
            this.raisePropertyChanged('uncheckedImageOverUrl');
        }
    },

    get_UncheckedImageOverUrl: function() {
        Sys.Extended.Deprecated("get_UncheckedImageOverUrl()", "get_uncheckedImageOverUrl()");
        return this.get_uncheckedImageOverUrl();
    },
    set_UncheckedImageOverUrl: function(value) {
        Sys.Extended.Deprecated("set_UncheckedImageOverUrl(value)", "set_uncheckedImageOverUrl(value)");
        this.set_uncheckedImageOverUrl(value);
    },

    /// <summary>
    /// The alt text to show when the toggle button is in the unchecked state
    /// </summary>
    /// <getter>get_uncheckedImageAlternateText</getter>
    /// <setter>set_uncheckedImageAlternateText</setter>
    /// <member name="cP:AjaxControlToolkit.ToggleButtonExtender.uncheckedImageAlternateText" />
    get_uncheckedImageAlternateText: function() {
        return this._uncheckedImageAlternateText;
    },
    set_uncheckedImageAlternateText: function(value) {
        if(this._uncheckedImageAlternateText != value) {
            this._uncheckedImageAlternateText = value;
            this.raisePropertyChanged('uncheckedImageAlternateText');
        }
    },

    get_UncheckedImageAlternateText: function() {
        Sys.Extended.Deprecated("get_UncheckedImageAlternateText()", "get_uncheckedImageAlternateText()");
        return this.get_uncheckedImageAlternateText();
    },
    set_UncheckedImageAlternateText: function(value) {
        Sys.Extended.Deprecated("set_UncheckedImageAlternateText(value)", "set_uncheckedImageAlternateText(value)");
        this.set_uncheckedImageAlternateText(value);
    },

    /// <summary>
    /// The alt text to show when the toggle button is in the checked state
    /// </summary>
    /// <getter>get_checkedImageAlternateText</getter>
    /// <setter>set_checkedImageAlternateText</setter>
    /// <member name="cP:AjaxControlToolkit.ToggleButtonExtender.checkedImageAlternateText" />
    get_checkedImageAlternateText: function() {
        return this._checkedImageAlternateText;
    },
    set_checkedImageAlternateText: function(value) {
        if(this._checkedImageAlternateText != value) {
            this._checkedImageAlternateText = value;
            this.raisePropertyChanged('checkedImageAlternateText');
        }
    },

    get_CheckedImageAlternateText: function() {
        Sys.Extended.Deprecated("get_CheckedImageAlternateText()", "get_checkedImageAlternateText()");
        return this.get_checkedImageAlternateText();
    },
    set_CheckedImageAlternateText: function(value) {
        Sys.Extended.Deprecated("set_CheckedImageAlternateText(value)", "set_checkedImageAlternateText(value)");
        this.set_checkedImageAlternateText(value);
    },

    /// <summary>
    /// The alt text to show when the toggle button is in the checked state
    /// and the mouse is over the button
    /// </summary>
    /// <getter>get_checkedImageOverAlternateText</getter>
    /// <setter>set_checkedImageOverAlternateText</setter>
    /// <member name="cP:AjaxControlToolkit.ToggleButtonExtender.checkedImageOverAlternateText" />
    get_checkedImageOverAlternateText: function() {
        return this._checkedImageOverAlternateText;
    },
    set_checkedImageOverAlternateText: function(value) {
        if(this._checkedImageOverAlternateText != value) {
            this._checkedImageOverAlternateText = value;
            this.raisePropertyChanged('checkedImageOverAlternateText');
        }
    },

    get_CheckedImageOverAlternateText: function() {
        Sys.Extended.Deprecated("get_CheckedImageOverAlternateText()", "get_checkedImageOverAlternateText()");
        return this.get_checkedImageOverAlternateText();
    },
    set_CheckedImageOverAlternateText: function(value) {
        Sys.Extended.Deprecated("set_CheckedImageOverAlternateText(value)", "set_checkedImageOverAlternateTet(value)");
        this.set_checkedImageOverAlternateText(value);
    },

    /// <summary>
    /// The alt text to show when the toggle button is in the unchecked
    /// state and the mouse is over the button
    /// </summary>
    /// <getter>get_uncheckedImageOverAlternateText</getter>
    /// <setter>set_uncheckedImageOverAlternateText</setter>
    /// <member name="cP:AjaxControlToolkit.ToggleButtonExtender.uncheckedImageOverAlternateText" />
    get_uncheckedImageOverAlternateText: function() {
        return this._uncheckedImageOverAlternateText;
    },
    set_uncheckedImageOverAlternateText: function(value) {
        if(this._uncheckedImageOverAlternateText != value) {
            this._uncheckedImageOverAlternateText = value;
            this.raisePropertyChanged('uncheckedImageOverAlternateText');
        }
    },

    get_UncheckedImageOverAlternateText: function() {
        Sys.Extended.Deprecated("get_UncheckedImageOverAlternateText()", "get_uncheckedImageOverAlternateText()");
        return this.get_uncheckedImageOverAlternateText();
    },
    set_UncheckedImageOverAlternateText: function(value) {
        Sys.Extended.Deprecated("set_UncheckedImageOverAlternateText(value)", "set_uncheckedImageOverAlternateTet(value)");
        this.set_uncheckedImageOverAlternateText(value);
    }
}
Sys.Extended.UI.ToggleButtonBehavior.registerClass('Sys.Extended.UI.ToggleButtonBehavior', Sys.Extended.UI.BehaviorBase);