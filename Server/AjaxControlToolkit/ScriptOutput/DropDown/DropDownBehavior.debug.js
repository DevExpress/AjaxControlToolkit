// (c) 2010 CodePlex Foundation



/// <reference name="MicrosoftAjax.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />
/// <reference path="../DynamicPopulate/DynamicPopulateBehavior.js" />
/// <reference path="../Animation/Animations.js" />
/// <reference path="../Animation/AnimationBehavior.js" />
/// <reference path="../PopupExtender/PopupBehavior.js" />
/// <reference path="../HoverExtender/HoverBehavior.js" />

(function() {
var scriptName = "ExtendedDropDown";

function execute() {

Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.DropDownBehavior = function(element) {
    Sys.Extended.UI.DropDownBehavior.initializeBase(this, [element]);
    this._dropDownControl = null;
    this._highlightBorderColor = "#2353B2";
    this._highlightBackgroundColor = "#FFF3DB";
    this._dropArrowBackgroundColor = "#C6E1FF";
    this._dropArrowImageUrl = null;
    if (Sys.loader) {
        var url = Sys.loader.basePath;
        if (url) {
            if (url.charAt(url.length-1) !== "/") {
                url += "/";
            }
            this._dropArrowImageUrl = url + "extended/dropdown/drop-arrow.gif";
        }
    }
    this._dropArrowWidth = "16px";
    this._oldBackgroundColor = null;
    this._dropFrame = null;
    this._dropArrow = null;
    this._dropArrowImage = null;
    this._dropWrapper = null;
    this._isOpen = false;
    this._isOver = false;
    this._wasClicked = null;
    this._dropWrapperHoverBehavior = null;
    this._dropPopupPopupBehavior = null;
    this._onShowJson = null;
    this._onHideJson = null;
    
    this._dropDownControl$delegates = {
        click : Function.createDelegate(this, this._dropDownControl_onclick),
        contextmenu : Function.createDelegate(this, this._dropDownControl_oncontextmenu)
    }
    this._dropFrame$delegates = {
        click : Function.createDelegate(this, this._dropFrame_onclick),
        contextmenu : Function.createDelegate(this, this._dropFrame_oncontextmenu)
    }
    this._dropWrapper$delegates = {
        click : Function.createDelegate(this, this._dropWrapper_onclick),
        contextmenu : Function.createDelegate(this, this._dropWrapper_oncontextmenu)
    }
    this._document$delegates = {
        click : Function.createDelegate(this, this._document_onclick),
        contextmenu : Function.createDelegate(this, this._document_oncontextmenu)
    }
    this._dropWrapperHoverBehavior$delegates = {
        hover : Function.createDelegate(this, this._dropWrapperHoverBehavior_onhover),
        unhover : Function.createDelegate(this, this._dropWrapperHoverBehavior_onunhover)
    }
}
Sys.Extended.UI.DropDownBehavior.prototype = {
    
    
    initialize : function() {
        Sys.Extended.UI.DropDownBehavior.callBaseMethod(this, 'initialize');
        var elt = this.get_element();        
        var parent = elt.parentNode;
        
        if (this._dropDownControl == null) {
            $common.createElementFromTemplate({
                parent : parent,
                nameTable : this,
                name : "_dropDownControl",
                nodeName : "div",
                visible : false,
                cssClasses : this._dropDownControl ? null : ["ajax__dropdown_panel"],
                properties : { 
                    __GENERATED : true 
                }
            });
        }
        $addHandlers(this._dropDownControl, this._dropDownControl$delegates);

        var dropArrowImageProperties = {};
        if (this._dropArrowImageUrl) {
            dropArrowImageProperties["src"] = this._dropArrowImageUrl;
        }
        $common.createElementFromTemplate({
            parent : parent,
            nameTable : this,
            name : "_dropFrame",
            nodeName : "span",
            visible : false,
            children : [{
                name : "_dropFrameTop",
                nodeName : "div",
                cssClasses : ["ajax__dropdown_frame_line"]
            }, {
                name : "_dropFrameRight",
                nodeName : "div",
                cssClasses : ["ajax__dropdown_frame_line"]
            }, {
                name : "_dropFrameBottom",
                nodeName : "div",
                cssClasses : ["ajax__dropdown_frame_line"]
            }, {
                name : "_dropFrameLeft",
                nodeName : "div",
                cssClasses : ["ajax__dropdown_frame_line"]
            }, {
                name : "_dropArrow",
                nodeName : "div",
                cssClasses : (!this._dropArrowImageUrl) ? ["ajax__dropdown_arrow", "ajax__dropdown_arrow_image"] : ["ajax__dropdown_arrow"],
                properties : {
                    style : {
                        width : this._dropArrowWidth,
                        backgroundColor : this._dropArrowBackgroundColor
                    }
                },
                events : this._dropFrame$delegates,
                children : [{
                    name : "_dropArrowWrapper",
                    nodeName : "div",
                    visible : !!this._dropArrowImageUrl,
                    cssClasses : ["ajax__dropdown_arrow_wrapper"],
                    children : [{
                        name : "_dropArrowImage",
                        nodeName : "img",
                        properties : dropArrowImageProperties
                    }]
                }]
            }]
        });

        $common.createElementFromTemplate({
            parent : null,
            nameTable : this,
            name : "_dropWrapper",
            nodeName : "span",
            properties : {
                id : elt.id + "_dropWrapper",
                style : {
                    cursor : "default"
                }
            },
            events : this._dropWrapper$delegates,
            content : elt
        });
        
        this._dropPopupPopupBehavior = $create(Sys.Extended.UI.PopupBehavior, { 
            positioningMode : Sys.Extended.UI.PositioningMode.BottomRight, 
            parentElement : elt, 
            y : -1 
        }, null, null, this._dropDownControl);
        
        if (this._onShowJson) {
            this._dropPopupPopupBehavior.set_onShow(this._onShowJson);
        }
        if (this._onHideJson) {
            this._dropPopupPopupBehavior.set_onHide(this._onHideJson);
        }
        
        
        this._dropWrapperHoverBehavior = $create(Sys.Extended.UI.HoverBehavior, { 
            hoverElement : this._dropFrame 
        }, this._dropWrapperHoverBehavior$delegates, null, this._dropWrapper);

        $addHandlers(document, this._document$delegates);
    },
    
    dispose : function() {
        var elt = this.get_element();
        if (this._isOpen) {
            this.hide();
            this.unhover();
            this._isOpen = false;
        }
        $common.removeHandlers(document, this._document$delegates);
        this._onShowJson = null;
        this._onHideJson = null;
        if (this._dropPopupPopupBehavior) {
            this._dropPopupPopupBehavior.dispose();
            this._dropPopupPopupBehavior = null;
        }
        if (this._dropWrapperHoverBehavior) {
            this._dropWrapperHoverBehavior.dispose();
            this._dropWrapperHoverBehavior = null;
        }
        if (this._dropFrame) {
            $common.removeElement(this._dropFrame);
            this._dropFrame = null;
            this._dropFrameTop = null;
            this._dropFrameRight = null;
            this._dropFrameBottom = null;
            this._dropFrameLeft = null;
            this._dropArrow = null;
            this._dropArrowWrapper = null;
            this._dropArrowImage = null;
        }
        if (this._dropWrapper) {
            $common.removeHandlers(this._dropWrapper, this._dropWrapper$delegates);
            $common.unwrapElement(elt, this._dropWrapper);
            this._dropWrapper = null;
        }
        if (this._dropDownControl) {
            $common.removeHandlers(this._dropDownControl, this._dropDownControl$delegates);
            if (this._dropDownControl.__GENERATED) {
                $common.removeElement(this._dropDownControl);
            }
            this._dropDownControl = null;
        }
        Sys.Extended.UI.DropDownBehavior.callBaseMethod(this, 'dispose');
    },    

    hover : function() {
        var elt = this.get_element();
        if (!this._isOver) {
            this._isOver = true;
            this.raiseHoverOver(Sys.EventArgs.Empty);
            
            var bounds = $common.getBounds(elt);
            
            $common.setLocation(this._dropFrame, {x:0, y:0});
            $common.setVisible(this._dropFrame, true);
            var offset = $common.getLocation(this._dropFrame);
            $common.setVisible(this._dropFrame, false);
            
            bounds.x -= offset.x;
            bounds.y -= offset.y; 
            
            $common.setBounds(this._dropFrameTop, { 
                x : bounds.x, 
                y : bounds.y,
                width : bounds.width,
                height : 1
            });
            $common.setBounds(this._dropFrameRight, {
                x : bounds.x + bounds.width - 1,
                y : bounds.y,
                width : 1,
                height : bounds.height
            });
            $common.setBounds(this._dropFrameBottom, {
                x : bounds.x,
                y : bounds.y + bounds.height - 1,
                width : bounds.width,
                height : 1
            });
            $common.setBounds(this._dropFrameLeft, {
                x : bounds.x,
                y : bounds.y,
                width : 1,
                height : bounds.height
            });
            $common.setBounds(this._dropArrow, {
                x : bounds.x + bounds.width - 17,
                y : bounds.y + 1,
                width : 16,
                height : bounds.height - 2
            });
            this._dropFrameTop.style.backgroundColor = this._highlightBorderColor;
            this._dropFrameRight.style.backgroundColor = this._highlightBorderColor;
            this._dropFrameBottom.style.backgroundColor = this._highlightBorderColor;
            this._dropFrameLeft.style.backgroundColor = this._highlightBorderColor;
            $common.setVisible(this._dropFrame, true);
            if (!this._oldBackgroundColor) {            
                this._oldBackgroundColor = $common.getCurrentStyle(elt, 'backgroundColor');
            }
            elt.style.backgroundColor = this._highlightBackgroundColor;
        }
    },
    
    unhover : function() {
        var elt = this.get_element();
        if (this._isOver || !this._isOpen) {
            this._isOver = false;
            if (!this._isOpen) {        
                $common.setVisible(this._dropFrame, false);
                if (this._oldBackgroundColor) {
                    elt.style.backgroundColor = this._oldBackgroundColor;
                    this._oldBackgroundColor = null;
                } else {
                    elt.style.backgroundColor = "transparent";
                }
            }
            this.raiseHoverOut(Sys.EventArgs.Empty);
        }
    },
    
    show : function() {
        if (!this._isOpen) {
            this.hover();

            var eventArgs = new Sys.CancelEventArgs();
            this.raiseShowing(eventArgs);
            this.raisePopup(eventArgs);
            if (eventArgs.get_cancel()) {
                return;
            }
            
            this._isOpen = true;
            this.populate();
            if (!this._dynamicPopulateBehavior || (this._dynamicPopulateBehavior._populated && this._cacheDynamicResults)) {
                this._showPopup();
            }
        }
    },
    
    _showPopup : function() {
        /// <summary>
        /// Show the drop down's popup
        /// </summary>
        /// <returns />
        
        this._dropPopupPopupBehavior.show();
        this.raiseShown(Sys.EventArgs.Empty);
    },
    
    hide : function() {
        if (this._isOpen) {
            var eventArgs = new Sys.CancelEventArgs();
            this.raiseHiding(eventArgs);
            if (eventArgs.get_cancel()) {
                return;
            }
        
            this._isOpen = false;
            this._dropPopupPopupBehavior.hide();
            
            this.raiseHidden(Sys.EventArgs.Empty);
        }
    },
    
    _dropWrapperHoverBehavior_onhover : function(sender, e) {
        this.hover();
    },
    _dropWrapperHoverBehavior_onunhover : function(sender, e) {
        this.unhover();
    },
    _dropWrapper_onclick : function(e) {
        if(e.target.tagName != "A") {
            if(!this._isOpen) {
                this.show();
            } else {
                this.hide();
            }
            this._wasClicked = true;
        }
    },
    _dropWrapper_oncontextmenu : function(e) {
        if(e.target.tagName != "A") {
            this._wasClicked = true;
            e.preventDefault();
            this.show();
        }
    },
    _dropFrame_onclick : function(e) {
        if(!this._isOpen) {
            this.show();
        } else {
            this.hide();
        }
        this._wasClicked = true;
    },
    _dropFrame_oncontextmenu : function(e) {
        this._wasClicked = true;
        e.preventDefault();
        this.show();
    },
    _dropDownControl_onclick : function(e) {
    },
    _dropDownControl_oncontextmenu : function(e) {
        this._wasClicked = true;
        e.preventDefault();
    },
    _document_onclick : function(e) {        
        if(this._wasClicked) {
            this._wasClicked = false;
        } else if(this._isOpen) {
            this.hide();
            this.unhover();
        }
    },
    _document_oncontextmenu : function(e) {
        if(this._wasClicked) {
            this._wasClicked = false;
        } else if(this._isOpen) {
            this.hide();
            this.unhover();
        }
    },
    
    _onPopulated : function(sender, eventArgs) {
        /// <summary>
        /// Handler for DynamicPopulate behavior's Populated event
        /// </summary>
        /// <param name="sender" type="Object">
        /// DynamicPopulate behavior
        /// </param>
        /// <param name="eventArgs" type="Sys.EventArgs" mayBeNull="false">
        /// Event args
        /// </param>
        Sys.Extended.UI.DropDownBehavior.callBaseMethod(this, '_onPopulated', [sender, eventArgs]);
        
        if (this._isOpen) {
            this._showPopup();
        }
    },
    
    get_onShow : function() {
        /// <value type="String" mayBeNull="true">
        /// Generic OnShow Animation's JSON definition
        /// </value>
        return this._dropPopupPopupBehavior ? this._dropPopupPopupBehavior.get_onShow() : this._onShowJson;
    },
    set_onShow : function(value) {
        if (this._dropPopupPopupBehavior) {
            this._dropPopupPopupBehavior.set_onShow(value)
        } else {
            this._onShowJson = value;
        }
        this.raisePropertyChanged('onShow');
    },
    get_onShowBehavior : function() {
        /// <value type="Sys.Extended.UI.Animation.GenericAnimationBehavior">
        /// Generic OnShow Animation's behavior
        /// </value>
        return this._dropPopupPopupBehavior ? this._dropPopupPopupBehavior.get_onShowBehavior() : null;
    },
    onShow : function() {
        /// <summary>
        /// Play the OnShow animation
        /// </summary>
        /// <returns />
        if (this._dropPopupPopupBehavior) {
            this._dropPopupPopupBehavior.onShow();
        }
    },
        
    get_onHide : function() {
        /// <value type="String" mayBeNull="true">
        /// Generic OnHide Animation's JSON definition
        /// </value>
        return this._dropPopupPopupBehavior ? this._dropPopupPopupBehavior.get_onHide() : this._onHideJson;
    },
    set_onHide : function(value) {
        if (this._dropPopupPopupBehavior) {
            this._dropPopupPopupBehavior.set_onHide(value)
        } else {
            this._onHideJson = value;
        }
        this.raisePropertyChanged('onHide');
    },
    get_onHideBehavior : function() {
        /// <value type="Sys.Extended.UI.Animation.GenericAnimationBehavior">
        /// Generic OnHide Animation's behavior
        /// </value>
        return this._dropPopupPopupBehavior ? this._dropPopupPopupBehavior.get_onHideBehavior() : null;
    },
    onHide : function() {
        /// <summary>
        /// Play the OnHide animation
        /// </summary>
        /// <returns />
        if (this._dropPopupPopupBehavior) {
            this._dropPopupPopupBehavior.onHide();
        }
    },
    
    get_dropDownControl : function() {
        return this._dropDownControl;
    },
    set_dropDownControl : function(value) {        
        if (this._dropDownControl != value) {
            this._dropDownControl = value;
            this.raisePropertyChanged("dropDownControl");
        }
    },
    
    get_highlightBorderColor : function() {
        return this._highlightBorderColor;
    },
    set_highlightBorderColor : function(value) {

        if (this._highlightBorderColor != value) {
            this._highlightBorderColor = value;
            this.raisePropertyChanged("highlightBorderColor");
        }
    },
    
    get_highlightBackgroundColor : function() {
        return this._highlightBackgroundColor; 
    },
    set_highlightBackgroundColor : function(value) {

        if (this._highlightBackgroundColor != value) {
            this._highlightBackgroundColor = value;
            if(this.get_isInitialized() && this._isOpen) {
                this._dropWrapper.style.backgroundColor = value;
            }
            this.raisePropertyChanged("highlightBackgroundColor");
        }
    },
    
    get_dropArrowBackgroundColor : function() {
        return this._dropArrowBackgroundColor;
    },
    set_dropArrowBackgroundColor : function(value) {

        if (this._dropArrowBackgroundColor != value) {
            this._dropArrowBackgroundColor = value;
            if(this.get_isInitialized()) {
                this._dropArrow.style.backgroundColor = value;
            }
            this.raisePropertyChanged("dropArrowBackgroundColor");
        }
    },
    
    get_dropArrowImageUrl : function() {
        return this._dropArrowImageUrl;
    },
    set_dropArrowImageUrl : function(value) {
        if (this._dropArrowImageUrl != value) {
            this._dropArrowImageUrl = value;
            if(this.get_isInitialized()) {
                if (this._dropArrow.className) {
                    this._dropArrow.className = "";
                    this._dropArrowWrapper.style.display = 'block';
                }
                this._dropArrowImage.src = value;
            }
            this.raisePropertyChanged("dropArrowImageUrl");
        }
    },
    
    get_dropArrowWidth : function() {
        return this._dropArrowWidth;
    },
    set_dropArrowWidth : function(value) {
        if (this._dropArrowWidth != value) {
            this._dropArrowWidth = value;
            if(this.get_isInitialized()) {
                this._dropArrow.style.width = value;
            }
            this.raisePropertyChanged("dropArrowWidth");
        }
    },
    
    get_isOver : function() {
        return this._isOver;
    },
    
    get_isOpen : function() {
        return this._isOpen;
    },
    
    add_showing : function(handler) {
        /// <summary>
        /// Add an event handler for the showing event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('showing', handler);
    },
    remove_showing : function(handler) {
        /// <summary>
        /// Remove an event handler from the showing event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('showing', handler);
    },
    raiseShowing : function(eventArgs) {
        /// <summary>
        /// Raise the showing event
        /// </summary>
        /// <param name="eventArgs" type="Sys.CancelEventArgs" mayBeNull="false">
        /// Event arguments for the showing event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('showing');
        if (handler) {
            handler(this, eventArgs);
        }
    },

    add_shown : function(handler) {
        /// <summary>
        /// Add an event handler for the shown event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('shown', handler);
    },
    remove_shown : function(handler) {
        /// <summary>
        /// Remove an event handler from the shown event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('shown', handler);
    },
    raiseShown : function(eventArgs) {
        /// <summary>
        /// Raise the shown event
        /// </summary>
        /// <param name="eventArgs" type="Sys.EventArgs" mayBeNull="false">
        /// Event arguments for the shown event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('shown');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_popup : function(handler) {
        /// <summary>
        /// Add an event handler for the popup event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        /// <obsolete>Use the shown event instead</obsolete>
        this.get_events().addHandler('popup', handler);
    },
    remove_popup : function(handler) {
        /// <summary>
        /// Remove an event handler from the popup event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        /// <obsolete>Use the shown event instead</obsolete>
        this.get_events().removeHandler('popup', handler);
    },
    raisePopup : function(eventArgs) {
        /// <summary>
        /// Raise the popup event
        /// </summary>
        /// <param name="eventArgs" type="Sys.EventArgs" mayBeNull="false">
        /// Event arguments for the popup event
        /// </param>
        /// <returns />
        /// <obsolete>Use the shown event instead</obsolete>
        
        var handler = this.get_events().getHandler('popup');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_hiding : function(handler) {
        /// <summary>
        /// Add an event handler for the hiding event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('hiding', handler);
    },
    remove_hiding : function(handler) {
        /// <summary>
        /// Remove an event handler from the hiding event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('hiding', handler);
    },
    raiseHiding : function(eventArgs) {
        /// <summary>
        /// Raise the hiding event
        /// </summary>
        /// <param name="eventArgs" type="Sys.CancelEventArgs" mayBeNull="false">
        /// Event arguments for the hiding event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('hiding');
        if (handler) {
            handler(this, eventArgs);
        }
    },    
    
    add_hidden : function(handler) {
        /// <summary>
        /// Add an event handler for the hidden event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('hidden', handler);
    },
    remove_hidden : function(handler) {
        /// <summary>
        /// Remove an event handler from the hidden event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('hidden', handler);
    },
    raiseHidden : function(eventArgs) {
        /// <summary>
        /// Raise the hidden event
        /// </summary>
        /// <param name="eventArgs" type="Sys.EventArgs" mayBeNull="false">
        /// Event arguments for the hidden event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('hidden');
        if (handler) {
            handler(this, eventArgs);
        }
    },

    add_hoverOver : function(handler) {
        /// <summary>
        /// Add an event handler for the hoverOver event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('hoverOver', handler);
    },
    remove_hoverOver : function(handler) {
        /// <summary>
        /// Remove an event handler from the hoverOver event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('hoverOver', handler);
    },
    raiseHoverOver : function(eventArgs) {
        /// <summary>
        /// Raise the hoverOver event
        /// </summary>
        /// <param name="eventArgs" type="Sys.EventArgs" mayBeNull="false">
        /// Event arguments for the hoverOver event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('hoverOver');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_hoverOut : function(handler) {
        /// <summary>
        /// Add an event handler for the hoverOut event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('hoverOut', handler);
    },
    remove_hoverOut : function(handler) {
        /// <summary>
        /// Remove an event handler from the hoverOut event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('hoverOut', handler);
    },
    raiseHoverOut : function(eventArgs) {
        /// <summary>
        /// Raise the hoverOut event
        /// </summary>
        /// <param name="eventArgs" type="Sys.EventArgs" mayBeNull="false">
        /// Event arguments for the hoverOut event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('hoverOut');
        if (handler) {
            handler(this, eventArgs);
        }
    }
}
Sys.Extended.UI.DropDownBehavior.registerClass('Sys.Extended.UI.DropDownBehavior', Sys.Extended.UI.DynamicPopulateBehaviorBase);
Sys.registerComponent(Sys.Extended.UI.DropDownBehavior, { name: "dropDown" });

} // execute

if (window.Sys && Sys.loader) {
    Sys.loader.registerScript(scriptName, ["ExtendedDynamicPopulate", "ExtendedAnimationBehavior", "ExtendedPopup", "ExtendedHover"], execute);
}
else {
    execute();
}

})();
