/// <reference name="MicrosoftAjax.js"/>

Type.registerNamespace("AtlasUnit");

AtlasUnit.TestBase = function(name, fullName) {
    var _name = name;
    var _fullName = fullName;

    var _selected = false;
    var _result = new AtlasUnit.TestResult();
    var _categories;

    this.accept = function() {
        throw Error.notImplemented();
    }

    this.get_fullName = function() {
        return _fullName;
    }

    this.get_name = function() {
        return _name;
    }

    this.get_result = function() {
        return _result;
    }

    this.get_selected = function() {
        return _selected;
    }

    this.set_selected = function(selected) {
        _selected = selected;
    }

    this.get_categories = function() {
        return _categories ? _categories : [];
    }

    this.set_categories = function(categories) {
        _categories = categories;
    }

    this.toString = function() {
        return this.get_name();
    }
}
AtlasUnit.TestBase.registerClass("AtlasUnit.TestBase");


AtlasUnit.TestCase = function(instance, methodName) {
    AtlasUnit.TestCase.initializeBase(this,
        [methodName, Object.getType(instance).getName() + "." + methodName]);

    var _instance = instance;
    var _methodName = methodName;
    var _expectedException = null;

    this.accept = function(visitor) {
        visitor.visit(this);
    }

    this.get_expectedException = function() {
        return _expectedException;
    }

    this.set_expectedException = function(expectedException) {
        _expectedException = expectedException;
    }

    this.run = function(throwOnFail) {
        if (throwOnFail) {
            this._setUpAndRun();
            if (_instance.tearDown) {
                _instance.tearDown();
            }
        }
        else {
            try {
                this._setUpAndRun();
            }
            catch (ex) {
                this.get_result().set_executionStatus(AtlasUnit.ExecutionStatus.Failed);
                this.get_result().set_exception(ex);
            }
            finally {
                try {
                    if (_instance.tearDown) {
                        _instance.tearDown();
                    }
                }
                catch (ex) {
                    this.get_result().set_executionStatus(AtlasUnit.ExecutionStatus.Failed);
                    this.get_result().set_exception(ex);
                }
            }
        }
    }

    this._setUpAndRun = function() {
        if (_instance.setUp) {
            _instance.setUp();
        }
        var expectedException = this.get_expectedException();
        if (expectedException) {
            AtlasUnit.Assert.expectException(
                Function.createDelegate(_instance, _instance[_methodName]),
                expectedException);
        }
        else {
            _instance[_methodName]();
        }
        this.get_result().set_executionStatus(AtlasUnit.ExecutionStatus.Succeeded);
    }
}
AtlasUnit.TestCase.registerClass("AtlasUnit.TestCase", AtlasUnit.TestBase);


AtlasUnit.TestSuite = function(name, fullName) {
    AtlasUnit.TestSuite.initializeBase(this, [name, (fullName ? fullName : name)]);

    var _tests = [];

    this.accept = function(visitor) {
        visitor.visitEnter(this);
        for (var i=0; i < _tests.length; i++) {
            _tests[i].accept(visitor);
        }
        visitor.visitLeave(this);
    }

    this.add = function(test) {
        // If we already contain a TestSuite with the same name as the TestSuite being added,
        // then add the children to the existing TestSuite.
        if (AtlasUnit.TestSuite.isInstanceOfType(test)) {
            for (var i=0; i < _tests.length; i++) {
                if (_tests[i].get_name() === test.get_name() &&
                    AtlasUnit.TestSuite.isInstanceOfType(_tests[i])) {

                    for (var j=0; j < test.get_tests().length; j++) {
                        _tests[i].add(test.get_tests()[j]);
                    }
                    return;
                }
            }
        }

        _tests.push(test);
    }

    this.get_tests = function() {
        return _tests;
    }
}
AtlasUnit.TestSuite.registerClass("AtlasUnit.TestSuite", AtlasUnit.TestBase);


AtlasUnit.Visitor = function() {
}
AtlasUnit.Visitor.prototype = {
    visitEnter: function(testSuite) {
    },

    visit: function(testCase) {
        throw Error.notImplemented();
    },

    visitLeave: function(testSuite) {
    }
}
AtlasUnit.Visitor.registerClass("AtlasUnit.Visitor");


