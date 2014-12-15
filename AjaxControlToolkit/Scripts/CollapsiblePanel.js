Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.CollapsiblePanelExpandDirection = function() {
    // The CollapsiblePanelExpandDirection enumeration describes whether the panel is opened vertically or horizontally
    throw Error.invalidOperation();
}
Sys.Extended.UI.CollapsiblePanelExpandDirection.prototype = {
    Horizontal : 0,
    Vertical: 1
}
Sys.Extended.UI.CollapsiblePanelExpandDirection.registerEnum("Sys.Extended.UI.CollapsiblePanelExpandDirection", false);


Sys.Extended.UI.CollapsiblePanelBehavior = function(element) {
    // The CollapsiblePanelBehavior allows you to add collapsible sections to your page
    // "element" - element to associate the behavior with
    Sys.Extended.UI.CollapsiblePanelBehavior.initializeBase(this, [element]);
    
    // property values
    this._collapsedSize = 0;
    this._expandedSize = 0;
    this._scrollContents = null;    
    this._collapsed = false;    
    this._expandControlID = null;
    this._collapseControlID = null;
    this._textLabelID = null;    
    this._collapsedText = null;
    this._expandedText = null;
    this._imageControlID = null;
    this._expandedImage = null;
    this._collapsedImage = null;
    this._suppressPostBack = null;
    this._autoExpand = null;
    this._autoCollapse = null;
    this._expandDirection = Sys.Extended.UI.CollapsiblePanelExpandDirection.Vertical;
    
    // handler delegates
    this._collapseClickHandler = null;
    this._expandClickHandler = null;    
    this._panelMouseEnterHandler = null;    
    this._panelMouseLeaveHandler = null;
    
    // the div we wrap around the panel contents
    this._childDiv = null;
    
    // Animation used to open/close the panel
    this._animation = null;
}

