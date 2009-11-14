

// The TestHarness contains the implementation that populates the list of Test
// Suites, runs the selected Test Suites, and displays the results of the Test
// Pass.  We also define the following terms to share a common vocabulary:
//  - Test Harness: testing archictures that performs the Test Pass
//  - Test Pass: running selected Test Suites and displaying the results
//  - Test Suite: *.aspx page containing a RegisterTests method in JavaScript
//      that defines one or more Test Cases
//  - Test Case: An individual unit test composed of one or more Test Steps
//  - Test Step: An atomic action peformed (possibly asynchronously) as part of
//      a Test Case
function TestHarness() {
    // Constant values
    var constants = {
        // Initial delay (ms) to wait before running a Test Suite
        'InitialDelay' : 50,   
        // Interval (ms) to wait before checking Test Case completion
        'PollingInterval' : 250,    
        // Heading BackColor for successful Test Suites
        'SuccessBackColor' : '#B0FFB0', 
        // Message ForeColor for successful Test Cases
        'SuccessForeColor' : 'green',   
        // Heading BackColor for failing Test Suites
        'FailureBackColor' : '#EFC4C1', 
        // Message ForeColor for failing Test Cases
        'FailureForeColor' : 'red',     
        // Heading BackColor for unknown Test Suites
        'UnknownBackColor' : '#F0F0F0', 
        // Message ForeColor for unknown Test Cases
        'UnknownForeColor' : '#000000'  
    };
    this.Constants = constants;
    
    // 
    var testInterface = null;
    
    // References to controls in the page
    var wndTest = null;         // iframe used to load the test suites
    var frameTest = null;       // iframe used to load the test suites
    var btnRun = null;          // button that executes the selected tests
    var availableTests = null;  // div containing the list of all tests
    
    // Note: The variable "testSuiteUrls" is declared in the TestHarness.aspx
    // page and is an array populated by the server with the list of test
    // suites
        
    // The selectedTestSuitesUrls list and currentTestSuiteUrl variable track
    // the remaining test suites the user requested to run as well as the suite
    // currently executing.  These variables reference the urls of the suites.
    var selectedTestSuiteUrls = [];
    var currentTestSuiteUrl = null;
        
    // The testCases list and currentTestCase variable track the remaining Test
    // Cases to be executed in the current Test Suite.  They contain instances
    // of the TestCase object and are populated via the Test Suite's
    // RegisterTests function.
    var testCases = [];
    var currentTestCase = -1;
    
    var registeredFunctions = [];
    var resumeFunctionRegistrationID = -1;
    var waitIntervalID = null;
    
    // Flag and CheckBox determining if we're in debug mode.  Debug mode will not
    // automatically catch exceptions so that they can easily be caught by your
    // debugger of choice.
    var debug = false;
    var chkDebug = null;
    
    // Called via window.onload of TestHarness.aspx, the initialize method is
    // responsible for getting references to all the controls, creating the
    // list of tests we can run, and focusing the "Run Tests" button.
    this.initialize = function() {
        // Get references to the controls on the page
        wndTest = window.document.getElementById('wndTest');
        if (!wndTest) { 
            throw "Could not find iframe 'wndTest' on page!";
        }
        
        btnRun = window.document.getElementById('btnRun');
        if (!btnRun) {
            throw "Could not find button 'btnRun' on page!";
        }
        
        availableTests = window.document.getElementById('availableTests');
        if (!availableTests) {
            throw "Could not find div 'availableTests' on page!";
        }
        
        chkDebug = window.document.getElementById('chkDebug');
        if (!chkDebug) {
            throw "Could not find input 'chkDebug' on page!";
        }
        
        // Setup the test interface
        testInterface = new TestInterface();
        testInterface.initialize(this);
        
        // Get a reference to the frame via window.frames because we need them
        // both (the DOM method allows us to use the src property, which Safari
        // requires for relocation, but the window.frames method provides us
        // access to the script objects in that frame which we need to work
        // anywhere).  We can't just use window.frames['wndTest'] because it
        // doesn't work on Mozilla.
        for (var i = 0; i < window.frames.length; i++) {
            if (window.frames[i].location.href == wndTest.src) {
                frameTest = window.frames[i];
                break;
            }
        }
        if (!frameTest) {
            throw "Count not find corresponding frame for 'wndTest' on page!";
        }
               
        // Automatically build the list of available test suites given the
        // list provided in testSuiteUrls 
        for (var i = 0; i < testSuiteUrls.length; i++) {
            var div = window.document.createElement('div');
            div.id = 'testSuiteList_' + i;
            availableTests.appendChild(div);
            
            var checkbox = window.document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'testSuiteList_' + i + '_check';
            div.appendChild(checkbox);
            checkbox.checked = window.runAll;
            
            var label = window.document.createElement('label');
            label.id = 'testSuiteList_' + i + '_label';
            label.innerHTML = testSuiteUrls[i].replace('.aspx', '');
            label.htmlFor = checkbox.id;
            div.appendChild(label);
        }
        
        // Focus the "Run Tests" button by default
        btnRun.focus();
        
        // Cascade the debug flag if it was set in the querystring
        chkDebug.checked = window.debug;
        
        // Automatically run all the tests if querystring parameter was set
        if (window.runAll)
            this.runTests();
    }
    
    // selectAllTests either selects or deselects all of the tests in the
    // list of availableTests to make it quicker to do a full Test Pass
    this.selectAllTests = function(selected) {
        for (var i = 0; i < testSuiteUrls.length; i++) {
            var checkbox = window.document.getElementById(
                'testSuiteList_' + i + '_check');
            checkbox.checked = selected;
        }
        return false;
    }

    // The runTests function starts the Test Pass over the currently selected
    // list of Test Suites
    this.runTests = function() {
        // Determine if we're in debug mode
        debug = chkDebug.checked;
    
        // Determine which Test Suites were selected
        selectedTestSuiteUrls = [];
        for (var i = 0; i < testSuiteUrls.length; i++) {
            var checkbox = window.document.getElementById(
                'testSuiteList_' + i + '_check');
            if (checkbox.checked) {
                selectedTestSuiteUrls.push(testSuiteUrls[i] + "?t=" + (new Date()).getTime());
            }
        }

        // Prevent the user from running any more tests until we finish
        // with the test pass
        btnRun.disabled = true;
        
        // Show the test window (it is initially visible to make it work in
        // Safari, but from the first run and after it will be hidden on
        // completion of the test pass to provide the a better view of the
        // results)
        // TODO: Special case Safari so it starts hidden by default
        wndTest.style.display = 'block';  
        
        // Reset all of the reporting mechanisms for the test pass and then
        // start running the first Test Suite
        testInterface.startTestPass();
        
        // Start running the first test suite
        runNextTestSuite();
    }
    
    // Pulls the next Test Suite from the remaining list of selected Test
    // Suites and loads it into the test window (which causes it to start
    // executing)
    function runNextTestSuite() {
        if (selectedTestSuiteUrls.length > 0) {
            // Get the next Test Suite
            currentTestSuiteUrl = selectedTestSuiteUrls.shift();
            wndTest.src = currentTestSuiteUrl;
        } else {
            // Finish the report after we iterate through all Test Suites
            testInterface.finishTestPass();
            
            // Hide the test window to provide a better view of the test
            // results
            currentTestSuiteUrl = null;
            wndTest.src = 'about:blank';
            wndTest.style.display = 'none';

            // Allow the user to run tests again
            btnRun.disabled = false;
            btnRun.focus();
        }
    }
    
    // Create a new Test Case and add it to the list of remaining Test Cases
    this.addTest = function(testName) {
        var test = new TestCase();
        test.initialize(testName, this);
        testCases.push(test);
        return test;
    }
    
    this.registerTestFunction = function(func) {
        func.registrationID = registeredFunctions.length;
        registeredFunctions.push(func);
    }
    
    this.registerOnResumeFunction = function(func) {
        resumeFunctionRegistrationID = func.registrationID;
    }
    
    function reloadTestWindow() {
        wndTest.src = currentTestSuiteUrl;
    }
    
    // Determine all the necessary types have been loaded before processing the tests
    function isLoaded() {
        // Get the frame containing variable definitions in the child window
        var frame = getFrame();
        if (!frame) return false;
        
        // Check if the ASP.NET AJAX Runtime loaded (Sys.Application is the very last type defined)
        if (!frame.Sys || !frame.Sys.Application || !frame.Sys.Application.get_isInitialized()) {
            return false;
        }
        
        // Check the custom dependencies from the Test Suite
        var dependencies = frame.typeDependencies;
        if (dependencies) {
            for (var i = 0; i < dependencies.length; i++) {
                // Start by looking for objects in the child window
                var parent = frame;
                // Split the dependency into namespaces and member name to look up
                // (for example 'Sys.Application' -> ['Sys', 'Application']
                var names = dependencies[i].split(/\./);
                for (var j = 0; j < names.length; j++)
                {
                    // If the parent object (note that ASP.NET AJAX namespaces are objects)
                    // has a property with the name we want, then continue with it next
                    if (parent[names[j]]) { 
                        parent = parent[names[j]];
                    } else { 
                        return false;
                    }
                }
            }
        }
        
        // If everything was loaded, then we are ready to proceed with the tests
        return true;
    }
    
    // Expose whether or not we're in debug mode (which will cause exceptions to surface so that
    // you can attach a debugger)
    function getDebugMode() {
        return debug;
    }
    this.getDebugMode = getDebugMode;
    
    // Initialize a Test Suite and start executing its Test Cases (this is
    // called via the wndTest.onload handler after a short delay to allow
    // ASP.NET AJAX and control scripts to have loaded)
    this.initializeTestSuite = function() {
        // Ensure we have a Test Suite (as this function fires the first time
        // the page is loaded, even though no tests have been run yet)
        if (!currentTestSuiteUrl)
            return;
            
        if (waitIntervalID) {
            window.clearInterval(waitIntervalID);
            waitIntervalID = null;
        }
        
        // Wait unti everything has loaded before starting the tests
        if (!isLoaded()) { 
            window.setTimeout(arguments.callee, constants.InitialDelay);
            return;
        }

        if (resumeFunctionRegistrationID == -1 && currentTestCase == -1) {
            testInterface.startTestSuite(currentTestSuiteUrl);
        }
        
        testCases = [];
        registeredFunctions = [];

        // Get the frame that has access to the JavaScript declarations
        // (note that to get Safari working, you need to check wndTest first)
        var frame = getFrame();
        
        // Register the Test Cases of this Test Suite
        if (frame)
        {
            // Register the tests and start running the first
            // TestCase in the list that we generate
            if (!getDebugMode()) {
                try { 
                    frame.registerTests(testHarness);
                } catch (ex) {
                    fail('registerTests failure: ' + ex);
                    testInterface.finishTestSuite();
                    runNextTestSuite();
                    return;
                }            
            }
            else
            {
                frame.registerTests(testHarness);
            }
            runNextTestCase();
        }
        else
        {
            // If there is no RegisterTests method, then we display
            // an error and move on to the next Test Suite
            fail('No registerTests method defined');
            testInterface.finishTestSuite();
            runNextTestSuite();
        }        
    }
        
    // Pull the next Test Case from the remaining list of Test Cases and
    // execute the Test Case by continually polling for its completion
    function runNextTestCase() {
        if (resumeFunctionRegistrationID != -1) {
        
              // Execute the test
            
            if (!getDebugMode()) {   
                // Continue executing the test
                try {
                    var testCase = testCases[currentTestCase];
                    testCase.generate();
                    var nextStep = registeredFunctions[resumeFunctionRegistrationID];
                    nextStep();
                } catch (ex) {
                    fail(ex);
                } finally {
                    waitForTestCase();
                }
            }
            else {
                    // Continue executing the test
                try {
                    var testCase = testCases[currentTestCase];
                    testCase.generate();
                    var nextStep = registeredFunctions[resumeFunctionRegistrationID];
                    nextStep();
                } 
                finally {
                    waitForTestCase();
                }
            }
    
    
        }  else if (currentTestCase + 1 < testCases.length && testCases.length > 0) {
            // Get the next Test Case
            currentTestCase++;
            var testCase = testCases[currentTestCase];
            
            // Create report elements for this Test Case
            testInterface.startTestCase(testCase);
            
            // Execute the test
            if (!getDebugMode()) {            
                try {
                    // Start the TestCase and keep checking until it's finished
                    testCase.execute();
                } catch (ex) {
                    // Report any error
                    fail(ex);
                } finally {
                    waitForTestCase();
                }
            }
            else {
                try {
                    // Start the TestCase and keep checking until it's finished
                    testCase.execute();
                } finally {
                    waitForTestCase();
                }
            }
            
        } else {
            currentTestCase = -1;
        
            // Update the report status when the entire Test Suite is finsihed
            testInterface.finishTestSuite();
            
            // Start running the next Test Suite
            runNextTestSuite();
        }
    }
    
    // Wait for the currently executing Test Case to complete any asynchronous
    // operations (by checking its completed flag)
    function waitForTestCase() {
        var testCase = testCases[currentTestCase];
        if (testCase.getCompleted()) { 
            
            window.clearInterval(waitIntervalID);
            waitIntervalID = null;
            
            testInterface.finishTestCase(testCase);
            
            resumeFunctionRegistrationID = -1;
            if (currentTestCase < testCases.length) {
                reloadTestWindow();
            }
        
            // Move to the next test case when this one is finished
            // runNextTestCase();
            // inc the counter and reload the page
        } else if (!waitIntervalID) {
            waitIntervalID = window.setInterval(waitForTestCase, constants.PollingInterval);
        }
    }
    
    // Report a test cancellation 
    function cancel(message) {
        // Mark the test as an unknown
        var testCase = testCases[currentTestCase];
        if (testCase != null) {
            testCase.setResult(testCase.ResultType.Unknown);
            testCase.setCompleted(true);
        }
        
        testInterface.cancel(message);
    }
    
    this.cancel = cancel;
   
    // Report a failure message and update the report status accordingly
    function fail(message) {
        // Mark the test as a failure
        var testCase = testCases[currentTestCase];
        if (testCase != null) {
            testCase.setResult(testCase.ResultType.Failure);
            testCase.setCompleted(true);
        }
                
        testInterface.fail(message);
    }
    
    this.fail = fail;
    
    function getFrame() {
        if (wndTest.registerTests) { 
            return wndTest;
        } else if (frameTest.registerTests) {
            return frameTest;
        } else {
            return null;
        }
    }
    
    this.getWindow = function() {
        var frame = getFrame();
        if (frame && frame.window) {
            return frame.window;
        }
        return null;
    }
    
    this.getDocument = function() {
        var frame = getFrame();
        if (frame && frame.document) {
            return frame.document;
        }
        return null;
    }
    
    // Lookup an element and raise an error if it was not found
    this.getElement = function(id) {
        var element = null;
        var frame = getFrame();
        if (frame && frame.document && frame.document.getElementById) {
            element = frame.document.getElementById(id);
        }
        this.assertNotNull(element, "Could not find control '" + id + "'");
        return element;
    }
    
    // Lookup an ASP.NET AJAX object and raise an error if it was not found
    this.getObject = function(id) {
        var element = null;
        var frame = getFrame();
        if (frame && frame.Sys && frame.Sys.Application &&
            frame.Sys.Application.findComponent) {
            element = frame.Sys.Application.findComponent(id);
        }
        this.assertNotNull(element, "Could not find object '" + id + "'");
        return element;
    }
    
    // Fire the specified event from the given source
    this.fireEvent = function(element, eventName)
    {
        if (document.createEventObject)
        {
            element.fireEvent(eventName);
        }
        else if (document.createEvent)
        {
            var eType;
            
            if (eventName === "onclick" || eventName.indexOf("mouse") >= 0) {
                eType = "MouseEvents";
            }
            else if (eventName.indexOf("key") >= 0) {
                eType = "KeyEvents";
            }
            else {
                eType = "HTMLEvents";
            }
            
            var e = document.createEvent(eType);
            e.initEvent(eventName.replace(/^on/, ""), true, true);
            element.dispatchEvent(e);
        }
        else
        {
            throw "This browser does not support event firing";
        }
    }
    
    // Assert that the condition is true
    this.assertTrue = function(condition, message) {
        if (!condition)
            throw (message ? 'Assertion failed: ' + message
                : 'Assertion failed');
    }
   
    // Assert that the condition is false
    this.assertFalse = function(condition, message) {
        this.assertTrue(!condition, message);
    }
    
    // Assert that object a equals object b
    this.assertEqual = function(a, b, message) {
        this.assertTrue(a === b,
            (message ? message : a + ' should equal ' + b));
    }
    
    // Assert that object a is not equal to object b
    this.assertNotEqual = function(a, b, message) {
        this.assertTrue(a !== b,
            (message ? message : a + ' should not equal ' + b));
    }
    
    // Assert that the value is null
    this.assertNull = function(value, message) {
        this.assertEqual(value, null,
            (message ? message : value + ' should be null'));
    }
    
    // Assert that the value is not null
    this.assertNotNull = function(value, message) {
        this.assertNotEqual(value, null,
            (message ? message : 'Value should be not be null'));
    }
}

