Type.registerNamespace("Sys.Extended.UI.HtmlEditor.ToolbarButtons");

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Rtl = function(element) {
    Sys.Extended.UI.HtmlEditor.ToolbarButtons.Rtl.initializeBase(this, [element]);
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Rtl.prototype = {

    callMethod: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.Rtl.callBaseMethod(this, "callMethod"))
            return false;

        this._designPanel._doc.body.style.direction = (!this.checkState()) ? "rtl" : "";

        if(!Sys.Extended.UI.HtmlEditor.isIE) {
            var sel = this._designPanel._getSelection(),
                range = this._designPanel._createRange(sel);

            this._designPanel._removeAllRanges(sel);
            this._designPanel._selectRange(sel, range);
            this._designPanel.focusEditor();
        }

        var button = this;
        setTimeout(function() {
            button._editPanel.updateToolbar();
        }, 0);
    },

    checkState: function() {
        if(!Sys.Extended.UI.HtmlEditor.ToolbarButtons.Rtl.callBaseMethod(this, "checkState"))
            return false;

        if(this._designPanel._doc.body.style.direction && this._designPanel._doc.body.style.direction == "rtl")
            return true;

        return false;
    }
}

Sys.Extended.UI.HtmlEditor.ToolbarButtons.Rtl.registerClass("Sys.Extended.UI.HtmlEditor.ToolbarButtons.Rtl", Sys.Extended.UI.HtmlEditor.ToolbarButtons.EditorToggleButton);