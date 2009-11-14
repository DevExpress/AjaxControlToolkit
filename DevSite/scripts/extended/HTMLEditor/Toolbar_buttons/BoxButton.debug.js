// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.

Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");

Sys.Extended.UI.HTMLEditor.ToolbarButton.BoxButton = function(element) {
    Sys.Extended.UI.HTMLEditor.ToolbarButton.BoxButton.initializeBase(this, [element]);
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.BoxButton.prototype = {
    initialize : function() {
        Sys.Extended.UI.HTMLEditor.ToolbarButton.BoxButton.callBaseMethod(this, "initialize");
    }
}

Sys.Extended.UI.HTMLEditor.ToolbarButton.BoxButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.BoxButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.CommonButton);

