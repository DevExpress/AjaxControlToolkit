


/// <reference name="MicrosoftAjax.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />

(function() {
var scriptName = "ExtendedToggleButton";

function execute() {

Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.ToggleButtonBehavior = function(element) {
    /// <summary>
    /// The ToggleButtonBehavior is used to replace a checkbox with a pair of images
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" domElement="true">
    /// Checkbox associated with the behavior
    /// </param>
    Sys.Extended.UI.ToggleButtonBehavior.initializeBase(this, [element]);
    
    // "Constants"
    this._idDecoration = '_ToggleButton';

    // Properties
    this._ImageWidth = null;
    this._ImageHeight = null;
    this._UncheckedImageUrl = null;
    this._CheckedImageUrl = null;
    this._DisabledUncheckedImageUrl = null;
    this._DisabledCheckedImageUrl = null;
    this._CheckedImageOverUrl = null;
    this._UncheckedImageOverUrl = null;
    this._UncheckedImageAlternateText = null;
    this._CheckedImageAlternateText = null;
    this._CheckedImageOverAlternateText = null;
    this._UncheckedImageOverAlternateText = null;

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
    initialize : function() {
        /// <summary>
        /// Initialize the behavior
        /// </summary>
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
        decoyElementStyle.width = this._ImageWidth + 'px';
        decoyElementStyle.height = this._ImageHeight + 'px';

        //Firefox uses fontSize to determine the height of href
        decoyElementStyle.fontSize = this._ImageHeight + 'px';

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
        if (Sys.Browser.agent === Sys.Browser.InternetExplorer) {
            var labels = this._divContent.parentNode.getElementsByTagName('label');
            for (i = 0 ; i < labels.length ; i++) {
                if (e.id == labels[i].htmlFor) {
                    labels[i].htmlFor = e.id + this._idDecoration;
                }
            }
        }
    },

    dispose : function() {
        /// <summary>
        /// Dispose the behavior
        /// </summary>

        // Detach events
        if (this._decoyElementClickHandler) {
            $removeHandler(this._decoyElement, "click", this._decoyElementClickHandler);
            this._decoyElementClickHandler = null;
        }
        if(this._checkChangedHandler) {
            $removeHandler(this.get_element(), "change", this._checkChangedHandler);
            this._checkChangedHandler = null;
        }
        if (this._clickHandler) {
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

    _onClick : function() {
        /// <summary>
        /// Handle the element's click events
        /// </summary>

        if(this.get_element().checked) {
            this._decoyElement.style.backgroundImage = 'url(' + (this.get_element().disabled ? this.get_DisabledCheckedImageUrl() : this._CheckedImageUrl) + ')';
            if (this._CheckedImageAlternateText) {
                this._decoyElement.title = this._CheckedImageAlternateText;
            }
        } else {
            this._decoyElement.style.backgroundImage = 'url(' + (this.get_element().disabled ? this.get_DisabledUncheckedImageUrl() : this._UncheckedImageUrl) + ')';
            if (this._UncheckedImageAlternateText) {
                this._decoyElement.title = this._UncheckedImageAlternateText;
            }
        }
    },

    _onDecoyElementClick : function(e) {
        /// <summary>
        /// Handle the decoy element's click events
        /// </summary>
        /// <param name="e" type="Sys.UI.DomEvent">
        /// Event info
        /// </param>

        this.get_element().click();
        e.preventDefault();
        return false;
    },
    
    _onDecoyElementMouseOver : function(e) {
        /// <summary>
        /// Handle the decoy element's mouseover event
        /// </summary>
        /// <param name="e" type="Sys.UI.DomEvent">
        /// Event info
        /// </param>
        
        var e = this.get_element();
        if(e && !e.disabled) {
            if (e.checked && this._CheckedImageOverUrl) {
                this._decoyElement.style.backgroundImage = 'url(' + this._CheckedImageOverUrl + ')';
                if (this._CheckedImageOverAlternateText) {
                    this._decoyElement.title = this._CheckedImageOverAlternateText;
                }                
            } else if (!e.checked && this._UncheckedImageOverUrl) {
                this._decoyElement.style.backgroundImage = 'url(' + this._UncheckedImageOverUrl + ')';
                if (this._UncheckedImageOverAlternateText) {
                    this._decoyElement.title = this._UncheckedImageOverAlternateText;
                }              
            }
        } 
    },
    
    _onDecoyElementMouseOut : function(e) {
        /// <summary>
        /// Handle the decoy element's mouseout event
        /// </summary>
        /// <param name="e" type="Sys.UI.DomEvent">
        /// Event info
        /// </param>

        // Call _onClick because it restores the correct image
        this._onClick();
    },        

    get_ImageWidth : function() {
        /// <value type="Number" integer="true">
        /// Width of the image that will be displayed
        /// </value>
        return this._ImageWidth;
    },
    set_ImageWidth : function(value) {
        if (this._ImageWidth != value) {
           this._ImageWidth = value;
           this.raisePropertyChanged('ImageWidth');
        }
    },

    get_ImageHeight : function() {
        /// <value type="Number" integer="true">
        /// Height of the image that will be displayed
        /// </value>
        return this._ImageHeight;
    },
    set_ImageHeight : function(value) {
        if (this._ImageHeight != value) {
            this._ImageHeight = value;
            this.raisePropertyChanged('ImageHeight');
        }
    },

    get_UncheckedImageUrl : function() {
        /// <value type="String">
        /// URL of the image to show when the toggle button is in the unchecked state
        /// </value>
        return this._UncheckedImageUrl;
    },
    set_UncheckedImageUrl : function(value) {
        if (this._UncheckedImageUrl != value) {
            this._UncheckedImageUrl = value;
            this.raisePropertyChanged('UncheckedImageUrl');
        }
    },

    get_CheckedImageUrl : function() {
        /// <value type="String">
        /// URL of the image to show when the toggle button is in the checked state
        /// </value>
        return this._CheckedImageUrl;
    },
    set_CheckedImageUrl : function(value) {
        if (this._CheckedImageUrl != value) {
            this._CheckedImageUrl = value;
            this.raisePropertyChanged('CheckedImageUrl');
        }
    },

    get_DisabledUncheckedImageUrl : function() {
        /// <value type="String">
        /// URL of the image to show when the toggle button is disabled and in the unchecked state
        /// </value>
        return (this._DisabledUncheckedImageUrl != undefined) ?
            this._DisabledUncheckedImageUrl : this._UncheckedImageUrl;
    },
    set_DisabledUncheckedImageUrl : function(value) {
        if (this._DisabledUncheckedImageUrl != value) {
            this._DisabledUncheckedImageUrl = value;
            this.raisePropertyChanged('DisabledUncheckedImageUrl');
        }
    },

    get_DisabledCheckedImageUrl : function() {
        /// <value type="String">
        /// URL of the image to show when the toggle button is disabled and in the checked state
        /// </value>
        return (this._DisabledUncheckedImageUrl != undefined) ?
            this._DisabledCheckedImageUrl : this._CheckedImageUrl;
    },
    set_DisabledCheckedImageUrl : function(value) {
        if (this._DisabledCheckedImageUrl != value) {
            this._DisabledCheckedImageUrl = value;
            this.raisePropertyChanged('DisabledCheckedImageUrl');
        }
    },
    
    get_CheckedImageOverUrl : function() {
        /// <value type="String">
        /// URL of the image to show when the toggle button is in the checked state and the cursor is positioned over the element
        /// </value>
        return this._CheckedImageOverUrl;
    },
    set_CheckedImageOverUrl : function(value) {
        if (this._CheckedImageOverUrl != value) {
            this._CheckedImageOverUrl = value;
            this.raisePropertyChanged('CheckedImageOverUrl');
        }
    },  
    
    get_UncheckedImageOverUrl : function() {
        /// <value type="String">
        /// URL of the image to show when the toggle button is in the unchecked state and the cursor is positioned over the element
        /// </value>
        return this._UncheckedImageOverUrl;
    },
    set_UncheckedImageOverUrl : function(value) {
        if (this._UncheckedImageOverUrl != value) {
            this._UncheckedImageOverUrl = value;
            this.raisePropertyChanged('UncheckedImageOverUrl');
        }
    },        

    get_UncheckedImageAlternateText : function() {
        /// <value type="String">
        /// the alt text to show when the toggle button is in the unchecked state
        /// </value>
        return this._UncheckedImageAlternateText;
    },
    set_UncheckedImageAlternateText : function(value) {
        if (this._UncheckedImageAlternateText != value) {
            this._UncheckedImageAlternateText = value;
            this.raisePropertyChanged('UncheckedImageAlternateText');
        }
    },

    get_CheckedImageAlternateText : function() {
        /// <value type="String">
        /// the alt text to show when the toggle button is in the checked state
        /// </value>
        return this._CheckedImageAlternateText;
    },
    set_CheckedImageAlternateText : function(value) {
        if (this._CheckedImageAlternateText != value) {
            this._CheckedImageAlternateText = value;
            this.raisePropertyChanged('CheckedImageAlternateText');
        }
    },
    
    get_CheckedImageOverAlternateText : function() {
        /// <value type="String">
        /// the alt text to show when the toggle button is in the checked state and the element is moused over
        /// </value>
        return this._CheckedImageOverAlternateText;
    },
    set_CheckedImageOverAlternateText : function(value) {
        if (this._CheckedImageOverAlternateText != value) {
            this._CheckedImageOverAlternateText = value;
            this.raisePropertyChanged('CheckedImageOverAlternateText');
        }
    },
    
    get_UncheckedImageOverAlternateText : function() {
        /// <value type="String">
        /// the alt text to show when the toggle button is in the unchecked state and the element is moused over
        /// </value>
        return this._UncheckedImageOverAlternateText;
    },
    set_UncheckedImageOverAlternateText : function(value) {
        if (this._UncheckedImageOverAlternateText != value) {
            this._UncheckedImageOverAlternateText = value;
            this.raisePropertyChanged('UncheckedImageOverAlternateText');
        }
    }        
}
Sys.Extended.UI.ToggleButtonBehavior.registerClass('Sys.Extended.UI.ToggleButtonBehavior', Sys.Extended.UI.BehaviorBase);
Sys.registerComponent(Sys.Extended.UI.ToggleButtonBehavior, { name: "toggleButton" });

} // execute

if (window.Sys && Sys.loader) {
    Sys.loader.registerScript(scriptName, ["ExtendedBase"], execute);
}
else {
    execute();
}

})();
