/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("AtlasScript.Test");

AtlasScript.Test.TypeInterfaceTest = function() {

    this.testImplementsInterfaceCustomTypeDirect = function() {
        AtlasUnit.Assert.isTrue(
            AtlasScript.Test.TypeInterfaceTest.Pet.implementsInterface(AtlasScript.Test.TypeInterfaceTest.IPet));
    }

    this.testImplementsInterfaceCustomTypeBase = function() {
        AtlasUnit.Assert.isTrue(
            AtlasScript.Test.TypeInterfaceTest.Cat.implementsInterface(AtlasScript.Test.TypeInterfaceTest.IPet));
    }

    // Tests implementsInterface() on a class that has never been instantiated.  Needed
    // to exercise a certain code path in function.prototype._setBases()
    this.testImplementsInterfaceNeverInstantiated = function() {
        AtlasUnit.Assert.isFalse(
            AtlasScript.Test.TypeInterfaceTest.NeverInstantiated.implementsInterface(
                AtlasScript.Test.TypeInterfaceTest.IPet),
            "NeverInstantiated should not implement Sys.IDisposable");
    }

    this.testImplementsInterfaceNotImplementedBuiltinType = function() {
        // Builtin type Boolean does not implement IPet
        AtlasUnit.Assert.isFalse(Boolean.implementsInterface(AtlasScript.Test.TypeInterfaceTest.IPet));
    }

    this.testImplementsInterfaceNotImplementedCustomType = function() {
        AtlasUnit.Assert.isFalse(
            AtlasScript.Test.TypeInterfaceTest.Tiger.implementsInterface(AtlasScript.Test.TypeInterfaceTest.IPet));
    }

    this.testInterfaceMethod = function() {
        var cat = new AtlasScript.Test.TypeInterfaceTest.Cat('Kitty');
        this._processAnimal(cat, 'Cat', 'Pet Cat', 'Kitty');

        var tiger = new AtlasScript.Test.TypeInterfaceTest.Tiger();
        this._processAnimal(tiger, 'Tiger', 'Tiger', null);

        var dog = new AtlasScript.Test.TypeInterfaceTest.Dog('Joe');
        this._processAnimal(dog, 'Dog', 'Dog', 'Joe');

        var g = new AtlasScript.Test.TypeInterfaceTest.Garfield();
        this._processAnimal(g, 'Cat', 'Pet Cat ... its Garfield!', 'Garfield');
    }

    this._processAnimal = function(animal, expectedName, expectedCustomString, expectedFriendlyName) {
        AtlasUnit.Assert.areEqual(expectedName, animal.get_name(), "Unexpected name.");
        AtlasUnit.Assert.areEqual(expectedCustomString, animal.toStringCustom(), "Unexpected custom string.");
        if (AtlasScript.Test.TypeInterfaceTest.IPet.isImplementedBy(animal)) {
            AtlasUnit.Assert.areEqual(expectedFriendlyName, animal.get_friendlyName(), "Unexpected friendly name.");
        }
        else {
            AtlasUnit.Assert.isNull(expectedFriendlyName, "Animal was expected to implement IPet.");
        }
    }

    this.testInterfaceMethodNotImplemented = function() {
        var notImp = new AtlasScript.Test.TypeInterfaceTest.NotImplementedIPet('...');
        notImp.get_friendlyName();
    }
    this.testInterfaceMethodNotImplemented["AtlasUnit.ExpectedException"] = {
        name: 'Sys.NotImplementedException'
    };
    this.testInterfaceMethodNotImplemented["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testInterfaceMethodImplementedByBase = function() {
        var friendlyName = 'Some IPet';
        var instance = new AtlasScript.Test.TypeInterfaceTest.IPetImplementationFromBase(friendlyName);
        AtlasUnit.Assert.areEqual(friendlyName, instance.get_friendlyName());
    }

    this.testIsImplementedByUndefined = function() {
        AtlasUnit.Assert.isFalse(AtlasScript.Test.TypeInterfaceTest.IPet.isImplementedBy(undefined));
    }

    this.testIsImplementedByNull = function() {
        AtlasUnit.Assert.isFalse(AtlasScript.Test.TypeInterfaceTest.IPet.isImplementedBy(null));
    }

    this.testIsImplementedByCustomTypeDirect = function() {
        var pet = new AtlasScript.Test.TypeInterfaceTest.Pet("testName", "testFriendlyName");
        AtlasUnit.Assert.isTrue(AtlasScript.Test.TypeInterfaceTest.IPet.isImplementedBy(pet));
    }

    this.testIsImplementedByCustomTypeBase = function() {
        var cat = new AtlasScript.Test.TypeInterfaceTest.Cat('Kitty');
        AtlasUnit.Assert.isTrue(AtlasScript.Test.TypeInterfaceTest.IPet.isImplementedBy(cat));
    }

    this.testIsImplementedByNotImplementedBuiltinType = function() {
        // Builtin type Boolean does not implement IPet
        AtlasUnit.Assert.isFalse(AtlasScript.Test.TypeInterfaceTest.IPet.isImplementedBy(false));
    }

    this.testIsImplementedByNotImplementedCustomType = function() {
        var tiger = new AtlasScript.Test.TypeInterfaceTest.Tiger();
        AtlasUnit.Assert.isFalse(AtlasScript.Test.TypeInterfaceTest.IPet.isImplementedBy(tiger));
    }

    this.testIsImplementedByWithImplementsInterfaceRemoved = function() {
        var implementsInterfaceRemoved = new AtlasScript.Test.TypeInterfaceTest.ImplementsInterfaceRemoved();
        Object.getType(implementsInterfaceRemoved).implementsInterface = null;
        AtlasUnit.Assert.isFalse(AtlasScript.Test.TypeInterfaceTest.IPet.isImplementedBy(implementsInterfaceRemoved),
            "Cannot implement interface because Object.implementsInterface is set to null");
    }

    // Type.isInstanceOfType() should return true if the current Type is an interface
    // that the instance supports.
    this.testIsInstanceOfType = function() {
        var cat = new AtlasScript.Test.TypeInterfaceTest.Cat('Kitty');

        AtlasUnit.Assert.isTrue(AtlasScript.Test.TypeInterfaceTest.IPet.isInstanceOfType(cat));
        AtlasUnit.Assert.isFalse(AtlasScript.Test.TypeInterfaceTest.IPet.isInstanceOfType({}));
    }

    this.testNew = function() {
        var cat = new AtlasScript.Test.TypeInterfaceTest.Cat('Kitty');
        AtlasUnit.Assert.areEqual("Cat", cat.get_name(), "Name is not set properly.");
        AtlasUnit.Assert.areEqual("Kitty", cat.get_friendlyName(), "Friendly name is not set properly.");
        AtlasUnit.Assert.areEqual("meow", cat.speak(), "Cat has unexpected voice.");
    }

    this.testRegisterInterfaceComma = function() {
        AtlasScript.Test.TypeInterfaceTest.IInterface.registerInterface("foo,AtlasScript.Test.TypeInterfaceTest.IInterface");
    }
    this.testRegisterInterfaceComma["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        paramName: 'typeName',
        message: "Sys.ArgumentException: Value is not a valid type name.\nParameter name: typeName"
    };
    this.testRegisterInterfaceComma["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterInterfaceNonExisting = function() {
        AtlasScript.Test.TypeInterfaceTest.IPet.registerInterface("This.Does.Not.Exist");
    }
    this.testRegisterInterfaceNonExisting["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        paramName: 'typeName',
        message: 'Sys.ArgumentException: Value is not the name of an existing type.\nParameter name: typeName'
    };
    this.testRegisterInterfaceNonExisting["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterInterfaceWrongType = function() {
        AtlasScript.Test.TypeInterfaceTest.IPet.registerInterface("AtlasScript.Test.TypeInterfaceTest.Animal");
    }
    this.testRegisterInterfaceWrongType["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        paramName: 'typeName',
        message: 'Sys.ArgumentException: Value is not the name of the type being registered or the name is a reserved word.\nParameter name: typeName'
    };
    this.testRegisterInterfaceWrongType["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterInterfaceTwice = function() {
        AtlasScript.Test.TypeInterfaceTest.IPet.registerInterface("AtlasScript.Test.TypeInterfaceTest.IPet");
    }
    this.testRegisterInterfaceTwice["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: String.format('Sys.InvalidOperationException: Type {0} has already been registered. ' +
                               'The type may be defined multiple times or the script file that defines ' +
                               'it may have already been loaded. A possible cause is a change of settings ' +
                               'during a partial update.',
                               "AtlasScript.Test.TypeInterfaceTest.IPet")
    };
    this.testRegisterInterfaceTwice["AtlasUnit.Categories"] = ["DebugOnly"];
}
AtlasScript.Test.TypeInterfaceTest.registerClass("AtlasScript.Test.TypeInterfaceTest");
AtlasScript.Test.TypeInterfaceTest["AtlasUnit.IsTestFixture"] = true;


