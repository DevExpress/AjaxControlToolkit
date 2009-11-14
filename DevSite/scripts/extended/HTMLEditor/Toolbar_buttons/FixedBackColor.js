// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.
Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedBackColor=function(a){Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedBackColor.initializeBase(this,[a])};Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedBackColor.prototype={setColor:function(a){this._designPanel._execCommand("backcolor",false,a)}};Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedBackColor.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedBackColor",Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedColorButton);