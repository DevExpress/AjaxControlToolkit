Type.registerNamespace("Sys.Test");

Sys.Test.ObserverTest = function() {
    this.setUp = function() {
        this.obj = {};
        this.o = Sys.Observer.makeObservable(this.obj);
        this.arr = [];
        this.a = Sys.Observer.makeObservable(this.arr);
        this.ob = Sys.Observer;
        this.objWithDot = { foo: { bar: { dar: "Seattle"}} };
        this.oDot = Sys.Observer.makeObservable(this.objWithDot);
    }

    this.verifyMethods = function(methods, obj) {
        for (var m in methods) {
            AtlasUnit.Assert.areEqual(methods[m], obj[m], "Method mismatch '" + m + "'");
        }
    }

    this.verifySetValue = function(o) {
        o.setValue("foo", "bar");
        AtlasUnit.Assert.areEqual("bar", o.foo);
        o.set_bar = function(value) { this._bar = value; };
        o.setValue("bar", "baz");
        AtlasUnit.Assert.areEqual("baz", o._bar);
        o.setValue("foo", null);
        AtlasUnit.Assert.isNull(o.foo);
    }

    this.verifySetValueWithDot = function(o) {
        o.setValue("foo.bar.dar", "Redmond");
        AtlasUnit.Assert.areEqual("Redmond", o.foo.bar.dar);
        o.foo.get_bar = function() { return this.bar; };
        o.foo.get_bar().set_dar = function(value) { this.dar = value; };
        o.setValue("foo.bar.dar", "Bellevue");
        AtlasUnit.Assert.areEqual("Bellevue", o.foo.get_bar().dar);
    }

    this.verifyNotifyPropertyChanged = function(o) {
        var sender, args;
        function changed(s, a) {
            sender = s;
            args = a;
        }
        o.add_propertyChanged(changed);
        o.setValue("foo", 88);
        AtlasUnit.Assert.areEqual(o, sender, "Event was not raised, or the sender should be the object.");
        AtlasUnit.Assert.isNotNull(args, "event should have property changed args");
        AtlasUnit.Assert.areEqual("foo", args.get_propertyName());
        sender = args = null;
        o.setValue("foo", 88);
        AtlasUnit.Assert.isNull(args, "Setting the same value shouldn't raise a changed event.");
        o.foo = { bar: "aaa" };
        o.setValue("foo.bar", "bbb");
        AtlasUnit.Assert.areEqual("bbb", o.foo.bar);
        AtlasUnit.Assert.areEqual(o, sender, "Event was not raised with a sub property.");
        AtlasUnit.Assert.areEqual("foo", args.get_propertyName(), "First field in a subproperty path should be what changed.");
        sender = args = null;
        o.remove_propertyChanged(changed);
        o.setValue("foo", 89);
        AtlasUnit.Assert.isNull(sender);
        AtlasUnit.Assert.isNull(args);
    }

    this.verifyActions = function(actualItems, expectedItems) {
        AtlasUnit.Assert.areEqual(expectedItems.length, actualItems.length, "Action count mismatch.");
        for (var i = 0; i < expectedItems.length; i++) {
            this.verifyAction(expectedItems[i], actualItems[i]);
        }
    }

    this.verifyAction = function(expectedItem, actualItem) {
        AtlasUnit.Assert.areEqual(expectedItem.action, actualItem.action, "Action incorrect.");
        var desc = "(" + Sys.NotifyCollectionChangedAction.toString(actualItem.action) + ": " + (expectedItem.newItems ? expectedItem.newItems.join(',') : (expectedItem.oldItems ? expectedItem.oldItems.join(',') : "n/a")) + ")";
        if (expectedItem.newItems) {
            AtlasUnit.Assert.elementsEqual(expectedItem.newItems, actualItem.newItems, "newItems " + desc);
        }
        else {
            AtlasUnit.Assert.isNull(actualItem.newItems, "newItems " + desc);
        }
        AtlasUnit.Assert.areEqual(expectedItem.newStartingIndex, actualItem.newStartingIndex, "newStartingIndex " + desc);
        if (expectedItem.oldItems) {
            AtlasUnit.Assert.elementsEqual(expectedItem.oldItems, actualItem.oldItems, "oldItems " + desc);
        }
        else {
            AtlasUnit.Assert.isNull(actualItem.oldItems, "oldItems " + desc);
        }
        AtlasUnit.Assert.areEqual(expectedItem.oldStartingIndex, actualItem.oldStartingIndex, "oldStartingIndex " + desc);
    }

    this.testConstructor = function() {
        new Sys.Observer();
    }
    this.testConstructor["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testConstructor["AtlasUnit.ExpectedException"] = {
        message: "Sys.InvalidOperationException: Operation is not valid due to the current state of the object."
    }

    this.testObserveSetupObject = function() {
        AtlasUnit.Assert.areEqual(this.obj, this.o, "observe should return the same object");
        AtlasUnit.Assert.areEqual(this.o, Sys.Observer.makeObservable(this.o), "observe should return the same object");
        this.verifyMethods(Sys.Observer._observeMethods, this.o);
        this.o.raisePropertyChanged = "foo";
        Sys.Observer.makeObservable(this.o);
        AtlasUnit.Assert.areEqual("foo", this.o.raisePropertyChanged, "Reobserve should not need to recreate the methods.");
    }

    this.testObserveSetupArray = function() {
        AtlasUnit.Assert.areEqual(this.arr, this.a, "observe should return the same object");
        AtlasUnit.Assert.areEqual(this.a, Sys.Observer.makeObservable(this.a), "observe should return the same object");
        this.verifyMethods(Sys.Observer._observeMethods, this.a);
        this.verifyMethods(Sys.Observer._arrayMethods, this.a);
        this.a.raisePropertyChanged = "foo";
        Sys.Observer.makeObservable(this.a);
        AtlasUnit.Assert.areEqual("foo", this.a.raisePropertyChanged, "Reobserve should not need to recreate the methods.");
    }

    this.testSetValueObject = function() {
        this.verifySetValue(this.o);
    }

    this.testSetValueObjectWithDot = function() {
        this.verifySetValueWithDot(this.oDot);
    }

    this.testSetValueArray = function() {
        this.verifySetValue(this.a);
    }

    this.testSetValueRaisesPropertyChangedObject = function() {
        this.verifyNotifyPropertyChanged(this.o);
    }

    this.testSetValueRaisesPropertyChangedArray = function() {
        this.verifyNotifyPropertyChanged(this.a);
    }

    this.testEventHandler = function() {
        var fs = null, fa = null, bs = null, ba = null;
        function fooHandler(s, a) {
            fs = s;
            fa = a;
        }
        function barHandler(s, a) {
            bs = s;
            ba = a;
        }
        var o = this.o;
        o.addEventHandler("foo", fooHandler);
        o.addEventHandler("bar", barHandler);
        o.raiseEvent("baz", Sys.EventArgs.Empty);
        AtlasUnit.Assert.isNull(fs, "foo sender");
        AtlasUnit.Assert.isNull(fa, "foo args");
        AtlasUnit.Assert.isNull(bs, "bar sender");
        AtlasUnit.Assert.isNull(ba, "bar args");
        o.raiseEvent("foo", Sys.EventArgs.Empty);
        AtlasUnit.Assert.areEqual(o, fs, "foo sender");
        AtlasUnit.Assert.areEqual(Sys.EventArgs.Empty, fa, "foo args");
        AtlasUnit.Assert.isNull(bs, "bar sender (after foo raised)");
        AtlasUnit.Assert.isNull(ba, "bar args (after foo raised)");
        fs = fa = null;
        o.raiseEvent("bar", Sys.EventArgs.Empty);
        AtlasUnit.Assert.areEqual(o, bs, "bar sender");
        AtlasUnit.Assert.areEqual(Sys.EventArgs.Empty, ba, "bar args");
        AtlasUnit.Assert.isNull(fs, "foo sender (after bar raised)");
        AtlasUnit.Assert.isNull(fa, "foo args (after bar raised)");
        o.removeEventHandler("foo", fooHandler);
        o.raiseEvent("foo", Sys.EventArgs.Empty);
        AtlasUnit.Assert.isNull(fs, "foo sender (after foo removed)");
        AtlasUnit.Assert.isNull(fa, "foo args (after foo removed)");
    }

    this.testArrayMethods = function() {
        this.a.add(1);
        this.a.addRange([2, 3, 5, null, 'a']);
        this.a.insert(3, 4);
        AtlasUnit.Assert.isTrue(this.a.remove('a'), "Remove should remove 'a'.");
        this.a.removeAt(5);
        AtlasUnit.Assert.areEqual("1, 2, 3, 4, 5", this.a.join(', '));
    }

    this.testBeginEndUpdateObject = function() {
        var args, changed = false;
        function onchanged(s, a) {
            changed = true;
            args = a;
        }
        this.o.add_propertyChanged(onchanged);
        this.o.beginUpdate();
        AtlasUnit.Assert.isTrue(this.o.get_isUpdating(), "get_isUpdating after beginUpdate");
        this.o.endUpdate();
        AtlasUnit.Assert.isFalse(this.o.get_isUpdating(), "get_isUpdating after endUpdate");
        AtlasUnit.Assert.isFalse(changed, "propertyChange shouldnt fire since nothing was changed.");
        this.o.beginUpdate();
        this.o.setValue("foo", 1);
        AtlasUnit.Assert.isFalse(changed, "propertyChange shouldnt fire since component is updating.");
        this.o.endUpdate();
        AtlasUnit.Assert.isTrue(changed, "propertyChange should fire after endUpdate since component is dirty.");
        AtlasUnit.Assert.areEqual("", args.get_propertyName(), "batched events have no property name.");
    }

    this.testBeginUpdateArray = function() {
        var args, changes, changed = false;
        function onchanged(s, a) {
            changed = true;
            args = a;
            changes = a.get_changes();
        }
        this.a.add_collectionChanged(onchanged);
        this.a.beginUpdate();
        AtlasUnit.Assert.isTrue(this.a.get_isUpdating(), "get_isUpdating after beginUpdate");
        this.a.endUpdate();
        AtlasUnit.Assert.isFalse(this.a.get_isUpdating(), "get_isUpdating after endUpdate");
        AtlasUnit.Assert.isFalse(changed, "propertyChange shouldnt fire since nothing was changed.");
        this.a.beginUpdate();
        this.a.add(1); // [1]
        this.a.add(2); // [1,2]
        this.a.remove(2); // [1]
        this.a.addRange([4, 5, null, 'b']); // [1,4,5,null,'b']
        this.a.remove(null); // [1,4,5,'b']
        this.a.removeAt(3); // [1,4,5]
        this.a.insert(0, 'a'); // ['a',1,4,5]
        this.a.clear(); // []
        AtlasUnit.Assert.isFalse(changed, "propertyChange shouldnt fire since component is updating.");
        this.a.endUpdate();
        AtlasUnit.Assert.isTrue(changed, "propertyChange should fire after endUpdate since component is dirty.");
        this.verifyActions(changes, [new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, 1, 0),
                                     new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, 2, 1),
                                     new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.remove, null, -1, 2, 1),
                                     new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, [4, 5, null, 'b'], 1),
                                     new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.remove, null, -1, [null], 3),
                                     new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.remove, null, -1, 'b', 3),
                                     new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, 'a', 0),
                                     new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.reset, null, null, ['a',1,4,5], 0)]);
    }

    this.testCollectionChanged = function() {
        var sender = null, args;
        function changed(s, e) {
            sender = s;
            args = e;
        }
        var a = this.a;
        a.add_collectionChanged(changed);
        a.add(1); // [1]
        AtlasUnit.Assert.isNotNull(sender, "collectionChanged event was not raised.");
        AtlasUnit.Assert.elementsEqual([1], a);
        AtlasUnit.Assert.areEqual(a, sender);
        this.verifyActions(args.get_changes(), [new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, [1], 0, null, -1)]);
        a.add(2); // [1,2]
        AtlasUnit.Assert.elementsEqual([1, 2], a);
        this.verifyActions(args.get_changes(), [new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, [2], 1, null, -1)]);
        a.addRange([3, 4]); // [1,2,3,4]
        AtlasUnit.Assert.elementsEqual([1, 2, 3, 4], a);
        this.verifyActions(args.get_changes(), [new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, [3, 4], 2, null, -1)]);
        a.insert(1, 5); // [1,5,2,3,4]
        AtlasUnit.Assert.elementsEqual([1, 5, 2, 3, 4], a);
        this.verifyActions(args.get_changes(), [new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, [5], 1, null, -1)]);
        a.remove(5); // [1,2,3,4]
        AtlasUnit.Assert.elementsEqual([1, 2, 3, 4], a);
        this.verifyActions(args.get_changes(), [new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.remove, null, -1, [5], 1)]);
        a.removeAt(2); // [1,2,4]
        AtlasUnit.Assert.elementsEqual([1, 2, 4], a);
        this.verifyActions(args.get_changes(), [new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.remove, null, -1, [3], 2)]);
        a.clear();
        AtlasUnit.Assert.elementsEqual([], a);
        this.verifyActions(args.get_changes(), [new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.reset, null, -1, [1,2,4], 0)]);
    }
}
Sys.Test.ObserverTest.registerClass("Sys.Test.ObserverTest");
Sys.Test.ObserverTest["AtlasUnit.IsTestFixture"] = true;
Sys.Test.ObserverTest.Component = function() {
    Sys.Test.ObserverTest.Component.initializeBase(this);
}
Sys.Test.ObserverTest.Component.prototype = {
    _text: null,
    get_text: function() {
        return this._text;
    },
    set_text: function(value) {
       this._text = value;
       this.raisePropertyChanged('text');
    }
}
Sys.Test.ObserverTest.Component.registerClass('Sys.Test.ObserverTest.Component', Sys.Component);
