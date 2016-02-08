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

    /// <summary>
    /// Event handler to expand or collapse the panel (based on its current state)
    /// This is the public function that should be called instead of _toggle if
    /// you wish to programmatically open and close the collapsible panel
    /// </summary>
    /// <param name="eventObj" type="Object">Event info</param>
    /// <member name="cM:AjaxControlToolkit.CollapsiblePanelExtender.togglePanel" />
    togglePanel : function(eventObj) {
        this._toggle(eventObj);
    },    
    
    /// <summary>
    /// Open the panel. Public function that users should call if they
    /// wish to operate the collapsible panel programmatically
    /// </summary>
    /// <param name="eventObj" type="Object">Event info</param>
    /// <member name="cM:AjaxControlToolkit.CollapsiblePanelExtender.expandPanel" />
    expandPanel : function(eventObj) {
        this._doOpen(eventObj);
    },
    
    /// <summary>
    /// Collapse the panel. Public function that users should call if they
    /// wish to operate the collapsible panel programmatically
    /// </summary>
    /// <param name="eventObj" type="Object">Event info</param>
    /// <member name="cM:AjaxControlToolkit.CollapsiblePanelExtender.collapsePanel" />
    collapsePanel : function(eventObj) {
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
        this.raise_collapsing(eventArgs);
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
        this.raise_expanding(eventArgs);
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
            this.raise_collapseComplete();
            this.raise_collapsed(Sys.EventArgs.Empty);
        } else {
            this.raise_expandComplete()
            this.raise_expanded(new Sys.EventArgs());
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
           value = this.get_targetHeight();
        } else if (this._expandDirection == Sys.Extended.UI.CollapsiblePanelExpandDirection.Horizontal) {
           value = this.get_targetWidth();
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
                this.set_targetHeight(value);
            } else {
                // if we're at our maximum size, flip to auto 
                // so that nested collapsible panels will
                // work properly.
                e.style.height = "auto";
                this.raisePropertyChanged('TargetHeight');
            }
        } else if (this._expandDirection == Sys.Extended.UI.CollapsiblePanelExpandDirection.Horizontal) {
            if (useSize || value < e.offsetWidth) {
                this.set_targetWidth(value);
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
        if(this.get_collapsed()) {
            return this.expandPanel(eventObj);
        } else {
            return this.collapsePanel(eventObj);
        }
    },
    
    /// <summary>
    /// Fires when control is collapsing
    /// </summary>
    /// <event add="add_collapsing" remove="remove_collapsing" raise="raise_collapsing" />
    /// <member name="cE:AjaxControlToolkit.CollapsiblePanelExtender.collapsing" />
    add_collapsing: function(handler) {
        // Add an event handler for the collapsing event
        this.get_events().addHandler('collapsing', handler);
    },
    remove_collapsing: function(handler) {
        // Remove an event handler from the collapsing event
        this.get_events().removeHandler('collapsing', handler);
    },
    raise_collapsing: function(eventArgs) {
        // Raise the collapsing event
        var handler = this.get_events().getHandler('collapsing');

        if(handler)
            handler(this, eventArgs);
    },
    raiseCollapsing: function(eventArgs) {
        Sys.Extended.Deprecated("raiseCollapsing", "raise_collapsing");
        this.raise_collapsing(eventArgs);
    },
    
    /// <summary>
    /// Fires when control is collapsed
    /// </summary>
    /// <event add="add_collapsed" remove="remove_collapsed" raise="raise_collapsed" />
    /// <member name="cE:AjaxControlToolkit.CollapsiblePanelExtender.collapsed" />
    add_collapsed: function(handler) {
        // Add an event handler for the collapsed event
        this.get_events().addHandler('collapsed', handler);
    },
    remove_collapsed: function(handler) {
        // Remove an event handler from the collapsed event
        this.get_events().removeHandler('collapsed', handler);
    },
    raise_collapsed: function(eventArgs) {
        // Raise the collapsed event
        var handler = this.get_events().getHandler('collapsed');

        if(handler)
            handler(this, eventArgs);
    },
    raiseCollapsed: function(eventArgs) {
        Sys.Extended.Deprecated("raiseCollapsed", "raise_collapsed");
        this.raise_collapsed(eventArgs);
    },

    /// <summary>
    /// Fires when collapse completes
    /// </summary>
    /// <event add="add_collapseComplete" remove="remove_collapseComplete" raise="raise_collapseComplete" />
    /// <member name="cE:AjaxControlToolkit.CollapsiblePanelExtender.collapseComplete" />
    add_collapseComplete: function(handler) {
        // Add a handler to the collapseComplete event
        // Obsolete: Use the collapsed event instead
    	this.get_events().addHandler('collapseComplete', handler);
    },
    remove_collapseComplete: function(handler) {
        // Remove a handler from the collapseComplete event
        // Obsolete: Use the collapsed event instead
    	this.get_events().removeHandler('collapseComplete', handler);
    },
    raise_collapseComplete: function() {
        // Obsolete: Use the collapsed event instead
        var handlers = this.get_events().getHandler('collapseComplete');

        if(handlers)
            handlers(this, Sys.EventArgs.Empty);
    },
    raiseCollapseComplete: function() {
        Sys.Extended.Deprecated("raiseCollapseComplete", "raise_collapseComplete");
        this.raise_collapseComplete();
    },
    
    /// <summary>
    /// Fires when control is expanding
    /// </summary>
    /// <event add="add_expanding" remove="remove_expanding" raise="raise_expanding" />
    /// <member name="cE:AjaxControlToolkit.CollapsiblePanelExtender.expanding" />
    add_expanding: function(handler) {
        // Add an event handler for the expanding event
        this.get_events().addHandler('expanding', handler);
    },
    remove_expanding: function(handler) {
        // Remove an event handler from the expanding event
        this.get_events().removeHandler('expanding', handler);
    },
    raise_expanding: function(eventArgs) {
        // Raise the expanding event
        var handler = this.get_events().getHandler('expanding');

        if(handler)
            handler(this, eventArgs);
    },
    raiseExpanding : function(eventArgs) {
        Sys.Extended.Deprecated("raiseExpanding", "raise_expanding");
        this.raise_expanding(eventArgs);
    },
    
    /// <summary>
    /// Fires when control is expanded
    /// </summary>
    /// <event add="add_expanded" remove="remove_expanded" raise="raise_expanded" />
    /// <member name="cE:AjaxControlToolkit.CollapsiblePanelExtender.expanded" />
    add_expanded: function(handler) {
        // Add an event handler for the expanded event
        this.get_events().addHandler('expanded', handler);
    },
    remove_expanded: function(handler) {
        // Remove an event handler from the expanded event
        this.get_events().removeHandler('expanded', handler);
    },
    raise_expanded: function(eventArgs) {
        // Raise the expanded event
        var handler = this.get_events().getHandler('expanded');

        if(handler)
            handler(this, eventArgs);
    },
    raiseExpanded: function(eventArgs) {
        Sys.Extended.Deprecated("raiseExpanded", "raise_expanded");
        this.raise_expanded(eventArgs);
    },
    
    /// <summary>
    /// Fires when expand completes
    /// </summary>
    /// <event add="add_expandComplete" remove="remove_expandComplete" raise="raise_expandComplete" />
    /// <member name="cE:AjaxControlToolkit.CollapsiblePanelExtender.expandComplete" />
    add_expandComplete: function(handler) {
        // Add a handler to the expandComplete event
        // Obsolete: Use the expanded event instead
    	this.get_events().addHandler('expandComplete', handler);
    },
    remove_expandComplete: function(handler) {
        // Remove a handler from the expandComplete event
        // Obsolete: Use the expanded event instead
    	this.get_events().removeHandler('expandComplete', handler);
    },
    raise_expandComplete: function() {
        // Obsolete: Use the expanded event instead
        var handlers = this.get_events().getHandler('expandComplete');
        if(handlers) {
            handlers(this, Sys.EventArgs.Empty);
        }
    },
    raiseExpandComplete: function() {
        Sys.Extended.Deprecated("raiseExpandComplete", "raise_expandComplete");
        this.raise_expandComplete();
    },

    /// <summary>
    /// Wrap the height of the panel
    /// </summary>
    /// <getter>get_targetHeight</getter>
    /// <setter>set_targetHeight</setter>
    /// <member name="cP:AjaxControlToolkit.CollapsiblePanelExtender.targetHeight" />
    get_targetHeight: function() {
        return this.get_element().offsetHeight; 
    },
    set_targetHeight: function(value) {
        this.get_element().style.height = value + "px";
        this.raisePropertyChanged('targetHeight');
    },

    get_TargetHeight: function() {
        Sys.Extended.Deprecated("get_TargetHeight", "get_targetHeight");
        return this.get_targetHeight();
    },
    set_TargetHeight: function(value) {
        Sys.Extended.Deprecated("set_TargetHeight", "set_targetHeight");
        this.set_targetHeight(value);
    },
    
    /// <summary>
    /// Wrap the width of the panel
    /// </summary>
    /// <getter>get_targetWidth</getter>
    /// <setter>set_targetWidth</setter>
    /// <member name="cP:AjaxControlToolkit.CollapsiblePanelExtender.targetWidth" />
    get_targetWidth: function() {
        return this.get_element().offsetWidth;
    },
    set_targetWidth: function(value) {
        this.get_element().style.width = value + "px";
        this.raisePropertyChanged('targetWidth');
    },

    get_TargetWidth: function() {
        Sys.Extended.Deprecated("get_TargetWidth", "get_targetWidth");
        return this.get_targetWidth();
    },
    set_TargetWidth: function(value) {
        Sys.Extended.Deprecated("set_TargetWidth", "set_targetWidth");
        this.set_targetWidth(value);
    },
    
    /// <summary>
    /// Whether or not the panel is collapsed
    /// </summary>
    /// <getter>get_collapsed</getter>
    /// <setter>set_collapsed</setter>
    /// <member name="cP:AjaxControlToolkit.CollapsiblePanelExtender.collapsed" />
    get_collapsed: function() {
        return this._collapsed;
    },
    set_collapsed: function(value) {
        // if we're changing values, and we're live, togglePanel.
        if(this.get_isInitialized() && this.get_element() && value != this.get_collapsed()) {
            this.togglePanel();
        } else {
            this._collapsed = value;
            this.raisePropertyChanged('collapsed');
        }
    },

    get_Collapsed: function() {
        Sys.Extended.Deprecated("get_Collapsed", "get_collapsed");
        return this.get_collapsed();
    },
    set_Collapsed: function(value) {
        Sys.Extended.Deprecated("set_Collapsed", "set_collapsed");
        this.set_collapsed(value);
    },
    
    /// <summary>
    /// The size of the target, in pixels, when it is in the collapsed state
    /// </summary>
    /// <getter>get_collapsedSize</getter>
    /// <setter>set_collapsedSize</setter>
    /// <member name="cP:AjaxControlToolkit.CollapsiblePanelExtender.collapsedSize" />
    get_collapsedSize: function() {
        return this._collapsedSize;
    },
    set_collapsedSize: function(value) {
        if(this._collapsedSize != value) {
            this._collapsedSize = value;
            this.raisePropertyChanged('collapsedSize');
        }
    },

    get_CollapsedSize: function() {
        Sys.Extended.Deprecated("get_CollapsedSize", "get_collapsedSize");
        return this.get_collapsedSize();
    },
    set_CollapsedSize: function(value) {
        Sys.Extended.Deprecated("set_CollapsedSize", "set_collapsedSize");
        this.set_collapsedSize(value);
    },
    
    /// <summary>
    /// The size of the target, in pixels, when it is in the expanded state
    /// </summary>
    /// <getter>get_expandedSize</getter>
    /// <setter>set_expandedSize</setter>
    /// <member name="cP:AjaxControlToolkit.CollapsiblePanelExtender.expandedSize" />
    get_expandedSize: function() {
        return this._expandedSize;
    },
    set_expandedSize: function(value) {
        if(this._expandedSize != value) {
            this._expandedSize = value;
            this.raisePropertyChanged('expandedSize');
        }
    },

    get_ExpandedSize: function() {
        Sys.Extended.Deprecated("get_ExpandedSize", "get_expandedSize");
        return this.get_expandedSize();
    },
    set_ExpandedSize: function(value) {
        Sys.Extended.Deprecated("set_ExpandedSize", "set_expandedSize");
        this.set_expandedSize(value);
    },
    
    /// <summary>
    /// ID of the control used to collapse the target when clicked
    /// </summary>
    /// <getter>get_collapseControlID</getter>
    /// <setter>set_collapseControlID</setter>
    /// <member name="cP:AjaxControlToolkit.CollapsiblePanelExtender.collapseControlID" />
    get_collapseControlID: function() {
        return this._collapseControlID;
    },
    set_collapseControlID: function(value) {
        if(this._collapseControlID != value) {
            this._collapseControlID = value;
            this.raisePropertyChanged('collapseControlID');
        }
    },

    get_CollapseControlID: function() {
        Sys.Extended.Deprecated("get_CollapseControlID", "get_collapseControlID");
        return this.get_collapseControlID();
    },
    set_CollapseControlID: function(value) {
        Sys.Extended.Deprecated("set_CollapseControlID", "set_collapseControlID");
        this.set_collapseControlID(value);
    },
    
    /// <summary>
    /// ID of the control used to expand the target when clicked
    /// </summary>
    /// <getter>get_expandControlID</getter>
    /// <setter>set_expandControlID</setter>
    /// <member name="cP:AjaxControlToolkit.CollapsiblePanelExtender.expandControlID" />
    get_expandControlID: function() {
        return this._expandControlID;
    },
    set_expandControlID: function(value) {
        if (this._expandControlID != value) {
            this._expandControlID = value;
            this.raisePropertyChanged('expandControlID');
        }
    },

    get_ExpandControlID: function() {
        Sys.Extended.Deprecated("get_ExpandControlID", "get_expandControlID");
        return this.get_expandControlID();
    },
    set_ExpandControlID: function(value) {
        Sys.Extended.Deprecated("set_ExpandControlID", "set_expandControlID");
        this.set_expandControlID(value);
    },
    
    /// <summary>
    /// Whether to add a scrollbar when the contents are larger than the target
    /// (the contents will be clipped if false)
    /// </summary>
    /// <getter>get_scrollContents</getter>
    /// <setter>set_scrollContents</setter>
    /// <member name="cP:AjaxControlToolkit.CollapsiblePanelExtender.scrollContents" />
    get_scrollContents: function() {
        return this._scrollContents;
    },
    set_scrollContents: function(value) {
        if (this._scrollContents != value) {
            this._scrollContents = value;
            this.raisePropertyChanged('scrollContents');
        }
    },

    get_ScrollContents: function() {
        Sys.Extended.Deprecated("get_ScrollContents", "get_scrollContents");
        return this.get_scrollContents();
    },
    set_ScrollContents: function(value) {
        Sys.Extended.Deprecated("set_ScrollContents", "set_scrollContents");
        this.set_scrollContents(value);
    },
    
    /// <summary>
    /// Whether or not to suppress postbacks generated when the CollapseControlID or
    /// ExpandControlID elements are clicked
    /// </summary>
    /// <getter>get_suppressPostBack</getter>
    /// <setter>set_suppressPostBack</setter>
    /// <member name="cP:AjaxControlToolkit.CollapsiblePanelExtender.suppressPostBack" />
    get_suppressPostBack: function() {
        return this._suppressPostBack;
    },
    set_suppressPostBack: function(value) {
        if (this._suppressPostBack != value) {
            this._suppressPostBack = value;
            this.raisePropertyChanged('suppressPostBack');
        }
    },

    get_SuppressPostBack: function() {
        Sys.Extended.Deprecated("get_SuppressPostBack", "get_suppressPostBack");
        return this.get_suppressPostBack();
    },
    set_SuppressPostBack: function(value) {
        Sys.Extended.Deprecated("set_SuppressPostBack", "set_suppressPostBack");
        this.set_suppressPostBack(value);
    },
    
    /// <summary>
    /// ID of the element where the "status text" for the target will be placed
    /// </summary>
    /// <getter>get_textLabelID</getter>
    /// <setter>set_textLabelID</setter>
    /// <member name="cP:AjaxControlToolkit.CollapsiblePanelExtender.textLabelID" />
    get_textLabelID: function() {
        return this._textLabelID;
    },
    set_textLabelID: function(value) {
        if (this._textLabelID != value) {
            this._textLabelID = value;
            this.raisePropertyChanged('textLabelID');
        }
    },

    get_TextLabelID: function() {
        Sys.Extended.Deprecated("get_TextLabelID", "get_textLabelID");
        return this.get_textLabelID();
    },
    set_TextLabelID: function(value) {
        Sys.Extended.Deprecated("set_TextLabelID", "set_textLabelID");
        this.set_textLabelID(value);
    },
    
    /// <summary>
    /// Text to show in the element specified by TextLabelID when the target is expanded.
    /// This text is also used as the alternate text of the image if ImageControlID has been provided
    /// </summary>
    /// <getter>get_expandedText</getter>
    /// <setter>set_expandedText</setter>
    /// <member name="cP:AjaxControlToolkit.CollapsiblePanelExtender.expandedText" />
    get_expandedText: function() {
        return this._expandedText;
    },
    set_expandedText: function(value) {
        if (this._expandedText != value) {
            this._expandedText = value;
            this.raisePropertyChanged('expandedText');
        }
    },

    get_ExpandedText: function() {
        Sys.Extended.Deprecated("get_ExpandedText", "get_expandedText");
        return this.get_expandedText();
    },
    set_ExpandedText: function(value) {
        Sys.Extended.Deprecated("set_ExpandedText", "set_expandedText");
        this.set_expandedText(value);
    },
    
    /// <summary>
    /// Text to show in the element specified by TextLabelID when the target is collapsed. 
    /// This text is also used as the alternate text of the image if ImageControlID has been provided
    /// </summary>
    /// <getter>get_collapsedText</getter>
    /// <setter>set_collapsedText</setter>
    /// <member name="cP:AjaxControlToolkit.CollapsiblePanelExtender.collapsedText" />
    get_collapsedText: function() {
        return this._collapsedText;
    },
    set_collapsedText: function(value) {
        if (this._collapsedText != value) {
            this._collapsedText = value;
            this.raisePropertyChanged('collapsedText');
        }
    },

    get_CollapsedText: function() {
        Sys.Extended.Deprecated("get_CollapsedText", "get_collapsedText");
        return this.get_collapsedText();
    },
    set_CollapsedText: function(value) {
        Sys.Extended.Deprecated("set_CollapsedText", "set_collapsedText");
        this.set_collapsedText(value);  
    },
    
    /// <summary>
    /// ID of the <img> element where an icon indicating the collapsed status of the target will be placed
    /// </summary>
    /// <getter>get_imageControlID</getter>
    /// <setter>set_imageControlID</setter>
    /// <member name="cP:AjaxControlToolkit.CollapsiblePanelExtender.imageControlID" />
    get_imageControlID: function() {
        return this._imageControlID;
    },
    set_imageControlID: function(value) {
        if (this._imageControlID != value) {
            this._imageControlID = value;
            this.raisePropertyChanged('imageControlID');
        }
    },

    get_ImageControlID: function() {
        Sys.Extended.Deprecated("get_ImageControlID", "get_imageControlID");
        return this.get_imageControlID();
    },
    set_ImageControlID: function(value) {
        Sys.Extended.Deprecated("set_ImageControlID", "set_imageControlID");
        this.set_imageControlID();  
    },
    
    /// <summary>
    /// Path to an image to show in the element specified by ImageControlID when the target is expanded
    /// </summary>
    /// <getter>get_expandedImage</getter>
    /// <setter>set_expandedImage</setter>
    /// <member name="cP:AjaxControlToolkit.CollapsiblePanelExtender.expandedImage" />
    get_expandedImage: function() {
        return this._expandedImage;
    },
    set_expandedImage: function(value) {
        if (this._expandedImage != value) {
            this._expandedImage = value;
            this.raisePropertyChanged('expandedImage');
        }
    },

    get_ExpandedImage: function() {
        Sys.Extended.Deprecated("get_ExpandedImage", "get_expandedImage");
        return this.get_expandedImage();
    },
    set_ExpandedImage: function(value) {
        Sys.Extended.Deprecated("set_ExpandedImage", "set_expandedImage");
        this.set_expandedImage(value);  
    },
    
    /// <summary>
    /// Path to an image to show in the element specified by ImageControlID when the target is collapsed
    /// </summary>
    /// <getter>get_collapsedImage</getter>
    /// <setter>set_collapsedImage</setter>
    /// <member name="cP:AjaxControlToolkit.CollapsiblePanelExtender.collapsedImage" />
    get_collapsedImage: function() {
        return this._collapsedImage;
    },
    set_collapsedImage: function(value) {
        if (this._collapsedImage != value) {
            this._collapsedImage = value;
            this.raisePropertyChanged('collapsedImage');
        }
    },

    get_CollapsedImage : function() {
        Sys.Extended.Deprecated("get_CollapsedImage", "get_collapsedImage");
        return this.get_collapsedImage();
    },
    set_CollapsedImage : function(value) {
        Sys.Extended.Deprecated("set_CollapsedImage", "set_collapsedImage");
        this.set_collapsedImage();  
    },

    /// <summary>
    /// Whether to automatically expand the target when the mouse is moved over it
    /// </summary>
    /// <getter>get_autoExpand</getter>
    /// <setter>set_autoExpand</setter>
    /// <member name="cP:AjaxControlToolkit.CollapsiblePanelExtender.autoExpand" />
    get_autoExpand: function() {
        return this._autoExpand;
    },
    set_autoExpand: function(value) {
        if (this._autoExpand != value) {
            this._autoExpand = value;
            this.raisePropertyChanged('autoExpand');
        }
    },

    get_AutoExpand: function() {
        Sys.Extended.Deprecated("get_AutoExpand", "get_autoExpand");
        return this.get_autoExpand();
    },
    set_AutoExpand: function(value) {
        Sys.Extended.Deprecated("set_AutoExpand", "set_autoExpand");
        this.set_autoExpand(value);
    },

    /// <summary>
    /// Whether to automatically collapse the target when the mouse is moved off of it
    /// </summary>
    /// <getter>get_autoCollapse</getter>
    /// <setter>set_autoCollapse</setter>
    /// <member name="cP:AjaxControlToolkit.CollapsiblePanelExtender.autoCollapse" />
    get_autoCollapse: function() {
        return this._autoCollapse;
    },
    set_autoCollapse: function(value) {
        if (this._autoCollapse != value) {
            this._autoCollapse = value;
            this.raisePropertyChanged('autoCollapse');
        }
    },

    get_AutoCollapse: function() {
        Sys.Extended.Deprecated("get_AutoCollapse", "get_autoCollapse");
        return this.get_autoCollapse();
    },
    set_AutoCollapse: function(value) {
        Sys.Extended.Deprecated("set_AutoCollapse", "set_autoCollapse");
        this.set_autoCollapse(value);
    },
    
    /// <summary>
    /// Direction the panel will expand and collapse (can be either "Vertical" or "Horizontal")
    /// </summary>
    /// <getter>get_expandDirection</getter>
    /// <setter>set_expandDirection</setter>
    /// <member name="cP:AjaxControlToolkit.CollapsiblePanelExtender.expandDirection" />
    get_expandDirection: function() {
        return this._expandDirection == Sys.Extended.UI.CollapsiblePanelExpandDirection.Vertical;
    },
    set_expandDirection: function(value) {
        if (this._expandDirection != value) {
            this._expandDirection = value;
            this.raisePropertyChanged('expandDirection');
        }
    },

    get_ExpandDirection: function() {
        Sys.Extended.Deprecated("get_ExpandDirection", "get_expandDirection");
        return this.get_expandDirection();
    },
    set_ExpandDirection: function(value) {
        Sys.Extended.Deprecated("set_ExpandDirection", "set_expandDirection");
        this.set_expandDirection(value);
    }
}
Sys.Extended.UI.CollapsiblePanelBehavior.registerClass('Sys.Extended.UI.CollapsiblePanelBehavior', Sys.Extended.UI.BehaviorBase);