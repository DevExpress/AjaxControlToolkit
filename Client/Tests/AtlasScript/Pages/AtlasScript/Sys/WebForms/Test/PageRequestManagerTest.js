/// <reference name="MicrosoftAjax.js"/>
/// <reference name="MicrosoftAjaxWebForms.js"/>
/// <reference path="..\..\..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("Sys.WebForms.Test");

Sys.WebForms.Test.PageRequestManagerTest = function() {

    this.setUp = function() {
        Sys.WebForms.PageRequestManager._instance = null;
    }

    this.tearDown = function() {
        Sys.WebForms.PageRequestManager._instance = null;
        if (this.oldRequest) {
            Sys.Net.WebRequest = this.oldRequest;
            this.oldRequest = null;
        }
        if (this.oldValidate) {
            window.Page_ClientValidate = this.oldValidate;
            this.oldValidate = null;
        }
    }

    this.getMockWebRequest = function() {
        return function() {
            Sys.Net.WebRequest.invoked = false;
            Sys.Net.WebRequest.aborted = false;
            Sys.Net.WebRequest.url = "notset";
            this._executor = null;

            this.get_body = function() {
                return Sys.Net.WebRequest.body;
            }
            this.set_body = function(value) {
                Sys.Net.WebRequest.body = value;
            }
            this.set_timeout = function() { };
            this.get_headers = function() { return []; };

            this.add_completed = function(handler) {
                Sys.Net.WebRequest.completed = handler;
            };
            this.get_executor = function() {
                return this._executor;
            };

            this.set_url = function(url) {
                Sys.Net.WebRequest.url = url;
            };
            this.invoke = function() {
                Sys.Net.WebRequest.invoked = true;
                var executorType = eval(Sys.Net.WebRequestManager._defaultExecutorType);
                var executor = new executorType();
                executor._set_webRequest(this);
                executor.abort = this.abort;
                this._executor = executor;
            };
            this.abort = function() {
                Sys.Net.WebRequest.aborted = true;
            };
        }
    }

    this.testCannotInitializeTwice = function() {
        var formElement = document.createElement('form');
        Sys.WebForms.PageRequestManager._initialize("sm1", formElement);
        Sys.WebForms.PageRequestManager._initialize("sm1", formElement);
    }
    this.testCannotInitializeTwice["AtlasUnit.ExpectedException"] = {
        name: "Sys.InvalidOperationException"
    }

    this.testCancelPostBackFromInitializeRequest = function() {
        this.oldRequest = Sys.Net.WebRequest;
        Sys.Net.WebRequest = this.getMockWebRequest();
        function cancelRequest(sender, args) {
            args.set_cancel(true);
        }

        var formElement = document.createElement('form');
        Sys.WebForms.PageRequestManager._initialize("sm1", formElement);
        var prm = Sys.WebForms.PageRequestManager.getInstance();
        prm._postBackSettings = { async: true, sourceElement: document.createElement('INPUT'), panelsToUpdate: null, asyncTarget: null };

        prm.add_initializeRequest(cancelRequest);
        prm._onFormSubmit();
        AtlasUnit.Assert.isFalse(Sys.Net.WebRequest.invoked);

        prm.remove_initializeRequest(cancelRequest);
        delete prm;
    },

    this.testBeginAsyncPostBack = function() {
        this.oldRequest = Sys.Net.WebRequest;
        this.oldValidate = window.Page_ClientValidate;
        var validationGroup = null, validationResult = true;
        Sys.Net.WebRequest = this.getMockWebRequest();
        window.Page_ClientValidate = function(group) {
            validationGroup = group;
            return validationResult;
        }
        var modify = true, sender = null, updating = null, args = null;
        function initRequest(s, a) {
            sender = s;
            args = a;
            updating = a.get_updatePanelsToUpdate();
            if (modify) {
                var newList = Array.clone(a.get_updatePanelsToUpdate());
                newList.push("modified1", "modified2");
                a.set_updatePanelsToUpdate(newList);
            }
        }

        var formElement = document.createElement('form');
        formElement.__EVENTTARGET = {};
        formElement.__EVENTARGUMENT = {};
        Sys.WebForms.PageRequestManager._initialize("sm1", formElement);
        var prm = Sys.WebForms.PageRequestManager.getInstance();
        prm._updateControls(['tUP1', 'c1', 'fNC1$UP2', 'c2'], [], [], 0, true);
        prm.add_initializeRequest(initRequest);
        prm.beginAsyncPostBack(["c1", "NC1$UP2"]);
        AtlasUnit.Assert.isNotNull(sender, "initializeRequest event expected.");
        AtlasUnit.Assert.elementsEqual(["c1", "NC1$UP2"], updating, "updatePanelsToUpdate not given in event args.");
        // the 'c1' updatepanel is its ClientID. It should be converted to UniqueID when put into the form body (UP1)
        // modified1+modified2 ensure the init request handler modified the update panels to update and it took effect
        AtlasUnit.Assert.isTrue(Sys.Net.WebRequest.body.startsWith("sm1=UP1%2CNC1%24UP2%2Cmodified1%2Cmodified2&"), "form body should reflect modified update panel array and be uri component encoded. body = " + Sys.Net.WebRequest.body);
        AtlasUnit.Assert.isTrue(Sys.Net.WebRequest.invoked, "Request should have been invoked.");

        // with validation and eventtarget/arg
        Sys.Net.WebRequest.invoked = false;
        modify = false;
        prm.beginAsyncPostBack(null, "target", "arg", true, "a");
        AtlasUnit.Assert.elementsEqual([], updating, "Empty array expected when no update panels updating.");
        AtlasUnit.Assert.isTrue(Sys.Net.WebRequest.body.startsWith("sm1=sm1%7Ctarget"), "ScriptManager's ID should be used when no update panel to update. body = " + Sys.Net.WebRequest.body);
        AtlasUnit.Assert.areEqual("target", formElement.__EVENTTARGET.value);
        AtlasUnit.Assert.areEqual("arg", formElement.__EVENTARGUMENT.value);
        AtlasUnit.Assert.areEqual("a", validationGroup);
        AtlasUnit.Assert.isTrue(Sys.Net.WebRequest.invoked, "Request should have been invoked (with eventtarget/arg).");

        // validation cancels it
        validationResult = false;
        Sys.Net.WebRequest.invoked = false;
        prm.beginAsyncPostBack(null, "target", "arg", true, "a");
        AtlasUnit.Assert.isFalse(Sys.Net.WebRequest.invoked, "Request should NOT have been invoked (with validation result false).");

        prm.dispose();
    },

    this.testPostBackThenPostBack = function() {
        // scenario: An async postback begins, and then before the response is received another
        // begins, and then the 1st response is received.
        this.oldRequest = Sys.Net.WebRequest;
        Sys.Net.WebRequest = this.getMockWebRequest();

        var formElement = document.createElement('form');
        formElement.action = "foo.aspx?1";
        Sys.WebForms.PageRequestManager._initialize("sm1", formElement);
        var prm = Sys.WebForms.PageRequestManager.getInstance();
        prm._postBackSettings = { async: true, sourceElement: document.createElement('INPUT') };

        // begin post #1
        prm._onFormSubmit();
        AtlasUnit.Assert.isTrue(Sys.Net.WebRequest.invoked);
        Sys.Net.WebRequest.invoked = false;
        AtlasUnit.Assert.areNotEqual(-1, Sys.Net.WebRequest.url.indexOf("foo.aspx?1"));
        var r1 = prm._request;
        var e1 = r1.get_executor();
        e1.abort = r1.abort;

        // begin post #2 before post #1 response is received
        formElement.action = "foo.aspx?2";
        prm._onFormSubmit();
        AtlasUnit.Assert.isTrue(Sys.Net.WebRequest.aborted, "2nd Post should abort the 1st.");
        AtlasUnit.Assert.isTrue(Sys.Net.WebRequest.invoked);
        Sys.Net.WebRequest.invoked = false;
        AtlasUnit.Assert.areNotEqual(-1, Sys.Net.WebRequest.url.indexOf("foo.aspx?2"));
        var r2 = prm._request;
        AtlasUnit.Assert.areNotEqual(r1, r2, "2nd Post should start a new request.");

        // if post #1 responds it should be ignored
        e1.get_statusCode = function() {
            AtlasUnit.Assert.fail("First response should be ignored.")
        };
        prm._onFormSubmitCompleted(e1, null);
    },

    this.testPostBackThenResponseThenPostBack = function() {
        // scenario: An async postback begins, and then the response is received,
        // and then another async postback begins before scripts are loaded from the first
        this.oldRequest = Sys.Net.WebRequest;
        Sys.Net.WebRequest = this.getMockWebRequest();

        var formElement = document.createElement('form');
        formElement.action = "foo.aspx?1";
        Sys.WebForms.PageRequestManager._initialize("sm1", formElement);
        var prm = Sys.WebForms.PageRequestManager.getInstance();
        prm._postBackSettings = { async: true, sourceElement: document.createElement('INPUT') };

        // begin post #1
        prm._onFormSubmit();
        AtlasUnit.Assert.isTrue(Sys.Net.WebRequest.invoked);
        Sys.Net.WebRequest.invoked = false;
        AtlasUnit.Assert.areNotEqual(-1, Sys.Net.WebRequest.url.indexOf("foo.aspx?1"));
        var r1 = prm._request;
        var e1 = r1.get_executor();
        e1.abort = r1.abort;

        // post #1 responds with a script reference
        e1.get_responseData = function() {
            return "6|scriptBlock|ScriptPath|foo.js|";
        };
        e1.get_statusCode = function() { return 200; };
        var scriptLoader = Sys._ScriptLoader.getInstance();
        var oldLoadScripts = scriptLoader.loadScripts;
        var scripts = null;
        var callback = null;
        scriptLoader.loadScripts = function(timeout, completedCallback) {
            scripts = this._scriptsToLoad;
            callback = completedCallback;
            this._scriptsToLoad = null;
        }

        try {
            prm._onFormSubmitCompleted(e1, null);
            AtlasUnit.Assert.isNotNull(scripts, "ScriptLoader should be loading scripts now.");
            AtlasUnit.Assert.areEqual(1, scripts.length, "ScriptLoader should be loading only foo.js.");
            AtlasUnit.Assert.areEqual("foo.js", scripts[0].src, "ScriptLoader should be loading foo.js.");

            // begin post #2 before post #1 scripts downloaded
            prm._onFormSubmit();
            AtlasUnit.Assert.isFalse(Sys.Net.WebRequest.aborted, "2nd Post should NOT abort the 1st because it already responded.");
            AtlasUnit.Assert.isTrue(Sys.Net.WebRequest.invoked);
            Sys.Net.WebRequest.invoked = false;
            var r2 = prm._request;

            // when scripts finish loading, response should be ignored
            // (it should not commit controls and update the DOM)
            var oldCommitControls = prm._commitControls;
            prm._commitControls = function() {
                AtlasUnit.Assert.fail("1st Post Response should be ignored if 2nd started while loading scripts.");
            };
            try {
                callback(scriptLoader);
            }
            finally {
                prm._commitControls = oldCommitControls;
            }

            // finally, aborting should abort the 2nd postback
            prm.abortPostBack();
            AtlasUnit.Assert.isTrue(Sys.Net.WebRequest.aborted, "abortPostBack should abort the 2nd Post.");
        }
        finally {
            scriptLoader.loadScripts = oldLoadScripts;
        }
    },

    this.testCallbacks = function() {
        AtlasUnit.Assert.isTrue(typeof (window.WebForm_DoCallback) === "function", "This test requires the WebForm.js script to be included.");

        this.oldRequest = Sys.Net.WebRequest;
        var oldPendingCallbacks = window.__pendingCallbacks;
        var oldDoCallback = window.WebForm_DoCallback;
        var oldSyncCallbackIndex = window.__synchronousCallBackIndex;
        var doCallbackCalled = false;
        var pendingCallbacks = [];

        function TestDoCallback(expected) {
            if (!expected) {
                AtlasUnit.Assert.fail("WebForm_DoCallback should not be allowed during async postbacks.");
            }
            else {
                doCallbackCalled = true;
            }
        }

        try {
            window.__pendingCallbacks = pendingCallbacks;
            window.WebForm_DoCallback = TestDoCallback;

            Sys.Net.WebRequest = this.getMockWebRequest();

            var formElement = document.createElement('form');
            Sys.WebForms.PageRequestManager._initialize("sm1", formElement);
            var prm = Sys.WebForms.PageRequestManager.getInstance();

            AtlasUnit.Assert.areEqual(prm._originalDoCallback, TestDoCallback, "PRM did not attach to the window.WebForm_DoCallback function.");

            prm._postBackSettings = { async: true, sourceElement: document.createElement('INPUT') };

            // simulate some async callbacks
            pendingCallbacks[0] = { async: true };
            pendingCallbacks[1] = { async: true };
            pendingCallbacks[2] = { async: true };
            // simulate sync callback
            pendingCallbacks[3] = { async: false };
            window.__synchronousCallBackIndex = 3;
            // simulate async callbacks after sync
            pendingCallbacks[4] = { async: true };
            // simulate a callback that requires an IFRAME
            var callbackFrame = document.createElement("div");
            callbackFrame.id = "__CALLBACKFRAME4";
            callbackFrame.style.display = "none";
            document.body.appendChild(callbackFrame);
            var callbackFrameParent = callbackFrame.parentNode;
            // simulate a callback slot that is null because it already completed
            pendingCallbacks[5] = null;

            prm._onFormSubmit();
            for (var i = 0; i < pendingCallbacks.length; i++) {
                AtlasUnit.Assert.isNull(pendingCallbacks[i], "Pending callbacks were not cancelled");
            }
            AtlasUnit.Assert.areEqual(-1, window.__synchronousCallBackIndex, "Sync callback index was not reset");
            AtlasUnit.Assert.areNotEqual(callbackFrameParent, callbackFrame.parentNode, "IFRAMEs for pending callbacks should be removed from the DOM");

            // ensure new callbacks are ignored
            WebForm_DoCallback(false);

            // ensure new callbacks are again allowed after completion
            prm._request = null;
            WebForm_DoCallback(true);
            AtlasUnit.Assert.isTrue(doCallbackCalled, "Pending callbacks should allowed again after an async postback completes");
            delete prm;
        }
        finally {
            window.WebForm_DoCallback = oldDoCallback;
            window.__pendingCallbacks = oldPendingCallbacks;
            window.__synchronousCallBackIndex = oldSyncCallbackIndex;
        }
    },


    this.testDispose = function() {
        var formElement = document.createElement('form');
        var oldDoPostback = window._doPostBack;
        var oldDoPostbackWithOptions = window.WebForm_DoPostBackWithOptions;
        var oldFireDefaultButton = window.WebForm_FireDefaultButton;
        var oldDoCallback = window.WebForm_DoCallback;

        try {
            var ref = {};
            window._doPostBack = ref;
            window.WebForm_DoPostBackWithOptions = ref;
            window.WebForm_FireDefaultButton = ref;
            window.WebForm_DoCallback = ref;

            Sys.WebForms.PageRequestManager._initialize("sm1", formElement);
            var prm = Sys.WebForms.PageRequestManager.getInstance();
            prm.dispose();

            AtlasUnit.Assert.areEqual(ref, window._doPostBack, "_doPostBack not restored");
            AtlasUnit.Assert.areEqual(ref, window.WebForm_DoPostBackWithOptions, "WebForm_DoPostBackWithOptions not restored");
            AtlasUnit.Assert.areEqual(ref, window.WebForm_FireDefaultButton, "WebForm_FireDefaultButton not restored");
            AtlasUnit.Assert.areEqual(ref, window.WebForm_DoCallback, "WebForm_DoCallback not restored");
        }
        finally {
            window._doPostBack = oldDoPostback;
            window.WebForm_DoPostBackWithOptions = oldDoPostbackWithOptions;
            window.WebForm_FireDefaultButton = oldFireDefaultButton;
            window.WebForm_DoCallback = oldDoCallback;
        }
    },

    this.testRegisterArrayDeclarations = function() {
        try {
            window._testArray = [1];
            AtlasUnit.Assert.elementsEqual([1], window._testArray);

            Sys.WebForms.PageRequestManager._addArrayElement("_testArray", 2);
            AtlasUnit.Assert.elementsEqual([1, 2], window._testArray);

            Sys.WebForms.PageRequestManager._addArrayElement("_testArray", 3, 4, null);
            AtlasUnit.Assert.elementsEqual([1, 2, 3, 4, null], window._testArray);

            Sys.WebForms.PageRequestManager._addArrayElement("_testArray", null);
            AtlasUnit.Assert.elementsEqual([1, 2, 3, 4, null, null], window._testArray);

            Sys.WebForms.PageRequestManager._addArrayElement("_testArray", "foo", 5, "");
            AtlasUnit.Assert.elementsEqual([1, 2, 3, 4, null, null, "foo", 5, ""], window._testArray);

            window._testArray = null;
            Sys.WebForms.PageRequestManager._addArrayElement("_testArray", 6);
            AtlasUnit.Assert.elementsEqual([6], window._testArray);

            window._testArray = undefined;
            Sys.WebForms.PageRequestManager._addArrayElement("_testArray", 7);
            AtlasUnit.Assert.elementsEqual([7], window._testArray);
        }
        finally {
            window._testArray = undefined;
        }
    },

    this.testUpdateControlsWithEmptyValues = function() {
        // Test with empty values
        var formElement = document.createElement('form');
        Sys.WebForms.PageRequestManager._initialize("sm1", formElement);
        var prm = Sys.WebForms.PageRequestManager.getInstance();

        prm._updateControls([], [], [], 0);

        function verifyEmpty() {
            AtlasUnit.Assert.elementsEqual([], prm._updatePanelIDs, "UpdatePanels do not match (2)");
            AtlasUnit.Assert.elementsEqual([], prm._updatePanelClientIDs, "UpdatePanel client IDs do not match (2)");
            AtlasUnit.Assert.elementsEqual([], prm._updatePanelHasChildrenAsTriggers, "UpdatePanel ChildrenAsTriggers do not match (2)");
            AtlasUnit.Assert.elementsEqual([], prm._asyncPostBackControlIDs, "AsyncPostBackControlIDs do not match (2)");
            AtlasUnit.Assert.elementsEqual([], prm._asyncPostBackControlClientIDs, "AsyncPostBackControlClientIDs do not match (2)");
            AtlasUnit.Assert.elementsEqual([], prm._postBackControlIDs, "PostBackControlIDs do not match (2)");
            AtlasUnit.Assert.elementsEqual([], prm._postBackControlClientIDs, "PostBackControlClientIDs do not match (2)");
        }

        verifyEmpty();
        AtlasUnit.Assert.areEqual(0, prm._asyncPostBackTimeout, "Timeout does not match (2)");

        // empty values but with async postback timeout
        prm._commitControls(null, 8);
        verifyEmpty();
        AtlasUnit.Assert.areEqual(8000, prm._asyncPostBackTimeout, "Timeout does not match");

        // empty values and no async postback timeout
        prm._commitControls(null, null);
        verifyEmpty();
        AtlasUnit.Assert.areEqual(8000, prm._asyncPostBackTimeout, "Timeout does not match");
    },

    this.testUpdateControlsWithClientIDValues = function() {
        var formElement = document.createElement('form');
        var prm = Sys.WebForms.PageRequestManager.getInstance();
        Sys.WebForms.PageRequestManager._initialize("sm1", formElement,
            ['tUP1', 'c1', 'fNC1$UP2', 'c2'], ['apb1', 'c3', 'NC1$apb2', 'c4'], ['pb1', 'c5', 'NC1$pb2', 'c6'], 30);
        AtlasUnit.Assert.elementsEqual(['UP1', 'NC1$UP2'], prm._updatePanelIDs, "UpdatePanels do not match (1)");
        AtlasUnit.Assert.elementsEqual(['c1', 'c2'], prm._updatePanelClientIDs, "UpdatePanel client IDs do not match (1)");
        AtlasUnit.Assert.elementsEqual([true, false], prm._updatePanelHasChildrenAsTriggers, "UpdatePanel ChildrenAsTriggers do not match (1)");
        AtlasUnit.Assert.areEqual(30000, prm._asyncPostBackTimeout, "Timeout does not match (1)");
        AtlasUnit.Assert.elementsEqual(['apb1', 'NC1$apb2'], prm._asyncPostBackControlIDs, "AsyncPostBackControlIDs do not match (1)");
        AtlasUnit.Assert.elementsEqual(['c3', 'c4'], prm._asyncPostBackControlClientIDs, "AsyncPostBackControlClientIDs do not match (1)");
        AtlasUnit.Assert.elementsEqual(['pb1', 'NC1$pb2'], prm._postBackControlIDs, "PostBackControlIDs do not match (1)");
        AtlasUnit.Assert.elementsEqual(['c5', 'c6'], prm._postBackControlClientIDs, "PostBackControlClientIDs do not match (1)");
    },

    this.testUpdateControlsWithValues = function() {
        var formElement = document.createElement('form');
        var prm = Sys.WebForms.PageRequestManager.getInstance();
        Sys.WebForms.PageRequestManager._initialize("sm1", formElement,
            ['tUP1', 'UP1ClientID', 'fNC1$UP2', ''], ['apb1', '', 'NC1$apb2', ''], ['pb1', '', 'NC1$pb2', ''], 30);
        AtlasUnit.Assert.elementsEqual(['UP1', 'NC1$UP2'], prm._updatePanelIDs, "UpdatePanels do not match (1)");
        AtlasUnit.Assert.elementsEqual(['UP1ClientID', 'NC1_UP2'], prm._updatePanelClientIDs, "UpdatePanel client IDs do not match (1)");
        AtlasUnit.Assert.elementsEqual([true, false], prm._updatePanelHasChildrenAsTriggers, "UpdatePanel ChildrenAsTriggers do not match (1)");
        AtlasUnit.Assert.areEqual(30000, prm._asyncPostBackTimeout, "Timeout does not match (1)");
        AtlasUnit.Assert.elementsEqual(['apb1', 'NC1$apb2'], prm._asyncPostBackControlIDs, "AsyncPostBackControlIDs do not match (1)");
        AtlasUnit.Assert.elementsEqual(['apb1', 'NC1_apb2'], prm._asyncPostBackControlClientIDs, "AsyncPostBackControlClientIDs do not match (1)");
        AtlasUnit.Assert.elementsEqual(['pb1', 'NC1$pb2'], prm._postBackControlIDs, "PostBackControlIDs do not match (1)");
        AtlasUnit.Assert.elementsEqual(['pb1', 'NC1_pb2'], prm._postBackControlClientIDs, "PostBackControlClientIDs do not match (1)");
    },

    this.testUpdateControlsWithValuesIn35Format = function() {
        var formElement = document.createElement('form');
        var prm = Sys.WebForms.PageRequestManager.getInstance();
        Sys.WebForms.PageRequestManager._initialize("sm1", formElement);
        prm._updateControls(['tUP1', 'fNC1$UP2'], ['apb1', 'NC1$apb2'], ['pb1', 'NC1$pb2'], 30);
        AtlasUnit.Assert.elementsEqual(['UP1', 'NC1$UP2'], prm._updatePanelIDs, "UpdatePanels do not match (1)");
        AtlasUnit.Assert.elementsEqual(['UP1', 'NC1_UP2'], prm._updatePanelClientIDs, "UpdatePanel client IDs do not match (1)");
        AtlasUnit.Assert.elementsEqual([true, false], prm._updatePanelHasChildrenAsTriggers, "UpdatePanel ChildrenAsTriggers do not match (1)");
        AtlasUnit.Assert.areEqual(30000, prm._asyncPostBackTimeout, "Timeout does not match (1)");
        AtlasUnit.Assert.elementsEqual(['apb1', 'NC1$apb2'], prm._asyncPostBackControlIDs, "AsyncPostBackControlIDs do not match (1)");
        AtlasUnit.Assert.elementsEqual(['apb1', 'NC1_apb2'], prm._asyncPostBackControlClientIDs, "AsyncPostBackControlClientIDs do not match (1)");
        AtlasUnit.Assert.elementsEqual(['pb1', 'NC1$pb2'], prm._postBackControlIDs, "PostBackControlIDs do not match (1)");
        AtlasUnit.Assert.elementsEqual(['pb1', 'NC1_pb2'], prm._postBackControlClientIDs, "PostBackControlClientIDs do not match (1)");
    },

    this.testFireDefaultButton = function() {
        // Test WebForm_FireDefaultButton, the original WebForms.js version and the overridden version PageRequestManager.
        var form = document.createElement('form');
        var button = document.createElement('button');
        button.id = 'TestButton';
        var textarea = document.createElement('textarea');

        Sys.WebForms.PageRequestManager._initialize("sm1", form);
        var prm = Sys.WebForms.PageRequestManager.getInstance();

        function testDefaultButton(fireDefaultButtonFunction) {
            var clicked = false;
            var keypressHandler = function(event, target) {
                fireDefaultButtonFunction(event.rawEvent, button.id);
            }
            var clickHandler = function() { clicked = true; };

            try {

                $addHandler(form, 'keypress', keypressHandler);
                $addHandler(button, 'click', clickHandler);

                if (Sys.Browser.agent === Sys.Browser.Opera) {
                    // Opera does not support document.createEvent("KeyboardEvent").  When called, it throws
                    // a DOMException with code = 9 (NOT_SUPPORTED_ERR).  The exception message includes the full stack
                    // trace, so we need to verify the code rather than the message.  Further, Opera doesn't allow you to
                    // call "instanceof DOMException" -- this causes a TypeError stating "DOMException does not implement
                    // [[HasInstance]]".  So we need to check the exception type against "Object".
                    AtlasUnit.Assert.expectException(
                        function() {
                            AtlasUnit.Util.fireKeyboardEvent(form, "keypress", 13);
                        },
                        { code: 9 },
                        Object);

                    AtlasUnit.Assert.expectException(
                        function() {
                            AtlasUnit.Util.fireKeyboardEvent(textarea, "keypress", 13);
                        },
                        { code: 9 },
                        Object);
                }
                else {
                    AtlasUnit.Util.fireKeyboardEvent(form, "keypress", 13);

                    // Safari has a bug where initKeyboardEvent() does not set charCode or keyCode, so
                    // the default button will not be clicked.
                    // http://bugs.webkit.org/show_bug.cgi?id=16735
                    if (Sys.Browser.agent === Sys.Browser.Safari) {
                        AtlasUnit.Assert.isFalse(clicked);
                    }
                    else {
                        AtlasUnit.Assert.isTrue(clicked, "Default button not clicked");
                    }

                    clicked = false;
                    AtlasUnit.Util.fireKeyboardEvent(textarea, "keypress", 13);
                    AtlasUnit.Assert.isFalse(clicked, "Default button should not be clicked when pressing enter within a textarea.");
                }
            }
            finally {
                $removeHandler(form, 'keypress', keypressHandler);
                $removeHandler(button, 'click', clickHandler);
            }
        }

        try {
            document.body.appendChild(form);
            document.body.appendChild(button);
            document.body.appendChild(textarea);

            testDefaultButton(Function.createDelegate(prm, prm._fireDefaultButton));
            testDefaultButton(prm._originalFireDefaultButton);
        }
        finally {
            document.body.removeChild(button);
            document.body.removeChild(form);
            document.body.removeChild(textarea);
        }
    },

    this.testCreateHiddenElement = function() {
        var form = document.createElement('form');
        Sys.WebForms.PageRequestManager._initialize("sm1", form);
        var prm = Sys.WebForms.PageRequestManager.getInstance();

        var hidden = document.createElement("input");
        hidden.id = "hiddenFoo";
        hidden.type = "hidden";
        hidden.value = "foo";

        try {
            document.body.appendChild(form);
            document.body.appendChild(hidden);

            // update existing field without a container
            prm._createHiddenField("hiddenFoo", "bar");
            AtlasUnit.Assert.areEqual("bar", document.getElementById("hiddenFoo").value);
            AtlasUnit.Assert.isTrue(document.getElementById("hiddenFoo")._isContained);

            // DDB 27075: should be contained in a span container because it must be created with innerHTML
            var parent = document.getElementById("hiddenFoo").parentNode;
            AtlasUnit.Assert.areEqual("span", parent.tagName.toLowerCase());
            AtlasUnit.Assert.areEqual("none", parent.style.display);

            // update existing field with container
            prm._createHiddenField("hiddenFoo", "baz");
            AtlasUnit.Assert.areEqual("baz", document.getElementById("hiddenFoo").value);
            // reuse existing parent node
            AtlasUnit.Assert.areEqual(parent, document.getElementById("hiddenFoo").parentNode);

            // create new field
            prm._createHiddenField("hiddenBar", "bar");
            AtlasUnit.Assert.isTrue(!!document.getElementById("hiddenBar"));
            AtlasUnit.Assert.areEqual("bar", document.getElementById("hiddenBar").value);
            AtlasUnit.Assert.isTrue(document.getElementById("hiddenBar")._isContained);
        }
        finally {
            document.body.removeChild(form);
            var field = document.getElementById("hiddenFoo");
            if (field) {
                field.parentNode.removeChild(field);
            }
            field = document.getElementById("hiddenBar");
            if (field) {
                field.parentNode.removeChild(field);
            }
        }

    }
}

Sys.WebForms.Test.PageRequestManagerTest.registerClass("Sys.WebForms.Test.PageRequestManagerTest");
Sys.WebForms.Test.PageRequestManagerTest["AtlasUnit.IsTestFixture"] = true;

