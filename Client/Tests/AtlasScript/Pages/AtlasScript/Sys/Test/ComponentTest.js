/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("Sys.Test");

Sys.Test.ComponentTest = function() {
    // ************************************
    // Using components
    this.testDisposing = function() {
        var log = null;

        function handler(source, args) {
            log = "disposing " + source.get_id();
        }

        var c = new Sys.Test.ComponentTest.Component();
        c.add_disposing(handler);
        c.set_id(" a b ");
        c.dispose();
        AtlasUnit.Assert.areEqual("disposing  a b ", log);

        log = "";
        c.dispose();
        AtlasUnit.Assert.areEqual("", log);

        c = new Sys.Test.ComponentTest.Component();
        c.add_disposing(handler);
        c.set_id("a");
        c.remove_disposing(handler);
        c.dispose();
        AtlasUnit.Assert.areEqual("", log);
    }

    this.testIsInitialized = function() {
        var c = new Sys.Test.ComponentTest.Component();
        AtlasUnit.Assert.isFalse(c.get_isInitialized());
        c.initialize();
        AtlasUnit.Assert.isTrue(c.get_isInitialized());
        c.dispose();
    }

    this.testIsUpdating = function() {
        var c = new Sys.Test.ComponentTest.Component();
        AtlasUnit.Assert.isFalse(c.get_isUpdating());
        c.beginUpdate();
        AtlasUnit.Assert.isTrue(c.get_isUpdating());
        c.endUpdate();
        AtlasUnit.Assert.isFalse(c.get_isUpdating());
        AtlasUnit.Assert.isTrue(c.get_isInitialized());
        c.dispose();
    }

    this.testPropertyChanged = function() {
        var log = '';

        function change(sender, args) {
            AtlasUnit.Assert.instanceOfType(Sys.PropertyChangedEventArgs, args);
            log += args.get_propertyName() + ': ' + sender['get_' + args.get_propertyName()]();
        }

        var c = new Sys.Test.ComponentTest.Component();
        AtlasUnit.Assert.areEqual('', log);
        c.add_propertyChanged(change);
        c.set_raisesChange('change');
        AtlasUnit.Assert.areEqual('raisesChange: change', log);
        c.dispose();
    }

    this.testSetIdTwice = function() {
        var c = new Sys.Test.ComponentTest.Component();
        c.set_id("ok");
        c.set_id("toolate");
    }
    this.testSetIdTwice["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: The id property of a component can't be set more than once."
    };
    this.testSetIdTwice["AtlasUnit.Categories"] = ["DebugOnly"];

    // ************************************
    // Creating components
    this.testCreateAlias = function() {
        AtlasUnit.Assert.areEqual(Sys.Component.create, $create);
    }

    this.testCreateComponent = function() {
        var log = null;

        function handler(source, args) {
            log = source.get_simple();
        }

        var c = $create(Sys.Test.ComponentTest.Component, {
            id: "component",
            simple: 42,
            complex: {
                a: "a",
                b: "b",
                c: {d: "d"},
                d: [1, 2, 3],
                n: {a: "a"}
            },
            complexSettable: {
                a: "a",
                b: "b",
                c: {d: "d"},
                d: [1, 2, 3]
            },
            component: {
                id: "subcomponent",
                simple: 8,
                complex: {
                    u: "uu"
                },
                initiallyNull: "set"
            },
            array: [
                12,
                "string",
                {
                    a: "a",
                    b: "b"
                }
            ],
            field: 63
        }, {
            event: handler
        });

        AtlasUnit.Assert.isTrue(c.get_isInitialized());
        AtlasUnit.Assert.isFalse(c.get_isUpdating());
        AtlasUnit.Assert.areEqual(c, Sys.Application.findComponent("component"));
        AtlasUnit.Assert.isNull(c.initiallyNull);

        AtlasUnit.Assert.areEqual("component", c.get_id());
        AtlasUnit.Assert.areEqual(42, c.get_simple());
        AtlasUnit.Assert.areEqual(63, c.field);

        var complex = c.get_complex();
        AtlasUnit.Assert.areEqual("u", complex.u);
        AtlasUnit.Assert.areEqual("a", complex.a);
        AtlasUnit.Assert.areEqual("b", complex.b);
        AtlasUnit.Assert.areEqual("d", complex.c.d);
        AtlasUnit.Assert.elementsEqual([1, 2, 3], complex.d);
        AtlasUnit.Assert.areEqual("a", complex.n.a);

        var complexSettable = c.get_complexSettable();
        AtlasUnit.Assert.areEqual("a", complexSettable.a);
        AtlasUnit.Assert.areEqual("b", complexSettable.b);
        AtlasUnit.Assert.areEqual("d", complexSettable.c.d);
        AtlasUnit.Assert.elementsEqual([1, 2, 3], complexSettable.d);

        var component = c.get_component();
        AtlasUnit.Assert.areEqual("subcomponent", component.get_id());
        AtlasUnit.Assert.areEqual(8, component.get_simple());
        AtlasUnit.Assert.areEqual("uu", component.get_complex().u);
        AtlasUnit.Assert.areEqual("set", component.initiallyNull);

        var array = c.get_array();
        AtlasUnit.Assert.areEqual(1, array[0]);
        AtlasUnit.Assert.areEqual(2, array[1]);
        AtlasUnit.Assert.areEqual(12, array[2]);
        AtlasUnit.Assert.areEqual("string", array[3]);

        var arrayComplex = array[4];
        AtlasUnit.Assert.areEqual("a", arrayComplex.a);
        AtlasUnit.Assert.areEqual("b", arrayComplex.b);

        c.raiseEvent();
        AtlasUnit.Assert.areEqual(42, log);
        c.dispose();
    }

    this.testCreateComponentReferenceNotFound = function() {
        $create(Sys.Test.ComponentTest.Component, {}, {}, {reference: "unknownComponent"});
    }
    this.testCreateComponentReferenceNotFound["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: Component 'unknownComponent' was not found."
    };
    this.testCreateComponentReferenceNotFound["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testCreateComponentWithElement = function() {
        var c = $create(Sys.Test.ComponentTest.Component, {readOnly: 0}, {}, null, document.createElement('DIV'));
    }
    this.testCreateComponentWithElement["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        message: "Sys.ArgumentException: Value must be null for Components that are not Controls or Behaviors.\nParameter name: element"
    };
    this.testCreateComponentWithElement["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testCreateArrayOnNonArray = function() {
        var c = $create(Sys.Test.ComponentTest.Component, {complex: [1, 2]}, {});
    }
    this.testCreateArrayOnNonArray["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: 'complex' is not an Array property."
    };
    this.testCreateArrayOnNonArray["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testCreateObjectOnNull = function() {
        var c = $create(Sys.Test.ComponentTest.Component, {complexNull: {d: "d"}}, {});
    }
    this.testCreateObjectOnNull["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: Cannot set the properties of 'complexNull' because it returned a null value."
    };
    this.testCreateObjectOnNull["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testCreateObjectOnUndefined = function() {
        var c = $create(Sys.Test.ComponentTest.Component, {complexUndefined: {d: "d"}}, {});
    }
    this.testCreateObjectOnUndefined["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: Cannot set the properties of 'complexUndefined' because it returned a null value."
    };
    this.testCreateObjectOnUndefined["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testCreateNotAProperty = function() {
        var c = $create(Sys.Test.ComponentTest.Component, {ThisIsNotAnExistingPropertyOrField: 3}, {});
        AtlasUnit.Assert.areEqual(3, c.ThisIsNotAnExistingPropertyOrField);
    }

    this.testCreateSetReadOnly = function() {
        var c = $create(Sys.Test.ComponentTest.Component, {readOnly: 0}, {});
    }
    this.testCreateSetReadOnly["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: 'readOnly' is not a writable property."
    };
    this.testCreateSetReadOnly["AtlasUnit.Categories"] = ["DebugOnly"];

    // ************************************
    // Creating Controls
    this.testCreateControl = function() {
        var elt = document.createElement('DIV');
        var c = $create(Sys.Test.ComponentTest.Control, {element: {ex: 'testCreateControl'}}, {}, null, elt);
        AtlasUnit.Assert.areEqual(elt, c.get_element());
        AtlasUnit.Assert.areEqual(c, elt.control);
        AtlasUnit.Assert.areEqual('testCreateControl', elt.ex);
        c.dispose();
    }

    this.testCreateControlWithoutElement = function() {
        var c = $create(Sys.Test.ComponentTest.Control, {ex: 'testCreateControlWithoutElement'}, {});
    }
    this.testCreateControlWithoutElement["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        message: "Sys.ArgumentException: Value must not be null for Controls and Behaviors.\nParameter name: element"
    };
    this.testCreateControlWithoutElement["AtlasUnit.Categories"] = ["DebugOnly"];

    // ************************************
    // Creating Behaviors
    this.testCreateBehavior = function() {
        var elt = document.createElement('DIV');
        var c = $create(Sys.Test.ComponentTest.Behavior, {name: "customExpando"}, {}, null, elt);
        AtlasUnit.Assert.areEqual(elt, c.get_element());
        AtlasUnit.Assert.areEqual(c, elt.customExpando);
        c.dispose();

        elt.id = 'Sys.Test.ComponentTest.MyDiv';
        c = $create(Sys.Test.ComponentTest.Behavior, {}, {}, null, elt);
        AtlasUnit.Assert.areEqual(elt, c.get_element());
        AtlasUnit.Assert.areEqual(c, $find('Sys.Test.ComponentTest.MyDiv$Behavior'));
        c.dispose();
    }

    this.testCreateBehaviorWithId = function() {
        var elt = document.createElement('DIV');
        elt.id = 'Sys.Test.ComponentTest.MyDiv';
        var behaviorId = "Sys.Test.ComponentTest.MyBehaviorWithId";
        var c = $create(Sys.Test.ComponentTest.Behavior, {id: behaviorId}, {}, null, elt);
        AtlasUnit.Assert.areEqual(elt, c.get_element());
        AtlasUnit.Assert.areEqual(c, $find(behaviorId));
        c.dispose();
    }

    this.testCreateBehaviorWithoutElement = function() {
        var c = $create(Sys.Test.ComponentTest.Behavior, {}, {});
    }
    this.testCreateBehaviorWithoutElement["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        message: "Sys.ArgumentException: Value must not be null for Controls and Behaviors.\nParameter name: element"
    };
    this.testCreateBehaviorWithoutElement["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testChangeIdAfterCreation = function() {
        var elt = document.createElement('DIV');
        elt.id = 'Sys.Test.ComponentTest.MyDiv';
        var c = $create(Sys.Test.ComponentTest.Behavior, {}, {}, null, elt);
        AtlasUnit.Assert.areEqual(c, $find('Sys.Test.ComponentTest.MyDiv$Behavior'));

        try {
            c.set_id("Sys.Test.ComponentTest.AlreadyAdded");
        }
        catch (e) {
            throw e;
        }
        finally {
            c.dispose();
        }
    }
    this.testChangeIdAfterCreation["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: The id property of a component can't be set after it's been added to the Application object."
    };
    this.testChangeIdAfterCreation["AtlasUnit.Categories"] = ["DebugOnly"];

    // ************************************
    // Two-pass creation
    this.testCreateComponentTwoPass = function() {
        Sys.Application.beginCreateComponents();

        var log = null;

        function handler(source, args) {
            log = source.get_simple();
        }

        var a = $create(Sys.Test.ComponentTest.Component, {
            id: "componentA",
            simple: 42
        }, {
            event: handler
        }, {
            reference: "componentB"
        });
        AtlasUnit.Assert.areEqual("componentA", a.get_id());
        AtlasUnit.Assert.areEqual(42, a.get_simple());
        a.raiseEvent();
        AtlasUnit.Assert.areEqual(42, log);
        AtlasUnit.Assert.isNull(a.get_reference());
        AtlasUnit.Assert.isFalse(a.get_isInitialized());

        var b = $create(Sys.Test.ComponentTest.Component, {
            id: "componentB",
            simple: 43
        }, {
            event: handler
        }, {
            reference: "componentA"
        });
        AtlasUnit.Assert.areEqual("componentB", b.get_id());
        AtlasUnit.Assert.areEqual(43, b.get_simple());
        b.raiseEvent();
        AtlasUnit.Assert.areEqual(43, log);
        AtlasUnit.Assert.isNull(b.get_reference());
        AtlasUnit.Assert.isFalse(b.get_isInitialized());

        Sys.Application.endCreateComponents();

        AtlasUnit.Assert.areEqual(b, a.get_reference());
        AtlasUnit.Assert.areEqual(a, b.get_reference());
        AtlasUnit.Assert.isTrue(a.get_isInitialized());
        AtlasUnit.Assert.isTrue(b.get_isInitialized());

        var c = $create(Sys.Test.ComponentTest.Component, {}, {}, {
            reference: "componentA"
        });
        AtlasUnit.Assert.areEqual(a, c.get_reference());
        a.dispose();
        b.dispose();
        c.dispose();
    }
}
Sys.Test.ComponentTest.registerClass("Sys.Test.ComponentTest");
Sys.Test.ComponentTest["AtlasUnit.IsTestFixture"] = true;

