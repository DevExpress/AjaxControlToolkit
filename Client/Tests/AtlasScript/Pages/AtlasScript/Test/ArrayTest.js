/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("AtlasScript.Test");

AtlasScript.Test.ArrayTest = function() {

    this.testAdd = function() {
        var a = [0, 1, 2, 3];
        Array.add(a, undefined);
        Array.add(a, null);
        Array.add(a, 6);
        AtlasUnit.Assert.elementsEqual([0, 1, 2, 3, undefined, null, 6], a, "Expected elements to be appended.");
    }

    this.testAddRange = function() {
        var a = [0, 1, 2, 3];

        // For perf, Array.addRange() has special case for no items
        Array.addRange(a, []);
        AtlasUnit.Assert.elementsEqual([0, 1, 2, 3], a);

        var b = [0, 1, 2];
        // b[3] is hole in array
        b[4] = undefined;
        b[5] = null;
        Array.addRange(a, b);

        // Array.addRange() treats a hole in the items array as equal to an element with value undefined
        AtlasUnit.Assert.elementsEqual([0, 1, 2, 3, 0, 1, 2, undefined, undefined, null], a,
            "Expected array to be appended.");
    }

    this.testClear = function() {
        var a = ['d', 'c', 'a', 'b'];
        Array.clear(a);
        AtlasUnit.Assert.areEqual(0, a.length, "The array should have been emptied.");
    }

    this.testClone = function() {
        // For perf, Array.clone() has special case for arrays with 0 or 1 items
        var a = [];
        AtlasUnit.Assert.elementsEqual(a, Array.clone(a));

        a = [undefined];
        AtlasUnit.Assert.elementsEqual(a, Array.clone(a));

        a = [null];
        AtlasUnit.Assert.elementsEqual(a, Array.clone(a));

        a = [0];
        AtlasUnit.Assert.elementsEqual(a, Array.clone(a));

        delete(a[0]);
        // Array.clone() treats a hole in the array as equal to an element with value undefined
        AtlasUnit.Assert.elementsEqual([undefined], Array.clone(a));

        a = [0, 1, 2];
        // a[3] is hole in array
        a[4] = undefined;
        a[5] = null;

        // Array.clone() treats a hole in the array as equal to an element with value undefined
        AtlasUnit.Assert.elementsEqual([0, 1, 2, undefined, undefined, null], Array.clone(a));
    }

    this.testContains = function() {
        // Create sparse array
        var a = [undefined, null, 2, 3, 4];
        a[6] = 6;

        AtlasUnit.Assert.isFalse(Array.contains(a, undefined));

        AtlasUnit.Assert.isTrue(Array.contains(a, null));
        AtlasUnit.Assert.isTrue(Array.contains(a, 2));
        AtlasUnit.Assert.isTrue(Array.contains(a, 6));

        AtlasUnit.Assert.isFalse(Array.contains(a, 5));
        AtlasUnit.Assert.isFalse(Array.contains(a, "6"));
    }

    this.testForEachMethodUnassigned = function() {
        Array.forEach([0]);
    }
    this.testForEachMethodUnassigned["AtlasUnit.ExpectedException"] = {
        name: "Sys.ParameterCountException"
    }
    this.testForEachMethodUnassigned["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testForEachMethodUndefined = function() {
        Array.forEach([0], undefined);
    }
    this.testForEachMethodUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "method"
    }
    this.testForEachMethodUndefined["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testForEachMethodNull = function() {
        Array.forEach([0], null);
    }
    this.testForEachMethodNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "method"
    }
    this.testForEachMethodNull["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testForEachMethodNotFunction = function() {
        Array.forEach([0], {});
    }
    this.testForEachMethodNotFunction["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentTypeException",
        paramName: "method",
        actualType: Object,
        expectedType: Function
    }
    this.testForEachMethodNotFunction["AtlasUnit.Categories"] = ["DebugOnly"];

    this._testForEachInstanceHelper = function(context) {
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
                AtlasUnit.Assert.areEqual(window, this);
            }
            else {
                AtlasUnit.Assert.areEqual(context, this);
            }

            callbackElements.push(arrayElement);
            callbackIndices.push(index);
            AtlasUnit.Assert.areEqual(a, array);
        }

        if (arguments.length === 0) {
            Array.forEach(a, callback);
        }
        else {
            Array.forEach(a, callback, context);
        }

        AtlasUnit.Assert.elementsEqual(a, callbackElements);
        AtlasUnit.Assert.elementsEqual([0, 1, 2], callbackIndices);
    }

    this.testForEachInstanceUnassigned = function() {
        this._testForEachInstanceHelper();
    }

    this.testForEachInstanceUndefined = function() {
        this._testForEachInstanceHelper(undefined);
    }

    this.testForEachInstanceNull = function() {
        this._testForEachInstanceHelper(null);
    }

    this.testForEachInstanceObject = function() {
        this._testForEachInstanceHelper({});
    }

    this.testForEachElementUnassigned = function() {
        var a = [null, 1];
        a[3] = 'd';
        var callbackElements = [];
        var callbackIndices = [];

        function callback(arrayElement, index, array) {
            callbackElements.push(arrayElement);
            callbackIndices.push(index);
            AtlasUnit.Assert.areEqual(a, array);
        }

        Array.forEach(a, callback);

        AtlasUnit.Assert.elementsEqual([null, 1, 'd'] , callbackElements);
        AtlasUnit.Assert.elementsEqual([0, 1, 3], callbackIndices);
    }

    this.testForEachElementUndefined = function() {
        var a = [null, 1, undefined, 'd'];
        var callbackElements = [];
        var callbackIndices = [];

        function callback(arrayElement, index, array) {
            callbackElements.push(arrayElement);
            callbackIndices.push(index);
            AtlasUnit.Assert.areEqual(a, array);
        }

        Array.forEach(a, callback);

        AtlasUnit.Assert.elementsEqual([null, 1, 'd'] , callbackElements);
        AtlasUnit.Assert.elementsEqual([0, 1, 3], callbackIndices);
    }

    this.testIndexOf = function() {
        var a = ['d', 'c', 'a', 'b', 'c', 'e'];
        a[7] = undefined;
        a[8] = null;

        AtlasUnit.Assert.areEqual(-1, Array.indexOf(a), "No item to find yields -1.");
        AtlasUnit.Assert.areEqual(-1, Array.indexOf(a, undefined), "undefined item yields -1.");

        AtlasUnit.Assert.areEqual(-1, Array.indexOf(a, 'x'), "Unfound item yields -1.");
        AtlasUnit.Assert.areEqual(2, Array.indexOf(a, 'a'), "a has index 2.");
        AtlasUnit.Assert.areEqual(1, Array.indexOf(a, 'c'), "c has index 1.");
        AtlasUnit.Assert.areEqual(1, Array.indexOf(a, 'c', 1), "c has index 1 starting from 1.");
        AtlasUnit.Assert.areEqual(1, Array.indexOf(a, 'c', 1.5), "c has index 1 starting from 1.5.");
        AtlasUnit.Assert.areEqual(1, Array.indexOf(a, 'c', "1.5"), "c has index 1 starting from '1.5'.");
        AtlasUnit.Assert.areEqual(1, Array.indexOf(a, 'c', "2.5a"), "c has index 1 starting from '2.5a'.");
        AtlasUnit.Assert.areEqual(1, Array.indexOf(a, 'c', undefined), "c has index 1 starting from undefined.");
        AtlasUnit.Assert.areEqual(1, Array.indexOf(a, 'c', null), "c has index 1 starting from null.");
        AtlasUnit.Assert.areEqual(1, Array.indexOf(a, 'c', {}), "c has index 1 starting from {}.");
        AtlasUnit.Assert.areEqual(1, Array.indexOf(a, 'c', Number.NaN), "c has index 1 starting from Number.NaN.");
        AtlasUnit.Assert.areEqual(1, Array.indexOf(a, 'c', Number.NEGATIVE_INFINITY), "c has index 1 starting from Number.NEGATIVE_INFINITY.");
        AtlasUnit.Assert.areEqual(-1, Array.indexOf(a, 'c', Number.POSITIVE_INFINITY), "c has index -1 starting from Number.POSITIVE_INFINITY.");
        AtlasUnit.Assert.areEqual(1, Array.indexOf(a, 'c', Number.MIN_VALUE), "c has index 1 starting from Number.MIN_VALUE.");
        AtlasUnit.Assert.areEqual(-1, Array.indexOf(a, 'c', Number.MAX_VALUE), "c has index -1 starting from Number.MAX_VALUE.");
        AtlasUnit.Assert.areEqual(1, Array.indexOf(a, 'c', -Number.MAX_VALUE), "c has index 1 starting from -Number.MAX_VALUE.");
        AtlasUnit.Assert.areEqual(4, Array.indexOf(a, 'c', 2), "c has index 4 starting from 2.");
        AtlasUnit.Assert.areEqual(5, Array.indexOf(a, 'e', -4), "e has index 5 starting from four characters before the end.");
        AtlasUnit.Assert.areEqual(5, Array.indexOf(a, 'e', -5.5), "e has index 5 starting from 5.5 characters before the end.");
        AtlasUnit.Assert.areEqual(4, Array.indexOf(a, 'c', -5), "c has index 4 starting from four characters before the end.");
        AtlasUnit.Assert.areEqual(4, Array.indexOf(a, 'c', -7), "c has index 4 starting from six characters before the end.");
        AtlasUnit.Assert.areEqual(1, Array.indexOf(a, 'c', -8), "c has index 1 starting from sevene characters before the end.");
        AtlasUnit.Assert.areEqual(1, Array.indexOf(a, 'c', -13), "c has index 1 starting from twelve characters before the end (which is out of bounds).");
        AtlasUnit.Assert.areEqual(8, Array.indexOf(a, null), "null has index 8.");
        AtlasUnit.Assert.areEqual(8, Array.indexOf(a, null, -1), "null has index 8 starting from the end.");
    }

    this.testInsert = function() {
        var a = ['d', 'c', 'a', 'b'];

        Array.insert(a, 2, 'e');
        AtlasUnit.Assert.elementsEqual(['d', 'c', 'e', 'a', 'b'], a, "Expected element 'e' to be inserted after 'c'.");

        Array.insert(a, -2, 'f');
        AtlasUnit.Assert.elementsEqual(['d', 'c', 'e', 'f', 'a', 'b'], a, "Expected element 'f' to be inserted before 'b'.");

        Array.insert(a, 6, 'g');
        AtlasUnit.Assert.elementsEqual(['d', 'c', 'e', 'f', 'a', 'b', 'g'], a, "Expected element 'g' to be inserted after 'b'.");
    }

    this.testInsertUndefinedNull = function() {
        var a = [0, 1, 2];

        Array.insert(a, undefined, 3);
        AtlasUnit.Assert.elementsEqual([3, 0, 1, 2], a);

        Array.insert(a, null, 4);
        AtlasUnit.Assert.elementsEqual([4, 3, 0, 1, 2], a);

        Array.insert(a, 1, undefined);
        AtlasUnit.Assert.elementsEqual([4, undefined, 3, 0, 1, 2], a);

        Array.insert(a, 1, null);
        AtlasUnit.Assert.elementsEqual([4, null, undefined, 3, 0, 1, 2], a);
    }

    this.testInstanceOf = function() {
        var a = [ 0, 1, 2 ];
        AtlasUnit.Assert.instanceOfType(Array, a,
            "Object expected to be an instance of an Array.");
        AtlasUnit.Assert.notInstanceOfType(Number, a,
            "Object not expected to be an instance of a Number.");
        AtlasUnit.Assert.instanceOfType(Number, a[0],
            "Element in array expected to be an instance of a Number.");
    }

    this.testIsClass = function() {
        AtlasUnit.Assert.isTrue(Type.isClass(Array));
    }

    this.testMisc = function() {
        // N.B.: sort and reverse are not Atlas extensions, they are built-in JavaScript methods on array.
        var a = ['d', 'c', 'a', 'b'];

        // Testing areEqual
        AtlasUnit.Assert.elementsEqual(['d', 'c', 'a', 'b'], a, "Expected arrays to be seen as equal.");
        a.sort();
        AtlasUnit.Assert.elementsEqual(['a', 'b', 'c', 'd'], a, "Expected array to be sorted.");
        a.reverse();
        AtlasUnit.Assert.elementsEqual(['d', 'c', 'b', 'a'], a, "Expected array to be reversed.");
    }

    this.testParse = function() {
        var a = Array.parse('[\'d\', \'c\', \'a\', \'b\']');
        AtlasUnit.Assert.elementsEqual(['d', 'c', 'a', 'b'], a, "Expected arrays to be equal.");
    }

    this.testParseEmpty = function() {
        var parseEmpty = Array.parse('');
        AtlasUnit.Assert.elementsEqual([], parseEmpty, "Expected empty string to parse to empty array.");
        var parseNull = Array.parse(null);
        AtlasUnit.Assert.elementsEqual([], parseNull, "Expected null to parse to empty array.");
        var parseUndefined = Array.parse(undefined);
        AtlasUnit.Assert.elementsEqual([], parseUndefined, "Expected undefined to parse to empty array.");
    }

    this.testParseNoStartingBraceString = function() {
        Array.parse('1, 2, 3, 4]');
    }
    this.testParseNoStartingBraceString["AtlasUnit.ExpectedException"] = {
        name: "SyntaxError"
    }
    this.testParseNoStartingBraceString["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testParseNoEndingBraceString = function() {
        Array.parse('[1, 2, 3, 4');
    }
    this.testParseNoEndingBraceString["AtlasUnit.ExpectedException"] = {
        name: "SyntaxError"
    }
    this.testParseNoEndingBraceString["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testParseNotAnArray = function() {
        Array.parse('({a: \'One\', b: \'Two\'})');
    }
    this.testParseNotAnArray["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentException",
        paramName: 'value',
        message: 'Sys.ArgumentException: Value must be a valid string representation for an array. It must start with a \'[\' and end with a \']\'.\nParameter name: value'
    }
    this.testParseNotAnArray["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testQueue = function() {
        var a = [];
        Array.enqueue(a, 'd');
        Array.enqueue(a, 'c');
        Array.enqueue(a, 'a');
        Array.enqueue(a, 'b');
        AtlasUnit.Assert.areEqual('d', Array.dequeue(a), "Expected d to be dequeued.");
        AtlasUnit.Assert.areEqual('c', Array.dequeue(a), "Expected c to be dequeued.");
        AtlasUnit.Assert.areEqual('a', Array.dequeue(a), "Expected a to be dequeued.");
        AtlasUnit.Assert.areEqual('b', Array.dequeue(a), "Expected b to be dequeued.");
        AtlasUnit.Assert.areEqual(0, a.length, "Expected array to be empty.");
    }

    this.testRemove = function() {
        var a = []
        a[0] = 'd';
        // a[1] is hole in array
        a[2] = 'c';
        a[3] = undefined;
        a[4] = null;
        a[5] = 'a';
        a[6] = 'b';

        Array.remove(a, null);
        AtlasUnit.Assert.elementsEqual(['d', undefined, 'c', undefined, 'a', 'b'], a);

        Array.remove(a, 'a');
        AtlasUnit.Assert.elementsEqual(['d', undefined, 'c', undefined, 'b'], a);

        Array.remove(a, undefined);
        AtlasUnit.Assert.elementsEqual(['d', undefined, 'c', undefined, 'b'], a);
    }

    this.testRemoveAt = function() {
        var a = ['f', 'e', 'd', 'c', 'b'];

        Array.removeAt(a, undefined);
        AtlasUnit.Assert.elementsEqual(['e', 'd', 'c', 'b'], a);

        Array.removeAt(a, null);
        AtlasUnit.Assert.elementsEqual(['d', 'c', 'b'], a);

        Array.removeAt(a, 1);
        AtlasUnit.Assert.elementsEqual(['d', 'b'], a);

        Array.removeAt(a, -2);
        AtlasUnit.Assert.elementsEqual(['b'], a);
    }

    this.testTypeName = function() {
        AtlasUnit.Assert.areEqual("Array", Object.getTypeName([]));
    }
}
AtlasScript.Test.ArrayTest.registerClass("AtlasScript.Test.ArrayTest");
AtlasScript.Test.ArrayTest["AtlasUnit.IsTestFixture"] = true;

