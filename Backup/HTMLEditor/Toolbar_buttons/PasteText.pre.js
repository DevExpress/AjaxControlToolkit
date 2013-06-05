Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteText = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteText.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteText.prototype = {
    callMethod : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteText.callBaseMethod(this, "callMethod")) return false;
        var editor = this._designPanel;

        if(Sys.Extended.UI.HTMLEditor.isIE)
        {
            editor._saveContent();
            editor.openWait();
            setTimeout(function(){editor._paste(false); editor.closeWait();},0)
        } else {
            var sel   = editor._getSelection();
            var range = editor._createRange(sel);
            var useVerb = String.format(Sys.Extended.UI.Resources.HTMLEditor_toolbar_button_Use_verb, (Sys.Extended.UI.HTMLEditor.isSafari && navigator.userAgent.indexOf("mac") != -1)?"Apple-V":"Ctrl-V" );
            var mess = String.format(Sys.Extended.UI.Resources.HTMLEditor_toolbar_button_OnPastePlainText, useVerb);

            alert(mess);

            setTimeout(function(){
                editor._removeAllRanges(sel);
                editor._selectRange(sel,range);
            },0);
            editor.isPlainText = true;
        }
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteText.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteText", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);

