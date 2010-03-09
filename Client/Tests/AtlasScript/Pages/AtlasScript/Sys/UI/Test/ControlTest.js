/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("Sys.UI.Test");

Sys.UI.Test.ControlTest = function() {
    this.testInstantiate = function() {
        var element = document.createElement('DIV');
        var control = new Sys.UI.Test.ControlTest.Control(element);

        AtlasUnit.Assert.areEqual(control, element.control);
        AtlasUnit.Assert.areEqual(element, control.get_element());
    }

    this.testBubble = function() {
        var element = document.createElement('DIV');
        element.id = "control1";
        var control1 = new Sys.UI.Test.ControlTest.Control(element);
        element = document.createElement('DIV');
        element.id = "control2";
        var control2 = new Sys.UI.Test.ControlTest.Control(element);
        element = document.createElement('DIV');
        element.id = "control3";
        var control3 = new Sys.UI.Test.ControlTest.Control(element);
        element = document.createElement('DIV');
        element.id = "control4";
        var control4 = new Sys.UI.Test.ControlTest.Control(element);
        control4.set_parent(control3);
        control3.set_parent(control2);
        control2.set_parent(control1);
        control2.setBubbles(false);
        Sys.UI.Test.ControlTest.Control.log = '';

        control4.raiseBubbleEvent(this, Sys.EventArgs.Empty);

        AtlasUnit.Assert.areEqual("control3 control2 ", Sys.UI.Test.ControlTest.Control.log);
    }

    this.testCssClass = function() {
        var element = document.createElement('DIV');
        var control = new Sys.UI.Test.ControlTest.Control(element);
        control.addCssClass('foo');
        AtlasUnit.Assert.areEqual('foo', control.get_element().className);
        control.addCssClass('bar');
        AtlasUnit.Assert.areEqual('foo bar', control.get_element().className);
        control.addCssClass('foo');
        AtlasUnit.Assert.areEqual('foo bar', control.get_element().className);
        control.removeCssClass('bar');
        AtlasUnit.Assert.areEqual('foo', control.get_element().className);
        control.toggleCssClass('foo');
        AtlasUnit.Assert.areEqual('', control.get_element().className);
        control.toggleCssClass('bar');
        AtlasUnit.Assert.areEqual('bar', control.get_element().className);
        control.toggleCssClass('foo');
        AtlasUnit.Assert.areEqual('bar foo', control.get_element().className);
    }

    this.testDispose = function() {
        var element = document.createElement('DIV');
        var control = new Sys.UI.Test.ControlTest.Control(element);
        AtlasUnit.Assert.areEqual(control, element.control);
        control.dispose();

        AtlasUnit.Assert.isNull(element.control);
        AtlasUnit.Assert.areEqual('undefined', typeof(control._element));

        // reattach after dispose
        control = new Sys.UI.Test.ControlTest.Control(element);
        AtlasUnit.Assert.areEqual(control, element.control);
        control.dispose();
        AtlasUnit.Assert.isNull(element.control);
    }

    this.testDisposeTwiceBeforeInit = function() {
        var element = document.createElement('DIV');
        var control = new Sys.UI.Test.ControlTest.Control(element);
        control.dispose();
        control.dispose();
        AtlasUnit.Assert.areEqual('', control.get_id());
    }

    this.testDuplicateControl = function() {
        var element = document.createElement('DIV');
        var control = new Sys.UI.Test.ControlTest.Control(element);
        var otherControl = new Sys.UI.Test.ControlTest.Control(element);
    }
    this.testDuplicateControl["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: A control is already associated with the element."
    };
    this.testDuplicateControl["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testId = function() {
        var element = document.createElement('DIV');
        element.id = "elementId";
        var control = new Sys.UI.Test.ControlTest.Control(element);

        AtlasUnit.Assert.areEqual(element.id, control.get_id());
    }

    this.testIdSetter = function() {
        var element = document.createElement('DIV');
        var control = new Sys.UI.Test.ControlTest.Control(element);
        control.set_id("foo");
        AtlasUnit.Assert.areEqual("foo", control.get_id());
    }

    this.testParent = function() {
        var element = document.createElement('DIV');
        var child = document.createElement('DIV');
        element.appendChild(child);
        var grandchild = document.createElement('DIV');
        child.appendChild(grandchild);
        var control = new Sys.UI.Test.ControlTest.Control(element);
        var otherControl = new Sys.UI.Test.ControlTest.Control(grandchild);

        AtlasUnit.Assert.isNull(control.get_parent());
        AtlasUnit.Assert.areEqual(control, otherControl.get_parent());

        var yetAnotherElement = document.createElement('DIV');
        var yetAnotherControl = new Sys.UI.Test.ControlTest.Control(yetAnotherElement);
        otherControl.set_parent(yetAnotherControl);

        AtlasUnit.Assert.areEqual(yetAnotherControl, otherControl.get_parent());
    }

    this.testParentLoop = function() {
        var elementA = document.createElement('DIV');
        var controlA = new Sys.UI.Test.ControlTest.Control(elementA);
        var elementB = document.createElement('DIV');
        var controlB = new Sys.UI.Test.ControlTest.Control(elementB);
        var elementC = document.createElement('DIV');
        var controlC = new Sys.UI.Test.ControlTest.Control(elementC);
        controlC.set_parent(controlB);
        controlB.set_parent(controlA);
        controlA.set_parent(controlC);
    }
    this.testParentLoop["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: The chain of control parents can't have circular references."
    };
    this.testParentLoop["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testParentSelf = function() {
        var element = document.createElement('DIV');
        var control = new Sys.UI.Test.ControlTest.Control(element);
        control.set_parent(control);
    }
    this.testParentSelf["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: The chain of control parents can't have circular references."
    };
    this.testParentSelf["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRole = function() {
        var element = document.createElement('DIV'), 
            control = new Sys.UI.Test.ControlTest.Control(element);
        AtlasUnit.Assert.areEqual("TestControl", element.getAttribute("role"));
    }

    this.testVisible = function() {
        var element = document.createElement('DIV');
        // DevDiv Bugs 119484: Opera 9.2 and Safari 2 -- style.visibility/display is empty for unattached dom elements.
        document.body.appendChild(element);
        try {
            var control = new Sys.UI.Test.ControlTest.Control(element);

            AtlasUnit.Assert.isTrue(control.get_visible());
            AtlasUnit.Assert.areEqual(Sys.UI.VisibilityMode.collapse, control.get_visibilityMode());

            control.set_visibilityMode(Sys.UI.VisibilityMode.hide);
            control.set_visible(false);

            AtlasUnit.Assert.isFalse(control.get_visible());
            AtlasUnit.Assert.areEqual('hidden', element.style.visibility);
            AtlasUnit.Assert.areEqual('block', element.style.display);

            control.set_visibilityMode(Sys.UI.VisibilityMode.collapse);

            AtlasUnit.Assert.isFalse(control.get_visible());
            AtlasUnit.Assert.areEqual('hidden', element.style.visibility);
            AtlasUnit.Assert.areEqual('none', element.style.display);

            control.set_visible(true);

            AtlasUnit.Assert.isTrue(control.get_visible());
            AtlasUnit.Assert.areEqual('visible', element.style.visibility);
            AtlasUnit.Assert.areEqual('block', element.style.display);
        }
        finally {
            document.body.removeChild(element);
        }
    }
}
Sys.UI.Test.ControlTest.registerClass("Sys.UI.Test.ControlTest");
Sys.UI.Test.ControlTest["AtlasUnit.IsTestFixture"] = true;

Sys.UI.Test.ControlTest.Control = function(element) {
    Sys.UI.Test.ControlTest.Control.initializeBase(this, [element]);
}
Sys.UI.Test.ControlTest.Control.prototype = {
    _bubbles: true,
    get_role: function() {
        return "TestControl";
    },
    onBubbleEvent: function(source, args) {
        Sys.UI.Test.ControlTest.Control.log += this.get_id() + " ";
        return !this._bubbles;
    },
    setBubbles: function(value) {
        this._bubbles = value;
    }
}
Sys.UI.Test.ControlTest.Control.registerClass('Sys.UI.Test.ControlTest.Control', Sys.UI.Control);

