/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("AtlasScript.Test");

AtlasScript.Test.TypeInheritanceTest = function() {
    this._getMyself = function() {
        return new AtlasScript.Test.TypeInheritanceTest.Employee('Nikhil', 'Kothari', 'nikhilko', 'Web.NET', 'Architect');
    }

    this._getTestPerson = function() {
        return new AtlasScript.Test.TypeInheritanceTest.Person('Seema', 'Khincha', 'seemapk@yahoo.com');
    }

    this.testCallBaseMethodInstanceWrongType = function() {
        var instance = new AtlasScript.Test.TypeInheritanceTest.Person();
        AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.callBaseMethod(instance, "method1");
    }
    this.testCallBaseMethodInstanceWrongType["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentTypeException',
        message: "Sys.ArgumentTypeException: Object of type 'AtlasScript.Test.TypeInheritanceTest.Person' cannot be converted to type 'AtlasScript.Test.TypeInheritanceTest.PrototypeDerived'.\nParameter name: instance"
    };
    this.testCallBaseMethodInstanceWrongType["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testCallBaseMethodNotFound = function() {
        var derived = new AtlasScript.Test.TypeInheritanceTest.PrototypeDerived();
        AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.callBaseMethod(derived, "noSuchMethod");
    }
    this.testCallBaseMethodNotFound["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: No method found with name 'noSuchMethod'."
    };
    this.testCallBaseMethodNotFound["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testCallBaseMethodNoArguments = function() {
        var derived = new AtlasScript.Test.TypeInheritanceTest.PrototypeDerived();
        AtlasUnit.Assert.areEqual("PrototypeDerived.method2, PrototypeBase.method2", derived.method2());
    }

    this.testCallBaseMethodArgumentsUndefined = function() {
        var instance = new AtlasScript.Test.TypeInheritanceTest.PrototypeDerived();
        AtlasUnit.Assert.areEqual(
            "PrototypeBase.method1: undefined",
            AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.callBaseMethod(instance, "method1", undefined));
    }

    this.testCallBaseMethodArgumentsNull = function() {
        var instance = new AtlasScript.Test.TypeInheritanceTest.PrototypeDerived();
        AtlasUnit.Assert.areEqual(
            "PrototypeBase.method1: undefined",
            AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.callBaseMethod(instance, "method1", null));
    }

    this.testCallBaseMethodArgumentsEmpty = function() {
        var instance = new AtlasScript.Test.TypeInheritanceTest.PrototypeDerived();
        AtlasUnit.Assert.areEqual(
            "PrototypeBase.method1: undefined",
            AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.callBaseMethod(instance, "method1", []));
    }

    this.testCallBaseMethodArgumentsElementUndefined = function() {
        var instance = new AtlasScript.Test.TypeInheritanceTest.PrototypeDerived();
        AtlasUnit.Assert.areEqual(
            "PrototypeBase.method1: undefined",
            AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.callBaseMethod(instance, "method1", [undefined]));
    }

    this.testCallBaseMethodArgumentsElementNull = function() {
        var instance = new AtlasScript.Test.TypeInheritanceTest.PrototypeDerived();
        AtlasUnit.Assert.areEqual(
            "PrototypeBase.method1: null",
            AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.callBaseMethod(instance, "method1", [null]));
    }

    this.testCallBaseMethodArgumentsString = function() {
        var derived = new AtlasScript.Test.TypeInheritanceTest.PrototypeDerived();
        AtlasUnit.Assert.areEqual(
            "PrototypeDerived.method1: testValue, PrototypeBase.method1: testValue",
            derived.method1("testValue"));
    }

    this.testClosureFromPrototype = function() {
        var closure = new AtlasScript.Test.TypeInheritanceTest.Closure();
        AtlasUnit.Assert.areEqual("PrototypeBase.field1", closure.field1);
        AtlasUnit.Assert.areEqual("PrototypeBase.method1: foo:Closure.method1", closure.method1("foo"));
        AtlasUnit.Assert.areEqual("PrototypeBase.method2", closure.method2());
    }

    this.testGetBaseMethodInstanceWrongType = function() {
        var instance = new AtlasScript.Test.TypeInheritanceTest.Person();
        AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.getBaseMethod(instance, "method1");
    }
    this.testGetBaseMethodInstanceWrongType["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentTypeException',
        message: "Sys.ArgumentTypeException: Object of type 'AtlasScript.Test.TypeInheritanceTest.Person' cannot be converted to type 'AtlasScript.Test.TypeInheritanceTest.PrototypeDerived'.\nParameter name: instance"
    };
    this.testGetBaseMethodInstanceWrongType["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testGetBaseMethodRootType = function() {
        AtlasUnit.Assert.isNull(Object.getBaseMethod({}, "toString"),
            "Base toString method for Object expected to be null.");
    }

    this.testGetBaseMethodPrototype = function() {
        var derived = new AtlasScript.Test.TypeInheritanceTest.PrototypeDerived();

        AtlasUnit.Assert.areEqual(AtlasScript.Test.TypeInheritanceTest.PrototypeBase.prototype.method1,
            AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.getBaseMethod(derived, "method1"));
    }

    this.testGetBaseMethodPrototypeNameNotFound = function() {
        var derived = new AtlasScript.Test.TypeInheritanceTest.PrototypeDerived();

        AtlasUnit.Assert.areEqual(null,
            AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.getBaseMethod(derived, "noSuchMethod"));
    }

    this.testGetBaseMethodPrototypeNotFunction = function() {
        var derived = new AtlasScript.Test.TypeInheritanceTest.PrototypeDerived();

        AtlasUnit.Assert.areEqual(null,
            AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.getBaseMethod(derived, "field1"));
    }

    this.testGetNameElement = function() {
        var elem = document.createElement("DIV");
        var type = Object.getType(elem);
        AtlasUnit.Assert.areEqual("Object", type.getName());
    }

    this.testInheritsFrom = function() {
        AtlasUnit.Assert.isTrue(AtlasScript.Test.TypeInheritanceTest.Employee.inheritsFrom(AtlasScript.Test.TypeInheritanceTest.Person),
            "Employee should inherit from Person.");
    }

    this.testInheritsFromSelf = function() {
        AtlasUnit.Assert.isFalse(AtlasScript.Test.TypeInheritanceTest.Employee.inheritsFrom(AtlasScript.Test.TypeInheritanceTest.Employee),
            "Employee should not inherit from itself.");
    }

    this.testInitializeBaseWrongType = function() {
        var instance = new AtlasScript.Test.TypeInheritanceTest.Person();
        AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.initializeBase(instance);
    }
    this.testInitializeBaseWrongType["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentTypeException',
        message: "Sys.ArgumentTypeException: Object of type 'AtlasScript.Test.TypeInheritanceTest.Person' cannot be converted to type 'AtlasScript.Test.TypeInheritanceTest.PrototypeDerived'.\nParameter name: instance"
    };
    this.testInitializeBaseWrongType["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testInitializeBaseArgumentsUndefined = function() {
        var instance = new AtlasScript.Test.TypeInheritanceTest.PrototypeDerived();
        AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.initializeBase(instance, undefined);
        AtlasUnit.Assert.areEqual(undefined, instance.ctorParam);
    }

    this.testInitializeBaseArgumentsNull = function() {
        var instance = new AtlasScript.Test.TypeInheritanceTest.PrototypeDerived();
        AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.initializeBase(instance, null);
        AtlasUnit.Assert.areEqual(undefined, instance.ctorParam);
    }

    this.testInitializeBaseArgumentsEmpty = function() {
        var instance = new AtlasScript.Test.TypeInheritanceTest.PrototypeDerived();
        AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.initializeBase(instance, []);
        AtlasUnit.Assert.areEqual(undefined, instance.ctorParam);
    }

    this.testInitializeBaseArgumentsElementUndefined = function() {
        var instance = new AtlasScript.Test.TypeInheritanceTest.PrototypeDerived();
        AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.initializeBase(instance, [undefined]);
        AtlasUnit.Assert.areEqual(undefined, instance.ctorParam);
    }

    this.testInitializeBaseArgumentsElementNull = function() {
        var instance = new AtlasScript.Test.TypeInheritanceTest.PrototypeDerived();
        AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.initializeBase(instance, [null]);
        AtlasUnit.Assert.areEqual(null, instance.ctorParam);
    }

    this.testIsInstanceOfType = function() {
        var aPerson = this._getMyself();
        AtlasUnit.Assert.instanceOfType(AtlasScript.Test.TypeInheritanceTest.Employee, aPerson,
            "Expected to be an instance of an Employee.");
        AtlasUnit.Assert.instanceOfType(AtlasScript.Test.TypeInheritanceTest.Person, aPerson,
            "Expected to be an instance of an Employee.");

        aPerson = this._getTestPerson();
        AtlasUnit.Assert.notInstanceOfType(AtlasScript.Test.TypeInheritanceTest.Employee, aPerson,
            "Not expected to be an instance of an Employee.");
        AtlasUnit.Assert.instanceOfType(AtlasScript.Test.TypeInheritanceTest.Person, aPerson,
            "Expected to be an instance of an Employee.");

        var inheritsFromRemoved = new AtlasScript.Test.TypeInheritanceTest.InheritsFromRemoved();
        Object.getType(inheritsFromRemoved).inheritsFrom = null;
        AtlasUnit.Assert.notInstanceOfType(AtlasScript.Test.TypeInheritanceTest.Employee, new Object(inheritsFromRemoved),
            "Not expected to be an instance of an Employee.");

        AtlasUnit.Assert.instanceOfType(Number, 0, "Expected to be an instance of a Number.");
        AtlasUnit.Assert.instanceOfType(Boolean, false, "Expected to be an instance of a Boolean.");
        AtlasUnit.Assert.notInstanceOfType(Boolean, null,
            "Not expected to be an instance of a Boolean.");

        AtlasUnit.Assert.notInstanceOfType(Boolean, undefined,
            "Not expected to be an instance of a Boolean.");

        AtlasUnit.Assert.notInstanceOfType(Boolean, {},
            "Not expected to be an instance of a Boolean.");

        AtlasUnit.Assert.instanceOfType(Object, {},
            "Expected to be an instance of Object.");
    }

    this.testIsInstanceOfTypeElement = function() {
        var aElement = document.createElement("DIV");
        AtlasUnit.Assert.instanceOfType(Object, aElement, "HTML element expected to be of type object.");
    }

    this.testGetFirstName = function() {
        var aPerson = this._getMyself();
        AtlasUnit.Assert.areEqual("Nikhil", aPerson.get_firstName());

        var testPerson = this._getTestPerson();
        AtlasUnit.Assert.areEqual("Seema", testPerson.get_firstName());
    }

    this.testInstanceMethod = function() {
        var aPerson = this._getMyself();
        AtlasUnit.Assert.areEqual("nikhilko@microsoft.com", aPerson.sendMail('Hello', 'This is a test mail.'),
            "Not sent to the expected receiver.");

        aPerson = this._getTestPerson();
        AtlasUnit.Assert.areEqual("seemapk@yahoo.com", aPerson.sendMail('Hello', 'This is a test mail.'),
            "Not sent to the expected receiver.");
    }

    this.testOverrideMethod = function() {
        var aPerson = this._getMyself();
        AtlasUnit.Assert.isNotNull(aPerson.get_group, "Employee does not have the function get_group().");

        var testPerson = this._getTestPerson();
        // Cannot use Assert.isUndefined, since it causes a warning in FireFox
        AtlasUnit.Assert.isTrue((testPerson.get_group === undefined), "Person does have the function get_group().");
    }

    this.testResolveInheritance = function() {
        // For this test to be repeatable, we need to create unique class names on the fly
        var dt = new Date();
        var name = "AtlasScript.Test.TypeInheritanceTest.ResolveInheritance" +
            dt.getTime() +
            Math.round(Math.random() * 1000000);

        var base1 = eval(name + "Base1 = function() {}");
        base1.prototype = {
            a: 'a',
            b: function() {return 'b';},
            c: function() {return 'd';}
        }
        base1.registerClass(name + "Base1");

        var base2 = eval(name + "Base2 = function() {}");
        var overridden = 'b overridden';
        base2.prototype = {
            b: function() {return overridden;},
            d: 'd',
            e: function() {return 'e';}
        }
        base2.registerClass(name + "Base2", base1);

        var derived = eval(name + "Derived = function() {}");
        derived.prototype = {
            f: 'f',
            g: function() {return 'g';}
        }
        derived.registerClass(name + "Derived", base2);

        // Before any instance is created, and before resolveInheritance is called,
        // the base type prototypes should not be present.
        AtlasUnit.Assert.isTrue(typeof(derived.prototype.a) === 'undefined', "derived.prototype.a should not be defined.");
        AtlasUnit.Assert.isTrue(typeof(derived.prototype.b) === 'undefined', "derived.prototype.b should not be defined.");
        AtlasUnit.Assert.isTrue(typeof(derived.prototype.c) === 'undefined', "derived.prototype.c should not be defined.");
        AtlasUnit.Assert.isTrue(typeof(derived.prototype.d) === 'undefined', "derived.prototype.d should not be defined.");
        AtlasUnit.Assert.isTrue(typeof(derived.prototype.e) === 'undefined', "derived.prototype.e should not be defined.");

        AtlasUnit.Assert.isTrue(typeof(base2.prototype.a) === 'undefined', "base2.prototype.a should not be defined.");
        AtlasUnit.Assert.isTrue(typeof(base2.prototype.c) === 'undefined', "base2.prototype.c should not be defined.");

        // After inheritance has been resolved, all derived types should get the members of their parents.
        derived.resolveInheritance();
        AtlasUnit.Assert.areEqual(base1.prototype.a, derived.prototype.a);
        AtlasUnit.Assert.areEqual(base2.prototype.b, derived.prototype.b);
        AtlasUnit.Assert.areEqual(base1.prototype.c, derived.prototype.c);
        AtlasUnit.Assert.areEqual(base2.prototype.d, derived.prototype.d);
        AtlasUnit.Assert.areEqual(base2.prototype.e, derived.prototype.e);

        AtlasUnit.Assert.areEqual(base1.prototype.a, base2.prototype.a);
        AtlasUnit.Assert.areEqual(base1.prototype.c, base2.prototype.c);
    }

// TODO: reactivate this when we support strings as base types.
//    // Tests a class with a base class that has not been registered using registerClass().
//    this.testUnregisteredBaseClass = function() {
//        AtlasScript.Test.TypeInheritanceTest.UnregisteredDerived.inheritsFrom(AtlasScript.Test.TypeInheritanceTest.PrototypeBase);
//    }
//    this.testUnregisteredBaseClass["AtlasUnit.ExpectedException"] = { }
}
AtlasScript.Test.TypeInheritanceTest.registerClass("AtlasScript.Test.TypeInheritanceTest");
AtlasScript.Test.TypeInheritanceTest["AtlasUnit.IsTestFixture"] = true;

