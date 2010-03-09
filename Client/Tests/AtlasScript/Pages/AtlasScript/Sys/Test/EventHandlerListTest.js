/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("Sys.Test");

Sys.Test.EventHandlerListTest = function() {
    this._sequenceLog = null;
    this._model = null;
    this._beforeAction = null;
    this._afterAction = null;
    this._handler1 = null;
    this._handler2 = null;

    this.setUp = function() {
        this._sequenceLog = [];

        this._model = new Sys.Test.EventHandlerListTest.TextModel();
        this._handler1 = Function.createDelegate(this, this._onModelPropertyChanged1);
        this._handler2 = Function.createDelegate(this, this._onModelPropertyChanged2);
    }

    this.testAddHandlerFromHandler = function() {
        var log = "";
        var handlerList = new Sys.EventHandlerList();
        handlerList.addHandler("test", function() {
            log += "test1";
            handlerList.addHandler("test", function() {
                log += " test2";
            });
        });
        handlerList.getHandler("test")();
        AtlasUnit.Assert.areEqual("test1", log);
    }

    this.testClearHandlerFromHandler = function() {
        var log = "";
        var handlerList = new Sys.EventHandlerList();

        function handler() {
            log += "test";
            handlerList.removeHandler("test", handler);
        }
        handlerList.addHandler("test", handler);
        handlerList.addHandler("test", handler);
        handlerList.getHandler("test")();
        AtlasUnit.Assert.areEqual("testtest", log);
    }

    this.testEvents = function() {
        AtlasUnit.Assert.isNull(this._model.get_propertyChangedHandler(),
            "The multicast handler should be null before any handler has been added.");

        this._model.add_propertyChanged(this._handler1);
        AtlasUnit.Assert.isNotNull(this._model.get_propertyChangedHandler(),
            "The multicast handler should not be null after a handler has been added.");
        this._model.add_propertyChanged(this._handler2);

        this._model.set_text("TestValue");
        AtlasUnit.Assert.areEqual("Handler 1", this._sequenceLog[0], "Handler 1 was expected to be activated.");
        AtlasUnit.Assert.areEqual("Handler 2", this._sequenceLog[1], "Handler 2 was expected to be activated.");

        Array.clear(this._sequenceLog);
        this._model.remove_propertyChanged(this._handler1);
        this._model.set_text("TestValue");
        AtlasUnit.Assert.areEqual("Handler 2", this._sequenceLog[0], "Handler 2 was expected to be activated.");

        Array.clear(this._sequenceLog);
        this._model.remove_propertyChanged(this._handler2);
        AtlasUnit.Assert.isNull(this._model.get_propertyChangedHandler(),
            "The multicast handler should be null after both handlers have been removed.");
        this._model.set_text("TestValue");
        AtlasUnit.Assert.areEqual(0, this._sequenceLog.length, "No handler expected to have been activated.");
    }

    this.testRemoveNonAddedHandler = function() {
        var handlerList = new Sys.EventHandlerList();
        var log = '';
        handlerList.addHandler('foo', function() {log += 'added'});
        handlerList.removeHandler('foo', function() {log += 'removed'});
        handlerList.getHandler('foo')();
        AtlasUnit.Assert.areEqual('added', log);
    }

    this.testRemoveNonExistingHandler = function() {
        var handlerList = new Sys.EventHandlerList();
        handlerList.removeHandler("ThisIdDoesNotExist", function() {});
    }

    // Private handlers
    this._onModelPropertyChanged1 = function(sender, eventArgs) {
        Array.add(this._sequenceLog, "Handler 1");
        AtlasUnit.Assert.areEqual("Text", eventArgs.getPropertyName(),
            "Expected Text property to be changed.");
    }

    this._onModelPropertyChanged2 = function(sender, eventArgs) {
        Array.add(this._sequenceLog, "Handler 2");
        AtlasUnit.Assert.areEqual("Text", eventArgs.getPropertyName(),
            "Expected Text property to be changed.");
    }
}
Sys.Test.EventHandlerListTest.registerClass("Sys.Test.EventHandlerListTest");
Sys.Test.EventHandlerListTest["AtlasUnit.IsTestFixture"] = true;

Sys.Test.EventHandlerListTest.PropertyChangedEventArgs = function(propertyName) {
    Sys.Test.EventHandlerListTest.PropertyChangedEventArgs.initializeBase(this);
    this._propertyName = propertyName;
}
Sys.Test.EventHandlerListTest.PropertyChangedEventArgs.prototype = {
    getPropertyName: function() {
        return this._propertyName;
    }
}
Sys.Test.EventHandlerListTest.PropertyChangedEventArgs.registerClass('Sys.Test.EventHandlerListTest.PropertyChangedEventArgs', Sys.EventArgs);

Sys.Test.EventHandlerListTest.Model = function() {
}
Sys.Test.EventHandlerListTest.Model.prototype = {
    add_propertyChanged: function(handler) {
        this._get_eventHandlerList().addHandler("propertyChanged", handler);
    },
    remove_propertyChanged: function(handler) {
        this._get_eventHandlerList().removeHandler("propertyChanged", handler);
    },
    get_propertyChangedHandler: function() {
        // This function would normally not be implemented. This is for testing only.
        return this._get_eventHandlerList().getHandler("propertyChanged");
    },
    raisePropertyChanged: function(propertyName) {
        var handler = this._get_eventHandlerList().getHandler("propertyChanged");
        if (handler) {
            handler(this, new Sys.Test.EventHandlerListTest.PropertyChangedEventArgs(propertyName));
        }
    },
    _get_eventHandlerList: function() {
        if (!this._events) {
            this._events = new Sys.EventHandlerList();
        }
        return this._events;
    }
}
Sys.Test.EventHandlerListTest.Model.registerClass('Sys.Test.EventHandlerListTest.Model');

Sys.Test.EventHandlerListTest.TextModel = function() {
    Sys.Test.EventHandlerListTest.TextModel.initializeBase(this);
}
Sys.Test.EventHandlerListTest.TextModel.prototype = {
    _text: '',

    get_text: function() {
        return this._text;
    },
    set_text: function(value) {
        this._text = value;
        this.raisePropertyChanged('Text');
    }
}
Sys.Test.EventHandlerListTest.TextModel.registerClass('Sys.Test.EventHandlerListTest.TextModel', Sys.Test.EventHandlerListTest.Model);