Sys.Extended.UI.CollapsiblePanelBehavior.prototype = {    
    initialize : function() {
        Sys.Extended.UI.CollapsiblePanelBehavior.callBaseMethod(this, 'initialize');
        
        var element = this.get_element();
        this._animation = new Sys.Extended.UI.Animation.LengthAnimation(element, .25, 10, 'style', null, 0, 0, 'px');
        if (this._expandDirection == Sys.Extended.UI.CollapsiblePanelExpandDirection.Vertical) {
            this._animation.set_propertyKey('height');
        } else if (this._expandDirection == Sys.Extended.UI.CollapsiblePanelExpandDirection.Horizontal) {
           this._animation.set_propertyKey('width');
        }
        this._animation.add_ended(Function.createDelegate(this, this._onAnimateComplete));
        
        // for checkboxes, we don't want to suppress the posback (e.g. return false)
        // because that stops them from toggling their state.
        if (this._suppressPostBack == null) {
            if (element.tagName == "INPUT" && element.type == "checkbox") {
                this._suppressPostBack = false;
                this.raisePropertyChanged('SuppressPostBack');
            }                    
            else if (element.tagName == "A") {
                this._suppressPostBack = true;
                this.raisePropertyChanged('SuppressPostBack');
            }
        }
        
        // Check our client state.  If it's present,
        // that means this is a postback, so we restore the state.
        var lastState = Sys.Extended.UI.CollapsiblePanelBehavior.callBaseMethod(this, 'get_ClientState');                
        if (lastState && lastState != "") {
            var wasCollapsed = Boolean.parse(lastState);  
            if (this._collapsed != wasCollapsed) {
                this._collapsed = wasCollapsed;
                this.raisePropertyChanged('Collapsed');       
            }
        }
        
        this._setupChildDiv();        
        
        // setup the initial size and state
        if (this._collapsed) {
            this._setTargetSize(this._getCollapsedSize());            
        } else {            
            this._setTargetSize(this._getExpandedSize());
        } 
        
        this._setupState(this._collapsed);
        
        // setup all of our handlers.
        if (this._collapseControlID == this._expandControlID) {
            this._collapseClickHandler = Function.createDelegate(this, this.togglePanel);
            this._expandClickHandler = null; // we don't need both if we're toggling.
        } else {
            this._collapseClickHandler = Function.createDelegate(this, this.collapsePanel);
            this._expandClickHandler = Function.createDelegate(this, this.expandPanel);       
        }
        
        if (this._autoExpand) {
            this._panelMouseEnterHandler = Function.createDelegate(this, this._onMouseEnter);
            $addHandler(element, 'mouseover', this._panelMouseEnterHandler);
        }       
        if (this._autoCollapse) {
            this._panelMouseLeaveHandler = Function.createDelegate(this, this._onMouseLeave);
            $addHandler(element, 'mouseout', this._panelMouseLeaveHandler);
        }
        
        // attach the click handlers
        if (this._collapseControlID) {
            var collapseElement = $get(this._collapseControlID);
            if (!collapseElement) {
                throw Error.argument('CollapseControlID', String.format(Sys.Extended.UI.Resources.CollapsiblePanel_NoControlID, this._collapseControlID));
            } else {
                $addHandler(collapseElement, 'click', this._collapseClickHandler);
            }
        }
        
        if (this._expandControlID) {
            if (this._expandClickHandler) { // if it's a toggle don't set up again
                var expandElement = $get(this._expandControlID);
                if (!expandElement) {
                    throw Error.argument('ExpandControlID', String.format(Sys.Extended.UI.Resources.CollapsiblePanel_NoControlID, this._expandControlID));
                } else {
                    $addHandler(expandElement, 'click', this._expandClickHandler);
                }
            }
        }
    },
    
    dispose : function() {
        var element = this.get_element();
        
        if (this._collapseClickHandler) {
            var collapseElement = (this._collapseControlID ? $get(this._collapseControlID) : null);
            if (collapseElement) {
                $removeHandler(collapseElement, 'click', this._collapseClickHandler);
            }
            this._collapseClickHandler = null;
        }
        
        if (this._expandClickHandler) {
            var expandElement = (this._expandControlID ? $get(this._expandControlID) : null);
            if (expandElement) {
                $removeHandler(expandElement, 'click', this._expandClickHandler);
            }
            this._expandClickHandler = null;
        }
        
        if (this._panelMouseEnterHandler) {
            $removeHandler(element, 'mouseover', this._panelMouseEnterHandler);
        }
                
        if (this._panelMouseLeaveHandler) {
            $removeHandler(element, 'mouseout', this._panelMouseLeaveHandler);
        }
                
        if (this._animation) {
            this._animation.dispose();
            this._animation = null;
        }
        
        Sys.Extended.UI.CollapsiblePanelBehavior.callBaseMethod(this, 'dispose');
    },

    togglePanel : function(eventObj) {
        // Event handler to epxand or collapse the panel (based on its current state)
        // This is the public function that should be called instead of _toggle if
        // you wish to programmatically open and close the collapsible panel.
        // "eventObj" - event Info
        this._toggle(eventObj);
    },    
    
    expandPanel : function(eventObj) {
        // Open the panel. Public function that users should call if they
        // wish to operate the collapsible panel programmatically.
        // _doOpen should be treated as private since it has an underscore 
        // to begin the function name.
        // "eventObj" - event Info
        this._doOpen(eventObj);    
    },
    
    collapsePanel : function(eventObj) {
        // Collapse the panel. Public function that users should call if they
        // wish to operate the collapsible panel programmatically.
        // _doClose should be treated as private since it has an underscore 
        // to begin the function name.
        // "eventObj" - event Info
        this._doClose(eventObj);
    },
    
    _checkCollapseHide : function() {
        // Check if a control is collapsed and hidden
        // (and set its display to none if it is supposed to be hidden)
        // returns whether the control is collapsed and hidden
        if (this._collapsed && this._getTargetSize() == 0) {
            var e = this.get_element();
            var display = $common.getCurrentStyle(e, 'display');
            if (!e.oldDisplay && display != "none") {
                e.oldDisplay = display;
                e.style.display = "none";
            }
            return true;
        }
        return false;
    },
    
    _doClose : function(eventObj) {
        // Collapse the panel. Internal function, to close call "collapsePanel".
        // "eventObj" - event Info
        var eventArgs = new Sys.CancelEventArgs();
        this.raiseCollapsing(eventArgs);
        if (eventArgs.get_cancel()) {
            return;
        }
    
        if (this._animation) {
            this._animation.stop();        
            
            // setup the animation state
            this._animation.set_startValue(this._getTargetSize());
            this._animation.set_endValue(this._getCollapsedSize());
            
            this._animation.play();
        }
        
        this._setupState(true);
                
        // stop postback if necessary.
        if (this._suppressPostBack) {
            if (eventObj && eventObj.preventDefault) {
                eventObj.preventDefault();
            } else {
                if (eventObj) {
                    eventObj.returnValue = false;
                }
                return false;
            }
        }
    },
    
    _doOpen : function(eventObj) {
        // Expand the Panel. Internal function, to close call "expandPanel".
        // "eventObj" - event Info
        var eventArgs = new Sys.CancelEventArgs();
        this.raiseExpanding(eventArgs);
        if (eventArgs.get_cancel()) {
            return;
        }
        
        // stop any existing animation
        if (this._animation) {
            this._animation.stop();
            var e = this.get_element();
            
            if (this._checkCollapseHide() && $common.getCurrentStyle(e, 'display', e.style.display)) {
                if (e.oldDisplay) {
                    e.style.display = e.oldDisplay;
                } else {
                    // IE isn't compliant on this one
                    if (e.style.removeAttribute) {
                        e.style.removeAttribute("display");
                    } else {
                       e.style.removeProperty("display");
                    }
                }
                e.oldDisplay = null;
            }
            
            // setup the animation state
            this._animation.set_startValue(this._getTargetSize());
            this._animation.set_endValue(this._getExpandedSize());
            
            this._animation.play();
        }
        
        // relect our state changes
        this._setupState(false);
        
        // stop the postback if necessary.
        if (this._suppressPostBack) {
            if (eventObj && eventObj.preventDefault) {
                eventObj.preventDefault();
            } else {
                if (eventObj) {
                    eventObj.returnValue = false;
                }
                return false;
            }
        }
    },
    
    _onAnimateComplete : function() {
        // Handler to listen for the end of the expand/collapse animation
        var e = this.get_element();
    
        // if we're fully expanded and the inner pannel is still smaller
        // than the size we've expanded to, fall back to auto
        if (!this._collapsed && !this._expandedSize)
        {
            if(this._expandDirection == Sys.Extended.UI.CollapsiblePanelExpandDirection.Vertical) {
                if(this._childDiv.offsetHeight <= e.offsetHeight) {
                   e.style.height = "auto";
                   this.raisePropertyChanged('TargetHeight');
                } 
                else {
                    this._checkCollapseHide();
                }
            }
            else // horizontal
            {
                if( this._childDiv.offsetWidth <= e.offsetWidth) {
                   e.style.width = "auto";
                   this.raisePropertyChanged('TargetWidth');
                }
                else {
                    this._checkCollapseHide();
                }
            }
        }
        else {
            this._checkCollapseHide();
        }
        
        if (this._collapsed) {
            this.raiseCollapseComplete();
            this.raiseCollapsed(Sys.EventArgs.Empty);
        } else {
            this.raiseExpandComplete()
            this.raiseExpanded(new Sys.EventArgs());
        }
    },
    
    _onMouseEnter : function(eventObj) {
        if (this._autoExpand) {
            this.expandPanel(eventObj);
        }
    },
    
    _onMouseLeave : function(eventObj) {
        if (this._autoCollapse) {
           this.collapsePanel(eventObj);
        }
    },
    
    _getExpandedSize : function() {
        // Get the size of the panel when fully expanded
        if (this._expandedSize) {
            return this._expandedSize;
        }                
        
        if (this._expandDirection == Sys.Extended.UI.CollapsiblePanelExpandDirection.Vertical) {
            return this._childDiv.offsetHeight;
        } else if (this._expandDirection == Sys.Extended.UI.CollapsiblePanelExpandDirection.Horizontal) {
            return this._childDiv.offsetWidth;
        }
    },
    
    _getCollapsedSize : function() {
        // Get the size of the panel when fully collapsed
        if (this._collapsedSize) {
            return this._collapsedSize;
        }
        
        return 0;
    },
    
     _getTargetSize : function() {
        // Get the target size of the Panel
        var value;
        if (this._expandDirection == Sys.Extended.UI.CollapsiblePanelExpandDirection.Vertical) {
           value = this.get_TargetHeight();
        } else if (this._expandDirection == Sys.Extended.UI.CollapsiblePanelExpandDirection.Horizontal) {
           value = this.get_TargetWidth();
        }       
        
        // Safari returns undefined if display is 'none'
        if (value === undefined) {
            value = 0;
        }
        return value;
    },
    
    _setTargetSize : function(value) {
        // Set the target size of the panel

        // we don't always want to set the target size here.
        // if we don't have an expanded size, and we're not collapsed,
        // and we're at (or past) our "maximum" size
        var useSize = this._collapsed || this._expandedSize;
        var e = this.get_element();
        if (this._expandDirection == Sys.Extended.UI.CollapsiblePanelExpandDirection.Vertical) {
            if (useSize || value < e.offsetHeight) {
                this.set_TargetHeight(value);
            } else {
                // if we're at our maximum size, flip to auto 
                // so that nested collapsible panels will
                // work properly.
                e.style.height = "auto";
                this.raisePropertyChanged('TargetHeight');
            }
        } else if (this._expandDirection == Sys.Extended.UI.CollapsiblePanelExpandDirection.Horizontal) {
            if (useSize || value < e.offsetWidth) {
                this.set_TargetWidth(value);
            }
            else {
                e.style.width = "auto";
                this.raisePropertyChanged('TargetWidth');
            }            
        }
        this._checkCollapseHide();
    },
    
    _setupChildDiv : function() {
        // Set up a child div to host our panel contents
        // and then push the panel's children into it.

        var startSize = this._getTargetSize();
        
        var e = this.get_element();
                
        this._childDiv = e.cloneNode(false);
        e.id = '';

        // Make the child div visible (in case the panel was made invisible,
        // to avoid the flickering issue that appears in IE6).
        this._childDiv.style.visibility = 'visible';
        this._childDiv.style.display = '';
        
        // move all children into the div.
        while (e.hasChildNodes()) {            
            var child = e.childNodes[0];
            child = e.removeChild(child);
            this._childDiv.appendChild(child);                
        }

        //On Parent
        e.setAttribute('style', '');
        e.className = '';
        e.style.border = '0px';
        e.style.margin = '0px';
        e.style.padding = '0px';

        // Setup scrolling on the child div and parent by only altering the scrolling 
        // for the expand direction letting the other fall into place naturally.
        if (this._scrollContents) {
            if (this._expandDirection == Sys.Extended.UI.CollapsiblePanelExpandDirection.Vertical) {
                e.style.overflowY = "scroll";
                this._childDiv.style.overflowY = ""; 
            } else {
                e.style.overflowX = "scroll";
                this._childDiv.style.overflowX = ""; 
            }
            // safari and opera do not recognize overflowX and overflowY
            if (Sys.Browser.agent == Sys.Browser.Safari || Sys.Browser.agent == Sys.Browser.Opera) {
                e.style.overflow = "scroll";
                this._childDiv.style.overflow = "";
            }
            
         }
         else {
            if (this._expandDirection == Sys.Extended.UI.CollapsiblePanelExpandDirection.Vertical) {
                e.style.overflowY = "hidden";
                this._childDiv.style.overflowY = ""; 
            } else {
                e.style.overflowX = "hidden";
                this._childDiv.style.overflowX = ""; 
            }
            // safari and opera do not recognize overflowX and overflowY
            if (Sys.Browser.Agent == Sys.Browser.Safari || Sys.Browser.Agent == Sys.Browser.Opera) {
                e.style.overflow = "hidden";
                this._childDiv.style.overflow = "";
            }            
         }

        //Delete some style after cloneNode
        //On Clone
        this._childDiv.style.position = "";
        
        // we optimize for the case where the original size is the collapsed size.
        // if that's the case, we go ahead and set the inner panel to auto so you 
        // can still expand it but not see it expanded by default when the page loads.
        if (startSize == this._collapsedSize) {
            if (this._expandDirection == Sys.Extended.UI.CollapsiblePanelExpandDirection.Vertical) {
                this._childDiv.style.height = "auto"; 
            } else if (this._expandDirection == Sys.Extended.UI.CollapsiblePanelExpandDirection.Horizontal) {
                this._childDiv.style.width = "auto"; 
            }
        }

        e.appendChild(this._childDiv);

        // Make the panel visible (in case the panel was made invisible,
        // to avoid the flickering issue that appears in IE6).
        e.style.visibility = 'visible';
        e.style.display = '';
        
        if (this._collapsed) {
            startSize = this._getCollapsedSize();
        }
        else {
            startSize = this._getExpandedSize();
        }
            
        // set up our initial size
        if (this._expandDirection == Sys.Extended.UI.CollapsiblePanelExpandDirection.Vertical) {
            e.style.height = startSize + "px";
            
            if (!this._expandedSize) {
                e.style.height = "auto";
            }
            else {
               e.style.height = this._expandedSize + "px";
            }
            this._childDiv.style.height = "auto";

        } else if (this._expandDirection == Sys.Extended.UI.CollapsiblePanelExpandDirection.Horizontal) {
            e.style.width = startSize + "px";
            
            if (!this._expandedSize) {
                e.style.width = "auto";
            }
            else {
               e.style.width = this._expandedSize + "px";
            }
            this._childDiv.style.width = "auto";
        }    
    },
    
    _setupState : function(isCollapsed) {
        // Get all the state set consistently when we change modes
        // "isCollapsed" - true to setup the state as if we're collapsed, false to setup the state as if we're expanded
    
        if (isCollapsed) {           
        
            // change the text label ID if we have one.
            if (this._textLabelID && this._collapsedText) {
                var e = $get(this._textLabelID);
                
                if (e) {
                    e.innerHTML = this._collapsedText;
                }
            }
            
            // Change the image if we have one
            if (this._imageControlID && this._collapsedImage) {
                var i = $get(this._imageControlID);
                if (i && i.src) {
                    i.src = this._collapsedImage;
                    if (this._expandedText || this._collapsedText) {
                        i.title = this._collapsedText;
                    }
                }
            }            
        }
        else {  
            if (this._textLabelID && this._expandedText) {
                var e = $get(this._textLabelID);
                
                if (e) {
                    e.innerHTML = this._expandedText;
                }
            }
            
            // Change the image if we have one
            if (this._imageControlID && this._expandedImage) {
                var i = $get(this._imageControlID);
                if (i && i.src) {
                    i.src = this._expandedImage;
                    if (this._expandedText || this._collapsedText) {
                            i.title = this._expandedText;
                    }
                }
            }        
        } 
        
        // set our member variable and set the client state to reflect it
        if (this._collapsed != isCollapsed) {
            this._collapsed = isCollapsed;        
            this.raisePropertyChanged('Collapsed');
        }
        Sys.Extended.UI.CollapsiblePanelBehavior.callBaseMethod(this, 'set_ClientState', [this._collapsed.toString()]);                        
    },
    
    _toggle : function(eventObj) {
        // Event handler to epxand or collapse the panel (based on its current state)
        // Internal function. Please use "togglePanel(eventObj)" to get same functionality.
        if (this.get_Collapsed()) {
            return this.expandPanel(eventObj);
        } else {
            return this.collapsePanel(eventObj);
        }
    },
    
    add_collapsing : function(handler) {
        // Add an event handler for the collapsing event
        this.get_events().addHandler('collapsing', handler);
    },
    remove_collapsing : function(handler) {
        // Remove an event handler from the collapsing event
        this.get_events().removeHandler('collapsing', handler);
    },
    raiseCollapsing : function(eventArgs) {
        // Raise the collapsing event
        var handler = this.get_events().getHandler('collapsing');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_collapsed : function(handler) {
        // Add an event handler for the collapsed event
        this.get_events().addHandler('collapsed', handler);
    },
    remove_collapsed : function(handler) {
        // Remove an event handler from the collapsed event
        this.get_events().removeHandler('collapsed', handler);
    },
    raiseCollapsed : function(eventArgs) {
        // Raise the collapsed event
        var handler = this.get_events().getHandler('collapsed');
        if (handler) {
            handler(this, eventArgs);
        }
    },

    add_collapseComplete : function(handler) {
        // Add a handler to the collapseComplete event
        // Obsolete: Use the collapsed event instead
    	this.get_events().addHandler('collapseComplete', handler);
    },
    remove_collapseComplete : function(handler) {
        // Remove a handler from the collapseComplete event
        // Obsolete: Use the collapsed event instead
    	this.get_events().removeHandler('collapseComplete', handler);
    },
    raiseCollapseComplete : function() {
        // Obsolete: Use the collapsed event instead
    	var handlers = this.get_events().getHandler('collapseComplete');
    	if (handlers) {
    		handlers(this, Sys.EventArgs.Empty);
    	}
    },
    
    add_expanding : function(handler) {
        // Add an event handler for the expanding event
        this.get_events().addHandler('expanding', handler);
    },
    remove_expanding : function(handler) {
        // Remove an event handler from the expanding event
        this.get_events().removeHandler('expanding', handler);
    },
    raiseExpanding : function(eventArgs) {
        // Raise the expanding event
        var handler = this.get_events().getHandler('expanding');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_expanded : function(handler) {
        // Add an event handler for the expanded event
        this.get_events().addHandler('expanded', handler);
    },
    remove_expanded : function(handler) {
        // Remove an event handler from the expanded event
        this.get_events().removeHandler('expanded', handler);
    },
    raiseExpanded : function(eventArgs) {
        // Raise the expanded event
        var handler = this.get_events().getHandler('expanded');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_expandComplete : function(handler) {
        // Add a handler to the expandComplete event
        // Obsolete: Use the expanded event instead
    	this.get_events().addHandler('expandComplete', handler);
    },
    remove_expandComplete : function(handler) {
        // Remove a handler from the expandComplete event
        // Obsolete: Use the expanded event instead
    	this.get_events().removeHandler('expandComplete', handler);
    },
    raiseExpandComplete : function() {
        // Obsolete: Use the expanded event instead
    	var handlers = this.get_events().getHandler('expandComplete');
    	if (handlers) {
    		handlers(this, Sys.EventArgs.Empty);
    	}
    },

    get_TargetHeight : function() {
        // Wrap the height of the panel
        return this.get_element().offsetHeight;        
    },
    set_TargetHeight : function(value) {        
        this.get_element().style.height = value + "px";        
        this.raisePropertyChanged('TargetHeight');
    },
    
    get_TargetWidth : function() {
        // Wrap the width of the panel
        return this.get_element().offsetWidth;        
    },
    set_TargetWidth : function(value) {
        this.get_element().style.width = value + "px"        
        this.raisePropertyChanged('TargetWidth');
    },
        
    get_Collapsed : function() {
        // Whether or not the panel is collapsed
        return this._collapsed;        
    },    
    set_Collapsed : function(value) {
        // if we're changing values, and we're live, togglePanel.
        if (this.get_isInitialized() && this.get_element() && value != this.get_Collapsed()) {
            this.togglePanel();
        }
        else {
            this._collapsed = value;
            this.raisePropertyChanged('Collapsed');
        }
    },
    
    get_CollapsedSize : function() {
        // The size of the target, in pixels, when it is in the collapsed state
        return this._collapsedSize;
    },
    set_CollapsedSize : function(value) {
        if (this._collapsedSize != value) {
            this._collapsedSize = value;
            this.raisePropertyChanged('CollapsedSize');
        }
    },
    
    get_ExpandedSize : function() {
        // The size of the target, in pixels, when it is in the expanded state
        return this._expandedSize;
    },
    set_ExpandedSize : function(value) {
        if (this._expandedSize != value) {
            this._expandedSize = value;
            this.raisePropertyChanged('ExpandedSize');
        }
    },
    
    get_CollapseControlID : function() {
        // ID of the control used to collapse the target when clicked
        return this._collapseControlID;
    },
    set_CollapseControlID : function(value) {
        if (this._collapseControlID != value) {
            this._collapseControlID = value;
            this.raisePropertyChanged('CollapseControlID');
        }
    },
    
    get_ExpandControlID : function() {
        // ID of the control used to expand the target when clicked
        return this._expandControlID;
    },    
    set_ExpandControlID : function(value) {
        if (this._expandControlID != value) {
            this._expandControlID = value;
            this.raisePropertyChanged('ExpandControlID');
        }
    },
    
    get_ScrollContents : function() {
        // Whether to add a scrollbar when the contents are larger than the target (the contents will be clipped if false)
        return this._scrollContents;
    },
    set_ScrollContents : function(value) {
        if (this._scrollContents != value) {
            this._scrollContents = value;
            this.raisePropertyChanged('ScrollContents');
        }
    },
    
    get_SuppressPostBack : function() {
        // Whether or not to suppress postbacks generated when the CollapseControlID or ExpandControlID elements are clicked
        return this._suppressPostBack;
    },
    set_SuppressPostBack : function(value) {
        if (this._suppressPostBack != value) {
            this._suppressPostBack = value;
            this.raisePropertyChanged('SuppressPostBack');
        }
    },
    
    get_TextLabelID : function() {
        // ID of the element where the "status text" for the target will be placed
        return this._textLabelID;
    },
    set_TextLabelID : function(value) {
        if (this._textLabelID != value) {
            this._textLabelID = value;
            this.raisePropertyChanged('TextLabelID');
        }
    },
    
    get_ExpandedText : function() {
        // Text to show in the element specified by TextLabelID when the target is expanded.  This text is also used as the alternate text of the image if ImageControlID has been provided.
        return this._expandedText;
    },
    set_ExpandedText : function(value) {
        if (this._expandedText != value) {
            this._expandedText = value;
            this.raisePropertyChanged('ExpandedText');
        }
    },
    
    get_CollapsedText : function() {
        // Text to show in the element specified by TextLabelID when the target is collapsed.  This text is also used as the alternate text of the image if ImageControlID has been provided.
        return this._collapsedText;
    },
    set_CollapsedText : function(value) {
        if (this._collapsedText != value) {
            this._collapsedText = value;
            this.raisePropertyChanged('CollapsedText');
        }
    },
    
    get_ImageControlID : function() {
        // ID of the <img> element where an icon indicating the collapsed status of the target will be placed
        return this._imageControlID;
    },
    set_ImageControlID : function(value) {
        if (this._imageControlID != value) {
            this._imageControlID = value;
            this.raisePropertyChanged('ImageControlID');
        }
    },
    
    get_ExpandedImage : function() {
        // Path to an image to show in the element specified by ImageControlID when the target is expanded
        return this._expandedImage;
    },
    set_ExpandedImage : function(value) {
        if (this._expandedImage != value) {
            this._expandedImage = value;
            this.raisePropertyChanged('ExpandedImage');
        }
    },
    
    get_CollapsedImage : function() {
        // Path to an image to show in the element specified by ImageControlID when the target is collapsed
        return this._collapsedImage;
    },
    set_CollapsedImage : function(value) {
        if (this._collapsedImage != value) {
            this._collapsedImage = value;
            this.raisePropertyChanged('CollapsedImage');
        }
    },
    
    get_AutoExpand : function() {
        // Whether to automatically expand the target when the mouse is moved over it
        return this._autoExpand;
    },
    set_AutoExpand : function(value) {
        if (this._autoExpand != value) {
            this._autoExpand = value;
            this.raisePropertyChanged('AutoExpand');
        }
    },
    
    get_AutoCollapse : function() {
        // Whether to automatically collapse the target when the mouse is moved off of it
        return this._autoCollapse;
    },
    set_AutoCollapse : function(value) {
        if (this._autoCollapse != value) {
            this._autoCollapse = value;
            this.raisePropertyChanged('AutoCollapse');
        }
    },    
    
    get_ExpandDirection : function() {
        // Direction the panel will expand and collapse (can be either "Vertical" or "Horizontal")
        return this._expandDirection == Sys.Extended.UI.CollapsiblePanelExpandDirection.Vertical;
    },      
    set_ExpandDirection : function(value) {
        if (this._expandDirection != value) {
            this._expandDirection = value;
            this.raisePropertyChanged('ExpandDirection');
        }
    }
}
Sys.Extended.UI.CollapsiblePanelBehavior.registerClass('Sys.Extended.UI.CollapsiblePanelBehavior', Sys.Extended.UI.BehaviorBase);