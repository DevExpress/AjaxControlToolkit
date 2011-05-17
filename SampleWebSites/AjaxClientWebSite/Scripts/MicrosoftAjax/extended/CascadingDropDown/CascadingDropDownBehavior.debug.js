// (c) 2010 CodePlex Foundation



/// <reference name="MicrosoftAjax.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />

(function() {
var scriptName = "ExtendedCascadingDropDown";

function execute() {

Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.CascadingDropDownSelectionChangedEventArgs = function(oldValue, newValue) {
    /// <summary>
    /// Event arguments used when the selectionChanged event is raised
    /// </summary>
    /// <param name="oldValue" type="String" mayBeNull="true">
    /// Previous selection
    /// </param>
    /// <param name="newValue" type="String" mayBeNull="true">
    /// New selection
    /// </param>
    Sys.Extended.UI.CascadingDropDownSelectionChangedEventArgs.initializeBase(this);
    
    this._oldValue = oldValue;
    this._newValue = newValue;
}
Sys.Extended.UI.CascadingDropDownSelectionChangedEventArgs.prototype = {
    get_oldValue : function() {
        /// <value type="String" mayBeNull="true">
        /// Previous selection
        /// </value>
        return this._oldValue;
    },
    
    get_newValue : function() {
        /// <value type="String" mayBeNull="true">
        /// New selection
        /// </value>
        return this._newValue;
    }
}
Sys.Extended.UI.CascadingDropDownSelectionChangedEventArgs.registerClass('Sys.Extended.UI.CascadingDropDownSelectionChangedEventArgs', Sys.EventArgs);

Sys.Extended.UI.CascadingDropDownBehavior = function(e) {
    /// <summary>
    /// The CascadingDropDownBehavior is used to populate drop downs with values from a web service
    /// </summary>
    /// <param name="e" type="Sys.UI.DomElement" domElement="true">
    /// The DOM element the behavior is associated with
    /// </param>
    Sys.Extended.UI.CascadingDropDownBehavior.initializeBase(this, [e]);

    this._parentControlID = null;
    this._category = null;
    this._promptText = null;
    this._loadingText = null;
    this._promptValue = null;
    this._emptyValue = null;
    this._emptyText = null;

    this._servicePath = location.pathname;

    this._serviceMethod = null;
    
    this._contextKey = null;
    
    this._useContextKey = false;

    this._parentElement = null;
    this._changeHandler = null;
    this._parentChangeHandler = null;
    this._lastParentValues = null;
    this._selectedValue = null;
}
Sys.Extended.UI.CascadingDropDownBehavior.prototype = {
    initialize : function() {
        /// <summary>
        /// Initialize the behavior
        /// </summary>
        /// <returns />
        Sys.Extended.UI.CascadingDropDownBehavior.callBaseMethod(this, 'initialize');
        $common.prepareHiddenElementForATDeviceUpdate();

        var e = this.get_element();

        this._clearItems();

        e.CascadingDropDownCategory = this._category;

        this._changeHandler = Function.createDelegate(this, this._onChange);
        $addHandler(e, "change",this._changeHandler);
        
        if (this._parentControlID) {
            this._parentElement = $get(this._parentControlID);
                    
            if (!this._parentElement) {
                Sys.Debug.fail(String.format(Sys.Extended.UI.Resources.CascadingDropDown_NoParentElement, this._parentControlID));
            }
            
            if (this._parentElement) {
                e.CascadingDropDownParentControlID = this._parentControlID;
                this._parentChangeHandler = Function.createDelegate(this, this._onParentChange);
                
                $addHandler(this._parentElement, "change", this._parentChangeHandler);
                if (!this._parentElement.childDropDown) {
                    this._parentElement.childDropDown = new Array();
                }
                this._parentElement.childDropDown.push(this);
            }
        }

        this._onParentChange(null, true);
    },

    dispose : function() {
        /// <summary>
        /// Dispose the behavior
        /// </summary>
        /// <returns />

        var e = this.get_element();

        if (this._changeHandler) {            
            $removeHandler(e, "change", this._changeHandler);
            this._changeHandler = null;
        }

        if (this._parentChangeHandler) {
            if (this._parentElement) {                
                $removeHandler(this._parentElement, "change", this._parentChangeHandler);
            }
            this._parentChangeHandler = null;
        }

        Sys.Extended.UI.CascadingDropDownBehavior.callBaseMethod(this, 'dispose');
    },

    _clearItems : function() {
        /// <summary>
        /// Clear the items from the drop down
        /// </summary>
        /// <returns />

        var e = this.get_element();
        while (0 < e.options.length) {
            e.remove(0);
        }
    },

    _isPopulated : function() {
        /// <summary>
        /// Determine whether the drop down has any items
        /// </summary>
        /// <returns type="Boolean">
        /// Whether the drop down has any items
        /// </returns>

        var items = this.get_element().options.length;

        if (this._promptText) {
            return items > 1;
        } else {
            return items > 0;
        }
    },

    _setOptions : function(list, inInit, gettingList) {
        /// <summary>
        /// Set the contents of the DropDownList to the specified list
        /// </summary>
        /// <param name="list" mayBeNull="true" elementType="Object">
        /// Array of options (where each option has name and value properties)
        /// </param>
        /// <param name="inInit" type="Boolean" optional="true">
        /// Whether this is being called from the initialize method
        /// </param>
        /// <param name="gettingList" type="Boolean" optional="true">
        /// Whether we are fetching the list of options from the web service
        /// </param>
        /// <returns />

        if (!this.get_isInitialized()) {
            return;
        }

        var e = this.get_element();
        this._clearItems();

        var headerText;
        var headerValue = "";
        if (gettingList && this._loadingText) {
            headerText = this._loadingText;
            if ( this._selectedValue) {
                headerValue = this._selectedValue;
            }
        } else if (!gettingList && list && (0 == list.length) && (null != this._emptyText)) {
            headerText = this._emptyText;
            if (this._emptyValue) {
                headerValue = this._emptyValue;
            }
        } else if (this._promptText) {
            headerText = this._promptText;
            if (this._promptValue) {
                headerValue = this._promptValue;
            }
        }
        var optionElement; 
        if (headerText) {
            optionElement = new Option(headerText, headerValue);
            e.options[e.options.length] = optionElement;
        }

        var selectedValueOption = null,
            defaultIndex = -1;

        if (list) {
            for (i = 0 ; i < list.length ; i++) {
                var item = list[i], 
                    listItemName = item.name,
                    listItemValue = item.value,
                    listItemOptionTitle = item.optionTitle;
                
                if (item.isDefaultValue) {
                    defaultIndex = i;
                    if (this._promptText) {
                        defaultIndex++;
                    }
                }

                optionElement = new Option(listItemName, listItemValue);
                if (listItemValue == this._selectedValue) {
                    selectedValueOption = optionElement;
                }
                if (listItemOptionTitle) {
                    optionElement.setAttribute('title', listItemOptionTitle);
                }

                e.options[e.options.length] = optionElement;
            }
            if (selectedValueOption) {
                selectedValueOption.selected = true;
            }
        }
        
        if (selectedValueOption) {
            this.set_SelectedValue(e.options[e.selectedIndex].value, e.options[e.selectedIndex].text);
        } else if (!selectedValueOption && defaultIndex != -1) {
            e.options[defaultIndex].selected = true;
            this.set_SelectedValue(e.options[defaultIndex].value, e.options[defaultIndex].text);
        } else if (!inInit && !selectedValueOption && !gettingList && !this._promptText && (e.options.length > 0)) {
            this.set_SelectedValue(e.options[0].value, e.options[0].text);
        } else if (!inInit && !selectedValueOption && !gettingList) {
            this.set_SelectedValue('', '');
        }

        if (e.childDropDown && !gettingList) {
            for(i = 0; i < e.childDropDown.length; i++) {
                e.childDropDown[i]._onParentChange();
            }
        }
        else {
            if (list && (Sys.Browser.agent !== Sys.Browser.Safari) && (Sys.Browser.agent !== Sys.Browser.Opera)) {
                if (document.createEvent) {
                    var onchangeEvent = document.createEvent('HTMLEvents');
                    onchangeEvent.initEvent('change', true, false);
                    this.get_element().dispatchEvent(onchangeEvent);
                } else if( document.createEventObject ) {
                    this.get_element().fireEvent('onchange');
                }
            }
        }

        if (this._loadingText || this._promptText || this._emptyText) {
            e.disabled = !list || (0 == list.length);
        }

        this.raisePopulated(Sys.EventArgs.Empty);
    },

    _onChange : function() {
        /// <summary>
        /// Handler for the drop down's change event
        /// </summary>
        /// <returns />

        if (!this._isPopulated()) {
            return;
        }

        var e = this.get_element();
        
        if ((-1 != e.selectedIndex) && !(this._promptText && (0 == e.selectedIndex))) {
            this.set_SelectedValue(e.options[e.selectedIndex].value, e.options[e.selectedIndex].text, e.options[e.selectedIndex].title);
        } else {
            this.set_SelectedValue('', '');
        }
    },

    _onParentChange : function(evt, inInit) {
        /// <summary>
        /// Handler for the parent drop down's change event
        /// </summary>
        /// <param name="evt" type="Object">
        /// Set by the browser when called as an event handler (unused here)
        /// </param>
        /// <param name="inInit" type="Boolean">
        /// Whether this is being called from the initialize method
        /// </param>
        /// <returns />

        var e = this.get_element();

        var knownCategoryValues = '';
        var parentControlID = this._parentControlID;
        while (parentControlID) {
            var parentElement = $get(parentControlID);
            if (parentElement && (-1 != parentElement.selectedIndex)){
                var selectedValue = parentElement.options[parentElement.selectedIndex].value;
                
                if (selectedValue && selectedValue != "") {
                    knownCategoryValues = parentElement.CascadingDropDownCategory + ':' + selectedValue + ';' + knownCategoryValues;
                    parentControlID = parentElement.CascadingDropDownParentControlID;
                    continue;
                }
            } 
            break;
        }
        
        if (knownCategoryValues != '' && this._lastParentValues == knownCategoryValues) {
            return;
        }
        
        this._lastParentValues = knownCategoryValues;
        
        if (knownCategoryValues == '' && this._parentControlID) {
            this._setOptions(null, inInit);
            return;
        }

        this._setOptions(null, inInit, true);

        if (this._servicePath && this._serviceMethod) {
            var eventArgs = new Sys.CancelEventArgs();
            this.raisePopulating(eventArgs);
            if (eventArgs.get_cancel()) {
                return;
            }
            
            var params = { knownCategoryValues:knownCategoryValues, category:this._category };
            if (this._useContextKey) {
                params.contextKey = this._contextKey;
            }
        
            Sys.Net.WebServiceProxy.invoke(this._servicePath, this._serviceMethod, false, params,
                Function.createDelegate(this, this._onMethodComplete), Function.createDelegate(this, this._onMethodError));
            $common.updateFormToRefreshATDeviceBuffer();
        }
    },

    _onMethodComplete : function(result, userContext, methodName) {
        this._setOptions(result);
    },

    _onMethodError : function(webServiceError, userContext, methodName) {
        if (webServiceError.get_timedOut()) {
            this._setOptions( [ this._makeNameValueObject(Sys.Extended.UI.Resources.CascadingDropDown_MethodTimeout) ] );
        } else {
            this._setOptions( [ this._makeNameValueObject(String.format(Sys.Extended.UI.Resources.CascadingDropDown_MethodError, webServiceError.get_statusCode())) ] );
        }
    },

    _makeNameValueObject : function(message) {
        /// <summary>
        /// Create an object with name and value properties set to the provided message
        /// </summary>
        /// <param name="message" type="String">
        /// Message
        /// </param>
        /// <returns type="Object">
        /// Object with name and value properties set to the message
        /// </returns>

        return { 'name': message, 'value': message };
    },

    get_ParentControlID : function() {
        /// <value type="String">
        /// ID of the parent drop down in a hierarchy of drop downs
        /// </value>
       return this._parentControlID;
    },
    set_ParentControlID : function(value) {
        if (this._parentControlID != value) {
            this._parentControlID = value;
            this.raisePropertyChanged('ParentControlID');
        }
    },

    get_Category : function() {
        /// <value type="String">
        /// Category of this drop down
        /// </value>
        return this._category;
    },
    set_Category : function(value) {
        if (this._category != value) {
            this._category = value;
            this.raisePropertyChanged('Category');
        }
    },

    get_PromptText : function() {
        /// <value type="String">
        /// Prompt text displayed as the first entry in the drop down
        /// </value>
        return this._promptText;
    },
    set_PromptText : function(value) {
        if (this._promptText != value) {
            this._promptText = value;
            this.raisePropertyChanged('PromptText');
        }
    },

    get_PromptValue : function() {
        /// <value type="String">
        /// Value for the option displayed by a DropDownList showing the PromptText
        /// </value>
        return this._promptValue;
    },
    set_PromptValue : function(value) {
        if (this._promptValue != value) {
            this._promptValue = value;
            this.raisePropertyChanged('PromptValue');
        }
    },

    get_EmptyText : function() {
        /// <value type="String">
        /// Text for the option displayed when the list is empty
        /// </value>
        return this._emptyText;
    },
    set_EmptyText : function(value) {
        if (this._emptyText != value) {
            this._emptyText = value;
            this.raisePropertyChanged('EmptyText');
        }
    },

    get_EmptyValue : function() {
        /// <value type="String">
        /// Value for the option displayed when the list is empty
        /// </value>
        return this._emptyValue;
    },
    set_EmptyValue : function(value) {
        if (this._emptyValue != value) {
            this._emptyValue = value;
            this.raisePropertyChanged('EmptyValue');
        }
    },

    get_LoadingText : function() {
        /// <value type="String">
        /// Loading text to to be displayed when getting the drop down's values from the web service
        /// </value>
        return this._loadingText;
    },
    set_LoadingText : function(value) {
        if (this._loadingText != value) {
            this._loadingText = value;
            this.raisePropertyChanged('LoadingText');
        }
    },

    get_SelectedValue : function() {
         /// <value type="String">
         /// Selected value of the drop down
         /// </value>
        return this._selectedValue;
    },
    set_SelectedValue : function(value, text, title) {
        if (this._selectedValue != value) {
            if (!text) {
                var i = value.indexOf(':::');
                if (-1 != i) {
                    text = value.slice(i + 3);
                    value = value.slice(0, i);

                    i = text.indexOf(':::');
                    if (-1 != i) {
                        title = text.slice(i + 3);
                        text = text.slice(0, i);
                    }
                }
            }
            var oldValue = this._selectedValue;
            this._selectedValue = value;
            this.raisePropertyChanged('SelectedValue');
            this.raiseSelectionChanged(new Sys.Extended.UI.CascadingDropDownSelectionChangedEventArgs(oldValue, value));
        }
        Sys.Extended.UI.CascadingDropDownBehavior.callBaseMethod(this, 'set_ClientState', [ this._selectedValue+':::' + text+':::' + (title ? (':::' + title) : '') ]);
    },

    get_ServicePath : function() {
        /// <value type="String" mayBeNull="true">
        /// Path to the web service
        /// </value>
        return this._servicePath;
    },
    set_ServicePath : function(value) {
        if (this._servicePath != value) {
            this._servicePath = value;
            this.raisePropertyChanged('ServicePath');
        }
    },

    get_ServiceMethod : function() {
        /// <value type="String">
        /// Name of the method to invoke on the web service
        /// </value>
        return this._serviceMethod;
    },
    set_ServiceMethod : function(value) {
        if (this._serviceMethod != value) {
            this._serviceMethod = value;
            this.raisePropertyChanged('ServiceMethod');
        }
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
    
    add_selectionChanged : function(handler) {
        /// <summary>
        /// Add an event handler for the selectionChanged event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('selectionChanged', handler);
    },
    remove_selectionChanged : function(handler) {
        /// <summary>
        /// Remove an event handler from the selectionChanged event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('selectionChanged', handler);
    },
    raiseSelectionChanged : function(eventArgs) {
        /// <summary>
        /// Raise the selectionChanged event
        /// </summary>
        /// <param name="eventArgs" type="Sys.Extended.UI.CascadingDropDownSelectionChangedEventArgs" mayBeNull="false">
        /// Event arguments for the selectionChanged event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('selectionChanged');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_populating : function(handler) {
        /// <summary>
        /// Add an event handler for the populating event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('populating', handler);
    },
    remove_populating : function(handler) {
        /// <summary>
        /// Remove an event handler from the populating event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('populating', handler);
    },
    raisePopulating : function(eventArgs) {
        /// <summary>
        /// Raise the populating event
        /// </summary>
        /// <param name="eventArgs" type="Sys.CancelEventArgs" mayBeNull="false">
        /// Event arguments for the populating event
        /// </param>
        /// <returns />
        /// <remarks>
        /// The populating event can be used to provide custom data to
        /// CascadingDropDown instead of using a web service.  Just cancel the
        /// event (using the CancelEventArgs) and pass your own data to the
        /// _setOptions method.
        /// </remarks>
        
        var handler = this.get_events().getHandler('populating');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_populated : function(handler) {
        /// <summary>
        /// Add an event handler for the populated event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('populated', handler);
    },
    remove_populated : function(handler) {
        /// <summary>
        /// Remove an event handler from the populated event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('populated', handler);
    },
    raisePopulated : function(eventArgs) {
        /// <summary>
        /// Raise the populated event
        /// </summary>
        /// <param name="eventArgs" type="Sys.EventArgs" mayBeNull="false">
        /// Event arguments for the populated event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('populated');
        if (handler) {
            handler(this, eventArgs);
        }
    }
}
Sys.Extended.UI.CascadingDropDownBehavior.registerClass('Sys.Extended.UI.CascadingDropDownBehavior', Sys.Extended.UI.BehaviorBase);
Sys.registerComponent(Sys.Extended.UI.CascadingDropDownBehavior, { name: "cascadingDropDown" });

} // execute

if (window.Sys && Sys.loader) {
    Sys.loader.registerScript(scriptName, ["ExtendedBase", "ExtendedCommon", "WebServices"], execute);
}
else {
    execute();
}

})();
