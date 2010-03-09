


/// <reference name="MicrosoftAjax.js" />
/// <reference name="MicrosoftAjaxTimer.debug.js" />
/// <reference name="MicrosoftAjaxWebForms.debug.js" />

(function() {
var scriptName = "ExtendedBase";

function execute() {

var version = Sys.version;
if (!version && !Sys._versionChecked) {
    Sys._versionChecked = true;
    throw new Error("AjaxControlToolkit requires ASP.NET Ajax 4.0 scripts. Ensure the correct version of the scripts are referenced. If you are using an ASP.NET ScriptManager, switch to the AjaxScriptManager in System.Web.Ajax.dll, or use the ToolkitScriptManager in AjaxControlToolkit.dll.");
}

Type.registerNamespace('Sys.Extended.UI');

// This is the base behavior for all extender behaviors
Sys.Extended.UI.BehaviorBase = function(element) {
    /// <summary>
    /// Base behavior for all extender behaviors
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" domElement="true">
    /// Element the behavior is associated with
    /// </param>
    Sys.Extended.UI.BehaviorBase.initializeBase(this,[element]);
    
    this._clientStateFieldID = null;
    this._pageRequestManager = null;
    this._partialUpdateBeginRequestHandler = null;
    this._partialUpdateEndRequestHandler = null;
}
Sys.Extended.UI.BehaviorBase.prototype = {
    initialize : function() {
        /// <summary>
        /// Initialize the behavior
        /// </summary>

        // TODO: Evaluate necessity
        Sys.Extended.UI.BehaviorBase.callBaseMethod(this, 'initialize');
    },

    dispose : function() {
        /// <summary>
        /// Dispose the behavior
        /// </summary>
        Sys.Extended.UI.BehaviorBase.callBaseMethod(this, 'dispose');

        if (this._pageRequestManager) {
            if (this._partialUpdateBeginRequestHandler) {
                this._pageRequestManager.remove_beginRequest(this._partialUpdateBeginRequestHandler);
                this._partialUpdateBeginRequestHandler = null;
            }
            if (this._partialUpdateEndRequestHandler) {
                this._pageRequestManager.remove_endRequest(this._partialUpdateEndRequestHandler);
                this._partialUpdateEndRequestHandler = null;
            }
            this._pageRequestManager = null;
        }
    },

    get_ClientStateFieldID : function() {
        /// <value type="String">
        /// ID of the hidden field used to store client state
        /// </value>
        return this._clientStateFieldID;
    },
    set_ClientStateFieldID : function(value) {
        if (this._clientStateFieldID != value) {
            this._clientStateFieldID = value;
            this.raisePropertyChanged('ClientStateFieldID');
        }
    },

    get_ClientState : function() {
        /// <value type="String">
        /// Client state
        /// </value>
        if (this._clientStateFieldID) {
            var input = document.getElementById(this._clientStateFieldID);
            if (input) {
                return input.value;
            }
        }
        return null;
    },
    set_ClientState : function(value) {
        if (this._clientStateFieldID) {
            var input = document.getElementById(this._clientStateFieldID);
            if (input) {
                input.value = value;
            }
        }
    },

    registerPartialUpdateEvents : function() {
        /// <summary>
        /// Register for beginRequest and endRequest events on the PageRequestManager,
        /// (which cause _partialUpdateBeginRequest and _partialUpdateEndRequest to be
        /// called when an UpdatePanel refreshes)
        /// </summary>

        if (Sys && Sys.WebForms && Sys.WebForms.PageRequestManager){
            this._pageRequestManager = Sys.WebForms.PageRequestManager.getInstance();
            if (this._pageRequestManager) {
                this._partialUpdateBeginRequestHandler = Function.createDelegate(this, this._partialUpdateBeginRequest);
                this._pageRequestManager.add_beginRequest(this._partialUpdateBeginRequestHandler);
                this._partialUpdateEndRequestHandler = Function.createDelegate(this, this._partialUpdateEndRequest);
                this._pageRequestManager.add_endRequest(this._partialUpdateEndRequestHandler);
            }
        }
    },

    _partialUpdateBeginRequest : function(sender, beginRequestEventArgs) {
        /// <summary>
        /// Method that will be called when a partial update (via an UpdatePanel) begins,
        /// if registerPartialUpdateEvents() has been called.
        /// </summary>
        /// <param name="sender" type="Object">
        /// Sender
        /// </param>
        /// <param name="beginRequestEventArgs" type="Sys.WebForms.BeginRequestEventArgs">
        /// Event arguments
        /// </param>

        // Nothing done here; override this method in a child class
    },
    
    _partialUpdateEndRequest : function(sender, endRequestEventArgs) {
        /// <summary>
        /// Method that will be called when a partial update (via an UpdatePanel) finishes,
        /// if registerPartialUpdateEvents() has been called.
        /// </summary>
        /// <param name="sender" type="Object">
        /// Sender
        /// </param>
        /// <param name="endRequestEventArgs" type="Sys.WebForms.EndRequestEventArgs">
        /// Event arguments
        /// </param>

        // Nothing done here; override this method in a child class
    }
}
Sys.Extended.UI.BehaviorBase.registerClass('Sys.Extended.UI.BehaviorBase', Sys.UI.Behavior);


// Dynamically populates content when the populate method is called
Sys.Extended.UI.DynamicPopulateBehaviorBase = function(element) {
    /// <summary>
    /// DynamicPopulateBehaviorBase is used to add DynamicPopulateBehavior funcitonality
    /// to other extenders.  It will dynamically populate the contents of the target element
    /// when its populate method is called.
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" domElement="true">
    /// DOM Element the behavior is associated with
    /// </param>
    Sys.Extended.UI.DynamicPopulateBehaviorBase.initializeBase(this, [element]);
    
    this._DynamicControlID = null;
    this._DynamicContextKey = null;
    this._DynamicServicePath = null;
    this._DynamicServiceMethod = null;
    this._cacheDynamicResults = false;
    this._dynamicPopulateBehavior = null;
    this._populatingHandler = null;
    this._populatedHandler = null;
}
Sys.Extended.UI.DynamicPopulateBehaviorBase.prototype = {
    initialize : function() {
        /// <summary>
        /// Initialize the behavior
        /// </summary>

        Sys.Extended.UI.DynamicPopulateBehaviorBase.callBaseMethod(this, 'initialize');

        // Create event handlers
        this._populatingHandler = Function.createDelegate(this, this._onPopulating);
        this._populatedHandler = Function.createDelegate(this, this._onPopulated);
    },

    dispose : function() {
        /// <summary>
        /// Dispose the behavior
        /// </summary>

        // Dispose of event handlers
        if (this._populatedHandler) {
            if (this._dynamicPopulateBehavior) {
                this._dynamicPopulateBehavior.remove_populated(this._populatedHandler);
            }
            this._populatedHandler = null;
        }
        if (this._populatingHandler) {
            if (this._dynamicPopulateBehavior) {
                this._dynamicPopulateBehavior.remove_populating(this._populatingHandler);
            }
            this._populatingHandler = null;
        }

        // Dispose of the placeholder control and behavior
        if (this._dynamicPopulateBehavior) {
            this._dynamicPopulateBehavior.dispose();
            this._dynamicPopulateBehavior = null;
        }
        Sys.Extended.UI.DynamicPopulateBehaviorBase.callBaseMethod(this, 'dispose');
    },

    populate : function(contextKeyOverride) {
        /// <summary>
        /// Demand-create the DynamicPopulateBehavior and use it to populate the target element
        /// </summary>
        /// <param name="contextKeyOverride" type="String" mayBeNull="true" optional="true">
        /// An arbitrary string value to be passed to the web method. For example, if the element to be populated is within a data-bound repeater, this could be the ID of the current row.
        /// </param>

        // If the DynamicPopulateBehavior's element is out of date, dispose of it
        if (this._dynamicPopulateBehavior && (this._dynamicPopulateBehavior.get_element() != $get(this._DynamicControlID))) {
            this._dynamicPopulateBehavior.dispose();
            this._dynamicPopulateBehavior = null;
        }
        
        // If a DynamicPopulateBehavior is not available and the necessary information is, create one
        if (!this._dynamicPopulateBehavior && this._DynamicControlID && this._DynamicServiceMethod) {
            this._dynamicPopulateBehavior = $create(Sys.Extended.UI.DynamicPopulateBehavior,
                {
                    "id" : this.get_id() + "_DynamicPopulateBehavior",
                    "ContextKey" : this._DynamicContextKey,
                    "ServicePath" : this._DynamicServicePath,
                    "ServiceMethod" : this._DynamicServiceMethod,
                    "cacheDynamicResults" : this._cacheDynamicResults
                }, null, null, $get(this._DynamicControlID));

            // Attach event handlers
            this._dynamicPopulateBehavior.add_populating(this._populatingHandler);
            this._dynamicPopulateBehavior.add_populated(this._populatedHandler);
        }
        
        // If a DynamicPopulateBehavior is available, use it to populate the dynamic content
        if (this._dynamicPopulateBehavior) {
            this._dynamicPopulateBehavior.populate(contextKeyOverride ? contextKeyOverride : this._DynamicContextKey);
        }
    },

    _onPopulating : function(sender, eventArgs) {
        /// <summary>
        /// Handler for DynamicPopulate behavior's Populating event
        /// </summary>
        /// <param name="sender" type="Object">
        /// DynamicPopulate behavior
        /// </param>
        /// <param name="eventArgs" type="Sys.CancelEventArgs" mayBeNull="false">
        /// Event args
        /// </param>
        this.raisePopulating(eventArgs);
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
        this.raisePopulated(eventArgs);
    },

    get_dynamicControlID : function() {
        /// <value type="String">
        /// ID of the element to populate with dynamic content
        /// </value>
        return this._DynamicControlID;
    },
    get_DynamicControlID : this.get_dynamicControlID,
    set_dynamicControlID : function(value) {
        if (this._DynamicControlID != value) {
            this._DynamicControlID = value;
            this.raisePropertyChanged('dynamicControlID');
            this.raisePropertyChanged('DynamicControlID');
        }
    },
    set_DynamicControlID : this.set_dynamicControlID,

    get_dynamicContextKey : function() {
        /// <value type="String">
        /// An arbitrary string value to be passed to the web method.
        /// For example, if the element to be populated is within a
        /// data-bound repeater, this could be the ID of the current row.
        /// </value>
        return this._DynamicContextKey;
    },
    get_DynamicContextKey : this.get_dynamicContextKey,
    set_dynamicContextKey : function(value) {
        if (this._DynamicContextKey != value) {
            this._DynamicContextKey = value;
            this.raisePropertyChanged('dynamicContextKey');
            this.raisePropertyChanged('DynamicContextKey');
        }
    },
    set_DynamicContextKey : this.set_dynamicContextKey,

    get_dynamicServicePath : function() {
        /// <value type="String" mayBeNull="true" optional="true">
        /// The URL of the web service to call.  If the ServicePath is not defined, then we will invoke a PageMethod instead of a web service.
        /// </value>
        return this._DynamicServicePath;
    },
    get_DynamicServicePath : this.get_dynamicServicePath,
    set_dynamicServicePath : function(value) {
        if (this._DynamicServicePath != value) {
            this._DynamicServicePath = value;
            this.raisePropertyChanged('dynamicServicePath');
            this.raisePropertyChanged('DynamicServicePath');
        }
    },
    set_DynamicServicePath : this.set_dynamicServicePath,

    get_dynamicServiceMethod : function() {
        /// <value type="String">
        /// The name of the method to call on the page or web service
        /// </value>
        /// <remarks>
        /// The signature of the method must exactly match the following:
        ///     [WebMethod]
        ///     string DynamicPopulateMethod(string contextKey)
        ///     {
        ///         ...
        ///     }
        /// </remarks>
        return this._DynamicServiceMethod;
    },
    get_DynamicServiceMethod : this.get_dynamicServiceMethod,
    set_dynamicServiceMethod : function(value) {
        if (this._DynamicServiceMethod != value) {
            this._DynamicServiceMethod = value;
            this.raisePropertyChanged('dynamicServiceMethod');
            this.raisePropertyChanged('DynamicServiceMethod');
        }
    },
    set_DynamicServiceMethod : this.set_dynamicServiceMethod,
    
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
    
    add_populated : function(handler) {
        /// <summary>
        /// Add a handler on the populated event
        /// </summary>
        /// <param name="handler" type="Function">
        /// Handler
        /// </param>
        this.get_events().addHandler("populated", handler);
    },
    remove_populated : function(handler) {
        /// <summary>
        /// Remove a handler from the populated event
        /// </summary>
        /// <param name="handler" type="Function">
        /// Handler
        /// </param>
        this.get_events().removeHandler("populated", handler);
    },
    raisePopulated : function(arg) {
        /// <summary>
        /// Raise the populated event
        /// </summary>
        /// <param name="arg" type="Sys.EventArgs">
        /// Event arguments
        /// </param>
        var handler = this.get_events().getHandler("populated");  
        if (handler) handler(this, arg);
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
    }
}
Sys.Extended.UI.DynamicPopulateBehaviorBase.registerClass('Sys.Extended.UI.DynamicPopulateBehaviorBase', Sys.Extended.UI.BehaviorBase);


Sys.Extended.UI.ControlBase = function(element) {
    Sys.Extended.UI.ControlBase.initializeBase(this, [element]);
    this._clientStateField = null;
    this._callbackTarget = null;
    this._onsubmit$delegate = Function.createDelegate(this, this._onsubmit);
    this._oncomplete$delegate = Function.createDelegate(this, this._oncomplete);
    this._onerror$delegate = Function.createDelegate(this, this._onerror);
}

Sys.Extended.UI.ControlBase.__doPostBack = function(eventTarget, eventArgument) {
    if (!Sys.WebForms.PageRequestManager.getInstance().get_isInAsyncPostBack()) {
        for (var i = 0; i < Sys.Extended.UI.ControlBase.onsubmitCollection.length; i++) {
            Sys.Extended.UI.ControlBase.onsubmitCollection[i]();
        }
    }
    Function.createDelegate(window, Sys.Extended.UI.ControlBase.__doPostBackSaved)(eventTarget, eventArgument);
}

Sys.Extended.UI.ControlBase.prototype = {
    initialize: function() {
        Sys.Extended.UI.ControlBase.callBaseMethod(this, "initialize");
        // load the client state if possible
        if (this._clientStateField) {
            this.loadClientState(this._clientStateField.value);
        }
        // attach an event to save the client state before a postback or updatepanel partial postback
        if (typeof (Sys.WebForms) !== "undefined" && typeof (Sys.WebForms.PageRequestManager) !== "undefined") {
            Array.add(Sys.WebForms.PageRequestManager.getInstance()._onSubmitStatements, this._onsubmit$delegate);
            if (Sys.Extended.UI.ControlBase.__doPostBackSaved == null || typeof Sys.Extended.UI.ControlBase.__doPostBackSaved == "undefined") {
                Sys.Extended.UI.ControlBase.__doPostBackSaved = window.__doPostBack;
                window.__doPostBack = Sys.Extended.UI.ControlBase.__doPostBack;
                Sys.Extended.UI.ControlBase.onsubmitCollection = new Array();
            }
            Array.add(Sys.Extended.UI.ControlBase.onsubmitCollection, this._onsubmit$delegate);
        } else {
            $addHandler(document.forms[0], "submit", this._onsubmit$delegate);
        }
    },
    dispose: function() {
        if (typeof (Sys.WebForms) !== "undefined" && typeof (Sys.WebForms.PageRequestManager) !== "undefined") {
            Array.remove(Sys.Extended.UI.ControlBase.onsubmitCollection, this._onsubmit$delegate);
            Array.remove(Sys.WebForms.PageRequestManager.getInstance()._onSubmitStatements, this._onsubmit$delegate);
        } else {
            $removeHandler(document.forms[0], "submit", this._onsubmit$delegate);
        }
        Sys.Extended.UI.ControlBase.callBaseMethod(this, "dispose");
    },

    findElement: function(id) {
        // <summary>Finds an element within this control (ScriptControl/ScriptUserControl are NamingContainers);
        return $get(this.get_id() + '_' + id.split(':').join('_'));
    },
    get_clientStateField: function() {
        return this._clientStateField;
    },
    set_clientStateField: function(value) {
        if (this.get_isInitialized()) throw Error.invalidOperation(Sys.Extended.UI.Resources.ExtenderBase_CannotSetClientStateField);
        if (this._clientStateField != value) {
            this._clientStateField = value;
            this.raisePropertyChanged('clientStateField');
        }
    },
    loadClientState: function(value) {
        /// <remarks>override this method to intercept client state loading after a callback</remarks>
    },
    saveClientState: function() {
        /// <remarks>override this method to intercept client state acquisition before a callback</remarks>
        return null;
    },
    _invoke: function(name, args, cb) {
        /// <summary>invokes a callback method on the server control</summary>        
        if (!this._callbackTarget) {
            throw Error.invalidOperation(Sys.Extended.UI.Resources.ExtenderBase_ControlNotRegisteredForCallbacks);
        }
        if (typeof (WebForm_DoCallback) === "undefined") {
            throw Error.invalidOperation(Sys.Extended.UI.Resources.ExtenderBase_PageNotRegisteredForCallbacks);
        }
        var ar = [];
        for (var i = 0; i < args.length; i++)
            ar[i] = args[i];
        var clientState = this.saveClientState();
        if (clientState != null && !String.isInstanceOfType(clientState)) {
            throw Error.invalidOperation(Sys.Extended.UI.Resources.ExtenderBase_InvalidClientStateType);
        }
        var payload = Sys.Serialization.JavaScriptSerializer.serialize({ name: name, args: ar, state: this.saveClientState() });
        WebForm_DoCallback(this._callbackTarget, payload, this._oncomplete$delegate, cb, this._onerror$delegate, true);
    },
    _oncomplete: function(result, context) {
        result = Sys.Serialization.JavaScriptSerializer.deserialize(result);
        if (result.error) {
            throw Error.create(result.error);
        }
        this.loadClientState(result.state);
        context(result.result);
    },
    _onerror: function(message, context) {
        throw Error.create(message);
    },
    _onsubmit: function() {
        if (this._clientStateField) {
            this._clientStateField.value = this.saveClientState();
        }
        return true;
    }

}
Sys.Extended.UI.ControlBase.registerClass("Sys.Extended.UI.ControlBase", Sys.UI.Control);

// resource strings pending localization support in jsbuild
Sys.Extended.UI.Resources = {
    "PasswordStrength_InvalidWeightingRatios":"Strength Weighting ratios must have 4 elements",
    "HTMLEditor_toolbar_button_FontSize_defaultValue":"default",
    "HTMLEditor_toolbar_button_DesignMode_title":"Design mode",
    "Animation_ChildrenNotAllowed":"AjaxControlToolkit.Animation.createAnimation cannot add child animations to type \"{0}\" that does not derive from AjaxControlToolkit.Animation.ParentAnimation",
    "PasswordStrength_RemainingSymbols":"{0} symbol characters",
    "HTMLEditor_toolbar_button_FixedForeColor_title":"Foreground color",
    "HTMLEditor_toolbar_popup_LinkProperties_field_URL":"URL",
    "ExtenderBase_CannotSetClientStateField":"clientStateField can only be set before initialization",
    "HTMLEditor_toolbar_button_Bold_title":"Bold",
    "RTE_PreviewHTML":"Preview HTML",
    "HTMLEditor_toolbar_popup_LinkProperties_button_OK":"OK",
    "HTMLEditor_toolbar_button_JustifyRight_title":"Justify Right",
    "RTE_JustifyCenter":"Justify Center",
    "PasswordStrength_RemainingUpperCase":"{0} more upper case characters",
    "HTMLEditor_toolbar_popup_LinkProperties_button_Cancel":"Cancel",
    "Animation_TargetNotFound":"AjaxControlToolkit.Animation.Animation.set_animationTarget requires the ID of a Sys.UI.DomElement or Sys.UI.Control.  No element or control could be found corresponding to \"{0}\"",
    "AsyncFileUpload_UnhandledException":"Unhandled Exception",
    "RTE_FontColor":"Font Color",
    "RTE_LabelColor":"Label Color",
    "Common_InvalidBorderWidthUnit":"A unit type of \"{0}\"\u0027 is invalid for parseBorderWidth",
    "HTMLEditor_toolbar_button_JustifyFull_title":"Justify",
    "RTE_Heading":"Heading",
    "AsyncFileUpload_ConfirmToSeeErrorPage":"Do you want to see the response page?",
    "Tabs_PropertySetBeforeInitialization":"{0} cannot be changed before initialization",
    "HTMLEditor_toolbar_button_StrikeThrough_title":"Strike through",
    "RTE_OrderedList":"Ordered List",
    "HTMLEditor_toolbar_button_OnPastePlainText":"Plain text pasting is switched on. Just now: {0}",
    "HTMLEditor_toolbar_button_RemoveLink_title":"Remove Link",
    "HTMLEditor_toolbar_button_FontName_defaultValue":"default",
    "HTMLEditor_toolbar_button_FontName_label":"Font",
    "ReorderList_DropWatcherBehavior_NoChild":"Could not find child of list with id \"{0}\"",
    "CascadingDropDown_MethodTimeout":"[Method timeout]",
    "RTE_Columns":"Columns",
    "RTE_InsertImage":"Insert Image",
    "RTE_InsertTable":"Insert Table",
    "RTE_Values":"Values",
    "RTE_OK":"OK",
    "ExtenderBase_PageNotRegisteredForCallbacks":"This Page has not been registered for callbacks",
    "HTMLEditor_toolbar_button_InsertLink_title":"Insert/Edit URL link",
    "Animation_NoDynamicPropertyFound":"AjaxControlToolkit.Animation.createAnimation found no property corresponding to \"{0}\" or \"{1}\"",
    "Animation_InvalidBaseType":"AjaxControlToolkit.Animation.registerAnimation can only register types that inherit from AjaxControlToolkit.Animation.Animation",
    "RTE_UnorderedList":"Unordered List",
    "AsyncFileUpload_UnknownServerError":"Unknown Server error",
    "ResizableControlBehavior_InvalidHandler":"{0} handler not a function, function name, or function text",
    "Animation_InvalidColor":"Color must be a 7-character hex representation (e.g. #246ACF), not \"{0}\"",
    "RTE_CellColor":"Cell Color",
    "PasswordStrength_RemainingMixedCase":"Mixed case characters",
    "HTMLEditor_toolbar_button_HtmlMode_title":"HTML text",
    "RTE_Italic":"Italic",
    "CascadingDropDown_NoParentElement":"Failed to find parent element \"{0}\"",
    "ValidatorCallout_DefaultErrorMessage":"This control is invalid",
    "HTMLEditor_toolbar_button_DecreaseIndent_title":"Decrease Indent",
    "RTE_Indent":"Indent",
    "ReorderList_DropWatcherBehavior_CallbackError":"Reorder failed, see details below.\\r\\n\\r\\n{0}",
    "PopupControl_NoDefaultProperty":"No default property supported for control \"{0}\" of type \"{1}\"",
    "RTE_Normal":"Normal",
    "PopupExtender_NoParentElement":"Couldn\u0027t find parent element \"{0}\"",
    "RTE_ViewValues":"View Values",
    "RTE_Legend":"Legend",
    "RTE_Labels":"Labels",
    "RTE_CellSpacing":"Cell Spacing",
    "PasswordStrength_RemainingNumbers":"{0} more numbers",
    "HTMLEditor_toolbar_popup_LinkProperties_field_Target":"Target",
    "HTMLEditor_toolbar_button_PreviewMode_title":"Preview",
    "RTE_Border":"Border",
    "RTE_Create":"Create",
    "RTE_BackgroundColor":"Background Color",
    "RTE_Cancel":"Cancel",
    "HTMLEditor_toolbar_button_PasteText_title":"Paste Plain Text",
    "RTE_JustifyFull":"Justify Full",
    "RTE_JustifyLeft":"Justify Left",
    "RTE_Cut":"Cut",
    "AsyncFileUpload_UploadingProblem":"The requested file uploading problem.",
    "ResizableControlBehavior_CannotChangeProperty":"Changes to {0} not supported",
    "RTE_ViewSource":"View Source",
    "Common_InvalidPaddingUnit":"A unit type of \"{0}\" is invalid for parsePadding",
    "RTE_Paste":"Paste",
    "ExtenderBase_ControlNotRegisteredForCallbacks":"This Control has not been registered for callbacks",
    "Calendar_Today":"Today: {0}",
    "MultiHandleSlider_CssHeightWidthRequired":"You must specify a CSS width and height for all handle styles as well as the rail.",
    "Common_DateTime_InvalidFormat":"Invalid format",
    "HTMLEditor_toolbar_button_Copy_title":"Copy",
    "ListSearch_DefaultPrompt":"Type to search",
    "CollapsiblePanel_NoControlID":"Failed to find element \"{0}\"",
    "RTE_ViewEditor":"View Editor",
    "HTMLEditor_toolbar_popup_LinkProperties_field_Target_Current":"Current window",
    "RTE_BarColor":"Bar Color",
    "AsyncFileUpload_InternalErrorMessage":"The AsyncFileUpload control has encountered an error with the uploader in this page. Please refresh the page and try again.",
    "HTMLEditor_toolbar_button_Underline_title":"Underline",
    "PasswordStrength_DefaultStrengthDescriptions":"NonExistent;Very Weak;Weak;Poor;Almost OK;Barely Acceptable;Average;Good;Strong;Excellent;Unbreakable!",
    "HTMLEditor_toolbar_button_SuperScript_title":"Super script",
    "HTMLEditor_toolbar_button_Ltr_title":"Left to right direction",
    "HTMLEditor_toolbar_button_RemoveAlignment_title":"Remove Alignment",
    "HTMLEditor_toolbar_button_OrderedList_title":"Ordered List",
    "HTMLEditor_toolbar_popup_LinkProperties_field_Target_New":"New window",
    "HTMLEditor_toolbar_popup_LinkProperties_field_Target_Top":"Top window",
    "HTMLEditor_toolbar_button_JustifyCenter_title":"Justify Center",
    "RTE_Inserttexthere":"Insert text here",
    "Animation_UknownAnimationName":"AjaxControlToolkit.Animation.createAnimation could not find an Animation corresponding to the name \"{0}\"",
    "ExtenderBase_InvalidClientStateType":"saveClientState must return a value of type String",
    "HTMLEditor_toolbar_button_JustifyLeft_title":"Justify Left",
    "Rating_CallbackError":"An unhandled exception has occurred:\\r\\n{0}",
    "HTMLEditor_toolbar_button_Undo_title":"Undo",
    "HTMLEditor_toolbar_button_Redo_title":"Redo",
    "Tabs_OwnerExpected":"owner must be set before initialize",
    "DynamicPopulate_WebServiceTimeout":"Web service call timed out",
    "PasswordStrength_RemainingLowerCase":"{0} more lower case characters",
    "HTMLEditor_toolbar_button_BulletedList_title":"Bulleted List",
    "HTMLEditor_toolbar_button_Paste_title":"Paste",
    "Animation_MissingAnimationName":"AjaxControlToolkit.Animation.createAnimation requires an object with an AnimationName property",
    "HTMLEditor_toolbar_button_PasteWord_title":"Paste from MS Word (with cleanup)",
    "HTMLEditor_toolbar_button_Italic_title":"Italic",
    "RTE_JustifyRight":"Justify Right",
    "Tabs_ActiveTabArgumentOutOfRange":"Argument is not a member of the tabs collection",
    "RTE_CellPadding":"Cell Padding",
    "HTMLEditor_toolbar_button_ForeColorClear_title":"Clear foreground color",
    "RTE_ClearFormatting":"Clear Formatting",
    "AlwaysVisible_ElementRequired":"AjaxControlToolkit.AlwaysVisibleControlBehavior must have an element",
    "HTMLEditor_toolbar_button_SubScript_title":"Sub script",
    "Slider_NoSizeProvided":"Please set valid values for the height and width attributes in the slider\u0027s CSS classes",
    "DynamicPopulate_WebServiceError":"Web Service call failed: {0}",
    "PasswordStrength_StrengthPrompt":"Strength: ",
    "HTMLEditor_toolbar_button_Rtl_title":"Right to left direction",
    "PasswordStrength_RemainingCharacters":"{0} more characters",
    "HTMLEditor_toolbar_button_BackColorClear_title":"Clear background color",
    "PasswordStrength_Satisfied":"Nothing more required",
    "RTE_Hyperlink":"Hyperlink",
    "Animation_NoPropertyFound":"AjaxControlToolkit.Animation.createAnimation found no property corresponding to \"{0}\"",
    "PasswordStrength_InvalidStrengthDescriptionStyles":"Text Strength description style classes must match the number of text descriptions.",
    "HTMLEditor_toolbar_button_Use_verb":"Use {0}",
    "HTMLEditor_toolbar_popup_LinkProperties_field_Target_Parent":"Parent window",
    "PasswordStrength_GetHelpRequirements":"Get help on password requirements",
    "HTMLEditor_toolbar_button_FixedBackColor_title":"Background color",
    "PasswordStrength_InvalidStrengthDescriptions":"Invalid number of text strength descriptions specified",
    "RTE_Underline":"Underline",
    "HTMLEditor_toolbar_button_IncreaseIndent_title":"Increase Indent",
    "AsyncFileUpload_ServerResponseError":"Server Response Error",
    "Tabs_PropertySetAfterInitialization":"{0} cannot be changed after initialization",
    "RTE_Rows":"Rows",
    "RTE_Redo":"Redo",
    "RTE_Size":"Size",
    "RTE_Undo":"Undo",
    "RTE_Bold":"Bold",
    "RTE_Copy":"Copy",
    "RTE_Font":"Font",
    "HTMLEditor_toolbar_button_FontSize_label":"Size",
    "HTMLEditor_toolbar_button_Cut_title":"Cut",
    "CascadingDropDown_MethodError":"[Method error {0}]",
    "HTMLEditor_toolbar_button_InsertLink_message_EmptyURL":"URL can not be empty",
    "RTE_BorderColor":"Border Color",
    "HTMLEditor_toolbar_button_RemoveStyles_title":"Remove styles",
    "RTE_Paragraph":"Paragraph",
    "RTE_InsertHorizontalRule":"Insert Horizontal Rule",
    "HTMLEditor_toolbar_button_Paragraph_title":"Make Paragraph",
    "Common_UnitHasNoDigits":"No digits",
    "RTE_Outdent":"Outdent",
    "Common_DateTime_InvalidTimeSpan":"\"{0}\" is not a valid TimeSpan format",
    "Animation_CannotNestSequence":"AjaxControlToolkit.Animation.SequenceAnimation cannot be nested inside AjaxControlToolkit.Animation.ParallelAnimation",
    "HTMLEditor_toolbar_button_InsertHR_title":"Insert horizontal rule",
    "HTMLEditor_toolbar_button_OnPasteFromMSWord":"Pasting from MS Word is switched on. Just now: {0}",
    "Shared_BrowserSecurityPreventsPaste":"Your browser security settings don\u0027t permit the automatic execution of paste operations. Please use the keyboard shortcut Ctrl+V instead."
};

} // execute

if (window.Sys && Sys.loader) {
    Sys.loader.registerScript(scriptName, ["ComponentModel", "Serialization"], execute);
}
else {
    execute();
}

})();
