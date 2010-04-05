Type.registerNamespace("AjaxControlToolkit.HTMLEditor.CustomToolbarButton");

AjaxControlToolkit.HTMLEditor.CustomToolbarButton.InsertIcon = function(element) {
AjaxControlToolkit.HTMLEditor.CustomToolbarButton.InsertIcon.initializeBase(this, [element]);
}

AjaxControlToolkit.HTMLEditor.CustomToolbarButton.InsertIcon.prototype = {

    callMethod: function() {
        if (!AjaxControlToolkit.HTMLEditor.CustomToolbarButton.InsertIcon.callBaseMethod(this, "callMethod")) return false;
        this.openPopup(Function.createDelegate(this, this._onopened));
        return true;
    },

    _onopened: function(contentWindow) {
        contentWindow.insertImage = Function.createDelegate(this, this.insertImage);
    },

    insertImage: function(url) {
        this.closePopup();

        var editor = this._designPanel;
        var editPanel = this._editPanel;

        try {
            // For 'Undo'
            editor._saveContent();

            // What to do - insert image at current selection
            //---------------------------------------------------
            editor.insertHTML("<img src=\"" + url + "\" />");
            //---------------------------------------------------

            // Notify Editor about content changed and update toolbars linked to the edit panel
            setTimeout(function() { editor.onContentChanged(); editPanel.updateToolbar(); }, 0);
            // Ensure focus in design panel
            editor.focusEditor();
            return true;
        } catch (e) { alert(e.message) }
    }
}

AjaxControlToolkit.HTMLEditor.CustomToolbarButton.InsertIcon.registerClass("AjaxControlToolkit.HTMLEditor.CustomToolbarButton.InsertIcon", AjaxControlToolkit.HTMLEditor.ToolbarButton.DesignModePopupImageButton);
Sys.Application.notifyScriptLoaded();
