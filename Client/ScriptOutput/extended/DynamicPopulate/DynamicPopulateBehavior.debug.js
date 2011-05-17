// (c) 2010 CodePlex Foundation



/// <reference name="MicrosoftAjax.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />

(function() {
var scriptName = "ExtendedDynamicPopulate";

function execute() {

Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.DynamicPopulateBehavior = function(element) {
    /// <summary>
    /// The DynamicPopulateBehavior replaces the contents of an element with the result of a web service or page method call.  The method call returns a string of HTML that is inserted as the children of the target element.
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" domElement="true">
    /// DOM Element the behavior is associated with
    /// </param>
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
    initialize : function() {
        /// <summary>
        /// Initialize the behavior
        /// </summary>
        Sys.Extended.UI.DynamicPopulateBehavior.callBaseMethod(this, 'initialize');
        $common.prepareHiddenElementForATDeviceUpdate();        
    
        if (this._populateTriggerID) {
            var populateTrigger = $get(this._populateTriggerID);
            if (populateTrigger) {
                this._clickHandler = Function.createDelegate(this, this._onPopulateTriggerClick);
                $addHandler(populateTrigger, "click", this._clickHandler);
            }
        }
    },
    
    dispose : function() {
        /// <summary>
        /// Dispose the behavior
        /// </summary>

        if (this._populateTriggerID && this._clickHandler) {
            var populateTrigger = $get(this._populateTriggerID);
            if (populateTrigger) {
                $removeHandler(populateTrigger, "click", this._clickHandler);
            }
            this._populateTriggerID = null;
            this._clickHandler = null;
        }
       
        Sys.Extended.UI.DynamicPopulateBehavior.callBaseMethod(this, 'dispose');
    },
    
    populate : function(contextKey) {
        /// <summary>
        /// Get the dymanic content and use it to populate the target element
        /// </summary>
        /// <param name="contextKey" type="String" mayBeNull="true" optional="true">
        /// An arbitrary string value to be passed to the web method. For example, if the element to be
        /// populated is within a data-bound repeater, this could be the ID of the current row.
        /// </param>
        
        if (this._populated && this._cacheDynamicResults) {
            return;
        }

        if (this._currentCallID == -1) {
            var eventArgs = new Sys.CancelEventArgs();
            this.raisePopulating(eventArgs);
            if (eventArgs.get_cancel()) {
                return;
            }
            this._setUpdating(true);
        }
        
        if (this._customScript) {
            var scriptResult = eval(this._customScript);
            this._setTargetHtml(scriptResult); 
            this._setUpdating(false);
         } else {
             this._currentCallID = ++this._callID;
             if (this._servicePath && this._serviceMethod) {
                Sys.Net.WebServiceProxy.invoke(this._servicePath, this._serviceMethod, false,
                    { contextKey:(contextKey ? contextKey : this._contextKey) },
                    Function.createDelegate(this, this._onMethodComplete), Function.createDelegate(this, this._onMethodError),
                    this._currentCallID);
                $common.updateFormToRefreshATDeviceBuffer();
             }
        }
    },

    _onMethodComplete : function (result, userContext, methodName) {
        /// <summary>
        /// Callback used when the populating service returns successfully
        /// </summary>
        /// <param name="result" type="Object" mayBeNull="">
        /// The data returned from the Web service method call
        /// </param>
        /// <param name="userContext" type="Object">
        /// The context information that was passed when the Web service method was invoked
        /// </param>        
        /// <param name="methodName" type="String">
        /// The Web service method that was invoked
        /// </param>

        if (userContext != this._currentCallID) return;

        this._setTargetHtml(result);

        this._setUpdating(false);
    },

    _onMethodError : function(webServiceError, userContext, methodName) {
        /// <summary>
        /// Callback used when the populating service fails
        /// </summary>
        /// <param name="webServiceError" type="Sys.Net.WebServiceError">
        /// Web service error
        /// </param>
        /// <param name="userContext" type="Object">
        /// The context information that was passed when the Web service method was invoked
        /// </param>        
        /// <param name="methodName" type="String">
        /// The Web service method that was invoked
        /// </param>

        if (userContext != this._currentCallID) return;

        if (webServiceError.get_timedOut()) {
            this._setTargetHtml(Sys.Extended.UI.Resources.DynamicPopulate_WebServiceTimeout);
        } else {
            this._setTargetHtml(String.format(Sys.Extended.UI.Resources.DynamicPopulate_WebServiceError, webServiceError.get_statusCode()));
        }

        this._setUpdating(false);
    },

    _onPopulateTriggerClick : function() {
        /// <summary>
        /// Handler for the element described by PopulateTriggerID's click event
        /// </summary>

        this.populate(this._contextKey);
    },
    
    _setUpdating : function(updating) {
        /// <summary>
        /// Toggle the display elements to indicate if they are being updated or not
        /// </summary>
        /// <param name="updating" type="Boolean">
        /// Whether or not the display should indicated it is being updated
        /// </param>

        this.setStyle(updating);
        
        if (!updating) {
            this._currentCallID = -1;
            this._populated = true;
            this.raisePopulated(this, Sys.EventArgs.Empty);
        }
    },
    
    _setTargetHtml : function(value) {
        /// <summary>
        /// Populate the target element with the given value
        /// </summary>
        /// <param name="value" type="String">
        /// The data to populate the target element.
        /// </param>
        
        var e = this.get_element()
        if (e) {
            if (e.tagName == "INPUT") {
                e.value = value;
            } else {
                e.innerHTML = value;
            }
        }
    },
    
    setStyle : function(updating) {
        /// <summary>
        /// Set the style of the display
        /// </summary>
        /// <param name="updating" type="Boolean">
        /// Whether or not the display is being updated
        /// </param>
        
        var e = this.get_element();
        if (this._setUpdatingCssClass) {
            if (!updating) {
                e.className = this._oldCss;
                this._oldCss = null;
            } else {
                this._oldCss = e.className;
                e.className = this._setUpdatingCssClass;
            }
        }
        
        if (updating && this._clearDuringUpdate) {
            this._setTargetHtml("");
        }
    },
    
    get_ClearContentsDuringUpdate : function() {
        /// <value type="Boolean">
        /// Whether the contents of the target should be cleared when an update begins
        /// </value>
        return this._clearDuringUpdate;
    },
    set_ClearContentsDuringUpdate : function(value) {
        if (this._clearDuringUpdate != value) {
            this._clearDuringUpdate = value;
            this.raisePropertyChanged('ClearContentsDuringUpdate');
        }
    },
    
    get_ContextKey : function() {
        /// <value type="String">
        /// An arbitrary string value to be passed to the web method.
        /// For example, if the element to be populated is within a
        /// data-bound repeater, this could be the ID of the current row.
        /// </value>
        return this._contextKey;
    },
    set_ContextKey : function(value) {
        if (this._contextKey != value) {
            this._contextKey = value;
            this.raisePropertyChanged('ContextKey');
        }
    },
    
    get_PopulateTriggerID : function() {
        /// <value type="String" mayBeNull="true" optional="true">
        /// Name of an element that triggers the population of the target when clicked
        /// </value>
        return this._populateTriggerID;
    },
    set_PopulateTriggerID : function(value) {
        if (this._populateTriggerID != value) {
            this._populateTriggerID = value;
            this.raisePropertyChanged('PopulateTriggerID');
        }
    },
    
    get_ServicePath : function() {
        /// <value type="String" mayBeNull="true" optional="true">
        /// The URL of the web service to call.  If the ServicePath is not defined, then we will invoke a PageMethod instead of a web service.
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
        /// The name of the method to call on the page or web service
        /// </value>
        /// <remarks>
        /// The signature of the method must exactly match the following:
        ///    [WebMethod]
        ///    string DynamicPopulateMethod(string contextKey)
        ///    {
        ///        ...
        ///    }
        /// </remarks>
        return this._serviceMethod;
    },
    set_ServiceMethod : function(value) {
        if (this._serviceMethod != value) {
            this._serviceMethod = value;
            this.raisePropertyChanged('ServiceMethod');
        }
    },
    
    get_cacheDynamicResults : function() {
        /// <value type="Boolean" mayBeNull="false">
        /// Whether the results of the dynamic population should be cached and
        /// not fetched again after the first load
        /// </value>
        return this._cacheDynamicResults;
    },
    set_cacheDynamicResults : function(value) {
        if (this._cacheDynamicResults != value) {
            this._cacheDynamicResults = value;
            this.raisePropertyChanged('cacheDynamicResults');
        }
    },
    
    get_UpdatingCssClass : function() {
        /// <value type="String">
        /// The CSS class to apply to the target during asynchronous calls
        /// </value>
        return this._setUpdatingCssClass;
    },
    set_UpdatingCssClass : function(value) {
        if (this._setUpdatingCssClass != value) {
            this._setUpdatingCssClass = value;
            this.raisePropertyChanged('UpdatingCssClass');
        }
    },
    
    get_CustomScript : function() {
        /// <value type="String">
        /// The script to invoke instead of calling a Web or Page method. This script must evaluate to a string value.
        /// </value>
        return this._customScript;
    },   
    set_CustomScript : function(value) {
        if (this._customScript != value) {
            this._customScript = value;
            this.raisePropertyChanged('CustomScript');
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
Sys.Extended.UI.DynamicPopulateBehavior.registerClass('Sys.Extended.UI.DynamicPopulateBehavior', Sys.Extended.UI.BehaviorBase);
Sys.registerComponent(Sys.Extended.UI.DynamicPopulateBehavior, { name: "dynamicPopulate" });

} // execute

if (window.Sys && Sys.loader) {
    Sys.loader.registerScript(scriptName, ["ExtendedBase", "ExtendedCommon", "Network"], execute);
}
else {
    execute();
}

})();
