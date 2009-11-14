// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.
Type.registerNamespace("Sys.Extended.UI.HTMLEditor");Sys.Extended.UI.HTMLEditor.ActiveModeType=function(){};Sys.Extended.UI.HTMLEditor.ActiveModeType.prototype={Design:0,Html:1,Preview:2};Sys.Extended.UI.HTMLEditor.ActiveModeType_checkValue=function(a){if(a>=0&&a<=2)return true;return false};Sys.Extended.UI.HTMLEditor.ActiveModeType.registerEnum("Sys.Extended.UI.HTMLEditor.ActiveModeType",true);