AtlasScript.Test.TypeInheritanceTest.Person = function(firstName, lastName, alias) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._alias = alias;
}
function AtlasScript$Test$OOPTest$Inheritance$Person$get_firstName() {
    return this._firstName;
}
function AtlasScript$Test$OOPTest$Inheritance$Person$get_lastName() {
    return this._lastName;
}
function AtlasScript$Test$OOPTest$Inheritance$Person$get_alias() {
    return this._alias;
}
function AtlasScript$Test$OOPTest$Inheritance$Person$set_alias(alias) {
    this._alias = alias;
}
function AtlasScript$Test$OOPTest$Inheritance$Person$get_name() {
    return this._firstName + ' ' + this._lastName;
}
function AtlasScript$Test$OOPTest$Inheritance$Person$dispose() {
    //
}
function AtlasScript$Test$OOPTest$Inheritance$Person$sendMail() {
    var alias = this.get_alias();
    if (alias.indexOf('@') < 0) {
        alias = alias + '@microsoft.com';
    }
    return alias;
}
function AtlasScript$Test$OOPTest$Inheritance$Person$toString() {
    return this.get_name() + ' (' + this.get_alias() + ')';
}
AtlasScript.Test.TypeInheritanceTest.Person.prototype = {
    get_firstName: AtlasScript$Test$OOPTest$Inheritance$Person$get_firstName,
    get_lastName: AtlasScript$Test$OOPTest$Inheritance$Person$get_lastName,
    get_alias: AtlasScript$Test$OOPTest$Inheritance$Person$get_alias,
    set_alias: AtlasScript$Test$OOPTest$Inheritance$Person$set_alias,
    get_name: AtlasScript$Test$OOPTest$Inheritance$Person$get_name,
    dispose: AtlasScript$Test$OOPTest$Inheritance$Person$dispose,
    sendMail: AtlasScript$Test$OOPTest$Inheritance$Person$sendMail,
    toString: AtlasScript$Test$OOPTest$Inheritance$Person$toString
}
AtlasScript.Test.TypeInheritanceTest.Person.registerClass('AtlasScript.Test.TypeInheritanceTest.Person');

