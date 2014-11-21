Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.PasteWord = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.PasteWord.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.PasteWord.prototype = {

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.PasteWord.callBaseMethod(this, "callMethod"))
            return false;

        var editor = this._designPanel;

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            editor._saveContent();
            editor.openWait();
            setTimeout(function() {
                editor._paste(true, true); editor.closeWait();
            }, 0)
        } else {
            var sel = editor._getSelection(),
                range = editor._createRange(sel),
                useVerb = String.format(Sys.Extended.UI.Resources.HtmlEditor_toolbar_button_Use_verb, (Sys.Extended.UI.HtmlEditor.isSafari && navigator.userAgent.indexOf("mac") != -1) ? "Apple-V" : "Ctrl-V"),
                mess = String.format(Sys.Extended.UI.Resources.HtmlEditor_toolbar_button_OnPasteFromMSWord, useVerb);

            alert(mess);

            setTimeout(function() {
                editor._removeAllRanges(sel);
                editor._selectRange(sel, range);
            }, 0);

            editor.isWord = true;
        }
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.PasteWord.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.PasteWord", Sys.Extended.UI.HtmlEditor.ToolbarButtons.MethodButton);