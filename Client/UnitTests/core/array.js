(function() {

module("array");

test("Add", function() {
    var a = [0, 1, 2, 3];
    Array.add(a, undefined);
    Array.add(a, null);
    Array.add(a, 6);
    same(a, [0, 1, 2, 3, undefined, null, 6], "Expected elements to be appended.");
});

test("AddRange", function() {
    var a = [0, 1, 2, 3];

    // For perf, Array.addRange() has special case for no items
    Array.addRange(a, []);
    same(a, [0, 1, 2, 3]);

    var b = [0, 1, 2];
    // b[3] is hole in array
    b[4] = undefined;
    b[5] = null;
    Array.addRange(a, b);

    // Array.addRange() treats a hole in the items array as equal to an element with value undefined
    same(a, [0, 1, 2, 3, 0, 1, 2, undefined, undefined, null],
        "Expected array to be appended.");
});

test("Clear", function() {
    var a = ['d', 'c', 'a', 'b'];
    Array.clear(a);
    equals(a.length, 0, "The array should have been emptied.");
});

test("Clone", function() {
    // For perf, Array.clone() has special case for arrays with 0 or 1 items
    var a = [];
    same(Array.clone(a), a);

    a = [undefined];
    same(Array.clone(a), a);

    a = [null];
    same(Array.clone(a), a);

    a = [0];
    same(Array.clone(a), a);

    delete(a[0]);
    // Array.clone() treats a hole in the array as equal to an element with value undefined
    same(Array.clone(a), [undefined]);

    a = [0, 1, 2];
    // a[3] is hole in array
    a[4] = undefined;
    a[5] = null;

    // Array.clone() treats a hole in the array as equal to an element with value undefined
    same(Array.clone(a), [0, 1, 2, undefined, undefined, null]);
});

test("Contains", function() {
    // Create sparse array
    var a = [undefined, null, 2, 3, 4];
    a[6] = 6;

    isFalse(Array.contains(a, undefined));

    isTrue(Array.contains(a, null));
    isTrue(Array.contains(a, 2));
    isTrue(Array.contains(a, 6));

    isFalse(Array.contains(a, 5));
    isFalse(Array.contains(a, "6"));
});

function _testForEachInstanceHelper(context) {
    var a = [null, 1, 'b'];
    var callbackElements = [];
    var callbackIndices = [];

    function callback(arrayElement, index, array) {
        // The "context" parameter to Array.forEach() is used as the "this" pointer inside the
        // callback method.  If "context" is unassigned, undefined, or null, then the global
        // object associated with the callback method is used instead.  In this case, the associated
        // global object is "window". See the documentation for the Mozilla implementation of
        // Array.forEach():
        // http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:forEach
        if (context === undefined || context === null) {
            // If Array.forEach() is called with undefined or null context, the "this" pointer should
            // be equal to the global "window".
            equals(this, window);
        }
        else {
            equals(this, context);
        }

        callbackElements.push(arrayElement);
        callbackIndices.push(index);
        equals(array, a);
    }

    if (arguments.length === 0) {
        Array.forEach(a, callback);
    }
    else {
        Array.forEach(a, callback, context);
    }

    same(callbackElements, a);
    same(callbackIndices, [0, 1, 2]);
}

test("ForEachInstanceUnassigned", function() {
    _testForEachInstanceHelper();
});

test("ForEachInstanceUndefined", function() {
    _testForEachInstanceHelper(undefined);
});

test("ForEachInstanceNull", function() {
    _testForEachInstanceHelper(null);
});

test("ForEachInstanceObject", function() {
    _testForEachInstanceHelper({});
});

test("ForEachElementUnassigned", function() {
    var a = [null, 1];
    a[3] = 'd';
    var callbackElements = [];
    var callbackIndices = [];

    function callback(arrayElement, index, array) {
        callbackElements.push(arrayElement);
        callbackIndices.push(index);
        equals(array, a);
    }

    Array.forEach(a, callback);

    same(callbackElements, [null, 1, 'd']);
    same(callbackIndices, [0, 1, 3]);
});

test("ForEachElementUndefined", function() {
    var a = [null, 1, undefined, 'd'];
    var callbackElements = [];
    var callbackIndices = [];

    function callback(arrayElement, index, array) {
        callbackElements.push(arrayElement);
        callbackIndices.push(index);
        equals(array, a);
    }

    Array.forEach(a, callback);

    same(callbackElements, [null, 1, 'd']);
    same(callbackIndices, [0, 1, 3]);
});

test("IndexOf", function() {
    var a = ['d', 'c', 'a', 'b', 'c', 'e'];
    a[7] = undefined;
    a[8] = null;

    equals(Array.indexOf(a), -1, "No item to find yields -1.");
    equals(Array.indexOf(a, undefined), -1, "undefined item yields -1.");

    equals(Array.indexOf(a, 'x'), -1, "Unfound item yields -1.");
    equals(Array.indexOf(a, 'a'), 2, "a has index 2.");
    equals(Array.indexOf(a, 'c'), 1, "c has index 1.");
    equals(Array.indexOf(a, 'c', 1), 1, "c has index 1 starting from 1.");
    equals(Array.indexOf(a, 'c', 1.5), 1, "c has index 1 starting from 1.5.");
    equals(Array.indexOf(a, 'c', "1.5"), 1, "c has index 1 starting from '1.5'.");
    equals(Array.indexOf(a, 'c', "2.5a"), 1, "c has index 1 starting from '2.5a'.");
    equals(Array.indexOf(a, 'c', undefined), 1, "c has index 1 starting from undefined.");
    equals(Array.indexOf(a, 'c', null), 1, "c has index 1 starting from null.");
    equals(Array.indexOf(a, 'c', {}), 1, "c has index 1 starting from {}.");
    equals(Array.indexOf(a, 'c', Number.NaN), 1, "c has index 1 starting from Number.NaN.");
    equals(Array.indexOf(a, 'c', Number.NEGATIVE_INFINITY), 1, "c has index 1 starting from Number.NEGATIVE_INFINITY.");
    equals(Array.indexOf(a, 'c', Number.POSITIVE_INFINITY), -1, "c has index -1 starting from Number.POSITIVE_INFINITY.");
    equals(Array.indexOf(a, 'c', Number.MIN_VALUE), 1, "c has index 1 starting from Number.MIN_VALUE.");
    equals(Array.indexOf(a, 'c', Number.MAX_VALUE), -1, "c has index -1 starting from Number.MAX_VALUE.");
    equals(Array.indexOf(a, 'c', -Number.MAX_VALUE), 1, "c has index 1 starting from -Number.MAX_VALUE.");
    equals(Array.indexOf(a, 'c', 2), 4, "c has index 4 starting from 2.");
    equals(Array.indexOf(a, 'e', -4), 5, "e has index 5 starting from four characters before the end.");
    equals(Array.indexOf(a, 'e', -5.5), 5, "e has index 5 starting from 5.5 characters before the end.");
    equals(Array.indexOf(a, 'c', -5), 4, "c has index 4 starting from four characters before the end.");
    equals(Array.indexOf(a, 'c', -7), 4, "c has index 4 starting from six characters before the end.");
    equals(Array.indexOf(a, 'c', -8), 1, "c has index 1 starting from sevene characters before the end.");
    equals(Array.indexOf(a, 'c', -13), 1, "c has index 1 starting from twelve characters before the end (which is out of bounds).");
    equals(Array.indexOf(a, null), 8, "null has index 8.");
    equals(Array.indexOf(a, null, -1), 8, "null has index 8 starting from the end.");
});

test("Insert", function() {
    var a = ['d', 'c', 'a', 'b'];

    Array.insert(a, 2, 'e');
    same(a, ['d', 'c', 'e', 'a', 'b'], "Expected element 'e' to be inserted after 'c'.");

    Array.insert(a, -2, 'f');
    same(a, ['d', 'c', 'e', 'f', 'a', 'b'], "Expected element 'f' to be inserted before 'b'.");

    Array.insert(a, 6, 'g');
    same(a, ['d', 'c', 'e', 'f', 'a', 'b', 'g'], "Expected element 'g' to be inserted after 'b'.");
});

test("InsertUndefinedNull", function() {
    var a = [0, 1, 2];

    Array.insert(a, undefined, 3);
    same(a, [3, 0, 1, 2]);

    Array.insert(a, null, 4);
    same(a, [4, 3, 0, 1, 2]);

    Array.insert(a, 1, undefined);
    same(a, [4, undefined, 3, 0, 1, 2]);

    Array.insert(a, 1, null);
    same(a, [4, null, undefined, 3, 0, 1, 2]);
});

test("InstanceOf", function() {
    var a = [ 0, 1, 2 ];
    instanceOfType(a, Array);
    notInstanceOfType(a, Number);
    instanceOfType(a[0], Number,
        "Element in array expected to be an instance of a Number.");
});

test("IsClass", function() {
    isTrue(Type.isClass(Array));
});

test("Misc", function() {
    // N.B.: sort and reverse are not Atlas extensions, they are built-in JavaScript methods on array.
    var a = ['d', 'c', 'a', 'b'];

    // Testing areEqual
    same(a, ['d', 'c', 'a', 'b'], "Expected arrays to be seen as equal.");
    a.sort();
    same(a, ['a', 'b', 'c', 'd'], "Expected array to be sorted.");
    a.reverse();
    same(a, ['d', 'c', 'b', 'a'], "Expected array to be reversed.");
});

test("Parse", function() {
    var a = Array.parse('[\'d\', \'c\', \'a\', \'b\']');
    same(a, ['d', 'c', 'a', 'b'], "Expected arrays to be equal.");
});

test("ParseEmpty", function() {
    var parseEmpty = Array.parse('');
    same(parseEmpty, [], "Expected empty string to parse to empty array.");
    var parseNull = Array.parse(null);
    same(parseNull, [], "Expected null to parse to empty array.");
    var parseUndefined = Array.parse(undefined);
    same(parseUndefined, [], "Expected undefined to parse to empty array.");
});

test("Queue", function() {
    var a = [];
    Array.enqueue(a, 'd');
    Array.enqueue(a, 'c');
    Array.enqueue(a, 'a');
    Array.enqueue(a, 'b');
    equals(Array.dequeue(a), "d", "Expected d to be dequeued.");
    equals(Array.dequeue(a), "c", "Expected c to be dequeued.");
    equals(Array.dequeue(a), "a", "Expected a to be dequeued.");
    equals(Array.dequeue(a), "b", "Expected b to be dequeued.");
    equals(a.length, 0, "Expected array to be empty.");
});

test("Remove", function() {
    var a = []
    a[0] = 'd';
    // a[1] is hole in array
    a[2] = 'c';
    a[3] = undefined;
    a[4] = null;
    a[5] = 'a';
    a[6] = 'b';

    Array.remove(a, null);
    same(a, ['d', undefined, 'c', undefined, 'a', 'b']);

    Array.remove(a, 'a');
    same(a, ['d', undefined, 'c', undefined, 'b']);

    Array.remove(a, undefined);
    same(a, ['d', undefined, 'c', undefined, 'b']);
});

test("RemoveAt", function() {
    var a = ['f', 'e', 'd', 'c', 'b'];

    Array.removeAt(a, undefined);
    same(a, ['e', 'd', 'c', 'b']);

    Array.removeAt(a, null);
    same(a, ['d', 'c', 'b']);

    Array.removeAt(a, 1);
    same(a, ['d', 'b']);

    Array.removeAt(a, -2);
    same(a, ['b']);
});

test("TypeName", function() {
    equals(Object.getTypeName([]), "Array");
});

if (Sys.Debug.isDebug) {
    // put tests that run in debug mode only here
    
    test("ForEachMethodUnassigned", function() {
        expectException(function() {
            Array.forEach([0]);
        }, { name: "Sys.ParameterCountException" });
    });

    test("ForEachMethodUndefined", function() {
        expectException(function() {
            Array.forEach([0], undefined);
        }, {
            name: "Sys.ArgumentUndefinedException",
            paramName: "method"
        });
    });

    test("ForEachMethodNull", function() {
        expectException(function() {
            Array.forEach([0], null);
        }, {
            name: "Sys.ArgumentNullException",
            paramName: "method"
        });
    });

    test("ForEachMethodNotFunction", function() {
        expectException(function() {
            Array.forEach([0], {});
        }, {
            name: "Sys.ArgumentTypeException",
            paramName: "method",
            actualType: Object,
            expectedType: Function
        });
    });
    
    test("ParseNoStartingBraceString", function() {
        expectException(function() {
            Array.parse('1, 2, 3, 4]');
        }, { name: "SyntaxError" });
    });

    test("ParseNoEndingBraceString", function() {
        expectException(function() {
            Array.parse('[1, 2, 3, 4');
        }, { name: "SyntaxError" });
    });
    
    test("ParseNotAnArray", function() {
        expectException(function() {
            Array.parse('({a: \'One\', b: \'Two\'})');
        }, {
            name: "Sys.ArgumentException",
            paramName: 'value',
            message: 'Sys.ArgumentException: Value must be a valid string representation for an array. It must start with a \'[\' and end with a \']\'.\nParameter name: value'
        });
    });
}

})();
