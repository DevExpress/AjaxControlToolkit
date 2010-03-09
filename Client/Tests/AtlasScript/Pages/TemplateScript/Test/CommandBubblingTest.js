Type.registerNamespace("Sys.Test");

Sys.Test.CommandBubblingTest = function() {
    this.setUp = function() {
        this._element = document.createElement('div');
        this._element.id = "div1";
        this._dv = new Sys.UI.DataView(this._element);
        this._div = document.createElement("div");
        this._div.innerHTML = "<span>{{ item }}</span>";
    }
    this.addHandler = function(object, eventName, handler) {
        Sys.Test.CommandBubblingTest._eventName = eventName;
        Sys.Test.CommandBubblingTest._element = object;
        Sys.Test.CommandBubblingTest._handler = handler;
    }
    this.raiseBubbleEvent = function(object, args) {
        Sys.Test.CommandBubblingTest._command = args.get_commandName();
        Sys.Test.CommandBubblingTest._args = args.get_commandArgument();
    }
    this.testCommandBubblingWithSyscommandSysargument = function() {
        var data = { foo: 'foovalue' }, e1 = document.createElement('div'),
            oldAddHandler = Sys.UI.DomEvent.addHandler, 
            oldRaiseBubble = Sys.UI.DomElement.raiseBubbleEvent;
        Sys.UI.DomEvent.addHandler = this.addHandler;
        Sys.UI.DomElement.raiseBubbleEvent = this.raiseBubbleEvent;

        e1.innerHTML = "<input sys:command='select' sys:commandargument='{{2}}'>";
        var template = new Sys.UI.Template(e1), container = document.createElement('div'),
            result = template.instantiateIn(container, data);
        result = template.instantiateIn(container, data);
        Sys.Test.CommandBubblingTest._handler(); // kick start the event bubbling. Do not need to test the
        // call to Sys.UI.DomElement.raiseBubbleEvent, which is already tested by the DomElementTest.
        // This will call Sys.UI.Template._getCommandHandler(name, argument, target)

        AtlasUnit.Assert.areEqual('click', Sys.Test.CommandBubblingTest._eventName, 
                                  "Event name for calling raiseBubbleEvent is wrong.");
        AtlasUnit.Assert.areEqual('select', Sys.Test.CommandBubblingTest._command, 
                                  "Command name is wrong.");
        AtlasUnit.Assert.areEqual(2, Sys.Test.CommandBubblingTest._args, "Args is wrong.");

        Sys.UI.DomEvent.addHandler = oldAddHandler;
        Sys.UI.DomElement.raiseBubbleEvent = oldRaiseBubble;
    }
    this.testCommandBubblingWithSyscommandSysargumentSyscommandtarget = function() {
        var data = { foo: 'foovalue' }, e1 = document.createElement('div'),
            oldAddHandler = Sys.UI.DomEvent.addHandler;
        Sys.UI.DomEvent.addHandler = this.addHandler;

        e1.innerHTML = "<div xmlns:mydiv='javascript:Sys.Test.CommandBubblingTest.Control' sys:attach='mydiv' id='mydivID'></div><input sys:command='select' sys:commandargument='{{2}}' sys:commandtarget='#mydivID'/>";
        var template = new Sys.UI.Template(e1), container = document.createElement('div'),
            result = template.instantiateIn(container, data);
        Sys.Test.CommandBubblingTest._handler(); // kick start the event bubbling. Do not need to test the
        // call to Sys.UI.DomElement.raiseBubbleEvent, which is already tested by the DomElementTest.
        // This will call Sys.UI.Template._getCommandHandler(name, argument, target)

        AtlasUnit.Assert.areEqual('click', Sys.Test.CommandBubblingTest._eventName, 
                                  "Event name for calling raiseBubbleEvent is wrong.");
        AtlasUnit.Assert.areEqual('select', Sys.Test.CommandBubblingTest._command, 
                                  "Command name is wrong.");
        AtlasUnit.Assert.areEqual(2, Sys.Test.CommandBubblingTest._args, "Args is wrong.");
        AtlasUnit.Assert.areEqual("mydivID0", Sys.Test.CommandBubblingTest._control.get_id(), "Target control is wrong.");

        Sys.UI.DomEvent.addHandler = oldAddHandler;
        result.dispose();
    }
    this.testOnBubbleEventInDataView = function() {
        this._dv.set_itemTemplate(this._div);
        this._dv.set_data([{ item: 1 }, { item: 2 }, { item: 3}]);
        this._dv.initialize();
        var results = this._dv.get_contexts();
        for (var l = results.length - 1; l > -1; l--) {
            var topElements = results[l].nodes, 
                topElementLength = topElements ? topElements.length : 0, j;
            for (j = 0; j < topElementLength; j++) {
                this._dv.onBubbleEvent(topElements[j],
                                       new Sys.CommandEventArgs('select', 'randomString', topElements[j]));
                AtlasUnit.Assert.areEqual(l, this._dv.get_selectedIndex(), 
                                          "obBubbleEvent sets incorrect selectedIndex");
            }
        }
    }
    this.testSetSelectedIndexInDataView = function() {
        this._dv.set_itemTemplate(this._div);
        this._dv.set_data([{ item: 1 }, { item: 2 }, { item: 3}]);
        this._dv.initialize();
        this._dv.set_selectedIndex(2);
        AtlasUnit.Assert.areEqual(2, this._dv.get_selectedIndex());

        var target = new Sys.Test.BindingTest.Component(),
            binding1 = $create(Sys.Binding, { target: target, targetProperty: 'text',
                source: this._dv, path: 'selectedIndex',
                mode: Sys.BindingMode.oneWay
            }),
            binding2 = $create(Sys.Binding, { target: target, targetProperty: 'form',
                source: this._dv, path: 'selectedData',
                mode: Sys.BindingMode.oneWay
            });
        this._dv.set_selectedIndex(1);
        AtlasUnit.Assert.areEqual(1, target.get_text());
        AtlasUnit.Assert.areEqual(2, target.get_form().item);
        this._dv.set_data(null);
        AtlasUnit.Assert.areEqual(-1, target.get_text());
        AtlasUnit.Assert.areEqual(null, target.get_form());
    }

    this.testGetSelectedDataInDataView = function() {
        this._dv.set_itemTemplate(this._div);
        this._dv.set_data([{ item: 1 }, { item: 2 }, { item: 3}]);
        this._dv.initialize();
        this._dv.set_selectedIndex(2);
        AtlasUnit.Assert.areEqual(3, this._dv.get_selectedData().item, "Get inccorect selectedData.");
        this._dv.set_selectedIndex(3);
        this._dv.get_selectedData();
    }
    this.testGetSelectedDataInDataView["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testGetSelectedDataInDataView["AtlasUnit.ExpectedException"] = {
        message: "Sys.ArgumentOutOfRangeException: Specified argument was out of the range of valid values.\nParameter name: value\nActual value was 3."
    }
    this.testSetCommand = function() {
        var e = document.createElement("div");
        var e2 = document.createElement("div");
        var addArgs;
        var fn;
        Sys.UI.DomEvent.addHandlerOld = Sys.UI.DomEvent.addHandler;
        Sys.UI.DomEvent.addHandler = function() {
            addArgs = arguments;
        }
        try {
            Sys.query(e).setCommand("foo", "arg", e2);
        }
        finally {
            Sys.UI.DomEvent.addHandler = Sys.UI.DomEvent.addHandlerOld;
            delete Sys.UI.DomEvent.addHandlerOld;
        }
        var sourceElements = addArgs[0];
        AtlasUnit.Assert.areEqual(e, sourceElements[0]);
        AtlasUnit.Assert.areEqual("click", addArgs[1]);
        fn = addArgs[2];
        var c = new Sys.UI.Control(e2);
        var source = null;        
        var commandArgs = null;
        c.onBubbleEvent = function(src, args) {
            source = src;
            commandArgs = args;
        };
        var evt = new Sys.UI.DomEvent({type:"click"});
        var originator = {};
        fn.call(originator, evt);
        AtlasUnit.Assert.areEqual(e2, source);
        AtlasUnit.Assert.areEqual(Sys.CommandEventArgs, Object.getType(commandArgs));
        AtlasUnit.Assert.areEqual(originator, commandArgs.get_commandSource());
        AtlasUnit.Assert.areEqual("foo", commandArgs.get_commandName());
        AtlasUnit.Assert.areEqual("arg", commandArgs.get_commandArgument());
        AtlasUnit.Assert.areEqual(evt, commandArgs.get_commandEvent());
    }
}
Sys.Test.CommandBubblingTest.registerClass("Sys.Test.CommandBubblingTest");
Sys.Test.CommandBubblingTest.Control = function(element) {
    Sys.Test.CommandBubblingTest.Control.initializeBase(this, [element]);
}
Sys.Test.CommandBubblingTest.Control.prototype = {
    onBubbleEvent: function(sender, args) {
        Sys.Test.CommandBubblingTest._command = args.get_commandName();
        Sys.Test.CommandBubblingTest._args = args.get_commandArgument();
        Sys.Test.CommandBubblingTest._control = this;
    }
}
Sys.Test.CommandBubblingTest.Control.registerClass('Sys.Test.CommandBubblingTest.Control', Sys.UI.Control);

Sys.Test.CommandBubblingTest["AtlasUnit.IsTestFixture"] = true;