// The TestResults class wraps the result tracking mechanism so we can
// easily report the 
function TestResults() {
    var successes = 0;
    var failures = 0;
    var unknown = 0;
            
    this.getSuccesses = function() { return successes; };
    this.addSuccess = function() { successes++; };
    
    this.getFailures = function() { return failures; };
    this.addFailure = function() { failures++; };
    
    this.getUnknown = function() { return unknown; };
    this.addUnknown = function() { unknown++; };
    
    this.reset = function() {
        successes = 0;
        failures = 0;
        unknown = 0;
    }
}


Function.prototype.registrationID = -1;

// TestCase represents an individual unit test comprised of a series of steps
// to be executed.  TestCases are generated through a sequence of calls to
// addStep or addPostback and then combined via buildTest into a new function
// that can be executed.  The steps can be one of the following types:
//  - Sync: Perform a simple atomic action
//  - Async Wait: Perform a simple atomic action that initiates an asynchronous
//    operation, allow a specified wait duration to elapse, and then perform
//    an atomic verification action of the asynchronous operation
//  - Async Check: Peform a simple atomic action that initiates an asynchronous
//    operation, continue to check if the operation has completed at a
//    specified interval, and then perform an atomic verification action of the
//    asynchronous operation.  There is also a specified timeout that prevents
//    the completion check from running forever.
//  - Postback: Force a postback and resume the test at the next step
// The result of running the TestCase is either Success, Failure, or Unknown.
// Since some of the TestCase steps run asynchronously, the result of the
// execution might not be available immediately afterwards.  You should instead
// wait until the Completed property has been set to true before assuming the
// test has finsihed.  If a postback occurs, execution will begin at the start
// of the next step. 
function TestCase() {
    // The ResultType "enumeration" describes the result of the TestCase's
    // execution.  A value of Unknown signifies that the test was not able to
    // run properly in the current browser.
    this.ResultType = {
        'Success' : 0,
        'Failure' : 1,
        'Unknown' : 2
    };

    // The StepType "enumeration" defines the possible types of steps that we
    // can use to build the test case
    var StepType = {
        'Sync' : 0,
        'AsyncWait' : 1,
        'AsyncCheck' : 2,
        'PostBack' : 3
    };
    
    // Constant values
    var constants = {
        // Default timeout for checking the results of asynchronous operations
        // in AsyncCheck tests
        'DefaultTimeout' : 10000,
        // Default interval for checking the results of asynchronous operations
        // in AsyncCheck tests
        'DefaultInterval' : 100,
        // Function with an empty body used for overloads of addStep
        'DefaultFunction' : function() { }
    };
    
    // Reference to the TestHarness that is executing this TestCase so we can
    // access the interface as needed
    var harness = null;

    // Name of the TestCase
    var name = null;
    
    // Sequence of steps to be executed for this TestCase.  Each of the steps
    // is an object with a Type property that indicates step type and 
    // additional properties, such as Action, pertinent to that type of test.
    var steps = [];
    
    // Result of executing the test.  The test is considered a success unless a
    // failure or cancellation occurs.
    var result = this.ResultType.Success;
    
    // The completed flag is used to mark asynchronous tests complete.  Since
    // executing an asynchronous test will return before the test is actually
    // complete, callers should check this flag before querying the results of
    // the test or proceeding with the next test.
    var completed = false;
    
    var test = null;

    
    // Initialize the TestCase
    this.initialize = function(testName, testHarness) {
        name = testName;
        harness = testHarness;
    }
    
    // The isOverload function is a utility to determine whether or not the
    // function that called it is a valid overload by matching the list of
    // type names passed in as arguments to isOverload.
    function isOverload() {
        // Get the arguments passed to the function that called us
        // and the expected types of those arguments
        var args = arguments[0];
        var types = arguments;
        
        // Check if the number of arguments provided is the same number
        // of arguments desired
        if (args.length + 1 != types.length) {
            return false;
        }
        
        // For each argument, check if its type matches the desired type
        for (var i = 0; i < args.length; i++) {
            if (typeof(args[i]) != types[i + 1]) {
                return false;
            }
        }
        
        return true;
    }
    
    // The addStep function provides the interface for building up the TestCase
    // steps one at a time.  It is overloaded so that you can specify Sync,
    // AsyncWait, and AsyncCheck steps with optional parameters via this single
    // method.  The overloads are as follows:
    // 
    // - Sync: Perform a simple atomic action
    //   >> addStep(Action)
    //   ## Action: atomic action to perform
    //
    // - Async Wait: Perform a simple atomic action that initiates an
    //   asynchronous operation, allow a specified wait duration to elapse,
    //   and then perform an atomic verification action of the asynchronous
    //   operation
    //   >> addStep(Action, WaitDuration, Verification)
    //   >> addStep(Action, WaitDuration)
    //   ## Action: atomic action to perform
    //   ## WaitDuration: length of time to wait after the action
    //   ## Verification: atomic action to perform after the wait duration has
    //      elapsed
    // 
    // - Async Check: Peform a simple atomic action that initiates an
    //   asynchronous operation, continue to check if the operation has
    //   completed at a specified interval, and then perform an atomic
    //   verification action of the asynchronous operation.  There is also a
    //   specified timeout that prevents the completion check from running
    //   forever.
    //   >> addStep(Action, CheckComplete, Interval, Timeout, Verification)
    //   >> addStep(Action, CheckComplete)
    //   >> addStep(Action, CheckComplete, Interval)
    //   >> addStep(Action, CheckComplete, Verification)
    //   >> addStep(Action, CheckComplete, Interval, Verification)
    //   >> addStep(Action, CheckComplete, Interval, Timeout)
    //   ## Action: atomic action to perform
    //   ## CheckComplete: atomic predicate to determine if the result of the
    //      action has been obtained
    //   ## Interval: interval to keep invoking the CheckComplete predicate to
    //      see if the result has been obtained
    //   ## Timeout: maximum length of time to keep checking for completion
    //      before giving up and throwing an error
    //   ## Verification: atomic action to perform after the completion check
    //      has returned true
    //
    // Default values from the constants object are used for overloads with
    // optional parameters.
    this.addStep = function() {
        // Create an object to represent the step
        var step = {};
        step.Type = null;

        // Determine the type of step to create based on the number and type of
        // the provided arguments
        var a = arguments;
        var func = 'function';
        var num = 'number';
        if (isOverload(arguments, func)) {
            // addStep(Action)
            step.Type = StepType.Sync;
            step.Action = a[0];
        } else if (isOverload(arguments, func, num)) {
            // addStep(Action, WaitDuration)
            step.Type = StepType.AsyncWait;
            step.Action = a[0];
            step.WaitDuration = a[1];
            step.Verification = constants.DefaultFunction;
        } else if (isOverload(arguments, func, func)) {
            // addStep(Action, CheckComplete)
            step.Type = StepType.AsyncCheck;
            step.Action = a[0];
            step.CheckComplete = a[1];
            step.Interval = constants.DefaultInterval;
            step.Timeout = constants.DefaultTimeout;
            step.Verification = constants.DefaultFunction;
        } else if (isOverload(arguments, func, num, func)) {
            // addStep(Action, WaitDuration, Verification)
            step.Type = StepType.AsyncWait;
            step.Action = a[0];
            step.WaitDuration = a[1];
            step.Verification = a[2];
        } else if (isOverload(arguments, func, func, func)) {
            // addStep(Action, CheckComplete, Verification)
            step.Type = StepType.AsyncCheck;
            step.Action = a[0];
            step.CheckComplete = a[1];
            step.Interval = constants.DefaultInterval;
            step.Timeout = constants.DefaultTimeout;
            step.Verification = a[2];
        } else if (isOverload(arguments, func, func, num)) {
            // addStep(Action, CheckComplete, Interval)
            step.Type = StepType.AsyncCheck;
            step.Action = a[0];
            step.CheckComplete = a[1];
            step.Interval = a[2];
            step.Timeout = constants.DefaultTimeout;
            step.Verification = constants.DefaultFunction;
        } else if (isOverload(arguments, func, func, num, func)) {
            // addStep(Action, CheckComplete, Interval, Verification)
            step.Type = StepType.AsyncCheck;
            step.Action = a[0];
            step.CheckComplete = a[1];
            step.Interval = a[2];
            step.Timeout = constants.DefaultTimeout;
            step.Verification = arguments[3];
        } else if (isOverload(arguments, func, func, num, num)) {
            // addStep(Action, CheckComplete, Interval, Timeout)
            step.Type = StepType.AsyncCheck;
            step.Action = a[0];
            step.CheckComplete = a[1];
            step.Interval = a[2];
            step.Timeout = a[3];
            step.Verification = constants.DefaultFunction;
        } else if (isOverload(arguments, func, func, num, num, func)) {
            // addStep(Action, CheckComplete, Interval, Timeout, Verification)
            step.Type = StepType.AsyncCheck;
            step.Action = a[0];
            step.CheckComplete = a[1];
            step.Interval = a[2];
            step.Timeout = a[3];
            step.Verification = a[4];
        } else {
            var message = 'No matching overload found for addStep(';
            for (var i = 0; i < arguments.length; i++) {
                message += typeof(arguments[i]);
                if (i < arguments.length - 1) {
                    message += ', ';
                }
            }
            message += ') - step ' + (steps.length + 1) + ' of ' + name;
            throw message;
        }

        // Add the step to the end of the list
        steps.push(step);
    }
    
    // The addPostBack function creates a step that will be used to force a
    // postback and resume the test at the beginning of the next step.  It
    // optionally takes a reference to an element that will be used to force
    // a postback (via an element.click(); function).  If no element is 
    // provided, we then submit the first form in the window.forms array to
    // force the postback.
    this.addPostBack = function(element) {
        // Create the postback step and add it to the end of the list
        var step = {};
        step.Type = StepType.PostBack;
        step.Element = element;
        steps.push(step);
    }
    
    this.generate = function() {
            test = buildTest(steps);
    }
    
    // The execute function is used to build the test from the sequence of
    // steps and then execute the resulting function.
    this.execute = function() {
        // Build the test if we haven't already
        if (!test) {
            this.generate();
        }
        test();
    }
    
    // Report a failure
    function fail(message) {
        harness.fail('Step ' + currentStep + ': ' + message);
    }
    
    function debugInvoke(func) {
        return func();
    }
    
    function safeInvoke(func) {
        try {
            return func();
        }
        catch (ex) {
            fail(ex);
            return null;
        }
    }
    
    // The buildTest method is the heart of the TestCase functionality.  It is
    // used to turn the array of steps into an executable function that
    // performs the operations described by the test steps.  It builds up the
    // test function in reverse order.
    // 
    // TODO: Ensure error handling is comprehensive
    function buildTest(steps, last) {
    
        if (!last) {
            last = function() { currentStep = steps.length + 1; completed = true; };
            harness.registerTestFunction(last);
        }
    
        if (steps.length == 0) {
            // Write the initialization of the test
            return function() {
                completed = false;
                currentStep = 0;
                last();
            };
        }
        
        var step = steps.pop();
        var test = null;
        var invoke;
        
         if (!harness.getDebugMode()) {
            invoke = safeInvoke;
         }
         else {
            invoke = debugInvoke;
         }
        
        switch (step.Type)
        {
            case StepType.Sync :
                // AddStep(Action)
                test = function() {
                    if (!completed) {
                        harness.registerOnResumeFunction(last);
                        currentStep = steps.length + 1;
                        invoke(step.Action);
                        last();
                    }
                };
                break;
            case StepType.AsyncWait :
                // AddStep(Action, WaitDuration, Verification)
                test = function() {
                    if (!completed) {
                        harness.registerOnResumeFunction(last);
                        currentStep = steps.length + 1;
                        invoke(step.Action);
                        var f = function() {
                            if (!completed) {
                                invoke(step.Verification);
                                last();
                            }
                        };
                        window.setTimeout(f, step.WaitDuration);
                    }
                };
                break;
            case StepType.AsyncCheck :
                // AddStep(Action, CheckComplete, Interval, Timeout, Verification)
                test = function() {
                    if (!completed) {
                        harness.registerOnResumeFunction(last);
                        currentStep = steps.length + 1;
                        invoke(step.Action);
                        var remaining = step.Timeout;
                        var f = function() {
                            remaining -= step.Interval;
                            if (!invoke(step.CheckComplete) && remaining > 0) {
                                if (!completed) {
                                    window.setTimeout(f, step.Interval);
                                }
                                return;
                            } else if (remaining <= 0) {
                                fail('Timeout exceeded');
                            }
                            if (!completed) {
                                invoke(step.Verification);
                                last();
                            }
                        };
                        window.setTimeout(f, step.Interval);
                    }
                };
                break;
            case StepType.PostBack :
                if (step.Element) {
                    test = function() {
                        if (!completed) {
                            harness.registerOnResumeFunction(last);
                            currentStep = steps.length + 1;
                            if (step.Element.click) {
                                // calling safeInvoke here would blow up Firefox
                                step.Element.click();
                            } else if (step.Element.submit) {
                                // calling safeInvoke here would blow up Firefox
                                step.Element.submit();
                            } else if (window && window.forms &&
                                window.forms[0] && window.forms[0].submit) {
                                // calling safeInvoke here would blow up Firefox
                                window.forms[0].submit();
                            } else {
                                fail('Unable to force a postback');
                            }
                        }
                    };
                } else {
                    test = function() {
                        if (!completed) {
                            harness.registerOnResumeFunction(last);
                            currentStep = steps.length + 1;
                            if (window && window.forms &&
                                window.forms[0] && window.forms[0].submit) {
                                // calling safeInvoke here would blow up Firefox
                                window.forms[0].submit();
                            } else {
                                fail('Unable to force a postback');
                            }
                        }
                    };
                }
                break;
            default :
                test = last;
                break;
        }
        
        if (test != last) {
            harness.registerTestFunction(test);
        }
        
        return buildTest(steps, test);
    }
    
    // The Completed property is a flag used to determine whether or not an 
    // asynchronous test has fully completed its execution
    this.getCompleted = function() { return completed; };
    this.setCompleted = function(value) { completed = value; };
    
    // The Name of the TestCase
    this.getName = function() { return name; };
    this.setName = function(value) { name = value; };
    
    // The Result of the TestCase
    this.getResult = function() { return result; };
    this.setResult = function(value) { result = value; };
}

