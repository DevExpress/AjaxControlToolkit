$type = Sys.WebForms.PageLoadingEventArgs = function PageLoadingEventArgs(panelsUpdating, panelsDeleting, dataItems) {
    /// <summary locid="M:J#Sys.WebForms.PageLoadingEventArgs.#ctor">The arguments for the PageRequestManager's pageLoading event. The pageLoading event is raised before the DOM has been updated.</summary>
    /// <param name="panelsUpdating" type="Array">An array of UpdatePanels that are going to be updated.</param>
    /// <param name="panelsDeleting" type="Array">An array of UpdatePanels that are going to be deleted.</param>
    /// <param name="dataItems" type="Object" mayBeNull="true"></param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "panelsUpdating", type: Array},
        {name: "panelsDeleting", type: Array},
        {name: "dataItems", type: Object, mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    Sys.WebForms.PageLoadingEventArgs.initializeBase(this);

    this._panelsUpdating = panelsUpdating;
    this._panelsDeleting = panelsDeleting;
    // Need to use "new Object()" instead of "{}", since the latter breaks code coverage.
    this._dataItems = dataItems || new Object();
}

$type.prototype = {
    get_dataItems: function PageLoadingEventArgs$get_dataItems() {
        /// <value type="Object" locid="P:J#Sys.WebForms.PageLoadingEventArgs.dataItems"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._dataItems;
    },

    get_panelsDeleting: function PageLoadingEventArgs$get_panelsDeleting() {
        /// <value type="Array" locid="P:J#Sys.WebForms.PageLoadingEventArgs.panelsDeleting"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._panelsDeleting;
    },

    get_panelsUpdating: function PageLoadingEventArgs$get_panelsUpdating() {
        /// <value type="Array" locid="P:J#Sys.WebForms.PageLoadingEventArgs.panelsUpdating"></value>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return this._panelsUpdating;
    }
}

$type.registerClass('Sys.WebForms.PageLoadingEventArgs', Sys.EventArgs);