AtlasScript.Test.TypeInheritanceTest.Employee = function(firstName, lastName, alias, group, title) {
    AtlasScript.Test.TypeInheritanceTest.Employee.initializeBase(this, [firstName, lastName, alias]);

    this._group = group;
    this._title = title;
}
function AtlasScript$Test$OOPTest$Inheritance$Employee$get_group() {
    return this._group;
}
function AtlasScript$Test$OOPTest$Inheritance$Employee$set_group(group) {
    this._group = group;
}
function AtlasScript$Test$OOPTest$Inheritance$Employee$get_title() {
    return this._title;
}
function AtlasScript$Test$OOPTest$Inheritance$Employee$set_title(title) {
    this._title = title;
}
function AtlasScript$Test$OOPTest$Inheritance$Employee$toString() {
    return AtlasScript.Test.TypeInheritanceTest.Employee.callBaseMethod(this, 'toString') +
        '\r\n' + this.get_title() + '\r\n' + this.get_group();
}
AtlasScript.Test.TypeInheritanceTest.Employee.prototype = {
    get_group: AtlasScript$Test$OOPTest$Inheritance$Employee$get_group,
    set_group: AtlasScript$Test$OOPTest$Inheritance$Employee$set_group,

    get_title: AtlasScript$Test$OOPTest$Inheritance$Employee$get_title,
    set_title: AtlasScript$Test$OOPTest$Inheritance$Employee$set_title,

    toString: AtlasScript$Test$OOPTest$Inheritance$Employee$toString
}
AtlasScript.Test.TypeInheritanceTest.Employee.registerClass('AtlasScript.Test.TypeInheritanceTest.Employee',
    AtlasScript.Test.TypeInheritanceTest.Person);

