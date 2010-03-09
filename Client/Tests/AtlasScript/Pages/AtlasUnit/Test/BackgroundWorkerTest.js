/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\AtlasUnit.js"/>

Type.registerNamespace("AtlasUnit.Test");

AtlasUnit.Test.BackgroundWorkerTest = function() {
    var _completedCalled = 0;
    var _delegates = [];
    var _delegatesCalled = [];
    var _origWindowSetTimeout = null;
    var _setTimeoutCalled = 0;
    var _worker = null;
    
    this.setUp = function() {
        _worker = new AtlasUnit.BackgroundWorker();

        _delegates = [];
        _delegatesCalled = [];
        for (var i=0; i < 10; i++) {
            _delegates[i] = function(x) {
                return function() {
                    _delegatesCalled[x]++;
                };
            }(i);
            _delegatesCalled[i] = 0;
        }        

        _completedCalled = 0;
        _worker.add_completed(function(sender, e) {
            AtlasUnit.Assert.areEqual(_worker, sender);
            AtlasUnit.Assert.areEqual(Sys.EventArgs.Empty, e);
            _completedCalled++;
        });
        
        // Mock window.setTimeout to execute synchronously, since you can't unit test asynchronous callbacks.
        _origWindowSetTimeout = window.setTimeout;
        _setTimeoutCalled = 0;
        window.setTimeout = function(code, timeout) {
            code();                        
            _setTimeoutCalled++;
        }
    }
    
    this.tearDown = function() {
        window.setTimeout = _origWindowSetTimeout;
    }

    this.testBatchSize = function() {
        // Test default value
        AtlasUnit.Assert.areEqual(1, _worker.get_batchSize());
        
        _worker.set_batchSize(50);
        AtlasUnit.Assert.areEqual(50, _worker.get_batchSize());
    }
    
    this.testCompleted = function() {
        // One event handler registered in setUp()
        _worker.run();
        AtlasUnit.Assert.areEqual(1, _completedCalled);

        // Add another event handler
        _completedCalled = 0;
        var f = function(sender, e) {
            AtlasUnit.Assert.areEqual(_worker, sender);
            AtlasUnit.Assert.areEqual(Sys.EventArgs.Empty, e);
            _completedCalled++;
        };
        _worker.add_completed(f);
        _worker.run();
        AtlasUnit.Assert.areEqual(2, _completedCalled);
        
        // Remove event handler
        _completedCalled = 0;
        _worker.remove_completed(f);
        _worker.run();
        AtlasUnit.Assert.areEqual(1, _completedCalled);
    }
    
    this.testRunNoDelegates = function() {
        _worker.run();
        
        AtlasUnit.Assert.areEqual(1, _setTimeoutCalled);
        AtlasUnit.Assert.areEqual(1, _completedCalled);
    }
    
    var _testRunBatchSize = function(batchSize, expectedSetTimeoutCalled) {
        for (var i=0; i < 10; i++) {
            _worker.addDelegate(_delegates[i]);
        }
    
        _worker.set_batchSize(batchSize);
        _worker.run();
        
        for (var j=0; j < 10; j++) {
            AtlasUnit.Assert.areEqual(1, _delegatesCalled[j]);
        }
        AtlasUnit.Assert.areEqual(expectedSetTimeoutCalled, _setTimeoutCalled);
        AtlasUnit.Assert.areEqual(1, _completedCalled);
    }
    
    // Minimum size
    this.testRunBatchSizeMinimum = function() {    
        _testRunBatchSize(1, 11);
    }
    
    // Divides number of delegates evenly
    this.testRunBatchSizeDividesEvenly = function() {
        _testRunBatchSize(2, 6);
    }
    
    // Does not divide number of delegates evenly
    this.testRunBatchSizeNotDividesEvenly = function() {
        _testRunBatchSize(3, 5);
    }

    // Greater than number of delegates
    this.testRunBatchSizeExceedsDelegates = function() {
        _testRunBatchSize(20, 2);
    }
}
AtlasUnit.Test.BackgroundWorkerTest.registerClass("AtlasUnit.Test.BackgroundWorkerTest");
AtlasUnit.Test.BackgroundWorkerTest["AtlasUnit.IsTestFixture"] = true;

Sys.Application.notifyScriptLoaded();
