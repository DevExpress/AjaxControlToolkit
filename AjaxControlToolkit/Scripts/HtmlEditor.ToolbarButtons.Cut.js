Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Cut = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.Cut.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Cut.prototype = {

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.Cut.callBaseMethod(this, "callMethod"))
            return false;

        var editor = this._designPanel;

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            editor.openWait();
            setTimeout(function() {
                editor.isShadowed(); editor._copyCut('x', true); editor.closeWait();
            }, 0)
        } else {
            editor._copyCut('x', true);
        }
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Cut.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.Cut", Sys.Extended.UI.HtmlEditor.ToolbarButtons.MethodButton);