AtlasUnit.TestRunner = function(runMode, throwOnFail) {
    AtlasUnit.TestRunner.initializeBase(this);

    this._runMode = runMode ? runMode : AtlasUnit.RunMode.AllTests;
    this._throwOnFail = throwOnFail ? true : false;
    this._includedCategories = null;
    this._excludedCategories = null;
    this._currentSuite = null;
    this._selectedSuite = null;
}
AtlasUnit.TestRunner.prototype = {
    get_excludedCategories: function() {
        return this._excludedCategories || [];
    },
    set_excludedCategories: function(excludedCategories) {
        this._excludedCategories = excludedCategories;
    },

    get_includedCategories: function() {
        return this._includedCategories || [];
    },
    set_includedCategories: function(includedCategories) {
        this._includedCategories = includedCategories;
    },

    get_runMode: function() {
        return this._runMode;
    },
    set_runMode: function(runMode) {
        this._runMode = runMode;
    },

    get_throwOnFail: function() {
        return this._throwOnFail;
    },
    set_throwOnFail: function(throwOnFail) {
        this._throwOnFail = throwOnFail;
    },

    _isExcluded: function(test) {
        return (this.get_excludedCategories().length > 0 &&
                AtlasUnit.Util.intersect(this.get_excludedCategories(), test.get_categories()).length > 0);
    },

    _isIncluded: function(test) {
        return (this.get_includedCategories().length === 0 ||
                AtlasUnit.Util.intersect(this.get_includedCategories(), test.get_categories()).length > 0);
    },

    visitEnter: function(testSuite) {
        testSuite.get_result().set_executionStatus(AtlasUnit.ExecutionStatus.NotExecuted);

        if (this._selectedSuite === null && testSuite.get_selected()) {
            this._selectedSuite = testSuite;
        }

        this._currentSuite = testSuite;
    },

    visit: function(testCase) {
        testCase.get_result().set_executionStatus(AtlasUnit.ExecutionStatus.NotExecuted);

        if (this._runMode === AtlasUnit.RunMode.AllTests || this._selectedSuite !== null || testCase.get_selected()) {
            if ((this._isIncluded(this._currentSuite) || this._isIncluded(testCase)) &&
                (!this._isExcluded(this._currentSuite) && !this._isExcluded(testCase))) {

                testCase.run(this._throwOnFail);
            }
        }
    },

    visitLeave: function(testSuite) {
        if (this._runMode === AtlasUnit.RunMode.AllTests || this._selectedSuite !== null) {
            var executionStatus = AtlasUnit.ExecutionStatus.NotExecuted;
            var childSuites = testSuite.get_tests();
            for (var i=0; i < childSuites.length; i++) {
                if (childSuites[i].get_result().get_executionStatus() === AtlasUnit.ExecutionStatus.Succeeded) {
                    executionStatus = AtlasUnit.ExecutionStatus.Succeeded;
                }
                else if (childSuites[i].get_result().get_executionStatus() === AtlasUnit.ExecutionStatus.Failed) {
                    executionStatus = AtlasUnit.ExecutionStatus.Failed;
                    break;
                }
            }
            testSuite.get_result().set_executionStatus(executionStatus);
        }

        if (this._selectedSuite === testSuite) {
            this._selectedSuite = null;
        }
    }
}
AtlasUnit.TestRunner.registerClass("AtlasUnit.TestRunner", AtlasUnit.Visitor);


AtlasUnit.AsyncTestRunner = function(backgroundWorker, runMode, throwOnFail) {
    AtlasUnit.AsyncTestRunner.initializeBase(this, [runMode, throwOnFail]);
    this._backgroundWorker = backgroundWorker;
}
AtlasUnit.AsyncTestRunner.prototype = {
    visitEnter: function(testSuite) {
        this._backgroundWorker.addDelegate(Function.createDelegate(
            this,
            function() { AtlasUnit.AsyncTestRunner.callBaseMethod(this, "visitEnter", [testSuite]) }));
    },

    visit: function(testCase) {
        this._backgroundWorker.addDelegate(Function.createDelegate(
            this,
            function() { AtlasUnit.AsyncTestRunner.callBaseMethod(this, "visit", [testCase]) }));
    },

    visitLeave: function(testSuite) {
        this._backgroundWorker.addDelegate(Function.createDelegate(
            this,
            function() { AtlasUnit.AsyncTestRunner.callBaseMethod(this, "visitLeave", [testSuite]) }));
    }
}
AtlasUnit.AsyncTestRunner.registerClass("AtlasUnit.AsyncTestRunner", AtlasUnit.TestRunner);


