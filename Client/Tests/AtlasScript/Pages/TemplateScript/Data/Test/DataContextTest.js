Type.registerNamespace("Sys.Data.Test");

Sys.Data.Test.DataContextTest = function() {
    var ds, ds2, helper = new Sys.Data.Test.MockRequestHelper();
    this.setUp = function() {
        ds = new Sys.Data.DataContext();
        ds2 = new Sys.Data.DataContext();
        ds2.set_getIdentityMethod(function(dataContext, entity) { return entity.$id; });
        ds2.set_isDeferredPropertyMethod(function(dataContext, entity, field) {
            var value = entity[field];
            return !!(value && typeof(value) === "object" && value.__deferred);
        });
        helper.setUp();
    }
    this.tearDown = function() {
        helper.tearDown();
        ds.dispose();
    }

    this.verifyChangeSet = function(expectedOp, expectedItem, change) {
        AtlasUnit.Assert.areEqual(expectedOp, change.action);
        var p, item = change.item;
        for (p in expectedItem) {
            AtlasUnit.Assert.areEqual(expectedItem[p], item[p], "Field '" + p + "' on change item does not match expected value.");
        }
        for (p in item) {
            if (p !== "_observerContext") {
                AtlasUnit.Assert.areEqual(expectedItem[p], item[p], "Field '" + p + "' on change item does not match expected value.");
            }
        }
    }

    this.testDataProperty = function() {
        AtlasUnit.Assert.isNull(ds2.get_lastFetchDataResults());
        ds2.trackData("foo");
        AtlasUnit.Assert.areEqual("foo", ds2.get_lastFetchDataResults());
        ds2.trackData(null);
        AtlasUnit.Assert.elementsEqual(null, ds2.get_lastFetchDataResults());
        var item = { foo: 'foo', $id: "foo1" };
        ds2.trackData([item]);
        AtlasUnit.Assert.isNotNull(ds2.get_lastFetchDataResults(), "Data should not be null.");
        AtlasUnit.Assert.isTrue(ds2.get_lastFetchDataResults() instanceof Array, "Expected Array.");
        AtlasUnit.Assert.areEqual(1, ds2.get_lastFetchDataResults().length);
        AtlasUnit.Assert.areEqual(item, ds2.get_lastFetchDataResults()[0], "Data should have one entry equal to the test item.");
        AtlasUnit.Assert.areEqual(item, ds2.get_items()["foo1"], "Items set that are entities should be stored in the items dictionary.");
        ds2.trackData(null);
        // setting data to null doesnt remove items, only clearData can do that.
        AtlasUnit.Assert.elementsEqual(null, ds2.get_lastFetchDataResults());
        AtlasUnit.Assert.isNotNull(ds2.get_items(), "Setting data to null shouldn't clear items.");
        AtlasUnit.Assert.areEqual(item, ds2.get_items()["foo1"]);
    }

    this.testServiceUriProperty = function() {
        AtlasUnit.Assert.areEqual("", ds.get_serviceUri());
        ds.set_serviceUri("foo");
        AtlasUnit.Assert.areEqual("foo", ds.get_serviceUri());
        ds.set_serviceUri(null);
        AtlasUnit.Assert.areEqual("", ds.get_serviceUri());
    }

    this.testFetchParametersParameter = function() {
        var params = { "foo": "bar" };
        ds.set_serviceUri('foo');
        ds.initialize();
        ds.fetchData("query", params);
        helper.verifyRequest({ parameters: params });
    }
    
    this.testMergeOptionProperty = function() {
        AtlasUnit.Assert.areEqual(Sys.Data.MergeOption.overwriteChanges, ds.get_mergeOption());
        ds.set_mergeOption(Sys.Data.MergeOption.appendOnly);
        AtlasUnit.Assert.areEqual(Sys.Data.MergeOption.appendOnly, ds.get_mergeOption());
        ds.set_mergeOption(Sys.Data.MergeOption.overwriteChanges);
        AtlasUnit.Assert.areEqual(Sys.Data.MergeOption.overwriteChanges, ds.get_mergeOption());
    }

    this.testSaveHttpVerbProperty = function() {
        AtlasUnit.Assert.areEqual("POST", ds.get_saveHttpVerb());
        ds.set_saveHttpVerb("GET");
        AtlasUnit.Assert.areEqual("GET", ds.get_saveHttpVerb());
    }

    this.testSaveParametersProperty = function() {
        AtlasUnit.Assert.isNull(ds.get_saveParameters());
        var params = { "foo": "bar" };
        ds.set_saveParameters(params);
        AtlasUnit.Assert.areEqual(params, ds.get_saveParameters());
        ds.set_saveParameters(null);
    }

    this.testSaveChangesTimeoutProperty = function() {
        AtlasUnit.Assert.areEqual(0, ds.get_saveChangesTimeout());
        ds.set_saveChangesTimeout(88);
        AtlasUnit.Assert.areEqual(88, ds.get_saveChangesTimeout());
        ds.set_saveChangesTimeout(0);
        AtlasUnit.Assert.areEqual(0, ds.get_saveChangesTimeout());
    }

    this.testSaveOperationProperty = function() {
        AtlasUnit.Assert.areEqual("", ds.get_saveOperation());
        ds.set_saveOperation("test");
        AtlasUnit.Assert.areEqual("test", ds.get_saveOperation());
        ds.set_saveOperation("");
        AtlasUnit.Assert.areEqual("", ds.get_saveOperation());
    }

    this.testInitialize = function() {
        ds.initialize();
        AtlasUnit.Assert.isFalse(!!this._invoke);
    }

    this.testFetch = function() {
        ds.set_serviceUri("hi");
        ds.initialize();
        ds.fetchData("query");
        var request = helper.verifyRequest({ uri: "hi" });
        AtlasUnit.Assert.isNull(ds.get_lastFetchDataResults(), "No data should be Fetched yet.");
        request.succeededCallback("data", request.userContext);
        AtlasUnit.Assert.areEqual("data", ds.get_lastFetchDataResults(), "Data should be fetched.");
    }
    
    this.testFetchOverwriteChanges = function() {
        ds2.set_serviceUri("hi");
        ds2.initialize();
        var data    = [{foo:"foo1" ,bar:"bar1",nullField:null ,$id:1                },{foo:"foo2",bar:"bar2",nullField:null,$id:2}];
        var newData = [{foo:"foo1a",           nullField:"val",$id:1,newField:"new1"},{foo:"foo3",bar:"bar3",nullField:null,$id:3}];
        ds2.trackData(data);
        ds2.fetchData("query", null, Sys.Data.MergeOption.overwriteChanges);
        var request = helper.verifyRequest({ uri: "hi" });
        request.succeededCallback(newData, request.userContext);
        var foo1 = ds2.get_items()[1];
        AtlasUnit.Assert.areEqual("foo1a", foo1.foo, "Existing property should be overwritten.");
        AtlasUnit.Assert.areEqual("bar1", foo1.bar, "Existing property not in the response should still exist.");
        AtlasUnit.Assert.areEqual("val", foo1.nullField, "Existing property that is null should be overwritten exist.");
        AtlasUnit.Assert.areEqual("new1", foo1.newField, "Non-existing property that is in the response should now exist.");
        var foo2 = ds2.get_items()[2];
        AtlasUnit.Assert.isNotNull(foo2, "foo2 should still exist, it wasn't in the response.");
        var foo3 = ds2.get_items()[3] || null;
        AtlasUnit.Assert.isNotNull(foo3, "foo3 should have been created.");
    }

    this.testFetchAppendOnly = function() {
        ds2.set_serviceUri("hi");
        ds2.initialize();
        var data    = [{foo:"foo1" ,bar:"bar1",nullField:null ,$id:1                },{foo:"foo2",bar:"bar2",nullField:null,$id:2}];
        var newData = [{foo:"foo1a",           nullField:"val",$id:1,newField:"new1"},{foo:"foo3",bar:"bar3",nullField:null,$id:3}];
        ds2.trackData(data);
        ds2.fetchData("query", null, Sys.Data.MergeOption.appendOnly);
        var request = helper.verifyRequest({ uri: "hi" });
        request.succeededCallback(newData, request.userContext);
        var foo1 = ds2.get_items()[1];
        AtlasUnit.Assert.areEqual("foo1", foo1.foo, "Existing property should be preserved.");
        AtlasUnit.Assert.areEqual("bar1", foo1.bar, "Existing property not in the response should still exist.");
        AtlasUnit.Assert.areEqual(null, foo1.nullField, "Existing property that is null should still be null as 'null' is a 'real value'.");
        AtlasUnit.Assert.areEqual("new1", foo1.newField, "Non-existing property that is in the response should now exist.");
        var foo2 = ds2.get_items()[2];
        AtlasUnit.Assert.isNotNull(foo2, "foo2 should still exist, it wasn't in the response.");
        var foo3 = ds2.get_items()[3] || null;
        AtlasUnit.Assert.isNotNull(foo3, "foo3 should have been created.");
    }

    this.testTrackChangesAppendOnly = function() {
        ds2.set_serviceUri("hi");
        ds2.initialize();
        var data    = [{foo:"foo1" ,bar:"bar1",nullField:null ,$id:1                },{foo:"foo2",bar:"bar2",nullField:null,$id:2}];
        var newData = [{foo:"foo1a",           nullField:"val",$id:1,newField:"new1"},{foo:"foo3",bar:"bar3",nullField:null,$id:3}];
        ds2.trackData(data);
        ds2.removeEntity(data[0]);
        var trackedData = ds2.trackData(newData, Sys.Data.MergeOption.appendOnly);
        AtlasUnit.Assert.isFalse(!!ds2.get_items()[1], "foo1 was deleted and should remain deleted in the items collection.");
        AtlasUnit.Assert.areEqual(1, trackedData.length, "foo1 was deleted so the tracked data should only include $id=3");
    }
        
    this.testFetchAppendOnlyWithDeferredObjects = function() {
        ds2.set_serviceUri("hi");
        ds2.initialize();
        var deferred = { __deferred: true };
        var data    = [{ foo: "foo1", $id: 1, someLink1: deferred, someLink2: { foo: "foo2", $id: 2 } } ];
        var newData = [{ foo: "foo1a", $id: 1, someLink1: { foo: "foo2a", $id: 2 }, someLink2: deferred } ];
        ds2.trackData(data);
        ds2.fetchData("query", null, Sys.Data.MergeOption.appendOnly);
        var request = helper.verifyRequest({ uri: "hi" });
        request.succeededCallback(newData, request.userContext);
        var foo1 = ds2.get_items()[1];
        var foo2 = ds2.get_items()[2];
        AtlasUnit.Assert.isNotNull(foo1 || null, "Could not get foo1");
        AtlasUnit.Assert.isNotNull(foo2 || null, "Could not get foo2");
        AtlasUnit.Assert.areEqual(foo2, foo1.someLink1, "foo1.someLink1 was deferred and so can be appended to become set to foo2.");
        AtlasUnit.Assert.areEqual(foo2, foo1.someLink2, "foo1.someLink2 was set to foo2, and incoming data is deferred so it shouldnt be overwritten.");
    }
    
    this.testFetchOverwriteChangesPerformsIdentityManagement = function() {
        ds2.set_serviceUri("hi");
        ds2.initialize();
        var original2 = { $id: 2 };
        var foo1 = { foo: "foo1", $id: 1, link: original2 };
        var foo2 = { foo: "foo2", $id: 2, link: { $id: 1 } };
        ds2.trackData([foo1, foo2], Sys.Data.MergeOption.overwriteChanges);
        AtlasUnit.Assert.areEqual(foo1.link, original2, "foo1.link");
        AtlasUnit.Assert.areEqual(original2.link, foo1, "foo2.link");
    }
    
    this.testFetchOverwriteChangesPerformsIdentityManagementArray = function() {
        ds2.set_serviceUri("hi");
        ds2.initialize();
        var original2 = { $id: 2 };
        var foo1 = { foo: "foo1", $id: 1, links: [original2] };
        var foo2 = { foo: "foo2", $id: 2, links: [{ $id: 1 }] };
        ds2.trackData([foo1, foo2], Sys.Data.MergeOption.overwriteChanges);
        AtlasUnit.Assert.areEqual(foo1.links[0], original2, "foo1.links");
        AtlasUnit.Assert.areEqual(original2.links[0], foo1, "foo2.links");
    }
    
    this.testFetchOverwriteChangesWithDeferredObjects = function() {
        ds2.set_serviceUri("hi");
        ds2.initialize();
        var deferred = { __deferred: true, toString: function() { return "[deferred Object]" } };
        var obj = {};
        var data    = [{ foo: "foo1", $id: 1, someLink1: deferred, someLink2: { foo: "foo2", $id: 2 }, someProperty1: obj } ];
        var newData = [{ foo: "foo1a", $id: 1, someLink1: { foo: "foo2a", $id: 2 }, someLink2: deferred, someProperty1: deferred }];
        ds2.trackData(data);
        ds2.fetchData("query", null, Sys.Data.MergeOption.overwriteChanges);
        var request = helper.verifyRequest({ uri: "hi" });
        request.succeededCallback(newData, request.userContext);
        var foo1 = ds2.get_items()[1];
        var foo2 = ds2.get_items()[2];
        AtlasUnit.Assert.isNotNull(foo1 || null, "Could not get foo1");
        AtlasUnit.Assert.isNotNull(foo2 || null, "Could not get foo2");
        AtlasUnit.Assert.areEqual(foo2, foo1.someLink1, "foo1.someLink1 was deferred but the incomming object has foo2.");
        AtlasUnit.Assert.areEqual(foo2, foo1.someLink2, "foo1.someLink2 should be set to foo2. The incomming object is deferred, and deferred should never overwrite a non-deferred entity even with overwriteChanges.");
        AtlasUnit.Assert.areEqual(obj, foo1.someProperty1, "foo1.someProperty1 should be set to obj. The incomming object is deferred, and deferred should never overwrite a non-deferred entity even with overwriteChanges, even when the existing object is not an entity.");
    }
    
    this.testFetchOverwriteChangesCancelsChanges = function() {
        ds2.set_serviceUri("hi");
        ds2.initialize();
        var deferred = { __deferred: true };
        var data    = [{ foo: "foo1", $id: 1 }, { foo: "foo2", $id: 2 }];
        var newData = [{ foo: "foo1a", $id: 1 }, { foo: "foo2a", $id: 2 }];
        ds2.trackData(data);
        // edit foo1
        Sys.Observer.setValue(data[0], "foo", "foo1-edit");
        // delete foo2
        ds2.removeEntity(data[1]);
        AtlasUnit.Assert.isTrue(ds2.get_hasChanges());
        AtlasUnit.Assert.areEqual(2, ds2.get_changes().length);
        ds2.fetchData("query", null, Sys.Data.MergeOption.overwriteChanges);
        var request = helper.verifyRequest({ uri: "hi" });
        request.succeededCallback(newData, request.userContext);
        AtlasUnit.Assert.areEqual(0, ds2.get_changes().length, "No changes should be left.");
        AtlasUnit.Assert.isFalse(ds2.get_hasChanges(), "No changes should be left.");

        Sys.Observer.setValue(ds2.get_items()["2"], "foo", "fooedit");        
        AtlasUnit.Assert.isTrue(ds2.get_hasChanges(), "Setup for testing tracking of an existing item.");
        ds2.trackData(newData, Sys.Data.MergeOption.overwriteChanges);
        AtlasUnit.Assert.isTrue(ds2.get_hasChanges(), "Re-tracking an existing item should not cancel changes to it.");
    }
    
    this.testFetchOverwriteChangesCancelsLinkChanges = function() {
        ds2.set_serviceUri("hi");
        ds2.initialize();
        var deferred = { __deferred: true };
        var data    = [{ $id:1, foo2: {$id:2}, bars: [{$id:3},{$id:4}] }];
        var newData = [{ $id:1, foo2: {$id:2}, bars: [{$id:3},{$id:4}] }];
        ds2.trackData(data);
        // edit link to entity: one-to-x
        ds2.setLink(data[0], "foo2", null);
        // add link to many-to-x
        ds2.addLink(data[0], "bars", {$id:5});
        // remove link from many-to-x
        ds2.removeLink(data[0], "bars", {$id:4});
        ds2.fetchData("query", null, Sys.Data.MergeOption.overwriteChanges);
        var request = helper.verifyRequest({ uri: "hi" });
        request.succeededCallback(newData, request.userContext);
        AtlasUnit.Assert.isFalse(ds2.get_hasChanges());
        AtlasUnit.Assert.areEqual(0, ds2.get_changes().length);
    }    
    
    this.testFetchAppendPerformsIdentityManagement = function() {
        ds2.set_serviceUri("hi");
        ds2.initialize();
        var original2 = { $id: 2 };
        var foo1 = { foo: "foo1", $id: 1, link: original2 };
        var foo2 = { foo: "foo2", $id: 2, link: { $id: 1 } };
        ds2.trackData([foo1, foo2], Sys.Data.MergeOption.appendOnly);
        AtlasUnit.Assert.areEqual(foo1.link, original2, "foo1.link");
        AtlasUnit.Assert.areEqual(original2.link, foo1, "foo2.link");
    }
    
    this.testFetchAppendPerformsIdentityManagementArray = function() {
        ds2.set_serviceUri("hi");
        ds2.initialize();
        var original2 = { $id: 2 };
        var foo1 = { foo: "foo1", $id: 1, links: [original2] };
        var foo2 = { foo: "foo2", $id: 2, links: [{ $id: 1 }] };
        ds2.trackData([foo1, foo2], Sys.Data.MergeOption.appendOnly);
        AtlasUnit.Assert.areEqual(foo1.links[0], original2, "foo1.links");
        AtlasUnit.Assert.areEqual(original2.links[0], foo1, "foo2.links");
    }

    this.testFetchAppendOnlyKeepsChanges = function() {
        ds2.set_serviceUri("hi");
        ds2.initialize();
        var deferred = { __deferred: true };
        var data    = [{ foo: "foo1", $id: 1 }, { foo: "foo2", $id: 2 }];
        var newData = [{ foo: "foo1a", $id: 1 }, { foo: "foo2a", $id: 2 }];
        ds2.trackData(data);
        // edit foo1
        Sys.Observer.setValue(data[0], "foo", "foo1-edit");
        // delete foo2
        ds2.removeEntity(data[1]);
        AtlasUnit.Assert.isTrue(ds2.get_hasChanges());
        AtlasUnit.Assert.areEqual(2, ds2.get_changes().length);
        ds2.fetchData("query", null, Sys.Data.MergeOption.appendOnly);
        var request = helper.verifyRequest({ uri: "hi" });
        request.succeededCallback(newData, request.userContext);
        AtlasUnit.Assert.isTrue(ds2.get_hasChanges());
        AtlasUnit.Assert.areEqual(2, ds2.get_changes().length);
        AtlasUnit.Assert.areEqual("foo1-edit", ds2.get_items()[1].foo, "foo1 was edited and should remain the same after a new query contains it.");
        AtlasUnit.Assert.isFalse(!!ds2.get_items()[2], "foo2 was deleted and should remain deleted after a new query contains it.");
    }
    
    this.testFetchAppendOnlyKeepsLinkChanges = function() {
        ds2.set_serviceUri("hi");
        ds2.initialize();
        var deferred = { __deferred: true };
        var data    = [{ $id:1, foo2: {$id:2}, bars: [{$id:3},{$id:4}] }];
        var newData = [{ $id:1, foo2: {$id:2}, bars: [{$id:3},{$id:4}] }];
        ds2.trackData(data);
        // edit link to entity: one-to-x
        ds2.setLink(data[0], "foo2", null);
        // add link to many-to-x
        ds2.addLink(data[0], "bars", {$id:5});
        // remove link from many-to-x
        ds2.removeLink(data[0], "bars", data[0].bars[1]);
        AtlasUnit.Assert.areEqual(3, ds2.get_changes().length, "Changes were not created as expected.");
        ds2.fetchData("query", null, Sys.Data.MergeOption.appendOnly);
        var request = helper.verifyRequest({ uri: "hi" });
        request.succeededCallback(newData, request.userContext);
        AtlasUnit.Assert.areEqual(null, data[0].foo2);
        AtlasUnit.Assert.areEqual(2, data[0].bars.length, "bars link should have 2 items.");
        AtlasUnit.Assert.areEqual(3, data[0].bars[0].$id);
        AtlasUnit.Assert.areEqual(5, data[0].bars[1].$id);
        AtlasUnit.Assert.isTrue(ds2.get_hasChanges());
        AtlasUnit.Assert.areEqual(3, ds2.get_changes().length);
    }
    
    this.testCaptureReleaseItemsIdentity = function() {
        var ds = ds2;
        var existingItem = { $id: 0 },
            item = { $id: 1 },
            item2 = { $id: 2 };
        var sender = null, args = null, data = [existingItem, item];
        ds.add_propertyChanged(function(s, a) {
            sender = s;
            args = a;
        });
        ds.set_serviceUri("uri");
        ds.trackData(data);
        ds.initialize();
        AtlasUnit.Assert.isFalse(ds.get_hasChanges());
        // add an item
        ds.insertEntity(item2);
        // remove an item
        ds.removeEntity(item);
        
        AtlasUnit.Assert.isNotNull(sender, "PropertyChanged event should have fired.");
        AtlasUnit.Assert.areEqual("hasChanges", args.get_propertyName());
        AtlasUnit.Assert.isTrue(ds.get_hasChanges(), "Should have tracked change to the data -- added an item.");
        
        ds._hasChanges = false;
        AtlasUnit.Assert.isFalse(ds.get_hasChanges());
        // edit the added item
        Sys.Observer.setValue(item2, "foo", 3);
        AtlasUnit.Assert.isFalse(ds.get_hasChanges(), "Editing an added item should not count.");
        
        // edit removed item
        Sys.Observer.setValue(item, "foo", 4);
        AtlasUnit.Assert.isFalse(ds.get_hasChanges(), "Editing a removed item should not count.");
        
        // change data and ensure the old remaining item is released
        ds.trackData([]);
        Sys.Observer.setValue(existingItem, "foo", 5);
        AtlasUnit.Assert.isFalse(ds.get_hasChanges(), "Edited disconnected data, should not be listened to.");
    }
    
    this.testCaptureReleaseItemsNoIdentity = function() {
        var existingItem = { id: 0 },
            item = { id: 1 },
            item2 = { id: 2 };
        var sender = null, args = null, data = [existingItem, item];
        ds.add_propertyChanged(function(s, a) {
            sender = s;
            args = a;
        });
        ds.set_serviceUri("uri");
        ds.trackData(data);
        ds.initialize();
        AtlasUnit.Assert.isFalse(ds.get_hasChanges());
        // add an item
        ds.insertEntity(item2);
        // remove an item
        ds.removeEntity(item);
        
        AtlasUnit.Assert.isNotNull(sender, "PropertyChanged event should have fired.");
        AtlasUnit.Assert.areEqual("hasChanges", args.get_propertyName());
        AtlasUnit.Assert.isTrue(ds.get_hasChanges(), "Should have tracked change to the data -- added an item.");
        
        ds._hasChanges = false;
        AtlasUnit.Assert.isFalse(ds.get_hasChanges());
        // edit the added item
        Sys.Observer.setValue(item2, "id", 3);
        AtlasUnit.Assert.isFalse(ds.get_hasChanges(), "Editing an added item should not count.");
        
        // edit removed item
        Sys.Observer.setValue(item, "id", 4);
        AtlasUnit.Assert.isFalse(ds.get_hasChanges(), "Editing a removed item should not count.");
        
        // change data and ensure the old remaining item is released
        ds.trackData([]);
        Sys.Observer.setValue(existingItem, "id", 5);
        AtlasUnit.Assert.isFalse(ds.get_hasChanges(), "Edited disconnected data, should not be listened to.");
    }
    
    this.testTrackChangesArrayOfStrings = function() {
        var data = ["foo", "bar"];
        ds.set_serviceUri("uri");
        ds.set_saveOperation("update");
        ds.trackData(data);
        ds.initialize();
        ds.insertEntity("baz");
        AtlasUnit.Assert.isTrue(ds.get_hasChanges(), "Should have tracked addition of a string.");
    }

    this.testAbortFetch = function() {
        ds.set_serviceUri("hi");
        ds.trackData("foo");
        ds.initialize();
        ds.fetchData("query");
        var request = helper.verifyRequest({});
        request.request.get_executor().abort();
        AtlasUnit.Assert.isTrue(helper.isAborted(), "request.get_executor().abort() was not called.");
        AtlasUnit.Assert.areEqual("foo", ds.get_lastFetchDataResults(), "Data should not be changed after an abort.");
    }

    this.testAbortSave = function() {
        ds.set_serviceUri("hi");
        ds.set_saveOperation("method");
        ds.trackData(["foo"]);
        ds.initialize();
        ds.insertEntity("bar");
        ds.saveChanges();
        var request = helper.verifyRequest({});
        AtlasUnit.Assert.isTrue(ds.get_isSaving(), "Should be saving.");
        ds.abortSave();
        AtlasUnit.Assert.isFalse(ds.get_isSaving(), "Aborted -- should not be saving.");
        AtlasUnit.Assert.isTrue(helper.isAborted(), "request.get_executor().abort() was not called.");
    }

    this.testSaveRequestFailed = function() {
        ds.set_serviceUri("hi");
        ds.set_saveOperation("method");
        ds.trackData(["foo"]);
        ds.initialize();
        ds.insertEntity("bar");
        var err = null;
        function fail(e) {
            err = e;
        }
        ds.saveChanges(null, fail);
        var request = helper.verifyRequest({});
        var e = new Sys.Net.WebServiceError(false, "message", null, null);
        request.failedCallback(e, request.userContext);
        AtlasUnit.Assert.isNotNull(err, "RequestFailed callback did not fire.");
        AtlasUnit.Assert.areEqual(e, err);
    }
    
    this.testSaveRequestFailedNoUri = function() {
        ds.set_serviceUri(null);
        ds.set_saveOperation("method");
        ds.trackData(["foo"]);
        ds.initialize();
        ds.insertEntity("bar");
        var err = null;
        function fail(e) {
            err = e;
        }
        window.setTimeoutOld = window.setTimeout;
        window.setTimeout = function(fn) { fn(); };
        try {
            ds.saveChanges(null, fail);
            AtlasUnit.Assert.isNotNull(err, "RequestFailed callback did not fire.");
        }
        finally {
            window.setTimeout = window.setTimeoutOld;
            window.setTimeoutOld = null;
        }
    }    

    this.testSaveRequestSucceeded = function() {
        ds.set_serviceUri("hi");
        ds.set_saveOperation("method");
        ds.set_saveChangesTimeout(88);
        ds.set_saveHttpVerb("GET");
        ds.trackData(["foo"]);
        ds.initialize();
        ds.insertEntity("bar");
        var result = null;
        function done(r) {
            result = r;
        }
        ds.saveChanges(done);
        var request = helper.verifyRequest({ timeout: 88, useGet: true });
        request.succeededCallback({}, request.userContext);
        AtlasUnit.Assert.isNotNull(result, "RequestSucceeed callback did not fire.");
    }

    this.testFetchRequestFailed = function() {
        ds.set_serviceUri("hi");
        ds.initialize();
        var err = null;
        function fail(e) {
            err = e;
        }
        ds.fetchData("query", null, null, null, null, fail);
        var request = helper.verifyRequest({});
        var e = new Sys.Net.WebServiceError(false, "message", null, null);
        request.failedCallback(e, request.userContext);
        AtlasUnit.Assert.isNotNull(err, "RequestFailed callback did not fire.");
        AtlasUnit.Assert.areEqual(e, err);
    }

    this.testFetchRequestSucceeded = function() {
        ds.set_serviceUri("hi");
        ds.initialize();
        var result;
        function done(r) {
            result = r;
        }
        ds.fetchData("query", null, null, "GET", done, null, 88);
        var request = helper.verifyRequest({ timeout: 88, useGet: true });
        request.succeededCallback({}, request.userContext);
        AtlasUnit.Assert.isNotNull(result, "RequestSucceeed callback did not fire.");
    }

    this.testAddLinkDeferredField = function() {
        var source = { toString: function() { return "source"; }, defSource: {__deferred: true } },
            target = { toString: function() { return "target"; }, defTarget: {__deferred: true } };
        ds2.addLink(source, "defSource", target);
        AtlasUnit.Assert.elementsEqual([target], source.defSource);
    }
    
    this.testAddLinkAlreadySetFieldSource = function() {
        var source = { toString: function() { return "source"; }, setSource: 88 },
            target = { toString: function() { return "target"; } };
        ds.addLink(source, "setSource", target);
    }
    this.testAddLinkAlreadySetFieldSource["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testAddLinkAlreadySetFieldSource["AtlasUnit.ExpectedException"] = {
        message: "Sys.InvalidOperationException: The property 'setSource' is not an Array."
    };
    
    this.testLinksCanceledOnInsertThenRemove = function() {
        var source = {};
        ds.insertEntity(source);
        // links that should be removed
        ds.setLink(source, "propSource", {});
        ds.setLink(source, "propSource2", null);
        ds.setLink({}, "propTarget", source);
        ds.addLink(source, "propSource3", {});
        ds.addLink({}, "propTarget2", source);
        // links that should remain because they are unrelated to source
        var remain1 = { toString: function() { return 'remain1'; } };
        var remain2 = { toString: function() { return 'remain2'; } };
        ds.addLink({}, "remain1", remain1);
        ds.setLink({}, "remain2", remain2);
        AtlasUnit.Assert.areEqual(8, ds.get_changes().length, "Test prep failed.");
        ds.removeEntity(source);
        var changeSet = ds.get_changes();
        AtlasUnit.Assert.areEqual(2, changeSet.length, "Adding then removing an item should cancel its pending link changes too (all types including reverse links)");
        AtlasUnit.Assert.areEqual("remain1", changeSet[0].linkSourceField);
        AtlasUnit.Assert.areEqual("remain2", changeSet[1].linkSourceField);
    } 
    
    this.testAddLinksCanceledOnRemoveEntity = function() {
        var source = {}, target = {},
            remain1 = {}, remain2 = {};
        ds.trackData(source);
        // setup links to remove later on
        ds.addLink(source, "remain1", remain1);
        ds.setLink(source, "remain2", remain2);
        ds.addLink(remain1, "targetRemain1", source);
        ds.setLink(remain2, "targetRemain2", source);
        ds.clearChanges();
        AtlasUnit.Assert.areEqual(0, ds.get_changes().length, "Test setup failed.");
        
        // links that should be removed
        ds.addLink(source, "remove1", target);
        ds.addLink(target, "remove2", source);

        // links related to source that should remain
        ds.setLink(source, "propSource", {});
        ds.setLink(source, "propSource2", null);
        ds.setLink(target, "propTarget", source);
        ds.removeLink(source, "remain1", remain1);
        ds.setLink(source, "remain2", {});
        ds.setLink(source, "remainNull", null);
        AtlasUnit.Assert.areEqual(8, ds.get_changes().length, "Test setup failed.");
        // links unrelated to the source that should remain
        ds.setLink(remain2, "targetRemain2", null);
        ds.addLink(remain1, "targetRemain3", {});
        AtlasUnit.Assert.areEqual(10, ds.get_changes().length, "Test setup failed.");
        ds.removeEntity(source);
        var changes = ds.get_changes();
        AtlasUnit.Assert.areEqual(9, changes.length); // the 8 links plus the removal
        AtlasUnit.Assert.areEqual("propSource", changes[0].linkSourceField);
        AtlasUnit.Assert.areEqual("propSource2", changes[1].linkSourceField);
        AtlasUnit.Assert.areEqual("propTarget", changes[2].linkSourceField);
        AtlasUnit.Assert.areEqual("remain1", changes[3].linkSourceField);
        AtlasUnit.Assert.areEqual("remain2", changes[4].linkSourceField);
        AtlasUnit.Assert.areEqual("remainNull", changes[5].linkSourceField);
        AtlasUnit.Assert.areEqual("targetRemain2", changes[6].linkSourceField);
        AtlasUnit.Assert.areEqual("targetRemain3", changes[7].linkSourceField);
        AtlasUnit.Assert.areEqual(Sys.Data.ChangeOperationType.remove, changes[8].action);
        AtlasUnit.Assert.areEqual(source, changes[8].item);
    }     
        
    this.testSetLinkFieldOneToOne = function() {
        var source = { toString: function() { return "source"; } },
            target = { toString: function() { return "target"; } };
        ds.setLink(source, "propSource", target);
        ds.setLink(target, "propTarget", source);
        AtlasUnit.Assert.areEqual(target, source.propSource);
        AtlasUnit.Assert.areEqual(source, target.propTarget);
        ds.setLink(source, "propSource", null);
        ds.setLink(target, "propTarget", null);
        AtlasUnit.Assert.isNull(source.propSource);
        AtlasUnit.Assert.isNull(target.propTarget, "The old target should be cleared of the reference, too.");
    }
    
    this.testSetLinkFieldOneToMany = function() {
        var source = { toString: function() { return "source"; } },
            target = { toString: function() { return "target"; } },
            target2 = { toString: function() { return "target2"; } };
        ds.setLink(source, "propSource", target);
        ds.addLink(target, "propTarget", source);
        AtlasUnit.Assert.areEqual(target, source.propSource);
        AtlasUnit.Assert.elementsEqual([source], target.propTarget);
        ds.setLink(source, "propSource", target2);
        ds.addLink(target2, "propTarget", source);
        ds.removeLink(target, "propTarget", source);
        AtlasUnit.Assert.areEqual(0, target.propTarget.length, "The old target should be unassociated with the source, leaving an empty array.");
        AtlasUnit.Assert.elementsEqual([source], target2.propTarget);
        ds.setLink(source, "propSource", null);
        ds.removeLink(target2, "propTarget", source);
        AtlasUnit.Assert.isNull(source.propSource);
        AtlasUnit.Assert.areEqual(0, target2.propTarget.length, "The old target2 should be unassociated with the source, leaving an empty array.");
    }
    
    this.testAddLinkFieldManyToMany = function() {
        var source = { toString: function() { return "source"; } },
            target = { toString: function() { return "target"; } },
            target2 = { toString: function() { return "target2"; } };
        ds.addLink(source, "propSource", target);
        ds.addLink(target, "propTarget", source);
        AtlasUnit.Assert.elementsEqual([target], source.propSource);
        AtlasUnit.Assert.elementsEqual([source], target.propTarget);
        ds.addLink(source, "propSource", target2);
        ds.addLink(target2, "propTarget", source);
        AtlasUnit.Assert.elementsEqual([target, target2], source.propSource);
        AtlasUnit.Assert.elementsEqual([source], target2.propTarget);
        ds.removeLink(source, "propSource", target);
        ds.removeLink(target, "propTarget", source);
        AtlasUnit.Assert.elementsEqual([target2], source.propSource);
        AtlasUnit.Assert.elementsEqual([], target.propTarget);
        ds.removeLink(source, "propSource", target2);
        ds.removeLink(target2, "propTarget", source);
        AtlasUnit.Assert.elementsEqual([], source.propSource);
        AtlasUnit.Assert.elementsEqual([], target2.propTarget);
    }
    
    this.testAddLink = function() {
        var existingTarget = { toString: function() { return "existingTarget"; } },
            singleTarget1 = { toString: function() { return "singleTarget1"; } },
            singleTarget2 = { toString: function() { return "singleTarget2"; } };
        var source = { targets1: null, targets2: [existingTarget], singleTarget1: null, singleTarget2: singleTarget1 }, target = {};
        // add to a field that isnt already an array
        ds.addLink(source, "targets1", target);
        // double add
        ds.addLink(source, "targets1", target);
        // now remove it to see of hasChanges goes back to false.
        AtlasUnit.Assert.isTrue(ds.get_hasChanges());
        ds.removeLink(source, "targets1", target);
        AtlasUnit.Assert.isFalse(ds.get_hasChanges(), "Removing an added link should revert hasChanges.");
        // add it back..
        ds.addLink(source, "targets1", target);
        // add to a field that is already an array
        ds.addLink(source, "targets2", target);
        // add then remove a link
        var target2 = {};
        ds.addLink(source, "targets2", target2);
        ds.removeLink(source, "targets2", target2);
        // remove then add a link
        ds.removeLink(source, "targets2", existingTarget);
        ds.addLink(source, "targets2", existingTarget);
        
        // add a one-to-x link
        ds.setLink(source, "singleTarget1", singleTarget1);
        // double set a one-to-x link
        ds.setLink(source, "singleTarget1", singleTarget2);
        // remove an existing one-to-x link by setting to null
        ds.setLink(source, "singleTarget2", null);

        // verify proper references
        AtlasUnit.Assert.isTrue(source.targets1 instanceof Array, "Field should be converted to an array.");
        AtlasUnit.Assert.areEqual(1, source.targets1.length, "You shouldnt be able to add the same link more than once.");
        AtlasUnit.Assert.areEqual(target, source.targets1[0]);
        AtlasUnit.Assert.areEqual(2, source.targets2.length, "targets2 should have existingTarget and the new target.");
        AtlasUnit.Assert.areEqual(target, source.targets2[0], "The new target should be first in the array since existing target was removed then re-added.");
        AtlasUnit.Assert.areEqual(singleTarget2, source.singleTarget1, "singleTarget1 is a one-to-many link and should be set to the last one set.");
        AtlasUnit.Assert.isNull(source.singleTarget2, "singleTarget2 is a one-to-many link and should be null after setLink(null) called on it.");

        // verify changeset
        AtlasUnit.Assert.isTrue(ds.get_hasChanges());
        var changes = ds.get_changes();
        AtlasUnit.Assert.areEqual(4, changes.length, "Four changes should be logged.");
        var change1 = changes[0];
        AtlasUnit.Assert.areEqual(Sys.Data.ChangeOperationType.insert, change1.action, "addLink results in inserts.");
        AtlasUnit.Assert.isNull(change1.item, "Item should be null for link changes.");
        AtlasUnit.Assert.areEqual(source, change1.linkSource, "linkSource1");
        AtlasUnit.Assert.areEqual(target, change1.linkTarget, "linkTarget1");
        AtlasUnit.Assert.areEqual("targets1", change1.linkSourceField);
        var change2 = changes[1];
        AtlasUnit.Assert.areEqual(Sys.Data.ChangeOperationType.insert, change2.action, "addLink results in inserts.");
        AtlasUnit.Assert.isNull(change2.item, "Item should be null for link changes.");
        AtlasUnit.Assert.areEqual(source, change2.linkSource, "linkSource2");
        AtlasUnit.Assert.areEqual(target, change2.linkTarget, "linkTarget2");
        AtlasUnit.Assert.areEqual("targets2", change2.linkSourceField);
        var change3 = changes[2];
        AtlasUnit.Assert.areEqual(Sys.Data.ChangeOperationType.update, change3.action, "setLink results in updates.");
        AtlasUnit.Assert.isNull(change3.item, "Item should be null for link changes.");
        AtlasUnit.Assert.areEqual(source, change3.linkSource, "linkSource3");
        AtlasUnit.Assert.areEqual(singleTarget2, change3.linkTarget, "linkTarget3");
        AtlasUnit.Assert.areEqual("singleTarget1", change3.linkSourceField);
        var change4 = changes[3];
        AtlasUnit.Assert.areEqual(Sys.Data.ChangeOperationType.update, change4.action, "setLink results in updates.");
        AtlasUnit.Assert.isNull(change4.item, "Item should be null for link changes.");
        AtlasUnit.Assert.areEqual(source, change4.linkSource, "linkSource4");
        AtlasUnit.Assert.isNull(change4.linkTarget, "linkTarget4");
        AtlasUnit.Assert.areEqual("singleTarget2", change4.linkSourceField);
    }

    this.testTrackChangesArray = function() {
        var sender = null, args = null, data = [{ id: 1, foo: "foo1" }, { id: 2, foo: "foo2"}];
        ds.add_propertyChanged(function(s, a) {
            sender = s;
            args = a;
        });
        ds.set_saveChangesTimeout(5);
        ds.set_serviceUri("uri");
        ds.set_saveOperation("update");
        ds.trackData(data);
        ds.initialize();
        AtlasUnit.Assert.isFalse(ds.get_hasChanges());
        // add an item then remove it and ensure hasChanges goes back to false
        var addedDeleted = { id: -1, foo: "Added&Deleted" };
        ds.insertEntity(addedDeleted);
        AtlasUnit.Assert.isTrue(ds.get_hasChanges());
        ds.removeEntity(addedDeleted);
        AtlasUnit.Assert.isFalse(ds.get_hasChanges(), "Removed an inserted entity and there were no other changes, hasChanges should revert to false.");
        
        // add an item (change 0)
        var added = { id: 3, foo: "foo3" };
        ds.insertEntity(added);
        AtlasUnit.Assert.isNotNull(sender, "PropertyChanged event should have fired.");
        AtlasUnit.Assert.areEqual("hasChanges", args.get_propertyName());
        AtlasUnit.Assert.isTrue(ds.get_hasChanges(), "Should have tracked change to the data -- added an item.");
        // edit existing item (change 1)
        Sys.Observer.setValue(data[1], "foo", "fooEdit1");
        Sys.Observer.setValue(data[1], "foo", "fooEdit2");
        // edit added item (no change)
        Sys.Observer.setValue(added, "foo", "foo3Edit");
        // edit item that will be deleted (no change)
        Sys.Observer.setValue(data[0], "foo", "foo1Edit");
        // delete first item (change 2)
        ds.removeEntity(data[0]);
        // add an item then delete it (no change)
        ds.insertEntity(addedDeleted);
        ds.removeEntity(addedDeleted);
        // save changes...
        ds.saveChanges();

        //var parameters = invoke.parameters;
        var request = helper.verifyRequest({ uri: "uri", method: "update", useGet: false, timeout: 5 });
        //var changeSet = helper.invoke.parameters.changeSet;
        var changeSet = request.parameters.changeSet;
        AtlasUnit.Assert.isNotNull(changeSet || null, "Parameter should be 'changeSet'");
        AtlasUnit.Assert.isTrue(changeSet instanceof Array, "changeSet should be an array.");
        AtlasUnit.Assert.areEqual(3, changeSet.length);
        this.verifyChangeSet(Sys.Data.ChangeOperationType.insert, { id: 3, foo: "foo3Edit" }, changeSet[0]);
        this.verifyChangeSet(Sys.Data.ChangeOperationType.update, { id: 2, foo: "fooEdit2" }, changeSet[1]);
        this.verifyChangeSet(Sys.Data.ChangeOperationType.remove, { id: 1, foo: "foo1Edit" }, changeSet[2]);

        AtlasUnit.Assert.isTrue(ds.get_hasChanges(), "HasChanges should be false WHILE saving.");
        request.succeededCallback([]);
        AtlasUnit.Assert.isFalse(ds.get_hasChanges(), "HasChanges should be false after saving completes.");
        AtlasUnit.Assert.elementsEqual([], ds.get_changes(), "Changes should be empty after saving.");
        AtlasUnit.Assert.isNotNull(sender, "PropertyChanged event should have fired now that haschanges is false, was true.");

        // trigger a change again...
        ds.insertEntity({ id: 88, foo: "foo88" });
        AtlasUnit.Assert.isTrue(ds.get_hasChanges(), "More changes have been made.");
        sender = args = null;
        ds.trackData([]);
        AtlasUnit.Assert.isFalse(ds.get_hasChanges(), "Changing the data property should reset changes.");
        AtlasUnit.Assert.isNotNull(sender, "PropertyChanged event should have fired that haschanges is false, was true, because the data was changed.");
    }

}
Sys.Data.Test.DataContextTest.registerClass("Sys.Data.Test.DataContextTest");
Sys.Data.Test.DataContextTest["AtlasUnit.IsTestFixture"] = true;
