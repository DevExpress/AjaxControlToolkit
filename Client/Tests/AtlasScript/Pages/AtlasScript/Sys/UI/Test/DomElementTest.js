/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("Sys.UI.Test");

Sys.UI.Test.DomElementTest = function() {

    this.testCssClass = function() {
        var element = document.createElement('DIV');
        Sys.UI.DomElement.addCssClass(element, 'foo');
        AtlasUnit.Assert.areEqual('foo', element.className);
        Sys.UI.DomElement.addCssClass(element, 'bar');
        AtlasUnit.Assert.areEqual('foo bar', element.className);
        Sys.UI.DomElement.addCssClass(element, 'foo');
        AtlasUnit.Assert.areEqual('foo bar', element.className);
        Sys.UI.DomElement.removeCssClass(element, 'bar');
        AtlasUnit.Assert.areEqual('foo', element.className);
        Sys.UI.DomElement.toggleCssClass(element, 'foo');
        AtlasUnit.Assert.areEqual('', element.className);
        Sys.UI.DomElement.toggleCssClass(element, 'bar');
        AtlasUnit.Assert.areEqual('bar', element.className);
        Sys.UI.DomElement.toggleCssClass(element, 'foo');
        AtlasUnit.Assert.areEqual('bar foo', element.className);
    }
    
    this.testCurrentStyle = function() {
        var div = document.createElement('DIV');
        div.style.color = 'red';
        document.body.appendChild(div);
        
        // DevDiv Bugs 119484:
        // Firefox reports the color as rgb(255, 0, 0) format
        // Opera reports the color as #ff0000
        var color = Sys.UI.DomElement._getCurrentStyle(div).color;
        AtlasUnit.Assert.isTrue(Array.indexOf(["red", "rgb(255, 0, 0)", "#ff0000"], color) !== -1, "color was: |" + color + "|");
        
        document.body.removeChild(div);
        
        var text = document.createTextNode('some text');
        document.body.appendChild(text);
        
        AtlasUnit.Assert.isNull(Sys.UI.DomElement._getCurrentStyle(text));
        
        document.body.removeChild(text);
    }

    this.testGetBoundsAndLocation = function() {
        var div = document.createElement('DIV');
        Sys.UI.DomElement.setLocation(div, 10, 15);
        div.style.width = '20px';
        div.style.height = '25px';
        document.body.appendChild(div);

        var bounds = Sys.UI.DomElement.getBounds(div);
        var location = Sys.UI.DomElement.getLocation(div);

        AtlasUnit.Assert.areEqual(10, bounds.x);
        AtlasUnit.Assert.areEqual(15, bounds.y);
        AtlasUnit.Assert.areEqual(20, bounds.width);
        AtlasUnit.Assert.areEqual(25, bounds.height);
        AtlasUnit.Assert.areEqual(10, location.x);
        AtlasUnit.Assert.areEqual(15, location.y);

        document.body.removeChild(div);
    }
    
    this.testGetElementById = function() {
        var div = document.createElement('DIV');
        document.body.appendChild(div);
        var inner = document.createElement('DIV');
        var innerId = inner.id = 'myInnerDiv'
        div.appendChild(inner);
        
        AtlasUnit.Assert.areEqual(innerId, $get(innerId).id);
        
        document.body.removeChild(div);
    }

    this.testInstantiate = function() {
        var a = new Sys.UI.DomElement();
    }
    this.testInstantiate["AtlasUnit.ExpectedException"] = {
        name: 'Sys.NotImplementedException'
    };
    this.testInstantiate["AtlasUnit.Categories"] = ["DebugOnly"];
    
    this.testResolveElement = function() {
        var c = document.createElement('div');
        c.innerHTML = "<div id='div1'></div><div id='div2'></div>";
        var e = Sys.UI.DomElement.resolveElement("div1", c);
        AtlasUnit.Assert.isNotNull(e);
        AtlasUnit.Assert.areEqual("div1", e.id);
        e = Sys.UI.DomElement.resolveElement("div2", c);
        AtlasUnit.Assert.isNotNull(e);
        AtlasUnit.Assert.areEqual("div2", e.id);
        e = Sys.UI.DomElement.resolveElement(e);
        AtlasUnit.Assert.isNotNull(e);
        AtlasUnit.Assert.areEqual("div2", e.id);
    }
    
    this.testResolveElementNotFound = function() {
        Sys.UI.DomElement.resolveElement("doesntexist");
    }
    this.testResolveElementNotFound["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        message: "Sys.ArgumentException: An element with id 'doesntexist' could not be found.\nParameter name: elementOrElementId"
    };
    this.testResolveElementNotFound["AtlasUnit.Categories"] = ["DebugOnly"];

    this.testResolveElementBadType = function() {
        Sys.UI.DomElement.resolveElement(88);
    }
    this.testResolveElementBadType["AtlasUnit.ExpectedException"] = {
        name: 'Sys.ArgumentException',
        message: 'Sys.ArgumentException: Value must be a DOM element or DOM element id.\nParameter name: elementOrElementId'
    };
    this.testResolveElementBadType["AtlasUnit.Categories"] = ["DebugOnly"];
    
    this.testVisibility = function() {
        var element = document.createElement('DIV');
        // DevDiv Bugs 119484: Opera 9.2 and Safari 2 -- style.visibility/display is empty for unattached dom elements.
        document.body.appendChild(element);
        try {
            Sys.UI.DomElement.setVisible(element, false);
            AtlasUnit.Assert.isFalse(Sys.UI.DomElement.getVisible(element), "failed with collapse mode");
            AtlasUnit.Assert.areEqual('none', element.style.display);
            
            Sys.UI.DomElement.setVisible(element, true);
            AtlasUnit.Assert.isTrue(Sys.UI.DomElement.getVisible(element));
            AtlasUnit.Assert.areEqual('block', element.style.display);
            
            Sys.UI.DomElement.setVisibilityMode(element, Sys.UI.VisibilityMode.hide);
            AtlasUnit.Assert.areEqual(Sys.UI.VisibilityMode.hide, Sys.UI.DomElement.getVisibilityMode(element));
            Sys.UI.DomElement.setVisible(element, false);
            AtlasUnit.Assert.isFalse(Sys.UI.DomElement.getVisible(element), "failed with hide mode");
            AtlasUnit.Assert.areEqual('block', element.style.display);
        }
        finally {
            document.body.removeChild(element);
        }
    }
    
    this.testIsDomElement = function() {
        AtlasUnit.Assert.isFalse(Sys.UI.DomElement.isDomElement({}), "{}");
        AtlasUnit.Assert.isFalse(Sys.UI.DomElement.isDomElement({body:true}), "{body:true}");
        AtlasUnit.Assert.isFalse(Sys.UI.DomElement.isDomElement({ownerDocument:{}}), "{ownerDocument:{}}");
        AtlasUnit.Assert.isFalse(Sys.UI.DomElement.isDomElement({document:{}}), "{document:{}}");
        AtlasUnit.Assert.isFalse(Sys.UI.DomElement.isDomElement({document:document}), "{document:document}");
        AtlasUnit.Assert.isFalse(Sys.UI.DomElement.isDomElement(0), "0");
        AtlasUnit.Assert.isFalse(Sys.UI.DomElement.isDomElement(""), '""');
        AtlasUnit.Assert.isTrue(Sys.UI.DomElement.isDomElement(document.body), "body");
        AtlasUnit.Assert.isTrue(Sys.UI.DomElement.isDomElement(document), "document");
        AtlasUnit.Assert.isTrue(Sys.UI.DomElement.isDomElement(window), "window");
    }

}
Sys.UI.Test.DomElementTest.registerClass("Sys.UI.Test.DomElementTest");
Sys.UI.Test.DomElementTest["AtlasUnit.IsTestFixture"] = true;

