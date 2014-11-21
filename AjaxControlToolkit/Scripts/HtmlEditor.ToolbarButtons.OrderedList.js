Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.OrderedList = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.OrderedList.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.OrderedList.prototype = {
    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.OrderedList.callBaseMethod(this, "callMethod"))
            return false;

        this._designPanel._execCommand("InsertOrderedList");
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.OrderedList.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.OrderedList", Sys.Extended.UI.HtmlEditor.ToolbarButtons.MethodButton);