Type.registerNamespace("AjaxControlToolkit.HTMLEditor.CustomToolbarButton");

AjaxControlToolkit.HTMLEditor.CustomToolbarButton.InsertDate = function(element) {
AjaxControlToolkit.HTMLEditor.CustomToolbarButton.InsertDate.initializeBase(this, [element]);
}

AjaxControlToolkit.HTMLEditor.CustomToolbarButton.InsertDate.prototype = {
    callMethod: function() {
        if (!AjaxControlToolkit.HTMLEditor.CustomToolbarButton.InsertDate.callBaseMethod(this, "callMethod")) return false;
        var editor = this._designPanel;
        var editPanel = this._editPanel;

        try {
            // For 'Undo'
            editor._saveContent();

            // What to do - insert date at current selection
            //---------------------------------------------------
            editor.insertHTML((new Date()).toLocaleDateString());
            //---------------------------------------------------

            // Notify Editor about content changed and update toolbars linked to the edit panel
            setTimeout(function() { editor.onContentChanged(); editPanel.updateToolbar(); }, 0);
            // Ensure focus in design panel
            editor.focusEditor();
            return true;
        } catch (e) {}
    }
}

AjaxControlToolkit.HTMLEditor.CustomToolbarButton.InsertDate.registerClass("AjaxControlToolkit.HTMLEditor.CustomToolbarButton.InsertDate", AjaxControlToolkit.HTMLEditor.ToolbarButton.MethodButton);
Sys.Application.notifyScriptLoaded();
