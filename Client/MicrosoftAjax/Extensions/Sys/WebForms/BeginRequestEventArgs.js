$type = Sys.WebForms.BeginRequestEventArgs = function BeginRequestEventArgs(request, postBackElement, updatePanelsToUpdate) {
    /// <summary locid="M:J#Sys.WebForms.BeginRequestEventArgs.#ctor">The arguments for the PageRequestManager's beginRequest event. The beginRequest event is raised when a request is about to be made.</summary>
    /// <param name="request" type="Sys.Net.WebRequest">The web request for the EventArgs.</param>
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
    Sys.WebForms.BeginRequestEventArgs.initializeBase(this);
    this._request = request;
    this._postBackElement = postBackElement;
    this._updatePanelsToUpdate = updatePanelsToUpdate;
}

$type.prototype = {
    get_postBackElement: function BeginRequestEventArgs$get_postBackElement() {
        /// <value domElement="true" mayBeNull="true" locid="P:J#Sys.WebForms.BeginRequestEventArgs.postBackElement"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._postBackElement;
    },
    get_request: function BeginRequestEventArgs$get_request() {
        /// <value type="Sys.Net.WebRequest" locid="P:J#Sys.WebForms.BeginRequestEventArgs.request"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._request;
    },
    get_updatePanelsToUpdate: function BeginRequestEventArgs$get_updatePanelsToUpdate() {
        /// <value type="Array" elementType="String" locid="P:J#Sys.WebForms.BeginRequestEventArgs.updatePanelsToUpdate"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._updatePanelsToUpdate ? Array.clone(this._updatePanelsToUpdate) : [];
    }
}

$type.registerClass('Sys.WebForms.BeginRequestEventArgs', Sys.EventArgs);
