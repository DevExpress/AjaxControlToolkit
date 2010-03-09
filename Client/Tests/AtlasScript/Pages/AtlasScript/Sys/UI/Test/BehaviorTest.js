/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("Sys.UI.Test");

Sys.UI.Test.BehaviorTest = function() {
    this.testInstantiate = function() {
        var element = document.createElement('DIV');
        var behavior = new Sys.UI.Test.BehaviorTest.Behavior(element);

        AtlasUnit.Assert.areEqual(behavior, Sys.UI.Behavior.getBehaviors(element)[0]);
        AtlasUnit.Assert.areEqual(element, behavior.get_element());
    }

    this.testDispose = function() {
        var element = document.createElement('DIV');
        var behavior = new Sys.UI.Test.BehaviorTest.Behavior(element);
        var name = "Sys.UI.Test.BehaviorTest.Behavior";
        behavior.set_name(name);
        behavior.initialize();
        AtlasUnit.Assert.isTrue(Array.contains(Sys.UI.Behavior.getBehaviors(element), behavior));
        AtlasUnit.Assert.isTrue(element._behaviors instanceof Array);
        behavior.dispose();

        AtlasUnit.Assert.isFalse(Array.contains(Sys.UI.Behavior.getBehaviors(element), behavior));
        AtlasUnit.Assert.isNull(Sys.UI.Behavior.getBehaviorByName(element, name));
        AtlasUnit.Assert.isNull(element._behaviors);
    }

    this.testDisposeTwiceBeforeInit = function() {
        var behavior = new Sys.UI.Test.BehaviorTest.Behavior(document.createElement('DIV'));
	    behavior.dispose();
	    behavior.dispose();
        AtlasUnit.Assert.areEqual('', behavior.get_id());
    }

    this.testDuplicateBehavior = function() {
        var element = document.createElement('DIV');
        var behavior = new Sys.UI.Test.BehaviorTest.Behavior(element);
        var name = "Sys.UI.Test.BehaviorTest.Behavior";
        behavior.set_name(name);
        behavior.initialize();
        var otherBehavior = new Sys.UI.Test.BehaviorTest.OtherBehavior(element);
        otherBehavior.set_name(name);
        otherBehavior.initialize();
    }
    this.testDuplicateBehavior["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: A behavior with name 'Sys.UI.Test.BehaviorTest.Behavior' already exists or it is the name of an existing property on the target element."
    };
    this.testDuplicateBehavior["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testGetBehaviorByName = function() {
        var element = document.createElement('DIV');
        var behavior = new Sys.UI.Test.BehaviorTest.Behavior(element);
        var name = "Sys.UI.Test.BehaviorTest.Behavior";
        behavior.set_name(name);
        behavior.initialize();

        AtlasUnit.Assert.areEqual(behavior, Sys.UI.Behavior.getBehaviorByName(element, name));
        AtlasUnit.Assert.isNull(Sys.UI.Behavior.getBehaviorByName(element, "nonExistantExpando"));
        AtlasUnit.Assert.isNull(Sys.UI.Behavior.getBehaviorByName(element, "className"));
    }

    this.testGetBehaviors = function() {
        var element = document.createElement('DIV');
        AtlasUnit.Assert.areEqual(0, Sys.UI.Behavior.getBehaviors(element).length);
        var behavior = new Sys.UI.Test.BehaviorTest.Behavior(element);
        var behaviors = Sys.UI.Behavior.getBehaviors(element);
        AtlasUnit.Assert.areEqual(1, behaviors.length);
        AtlasUnit.Assert.areEqual(behavior, behaviors[0]);
        // Checking that modifying the array does not modify the list of behaviors.
        Array.add(behaviors, {});
        AtlasUnit.Assert.areEqual(1, Sys.UI.Behavior.getBehaviors(element).length);
    }

    this.testGetBehaviorsByType = function() {
        var element = document.createElement('DIV');
        var behavior = new Sys.UI.Test.BehaviorTest.Behavior(element);
        var otherBehavior1 = new Sys.UI.Test.BehaviorTest.OtherBehavior(element);
        var otherBehavior2 = new Sys.UI.Test.BehaviorTest.OtherBehavior(element);

        AtlasUnit.Assert.elementsEqual([behavior],
            Sys.UI.Behavior.getBehaviorsByType(element, Sys.UI.Test.BehaviorTest.Behavior));
        AtlasUnit.Assert.elementsEqual([otherBehavior1, otherBehavior2],
            Sys.UI.Behavior.getBehaviorsByType(element, Sys.UI.Test.BehaviorTest.OtherBehavior));
    }

    this.testId = function() {
        var element = document.createElement('DIV');
        element.id = 'MyDiv';
        var behavior = new Sys.UI.Test.BehaviorTest.Behavior(element);
        var name = "Sys.UI.Test.BehaviorTest.Behavior";
        behavior.set_name(name);
        behavior.initialize();

        AtlasUnit.Assert.areEqual('MyDiv$Sys.UI.Test.BehaviorTest.Behavior', behavior.get_id());

        behavior = new Sys.UI.Test.BehaviorTest.Behavior(element);
        behavior.initialize();

        AtlasUnit.Assert.areEqual('MyDiv$Behavior', behavior.get_id());
    }

    this.testName = function() {
        var element = document.createElement('DIV');
        var behavior = new Sys.UI.Test.BehaviorTest.Behavior(element);

        AtlasUnit.Assert.areEqual('Behavior', behavior.get_name());

        AtlasUnit.Assert.isNull(Sys.UI.Behavior.getBehaviorByName(element, 'Behavior'));
        behavior.initialize();
        AtlasUnit.Assert.areEqual(behavior, element.Behavior);
        AtlasUnit.Assert.areEqual(behavior, Sys.UI.Behavior.getBehaviorByName(element, 'Behavior'));
    }

    this.testSetId = function() {
        var element = document.createElement('DIV');
        var behavior = new Sys.UI.Test.BehaviorTest.Behavior(element);
        behavior.set_id('someId');
        AtlasUnit.Assert.areEqual('someId', behavior.get_id());
    }

    this.testSetName = function() {
        var element = document.createElement('DIV');
        element.id = 'MyDiv';
        var behavior = new Sys.UI.Test.BehaviorTest.Behavior(element);
        var name = "Sys.UI.Test.BehaviorTest.Behavior";
        behavior.set_name(name);
        behavior.initialize();

        AtlasUnit.Assert.areEqual('MyDiv$Sys.UI.Test.BehaviorTest.Behavior', behavior.get_id());
        AtlasUnit.Assert.areEqual(behavior, element[name]);
    }
}
Sys.UI.Test.BehaviorTest.registerClass("Sys.UI.Test.BehaviorTest");
Sys.UI.Test.BehaviorTest["AtlasUnit.IsTestFixture"] = true;

Sys.UI.Test.BehaviorTest.Behavior = function(element) {
    Sys.UI.Test.BehaviorTest.Behavior.initializeBase(this, [element]);
}
Sys.UI.Test.BehaviorTest.Behavior.registerClass('Sys.UI.Test.BehaviorTest.Behavior', Sys.UI.Behavior);

Sys.UI.Test.BehaviorTest.OtherBehavior = function(element) {
    Sys.UI.Test.BehaviorTest.OtherBehavior.initializeBase(this, [element]);
}
Sys.UI.Test.BehaviorTest.OtherBehavior.registerClass('Sys.UI.Test.BehaviorTest.OtherBehavior', Sys.UI.Behavior);

