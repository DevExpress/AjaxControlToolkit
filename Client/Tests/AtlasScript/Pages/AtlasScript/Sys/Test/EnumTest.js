/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("Sys.Test");

Sys.Test.EnumTest = function() {

    this.testEnumeration = function() {
        var e = Sys.Test.EnumTest.Effect.Wipe;
        switch (e) {
            case Sys.Test.EnumTest.Effect.Fade:
                AtlasUnit.Assert.fail("switch (Wipe) should not enter case Fade.");
                break;
            case Sys.Test.EnumTest.Effect.Dissolve:
                AtlasUnit.Assert.fail("switch (Wipe) should not enter case Dissolve.");
                break;
            case Sys.Test.EnumTest.Effect.Wipe:
                break;
            default:
                AtlasUnit.Assert.fail("switch (Wipe) should not enter default case.");
                break;
        }
    }

    this.testEnumValues = function() {
        AtlasUnit.Assert.areEqual(0, Sys.Test.EnumTest.Effect.Fade, 'Fade should be 0.');
        AtlasUnit.Assert.areEqual(1, Sys.Test.EnumTest.Effect.Dissolve, 'Dissolve should be 1.');
        AtlasUnit.Assert.areEqual(2, Sys.Test.EnumTest.Effect.Wipe, 'Wipe should be 2.');
        AtlasUnit.Assert.areEqual(1, Sys.Test.EnumTest.Effect.DissolveAlias, 'DissolveAlias should be 1.');
        AtlasUnit.Assert.areEqual(-1, Sys.Test.EnumTest.Effect.Negative, 'Negative should be -1.');
    }

    this.testFlags = function() {
        var t = Sys.Test.EnumTest.EffectTypes.Interruptible |
                Sys.Test.EnumTest.EffectTypes.Observable;

        AtlasUnit.Assert.areEqual(Sys.Test.EnumTest.EffectTypes.Interruptible,
            (Sys.Test.EnumTest.EffectTypes.Interruptible & t),
            "Expected to be interruptible.");
        AtlasUnit.Assert.areEqual(0,
            (t & Sys.Test.EnumTest.EffectTypes.Repeatable),
            "Expected not to be repeatable.");
    }

    this.testGetName = function() {
        AtlasUnit.Assert.areEqual('Sys.Test.EnumTest.Effect', Sys.Test.EnumTest.Effect.getName());
        AtlasUnit.Assert.areEqual('Sys.Test.EnumTest.EffectTypes', Sys.Test.EnumTest.EffectTypes.getName());
    }

    this.testIsEnum = function() {
        AtlasUnit.Assert.isTrue(Type.isEnum(Sys.Test.EnumTest.Effect)); // Enum
        AtlasUnit.Assert.isFalse(Type.isEnum(Sys.Test.EnumTest)); // Class
        AtlasUnit.Assert.isFalse(Type.isEnum(Sys.Test.EnumTest.IInterface)); // Interface
        AtlasUnit.Assert.isFalse(Type.isEnum(Sys.Test)); // Namespace
        AtlasUnit.Assert.isFalse(Type.isEnum(undefined));
        AtlasUnit.Assert.isFalse(Type.isEnum(null));

        AtlasUnit.Assert.isFalse(Type.isClass(Sys.Test.EnumTest.Effect));
        AtlasUnit.Assert.isFalse(Type.isInterface(Sys.Test.EnumTest.Effect));
        AtlasUnit.Assert.isFalse(Type.isNamespace(Sys.Test.EnumTest.Effect));
    }

    this.testIsFlags = function() {
        AtlasUnit.Assert.isFalse(Type.isFlags(Sys.Test.EnumTest.Effect));
        AtlasUnit.Assert.isTrue(Type.isFlags(Sys.Test.EnumTest.EffectTypes));
        AtlasUnit.Assert.isFalse(Type.isFlags(Sys.Test.EnumTest)); // Class
        AtlasUnit.Assert.isFalse(Type.isFlags(Sys.Test.EnumTest.IInterface)); // Interface
        AtlasUnit.Assert.isFalse(Type.isFlags(Sys.Test)); // Namespace
        AtlasUnit.Assert.isFalse(Type.isFlags(undefined));
        AtlasUnit.Assert.isFalse(Type.isFlags(null));

        AtlasUnit.Assert.isFalse(Type.isClass(Sys.Test.EnumTest.EffectTypes));
        AtlasUnit.Assert.isFalse(Type.isInterface(Sys.Test.EnumTest.EffectTypes));
        AtlasUnit.Assert.isFalse(Type.isNamespace(Sys.Test.EnumTest.EffectTypes));
    }

    // *** Parse tests *** //
    this.testParseEnum = function() {
        AtlasUnit.Assert.areEqual(0, Sys.Test.EnumTest.Effect.parse('Fade'));
        AtlasUnit.Assert.areEqual(1, Sys.Test.EnumTest.Effect.parse(' Dissolve  '));
    }

    this.testParseEnumBadCaseValue = function() {
        Sys.Test.EnumTest.Effect.parse('DisSolve');
    }
    this.testParseEnumBadCaseValue["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        message: "Sys.ArgumentException: 'DisSolve' is not a valid value for enum Sys.Test.EnumTest.Effect.\nParameter name: value"
    };

    this.testParseEnumUnknownValue = function() {
        Sys.Test.EnumTest.Effect.parse('unKnown', true);
    }
    this.testParseEnumUnknownValue["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        message: "Sys.ArgumentException: 'unKnown' is not a valid value for enum Sys.Test.EnumTest.Effect.\nParameter name: value"
    };

    this.testParseFlags = function() {
        var t = Sys.Test.EnumTest.EffectTypes.Interruptible |
                Sys.Test.EnumTest.EffectTypes.Observable;

        AtlasUnit.Assert.areEqual(t, Sys.Test.EnumTest.EffectTypes.parse(' Interruptible, Observable'),
            "Parsed string expected to be equal to non-parsed Flags values.");

        AtlasUnit.Assert.areEqual(Sys.Test.EnumTest.EffectTypes.Negative, Sys.Test.EnumTest.EffectTypes.parse(' Negative  '));
    }

    this.testParseFlagsBadCaseValue = function() {
        Sys.Test.EnumTest.EffectTypes.parse('Interruptible , ObseRvable');
    }
    this.testParseFlagsBadCaseValue["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        message: "Sys.ArgumentException: 'ObseRvable' is not a valid value for enum Sys.Test.EnumTest.EffectTypes.\nParameter name: value"
    };

    this.testParseFlagsIgnoreCase = function() {
        var t = Sys.Test.EnumTest.EffectTypes.Interruptible |
                Sys.Test.EnumTest.EffectTypes.Observable;

        AtlasUnit.Assert.areEqual(t, Sys.Test.EnumTest.EffectTypes.parse('IntErruPtible , obseRvable', true));

        AtlasUnit.Assert.areEqual(Sys.Test.EnumTest.EffectTypes.Negative, Sys.Test.EnumTest.EffectTypes.parse(' negAtive  ', true));
    }

    this.testParseFlagsNone = function() {
        AtlasUnit.Assert.areEqual(Sys.Test.EnumTest.EffectTypes.None, Sys.Test.EnumTest.EffectTypes.parse('None'),
            "Parsed string expected to be equal to non-parsed Flags values.");

        AtlasUnit.Assert.areEqual(Sys.Test.EnumTest.EffectTypes.Interruptible, Sys.Test.EnumTest.EffectTypes.parse('None , Interruptible '),
            "Parsed string expected to be equal to non-parsed Flags values.");
    }

    this.testParseFlagsUnknownValue = function() {
        Sys.Test.EnumTest.EffectTypes.parse('Interruptible , unknown');
    }
    this.testParseFlagsUnknownValue["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        message: "Sys.ArgumentException: 'unknown' is not a valid value for enum Sys.Test.EnumTest.EffectTypes.\nParameter name: value"
    };

    // *** Register tests *** //
    this.testRegisterEnumComma = function() {
        Sys.Test.EnumTest.WrongName.registerEnum("foo,Sys.Test.EnumTest.WrongName");
    }
    this.testRegisterEnumComma["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        paramName: 'name',
        message: "Sys.ArgumentException: Value is not a valid type name.\nParameter name: name"
    };
    this.testRegisterEnumComma["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterEnumEmptyValueName = function() {
        Sys.Test.EnumTest.EmptyValueName.registerEnum('Sys.Test.EnumTest.EmptyValueName');
    }
    this.testRegisterEnumEmptyValueName["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: '' is not a valid name for an enum value."
    };
    this.testRegisterEnumEmptyValueName["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterEnumFloatValue = function() {
        Sys.Test.EnumTest.FloatValue.registerEnum('Sys.Test.EnumTest.FloatValue');
    }
    this.testRegisterEnumFloatValue["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: 'Sys.InvalidOperationException: An enumeration definition can only contain integer values.'
    };
    this.testRegisterEnumFloatValue["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterEnumOnClass = function() {
        Sys.Test.EnumTest.registerEnum('Sys.Test.EnumTest');
    }
    this.testRegisterEnumOnClass["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: 'Sys.InvalidOperationException: ' +
                 'Type Sys.Test.EnumTest has already been registered. ' +
                 'The type may be defined multiple times or the script file that defines ' +
                 'it may have already been loaded. A possible cause is a change of settings ' +
                 'during a partial update.'
    };
    this.testRegisterEnumOnClass["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterEnumOnInterface = function() {
        Sys.Test.EnumTest.IInterface.registerEnum('Sys.Test.EnumTest.IInterface');
    }
    this.testRegisterEnumOnInterface["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: 'Sys.InvalidOperationException: ' +
                 'Type Sys.Test.EnumTest.IInterface has already been registered. ' +
                 'The type may be defined multiple times or the script file that defines ' +
                 'it may have already been loaded. A possible cause is a change of settings ' +
                 'during a partial update.'                 
    };
    this.testRegisterEnumOnInterface["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterEnumReservedValueName = function() {
        Sys.Test.EnumTest.ReservedValueName.registerEnum('Sys.Test.EnumTest.ReservedValueName');
    }
    this.testRegisterEnumReservedValueName["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: 'getName' is a reserved name that can't be used as an enum value name."
    };
    this.testRegisterEnumReservedValueName["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterEnumTwice = function() {
        Sys.Test.EnumTest.EffectTypes.registerEnum('Sys.Test.EnumTest.EffectTypes');
    }
    this.testRegisterEnumTwice["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: 'Sys.InvalidOperationException: ' +
                 'Type Sys.Test.EnumTest.EffectTypes has already been registered. ' +
                 'The type may be defined multiple times or the script file that defines ' +
                 'it may have already been loaded. A possible cause is a change of settings ' +
                 'during a partial update.'                 
    };
    this.testRegisterEnumTwice["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterEnumUnknownName = function() {
        Sys.Test.EnumTest.WrongName.registerEnum('UnknownName');
    }
    this.testRegisterEnumUnknownName["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        message: 'Sys.ArgumentException: Value is not the name of an existing type.\nParameter name: name'
    };
    this.testRegisterEnumUnknownName["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterEnumWrongName = function() {
        Sys.Test.EnumTest.WrongName.registerEnum('Sys.Test.EnumTest.EffectTypes');
    }
    this.testRegisterEnumWrongName["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        message: 'Sys.ArgumentException: Value is not the name of the type being registered or the name is a reserved word.\nParameter name: name'
    };
    this.testRegisterEnumWrongName["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterEnumWrongValueType = function() {
        Sys.Test.EnumTest.WrongValueType.registerEnum('Sys.Test.EnumTest.WrongValueType');
    }
    this.testRegisterEnumWrongValueType["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: 'Sys.InvalidOperationException: An enumeration definition can only contain integer values.'
    };
    this.testRegisterEnumWrongValueType["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterEnumWrongValueName = function() {
        Sys.Test.EnumTest.WrongValueName.registerEnum('Sys.Test.EnumTest.WrongValueName');
    }
    this.testRegisterEnumWrongValueName["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: ' c' is not a valid name for an enum value."
    };
    this.testRegisterEnumWrongValueName["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterEnumWrongValueName2 = function() {
        Sys.Test.EnumTest.WrongValueName2.registerEnum('Sys.Test.EnumTest.WrongValueName2');
    }
    this.testRegisterEnumWrongValueName2["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: 'invalid,name' is not a valid name for an enum value."
    };
    this.testRegisterEnumWrongValueName2["AtlasUnit.Categories"] = ["DebugOnly"];

    // *** ToString tests *** //
    this.testToStringBadType = function() {
        Sys.Test.EnumTest.Effect.toString('1');
    }
    this.testToStringBadType["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentTypeException',
        message: "Sys.ArgumentTypeException: Object of type 'String' cannot be converted to type 'Sys.Test.EnumTest.Effect'.\nParameter name: value"
    }
    this.testToStringBadType["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testToStringEnum = function() {
        AtlasUnit.Assert.areEqual('Fade', Sys.Test.EnumTest.Effect.toString(Sys.Test.EnumTest.Effect.Fade));

        var OneToString = Sys.Test.EnumTest.Effect.toString(1);
        AtlasUnit.Assert.isTrue(('Dissolve' === OneToString) || ('DissolveAlias' === OneToString),
            'Value 1 should toString to Dissolve or DissolveAlias.');

        AtlasUnit.Assert.areEqual('Wipe', Sys.Test.EnumTest.Effect.toString(Sys.Test.EnumTest.Effect.Wipe));
        AtlasUnit.Assert.areEqual('Negative', Sys.Test.EnumTest.Effect.toString(Sys.Test.EnumTest.Effect.Negative));

        // toString without arguments should return the constructor code
        AtlasUnit.Assert.areEqual('function(){throwError.invalidOperation();}',
            Sys.Test.EnumTest.Effect.toString().replace(/[\s\n]/g, ''));
    }

    this.testToStringEnumInvalid = function() {
        Sys.Test.EnumTest.Effect.toString(42);
    }
    this.testToStringEnumInvalid["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentOutOfRangeException',
        message: "Sys.ArgumentOutOfRangeException: '42' is not a valid value for enum Sys.Test.EnumTest.Effect.\nParameter name: value\nActual value was 42."
    }
    this.testToStringEnumInvalid["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testToStringFlags = function() {
        var t = Sys.Test.EnumTest.EffectTypes.Interruptible |
                Sys.Test.EnumTest.EffectTypes.Observable;

        AtlasUnit.Assert.areEqual("Interruptible, Observable",
            Sys.Test.EnumTest.EffectTypes.toString(t),
            "Expected different format.");

        t = Sys.Test.EnumTest.EffectTypes2.Interruptible |
                Sys.Test.EnumTest.EffectTypes2.Observable;

        AtlasUnit.Assert.areEqual("Interruptible, Observable",
            Sys.Test.EnumTest.EffectTypes2.toString(t),
            "Expected different format.");

        AtlasUnit.Assert.areEqual("Black", Sys.Test.EnumTest.Color.toString(Sys.Test.EnumTest.Color.Black));
        AtlasUnit.Assert.areEqual("White", Sys.Test.EnumTest.Color.toString(Sys.Test.EnumTest.Color.White));
        AtlasUnit.Assert.areEqual("Red", Sys.Test.EnumTest.Color.toString(Sys.Test.EnumTest.Color.Red));
        AtlasUnit.Assert.areEqual("Green", Sys.Test.EnumTest.Color.toString(Sys.Test.EnumTest.Color.Green));
        AtlasUnit.Assert.areEqual("Blue", Sys.Test.EnumTest.Color.toString(Sys.Test.EnumTest.Color.Blue));
        AtlasUnit.Assert.areEqual("Purple", Sys.Test.EnumTest.Color.toString(Sys.Test.EnumTest.Color.Purple));
        AtlasUnit.Assert.areEqual("Cyan", Sys.Test.EnumTest.Color.toString(Sys.Test.EnumTest.Color.Cyan));
        AtlasUnit.Assert.areEqual("Yellow", Sys.Test.EnumTest.Color.toString(Sys.Test.EnumTest.Color.Yellow));
    }

    this.testToStringFlagsNone = function() {
        AtlasUnit.Assert.areEqual("None",
            Sys.Test.EnumTest.EffectTypes.toString(Sys.Test.EnumTest.EffectTypes.None),
            "Expected different format.");
    }

    this.testToStringFlagsNoneFailure = function() {
       Sys.Test.EnumTest.EffectTypes2.toString(0);
    }
    this.testToStringFlagsNoneFailure["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentOutOfRangeException',
        message: "Sys.ArgumentOutOfRangeException: '0' is not a valid value for enum Sys.Test.EnumTest.EffectTypes2.\nParameter name: value\nActual value was 0."
    }
    this.testToStringFlagsNoneFailure["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testToStringFlagsInvalid = function() {
        Sys.Test.EnumTest.EffectTypes.toString(42);
    }
    this.testToStringFlagsInvalid["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentOutOfRangeException',
        message: "Sys.ArgumentOutOfRangeException: '42' is not a valid value for enum Sys.Test.EnumTest.EffectTypes.\nParameter name: value\nActual value was 42."
    }
    this.testToStringFlagsInvalid["AtlasUnit.Categories"] = ["DebugOnly"];
}
Sys.Test.EnumTest.registerClass("Sys.Test.EnumTest");
Sys.Test.EnumTest["AtlasUnit.IsTestFixture"] = true;