// The TestInterface contains all the logic used to 
function TestInterface() {
    var harness = null;
    
    var totalResults = null;
    var suiteResults = null;
    
    // References to controls in the page
    var results = null;         // div containing the results of the test run
    var status = null;          // div describing the status of the test run
    var statusPassed = null;    // span with the number of passed tests
    var statusFailed = null;    // span with the number of failed tests
    var statusUnknown = null;   // span with the number of unknown test results
    
    // References to dynamically generated UI elements that are used to report
    // the detailed results of the test run.  These variables are references to
    // the elements for the currently executing Test Cases and Test Suites, and
    // are set to new values as we iterate through lists of each.
    var testSuiteDiv = null;      // div for the currently executing Test Suite
    var testSuiteHeaderDiv = null;// div for the name of the current Test Suite
    var testCaseDiv = null;       // div for the currently executing Test Case
    var testCaseHeaderDiv = null; // div for the name of the current Test Case

    // Initialize the interface
    this.initialize = function(testHarness) {
        harness = testHarness;
        
        totalResults = new TestResults();
        suiteResults = new TestResults();
    
        results = window.document.getElementById('results');
        if (!results) {
            throw "Could not find div 'results' on page!";
        }
        
        status = window.document.getElementById('status');
        if (!status) {
            throw "Could not find div 'status' on page!";
        }
        
        statusPassed = window.document.getElementById('statusPassed');
        if (!statusPassed) {
            throw "Could not find span 'statusPassed' on page!";
        }
        
        statusFailed = window.document.getElementById('statusFailed');
        if (!statusFailed) {
            throw "Could not find span 'statusFailed' on page!";
        }
        
        statusUnknown = window.document.getElementById('statusUnknown');
        if (!statusUnknown) {
            throw "Could not find span 'statusUnknown' on page!";
        }
    }
    
    this.startTestPass = function() {
        // Clear the current test results
        for (var i = results.childNodes.length - 1; i >= 0; i--)
            results.removeChild(results.childNodes[i]);
        
        // Reset the total result tracking
        totalResults.reset();
    
        // Reset the status indicator panel
        statusPassed.innerHTML = "0";
        statusPassed.style.color = harness.Constants.SuccessForeColor;
        statusFailed.innerHTML = "0";
        statusFailed.style.color = harness.Constants.FailureForeColor;
        statusUnknown.innerHTML = "0";
        statusUnknown.style.color = harness.Constants.UnknownForeColor;
        status.style.backgroundColor = 'white';
        status.style.display = 'block';
    }
    
    this.finishTestPass = function() {
        // Update the status mechanisms with numbers and background colors
        this.updateResults();
        
        var backColor;
        if (totalResults.getFailures() > 0) {
            backColor = harness.Constants.FailureBackColor;
        } else if (totalResults.getUnknown() > 0) {
            backColor = harness.Constants.UnknownBackColor;
        } else if (totalResults.getSuccesses() > 0) {
            backColor = harness.Constants.SuccessBackColor;
        }
        status.style.backgroundColor = backColor;
    }
    
    this.updateResults = function() {
        // Update the status counters
        statusPassed.innerHTML = totalResults.getSuccesses();
        statusFailed.innerHTML = totalResults.getFailures();
        statusUnknown.innerHTML = totalResults.getUnknown();
    
        // Change the colors of the current Test Suite or the status indicator
        // panel as soon as any failure occurs
        if (testSuiteHeaderDiv && suiteResults.getFailures() > 0) {
            testSuiteHeaderDiv.style.backgroundColor =
                harness.Constants.FailureBackColor;
        }
        if (totalResults.getFailures() > 0) {
            status.style.backgroundColor =
                harness.Constants.FailureBackColor;
        }    
    }
    
    this.startTestSuite = function(url) {
        suiteResults.reset();
        writeTestSuite(url);
    }
    
    this.finishTestSuite = function() {
        this.updateResults();
    
        var backColor;
        if (suiteResults.getFailures() > 0) {
            backColor = harness.Constants.FailureBackColor;
        } else if (suiteResults.getUnknown() > 0) {
            backColor = harness.Constants.UnknownBackColor;
        } else if (suiteResults.getSuccesses() > 0) {
            backColor = harness.Constants.SuccessBackColor;
        }
        testSuiteHeaderDiv.style.backgroundColor = backColor;
        
        testSuiteDiv = null;
        testSuiteHeaderDiv = null;
    }
    
    this.startTestCase = function(testCase) {
        writeTestCase(testCase);
    }
    
    this.finishTestCase = function(testCase) {
        if (!testCaseHeaderDiv || !testCase) {
            return;
        }
    
        // Mark the test as a success if it didn't fail or cancel
        switch (testCase.getResult()) {
            case testCase.ResultType.Success :
                suiteResults.addSuccess();
                totalResults.addSuccess();
                testCaseHeaderDiv.style.color =
                    harness.Constants.SuccessForeColor;
                this.updateResults();
                break;
            case testCase.ResultType.Failure :
                testCaseHeaderDiv.style.color =
                    harness.Constants.FailureForeColor;
                break;
            case testCase.ResultType.Unknown :
            default :
                testCaseHeaderDiv.style.color =
                    harness.Constants.UnknownForeColor;
                break;
        }
        
        
        // Wipe the report elements for previous test cases
        testCaseDiv = null;
        testCaseHeaderDiv = null;
     }
    
    // writeTestSuite generates the report elements for the currently
    // executing Test Suite
    function writeTestSuite(url) {
        // Create the Test Suite's container
        testSuiteDiv = window.document.createElement("div");
        testSuiteDiv.className = 'testSuite';
        results.appendChild(testSuiteDiv);
        
        // Create the Test Suite's header
        testSuiteHeaderDiv = window.document.createElement("div");
        testSuiteHeaderDiv.className = 'testSuiteHeader';
        testSuiteHeaderDiv.innerHTML = url.replace('.aspx', '').replace(/\?t=(.*)/g,'');
        testSuiteDiv.appendChild(testSuiteHeaderDiv);
        
        // Wipe the report elements for any previous Test Case
        testCaseDiv = null;
        testCaseHeaderDiv = null;
    }
    
    // writeTestCase generates the report elements for the currently
    // executing Test Case
    function writeTestCase(testCase) {
        // Create the Test Cases's container
        testCaseDiv = window.document.createElement("div");
        testCaseDiv.className = 'testCase';
        testSuiteDiv.appendChild(testCaseDiv);
        
        // Create the Test Cases's header
        testCaseHeaderDiv = window.document.createElement("div");
        testCaseHeaderDiv.className = 'testCaseHeader';
        testCaseHeaderDiv.innerHTML = testCase.getName();
        testCaseDiv.appendChild(testCaseHeaderDiv);
    }
    
    // Write a message under the current Test Suite or Test Case, and
    // optionally provide fore and back colors for the message
    this.write = function(message, foreColor, backColor) {
        // Create the message
        var div = window.document.createElement("div");
        div.innerHTML = message;
        if (foreColor) {
            div.style.color = foreColor;
        }
        if (backColor) {
            div.style.backgroundColor = backColor;
        }
        
        // Place it in the deepest nested scope possible
        if (testCaseDiv) {
            div.className = 'testCaseMessage';
            testCaseDiv.appendChild(div);
        } else if (testSuiteDiv) {
            div.className = 'testSuiteMessage';
            testSuiteDiv.appendChild(div);
        } else {
            div.className = 'testSuiteMessage';
            results.appendChild(div);
        }
    }
    
    this.fail = function(message) {
        suiteResults.addFailure();
        totalResults.addFailure();
        this.write(message ? message : "Test failure",
            harness.Constants.FailureForeColor, null);
        
    }
    
    this.cancel = function(message) {
        suiteResults.addUnknown();
        totalResults.addUnknown();
        this.write(message ? message : "Test cancelled");
    }
}

// Create a global Test Harness used to load and execute the selected test
// suites (we use this instance to wireup events in TestHarness.aspx)
var testHarness = new TestHarness();
