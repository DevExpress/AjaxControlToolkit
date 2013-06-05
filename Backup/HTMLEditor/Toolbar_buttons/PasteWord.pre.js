Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteWord = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteWord.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteWord.prototype = {
    callMethod : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteWord.callBaseMethod(this, "callMethod")) return false;
        var editor = this._designPanel;

        if(Sys.Extended.UI.HTMLEditor.isIE)
        {
            editor._saveContent();
            editor.openWait();
            setTimeout(function(){editor._paste(true,true); editor.closeWait();},0)
        }
        else
        {
            var sel   = editor._getSelection();
            var range = editor._createRange(sel);
            var useVerb = String.format(Sys.Extended.UI.Resources.HTMLEditor_toolbar_button_Use_verb, (Sys.Extended.UI.HTMLEditor.isSafari && navigator.userAgent.indexOf("mac") != -1)?"Apple-V":"Ctrl-V" );
            var mess = String.format(Sys.Extended.UI.Resources.HTMLEditor_toolbar_button_OnPasteFromMSWord, useVerb);

            alert(mess);

            setTimeout(function(){
                editor._removeAllRanges(sel);
                editor._selectRange(sel,range);
            },0);
            editor.isWord = true;
        }
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteWord.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteWord", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);

