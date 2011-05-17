$type = Sys.WebForms.InitializeRequestEventArgs = function InitializeRequestEventArgs(request, postBackElement, updatePanelsToUpdate) {
    /// <summary locid="M:J#Sys.WebForms.InitializeRequestEventArgs.#ctor">The arguments for the PageRequestManager's initializeRequest event. The initializeRequest event is raised when a request is being prepared and can be cancelled.</summary>
    /// <param name="request" type="Sys.Net.WebRequest">The web request to be packaged in this EventArgs.</param>
    /// <param name="postBackElement" domElement="true" mayBeNull="true">The postback element that initiated the async postback.</param>
    /// <param name="updatePanelsToUpdate" type="Array" elementType="String" mayBeNull="true" optional="true">A list of UniqueIDs for UpdatePanel controls that are requested to update their rendering by the client. Server-side processing may update additional UpdatePanels.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "request", type: Sys.Net.WebRequest},
        {name: "postBackElement", mayBeNull: true, domElement: true},
        {name: "updatePanelsToUpdate", type: Array, mayBeNull: true, optional: true, elementType: String}
    ]);
    if (e) throw e;
    //#endif
    Sys.WebForms.InitializeRequestEventArgs.initializeBase(this);
    this._request = request;
    this._postBackElement = postBackElement;
    this._updatePanelsToUpdate = updatePanelsToUpdate;
}

$type.prototype = {
    get_postBackElement: function InitializeRequestEventArgs$get_postBackElement() {
        /// <value domElement="true" mayBeNull="true" locid="P:J#Sys.WebForms.InitializeRequestEventArgs.postBackElement"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._postBackElement;
    },
    get_request: function InitializeRequestEventArgs$get_request() {
        /// <value type="Sys.Net.WebRequest" locid="P:J#Sys.WebForms.InitializeRequestEventArgs.request"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._request;
    },
    get_updatePanelsToUpdate: function InitializeRequestEventArgs$get_updatePanelsToUpdate() {
        /// <value type="Array" elementType="String" locid="P:J#Sys.WebForms.InitializeRequestEventArgs.updatePanelsToUpdate"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._updatePanelsToUpdate ? Array.clone(this._updatePanelsToUpdate) : [];
    },
    set_updatePanelsToUpdate: function InitializeRequestEventArgs$set_updatePanelsToUpdate(value) {
        //#if DEBUG
        var e = Function._validateParams(arguments, [{name: "value", type: Array, elementType: String}]);
        if (e) throw e;
        //#endif
        this._updated = true;
        this._updatePanelsToUpdate = value;
    }
}

$type.registerClass('Sys.WebForms.InitializeRequestEventArgs', Sys.CancelEventArgs);
