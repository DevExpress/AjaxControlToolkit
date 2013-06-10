// (c) 2010 CodePlex Foundation



/// <reference name="MicrosoftAjax.debug.js" />
/// <reference name="MicrosoftAjaxTimer.debug.js" />
/// <reference name="MicrosoftAjaxWebForms.debug.js" />

(function() {
var scriptName = "ExtendedThreading";

function execute() {

var version = Sys.version;
if (!version && !Sys._versionChecked) {
    Sys._versionChecked = true;
    throw new Error("AjaxControlToolkit requires ASP.NET Ajax 4.0 scripts. Ensure the correct version of the scripts are referenced. If you are using an ASP.NET ScriptManager, switch to the ToolkitScriptManager in AjaxControlToolkit.dll.");
}

Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.DeferredOperation = function(delay, context, callback) {
    /// <summary>
    /// Used to define a cancellable async operation
    /// </summary>
    /// <param name="delay" type="Number" integer="true">the number of milliseconds to delay execution</param>
    /// <param name="context" type="Object" mayBeNull="true">an object used as the context for the callback method</param>
    /// <param name="callback" type="Function">The callback method to execute at the end of the delay</param>
    
    this._delay = delay;
    this._context = context;
    this._callback = callback;
    this._completeCallback = null;
    this._errorCallback = null;
    this._timer = null;
    this._callArgs = null;
    this._isComplete = false;
    this._completedSynchronously = false;
    this._asyncResult = null;
    this._exception = null;
    this._throwExceptions = true;
    this._oncomplete$delegate = Function.createDelegate(this, this._oncomplete);
    
    this.post = Function.createDelegate(this, this.post);
}
Sys.Extended.UI.DeferredOperation.prototype = {
    
    get_isPending : function() { 
        /// <summary>
        /// Gets whether there is an asynchronous operation pending
        /// </summary>
        /// <returns type="Boolean" />
        
        return (this._timer != null); 
    },
    
    get_isComplete : function() { 
        /// <summary>
        /// Gets whether the asynchronous operation has completed
        /// </summary>
        /// <returns type="Boolean" />
        
        return this._isComplete; 
    },
    
    get_completedSynchronously : function() {
        /// <summary>
        /// Gets whether the operation completed synchronously
        /// </summary>
        /// <returns type="Boolean" />
        
        return this._completedSynchronously;
    },
    
    get_exception : function() {
        /// <summary>
        /// Gets the current exception if there is one
        /// </summary>
        /// <returns type="Error" />
        
        return this._exception;
    },
    
    get_throwExceptions : function() {
        /// <summary>
        /// Gets whether to throw exceptions
        /// </summary>
        /// <returns type="Boolean" />
        
        return this._throwExceptions;
    },    
    set_throwExceptions : function(value) {
        /// <summary>
        /// Sets whether to throw exceptions
        /// </summary>
        /// <param name="value" type="Boolean">True if exceptions should be thrown, otherwise false</param>
        
        this._throwExceptions = value;
    },
    
    get_delay : function() { 
        /// <summary>
        /// Gets the current delay in milliseconds
        /// </summary>
        /// <returns type="Number" integer="true" />
        
        return this._delay; 
    },
    set_delay : function(value) { 
        /// <summary>
        /// Sets the current delay in milliseconds
        /// </summary>
        /// <param name="value" type="Number" integer="true">The delay in milliseconds</param>
        
        this._delay = value; 
    },
    
    post : function(args) {
        /// <summary>
        /// A method that can be directly attached to a delegate
        /// </summary>
        /// <param name="args" type="Object" parameterArray="true">The arguments to the method</param>
        
        var ar = [];
        for (var i = 0; i < arguments.length; i++) {
            ar[i] = arguments[i];
        }
        this.beginPost(ar, null, null);
    },
    
    beginPost : function(args, completeCallback, errorCallback) {
        /// <summary>
        /// Posts a call to an async operation on this port
        /// </summary>
        /// <param name="args" type="Array">An array of arguments to the method</param>
        /// <param name="completeCallback" type="Function" optional="true" mayBeNull="true">The callback to execute after the delayed function completes</param>
        /// <param name="errorCallback" type="Function" optional="true" mayBeNull="true">The callback to execute in the event of an exception in the delayed function</param>
        
        this.cancel();
        
        this._callArgs = Array.clone(args || []);
        this._completeCallback = completeCallback;
        this._errorCallback = errorCallback;
        
        if (this._delay == -1) {            
            try {
                this._oncomplete();
            } finally {
                this._completedSynchronously = true;
            }
        } else {            
            this._timer = setTimeout(this._oncomplete$delegate, this._delay);
        }
    }, 
    
    cancel : function() {
        /// <summary>
        /// Cancels a pending post
        /// </summary>
        
        if (this._timer) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        this._callArgs = null;
        this._isComplete = false;
        this._asyncResult = null;
        this._completeCallback = null;
        this._errorCallback = null;
        this._exception = null;
        this._completedSynchronously = false;
    },
    
    call : function(args) {
        /// <summary>
        /// Executes the deferred operation synchronously
        /// </summary>
        /// <param name="args" type="Object" parameterArray="true">The arguments to the method</param>
        
        var ar = [];
        for (var i = 0; i < arguments.length; i++) {
            ar[i] = arguments[i];
        }
        
        this.cancel();
        
        this._callArgs = ar;
        this._completeCallback = null;
        this._errorCallback = null;
        
        try {
            this._oncomplete();
        } finally {
            this._completedSynchronously = true;
        }
        if (this._exception) {
            throw this._exception;
        }
        return this._asyncResult;
    },
    
    complete : function() {
        /// <summary>
        /// Completes a pending post synchronously
        /// </summary>        
        
        if (this._timer) {
            try {
                this._oncomplete();
            } finally {
                this._completedSynchronously = true;
            }
            return this._asyncResult;
        } else if (this._isComplete) {
            return this._asyncResult;
        }
    },    
    
    _oncomplete : function() {
        /// <summary>
        /// Completes a pending post asynchronously
        /// </summary>

        var args = this._callArgs;
        var completeCallback = this._completeCallback;
        var errorCallback = this._errorCallback;
        
        this.cancel();
        try {
            if (args) {
                this._asyncResult = this._callback.apply(this._context, args);
            } else {
                this._asyncResult = this._callback.call(this._context);
            }
            this._isComplete = true;
            this._completedSynchronously = false;
            if (completeCallback) {
                completeCallback(this);
            }
        } catch (e) {
            this._isComplete = true;
            this._completedSynchronously = false;
            this._exception = e;
            if (errorCallback) {
                if (errorCallback(this)) {
                    return;
                }
            } 
            if (this._throwExceptions) {
                throw e;
            }
        }
    }
}
Sys.Extended.UI.DeferredOperation.registerClass("Sys.Extended.UI.DeferredOperation");

} // execute

if (window.Sys && Sys.loader) {
    Sys.loader.registerScript(scriptName, ["Core"], execute);
}
else {
    execute();
}

})();
