Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.CascadingDropDownSelectionChangedEventArgs = function(oldValue, newValue) {
    Sys.Extended.UI.CascadingDropDownSelectionChangedEventArgs.initializeBase(this);

    this._oldValue = oldValue;
    this._newValue = newValue;
}
Sys.Extended.UI.CascadingDropDownSelectionChangedEventArgs.prototype = {
    get_oldValue: function() {
        return this._oldValue;
    },

    get_newValue: function() {
        return this._newValue;
    }
}
Sys.Extended.UI.CascadingDropDownSelectionChangedEventArgs.registerClass('Sys.Extended.UI.CascadingDropDownSelectionChangedEventArgs', Sys.EventArgs);

Sys.Extended.UI.CascadingDropDownBehavior = function(e) {
    // The CascadingDropDownBehavior is used to populate drop downs with values from a web service
    // "e" - the DOM element the behavior is associated with
    Sys.Extended.UI.CascadingDropDownBehavior.initializeBase(this, [e]);

    // Properties
    this._parentControlID = null;
    this._category = null;
    this._promptText = null;
    this._loadingText = null;
    this._promptValue = null;
    this._emptyValue = null;
    this._emptyText = null;

    // Path to the web service, defaulting to a page method
    this._servicePath = location.pathname;

    // Name of the web method
    this._serviceMethod = null;

    // User/page specific context provided to the web method
    this._contextKey = null;

    // Whether or not the the user/page specific context should be used
    this._useContextKey = false;

    // whether to use get or post
    this._useHttpGet = false;

    //Whether or not enable dropdown list at the time of loading data
    this._enableAtLoading = false;

    // Variables
    this._parentElement = null;
    this._changeHandler = null;
    this._parentChangeHandler = null;
    this._lastParentValues = null;
    this._selectedValue = null;
    this._actualDisabledStatus = false;
}

