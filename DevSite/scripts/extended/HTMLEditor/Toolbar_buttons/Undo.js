// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.
Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.Undo=function(a){Sys.Extended.UI.HTMLEditor.ToolbarButton.Undo.initializeBase(this,[a])};Sys.Extended.UI.HTMLEditor.ToolbarButton.Undo.prototype={callMethod:function(){if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Undo.callBaseMethod(this,"callMethod"))return false;this._designPanel.undo()}};Sys.Extended.UI.HTMLEditor.ToolbarButton.Undo.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.Undo",Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);