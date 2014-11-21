Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Copy = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.Copy.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Copy.prototype = {

    canBeShown: function() {
        return Sys.Extended.UI.HtmlEditor.isIE;
    },

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.Copy.callBaseMethod(this, "callMethod"))
            return false;

        var editor = this._designPanel;

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            editor.openWait();
            setTimeout(function() {
                editor.isShadowed(); editor._copyCut('c', true); editor.closeWait(); editor._ifShadow();
            }, 0)
        } else {
            editor._copyCut('c', true);
        }
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Copy.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.Copy", Sys.Extended.UI.HtmlEditor.ToolbarButtons.MethodButton);