AtlasScript.Test.TypeInterfaceTest.IPet = function() {}
AtlasScript.Test.TypeInterfaceTest.IPet.prototype.get_friendlyName = function() {
    throw Error.notImplemented();
}
AtlasScript.Test.TypeInterfaceTest.IPet.registerInterface('AtlasScript.Test.TypeInterfaceTest.IPet');

AtlasScript.Test.TypeInterfaceTest.Animal = function(name) {
    this._name = name;
}
function AtlasScript$Test$OOPTest$Interface$Animal$get_name() {
    return this._name;
}
function AtlasScript$Test$OOPTest$Interface$Animal$toStringCustom() {
    return this.get_name();
}
AtlasScript.Test.TypeInterfaceTest.Animal.prototype = {
    get_name: AtlasScript$Test$OOPTest$Interface$Animal$get_name,

    toStringCustom: AtlasScript$Test$OOPTest$Interface$Animal$toStringCustom,

    speak: function() {
        throw Error.notImplemented();
    }
}
AtlasScript.Test.TypeInterfaceTest.Animal.registerClass('AtlasScript.Test.TypeInterfaceTest.Animal');

AtlasScript.Test.TypeInterfaceTest.NotImplementedIPet = function(name) {
}
AtlasScript.Test.TypeInterfaceTest.NotImplementedIPet.registerClass('AtlasScript.Test.TypeInterfaceTest.NotImplementedIPet', null, AtlasScript.Test.TypeInterfaceTest.IPet);

