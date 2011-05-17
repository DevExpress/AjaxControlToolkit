$type = Sys.WebForms.PageLoadedEventArgs = function PageLoadedEventArgs(panelsUpdated, panelsCreated, dataItems) {
    /// <summary locid="M:J#Sys.WebForms.PageLoadedEventArgs.#ctor">The arguments for the PageRequestManager's pageLoaded event. The pageLoaded event is raised after the DOM has been updated.</summary>
    /// <param name="panelsUpdated" type="Array">An array of UpdatePanels that were updated.</param>
    /// <param name="panelsCreated" type="Array">An array of UpdatePanels that were created.</param>
    /// <param name="dataItems" type="Object" mayBeNull="true"></param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "panelsUpdated", type: Array},
        {name: "panelsCreated", type: Array},
        {name: "dataItems", type: Object, mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    Sys.WebForms.PageLoadedEventArgs.initializeBase(this);

    this._panelsUpdated = panelsUpdated;
    this._panelsCreated = panelsCreated;
    // Need to use "new Object()" instead of "{}", since the latter breaks code coverage.
    this._dataItems = dataItems || new Object();
}

$type.prototype = {
    get_dataItems: function PageLoadedEventArgs$get_dataItems() {
        /// <value type="Object" locid="P:J#Sys.WebForms.PageLoadedEventArgs.dataItems"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._dataItems;
    },

    get_panelsCreated: function PageLoadedEventArgs$get_panelsCreated() {
        /// <value type="Array" locid="P:J#Sys.WebForms.PageLoadedEventArgs.panelsCreated"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._panelsCreated;
    },

    get_panelsUpdated: function PageLoadedEventArgs$get_panelsUpdated() {
        /// <value type="Array" locid="P:J#Sys.WebForms.PageLoadedEventArgs.panelsUpdated"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._panelsUpdated;
    }
}

$type.registerClass('Sys.WebForms.PageLoadedEventArgs', Sys.EventArgs);