AtlasUnit.RunMode = {AllTests: 0, SelectedTests: 1};


AtlasUnit.TestSuiteBuilder = function() {
    var _fixtures = [];
    var _nameSpaces = [];

    this.addFixture = function(fixture) {
        _fixtures.push(fixture)
    }

    this.addNameSpace = function(nameSpace) {
        _nameSpaces.push(nameSpace);
    }

    this.build = function() {
        var root = new AtlasUnit.TestSuite("root");

        for (var i=0; i < _fixtures.length; i++) {
            root.add(buildSuiteFromFixture(_fixtures[i]));
        }

        for (var j=0; j < _nameSpaces.length; j++) {
            var nameSpace = _nameSpaces[j];
            for (var className in nameSpace) {
                var theClass = nameSpace[className];
                if (theClass["AtlasUnit.IsTestFixture"]) {
                    root.add(buildSuiteFromFixture(theClass));
                }
            }

        }

        return root;
    }

    var buildSuiteFromFixture = function(fixture) {
        var fixtureNameParts = fixture.getName().split(".");
        var root = new AtlasUnit.TestSuite(fixtureNameParts[0]);
        var parent = root;

        for (var i=1; i < fixtureNameParts.length; i++) {
            var suite = new AtlasUnit.TestSuite(fixtureNameParts[i],
                parent.get_fullName() + "." + fixtureNameParts[i]);
            parent.add(suite);
            parent = suite;
        }

        if (fixture["AtlasUnit.Categories"]) {
            parent.set_categories(fixture["AtlasUnit.Categories"]);
        }

        var instance = new fixture();
        for (var methodName in instance) {
            if (methodName.startsWith("test") && (instance[methodName] instanceof Function)) {
                var testCase = new AtlasUnit.TestCase(instance, methodName);
                if (instance[methodName]["AtlasUnit.Categories"]) {
                    testCase.set_categories(instance[methodName]["AtlasUnit.Categories"]);
                }
                if (instance[methodName]["AtlasUnit.ExpectedException"]) {
                    testCase.set_expectedException(instance[methodName]["AtlasUnit.ExpectedException"]);
                }
                parent.add(testCase);
            }
        }

        return root;
    }
}
AtlasUnit.TestSuiteBuilder.registerClass("AtlasUnit.TestSuiteBuilder");


AtlasUnit.TestResult = function() {
    var _executionStatus = AtlasUnit.ExecutionStatus.NotExecuted;
    var _exception = null;

    this.get_executionStatus = function() {
        return _executionStatus;
    }

    this.set_executionStatus = function(executionStatus) {
        _executionStatus = executionStatus;
    }

    this.get_exception = function() {
        return _exception;
    }

    this.set_exception = function(exception) {
        _exception = exception;
    }
}
AtlasUnit.TestResult.registerClass("AtlasUnit.TestResult");


AtlasUnit.ExecutionStatus = {NotExecuted: 0, Succeeded: 1, Failed: 2};


AtlasUnit.ResultCollector = function() {
    AtlasUnit.ResultCollector.initializeBase(this);

    this._runTests = [];
    this._runTestCases = [];
    this._failedTests = [];
    this._failedTestCases = [];
}
AtlasUnit.ResultCollector.prototype = {
    _processTest: function(test, runCollection, failedCollection) {
        switch (test.get_result().get_executionStatus()) {
            case AtlasUnit.ExecutionStatus.Succeeded:
                runCollection.push(test);
                break;
            case AtlasUnit.ExecutionStatus.Failed:
                runCollection.push(test);
                failedCollection.push(test);
                break;
        }
    },
    
    visitEnter: function(testSuite) {
        this._processTest(testSuite, this._runTests, this._failedTests);
    },

    visit: function(testCase) {
        this._processTest(testCase, this._runTests, this._failedTests);
        this._processTest(testCase, this._runTestCases, this._failedTestCases);
    },

    get_runTests: function() {
        return this._runTests;
    },

    get_runTestNames: function() {
        return AtlasUnit.Util.map(AtlasUnit.Util.convertToString, this.get_runTests())
    },

    get_runTestCases: function() {
        return this._runTestCases;
    },

    get_failedTests: function() {
        return this._failedTests;
    },

    get_failedTestNames: function() {
        return AtlasUnit.Util.map(AtlasUnit.Util.convertToString, this.get_failedTests())
    },

    get_failedTestCases: function() {
        return this._failedTestCases;
    }
}
AtlasUnit.ResultCollector.registerClass("AtlasUnit.ResultCollector", AtlasUnit.Visitor);


