Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.DynamicPopulateBehavior = function(element) {
    // The DynamicPopulateBehavior replaces the contents of an element with the result of a web service or page method call. 
    // The method call returns a string of HTML that is inserted as the children of the target element.
    // [element] is DOM Element the behavior is associated with.
    Sys.Extended.UI.DynamicPopulateBehavior.initializeBase(this, [element]);

    this._servicePath = location.pathname;
    this._serviceMethod = null;
    this._contextKey = null;
    this._cacheDynamicResults = false;
    this._populateTriggerID = null;
    this._setUpdatingCssClass = null;
    this._clearDuringUpdate = true;
    this._customScript = null;

    this._clickHandler = null;

    this._callID = 0;
    this._currentCallID = -1;

    this._populated = false;
}

Sys.Extended.UI.DynamicPopulateBehavior.prototype = {

    initialize: function() {
        Sys.Extended.UI.DynamicPopulateBehavior.callBaseMethod(this, 'initialize');
        $common.prepareHiddenElementForATDeviceUpdate();

        if(this._populateTriggerID) {
            var populateTrigger = $get(this._populateTriggerID);

            if(populateTrigger) {
                this._clickHandler = Function.createDelegate(this, this._onPopulateTriggerClick);
                $addHandler(populateTrigger, "click", this._clickHandler);
            }
        }
    },

    dispose: function() {
        if(this._populateTriggerID && this._clickHandler) {
            var populateTrigger = $get(this._populateTriggerID);

            if(populateTrigger)
                $removeHandler(populateTrigger, "click", this._clickHandler);

            this._populateTriggerID = null;
            this._clickHandler = null;
        }

        Sys.Extended.UI.DynamicPopulateBehavior.callBaseMethod(this, 'dispose');
    },

    /// <summary>
    /// Uses dymanic content to populate the target element.
    /// </summary>
    /// <remarks>
    /// If an element to populate is in a data-bound repeating control, the contextKey parameter can be an ID of the current row.
    /// </remarks>
    /// <param name="contextKey" type="String">A string to pass to the Web service method or page method.</param>
    /// <member name="cM:AjaxControlToolkit.DynamicPopulateExtender.populate" />
    populate: function(contextKey) {
        // An arbitrary string value to be passed to the web method. For example, if the element to be populated is within a data-bound repeater, this could be the ID of the current row.

        if(contextKey)
            this._contextKey = contextKey;

        if(this._populated && this._cacheDynamicResults)
            return;

        if(this._currentCallID == -1) {
            var eventArgs = new Sys.CancelEventArgs();
            this.raise_populating(eventArgs);

            if(eventArgs.get_cancel())
                return;

            this._setUpdating(true);
        }

        if(this._customScript) {
            var scriptResult = eval(this._customScript);

            this._setTargetHtml(scriptResult);
            this._setUpdating(false);
        } else {
            this._currentCallID = ++this._callID;

            if(!this._servicePath || !this._serviceMethod)
                return;

            Sys.Net.WebServiceProxy.invoke(this._servicePath, this._serviceMethod, false,
                { contextKey: (contextKey ? contextKey : this._contextKey) },
                Function.createDelegate(this, this._onMethodComplete), Function.createDelegate(this, this._onMethodError),
                this._currentCallID);
            $common.updateFormToRefreshATDeviceBuffer();
        }
    },

    _onMethodComplete: function(result, userContext, methodName) {
        // Callback used when the populating service returns successfully
        if(userContext != this._currentCallID)
            return;

        this._setTargetHtml(result);
        this._setUpdating(false);
    },

    _onMethodError: function(webServiceError, userContext, methodName) {
        // Callback used when the populating service fails
        if(userContext != this._currentCallID)
            return;

        if(webServiceError.get_timedOut())
            this._setTargetHtml(Sys.Extended.UI.Resources.DynamicPopulate_WebServiceTimeout);
        else
            this._setTargetHtml(String.format(Sys.Extended.UI.Resources.DynamicPopulate_WebServiceError, webServiceError.get_statusCode()));

        this._setUpdating(false);
    },

    _onPopulateTriggerClick: function() {
        this.populate(this._contextKey);
    },

    _setUpdating: function(updating) {
        // Toggle the display elements to indicate if they are being updated or not
        // updating - Whether or not the display should indicated it is being updated
        this.setStyle(updating);

        if(!updating) {
            this._currentCallID = -1;
            this._populated = true;
            this.raise_populated(this, Sys.EventArgs.Empty);
        }
    },

    _setTargetHtml: function(value) {
        var e = this.get_element()
        if(e) {
            if(e.tagName == "INPUT")
                e.value = value;
            else
                e.innerHTML = value;
        }
    },

    /// <summary>
    /// Sets the dislpayed style.
    /// </summary>
    /// <param name="updating" type="Boolean">A Boolean value that specifies whether the display is being updated.</param>
    /// <member name="cM:AjaxControlToolkit.DynamicPopulateExtender.setStyle" />
    setStyle: function(updating) {
        // Set the style of the display
        // updating - Whether or not the display is being updated
        var e = this.get_element();
        if(this._setUpdatingCssClass) {
            if(!updating) {
                e.className = this._oldCss;
                this._oldCss = null;
            } else {
                this._oldCss = e.className;
                e.className = this._setUpdatingCssClass;
            }
        }

        if(updating && this._clearDuringUpdate)
            this._setTargetHtml("");
    },

    /// <summary>
    /// A Boolean value that specifies whether or the target content should be cleared when the update begins.
    /// </summary>
    /// <getter>get_clearContentsDuringUpdate</getter>
    /// <setter>set_clearContentsDuringUpdate</setter>
    /// <member name="cP:AjaxControlToolkit.DynamicPopulateExtender.clearContentsDuringUpdate" />
    get_clearContentsDuringUpdate: function() {
        return this._clearDuringUpdate;
    },
    set_clearContentsDuringUpdate: function(value) {
        if(this._clearDuringUpdate != value) {
            this._clearDuringUpdate = value;
            this.raisePropertyChanged('clearContentsDuringUpdate');
        }
    },

    get_ClearContentsDuringUpdate: function() {
        Sys.Extended.Deprecated("get_ClearContentsDuringUpdate", "get_clearContentsDuringUpdate");
        return this.get_clearContentsDuringUpdate();
    },
    set_ClearContentsDuringUpdate: function(value) {
        Sys.Extended.Deprecated("set_ClearContentsDuringUpdate", "set_clearContentsDuringUpdate");
        this.set_clearContentsDuringUpdate(value);  
    },

    /// <summary>
    /// A string to pass to the Web method.
    /// </summary>
    /// <getter>get_contextKey</getter>
    /// <setter>set_contextKey</setter>
    /// <member name="cP:AjaxControlToolkit.DynamicPopulateExtender.contextKey" />
    get_contextKey: function() {
        // An arbitrary string value to be passed to the web method.
        // For example, if the element to be populated is within a
        // data-bound repeater, this could be the ID of the current row.
        return this._contextKey;
    },
    set_contextKey: function(value) {
        if(this._contextKey != value) {
            this._contextKey = value;
            this.raisePropertyChanged('contextKey');
        }
    },

    get_ContextKey: function() {
        Sys.Extended.Deprecated("get_ContextKey", "get_contextKey");
        return this.get_contextKey();  
    },
    set_ContextKey: function(value) {
        Sys.Extended.Deprecated("set_ContextKey", "set_contextKey");
        this.set_contextKey(value);
    },

    /// <summary>
    /// TA name of an element that can be clicked to trigger the target element population.
    /// </summary>
    /// <getter>get_populateTriggerID</getter>
    /// <setter>set_populateTriggerID</setter>
    /// <member name="cP:AjaxControlToolkit.DynamicPopulateExtender.populateTriggerID" />
    get_populateTriggerID: function() {
        // Name of an element that triggers the population of the target when clicked
        return this._populateTriggerID;
    },
    set_populateTriggerID: function(value) {
        if(this._populateTriggerID != value) {
            this._populateTriggerID = value;
            this.raisePropertyChanged('populateTriggerID');
        }
    },

    get_PopulateTriggerID: function() {
        Sys.Extended.Deprecated("get_PopulateTriggerID", "get_populateTriggerID");
        return this.get_populateTriggerID();
    },
    set_PopulateTriggerID: function(value) {
        Sys.Extended.Deprecated("set_PopulateTriggerID", "set_populateTriggerID");
        this.set_populateTriggerID(value);
    },

    /// <summary>
    /// The Web service URL to call.
    /// </summary>
    /// <remarks>
    /// This property is optional. If the ServicePath property is not set, a page method is invoked instead of a Web service.
    /// </remarks>
    /// <getter>get_servicePath</getter>
    /// <setter>set_servicePath</setter>
    /// <member name="cP:AjaxControlToolkit.DynamicPopulateExtender.servicePath" />
    get_servicePath: function() {
        return this._servicePath;
    },
    set_servicePath: function(value) {
        if(this._servicePath != value) {
            this._servicePath = value;
            this.raisePropertyChanged('servicePath');
        }
    },

    get_ServicePath: function() {
        Sys.Extended.Deprecated("get_ServicePath", "get_servicePath");
        return this.get_servicePath();
    },
    set_ServicePath: function(value) {
        Sys.Extended.Deprecated("set_ServicePath", "set_servicePath");
        this.set_servicePath(value);
    },

    /// <summary>
    /// The method name to call on the Web service or a page.
    /// </summary>
    /// <getter>get_serviceMethod</getter>
    /// <setter>set_serviceMethod</setter>
    /// <member name="cP:AjaxControlToolkit.DynamicPopulateExtender.serviceMethod" />
    get_serviceMethod: function() {
        // The signature of the method must exactly match the following:
        //    [WebMethod]
        //    string DynamicPopulateMethod(string contextKey) {
        //        ....
        //    }
        return this._serviceMethod;
    },
    set_serviceMethod: function (value) {
        if(this._serviceMethod != value) {
            this._serviceMethod = value;
            this.raisePropertyChanged('serviceMethod');
        }
    },

    get_ServiceMethod: function() {
        Sys.Extended.Deprecated("get_ServiceMethod", "get_serviceMethod");
        return this.get_serviceMethod();
    },
    set_ServiceMethod: function(value) {
        Sys.Extended.Deprecated("set_ServiceMethod", "set_serviceMethod");
        this.set_serviceMethod(value);
    },

    /// <summary>
    /// A Boolean value that specifies whether or not the results of the target 
    /// element population should be cached and not fetched again after the first load.	
    /// </summary>
    /// <getter>get_cacheDynamicResults</getter>
    /// <setter>set_cacheDynamicResults</setter>
    /// <member name="cP:AjaxControlToolkit.DynamicPopulateExtender.cacheDynamicResults" />
    get_cacheDynamicResults: function() {
        return this._cacheDynamicResults;
    },
    set_cacheDynamicResults: function(value) {
        if(this._cacheDynamicResults != value) {
            this._cacheDynamicResults = value;
            this.raisePropertyChanged('cacheDynamicResults');
        }
    },

    /// <summary>
    /// The name of the CSS class to apply to the target during asynchronous calls.
    /// </summary>
    /// <getter>get_updatingCssClass</getter>
    /// <setter>set_updatingCssClass</setter>
    /// <member name="cP:AjaxControlToolkit.DynamicPopulateExtender.updatingCssClass" />
    get_updatingCssClass: function() {
        return this._setUpdatingCssClass;
    },
    set_updatingCssClass: function(value) {
        if(this._setUpdatingCssClass != value) {
            this._setUpdatingCssClass = value;
            this.raisePropertyChanged('updatingCssClass');
        }
    },

    get_UpdatingCssClass: function() {
        Sys.Extended.Deprecated("get_UpdatingCssClass", "get_updatingCssClass");
        return this.get_updatingCssClass();
    },
    set_UpdatingCssClass: function(value) {
        Sys.Extended.Deprecated("set_UpdatingCssClass", "set_updatingCssClass");
        this.set_updatingCssClass(value);
    },

    /// <summary>
    /// The script to invoke instead of calling a Web service or page method.	
    /// </summary>
    /// <getter>get_customScript</getter>
    /// <setter>set_customScript</setter>
    /// <member name="cP:AjaxControlToolkit.DynamicPopulateExtender.customScript" />
    get_customScript: function() {
        // The script to invoke instead of calling a Web or Page method. This script must evaluate to a string value.
        return this._customScript;
    },
    set_customScript: function(value) {
        if(this._customScript != value) {
            this._customScript = value;
            this.raisePropertyChanged('customScript');
        }
    },

    get_CustomScript: function() {
        Sys.Extended.Deprecated("get_CustomScript", "get_customScript");
        return this.get_customScript();
    },
    set_CustomScript: function(value) {
        Sys.Extended.Deprecated("set_CustomScript", "set_customScript");
        this.set_customScript(value);
    },

    /// <summary>
    /// Fires when populating starts.
    /// </summary>
    /// <event add="add_populating" remove="remove_populating" raise="raise_populating" />
    /// <member name="cE:AjaxControlToolkit.DynamicPopulateExtender.populating" />
    add_populating: function(handler) {
        this.get_events().addHandler('populating', handler);
    },
    remove_populating: function(handler) {
        this.get_events().removeHandler('populating', handler);
    },
    raise_populating: function(eventArgs) {
        var handler = this.get_events().getHandler('populating');
        if(handler)
            handler(this, eventArgs);
    },
    raisePopulating: function(eventArgs) {
        Sys.Extended.Deprecated("raisePopulating(eventArgs)", "raise_populating(eventArgs)");
        this.raise_populating(eventArgs);
    },

    /// <summary>
    /// Fires when populating ends.
    /// </summary>
    /// <event add="add_populated" remove="remove_populated" raise="raise_populated" />
    /// <member name="cE:AjaxControlToolkit.DynamicPopulateExtender.populated" />
    add_populated: function(handler) {
        this.get_events().addHandler('populated', handler);
    },
    remove_populated: function(handler) {
        this.get_events().removeHandler('populated', handler);
    },
    raise_populated: function(eventArgs) {
        var handler = this.get_events().getHandler('populated');
        if(handler)
            handler(this, eventArgs);
    },
    raisePopulated: function(eventArgs) {
        Sys.Extended.Deprecated("raisePopulated(eventArgs)", "raise_populated(eventArgs)");
        this.raise_populated(eventArgs);
    }
}

Sys.Extended.UI.DynamicPopulateBehavior.registerClass('Sys.Extended.UI.DynamicPopulateBehavior', Sys.Extended.UI.BehaviorBase);