AtlasScript.Test.TypeInterfaceTest.FriendlyNameImplementation = function(friendlyName) {
    this._friendlyName = friendlyName;
}
AtlasScript.Test.TypeInterfaceTest.FriendlyNameImplementation.prototype = {
    get_friendlyName: function() {
        return this._friendlyName;
    }
}
// Note that IPet is *not* declared as an implemented interface.
// This is on purpose: the derived class will implement the interface but the impolementation
// is going to come from this base class.
AtlasScript.Test.TypeInterfaceTest.FriendlyNameImplementation.registerClass('AtlasScript.Test.TypeInterfaceTest.FriendlyNameImplementation');

AtlasScript.Test.TypeInterfaceTest.IPetImplementationFromBase = function(friendlyName) {
    AtlasScript.Test.TypeInterfaceTest.IPetImplementationFromBase.initializeBase(this, [friendlyName]);
}
AtlasScript.Test.TypeInterfaceTest.IPetImplementationFromBase.prototype = {
    foo: function() {
        return 'foo';
    }
}
AtlasScript.Test.TypeInterfaceTest.IPetImplementationFromBase.registerClass(
    'AtlasScript.Test.TypeInterfaceTest.IPetImplementationFromBase',
    AtlasScript.Test.TypeInterfaceTest.FriendlyNameImplementation,
    AtlasScript.Test.TypeInterfaceTest.IPet);

AtlasScript.Test.TypeInterfaceTest.Pet = function(name, friendlyName) {
    AtlasScript.Test.TypeInterfaceTest.Pet.initializeBase(this, [name]);

    this._friendlyName = friendlyName;
}
AtlasScript.Test.TypeInterfaceTest.Pet.prototype.get_friendlyName = function AtlasScript$Test$OOPTest$Interface$Pet$get_friendlyName() {
    return this._friendlyName;
}
AtlasScript.Test.TypeInterfaceTest.Pet.registerClass('AtlasScript.Test.TypeInterfaceTest.Pet',
    AtlasScript.Test.TypeInterfaceTest.Animal, AtlasScript.Test.TypeInterfaceTest.IPet);