AtlasUnit.CategoryCollector = function() {
    AtlasUnit.CategoryCollector.initializeBase(this);

    this._categories = {};
}
AtlasUnit.CategoryCollector.prototype = {
    get_categories: function() {
        var categories = [];
        for (var category in this._categories) {
            categories.push(category);
        }
        categories.sort();
        return categories;
    },
    
    _addCategories: function(test) {
        var categories = test.get_categories();
        for (var i=0; i < categories.length; i++) {
            var category = categories[i];
            this._categories[category] = true;
        }
    },

    visitEnter: function(testSuite) {
        this._addCategories(testSuite);
    },

    visit: function(testCase) {
        this._addCategories(testCase);
    }
}
AtlasUnit.CategoryCollector.registerClass("AtlasUnit.CategoryCollector", AtlasUnit.Visitor);


AtlasUnit.Assert = {};

AtlasUnit.Assert.fail = function(message) {
    throw Error.create(message ? message : "", {name: "AtlasUnit.Exception"});
}

AtlasUnit.Assert.isTrue = function(condition, message) {
    AtlasUnit.Assert.areEqual(true, condition, message);
}

AtlasUnit.Assert.isFalse = function(condition, message) {
    AtlasUnit.Assert.areEqual(false, condition, message);
}

AtlasUnit.Assert.isNull = function(value, message) {
    AtlasUnit.Assert.areEqual(null, value, message);
}

AtlasUnit.Assert.isNotNull = function(value, message) {
    if (value === null) {
        AtlasUnit.Assert.fail(message);
    }
}

AtlasUnit.Assert.areEqual = function(expected, actual, message) {
    if (expected !== actual) {
        AtlasUnit.Assert._failExpectedActual(expected, actual, message);
    }
}

AtlasUnit.Assert.areNotEqual = function(expected, actual, message) {
    if (expected === actual) {
        AtlasUnit.Assert.fail(message);
    }
}

AtlasUnit.Assert.enumEqual = function(expected, actual, enumType, message) {
    if (expected !== actual) {
        var displayExpected = expected;
        try {
            // Enum.toString(invalid) throws in debug mode, but returns '' in release mode.
            // We need to handle both cases.
            var expectedToString = enumType.toString(expected);
            if (expectedToString) {
                displayExpected = enumType.getName() + "." + expectedToString;
            }
        }
        catch (e) {
        }
        
        var displayActual = actual;
        try {
            // Enum.toString(invalid) throws in debug mode, but returns '' in release mode.
            // We need to handle both cases.
            var actualToString = enumType.toString(actual);
            if (actualToString) {
                displayActual = enumType.getName() + "." + actualToString;
            }
        }
        catch (e) {
        }
        AtlasUnit.Assert._failExpectedActual(displayExpected, displayActual, message);
    }
}

AtlasUnit.Assert._failExpectedActual = function(expected, actual, message, hideBrackets) {
    var displayExpected = AtlasUnit.Util.convertToString(expected);
    displayExpected = AtlasUnit.Util.escapeNewlines(displayExpected);
    var displayActual = AtlasUnit.Util.convertToString(actual);
    displayActual = AtlasUnit.Util.escapeNewlines(displayActual);

    var failureFormat;
    if (!hideBrackets) {
        failureFormat = "{0}\r\nExpected:<{1}>\r\nActual:<{2}>";
    }
    else {
        failureFormat = "{0}\r\nExpected:{1}\r\nActual:{2}";
    }

    var failureMessage = String.format(failureFormat, (message ? message : ""), displayExpected, displayActual);
    AtlasUnit.Assert.fail(failureMessage);
}

