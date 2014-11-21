Type.registerNamespace('Sys.Extended.UI');

Sys.Extended.UI.DeferredOperation = function(delay, context, callback) {
    // Used to define a cancellable async operation
    // "delay" - the number of milliseconds to delay execution
    // "context" - an object used as the context for the callback method
    // "callback" - the callback method to execute at the end of the delay

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

    // post to ensure that attaching it always gets the port as its context
    this.post = Function.createDelegate(this, this.post);
}

Sys.Extended.UI.DeferredOperation.prototype = {

    get_isPending: function() {
        return (this._timer != null);
    },

    get_isComplete: function() {
        return this._isComplete;
    },

    get_completedSynchronously: function() {
        return this._completedSynchronously;
    },

    get_exception: function() {
        return this._exception;
    },

    get_throwExceptions: function() {
        return this._throwExceptions;
    },

    set_throwExceptions: function(value) {
        // Sets whether to throw exceptions
        this._throwExceptions = value;
    },

    get_delay: function() {
        // Gets the current delay in milliseconds
        return this._delay;
    },

    set_delay: function(value) {
        // Sets the current delay in milliseconds
        this._delay = value;
    },

    post: function(args) {
        // A method that can be directly attached to a delegate
        var ar = [];
        for(var i = 0; i < arguments.length; i++)
            ar[i] = arguments[i];

        this.beginPost(ar, null, null);
    },

    beginPost: function(args, completeCallback, errorCallback) {
        // Posts a call to an async operation on this port

        // cancel any pending post
        this.cancel();

        // cache the call arguments
        this._callArgs = Array.clone(args || []);
        this._completeCallback = completeCallback;
        this._errorCallback = errorCallback;

        if(this._delay == -1) {
            // if there is no delay (-1), complete synchronously
            try {
                this._oncomplete();
            } finally {
                this._completedSynchronously = true;
            }
        } else {
            // complete the post on a seperate call after a delay
            this._timer = setTimeout(this._oncomplete$delegate, this._delay);
        }
    },

    cancel: function() {
        if(this._timer) {
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

    call: function(args) {
        // Executes the deferred operation synchronously

        var ar = [];
        for(var i = 0; i < arguments.length; i++)
            ar[i] = arguments[i];

        // cancel any pending post
        this.cancel();

        // cache the call arguments
        this._callArgs = ar;
        this._completeCallback = null;
        this._errorCallback = null;

        try {
            this._oncomplete();
        } finally {
            this._completedSynchronously = true;
        }

        if(this._exception)
            throw this._exception;

        return this._asyncResult;
    },

    complete: function() {
        // Completes a pending post synchronously

        if(this._timer) {
            try {
                this._oncomplete();
            } finally {
                this._completedSynchronously = true;
            }

            return this._asyncResult;
        } else if(this._isComplete) {
            return this._asyncResult;
        }
    },

    _oncomplete: function() {
        // Completes a pending post asynchronously

        var args = this._callArgs,
            completeCallback = this._completeCallback,
            errorCallback = this._errorCallback;

        // clear the post state
        this.cancel();
        try {
            // call the post callback
            if(args)
                this._asyncResult = this._callback.apply(this._context, args);
            else
                this._asyncResult = this._callback.call(this._context);

            this._isComplete = true;
            this._completedSynchronously = false;

            if(completeCallback)
                completeCallback(this);
        } catch(e) {
            this._isComplete = true;
            this._completedSynchronously = false;
            this._exception = e;

            if(errorCallback)
                if(errorCallback(this))
                    return;

            if(this._throwExceptions)
                throw e;
        }
    }
}

Sys.Extended.UI.DeferredOperation.registerClass("Sys.Extended.UI.DeferredOperation");