Type.registerNamespace("Sys.UI.Test");

Sys.UI.Test.TemplateDomElementTest = function() {
    this.testEventBubble = function() {
        var e1 = document.createElement("div"), e2 = document.createElement("div"),
            e3 = document.createElement("div"), args = new Sys.UI.Test.TemplateDomElementTest.EventArgs("");
        e2.appendChild(e1);
        e3.appendChild(e2);
        Sys.UI.DomElement.raiseBubbleEvent(e1, args);
        AtlasUnit.Assert.areEqual("", args.get_text());
        e2.control = new Sys.UI.Control(e2);
        e3.control = new Sys.UI.Test.TemplateDomElementTest.Control(e3);
        Sys.UI.DomElement.raiseBubbleEvent(e1, args);
        AtlasUnit.Assert.areEqual("Control is in Control.", args.get_text());
    }
}
Sys.UI.Test.TemplateDomElementTest.registerClass("Sys.UI.Test.TemplateDomElementTest");
Sys.UI.Test.TemplateDomElementTest["AtlasUnit.IsTestFixture"] = true;

Sys.UI.Test.TemplateDomElementTest.EventArgs = function(text) {
    this._text = text;
    Sys.UI.Test.TemplateDomElementTest.EventArgs.initializeBase(this);
}
Sys.UI.Test.TemplateDomElementTest.EventArgs.prototype = {
    _text: null,
    get_text: function() {
        return this._text;
    },
    set_text: function(text) {
        this._text = text;
    }
}
Sys.UI.Test.TemplateDomElementTest.EventArgs.registerClass('Sys.UI.Test.TemplateDomElementTest.EventArgs', Sys.EventArgs);

Sys.UI.Test.TemplateDomElementTest.Control = function(element) {
    Sys.UI.Test.TemplateDomElementTest.Control.initializeBase(this, [element]);
}
Sys.UI.Test.TemplateDomElementTest.Control.prototype = {
    onBubbleEvent: function(source, args) {
        args.set_text("Control is in Control.");
        return true;
    }
}
Sys.UI.Test.TemplateDomElementTest.Control.registerClass('Sys.UI.Test.TemplateDomElementTest.Control', Sys.UI.Control);

Sys.UI.Test.TemplateDomElementTest.bubbleHandler = function(object, args) {
    args.set_text("Element is in Control.");
    return;
}
