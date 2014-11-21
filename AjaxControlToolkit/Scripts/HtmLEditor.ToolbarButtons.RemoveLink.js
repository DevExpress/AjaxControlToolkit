Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveLink = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveLink.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveLink.prototype = {

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveLink.callBaseMethod(this, "callMethod"))
            return false;

        var editor = this._designPanel,
            sel = editor._getSelection(),
            range = editor._createRange(sel),
            parent = Sys.Extended.UI.HtmlEditor.getSelParent(editor);

        if(parent.nodeType == 3)
            parent = parent.parentNode;

        while(parent && Sys.Extended.UI.HtmlEditor.isStyleTag(parent.tagName) && parent.tagName.toUpperCase() != "A")
            parent = parent.parentNode;

        if(parent && parent.tagName.toUpperCase() == "A") {
            editor._saveContent();
            var el = parent.firstChild;

            while(parent.firstChild)
                parent.parentNode.insertBefore(parent.firstChild, parent);

            parent.parentNode.removeChild(parent);
            if(el)
                Sys.Extended.UI.HtmlEditor._setCursor(el, editor);

            setTimeout(function() {
                editor._editPanel.updateToolbar();
            }, 0);

            editor.onContentChanged();
        }
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveLink.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.RemoveLink", Sys.Extended.UI.HtmlEditor.ToolbarButtons.MethodButton);