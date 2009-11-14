// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.

Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.Italic = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.Italic.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.Italic.prototype = {
    callMethod : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Italic.callBaseMethod(this, "callMethod")) return false;
        this._designPanel._execCommand("italic", false, null);
    },
    
    checkState : function() {
        if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Italic.callBaseMethod(this, "checkState")) return false;
        return this._designPanel._queryCommandState("italic");
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.Italic.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.Italic", Sys.Extended.UI.HTMLEditor.ToolbarButton.EditorToggleButton);

