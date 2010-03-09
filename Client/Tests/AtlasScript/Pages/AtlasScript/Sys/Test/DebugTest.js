/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("Sys.Test");

Sys.Test.DebugTest = function() {
    this._msg = "The message";
    this.setUp = function() {
        var _this = this;
        this._written = null;
        if (window.Debug) this._Debug = window.Debug;
        window.Debug = {
            writeln:function(line){
                _this._written = line;
            }
        }

        this._js = null;
        this._eval = window.eval;
        window.eval = function(js){
            _this._js = js;
        }

        this._confirmCurrentState = false; // This simulates somebody clicking no in the confirm dialog.
        this._confirmMessage = null;
        this._confirm = window.confirm;
        window.confirm = function(msg){
            _this._confirmMessage = msg;
            return _this._confirmCurrentState;
        }

        this._traceElement = document.createElement('TEXTAREA');
        AtlasUnit.Assert.isNotNull(this._traceElement);
        // Hide trace console during tests; must use hidden because trace element value isn't available when display is none in Safari.
        this._traceElement.style.visibility = "hidden";
        this._traceElement.id = 'TraceConsole';
        document.body.appendChild(this._traceElement);
        AtlasUnit.Assert.areEqual(this._traceElement, Sys.UI.DomElement.getElementById('TraceConsole'));
    }

    this.tearDown = function() {
        if (this._Debug){
            window.Debug = Debug = this._Debug;
            delete this._Debug;
        }
        window.eval = eval = this._eval;
        delete this._eval;
        window.confirm = confirm = this._confirm;
        delete this._confirm;

        document.body.removeChild(this._traceElement);
        delete this._traceElement;
    }

    this.testAssertConditionTrue = function() {
        Sys.Debug.assert(true);

        AtlasUnit.Assert.isNull(this._confirmMessage, "The confirm function should not have been called.");
    }

    this._testAssertConditionFalseHelper = function(message, displayCaller, confirm){
        this._confirmCurrentState = (confirm ? true : false);

        switch (arguments.length){
            case 0:
                Sys.Debug.assert(false);
                break;
            case 1:
                Sys.Debug.assert(false, message);
                break;
            default:
                Sys.Debug.assert(false, message, displayCaller);
                break;
        }

        if (displayCaller){
            if (!this._testAssertConditionFalseHelper.caller){
                AtlasUnit.Assert.areEqual(String.format(Sys.Res.breakIntoDebugger, String.format(Sys.Res.assertFailed, this._msg)),
                    this._confirmMessage, "The confirm message should have been sent to confirm.");
            }
            else{
                AtlasUnit.Assert.areEqual(String.format(Sys.Res.breakIntoDebugger,
                        String.format(Sys.Res.assertFailedCaller, this._msg, this._testAssertConditionFalseHelper.toString())),
                    this._confirmMessage, "The confirm message should have been sent to confirm and contain the caller.");
            }
        }
        else{
            AtlasUnit.Assert.areEqual(
                String.format(Sys.Res.breakIntoDebugger, String.format(Sys.Res.assertFailed, message)),
                this._confirmMessage);
        }

        if (confirm){
            // Cannot execute eval('debugger') in Safari, since it causes a parse error
            if (!Sys.Browser.hasDebuggerStatement){
                AtlasUnit.Assert.isNull(this._js, "The script should not have broken into the debugger.");
            }
            else{
                AtlasUnit.Assert.areEqual("debugger", this._js, "The browser should have tried to break into the debugger.");
            }
        }
        else{
            AtlasUnit.Assert.isNull(this._js, "The script should not have broken into the debugger.");
        }
    }

    this.testAssertConditionFalse = function() {
        this._testAssertConditionFalseHelper();
    }

    this.testAssertConditionFalseMessageUndefined = function() {
        this._testAssertConditionFalseHelper(undefined);
    }

    this.testAssertConditionFalseMessageNull = function() {
        this._testAssertConditionFalseHelper(null);
    }

    this.testAssertConditionFalseMessageString = function() {
        this._testAssertConditionFalseHelper(this._msg);
    }

    this.testAssertConditionFalseMessageStringDisplayCallerFalse = function() {
        this._testAssertConditionFalseHelper(this._msg, false);
    }

    this.testAssertConditionFalseMessageStringDisplayCallerTrue = function() {
        this._testAssertConditionFalseHelper(this._msg, true);
    }

    this.testAssertConditionFalseMessageUndefinedConfirmTrue = function() {
        this._testAssertConditionFalseHelper(undefined, false, true);
    }

    this.testAssertConditionFalseMessageNullConfirmTrue = function() {
        this._testAssertConditionFalseHelper(null, false, true);
    }

    this.testAssertFailConditionFalseMessageStringConfirmTrue = function() {
        this._testAssertConditionFalseHelper(this._msg, false, true);
    }

    this._testFailHelper = function(message){
        Sys.Debug.fail(message);

        AtlasUnit.Assert.areEqual(message, this._written, "The error message should have been written out to the debugger.");

        // Cannot execute eval('debugger') in Safari, since it causes a parse error
        if (!Sys.Browser.hasDebuggerStatement){
            AtlasUnit.Assert.isNull(this._js, "The script should not have broken into the debugger.");
        }
        else{
            AtlasUnit.Assert.areEqual("debugger", this._js, "The browser should have tried to break into the debugger.");
        }
    }

    this.testFailMessageUndefined = function() {
        this._testFailHelper(undefined);
    }

    this.testFailMessageNull = function() {
        this._testFailHelper(null);
    }

    this.testFailMessageString = function() {
        this._testFailHelper(this._msg);
    }

    this.testIsDebugFalse = function() {
        AtlasUnit.Assert.isFalse(Sys.Debug.isDebug);
    }
    this.testIsDebugFalse["AtlasUnit.Categories"] = ["ReleaseOnly"];

    this.testIsDebugTrue = function() {
        AtlasUnit.Assert.isTrue(Sys.Debug.isDebug);
    }
    this.testIsDebugTrue["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testTrace = function() {
        var newlineRegex = /\r\n/g;
        var traces = [['', '123', '\nabcd\n\n123', Sys._Application], ['test', 'test;\ntest', { a:'1', b:'2' }, [1, 2, 3]]];
        var expected = this._traceElement.value;
        for (var i = 0; i < traces.length; i++){
            for (var j = 0; j < traces[i].length; j++){
                Sys.Debug.trace(traces[i][j]);
                expected += traces[i][j].toString().replace(newlineRegex, '\n') + '\n';
                var actual = this._traceElement.value.replace(newlineRegex, '\n');
                AtlasUnit.Assert.areEqual(expected, actual, "Invalid trace results.");
                AtlasUnit.Assert.areEqual(traces[i][j], this._written, "The trace should have been written out to the debugger.");
            }
            Sys.Debug.clearTrace();
            expected = "";
        }
        AtlasUnit.Assert.areEqual(this._traceElement.value, "", "Sys.Debug.clearTrace failed");
    }

    this.testTraceDump = function() {
        this._validateTraceDumpEqual(null, null, ["traceDump: null\n"]);
        this._validateTraceDumpEqual(undefined, undefined, ["traceDump: Undefined"]);
        this._validateTraceDumpEqual('', "dump", ["dump:"]);
        this._validateTraceDumpEqual(1, "dump", ["dump: 1"]);
        this._validateTraceDumpEqual(false, "dump", ["dump: false"]);
        this._validateTraceDumpEqual(/regex/, "dump", ["dump: /regex/"]);
        var date = new Date(0);
        this._validateTraceDumpEqual(date, "dump", ["dump: " + date.toString()]);

        var arr1 = ['1', '2', '3', null];
        this._validateTraceDumpEqual(arr1, "dump", [
            "dump {Array}",
            "    [0]: 1",
            "    [1]: 2",
            "    [2]: 3",
            "    [3]: null"]);

        var obj1 = { a:'a', b:null, c:undefined };
        this._validateTraceDumpEqual(obj1, "dump", [
            "dump {Object}",
            "    a: a",
            "    b: null",
            "    c: Undefined"]);

        var obj2 = { a:obj1, b:arr1, c:null };
        this._validateTraceDumpEqual(obj2, "dump", [
            "dump {Object}",
            "    a {Object}",
            "        a: a",
            "        b: null",
            "        c: Undefined",
            "    b {Array}",
            "        [0]: 1",
            "        [1]: 2",
            "        [2]: 3",
            "        [3]: null",
            "    c: null"]);

        // test circular references.
        obj1.c = obj2;
        this._validateTraceDumpEqual(obj1, "dump", [
            "dump {Object}",
            "    a: a",
            "    b: null",
            "    c {Object}",
            "        a: ...",
            "        b {Array}",
            "            [0]: 1",
            "            [1]: 2",
            "            [2]: 3",
            "            [3]: null",
            "        c: null"]);

        arr1[3] = [[[[arr1]]]];
        this._validateTraceDumpEqual(arr1, "dump", [
            "dump {Array}",
            "    [0]: 1",
            "    [1]: 2",
            "    [2]: 3",
            "    [3] {Array}",
            "        [0] {Array}",
            "            [0] {Array}",
            "                [0] {Array}",
            "                    [0]: ..."]);

        // dom elements.
        this._validateTraceDumpEqual(window, "window", ["window {DomElement}"]);
        this._validateTraceDumpEqual(document, "document", ["document {DomElement}"]);
        this._validateTraceDumpEqual(this._traceElement, "element", ["element {TEXTAREA - TraceConsole}"]);
    }

    this._getDumpLines = function(obj, name){
        Sys.Debug.clearTrace();
        Sys.Debug.traceDump(obj, name);
        var actual = this._traceElement.value.replace(/\r\n/g, '\n').trim();
        return actual.split('\n');
    }

    this._validateTraceDumpEqual = function(obj, name, expectedLines){
        var actualLines = this._getDumpLines(obj, name);
        AtlasUnit.Assert.areEqual(expectedLines.length, actualLines.length,
            "Invalid trace dump length for " + name);
        for (var i = 0; i < actualLines.length; i++){
            AtlasUnit.Assert.areEqual(expectedLines[i].trim(), actualLines[i].trim(), "Invalid trace dump line for " + name);
        }
    }

}
Sys.Test.DebugTest.registerClass("Sys.Test.DebugTest");
Sys.Test.DebugTest["AtlasUnit.IsTestFixture"] = true;