AtlasScript.Test.TypeInterfaceTest.Cat = function(friendlyName) {
    AtlasScript.Test.TypeInterfaceTest.Cat.initializeBase(this, ['Cat', friendlyName]);
}
function AtlasScript$Test$OOPTest$Interface$Cat$speak() {
    return "meow";
}
function AtlasScript$Test$OOPTest$Interface$Cat$toStringCustom() {
    return 'Pet ' + AtlasScript.Test.TypeInterfaceTest.Cat.callBaseMethod(this, 'toStringCustom');
}
AtlasScript.Test.TypeInterfaceTest.Cat.prototype = {
    speak: AtlasScript$Test$OOPTest$Interface$Cat$speak,
    toStringCustom: AtlasScript$Test$OOPTest$Interface$Cat$toStringCustom
}
AtlasScript.Test.TypeInterfaceTest.Cat.registerClass('AtlasScript.Test.TypeInterfaceTest.Cat', AtlasScript.Test.TypeInterfaceTest.Pet);

AtlasScript.Test.TypeInterfaceTest.Garfield = function() {
    AtlasScript.Test.TypeInterfaceTest.Garfield.initializeBase(this, ['Garfield']);
}
AtlasScript.Test.TypeInterfaceTest.Garfield.prototype.toStringCustom = function AtlasScript$Test$OOPTest$Interface$Garfield$toStringCustom() {
    return AtlasScript.Test.TypeInterfaceTest.Garfield.callBaseMethod(this, 'toStringCustom') + ' ... its Garfield!';
}
AtlasScript.Test.TypeInterfaceTest.Garfield.registerClass('AtlasScript.Test.TypeInterfaceTest.Garfield', AtlasScript.Test.TypeInterfaceTest.Cat);

AtlasScript.Test.TypeInterfaceTest.Dog = function(friendlyName) {
    AtlasScript.Test.TypeInterfaceTest.Dog.initializeBase(this, ['Dog', friendlyName]);
}
AtlasScript.Test.TypeInterfaceTest.Dog.prototype.speak = function AtlasScript$Test$OOPTest$Interface$Dog$speak() {
    return "woof";
}
AtlasScript.Test.TypeInterfaceTest.Dog.registerClass('AtlasScript.Test.TypeInterfaceTest.Dog', AtlasScript.Test.TypeInterfaceTest.Pet);

AtlasScript.Test.TypeInterfaceTest.Tiger = function() {
    AtlasScript.Test.TypeInterfaceTest.Tiger.initializeBase(this, ['Tiger']);
}
AtlasScript.Test.TypeInterfaceTest.Tiger.prototype.speak = function AtlasScript$Test$OOPTest$Interface$Tiger$speak() {
    return "grr";
}
AtlasScript.Test.TypeInterfaceTest.Tiger.registerClass('AtlasScript.Test.TypeInterfaceTest.Tiger', AtlasScript.Test.TypeInterfaceTest.Animal);


AtlasScript.Test.TypeInterfaceTest.ImplementsInterfaceRemoved = function() {
}
AtlasScript.Test.TypeInterfaceTest.ImplementsInterfaceRemoved.registerClass("AtlasScript.Test.TypeInterfaceTest.ImplementsInterfaceRemoved");


AtlasScript.Test.TypeInterfaceTest.NeverInstantiatedBase = function() {
    throw new Error("NeverInstantiatedBase should never be instantiated");
}
AtlasScript.Test.TypeInterfaceTest.NeverInstantiatedBase.registerClass("AtlasScript.Test.TypeInterfaceTest.NeverInstantiatedBase");

AtlasScript.Test.TypeInterfaceTest.NeverInstantiated = function() {
    throw new Error("NeverInstantiated should never be instantiated");
}
AtlasScript.Test.TypeInterfaceTest.NeverInstantiated.registerClass("AtlasScript.Test.TypeInterfaceTest.NeverInstantiated",
    AtlasScript.Test.TypeInterfaceTest.NeverInstantiatedBase);

AtlasScript.Test.TypeInterfaceTest.IInterface = function() {}

