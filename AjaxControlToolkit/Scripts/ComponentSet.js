Sys.ComponentSet = function ComponentSet(elementSet, query, index) {
    this._elementSet = elementSet || (elementSet = new Sys.ElementSet());
    this._components = this._execute(elementSet, query, index);
}

Sys.ComponentSet.prototype = {
    __class: true,
    setProperties: function ComponentSet$setProperties(properties) {
        // Sets properties on the matched components.
        // "properties" - object with the names and values of the properties to set.
        return this.each(function() {
            Sys._set(this, properties);
        });
    },

    get: function ComponentSet$get(index) {
        // Returns the component at the specified index, or an array of all matches if not specified.
        var components = this._components;

        return (typeof (index) === "undefined") ? (Array.apply(null, components)) : (components[index || 0] || null);
    },

    each: function ComponentSet$each(callback) {
        // Enumerate all the found components. The index of the component are passed as parameters to a callback. You may return 'false' to cancel the enumeration.
        // "callback" - function called for each component.
        foreach(this._components, function(c, i) {
            if(callback.call(c, i) === false)
                return true;
        });

        return this;
    },

    elements: function ComponentSet$elements() {
        // Returns the underlying set of elements this component collection came from.
        return this._elementSet;
    },

    _execute: function ComponentSet$_execute(elementSet, query, index) {
        var components = [];
        function match(c) {
            var ctor;
            return (c instanceof query) ||
                ((ctor = c.constructor) && (
                    (ctor === query) ||
                    (ctor.inheritsFrom && ctor.inheritsFrom(query)) ||
                    (ctor.implementsInterface && ctor.implementsInterface(query))));
        }

        if(query instanceof Array)
            components.push.apply(components, query);
        else
            // query is a type or not set
            elementSet.each(function() {
                var c = this.control;

                if(c && (!query || match(c)))
                    components.push(c);

                foreach(this._behaviors, function(b) {
                    if(!query || match(b))
                        components.push(b);
                });
            });

        if((typeof (index) !== "undefined")) {
            if(components[index])
                components = [components[index]];
            else
                components = [];
        }

        return components;
    }
}