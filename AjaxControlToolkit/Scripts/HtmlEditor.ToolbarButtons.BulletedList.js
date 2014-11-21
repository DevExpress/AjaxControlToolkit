Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.BulletedList = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.BulletedList.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.BulletedList.prototype = {

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.BulletedList.callBaseMethod(this, "callMethod"))
            return false;

        this._designPanel._execCommand("InsertUnorderedList");
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.BulletedList.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.BulletedList", Sys.Extended.UI.HtmlEditor.ToolbarButtons.MethodButton);