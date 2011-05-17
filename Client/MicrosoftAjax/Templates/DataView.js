$type = Sys.UI.DataView = function DataView(element) {
    /// <summary locid="M:J#Sys.UI.DataView.#ctor">Uses a template to render a view of a data source.</summary>
    /// <param name="element">The element this control attaches to.</param>
    Sys.UI.DataView.initializeBase(this, [element]);
}
$type.prototype = {
    _autoFetch: false,
    _fetching: false,
    _changed: false,
    _data: null,
    _dataProvider: null,
    _wsp: null,
    _wspClass: null,
    _dirty: false,
    _stale: true,
    _dvTemplate: null,
    _eventType: 0,
    _httpVerb: null,
    _initialSelectedIndex: -1,
    _fetchParameters: null,
    _parentContext: null,
    _placeholder: null,
    _query: null,
    _contexts: null,
    _selectedIndex: -1,
    _selectedItemClass: null,
    _template: null,
    _timeout: 0,
    _request: null,
    add_command: function DataView$add_command(handler) {
    /// <summary locid="E:J#Sys.UI.DataView.command"></summary>
        this._addHandler("command", handler);
    },
    remove_command: function DataView$remove_command(handler) {
        this._removeHandler("command", handler);
    },
    add_rendering: function DataView$add_rendering(handler) {
    /// <summary locid="E:J#Sys.UI.DataView.rendering"></summary>
        this._addHandler("rendering", handler);
    },
    remove_rendering: function DataView$remove_rendering(handler) {
        this._removeHandler("rendering", handler);
    },
    add_rendered: function DataView$add_rendered(handler) {
    /// <summary locid="E:J#Sys.UI.DataView.rendered"></summary>
        this._addHandler("rendered", handler);
    },
    remove_rendered: function DataView$remove_rendered(handler) {
        this._removeHandler("rendered", handler);
    },
    add_itemRendered: function DataView$add_itemRendered(handler) {
    /// <summary locid="E:J#Sys.UI.DataView.itemRendered"></summary>
        this._addHandler("itemRendered", handler);
    },
    remove_itemRendered: function DataView$remove_itemRendered(handler) {
        this._removeHandler("itemRendered", handler);
    },
    add_itemRendering: function DataView$add_itemRendering(handler) {
    /// <summary locid="E:J#Sys.UI.DataView.itemRendering"></summary>
        this._addHandler("itemRendering", handler);
    },
    remove_itemRendering: function DataView$remove_itemRendering(handler) {
        this._removeHandler("itemRendering", handler);
    },
    add_fetchFailed: function DataView$add_fetchFailed(handler) {
    /// <summary locid="E:J#Sys.UI.DataView.fetchFailed"></summary>
        this._addHandler("fetchFailed", handler);
    },
    remove_fetchFailed: function DataView$remove_fetchFailed(handler) {
        this._removeHandler("fetchFailed", handler);
    },
    add_fetchSucceeded: function DataView$add_fetchSucceeded(handler) {
    /// <summary locid="E:J#Sys.UI.DataView.fetchSucceeded"></summary>
        this._addHandler("fetchSucceeded", handler);
    },
    remove_fetchSucceeded: function DataView$remove_fetchSucceeded(handler) {
        this._removeHandler("fetchSucceeded", handler);
    },
    get_viewData: function DataView$get_viewData() {
        /// <value mayBeNull="true" locid="P:J#Sys.UI.DataView.viewData">The data used to render the DataView.</value>
        return this._viewData || null;
    },
    get_data: function DataView$get_data() {
        /// <value mayBeNull="true" locid="P:J#Sys.UI.DataView.data">The data the DataView is bound to.</value>
        return this._data;
    },
    set_data: function DataView$set_data(value) {
        if (!this._setData || (this._data !== value)) {
            this._loadData(value);
        }
    },
    get_dataProvider: function DataView$get_dataProvider() {
        /// <value mayBeNull="true" locid="P:J#Sys.UI.DataView.dataProvider">The data provider to fetch data from. May be a JSON webservice service URI, instance of a Sys.Net.WebServiceProxy, or a class that implements Sys.Data.IDataProvider.</value>
        return this._provider || null;
    },
    set_dataProvider: function DataView$set_dataProvider(value) {
        this._dataProvider = this._wsp = this._wspClass = null;
        if (value instanceof Sys.ComponentSet) {
            value = value.get(0);
        }
        if (Sys.Data.IDataProvider.isImplementedBy(value)) {
            this._dataProvider = value;
        }
        else if (Sys.Net.WebServiceProxy.isInstanceOfType(value)) {
            this._wsp = value;
        }
        else if (Type.isClass(value) && value.inheritsFrom(Sys.Net.WebServiceProxy) && typeof(value.get_path) === "function") {
            this._wspClass = value;
        }
        //#if DEBUG
        else if ((value !== null) && (typeof(value) !== "string")) {
            throw Error.argument("dataProvider", Sys.UI.TemplatesRes.invalidDataProviderType);
        }
        //#endif
        this._provider = value;
        if (this.get_autoFetch() && this._isActive()) {
            if (value) {
                this._doAutoFetch();
            }
        }
        else {
            this._stale = true;
        }
    },
    get_autoFetch: function DataView$get_autoFetch() {
        /// <value locid="P:J#Sys.UI.DataView.autoFetch"></value>
        return this._autoFetch;
    },
    set_autoFetch: function DataView$set_autoFetch(value) {
        var was = this._autoFetch;
        if (typeof(value) === "string") {
            value = Boolean.parse(value);
        }
        //#if DEBUG
        else if (typeof(value) !== "boolean") {
            throw Error.invalidOperation(Sys.UI.TemplatesRes.stringOrBoolean);
        }
        //#endif
        this._autoFetch = value;
        if (this._isActive() && this._stale && !was && value) {
            // data is stale, and autoFetch was switched from false to true,
            // automatically fetch right away.
            this._doAutoFetch();
        }
    },
    get_isFetching: function DataView$get_isFetching() {
        /// <value type="Boolean" locid="P:J#Sys.UI.DataView.isFetching"></value>
        return this._fetching;
    },
    get_httpVerb: function DataView$get_httpVerb() {
        /// <value type="String" locid="P:J#Sys.UI.DataView.httpVerb"></value>
        return this._httpVerb || "POST";
    },
    set_httpVerb: function DataView$set_httpVerb(value) {
        this._httpVerb = value;
    },
    get_contexts: function DataView$get_contexts() {
        /// <value type="Array" elementType="Sys.UI.TemplateContext" elementMayBeNull="true" locid="P:J#Sys.UI.DataView.contexts"></value>
        return this._contexts;
    },
    get_fetchParameters: function DataView$get_fetchParameters() {
        /// <value type="Object" mayBeNull="true" locid="P:J#Sys.UI.DataView.fetchParameters">A dictionary of parameters to pass to the data service when fetching data.</value>
        return this._fetchParameters;
    },
    set_fetchParameters: function DataView$set_fetchParameters(value) {
        if (this._fetchParameters !== value) {
            this._fetchParameters = value;
            if (this.get_autoFetch() && this._isActive()) {
                this._doAutoFetch();
            }
            else {
                this._stale = true;
            }
        }
    },
    get_selectedData: function DataView$get_selectedData() {
        /// <value mayBeNull="true" locid="P:J#Sys.UI.DataView.selectedData">The data that is currently selected, or null if none.</value>
        var ret = null, selectedIndex = this.get_selectedIndex();
        if (selectedIndex > -1) {
            var data = this.get_viewData();
            if (data instanceof Array) {
                if (selectedIndex < data.length) {
                    ret = data[selectedIndex];
                }
            }
            else {
                ret = data;
            }
        }
        return ret;
    },
    get_selectedIndex: function DataView$get_selectedIndex() {
        /// <value locid="P:J#Sys.UI.DataView.selectedIndex">The current selected index.</value>
        return this._selectedIndex;
    },
    set_selectedIndex: function DataView$set_selectedIndex(value) {
        value = this._validateIndexInput(value);
        //#if DEBUG
        if (value < -1) {
            throw Error.argumentOutOfRange("value", value);
        }
        //#endif
        if (!this.get_isInitialized() || !this._setData) {
            this._selectedIndex = value;
        }
        else {
            this._applySelectedIndex(value);
        }
    },
    get_initialSelectedIndex: function DataView$get_initialSelectedIndex() {
        /// <value locid="P:J#Sys.UI.DataView.initialSelectedIndex">The initial selected index that selectedIndex will default to when data is loaded.</value>
        return this._initialSelectedIndex;
    },
    set_initialSelectedIndex: function DataView$set_initialSelectedIndex(value) {
        value = this._validateIndexInput(value);
        //#if DEBUG
        if (value < -1) {
            throw Error.argumentOutOfRange("value", value);
        }
        //#endif
        if (value !== this.get_initialSelectedIndex()) {
            this._initialSelectedIndex = value;
            this._raiseChanged("initialSelectedIndex");
        }
    },
    get_selectedItemClass: function DataView$get_selectedItemClass() {
        /// <value type="String" locid="P:J#Sys.UI.DataView.selectedItemClass"></value>
        return this._selectedItemClass || "";
    },
    set_selectedItemClass: function DataView$set_selectedItemClass(value) {
        var name = this.get_selectedItemClass();
        if (value !== name) {
            var index = this.get_selectedIndex();
            this._addRemoveCssClass(index, name, Sys.UI.DomElement.removeCssClass);
            this._addRemoveCssClass(index, value, Sys.UI.DomElement.addCssClass);
            this._selectedItemClass = value;
        }
    },
    get_timeout: function DataView$get_timeout() {
        /// <value type="Number" integer="true" locid="P:J#Sys.UI.DataView.timeout"></value>
        return this._timeout;
    },
    set_timeout: function DataView$set_timeout(value) {
        this._timeout = value;
    },
    get_fetchOperation: function DataView$get_fetchOperation() {
        /// <value mayBeNull="true" locid="P:J#Sys.UI.DataView.fetchOperation"></value>
        return this._query || "";
    },
    set_fetchOperation: function DataView$set_fetchOperation(value) {
        if (this._query !== value) {
            this._query = value;
            if (this.get_autoFetch() && this._isActive()) {
                if (value) {
                    this._doAutoFetch();
                }
            }
            else {
                this._stale = true;
            }
        }
    },    
    get_itemPlaceholder: function DataView$get_itemPlaceholder() {
        /// <value mayBeNull="true" locid="P:J#Sys.UI.DataView.itemPlaceholder">The DOM element or DOM element id next to which the DataView renders the item template.</value>
        return this._placeholder || null;
    },
    set_itemPlaceholder: function DataView$set_itemPlaceholder(value) {
        if (this._placeholder !== value) {
            this._placeholder = value;
            this._dirty = true;
            this._raiseChanged("itemPlaceholder");
        }
    },
    get_templateContext: function DataView$get_templateContext() {
        /// <value mayBeNull="true" type="Sys.UI.TemplateContext" locid="P:J#Sys.UI.DataView.templateContext">Used by nested templates to provide the context of the parent template.</value>
        return this._parentContext || Sys.UI.Template.findContext(this.get_element());
    },
    set_templateContext: function DataView$set_templateContext(value) {
        if (this._parentContext !== value) {
            this._parentContext = value;
            this._dirty = true;
            this._raiseChanged("templateContext");
        }
    },    
    get_itemTemplate: function DataView$get_itemTemplate() {
        /// <value mayBeNull="true" locid="P:J#Sys.UI.DataView.itemTemplate">The template to instantiate.</value>
        return this._template || null;
    },
    set_itemTemplate: function DataView$set_itemTemplate(value) {
        if (this._template !== value) {
            this._template = value;
            this._dirty = true;
            if (this._dvTemplate) {
                this._dvTemplate.dispose();
                this._dvTemplate = null;
            }
            if (this._isActive()) {
                this.raisePropertyChanged("itemTemplate");
                this.refresh();
            }
            else {
                this._changed = true;
            }
        }
    },
    _applySelectedIndex: function DataView$_applySelectedIndex(value, force) {
        var currentIndex = this.get_selectedIndex();
        if (force || (value !== currentIndex)) {
            var data = this.get_viewData(); 
            if (!(data instanceof Array)) {
                data = [data];
            }
            var outOfRange = (value < -1) || (value >= data.length);
            //#if DEBUG
            if (outOfRange) {
                throw Error.argumentOutOfRange("value", value);
            }
            //#endif
            this._selectedIndex = value;
            this._currentData = ((value === -1) || outOfRange) ? null : data[value];
            var className = this.get_selectedItemClass();
            this._addRemoveCssClass(currentIndex, className, Sys.UI.DomElement.removeCssClass);
            this._addRemoveCssClass(value, className, Sys.UI.DomElement.addCssClass);
            if (!this.get_isUpdating()) {
                if (value !== currentIndex) {
                    this.raisePropertyChanged('selectedIndex');
                }
            }
            else {
                this._changed = true;
            }
        }
        if (!this.get_isUpdating()) {
            this._raiseSelectedData();
        }
        else {
            this._changed = true;
        }
    },
    _addRemoveCssClass: function DataView$_addRemoveCssClass(index, className, addRemove) {
        if (className && (index > -1)) {
            var items = this.get_contexts(), l = items ? items.length : -1;
            if (l && (index < l)) {
                var elementsSet = items[index].nodes;
                if (elementsSet) {
                    for (var i = 0, len = elementsSet.length; i < len; i++) {
                        var element = elementsSet[i];
                        if (element.nodeType === 1) {
                            addRemove(element, className);
                        }
                    }
                }
            }
        }
    },
    _collectionChanged: function DataView$_collectionChanged(sender, args) {
        var oldSelected = this._currentData,
            changes = args.get_changes(),
            selectedIndex = this.get_selectedIndex(), oldIndex = selectedIndex;
        if (this._isActive()) {
            // _changing lets refresh know it should not reset the selected index
            this._changing = true;
            this.refresh();
        }
        else {
            this._dirty = true;
            return;
        }
        var data = this.get_viewData();
        if ((selectedIndex !== -1) && (selectedIndex < data.length) &&
            (data[selectedIndex] === oldSelected)) {
            // current index is already accurate for the current data
            // dont bother updating the selected index
            return;
        }
        // fix the selectedIndex to track the previous selected item
        for (var i = 0, l = changes.length; i < l; i++) {
            var change = changes[i];
            if (change.action === Sys.NotifyCollectionChangedAction.add) {
                if (selectedIndex >= change.newStartingIndex) {
                    selectedIndex += change.newItems.length;
                }
            }
            else {
                var index = change.oldStartingIndex, len = change.oldItems.length, lastIndex = index + len - 1;
                if (selectedIndex > lastIndex) {
                    // removed item(s) prior to the current selected index
                    selectedIndex -= len;
                }
                else if (selectedIndex >= index) {
                    // items removed include the selected index.
                    // (if selectedIndex < index then the first removed item is after it)
                    selectedIndex = -1;
                    break;
                }
            }
        }
        if (selectedIndex !== oldIndex) {
            this.set_selectedIndex(selectedIndex);
        }
    },
    _elementContains: function DataView$_elementContains(container, element, excludeSelf) {
        if (container === element) {
            return !excludeSelf;
        }
        do {
            element = element.parentNode;
            if (element === container) return true;
        }
        while (element);
        return false;
    },
    _raiseChanged: function DataView$_raiseChanged(name) {
        if (this._isActive()) {
            this.raisePropertyChanged(name);
        }
        else {
            this._changed = true;
        }
    },
    _raiseFailed: function DataView$_raiseFailed(request, error) {
	    var args = new Sys.Net.WebRequestEventArgs(request ? request.get_executor() : null, error);
        this.onFetchFailed(args);
        Sys.Observer.raiseEvent(this, "fetchFailed", args);
    },
    _raiseSelectedData: function DataView$_raiseSelectedData() {
        if (this._lastData !== this._currentData) {
            this._lastData = this._currentData;
            this.raisePropertyChanged('selectedData');
        }
    },
    _raiseSucceeded: function DataView$_raiseSucceeded(request, result) {
	    var args = new Sys.Net.WebRequestEventArgs(request ? request.get_executor() : null, null, result);
        this.onFetchSucceeded(args);
        Sys.Observer.raiseEvent(this, "fetchSucceeded", args);
    },
    _ensureTemplate: function DataView$_ensureTemplate(template) {
        if (!Sys.UI.Template.isInstanceOfType(template)) {
            template = Sys.UI.DomElement._ensureGet(template, this.get_templateContext(), "itemTemplate");
            if (template) {
                template = new Sys.UI.Template(template);
            }
        }
        return template;
    },
    _getTemplate: function DataView$_getTemplate() {
        // template not provided: template is same as element, unless element does not have sys-template.
        // also, template may be an instance of Template or a dom element.
        // this ensures we get back an actual Template instance, and that if 
        // one had to be created manually (because an element was provided) it
        // caches the instance in _dvTemplate.
        if (this._dvTemplate) return this._dvTemplate;
        var template = this.get_itemTemplate();
        if (!template) {
            // no template set, use DV's element
            var element = this.get_element();
            if (Sys.UI.Template._isTemplate(element)) {
                this._dvTemplate = template = new Sys.UI.Template(element);
            }
        }
        else if (!Sys.UI.Template.isInstanceOfType(template)) {
            // template set but it is an element or ID, create a template for it
            template = Sys.UI.DomElement._ensureGet(template, this.get_templateContext(), "itemTemplate");
            //#if DEBUG
            var e = this.get_element();
            if ((e !== template) && this._elementContains(e, template, true)) {
                throw Error.invalidOperation(Sys.UI.TemplatesRes.misplacedTemplate);
            }
            //#endif
            this._dvTemplate = template = new Sys.UI.Template(template);
        }
        //#if DEBUG
        else {
            // an actual Template instance was provided, just use it as-is
            if (this._elementContains(this.get_element(), template.get_element(), true)) {
                throw Error.invalidOperation(Sys.UI.TemplatesRes.misplacedTemplate);
            }
        }
        //#endif
        return template;
    },
    _loadData: function DataView$_loadData(value) {
        this._swapData(this._data, value);
        this._data = value;
        this._setData = true;
        this._stale = false;
        this._dirty = true;
        if (this._isActive()) {
            this.refresh();
            this.raisePropertyChanged("data");
        }
        else {
            this._changed = true;
        }
    },
    _resetSelectedIndex: function DataView$_resetSelectedIndex() {
        var data = this.get_viewData(), initialSelectedIndex = this.get_initialSelectedIndex(),
            selectedIndex = this.get_selectedIndex();
        if (!(data instanceof Array) || (initialSelectedIndex >= data.length)) {
            if (selectedIndex !== -1) {
                this.set_selectedIndex(-1);
                return;
            }
        } 
        else if (selectedIndex !== initialSelectedIndex) {
            this.set_selectedIndex(initialSelectedIndex);
            return;
        }
        this._currentData = this.get_selectedData();
        this._raiseSelectedData();
    },
    _initializeResults: function DataView$_initializeResults() {
        for (var i = 0, l = this._contexts.length; i < l; i++) {
            var ctx = this._contexts[i];
            if (ctx) ctx.initializeComponents();
        }
    },    
    _isActive: function DataView$_isActive() {
        return (this.get_isInitialized() && !this.get_isUpdating());
    },
    _raiseCommand: function DataView$_raiseCommand(args) {
        this.onCommand(args);
        Sys.Observer.raiseEvent(this, "command", args);
    },
    _raiseItem: function DataView$_raiseItem(type, args) {
        this['onItem' + type](args);
        Sys.Observer.raiseEvent(this, "item" + type, args);
    },
    abortFetch: function DataView$abortFetch() {
        /// <summary locid="M:J#Sys.UI.DataView.abortFetch">Aborts the current fetch request, if any.</summary>
        if (this._request) {
            this._request.get_executor().abort();
            this._request = null;
        }
        if (this._fetching) {
            this._fetching = false;
            this._raiseChanged("isFetching");
        }
    },    
    onBubbleEvent: function DataView$onBubbleEvent(source, args) {
        /// <summary locid="M:J#Sys.UI.DataView.onBubbleEvent"></summary>
        /// <param name="source">The object that triggered the event.</param>
        /// <param name="args" type="Sys.EventArgs">The event arguments.</param>
        /// <returns type="Boolean">If either the command is handled by a custom handler (args.set_cancel(true) is called), or  the command is 'select' and a selection is done, return true and stop bubbling. Otherwise, return false, and let the command bubbled up the hierarchy.</returns>
        if (Sys.CommandEventArgs.isInstanceOfType(args)) {
            this._raiseCommand(args);
            if (args.get_cancel()) {
                return true;
            }
            else {
                var name = args.get_commandName();
                if (name && (name.toLowerCase() === "select")) {
                    var index = args.get_commandArgument();
                    if (typeof(index) === "string") {
                        index = parseInt(index);
                    }
                    if (isNaN(index) || index === null) {
                        index = this._findContextIndex(source);
                        if (index === -1) {
                            index = this._findContextIndex(args.get_commandSource());
                            if (index === -1) {
                                index = null;
                            }
                        }
                    }
                    if (typeof(index) === "number") {
                        this.set_selectedIndex(index);
                        return true;
                    }
                }
            }
        }
        return false;
    },
    onRendering: function DataView$onRendering(args) {
        /// <summary locid="M:J#Sys.UI.DataView.onRendering">Called when a new set of data is about to be rendered by the DataView control.</summary>
        /// <param name="args" type="Sys.UI.DataViewEventArgs">Information about the data that is about to render.</param>
    },
    onRendered: function DataView$onRendered(args) {
        /// <summary locid="M:J#Sys.UI.DataView.onRendered">Called when a new set of data has rendered.</summary>
        /// <param name="args" type="Sys.UI.DataViewEventArgs">Information about the data that rendered.</param>
    },
    onFetchFailed: function DataView$onFetchFailed(args) {
        /// <summary locid="M:J#Sys.UI.DataView.onFetchFailed">Called when a request to fetch data has failed.</summary>
        /// <param name="args" type="Sys.Net.WebRequestEventArgs"></param>
    },
    onFetchSucceeded: function DataView$onFetchSucceeded(args) {
        /// <summary locid="M:J#Sys.UI.DataView.onFetchSucceeded">Called when a request to fetch data has succeeded.</summary>
        /// <param name="args" type="Sys.Net.WebRequestEventArgs"></param>
    },
    _doAutoFetch: function DataView$_doAutoFetch() {
        var e;
        try {
            if (this._dataProvider || this._provider) {
                this.fetchData();
                this._stale = false;
            }
        }
        catch (e) {
            this._raiseFailed(null, null);
        }
    },
    _findContextIndex: function DataView$_findContextIndex(source) {
        var containers = this._containers;
        if (source && containers) {
            var results = this.get_contexts();
            if (results) {
                var element = Sys.UI.DomElement._ensureGet(source, this.get_templateContext(), "source");
                if (element) {
                    // first find an element that is a parent of the source and is a top level child of a container
                    var parent = element.parentNode, dvElement = this.get_element(), cindex = -1;
                    while (parent && ((cindex = Sys._indexOf(containers, parent)) < 0) && (parent !== dvElement)) {
                        element = parent;
                        parent = parent.parentNode;
                    }
                    if (cindex > -1) {
                        var container = containers[cindex];
                        // find the template context that contains this node.
                        // one definitely should, since the element.parentnode is a container
                        for (var i = 0, l = results.length; i < l; i++) {
                            var result = results[i];
                            if ((result.containerElement === container) && (Sys._indexOf(result.nodes, element) > -1)) {
                                return i;
                            }
                        }
                    }
                }
            }
        }
        return -1;
    },
    findContext: function DataView$findContext(source) {
        /// <summary locid="M:J#Sys.UI.DataView.findContext">Finds the item context for a given DOM element.</summary>
        /// <param name="source">The element or element ID to get the context from.</param>
        /// <returns type="Sys.UI.TemplateContext" mayBeNull="true"></returns>
        var index = this._findContextIndex(source);
        return (index !== -1) ? this.get_contexts()[index] : null;
    },
    _clearContainer: function DataView$_clearContainer(container, placeholder) {
        var count = placeholder ? placeholder.__msajaxphcount : -1;
        if ((count > -1) && placeholder) placeholder.__msajaxphcount = 0;
        // -1 means the placeholder is alone in its container, and so it would be best
        // to just clear the container's content with innerHTML = "".
        // Only, be sure and 'save' the placeholder from certain death by
        // removing, then re-adding it.
        // One complication: this might fail in IE6,7, because you can't innerHTML some elements
        // like <table> and <tbody>, so for those you must remove all children one by one
        if (count < 0) {
            if (placeholder) {
                // ph might be null in the case of rendering directly into the DV's element,
                // then there is no ph to save.
                container.removeChild(placeholder);
            }
            Sys.Application.disposeElement(container, true);
            try {
                container.innerHTML = "";
            }
            catch(err) {
                // IE6,7 doesn't support clearing innerHTML for some elements, remove them manually
                var child;
                while((child = container.firstChild)) {
                    container.removeChild(child);
                }
            }
            if (placeholder) {
                container.appendChild(placeholder);
            }
        }
        else if (count > 0) {
            // desirable to dispose of the elements in document order, so behavior is the
            // same as with the innerHTML case above. The fastest way to do that is to
            // find where the first item is by finding the placeholder, then going backward
            // by 'count', then enumerating childNodes forward.
            // This would be easier if items were inserted _after_ the placeholder instead of
            // before, but that has other complications, like needing to remember a 'reference node'
            // since template always inserts before the given node.
            var i, l, start, children = container.childNodes;
            for (i = 0, l = children.length; i < l; i++) {
                if (children[i] === placeholder) {
                    break;
                }
            }
            start = i - count;
            for (i = 0; i < count; i++) {
                var element = children[start];
                // no need to increment start on each loop. We are removing an element, so they shift up.
                Sys.Application.disposeElement(element, false);
                container.removeChild(element);
            }
        }
    },
    _clearContainers: function DataView$_clearContainers(placeholders) {
        var i, l;
        for (i = 0, l = placeholders.length; i < l; i++) {
            // if a PH is null it means the container is the DV's element and there is
            // no specific placeholder specified, so templates are rendered directly into
            // the container
            var ph = placeholders[i],
                container = ph ? ph.parentNode : this.get_element();
            this._clearContainer(container, ph);
        }
        for (i = 0, l = this._contexts.length; i < l; i++) {
            var ctx = this._contexts[i];
            // we already disposed of all the nodes
            ctx.nodes = null;
            ctx.dispose();
        }
    },
    _isAlone: function DataView$_isAlone(container, ph) {
        // determines if a placeholder is 'alone' in its container (parentNode).
        // It is alone if:
        // (1) it is the only child node of the parent
        // (2) there are only empty text nodes before and/or after it, after discounting comment nodes
        // Technically text nodes might be significant and we shouldn't consider it 'alone'
        // but it is far more likely that adjacent textnodes that are only filled with whitespace
        // are just structural, as in:
        // <div id="container">
        //      <span id="placeholder"></span>
        // </div>
        // If someone intends for the whitespace to be significant they can enclose it in a span:
        // <div id="container"><span>
        // </span><span id="placeholder"></span>
        // </div>
        var childNodes = container.childNodes;
        if (childNodes.length === 1) return true;
        // see if there are any nodes before or after the ph that are not empty textnodes or comments
        var node = container.firstChild, notWhitespace = /\S/;
        while (node) {
            if (node !== ph) {
                var type = node.nodeType;
                if (type === 3) {
                    if (notWhitespace.test(node.nodeValue)) return false;
                }
                else if (type !== 8) {
                    return false;
                }
            }
            node = node.nextSibling;
        }
        return true;
    },
    refresh: function DataView$refresh() {
        /// <summary locid="M:J#Sys.UI.DataView.refresh">Forces a refresh of the rendering of the current data. Normally, a refresh occurs automatically when the data changes.</summary>
        if (!this._setData) return;
        var collectionChange = this._changing;
        this._changing = false;
        var data = this.get_data(),
            pctx = this.get_templateContext(),        
            renderArgs = new Sys.UI.DataViewEventArgs(data);
        renderArgs.itemTemplate = this._getTemplate();
        renderArgs.itemPlaceholder = Sys.UI.DomElement._ensureGet(this.get_itemPlaceholder(), pctx, "itemPlaceholder");
        this.onRendering(renderArgs);
        Sys.Observer.raiseEvent(this, "rendering", renderArgs);
        if (renderArgs.get_cancel()) return;
        this._viewData = data = renderArgs.data;

        var template = this._ensureTemplate(renderArgs.itemTemplate);
        this._dirty = false;
        var ph = Sys.UI.DomElement._ensureGet(renderArgs.itemPlaceholder, pctx, "itemPlaceholder"),
            element = this.get_element(),
            result, itemTemplate, args;
        if (this._placeholders) {
            // dispose of the elements we rendered last time
            // by removing them from their respective containers
            this._clearContainers(this._placeholders);
        }
        var list = data;
        var len;
        if ((data === null) || (typeof(data) === "undefined")) {
            len = 0;
        }
        else if (!(data instanceof Array)) {
            list = [data];
            len = 1;
        }
        else {
            len = data.length;
        }
        function clearAndShow() {
            if (!this._cleared) {
                if (Sys.UI.Template._isTemplate(element)) {
                    var selfTemplate = new Sys.UI.Template(element);
                    selfTemplate._ensureCompiled();
                    selfTemplate.dispose();
                    Sys.UI.DomElement.removeCssClass(element, "sys-template");
                }
                this._clearContainer(element, null);
                element.__msajaxphcount = -1;
                this._cleared = true;
            }
        }
        if (!len && template && template.get_element() === element) {
            // When the DV's template is itself, the dataview should only reveal
            // itself if something renders into it, or if there is no data at all.
            // Even when there is data, since the template/placeholder can
            // be switched dynamically per item, it won't necessarily be rendered into.
            clearAndShow.call(this);
        }
        var currentPh, lastPh, placeholders, container, containers, optionsChanged;
        this._placeholders = placeholders = [];
        this._containers = containers = [];
        this._contexts = new Array(len);
        // ensure the regular placeholder is hidden
        if (ph) ph.style.display = 'none';
        for (var i = 0; i < len; i++) {
            var item = list[i];
            args = new Sys.UI.DataViewEventArgs(item);
            args.itemTemplate = template;
            args.itemPlaceholder = ph;
            this._raiseItem("Rendering", args);
            // the event args supports modifying the template for each item in the Rendering event.
            itemTemplate = this._ensureTemplate(args.itemTemplate);
            currentPh = Sys.UI.DomElement._ensureGet(args.itemPlaceholder, pctx, "itemPlaceholder");
            // __msajaxphoption: this placeholder had to be moved because it is an <option> in a <select>
            // which cannot be hidden. phOption points to the actual placeholder created in its place.
            currentPh = currentPh ? (currentPh.__msajaxphoption || currentPh) : null;
            if (currentPh !== lastPh) {
                container = currentPh ? currentPh.parentNode : element;
                if (Sys._indexOf(placeholders, currentPh) < 0) {
                    if (currentPh) {
                        if (/^option$/i.test(currentPh.tagName) && /select/i.test(container.tagName)) {
                            // in IE, display:none does not hide options in selects.
                            // in FF, it hides it, but if it is the only option, it still shows up as the default value!
                            // We must remove the element, but that would make it impossible to repeat this
                            // process on future renderings. So we move it into a new hidden select, and replace it with
                            // a dummy placeholder, and then point the one at the other.
                            var newPh = document.createElement('_hiddenPlaceholder');
                            container.replaceChild(newPh, currentPh);
                            currentPh.__msajaxphoption = newPh;
                            newPh.appendChild(currentPh);
                            currentPh = newPh;
                        }
                        // ensure the placeholder is hidden
                        currentPh.style.display = 'none';
                        // see if this is an 'alone' placeholder, so we can clear out its container with innerHTML=""
                        // which is more efficient. 
                        var phcount = currentPh.__msajaxphcount;
                        if (typeof(phcount) === "undefined" && this._isAlone(container, currentPh)) {
                            // the first time it is used, do an initial clearing, to ensure there are no
                            // inconsistencies with the first and second renderings using this placeholder,
                            // since it's possible that there is some significant whitespace.
                            currentPh.__msajaxphcount = -1;
                            this._clearContainer(container, currentPh);
                        }
                    }
                    else {
                        // if ph is null, we are rendering directly into the DV's element.
                        // In that case we must be sure and clear out the content first, since
                        // it either contains the itemTemplate inline or has 'initial content'
                        // If we are a template be sure it is compiled first or we might be clearing it out
                        // before it had a chance to compile.
                        clearAndShow.call(this);
                    }
                    // keep an array of placeholders we used so we can dispose of the 
                    // created elements next rendering or during dispose
                    placeholders.push(currentPh);
                    // also keep track of the unique containers we use, which speeds
                    // findContext()
                    if (Sys._indexOf(containers, container) < 0) {
                        containers.push(container);
                        // when changing the options of a select, bindings or other consumers might need to know
                        // since the select will not automatically switch to the set selectedindex or value
                        if (/^select$/i.test(container.tagName)) {
                            optionsChanged = optionsChanged || [];
                            optionsChanged.push(container);
                        }
                    }
                }
            }
            lastPh = currentPh;
            if (itemTemplate) {
                result = itemTemplate.instantiateIn(container, data, item, i, currentPh, pctx);
            }
            else {
                result = merge(new Sys.UI.TemplateContext(), {
                    nodes: [],
                    dataItem: item,
                    data: data,
                    index: i,
                    parentContext: pctx
                });
            }
            args.context = result;
            this._contexts[i] = result;
            this._raiseItem("Rendered", result);
            // remember for each given PH how many elements were inserted before it,
            // so we can remove them later without affecting the existing siblings.
            // each templatecontext may have multiple top level elements, so it is not just +1
            // important that we raised the Rendered event before consuming result.nodes.length
            // in case an event handler added an additional element dynamically.
            if (itemTemplate && currentPh) {
                var count = currentPh.__msajaxphcount || 0;
                if (count > -1) {
                    // -1 means there is no need to keep count, it is 'alone' in the
                    // container and so clearing it out is just innerHTML=""
                    currentPh.__msajaxphcount = count + result.nodes.length;
                }
            }
        }
        
        if (optionsChanged) {
            for (i = 0; i < optionsChanged.length; i++) {
                Sys.Observer.raiseEvent(optionsChanged[i], "optionsChanged", Sys.EventArgs.Empty);
            }
        }

        if (!collectionChange) {
            // only reset the selected index if we are rendering due to 
            // a new set of data, not because the data was modified
            if (!this._rendered && this.get_selectedIndex() > -1) {
                this._applySelectedIndex(this.get_selectedIndex(), true);
            }
            else {
                // Reset the selectedIndex to the initial index if any
                this._resetSelectedIndex();
            }
        }
        this._rendered = true;

        var selectedClass = this.get_selectedItemClass();
        if (selectedClass) {
            var selectedIndex = this.get_selectedIndex();
            if (selectedIndex !== -1) {
                this._addRemoveCssClass(selectedIndex, selectedClass, Sys.UI.DomElement.addCssClass);
            }
        }
        this.raisePropertyChanged("viewData");
        this.onRendered(renderArgs);
        Sys.Observer.raiseEvent(this, "rendered", renderArgs);
        this._initializeResults();
    },
    _swapData: function DataView$_swapData(oldData, newData) {
        // observe the collection changing so we can re-render and fix up the selected index
        // remove changed handler from the old data, if any
        if (oldData) {
            switch (this._eventType) {
                case 1:
                    oldData.remove_collectionChanged(this._changedHandler);
                    break;
                case 2:
                    Sys.Observer.removeCollectionChanged(oldData, this._changedHandler);
                    break;
            }
        }
        // add changed handler to the new data -- if it has the event. If it does not have
        // the event but is an array use the observer.
        this._eventType = 0;
        if (newData) {
            if (!this._changedHandler) {
                this._changedHandler = Function.createDelegate(this, this._collectionChanged);
            }
            if (typeof(newData.add_collectionChanged) === "function") {
                newData.add_collectionChanged(this._changedHandler);
                this._eventType = 1;
            }
            else if (newData instanceof Array) {
                Sys.Observer.addCollectionChanged(newData, this._changedHandler);
                this._eventType = 2;
            }
        }
    },
    _validateIndexInput: function DataView$_validateIndexInput(value) {
        var type = typeof(value);
        if (type === "string") {
            value = parseInt(value);
            //#if DEBUG
            if (isNaN(value)) {
                throw Error.argument(Sys.UI.TemplatesRes.invalidSelectedIndexValue);
            }
            //#endif
        }
        //#if DEBUG
        else if (type !== "number") {
            throw Error.argument(Sys.UI.TemplatesRes.invalidSelectedIndexValue);
        }
        //#endif
        return value;
    },
    dispose: function DataView$dispose() {
        /// <summary locid="M:J#clearAndShow"></summary>
        // don't do this if the whole app is disposing or it will end up disposing each component twice.
        if (this._placeholders && !Sys.Application.get_isDisposing()) {
            this._clearContainers(this._placeholders);
        }
        if (this._dvTemplate) {
            this._dvTemplate.dispose();
        }
        if (this.get_isFetching()) {
            this.abortFetch();
            this._fetching = false;
        }
        this._swapData(this._data, null);
        this._currentData = this._lastData = this._placeholders = this._containers = this._placeholder =
        this._contexts = this._parentContext = this._dvTemplate = this._request = this._dataProvider =
        this._wsp = this._wspClass = this._provider = this._data = this._fetchParameters = this._query = null;
        Sys.UI.DataView.callBaseMethod(this, "dispose")
    }, 
    initialize: function DataView$initialize() {
        /// <summary locid="M:J#clearAndShow">Called when the component is initialized.</summary>
        Sys.UI.DataView.callBaseMethod(this, "initialize");
        this.refresh();
        this.updated();
    },
    fetchData: function DataView$fetchData(succeededCallback, failedCallback, mergeOption, userContext) {
        /// <summary locid="M:J#clearAndShow">Fetches data from the DataContext.</summary>
        /// <param name="succeededCallback" type="Function" mayBeNull="true" optional="true"></param>
        /// <param name="failedCallback" type="Function" mayBeNull="true" optional="true"></param>
        /// <param name="mergeOption" type="Sys.Data.MergeOption" mayBeNull="true" optional="true"></param>
        /// <param name="userContext" mayBeNull="true" optional="true"></param>
        /// <returns type="Sys.Net.WebRequest">The WebRequest used to perform the operation, if any.</returns>
        this._stale = false;
        var request, _this = this;
        function onSuccess(data) {
            _this._loadData(data);
            _this._fetching = false;
            _this._request = null;
            _this._raiseChanged("isFetching");
            _this._raiseSucceeded(request, data);
            if (succeededCallback) {
                succeededCallback(data, userContext, "fetchData");
            }
        }
        function onFail(error) {
            _this._fetching = false;
            _this._request = null;
            _this._raiseChanged("isFetching");
            _this._raiseFailed(request, error);
            if (failedCallback) {
                failedCallback(error, userContext, "fetchData");
            }
        }
        if (this._fetching) {
            this.abortFetch();
        }
        var dataProvider = this._dataProvider,
            wsp = this._wsp,
            wspc =  this._wspClass,
            query = this.get_fetchOperation(),
            parameters = this.get_fetchParameters() || null,
            httpVerb = this.get_httpVerb() || "POST",
            timeout = this.get_timeout() || 0;
        if (typeof(mergeOption) === "undefined") {
            mergeOption = null;
        }
        if (dataProvider) {
            request = dataProvider.fetchData(query, parameters, mergeOption, httpVerb, onSuccess, onFail, timeout, userContext);
        }
        else if (wsp) {
            var path = wsp.get_path();
            if (!path) {
                // generated proxy instances should use the static path when an instance has no path
                var type = Object.getType(wsp);
                if (type && (typeof(type.get_path) === "function")) {
                    path = type.get_path();
                }
            }
            //#if DEBUG
            Type._checkDependency("MicrosoftAjaxWebServices.js", "Sys.UI.DataView.fetchData");
            //#endif
            request = Sys.UI.DataView._fetchWSP(null, path, query, parameters, httpVerb, onSuccess, onFail, timeout || wsp.get_timeout());
        }
        else {
            //#if DEBUG
            Type._checkDependency("MicrosoftAjaxWebServices.js", "Sys.UI.DataView.fetchData");
            //#endif
            if (wspc) {
                request = Sys.UI.DataView._fetchWSP(null, wspc.get_path(), query, parameters, httpVerb, onSuccess, 
                                                         onFail, timeout || wspc.get_timeout());
            }
            else {
                request = Sys.UI.DataView._fetchWSP(null, this._provider, query, parameters, httpVerb, onSuccess, onFail, timeout);
            }
        }
        this._request = request;
        this._fetching = true;
        this._raiseChanged("isFetching");
        return request;
    },
    onCommand: function DataView$onCommand(args) {
        /// <summary locid="M:J#Sys.UI.DataView.onCommand">Raised when a command is raised.</summary>
        /// <param name="args" type="Sys.CommandEventArgs"></param>
    },
    onItemRendering: function DataView$onItemRendering(args) {
        /// <summary locid="M:J#Sys.UI.DataView.onItemRendering">Called before each item is rendered.</summary>
        /// <param name="args" type="Sys.UI.DataViewEventArgs"></param>
    },
    onItemRendered: function DataView$onItemRendered(args) {
        /// <summary locid="M:J#Sys.UI.DataView.onItemRendered">Called after each item is rendered.</summary>
        /// <param name="args" type="Sys.UI.TemplateContext"></param>
    },
    updated: function DataView$updated() {
        /// <summary locid="M:J#Sys.UI.DataView.updated">Called when beginUpdate and endUpdate are called.</summary>
        if (this._stale && this.get_autoFetch()) {
            this._doAutoFetch();
        }
        if (this._dirty) {
            this.refresh();
        }
        if (this._changed) {
            this.raisePropertyChanged("");
            this._changed = false;
        }
    }    
}
$type.registerClass("Sys.UI.DataView", Sys.UI.Control, Sys.UI.ITemplateContextConsumer);
Sys.registerComponent($type);
// Need to make sure functions calling this also check for dependency to "MicrosoftAjaxWebServices.js" script reference.
$type._fetchWSP = function DataView$_fetchWSP(dataContext, uri, operation, parameters, httpVerb, succeededCallback, failedCallback, timeout, context) {
    //#if DEBUG
    if (!uri) {
        throw Error.invalidOperation(Sys.UI.TemplatesRes.requiredUri);
    }
    //#endif
    return Sys.Net.WebServiceProxy.invoke(
        uri, operation,
        httpVerb === "GET", parameters, succeededCallback,
        failedCallback, context, timeout);
}