Sys.Test.EnumTest.Effect = function() {throw Error.invalidOperation();}
Sys.Test.EnumTest.Effect.prototype = {
    Fade: 0,
    Dissolve: 1,
    Wipe: 2,
    DissolveAlias: 1,
    Negative: -1
}
Sys.Test.EnumTest.Effect.registerEnum('Sys.Test.EnumTest.Effect');

Sys.Test.EnumTest.EffectTypes = function() {
    throw Error.invalidOperation();
}
Sys.Test.EnumTest.EffectTypes.prototype = {
    None: 0,
    Interruptible: 1,
    Observable: 2,
    Repeatable: 4,
    Negative: -1
}
Sys.Test.EnumTest.EffectTypes.registerEnum('Sys.Test.EnumTest.EffectTypes', true);

Sys.Test.EnumTest.EffectTypes2 = function() {
    throw Error.invalidOperation();
}
Sys.Test.EnumTest.EffectTypes2.prototype = {
    Interruptible: 1,
    Observable: 2,
    Repeatable: 4
}
Sys.Test.EnumTest.EffectTypes2.registerEnum('Sys.Test.EnumTest.EffectTypes2', true);

Sys.Test.EnumTest.Color = function() {
    throw Error.invalidOperation();
}
Sys.Test.EnumTest.Color.prototype = {
    Black: 0,
    White: 7,
    Red: 1,
    Green: 2,
    Blue: 4,
    Yellow: 3,
    Purple: 5,
    Cyan: 6
}
Sys.Test.EnumTest.Color.registerEnum('Sys.Test.EnumTest.Color', true);

