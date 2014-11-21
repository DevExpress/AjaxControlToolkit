Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.InsertHR = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.InsertHR.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.InsertHR.prototype = {

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.InsertHR.callBaseMethod(this, "callMethod"))
            return false;

        var editor = this._designPanel;

        try {
            editor._saveContent();

            var _div = editor._doc.createElement("div");
            _div.innerHTML = "<hr>";

            var el = _div.firstChild,
                place = editor._getSafePlace();

            if(!place)
                return;

            var parent = place.parentNode;

            parent.insertBefore(el, place);
            parent.removeChild(place);

            el = (el.nextSibling) ? el.nextSibling : el;
            Sys.Extended.UI.HtmlEditor._setCursor(el, editor);

            setTimeout(function() {
                editor.onContentChanged(); editor._editPanel.updateToolbar();
            }, 0);

            editor.focusEditor();

            return true;
        } catch(e) { }
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.InsertHR.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.InsertHR", Sys.Extended.UI.HtmlEditor.ToolbarButtons.MethodButton);