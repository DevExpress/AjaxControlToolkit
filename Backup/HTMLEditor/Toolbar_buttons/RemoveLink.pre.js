Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveLink = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveLink.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveLink.prototype = {
    callMethod : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveLink.callBaseMethod(this, "callMethod")) return false;
        var editor = this._designPanel;
        var sel   = editor._getSelection();
        var range = editor._createRange(sel);
        var parent= Sys.Extended.UI.HTMLEditor.getSelParent(editor);
        
        if (parent.nodeType == 3) {
            parent = parent.parentNode;
        }

        while(parent && Sys.Extended.UI.HTMLEditor.isStyleTag(parent.tagName) && parent.tagName.toUpperCase() != "A") {
            parent = parent.parentNode;
        }
        
        if(parent && parent.tagName.toUpperCase() == "A") {
            editor._saveContent();
            var el = parent.firstChild;

            while(parent.firstChild) parent.parentNode.insertBefore(parent.firstChild,parent);

            parent.parentNode.removeChild(parent);
            if(el) Sys.Extended.UI.HTMLEditor._setCursor(el,editor);
            setTimeout(function() {editor._editPanel.updateToolbar();}, 0);
            editor.onContentChanged();
        }
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveLink.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveLink", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);
