/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("AtlasScript.Test");

AtlasScript.Test.FunctionValidateParamsTest = function() {
    // TEST MATRIX
    // ===========
    // VARIABLES
    // type: unspecified, Array, Boolean, Number, BaseClass, IFoo
    // mayBeNull: unspecified, true
    // integer: unspecified, true
    // optional: unspecified, true
    // parameterArray: unspecified, true
    // elementType: unspecified, Boolean, Number, BaseClass, IFoo
    // elementMayBeNull: unspecified, true
    // elementInteger: unspecified, true
    //
    // TESTED COMBINATIONS
    // anyParam: { }
    // anyParamMayBeNull: { mayBeNull: true }
    // anyArrayParam: { type: Array }
    // anyArrayParamMayBeNull: { type: Array, mayBeNull: true }
    // anyMayBeNullArrayParam: { type: Array, elementMayBeNull: true }
    // anyParamArray: { parameterArray: true }
    // anyParamArrayMayBeNull: { parameterArray: true, mayBeNull: true }
    // booleanParam: { type: Boolean }
    // booleanParamOptional: { type: Boolean, optional: true }
    // booleanParamMayBeNull: { type: Boolean, mayBeNull: true }
    // booleanArrayParam: { type: Array, elementType: Boolean }
    // domParam: { type: DomElement }
    // domParamOptional: { type: DomElement, optional: true }
    // domParamMayBeNull: { type: DomElement, mayBeNull: true }
    // domArrayParam: { type: Array, elementType: DomElement }
    // numberParam: { type: Number }
    // numberParamOptional: { type: Number, optional: true }
    // numberParamMayBeNull: { type: Number, mayBeNull: true }
    // numberArrayParam: { type: Array, elementType: Number }
    // intParam: { type: Number, integer: true }
    // intParamMayBeNull: { type: Number, integer: true, mayBeNull: true }
    // intArrayParam: { type: Array, elementType: Number, elementInteger: true }
    // intParamArray: { type: Number, integer: true, parameterArray: true }
    // baseClassParam: { type: BaseClass }
    // baseClassParamOptional: { type: BaseClass, optional: true }
    // baseClassArrayParam: { type: Array, elementType: BaseClass }
    // baseClassParamArray: { type: BaseClass, parameterArray: true }
    // interfaceParam: { type: IFoo }
    // interfaceArrayParam: { type: Array, elementType: IFoo }
    // interfaceParamArray: { type: IFoo, parameterArray: true }
    // enumParam: {type: Enum }
    // enumParamOptional: {type: Enum, optional: true}
    // enumParamMayBeNull: {type: Enum, mayBeNull: true}
    // enumArrayParam: {type: Array, elementType: Enum}
    // flagsParam: {type: Flags }
    // flagsParamOptional: {type: Flags, optional: true}
    // flagsParamMayBeNull: {type: Flags, mayBeNull: true}
    // flagsArrayParam: {type: Array, elementType: Flags}
    // flagsWithZeroParam: {type: FlagsWithZero }
    // flagsWithZeroParamOptional: {type: FlagsWithZero, optional: true}
    // flagsWithZeroParamMayBeNull: {type: FlagsWithZero, mayBeNull: true}
    // flagsWithZeroArrayParam: {type: Array, elementType: FlagsWithZero}
    //
    // NOTES
    // - Specifically test type Boolean, since several JavaScript values can be automatically converted
    //   to Boolean: undefined, null, "", 0, NaN.  We want to ensure these are *not* treated as valid
    //   values for a Boolean parameter.
    // - Specifically test type Number, since we want to ensure the special numbers are allowed, like
    //   NaN and Infinity.  Also, we additionally test the integer subset of Number.

    this._verifyStackFrame = function(e) {
        // Check only applies on FireFox, where e.fileName is defined
        if (e.fileName) {
            AtlasUnit.Assert.areNotEqual(-1, e.fileName.indexOf("FunctionValidateParamsTest.js"), "Incorrect stack frame");
        }
    }

    this.testValidateParamsAny = function() {
        var o = { };
        AtlasUnit.Assert.areEqual(o, anyParam(o));

        var s = "test string";
        AtlasUnit.Assert.areEqual(s, anyParam(s));

        var i = 0;
        AtlasUnit.Assert.areEqual(i, anyParam(i));

        var f = function() { };
        AtlasUnit.Assert.areEqual(f, anyParam(f));
    }

    this.testValidateParamsAnyUndefined = function() {
        try {
            anyParam(undefined);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsAnyUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1"
    }

    this.testValidateParamsAnyNull = function() {
        try {
            anyParam(null);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsAnyNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param1",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param1"
    }

    this.testValidateParamsAnyTooFew = function() {
        try {
            anyParam();
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsAnyTooFew["AtlasUnit.ExpectedException"] = {
        name: "Sys.ParameterCountException"
    }

    this.testValidateParamsAnyTooMany = function() {
        try {
            anyParam("param1", "param2");
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsAnyTooMany["AtlasUnit.ExpectedException"] = {
        name: "Sys.ParameterCountException"
    }

    this.testValidateParamsAnyMayBeNull = function() {
        AtlasUnit.Assert.areEqual(undefined, anyParamMayBeNull(undefined));
        AtlasUnit.Assert.areEqual(null, anyParamMayBeNull(null));

        var o = { };
        AtlasUnit.Assert.areEqual(o, anyParamMayBeNull(o));

        var s = "test string";
        AtlasUnit.Assert.areEqual(s, anyParamMayBeNull(s));

        var i = 0;
        AtlasUnit.Assert.areEqual(i, anyParamMayBeNull(i));

        var f = function() { };
        AtlasUnit.Assert.areEqual(f, anyParamMayBeNull(f));
    }

    // mayBeNull does not imply optional
    this.testValidateParamsAnyMayBeNullTooFew = function() {
        try {
            anyParamMayBeNull();
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsAnyMayBeNullTooFew["AtlasUnit.ExpectedException"] = {
        name: "Sys.ParameterCountException"
    }

    this.testValidateParamsBoolean = function() {
        AtlasUnit.Assert.areEqual(true, booleanParam(true));
        AtlasUnit.Assert.areEqual(false, booleanParam(false));
    }

    // The following values are automatically converted to false: undefined, null, 0, Number.NaN, and "".
    // We specifically disallow undefined and null, unless mayBeNull is true.
    // 0, Number.NaN, and "" should be disallowed automatically since they are not type Boolean.
    this.testValidateParamsBooleanUndefined = function() {
        try {
            booleanParam(undefined);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBooleanUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1"
    }

    this.testValidateParamsBooleanNull = function() {
        try {
            booleanParam(null);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBooleanNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param1",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param1"
    }

    this.testValidateParamsBooleanInvalidTypeZero = function() {
        try {
            booleanParam(0);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBooleanInvalidTypeZero["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentTypeException",
        paramName: "param1",
        actualType: Number,
        expectedType: Boolean,
        message: "Sys.ArgumentTypeException: Object of type 'Number' cannot " +
            "be converted to type 'Boolean'.\nParameter name: param1"
    }

    this.testValidateParamsBooleanInvalidTypeNaN = function() {
        try {
            booleanParam(Number.NaN);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBooleanInvalidTypeNaN["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentTypeException",
        paramName: "param1",
        actualType: Number,
        expectedType: Boolean,
        message: "Sys.ArgumentTypeException: Object of type 'Number' cannot " +
            "be converted to type 'Boolean'.\nParameter name: param1"
    }

    this.testValidateParamsBooleanInvalidTypeEmptyString = function() {
        try {
            booleanParam("");
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBooleanInvalidTypeEmptyString["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentTypeException",
        paramName: "param1",
        actualType: String,
        expectedType: Boolean,
        message: "Sys.ArgumentTypeException: Object of type 'String' cannot " +
            "be converted to type 'Boolean'.\nParameter name: param1"
    }

    this.testValidateParamsBooleanOptional = function() {
        AtlasUnit.Assert.areEqual(true, booleanParamOptional(true));
        AtlasUnit.Assert.areEqual(false, booleanParamOptional(false));

        AtlasUnit.Assert.areEqual(undefined, booleanParamOptional());
    }

    // Even if Boolean parameter is optional, undefined and null are not valid values.
    this.testValidateParamsBooleanOptionalUndefined = function() {
        try {
            booleanParamOptional(undefined);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBooleanOptionalUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1"
    }

    this.testValidateParamsBooleanOptionalNull = function() {
        try {
            booleanParamOptional(null);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBooleanOptionalNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param1",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param1"
    }

    this.testValidateParamsBooleanMayBeNull = function() {
        AtlasUnit.Assert.areEqual(undefined, booleanParamMayBeNull(undefined));
        AtlasUnit.Assert.areEqual(null, booleanParamMayBeNull(null));
        AtlasUnit.Assert.areEqual(true, booleanParamMayBeNull(true));
        AtlasUnit.Assert.areEqual(false, booleanParamMayBeNull(false));
    }

    this.testValidateParamsBooleanArray = function() {
        var a = [true, false];
        AtlasUnit.Assert.areEqual(a, booleanArrayParam(a));
    }

    // Verify that undefined and null are disallowed as element values in Boolean Arrays
    this.testValidateParamsBooleanArrayElementUndefined = function() {
        var a = [true, false, undefined];
        try {
            booleanArrayParam(a);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBooleanArrayElementUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1[2]",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1[2]"
    }

    this.testValidateParamsBooleanArrayElementNull = function() {
        var a = [true, false, null];
        try {
            booleanArrayParam(a);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBooleanArrayElementNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param1[2]",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param1[2]"
    }

    this.testValidateParamsBooleanArraySparse = function() {
        var a = [];
        a[0] = true;
        a[2] = false;
        try {
            booleanArrayParam(a);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBooleanArraySparse["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1[1]",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1[1]"
    }

    this.testValidateParamsDom = function() {
        var elt = document.createElement('DIV');
        AtlasUnit.Assert.areEqual(elt, domParam(elt));
        // Text nodes are not validated as DOM elements
        elt = document.createTextNode('Some text');
        var e = Function._validateParams([elt], [
            { name: "param1", domElement: true }
        ]);
        AtlasUnit.Assert.isNotNull(e);
        elt = window;
        AtlasUnit.Assert.areEqual(elt, domParam(elt));
        elt = document;
        AtlasUnit.Assert.areEqual(elt, domParam(elt));
        elt = document.forms[0];
        AtlasUnit.Assert.areEqual(elt, domParam(elt));
    }

    this.testValidateParamsDomUndefined = function() {
        try {
            domParam(undefined);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsDomUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1"
    }

    this.testValidateParamsDomNull = function() {
        try {
            domParam(null);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsDomNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param1",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param1"
    }

    this.testValidateParamsDomInvalidTypeString = function() {
        try {
            domParam("5");
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsDomInvalidTypeString["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentException",
        paramName: "param1",
        message: "Sys.ArgumentException: Value must be a DOM element.\nParameter name: param1"
    }

    this.testValidateParamsDomOptional = function() {
        var elt = document.createElement('DIV');
        AtlasUnit.Assert.areEqual(elt, domParamOptional(elt));
        AtlasUnit.Assert.areEqual(undefined, domParamOptional());
    }

    // Even if Number parameter is optional, undefined and null are not valid values.
    this.testValidateParamsDomOptionalUndefined = function() {
        try {
            domParamOptional(undefined);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsDomOptionalUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1"
    }

    this.testValidateParamsDomOptionalNull = function() {
        try {
            domParamOptional(null);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsDomOptionalNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param1",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param1"
    }

    this.testValidateParamsDomMayBeNull = function() {
        AtlasUnit.Assert.areEqual(undefined, domParamMayBeNull(undefined));
        AtlasUnit.Assert.areEqual(null, domParamMayBeNull(null));

        var elt = document.createElement('DIV');
        AtlasUnit.Assert.areEqual(elt, domParamMayBeNull(elt));
    }

    this.testValidateParamsDomArray = function() {
        var a = [document.createElement('SPAN'), document.createElement('DIV'), document.createElement('INPUT')];
        AtlasUnit.Assert.areEqual(a, domArrayParam(a));
    }

    this.testValidateParamsDomArrayElementUndefined = function() {
        var a = [document.createElement('SPAN'), undefined, document.createElement('INPUT')];
        try {
            domArrayParam(a);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsDomArrayElementUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1[1]",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1[1]"
    }

    this.testValidateParamsDomArrayElementNull = function() {
        var a = [document.createElement('SPAN'), null, document.createElement('INPUT')];
        try {
            domArrayParam(a);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsDomArrayElementNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param1[1]",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param1[1]"
    }

    this.testValidateParamsDomArraySparse = function() {
        var a = [];
        a[0] = document.createElement('SPAN');
        a[2] = document.createElement('INPUT');
        try {
            domArrayParam(a);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsDomArraySparse["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1[1]",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1[1]"
    }

    this.testValidateParamsNumber = function() {
        AtlasUnit.Assert.areEqual(5, numberParam(5));

        // Cannot use areEqual(), since Number.NaN is not equal to any other value, including
        // Number.NaN itself.
        AtlasUnit.Assert.isTrue(isNaN(numberParam(Number.NaN)));

        AtlasUnit.Assert.areEqual(Number.NEGATIVE_INFINITY, numberParam(Number.NEGATIVE_INFINITY));
        AtlasUnit.Assert.areEqual(Number.POSITIVE_INFINITY, numberParam(Number.POSITIVE_INFINITY));
        AtlasUnit.Assert.areEqual(Number.MIN_VALUE, numberParam(Number.MIN_VALUE));
        AtlasUnit.Assert.areEqual(Number.MAX_VALUE, numberParam(Number.MAX_VALUE));
    }

    this.testValidateParamsNumberUndefined = function() {
        try {
            numberParam(undefined);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsNumberUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1"
    }

    this.testValidateParamsNumberNull = function() {
        try {
            numberParam(null);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsNumberNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param1",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param1"
    }

    this.testValidateParamsNumberInvalidTypeString = function() {
        try {
            numberParam("5");
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsNumberInvalidTypeString["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentTypeException",
        paramName: "param1",
        actualType: String,
        expectedType: Number,
        message: "Sys.ArgumentTypeException: Object of type 'String' cannot " +
            "be converted to type 'Number'.\nParameter name: param1"
    }

    this.testValidateParamsNumberOptional = function() {
        AtlasUnit.Assert.areEqual(5, numberParamOptional(5));

        // Cannot use areEqual(), since Number.NaN is not equal to any other value, including
        // Number.NaN itself.
        AtlasUnit.Assert.isTrue(isNaN(numberParamOptional(Number.NaN)));

        AtlasUnit.Assert.areEqual(Number.NEGATIVE_INFINITY, numberParamOptional(Number.NEGATIVE_INFINITY));
        AtlasUnit.Assert.areEqual(Number.POSITIVE_INFINITY, numberParamOptional(Number.POSITIVE_INFINITY));
        AtlasUnit.Assert.areEqual(Number.MIN_VALUE, numberParamOptional(Number.MIN_VALUE));
        AtlasUnit.Assert.areEqual(Number.MAX_VALUE, numberParamOptional(Number.MAX_VALUE));

        AtlasUnit.Assert.areEqual(undefined, numberParamOptional());
    }

    // Even if Number parameter is optional, undefined and null are not valid values.
    this.testValidateParamsNumberOptionalUndefined = function() {
        try {
            numberParamOptional(undefined);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsNumberOptionalUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1"
    }

    this.testValidateParamsNumberOptionalNull = function() {
        try {
            numberParamOptional(null);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsNumberOptionalNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param1",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param1"
    }

    this.testValidateParamsNumberMayBeNull = function() {
        AtlasUnit.Assert.areEqual(undefined, numberParamMayBeNull(undefined));
        AtlasUnit.Assert.areEqual(null, numberParamMayBeNull(null));

        AtlasUnit.Assert.areEqual(5, numberParamMayBeNull(5));

        // Cannot use areEqual(), since Number.NaN is not equal to any other value, including
        // Number.NaN itself.
        AtlasUnit.Assert.isTrue(isNaN(numberParamMayBeNull(Number.NaN)));

        AtlasUnit.Assert.areEqual(Number.NEGATIVE_INFINITY, numberParamMayBeNull(Number.NEGATIVE_INFINITY));
        AtlasUnit.Assert.areEqual(Number.POSITIVE_INFINITY, numberParamMayBeNull(Number.POSITIVE_INFINITY));
        AtlasUnit.Assert.areEqual(Number.MIN_VALUE, numberParamMayBeNull(Number.MIN_VALUE));
        AtlasUnit.Assert.areEqual(Number.MAX_VALUE, numberParamMayBeNull(Number.MAX_VALUE));
    }

    this.testValidateParamsNumberArray = function() {
        var a = [5, Number.NaN, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, Number.MIN_VALUE, Number.MAX_VALUE];
        AtlasUnit.Assert.areEqual(a, numberArrayParam(a));
    }

    this.testValidateParamsNumberArrayElementUndefined = function() {
        var a = [5, undefined];
        try {
            numberArrayParam(a);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsNumberArrayElementUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1[1]",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1[1]"
    }

    this.testValidateParamsNumberArrayElementNull = function() {
        var a = [5, null];
        try {
            numberArrayParam(a);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsNumberArrayElementNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param1[1]",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param1[1]"
    }

    this.testValidateParamsNumberArraySparse = function() {
        var a = [];
        a[0] = 5;
        a[2] = 10;
        try {
            numberArrayParam(a);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsNumberArraySparse["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1[1]",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1[1]"
    }

    this.testValidateParamsInteger = function() {
        AtlasUnit.Assert.areEqual(-5, intParam(-5));
        AtlasUnit.Assert.areEqual(0, intParam(0));
        AtlasUnit.Assert.areEqual(5, intParam(5));

        var minInt = Math.ceil(-1 * Number.MAX_VALUE);
        var maxInt = Math.floor(Number.MAX_VALUE);
        AtlasUnit.Assert.areEqual(minInt, intParam(minInt));
        AtlasUnit.Assert.areEqual(maxInt, intParam(maxInt));
    }

    this.testValidateParamsIntegerUndefined = function() {
        try {
            intParam(undefined);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsIntegerUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1"
    }

    this.testValidateParamsIntegerNull = function() {
        try {
            intParam(null);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsIntegerNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param1",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param1"
    }

    this.testValidateParamsIntegerInvalidTypeString = function() {
        try {
            intParam("string value");
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsIntegerInvalidTypeString["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentTypeException",
        paramName: "param1",
        actualType: String,
        expectedType: Number,
        message: "Sys.ArgumentTypeException: Object of type 'String' cannot " +
            "be converted to type 'Number'.\nParameter name: param1"
    }

    this.testValidateParamsIntegerNonzeroRemainder = function() {
        try {
            intParam(1.5);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsIntegerNonzeroRemainder["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: "param1",
        actualValue: 1.5,
        message: "Sys.ArgumentOutOfRangeException: Value must be an integer.\n" +
                 "Parameter name: param1\n" +
                 "Actual value was 1.5."
    }

    this.testValidateParamsIntegerNaN = function() {
        try {
            intParam(Number.NaN);
        }
        catch (e) {
            // Cannot check for Number.NaN in ExpectedException attribute
            AtlasUnit.Assert.isTrue(isNaN(e.actualValue));
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsIntegerNaN["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: "param1",
        // Cannot check for Number.NaN in ExpectedException attribute
        // actualValue: Number.NaN,
        message: "Sys.ArgumentOutOfRangeException: Value must be an integer.\n" +
                 "Parameter name: param1\n" +
                 "Actual value was NaN."
    }

    this.testValidateParamsIntegerNegativeInfinity = function() {
        try {
            intParam(Number.NEGATIVE_INFINITY);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsIntegerNegativeInfinity["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: "param1",
        actualValue: Number.NEGATIVE_INFINITY,
        message: "Sys.ArgumentOutOfRangeException: Value must be an integer.\n" +
                 "Parameter name: param1\n" +
                 "Actual value was -Infinity."
    }

    this.testValidateParamsIntegerPositiveInfinity = function() {
        try {
            intParam(Number.POSITIVE_INFINITY);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsIntegerPositiveInfinity["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: "param1",
        actualValue: Number.POSITIVE_INFINITY,
        message: "Sys.ArgumentOutOfRangeException: Value must be an integer.\n" +
                 "Parameter name: param1\n" +
                 "Actual value was Infinity."
    }

    this.testValidateParamsIntegerMayBeNull = function() {
        AtlasUnit.Assert.areEqual(undefined, intParamMayBeNull(undefined));
        AtlasUnit.Assert.areEqual(null, intParamMayBeNull(null));

        AtlasUnit.Assert.areEqual(-5, intParamMayBeNull(-5));
        AtlasUnit.Assert.areEqual(0, intParamMayBeNull(0));
        AtlasUnit.Assert.areEqual(5, intParamMayBeNull(5));

        var minInt = Math.ceil(-1 * Number.MAX_VALUE);
        var maxInt = Math.floor(Number.MAX_VALUE);
        AtlasUnit.Assert.areEqual(minInt, intParamMayBeNull(minInt));
        AtlasUnit.Assert.areEqual(maxInt, intParamMayBeNull(maxInt));
    }

    this.testValidateParamsIntegerArray = function() {
        var minInt = Math.ceil(-1 * Number.MAX_VALUE);
        var maxInt = Math.floor(Number.MAX_VALUE);

        var a = [minInt, -5, 0, 5, maxInt];
        AtlasUnit.Assert.elementsEqual(a, intArrayParam(a));
    }

    this.testValidateParamsIntegerElementNonzeroRemainder = function() {
        intArrayParam([0, 1.5]);
    }
    this.testValidateParamsIntegerElementNonzeroRemainder["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: "param1[1]",
        actualValue: 1.5,
        message: "Sys.ArgumentOutOfRangeException: Value must be an integer.\n" +
                 "Parameter name: param1[1]\n" +
                 "Actual value was 1.5."
    }

    this.testValidateParamsIntegerParamArray = function() {
        var minInt = Math.ceil(-1 * Number.MAX_VALUE);
        var maxInt = Math.floor(Number.MAX_VALUE);

        var a = [minInt, -5, 0, 5, maxInt];

        AtlasUnit.Assert.elementsEqual(a, intParamArray(0, a[0], a[1], a[2], a[3], a[4]));
    }

    this.testValidateParamsIntegerParamArrayElementNonzeroRemainder = function() {
        intParamArray(0, 0, 1.5);
    }
    this.testValidateParamsIntegerParamArrayElementNonzeroRemainder["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: "params[1]",
        actualValue: 1.5,
        message: "Sys.ArgumentOutOfRangeException: Value must be an integer.\n" +
                 "Parameter name: params[1]\n" +
                 "Actual value was 1.5."
    }

    this.testValidateParamsBaseClass = function() {
        var b = new AtlasScript.Test.FunctionValidateParamsTest.BaseClass();
        AtlasUnit.Assert.areEqual(b, baseClassParam(b));

        var d = new AtlasScript.Test.FunctionValidateParamsTest.DerivedClass();
        AtlasUnit.Assert.areEqual(d, baseClassParam(d));
    }

    this.testValidateParamsBaseClassUndefined = function() {
        baseClassParam(undefined)
    }
    this.testValidateParamsBaseClassUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1"
    }

    this.testValidateParamsBaseClassNull = function() {
        baseClassParam(null)
    }
    this.testValidateParamsBaseClassNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param1",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param1"
    }

    this.testValidateParamsBaseClassInvalidType = function() {
        try {
            baseClassParam(new AtlasScript.Test.FunctionValidateParamsTest.Foo());
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBaseClassInvalidType["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentTypeException",
        paramName: "param1",
        actualType: AtlasScript.Test.FunctionValidateParamsTest.Foo,
        expectedType: AtlasScript.Test.FunctionValidateParamsTest.BaseClass,
        message: "Sys.ArgumentTypeException: Object of type 'AtlasScript.Test.FunctionValidateParamsTest.Foo' cannot " +
            "be converted to type 'AtlasScript.Test.FunctionValidateParamsTest.BaseClass'.\nParameter name: param1"
    }

    this.testValidateParamsInterface = function() {
        var c = new AtlasScript.Test.FunctionValidateParamsTest.Foo();
        AtlasUnit.Assert.areEqual(c, interfaceParam(c));
    }

    this.testValidateParamsInterfaceUndefined = function() {
        interfaceParam(undefined)
    }
    this.testValidateParamsInterfaceUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1"
    }

    this.testValidateParamsInterfaceNull = function() {
        interfaceParam(null)
    }
    this.testValidateParamsInterfaceNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param1",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param1"
    }

    this.testValidateParamsInterfaceInvalidType = function() {
        try {
            interfaceParam(new AtlasScript.Test.FunctionValidateParamsTest.BaseClass());
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsInterfaceInvalidType["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentTypeException",
        paramName: "param1",
        actualType: AtlasScript.Test.FunctionValidateParamsTest.BaseClass,
        expectedType: AtlasScript.Test.FunctionValidateParamsTest.IFoo,
        message: "Sys.ArgumentTypeException: Object of type 'AtlasScript.Test.FunctionValidateParamsTest.BaseClass' cannot " +
            "be converted to type 'AtlasScript.Test.FunctionValidateParamsTest.IFoo'.\nParameter name: param1"
    }

    this.testValidateParamsAnyArray = function() {
        var a = [];
        a[0] = "elem1";
        a[1] =  2;

        AtlasUnit.Assert.areEqual(a, anyArrayParam(a));
    }

    this.testValidateParamsAnyArrayHole = function() {
        var a = [];
        a[0] = "elem1";
        a[2] =  2;

        try {
            anyArrayParam(a);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsAnyArrayHole["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1[1]",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1[1]"
    }

    this.testValidateParamsAnyArrayElementUndefined = function() {
        try {
            anyArrayParam(["elem1", undefined]);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsAnyArrayElementUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1[1]",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1[1]"
    }

    this.testValidateParamsAnyArrayElementNull = function() {
        try {
            anyArrayParam(["elem1", null]);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsAnyArrayElementNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param1[1]",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param1[1]"
    }

    this.testValidateParamsAnyArrayInvalidType = function() {
        try {
            anyArrayParam("wrong type");
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsAnyArrayInvalidType["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentTypeException",
        paramName: "param1",
        actualType: String,
        expectedType: Array,
        message: "Sys.ArgumentTypeException: Object of type 'String' cannot be converted to type 'Array'.\n" +
            "Parameter name: param1"
    }

    this.testValidateParamsAnyArrayMayBeNull = function() {
        AtlasUnit.Assert.areEqual(undefined, anyArrayParamMayBeNull(undefined));
        AtlasUnit.Assert.areEqual(null, anyArrayParamMayBeNull(null));

        var a = ["elem1", 2];
        AtlasUnit.Assert.areEqual(a, anyArrayParamMayBeNull(a));
    }

    this.testValidateParamsAnyMayBeNullArray = function() {
        var a = [];
        a[0] = undefined;
        a[1] = null;
        // a[2] is hole in array
        a[3] = "elem1";
        a[4] =  2;

        AtlasUnit.Assert.areEqual(a, anyMayBeNullArrayParam(a));
    }

    this.testValidateParamsBaseClassArray = function() {
        var a = [];
        a[0] = new AtlasScript.Test.FunctionValidateParamsTest.BaseClass();
        a[1] = new AtlasScript.Test.FunctionValidateParamsTest.DerivedClass();

        AtlasUnit.Assert.areEqual(a, baseClassArrayParam(a));
    }

    this.testValidateParamsBaseClassArrayInvalidType = function() {
        try {
            baseClassArrayParam("wrong type");
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBaseClassArrayInvalidType["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentTypeException",
        paramName: "param1",
        actualType: String,
        expectedType: Array,
        message: "Sys.ArgumentTypeException: Object of type 'String' cannot be converted to type 'Array'.\n" +
            "Parameter name: param1"
    }

    this.testValidateParamsBaseClassArrayHole = function() {
        var a = [];
        a[0] = new AtlasScript.Test.FunctionValidateParamsTest.BaseClass();
        a[2] = new AtlasScript.Test.FunctionValidateParamsTest.DerivedClass();

        try {
            baseClassArrayParam(a);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBaseClassArrayHole["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1[1]",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1[1]"
    }

    this.testValidateParamsBaseClassArrayElementUndefined = function() {
        try {
            baseClassArrayParam([new AtlasScript.Test.FunctionValidateParamsTest.BaseClass(), undefined]);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBaseClassArrayElementUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1[1]",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1[1]"
    }

    this.testValidateParamsBaseClassArrayElementNull = function() {
        try {
            baseClassArrayParam([new AtlasScript.Test.FunctionValidateParamsTest.BaseClass(), null]);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBaseClassArrayElementNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param1[1]",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param1[1]"
    }

    this.testValidateParamsBaseClassArrayElementInvalidType = function() {
        try {
            baseClassArrayParam([new AtlasScript.Test.FunctionValidateParamsTest.BaseClass(), 2]);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBaseClassArrayElementInvalidType["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentTypeException",
        paramName: "param1[1]",
        actualType: Number,
        expectedType: AtlasScript.Test.FunctionValidateParamsTest.BaseClass,
        message: "Sys.ArgumentTypeException: Object of type 'Number' cannot be converted to type " +
            "'AtlasScript.Test.FunctionValidateParamsTest.BaseClass'.\nParameter name: param1[1]"
    }

    this.testValidateParamsInterfaceArray = function() {
        var a = [new AtlasScript.Test.FunctionValidateParamsTest.Foo(), new AtlasScript.Test.FunctionValidateParamsTest.Foo()];
        AtlasUnit.Assert.areEqual(a, interfaceArrayParam(a));
    }

    this.testValidateParamsInterfaceArrayElementInvalidType = function() {
        try {
            interfaceArrayParam([new AtlasScript.Test.FunctionValidateParamsTest.Foo(), "wrong type"]);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsInterfaceArrayElementInvalidType["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentTypeException",
        paramName: "param1[1]",
        actualType: String,
        expectedType: AtlasScript.Test.FunctionValidateParamsTest.IFoo,
        message: "Sys.ArgumentTypeException: Object of type 'String' cannot be converted to type 'AtlasScript.Test.FunctionValidateParamsTest.IFoo'.\n" +
            "Parameter name: param1[1]"
    }

    this.testValidateParamsBaseClassOptional = function() {
        var b = new AtlasScript.Test.FunctionValidateParamsTest.BaseClass();
        var d = new AtlasScript.Test.FunctionValidateParamsTest.DerivedClass();

        AtlasUnit.Assert.areEqual(b, baseClassParamOptional(b, b));
        AtlasUnit.Assert.areEqual(d, baseClassParamOptional(b, d));

        // Undeclared optional parameter
        AtlasUnit.Assert.areEqual(undefined, baseClassParamOptional(b));
    }

    this.testValidateParamsBaseClassOptionalTooFew = function() {
        try {
            baseClassParamOptional();
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBaseClassOptionalTooFew["AtlasUnit.ExpectedException"] = {
        name: "Sys.ParameterCountException"
    }

    this.testValidateParamsBaseClassOptionalTooMany = function() {
        try {
            var b = new AtlasScript.Test.FunctionValidateParamsTest.BaseClass();
            baseClassParamOptional(b, b, b);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBaseClassOptionalTooMany["AtlasUnit.ExpectedException"] = {
        name: "Sys.ParameterCountException"
    }

    this.testValidateParamsBaseClassOptionalUndefined = function() {
        try {
            var b = new AtlasScript.Test.FunctionValidateParamsTest.BaseClass();
            baseClassParamOptional(b, undefined);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBaseClassOptionalUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param2",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param2"
    }

    this.testValidateParamsBaseClassOptionalNull = function() {
        try {
            var b = new AtlasScript.Test.FunctionValidateParamsTest.BaseClass();
            baseClassParamOptional(b, null);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBaseClassOptionalNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param2",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param2"
    }

    this.testValidateParamsBaseClassOptionalInvalidType= function() {
        try {
            var b = new AtlasScript.Test.FunctionValidateParamsTest.BaseClass();
            baseClassParamOptional(b, 2)
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBaseClassOptionalInvalidType["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentTypeException",
        paramName: "param2",
        actualType: Number,
        expectedType: AtlasScript.Test.FunctionValidateParamsTest.BaseClass,
        message: "Sys.ArgumentTypeException: Object of type 'Number' cannot " +
            "be converted to type 'AtlasScript.Test.FunctionValidateParamsTest.BaseClass'.\nParameter name: param2"
    }

    this.testValidateParamsAnyParamArray = function() {
        // No params in the paramArray
        AtlasUnit.Assert.elementsEqual([], anyParamArray("param1"));

        var a = ["elem1", 2];
        AtlasUnit.Assert.elementsEqual(a, anyParamArray("param1", a[0], a[1]));
    }

    this.testValidateParamsAnyParamArrayUndefined = function() {
        try {
            anyParamArray("param1", undefined);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsAnyParamArrayUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "params[0]",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: params[0]"
    }

    this.testValidateParamsAnyParamArrayNull = function() {
        try {
            anyParamArray("param1", null);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsAnyParamArrayNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "params[0]",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: params[0]"
    }

    this.testValidateParamsAnyParamArrayTooFew = function() {
        try {
            anyParamArray();
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsAnyParamArrayTooFew["AtlasUnit.ExpectedException"] = {
        name: "Sys.ParameterCountException"
    }

    this.testValidateParamsAnyParamArrayMayBeNull = function() {
        // No params in the paramArray
        AtlasUnit.Assert.elementsEqual([], anyParamArrayMayBeNull("param1"));

        var a = [undefined, null, "elem1", 2];
        AtlasUnit.Assert.elementsEqual(a, anyParamArrayMayBeNull("param1", a[0], a[1], a[2], a[3]));
    }

    this.testValidateParamsBaseClassParamArray = function() {
        // No params in the paramArray
        AtlasUnit.Assert.elementsEqual([], baseClassParamArray("param1"));

        var b = new AtlasScript.Test.FunctionValidateParamsTest.BaseClass();
        var a = [new AtlasScript.Test.FunctionValidateParamsTest.BaseClass(),
                 new AtlasScript.Test.FunctionValidateParamsTest.DerivedClass()];
        AtlasUnit.Assert.elementsEqual(a, baseClassParamArray(b, a[0], a[1]));
    }

    this.testValidateParamsBaseClassParamArrayFirstElementUndefined = function() {
        var b = new AtlasScript.Test.FunctionValidateParamsTest.BaseClass();

        try {
            baseClassParamArray(b, undefined);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBaseClassParamArrayFirstElementUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "params[0]",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: params[0]"
    }

    this.testValidateParamsBaseClassParamArrayFirstElementNull = function() {
        var b = new AtlasScript.Test.FunctionValidateParamsTest.BaseClass();

        try {
            baseClassParamArray(b, null);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBaseClassParamArrayFirstElementNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "params[0]",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: params[0]"
    }

    this.testValidateParamsBaseClassParamArrayFirstElementInvalidType = function() {
        var b = new AtlasScript.Test.FunctionValidateParamsTest.BaseClass();

        try {
            baseClassParamArray(b, 2);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBaseClassParamArrayFirstElementInvalidType["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentTypeException",
        paramName: "params[0]",
        actualType: Number,
        expectedType: AtlasScript.Test.FunctionValidateParamsTest.BaseClass,
        message: "Sys.ArgumentTypeException: Object of type 'Number' cannot be converted to type " +
            "'AtlasScript.Test.FunctionValidateParamsTest.BaseClass'.\nParameter name: params[0]"
    }

    this.testValidateParamsBaseClassParamArrayThirdElementInvalidType = function() {
        var b = new AtlasScript.Test.FunctionValidateParamsTest.BaseClass();

        try {
            baseClassParamArray(b, b, b, 2);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsBaseClassParamArrayThirdElementInvalidType["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentTypeException",
        paramName: "params[2]",
        actualType: Number,
        expectedType: AtlasScript.Test.FunctionValidateParamsTest.BaseClass,
        message: "Sys.ArgumentTypeException: Object of type 'Number' cannot be converted to type " +
            "'AtlasScript.Test.FunctionValidateParamsTest.BaseClass'.\nParameter name: params[2]"
    }

    this.testValidateParamsEnum = function() {
        AtlasUnit.Assert.areEqual(AtlasScript.Test.FunctionValidateParamsTest.Enum.foo ,
            enumParam(AtlasScript.Test.FunctionValidateParamsTest.Enum.foo));
        AtlasUnit.Assert.areEqual(AtlasScript.Test.FunctionValidateParamsTest.Enum.bar ,
            enumParam(AtlasScript.Test.FunctionValidateParamsTest.Enum.bar));
    }

    this.testValidateParamsEnumUndefined = function() {
        try {
            enumParam(undefined);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsEnumUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1"
    }

    this.testValidateParamsEnumNull = function() {
        try {
            enumParam(null);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsEnumNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param1",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param1"
    }

    this.testValidateParamsEnumInvalidTypeFloat = function() {
        try {
            enumParam(1.5);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsEnumInvalidTypeFloat["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: "param1",
        message: "Sys.ArgumentOutOfRangeException: '1.5' is not a valid value for enum AtlasScript.Test.FunctionValidateParamsTest.Enum.\nParameter name: param1\nActual value was 1.5."
    }

    this.testValidateParamsEnumInvalidTypeString = function() {
        try {
            enumParam("string value");
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsEnumInvalidTypeString["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentTypeException",
        paramName: "param1",
        actualType: String,
        expectedType: AtlasScript.Test.FunctionValidateParamsTest.Enum,
        message: "Sys.ArgumentTypeException: Object of type 'String' cannot " +
            "be converted to type 'AtlasScript.Test.FunctionValidateParamsTest.Enum'.\nParameter name: param1"
    }

    this.testValidateParamsEnumInvalidValue = function() {
        try {
            enumParam(42);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsEnumInvalidValue["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: "param1",
        message: "Sys.ArgumentOutOfRangeException: '42' is not a valid value for enum AtlasScript.Test.FunctionValidateParamsTest.Enum.\nParameter name: param1\nActual value was 42."
    }

    this.testValidateParamsEnumOptional = function() {
        AtlasUnit.Assert.areEqual(AtlasScript.Test.FunctionValidateParamsTest.Enum.foo, enumParamOptional(AtlasScript.Test.FunctionValidateParamsTest.Enum.foo));
        AtlasUnit.Assert.areEqual(AtlasScript.Test.FunctionValidateParamsTest.Enum.bar, enumParamOptional(AtlasScript.Test.FunctionValidateParamsTest.Enum.bar));

        AtlasUnit.Assert.areEqual(undefined, enumParamOptional());
    }

    // Even if enum parameter is optional, undefined and null are not valid values.
    this.testValidateParamsEnumOptionalUndefined = function() {
        try {
            enumParamOptional(undefined);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsEnumOptionalUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1"
    }

    this.testValidateParamsEnumOptionalNull = function() {
        try {
            enumParamOptional(null);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsEnumOptionalNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param1",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param1"
    }

    this.testValidateParamsEnumMayBeNull = function() {
        AtlasUnit.Assert.areEqual(undefined, enumParamMayBeNull(undefined));
        AtlasUnit.Assert.areEqual(null, enumParamMayBeNull(null));

        AtlasUnit.Assert.areEqual(AtlasScript.Test.FunctionValidateParamsTest.Enum.foo,
            enumParamMayBeNull(AtlasScript.Test.FunctionValidateParamsTest.Enum.foo));
        AtlasUnit.Assert.areEqual(AtlasScript.Test.FunctionValidateParamsTest.Enum.bar,
            enumParamMayBeNull(AtlasScript.Test.FunctionValidateParamsTest.Enum.bar));
    }

    this.testValidateParamsEnumArray = function() {
        var a = [AtlasScript.Test.FunctionValidateParamsTest.Enum.foo, AtlasScript.Test.FunctionValidateParamsTest.Enum.bar];
        AtlasUnit.Assert.elementsEqual(a, enumArrayParam(a));
    }

    this.testValidateParamsEnumArrayElementOutOfRange = function() {
        enumArrayParam([AtlasScript.Test.FunctionValidateParamsTest.Enum.foo, 42]);
    }
    this.testValidateParamsEnumArrayElementOutOfRange["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: "param1[1]",
        actualValue: 42,
        message: "Sys.ArgumentOutOfRangeException: '42' is not a valid value for enum AtlasScript.Test.FunctionValidateParamsTest.Enum.\nParameter name: param1[1]\nActual value was 42."
    }

    this.testValidateParamsEnumArrayElementOutOfRangeZero = function() {
        enumArrayParam([AtlasScript.Test.FunctionValidateParamsTest.Enum.foo, 0]);
    }
    this.testValidateParamsEnumArrayElementOutOfRangeZero["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: "param1[1]",
        actualValue: 0,
        message: "Sys.ArgumentOutOfRangeException: '0' is not a valid value for enum AtlasScript.Test.FunctionValidateParamsTest.Enum.\nParameter name: param1[1]\nActual value was 0."
    }

    this.testValidateParamsEnumParamArray = function() {
        var a = [AtlasScript.Test.FunctionValidateParamsTest.Enum.foo, AtlasScript.Test.FunctionValidateParamsTest.Enum.bar];
        AtlasUnit.Assert.elementsEqual(a, enumParamArray(0, a[0], a[1]));
    }

    this.testValidateParamsEnumParamArrayElementNonzeroRemainder = function() {
        enumParamArray(0, AtlasScript.Test.FunctionValidateParamsTest.Enum.foo, 42);
    }
    this.testValidateParamsEnumParamArrayElementNonzeroRemainder["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: "params[1]",
        actualValue: 42,
        message: "Sys.ArgumentOutOfRangeException: '42' is not a valid value for enum AtlasScript.Test.FunctionValidateParamsTest.Enum.\nParameter name: params[1]\nActual value was 42."
    }

    this.testValidateParamsFlags = function() {
        AtlasUnit.Assert.areEqual(AtlasScript.Test.FunctionValidateParamsTest.Flags.foo ,
            flagsParam(AtlasScript.Test.FunctionValidateParamsTest.Flags.foo));
        AtlasUnit.Assert.areEqual(AtlasScript.Test.FunctionValidateParamsTest.Flags.bar ,
            flagsParam(AtlasScript.Test.FunctionValidateParamsTest.Flags.bar));
        AtlasUnit.Assert.areEqual(AtlasScript.Test.FunctionValidateParamsTest.Flags.bar | AtlasScript.Test.FunctionValidateParamsTest.Flags.baz ,
            flagsParam(AtlasScript.Test.FunctionValidateParamsTest.Flags.bar | AtlasScript.Test.FunctionValidateParamsTest.Flags.baz));
    }

    this.testValidateParamsFlagsUndefined = function() {
        try {
            flagsParam(undefined);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsFlagsUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1"
    }

    this.testValidateParamsFlagsNull = function() {
        try {
            flagsParam(null);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsFlagsNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param1",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param1"
    }

    this.testValidateParamsFlagsInvalidTypeFloat = function() {
        try {
            flagsParam(1.5);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsFlagsInvalidTypeFloat["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: "param1",
        message: "Sys.ArgumentOutOfRangeException: '1.5' is not a valid value for enum AtlasScript.Test.FunctionValidateParamsTest.Flags.\nParameter name: param1\nActual value was 1.5."
    }

    this.testValidateParamsFlagsInvalidTypeString = function() {
        try {
            flagsParam("string value");
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsFlagsInvalidTypeString["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentTypeException",
        paramName: "param1",
        actualType: String,
        expectedType: AtlasScript.Test.FunctionValidateParamsTest.Flags,
        message: "Sys.ArgumentTypeException: Object of type 'String' cannot " +
            "be converted to type 'AtlasScript.Test.FunctionValidateParamsTest.Flags'.\nParameter name: param1"
    }

    this.testValidateParamsFlagsInvalidValue = function() {
        try {
            flagsParam(15);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsFlagsInvalidValue["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: "param1",
        message: "Sys.ArgumentOutOfRangeException: '15' is not a valid value for enum AtlasScript.Test.FunctionValidateParamsTest.Flags.\nParameter name: param1\nActual value was 15."
    }

    this.testValidateParamsFlagsOptional = function() {
        AtlasUnit.Assert.areEqual(AtlasScript.Test.FunctionValidateParamsTest.Flags.foo, flagsParamOptional(AtlasScript.Test.FunctionValidateParamsTest.Flags.foo));
        AtlasUnit.Assert.areEqual(AtlasScript.Test.FunctionValidateParamsTest.Flags.bar, flagsParamOptional(AtlasScript.Test.FunctionValidateParamsTest.Flags.bar));
        AtlasUnit.Assert.areEqual(AtlasScript.Test.FunctionValidateParamsTest.Flags.bar | AtlasScript.Test.FunctionValidateParamsTest.Flags.baz ,
            flagsParamOptional(AtlasScript.Test.FunctionValidateParamsTest.Flags.bar | AtlasScript.Test.FunctionValidateParamsTest.Flags.baz));

        AtlasUnit.Assert.areEqual(undefined, flagsParamOptional());
    }

    // Even if flag parameter is optional, undefined and null are not valid values.
    this.testValidateParamsFlagsOptionalUndefined = function() {
        try {
            flagsParamOptional(undefined);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsFlagsOptionalUndefined["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentUndefinedException",
        paramName: "param1",
        message: "Sys.ArgumentUndefinedException: Value cannot be undefined.\nParameter name: param1"
    }

    this.testValidateParamsFlagsOptionalNull = function() {
        try {
            flagsParamOptional(null);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsFlagsOptionalNull["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentNullException",
        paramName: "param1",
        message: "Sys.ArgumentNullException: Value cannot be null.\nParameter name: param1"
    }

    this.testValidateParamsFlagsMayBeNull = function() {
        AtlasUnit.Assert.areEqual(undefined, flagsParamMayBeNull(undefined));
        AtlasUnit.Assert.areEqual(null, flagsParamMayBeNull(null));

        AtlasUnit.Assert.areEqual(AtlasScript.Test.FunctionValidateParamsTest.Flags.foo,
            flagsParamMayBeNull(AtlasScript.Test.FunctionValidateParamsTest.Flags.foo));
        AtlasUnit.Assert.areEqual(AtlasScript.Test.FunctionValidateParamsTest.Flags.bar,
            flagsParamMayBeNull(AtlasScript.Test.FunctionValidateParamsTest.Flags.bar));
        AtlasUnit.Assert.areEqual(AtlasScript.Test.FunctionValidateParamsTest.Flags.bar | AtlasScript.Test.FunctionValidateParamsTest.Flags.baz ,
            flagsParamMayBeNull(AtlasScript.Test.FunctionValidateParamsTest.Flags.bar | AtlasScript.Test.FunctionValidateParamsTest.Flags.baz));
    }

    this.testValidateParamsFlagsArray = function() {
        var a = [AtlasScript.Test.FunctionValidateParamsTest.Flags.foo,
            AtlasScript.Test.FunctionValidateParamsTest.Flags.bar,
            AtlasScript.Test.FunctionValidateParamsTest.Flags.foo | AtlasScript.Test.FunctionValidateParamsTest.Flags.baz];
        AtlasUnit.Assert.elementsEqual(a, flagsArrayParam(a));
    }

    this.testValidateParamsFlagsArrayElementOutOfRange = function() {
        flagsArrayParam([AtlasScript.Test.FunctionValidateParamsTest.Flags.foo, 15]);
    }
    this.testValidateParamsFlagsArrayElementOutOfRange["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: "param1[1]",
        actualValue: 15,
        message: "Sys.ArgumentOutOfRangeException: '15' is not a valid value for enum AtlasScript.Test.FunctionValidateParamsTest.Flags.\nParameter name: param1[1]\nActual value was 15."
    }

    this.testValidateParamsFlagsParamArray = function() {
        var a = [AtlasScript.Test.FunctionValidateParamsTest.Flags.foo, AtlasScript.Test.FunctionValidateParamsTest.Flags.bar];
        AtlasUnit.Assert.elementsEqual(a, flagsParamArray(0, a[0], a[1]));
    }

    this.testValidateParamsFlagsParamArrayElementNonzeroRemainder = function() {
        flagsParamArray(0, AtlasScript.Test.FunctionValidateParamsTest.Flags.foo, 15);
    }
    this.testValidateParamsFlagsParamArrayElementNonzeroRemainder["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: "params[1]",
        actualValue: 15,
        message: "Sys.ArgumentOutOfRangeException: '15' is not a valid value for enum AtlasScript.Test.FunctionValidateParamsTest.Flags.\nParameter name: params[1]\nActual value was 15."
    }

    this.testValidateParamsFlagsWithZero = function() {
        AtlasUnit.Assert.areEqual(AtlasScript.Test.FunctionValidateParamsTest.FlagsWithZero.none ,
            flagsWithZeroParam(AtlasScript.Test.FunctionValidateParamsTest.FlagsWithZero.none));
        AtlasUnit.Assert.areEqual(AtlasScript.Test.FunctionValidateParamsTest.FlagsWithZero.foo ,
            flagsWithZeroParam(AtlasScript.Test.FunctionValidateParamsTest.FlagsWithZero.foo));
        AtlasUnit.Assert.areEqual(AtlasScript.Test.FunctionValidateParamsTest.FlagsWithZero.bar ,
            flagsWithZeroParam(AtlasScript.Test.FunctionValidateParamsTest.FlagsWithZero.bar));
        AtlasUnit.Assert.areEqual(AtlasScript.Test.FunctionValidateParamsTest.FlagsWithZero.bar | AtlasScript.Test.FunctionValidateParamsTest.FlagsWithZero.baz ,
            flagsWithZeroParam(AtlasScript.Test.FunctionValidateParamsTest.FlagsWithZero.bar | AtlasScript.Test.FunctionValidateParamsTest.FlagsWithZero.baz));
    }

    this.testValidateParamsFlagsWithZeroInvalidValue = function() {
        try {
            flagsWithZeroParam(15);
        }
        catch (e) {
            this._verifyStackFrame(e);
            throw e;
        }
    }
    this.testValidateParamsFlagsWithZeroInvalidValue["AtlasUnit.ExpectedException"] = {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: "param1",
        message: "Sys.ArgumentOutOfRangeException: '15' is not a valid value for enum AtlasScript.Test.FunctionValidateParamsTest.FlagsWithZero.\nParameter name: param1\nActual value was 15."
    }

    this.testValidateParamsNoCount = function() {
        var e = Function._validateParams([1,2,3], [ { name: "param1", type: Number } ], false);
        if (e) throw e;
    }

    this.testValidateParamsNoCountWithParamArray = function() {
        var e = Function._validateParams([1,2,3], [ { name: "param1", type: Number, parameterArray: true } ], false);
        if (e) throw e;
    }

    this.testValidateParamsNoCountWithOptional = function() {
        var e = Function._validateParams([1,2,3], [ { name: "param1", type: Number, optional: true } ], false);
        if (e) throw e;
    }

    this.testValidateParamsNoCountLessThanExpected = function() {
        var e = Function._validateParams([], [ { name: "param1", type: Number } ], false);
        if (e) throw e;
    }
    this.testValidateParamsNoCountLessThanExpected["AtlasUnit.ExpectedException"] = {
        name: "Sys.ParameterCountException"
    }

    this.testValidateParamsNoCountLessThanExpectedWithOptional = function() {
        var e = Function._validateParams([], [ { name: "param1", type: Number, optional: true } ], false);
        if (e) throw e;
    }

    function anyParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1" }
        ]);
        if (e) throw e;

        return param1;
    }

    function anyParamMayBeNull(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", mayBeNull: true }
        ]);
        if (e) throw e;

        return param1;
    }

    function anyArrayParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: Array }
        ]);
        if (e) throw e;

        return param1;
    }

    function anyArrayParamMayBeNull(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: Array, mayBeNull: true }
        ]);
        if (e) throw e;

        return param1;
    }

    function anyMayBeNullArrayParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: Array, elementMayBeNull: true }
        ]);
        if (e) throw e;

        return param1;
    }

    function anyParamArray(param1, params) {
        var e = Function._validateParams(arguments, [
            { name: "param1" },
            { name: "params", parameterArray: true }
        ]);
        if (e) throw e;

        var a = [];
        for (var i=1; i < arguments.length; i++) {
            a[i-1] = arguments[i];
        }
        return a;
    }

    function anyParamArrayMayBeNull(param1, params) {
        var e = Function._validateParams(arguments, [
            { name: "param1" },
            { name: "params", parameterArray: true, mayBeNull: true }
        ]);
        if (e) throw e;

        var a = [];
        for (var i=1; i < arguments.length; i++) {
            a[i-1] = arguments[i];
        }
        return a;
    }

    function booleanParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: Boolean }
        ]);
        if (e) throw e;

        return param1;
    }

    function booleanParamOptional(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: Boolean, optional: true }
        ]);
        if (e) throw e;

        return param1;
    }

    function booleanParamMayBeNull(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: Boolean, mayBeNull: true }
        ]);
        if (e) throw e;

        return param1;
    }

    function booleanArrayParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: Array, elementType: Boolean }
        ]);
        if (e) throw e;

        return param1;
    }

    function domParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", domElement: true }
        ]);
        if (e) throw e;

        return param1;
    }

    function domParamOptional(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", domElement: true, optional: true }
        ]);
        if (e) throw e;

        return param1;
    }

    function domParamMayBeNull(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", domElement: true, mayBeNull: true }
        ]);
        if (e) throw e;

        return param1;
    }

    function domArrayParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: Array, elementDomElement: true }
        ]);
        if (e) throw e;

        return param1;
    }

    function numberParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: Number }
        ]);
        if (e) throw e;

        return param1;
    }

    function numberParamOptional(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: Number, optional: true }
        ]);
        if (e) throw e;

        return param1;
    }

    function numberParamMayBeNull(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: Number, mayBeNull: true }
        ]);
        if (e) throw e;

        return param1;
    }

    function numberArrayParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: Array, elementType: Number }
        ]);
        if (e) throw e;

        return param1;
    }

    function intParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: Number, integer: true }
        ]);
        if (e) throw e;

        return param1;
    }

    function intParamMayBeNull(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: Number, integer: true, mayBeNull: true }
        ]);
        if (e) throw e;

        return param1;
    }

    function intArrayParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: Array, elementType: Number, elementInteger: true }
        ]);
        if (e) throw e;

        return param1;
    }

    function intParamArray(param1, params) {
        var e = Function._validateParams(arguments, [
            { name: "param1" },
            { name: "params", type: Number, integer: true, parameterArray: true }
        ]);
        if (e) throw e;

        var a = [];
        for (var i=1; i < arguments.length; i++) {
            a[i-1] = arguments[i];
        }
        return a;
    }

    function baseClassParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: AtlasScript.Test.FunctionValidateParamsTest.BaseClass }
        ]);
        if (e) throw e;

        return param1;
    }

    function baseClassParamOptional(param1, param2) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: AtlasScript.Test.FunctionValidateParamsTest.BaseClass},
            { name: "param2", type: AtlasScript.Test.FunctionValidateParamsTest.BaseClass, optional: true }
        ]);
        if (e) throw e;

        return param2;
    }

    function baseClassArrayParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: Array, elementType: AtlasScript.Test.FunctionValidateParamsTest.BaseClass }
        ]);
        if (e) throw e;

        return param1;
    }

    function baseClassParamArray(param1, params) {
        var e = Function._validateParams(arguments, [
            { name: "param1" },
            { name: "params", type: AtlasScript.Test.FunctionValidateParamsTest.BaseClass, parameterArray: true }
        ]);
        if (e) throw e;

        var a = [];
        for (var i=1; i < arguments.length; i++) {
            a[i-1] = arguments[i];
        }
        return a;
    }

    function interfaceParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: AtlasScript.Test.FunctionValidateParamsTest.IFoo }
        ]);
        if (e) throw e;

        return param1;
    }

    function interfaceArrayParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: Array, elementType: AtlasScript.Test.FunctionValidateParamsTest.IFoo }
        ]);
        if (e) throw e;

        return param1;
    }

    function interfaceParamArray(param1, params) {
        var e = Function._validateParams(arguments, [
            { name: "param1" },
            { name: "params", type: AtlasScript.Test.FunctionValidateParamsTest.IFoo, parameterArray: true }
        ]);
        if (e) throw e;

        var a = [];
        for (var i=1; i < arguments.length; i++) {
            a[i-1] = arguments[i];
        }
        return a;
    }

    function enumParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: AtlasScript.Test.FunctionValidateParamsTest.Enum }
        ]);
        if (e) throw e;

        return param1;
    }

    function enumParamOptional(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: AtlasScript.Test.FunctionValidateParamsTest.Enum, optional: true }
        ]);
        if (e) throw e;

        return param1;
    }

    function enumParamMayBeNull(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: AtlasScript.Test.FunctionValidateParamsTest.Enum, mayBeNull: true }
        ]);
        if (e) throw e;

        return param1;
    }

    function enumArrayParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: Array, elementType: AtlasScript.Test.FunctionValidateParamsTest.Enum }
        ]);
        if (e) throw e;

        return param1;
    }

    function enumParamArray(param1, params) {
        var e = Function._validateParams(arguments, [
            { name: "param1" },
            { name: "params", type: AtlasScript.Test.FunctionValidateParamsTest.Enum, parameterArray: true }
        ]);
        if (e) throw e;

        var a = [];
        for (var i=1; i < arguments.length; i++) {
            a[i-1] = arguments[i];
        }
        return a;
    }

    function flagsParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: AtlasScript.Test.FunctionValidateParamsTest.Flags }
        ]);
        if (e) throw e;

        return param1;
    }

    function flagsParamOptional(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: AtlasScript.Test.FunctionValidateParamsTest.Flags, optional: true }
        ]);
        if (e) throw e;

        return param1;
    }

    function flagsParamMayBeNull(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: AtlasScript.Test.FunctionValidateParamsTest.Flags, mayBeNull: true }
        ]);
        if (e) throw e;

        return param1;
    }

    function flagsArrayParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: Array, elementType: AtlasScript.Test.FunctionValidateParamsTest.Flags }
        ]);
        if (e) throw e;

        return param1;
    }

    function flagsParamArray(param1, params) {
        var e = Function._validateParams(arguments, [
            { name: "param1" },
            { name: "params", type: AtlasScript.Test.FunctionValidateParamsTest.Flags, parameterArray: true }
        ]);
        if (e) throw e;

        var a = [];
        for (var i=1; i < arguments.length; i++) {
            a[i-1] = arguments[i];
        }
        return a;
    }

    function flagsWithZeroParam(param1) {
        var e = Function._validateParams(arguments, [
            { name: "param1", type: AtlasScript.Test.FunctionValidateParamsTest.FlagsWithZero }
        ]);
        if (e) throw e;

        return param1;
    }
}
AtlasScript.Test.FunctionValidateParamsTest.registerClass("AtlasScript.Test.FunctionValidateParamsTest");
AtlasScript.Test.FunctionValidateParamsTest["AtlasUnit.IsTestFixture"] = true;

