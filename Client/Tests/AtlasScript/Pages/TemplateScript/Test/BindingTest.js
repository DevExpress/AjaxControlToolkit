Type.registerNamespace("Sys.Test");

Sys.Test.BindingTest = function() {
    // Test bindings
    this.testBindingToTargetWithDeepPath = function() {
        var target = {
            foo1: {
                bar1: {
                    baz1: {}
                }
            }
        };
        var source = {
            foo2: {
                bar2: {
                    baz2: {}
                }
            }
        };
        var binding = this.bindMethod(target, "foo1.bar1.baz1", source, "foo2.bar2.baz2", Sys.BindingMode.oneWay);
        AtlasUnit.Assert.areEqual(target.foo1.bar1.baz1, source.foo2.bar2.baz2);
        Sys.Observer.setValue(source, "foo2.bar2.baz2", 1);
        AtlasUnit.Assert.areEqual(1, target.foo1.bar1.baz1);
        Sys.Observer.setValue(source, "foo2.bar2.baz2", 2);
        AtlasUnit.Assert.areEqual(2, target.foo1.bar1.baz1);
        var oldBar = source.foo2.bar2;
        var newBar = { baz2: 3 };
        Sys.Observer.setValue(source, "foo2.bar2", newBar);
        AtlasUnit.Assert.areEqual(3, target.foo1.bar1.baz1);
        source.foo2.bar2.baz2 = 4;
        Sys.Observer.setValue(oldBar, "baz2", "!");
        // changing the old value shouldnt trigger an update
        AtlasUnit.Assert.areEqual(3, target.foo1.bar1.baz1); // still 3, not 4
        Sys.Observer.setValue(newBar, "baz2", 5);
        AtlasUnit.Assert.areEqual(5, target.foo1.bar1.baz1); 
        // temporarily null out part of the path
        Sys.Observer.setValue(source, "foo2", null);
        AtlasUnit.Assert.areEqual(null, target.foo1.bar1.baz1);
        Sys.Observer.setValue(source, "foo2", { bar2: { baz2: 6 } });
        AtlasUnit.Assert.areEqual(6, target.foo1.bar1.baz1); 
        binding.dispose();
    }
    
    this.testBindingToSourceWithDeepPath = function() {
        var target = {
            foo1: {
                bar1: {
                    baz1: {}
                }
            }
        };
        var source = {
            foo2: {
                bar2: {
                    baz2: {}
                }
            }
        };
        var binding = this.bindMethod(target, "foo1.bar1.baz1", source, "foo2.bar2.baz2", Sys.BindingMode.oneWayToSource);
        AtlasUnit.Assert.areEqual(target.foo1.bar1.baz1, source.foo2.bar2.baz2);
        Sys.Observer.setValue(target, "foo1.bar1.baz1", 1);
        AtlasUnit.Assert.areEqual(1, source.foo2.bar2.baz2);
        Sys.Observer.setValue(target, "foo1.bar1.baz1", 2);
        AtlasUnit.Assert.areEqual(2, source.foo2.bar2.baz2);
        var oldBar = target.foo1.bar1;
        var newBar = { baz1: 3 };
        Sys.Observer.setValue(target, "foo1.bar1", newBar);
        AtlasUnit.Assert.areEqual(3, source.foo2.bar2.baz2);
        target.foo1.bar1.baz1 = 4;
        Sys.Observer.setValue(oldBar, "baz1", "!");
        // changing the old value shouldnt trigger an update
        AtlasUnit.Assert.areEqual(3, source.foo2.bar2.baz2); // still 3, not 4
        Sys.Observer.setValue(newBar, "baz1", 5);
        AtlasUnit.Assert.areEqual(5, source.foo2.bar2.baz2); 
        // temporarily null out part of the path
        Sys.Observer.setValue(target, "foo1", null);
        AtlasUnit.Assert.areEqual(null, source.foo2.bar2.baz2);
        Sys.Observer.setValue(target, "foo1", { bar1: { baz1: 6 } });
        AtlasUnit.Assert.areEqual(6, source.foo2.bar2.baz2); 
        binding.dispose();
    }    

    this.testBindingWithComponentSet = function() {
        var dc1 = Sys.create.dataContext();
        var dc2 = Sys.create.dataContext();
        dc2.sourceProp = "value";
        Sys.binding(dc1, "targetProp", dc2, "sourceProp");
        AtlasUnit.Assert.areEqual("value", dc1.targetProp);
    }

    this.testBindingWithElementSet = function() {
        var div1 = document.createElement("div");
        var div2 = document.createElement("div");
        var set1 = new Sys.ElementSet(div1);
        var set2 = new Sys.ElementSet(div2);
        div2.sourceProp = "value";
        Sys.binding(set1, "targetProp", set2, "sourceProp");
        AtlasUnit.Assert.areEqual("value", div1.targetProp);
    }
    
    this.testBindingComponentNotObservedAndWithoutAddPropertyChanged = function() {
        var source = new Sys.Test.BindingTest.Component(), target = {};
        source.set_contact("Redmond");
        target.foo = "Redmond";
        var binding = this.bindMethod(target, "foo", source, "contact", Sys.BindingMode.twoWay);
        Sys.Observer.setValue(target, "foo", "Seattle");
        AtlasUnit.Assert.areEqual("Seattle", source.get_contact());

        source.set_contact("Bellevue");
        AtlasUnit.Assert.areEqual("Bellevue", target.foo);
    }
    this.testBindingComponentBeingObserved = function() {
        var source = new Sys.Test.BindingTest.Component(), targetObj = {};
        source.set_contact("Redmond");
        targetObj.foo = "Redmond";
        var target = Sys.Observer.makeObservable(targetObj),
            binding = this.bindMethod(target, "foo", source, "contact", Sys.BindingMode.twoWay);

        target.setValue("foo", "Seattle");
        AtlasUnit.Assert.areEqual("Seattle", source.get_contact());

        source.set_contact("Bellevue");
        AtlasUnit.Assert.areEqual("Bellevue", target.foo);
    }
    this.testBindingComponentToElementSimple = function() {
        var source = new Sys.Test.BindingTest.Component(),
            e1 = document.createElement("div");
        e1.innerHTML = "<input type='text' value='bellevue' name='textbox1' size='30'>";
        try {
            document.body.appendChild(e1);
            var target = e1.childNodes[0];
            source.set_contact({ address: 'redmond' });
            var binding = this.bindMethod(target, 'value', source,
                            'contact.address', Sys.BindingMode.twoWay);
            AtlasUnit.Assert.areEqual('redmond', source.get_contact().address);
            AtlasUnit.Assert.areEqual('redmond', target.value);

            source.set_contact({ address: 'seattle' });
            AtlasUnit.Assert.areEqual('seattle', source.get_contact().address);
            AtlasUnit.Assert.areEqual('seattle', target.value);

            target.value = 'bellevue';
            this.fireEventAllBrowsers(target);
            AtlasUnit.Assert.areEqual('bellevue', source.get_contact().address);
            AtlasUnit.Assert.areEqual('bellevue', target.value);
        }
        finally {
            document.body.removeChild(e1);
        }
    }
    this.testBindingComponentToElementSimple["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testBindingElementToComponentSimple = function() {
        var e1 = document.createElement("div"),
            target = new Sys.Test.BindingTest.Component();
        e1.innerHTML = "<input type='text' value='bellevue' name='textbox1' size='30'>";
        try {
            document.body.appendChild(e1);
            var source = e1.childNodes[0];
            target.set_contact({ address: 'redmond' });
            var binding = this.bindMethod(target, 'contact.address', source,
                            'value', Sys.BindingMode.twoWay);

            AtlasUnit.Assert.areEqual('bellevue', source.value);
            AtlasUnit.Assert.areEqual('bellevue', target.get_contact().address);

            source.value = 'seattle';
            this.fireEventAllBrowsers(source);
            AtlasUnit.Assert.areEqual('seattle', source.value);
            AtlasUnit.Assert.areEqual('seattle', target.get_contact().address);

            target.set_contact({ address: 'bellevue' });
            AtlasUnit.Assert.areEqual('bellevue', source.value);
            AtlasUnit.Assert.areEqual('bellevue', target.get_contact().address);
        }
        finally {
            document.body.removeChild(e1);
        }
    }
    this.testBindingElementToComponentSimple["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testBindingElementInChainedEventsWithBuiltInPropertyChangedHandler = function() {
        var e1 = document.createElement("div"),
            component1 = new Sys.Test.BindingTest.Component(),
            component2 = new Sys.Test.BindingTest.Component();
        e1.innerHTML = "<input type='text' value='bellevue' name='textbox1' size='30'>";
        try {
            document.body.appendChild(e1);
            var element = e1.childNodes[0];

            component1.set_contact('redmond');
            component2.set_contact('bellevue');
            var binding = this.bindMethod(element, 'value', component1,
                            'contact', Sys.BindingMode.oneWay),
                binding2 = this.bindMethod(component2, 'contact', element,
                            'value', Sys.BindingMode.oneWay);

            AtlasUnit.Assert.areEqual('redmond', element.value);
            AtlasUnit.Assert.areEqual('redmond', component1.get_contact());
            AtlasUnit.Assert.areEqual('redmond', component2.get_contact());

            component1.set_contact('bellevue');
            AtlasUnit.Assert.areEqual('bellevue', element.value);
            AtlasUnit.Assert.areEqual('bellevue', component1.get_contact());
            AtlasUnit.Assert.areEqual('bellevue', component2.get_contact());
        }
        finally {
            document.body.removeChild(e1);
        }
    }
    this.testBindingElementInChainedEventsWithBuiltInPropertyChangedHandler["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testBindingElementWithBuiltInPropertyChangedHandler = function() {
        var e1 = document.createElement("div"),
            target = new Sys.Test.BindingTest.Component();
        e1.innerHTML = "<input type='text' value='bellevue' name='textbox1' size='30'>";
        try {
            document.body.appendChild(e1);
            var source = e1.childNodes[0];
            target.set_contact({ address: 'redmond' });
            var binding = this.bindMethod(target, 'contact.address', source,
                            'value', Sys.BindingMode.twoWay);

            AtlasUnit.Assert.areEqual('bellevue', source.value);
            AtlasUnit.Assert.areEqual('bellevue', target.get_contact().address);

            Sys.Observer.setValue(source, "value", "seattle");
            AtlasUnit.Assert.areEqual('seattle', source.value);
            AtlasUnit.Assert.areEqual('seattle', target.get_contact().address);

            target.set_contact({ address: 'bellevue' });
            AtlasUnit.Assert.areEqual('bellevue', source.value);
            AtlasUnit.Assert.areEqual('bellevue', target.get_contact().address);
        }
        finally {
            document.body.removeChild(e1);
        }
    }
    this.testBindingElementWithBuiltInPropertyChangedHandler["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testBindingElementBeingObservedWithBuiltInPropertyChangedHandler = function() {
        var e1 = document.createElement("div"),
            target = new Sys.Test.BindingTest.Component();
        e1.innerHTML = "<input type='text' value='bellevue' name='textbox1' size='30'>";
        try {
            document.body.appendChild(e1);
            var sourceObj = e1.childNodes[0], source = Sys.Observer.makeObservable(sourceObj);
            target.set_contact({ address: 'redmond' });
            var binding = this.bindMethod(target, 'contact.address', source,
                            'value', Sys.BindingMode.twoWay);

            AtlasUnit.Assert.areEqual('bellevue', source.value);
            AtlasUnit.Assert.areEqual('bellevue', target.get_contact().address);

            source.setValue("value", "seattle");
            AtlasUnit.Assert.areEqual('seattle', source.value);
            AtlasUnit.Assert.areEqual('seattle', target.get_contact().address);

            target.set_contact({ address: 'bellevue' });
            AtlasUnit.Assert.areEqual('bellevue', source.value);
            AtlasUnit.Assert.areEqual('bellevue', target.get_contact().address);
        }
        finally {
            document.body.removeChild(e1);
        }
    }
    this.testBindingElementBeingObservedWithBuiltInPropertyChangedHandler["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testBindingElementToElementCheckBox = function() {
        var e1 = document.createElement("div"), e2 = document.createElement("div");
        e1.innerHTML = "<input id='cb1' type='checkbox' >";
        e2.innerHTML = "<input id='cb2' type='checkbox' checked>";
        try {
            document.body.appendChild(e1);
            document.body.appendChild(e2);

            var source = e1.childNodes[0], target = e2.childNodes[0],
            binding = this.bindMethod(target, 'checked', source,
                                      'checked', Sys.BindingMode.twoWay);

            AtlasUnit.Assert.areEqual(false, source.checked);
            AtlasUnit.Assert.areEqual(false, target.checked);

            source.checked = true;
            this.fireEventAllBrowsers(source);
            AtlasUnit.Assert.areEqual(true, source.checked);
            AtlasUnit.Assert.areEqual(true, target.checked);

            target.checked = false;
            this.fireEventAllBrowsers(target);
            AtlasUnit.Assert.areEqual(false, source.checked);
            AtlasUnit.Assert.areEqual(false, target.checked);
        }
        finally {
            document.body.removeChild(e1);
            document.body.removeChild(e2);
        }
    }
    this.testBindingElementToElementCheckBox["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testBindingElementToElementRadio = function() {
        var e1 = document.createElement("div"), e2 = document.createElement("div"),
            e3 = document.createElement("div"), e4 = document.createElement("div");
        e1.innerHTML = "<input id='r1' type='radio' name='g1' checked/>";
        e2.innerHTML = "<input id='r2' type='radio' name='g1'/> ";
        e3.innerHTML = "<input id='r3' type='radio' name='g2'/>";
        e4.innerHTML = "<input id='r4' type='radio' name='g2' checked/>";
        try {
            document.body.appendChild(e1);
            document.body.appendChild(e2);
            document.body.appendChild(e3);
            document.body.appendChild(e4);

            var radio1 = e1.childNodes[0], radio2 = e2.childNodes[0],
            radio3 = e3.childNodes[0], radio4 = e4.childNodes[0];
            AtlasUnit.Assert.areEqual(true, radio1.checked);
            AtlasUnit.Assert.areEqual(false, radio2.checked);
            AtlasUnit.Assert.areEqual(false, radio3.checked);
            AtlasUnit.Assert.areEqual(true, radio4.checked);

            var binding = this.bindMethod(radio3, 'checked', radio1,
                                         'checked', Sys.BindingMode.twoWay);

            AtlasUnit.Assert.areEqual(true, radio1.checked);
            AtlasUnit.Assert.areEqual(false, radio2.checked);
            AtlasUnit.Assert.areEqual(true, radio3.checked);
            AtlasUnit.Assert.areEqual(false, radio4.checked);

            radio1.checked = false;
            this.fireEventAllBrowsers(radio1);
            AtlasUnit.Assert.areEqual(false, radio1.checked);
            AtlasUnit.Assert.areEqual(false, radio2.checked);
            AtlasUnit.Assert.areEqual(false, radio3.checked);
            AtlasUnit.Assert.areEqual(false, radio4.checked);

            radio3.checked = true;
            this.fireEventAllBrowsers(radio3);
            AtlasUnit.Assert.areEqual(true, radio1.checked);
            AtlasUnit.Assert.areEqual(false, radio2.checked);
            AtlasUnit.Assert.areEqual(true, radio3.checked);
            AtlasUnit.Assert.areEqual(false, radio4.checked);

            radio2.checked = true;
            this.fireEventAllBrowsers(radio1);
            AtlasUnit.Assert.areEqual(false, radio1.checked);
            AtlasUnit.Assert.areEqual(true, radio2.checked);
            AtlasUnit.Assert.areEqual(false, radio3.checked);
            AtlasUnit.Assert.areEqual(false, radio4.checked);
        }
        finally {
            document.body.removeChild(e1);
            document.body.removeChild(e2);
            document.body.removeChild(e3);
            document.body.removeChild(e4);
        }
    }
    this.testBindingElementToElementRadio["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testBindingElementToElementSelect = function() {
        var e1 = document.createElement("div"), e2 = document.createElement("div");
        e1.innerHTML = "<select id='sel1'> <option>source1</option> <option selected>source2</option> </select>";
        e2.innerHTML = "<select id='sel2'> <option>target1</option> <option>target2</option> </select>";
        var select1 = e1.childNodes[0], select2 = e2.childNodes[0],
        binding = this.bindMethod(select2, 'selectedIndex',
                  select1, 'selectedIndex', Sys.BindingMode.twoWay);

        AtlasUnit.Assert.areEqual(1, select1.selectedIndex);
        AtlasUnit.Assert.areEqual(1, select2.selectedIndex);

        select1.selectedIndex = 0;
        this.fireEventAllBrowsers(select1);
        AtlasUnit.Assert.areEqual(0, select1.selectedIndex);
        AtlasUnit.Assert.areEqual(0, select2.selectedIndex);

        select2.selectedIndex = 1;
        this.fireEventAllBrowsers(select2);
        AtlasUnit.Assert.areEqual(1, select1.selectedIndex);
        AtlasUnit.Assert.areEqual(1, select2.selectedIndex);
    }
    this.testBindingElementToElementSelect["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testBindingToSelectWithMissingOptions = function() {
        var e1 = document.createElement("div"), e2 = document.createElement("div");
        e1.innerHTML = "<select id='sel1'></select>";
        e2.innerHTML = "<select id='sel2'></select>";
        var source = e1.childNodes[0], target = e2.childNodes[0],
        binding = this.bindMethod(target, 'value',
                  source, 'selectedIndex', Sys.BindingMode.twoWay);

        function createOpt(value) {
            var o = document.createElement("option");
            o.setAttribute("value", value);
            return o;
        }
        target.appendChild(createOpt("2"));
        Sys.Observer.setValue(target, "value", 2); // attempts to set source.selectedIndex=2 which fails
        AtlasUnit.Assert.areEqual(-1, source.selectedIndex);
        source.appendChild(createOpt("0"));
        source.appendChild(createOpt("1"));
        source.appendChild(createOpt("2"));
        Sys.Observer.raiseEvent(source, "optionsChanged", Sys.EventArgs.Empty); // picks it up and tries to set the index again
        AtlasUnit.Assert.areEqual(2, source.selectedIndex, "Binding should redo the change.");
        
        Sys.Observer.setValue(source, "selectedIndex", 1); // attempts to set target.value=1, which fails (it only has a '2')
        // in IE this causes it to revert to -1, in others the attempt simply fails so it remains at 0
        AtlasUnit.Assert.areEqual(Sys.Browser.agent === Sys.Browser.InternetExplorer ? -1 : 0, target.selectedIndex);
        AtlasUnit.Assert.areEqual(1, source.selectedIndex);
        target.appendChild(createOpt("1"));
        Sys.Observer.raiseEvent(target, "optionsChanged", Sys.EventArgs.Empty); // picks it up and tries to set the value again
        AtlasUnit.Assert.areEqual(1, target.selectedIndex);
    }

    this.testBindingElementToElementSimple = function() {
        var e1 = document.createElement("div"), e2 = document.createElement("div");
        e1.innerHTML = "<input type='text' value='bellevue' name='textbox1' size='30'>";
        e2.innerHTML = "<input type='text' value='redmond' name='textbox1' size='30'>";
        try {
            document.body.appendChild(e1);
            document.body.appendChild(e2);

            var source = e1.childNodes[0], target = e2.childNodes[0],
                binding = this.bindMethod(target, 'value', source,
                                            'value', Sys.BindingMode.twoWay);

            AtlasUnit.Assert.areEqual('bellevue', source.value);
            AtlasUnit.Assert.areEqual('bellevue', target.value);

            source.value = 'redmond';
            this.fireEventAllBrowsers(source);
            AtlasUnit.Assert.areEqual('redmond', source.value);
            AtlasUnit.Assert.areEqual('redmond', target.value);

            target.value = 'seattle';
            this.fireEventAllBrowsers(target);
            AtlasUnit.Assert.areEqual('seattle', source.value);
            AtlasUnit.Assert.areEqual('seattle', target.value);
        }
        finally {
            document.body.removeChild(e1);
            document.body.removeChild(e2);
        }
    }
    this.testBindingElementToElementSimple["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testBindingToRestrictedAttribute = function() {
        // using imgX as the tag name just to workaround browser quirk where the 'src' is evaluated, making it
        // difficult to test for the right value. all we care about is that the restricted protocol doesnt get
        // set on the attribute value.
        var source = document.createElement("imgX");
        source.src = "foo";
        var target = document.createElement("imgX");
        target.src = "bar";
        
        var binding = this.bindMethod(target, 'src', source, 'src', Sys.BindingMode.twoWay);

        AtlasUnit.Assert.areEqual('foo', source.src, "source start");
        AtlasUnit.Assert.areEqual('foo', target.src, "target start");

        // source->target
        Sys.Observer.setValue(source, "src", "javascript:foo");
        AtlasUnit.Assert.areEqual('javascript:foo', source.src);
        AtlasUnit.Assert.areEqual('', target.src);

        // reset        
        Sys.Observer.setValue(source, "src", "foo");
        AtlasUnit.Assert.areEqual('foo', source.src, "source reset");
        AtlasUnit.Assert.areEqual('foo', target.src, "target reset");

        // target->source
        Sys.Observer.setValue(target, "src", "javascript:bar");
        AtlasUnit.Assert.areEqual('', source.src);
        AtlasUnit.Assert.areEqual('javascript:bar', target.src);
    }

    this.testBindingElementToElementTextarea = function() {
        var e1 = document.createElement("div"), e2 = document.createElement("div");
        e1.innerHTML = "<textarea id='ta1' rows='2' cols='20'>The cat was chasing the dog.</textarea>";
        e2.innerHTML = "<textarea id='ta2' rows='2' cols='20'>The dog was chasing the cat.</textarea>";
        try {
            document.body.appendChild(e1);
            document.body.appendChild(e2);

            var area1 = e1.childNodes[0], area2 = e2.childNodes[0],
            binding = this.bindMethod(area2, 'value', area1, 'value',
                                                  Sys.BindingMode.twoWay);

            AtlasUnit.Assert.areEqual("The cat was chasing the dog.", area1.value);
            AtlasUnit.Assert.areEqual("The cat was chasing the dog.", area2.value);

            area1.value = "The dog was chasing the cat.";
            this.fireEventAllBrowsers(area1);
            AtlasUnit.Assert.areEqual("The dog was chasing the cat.", area1.value);
            AtlasUnit.Assert.areEqual("The dog was chasing the cat.", area2.value);

            area2.value = "The cat was chasing the dog.";
            this.fireEventAllBrowsers(area2);
            AtlasUnit.Assert.areEqual("The cat was chasing the dog.", area1.value);
            AtlasUnit.Assert.areEqual("The cat was chasing the dog.", area2.value);
        }
        finally {
            document.body.removeChild(e1);
            document.body.removeChild(e2);
        }
    }
    this.testBindingElementToElementTextarea["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testBindingMultipleInstances = function() {
        var object1 = new Sys.Test.BindingTest.Component(),
            object3 = new Sys.Test.BindingTest.Component(),
            element = document.createElement("div");
        element.innerHTML = "<input type='text' value='seattle' name='textbox1' size='30'>";
        try {
            document.body.appendChild(element);
            var object2 = element.childNodes[0];

            object1.set_contact({ address: 'redmond' });
            object3.set_form({ customerInfo: { area: 'bellevue'} });

            var binding12 = this.bindMethod(object2, 'value', object1,
                            'contact.address', Sys.BindingMode.oneWay),
            binding13 = this.bindMethod(object3, 'form.customerInfo.area',
                            object1, 'contact.address', Sys.BindingMode.twoWay),
            binding23 = this.bindMethod(object3, 'form.customerInfo.area', object2,
                            'value', Sys.BindingMode.oneWayToSource);

            AtlasUnit.Assert.areEqual('redmond', object1.get_contact().address);
            AtlasUnit.Assert.areEqual('redmond', object2.value);
            AtlasUnit.Assert.areEqual('redmond', object3.get_form().customerInfo.area);

            object1.set_contact({ address: 'seattle' });
            object3.raisePropertyChanged('form');
            AtlasUnit.Assert.areEqual('seattle', object1.get_contact().address);
            AtlasUnit.Assert.areEqual('seattle', object2.value);
            AtlasUnit.Assert.areEqual('seattle', object3.get_form().customerInfo.area);

            object2.value = 'bellevue';
            this.fireEventAllBrowsers(object2);
            AtlasUnit.Assert.areEqual('seattle', object1.get_contact().address);
            AtlasUnit.Assert.areEqual('bellevue', object2.value);
            AtlasUnit.Assert.areEqual('seattle', object3.get_form().customerInfo.area);

            object3.set_form({ customerInfo: { area: 'redmond'} });
            AtlasUnit.Assert.areEqual('redmond', object1.get_contact().address);
            AtlasUnit.Assert.areEqual('redmond', object2.value);
            AtlasUnit.Assert.areEqual('redmond', object3.get_form().customerInfo.area);
        }
        finally {
            document.body.removeChild(element);
        }
    }
    this.testBindingMultipleInstances["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testBindingMultiplePropertyOfSameComponent = function() {
        var object1 = new Sys.Test.BindingTest.Component(),
            object2 = new Sys.Test.BindingTest.Component();
        object1.set_contact({ address: 'redmond', areaCode: '301' });
        object2.set_form({ customerInfo: { area: 'bellevue', phone: '425'} });

        var binding1 = this.bindMethod(object2, 'form.customerInfo.area', object1,
                        'contact.address', Sys.BindingMode.oneWay),
            binding2 = this.bindMethod(object2, 'form.customerInfo.phone', object1,
                        'contact.areaCode', Sys.BindingMode.oneWayToSource);

        AtlasUnit.Assert.areEqual('redmond', object1.get_contact().address);
        AtlasUnit.Assert.areEqual('redmond', object2.get_form().customerInfo.area);
        AtlasUnit.Assert.areEqual('425', object1.get_contact().areaCode);
        AtlasUnit.Assert.areEqual('425', object2.get_form().customerInfo.phone);

        object1.get_contact().address = 'seattle';
        object1.raisePropertyChanged('contact');
        object2.raisePropertyChanged('form');
        AtlasUnit.Assert.areEqual('seattle', object1.get_contact().address);
        AtlasUnit.Assert.areEqual('seattle', object2.get_form().customerInfo.area);
        AtlasUnit.Assert.areEqual('425', object1.get_contact().areaCode);
        AtlasUnit.Assert.areEqual('425', object2.get_form().customerInfo.phone);

        object1.get_contact().areaCode = '206';
        object1.raisePropertyChanged('contact');
        object2.get_form().customerInfo.area = 'bellevue';
        object2.raisePropertyChanged('form');
        AtlasUnit.Assert.areEqual('seattle', object1.get_contact().address);
        AtlasUnit.Assert.areEqual('bellevue', object2.get_form().customerInfo.area);
        AtlasUnit.Assert.areEqual('206', object1.get_contact().areaCode);
        AtlasUnit.Assert.areEqual('425', object2.get_form().customerInfo.phone);
    }
    this.testBindingOneTimeSimple = function() {
        var source = new Sys.Test.BindingTest.Component(),
            target = new Sys.Test.BindingTest.Component();
        source.set_contact({ address: 'redmond' });
        target.set_form({ customerInfo: { area: 'seattle'} });
        var binding = this.bindMethod(target, 'form.customerInfo.area',
                        source, 'contact.address', Sys.BindingMode.oneTime);
        AtlasUnit.Assert.areEqual('redmond', target.get_form().customerInfo.area);

        source.set_contact({ address: 'bellevue' });
        AtlasUnit.Assert.areEqual('redmond', target.get_form().customerInfo.area);

        target.set_form({ customerInfo: { area: 'seattle'} });
        AtlasUnit.Assert.areEqual('bellevue', source.get_contact().address);
    }
    this.testBindingOneWaySimple = function() {
        var binding = new Sys.Binding();
        var source = new Sys.Test.BindingTest.Component(),
            target = new Sys.Test.BindingTest.Component();

        binding.set_source(source);
        binding.set_path('text');
        binding.set_target(target);
        binding.set_targetProperty('contact');
        binding.set_mode(Sys.BindingMode.oneWay);
        binding.initialize();

        source.set_text('Redmond');
        AtlasUnit.Assert.areEqual('Redmond', target.get_contact());

        target.set_contact('Seattle');
        AtlasUnit.Assert.areEqual('Redmond', source.get_text());
    }
    this.testBindingOneWayStructuralDataPath = function() {
        var source = new Sys.Test.BindingTest.Component(),
            target = new Sys.Test.BindingTest.Component();
        source.set_contact({ address: 'redmond' });
        target.set_form({ customerInfo: { area: 'redmond'} });
        var binding = this.bindMethod(target, 'form.customerInfo.area',
                        source, 'contact.address', Sys.BindingMode.oneWay);

        source.set_contact({ address: 'seattle' });
        AtlasUnit.Assert.areEqual('seattle', target.get_form().customerInfo.area);

        target.set_form({ customerInfo: { area: 'bellevue'} });
        AtlasUnit.Assert.areEqual('seattle', source.get_contact().address);
    }
    this.testBindingOneWayToSourceSimple = function() {
        var source = new Sys.Test.BindingTest.Component(),
            target = new Sys.Test.BindingTest.Component();

        source.set_contact({ address: 'redmond' });
        target.set_form({ customerInfo: { area: 'redmond'} });
        var binding = this.bindMethod(target, 'form.customerInfo.area',
                        source, 'contact.address', Sys.BindingMode.oneWayToSource);

        target.set_form({ customerInfo: { area: 'seattle'} });
        AtlasUnit.Assert.areEqual('seattle', source.get_contact().address);

        source.set_contact({ address: 'bellevue' });
        AtlasUnit.Assert.areEqual('seattle', target.get_form().customerInfo.area);
    }
    this.testBindingTwoWaySimple = function() {
        var source = new Sys.Test.BindingTest.Component(),
            target = new Sys.Test.BindingTest.Component();
        source.set_contact({ address: 'redmond' });
        target.set_form({ customerInfo: { area: 'redmond'} });
        var binding = this.bindMethod(target, 'form.customerInfo.area',
                        source, 'contact.address', Sys.BindingMode.twoWay);

        source.set_contact({ address: 'seattle' });
        AtlasUnit.Assert.areEqual('seattle', target.get_form().customerInfo.area);

        target.set_form({ customerInfo: { area: 'bellevue'} });
        AtlasUnit.Assert.areEqual('bellevue', source.get_contact().address);
    }
    // Done test bindings

    // Test individual methods
    this.testConvertMethod = function() {
        var source = new Sys.Test.BindingTest.Component(),
            target = new Sys.Test.BindingTest.Component(),
            binding = this.bindMethod(target, 'text', source,
                        'text', Sys.BindingMode.oneWay);

        binding.set_convert(Sys.Test.BindingTest.testConvertFunction);
        source.set_text("testUserConvertMethodPassedInAsFunction");
        AtlasUnit.Assert.areEqual("testUserConvertMethodPassedInAsFunction_converted", target.get_text());

        binding.set_convert("Sys.Test.BindingTest.testConvertFunction");
        source.set_text("testUserConvertMethodPassedInAsFunctionName");
        AtlasUnit.Assert.areEqual("testUserConvertMethodPassedInAsFunctionName_converted", target.get_text());

        binding.set_convert(Boolean.parse);
        source.set_text("true");
        AtlasUnit.Assert.isTrue(target.get_text(), "testConvertMethod failed to convert to true boolean value.");
        source.set_text("false");
        AtlasUnit.Assert.isFalse(target.get_text(), "testConvertMethod failed to convert to false boolean value.");

        binding.set_convert(Date.parse);
        source.set_text("Jan 8, 2005");
        AtlasUnit.Assert.areEqual(1105171200000, target.get_text());

        binding.set_convert(Number.parseLocale);
        source.set_text("12");
        AtlasUnit.Assert.areEqual(12, target.get_text());

        binding.set_convert(Number.parseInvariant);
        source.set_text("1.23445");
        AtlasUnit.Assert.areEqual(1.23445, target.get_text());
    }
    this.testConvertBackMethod = function() {
        var source = new Sys.Test.BindingTest.Component(),
            target = new Sys.Test.BindingTest.Component(),
            binding = this.bindMethod(target, 'text', source,
                        'text', Sys.BindingMode.oneWayToSource);

        binding.set_convertBack(Sys.Test.BindingTest.testConvertFunction);
        target.set_text("testUserConvertBackMethod");
        AtlasUnit.Assert.areEqual("testUserConvertBackMethod_converted", source.get_text());

        binding.set_convertBack("Sys.Test.BindingTest.testConvertFunction");
        target.set_text("testUserConvertBackMethod");
        AtlasUnit.Assert.areEqual("testUserConvertBackMethod_converted", source.get_text());

        binding.set_convertBack(Boolean.parse);
        target.set_text("true");
        AtlasUnit.Assert.isTrue(source.get_text(), "testConvertBackMethod failed to convert to true boolean value.");
        target.set_text("false");
        AtlasUnit.Assert.isFalse(source.get_text(), "testConvertBackMethod failed to convert to false boolean value.");

        binding.set_convertBack(Date.parse);
        target.set_text("Jan 8, 2005");
        AtlasUnit.Assert.areEqual(1105171200000, source.get_text());

        binding.set_convertBack(Number.parseLocale);
        target.set_text("12");
        AtlasUnit.Assert.areEqual(12, source.get_text());

        binding.set_convertBack(Number.parseInvariant);
        target.set_text("1.23445");
        AtlasUnit.Assert.areEqual(1.23445, source.get_text());
    }
    this.testConvertersUseBindingsHolder = function() {
        var source = new Sys.Test.BindingTest.Component(),
            target = new Sys.Test.BindingTest.Component(),
            binding = this.bindMethod(target, 'text', source,
                        'text', Sys.BindingMode.twoWay);

        Sys.converters.foo = function() { return 'foo'; };
        Sys.converters.fooBack = function() { return 'fooBack'; };
        binding.set_convert("foo");
        binding.set_convertBack("fooBack");
        
        source.set_text("zzz");
        AtlasUnit.Assert.areEqual("foo", target.get_text());
        target.set_text("yyy");
        AtlasUnit.Assert.areEqual("fooBack", source.get_text());
    }    
    this.testDispose = function() {
        var source = new Sys.Test.BindingTest.Component(),
            target = new Sys.Test.BindingTest.Component(),
            binding = this.bindMethod(target, 'text', source,
                        'text', Sys.BindingMode.oneWay);

        source.set_text('Redmond');
        AtlasUnit.Assert.areEqual('Redmond', target.get_text());

        binding.dispose();
        source.set_text('Seattle');
        AtlasUnit.Assert.areEqual('Seattle', source.get_text());
        AtlasUnit.Assert.areEqual('Redmond', target.get_text());
    }
    this.testDisposeMultipleElementSimple = function() {
        var div = document.createElement("div"), div2 = document.createElement("div");
        div.innerHTML = "<input type='text' value='seattle' name='textbox1' size='30'>";
        div2.innerHTML = "<input type='text' value='redmond' name='textbox1' size='30'>";
        try {
            document.body.appendChild(div);
            document.body.appendChild(div2);
            var element1 = div.childNodes[0], element2 = div2.childNodes[0],
            component1 = new Sys.Test.BindingTest.Component(),
            component2 = new Sys.Test.BindingTest.Component();
            component1.set_contact({ address: 'bellevue' });
            component2.set_form({ customerInfo: { area: 'renton'} });

            var binding1 = this.bindMethod(element1, 'value', element2,
                            'value', Sys.BindingMode.twoWay),
            binding2 = this.bindMethod(component1, 'contact.address',
                            element1, 'value', Sys.BindingMode.oneWay),
            binding3 = this.bindMethod(element2, 'value', component2,
                            'form.customerInfo.area', Sys.BindingMode.oneWayToSource);

            AtlasUnit.Assert.areEqual('redmond', element1.value);
            AtlasUnit.Assert.areEqual('redmond', element2.value);
            AtlasUnit.Assert.areEqual('redmond', component1.get_contact().address);
            AtlasUnit.Assert.areEqual('redmond', component2.get_form().customerInfo.area);

            element2.value = 'seattle';
            this.fireEventAllBrowsers(element2);
            this.fireEventAllBrowsers(element1);

            AtlasUnit.Assert.areEqual('seattle', element1.value);
            AtlasUnit.Assert.areEqual('seattle', element2.value);
            AtlasUnit.Assert.areEqual('seattle', component1.get_contact().address);
            AtlasUnit.Assert.areEqual('seattle', component2.get_form().customerInfo.area);

            element1.dispose();

            element2.value = 'bellevue';
            this.fireEventAllBrowsers(element2);
            this.fireEventAllBrowsers(element1);

            AtlasUnit.Assert.areEqual('seattle', element1.value);
            AtlasUnit.Assert.areEqual('bellevue', element2.value);
            AtlasUnit.Assert.areEqual('seattle', component1.get_contact().address);
            AtlasUnit.Assert.areEqual('bellevue', component2.get_form().customerInfo.area);

            element2.dispose();

            element2.value = 'renton';
            this.fireEventAllBrowsers(element2);
            this.fireEventAllBrowsers(element1);

            AtlasUnit.Assert.areEqual('seattle', element1.value);
            AtlasUnit.Assert.areEqual('renton', element2.value);
            AtlasUnit.Assert.areEqual('seattle', component1.get_contact().address);
            AtlasUnit.Assert.areEqual('bellevue', component2.get_form().customerInfo.area);
        }
        finally {
            document.body.removeChild(div);
            document.body.removeChild(div2);
        }
    }
    this.testDisposeMultipleElementSimple["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testDisposeMultipleTimeAfterInitialize = function() {
        var source = new Sys.Test.BindingTest.Component(),
            div = document.createElement("div");
        div.innerHTML = "<input id='cb1' type='checkbox'>";

        try {
            document.body.appendChild(div);
            var target = div.childNodes[0],
            binding = this.bindMethod(target, 'checked', source,
                            'text', Sys.BindingMode.twoWay);
            binding.dispose();
            binding.dispose();
        }
        finally {
            document.body.removeChild(div);
        }
    }

    this.testDisposeMultipleTimeWithoutInitialize = function() {
        var binding = new Sys.Binding();
        binding.dispose();
        binding.dispose();
    }
    
    this.testDisposeSingleElementComplex = function() {
        var div = document.createElement("div"), div2 = document.createElement("div");
        div.innerHTML = "<input type='text' value='seattle' name='textbox1' size='30'>";
        div2.innerHTML = "<input type='text' value='redmond' name='textbox1' size='30'>";

        try {
            document.body.appendChild(div);
            document.body.appendChild(div2);
            var element1 = div.childNodes[0], element2 = div2.childNodes[0],
            component1 = new Sys.Test.BindingTest.Component(),
            component2 = new Sys.Test.BindingTest.Component();
            component1.set_contact({ address: 'bellevue' });
            component2.set_form({ customerInfo: { area: 'renton'} });

            var binding1 = this.bindMethod(element1, 'value', element2,
                            'value', Sys.BindingMode.oneWay),
            binding2 = this.bindMethod(component1, 'contact.address',
                            element1, 'value', Sys.BindingMode.twoWay),
            binding3 = this.bindMethod(element1, 'value', component2,
                            'form.customerInfo.area', Sys.BindingMode.oneWayToSource);

            AtlasUnit.Assert.areEqual('redmond', element1.value);
            AtlasUnit.Assert.areEqual('redmond', element2.value);
            AtlasUnit.Assert.areEqual('redmond', component1.get_contact().address);
            AtlasUnit.Assert.areEqual('redmond', component2.get_form().customerInfo.area);

            element2.value = 'seattle';
            this.fireEventAllBrowsers(element2);
            this.fireEventAllBrowsers(element1);

            AtlasUnit.Assert.areEqual('seattle', element1.value);
            AtlasUnit.Assert.areEqual('seattle', element2.value);
            AtlasUnit.Assert.areEqual('seattle', component1.get_contact().address);
            AtlasUnit.Assert.areEqual('seattle', component2.get_form().customerInfo.area);

            element1.dispose();

            element2.value = 'bellevue';
            this.fireEventAllBrowsers(element2);
            this.fireEventAllBrowsers(element1);

            AtlasUnit.Assert.areEqual('seattle', element1.value);
            AtlasUnit.Assert.areEqual('bellevue', element2.value);
            AtlasUnit.Assert.areEqual('seattle', component1.get_contact().address);
            AtlasUnit.Assert.areEqual('seattle', component2.get_form().customerInfo.area);
        }
        finally {
            document.body.removeChild(div);
            document.body.removeChild(div2);
        }
    }
    this.testDisposeSingleElementComplex["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testGetDefaultMode = function() {
        function createHtml(html) {
            var div = document.createElement("div");
            div.innerHTML = html;
            return div.childNodes[0];
        }
        var div = document.createElement("div"),
            div2 = document.createElement("div"),
            div3 = document.createElement("div"),
            div4 = document.createElement("div"),
            div5 = document.createElement("div");
        div.innerHTML = "<input type='text' value='seattle' name='textbox1' size='30'/>";
        div2.innerHTML = "<span type='text' value='redmond' name='textbox1' size='30'/>";
        div3.innerHTML = "<input type='radio'/>";
        div4.innerHTML = "<textarea></textarea>";
        div5.innerHTML = "<select></select>";
        var inputText = createHtml("<input type='text' value='seattle' name='textbox1' size='30'/>"),
            spanText = createHtml("<span type='text' value='redmond' name='textbox1' size='30'/>"),
            inputRadio = createHtml("<input type='radio'/>"),
            textarea = createHtml("<textarea></textarea>"),
            select = createHtml("<select></select>"),
            inputButton = createHtml("<input type='button' value='button'/>"),
            inputSubmit = createHtml("<input type='submit' value='button'/>"),
            inputReset = createHtml("<input type='reset' value='button'/>"),
            inputFile = createHtml("<input type='file' />"),
            inputImage = createHtml("<input type='image' />"),
            inputHidden = createHtml("<input type='hidden' value='hidden'/>"),
            notifyingComponent = new Sys.Test.BindingTest.Component(),
            nonNotifyingComponent = {},
            _this = this;
        
        function test(target, properties, expectedMode) {
            for (var i = 0; i < properties.length; i++) {
                var binding = _this.bindMethod(target, properties[i], {}, 'text', Sys.BindingMode.auto);
                AtlasUnit.Assert.areEqual(expectedMode, binding.get_mode(), "Failed for target: " + ((target.tagName ? (target.tagName + ", type=" + target.type) : "") || target.toString()) + ", property=" + properties[i]);
            }
        }
        
        test(notifyingComponent, ["text", "foo"], Sys.BindingMode.twoWay);
        test(nonNotifyingComponent, ["text", "foo"], Sys.BindingMode.oneWay);
        test(spanText, ["value"], Sys.BindingMode.oneWay);
        test(inputText, ["value"], Sys.BindingMode.twoWay);
        test(inputText, ["class", "foo", "width"], Sys.BindingMode.oneWay);
        test(inputButton, ["value", "selectedindex", "checked"], Sys.BindingMode.oneWay);
        test(inputSubmit, ["value", "selectedindex", "checked"], Sys.BindingMode.oneWay);
        test(inputReset, ["value", "selectedindex", "checked"], Sys.BindingMode.oneWay);
        test(inputFile, ["value"], Sys.BindingMode.twoWay);
        test(inputImage, ["value", "selectedindex", "checked"], Sys.BindingMode.oneWay);
        test(inputHidden, ["value", "selectedindex", "checked"], Sys.BindingMode.oneWay);
        test(inputRadio, ["checked"], Sys.BindingMode.twoWay);
        test(inputRadio, ["class", "foo", "width"], Sys.BindingMode.oneWay);
        test(textarea, ["value"], Sys.BindingMode.twoWay);
        test(textarea, ["class", "foo", "width"], Sys.BindingMode.oneWay);
        test(select, ["value", "selectedindex"], Sys.BindingMode.twoWay);
        test(select, ["class", "foo", "width"], Sys.BindingMode.oneWay);
    }

    this.testDefaultMode = function() {
        var div = document.createElement("div"), div2 = document.createElement("div");
        div.innerHTML = "<input type='text' value='seattle' name='textbox1' size='30'>";
        div2.innerHTML = "<span value='get'>";

        try {
            document.body.appendChild(div);
            document.body.appendChild(div2);
            var element1 = div.childNodes[0], element2 = div2.childNodes[0],
                component1 = new Sys.Test.BindingTest.Component(),
                component2 = new Sys.Test.BindingTest.SomeClass();
            binding1 = this.bindMethod(component1, 'text', element1, 'value',
                                                    Sys.BindingMode.auto);
            element1.value = "Redmond";
            this.fireEventAllBrowsers(element1);
            AtlasUnit.Assert.areEqual("Redmond", component1.get_text());
            component1.set_text("Seattle");
            AtlasUnit.Assert.areEqual("Seattle", element1.value);

            var binding2 = this.bindMethod(component2, 'text', component1, 'text',
                                                    Sys.BindingMode.auto);
            component1.set_text("Bellevue");
            AtlasUnit.Assert.areEqual("Bellevue", component2.text);
            component2.text = "Redmond";
            AtlasUnit.Assert.areEqual("Bellevue", component1.get_text());

            var binding3 = this.bindMethod(element2, 'value', component1, 'text',
                                                    Sys.BindingMode.auto);
            component1.set_text("Bellevue");
            AtlasUnit.Assert.areEqual("Bellevue", element2.value);
            element2.value = "Redmond";
            AtlasUnit.Assert.areEqual("Bellevue", component1.get_text());
        }
        finally {
            document.body.removeChild(div);
            document.body.removeChild(div2);
        }
    }
    this.testDefaultMode["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testIgnoreErrorsOptionInConverting = function() {
        var source = new Sys.Test.BindingTest.Component(),
            target = new Sys.Test.BindingTest.Component(),
            binding = this.bindMethod(target, 'text', source,
                        'text', Sys.BindingMode.twoWay, Boolean.parse, Number.parseInvariant, true);
        try {
            source.set_text("notACorrectInputForBooleanParse");
        } catch (e) {
            throw Error.invalidOperation("Error still throws even when ignoreError glag is set to true.");
        }
        source.set_text("true");
        AtlasUnit.Assert.isTrue(target.get_text(), "testConvertMethod failed to convert to true boolean value.");

        try {
            target.set_text(true);
        } catch (e) {
            throw Error.invalidOperation("Error still throws even when ignoreError glag is set to true.");
        }
        target.set_text("3.423");
        AtlasUnit.Assert.areEqual(3.423, source.get_text());
    }
    this.testUpdateMethod = function() {
        var source = new Sys.Test.BindingTest.Component(),
            target = new Sys.Test.BindingTest.Component();

        source.set_contact({ address: 'redmond' });
        target.set_form({ customerInfo: { area: 'seattle'} });
        var bindingOneWay = this.bindMethod(target, 'form.customerInfo.area',
                        source, 'contact.address', Sys.BindingMode.oneWay);
        AtlasUnit.Assert.areEqual('redmond', source.get_contact().address);
        AtlasUnit.Assert.areEqual('redmond', target.get_form().customerInfo.area);

        source.set_contact({ address: 'bellevue' });
        target.set_form({ customerInfo: { area: 'seattle'} });
        AtlasUnit.Assert.areEqual('bellevue', source.get_contact().address);
        AtlasUnit.Assert.areEqual('seattle', target.get_form().customerInfo.area);
        bindingOneWay.update(Sys.BindingMode.oneWay);
        AtlasUnit.Assert.areEqual('bellevue', source.get_contact().address);
        AtlasUnit.Assert.areEqual('bellevue', target.get_form().customerInfo.area);

        target.set_form({ customerInfo: { area: 'redmond'} });
        AtlasUnit.Assert.areEqual('bellevue', source.get_contact().address);
        AtlasUnit.Assert.areEqual('redmond', target.get_form().customerInfo.area);
        bindingOneWay.update(Sys.BindingMode.oneWayToSource);
        AtlasUnit.Assert.areEqual('redmond', source.get_contact().address);
        AtlasUnit.Assert.areEqual('redmond', target.get_form().customerInfo.area);

        target.set_form({ customerInfo: { area: 'seattle'} });
        AtlasUnit.Assert.areEqual('redmond', source.get_contact().address);
        AtlasUnit.Assert.areEqual('seattle', target.get_form().customerInfo.area);
        bindingOneWay.update(Sys.BindingMode.twoWay);
        AtlasUnit.Assert.areEqual('redmond', source.get_contact().address);
        AtlasUnit.Assert.areEqual('redmond', target.get_form().customerInfo.area);
    }
    // Done test individual methods
    // Test error conditions
    this.testErrorWhenConvertMethodWithInvalidInputType = function() {
        var source = new Sys.Test.BindingTest.Component(),
            target = new Sys.Test.BindingTest.Component(),
            binding = this.bindMethod(target, 'text', source,
                        'text', Sys.BindingMode.oneWay);
        binding.set_convert(null);
    }
    this.testErrorWhenConvertMethodWithInvalidInputType["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testErrorWhenConvertMethodWithInvalidInputType["AtlasUnit.ExpectedException"] = {
        message: "Sys.InvalidOperationException: '' must be of type Function or the name of a function as a String."
    }

    this.testErrorWhenConvertMethodWithNonexistConvertFunction = function() {
        var source = new Sys.Test.BindingTest.Component(),
            target = new Sys.Test.BindingTest.Component(),
            binding = this.bindMethod(target, 'text', source,
                        'text', Sys.BindingMode.oneWay);
        binding.set_convert("ThisFunctionNameDoesNotExist");
    }
    this.testErrorWhenConvertMethodWithNonexistConvertFunction["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testErrorWhenConvertMethodWithNonexistConvertFunction["AtlasUnit.ExpectedException"] = {
        message: "Sys.InvalidOperationException: A function with the name 'ThisFunctionNameDoesNotExist' could not be found."
    }

    this.testErrorWhenDataPathHasNullReference = function() {
        var source = new Sys.Test.BindingTest.Component(),
            target = new Sys.Test.BindingTest.Component();

        source.set_contact({ address: 'redmond' });
        target.set_form({ customerInfo: { area: 'seattle'} });
        var binding1 = this.bindMethod(target, 'contact.customerInfo.area', source, 'contact.address', Sys.BindingMode.oneWay);
        var binding2 = this.bindMethod(target, 'form.address.area', source, 'contact.address', Sys.BindingMode.oneWay);
        var binding3 = this.bindMethod(target, 'form.customerInfo.area', source, 'area.address', Sys.BindingMode.oneWay);
    }

    this.testErrorWhenInitializeWithInvalidInput = function() {
        var error = null, target = new Sys.Test.BindingTest.Component(),
            source = new Sys.Test.BindingTest.Component();
        try {
            var binding4 = new Sys.Binding;
            binding4.set_source(source);
            binding4.set_path('contact.address');
            binding4.set_target(target);
            binding4.set_mode(Sys.BindingMode.oneWay);
            binding4.initialize();
        }
        catch (e) {
            error = e;
        }
        AtlasUnit.Assert.isNotNull(error, "Expected exception when InitializeWithInvalidInput");
        AtlasUnit.Assert.areEqual("Sys.InvalidOperationException: Binding 'targetProperty' must be set prior to initialize.",
                                  error.message, "Expected exception when InitializeWithInvalidInput");
    }
    this.testErrorWhenInitializeWithInvalidInput["AtlasUnit.Categories"] = ["DebugOnly"];
    
    this.testWithNoSourceAndTarget = function() {
        var target = {}, source = {}

        var binding1 = new Sys.Binding();
        binding1.set_path('foo');
        binding1.set_target(target);
        binding1.set_defaultValue(88);
        binding1.set_targetProperty('bar');
        binding1.set_mode(Sys.BindingMode.oneWay);
        binding1.initialize();
        AtlasUnit.Assert.areEqual(88, target.bar);

        binding1 = new Sys.Binding();
        binding1.set_path('foo');
        binding1.set_target(target);
        binding1.set_convert(function() { return 89; });
        binding1.set_targetProperty('bar');
        binding1.set_mode(Sys.BindingMode.oneWay);
        binding1.initialize();
        AtlasUnit.Assert.areEqual(89, target.bar);

        binding1 = new Sys.Binding();
        binding1.set_path('foo');
        binding1.set_target(target);
        binding1.set_targetProperty('bar');
        binding1.set_mode(Sys.BindingMode.twoWay);
        binding1.initialize();
        AtlasUnit.Assert.areEqual(null, target.bar, "target.bar");
        binding1.update(Sys.BindingMode.oneWayToSource);
        
        binding1 = new Sys.Binding();
        binding1.set_path('foo');
        binding1.set_source(source);
        binding1.set_convertBack(function() { return 90; });
        binding1.set_targetProperty('bar');
        binding1.set_mode(Sys.BindingMode.twoWay);
        binding1.initialize();
        binding1.update(Sys.BindingMode.oneWayToSource);
        AtlasUnit.Assert.areEqual(90, source.foo, "source.foo");        
    }

    this.testErrorWhenUpdateBeforeInit = function() {
        var error = null, source = new Sys.Test.BindingTest.Component(),
            target = new Sys.Test.BindingTest.Component();

        source.set_contact({ address: 'redmond' });
        target.set_form({ customerInfo: { area: 'seattle'} });
        try {
            var binding = new Sys.Binding;
            binding.set_source(source);
            binding.set_path('contact.address');
            binding.set_target(target);
            binding.set_targetProperty('form.customerInfo.area');
            binding.set_mode(Sys.BindingMode.oneWay);
            binding.update(Sys.BindingMode.oneWay);
            binding.initialize();
        }
        catch (e) {
            error = e;
        }
        AtlasUnit.Assert.isNotNull(error, "Expected exception when InitializeWithInvalidInput");
        AtlasUnit.Assert.areEqual("Sys.InvalidOperationException: Update cannot be called before initialize.",
                                  error.message, "Expected exception when InitializeWithInvalidInput");
    }
    this.testErrorWhenUpdateBeforeInit["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testErrorWhenUpdateBindingAferInit = function() {
        var error = null, target = new Sys.Test.BindingTest.Component(),
            source = new Sys.Test.BindingTest.Component();
        source.set_contact({ address: 'redmond' });
        target.set_form({ customerInfo: { area: 'seattle'} });
        var binding2 = this.bindMethod(target, 'form.customerInfo.area',
                            source, 'contact.address', Sys.BindingMode.oneWay);
        try {
            binding2.set_source(target);
        }
        catch (e) {
            error = e;
        }
        AtlasUnit.Assert.isNotNull(error, "Expected exception when InitializeWithInvalidInput");
        AtlasUnit.Assert.areEqual("Sys.InvalidOperationException: Binding 'source' cannot be set after initialize.",
                                  error.message, "Expected exception when InitializeWithInvalidInput");
        error = null;
        try {
            binding2.set_target(source);
        }
        catch (e) {
            error = e;
        }
        AtlasUnit.Assert.isNotNull(error, "Expected exception when InitializeWithInvalidInput");
        AtlasUnit.Assert.areEqual("Sys.InvalidOperationException: Binding 'target' cannot be set after initialize.",
                                  error.message, "Expected exception when InitializeWithInvalidInput");
        error = null;
        try {
            binding2.set_path("test.test");
        }
        catch (e) {
            error = e;
        }
        AtlasUnit.Assert.isNotNull(error, "Expected exception when InitializeWithInvalidInput");
        AtlasUnit.Assert.areEqual("Sys.InvalidOperationException: Binding 'path' cannot be set after initialize.",
                                  error.message, "Expected exception when InitializeWithInvalidInput");

        error = null;
        try {
            binding2.set_targetProperty("test.test");
        }
        catch (e) {
            error = e;
        }
        AtlasUnit.Assert.isNotNull(error, "Expected exception when InitializeWithInvalidInput");
        AtlasUnit.Assert.areEqual("Sys.InvalidOperationException: Binding 'targetProperty' cannot be set after initialize.",
                                  error.message, "Expected exception when InitializeWithInvalidInput");

        error = null;
        try {
            binding2.set_mode(Sys.BindingMode.twoWay);
        }
        catch (e) {
            error = e;
        }
        AtlasUnit.Assert.isNotNull(error, "Expected exception when InitializeWithInvalidInput");
        AtlasUnit.Assert.areEqual("Sys.InvalidOperationException: Binding 'mode' cannot be set after initialize.",
                                  error.message, "Expected exception when InitializeWithInvalidInput");
    }
    this.testErrorWhenUpdateBindingAferInit["AtlasUnit.Categories"] = ["DebugOnly"];
    // Test error conditions end

    // Test property getters/setters
    this.testPropertyMode = function() {
        var mode = Sys.BindingMode.twoWay;
        var binding = new Sys.Binding();
        binding.set_mode(mode);
        AtlasUnit.Assert.areEqual(mode, binding.get_mode());
    }
    this.testPropertySource = function() {
        var source = {};
        var binding = new Sys.Binding();
        binding.set_source(source);
        AtlasUnit.Assert.areEqual(source, binding.get_source());
    }
    this.testPropertyPath = function() {
        var path = 'source1.source2.source3.source4';
        var binding = new Sys.Binding();
        binding.set_path(path);
        AtlasUnit.Assert.areEqual(path, binding.get_path());
        AtlasUnit.Assert.elementsEqual(['source1', 'source2', 'source3', 'source4'], binding._pathArray);
    }
    this.testPropertyTarget = function() {
        var target = {};
        var binding = new Sys.Binding();
        binding.set_target(target);
        AtlasUnit.Assert.areEqual(target, binding.get_target());
    }
    this.testPropertyTargetProperty = function() {
        var targetProperty = 'target1.target2.target3.target4';
        var binding = new Sys.Binding();
        binding.set_targetProperty(targetProperty);
        AtlasUnit.Assert.areEqual(targetProperty, binding.get_targetProperty());
        AtlasUnit.Assert.elementsEqual(['target1', 'target2', 'target3', 'target4'],
                                       binding._targetPropertyArray);
    }
    this.testDefaultValueProperty = function() {
        var b = new Sys.Binding();
        AtlasUnit.Assert.isNull(b.get_defaultValue());
        b.set_defaultValue("foo");
        AtlasUnit.Assert.areEqual("foo", b.get_defaultValue());
        b.set_defaultValue(null);
        AtlasUnit.Assert.isNull(b.get_defaultValue());
        
        var target = { foo: "foo" }, source = {};
        b.set_target(target);
        b.set_source(source);
        b.set_targetProperty("foo");
        b.set_path("foo.bar");
        b.set_defaultValue(8);
        AtlasUnit.Assert.areEqual("foo", target.foo);
        b.initialize();
        AtlasUnit.Assert.areEqual(8, target.foo);
        b.set_defaultValue("baz");
        b.update();
        AtlasUnit.Assert.areEqual("baz", target.foo);
    }
    this.testBindingToCssClass = function() {
        var binding = new Sys.Binding(),
            target = document.createElement("span"),
            source = { foo: { bar: true } };
        binding.set_targetProperty("class:foo");
        binding.set_path("foo.bar");
        binding.set_target(target);
        binding.set_source(source);
        binding.initialize();
        AtlasUnit.Assert.areEqual("foo", target.className, "Initially true so it should have the class immediately.");
        Sys.Observer.setValue(source, "foo.bar", false);
        AtlasUnit.Assert.areEqual("", target.className, "Path set to false, so class should be removed.");
        Sys.Observer.setValue(source, "foo.bar", true);
        AtlasUnit.Assert.areEqual("foo", target.className, "Path set to true, so class should be added again.");
        Sys.Observer.setValue(source, "foo.bar", 88);
        AtlasUnit.Assert.areEqual("foo", target.className, "Path set to a true value, but class shouldn't be added twice.");
        Sys.Observer.setValue(source, "foo.bar", 0);
        AtlasUnit.Assert.areEqual("", target.className, "Path set to a false value, so class should be removed.");
    }
    this.testSysBind = function() {
        var target = {},
            source = { bar: 'bar' },
            binding = Sys.binding(target, "foo", source, "bar", { mode: "twoWay", expando: 'expando' });
        AtlasUnit.Assert.areEqual("bar", target.foo);
        Sys.Observer.setValue(target, "foo", "foo");
        AtlasUnit.Assert.areEqual("foo", source.bar);
        AtlasUnit.Assert.areEqual("expando", binding.expando);
    }
    // Done test getters/setters
    // Helpers
    this.fireEventAllBrowsers = function(object) {
        if (object.fireEvent) {
            object.fireEvent('onchange');
        }
        else {
            if (object.dispatchEvent) {
                var event = document.createEvent("HTMLEvents");
                event.initEvent("change", true, true);
                object.dispatchEvent(event);
            }
        }
    }
    this.bindMethod = function(target, targetProperty, source, path,
                               mode, convert, convertBack, ignoreErrors) {
        /// <summary>Method to instantiate a binding, with the correct inputs set</summary>
        /// <param name="source" mayBeNull="false">The source input</param>
        /// <param name="path" type="String" mayBeNull="false">The source data path input</param>
        /// <param name="target" mayBeNull="false">The target input</param>
        /// <param name="targetProperty" type="String" mayBeNull="false">The target data path input</param>
        /// <param name="mode" type="Sys.BindingMode" mayBeNull="false">The mode input</param>
        /// <param name="convert" optional="true" mayBeNull="true">The convert function</param>
        /// <param name="convertBack" optional="true" mayBeNull="true">The convertBack function</param>
        /// <param name="ignoreErrors" type="Boolean" optional="true" mayBeNull="true">The option to ignore errors for convert/convertBack</param>        
        var binding = $create(Sys.Binding, { target: target, targetProperty: targetProperty,
            source: source, path: path, mode: mode
        });
        if (convert) {
            binding.set_convert(convert);
        }
        if (convertBack) {
            binding.set_convertBack(convertBack);
        }
        if (ignoreErrors) {
            binding.set_ignoreErrors(ignoreErrors);
        }
        return binding;
    }
}
Sys.Test.BindingTest.registerClass("Sys.Test.BindingTest");
Sys.Test.BindingTest["AtlasUnit.IsTestFixture"] = true;
Sys.Test.BindingTest.testConvertFunction = function(value, obj) {
    return value = value + "_converted";
}
Sys.Test.BindingTest.Component = function() {
    Sys.Test.BindingTest.Component.initializeBase(this);
}
Sys.Test.BindingTest.Component.prototype = {
    _contact: null,
    _form: null,
    _text: null,
    get_contact: function() {
        return this._contact;
    },
    set_contact: function(value) {
       this._contact = value;
       this.raisePropertyChanged('contact');
    },
    get_form: function() {
        return this._form;
    },
    set_form: function(value) {
        this._form = value;
        this.raisePropertyChanged('form');
    },
    get_text: function() {
        return this._text;
    },
    set_text: function(value) {
       this._text = value;
       this.raisePropertyChanged('text');
    }
}
Sys.Test.BindingTest.Component.registerClass('Sys.Test.BindingTest.Component', Sys.Component);
Sys.Test.BindingTest.SomeClass = function() {
}
Sys.Test.BindingTest.SomeClass.prototype = {
    _text: null,
    get_text: function() {
        return this._text;
    }
}
Sys.Test.BindingTest.SomeClass.registerClass('Sys.Test.BindingTest.SomeClass');
