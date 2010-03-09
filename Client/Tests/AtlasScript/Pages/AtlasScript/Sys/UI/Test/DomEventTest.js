/// <reference name="MicrosoftAjax.js"/>
/// <reference path="..\..\..\..\..\..\..\AtlasUnit\Common\Pages\AtlasUnit.js" />

Type.registerNamespace("Sys.UI.Test");

Sys.UI.Test.DomEventTest = function() {
    this.testAddErrorHandler = function() {
        $addHandler(window, "error", function() { });
    }
    this.testAddErrorHandler["AtlasUnit.Categories"] = ["DebugOnly"];
    this.testAddErrorHandler["AtlasUnit.ExpectedException"] = {
        name: "Sys.InvalidOperationException",
        message: "Sys.InvalidOperationException: " + Sys.Res.addHandlerCantBeUsedForError
    }
    this.testAddHandler = function() {
        var log = '';

        function handler(e){
            log += "clicked " + this.id + ".";
        }

        var div1 = document.createElement('DIV');
        div1.id = 'div1';
        document.body.appendChild(div1);
        $addHandler(div1, "click", handler);

        AtlasUnit.Util.fireMouseEvent(div1, "click");
        AtlasUnit.Assert.areEqual("clicked div1.", log);

        log = '';
        var div2 = document.createElement('DIV');
        div2.id = 'div2';
        document.body.appendChild(div2);
        $addHandler(div2, "click", handler);

        AtlasUnit.Util.fireMouseEvent(div1, "click");
        AtlasUnit.Assert.areEqual("clicked div1.", log);

        AtlasUnit.Util.fireMouseEvent(div2, "click");
        AtlasUnit.Assert.areEqual("clicked div1.clicked div2.", log);

        log = '';
        $removeHandler(div2, "click", handler);
        AtlasUnit.Util.fireMouseEvent(div2, "click");
        AtlasUnit.Assert.areEqual("", log);

        $clearHandlers(div1);
        AtlasUnit.Util.fireMouseEvent(div1, "click");
        AtlasUnit.Assert.areEqual("", log);

        document.body.removeChild(div1);
        document.body.removeChild(div2);
    }
    this.testAddHandlers = function() {
        var log = '';

        function handler(e){
            log += "clicked " + this.id + ".";
        }

        var div1 = document.createElement('DIV');
        div1.id = 'div1';
        document.body.appendChild(div1);
        $addHandlers(div1, {"click": handler});

        AtlasUnit.Util.fireMouseEvent(div1, "click");
        AtlasUnit.Assert.areEqual("clicked div1.", log);

        log = '';
        $clearHandlers(div1);
        AtlasUnit.Util.fireMouseEvent(div1, "click");
        AtlasUnit.Assert.areEqual("", log);

        document.body.removeChild(div1);
    }    
    this.testAutoRemove = function() {
        var div1, log = '';

        function handlerTrue(e){
            log += "clicked1 " + this.id + ".";
        }
        function handlerFalse(e){
            log += "clicked2 " + this.id + ".";
        }
        function existingDispose() {
            log += "disposed " + this.id + ".";
            // simulate dispose modifying its DOM
            var span = div1.childNodes[1].childNodes[0];
            span.parentNode.removeChild(span);
        }

        div1 = document.createElement('DIV');
        div1.id = 'div1';
        div1.innerHTML = "<div></div><div><span></span></div>";
        div1.dispose = existingDispose;
        document.body.appendChild(div1);
        $addHandler(div1, "click", handlerTrue, true);
        $addHandler(div1, "click", handlerFalse, false);

        AtlasUnit.Util.fireMouseEvent(div1, "click");
        AtlasUnit.Assert.areEqual("clicked2 div1.clicked1 div1.", log);
        
        log = '';
        Sys.Application.disposeElement(div1, false);
        AtlasUnit.Util.fireMouseEvent(div1, "click");
        AtlasUnit.Assert.areEqual("disposed div1.clicked2 div1.", log);
    }
    this.testKeyboardEvent = function() {
        // This test is expected to fail on Safari, which has bugs in its keyboard event creation methods.
        var log = '';

        function handler(e){
            log = "offsetX:" + typeof (e.offsetX) +
             ",offsetY:" + typeof (e.offsetY) +
             ",charCode:" + e.charCode +
             ",keyCode:" + e.keyCode;
        }

        var div1 = document.createElement('DIV');
        div1.id = 'div1';
        div1.style.position = 'absolute';
        div1.style.top = '10px';
        div1.style.left = '20px';
        document.body.appendChild(div1);
        $addHandler(div1, 'keypress', handler);
        $addHandler(div1, 'keyup', handler);

        switch(Sys.Browser.agent) {
            case Sys.Browser.Safari:
                // Safari has a bug where initKeyboardEvent() does not set charCode or keyCode.
                // http://bugs.webkit.org/show_bug.cgi?id=16735
        
                AtlasUnit.Util.fireKeyboardEvent(div1, "keypress", 'a');
                AtlasUnit.Assert.areEqual("offsetX:undefined,offsetY:undefined,charCode:0,keyCode:undefined", log);

                AtlasUnit.Util.fireKeyboardEvent(div1, "keyup", 9);
                AtlasUnit.Assert.areEqual("offsetX:undefined,offsetY:undefined,charCode:undefined,keyCode:0", log);
                break;
            case Sys.Browser.Opera:
                // Opera does not support document.createEvent("KeyboardEvent").  When called, it throws
                // a DOMException with code = 9 (NOT_SUPPORTED_ERR).  The exception message includes the full stack
                // trace, so we need to verify the code rather than the message.  Further, Opera doesn't allow you to
                // call "instanceof DOMException" -- this causes a TypeError stating "DOMException does not implement
                // [[HasInstance]]".  So we need to check the exception type against "Object".

                AtlasUnit.Assert.expectException(
                    function() {
                        AtlasUnit.Util.fireKeyboardEvent(div1, "keypress", 'a');
                    },
                    { code: 9 },
                    Object);
                    
                AtlasUnit.Assert.expectException(
                    function() {
                        AtlasUnit.Util.fireKeyboardEvent(div1, "keyup", 9);
                    },
                    { code: 9 },
                    Object);
                break;                
            default:
                AtlasUnit.Util.fireKeyboardEvent(div1, "keypress", 'a');
                AtlasUnit.Assert.areEqual("offsetX:undefined,offsetY:undefined,charCode:97,keyCode:undefined", log);
                
                AtlasUnit.Util.fireKeyboardEvent(div1, "keyup", 9);
                AtlasUnit.Assert.areEqual("offsetX:undefined,offsetY:undefined,charCode:undefined,keyCode:9", log);
                break;
        }

        $clearHandlers(div1);
        document.body.removeChild(div1);
    }

    this.testMouseCoordinates = function() {
        var log = '';

        function handler(e){
            log = "x:" + e.offsetX + ",y:" + e.offsetY;
        }

        var div1 = document.createElement('DIV');
        div1.id = 'div1';
        div1.style.position = 'absolute';
        div1.style.top = '10px';
        div1.style.left = '20px';
        document.body.appendChild(div1);
        $addHandler(div1, 'click', handler);

        AtlasUnit.Util.fireMouseEvent(div1, "click");
        switch (Sys.Browser.agent) {
            case Sys.Browser.Opera: 
                // In Opera, offsetX and offsetY are always 0 for programmatically-generated mouse events.
                // They are correct for real user-generated mouse events. (DevDiv Bugs 189192)
                AtlasUnit.Assert.areEqual("x:0,y:0", log);
                break;
            case Sys.Browser.Safari:
                // In Safari, offsetX and offsetY are always 0 for programmatically-generated mouse events fired on an
                // element just added to the DOM during this cycle of JavaScript execution.  The offsetX and offsetY
                // are correct if the element was already in the DOM.  They are also correct for real user-generated
                // mouse events. (DevDiv Bugs 189192)
                AtlasUnit.Assert.areEqual("x:0,y:0", log);
                break;
            default:
                AtlasUnit.Assert.areEqual("x:-20,y:-10", log);                
        }

        $clearHandlers(div1);
        document.body.removeChild(div1);
    }
    
    this.testAddHandlerWithQuery = function() {
        function verifyHandler(e, removed) {
            var cache = e._events["click"];
            AtlasUnit.Assert.isTrue(!!cache, "Event cache for 'click' not found.");
            if (removed) {
                AtlasUnit.Assert.areEqual(0, cache.length);
            }
            else {
                AtlasUnit.Assert.areEqual(1, cache.length);
                AtlasUnit.Assert.areEqual(handler, cache[0].handler);
            }
        }
        
        var div1 = document.createElement("div"),
            div2 = document.createElement("div"),
            div3 = document.createElement("div"),
            div4 = document.createElement("div"),
            div5 = document.createElement("div"),
            tn = document.createTextNode("hi");
        div3.id = "testAddHandlerArrayID";
        div4.className = "testAddHandlerArrayClass";
        div5.className = "testAddHandlerArrayClass";
        var list = [div1, ".testAddHandlerArrayClass", "#testAddHandlerArrayID", tn, div2],
            handler = function() { };
        try {
            document.body.appendChild(div3);
            document.body.appendChild(div4);
            document.body.appendChild(div5);
            $addHandler(list, "click", handler);
            AtlasUnit.Assert.isTrue(!!div1._events);
            AtlasUnit.Assert.isTrue(!!div2._events);
            AtlasUnit.Assert.isTrue(!!div3._events);
            AtlasUnit.Assert.isTrue(!!div4._events);
            AtlasUnit.Assert.isTrue(!!div5._events);
            

            verifyHandler(div1);
            verifyHandler(div2);
            verifyHandler(div3);
            verifyHandler(div4);
            verifyHandler(div5);
            
            $removeHandler(list, "click", handler);
            
            verifyHandler(div1, true);
            verifyHandler(div2, true);
            verifyHandler(div3, true);
            verifyHandler(div4, true);
            verifyHandler(div5, true);
        }
        finally {
            document.body.removeChild(div3);
            document.body.removeChild(div4);
            document.body.removeChild(div5);
        }
    }
}
Sys.UI.Test.DomEventTest.registerClass("Sys.UI.Test.DomEventTest");
Sys.UI.Test.DomEventTest["AtlasUnit.IsTestFixture"] = true;