AtlasScript.Test.FunctionValidateParamsTest.BaseClass = function() {
}
AtlasScript.Test.FunctionValidateParamsTest.BaseClass.registerClass("AtlasScript.Test.FunctionValidateParamsTest.BaseClass");

AtlasScript.Test.FunctionValidateParamsTest.DerivedClass = function() {
    AtlasScript.Test.FunctionValidateParamsTest.DerivedClass.initializeBase(this);
}
AtlasScript.Test.FunctionValidateParamsTest.DerivedClass.registerClass("AtlasScript.Test.FunctionValidateParamsTest.DerivedClass",
    AtlasScript.Test.FunctionValidateParamsTest.BaseClass);

AtlasScript.Test.FunctionValidateParamsTest.IFoo= function() {
}
AtlasScript.Test.FunctionValidateParamsTest.IFoo.registerInterface("AtlasScript.Test.FunctionValidateParamsTest.IFoo");

AtlasScript.Test.FunctionValidateParamsTest.Foo = function() {
}
AtlasScript.Test.FunctionValidateParamsTest.Foo.registerClass("AtlasScript.Test.FunctionValidateParamsTest.Foo", null,
    AtlasScript.Test.FunctionValidateParamsTest.IFoo);

AtlasScript.Test.FunctionValidateParamsTest.Enum = function() {
    throw Error.invalidOperation();
}
AtlasScript.Test.FunctionValidateParamsTest.Enum.prototype = {
    foo: 1,
    bar: 2
}
AtlasScript.Test.FunctionValidateParamsTest.Enum.registerEnum('AtlasScript.Test.FunctionValidateParamsTest.Enum');

AtlasScript.Test.FunctionValidateParamsTest.Flags = function() {
    throw Error.invalidOperation();
}
AtlasScript.Test.FunctionValidateParamsTest.Flags.prototype = {
    foo: 1,
    bar: 2,
    baz: 4
}
AtlasScript.Test.FunctionValidateParamsTest.Flags.registerEnum('AtlasScript.Test.FunctionValidateParamsTest.Flags', true);

AtlasScript.Test.FunctionValidateParamsTest.FlagsWithZero = function() {
    throw Error.invalidOperation();
}
AtlasScript.Test.FunctionValidateParamsTest.FlagsWithZero.prototype = {
    none: 0,
    foo: 1,
    bar: 2,
    baz: 4
}
AtlasScript.Test.FunctionValidateParamsTest.FlagsWithZero.registerEnum('AtlasScript.Test.FunctionValidateParamsTest.FlagsWithZero', true);