AtlasUnit.Assert.isEmpty = function(array, message) {
    AtlasUnit.Assert.elementsEqual([], array, message);
}

AtlasUnit.Assert.elementsEqual = function(expectedArray, actualArray, message) {
    if (expectedArray === actualArray) {
        return;
    }

    if ((expectedArray === undefined && actualArray !== undefined) ||
        (expectedArray !== undefined && actualArray === undefined)) {
        AtlasUnit.Assert._failExpectedActual(expectedArray, actualArray, message);
    }

    if ((expectedArray === null && actualArray !== null) ||
        (expectedArray !== null && actualArray === null)) {
        AtlasUnit.Assert._failExpectedActual(expectedArray, actualArray, message);
    }

    if (expectedArray.length !== actualArray.length) {
        AtlasUnit.Assert._failExpectedActual(expectedArray, actualArray, message);
    }

    for (var i=0; i < expectedArray.length; i++) {
        if (expectedArray[i] !== actualArray[i]) {
            AtlasUnit.Assert._failExpectedActual(expectedArray, actualArray, message);
        }
    }
}

AtlasUnit.Assert.expectException = function(delegate, expectedException, expectedExceptionType) {
    // Default expected exception type is Error
    if (!expectedExceptionType) {
        expectedExceptionType = Error;
    }

    var exceptionThrown = false;
    var actualException;
    try {
        delegate();
    }
    catch (ex) {
        exceptionThrown = true;
        actualException = ex;
    }
    if (!exceptionThrown) {
        AtlasUnit.Assert.fail("Exception was expected");
    }
    else if (!(actualException instanceof expectedExceptionType)) {
        var failureMessage = String.format("\r\nExpected: Exception of type {0}", expectedExceptionType.getName());
        if (actualException === undefined) {
            failureMessage += "\r\nActual: Undefined exception";
        }
        else if (actualException === null) {
            failureMessage += "\r\nActual: Null exception";
        }
        else {
            failureMessage += String.format("\r\nActual: Exception of type {0}", Object.getTypeName(actualException));
        }
        AtlasUnit.Assert.fail(failureMessage);
    }
    else {
        for (var member in expectedException) {
            AtlasUnit.Assert._verifyMember(member, expectedException, actualException);
        }
    }    
}

AtlasUnit.Assert.instanceOfType = function(expectedType, actualObject, message) {
    if (!expectedType.isInstanceOfType(actualObject)) {
        AtlasUnit.Assert._failExpectedActual(
            " Object to be instance of " + expectedType.getName(),
            " " + Object.getType(actualObject).getName(),
            message,
            true);
    }
}

AtlasUnit.Assert.notInstanceOfType = function(expectedType, actualObject, message) {
    if (expectedType.isInstanceOfType(actualObject)) {
        AtlasUnit.Assert._failExpectedActual(
            " Object not an instance of " + expectedType.getName(),
            " " + Object.getType(actualObject).getName(),
            message,
            true);
    }
}

AtlasUnit.Assert._verifyMember = function(member, expectedException, actualException) {
    var expectedMember = expectedException[member];
    var actualMember = actualException[member];
    if (expectedMember !== actualMember) {
        var exceptionFormat = " Exception with {0} <{1}>";
        var displayExpected = String.format(exceptionFormat, member, expectedMember);
        var displayActual = String.format(exceptionFormat, member, actualMember);
        AtlasUnit.Assert._failExpectedActual(displayExpected, displayActual, null, true);
    }
}


