Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Paste = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.Paste.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Paste.prototype = {
    canBeShown: function() {
        return Sys.Extended.UI.HtmlEditor.isIE;
    },

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.Paste.callBaseMethod(this, "callMethod"))
            return false;

        var editor = this._designPanel;

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            editor._saveContent();
            editor.openWait();
            setTimeout(function() {
                editor._paste(true); editor.closeWait();
            }, 0)
        } else {
            var sel = editor._getSelection(),
                range = editor._createRange(sel);

            editor._removeAllRanges(sel);

            alert(String.format(Sys.Extended.UI.Resources.HtmlEditor_toolbar_button_Use_verb, (Sys.Extended.UI.HtmlEditor.isSafari && navigator.userAgent.indexOf("mac") != -1) ? "Apple-V" : "Ctrl-V"));

            editor._selectRange(sel, range);
            editor.isWord = false;
            editor.isPlainText = false;
        }
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Paste.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.Paste", Sys.Extended.UI.HtmlEditor.ToolbarButtons.MethodButton);