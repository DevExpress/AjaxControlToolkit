Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.PasteText = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.PasteText.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.PasteText.prototype = {

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.PasteText.callBaseMethod(this, "callMethod"))
            return false;

        var editor = this._designPanel;

        if(Sys.Extended.UI.HtmlEditor.isIE) {
            editor._saveContent();
            editor.openWait();
            setTimeout(function() {
                editor._paste(false); editor.closeWait();
            }, 0)
        } else {
            var sel = editor._getSelection(),
                range = editor._createRange(sel),
                useVerb = String.format(Sys.Extended.UI.Resources.HtmlEditor_toolbar_button_Use_verb, (Sys.Extended.UI.HtmlEditor.isSafari && navigator.userAgent.indexOf("mac") != -1) ? "Apple-V" : "Ctrl-V"),
                mess = String.format(Sys.Extended.UI.Resources.HtmlEditor_toolbar_button_OnPastePlainText, useVerb);

            alert(mess);

            setTimeout(function() {
                editor._removeAllRanges(sel);
                editor._selectRange(sel, range);
            }, 0);

            editor.isPlainText = true;
        }
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.PasteText.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.PasteText", Sys.Extended.UI.HtmlEditor.ToolbarButtons.MethodButton);