AtlasUnit._Util = function() {
    this.convertToString = function(obj) {
        if (obj === undefined) {
            return "undefined";
        }
        else if (obj === null) {
            return "null";
        }
        else if (Object.getType(obj) &&
                 Object.getType(obj).getName &&
                 Object.getType(obj).getName() === "Array") {
            return "[" + AtlasUnit.Util.map(this.convertToString, obj) + "]";
        }
        else if (obj.tagName) {
            return "{" + obj.tagName + "}";
        }
        else {
            return "" + obj;
        }
    }

    this.escapeNewlines = function(str) {
        var escaped = str;
        escaped = escaped.replace(/\\r/g, "\\\\r").replace(/\\n/g, "\\\\n");
        escaped = escaped.replace(/\r/g, "\\r").replace(/\n/g, "\\n");
        return escaped;
    }

    this.execInAllBrowsers = function(method) {
        try {
            var oldBrowser = Sys.Browser.agent;
            Sys.Browser.agent = Sys.Browser.InternetExplorer;
            method();
            Sys.Browser.agent = Sys.Browser.Firefox;
            method();
            Sys.Browser.agent = Sys.Browser.Safari;
            method();
            Sys.Browser.agent = Sys.Browser.Opera;
            method();
        }
        finally {
            Sys.Browser.agent = oldBrowser;
        }
    }

     this.fireKeyboardEvent = function(target, name, key) {
         var evt;
         if (target.fireEvent) {
             // IE supports fireEvent()
             evt = document.createEventObject();
             evt.detail = 1;
             var loc = Sys.UI.DomElement.getLocation(target);
             evt.offsetX = -loc.x;
             evt.offsetY = -loc.y;
             evt.screenX = 0;
             evt.screenY = 0;
             evt.clientX = 0;
             evt.clientY = 0;
             evt.ctrlKey = false;
             evt.altKey = false;
             evt.shiftKey = false;
             evt.metaKey = false;
             evt.button = 0;
             evt.keyCode = (typeof(key) === 'string') ? key.charCodeAt(0) : key;
 
             target.fireEvent("on" + name, evt);
         }
         else if (target.dispatchEvent) {
             // Firefox and Safari both support dispatchEvent()
             evt = document.createEvent("KeyboardEvent");
             if (evt.initKeyEvent) {
                 // Firefox supports initKeyEvent()
                 evt.initKeyEvent(
                     name, // typeArg
                     true, // canBubbleArg
                     true, // cancelableArg
                     document.defaultView, // viewArg
                     false, // ctryKeyArg
                     false, // altKeyArg
                     false, // shiftKeyArg
                     false, // metaKeyArg
                     (typeof(key) === 'string') ? null : key, // keyCode
                     (typeof(key) === 'string') ? key.charCodeAt(0) : null // charCode
                 );
             }
             else if (evt.initKeyboardEvent) {
                 // Safari supports initKeyboardEvent(), but not initKeyEvent(),
                 // and has bugs: charCode and keyCode are never set.
                 // http://bugs.webkit.org/show_bug.cgi?id=16735
                 evt.initKeyboardEvent(
                     name, // eventTypeArg
                     true, // canBubbleArg
                     true, // cancelableArg
                     document.defaultView, // viewArg
                     (typeof(key) === 'string') ? "U+" + key.charCodeAt(0) : "U+" + key, // keyIdentifier
                     (typeof(key) === 'string') ? key.charCodeAt(0) : key, // keyLocation
                     false, // ctryKeyArg
                     false, // altKeyArg
                     false, // shiftKeyArg
                     false  // metaKeyArg
                 );
             }
             else {
                 Sys.Debug.fail("Target does not support event firing.");
             }
             target.dispatchEvent(evt);
         }
         else {
             Sys.Debug.fail("Target does not support event firing.");
         }
     }
 
    this.fireMouseEvent = function(target, name) {
        var evt;
        if (target.fireEvent) {
            // IE supports fireEvent()
            evt = document.createEventObject();
            evt.detail = 1;
             var loc = Sys.UI.DomElement.getLocation(target);
             evt.offsetX = -loc.x;
             evt.offsetY = -loc.y;
            evt.screenX = 0;
            evt.screenY = 0;
            evt.clientX = 0;
            evt.clientY = 0;
            evt.ctrlKey = false;
            evt.altKey = false;
            evt.shiftKey = false;
            evt.metaKey = false;
            evt.button = 0;

            target.fireEvent("on" + name, evt);
        }
        else if (target.dispatchEvent) {
            // Firefox and Safari both support dispatchEvent()
            evt = document.createEvent("MouseEvents");
            if (evt.initMouseEvent) {
                // Firefox and Safari 3 support initMouseEvent()
                evt.initMouseEvent(
                    name, // typeArg
                    true, // canBubbleArg
                    true, // cancelableArg
                    document.defaultView, // viewArg
                    1, // detailArg (specifies click count)
                    0, // screenXArg
                    0, // screenYArg
                    0, // clientXArg
                    0, // clientYArg
                    false, // ctryKeyArg
                    false, // altKeyArg
                    false, // shiftKeyArg
                    false, // metaKeyArg
                    0, // buttonArg (specifies mouse button: left button=0, middle button=1, right button=2)
                    target // relatedTargetArg (specifies EventTarget)
                );
            }
            else if (evt.initEvent) {
                // Safari 2 supports initEvent(), but not initMouseEvent()
                evt.initEvent(
                    name, // eventTypeArg
                    true, // canBubbleArg
                    true  // cancelableArg
                );
            }
            else {
                Sys.Debug.fail("Target does not support event firing.");
            }
            target.dispatchEvent(evt);
        }
        else {
            Sys.Debug.fail("Target does not support event firing.");
        }
    }

    // Copied from HttpServerUtility.FormatPlainTextAsHtml()
    this.formatPlainTextAsHtml = function(str) {
        var sb = new Sys.StringBuilder();

        var numChars = str.length;
        var prevCh;

        for (var i=0; i < numChars; i++) {
            var ch = str.charAt(i);
            switch (ch) {
                case "<":
                    sb.append("&lt;");
                    break;
                case ">":
                    sb.append("&gt;");
                    break;
                case "\"":
                    sb.append("&quot;");
                    break;
                case "&":
                    sb.append("&amp;");
                    break;
                case " ":
                    if (prevCh === " ") {
                        sb.append("&nbsp;");
                    }
                    else {
                        sb.append(" ");
                    }
                    break;
                case "\r":
                    // Ignore \r, only handle \n
                    break;
                case "\n":
                    // Insert line breaks before and after the <br />, so the HTML looks better.
                    sb.appendLine();
                    sb.appendLine("<br />");
                    break;
                default:
                    sb.append(ch);
                    break;
            }

            prevCh = ch;
        }

        return sb.toString();
    }

    this.intersect = function(array1, array2) {
        var result = [];
        if (array1) {
            for (var i=0; i < array1.length; i++) {
                if (array2 && Array.contains(array2, array1[i])) {
                    result.push(array1[i]);
                }
            }
        }
        return result;
    }

    this.map = function(func, array) {
        var result = new Array(array.length);
        for (var i=0; i < array.length; i++) {
            result[i] = func(array[i]);
        }
        return result;
    }
};
AtlasUnit._Util.registerClass("AtlasUnit._Util");