AtlasScript.Test.TypeInheritanceTest.PrototypeBase = function(param1) {
    this.ctorParam = param1;
}
AtlasScript.Test.TypeInheritanceTest.PrototypeBase.prototype = {
    field1: "PrototypeBase.field1",
    method1: function(value) {
        return "PrototypeBase.method1: " + value;
    },
    method2: function() {
        return "PrototypeBase.method2";
    }
}
AtlasScript.Test.TypeInheritanceTest.PrototypeBase.registerClass('AtlasScript.Test.TypeInheritanceTest.PrototypeBase');

AtlasScript.Test.TypeInheritanceTest.Closure = function() {
    AtlasScript.Test.TypeInheritanceTest.Closure.initializeBase(this);

    this.method1 = function(value) {
        return AtlasScript.Test.TypeInheritanceTest.Closure.callBaseMethod(this, 'method1', [value]) +
            ":Closure.method1";
    }
}
AtlasScript.Test.TypeInheritanceTest.Closure.registerClass(
    'AtlasScript.Test.TypeInheritanceTest.Closure',
    AtlasScript.Test.TypeInheritanceTest.PrototypeBase);

AtlasScript.Test.TypeInheritanceTest.PrototypeDerived = function() {
}
AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.prototype = {
    method1: function(value) {
        var baseValue = AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.callBaseMethod(this, "method1", [value]);
        return "PrototypeDerived.method1: " + value + ", " + baseValue;
    },
    method2: function() {
        var baseValue = AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.callBaseMethod(this, "method2");
        return "PrototypeDerived.method2, " + baseValue;
    }
}
AtlasScript.Test.TypeInheritanceTest.PrototypeDerived.registerClass('AtlasScript.Test.TypeInheritanceTest.PrototypeDerived',
    AtlasScript.Test.TypeInheritanceTest.PrototypeBase);

AtlasScript.Test.TypeInheritanceTest.InheritsFromRemoved = function() {
}
AtlasScript.Test.TypeInheritanceTest.InheritsFromRemoved.registerClass("AtlasScript.Test.TypeInheritanceTest.InheritsFromRemoved");

AtlasScript.Test.TypeInheritanceTest.BadMethods = function() {
    this.field = 'field';
    this.method = function() {
    }
    AtlasScript.Test.TypeInheritanceTest.BadMethods.registerBaseMethod(this, 'method');
}
AtlasScript.Test.TypeInheritanceTest.BadMethods.registerClass('AtlasScript.Test.TypeInheritanceTest.BadMethods');

// TODO: reactivate this when we support strings as base types.
//AtlasScript.Test.TypeInheritanceTest.UnregisteredBase = function() {
//}
//AtlasScript.Test.TypeInheritanceTest.UnregisteredDerived = function() {
//}
//// Use string name of base type, instead of base type itself, to exercise a code path in
//// Function.prototype._setBases().
//AtlasScript.Test.TypeInheritanceTest.UnregisteredDerived.registerClass("AtlasScript.Test.TypeInheritanceTest.UnregisteredDerived",
//    "AtlasScript.Test.TypeInheritanceTest.UnregisteredBase");
