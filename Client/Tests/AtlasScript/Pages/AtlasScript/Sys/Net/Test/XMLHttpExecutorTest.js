/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("Sys.Net.Test");

Sys.Net.Test.XMLHttpExecutorTest = function() {
    var _completedExec;

    this.setUp = function() {
        _completedExec = new Sys.Net.XMLHttpExecutor();
        var req = new Sys.Net.WebRequest();
        req.set_executor(_completedExec);
        _completedExec._started = true;
        _completedExec._responseAvailable = true;
    }

    this.testGetStarted = function() {
        var exec = new Sys.Net.XMLHttpExecutor();
        AtlasUnit.Assert.isFalse(exec.get_started(), "get started should be false");
        var req = new Sys.Net.WebRequest();
        req.set_executor(exec);
        AtlasUnit.Assert.isFalse(exec.get_started(), "get started should be false");
        exec._started = true;
        AtlasUnit.Assert.isTrue(exec.get_started(), "get started should be true");
    }

    this.testSetWebRequestTooLate = function() {
        var req = new Sys.Net.WebRequest();
        req.set_executor(_completedExec);
    }
    this.testSetWebRequestTooLate["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testSetWebRequestTooLate["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testGetResponseDataTooEarly = function() {
        var exec = new Sys.Net.XMLHttpExecutor();
        exec.get_responseData();
    }
    this.testGetResponseDataTooEarly["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testGetResponseDataTooEarly["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testGetStatusTooEarly = function() {
        var exec = new Sys.Net.XMLHttpExecutor();
        exec.get_statusCode();
    }
    this.testGetStatusTooEarly["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testGetStatusTooEarly["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testGetStatusTextTooEarly = function() {
        var exec = new Sys.Net.XMLHttpExecutor();
        exec.get_statusText();
    }
    this.testGetStatusTextTooEarly["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testGetStatusTextTooEarly["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testGetResponseHeaderTooEarly = function() {
        var exec = new Sys.Net.XMLHttpExecutor();
        exec.getResponseHeader("whatever");
    }
    this.testGetResponseHeaderTooEarly["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testGetResponseHeaderTooEarly["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testGetAllResponseHeadersTooEarly = function() {
        var exec = new Sys.Net.XMLHttpExecutor();
        exec.getAllResponseHeaders();
    }
    this.testGetAllResponseHeadersTooEarly["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testGetAllResponseHeadersTooEarly["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testGetXmlTooEarly = function() {
        var exec = new Sys.Net.XMLHttpExecutor();
        exec.get_xml();
    }
    this.testGetXmlTooEarly["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testGetXmlTooEarly["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testExecuteNoRequest = function() {
        var exec = new Sys.Net.XMLHttpExecutor();
        exec.executeRequest();
    }
    this.testExecuteNoRequest["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testExecuteNoRequest["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testExecuteTwice = function() {
        _completedExec.executeRequest();
    }
    this.testExecuteTwice["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testExecuteTwice["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testGetResponseDataTooLate = function() {
        _completedExec.get_responseData();
    }
    this.testGetResponseDataTooLate["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testGetResponseDataTooLate["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testGetStatusTooLate = function() {
        _completedExec.get_statusCode();
    }
    this.testGetStatusTooLate["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testGetStatusTooLate["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testGetStatusTextTooLate = function() {
        _completedExec.get_statusText();
    }
    this.testGetStatusTextTooLate["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testGetStatusTextTooLate["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testGetResponseHeaderTooLate = function() {
        _completedExec.getResponseHeader("whatever");
    }
    this.testGetResponseHeaderTooLate["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testGetResponseHeaderTooLate["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testGetAllResponseHeadersTooLate = function() {
        _completedExec.getAllResponseHeaders();
    }
    this.testGetAllResponseHeadersTooLate["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testGetAllResponseHeadersTooLate["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testGetXmlTooLate = function() {
        _completedExec.get_xml();
    }
    this.testGetXmlTooLate["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testGetXmlTooLate["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }

    this.testAbort = function() {
        var exec = new Sys.Net.XMLHttpExecutor();
        var req = new Sys.Net.WebRequest();
        req.set_executor(exec);
        exec._started = true;
        exec.abort();
        AtlasUnit.Assert.isTrue(exec.get_aborted(), "executor should be aborted");

        // Call abort again to make sure it doesn't throw
        exec.abort();
    }

    this.testAbortAfterComplete = function() {
        var exec = new Sys.Net.XMLHttpExecutor();
        var req = new Sys.Net.WebRequest();
        req.set_executor(exec);
        exec._responseAvailable = true;
        exec._started = true;
        exec.abort();
        AtlasUnit.Assert.isFalse(exec.get_aborted(), "executor should not be aborted after complete");
    }

    this.testAbortAfterTimeout = function() {
        var exec = new Sys.Net.XMLHttpExecutor();
        var req = new Sys.Net.WebRequest();
        req.set_executor(exec);
        exec._timedOut = true;
        exec._started = true;
        exec.abort();
        AtlasUnit.Assert.isFalse(exec.get_aborted(), "executor should not be aborted after complete");
    }

    this.testAbortTooEarly = function() {
        var failed = false;
        var exec = new Sys.Net.XMLHttpExecutor();
        var req = new Sys.Net.WebRequest();
        req.set_executor(exec);
        exec.abort();
    }
    this.testAbortTooEarly["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testAbortTooEarly["AtlasUnit.ExpectedException"] = { name: 'Sys.InvalidOperationException' }
    
    this.testCleanup = function() {
        var exec = new Sys.Net.XMLHttpExecutor();
        var req = new Sys.Net.WebRequest();
        req.set_url(".");
        req.add_completed(function() {
            throw 'error';
        });
        req.set_executor(exec);
        var xhr = {};
        exec.executeRequest = function() {
            // mock execute
            exec._xmlHttpRequest = xhr;
            exec.onreadystatechange = {};
        }
        req.invoke();
        AtlasUnit.Assert.areEqual(xhr, exec._xmlHttpRequest);
        xhr.readyState = 4;
        xhr.status = 200;
        
        try {
            exec._onReadyStateChange();
        }
        catch (e) {
            AtlasUnit.Assert.areEqual("error", e);
            AtlasUnit.Assert.isNull(exec._xmlHttpRequest);
            AtlasUnit.Assert.areEqual(Function.emptyMethod, xhr.onreadystatechange);
        }
    }
    // Dev10 Bug 527450: The try/finally to ensure cleanup is only in release mode as it 
    // breaks debugging in debug mode.
    this.testCleanup["AtlasUnit.Categories"] = ["ReleaseOnly"];

}
Sys.Net.Test.XMLHttpExecutorTest.registerClass("Sys.Net.Test.XMLHttpExecutorTest");
Sys.Net.Test.XMLHttpExecutorTest["AtlasUnit.IsTestFixture"] = true;

