/// <reference name="MicrosoftAjax.js"/>
/// <reference name="MicrosoftAjaxWebForms.js"/>
/// <reference path="..\..\..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("Sys.UI.Test");

Sys.UI.Test.UpdateProgressTest = function() {
    var e, up;
    this.setUp = function() {
        e = document.createElement("div");
        up = new Sys.UI._UpdateProgress(e);
    }
    this.tearDown = function() {
        up.dispose();
    }

    this.testDisplayAfterProperty = function() {
        AtlasUnit.Assert.areEqual(500, up.get_displayAfter());
        up.set_displayAfter(501);
        AtlasUnit.Assert.areEqual(501, up.get_displayAfter());
        up.set_displayAfter(0);
        AtlasUnit.Assert.areEqual(0, up.get_displayAfter());
    }

    this.testDynamicLayoutProperty = function() {
        AtlasUnit.Assert.isTrue(up.get_dynamicLayout());
        up.set_dynamicLayout(false);
        AtlasUnit.Assert.isFalse(up.get_dynamicLayout());
        up.set_dynamicLayout(true);
        AtlasUnit.Assert.isTrue(up.get_dynamicLayout());
    }

    this.testAssociatedUpdatePanelIdProperty = function() {
        AtlasUnit.Assert.isNull(up.get_associatedUpdatePanelId());
        up.set_associatedUpdatePanelId("foo");
        AtlasUnit.Assert.areEqual("foo", up.get_associatedUpdatePanelId());
        up.set_associatedUpdatePanelId(null);
        AtlasUnit.Assert.isNull(up.get_associatedUpdatePanelId());
    }

    this.testRole = function() {
        AtlasUnit.Assert.areEqual("status", up.get_role());
    }

    this.testInitialize = function() {
        up.initialize();
        AtlasUnit.Assert.areEqual(up.get_role(), e.getAttribute("role"));
        AtlasUnit.Assert.areEqual("true", e.getAttribute("aria-hidden"));
    }

    this.testExplicitlyUpdating = function() {
        var prm = {
            get_isInAsyncPostBack: function() { return true; },
            _updatePanelIDs: ["uniqueID"],
            _updatePanelClientIDs: ["clientID"]
        };
        up.set_associatedUpdatePanelId("clientID");
        up.initialize();
        up._pageRequestManager = prm;
        var timeout = window.setTimeout;
        window.setTimeout = function(handler) { handler(); };
        try {
            var args = {
                get_postBackElement: function() { return null; },
                get_updatePanelsToUpdate: function() {
                    return ["uniqueID"];
                }
            };
            
            up._handleBeginRequest(prm, args);

            AtlasUnit.Assert.areEqual("block", e.style.display);
            AtlasUnit.Assert.areEqual("false", e.getAttribute("aria-hidden"));

        }
        finally {
            up._pageRequestManager = Sys.WebForms.PageRequestManager.getInstance();
            window.setTimeout = timeout;
        }
    }

    this.testExplicitlyUpdatingWithClientID = function() {
        var prm = {
            get_isInAsyncPostBack: function() { return true; },
            _updatePanelIDs: ["uniqueID"],
            _updatePanelClientIDs: ["clientID"]
        };
        up.set_associatedUpdatePanelId("clientID");
        up.initialize();
        up._pageRequestManager = prm;
        var timeout = window.setTimeout;
        window.setTimeout = function(handler) { handler(); };
        try {
            var args = {
                get_postBackElement: function() { return null; },
                get_updatePanelsToUpdate: function() {
                    return ["clientID"];
                }
            };
            
            up._handleBeginRequest(prm, args);

            AtlasUnit.Assert.areEqual("block", e.style.display);
            AtlasUnit.Assert.areEqual("false", e.getAttribute("aria-hidden"));

        }
        finally {
            up._pageRequestManager = Sys.WebForms.PageRequestManager.getInstance();
            window.setTimeout = timeout;
        }
    }

    this.testStartRequest = function() {
        up.initialize();
        up._pageRequestManager = {
            get_isInAsyncPostBack: function() { return true; }
        };
        try {
            up._startRequest();

            AtlasUnit.Assert.areEqual("block", e.style.display);
            AtlasUnit.Assert.areEqual("false", e.getAttribute("aria-hidden"));

            up._handleEndRequest();
            AtlasUnit.Assert.areEqual("none", e.style.display);
            AtlasUnit.Assert.areEqual("true", e.getAttribute("aria-hidden"));
        }
        finally {
            up._pageRequestManager = Sys.WebForms.PageRequestManager.getInstance();
        }
    }

    this.testStartRequestNonDynamic = function() {
        up.set_dynamicLayout(false);
        up.initialize();
        up._pageRequestManager = {
            get_isInAsyncPostBack: function() { return true; }
        };
        try {
            up._startRequest();

            AtlasUnit.Assert.areEqual("visible", e.style.visibility);
            AtlasUnit.Assert.areEqual("false", e.getAttribute("aria-hidden"));

            up._handleEndRequest();
            AtlasUnit.Assert.areEqual("hidden", e.style.visibility);
            AtlasUnit.Assert.areEqual("true", e.getAttribute("aria-hidden"));
        }
        finally {
            up._pageRequestManager = Sys.WebForms.PageRequestManager.getInstance();
        }
    }
}

Sys.UI.Test.UpdateProgressTest.registerClass("Sys.UI.Test.UpdateProgressTest");
Sys.UI.Test.UpdateProgressTest["AtlasUnit.IsTestFixture"] = true;