Sys.Test.EnumTest.WrongName = function() {
    throw Error.invalidOperation();
}

Sys.Test.EnumTest.FloatValue = function() {
    throw Error.invalidOperation();
}
Sys.Test.EnumTest.FloatValue.prototype = {
    a: 1,
    b: 1.1,
    c: 3
}

Sys.Test.EnumTest.WrongValueType = function() {
    throw Error.invalidOperation();
}
Sys.Test.EnumTest.WrongValueType.prototype = {
    a: 1,
    b: '2',
    c: 3
}

Sys.Test.EnumTest.EmptyValueName = function() {
    throw Error.invalidOperation();
}
Sys.Test.EnumTest.EmptyValueName.prototype = {
    a: 1,
    b: 2
}
Sys.Test.EnumTest.EmptyValueName.prototype[""] = 3;

Sys.Test.EnumTest.WrongValueName = function() {
    throw Error.invalidOperation();
}
Sys.Test.EnumTest.WrongValueName.prototype = {
    a: 1,
    b: 2
}
Sys.Test.EnumTest.WrongValueName.prototype[" c"] = 3;

Sys.Test.EnumTest.WrongValueName2 = function() {
    throw Error.invalidOperation();
}
Sys.Test.EnumTest.WrongValueName2.prototype = {
    a: 1,
    b: 2
}
Sys.Test.EnumTest.WrongValueName2.prototype["invalid,name"] = 3;

Sys.Test.EnumTest.ReservedValueName = function() {
    throw Error.invalidOperation();
}
Sys.Test.EnumTest.ReservedValueName.prototype = {
    a: 1,
    getName: 2
}

Sys.Test.EnumTest.IInterface = function() {}
Sys.Test.EnumTest.IInterface.registerInterface("Sys.Test.EnumTest.IInterface");

