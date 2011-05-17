$type = Array;
$type.__typeName = 'Array';
$type.__class = true;

// a private _indexOf allows for other public Array members to perform indexOf() without
// causing a double validation of its public parameters, a huge source of slowness in debug mode
// for code that uses any of the Array members that call indexOf (Array.remove and Array.contains).
// It is Sys._indexOf instead of Array._indexOf to avoid adding another member to a built-in type.
var indexOf = Sys._indexOf = function _indexOf(array, item, start) {
    if (typeof(item) === "undefined") return -1;
    var length = array.length;
    if (length !== 0) {
        // Coerce into number ("1a" will become NaN, which is consistent with the built-in behavior of similar Array methods)
        start = start - 0;
        // NaN becomes zero
        if (isNaN(start)) {
            start = 0;
        }
        else {
            // If start is positive or negative infinity, don't try to truncate it.
            // The infinite values will be handled correctly by the subsequent code.
            if (isFinite(start)) {
                // This is faster than doing Math.floor or Math.ceil
                start = start - (start % 1);
            }
            // Negative start indices start from the end
            if (start < 0) {
                start = Math.max(0, length + start);
            }
        }

        // A do/while loop seems to have equal performance to a for loop in this scenario
        for (var i = start; i < length; i++) {
            if (array[i] === item) {
                return i;
            }
        }
    }
    return -1;
}

$type.add = $type.enqueue = function Array$enqueue(array, item) {
    /// <summary locid="M:J#Array.enqueue">Adds an element at the end of the array.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to add to.</param>
    /// <param name="item" mayBeNull="true">The object to add.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true},
        {name: "item", mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    // Setting Array[Array.length] is faster than Array.push() for a single element.
    array[array.length] = item;
}

$type.addRange = function Array$addRange(array, items) {
    /// <summary locid="M:J#Array.addRange">Adds a range of items at the end of the array.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to add to.</param>
    /// <param name="items" type="Array" elementMayBeNull="true">The array of items to append.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true},
        {name: "items", type: Array, elementMayBeNull: true}
    ]);
    if (e) throw e;
    //#endif

    // Array.push() for multiple elements is faster than setting Array[Array.length] in a loop.
    array.push.apply(array, items);
}

$type.clear = function Array$clear(array) {
    /// <summary locid="M:J#Array.clear">Clears the array of its elements.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to clear.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    array.length = 0;
}

$type.clone = function Array$clone(array) {
    /// <summary locid="M:J#Array.clone">Makes a clone of the array.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to clone.</param>
    /// <returns type="Array" elementMayBeNull="true">A clone of the array.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    return array.length === 1 ? [array[0]] : Array.apply(null, array);
}

$type.contains = function Array$contains(array, item) {
    /// <summary locid="M:J#Array.contains">Use this method to determine if an array contains the specified element.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to look into.</param>
    /// <param name="item" mayBeNull="true">The object to find in the array.</param>
    /// <returns type="Boolean">True if the object was found.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true},
        {name: "item", mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    return (indexOf(array, item) >= 0);
}

$type.dequeue = function Array$dequeue(array) {
    /// <summary locid="M:J#Array.dequeue"></summary>
    /// <param name="array" type="Array" elementMayBeNull="true">Removes and returns the object at the beginning of the array.</param>
    /// <returns mayBeNull="true">The object that is removed from the beginning of the array.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    return array.shift();
}

$type.forEach = function Array$forEach(array, method, instance) {
    /// <summary locid="M:J#Array.forEach">Calls the specified function on each element of the array.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to enumerate.</param>
    /// <param name="method" type="Function">The method to call.   The method should take the array element, the index of the element and   the array itself as its parameters.</param>
    /// <param name="instance" optional="true" mayBeNull="true">The context under which the function must run (i.e. what 'this' means inside the function).</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true},
        {name: "method", type: Function},
        {name: "instance", mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    for (var i = 0, l = array.length; i < l; i++) {
        var elt = array[i];
        if (typeof(elt) !== 'undefined') method.call(instance, elt, i, array);
    }
}

//#if DEBUG
$type.indexOf = function Array$indexOf(array, item, start) {
    /// <summary locid="M:J#Array.indexOf">Finds the index in the array of the provided item.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to look into.</param>
    /// <param name="item" optional="true" mayBeNull="true">The object to find.</param>
    /// <param name="start" optional="true" mayBeNull="true">The index where the search begins.</param>
    /// <returns type="Number">The index of the item or -1 if it wasn't found.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true},
        {name: "item", mayBeNull: true, optional: true},
        {name: "start", mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    return indexOf(array, item, start);
}
//#else
$type.indexOf = indexOf;
//#endif

$type.insert = function Array$insert(array, index, item) {
    /// <summary locid="M:J#Array.insert">Inserts an item at the specified index.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to insert into.</param>
    /// <param name="index" mayBeNull="true">The index where the item will be inserted.</param>
    /// <param name="item" mayBeNull="true">The item to insert.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true},
        {name: "index", mayBeNull: true},
        {name: "item", mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    array.splice(index, 0, item);
}

$type.parse = function Array$parse(value) {
    /// <summary locid="M:J#Array.parse">Creates an array from a string representation of the form "[elt1, elt2, elt3]".</summary>
    /// <param name="value" type="String" mayBeNull="true">The string representation of the array.</param>
    /// <returns type="Array" elementMayBeNull="true">An array built from the string representation.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "value", type: String, mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    //#if DEBUG
    var v = value ? window.eval("(" + value + ")") : [];
    if (!Array.isInstanceOfType(v)) throw Error.argument('value', Sys.Res.arrayParseBadFormat);
    return v;
    //#else
    return value ? window.eval("(" + value + ")") : [];
    //#endif
}

$type.remove = function Array$remove(array, item) {
    /// <summary locid="M:J#Array.remove">Removes the first occurence of an item from the array.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to remove from.</param>
    /// <param name="item" mayBeNull="true">The item to remove.</param>
    /// <returns type="Boolean">True if the item was found.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true},
        {name: "item", mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    var index = indexOf(array, item);
    if (index >= 0) {
        array.splice(index, 1);
    }
    return (index >= 0);
}

$type.removeAt = function Array$removeAt(array, index) {
    /// <summary locid="M:J#Array.removeAt">Removes the item at the specified index from the array.</summary>
    /// <param name="array" type="Array" elementMayBeNull="true">The array to remove from.</param>
    /// <param name="index" mayBeNull="true">The index of the item to remove.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "array", type: Array, elementMayBeNull: true},
        {name: "index", mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    array.splice(index, 1);
}


