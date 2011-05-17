obj = Sys.ElementSet = function(selector, context) {
    /// <summary>Represents a set of DOM elements.</summary>
    /// <param name="selector">The DOM selector, array of DOM selectors, or array of DOM elements to query the document for.</param>
    /// <param name="context">A DOM selector (exclusive), A DOM element (exclusive), array of DOM elements (inclusive), or other Sys.ElementSet (exclusive) to restrict the search within.</param>
    this._elements = ((typeof(context) === "object") && typeof(context.query) === "function") ?
        context.query(selector).get() :
        Sys._find(selector, context) || [];
}
obj.prototype = {
    __class: true,
    components: function(type, index) {
        /// <summary>Gets the set of controls and behaviors associated with the current DOM elements.</summary>
        /// <param name="type" type="Function" mayBeNull="true" optional="true">Type to limit the search to.</param>
        /// <param name="index" type="Number" mayBeNull="true" optional="true">Index of the component to limit to.</param>
        /// <returns type="Sys.ComponentSet" />
        var elementSet = new Sys.ElementSet(this.get());
        return new Sys.ComponentSet(elementSet, type, index);
    },
    component: function(type, index) {
        /// <summary>Get the first control or behavior associated with the current set of DOM elements.</summary>
        /// <param name="type" type="Function" mayBeNull="true" optional="true">Type to limit the search to.</param>
        /// <param name="index" type="Number" mayBeNull="true" optional="true">Index of the component to return.</param>
        /// <returns type="Object" mayBeNull="true" />
        return this.components(type, index).get(0);
    },
    each: function(callback) {
        /// <summary>Enumerates all the matched elements, calling the given callback for each with the current element as the context.
        /// The callback may return false to cancel enumeration.</summary>
        /// <returns type="Sys.ElementSet"/>
        var elements = this._elements;
        for (var i = 0, l = elements.length; i < l; i++) {
            if (callback.call(elements[i], i) === false) break;
        }
        return this;
    },
    get: function(index) {
        /// <summary>Retrieves the element at the specified index.</summary>
        /// <param name="index" type="Number">The index of the element to retrieve. Omit to return all elements as an array.</param>
        /// <returns isDomElement="true">The element at the given index, or an array of all the matched elements.</returns>
        var elements = this._elements;
        return (typeof(index) === "undefined") ? (Array.apply(null, elements)) : (elements[index] || null);
    },
    find: function(selector) {
        /// <summary>Searches the current set of DOM elements with the given selector, including descendents.</summary>
        /// <param name="selector">DOM selector or array of DOM selectors to search with.</param>
        /// <returns type="Sys.ElementSet">A new element set with the matched elements.</returns>
        return new Sys.ElementSet(selector, this);
    },
    filter: function(selector) {
        /// <summary>Filters the current set of DOM elements by the given selector, excluding descendents.</summary>
        /// <param name="selector">DOM selector or array of elements to filter by.</param>
        /// <returns type="Sys.ElementSet">A new element set with the matched elements.</returns>
        return new Sys.ElementSet(Sys._find(selector, this._elements, false, true));
    }
}