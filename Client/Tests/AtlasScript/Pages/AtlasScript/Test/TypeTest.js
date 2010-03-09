/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("AtlasScript.Test");

AtlasScript.Test.TypeTest = function() {
    this.tearDown = function() {
        window.Foo = null;
    }

    this.testEqualToFunction = function() {
        AtlasUnit.Assert.areEqual(Type, Function);
    }

    this.testGetBaseType = function() {
        AtlasUnit.Assert.isNull(AtlasScript.Test.TypeTest.BaseClass.getBaseType());
        AtlasUnit.Assert.areEqual(AtlasScript.Test.TypeTest.BaseClass,
            AtlasScript.Test.TypeTest.DerivedClass.getBaseType());
        AtlasUnit.Assert.isNull(AtlasScript.Test.TypeTest.UnregisteredClass.getBaseType());
    }

    this.testGetName = function() {
        AtlasUnit.Assert.areEqual("AtlasScript.Test.TypeTest.BaseClass",
            AtlasScript.Test.TypeTest.BaseClass.getName());
        AtlasUnit.Assert.areEqual("", AtlasScript.Test.TypeTest.UnregisteredClass.getName());
    }

    this.testIsClass = function() {
        AtlasUnit.Assert.isTrue(Type.isClass(AtlasScript.Test.TypeTest.BaseClass));
        AtlasUnit.Assert.isFalse(Type.isClass(AtlasScript.Test.TypeTest.IInterface));
        AtlasUnit.Assert.isFalse(Type.isClass(AtlasScript.Test.TypeTest.UnregisteredClass));
        AtlasUnit.Assert.isFalse(Type.isClass(AtlasScript.Test));
        AtlasUnit.Assert.isFalse(Type.isClass(undefined));
        AtlasUnit.Assert.isFalse(Type.isClass(null));
    }

    this.testIsInterface = function() {
        AtlasUnit.Assert.isFalse(Type.isInterface(AtlasScript.Test.TypeTest.BaseClass));
        AtlasUnit.Assert.isTrue(Type.isInterface(AtlasScript.Test.TypeTest.IInterface));
        AtlasUnit.Assert.isFalse(Type.isInterface(AtlasScript.Test.TypeTest.UnregisteredClass));
        AtlasUnit.Assert.isFalse(Type.isInterface(AtlasScript.Test));
        AtlasUnit.Assert.isFalse(Type.isInterface(undefined));
        AtlasUnit.Assert.isFalse(Type.isInterface(null));
    }

    this.testIsNamespace = function() {
        AtlasUnit.Assert.isFalse(Type.isNamespace(AtlasScript.Test.TypeTest.BaseClass));
        AtlasUnit.Assert.isFalse(Type.isNamespace(AtlasScript.Test.TypeTest.IInterface));
        AtlasUnit.Assert.isFalse(Type.isNamespace(AtlasScript.Test.TypeTest.UnregisteredClass));
        AtlasUnit.Assert.isTrue(Type.isNamespace(AtlasScript.Test));
        AtlasUnit.Assert.isFalse(Type.isNamespace(undefined));
        AtlasUnit.Assert.isFalse(Type.isNamespace(null));
    }

    this.testParse = function() {
        AtlasUnit.Assert.areEqual(AtlasScript.Test.TypeTest.BaseClass, Type.parse('AtlasScript.Test.TypeTest.BaseClass'));
        // Doing it again to also check the cached code path.
        AtlasUnit.Assert.areEqual(AtlasScript.Test.TypeTest.BaseClass, Type.parse('AtlasScript.Test.TypeTest.BaseClass'));

        AtlasUnit.Assert.isNull(Type.parse(''));
        AtlasUnit.Assert.isNull(Type.parse(null));
        AtlasUnit.Assert.isNull(Type.parse(undefined));
    }

    this.testParseInexistantFunction = function() {
        AtlasUnit.Assert.isNull(Type.parse("thisFunctionShouldNotExist"),
            "Parse on inexistant function expected to return null.");
    }
    this.testParseInexistantFunction["AtlasUnit.ExpectedException"] = {
    };
    this.testParseInexistantFunction["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testParseJunkFunction = function() {
        AtlasUnit.Assert.isNull(Type.parse("some random stuff."),
            "Parse on inexistant function expected to return null.");
    }
    this.testParseJunkFunction["AtlasUnit.ExpectedException"] = {
        name: 'SyntaxError'
    };
    this.testParseJunkFunction["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testParseNonFunction = function() {
        AtlasUnit.Assert.isNull(Type.parse("new Object()"),
            "Parse on non-function expected to return null.");
    }
    this.testParseNonFunction["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        paramName: 'typeName',
        message: 'Sys.ArgumentException: Value is not a valid type name.\nParameter name: typeName'
    };
    this.testParseNonFunction["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testParseUnicode = function() {
        switch (Sys.Browser.agent) {
            case Sys.Browser.Safari:
                if (Sys.Debug.isDebug) {
                    // Safari does not support Unicode names (even though EcmaScript explicitly allows them).
                    // Causes ArgumentException in Debug (and we don't need to test Release, since behavior
                    // in release is unspecified if Debug causes an exception).
                    AtlasUnit.Assert.expectException(
                        function() {
                            Type.parse("AtlasScript.Test.TypeTest.コントロール");
                        },
                        {
                            name: 'Sys.ArgumentException',
                            paramName: 'typeName',
                            message: 'Sys.ArgumentException: Value is not a valid type name.\nParameter name: typeName'                        
                        });
                }
                break;
            default:
                AtlasUnit.Assert.areEqual(
                    AtlasScript.Test.TypeTest["コントロール"],
                    Type.parse("AtlasScript.Test.TypeTest.コントロール"),
                    "createInstance expected to create an instance of コントロール.");
                break;
        }
    }

    this.testParseWithNamespace = function() {
        AtlasUnit.Assert.areEqual(AtlasScript.Test.TypeTest.BaseClass,
            Type.parse('baseClass', AtlasScript.Test.TypeTest));
        AtlasUnit.Assert.isNull(Type.parse('nonExisting', AtlasScript.Test.TypeTest));
        AtlasUnit.Assert.isNull(Type.parse('registerClass', AtlasScript.Test.TypeTest.BaseClass));
    }

    this.testRegisterClassNullBaseType = function() {
        AtlasUnit.Assert.areEqual("AtlasScript.Test.TypeTest.NullBaseType",
            AtlasScript.Test.TypeTest.NullBaseType.getName());
    }

    this.testRegisterClassUndefinedBaseType = function() {
        AtlasScript.Test.TypeTest.UndefinedBaseType.registerClass(
            "AtlasScript.Test.TypeTest.UndefinedBaseType", undefined);
    }
    this.testRegisterClassUndefinedBaseType["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentUndefinedException',
        paramName: 'baseType'
    };
    this.testRegisterClassUndefinedBaseType["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterClassBaseTypeTypo = function() {
        // Notice the typo here in the name of the base class. To avoid a Firefox warning,
        // we must assign the result of the typo to a variable before passing it to registerClass.
        var typoBaseClass = AtlasScript.Test.TypeTest.BaSeClass;
        AtlasScript.Test.TypeTest.BaseTypeTypo.registerClass("AtlasScript.Test.TypeTest.BaseTypeTypo",
            typoBaseClass);
    }
    this.testRegisterClassBaseTypeTypo["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentUndefinedException',
        paramName: 'baseType'
    };
    this.testRegisterClassBaseTypeTypo["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterClassComma = function() {
        AtlasScript.Test.TypeTest.NotAClass.registerClass("foo,AtlasScript.Test.TypeTest.NotAClass");
    }
    this.testRegisterClassComma["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        paramName: 'typeName',
        message: "Sys.ArgumentException: Value is not a valid type name.\nParameter name: typeName"
    };
    this.testRegisterClassComma["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterClassBaseTypeNotAClass = function() {
        // allowed in ajax 4
        AtlasScript.Test.TypeTest.BaseTypeNotAClass.registerClass(
            "AtlasScript.Test.TypeTest.BaseTypeNotAClass",
            AtlasScript.Test.TypeTest.NotAClass);
    }

    this.testRegisterClassNotAnInterface = function() {
        AtlasScript.Test.TypeTest.NotAnInterface.registerClass(
            "AtlasScript.Test.TypeTest.NotAnInterface",
            null,
            AtlasScript.Test.TypeTest.BaseClass);
    }
    this.testRegisterClassNotAnInterface["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        paramName: 'interfaceTypes[0]',
        message: 'Sys.ArgumentException: Value is not a valid interface.\nParameter name: interfaceTypes[0]'
    };
    this.testRegisterClassNotAnInterface["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterClassTwice = function() {
        AtlasScript.Test.TypeTest.DerivedClass.registerClass("AtlasScript.Test.TypeTest.DerivedClass",
            AtlasScript.Test.TypeTest.BaseClass);
    }
    this.testRegisterClassTwice["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: String.format('Sys.InvalidOperationException: Type {0} has already been registered. ' +
                               'The type may be defined multiple times or the script file that defines ' +
                               'it may have already been loaded. A possible cause is a change of settings ' +
                               'during a partial update.',
                               "AtlasScript.Test.TypeTest.DerivedClass")
    };
    this.testRegisterClassTwice["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterClassBadNamespace = function() {
        AtlasScript.Test.TypeTest.BadNamespace.registerClass("BadNamespace.DoesNotExist.NotEvenTheRightClassName");
    }
    this.testRegisterClassBadNamespace["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        message: 'Sys.ArgumentException: Value is not the name of an existing type.\nParameter name: typeName'
    };
    this.testRegisterClassBadNamespace["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterClassOnInterface = function() {
        AtlasScript.Test.TypeTest.IInterface.registerClass("AtlasScript.Test.TypeTest.IInterface");
    }
    this.testRegisterClassOnInterface["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: 'Sys.InvalidOperationException: ' +
                 'Type AtlasScript.Test.TypeTest.IInterface has already been registered. ' +
                 'The type may be defined multiple times or the script file that defines ' +
                 'it may have already been loaded. A possible cause is a change of settings ' +
                 'during a partial update.'
    };
    this.testRegisterClassOnInterface["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterClassWrongTypeName = function() {
        AtlasScript.Test.TypeTest.BadNamespace.registerClass("AtlasScript.Test.TypeTest.UnregisteredClass");
    }
    this.testRegisterClassWrongTypeName["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        message: 'Sys.ArgumentException: Value is not the name of the type being registered or the name is a reserved word.\nParameter name: typeName'
    };
    this.testRegisterClassWrongTypeName["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterNamespaceClassInPath = function() {
        Type.registerNamespace("AtlasScript.Test.TypeTest.InvalidNamespace");
    }
    this.testRegisterNamespaceClassInPath["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: Object AtlasScript.Test.TypeTest already exists as a class, enum, or interface."
    };
    this.testRegisterNamespaceClassInPath["AtlasUnit.Categories"] = ["DebugOnly"];
    
    this.testRegisterNamespaceArrayInPath = function() {
        window.Foo = { Bar: { Baz: [] } };
        Type.registerNamespace("Foo.Bar.Baz");
    }
    this.testRegisterNamespaceArrayInPath["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: Object Foo.Bar.Baz already exists and is not an object."
    };
    this.testRegisterNamespaceArrayInPath["AtlasUnit.Categories"] = ["DebugOnly"];    

    this.testRegisterNamespaceNonObjectInPath = function() {
        window.Foo = { Bar: 88 };
        Type.registerNamespace("Foo.Bar.Baz");
    }
    this.testRegisterNamespaceNonObjectInPath["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: Object Foo.Bar already exists and is not an object."
    };
    this.testRegisterNamespaceNonObjectInPath["AtlasUnit.Categories"] = ["DebugOnly"];    

    this.testRegisterNamespaceEmptyString = function() {
        Type.registerNamespace("");
    }
    this.testRegisterNamespaceEmptyString["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        paramName: 'namespacePath'
    };
    this.testRegisterNamespaceEmptyString["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterNamespaceNoParameter = function() {
        Type.registerNamespace();
    }
    this.testRegisterNamespaceNoParameter["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ParameterCountException'
    };
    this.testRegisterNamespaceNoParameter["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterNamespaceSpaceInName = function() {
        Type.registerNamespace("Name Space");
    }
    this.testRegisterNamespaceSpaceInName["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        paramName: 'namespacePath',
        message: 'Sys.ArgumentException: Value is not a valid namespace identifier.\nParameter name: namespacePath'
    };
    this.testRegisterNamespaceSpaceInName["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterNamespaceInvalidCharacter = function() {
        Type.registerNamespace("Name.SpaceWith*InIt");
    }
    this.testRegisterNamespaceInvalidCharacter["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        paramName: 'namespacePath',
        message: 'Sys.ArgumentException: Value is not a valid namespace identifier.\nParameter name: namespacePath'
    };
    this.testRegisterNamespaceInvalidCharacter["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterNamespaceQuestionMarkCharacter = function() {
        Type.registerNamespace("Name.SpaceWith?InIt");
    }
    this.testRegisterNamespaceQuestionMarkCharacter["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        paramName: 'namespacePath',
        message: 'Sys.ArgumentException: Value is not a valid namespace identifier.\nParameter name: namespacePath'
    };
    this.testRegisterNamespaceQuestionMarkCharacter["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testRegisterNamespaceExistingObject = function() {
        window.Foo = { Bar: { Baz: {} } };
        AtlasUnit.Assert.isFalse(Type.isNamespace(Foo));
        AtlasUnit.Assert.isFalse(Type.isNamespace(Foo.Bar));
        AtlasUnit.Assert.isFalse(Type.isNamespace(Foo.Bar.Baz));
        Type.registerNamespace("Foo.Bar.Baz.Boo");
        AtlasUnit.Assert.isTrue(Type.isNamespace(Foo));
        AtlasUnit.Assert.isTrue(Type.isNamespace(Foo.Bar));
        AtlasUnit.Assert.isTrue(Type.isNamespace(Foo.Bar.Baz));
        AtlasUnit.Assert.isTrue(Type.isNamespace(Foo.Bar.Baz.Boo));
    }

    this.testRegisterScriptWithDependencies = function() {
        Type._registerScript("RootFileA");
        Type._registerScript("RootFileB");
        Type._registerScript("DependentFile", ["RootFileA", "RootFileB"]);
        AtlasUnit.Assert.isTrue(Type._registerScript._scripts["RootFileA"]);
        AtlasUnit.Assert.isTrue(Type._registerScript._scripts["RootFileB"]);
        AtlasUnit.Assert.isTrue(Type._registerScript._scripts["DependentFile"]);
    }

    this.testRegisterScriptWithMissingDependencies = function() {
        Type._registerScript("RootFileAA");
        Type._registerScript("RootFileBB");
        Type._registerScript("DependentFile2", ["RootFileAA", "RootFileBB", "RootFileCC"]);
    }
    this.testRegisterScriptWithMissingDependencies["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: 'Sys.InvalidOperationException: The script \'DependentFile2\' failed to load because it is dependent on script \'RootFileCC\'.'
    };

    this.testRegisterScriptTwice = function() {
        Type._registerScript("SomeScript");
        Type._registerScript("SomeScript");
    }
    this.testRegisterScriptTwice["AtlasUnit.ExpectedException"] = {
        name: 'Sys.InvalidOperationException',
        message: "Sys.InvalidOperationException: The script 'SomeScript' has been referenced multiple times. If referencing Microsoft AJAX scripts explicitly, set the MicrosoftAjaxMode property of the ScriptManager to Explicit."
    };

    this.testCheckDependency = function() {
        AtlasUnit.Assert.isFalse(Type._checkDependency("FooScript"));
        Type._registerScript("FooScript");
        AtlasUnit.Assert.isTrue(Type._checkDependency("FooScript"));
    }

    this.testRegisterScriptWithNoDependencies = function() {
        Type._registerScript("RootFile");
        AtlasUnit.Assert.isTrue(Type._registerScript._scripts["RootFile"]);
    }

}
AtlasScript.Test.TypeTest.registerClass("AtlasScript.Test.TypeTest");
AtlasScript.Test.TypeTest["AtlasUnit.IsTestFixture"] = true;

