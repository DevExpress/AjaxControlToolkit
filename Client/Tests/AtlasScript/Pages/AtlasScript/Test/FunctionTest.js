/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("AtlasScript.Test");

AtlasScript.Test.FunctionTest = function() {
    this.setUp = function() {
        this.someVariable = false;
    }

    this.testTypeName = function() {
        AtlasUnit.Assert.areEqual("Function", Object.getTypeName(function() { }));
    }

    this.testCreateDelegate = function() {
        function callback(arg) {
            return { thisPointer: this, arg: arg };
        }

        var arg = {};

        // If the "instance" parameter is undefined or null, then the global object associated
        // with the callback method is used instead.  In this case, the associated global object
        // is "window".

        // Instance undefined
        var del = Function.createDelegate(undefined, callback);
        var result = del(arg);
        AtlasUnit.Assert.areEqual(window, result.thisPointer);
        AtlasUnit.Assert.areEqual(arg, result.arg);

        // Instance null
        del = Function.createDelegate(null, callback);
        result = del(arg);
        AtlasUnit.Assert.areEqual(window, result.thisPointer);
        AtlasUnit.Assert.areEqual(arg, result.arg);

        // Instance this
        del = Function.createDelegate(this, callback);
        result = del(arg);
        AtlasUnit.Assert.areEqual(this, result.thisPointer);
        AtlasUnit.Assert.areEqual(arg, result.arg);
    }

    this.testCreateCallback = function() {
        function callback(ctx) { return ctx; };
        function callbackWithArgs(arg1, arg2, arg3, ctx) {
            return {arg1: arg1, arg2: arg2, arg3: arg3, ctx: ctx};
        };

        // Context undefined
        var context = undefined;
        var callbackWithContext = Function.createCallback(callback, context);
        var result = callbackWithContext();
        AtlasUnit.Assert.areEqual(context, result);

        // Context null
        context = undefined;
        callbackWithContext = Function.createCallback(callback, context);
        result = callbackWithContext();
        AtlasUnit.Assert.areEqual(context, result);

        // Context arbitrary object
        context = {};
        callbackWithContext = Function.createCallback(callback, context);
        result = callbackWithContext();
        AtlasUnit.Assert.areEqual(context, result);

        // Context plus arguments
        var callBackWithArguments = Function.createCallback(callbackWithArgs, context);
        result = callBackWithArguments(1, 2, 3);
        AtlasUnit.Assert.areEqual(1, result.arg1);
        AtlasUnit.Assert.areEqual(2, result.arg2);
        AtlasUnit.Assert.areEqual(3, result.arg3);
        AtlasUnit.Assert.areEqual(context, result.ctx);
    }

    this.testEmptyFunction = function() {
        Function.emptyFunction();
    }

    this.testEmptyMethod = function() {
        Function.emptyMethod();
    }

    this.testEmptyFunctionValidation = function() {
        // no parameter validation
        Function.emptyFunction("foo");
    }

    this.testEmptyMethodValidation = function() {
        // no parameter validation
        Function.emptyMethod("foo");
    }

    this.testIsClass = function() {
        AtlasUnit.Assert.isTrue(Type.isClass(Function));
    }

    this.testValidateParameters = function() {
        var tests = [
            [[],[]],
            [[1], [{type:Number}]],
            [["1"], [{type:String}]],
            [[new Date()], [{type:Date}]],
            [[true], [{type:Boolean}]],
            [[{}], [{type:Object}]],
            [[document.createElement('div')], [{type:null,domElement:true}]],
            [[[1,2]], [{type:Array,elementType:Number}]],
            [[[1,null]], [{type:Array,elementType:Number,elementMayBeNull:true}]],
            [[1,2], [{type:Number},{type:Number}]],
            [[1,null], [{type:Number},{type:Number,mayBeNull:true}]],
            [[1], [{type:Number},{type:Number,optional:true}]],
            [[5], [{type:Number,integer:true}]]
        ];
        for (var i = 0; i < tests.length; i++) {
            var args = tests[i][0], expectedArgs = tests[i][1];
            var e = Function.validateParameters(args, expectedArgs);
            AtlasUnit.Assert.isNull(e, "Failed test #" + i + ". Error: " + (e ? e.get_message() : ""));
        }
    }

    this.testValidateParametersFail = function() {
        var tests = [
            [[1],[]],
            [["1"], [{type:Number}]],
            [[1], [{type:String}]],
            [["date"], [{type:Date}]],
            [["true"], [{type:Boolean}]],
            [["foo"], [{type:Object}]],
            [['div'], [{type:null,domElement:true}]],
            [[[1,"2"]], [{type:Array,elementType:Number}]],
            [[[1,null]], [{type:Array,elementType:Number,elementMayBeNull:false}]],
            [[1,"2"], [{type:Number},{type:Number}]],
            [[1], [{type:Number},{type:Number,optional:false}]],
            [[5.5], [{type:Number,integer:true}]]
        ];
        for (var i = 0; i < tests.length; i++) {
            var args = tests[i][0], expectedArgs = tests[i][1];
            var e = Function.validateParameters(args, expectedArgs);
            AtlasUnit.Assert.isNotNull(e, "Failed test #" + i + ". Validation error expected, see the test.");
        }
    }

    this._delegateTest = function(arg) {
        return { thisPointer: this, arg: arg };
    }
}
AtlasScript.Test.FunctionTest.registerClass("AtlasScript.Test.FunctionTest");
AtlasScript.Test.FunctionTest["AtlasUnit.IsTestFixture"] = true;