Sys.Extended.UI.CascadingDropDownBehavior.prototype = {
    initialize: function() {
        Sys.Extended.UI.CascadingDropDownBehavior.callBaseMethod(this, 'initialize');
        $common.prepareHiddenElementForATDeviceUpdate();

        var e = this.get_element();
        this._actualDisabledStatus = e.disabled;
        // Clear any items that may have been put there for server side convenience
        this._clearItems();

        e.CascadingDropDownCategory = this._category;

        // Attach change handler to self
        this._changeHandler = Function.createDelegate(this, this._onChange);
        $addHandler(e, "change", this._changeHandler);

        if(this._parentControlID) {
            // Set properties on element so that children controls (if any) can have easy access
            this._parentElement = $get(this._parentControlID);

            // Attach change handler to parent
            if(!this._parentElement) {
                Sys.Debug.fail(String.format(Sys.Extended.UI.Resources.CascadingDropDown_NoParentElement, this._parentControlID));
            }

            if(this._parentElement) {
                e.CascadingDropDownParentControlID = this._parentControlID;
                this._parentChangeHandler = Function.createDelegate(this, this._onParentChange);

                $addHandler(this._parentElement, "change", this._parentChangeHandler);
                if(!this._parentElement.childDropDown) {
                    this._parentElement.childDropDown = new Array();
                }
                this._parentElement.childDropDown.push(this);
            }
        }

        // Simulate parent change to populate self, even if no parent exists.
        this._onParentChange(null, true);

        // Revert disable status to the actual.
        var me = this;
        setTimeout(function() {
            if(me._actualDisabledStatus)
                e.disabled = me._actualDisabledStatus;
        }, 50);
    },

    dispose: function() {
        var e = this.get_element();

        // Detach change handler for self
        if(this._changeHandler) {
            $removeHandler(e, "change", this._changeHandler);
            this._changeHandler = null;
        }

        // Detach change handler for parent
        if(this._parentChangeHandler) {
            if(this._parentElement) {
                $removeHandler(this._parentElement, "change", this._parentChangeHandler);
            }
            this._parentChangeHandler = null;
        }

        Sys.Extended.UI.CascadingDropDownBehavior.callBaseMethod(this, 'dispose');
    },

    _clearItems: function() {
        var e = this.get_element();
        if(e != null && e.options != null) {
            while(0 < e.options.length) {
                e.remove(0);
            }
        }
    },

    _isPopulated: function() {
        var items = this.get_element().options.length;

        if(this._promptText) {
            return items > 1;
        } else {
            return items > 0;
        }
    },

    _setOptions: function(list, inInit, gettingList) {
        // Set the contents of the DropDownList to the specified list
        // "list" - array of options (where each option has name and value properties)
        // "inInit" - whether this is being called from the initialize method
        // "gettingList" - whether we are fetching the list of options from the web service
        if(!this.get_isInitialized()) {
            return;
        }

        var e = this.get_element();
        // Remove existing contents
        this._clearItems();

        // Populate prompt text (if available) 
        var headerText;
        var headerValue = "";
        if(gettingList && this._loadingText) {
            headerText = this._loadingText;
            if(this._selectedValue) {
                headerValue = this._selectedValue;
            }
        } else if(!gettingList && list && (0 == list.length) && (null != this._emptyText)) {
            headerText = this._emptyText;
            if(this._emptyValue) {
                headerValue = this._emptyValue;
            }
        } else if(this._promptText) {
            headerText = this._promptText;
            if(this._promptValue) {
                headerValue = this._promptValue;
            }
        }
        var optionElement;
        if(headerText) {
            optionElement = new Option(headerText, headerValue);
            e.options[e.options.length] = optionElement;
        }

        // Add each item to the DropDownList, selecting the previously selected item
        var selectedValueOption = null,
            defaultIndex = -1;

        if(list) {
            for(var i = 0; i < list.length; i++) {
                var item = list[i],
            listItemName = item.name,
            listItemValue = item.value,
            listItemOptionTitle = item.optionTitle;

                if(item.isDefaultValue) {
                    this.set_SelectedValue(listItemValue, listItemName, listItemOptionTitle);
                    defaultIndex = i;
                    if(this._promptText) {
                        // bump the index if there's a prompt item in the list.
                        //
                        defaultIndex++;
                    }
                }

                optionElement = new Option(listItemName, listItemValue);
                if(listItemValue == this._selectedValue) {
                    selectedValueOption = optionElement;
                }
                // Populate the title attribute with the optionTitle value provided by the service (shows tooltip over item on some
                // modern browsers)
                if(listItemOptionTitle) {
                    optionElement.setAttribute('title', listItemOptionTitle);
                }

                e.options[e.options.length] = optionElement;
            }
            if(selectedValueOption) {
                selectedValueOption.selected = true;
            }
        }

        // if we didn't match the selected value, and we found a default
        // item, select that one.
        //
        if(selectedValueOption) {
            // Call set_SelectedValue to store the text as well
            this.set_SelectedValue(e.options[e.selectedIndex].value, e.options[e.selectedIndex].text);
        } else if(!selectedValueOption && defaultIndex != -1) {
            e.options[defaultIndex].selected = true;
            this.set_SelectedValue(e.options[defaultIndex].value, e.options[defaultIndex].text);
        } else if(!inInit && !selectedValueOption && !gettingList && !this._promptText && (e.options.length > 0)) {
            // If no prompt text or default item, select the first item
            this.set_SelectedValue(e.options[0].value, e.options[0].text);
        } else if(!inInit && !selectedValueOption && !gettingList) {
            this.set_SelectedValue('', '');
        }

        if(e.childDropDown && !gettingList) {
            for(var i = 0; i < e.childDropDown.length; i++) {
                e.childDropDown[i]._onParentChange();
            }
        }
        else {
            if(list && (Sys.Browser.agent !== Sys.Browser.Safari) && (Sys.Browser.agent !== Sys.Browser.Opera)) {
                // Fire the onchange event for the control to notify any listeners of the change
                if(document.createEvent) {
                    var onchangeEvent = document.createEvent('HTMLEvents');
                    onchangeEvent.initEvent('change', true, false);
                    this.get_element().dispatchEvent(onchangeEvent);
                } else if(document.createEventObject) {
                    this.get_element().fireEvent('onchange');
                }
            }
        }

        // check whether to disable or not at loading.
        if(!this._enableAtLoading) {
            // Disable the control if loading/prompt text is present and an empty list was populated                    
            if(this._loadingText || this._promptText || this._emptyText) {
                e.disabled = !list || (0 == list.length);
            }
            if(this._actualDisabledStatus)
                e.disabled = this._actualDisabledStatus;
        }
    },

    _onChange: function() {
        if(!this._isPopulated()) {
            return;
        }

        var e = this.get_element();

        // Record the selected value in the client state
        if((-1 != e.selectedIndex) && !(this._promptText && (0 == e.selectedIndex))) {
            this.set_SelectedValue(e.options[e.selectedIndex].value, e.options[e.selectedIndex].text, e.options[e.selectedIndex].title);
        } else {
            this.set_SelectedValue('', '');
        }
    },

    _onParentChange: function(evt, inInit) {
        // Handler for the parent drop down's change event
        // "evt" - set by the browser when called as an event handler (unused here)
        // "inInit" - whether this is being called from the initialize method

        var e = this.get_element();

        // Create the known category/value pairs string for sending to the helper web service
        // Follow parent pointers so that the complete state can be sent
        // Format: 'name1:value1;name2:value2;...'
        var knownCategoryValues = '';
        var parentControlID = this._parentControlID;
        while(parentControlID) {
            var parentElement = $get(parentControlID);
            if(parentElement && (-1 != parentElement.selectedIndex)) {
                var selectedValue = parentElement.options[parentElement.selectedIndex].value;

                if(selectedValue && selectedValue != "") {
                    knownCategoryValues = parentElement.CascadingDropDownCategory + ':' + selectedValue + ';' + knownCategoryValues;
                    parentControlID = parentElement.CascadingDropDownParentControlID;
                    continue;
                }
            }
            break;
        }

        if(knownCategoryValues != '' && this._lastParentValues == knownCategoryValues) {
            return;
        }

        this._lastParentValues = knownCategoryValues;

        // we have a parent but it doesn't have a valid value
        //
        if(knownCategoryValues == '' && this._parentControlID) {
            this._setOptions(null, inInit);
            return;
        }

        // Show the loading text (if any)
        this._setOptions(null, inInit, true);

        if(this._servicePath && this._serviceMethod) {
            // Raise the populating event and optionally cancel the web service invocation
            var eventArgs = new Sys.CancelEventArgs();
            this.raisePopulating(eventArgs);
            if(eventArgs.get_cancel()) {
                return;
            }

            // Create the service parameters and optionally add the context parameter
            // (thereby determining which method signature we're expecting...)
            var params = { knownCategoryValues: knownCategoryValues, category: this._category };
            if(this._useContextKey) {
                params.contextKey = this._contextKey;
            }

            // Call the helper web service
            Sys.Net.WebServiceProxy.invoke(this._servicePath, this._serviceMethod, this._useHttpGet, params,
        Function.createDelegate(this, this._onMethodComplete), Function.createDelegate(this, this._onMethodError));
            $common.updateFormToRefreshATDeviceBuffer();
        }
    },

    _onMethodComplete: function(result, userContext, methodName) {
        // Success, update the DropDownList
        this._setOptions(result);
        this.raisePopulated(Sys.EventArgs.Empty);
    },

    _onMethodError: function(webServiceError, userContext, methodName) {
        // Indicate failure
        if(webServiceError.get_timedOut()) {
            this._setOptions([this._makeNameValueObject(Sys.Extended.UI.Resources.CascadingDropDown_MethodTimeout)]);
        } else {
            this._setOptions([this._makeNameValueObject(String.format(Sys.Extended.UI.Resources.CascadingDropDown_MethodError, webServiceError.get_statusCode()))]);
        }
    },

    _makeNameValueObject: function(message) {
        // Create an object with name and value properties set to the provided message
        // "message" - message
        // "Object" - object with name and value properties set to the message

        return { 'name': message, 'value': message };
    },

    get_ParentControlID: function() {
        return this._parentControlID;
    },
    set_ParentControlID: function(value) {
        if(this._parentControlID != value) {
            this._parentControlID = value;
            this.raisePropertyChanged('ParentControlID');
        }
    },

    get_Category: function() {
        return this._category;
    },
    set_Category: function(value) {
        if(this._category != value) {
            this._category = value;
            this.raisePropertyChanged('Category');
        }
    },

    get_PromptText: function() {
        // Prompt text displayed as the first entry in the drop down
        return this._promptText;
    },
    set_PromptText: function(value) {
        if(this._promptText != value) {
            this._promptText = value;
            this.raisePropertyChanged('PromptText');
        }
    },

    get_PromptValue: function() {
        // Value for the option displayed by a DropDownList showing the PromptText
        return this._promptValue;
    },
    set_PromptValue: function(value) {
        if(this._promptValue != value) {
            this._promptValue = value;
            this.raisePropertyChanged('PromptValue');
        }
    },

    get_EmptyText: function() {
        // Text for the option displayed when the list is empty
        return this._emptyText;
    },
    set_EmptyText: function(value) {
        if(this._emptyText != value) {
            this._emptyText = value;
            this.raisePropertyChanged('EmptyText');
        }
    },

    get_EmptyValue: function() {
        // Value for the option displayed when the list is empty
        return this._emptyValue;
    },
    set_EmptyValue: function(value) {
        if(this._emptyValue != value) {
            this._emptyValue = value;
            this.raisePropertyChanged('EmptyValue');
        }
    },

    get_LoadingText: function() {
        return this._loadingText;
    },
    set_LoadingText: function(value) {
        if(this._loadingText != value) {
            this._loadingText = value;
            this.raisePropertyChanged('LoadingText');
        }
    },

    get_SelectedValue: function() {
        return this._selectedValue;
    },
    set_SelectedValue: function(value, text, title) {
        if(this._selectedValue != value) {
            if(!text) {
                // Initial population by server; look for "value:::text" pair
                var i = value.indexOf(':::');
                if(-1 != i) {
                    text = value.slice(i + 3);
                    value = value.slice(0, i);

                    i = text.indexOf(':::');
                    if(-1 != i) {
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
        Sys.Extended.UI.CascadingDropDownBehavior.callBaseMethod(this, 'set_ClientState', [this._selectedValue + ':::' + text + ':::' + (title ? (':::' + title) : '')]);
    },

    get_ServicePath: function() {
        return this._servicePath;
    },
    set_ServicePath: function(value) {
        if(this._servicePath != value) {
            this._servicePath = value;
            this.raisePropertyChanged('ServicePath');
        }
    },

    get_ServiceMethod: function() {
        return this._serviceMethod;
    },
    set_ServiceMethod: function(value) {
        if(this._serviceMethod != value) {
            this._serviceMethod = value;
            this.raisePropertyChanged('ServiceMethod');
        }
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

    get_useHttpGet: function() {
        return this._useHttpGet;
    },
    set_useHttpGet: function(value) {
        if(this._useHttpGet != value) {
            this._useHttpGet = value;
            this.raisePropertyChanged('useHttpGet');
        }
    },

    get_enableAtLoading: function() {
        // Whether or not disable the dropdownlist control when this is waiting to 
        // get data from the service so at the time of loading user can use keyboard 
        // to navigate to the dropdown control.
        return this._enableAtLoading;
    },
    set_enableAtLoading: function(value) {
        if(this._enableAtLoading != value) {
            this._enableAtLoading = value;
            this.raisePropertyChanged('enableAtLoading');
        }
    },

    add_selectionChanged: function(handler) {
        this.get_events().addHandler('selectionChanged', handler);
    },
    remove_selectionChanged: function(handler) {
        this.get_events().removeHandler('selectionChanged', handler);
    },
    raiseSelectionChanged: function(eventArgs) {
        var handler = this.get_events().getHandler('selectionChanged');
        if(handler) {
            handler(this, eventArgs);
        }
    },

    add_populating: function(handler) {
        this.get_events().addHandler('populating', handler);
    },
    remove_populating: function(handler) {
        this.get_events().removeHandler('populating', handler);
    },
    raisePopulating: function(eventArgs) {
        // The populating event can be used to provide custom data to
        // CascadingDropDown instead of using a web service.  Just cancel the
        // event (using the CancelEventArgs) and pass your own data to the
        // _setOptions method.
        var handler = this.get_events().getHandler('populating');
        if(handler) {
            handler(this, eventArgs);
        }
    },

    add_populated: function(handler) {
        this.get_events().addHandler('populated', handler);
    },
    remove_populated: function(handler) {
        this.get_events().removeHandler('populated', handler);
    },
    raisePopulated: function(eventArgs) {
        var handler = this.get_events().getHandler('populated');
        if(handler) {
            handler(this, eventArgs);
        }
    }
}
Sys.Extended.UI.CascadingDropDownBehavior.registerClass('Sys.Extended.UI.CascadingDropDownBehavior', Sys.Extended.UI.BehaviorBase);