AtlasUnit.Util = new AtlasUnit._Util();

AtlasUnit.BackgroundWorker = function() {
    this._batchSize = 1;
    this._delegates = [];
    this._events = null;
}
AtlasUnit.BackgroundWorker.prototype = {
    _get_events: function() {
        if (!this._events) {
            this._events = new Sys.EventHandlerList();
        }
        return this._events;
    },
    
    get_batchSize: function() {
        return this._batchSize;
    },
    set_batchSize: function(value) {
        this._batchSize = value;
    },
    
    add_completed: function(handler) {
        this._get_events().addHandler("completed", handler);
    },
    remove_completed: function(handler) {
        this._get_events().removeHandler("completed", handler);
    },

    addDelegate: function(delegate) {
        Array.add(this._delegates, delegate);
    },
    
    run: function() {
        this._runHelper();
    },
    
    _runHelper: function() {
        var nextFunction;
    
        if (this._delegates.length > 0) {
            nextFunction = Function.createDelegate(
                this,
                function() {
                    for (var i=0; (i < this.get_batchSize()) && (this._delegates.length > 0); i++) {
                        var delegate = this._delegates.shift();
                        delegate();
                    }
                    this._runHelper();
                });
        }
        else {
            nextFunction = Function.createDelegate(
                this,
                function() {
                    var handler = this._get_events().getHandler("completed");
                    if (handler) {
                        handler(this, Sys.EventArgs.Empty);
                    }
                });
        }
    
        if (nextFunction) {
            window.setTimeout(nextFunction, 0);
        }
    }    
}
AtlasUnit.BackgroundWorker.registerClass('AtlasUnit.BackgroundWorker');

Sys.Application.notifyScriptLoaded();