Sys.Test.ComponentTest.Component = function() {
    Sys.Test.ComponentTest.Component.initializeBase(this);
    this._complex = {u: "u", n: null};
    this._array = [1, 2];
}
Sys.Test.ComponentTest.Component.prototype = {
    _simple: -1,
    _complexSettable: null,
    _component: null,
    _raisesChange: null,
    _reference: null,
    field: 0,
    initiallyNull: null,
    get_array: function() {
        return this._array;
    },
    get_complex: function() {
        return this._complex;
    },
    get_complexNull: function() {
        return null;
    },
    get_complexUndefined: function() {
        return undefined;
    },
    get_complexSettable: function() {
        return this._complexSettable;
    },
    set_complexSettable: function(value) {
        this._complexSettable = value;
    },
    get_component: function() {
        if (!this._component) this._component = new Sys.Test.ComponentTest.Component();
        return this._component;
    },
    get_readOnly: function() {
        return "read only";
    },
    get_raisesChange: function() {
        return this._raisesChange;
    },
    set_raisesChange: function(value) {
        this._raisesChange = value;
        this.raisePropertyChanged("raisesChange");
    },
    get_reference: function() {
        return this._reference;
    },
    set_reference: function(value) {
        this._reference = value;
    },
    get_simple: function() {
        return this._simple;
    },
    set_simple: function(value) {
        // Setting to zero if set while not updating (shouldn't happen)
        this._simple = this.get_isUpdating() ? value : 0;
    },
    add_event: function(handler) {
        this.get_events().addHandler('event', handler);
    },
    remove_event: function(handler) {
        this.get_events().removeHandler('event', handler);
    },
    raiseEvent: function() {
        var h = this.get_events().getHandler('event');
        if (h) h(this, Sys.EventArgs.Empty);
    }
}
Sys.Test.ComponentTest.Component.registerClass('Sys.Test.ComponentTest.Component', Sys.Component);

Sys.Test.ComponentTest.NotAComponent = function() {}
Sys.Test.ComponentTest.NotAComponent.registerClass('Sys.Test.ComponentTest.NotAComponent');

Sys.Test.ComponentTest.Control = function(element) {Sys.Test.ComponentTest.Control.initializeBase(this, [element]);}
Sys.Test.ComponentTest.Control.registerClass('Sys.Test.ComponentTest.Control', Sys.UI.Control);

Sys.Test.ComponentTest.Behavior = function(element) {Sys.Test.ComponentTest.Behavior.initializeBase(this, [element]);}
Sys.Test.ComponentTest.Behavior.registerClass('Sys.Test.ComponentTest.Behavior', Sys.UI.Behavior);