AtlasScript.Test.TypeTest.BaseClass = function() {
}
AtlasScript.Test.TypeTest.BaseClass.registerClass("AtlasScript.Test.TypeTest.BaseClass");

AtlasScript.Test.TypeTest.DerivedClass = function() {
    AtlasScript.Test.TypeTest.DerivedClass.initializeBase(this);
}
AtlasScript.Test.TypeTest.DerivedClass.registerClass("AtlasScript.Test.TypeTest.DerivedClass",
    AtlasScript.Test.TypeTest.BaseClass);

AtlasScript.Test.TypeTest.NullBaseType = function() {};
AtlasScript.Test.TypeTest.NullBaseType.registerClass("AtlasScript.Test.TypeTest.NullBaseType", null);

AtlasScript.Test.TypeTest.UnregisteredClass = function() {};
AtlasScript.Test.TypeTest.UndefinedBaseType = function() {};
AtlasScript.Test.TypeTest.BaseTypeTypo = function() {};
AtlasScript.Test.TypeTest.BaseTypeNotAClass = function() {};
AtlasScript.Test.TypeTest.BadNamespace = function() {};
AtlasScript.Test.TypeTest.NotAClass = function() {};
AtlasScript.Test.TypeTest.NotAnInterface = function() {};

AtlasScript.Test.TypeTest.IInterface = function() {};
AtlasScript.Test.TypeTest.IInterface.registerInterface("AtlasScript.Test.TypeTest.IInterface");

if (Sys.Browser.agent !== Sys.Browser.Safari) {
    // Avoiding a syntax error in Safari (which doesn't support Unicode names)
    AtlasScript.Test.TypeTest["コントロール"] = function() {}
    AtlasScript.Test.TypeTest["コントロール"].registerClass("AtlasScript.Test.TypeTest.コントロール");
}

