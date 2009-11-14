// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Public License.
// See http://www.microsoft.com/opensource/licenses.mspx#Ms-PL.
// All other rights reserved.

(function() {
var scriptName = "ExtendedHTMLEditor";

function execute() {

Type.registerNamespace("Sys.Extended.UI.HTMLEditor");Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.CommonButton = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.CommonButton.initializeBase(this, [element]);this._loaded = false;this._editPanel = null;this._activeModes = null;this._app_onload$delegate = Function.createDelegate(this, this._app_onload);this._cssClass = "";this._onmouseover$delegate = Function.createDelegate(this, this._onmouseover);this._onmouseout$delegate = Function.createDelegate(this, this._onmouseout);this._onmousedown$delegate = Function.createDelegate(this, this._onmousedown);this._onmouseup$delegate = Function.createDelegate(this, this._onmouseup);this._onclick$delegate = Function.createDelegate(this, this._onclick);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.CommonButton.prototype = {
set_activeEditPanel: function(value) {
this._editPanel = value;if (this._editPanel == null) {
this.hideButton();} else {
if (this.isAllowedActiveMode(this._editPanel.get_activeMode()) && this.canBeShown()) {
this.showButton();this.onEditPanelActivity();} else {
this.hideButton();}
}
},
isImage: function() {
return true;},
checkRangeInDesign: function() {
if (typeof this._designPanel == "undefined") return false;if (this._designPanel == null) return false;if (this._designPanel.isPopup()) return false;var parent = Sys.Extended.UI.HTMLEditor.getSelParent(this._designPanel);if (parent.nodeType == 3) parent = parent.parentNode;return (parent.ownerDocument == this._designPanel._doc);},
get_buttonName: function() {
var name = Object.getType(this).getName();name = name.substring(name.lastIndexOf(".") + 1);return name;},
get_message: function(messageName) {
var expression = "Sys.Extended.UI.Resources.HTMLEditor_toolbar_button_" + this.get_buttonName() + "_message_" + messageName;return eval(expression);},
isDisplayed: function() {
var element = this.get_element();if (element) {
var style = element.style;return (style.display != "none" && style.visibility != "hidden");} else {
return false;}
},
hideButton: function() {
var element = this.get_element();if (element) {
element.style.display = "none";}
},
showButton: function() {
if (this.get_element().style.display == "none") {
this.get_element().style.display = "";}
},
canBeShown: function() {
return true;},
onEditPanelActivity: function() {
},
get_activeModes: function() {
if (this._activeModes == null) {
this._activeModes = [];}
return this._activeModes;},
set_activeModes: function(value) {
this.get_activeModes().push(value);},
get_activeModesIds: function() {
},
set_activeModesIds: function(value) {
var arr = value.split(";");for (var i = 0;i < arr.length;i++) {
this.set_activeModes(parseInt(arr[i]));}
},
set_toolTip: function(value) {
this.get_element().title = value;},
get_toolTip: function() {
return this.get_element().title;},
isAllowedActiveMode: function(value) {
for (var i = 0;i < this.get_activeModes().length;i++) {
if (this.get_activeModes()[i] == value) {
return true;}
}
return false;},
initialize: function() {
Sys.Extended.UI.HTMLEditor.ToolbarButton.CommonButton.callBaseMethod(this, "initialize");Sys.Application.add_load(this._app_onload$delegate);var element = this.get_element();this._cssClass = element.className;if (this.isImage()) {
$addHandlers(element, {
mouseover: this._onmouseover$delegate,
mouseout: this._onmouseout$delegate,
mousedown: this._onmousedown$delegate,
mouseup: this._onmouseup$delegate,
click: this._onclick$delegate
});}
if (Sys.Extended.UI.HTMLEditor.isIE) {
function diveSelectable(el) {
if (el.nodeType == 1 && el.tagName) {
var tag = el.tagName.toUpperCase();if (tag != "INPUT" && tag != "TEXTAREA" && tag != "IFRAME") {
el.unselectable = "on";}
for (var k = 0;k < el.childNodes.length;k++) {
diveSelectable(el.childNodes.item(k));}
}
}
diveSelectable(element);} else {
try {
element.style.MozUserSelect = "none";element.parentNode.style.MozUserSelect = "none";} catch (ex) { }
}
},
dispose: function() {
if (this.isImage()) {
$common.removeHandlers(this.get_element(), {
mouseover: this._onmouseover$delegate,
mouseout: this._onmouseout$delegate,
mousedown: this._onmousedown$delegate,
mouseup: this._onmouseup$delegate,
click: this._onclick$delegate
});}
this._loaded = false;Sys.Application.remove_load(this._app_onload$delegate);Sys.Extended.UI.HTMLEditor.ToolbarButton.CommonButton.callBaseMethod(this, "dispose");},
_app_onload: function(sender, e) {
this.onButtonLoaded();this._loaded = true;},
onButtonLoaded: function() {
},
_onmouseover: function(e) {
if (!this.isEnable()) {
return false;}
Sys.UI.DomElement.addCssClass(this.get_element(), this._cssClass + "_hover");return true;},
_onmouseout: function(e) {
if (!this.isEnable()) {
return false;}
Sys.UI.DomElement.removeCssClass(this.get_element(), this._cssClass + "_hover");Sys.UI.DomElement.removeCssClass(this.get_element(), this._cssClass + "_mousedown");return true;},
_onmousedown: function(e) {
if (!this.isEnable()) {
return null;}
Sys.UI.DomElement.addCssClass(this.get_element(), this._cssClass + "_mousedown");return false;},
_onmouseup: function(e) {
if (!this.isEnable()) {
return false;}
Sys.UI.DomElement.removeCssClass(this.get_element(), this._cssClass + "_mousedown");return true;},
_onclick: function(e) {
if (!this.isEnable()) {
return false;}
return true;},
isEnable: function() {
if (!this._loaded) {
return false;}
if (this._editPanel == null) {
return false;}
return true;},
setActivity: function(value) {
if (value) {
Sys.UI.DomElement.addCssClass(this.get_element(), this._cssClass + "_active");} else {
Sys.UI.DomElement.removeCssClass(this.get_element(), this._cssClass + "_active");}
}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.CommonButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.CommonButton", Sys.UI.Control);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.ImageButton = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.ImageButton.initializeBase(this, [element]);this._normalSrc = "";this._hoverSrc = "";this._downSrc = "";this._activeSrc = "";this._downTimer = null;}
Sys.Extended.UI.HTMLEditor.ToolbarButton.ImageButton.prototype = {
get_normalSrc: function() {
return this._normalSrc;},
set_normalSrc: function(value) {
this._normalSrc = value;var element = this.get_element();if (/none$/.test(element.src)) {
element.src = value;}
},
get_hoverSrc: function() {
return this._hoverSrc;},
set_hoverSrc: function(value) {
this._hoverSrc = value;},
get_downSrc: function() {
return this._downSrc;},
set_downSrc: function(value) {
this._downSrc = value;},
get_activeSrc: function() {
return this._activeSrc;},
set_activeSrc: function(value) {
this._activeSrc = value;},
isImage: function() {
return true;},
_onmouseover: function(e) {
if (!Sys.Extended.UI.HTMLEditor.ToolbarButton.ImageButton.callBaseMethod(this, "_onmouseover")) return false;if (this._hoverSrc.length > 0) {
this.get_element().src = this._hoverSrc;}
return true;},
_onmouseout: function(e) {
var node = this.get_element();if (!Sys.Extended.UI.HTMLEditor.ToolbarButton.ImageButton.callBaseMethod(this, "_onmouseout")) return false;if (this._hoverSrc.length > 0) {
if (Sys.UI.DomElement.containsCssClass(node, this._cssClass + "_mousedown") && this._downSrc.length > 0) {
node.src = this._downSrc;} else {
if (Sys.UI.DomElement.containsCssClass(node, this._cssClass + "_active") && this._activeSrc.length > 0) {
node.src = this._activeSrc;} else {
node.src = this._normalSrc;}
}
}
return true;},
_onmousedown: function(e) {
if (Sys.Extended.UI.HTMLEditor.ToolbarButton.ImageButton.callBaseMethod(this, "_onmousedown") === null) return null;if (this._downSrc.length > 0) {
this.get_element().src = this._downSrc;this._downTimer = setTimeout(Function.createDelegate(this, this._onmouseup), 1000);}
return true;},
_onmouseup: function(e) {
var node = this.get_element();if (!Sys.Extended.UI.HTMLEditor.ToolbarButton.ImageButton.callBaseMethod(this, "_onmouseup")) return false;if (this._downSrc.length > 0) {
if (Sys.UI.DomElement.containsCssClass(node, this._cssClass + "_hover") && this._hoverSrc.length > 0) {
node.src = this._hoverSrc;} else {
if (Sys.UI.DomElement.containsCssClass(node, this._cssClass + "_active") && this._activeSrc.length > 0) {
node.src = this._activeSrc;} else {
node.src = this._normalSrc;}
}
if (this._downTimer != null) {
clearTimeout(this._downTimer);this._downTimer = null;}
}
return true;},
setActivity: function(value) {
var node = this.get_element();if (this._activeSrc.length > 0) {
if (value) {
if (!Sys.UI.DomElement.containsCssClass(node, this._cssClass + "_active")) {
node.src = this._activeSrc;}
} else {
if (Sys.UI.DomElement.containsCssClass(node, this._cssClass + "_active")) {
if (Sys.UI.DomElement.containsCssClass(node, this._cssClass + "_mousedown") && this._downSrc.length > 0) {
node.src = this._downSrc;} else {
if (Sys.UI.DomElement.containsCssClass(node, this._cssClass + "_hover") && this._hoverSrc.length > 0) {
node.src = this._hoverSrc;} else {
node.src = this._normalSrc;}
}
}
}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.ImageButton.callBaseMethod(this, "setActivity", [value]);}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.ImageButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.ImageButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.CommonButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.BoxButton = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.BoxButton.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.BoxButton.prototype = {
initialize : function() {
Sys.Extended.UI.HTMLEditor.ToolbarButton.BoxButton.callBaseMethod(this, "initialize");}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.BoxButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.BoxButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.CommonButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.SelectButton = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.SelectButton.initializeBase(this, [element]);this._onclick_option$delegate = Function.createDelegate(this, this._onclick_option);this._onchange$delegate = Function.createDelegate(this, this._onchange);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.SelectButton.prototype = {
initialize : function() {
var nodeId = this.get_element().id;Sys.Extended.UI.HTMLEditor.ToolbarButton.SelectButton.callBaseMethod(this, "initialize");this._select = $get(nodeId+"_select");$addHandler(this._select, "change", this._onchange$delegate);for(var i=0;i < this._select.options.length;i++) {
var option = this._select.options[i];$addHandler(option, "click", this._onclick_option$delegate);}
},
dispose : function() {
for(var i=0;i < this._select.options.length;i++) {
var option = this._select.options[i];$removeHandler(option, "click", this._onclick_option$delegate);}
$removeHandler(this._select, "change", this._onchange$delegate);Sys.Extended.UI.HTMLEditor.ToolbarButton.SelectButton.callBaseMethod(this, "dispose");},
isImage : function() {
return false;},
callMethod : function(select,e) {
return true;},
_onclick_option : function(e) {
if (!this.isEnable()) {
return false;}
var option = e.target;option.parentNode.value=option.value;Sys.Extended.UI.HTMLEditor._stopEvent(e);if(!Sys.Extended.UI.HTMLEditor.isSafari) return false;this.callMethod(option.parentNode,e);return true;},
_onchange : function(e) {
if (!this.isEnable()) {
return false;}
var select = e.target;Sys.Extended.UI.HTMLEditor._stopEvent(e);this.callMethod(select,e);return true;}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.SelectButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.SelectButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.CommonButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeBoxButton = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeBoxButton.initializeBase(this, [element]);this._designPanel = null;}
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeBoxButton.prototype = {
_onmousedown : function(e) {
if(this._designPanel == null) return false;if(this._designPanel.isPopup()) return false;if(Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeBoxButton.callBaseMethod(this, "_onmousedown",[e])===null) return false;this.callMethod();return false;},
onEditPanelActivity : function() {
this._designPanel = this._editPanel.get_activePanel();},
callMethod : function() {
if(this._designPanel == null) return false;if(this._designPanel.isPopup()) return false;return true;},
initialize : function() {
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeBoxButton.callBaseMethod(this, "initialize");if(Sys.Extended.UI.HTMLEditor.isOpera) {
var node = this.get_element();function setDisplay(element) {
element.style.display = "";for(var i = 0;i < element.childNodes.length;i++) {
var child = element.childNodes.item(i);if(child.nodeType == 1) {
setDisplay(child);}
}
}
function setVisibility(element, value) {
if (element.style.visibility != value) {
element.style.visibility = value;}
for(var i = 0;i < element.childNodes.length;i++) {
var child = element.childNodes.item(i);if(child.nodeType == 1) {
setVisibility(child, value);}
}
}
if(this.canBeShown()) {
setDisplay(node);node.style.visibility = "hidden";}
this.hideButton = function() {
setVisibility(node, "hidden");};this.showButton = function() {
if (node.style.display == "none") {
node.style.display = "";}
setVisibility(node, "visible");};}
}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeBoxButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeBoxButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.BoxButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeImageButton = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeImageButton.initializeBase(this, [element]);this._designPanel = null;}
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeImageButton.prototype = {
_onmousedown : function(e) {
if(this._designPanel == null) return false;if(this._designPanel.isPopup()) return false;if(Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeImageButton.callBaseMethod(this, "_onmousedown",[e])===null) return false;this.callMethod();return false;},
onEditPanelActivity : function() {
this._designPanel = this._editPanel.get_activePanel();},
callMethod : function() {
if(this._designPanel == null) return false;if(this._designPanel.isPopup()) return false;return true;},
initialize : function() {
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeImageButton.callBaseMethod(this, "initialize");if(Sys.Extended.UI.HTMLEditor.isOpera) {
var node = this.get_element();function setDisplay(element) {
element.style.display = "";}
function setVisibility(element) {
if (element.style.visibility == "hidden") {
element.style.visibility = "visible";}
}
if(this.canBeShown()) {
setDisplay(node);node.style.visibility = "hidden";}
this.hideButton = function() {
node.style.visibility = "hidden";};this.showButton = function() {
if (node.style.display == "none") {
node.style.display = "";}
setVisibility(node);};}
}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeImageButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeImageButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.ImageButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeSelectButton = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeSelectButton.initializeBase(this, [element]);this._designPanel = null;}
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeSelectButton.prototype = {
onEditPanelActivity: function() {
this._designPanel = this._editPanel.get_activePanel();this.checkState()
},
checkState: function() {
if (!this.checkRangeInDesign()) return false;return true;},
initialize: function() {
var node = this.get_element();Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeSelectButton.callBaseMethod(this, "initialize");if (Sys.Extended.UI.HTMLEditor.isOpera) {
if (this.canBeShown()) {
node.style.display = "";node.style.visibility = "hidden";}
this.hideButton = function() {
node.style.visibility = "hidden";};this.showButton = function() {
if (node.style.display == "none") {
node.style.display = "";}
node.style.visibility = "visible";};}
},
callMethod: function(select, e) {
if (!Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeSelectButton.callBaseMethod(this, "callMethod")) return false;if (this._designPanel == null) return false;if (this._designPanel.isPopup()) return false;return true;}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeSelectButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeSelectButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.SelectButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton.prototype = {
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeImageButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton.prototype = {
onEditPanelActivity: function() {
Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton.callBaseMethod(this, "onEditPanelActivity");this.setActivity(this.checkState());},
checkState: function() {
if (!this.checkRangeInDesign()) return false;return true;}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeImageButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.ModeButton = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.ModeButton.initializeBase(this, [element]);this._activeMode = Sys.Extended.UI.HTMLEditor.ActiveModeType.Design;}
Sys.Extended.UI.HTMLEditor.ToolbarButton.ModeButton.prototype = {
get_activeMode : function() {
return this._activeMode;},
set_activeMode : function(value) {
this._activeMode = value;},
_onclick : function(e) {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.ModeButton.callBaseMethod(this, "_onclick")) return false;var modeButton = this;setTimeout(function() {
modeButton._editPanel.set_activeMode(modeButton._activeMode);},0);return true;},
onEditPanelActivity : function() {
this.setActivity(this._editPanel.get_activeMode() == this._activeMode);}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.ModeButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.ModeButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.ImageButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModePopupImageButton = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModePopupImageButton.initializeBase(this, [element]);this._relatedPopup = null;this._autoClose = true;this._forclose_onmousedown$delegate = null;}
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModePopupImageButton.prototype = {
set_activeEditPanel: function(value) {
if (this._editPanel != value && this._editPanel != null) {
this.closePopup();}
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModePopupImageButton.callBaseMethod(this, "set_activeEditPanel", [value]);},
get_autoClose: function() {
return this._autoClose;},
set_autoClose: function(value) {
this._autoClose = value;},
get_relatedPopup: function() {
return this._relatedPopup;},
set_relatedPopup: function(value) {
this._relatedPopup = value;},
openPopup: function(callback, top, left) {
if (this._autoClose && this._forclose_onmousedown$delegate != null) return;if (this._relatedPopup != null) {
this._bookmark = null;if (Sys.Extended.UI.HTMLEditor.isIE) {
var sel = this._designPanel._getSelection();this._selType = sel.type.toLowerCase();var range = this._designPanel._createRange(sel);if (this._selType == "text" || this._selType == "none") {
try {
this._bookmark = range.duplicate();} catch (ex) { }
}
else if (this._selType == "control") {
this._bookmark = range.item(0);range.remove(0);sel.empty();}
}
if (typeof this._relatedPopup.set_relatedElement == "function") {
this._relatedPopup.set_relatedElement(this.get_element());this._forclose_onmousedown$delegate = Function.createDelegate(this, this._forclose_onmousedown);if (this._autoClose) {
var designWindow = this._designPanel.get_element().contentWindow;var designBody = designWindow.document.body;var button = this;setTimeout(function() {
if (button._forclose_onmousedown$delegate != null) {
Sys.Extended.UI.HTMLEditor._addEvent(designBody, "mousedown", button._forclose_onmousedown$delegate);Sys.Extended.UI.HTMLEditor._addEvent(designBody, "keydown", button._forclose_onmousedown$delegate);Sys.Extended.UI.HTMLEditor._addEvent(document.body, "keydown", button._forclose_onmousedown$delegate);Sys.Extended.UI.HTMLEditor._addEvent(designWindow, "mousedown", button._forclose_onmousedown$delegate);Sys.Extended.UI.HTMLEditor._addEvent(document.body, "mousedown", button._forclose_onmousedown$delegate);if (document.documentElement) {
Sys.Extended.UI.HTMLEditor._addEvent(document.documentElement, "mousedown", button._forclose_onmousedown$delegate);}
}
}, 0);}
this._relatedPopup.open(callback);} else {
this._relatedPopup.open(callback, top, left);}
}
},
_forclose_onmousedown: function(e) {
if (this._forclose_onmousedown$delegate == null) return true;if (this._relatedPopup.isOpened) {
this._relatedPopup.close();} else {
return;}
if (this._editPanel == Sys.Extended.UI.HTMLEditor.LastFocusedEditPanel) {
try { 
if (this._bookmark) {
if (Sys.Extended.UI.HTMLEditor.isIE) {
var range;if (this._selType == "control") {
range = this._designPanel._doc.body.createControlRange();range.add(this._bookmark);} else {
range = this._bookmark;}
range.select();}
this._bookmark = null;}
if (!Sys.Extended.UI.HTMLEditor.isIE) {
var sel = this._designPanel._getSelection();var range = this._designPanel._createRange(sel);this._designPanel._removeAllRanges(sel);this._designPanel._selectRange(sel, range);this._designPanel.focusEditor();}
} catch (ex) { }
}
var button = this;setTimeout(function() {
if (button._editPanel == Sys.Extended.UI.HTMLEditor.LastFocusedEditPanel) {
try { button._editPanel.updateToolbar();} catch (ex) { }
}
}, 0);if (this._autoClose) {
try {
var designWindow = this._designPanel.get_element().contentWindow;var designBody = designWindow.document.body;if (document.documentElement) {
Sys.Extended.UI.HTMLEditor._removeEvent(document.documentElement, "mousedown", this._forclose_onmousedown$delegate);}
Sys.Extended.UI.HTMLEditor._removeEvent(designBody, "keydown", this._forclose_onmousedown$delegate);Sys.Extended.UI.HTMLEditor._removeEvent(document.body, "keydown", this._forclose_onmousedown$delegate);Sys.Extended.UI.HTMLEditor._removeEvent(designBody, "mousedown", this._forclose_onmousedown$delegate);Sys.Extended.UI.HTMLEditor._removeEvent(designWindow, "mousedown", this._forclose_onmousedown$delegate);Sys.Extended.UI.HTMLEditor._removeEvent(document.body, "mousedown", this._forclose_onmousedown$delegate);} catch (ex) { }
}
this._forclose_onmousedown$delegate = null;},
closePopup: function() {
if (this._forclose_onmousedown$delegate != null) {
this._forclose_onmousedown$delegate(null);}
},
dispose: function() {
if (this._forclose_onmousedown$delegate != null) {
this._forclose_onmousedown$delegate(null);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModePopupImageButton.callBaseMethod(this, "dispose");}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModePopupImageButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModePopupImageButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.Selector = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.Selector.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Selector.prototype = {
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Selector.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.Selector", Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModePopupImageButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorSelector = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorSelector.initializeBase(this, [element]);this._fixedColorButton = null;}
Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorSelector.prototype = {
get_fixedColorButton: function() {
return this._fixedColorButton;},
set_fixedColorButton: function(value) {
this._fixedColorButton = value;},
callMethod: function() {
if (!Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorSelector.callBaseMethod(this, "callMethod")) return false;this.openPopup(Function.createDelegate(this, this._onopened));return true;},
_onopened: function(contentWindow) {
contentWindow.setColor = Function.createDelegate(this, this.setColor);},
setColor: function(color) {
this.closePopup();if (this._fixedColorButton != null) {
this._fixedColorButton.set_defaultColor(color);}
}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorSelector.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorSelector", Sys.Extended.UI.HTMLEditor.ToolbarButton.Selector);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedColorButton = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedColorButton.initializeBase(this, [element]);this._defaultColor = "#000000";this._colorDiv = null;this._methodButton = null;}
Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedColorButton.prototype = {
get_defaultColor : function() {
return this._defaultColor;},
set_defaultColor : function(value) {
this._defaultColor = value;if (this._colorDiv != null) {
this._colorDiv.get_element().style.backgroundColor = value;}
},
get_colorDiv : function() {
return this._colorDiv;},
set_colorDiv : function(value) {
this._colorDiv = value;},
get_methodButton : function() {
return this._methodButton;},
set_methodButton : function(value) {
this._methodButton = value;},
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedColorButton.callBaseMethod(this, "callMethod")) return false;this.setColor(this.get_defaultColor());},
setColor : function(color) {
},
initialize : function() {
Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedColorButton.callBaseMethod(this, "initialize");if (this._methodButton != null) {
this._methodButton.callMethod = Function.createDelegate(this, this.callMethod);}
if (this._colorDiv != null) {
this._colorDiv.callMethod = Function.createDelegate(this, this.callMethod);}
}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedColorButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedColorButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeBoxButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.OkCancelPopupButton = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.OkCancelPopupButton.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.OkCancelPopupButton.prototype = {
set_activeEditPanel: function(value) {
if (this._editPanel != value && this._editPanel != null) {
var relatedPopup = this.get_relatedPopup();if (typeof relatedPopup._forceImClose == "function") {
var func = relatedPopup._forceImClose;func(relatedPopup._iframe.contentWindow);}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModePopupImageButton.callBaseMethod(this, "set_activeEditPanel", [value]);},
callMethod: function() {
if (!Sys.Extended.UI.HTMLEditor.ToolbarButton.OkCancelPopupButton.callBaseMethod(this, "callMethod")) return false;this.openPopup(Function.createDelegate(this, this._onopened));return true;},
_onopened: function(contentWindow) {
contentWindow.popupMediator.set_callMethodByName("OK", Function.createDelegate(this, this._onOK));contentWindow.popupMediator.set_callMethodByName("Cancel", Function.createDelegate(this, this._onCancel));var relatedPopup = this.get_relatedPopup();relatedPopup._popup = this._designPanel._popup;relatedPopup._forceImClose = Function.createDelegate(this, this._onCancel);this._designPanel._popup = this.get_relatedPopup();this.opened(contentWindow);},
opened: function(contentWindow) {
},
_onOK: function(contentWindow) {
if (this.okCheck(contentWindow))
this._exit(Function.createDelegate(this, this.ok), contentWindow);},
_onCancel: function(contentWindow) {
if (this.cancelCheck(contentWindow))
this._exit(Function.createDelegate(this, this.cancel), contentWindow);},
_exit: function(callback, contentWindow) {
this.closePopup();this._designPanel._popup = this.get_relatedPopup()._popup;this.get_relatedPopup()._popup = null;this.get_relatedPopup()._forceImClose = null;callback(contentWindow);},
ok: function(contentWindow) {
},
cancel: function(contentWindow) {
},
okCheck: function(contentWindow) {
return true;},
cancelCheck: function(contentWindow) {
return true;}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.OkCancelPopupButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.OkCancelPopupButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModePopupImageButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorClear = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorClear.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorClear.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorClear.callBaseMethod(this, "callMethod")) return false;this._designPanel._execCommand("backcolor", false, "");}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorClear.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorClear", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorSelector = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorSelector.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorSelector.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorSelector.callBaseMethod(this, "callMethod")) return false;},
setColor : function(color) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorSelector.callBaseMethod(this, "setColor", [color]);this._designPanel._execCommand("backcolor", false, color);}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorSelector.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorSelector", Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorSelector);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.Bold = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.Bold.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Bold.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Bold.callBaseMethod(this, "callMethod")) return false;this._designPanel._execCommand("bold", false, null);},
checkState : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Bold.callBaseMethod(this, "checkState")) return false;return this._designPanel._queryCommandState("bold");}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Bold.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.Bold", Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.BulletedList = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.BulletedList.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.BulletedList.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.BulletedList.callBaseMethod(this, "callMethod")) return false;this._designPanel._execCommand("InsertUnorderedList");}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.BulletedList.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.BulletedList", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorButton = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorButton.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorButton.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorButton.callBaseMethod(this, "callMethod")) return false;this.openPopup(Function.createDelegate(this, this._onopened));return true;},
_onopened : function(contentWindow) {
contentWindow.setColor = Function.createDelegate(this, this.setColor);},
setColor : function(color) {
this.closePopup();}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorButton.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorButton", Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModePopupImageButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.Copy = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.Copy.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Copy.prototype = {
canBeShown : function() {
return Sys.Extended.UI.HTMLEditor.isIE;},
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Copy.callBaseMethod(this, "callMethod")) return false;var editor = this._designPanel;if(Sys.Extended.UI.HTMLEditor.isIE) {
editor.openWait();setTimeout(function(){editor.isShadowed();editor._copyCut('c',true);editor.closeWait();editor._ifShadow();},0)
} else {
editor._copyCut('c',true);}
}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Copy.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.Copy", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.Cut = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.Cut.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Cut.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Cut.callBaseMethod(this, "callMethod")) return false;var editor = this._designPanel;if(Sys.Extended.UI.HTMLEditor.isIE) {
editor.openWait();setTimeout(function(){editor.isShadowed();editor._copyCut('x',true);editor.closeWait();},0)
} else {
editor._copyCut('x',true);}
}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Cut.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.Cut", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.DecreaseIndent = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.DecreaseIndent.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.DecreaseIndent.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.DecreaseIndent.callBaseMethod(this, "callMethod")) return false;this._designPanel._execCommand("Outdent");}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.DecreaseIndent.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.DecreaseIndent", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignMode = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignMode.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignMode.prototype = {
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignMode.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignMode", Sys.Extended.UI.HTMLEditor.ToolbarButton.ModeButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedBackColor = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedBackColor.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedBackColor.prototype = {
setColor : function(color) {
this._designPanel._execCommand("backcolor", false, color);}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedBackColor.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedBackColor", Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedColorButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedForeColor = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedForeColor.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedForeColor.prototype = {
setColor : function(color) {
this._designPanel._execCommand("forecolor", false, color);}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedForeColor.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedForeColor", Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedColorButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.FontName = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.FontName.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.FontName.prototype = {
initialize : function() {
Sys.Extended.UI.HTMLEditor.ToolbarButton.FontName.callBaseMethod(this, "initialize");},
callMethod : function(select,event) {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.FontName.callBaseMethod(this, "callMethod")) return false;try {
var editor = this._designPanel;editor._execCommand("fontname",false,select.options.item(select.selectedIndex).value);} catch(e) {}
},
checkState : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.FontName.callBaseMethod(this, "checkState")) return false;var editor = this._designPanel;var param =null;try{param = (Function.createDelegate(editor, Sys.Extended.UI.HTMLEditor._queryCommandValue))("fontname");} catch(e){}
if(!editor._FontNotSet)
if(!param || param.length==0) {
param = Sys.Extended.UI.HTMLEditor.getStyle(editor._doc.body,"font-family");}
var el = this._select;var i=0;if(param && param.length > 0) {
var seek = param.toLowerCase().split(",")[0].replace(/^(['"])/,"").replace(/(['"])$/,"");for(i=0;i< el.options.length;i++) {
var cur = el.options.item(i).value.toLowerCase().split(",")[0];if(cur==seek) break
}
if(i==el.options.length) {
try {
var newopt = document.createElement("OPTION");newopt.value = param.replace(/^(['"])/,"").replace(/(['"])$/,"");newopt.text = param.split(",")[0].replace(/^(['"])/,"").replace(/(['"])$/,"");el.add(newopt,(Sys.Extended.UI.HTMLEditor.isIE)?i:null);$addHandler(newopt, "click", this._onclick_option$delegate);} catch(e) {
i = 0;}
}
}
el.selectedIndex = i;}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.FontName.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.FontName", Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeSelectButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.FontSize = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.FontSize.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.FontSize.prototype = {
initialize : function() {
Sys.Extended.UI.HTMLEditor.ToolbarButton.FontSize.callBaseMethod(this, "initialize");},
callMethod : function(select,event) {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.FontSize.callBaseMethod(this, "callMethod")) return false;try {
var editor = this._designPanel;editor._execCommand("FontSize",false,Sys.Extended.UI.HTMLEditor.fontSizeSeek(select.options.item(select.selectedIndex).value));} catch(e) {}
},
checkState : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.FontSize.callBaseMethod(this, "checkState")) return false;var editor = this._designPanel;var param =null;var _id = this._select.id;try{param =(Function.createDelegate(editor, Sys.Extended.UI.HTMLEditor._queryCommandValue))("fontsize",_id);} catch(e){}
if(param) param = param.toString();if(!editor._FontNotSet)
if(!param || param.length==0) {
param = Sys.Extended.UI.HTMLEditor.getStyle(editor._doc.body,"font-size");param = Sys.Extended.UI.HTMLEditor._TryTransformFromPxToPt(param, this, _id);}
try {
var el = this._select;var i=0;if(param && param.length > 0) {
var seek = param.toLowerCase().split(",")[0];for(i=0;i< el.options.length;i++) {
var cur = Sys.Extended.UI.HTMLEditor.fontSizeSeek(el.options.item(i).value.toLowerCase().split(",")[0]);if(cur==seek) break;}
if(i==el.options.length) {
try {
var newopt = document.createElement("OPTION");newopt.value = param;newopt.text = param;el.add(newopt,(Sys.Extended.UI.HTMLEditor.isIE)?i:null);$addHandler(newopt, "click", this._onclick_option$delegate);} catch (e) {
i = 0;}
}
}
el.selectedIndex = i;} catch(e) {}
}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.FontSize.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.FontSize", Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeSelectButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColor = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColor.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColor.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColor.callBaseMethod(this, "callMethod")) return false;},
setColor : function(color) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColor.callBaseMethod(this, "setColor", [color]);this._designPanel._execCommand("forecolor", false, color);}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColor.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColor", Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorClear = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorClear.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorClear.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorClear.callBaseMethod(this, "callMethod")) return false;this._designPanel._execCommand("forecolor", false, "");}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorClear.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorClear", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorSelector = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorSelector.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorSelector.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorSelector.callBaseMethod(this, "callMethod")) return false;},
setColor : function(color) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorSelector.callBaseMethod(this, "setColor", [color]);this._designPanel._execCommand("forecolor", false, color);}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorSelector.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorSelector", Sys.Extended.UI.HTMLEditor.ToolbarButton.ColorSelector);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator.prototype = {
isImage : function() {
return false;}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator", Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeImageButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.HtmlMode = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.HtmlMode.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.HtmlMode.prototype = {
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.HtmlMode.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.HtmlMode", Sys.Extended.UI.HTMLEditor.ToolbarButton.ModeButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.IncreaseIndent = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.IncreaseIndent.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.IncreaseIndent.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.IncreaseIndent.callBaseMethod(this, "callMethod")) return false;this._designPanel._execCommand("Indent");}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.IncreaseIndent.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.IncreaseIndent", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.InsertHR = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.InsertHR.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.InsertHR.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.InsertHR.callBaseMethod(this, "callMethod")) return false;var editor = this._designPanel;try {
editor._saveContent();var _div = editor._doc.createElement("div");_div.innerHTML = "<hr>";var el = _div.firstChild;var place =editor._getSafePlace();if(!place) return;var parent=place.parentNode;parent.insertBefore(el,place);parent.removeChild (place);el = (el.nextSibling)?el.nextSibling:el;Sys.Extended.UI.HTMLEditor._setCursor(el,editor);setTimeout(function() {editor.onContentChanged();editor._editPanel.updateToolbar();}, 0);editor.focusEditor();return true;} catch(e){}
}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.InsertHR.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.InsertHR", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.InsertLink = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.InsertLink.initializeBase(this, [element]);this._emptySrc = window.location.href.replace(/(http[s]*\:\/\/)[^\u0000]*/i,"$1");}
Sys.Extended.UI.HTMLEditor.ToolbarButton.InsertLink.prototype = {
callMethod: function() {
var editor = this._designPanel;var sel = editor._getSelection();var range = editor._createRange(sel);var parent = Sys.Extended.UI.HTMLEditor.getSelParent(editor);if (parent.nodeType == 3) {
parent = parent.parentNode;}
while (parent && Sys.Extended.UI.HTMLEditor.isStyleTag(parent.tagName) && parent.tagName.toUpperCase() != "A") {
parent = parent.parentNode;}
if (parent && parent.tagName.toUpperCase() == "A") {
this._edit = true;this._editLink(parent);} else {
this._edit = false;this._createLink();}
if (!Sys.Extended.UI.HTMLEditor.ToolbarButton.InsertLink.callBaseMethod(this, "callMethod")) return false;return true;},
opened: function(contentWindow) {
this._preparePopup(contentWindow);},
ok: function(contentWindow) {
var targetField = contentWindow.popupMediator.getField("target");if (targetField != null) {
this._obj.target = targetField.value;}
var urlField = contentWindow.popupMediator.getField("url");if (urlField != null) {
this._obj.href = urlField.value;}
if (/^javascript:/.test(this._obj.href)) {
this._obj.target = null;try {
this._obj.removeAttribute("target");} catch (e) { }
} else {
var targetField = contentWindow.popupMediator.getField("target");if (targetField != null) {
this._obj.target = targetField.value;}
}
if (this._edit) {
this._edit_callback(true);} else {
this._create_callback(true);}
},
cancel: function(contentWindow) {
if (this._edit) {
this._edit_callback(false);} else {
this._create_callback(false);}
},
_createLink: function() {
var editor = this._designPanel;var selectedHTML = (!Sys.Extended.UI.HTMLEditor.isIE) ? Sys.Extended.UI.HTMLEditor.Trim(editor.getSelectedHTML()) : "";var sel = editor._getSelection();var range = editor._createRange(sel);this._txt = null;if (!(editor.isControl() && Sys.Extended.UI.HTMLEditor.getSelParent(editor).tagName && (Sys.Extended.UI.HTMLEditor.getSelParent(editor).tagName.toUpperCase() == "EMBED" || Sys.Extended.UI.HTMLEditor.getSelParent(editor).tagName.toUpperCase() == "IMG")) &&
!(!editor.isControl() && ((Sys.Extended.UI.HTMLEditor.isIE && range.text.length > 0) || (!Sys.Extended.UI.HTMLEditor.isIE && selectedHTML.length > 0)))) {
editor._saveContent();var _span = editor._doc.createElement("span");_span.innerHTML = "new link";_span.id = Sys.Extended.UI.HTMLEditor.smartClassName;var needSelect = true;if (Sys.Extended.UI.HTMLEditor.isIE && editor.isControl()) {
var control = range.item(0);var _span1 = editor._doc.createElement("span");control.parentNode.insertBefore(_span1, control);this._txt = _span.firstChild;control.parentNode.insertBefore(this._txt, control);var _span2 = editor._doc.createElement("span");control.parentNode.insertBefore(_span2, control);control.parentNode.removeChild(control);editor.setSelectionAfterOperation([_span1, _span2], false);needSelect = false;} else {
editor.insertHTML(Sys.Extended.UI.HTMLEditor.getHTML(_span, true));var el = editor._doc.getElementById(Sys.Extended.UI.HTMLEditor.smartClassName);this._txt = el.firstChild;el.parentNode.insertBefore(el.firstChild, el);el.parentNode.removeChild(el);}
if (!Sys.Extended.UI.HTMLEditor.isIE) {
range = editor._createRange();range.setStart(this._txt, 0);range.setEnd(this._txt, ("" + this._txt.data + "").length);editor._removeAllRanges(sel);editor._selectRange(sel, range);} else {
if (needSelect) range.select();}
selectedHTML = (!Sys.Extended.UI.HTMLEditor.isIE) ? Sys.Extended.UI.HTMLEditor.Trim(editor.getSelectedHTML()) : "";sel = editor._getSelection();range = editor._createRange(sel);}
if ((editor.isControl() && Sys.Extended.UI.HTMLEditor.getSelParent(editor).tagName.toUpperCase() == "IMG") ||
(!editor.isControl() && ((Sys.Extended.UI.HTMLEditor.isIE && range.text.length > 0) || (!Sys.Extended.UI.HTMLEditor.isIE && selectedHTML.length > 0)))) {
editor._saveContent();this._obj = { target: "default", href: this._emptySrc, title: "" };var temp = editor._doc.getElementsByTagName("A");var aList = [];for (var i = 0;i < temp.length;i++) aList.push([temp[i], "" + temp[i].href + ""]);editor._execCommand("createLink", false, this._emptySrc);this._oldList = [];for (var i = 0;i < aList.length;i++) {
var a = aList[i][0];var href = aList[i][1];if (a.href == href) this._oldList.push(a);}
}
},
_editLink: function(link) {
var editor = this._designPanel;this._obj = link;editor._saveContent();},
_preparePopup: function(contentWindow) {
if (this._obj.target && this._obj.target.length > 0 && this._obj.target == "default") {
this._obj.target = this.get_relatedPopup().get_defaultTarget();}
var targetField = contentWindow.popupMediator.getField("target");if (targetField != null) {
targetField.value = (this._obj.target && this._obj.target.length > 0 && this._obj.target.substr(0, 1) == "_") ? this._obj.target.toLowerCase() : "_self";}
var urlField = contentWindow.popupMediator.getField("url");if (urlField != null) {
if (this._edit) {
urlField.value = Sys.Extended.UI.HTMLEditor.getRealAttribute(this._obj, "href");} else {
urlField.value = this._obj.href;}
if (urlField.value.length == 0) {
urlField.value = this._emptySrc;}
urlField.value = urlField.value.replace(/\&quot;/g, "\"");setTimeout(function() { Sys.Extended.UI.HTMLEditor.setSelectionRange(urlField, 0, urlField.value.length);}, 0);}
},
_edit_callback: function(ok) {
var editor = this._designPanel;try {
if (!ok) {
editor._undo(false);} else {
if (this._obj.title.length == 0) {
this._obj.title = null;this._obj.removeAttribute("title");}
editor.onContentChanged();}
} catch (ex) { }
return true;},
okCheck: function(contentWindow) {
var urlField = contentWindow.popupMediator.getField("url");if (urlField != null) {
var url = urlField.value;if (url == "" || (url.length >= 3 && url.substr(url.length - 3, 3) == "://")) {
contentWindow.alert(this.get_message("EmptyURL"));contentWindow.setTimeout(function() { try { urlField.focus();} catch (e) { } }, 0);return false;}
return true;}
return false;},
_create_callback: function(ok) {
var editor = this._designPanel;try {
if (ok) {
var aList = editor._doc.getElementsByTagName("A");var aNumber = 0;for (var i = 0;i < aList.length;i++) {
var good = true;var a = aList[i];for (var j = 0;j < this._oldList.length;j++)
if (a == this._oldList[j]) {
good = false;break;}
if (!good) continue;aNumber = i;if (this._obj.target) a.target = this._obj.target;a.href = this._obj.href;if (this._obj.title.length > 0) a.title = this._obj.title;}
if (this._txt) this._txt.data = this._obj.href;if (aList.length > 0) {
var elka = aList[aNumber];var _span = editor._doc.createElement("span");_span.innerHTML = "&nbsp;";if (elka.nextSibling != null)
elka.parentNode.insertBefore(_span, elka.nextSibling);else
elka.parentNode.appendChild(_span);setTimeout(function() {
Sys.Extended.UI.HTMLEditor._setCursor(_span, editor);setTimeout(function() {
elka.parentNode.removeChild(_span);}, 0);}, 0);}
setTimeout(function() { editor._editPanel.updateToolbar();editor.onContentChanged();}, 0);} else {
editor._undo(false);editor.__stack.pop();if (this._txt) {
editor._undo(false);editor.__stack.pop();}
}
editor.focusEditor();} catch (e) { }
return true;}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.InsertLink.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.InsertLink", Sys.Extended.UI.HTMLEditor.ToolbarButton.OkCancelPopupButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.Italic = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.Italic.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Italic.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Italic.callBaseMethod(this, "callMethod")) return false;this._designPanel._execCommand("italic", false, null);},
checkState : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Italic.callBaseMethod(this, "checkState")) return false;return this._designPanel._queryCommandState("italic");}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Italic.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.Italic", Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyCenter = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyCenter.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyCenter.prototype = {
checkState : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyCenter.callBaseMethod(this, "checkState")) return false;return this._designPanel._textAlignState("center");},
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyCenter.callBaseMethod(this, "callMethod")) return false;this._designPanel._execCommand("JustifyCenter");}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyCenter.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyCenter", Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyFull = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyFull.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyFull.prototype = {
checkState : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyFull.callBaseMethod(this, "checkState")) return false;return this._designPanel._textAlignState("justify");},
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyFull.callBaseMethod(this, "callMethod")) return false;this._designPanel._execCommand("JustifyFull");}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyFull.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyFull", Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyLeft = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyLeft.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyLeft.prototype = {
checkState : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyLeft.callBaseMethod(this, "checkState")) return false;return this._designPanel._textAlignState("left");},
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyLeft.callBaseMethod(this, "callMethod")) return false;this._designPanel._execCommand("JustifyLeft");}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyLeft.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyLeft", Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyRight = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyRight.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyRight.prototype = {
checkState : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyRight.callBaseMethod(this, "checkState")) return false;return this._designPanel._textAlignState("right");},
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyRight.callBaseMethod(this, "callMethod")) return false;this._designPanel._execCommand("JustifyRight");}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyRight.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyRight", Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.Ltr = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.Ltr.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Ltr.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Ltr.callBaseMethod(this, "callMethod")) return false;this._designPanel._doc.body.style.direction=(!this.checkState())?"":"rtl";if(!Sys.Extended.UI.HTMLEditor.isIE) {
var sel = this._designPanel._getSelection();var range = this._designPanel._createRange(sel);this._designPanel._removeAllRanges(sel);this._designPanel._selectRange(sel,range);this._designPanel.focusEditor();}
var button = this;setTimeout(function(){button._editPanel.updateToolbar();},0);},
checkState : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Ltr.callBaseMethod(this, "checkState")) return false;if(!(this._designPanel._doc.body.style.direction && this._designPanel._doc.body.style.direction=="rtl")) return true;return false;}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Ltr.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.Ltr", Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.OrderedList = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.OrderedList.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.OrderedList.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.OrderedList.callBaseMethod(this, "callMethod")) return false;this._designPanel._execCommand("InsertOrderedList");}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.OrderedList.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.OrderedList", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.Paragraph = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.Paragraph.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Paragraph.prototype = {
checkState : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Paragraph.callBaseMethod(this, "checkState")) return false;return this._designPanel._textAlignState("");},
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Paragraph.callBaseMethod(this, "callMethod")) return false;this._designPanel._execCommand("Paragraph");}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Paragraph.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.Paragraph", Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.Paste = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.Paste.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Paste.prototype = {
canBeShown : function() {
return Sys.Extended.UI.HTMLEditor.isIE;},
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Paste.callBaseMethod(this, "callMethod")) return false;var editor = this._designPanel;if(Sys.Extended.UI.HTMLEditor.isIE) {
editor._saveContent();editor.openWait();setTimeout(function(){editor._paste(true);editor.closeWait();},0)
} else {
var sel = editor._getSelection();var range = editor._createRange(sel);editor._removeAllRanges(sel);alert(String.format(Sys.Extended.UI.Resources.HTMLEditor_toolbar_button_Use_verb, (Sys.Extended.UI.HTMLEditor.isSafari && navigator.userAgent.indexOf("mac") != -1)?"Apple-V":"Ctrl-V" ));editor._selectRange(sel,range);editor.isWord = false;editor.isPlainText = false;}
}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Paste.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.Paste", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteText = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteText.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteText.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteText.callBaseMethod(this, "callMethod")) return false;var editor = this._designPanel;if(Sys.Extended.UI.HTMLEditor.isIE)
{
editor._saveContent();editor.openWait();setTimeout(function(){editor._paste(false);editor.closeWait();},0)
} else {
var sel = editor._getSelection();var range = editor._createRange(sel);var useVerb = String.format(Sys.Extended.UI.Resources.HTMLEditor_toolbar_button_Use_verb, (Sys.Extended.UI.HTMLEditor.isSafari && navigator.userAgent.indexOf("mac") != -1)?"Apple-V":"Ctrl-V" );var mess = String.format(Sys.Extended.UI.Resources.HTMLEditor_toolbar_button_OnPastePlainText, useVerb);alert(mess);setTimeout(function(){
editor._removeAllRanges(sel);editor._selectRange(sel,range);},0);editor.isPlainText = true;}
}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteText.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteText", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteWord = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteWord.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteWord.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteWord.callBaseMethod(this, "callMethod")) return false;var editor = this._designPanel;if(Sys.Extended.UI.HTMLEditor.isIE)
{
editor._saveContent();editor.openWait();setTimeout(function(){editor._paste(true,true);editor.closeWait();},0)
}
else
{
var sel = editor._getSelection();var range = editor._createRange(sel);var useVerb = String.format(Sys.Extended.UI.Resources.HTMLEditor_toolbar_button_Use_verb, (Sys.Extended.UI.HTMLEditor.isSafari && navigator.userAgent.indexOf("mac") != -1)?"Apple-V":"Ctrl-V" );var mess = String.format(Sys.Extended.UI.Resources.HTMLEditor_toolbar_button_OnPasteFromMSWord, useVerb);alert(mess);setTimeout(function(){
editor._removeAllRanges(sel);editor._selectRange(sel,range);},0);editor.isWord = true;}
}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteWord.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteWord", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.PreviewMode = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.PreviewMode.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.PreviewMode.prototype = {
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.PreviewMode.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.PreviewMode", Sys.Extended.UI.HTMLEditor.ToolbarButton.ModeButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.Redo = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.Redo.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Redo.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Redo.callBaseMethod(this, "callMethod")) return false;this._designPanel.redo();}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Redo.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.Redo", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveAlignment = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveAlignment.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveAlignment.prototype = {
checkState : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveAlignment.callBaseMethod(this, "checkState")) return false;return this._designPanel._textAlignState(null);},
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveAlignment.callBaseMethod(this, "callMethod")) return false;var editor = this._designPanel;var editPanel = this._editPanel;editor._saveContent();editor.MSIE_justify("left", true);editor.onContentChanged();setTimeout(function(){editPanel.updateToolbar();},0);}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveAlignment.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveAlignment", Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveLink = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveLink.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveLink.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveLink.callBaseMethod(this, "callMethod")) return false;var editor = this._designPanel;var sel = editor._getSelection();var range = editor._createRange(sel);var parent= Sys.Extended.UI.HTMLEditor.getSelParent(editor);if (parent.nodeType == 3) {
parent = parent.parentNode;}
while(parent && Sys.Extended.UI.HTMLEditor.isStyleTag(parent.tagName) && parent.tagName.toUpperCase() != "A") {
parent = parent.parentNode;}
if(parent && parent.tagName.toUpperCase() == "A") {
editor._saveContent();var el = parent.firstChild;while(parent.firstChild) parent.parentNode.insertBefore(parent.firstChild,parent);parent.parentNode.removeChild(parent);if(el) Sys.Extended.UI.HTMLEditor._setCursor(el,editor);setTimeout(function() {editor._editPanel.updateToolbar();}, 0);editor.onContentChanged();}
}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveLink.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveLink", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveStyles = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveStyles.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveStyles.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveStyles.callBaseMethod(this, "callMethod")) return false;var editor = this._designPanel;setTimeout(function() {
var selectedHTML = (!Sys.Extended.UI.HTMLEditor.isIE)?Sys.Extended.UI.HTMLEditor.Trim(editor.getSelectedHTML()):"";var sel = editor._getSelection();var range = editor._createRange(sel);var rng = null;var expanded = false;if(!editor.isControl() && ((Sys.Extended.UI.HTMLEditor.isIE && range.text.length>0) || (!Sys.Extended.UI.HTMLEditor.isIE && selectedHTML.length > 0))) {
rng=editor._getTextNodeCollection();} else {
rng = editor._tryExpand();expanded = true;}
if(rng != null && rng.length > 0) {
var changed=false;var _found =true;var _text=null;editor._saveContent();var span1 = editor._doc.createElement("span");span1.id = "_left_";var span2 = editor._doc.createElement("span");span2.id = "_right_";var par1 = rng[0].parentNode;var par2 = rng[rng.length-1].parentNode;par1.insertBefore(span1,rng[0]);if(rng[rng.length-1].nextSibling)
par2.insertBefore(span2,rng[rng.length-1].nextSibling);else
par2.appendChild(span2);while(_found) { 
_found =false;for(var i=0;i< rng.length;i++) { 
var par = rng[i].parentNode;if(par) {
if(rng[i].previousSibling == null && rng[i].nextSibling == null) {
var tag = par.tagName.toUpperCase();if( Sys.Extended.UI.HTMLEditor.isStyleTag(tag) && (tag != "A") && (par.className != Sys.Extended.UI.HTMLEditor.smartClassName || tag.substr(0,1) == "H") ) {
var _attrs = Sys.Extended.UI.HTMLEditor.differAttr(par,["class","color","face","size"]);changed=true;if(_attrs.length==0) {
var parent=par.parentNode;var el = (par.firstChild)?par.firstChild:null;var P = null;if(tag.toUpperCase().substr(0,1) == "H" && (Sys.Extended.UI.HTMLEditor.isIE)) {
P = editor._doc.createElement("p");P.className = Sys.Extended.UI.HTMLEditor.smartClassName;parent.insertBefore(P,par);while(par.firstChild) { 
P.appendChild(par.firstChild);}
} else {
while(par.firstChild){ 
parent.insertBefore(par.firstChild,par);}
if(tag.toUpperCase().substr(0,1) == "H") {
var br = editor._doc.createElement("br");parent.insertBefore(br,par);}
}
parent.removeChild(par);_found=true;} else { 
var parent=par.parentNode;var nel =editor._doc.createElement(tag);for(var j=0;j<_attrs.length;j++) {
nel.setAttribute(_attrs[j][0], _attrs[j][1]);}
parent.insertBefore(nel,par);while(par.firstChild) {
nel.appendChild(par.firstChild);}
parent.removeChild(par);}
}
}
}
}
}
for(var i=0;i< rng.length;i++) { 
var el = rng[i];var _prn = (rng[i].parentNode != null && typeof rng[i].parentNode != "undefined")?rng[i].parentNode:null;if(_prn) {
var _fnd = null;while (_prn && _prn.tagName && _prn.tagName.toUpperCase() != "BODY" && Sys.Extended.UI.HTMLEditor.isStyleTag(_prn.tagName) && (_prn.tagName.toUpperCase() != "A")
&& Sys.Extended.UI.HTMLEditor.differAttr(_prn,["class","color","face","size"]).length == 0
) {
_fnd = _prn;_prn = _prn.parentNode;}
if(_fnd) {
changed=true;function diver(add,el, rpr, before) {
var par=rpr.cloneNode(false);if(add) {
if(add.push && typeof add.push == "function") {
for(var iii=0;iii < add.length;iii++) {
par.appendChild(add[iii]);}
} else
par.appendChild(add);}
while(el) {
var elSibling=before?el.previousSibling:el.nextSibling;if(el.nodeType==1 || (el.nodeType==3 && Sys.Extended.UI.HTMLEditor.Trim(""+el.data+"").length>0)) {
if(el.nodeType==1) {
if(Sys.Extended.UI.HTMLEditor.isStyleTag(el.tagName) && (el.tagName.toUpperCase() != "A") && (!el.id || (el.id != "_left_" && el.id != "_right_"))) {
Sys.Extended.UI.HTMLEditor.spanJoiner(el);}
if(Sys.Extended.UI.HTMLEditor.isStyleTag(el.tagName) && el.childNodes.length==0 && (!el.id || (el.id != "_left_" && el.id != "_right_"))) {
el=null;}
}
if(el) {
if(par.childNodes.length == 0 || !before)
par.appendChild(el);else
par.insertBefore(el,par.firstChild);}
}
el=elSibling;}
if(par.childNodes.length==0) {
delete par;par=null;} else if(par.childNodes.length==1 && par.firstChild.nodeType==3 && (""+par.firstChild.data+"").length==0) {
delete par;par=null;} else {
if(Sys.Extended.UI.HTMLEditor.isStyleTag(par.tagName)) {
var elNumber = par.childNodes.length;for(var cnt=0;cnt< par.childNodes.length;cnt++) {
var inn = par.childNodes.item(cnt);if(inn.nodeType==1 && !Sys.Extended.UI.HTMLEditor.isStyleTag(inn.tagName)) elNumber--;}
if(elNumber == 0) {
var parr = [];while(par.firstChild) {
var inn = par.removeChild(par.firstChild);parr.push(inn);}
par = parr;}
}
}
if(rpr==_fnd) 
return par;else
return diver(par,before?rpr.previousSibling:rpr.nextSibling,rpr.parentNode,before);};_prn = el.parentNode;if ( el.previousSibling == null && el.nextSibling == null &&
_prn && _prn.tagName && _prn.tagName.toUpperCase() != "BODY" && Sys.Extended.UI.HTMLEditor.isStyleTag(_prn.tagName) &&
Sys.Extended.UI.HTMLEditor.differAttr(_prn,["class","color","face","size"]).length > 0
)
el = _prn;var p1 = diver(null,el.previousSibling,el.parentNode,true );var p2 = diver(null,el.nextSibling ,el.parentNode,false);var par = _fnd.parentNode;if(p1) {
if(p1.push && typeof p1.push == "function") {
for(var iii=0;iii < p1.length;iii++) {
par.insertBefore(p1[iii],_fnd);}
} else {
par.insertBefore(p1,_fnd);}
if(Sys.Extended.UI.HTMLEditor.isIE) {
span1 = editor._doc.getElementById("_left_");span2 = editor._doc.getElementById("_right_");}
}
par.insertBefore(el,_fnd);if(p2) {
if(p2.push && typeof p2.push == "function") {
for(var iii=0;iii < p2.length;iii++) {
par.insertBefore(p2[iii],_fnd);}
} else {
par.insertBefore(p2,_fnd);}
if(Sys.Extended.UI.HTMLEditor.isIE) {
span1 = editor._doc.getElementById("_left_");span2 = editor._doc.getElementById("_right_");}
}
par.removeChild (_fnd);}
}
}
if(expanded) {
if(Sys.Extended.UI.HTMLEditor.isIE && editor.__saveBM__ != null) {
try {
var ppp = span1.parentNode;ppp.removeChild(span1);while(ppp && ppp.childNodes.length==0) {
ppp.parentNode.removeChild(ppp);ppp = ppp.parentNode;}
ppp = span2.parentNode;ppp.removeChild(span2);while(ppp && ppp.childNodes.length==0) {
ppp.parentNode.removeChild(ppp);ppp = ppp.parentNode;}
span1 = null;span2 = null;} catch(e){}
var sel = editor._getSelection();var range = editor._createRange(sel);range.moveToBookmark(editor.__saveBM__);range.select();editor.__saveBM__ = null;} else if(editor.__saveBM__ != null) {
if(editor.__saveBM__[0].nodeType==3) {
var sel = editor._getSelection();var range = editor._doc.createRange();range.setStart(editor.__saveBM__[0],editor.__saveBM__[1]);range.setEnd (editor.__saveBM__[0],editor.__saveBM__[1]);editor._removeAllRanges(sel);editor._selectRange(sel,range);} else {
editor._trySelect(editor.__saveBM__[0],editor.__saveBM__[0]);editor.__saveBM__[0].parentNode.removeChild(editor.__saveBM__[0]);}
editor.__saveBM__ = null;}
} else if(!Sys.Extended.UI.HTMLEditor.isIE) {
rng = [];var _found = false;function _diver(_point,prize) {
while(_point) {
if(_point == span2) {
_found=true;return;}
if(_point.nodeType==3) {
while(_point.nextSibling && _point.nextSibling.nodeType==3) {
_point.data= ""+_point.data+""+_point.nextSibling.data+"";_point.parentNode.removeChild(_point.nextSibling);}
if(Sys.Extended.UI.HTMLEditor.Trim(""+_point.data+"").length>0) rng.push(_point);} else
_diver(_point.firstChild,false);if(_found) return;var _save= _point.parentNode;if(prize) {
while(_point && _point.nextSibling==null) {
_point=_point.parentNode;}
}
_point = _point.nextSibling;}
}
_diver(span1,true);range = editor._doc.createRange();range.setStart(rng[0],0);range.setEnd (rng[rng.length-1],(""+rng[rng.length-1].data+"").length);editor._removeAllRanges(sel);editor._selectRange(sel,range);} else {
try {
sel = editor._getSelection();var range1= editor._createRange(sel);var range2= editor._createRange(sel);range1.moveToElementText(span1);range2.moveToElementText(span2);range1.setEndPoint("EndToEnd", range2);range1.select();} catch(e){}
}
try {
var ppp;if(span1 != null) {
ppp = span1.parentNode;ppp.removeChild(span1);while(ppp && ppp.childNodes.length==0) {
ppp.parentNode.removeChild(ppp);ppp = ppp.parentNode;}
}
if(span2 != null) {
ppp = span2.parentNode;ppp.removeChild(span2);while(ppp && ppp.childNodes.length==0) {
ppp.parentNode.removeChild(ppp);ppp = ppp.parentNode;}
}
}
catch(e){}
editor.onContentChanged();editor._editPanel.updateToolbar();}
},0);}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveStyles.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveStyles", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.Rtl = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.Rtl.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Rtl.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Rtl.callBaseMethod(this, "callMethod")) return false;this._designPanel._doc.body.style.direction=(!this.checkState())?"rtl":"";if(!Sys.Extended.UI.HTMLEditor.isIE) {
var sel = this._designPanel._getSelection();var range = this._designPanel._createRange(sel);this._designPanel._removeAllRanges(sel);this._designPanel._selectRange(sel,range);this._designPanel.focusEditor();}
var button = this;setTimeout(function(){button._editPanel.updateToolbar();},0);},
checkState : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Rtl.callBaseMethod(this, "checkState")) return false;if(this._designPanel._doc.body.style.direction && this._designPanel._doc.body.style.direction=="rtl") return true;return false;}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Rtl.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.Rtl", Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.StrikeThrough = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.StrikeThrough.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.StrikeThrough.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.StrikeThrough.callBaseMethod(this, "callMethod")) return false;this._designPanel._execCommand("strikeThrough", false, null);},
checkState : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.StrikeThrough.callBaseMethod(this, "checkState")) return false;return this._designPanel._queryCommandState("strikeThrough");}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.StrikeThrough.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.StrikeThrough", Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.SubScript = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.SubScript.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.SubScript.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.SubScript.callBaseMethod(this, "callMethod")) return false;this._designPanel._execCommand("subScript", false, null);},
checkState : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.SubScript.callBaseMethod(this, "checkState")) return false;return this._designPanel._queryCommandState("subScript");}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.SubScript.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.SubScript", Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.SuperScript = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.SuperScript.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.SuperScript.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.SuperScript.callBaseMethod(this, "callMethod")) return false;this._designPanel._execCommand("superScript", false, null);},
checkState : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.SuperScript.callBaseMethod(this, "checkState")) return false;return this._designPanel._queryCommandState("superScript");}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.SuperScript.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.SuperScript", Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.Underline = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.Underline.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Underline.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Underline.callBaseMethod(this, "callMethod")) return false;this._designPanel._execCommand("underline", false, null);},
checkState : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Underline.callBaseMethod(this, "checkState")) return false;return this._designPanel._queryCommandState("underline");}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Underline.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.Underline", Sys.Extended.UI.HTMLEditor.ToolbarButton.ToggleButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.ToolbarButton");Sys.Extended.UI.HTMLEditor.ToolbarButton.Undo = function(element) {
Sys.Extended.UI.HTMLEditor.ToolbarButton.Undo.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Undo.prototype = {
callMethod : function() {
if(!Sys.Extended.UI.HTMLEditor.ToolbarButton.Undo.callBaseMethod(this, "callMethod")) return false;this._designPanel.undo();}
}
Sys.Extended.UI.HTMLEditor.ToolbarButton.Undo.registerClass("Sys.Extended.UI.HTMLEditor.ToolbarButton.Undo", Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.Popups");Sys.Extended.UI.HTMLEditor.Popups.Popup = function(element) {
Sys.Extended.UI.HTMLEditor.Popups.Popup.initializeBase(this, [element]);this._iframe = null;this._top = 0;this._left = 0;this._doc = null;this._initialContent = "";this._cssPath = "";this._autoDimensions = true;this._registeredFields = [];this._registeredHandlers = [];this._app_onload$delegate = Function.createDelegate(this, this._app_onload);this.isOpened = false;this.isLoaded = false;this.isLoading = false;}
Sys.Extended.UI.HTMLEditor.Popups.Popup.prototype = {
getDocument: function() {
return this._doc;},
getPopupMediator: function() {
if (this._iframe.contentWindow && this._iframe.contentWindow.popupMediator) {
return this._iframe.contentWindow.popupMediator;} else {
return null;}
},
get_registeredFields: function() {
return this._registeredFields;},
set_registeredFields: function(value) {
this._registeredFields = eval(value);},
get_registeredHandlers: function() {
return this._registeredHandlers;},
set_registeredHandlers: function(value) {
this._registeredHandlers = eval(value);},
get_initialContent: function() {
return this._initialContent;},
set_initialContent: function(value) {
this._initialContent = value;},
get_cssPath: function() {
return this._cssPath;},
set_cssPath: function(value) {
this._cssPath = value;},
get_autoDimensions: function() {
return this._autoDimensions;},
set_autoDimensions: function(value) {
this._autoDimensions = value;},
get_iframe: function() {
return this._iframe;},
set_iframe: function(value) {
this._iframe = value;},
checkCorrectLoaded: function(func) {
var popup = this;if (popup.isLoaded && (popup._iframe.style.height == "0px" || popup._iframe.style.width == "0px")) {
this.isLoaded = false;}
if (!this.isLoaded) {
if (!this.isLoading) {
this.reload();}
if (typeof func != "undefined") {
setTimeout(func, 10);}
return false;}
return true;},
_baseOpen: function(callback, top, left) {
var popup = this;if(!this.checkCorrectLoaded(function() { popup._baseOpen(callback, top, left);})) {
return;}
var element = this.get_element();if (typeof left != "undefined") this._left = parseInt(left);if (typeof top != "undefined") this._top = parseInt(top);element.style.top = this._top + "px";element.style.left = this._left + "px";setTimeout(function() {
if (typeof callback == "function") {
popup._onDocumentLoaded(callback);}
popup.isOpened = true;}, 0);},
open: function(callback, top, left) {
this._baseOpen(callback, top, left);},
close: function(callback) {
var element = this.get_element();this.isOpened = false;element.style.top = "-2000px";element.style.left = "-2000px";if (typeof callback == "function") {
callback();}
},
reload: function() {
this.isLoading = true;var element = this.get_element();var _parentNode_ = element.parentNode;document.body.appendChild(element);_parentNode_.appendChild(this.get_element());this._doc = this._iframe.contentWindow.document;this._doc.open();var html = new Sys.StringBuilder();html.append("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.1//EN\" \"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\"><html><head>");if (this._cssPath.length > 0) {
html.append("<link rel=\"stylesheet\" href=\"" + this._cssPath + "\" media=\"all\" />");}
html.append("<script>var __loaded__ = false;</script></head><body style='margin:0px; padding:0px; border-width:0px;' onload='__loaded__ = true;'>");if (this._autoDimensions) {
html.append("<table cellspacing='0' cellpadding='0' border='0'><tr><td>");}
html.append(this._initialContent);if (this._autoDimensions) {
html.append("</td></tr></table>");}
html.append("</body></html>");this._doc.write(html.toString());this._doc.close();this.isLoaded = false;this._afterReload();},
_afterReload: function() {
var contentWindow = this._iframe.contentWindow;var popup = this;this.isLoaded = contentWindow.__loaded__;if (!(popup._doc.body && popup._doc.body.innerHTML)) {
this.isLoaded = false;}
if (!this.isLoaded) {
setTimeout(function() { popup._afterReload() }, 10);return;}
this.isLoaded = false;contentWindow.popupMediator = {};contentWindow.popupMediator.registeredFields = this._registeredFields;contentWindow.popupMediator.registeredHandlers = this._registeredHandlers;contentWindow.popupMediator.get_callMethodByName = function(name) {
var handlers = contentWindow.popupMediator.registeredHandlers;for (var i = 0;i < handlers.length;i++) {
var handler = handlers[i];if (handler.name == name) {
return handler.callMethod;}
}
return null;};contentWindow.popupMediator.set_callMethodByName = function(name, value) {
var handlers = contentWindow.popupMediator.registeredHandlers;for (var i = 0;i < handlers.length;i++) {
var handler = handlers[i];if (handler.name == name) {
handler.callMethod = value;}
}
};contentWindow.popupMediator.getField = function(name) {
var registeredFields = contentWindow.popupMediator.registeredFields;for (var i = 0;i < registeredFields.length;i++) {
var registeredField = registeredFields[i];if (registeredField.name == name) {
return contentWindow.document.getElementById(registeredField.clientID);}
}
return null;};contentWindow.Sys = Sys;for (var i = 0;i < this._registeredHandlers.length;i++) {
$find(this._registeredHandlers[i].clientID).activate(contentWindow.document.getElementById(this._registeredHandlers[i].clientID));}
if (Sys.Extended.UI.HTMLEditor.isIE) {
popup._doc.onselectstart = function() {
var event = popup._iframe.contentWindow.event;var tagName = event.srcElement.tagName.toUpperCase();if (tagName == "INPUT" || tagName == "TEXTAREA") return true;return false;};} else {
popup._doc.onmousedown = function disableselect(e) {
var tagName = e.target.tagName.toUpperCase();if (tagName == "INPUT" || tagName == "TEXTAREA" || tagName == "SELECT") return true;if (Sys.Extended.UI.HTMLEditor.isSafari)
if (tagName == "TABLE" || tagName == "TR" || tagName == "TD" || tagName == "DIV") return true;return false;};var aInp = popup._doc.getElementsByTagName('input');for (var i = 0;i < aInp.length;i++) {
aInp[i].setAttribute('autocomplete', 'off')
}
}
if (this._autoDimensions) {
popup._iframe.style.height = "1000px";popup._iframe.style.width = "1000px";setTimeout(function() {
popup._iframe.style.height = popup._doc.body.firstChild.offsetHeight + "px";popup._iframe.style.width = popup._doc.body.firstChild.offsetWidth + "px";popup.isLoaded = true;popup.isLoading = false;}, 0);} else {
popup.isLoaded = true;popup.isLoading = false;}
},
_onDocumentLoaded: function(callback) {
var popup = this;if (!this.isLoaded) {
setTimeout(function() { popup._onDocumentLoaded(callback) }, 10);return;}
this.isLoaded = true;callback(this._iframe.contentWindow);},
initialize: function() {
this.__appLoaded__ = false;Sys.Extended.UI.HTMLEditor.Popups.Popup.callBaseMethod(this, "initialize");Sys.Application.add_load(this._app_onload$delegate);},
dispose: function() {
Sys.Application.remove_load(this._app_onload$delegate);if (this.isOpened) {
this.close();}
Sys.Extended.UI.HTMLEditor.Popups.Popup.callBaseMethod(this, "dispose");},
_app_onload: function(sender, e) {
if (this.__appLoaded__) return;this.__appLoaded__ = true;var element = this.get_element();if (Sys.Extended.UI.HTMLEditor.isReallyVisible(element)) {
this._parentNode_ = element.parentNode;this.reload();}
}
}
Sys.Extended.UI.HTMLEditor.Popups.Popup.registerClass("Sys.Extended.UI.HTMLEditor.Popups.Popup", Sys.UI.Control);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.Popups");Sys.Extended.UI.HTMLEditor.Popups.AttachedPopup = function(element) {
Sys.Extended.UI.HTMLEditor.Popups.AttachedPopup.initializeBase(this, [element]);this._relatedElement = null;}
Sys.Extended.UI.HTMLEditor.Popups.AttachedPopup.prototype = {
get_relatedElement: function() {
return this._relatedElement;},
set_relatedElement: function(value) {
this._relatedElement = value;},
open: function(callback) {
if (this._relatedElement != null) {
var popup = this;if (!this.checkCorrectLoaded(function() { popup.open(callback);})) {
return;}
var location = $common.getLocation(this._relatedElement);var x = location.x;var y = location.y + this._relatedElement.offsetHeight;var viewportElement = Sys.Extended.UI.HTMLEditor.getClientViewportElement(this._iframe);var theVisibleWidth = viewportElement.clientWidth + viewportElement.scrollLeft;var theVisibleHeight = viewportElement.clientHeight + viewportElement.scrollTop;if (y < viewportElement.scrollTop) y = viewportElement.scrollTop;if (x < viewportElement.scrollLeft) x = viewportElement.scrollLeft;if (y + this._iframe.offsetHeight > theVisibleHeight) y -= y + this._iframe.offsetHeight - theVisibleHeight;if (x + this._iframe.offsetWidth > theVisibleWidth) x -= x + this._iframe.offsetWidth - theVisibleWidth;Sys.Extended.UI.HTMLEditor.Popups.AttachedPopup.callBaseMethod(this, "open", [callback, y, x]);}
},
close: function(callback) {
Sys.Extended.UI.HTMLEditor.Popups.AttachedPopup.callBaseMethod(this, "close", [callback]);},
initialize: function() {
Sys.Extended.UI.HTMLEditor.Popups.AttachedPopup.callBaseMethod(this, "initialize");},
dispose: function() {
Sys.Extended.UI.HTMLEditor.Popups.AttachedPopup.callBaseMethod(this, "dispose");}
}
Sys.Extended.UI.HTMLEditor.Popups.AttachedPopup.registerClass("Sys.Extended.UI.HTMLEditor.Popups.AttachedPopup", Sys.Extended.UI.HTMLEditor.Popups.Popup);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.Popups");Sys.Extended.UI.HTMLEditor.Popups.AttachedTemplatePopup = function(element) {
Sys.Extended.UI.HTMLEditor.Popups.AttachedTemplatePopup.initializeBase(this, [element]);this._contentDiv = null;}
Sys.Extended.UI.HTMLEditor.Popups.AttachedTemplatePopup.prototype = {
get_contentDiv : function() {
return this._contentDiv;},
set_contentDiv : function(value) {
this._contentDiv = value;},
initialize : function() {
Sys.Extended.UI.HTMLEditor.Popups.AttachedTemplatePopup.callBaseMethod(this, "initialize");this.set_initialContent(this._contentDiv.innerHTML);},
dispose : function() {
Sys.Extended.UI.HTMLEditor.Popups.AttachedTemplatePopup.callBaseMethod(this, "dispose");}
}
Sys.Extended.UI.HTMLEditor.Popups.AttachedTemplatePopup.registerClass("Sys.Extended.UI.HTMLEditor.Popups.AttachedTemplatePopup", Sys.Extended.UI.HTMLEditor.Popups.AttachedPopup);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.Popups");Sys.Extended.UI.HTMLEditor.Popups.OkCancelAttachedTemplatePopup = function(element) {
Sys.Extended.UI.HTMLEditor.Popups.OkCancelAttachedTemplatePopup.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.Popups.OkCancelAttachedTemplatePopup.prototype = {
initialize : function() {
Sys.Extended.UI.HTMLEditor.Popups.OkCancelAttachedTemplatePopup.callBaseMethod(this, "initialize");},
dispose : function() {
Sys.Extended.UI.HTMLEditor.Popups.OkCancelAttachedTemplatePopup.callBaseMethod(this, "dispose");}
}
Sys.Extended.UI.HTMLEditor.Popups.OkCancelAttachedTemplatePopup.registerClass("Sys.Extended.UI.HTMLEditor.Popups.OkCancelAttachedTemplatePopup", Sys.Extended.UI.HTMLEditor.Popups.AttachedTemplatePopup);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.Popups");Sys.Extended.UI.HTMLEditor.Popups.PopupCommonButton = function(element) {
Sys.Extended.UI.HTMLEditor.Popups.PopupCommonButton.initializeBase(this, [element]);this._loaded = false;this._activated = null;this._app_onload$delegate = Function.createDelegate(this, this._app_onload);this._cssClass = "";this._name = "";this._onmouseover$delegate = Function.createDelegate(this, this._onmouseover);this._onmouseout$delegate = Function.createDelegate(this, this._onmouseout);this._onmousedown$delegate = Function.createDelegate(this, this._onmousedown);this._onmouseup$delegate = Function.createDelegate(this, this._onmouseup);this._onclick$delegate = Function.createDelegate(this, this._onclick);}
Sys.Extended.UI.HTMLEditor.Popups.PopupCommonButton.prototype = {
isImage: function() {
return true;},
set_toolTip: function(value) {
this.get_element().title = value;},
get_toolTip: function() {
return this.get_element().title;},
set_name: function(value) {
this._name = value;},
get_name: function() {
return this._name;},
initialize: function() {
var element = this.get_element();Sys.Extended.UI.HTMLEditor.Popups.PopupCommonButton.callBaseMethod(this, "initialize");Sys.Application.add_load(this._app_onload$delegate);this._cssClass = element.className.split(" ")[0];if (this.isImage()) {
$addHandlers(element, {
mouseover: this._onmouseover$delegate,
mouseout: this._onmouseout$delegate,
mousedown: this._onmousedown$delegate,
mouseup: this._onmouseup$delegate,
click: this._onclick$delegate
});}
if (Sys.Extended.UI.HTMLEditor.isIE) {
function diveSelectable(el) {
if (el.nodeType == 1 && el.tagName) {
var tag = el.tagName.toUpperCase();if (tag != "INPUT" && tag != "TEXTAREA" && tag != "IFRAME") {
el.unselectable = "on";}
for (var k = 0;k < el.childNodes.length;k++) {
diveSelectable(el.childNodes.item(k));}
}
}
diveSelectable(element);} else {
try {
element.style.MozUserSelect = "none";element.parentNode.style.MozUserSelect = "none";} catch (ex) { }
}
},
activate: function(element) {
this._activated = element;if (this.isImage()) {
Sys.Extended.UI.HTMLEditor._addEvent(this._activated, "mouseover", this._onmouseover$delegate);Sys.Extended.UI.HTMLEditor._addEvent(this._activated, "mouseout", this._onmouseout$delegate);Sys.Extended.UI.HTMLEditor._addEvent(this._activated, "mousedown", this._onmousedown$delegate);Sys.Extended.UI.HTMLEditor._addEvent(this._activated, "mouseup", this._onmouseup$delegate);Sys.Extended.UI.HTMLEditor._addEvent(this._activated, "click", this._onclick$delegate);}
},
dispose: function() {
if (this.isImage() && this._activated != null) {
Sys.Extended.UI.HTMLEditor._removeEvent(this._activated, "mouseover", this._onmouseover$delegate);Sys.Extended.UI.HTMLEditor._removeEvent(this._activated, "mouseout", this._onmouseout$delegate);Sys.Extended.UI.HTMLEditor._removeEvent(this._activated, "mousedown", this._onmousedown$delegate);Sys.Extended.UI.HTMLEditor._removeEvent(this._activated, "mouseup", this._onmouseup$delegate);Sys.Extended.UI.HTMLEditor._removeEvent(this._activated, "click", this._onclick$delegate);}
this._activated = null;this._loaded = false;Sys.Application.remove_load(this._app_onload$delegate);Sys.Extended.UI.HTMLEditor.Popups.PopupCommonButton.callBaseMethod(this, "dispose");},
_app_onload: function(sender, e) {
if (this._loaded) return;this.onButtonLoaded();this._loaded = true;},
onButtonLoaded: function() {
},
_onmouseover: function(e) {
if (!this.isEnable()) {
return false;}
Sys.UI.DomElement.addCssClass(this._activated, this._cssClass + "_hover");return true;},
_onmouseout: function(e) {
if (!this.isEnable()) {
return false;}
var _target1 = e.toElement || e.relatedTarget;try {
while (_target1 && typeof _target1 != "undefined")
if (_target1 == this._activated)
break;else
_target1 = _target1.parentNode;} catch (e) { _target1 = null;}
if (_target1 != null) {
return true;}
Sys.UI.DomElement.removeCssClass(this._activated, this._cssClass + "_hover");Sys.UI.DomElement.removeCssClass(this._activated, this._cssClass + "_mousedown");return true;},
_onmousedown: function(e) {
if (!this.isEnable()) {
return null;}
Sys.UI.DomElement.addCssClass(this._activated, this._cssClass + "_mousedown");return false;},
_onmouseup: function(e) {
if (!this.isEnable()) {
return false;}
Sys.UI.DomElement.removeCssClass(this._activated, this._cssClass + "_mousedown");return true;},
_onclick: function(e) {
if (!this.isEnable()) {
return false;}
this.callMethod(e);return true;},
callMethod: function(e) {
var doc = this._activated.ownerDocument || this._activated.document || target;var contWin = doc.defaultView || doc.parentWindow;var method = contWin.popupMediator.get_callMethodByName(this._name);Function.createDelegate(this, method)(contWin);},
isEnable: function() {
if (!this._loaded) {
return false;}
return true;}
}
Sys.Extended.UI.HTMLEditor.Popups.PopupCommonButton.registerClass("Sys.Extended.UI.HTMLEditor.Popups.PopupCommonButton", Sys.UI.Control);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.Popups");Sys.Extended.UI.HTMLEditor.Popups.PopupBoxButton = function(element) {
Sys.Extended.UI.HTMLEditor.Popups.PopupBoxButton.initializeBase(this, [element]);this._designPanel = null;}
Sys.Extended.UI.HTMLEditor.Popups.PopupBoxButton.prototype = {
}
Sys.Extended.UI.HTMLEditor.Popups.PopupBoxButton.registerClass("Sys.Extended.UI.HTMLEditor.Popups.PopupBoxButton", Sys.Extended.UI.HTMLEditor.Popups.PopupCommonButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.Popups");Sys.Extended.UI.HTMLEditor.Popups.PopupBGIButton = function(element) {
Sys.Extended.UI.HTMLEditor.Popups.PopupBGIButton.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.Popups.PopupBGIButton.prototype = {
}
Sys.Extended.UI.HTMLEditor.Popups.PopupBGIButton.registerClass("Sys.Extended.UI.HTMLEditor.Popups.PopupBGIButton", Sys.Extended.UI.HTMLEditor.Popups.PopupBoxButton);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.Popups");Sys.Extended.UI.HTMLEditor.Popups.BaseColorsPopup = function(element) {
Sys.Extended.UI.HTMLEditor.Popups.BaseColorsPopup.initializeBase(this, [element]);}
Sys.Extended.UI.HTMLEditor.Popups.BaseColorsPopup.prototype = {
}
Sys.Extended.UI.HTMLEditor.Popups.BaseColorsPopup.registerClass("Sys.Extended.UI.HTMLEditor.Popups.BaseColorsPopup", Sys.Extended.UI.HTMLEditor.Popups.AttachedTemplatePopup);Type.registerNamespace("Sys.Extended.UI.HTMLEditor.Popups");Sys.Extended.UI.HTMLEditor.Popups.LinkProperties = function(element) {
Sys.Extended.UI.HTMLEditor.Popups.LinkProperties.initializeBase(this, [element]);this._defaultTarget = "_self";this._targetTextHolder = null;this._urlTextHolder = null;}
Sys.Extended.UI.HTMLEditor.Popups.LinkProperties.prototype = {
get_defaultTarget : function() {
return this._defaultTarget;},
set_defaultTarget : function(value) {
this._defaultTarget = value;}
}
Sys.Extended.UI.HTMLEditor.Popups.LinkProperties.registerClass("Sys.Extended.UI.HTMLEditor.Popups.LinkProperties", Sys.Extended.UI.HTMLEditor.Popups.OkCancelAttachedTemplatePopup);Sys.Extended.UI.HTMLEditor.ModePanel = function(element) {
Sys.Extended.UI.HTMLEditor.ModePanel.initializeBase(this, [element]);this._activated = false;this._isActivating = false;this._editPanel = null;this._cachedContent = null;this._onbeforeunload$delegate = Function.createDelegate(this, this._onbeforeunload);}
Sys.Extended.UI.HTMLEditor.ModePanel.prototype = {
set_editPanel: function(value) {
this._editPanel = value;},
get_content: function() {
if (this._activated) {
return this._getContent();} else {
if (this._cachedContent != null) {
return this._cachedContent;} else {
return "";}
}
},
set_content: function(value) {
this._cachedContent = value;if (!this._activated && !this._isActivating) {
this._activate(value);} else {
if (!this._isActivating) {
this._setContent(value);} else {
var panel = this;setTimeout(function() { panel.set_content(value);}, 10);return false;}
}
return true;},
_activate: function() {
this.get_element().style.display = "";this._isActivating = true;},
_activateFinished: function() {
this._activated = true;this._isActivating = false;this._editPanel._setActive();if (this._editPanel.get_autofocus()) {
this._focus();}
},
_deactivate: function() {
this.get_element().style.display = "none";this._activated = false;this._isActivating = false;},
initialize: function() {
Sys.Extended.UI.HTMLEditor.ModePanel.callBaseMethod(this, "initialize");if (Sys.Extended.UI.HTMLEditor.isIE) {
$addHandlers(window, { beforeunload: this._onbeforeunload$delegate });}
},
dispose: function() {
if (Sys.Extended.UI.HTMLEditor.isIE) {
$common.removeHandlers(window, { beforeunload: this._onbeforeunload$delegate });}
if (this._activated && !Sys.Extended.UI.HTMLEditor.isIE) {
this._onbeforeunload();this._deactivate();}
Sys.Extended.UI.HTMLEditor.ModePanel.callBaseMethod(this, "dispose");},
_onbeforeunload: function() {
if (this._activated) {
if (!this._editPanel._contentPrepared) {
this._editPanel._prepareContentForPostback(this.get_content());this._editPanel._contentPrepared = true;}
}
},
_getContent: function() {
if (this._cachedContent != null) {
return this._cachedContent;} else {
return "";}
},
_setContent: function(value) {
},
_focus: function() {
this._focused();},
_focused: function(prize) {
this._editPanel._focused(prize);this._editPanel.set_autofocus(true);},
_really_focused: function() {
this._editPanel._really_focused();this._editPanel.set_autofocus(true);}
}
Sys.Extended.UI.HTMLEditor.ModePanel.registerClass("Sys.Extended.UI.HTMLEditor.ModePanel", Sys.UI.Control);Sys.Extended.UI.HTMLEditor.HtmlPanel = function(element) {
Sys.Extended.UI.HTMLEditor.HtmlPanel.initializeBase(this, [element]);this._onfocus$delegate = Function.createDelegate(this, this._onfocus);if(Sys.Extended.UI.HTMLEditor.isIE && document.compatMode != "BackCompat") {
this._onresize$delegate = Function.createDelegate(this, this._onresize);}
}
Sys.Extended.UI.HTMLEditor.HtmlPanel.prototype = {
_activate: function(value) {
this._shouldResize = false;var element = this.get_element();if (Sys.Extended.UI.HTMLEditor.isIE && Sys.Browser.version > 6 && document.compatMode != "BackCompat" && element.parentNode.clientHeight > 0) {
this._shouldResize = true;}
Sys.Extended.UI.HTMLEditor.HtmlPanel.callBaseMethod(this, "_activate");if (Sys.Extended.UI.HTMLEditor.isIE) {
element.value = "";var panel = this;setTimeout(function() { element.value = value;}, 0);} else {
element.value = value;}
$addHandlers(element, {
focus: this._onfocus$delegate
});if (this._shouldResize) {
$addHandlers(element, {
resize: this._onresize$delegate
});}
this._activateFinished();},
_deactivate: function() {
var element = this.get_element();if (this._shouldResize) {
$common.removeHandlers(element, {
resize: this._onresize$delegate
});}
this._shouldResize = false;$common.removeHandlers(element, {
focus: this._onfocus$delegate
});element.value = "";Sys.Extended.UI.HTMLEditor.HtmlPanel.callBaseMethod(this, "_deactivate");},
_getContent: function() {
return this.get_element().value;},
_setContent: function(value) {
this.get_element().value = value;try { 
var textarea = this.get_element();textarea.focus();setTimeout(function() { Sys.Extended.UI.HTMLEditor.setSelectionRange(textarea, 0, 0);}, 0);} catch (e) { }
},
_focus: function() {
try { 
var textarea = this.get_element();textarea.focus();setTimeout(function() { Sys.Extended.UI.HTMLEditor.setSelectionRange(textarea, 0, 0);}, 0);} catch (e) { }
var panel = this;setTimeout(function() { panel._focused();}, 0);},
_onfocus: function(e) {
this._really_focused();var textarea = this.get_element();setTimeout(function() { textarea.focus();}, 0);return true;},
_onresize: function(e) {
var element = this.get_element();var clientHeight = element.parentNode.clientHeight;if (clientHeight > 0) {
element.style.height = clientHeight + "px";}
}
}
Sys.Extended.UI.HTMLEditor.HtmlPanel.registerClass("Sys.Extended.UI.HTMLEditor.HtmlPanel",Sys.Extended.UI.HTMLEditor.ModePanel);Sys.Extended.UI.HTMLEditor.PreviewPanel = function(element) {
Sys.Extended.UI.HTMLEditor.PreviewPanel.initializeBase(this, [element]);this._focus$delegate = Function.createDelegate(this, this._focus_event);this._blur$delegate = Function.createDelegate(this, this._blur_event);this._doc = null;this._content = "";this._panel_timer = null;}
Sys.Extended.UI.HTMLEditor.PreviewPanel.prototype = {
_focus: function() {
try { 
this.get_element().contentWindow.focus();} catch (e) { }
this._focused();},
_focus_event: function() {
if (this._panel_timer == null) {
var contentWindow = this.get_element().contentWindow;var panel = this;this._really_focused();this._panel_timer = setTimeout(function() { contentWindow.focus();panel._really_focused();panel._panel_timer = null;}, 0);}
return true;},
_blur_event: function() {
if (this._panel_timer != null) {
clearTimeout(this._panel_timer);this._panel_timer = null;}
return true;},
_activate: function(value) {
Sys.Extended.UI.HTMLEditor.PreviewPanel.callBaseMethod(this, "_activate");this._content = value;this._wasFocused = false;this._initIframe(value);Sys.Extended.UI.HTMLEditor._addEvents(this.get_element().contentWindow, ["focus"], this._focus$delegate);Sys.Extended.UI.HTMLEditor._addEvents(this.get_element().contentWindow, ["blur"], this._blur$delegate);this._activateFinished();},
_deactivate: function() {
Sys.Extended.UI.HTMLEditor._removeEvents(this.get_element().contentWindow, ["blur"], this._blur$delegate);Sys.Extended.UI.HTMLEditor._removeEvents(this.get_element().contentWindow, ["focus"], this._focus$delegate);if (Sys.Extended.UI.HTMLEditor.isIE) {
try { 
this._doc.open();this._doc.write("");this._doc.close();this.get_element().src = "javascript:false;";} catch (ex) { }
}
this._doc = null;this._content = "";Sys.Extended.UI.HTMLEditor.PreviewPanel.callBaseMethod(this, "_deactivate");},
_initIframe: function(value) {
var str = Sys.Extended.UI.HTMLEditor.Trim(value);this._doc = this.get_element().contentWindow.document;if (!Sys.Extended.UI.HTMLEditor.isIE) {
} else {
str = str.replace(/&amp;/ig, "&");}
this._doc.open();this._doc.write("<html><head><link rel=\"stylesheet\" href=\"" + this._editPanel.get_documentCssPath() + "\" media=\"all\" /></head><body>" + str + "</body></html>");this._doc.close();},
_getContent: function() {
return this._content;},
_setContent: function(value) {
this._content = value;this._initIframe(value);}
}
Sys.Extended.UI.HTMLEditor.PreviewPanel.registerClass("Sys.Extended.UI.HTMLEditor.PreviewPanel",Sys.Extended.UI.HTMLEditor.ModePanel);Sys.Extended.UI.HTMLEditor.DesignPanel = function(element) {
Sys.Extended.UI.HTMLEditor.DesignPanel.initializeBase(this, [element]);this._doc = null;this._updated_now = false;this._updateTimer = null;this._popup = null;this._contextElement = null;this._a_prize = false;this.__stack = null;this._StyleForTyping = null;this.isWord = false;this.isPlainText = false;this.dfltBlockElement = "P";this._FontNotSet = true;this._design_timer1 = null;this._events$delegate = Function.createDelegate(this, Sys.Extended.UI.HTMLEditor.DesignPanelEventHandler);this._blur$delegate = Function.createDelegate(this, this._blur);this._focus$delegate = Function.createDelegate(this, this._focus_event);}
Sys.Extended.UI.HTMLEditor.DesignPanel.prototype = {
initialize: function() {
Sys.Extended.UI.HTMLEditor.DesignPanel.callBaseMethod(this, "initialize");},
dispose: function() {
Sys.Extended.UI.HTMLEditor.DesignPanel.callBaseMethod(this, "dispose");},
_activate: function(value) {
Sys.Extended.UI.HTMLEditor.DesignPanel.callBaseMethod(this, "_activate");this._wasFocused = false;this._initIframe(value);this._onDocumentLoaded();},
_deactivate: function() {
this._deactivateCommon();if (Sys.Extended.UI.HTMLEditor.isIE) {
this._doc.open();this._doc.write("");this._doc.close();this.get_element().src = "javascript:false;";}
this._doc = null;Sys.Extended.UI.HTMLEditor.DesignPanel.callBaseMethod(this, "_deactivate");},
_deactivateCommon: function() {
this._editPanel.__blured = false;var aList = this._doc.body.getElementsByTagName("IMG");for (var i = 0;i < aList.length;i++) {
if (aList[i].getAttribute(Sys.Extended.UI.HTMLEditor.attachedIdAttribute) && aList[i].getAttribute(Sys.Extended.UI.HTMLEditor.attachedIdAttribute).length > 0) {
try {
if (Sys.Extended.UI.HTMLEditor.isIE) {
$removeHandler(aList[i], "dragstart", Sys.Extended.UI.HTMLEditor.stopDrag);} else {
$removeHandler(aList[i], "draggesture", Sys.Extended.UI.HTMLEditor.stopDrag);}
} catch (e) { }
}
}
Sys.Extended.UI.HTMLEditor._removeEvents(this._doc, ["keydown", "keypress", "mousedown", "mouseup", "dblclick"], this._events$delegate);Sys.Extended.UI.HTMLEditor._removeEvents(this.get_element().contentWindow, ["blur"], this._blur$delegate);Sys.Extended.UI.HTMLEditor._removeEvents(this.get_element().contentWindow, ["focus"], this._focus$delegate);},
_initIframe: function(value) {
var str = Sys.Extended.UI.HTMLEditor.Trim(this._prepareContent(value));this._doc = this.get_element().contentWindow.document;if (!Sys.Extended.UI.HTMLEditor.isIE) {
this._doc.designMode = "on";}
this._doc.open();this._doc.write("<html><head><link rel=\"stylesheet\" href=\"" + this._editPanel.get_documentCssPath() + "\" media=\"all\" /><link rel=\"stylesheet\" href=\"" + this._editPanel.get_designPanelCssPath() + "\" media=\"all\" /></head><body>" + str + "</body></html>");this._doc.close();this._doc.id = "EditorDocument";if (Sys.Extended.UI.HTMLEditor.isIE) {
this._doc.body.contentEditable = true;this._tryForward = true;}
},
_blur: function() {
this._editPanel.__blured = true;if (!Sys.Extended.UI.HTMLEditor.isIE && this._design_timer1 != null) {
clearTimeout(this._design_timer1);this._design_timer1 = null;}
return true;},
_focus_event: function() {
this._editPanel.__blured = false;if (Sys.Extended.UI.HTMLEditor.isIE) {
this._really_focused();}
else {
var panel = this;Sys.Extended.UI.HTMLEditor.LastFocusedEditPanel = this._editPanel;if (this._design_timer1 == null) {
this._design_timer1 = setTimeout(function() { panel._really_focused();panel._design_timer1 = null;}, 0);}
}
return true;},
_onDocumentLoaded: function() {
var editor = this;try {
if (!Sys.Extended.UI.HTMLEditor.isIE) {
this._doc.queryCommandValue("forecolor");}
var temp = editor._doc.body.innerHTML;} catch (e) {
setTimeout(function() { editor._onDocumentLoaded() }, 10);return;}
this._afterBodyIsFormed();setTimeout(function() { editor._activateFinished();if (Sys.Extended.UI.HTMLEditor.isIE && !editor._editPanel.get_autofocus()) { editor._getSelection().empty();} }, 0);},
_afterBodyIsFormed: function() {
var editor = this;Sys.Extended.UI.HTMLEditor._addEvents(this._doc, ["keydown", "keypress", "mousedown", "mouseup", "dblclick"], this._events$delegate);Sys.Extended.UI.HTMLEditor._addEvents(this.get_element().contentWindow, ["blur"], this._blur$delegate);Sys.Extended.UI.HTMLEditor._addEvents(this.get_element().contentWindow, ["focus"], this._focus$delegate);Sys.Extended.UI.HTMLEditor.inspectForShadows(editor._doc.body);var body = this._doc.body;if (body.childNodes.length == 1 && body.firstChild.tagName && body.firstChild.tagName.toUpperCase() == "DIV" &&
body.firstChild.style.cssText.length > 0 && body.firstChild.style.direction.length > 0 &&
Sys.Extended.UI.HTMLEditor.getStyle(body.firstChild, "position") != "absolute") {
body.style.cssText = body.firstChild.style.cssText;var temp = body.firstChild;while (temp.firstChild) body.insertBefore(temp.firstChild, temp);body.removeChild(temp);}
editor._clearP();},
_getContent: function() {
if (this._popup != null) {
if (typeof this._popup._forceImClose == "function") {
var func = this._popup._forceImClose;func(this._popup._iframe.contentWindow);}
}
this._clearP();var temp;if (Sys.Extended.UI.HTMLEditor.isIE) {
Sys.Extended.UI.HTMLEditor.spanJoiner(this._doc.body, this._doc);temp = Sys.Extended.UI.HTMLEditor.getHTML(this._doc.body, false, true);temp = temp.replace(/(<td[^>]*?>)([\s ]*?)(<\/td[^>]*?>)/ig, "$1&nbsp;$3")
.replace(/(<td[^>]*?>)\s*(&nbsp;)\s*(<\/td[^>]*?>)/ig, "$1<br/>$3")
.replace(/(<p[^>]*?>)\s*(&nbsp;)\s*(<\/p[^>]*?>)/ig, "$1<br/>$3");temp = ((this._doc.body.style.cssText.length > 0) ? "<div style=\"" + this._doc.body.style.cssText.replace("\"", "'") + "\">" : "") + temp + ((this._doc.body.style.cssText.length > 0) ? "</div>" : "");if (this._editPanel.get_noScript()) {
temp = temp.replace(/(<script(?:[^>]*?)>(?:[^<]*?)<\/script(?:[^>]*?)>)/gi, "");}
if (/<embed/ig.test(temp)) {
temp = temp.replace(/(<embed(?:.*?))(\sloop=\"true\")((?:.*?)>)/ig, "$1$3")
.replace(/(<embed(?:.*?))(\splay=\"true\")((?:.*?)>)/ig, "$1$3")
.replace(/(<embed(?:.*?))(\sbgcolor=\"\")((?:.*?)>)/ig, "$1$3")
.replace(/(<embed(?:.*?))(\sscale=\"\")((?:.*?)>)/ig, "$1$3")
.replace(/(<embed(?:.*?))(\shspace=\"0\")((?:.*?)>)/ig, "$1$3")
.replace(/(<embed(?:.*?))(\svspace=\"0\")((?:.*?)>)/ig, "$1$3")
.replace(/(<embed(?:.*?))(\swmode=\"[^\"]+\")((?:.*?)>)/ig, "$1$3")
.replace(/(<embed(?:.*?))(pseudomode=)(\"[^\"]*\")((?:.*?)>)/ig, "$1wmode=$3$4")
.replace(/(<embed(?:.*?))(\swmode=\"\")((?:.*?)>)/ig, "$1$3");}
var nnreg = new RegExp("(<[/]?)(teo" + Sys.Extended.UI.HTMLEditor.smartClassName + ":)", "ig");temp = temp.replace(nnreg, "$1");} else {
var trg = this._doc.createElement("DIV");var scriptRecover = new Sys.Extended.UI.HTMLEditor.DesignPanel.ScriptRecover();trg.style.cssText = this._doc.body.style.cssText;if (!this._editPanel.get_noScript()) {
this._doc.body.innerHTML.replace(/<script(?:[^>]*?)>(.*?)<\/script(?:[^>]*?>)/gi, function(p0, p1) { return scriptRecover.regReplScript1(p0, p1);});}
trg.innerHTML = Sys.Extended.UI.HTMLEditor.Trim(this._doc.body.innerHTML);var tempCollection = trg.getElementsByTagName("IMG");var imgCollection = [];for (var i = 0;i < tempCollection.length;i++) imgCollection.push(tempCollection[i]);for (var j = 0;j < imgCollection.length;j++) {
var img = imgCollection[j];var attr;attr = img.getAttribute("dummytag");if (attr && attr.length > 0 && attr.toLowerCase() == "embed") {
var src = img.getAttribute("dummysrc");var bgcolor = img.getAttribute("dummybgcolor");var wmode = img.getAttribute("pseudomode");var attrs = img.attributes;var embed = this._doc.createElement("EMBED");embed.src = src;embed.width = img.width;embed.height = img.height;if (bgcolor && bgcolor.length > 0) {
bgcolor = Sys.Extended.UI.HTMLEditor.tryReplaceRgb(bgcolor);embed.setAttribute("bgcolor", bgcolor);}
if (wmode && wmode.length > 0) {
embed.setAttribute("wmode", wmode);}
for (var i = 0;i < attrs.length;++i) {
var a = attrs.item(i);if (!a.specified) continue;var name = a.name.toLowerCase();var value = a.value;if (name == "dummytag" || name == "dummysrc" ||
name == "dummybgcolor" || name == "style" ||
name == "wmode" || name == "pseudomode" ||
name == "src")
continue;if (name == "loop" && value == "true") continue;if (name == "play" && value == "true") continue;if (name == "hspace" && value == "0") continue;if (name == "vspace" && value == "0") continue;if (name == "scale" && value.length == 0) continue;if (name == "align" && value.length == 0) continue;embed.setAttribute(name, value);}
if (img.style.width && img.style.width.length > 0) embed.style.width = img.style.width;if (img.style.height && img.style.height.length > 0) embed.style.height = img.style.height;img.parentNode.insertBefore(embed, img);img.parentNode.removeChild(img);}
}
Sys.Extended.UI.HTMLEditor.spanJoiner(trg, this._doc);temp = Sys.Extended.UI.HTMLEditor.getHTML(trg, (trg.style.cssText.length > 0) ? true : false, true);if (!this._editPanel.get_noScript()) {
temp = temp.replace(/(<script(?:[^>]*?)>)(.*?)(<\/script(?:[^>]*?)>)/gi, function(p0, p1, p2, p3) { return scriptRecover.regReplFromScript1(p0, p1, p2, p3);});} else {
temp = temp.replace(/(<script(?:[^>]*?)>(?:[^<]*?)<\/script(?:[^>]*?)>)/gi, "");}
delete trg;}
temp = Sys.Extended.UI.HTMLEditor.brXHTML(temp.replace(/^([\n|\r]+)/, ""));if (this._editPanel.get_noUnicode()) {
temp = temp.replace(/([\u0080-\uFFFF])/g, function(p0, p1) { return "&#" + p1.charCodeAt(0).toString(10) + ";";});}
if (Sys.Extended.UI.HTMLEditor.Trim(temp) == "<br />") {
temp = "";}
return temp;},
_setContent: function(value) {
this._deactivateCommon();var str = Sys.Extended.UI.HTMLEditor.Trim(this._prepareContent(value));this._doc.open();this._doc.write("<html><head><link rel=\"stylesheet\" href=\"" + this._editPanel.get_documentCssPath() + "\" media=\"all\" /><link rel=\"stylesheet\" href=\"" + this._editPanel.get_designPanelCssPath() + "\" media=\"all\" /></head><body>" + str + "</body></html>");this._doc.close();if (Sys.Extended.UI.HTMLEditor.isIE) {
this._doc.body.contentEditable = true;this._tryForward = true;}
this._afterBodyIsFormed();if (this._editPanel.get_autofocus()) {
this._focus();}
if (Sys.Extended.UI.HTMLEditor.isIE && !this._editPanel.get_autofocus()) {
this._getSelection().empty();}
},
_focus: function(prize) {
this.focusEditor();this._focused(prize);},
focusEditor: function() {
try {
this.get_element().contentWindow.focus();} catch (e) { }
if (!this._wasFocused) {
this._wasFocused = true;if (!this._editPanel.get_startEnd()) {
this._setToEnd();}
}
},
_prepareContent: function(value) {
var temptext = value;temptext = temptext.replace(/<object(?:[^>]*?)>(?:[^\u0000]*?)(<embed(?:[^>]*?)>)(?:[^\u0000]*?)<\/object(?:[^>]*?)>/gi, "$1");if (Sys.Extended.UI.HTMLEditor.isIE) {
temptext = Sys.Extended.UI.HTMLEditor.Trim(temptext.replace(/([\n\r]+<)/g, "<").replace(/([^>])([\n\r]+)([^<])/g, "$1 $3"))
.replace(/(&amp;)/g, "&amp;amp;")
.replace(/<br\s*[\/]*>\s*<\/td>/ig, "</td>")
.replace(/(<td[^>]*?>)([\s ]*?)(<\/td[^>]*?>)/ig, "$1&nbsp;$3")
.replace(/(<p[^>]*?>)\s*(<br[^>]*?>)\s*(<\/p[^>]*?>)/ig, "$1&nbsp;$3");if (/<embed/ig.test(temptext)) {
temptext = temptext.replace(/(<embed(?:.*?))(wmode=)(\"[^\"]*\")((?:.*?)>)/ig, "$1pseudomode=$3$4")
.replace(/(<embed)([^>]*?>)/ig, "$1 wmode=\"transparent\"$2");}
temptext = temptext.replace(/&amp;/ig, "&");return temptext;} else {
var scriptRecover = new Sys.Extended.UI.HTMLEditor.DesignPanel.ScriptRecover();var src = document.createElement("DIV");if (!this._editPanel.get_noScript()) {
temptext.replace(/<script(?:[^>]*?)>(.*?)<\/script(?:[^>]*?>)/gi, function(p0, p1) { return scriptRecover.regReplScript1(p0, p1);});}
src.innerHTML = Sys.Extended.UI.HTMLEditor.Trim(temptext.replace(/([^>])([\n\r]+)([^<])/g, "$1 $3"));var tempCollection = src.getElementsByTagName("EMBED");var embedCollection = [];for (var i = 0;i < tempCollection.length;i++) embedCollection.push(tempCollection[i]);for (var j = 0;j < embedCollection.length;j++) {
var embed = embedCollection[j];var img = document.createElement("IMG");var attrs = embed.attributes;img.src = this._editPanel.get_imagePath_1x1();img.setAttribute("dummytag", "embed");for (var i = 0;i < attrs.length;++i) {
var a = attrs.item(i);if (!a.specified) continue;var name = a.name.toLowerCase();var value = a.value;if (name == "src") name = "dummysrc";else
if (name == "bgcolor") name = "dummybgcolor";else
if (name == "wmode") name = "pseudomode";img.setAttribute(name, value);}
img.style.cssText = "border: 1px dotted #000000; background-image: url('" + (img.getAttribute("type").toLowerCase() == "application/x-mplayer2" ? this._editPanel.get_imagePath_media() : tthis._editPanel.get_imagePath_flash()) + "'); background-position: center; background-repeat: no-repeat; background-color: #c0c0c0;";if (embed.style.width && embed.style.width.length > 0) img.style.width = embed.style.width;if (embed.style.height && embed.style.height.length > 0) img.style.height = embed.style.height;embed.parentNode.insertBefore(img, embed);embed.parentNode.removeChild(embed);}
Sys.Extended.UI.HTMLEditor.spanJoiner(src, document);temptext = Sys.Extended.UI.HTMLEditor.Trim(Sys.Extended.UI.HTMLEditor.getHTML(src, false, true));if (!this._editPanel.get_noScript()) {
temptext = temptext.replace(/(<script(?:[^>]*?)>)(.*?)(<\/script(?:[^>]*?)>)/gi, function(p0, p1, p2, p3) { return scriptRecover.regReplFromScript1(p0, p1, p2, p3);});}
delete src;delete scriptRecover;temptext = Sys.Extended.UI.HTMLEditor.brXHTML(temptext);if (temptext.length == 0) {
temptext = "<br/>";}
return temptext;}
},
_clearP: function() {
try {
var el = this._doc.body;if (el.firstChild)
if (el.firstChild.nodeType == 3) {
var str = Sys.Extended.UI.HTMLEditor.Trim("" + el.firstChild.data + "");if (str.length == 0)
el.removeChild(el.firstChild);else
if (str != ("" + el.firstChild.data + ""))
el.firstChild.data = str;}
if (Sys.Extended.UI.HTMLEditor.isIE) {
if (el.childNodes.length == 1) {
el = el.firstChild;if (el.nodeType == 1) {
var elTagName = el.tagName.toLowerCase();if (elTagName == "p" || elTagName == "ul" || elTagName == "ol") {
var needDel = false;var list = (elTagName == "ul" || elTagName == "ol");function checkInner(elem) {
var ret = false;if (elem.nodeType == 1) {
var tagName = elem.tagName.toUpperCase();if (!(list && tagName == "LI"))
if (Sys.Extended.UI.HTMLEditor.isRestricted(elem) || tagName == "IMG" || tagName == "IFRAME" || tagName == "EMBED" || tagName == "SCRIPT") return true;if (elem.childNodes.length > 1) return true;if (elem.childNodes.length == 0) return false;ret |= checkInner(elem.firstChild);} else {
if (elem.nodeType == 3) {
ret |= true;}
}
return ret;}
if (el.childNodes.length == 1) {
if (!checkInner(el.firstChild)) {
el.removeChild(el.firstChild);needDel = true;}
}
if (needDel || el.parentNode.innerHTML.toLowerCase() == "<p>&nbsp;</p>") this._doc.body.removeChild(el);}
}
}
}
} catch (e) { }
},
isControl: function() {
try {
var sel = this._getSelection();if (Sys.Extended.UI.HTMLEditor.isIE) {
if (sel.type.toLowerCase() == "control") {
return true;} else {
return false;}
} else {
var range = this._createRange(sel);var parent = this._getParent(range);if (parent.nodeType != 3 && range.startContainer == range.endContainer) {
if (!parent.tagName) {
return false;}
if (range.startContainer.childNodes.item(range.startOffset) == null) {
return false;}
if (range.startOffset == range.endOffset &&
range.startContainer.childNodes.item(range.startOffset).tagName &&
(range.startContainer.childNodes.item(range.startOffset).tagName.toUpperCase() == "BR" ||
Sys.Extended.UI.HTMLEditor.isStyleTag(range.startContainer.childNodes.item(range.startOffset).tagName))
) {
return false;}
if (parent.tagName.toUpperCase() == "BODY" && range.startOffset == 0 &&
range.endOffset > 0 && range.endOffset == parent.childNodes.length) {
return false;}
if (range.startOffset == range.endOffset && range.startContainer.childNodes.item(range.startOffset).nodeType == 3) {
return false;}
return true;}
else {
return false;}
}
}
catch (e) {
return true;}
},
isPopup: function() {
return (this._popup != null);},
_getSelection: function() {
if (Sys.Extended.UI.HTMLEditor.isIE) {
var sel = this._doc.selection;return sel;} else {
this.focusEditor();var sel;var range;var el;var contentWindow = this.get_element().contentWindow;sel = contentWindow.getSelection();range = this._createRange(sel);el = range.startContainer;try {
while (el && el.nodeType) {
el = el.parentNode;}
} catch (e) {
this._removeAllRanges(sel);range = this._createRange(sel);range.setStart(this._saved_startContainer, this._saved_startOffset);range.setEnd(this._saved_startContainer, this._saved_startOffset);this._selectRange(sel, range);sel = contentWindow.getSelection();}
return sel;}
},
_createRange: function(sel) {
if (Sys.Extended.UI.HTMLEditor.isIE) {
if (typeof sel == "undefined") {
return this._doc.body.createTextRange();} else {
return sel.createRange();}
} else {
this.focusEditor();if (typeof sel == "undefined") {
return this._doc.createRange();} else {
try {
var r = sel.getRangeAt(0);return r;}
catch (e) {
return this._doc.createRange();}
}
}
},
toEndOfProtected: function() {
var editor = this;var sss = this._getSelection();var range;try {
range = this._createRange(sss);} catch (ex) {
return false;}
var el;if (!Sys.Extended.UI.HTMLEditor.isIE) {
el = Sys.Extended.UI.HTMLEditor.contentEditable(range.startContainer);if (el == null) {
el = Sys.Extended.UI.HTMLEditor.contentEditable(range.endContainer);}
} else {
el = Sys.Extended.UI.HTMLEditor.contentEditable(Sys.Extended.UI.HTMLEditor.getSelParent(editor));}
if (Sys.Extended.UI.HTMLEditor.isIE && el != null) {
try { range.remove(el);} catch (e) { }
range = editor._doc.body.createControlRange();range.add(el);range.select();} else {
if (!Sys.Extended.UI.HTMLEditor.isIE && el != null) {
var sel = editor._getSelection();var tempText;if (el.nextSibling != null && el.nextSibling.nodeType == 3) {
tempText = el.nextSibling;} else {
tempText = editor._doc.createTextNode("");if (el.nextSibling != null) {
el.parentNode.insertBefore(tempText, el.nextSibling);} else {
el.parentNode.appendChild(tempText);}
}
editor._removeAllRanges(sel);var range = editor._createRange(sel);range.setStart(tempText, 0);range.setEnd(tempText, 0);editor._selectRange(sel, range);}
}
return true;},
_commonPaste: function(ev) {
var editor = this;this._saveContent();if (Sys.Extended.UI.HTMLEditor.isIE) {
this.openWait();setTimeout(function() { editor._paste(!editor._editPanel.get_noPaste());editor.closeWait();}, 0)
Sys.Extended.UI.HTMLEditor._stopEvent(ev);}
else {
if (!this.isPlainText && !this.isWord && !this._editPanel.get_noPaste()) {
setTimeout(function() {
Sys.Extended.UI.HTMLEditor.operateAnchors(editor, editor._doc, !editor._editPanel.get_showAnchors());Sys.Extended.UI.HTMLEditor.operatePlaceHolders(editor, editor._doc, !editor._editPanel.get_showPlaceHolders());Sys.Extended.UI.HTMLEditor.inspectForShadows(editor._doc.body);editor._checkImages(editor._doc.body);editor.onContentChanged();}, 0);} else {
var place = editor._getSafePlace();if (place != null) {
var div = editor._doc.createElement("div");div.style.display = "inline";div.style.borderStyle = "none";place.parentNode.insertBefore(div, place);div.appendChild(place);div.removeChild(place);div.innerHTML = "xx";var sel = editor._getSelection();var rng = editor._createRange();editor._removeAllRanges(sel);rng.setStart(div.firstChild, 0);rng.setEnd(div.firstChild, 1);editor._selectRange(sel, rng);editor.openWait();setTimeout(function() {
var parent = div.parentNode;div.lastChild.deleteData(div.lastChild.length - 1, 1);if (editor.isWord) {
div.innerHTML = Sys.Extended.UI.HTMLEditor.cleanUp(div.innerHTML);Sys.Extended.UI.HTMLEditor.replaceOldTags(div, editor);Sys.Extended.UI.HTMLEditor.spanJoiner(div, editor._doc);} else {
var div1 = document.createElement("div");div1.innerHTML = Sys.Extended.UI.HTMLEditor.cleanUp(div.innerHTML);div.innerHTML = div1.innerText.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "").replace(/\n/g, "<br/>").replace(/\t/g, "&nbsp;");delete div1;}
while (div.firstChild) {
parent.insertBefore(div.firstChild, div);}
var ns = null;var ps = null;if (div.nextSibling && div.nextSibling.nodeType == 3 && div.previousSibling && div.previousSibling.nodeType == 3) {
ns = div.nextSibling;ps = div.previousSibling;}
parent.removeChild(div);var pslength = null;if (ns != null && ps != null) {
pslength = ps.data.length;ps.data = "" + ps.data + "" + ns.data + "";ns.parentNode.removeChild(ns);}
editor.isWord = false;editor.isPlainText = false;editor.closeWait();if (pslength != null) {
var sel = editor._getSelection();var rng = editor._createRange();editor._removeAllRanges(sel);rng.setStart(ps, pslength);rng.setEnd(ps, pslength);editor._selectRange(sel, rng);}
editor.onContentChanged();}, 0);}
else {
Sys.Extended.UI.HTMLEditor._stopEvent(ev);}
}
}
},
_selectRange: function(sel, range) {
sel.addRange(range);this.focusEditor();},
_selectRng: function(rng) {
var sel = this._getSelection();if (!Sys.Extended.UI.HTMLEditor.isIE) {
var range = this._doc.createRange();range.setStart(rng[0], 0);range.setEnd(rng[rng.length - 1], ("" + rng[rng.length - 1].data + "").length);this._removeAllRanges(sel);this._selectRange(sel, range);} else {
var range1 = this._createRange(sel);var range2 = this._createRange(sel);var span1 = this._doc.createElement("span");var span2 = this._doc.createElement("span");rng[0].parentNode.insertBefore(span1, rng[0]);if (rng[rng.length - 1].nextSibling) {
rng[rng.length - 1].parentNode.insertBefore(span2, rng[rng.length - 1].nextSibling);} else {
rng[rng.length - 1].parentNode.appendChild(span2);}
try {
range1.moveToElementText(span1);var ii = range1.moveStart('character', 1);range1.moveStart('character', -ii);range2.moveToElementText(span2);ii = range2.moveEnd('character', -1);range2.moveEnd('character', -ii);range1.setEndPoint("EndToEnd", range2);range1.select();} catch (e) { }
rng[0].parentNode.removeChild(span1);rng[rng.length - 1].parentNode.removeChild(span2);}
},
_removeAllRanges: function(sel) {
sel.removeAllRanges();},
_setToEnd: function() {
var editor = this;setTimeout(function() {
editor._setToEnd_();editor._editPanel.updateToolbar();}, 0);},
_setToEnd_: function() {
var editor = this;if (Sys.Extended.UI.HTMLEditor.isIE) {
var sel = editor._getSelection();var range = editor._createRange(sel);if (sel.type.toLowerCase() != "control") {
range.moveEnd("textedit", 1);range.collapse(false);}
range.select();editor.focusEditor();return;}
var index = 0;var container = editor._doc.body;var anchor = null;if (container.lastChild && container.lastChild.nodeType == 3) {
container = container.lastChild;index = ("" + container.data + "").length;} else {
var tempText = editor._doc.createTextNode("");if (container.lastChild && container.lastChild.nodeType == 1 && container.lastChild.tagName.toUpperCase() == "BR") {
container.insertBefore(tempText, container.lastChild);} else {
container.appendChild(tempText);}
container = tempText;index = 0;}
var sel = editor._getSelection();editor._removeAllRanges(sel);var range = editor._createRange();range.setStart(container, index);range.setEnd(container, index);editor._selectRange(sel, range);if (anchor != null) {
editor._doc.body.removeChild(anchor);}
editor.focusEditor();if (!Sys.Extended.UI.HTMLEditor.isSafari && !Sys.Extended.UI.HTMLEditor.isOpera) {
try {
var anchor = editor._doc.createElement("button");anchor.style.width = "0px";anchor.style.height = "20px";editor._doc.body.appendChild(anchor);anchor.focus();anchor.blur();editor.focusEditor();editor._doc.body.removeChild(anchor);} catch (e) { }
}
},
isShadowed: function() {
if (!this.isControl()) return false;var sel = this._getSelection();var range = this._createRange(sel);var element;if (Sys.Extended.UI.HTMLEditor.isIE) {
element = range.item(0);} else {
element = range.startContainer.childNodes.item(range.startOffset);}
if (element.tagName &&
element.tagName.toUpperCase() == "IMG" &&
element.getAttribute(Sys.Extended.UI.HTMLEditor.attachedIdAttribute) &&
element.getAttribute(Sys.Extended.UI.HTMLEditor.attachedIdAttribute).length > 0
) {
var shadowNode = this.getAttachedElement(element);if (shadowNode != null) {
if (Sys.Extended.UI.HTMLEditor.isIE) {
range = this._doc.body.createControlRange();range.add(shadowNode);range.select();} else {
try {
var index = Sys.Extended.UI.HTMLEditor.__getIndex(shadowNode);sel.collapseToEnd();this._removeAllRanges(sel);range = this._createRange(sel);range.setStart(shadowNode.parentNode, index);range.setEnd(shadowNode.parentNode, index + 1);this._selectRange(sel, range);} catch (e) {
return true;}
}
return false;}
return true;}
return false;},
_ifShadow: function() {
if (Sys.Extended.UI.HTMLEditor.isIE) {
try {
var selka = this._doc.selection;} catch (e) {
return false;}
}
var editor = this;var prot = null;var el = Sys.Extended.UI.HTMLEditor.getSelParent(editor);while (el && (el.nodeType == 3 || (el.tagName && el.tagName.toUpperCase() != "BODY"))) {
if (el.nodeType == 3 || !el.tagName) {
el = el.parentNode;continue;}
var tagName = el.tagName.toUpperCase()
if (tagName == "TABLE" && el.getAttribute(Sys.Extended.UI.HTMLEditor.noContextMenuAttribute) &&
el.getAttribute(Sys.Extended.UI.HTMLEditor.noContextMenuAttribute) == "yes") {
prot = el.rows.item(0).cells.item(0).firstChild;if (Sys.Extended.UI.HTMLEditor.isIE && tagName == "P") {
prot = prot.firstChild;}
break;}
el = el.parentNode;}
if (prot != null) {
var sel = editor._getSelection();var range = editor._createRange(sel);if (Sys.Extended.UI.HTMLEditor.isIE) {
range = editor._doc.body.createControlRange();range.add(prot);range.select();} else {
try {
sel.collapseToEnd();editor._removeAllRanges(sel);range = editor._createRange(sel);range.setStart(prot.parentNode, 0);range.setEnd(prot.parentNode, 1);editor._selectRange(sel, range);} catch (e) { }
}
}
},
_saveContent: function() {
var sel;var range;var marker;try {
try {
sel = this._getSelection();range = this._createRange(sel);} catch (e) { }
marker = new Sys.Extended.UI.HTMLEditor._Marker(this, range, sel);} catch (e) {
return;}
if (!this.__stack) {
this.__stack = [];this.__stackPos = 0;}
while (this.__stackPos < this.__stack.length) {
this.__stack.pop();}
if (this.__stack.length == Sys.Extended.UI.HTMLEditor.__stackMaxSize) {
this.__stack.reverse();this.__stack.pop();this.__stack.reverse();}
this.__stack.push(marker);this.__stackPos = this.__stack.length;},
_restoreContent: function() {
if (this.__stack && this.__stackPos >= 0 && this.__stackPos < this.__stack.length) {
var obj = this.__stack[this.__stackPos];var sel;var range;if (Sys.Extended.UI.HTMLEditor.isIE) {
function rep(p0, p1, p2, p3, p4) {
return p1.replace(/\salign=[^\s>]*/ig, "") + ((p3 == '"X"') ? "" : ("align=" + p3)) + p4.replace(/\salign=[^\s>]*/ig, "");}
var tempCollection = this._doc.body.getElementsByTagName("EMBED");var els = [];for (var i = 0;i < tempCollection.length;i++) {
els.push(tempCollection[i]);}
for (var jk = 0;jk < els.length;jk++) {
els[jk].parentNode.removeChild(els[jk]);}
var tuk = obj._save.replace(/&amp;/ig, "&");tuk = tuk.replace(/(<embed(?:.*?))(teoalign=)(\"[^\"]*\")((?:.*?)>)/ig, rep);this._doc.body.innerHTML = "!!!<span></span>" + Sys.Extended.UI.HTMLEditor.Trim(tuk);if (this._doc.body.firstChild) {
this._doc.body.removeChild(this._doc.body.firstChild);}
if (this._doc.body.firstChild) {
this._doc.body.removeChild(this._doc.body.firstChild);}
var mArr = Sys.Extended.UI.HTMLEditor.getHrefsText(tuk);Sys.Extended.UI.HTMLEditor.setHrefsText(this._doc.body, mArr);if (this._editPanel.get_relativeImages()) {
mArr = Sys.Extended.UI.HTMLEditor.getImagesText(tuk);Sys.Extended.UI.HTMLEditor.setImagesText(this._doc.body, mArr);}
Sys.Extended.UI.HTMLEditor.setNames(this._doc.body, obj._nArr);Sys.Extended.UI.HTMLEditor.operateAnchors(this, this._doc, !this._editPanel.get_showAnchors());Sys.Extended.UI.HTMLEditor.operatePlaceHolders(this, this._doc, !this._editPanel.get_showPlaceHolders());if (obj._tree != null) {
var el = this._doc.body;var i;try {
for (i = obj._tree.length - 1;i >= 0;i--) {
el = el.childNodes.item(obj._tree[i]);}
} catch (e) {
if (this.__stackPos > 0) {
this.__stackPos--;this._restoreContent();this.__stackPos++;}
return;}
try {
var rng = this._doc.body.createControlRange();rng.add(el);rng.select();} catch (e) { }
} else {
var editor = this;setTimeout(function() {
try {
if (editor._editPanel == Sys.Extended.UI.HTMLEditor.LastFocusedEditPanel) {
sel = editor._getSelection();range = editor._createRange(sel);if (sel.type.toLowerCase() != "control") {
try { range.moveToPoint(obj._offsetLeft, obj._offsetTop);} catch (e) { }
}
range.select();}
} catch (e) { }
}, 0);}
} else {
if (Sys.Extended.UI.HTMLEditor.isOpera) {
this._doc.body.innerHTML = Sys.Extended.UI.HTMLEditor.Trim(obj._save);} else {
this._doc.body.innerHTML = "";for (var i = 0;i < obj._save.childNodes.length;i++) {
this._doc.body.appendChild(obj._save.childNodes.item(i).cloneNode(true));}
}
Sys.Extended.UI.HTMLEditor.operateAnchors(this, this._doc, !this._editPanel.get_showAnchors());Sys.Extended.UI.HTMLEditor.operatePlaceHolders(this, this._doc, !this._editPanel.get_showPlaceHolders());try {
sel = this._getSelection();range = this._createRange();this._removeAllRanges(sel);} catch (e) { }
var str = "";var el = this._doc.body;for (var i = obj._tree.length - 1;i >= 0;i--) {
str += " " + obj._tree[i];el = el.childNodes.item(obj._tree[i]);}
var n_offset = obj._offset;try {
range.setStart(el, n_offset);range.setEnd(el, n_offset);} catch (e) {
Sys.Extended.UI.HTMLEditor.inspectForShadows(this._doc.body);return;}
try {
this._selectRange(sel, range);} catch (e) { }
}
try {
Sys.Extended.UI.HTMLEditor.inspectForShadows(this._doc.body);} catch (e) { }
}
},
SaveContent: function() {
this._saveContent();},
RestoreContent: function() {
this._undo(false);},
_undo: function(pr) {
if (this.__stack) {
if (this.__stackPos > 0) {
if (this.__stackPos == this.__stack.length && pr) {
this._saveContent();}
do {
var tmp = Sys.Extended.UI.HTMLEditor.Trim(this._doc.body.innerHTML);this.__stackPos--;this._restoreContent();}
while (Sys.Extended.UI.HTMLEditor.Trim(this._doc.body.innerHTML) == tmp && this.__stackPos > 0 && pr)
var editor = this;setTimeout(function() {
try { editor._ifShadow();} catch (e) { };if (editor._editPanel == Sys.Extended.UI.HTMLEditor.LastFocusedEditPanel) {
try { editor._editPanel.updateToolbar();} catch (e) { }
}
if (!pr) editor.onContentChanged();}, 0);}
}
},
_redo: function() {
if (this.__stack) {
if (this.__stackPos < this.__stack.length - 1) {
this.__stackPos++;var editor = this;var tempCollectionLength;if (Sys.Extended.UI.HTMLEditor.isIE) {
tempCollectionLength = editor._doc.body.getElementsByTagName("EMBED").length;if (tempCollectionLength > 0) {
var popup = editor._body.ownerDocument.createElement("div");editor._body.appendChild(popup);setTimeout(function() {
editor._body.removeChild(popup);}, 0);}
}
this._restoreContent();var editor = this;setTimeout(function() { editor._ifShadow();editor._editPanel.updateToolbar();}, 0);}
}
},
undo: function() {
this._undo(true);this.onContentChanged();},
redo: function() {
this._redo();this.onContentChanged();},
_contextMenuCallP: function() {
},
onContentChanged: function() {
},
_copyCut: function(key, prize) {
var editor = this;if (Sys.Extended.UI.HTMLEditor.isIE) {
var sel = this._getSelection();var range = this._createRange(sel);var was = false;var html = "";if (key == 'x') {
this._saveContent();}
if (sel.type.toLowerCase() == "control") {
was = true;html = Sys.Extended.UI.HTMLEditor.getHTML(range.item(0), true)
} else {
if (range.text != "") {
was = true;html = range.htmlText;var sr = range.duplicate();var rng = this._getTextNodeCollection();if (rng.length < 1) {
return;}
var fnd = Sys.Extended.UI.HTMLEditor._commonParent(rng[0], rng[rng.length - 1]);if (fnd != null && rng[0].previousSibling && rng[0].previousSibling.nodeType == 3) {
var par = fnd.parent;while (par && par.tagName.toUpperCase() != "BODY" && Sys.Extended.UI.HTMLEditor.isStyleTag(par.tagName)) {
var ttt = par.cloneNode(false);ttt.innerHTML = html;html = ttt.outerHTML;par = par.parentNode;}
}
sel = this._getSelection();sel.empty();range = this._createRange(sel);range.setEndPoint("EndToEnd", sr);range.setEndPoint("StartToStart", sr);range.select();} else {
if (range.htmlText != "") {
was = true;html = range.htmlText;}
}
}
if (was) {
var src = this._doc.createElement("DIV");src.innerHTML = "!!!<span></span>" + html;src.removeChild(src.firstChild);src.removeChild(src.firstChild);var temp = Sys.Extended.UI.HTMLEditor.getHTML(src, false, true);var nnreg = new RegExp("(<[/]?)(teo" + Sys.Extended.UI.HTMLEditor.smartClassName + ":)", "ig");temp = temp.replace(nnreg, "$1");delete src;this._contentCopy(temp, true);range.select();if (key == 'x') {
sel.clear();this._clearP();}
} else {
if (key == 'x') {
sel.clear();this._clearP();}
}
if (prize) {
setTimeout(function() { editor._editPanel.updateToolbar();}, 0);}
} else {
if (key == "x") {
this._saveContent();var sel = this._getSelection();var range = this._createRange(sel);this._removeAllRanges(sel);range.deleteContents();if (this._doc.body.innerHTML == "") {
this._doc.body.innerHTML = "<br/>";range.setStart(this._doc.body, 0);range.setEnd(this._doc.body, 0);}
editor.onContentChanged();this._selectRange(sel, range);} else {
var sel = this._getSelection();var range = this._createRange(sel);this._removeAllRanges(sel);alert(String.format(Sys.Extended.UI.Resources.HTMLEditor_toolbar_button_Use_verb, (Sys.Extended.UI.HTMLEditor.isSafari && navigator.userAgent.indexOf("mac") != -1) ? "Apple-C" : "Ctrl-C"));this._selectRange(sel, range);}
}
},
_paste: function(prize, word) {
var editor = this;var sel = this._getSelection();var range = this._createRange(sel);var _left;var _top;if (!prize) {
_left = range.offsetLeft;_top = range.offsetTop;this.insertHTML(this._getPlain());editor.onContentChanged();return;}
if (this._editPanel.get_noPaste()) {
return;}
_left = range.offsetLeft;_top = range.offsetTop;var temp = this._doc.createElement("span");var place;var tText = this._contentCopy("", false, word);if ((/<[\/]*p[\s>]+/i.test(tText)) || (/<[\/]*h/i.test(tText))) {
place = this._getSafePlace();} else {
place = this._doc.createElement("SPAN");place.id = Sys.Extended.UI.HTMLEditor.smartClassName;if (!this.insertHTML(Sys.Extended.UI.HTMLEditor.getHTML(place, true))) {
return;}
place = this._doc.getElementById(Sys.Extended.UI.HTMLEditor.smartClassName);if (place) {
place.id = null;place.removeAttribute("id");place.setAttribute("para", "no");}
}
temp.innerHTML = tText;if (!place) {
return;}
this._checkImages(temp);var par = place.parentNode;var pos = place.getAttribute("para");if (pos != "no") {
if (pos.indexOf("left") >= 0 && temp.firstChild) {
if (temp.firstChild.tagName && temp.firstChild.tagName.toUpperCase() == "P") {
while (temp.firstChild.firstChild) {
place.previousSibling.appendChild(temp.firstChild.firstChild);}
temp.removeChild(temp.firstChild);}
}
if (pos.indexOf("right") >= 0 && temp.lastChild) {
if (temp.lastChild.tagName && temp.lastChild.tagName.toUpperCase() == "P") {
while (temp.lastChild.lastChild) {
place.nextSibling.insertBefore(temp.lastChild.lastChild, place.nextSibling.firstChild);}
temp.removeChild(temp.lastChild);}
}
}
var saveEl = place;var temp1 = null;if (temp.childNodes.length == 0 && pos.indexOf("left") >= 0 && pos.indexOf("right") >= 0) {
if (place.nextSibling.firstChild) {
temp1 = this._doc.createElement("span");saveEl = temp1;temp1.innerHTML = "111";place.previousSibling.appendChild(temp1);}
while (place.nextSibling.firstChild) {
place.previousSibling.appendChild(place.nextSibling.firstChild);}
par.removeChild(place.nextSibling);} else {
while (temp.firstChild) {
par.insertBefore(temp.firstChild, place);}
}
setTimeout(function() {
var sel = editor._getSelection();var range = editor._createRange(sel);if (sel.type.toLowerCase() == "control") {
while (range.length > 0) {
range.remove(0);}
}
try {
range.collapse(false);} catch (e) { }
editor.focusEditor();Sys.Extended.UI.HTMLEditor._setCursor(saveEl, editor);if (temp1) {
temp1.parentNode.removeChild(temp1);}
par.removeChild(place);Sys.Extended.UI.HTMLEditor.inspectForShadows(editor._doc.body);editor.onContentChanged();range.select();}, 0);},
_contentCopy: function(text, prize, word) {
if (text != "") {
text = text.replace(/(<td[^>]*?>)([\s ]*?)(<\/td[^>]*?>)/ig, "$1&nbsp;$3")
.replace(/(<td[^>]*?>)\s*(&nbsp;)\s*(<\/td[^>]*?>)/ig, "$1<br/>$3")
.replace(/(<p[^>]*?>)\s*(&nbsp;)\s*(<\/p[^>]*?>)/ig, "$1<br/>$3");}
var iframe = this._doc.createElement("iframe");iframe.width = "0";iframe.height = "0";if (Sys.Extended.UI.HTMLEditor.isIE) {
iframe.src = "javascript:false;";}
this._doc.appendChild(iframe);var doc = iframe.contentWindow.document;doc.write("<html><head></head><body>" + text + "</body></html>");doc.close();doc.body.contentEditable = true;var r = doc.body.createTextRange();var wasNbsp = false;if (text == "") {
r.execCommand("paste");var trg = doc.createElement("DIV");for (var i = 0;i < doc.body.childNodes.length;i++) {
var child = doc.body.childNodes.item(i);if (child.nodeType == 8) {
var str = "" + child.data + "";if (str.search(/StartFragment/i) >= 0) {
if (child.nextSibling && child.nextSibling.nodeType == 3) {
var str = "" + child.nextSibling.data + "";if (str.length) {
if (str.charCodeAt(0) == 160) {
str = str.substr(1);child.nextSibling.data = str;wasNbsp = true;break;}
}
}
}
}
}
if (typeof word != "undefined" && word) {
doc.body.innerHTML = Sys.Extended.UI.HTMLEditor.cleanUp(doc.body.innerHTML);}
var str = Sys.Extended.UI.HTMLEditor.Trim(Sys.Extended.UI.HTMLEditor.getHTML(doc.body, false, true));str = str.replace(/(<script(?:[^>]*?)>(?:[^<]*?)<\/script(?:[^>]*?)>)/gi, "");doc.body.innerHTML = str;if (!prize) {
Sys.Extended.UI.HTMLEditor.operateAnchors(this, doc, !this.showAnchors);Sys.Extended.UI.HTMLEditor.operatePlaceHolders(this, doc, !this.showPlaceHolders);var tempCollection = doc.body.getElementsByTagName("EMBED");var els = [];for (var i = 0;i < tempCollection.length;i++) {
els.push(tempCollection[i]);}
for (var jk = 0;jk < els.length;jk++) {
els[jk].parentNode.removeChild(els[jk]);}
}
delete r;delete trg;if (prize && Sys.Extended.UI.HTMLEditor.isIE) {
r = doc.body.createTextRange();}
}
if (prize && Sys.Extended.UI.HTMLEditor.isIE) {
if (text != "") {
Sys.Extended.UI.HTMLEditor.operateAnchors(this, doc, true);Sys.Extended.UI.HTMLEditor.operatePlaceHolders(this, doc, true);}
r.select();r.execCommand("copy");}
var ret = Sys.Extended.UI.HTMLEditor.Trim(doc.body.innerHTML)
.replace(/<br\s*[\/]*>\s*<\/td>/ig, "</td>")
.replace(/(<td[^>]*?>)([\s ]*?)(<\/td[^>]*?>)/ig, "$1&nbsp;$3")
.replace(/(<p[^>]*?>)\s*(<br[^>]*?>)\s*(<\/p[^>]*?>)/ig, "$1&nbsp;$3")
.replace(/(<embed(?:.*?))(wmode=)(\"[^\"]*\")((?:.*?)>)/ig, "$1pseudomode=$3$4")
.replace(/(<embed)([^>]*?>)/ig, "$1 wmode=\"transparent\"$2");var tempCollection = doc.body.getElementsByTagName("EMBED");var els = [];for (var i = 0;i < tempCollection.length;i++) {
els.push(tempCollection[i]);}
for (var jk = 0;jk < els.length;jk++) {
els[jk].parentNode.removeChild(els[jk]);}
iframe.src = "";var editor = this;editor._doc.removeChild(iframe);delete iframe;return ret;},
insertHTML: function(html, range) {
this.focusEditor();var sel = this._getSelection();if (typeof range == "undefined") {
range = this._createRange(sel);}
if (Sys.Extended.UI.HTMLEditor.isIE) {
function regReplScript(p0, p1) {
return "<span class=\"" + Sys.Extended.UI.HTMLEditor.smartClassName + "_script\" style='display:none;visibility:hidden;'>" + p1.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</span>";}
function regReplFromScript(p0, p1, p2, p3) {
return p1.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");}
var new_html = "<span id=\"" + Sys.Extended.UI.HTMLEditor.smartClassName + "\">111<span></span>" + html + "</span>";var mArr = Sys.Extended.UI.HTMLEditor.getHrefsText(new_html);var mArr1 = Sys.Extended.UI.HTMLEditor.getImagesText(new_html);if (!this._editPanel.get_noScript()) {
new_html = new_html.replace(/(<script(?:[^>]*?)>.*?<\/script(?:[^>]*?)>)/gi, regReplScript);} else {
new_html = new_html.replace(/(<script(?:[^>]*?)>.*?<\/script(?:[^>]*?)>)/gi, "");}
var editor = this;try {
range.pasteHTML(new_html);} catch (e) {
return false;}
var trg = this._doc.getElementById(Sys.Extended.UI.HTMLEditor.smartClassName);trg.innerHTML = "<span>qqq</span>" + Sys.Extended.UI.HTMLEditor.getHTML(trg, false, true).replace(new RegExp("<span(?:[^>]*?)class=" + Sys.Extended.UI.HTMLEditor.smartClassName + "_script(?:[^>]*?)>(.*?)<\/span(?:[^>]*?)>", "gi"), regReplFromScript) + "<span>qqq</span>";trg.removeChild(trg.firstChild);trg.removeChild(trg.lastChild);Sys.Extended.UI.HTMLEditor.setHrefsText(trg, mArr);Sys.Extended.UI.HTMLEditor.setImagesText(trg, mArr1);if (trg.firstChild) {
trg.removeChild(trg.firstChild);}
if (trg.firstChild) {
trg.removeChild(trg.firstChild);}
while (trg.firstChild) {
trg.parentNode.insertBefore(trg.firstChild, trg);}
trg.parentNode.removeChild(trg);delete trg;return true;} else {
var div = this._doc.createElement("div");div.innerHTML = html;var tempCollection = div.getElementsByTagName("EMBED");var embedCollection = [];for (var i = 0;i < tempCollection.length;i++) {
embedCollection.push(tempCollection[i]);}
for (var j = 0;j < embedCollection.length;j++) {
var embed = embedCollection[j];var img = document.createElement("IMG");var attrs = embed.attributes;img.src = this._images_list[1];img.setAttribute("dummytag", "embed");for (var i = 0;i < attrs.length;++i) {
var a = attrs.item(i);if (!a.specified) continue;var name = a.name.toLowerCase();var value = a.value;if (name == "src")
name = "dummysrc";else if (name == "bgcolor")
name = "dummybgcolor";else if (name == "wmode")
name = "pseudomode";img.setAttribute(name, value);}
img.getAttribute("type")
img.style.cssText = "border: 1px dotted #000000; background-image: url('" + (img.getAttribute("type").toLowerCase() == "application/x-mplayer2" ? this._images_list[3] : this._images_list[2]) + "'); background-position: center; background-repeat: no-repeat; background-color: #c0c0c0;";embed.parentNode.insertBefore(img, embed);embed.parentNode.removeChild(embed);}
var ret = this.insertNodeAtSelection(div, range);return ret;}
},
insertNodeAtSelection: function(toBeInserted, range) {
if (!Sys.Extended.UI.HTMLEditor.isIE) {
var sel = this._getSelection();if (typeof range == "undefined") {
try {
range = this._createRange(sel);} catch (ex) {
this._removeAllRanges(sel);return false;}
}
var node = range.startContainer;var pos = range.startOffset;if (node.ownerDocument.id != "EditorDocument") {
return false;}
if ((range.startContainer.nodeType == 1 && range.startContainer.tagName.toUpperCase() == "TR") ||
(range.endContainer.nodeType == 1 && range.endContainer.tagName.toUpperCase() == "TR")) {
return false;}
this._removeAllRanges(sel);range.deleteContents();try {
range = this._createRange();} catch (ex) {
this._removeAllRanges(sel);return false;}
switch (node.nodeType) {
case 3:
node = node.splitText(pos);while (toBeInserted.firstChild) {
node.parentNode.insertBefore(toBeInserted.firstChild, node);}
range.setStart(node, 0);range.setEnd(node, 0);break;case 1:
case 11:
try {
this._removeAllRanges(sel);if (node.childNodes.length >= pos + 1) {
node = node.childNodes.item(pos);while (toBeInserted.firstChild) {
node.parentNode.insertBefore(toBeInserted.firstChild, node);}
var tempText = this._doc.createTextNode("");node.parentNode.insertBefore(tempText, node);node = tempText;} else {
var tempText = this._doc.createTextNode("");if (Sys.Extended.UI.HTMLEditor.canHaveChildren(node)) {
while (toBeInserted.firstChild) {
node.appendChild(toBeInserted.firstChild);}
node.appendChild(tempText);} else {
while (toBeInserted.firstChild) {
node.parentNode.insertBefore(toBeInserted.firstChild, node);}
node.parentNode.insertBefore(tempText, node);}
node = tempText;}
if (node.nodeType == 1) {
var par = node.parentNode;var container = par;var j = 0;for (;j < par.childNodes.length;j++) {
if (node == par.childNodes.item(j)) {
break;}
}
range.setStart(par, j);range.setEnd(par, j);} else {
range.setStart(node, 0);range.setEnd(node, 0);}
} catch (ex) {
this._removeAllRanges(sel);return false;}
break;}
this._selectRange(sel, range);return true;} else {
return false;}
},
trickWithStyles: function(tid) {
var editor = this;var el = editor._doc.getElementById(tid);if (el != null) {
if (el.nextSibling && el.nextSibling.nodeType == 3) {
var text = el.nextSibling;el.parentNode.removeChild(el);var spaceIndex = ("" + text.data + "").indexOf(" ");if (spaceIndex > 0) {
text.splitText(spaceIndex);} else {
if (spaceIndex == 0) {
text.splitText(1);}
}
if (editor.n_arr != null) {
for (var im = 0;im < editor.n_arr.length;im++) {
editor.MSIE_applyCssStyle(editor.n_arr[im], [text], false);}
}
editor.n_arr = null;var sel = editor._getSelection();if (!Sys.Extended.UI.HTMLEditor.isIE) {
var range = editor._doc.createRange();range.setStart(text, text.length);range.setEnd(text, text.length);editor._removeAllRanges(sel);editor._selectRange(sel, range);} else {
var range1 = editor._createRange(sel);var span1 = editor._doc.createElement("span");if (text.nextSibling) {
text.parentNode.insertBefore(span1, text.nextSibling);} else {
text.parentNode.appendChild(span1);}
try {
range1.moveToElementText(span1);range1.select();} catch (e) { }
span1.parentNode.removeChild(span1);}
}
else {
el.parentNode.removeChild(el);}
}
},
_getParent: function(range) {
if (Sys.Extended.UI.HTMLEditor.isIE) {
return range.parentElement();} else {
return range.startContainer;}
},
_checkImages: function(element) {
if (this._editPanel.get_relativeImages()) {
var images = element.getElementsByTagName("IMG");for (var i = 0;i < images.length;i++) {
var image = images[i];if (image.src.indexOf("http://") >= 0) {
var tmp = image.src;image.src = "qwerty.gif";var n = image.src.indexOf("qwerty.gif");if (tmp.substr(0, n) == image.src.substr(0, n)) {
tmp = tmp.substr(n, tmp.length - n);}
image.src = tmp;}
}
}
},
_getSafePlace: function(uel) {
var el = this._doc.createElement("SPAN");var editor = this;el.id = Sys.Extended.UI.HTMLEditor.smartClassName;if (typeof uel == "undefined") {
if (!this.insertHTML(Sys.Extended.UI.HTMLEditor.getHTML(el, true))) {
return null;}
} else {
if (uel.nextSibling == null) {
uel.parentNode.appendChild(el);} else {
uel.parentNode.insertBefore(el, uel.nextSibling);}
uel.parentNode.removeChild(uel);}
el = this._doc.getElementById(Sys.Extended.UI.HTMLEditor.smartClassName);el.id = null;el.removeAttribute("id");el.setAttribute("para", "no");var parent = el.parentNode;var tagName = parent.tagName.toUpperCase();while (tagName != "BODY" && tagName != "TD" && tagName != "P" && tagName != "DIV") {
if (Sys.Extended.UI.HTMLEditor.isStyleTag(parent.tagName)) {
parent = parent.parentNode;tagName = parent.tagName.toUpperCase();} else {
break;}
}
if (tagName == "P") {
el.setAttribute("para", "");function diver(add, el, rpr, before) {
var neighbour;var par = Sys.Extended.UI.HTMLEditor.myClone(rpr, editor._doc, false);if (add) {
par.appendChild(add);}
while (el) {
if (el.nodeType == 1 || (el.nodeType == 3 && Sys.Extended.UI.HTMLEditor.Trim("" + el.data + "").length > 0)) {
var text = null;if (el.tagName && el.tagName.toUpperCase() == "SCRIPT") {
text = el.text;}
var ela = Sys.Extended.UI.HTMLEditor.myClone(el, editor._doc, true);if (par.childNodes.length == 0 || !before) {
par.appendChild(ela);} else {
par.insertBefore(ela, par.firstChild);}
if (text != null) {
ela.text = text;}
}
el = before ? el.previousSibling : el.nextSibling
}
if (par.childNodes.length == 0) {
delete par;par = null;}
if (rpr == parent) {
return par;} else {
return diver(par, before ? rpr.previousSibling : rpr.nextSibling, rpr.parentNode, before);}
};var p1 = diver(null, el.previousSibling, el.parentNode, true);var p2 = diver(null, el.nextSibling, el.parentNode, false);var par = parent.parentNode;if (p1) {
par.insertBefore(p1, parent);el.setAttribute("para", el.getAttribute("para") + " left");}
par.insertBefore(el, parent);if (p2) {
par.insertBefore(p2, parent);el.setAttribute("para", el.getAttribute("para") + " right");}
par.removeChild(parent);}
return el;},
noContextMenuAttributeName: function() {
return Sys.Extended.UI.HTMLEditor.noContextMenuAttribute;},
_getTextNodeCollection: function(total) {
var _result = [];if (this.isControl()) {
return _result;}
var sel = this._getSelection();var range = this._createRange(sel);var rn = Sys.Extended.UI.HTMLEditor.smartClassName + "_right";var ln = Sys.Extended.UI.HTMLEditor.smartClassName + "_left";var r_left = null;var r_right = null;var svs;if (typeof total == "undefined") {
if (Sys.Extended.UI.HTMLEditor.isIE) {
r_left = range.duplicate();r_right = range.duplicate();r_left.setEndPoint("EndToStart", range);r_right.setEndPoint("StartToEnd", range);} else {
r_left = range.cloneRange();r_right = range.cloneRange();r_left.setEnd(r_left.startContainer, r_left.startOffset);r_right.setStart(r_right.endContainer, r_right.endOffset);svs = r_left.endOffset;}
if (!this.insertHTML("<span id='" + rn + "'/>", r_right)) {
return _result;} else {
if (Sys.Extended.UI.HTMLEditor.isOpera) {
r_left.setEnd(r_left.startContainer, svs);r_left.setStart(r_left.startContainer, svs);}
if (!this.insertHTML("<span id='" + ln + "'/>", r_left)) {
var rP = this._doc.getElementById(rn);if (rP != null) {
temp = rP.parentNode;temp.removeChild(rP);}
var rL = this._doc.getElementById(rl);if (rL != null) {
temp = rL.parentNode;temp.removeChild(rL);}
return _result;}
}
} else {
var span;span = this._doc.createElement("SPAN");span.id = rn;this._doc.body.appendChild(span);span = this._doc.createElement("SPAN");span.id = ln;this._doc.body.insertBefore(span, this._doc.body.firstChild);}
var lPoint = this._doc.getElementById(ln);var rPoint = this._doc.getElementById(rn);if (lPoint == null || rPoint == null) {
var temp;if (lPoint != null) {
temp = lPoint.parentNode;temp.removeChild(lPoint);}
if (rPoint != null) {
temp = rPoint.parentNode;temp.removeChild(rPoint);}
return [];}
while (lPoint.firstChild) {
lPoint.removeChild(lPoint.firstChild);}
while (rPoint.firstChild) {
rPoint.removeChild(rPoint.firstChild);}
while (lPoint.previousSibling && lPoint.previousSibling.nodeType == 3 &&
Sys.Extended.UI.HTMLEditor.Trim("" + lPoint.previousSibling.data + "").length == 0) {
lPoint.parentNode.removeChild(lPoint.previousSibling);}
while (lPoint.nextSibling && lPoint.nextSibling.nodeType == 3 &&
Sys.Extended.UI.HTMLEditor.Trim("" + lPoint.nextSibling.data + "").length == 0) {
lPoint.parentNode.removeChild(lPoint.nextSibling);}
while (rPoint.previousSibling && rPoint.previousSibling.nodeType == 3 &&
Sys.Extended.UI.HTMLEditor.Trim("" + rPoint.previousSibling.data + "").length == 0) {
rPoint.parentNode.removeChild(rPoint.previousSibling);}
while (rPoint.nextSibling && rPoint.nextSibling.nodeType == 3 &&
Sys.Extended.UI.HTMLEditor.Trim("" + rPoint.nextSibling.data + "").length == 0) {
rPoint.parentNode.removeChild(rPoint.nextSibling);}
var _found = false;var editor = this;function _diver(_point, prize) {
while (_point) {
if (_point.id && _point.id == rn) {
_found = true;return;}
if (_point.nodeType == 3) {
while (_point.nextSibling &&
(
_point.nextSibling.nodeType == 3 ||
(!Sys.Extended.UI.HTMLEditor.isIE && typeof editor.__saveBM__ != "undefined" && editor.__saveBM__ != null && editor.__saveBM__[0] == _point.nextSibling)
)) {
if (_point.nextSibling.nodeType == 3) {
_point.data = "" + _point.data + "" + _point.nextSibling.data + "";} else {
editor.__saveBM__[0] = _point;editor.__saveBM__[1] = ("" + _point.data + "").length;}
_point.parentNode.removeChild(_point.nextSibling);}
if (Sys.Extended.UI.HTMLEditor.Trim("" + _point.data + "").length > 0) {
_result.push(_point);}
} else {
var tagName = _point.tagName;if (_point.tagName) {
tagName = tagName.toUpperCase();if (!(tagName == "MAP" || tagName == "AREA" || tagName == "SCRIPT" || tagName == "NOSCRIPT"))
if (!(_point.style && (Sys.Extended.UI.HTMLEditor.getStyle(_point, "display") == "none" || Sys.Extended.UI.HTMLEditor.getStyle(_point, "visibility") == "hidden"))) {
_diver(_point.firstChild, false);}
}
}
if (_found) return;var _save = _point.parentNode;if (prize) {
while (_point.nextSibling == null) {
_point = _point.parentNode;}
}
_point = _point.nextSibling;}
};_diver(lPoint, true);var temp;temp = lPoint.parentNode;temp.removeChild(lPoint);temp = rPoint.parentNode;temp.removeChild(rPoint);if (typeof total == "undefined") {
if (Sys.Extended.UI.HTMLEditor.isIE) {
sel.empty();r_right.select();} else {
if (_result.length > 0) {
this._removeAllRanges(sel);var rrr = this._createRange();rrr.setEnd(_result[_result.length - 1], _result[_result.length - 1].length);rrr.setStart(_result[_result.length - 1], _result[_result.length - 1].length);this._selectRange(sel, rrr);}
}
}
return _result;},
_getPlain: function() {
var area = this._doc.createElement("textarea");area.width = "0";area.height = "0";this._doc.appendChild(area);var r = area.createTextRange();r.execCommand("paste");var res = area.value;res = res.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "").replace(/\n/g, "<br/>");this._doc.removeChild(area);return res;},
_execCommand: function(cmdID, UI, param) {
var editor = this;var sel;var range;if (Sys.Extended.UI.HTMLEditor.isIE && !this.isControl()) {
sel = this._getSelection();range = this._createRange(sel);var prnt = range.parentElement();if (prnt.tagName.toUpperCase() == "TEXTAREA") {
return;}
}
if (cmdID.toLowerCase() != "createlink") {
this._saveContent();}
switch (cmdID.toLowerCase()) {
case "createlink":
if (Sys.Extended.UI.HTMLEditor.isIE || !UI) {
this._doc.execCommand(cmdID, UI, param);} else {
var param;if ((param = prompt("Enter URL"))) {
this._doc.execCommand(cmdID, false, param);}
}
break;case "backcolor":
case "forecolor":
case "fontname":
case "fontsize":
this.MSIE_applyCommand(cmdID.toLowerCase(), param);break;case "indent":
this.MSIE_indent(true);break;case "outdent":
this.MSIE_indent(false);break;case "justifyleft":
this.MSIE_justify("left");break;case "justifyfull":
this.MSIE_justify("justify");break;case "justifycenter":
this.MSIE_justify("center");break;case "justifyright":
this.MSIE_justify("right");break;case "paragraph":
this.MSIE_justify("remain", false, "P");break;case "formatblock":
if (param != null && typeof param == "string" && param.length == 2) {
if (param.substr(0, 1).toUpperCase() == "H" && parseInt(param.substr(1, 1)) > 0) {
this.MSIE_justify("remain", false, param);break;}
}
this._doc.execCommand(cmdID, UI, param);break;case "insertunorderedlist":
this.MSIE_list("UL");break;case "insertorderedlist":
this.MSIE_list("OL");break;case "bold":
case "italic":
case "underline":
case "strikethrough":
case "superscript":
case "subscript":
this.MSIE_applyCommand(cmdID.toLowerCase());break;default:
this._doc.execCommand(cmdID, UI, param);break;}
this.onContentChanged();if (!Sys.Extended.UI.HTMLEditor.isIE) {
sel = this._getSelection();range = this._createRange(sel);this._removeAllRanges(sel);this._selectRange(sel, range);this.focusEditor();}
var editor = this;setTimeout(function() { editor._editPanel.updateToolbar();}, 0);},
MSIE_indent: function(increase) {
return (Function.createDelegate(this, Sys.Extended.UI.HTMLEditor.MSIE_indent))(increase);},
MSIE_justify: function(textAlign, addParameter, addParameter1) {
return (Function.createDelegate(this, Sys.Extended.UI.HTMLEditor.MSIE_justify))(textAlign, addParameter, addParameter1);},
MSIE_list: function(listTg) {
return (Function.createDelegate(this, Sys.Extended.UI.HTMLEditor.MSIE_list))(listTg);},
getSelectionAfterOperation: function(paragraphs) {
return (Function.createDelegate(this, Sys.Extended.UI.HTMLEditor.getSelectionAfterOperation))(paragraphs);},
setSelectionAfterOperation: function(pars, needJoiner) {
return (Function.createDelegate(this, Sys.Extended.UI.HTMLEditor.setSelectionAfterOperation))(pars, needJoiner);},
get_paragraphs: function() {
return (Function.createDelegate(this, Sys.Extended.UI.HTMLEditor.get_paragraphs))();},
getPseudoP: function() {
return (Function.createDelegate(this, Sys.Extended.UI.HTMLEditor.getPseudoP))();},
getPseudoP_Recur: function(lPoint, rPoint, r_level) {
return (Function.createDelegate(this, Sys.Extended.UI.HTMLEditor.getPseudoP_Recur))(lPoint, rPoint, r_level);},
unWrap: function(element, pars) {
return (Function.createDelegate(this, Sys.Extended.UI.HTMLEditor.unWrap))(element, pars);},
tryUnWrap: function(element, pars, force) {
return (Function.createDelegate(this, Sys.Extended.UI.HTMLEditor.tryUnWrap))(element, pars, force);},
MSIE_applyCommand: function(cmd, par) {
var selectedHTML = (!Sys.Extended.UI.HTMLEditor.isIE) ? Sys.Extended.UI.HTMLEditor.Trim(this.getSelectedHTML()) : "";if (this.isControl()) return;var sel = this._getSelection();var range = this._createRange(sel);var savedRange = (Sys.Extended.UI.HTMLEditor.isIE) ? [range.boundingLeft, range.boundingTop] : [range.startContainer, range.startOffset];var notEmpty = (Sys.Extended.UI.HTMLEditor.isIE && range.text.length > 0) || (!Sys.Extended.UI.HTMLEditor.isIE && selectedHTML.length > 0);var cssStyle = { name: "none", value: "none" };switch (cmd.toLowerCase()) {
case "bold":
cssStyle = { name: "font-weight", value: "bold", repl: false };break;case "italic":
cssStyle = { name: "font-style", value: "italic", repl: false };break;case "underline":
cssStyle = { name: "text-decoration", value: "underline", repl: false };break;case "strikethrough":
cssStyle = { name: "text-decoration", value: "line-through", repl: false };break;case "superscript":
cssStyle = { name: "vertical-align", value: "super", repl: false };break;case "subscript":
cssStyle = { name: "vertical-align", value: "sub", repl: false };break;case "forecolor":
cssStyle = { name: "color", value: par, repl: false };break;case "backcolor":
cssStyle = { name: "background-color", value: par, repl: false };break;case "fontname":
cssStyle = { name: "font-family", value: par, repl: false };break;case "fontsize":
cssStyle = { name: "font-size", value: par, repl: false };break;}
if (notEmpty) {
var rng = this._getTextNodeCollection();this.MSIE_applyCssStyle(cssStyle, rng, true);}
else {
if (this.isControl()) return;var rng = this._tryExpand();if (rng.length > 0) {
this.MSIE_applyCssStyle(cssStyle, rng, false);if (Sys.Extended.UI.HTMLEditor.isIE && this.__saveBM__ != null) {
sel = this._getSelection();range = this._createRange(sel);range.moveToBookmark(this.__saveBM__);range.select();this.__saveBM__ = null;} else {
if (this.__saveBM__ != null) {
if (this.__saveBM__[0].nodeType == 3) {
sel = this._getSelection();range = this._doc.createRange();range.setStart(this.__saveBM__[0], this.__saveBM__[1]);range.setEnd(this.__saveBM__[0], this.__saveBM__[1]);this._removeAllRanges(sel);this._selectRange(sel, range);} else {
this._trySelect(this.__saveBM__[0], this.__saveBM__[0]);this.__saveBM__[0].parentNode.removeChild(this.__saveBM__[0]);}
this.__saveBM__ = null;}
}
} else {
this._setStyleForTyping(cssStyle);}
}
},
MSIE_applyCssStyle: function(cssStyle, rng, selectPrize) {
var name = cssStyle.name.replace(/\-(\w)/g, function(strMatch, p1) { return p1.toUpperCase();});var value = cssStyle.value;var repl = cssStyle.repl;var _detected = false;var _remove = false;this._saveContent();var rn = Sys.Extended.UI.HTMLEditor.smartClassName + "_right";var ln = Sys.Extended.UI.HTMLEditor.smartClassName + "_left";var lPoint = this._doc.createElement("SPAN");lPoint.id = ln;var rPoint = this._doc.createElement("SPAN");rPoint.id = rn;rng[0].parentNode.insertBefore(lPoint, rng[0]);if (rng[rng.length - 1].nextSibling != null) {
rng[rng.length - 1].parentNode.insertBefore(rPoint, rng[rng.length - 1].nextSibling);} else {
rng[rng.length - 1].parentNode.appendChild(rPoint);}
Sys.Extended.UI.HTMLEditor.unStyle(lPoint);Sys.Extended.UI.HTMLEditor.unStyle(rPoint);var parentNodes = [];for (var i = 0;i < rng.length;i++) {
var textNode = rng[i];var par = textNode.parentNode;var j;for (j = 0;j < parentNodes.length;j++) {
var parent = parentNodes[j];if (parent.parent == par) {
parent.textNodes.push(textNode);break;}
}
if (j == parentNodes.length) {
parentNodes.push({ parent: par, textNodes: [textNode] });}
}
for (var i = 0;i < parentNodes.length;i++) {
var parent = parentNodes[i];if (parent.textNodes.length > 1) {
var textNodes = parent.textNodes;var lPointT = this._doc.createElement("SPAN");var rPointT = this._doc.createElement("SPAN");textNodes[0].parentNode.insertBefore(lPointT, textNodes[0]);if (textNodes[textNodes.length - 1].nextSibling != null) {
textNodes[textNodes.length - 1].parentNode.insertBefore(rPointT, textNodes[textNodes.length - 1].nextSibling);} else {
textNodes[textNodes.length - 1].parentNode.appendChild(rPointT);}
Sys.Extended.UI.HTMLEditor._moveTagsUp(lPointT, rPointT);lPointT.parentNode.removeChild(lPointT);rPointT.parentNode.removeChild(rPointT);}
}
for (var i = 0;i < rng.length;i++) {
var textNode = rng[i];var par = textNode.parentNode;var _found = false;while (par && par.tagName && par.childNodes.length == 1 && Sys.Extended.UI.HTMLEditor.isStyleTag(par.tagName)) {
var parTag = par.tagName.toUpperCase();if (
((parTag == "I" || parTag == "EM") && cssStyle.name == "font-style") ||
((parTag == "B" || parTag == "STRONG") && cssStyle.name == "font-weight") ||
((parTag == "S" || parTag == "STRIKE") && cssStyle.name == "text-decoration") ||
((parTag == "U") && cssStyle.name == "text-decoration") ||
((parTag == "SUB" || parTag == "SUP") && cssStyle.name == "vertical-align")
) {
var parSaved = par;par = par.parentNode;while (parSaved.firstChild) {
par.insertBefore(parSaved.firstChild, parSaved);}
par.removeChild(parSaved);_found = true;continue;}
else if (par.style && par.style[name] && par.style[name].length > 0) {
var foundCss = par.style[name];if (name.toLowerCase().indexOf("color") >= 0 || name == "fontFamily" || name == "fontSize") {
par.style[name] = value;} else {
if (repl) {
try {
par.style[name] = par.style[name] + " " + value;if (foundCss == par.style[name]) {
par.style[name] = value;}
} catch (e) {
par.style[name] = value;}
} else {
if (!_detected) {
var sv = foundCss.replace(value, "");if (name == "fontWeight" && foundCss.toString() == "700") {
sv = "";}
if (sv == foundCss) {
try {
par.style[name] = par.style[name] + " " + value;if (foundCss == par.style[name]) {
par.style[name] = value;}
} catch (e) {
par.style[name] = value;}
} else {
par.style[name] = sv.replace(/,/, "");_remove = true;}
_detected = true;} else {
if (_remove) {
par.style[name] = foundCss.replace(value, "").replace(/,/, "");} else {
try {
par.style[name] = par.style[name] + " " + value;if (foundCss == par.style[name]) {
par.style[name] = value;}
} catch (e) {
par.style[name] = value;}
}
}
}
}
_found = true;}
par = par.parentNode;}
if (!_found && !_remove) {
var span;span = this._doc.createElement("SPAN");span.style[name] = value;var parN = textNode.parentNode;parN.insertBefore(span, textNode);span.appendChild(textNode);_detected = true;}
}
var commonParent = Sys.Extended.UI.HTMLEditor._commonTotalParent(lPoint, rPoint);var pSibling = commonParent.parent.childNodes.item(commonParent.indexFirst).previousSibling;var nSibling = commonParent.parent.childNodes.item(commonParent.indexLast).nextSibling;lPoint.parentNode.removeChild(lPoint);rPoint.parentNode.removeChild(rPoint);var indexFirst = 0;var indexLast = commonParent.parent.childNodes.length;if (pSibling != null) {
indexFirst = Sys.Extended.UI.HTMLEditor.__getIndex(pSibling);}
if (nSibling != null) {
indexLast = Sys.Extended.UI.HTMLEditor.__getIndex(nSibling) + 1;if (indexLast < commonParent.parent.childNodes.length) {
if (nSibling.nodeType == 3) {
indexLast++;}
else if (nSibling.nodeType == 1) {
var tag = nSibling.tagName.toUpperCase();if (tag != "TR" && tag != "TD" && tag != "LI") {
indexLast++;}
}
}
}
Sys.Extended.UI.HTMLEditor.spanJoiner(commonParent.parent, this._doc, indexFirst, indexLast);var editor = this;if (selectPrize) {
editor._selectRng(rng);}
setTimeout(function() {
if (!Sys.Extended.UI.HTMLEditor.isIE) {
editor.focusEditor();}
editor._editPanel.updateToolbar();}, 0);},
_tryExpand: function(prize) {
var result = [];var selectedHTML;var notEmpty;var sel = this._getSelection();var range = this._createRange(sel);var sel1;var range1;var rn = Sys.Extended.UI.HTMLEditor.smartClassName + "_right_add";var ln = Sys.Extended.UI.HTMLEditor.smartClassName + "_left_add";var mn = Sys.Extended.UI.HTMLEditor.smartClassName + "_middle_add";if (Sys.Extended.UI.HTMLEditor.isIE && typeof prize == "undefined") {
range.execCommand('bold');this.__saveBM__ = range.getBookmark();range.execCommand('bold');}
if (Sys.Extended.UI.HTMLEditor.isIE) {
var mn_element = null;var mn_span_text = "<span id=" + mn + "></span>";var save_range = range.duplicate();try { range.pasteHTML(mn_span_text);} catch (ex) { }
mn_element = this._doc.getElementById(mn);if (mn_element == null) {
return [];}
if (typeof prize != "undefined") {
this.__saveBM__ = mn_element;}
if (mn_element.nextSibling != null && !Sys.Extended.UI.HTMLEditor.isInlineElement(mn_element.nextSibling)) {
mn_element.parentNode.removeChild(mn_element);return [];}
range.expand('word');range.select();if (range.text.length == 0) {
mn_element.parentNode.removeChild(mn_element);save_range.select();return [];}
var re = new RegExp(mn_span_text, "ig");if (!re.test(range.htmlText.replace(/[\n\r]/g, ""))) {
mn_element.parentNode.removeChild(mn_element);save_range.select();return [];}
re = new RegExp(mn_span_text + "(</span>|&nbsp;|[\\s])*$", "ig");if (re.test(range.htmlText.replace(/[\n\r]/g, ""))) {
mn_element.parentNode.removeChild(mn_element);save_range.select();return [];}
while (range.text.length > 0 && range.text.substr(range.text.length - 1, 1) == " ") {
range.moveEnd('character', -1);range.select();if (range.text.length == 0) {
mn_element.parentNode.removeChild(mn_element);save_range.select();return [];}
}
if (typeof prize == "undefined") {
mn_element.parentNode.removeChild(mn_element);}
return this._getTextNodeCollection();}
function wordBound(c) {
var re = /[\d\w]/;if (re.test(c)) return false;re = /[\u0080-\u024F]/;if (re.test(c)) return false;re = /[\u0370-\u2000]/;if (re.test(c)) return false;return true;}
if (!this.insertHTML("<span id='" + ln + "'></span><span id='" + mn + "'></span><span id='" + rn + "'></span>")) return [];var lPoint = this._doc.getElementById(ln);var rPoint = this._doc.getElementById(rn);var mPoint = this._doc.getElementById(mn);Sys.Extended.UI.HTMLEditor.positionInParagraph(lPoint, lPoint.previousSibling, true, lPoint.parentNode, wordBound);try { this._trySelect(lPoint, rPoint);} catch (ex) { }
sel1 = this._getSelection();range1 = this._createRange(sel1);selectedHTML = (!Sys.Extended.UI.HTMLEditor.isIE) ? Sys.Extended.UI.HTMLEditor.Trim(this.getSelectedHTML()) : "";notEmpty = (Sys.Extended.UI.HTMLEditor.isIE && range1.text.length > 0) || (!Sys.Extended.UI.HTMLEditor.isIE && selectedHTML.length > 0);if (!notEmpty || this._getTextNodeCollection().length == 0) {
var text1 = this._doc.createTextNode("");lPoint.parentNode.insertBefore(text1, lPoint);lPoint.parentNode.removeChild(lPoint);rPoint.parentNode.removeChild(rPoint);mPoint.parentNode.removeChild(mPoint);var range = this._doc.createRange();range.setStart(text1, 0);range.setEnd(text1, 0);range.setStart(text1, 0);range.setEnd(text1, 0);this._removeAllRanges(sel);this._selectRange(sel, range);return [];}
rPoint.parentNode.insertBefore(lPoint, mPoint);Sys.Extended.UI.HTMLEditor.positionInParagraph(rPoint, rPoint.nextSibling, false, rPoint.parentNode, wordBound);this._trySelect(lPoint, rPoint);sel1 = this._getSelection();range1 = this._createRange(sel1);selectedHTML = (!Sys.Extended.UI.HTMLEditor.isIE) ? Sys.Extended.UI.HTMLEditor.Trim(this.getSelectedHTML()) : "";notEmpty = (Sys.Extended.UI.HTMLEditor.isIE && range1.text.length > 0) || (!Sys.Extended.UI.HTMLEditor.isIE && selectedHTML.length > 0);if (!notEmpty || this._getTextNodeCollection().length == 0) {
var text1 = this._doc.createTextNode("");lPoint.parentNode.insertBefore(text1, lPoint);lPoint.parentNode.removeChild(lPoint);rPoint.parentNode.removeChild(rPoint);mPoint.parentNode.removeChild(mPoint);var range = this._doc.createRange();range.setStart(text1, 0);range.setEnd(text1, 0);range.setStart(text1, 0);range.setEnd(text1, 0);this._removeAllRanges(sel);this._selectRange(sel, range);return [];}
Sys.Extended.UI.HTMLEditor.positionInParagraph(lPoint, lPoint.previousSibling, true, lPoint.parentNode, wordBound);this._trySelect(lPoint, rPoint);sel1 = this._getSelection();range1 = this._createRange(sel1);selectedHTML = (!Sys.Extended.UI.HTMLEditor.isIE) ? Sys.Extended.UI.HTMLEditor.Trim(this.getSelectedHTML()) : "";notEmpty = (Sys.Extended.UI.HTMLEditor.isIE && range1.text.length > 0) || (!Sys.Extended.UI.HTMLEditor.isIE && selectedHTML.length > 0);if (Sys.Extended.UI.HTMLEditor.isIE) {
if (typeof prize != "undefined") {
this.__saveBM__ = mPoint;} else {
mPoint.parentNode.removeChild(mPoint);}
} else {
this.__saveBM__ = [mPoint, 0];}
if (notEmpty) {
result = this._getTextNodeCollection();}
lPoint.parentNode.removeChild(lPoint);rPoint.parentNode.removeChild(rPoint);return result;},
_setStyleForTyping: function(cssStyle) {
var name = cssStyle.name.replace(/\-(\w)/g, function(strMatch, p1) { return p1.toUpperCase();});var value = cssStyle.value;var repl = cssStyle.repl;if (this._StyleForTyping == null) {
this._StyleForTyping = [];}
var n_arr = []
var needApply = true;for (var i = 0;i < this._StyleForTyping.length;i++) {
var i_name = this._StyleForTyping[i].name.replace(/\-(\w)/g, function(strMatch, p1) { return p1.toUpperCase();});var i_value = this._StyleForTyping[i].value;if (!(i_name == name && (i_value == value || repl))) {
n_arr.push(this._StyleForTyping[i]);} else {
needApply = false;}
}
this._StyleForTyping = n_arr;if (needApply) {
this._StyleForTyping.push(cssStyle);}
},
_trySelect: function(lPoint, rPoint) {
var sel = this._getSelection();var text1 = null;var text2 = null;if (Sys.Extended.UI.HTMLEditor.isIE) {
sel.empty();sel = this._getSelection();var range1 = this._createRange(sel);var range2 = this._createRange(sel);try {
if (lPoint != null) range1.moveToElementText(lPoint);if (rPoint != null) range2.moveToElementText(rPoint);if (lPoint != null && rPoint != null) {
range1.setEndPoint("EndToEnd", range2);range1.select();}
else if (lPoint != null) range1.select();else if (rPoint != null) range2.select();} catch (e) { }
} else {
try {
text1 = this._doc.createTextNode("");text2 = this._doc.createTextNode("");lPoint.parentNode.insertBefore(text1, lPoint);rPoint.parentNode.insertBefore(text2, rPoint);var range = this._doc.createRange();range.setStart(text1, 0);range.setEnd(text2, 0);this._removeAllRanges(sel);this._selectRange(sel, range);} catch (e) { }
}
},
getSelectedHTML: function() {
var sel = this._getSelection();var range = this._createRange(sel);var existing = null;if (Sys.Extended.UI.HTMLEditor.isIE) {
existing = range.htmlText;} else {
if (Sys.Extended.UI.HTMLEditor.isSafari && (sel.type == "Caret" || sel.type == "None")) {
existing = "";} else {
if (Sys.Extended.UI.HTMLEditor.isSafari) {
if (range.cloneContents() == null) {
return "";}
}
existing = Sys.Extended.UI.HTMLEditor.getHTML(range.cloneContents(), false);}
}
return existing;},
_queryCommandState: function(cmdID) {
var obj = this._rangeStartEnd();if (obj == null) return false;try {
var cssStyle = { name: "none", value: "none" };switch (cmdID.toLowerCase()) {
case "bold":
cssStyle = { name: "font-weight", value: "bold" };break;case "italic":
cssStyle = { name: "font-style", value: "italic" };break;case "underline":
cssStyle = { name: "text-decoration", value: "underline" };break;case "strikethrough":
cssStyle = { name: "text-decoration", value: "line-through" };break;case "superscript":
cssStyle = { name: "vertical-align", value: "super" };break;case "subscript":
cssStyle = { name: "vertical-align", value: "sub" };break;}
var el1 = obj.start;var el2 = obj.end;var cs1 = Sys.Extended.UI.HTMLEditor.getStyle(el1, cssStyle.name).toString().toLowerCase();var cs2 = Sys.Extended.UI.HTMLEditor.getStyle(el2, cssStyle.name).toString().toLowerCase();if (cssStyle.name == "font-weight" && cs1 == "700") cs1 = "bold";if (cssStyle.name == "font-weight" && cs2 == "700") cs2 = "bold";if (/MSIE (5|6)/.test(navigator.userAgent) && cmdID.toLowerCase() == "strikethrough" && (cs1 == "underline" || cs2 == "underline")) {
while (el1 && Sys.Extended.UI.HTMLEditor.isStyleTag(el1.tagName)) {
if (el1.style.textDecoration.indexOf("line-through") >= 0) {
cs1 = el1.style.textDecoration;break;}
el1 = el1.parentNode;}
while (el2 && Sys.Extended.UI.HTMLEditor.isStyleTag(el2.tagName)) {
if (el2.style.textDecoration.indexOf("line-through") >= 0) {
cs2 = el2.style.textDecoration;break;}
el2 = el2.parentNode;}
}
if (Sys.Extended.UI.HTMLEditor.isSafari && (cmdID.toLowerCase() == "strikethrough" || cmdID.toLowerCase() == "underline")) {
var cmdl = cmdID.toLowerCase();if (cmdl == "strikethrough") {
cmdl = "line-through";}
while (el1 && Sys.Extended.UI.HTMLEditor.isStyleTag(el1.tagName)) {
if (el1.style.textDecoration.indexOf(cmdl) >= 0) {
cs1 = el1.style.textDecoration;break;}
el1 = el1.parentNode;}
while (el2 && Sys.Extended.UI.HTMLEditor.isStyleTag(el2.tagName)) {
if (el2.style.textDecoration.indexOf(cmdl) >= 0) {
cs2 = el2.style.textDecoration;break;}
el2 = el2.parentNode;}
}
var ret = (cs1.indexOf(cssStyle.value) >= 0) && (cs2.indexOf(cssStyle.value) >= 0);if (this._StyleForTyping != null && this._StyleForTyping.length > 0) {
for (var i = 0;i < this._StyleForTyping.length;i++) {
var curCss = this._StyleForTyping[i];if (curCss.name == cssStyle.name && curCss.value == cssStyle.value) {
ret = !ret;break;}
}
}
return ret;} catch (ex) {
return false;}
},
_textAlignState: function(value) {
var obj = this._rangeStartEnd();if (obj == null) return false;try {
var cs1 = this._textAlignStateSingle(obj.start);var cs2 = this._textAlignStateSingle(obj.end);return (cs1 == value && cs2 == value);} catch (ex) {
return false;}
},
_textAlignStateSingle: function(el) {
while (el && Sys.Extended.UI.HTMLEditor.isStyleTag(el.tagName)) {
el = el.parentNode;}
if (el != null) {
var tagName = el.tagName.toUpperCase();if (tagName == "P" || tagName == "DIV") {
return el.style.textAlign.toLowerCase();}
}
return null;},
_rangeStartEnd: function() {
if (this.isControl()) return null;try {
var sel = this._getSelection();var range = this._createRange(sel);var el1 = null;var el2 = null;if (!Sys.Extended.UI.HTMLEditor.isIE) {
function __getText__(par, first) {
var ret = null;while (ret == null) {
if (par.nodeType == 3) {
if (first && range.startContainer != range.endContainer && range.startOffset == par.length && par.nextSibling) {
ret = __getText__(par.nextSibling, first);} else if (!first && range.startContainer != range.endContainer && range.endOffset == 0 && par.previousSibling) {
ret = __getText__(par.previousSibling, first);} else {
ret = par;}
} else {
if ((first ? par.firstChild : par.lastChild) == null) {
ret = null;} else {
ret = __getText__(first ? par.firstChild : par.lastChild, first);}
}
if (ret == null) {
par = first ? par.nextSibling : par.previousSibling;if (par == null) return null;} else {
return ret;}
}
}
var parent = this._getParent(range);if (parent.nodeType != 3 && range.startContainer == range.endContainer &&
range.startOffset == range.endOffset &&
range.startContainer.childNodes.item(range.startOffset).tagName &&
Sys.Extended.UI.HTMLEditor.isStyleTag(range.startContainer.childNodes.item(range.startOffset).tagName)
) {
return { start: range.startContainer.childNodes.item(range.startOffset), end: range.startContainer.childNodes.item(range.startOffset) };}
el1 = __getText__(range.startContainer, true);if (el1 != null && el1.parentNode != null) el1 = el1.parentNode;if (el1 == null) el1 = range.startContainer;el2 = __getText__(range.endContainer, false);if (el2 != null && el2.parentNode != null) el2 = el2.parentNode;if (el2 == null) el2 = range.endContainer;} else {
if (range.text.length == 0) {
el1 = el2 = this._getParent(range);} else {
var rn = Sys.Extended.UI.HTMLEditor.smartClassName + "_right_marker";var ln = Sys.Extended.UI.HTMLEditor.smartClassName + "_left_marker";var r_left = range.duplicate();var r_right = range.duplicate();r_left.setEndPoint("EndToStart", range);r_right.setEndPoint("StartToEnd", range);r_right.pasteHTML("<span id='" + rn + "'/>");r_left.pasteHTML("<span id='" + ln + "'/>");var lPoint = this._doc.getElementById(ln);var rPoint = this._doc.getElementById(rn);el1 = lPoint.parentNode;el2 = rPoint.parentNode;lPoint.parentNode.removeChild(lPoint);rPoint.parentNode.removeChild(rPoint);}
}
return { start: el1, end: el2 };} catch (ex) {
return null;}
},
rtlState: function() {
if (this._doc.body.style.direction && this._doc.body.style.direction == "rtl") return true;return false;},
openWait: function() {
this._editPanel.openWait();},
closeWait: function() {
this._editPanel.closeWait();}
}
Sys.Extended.UI.HTMLEditor.DesignPanel.ScriptRecover = function() {
this.scriptsArray=[];this.scriptsArray_index=-1;this.regReplScript1 = function(p0,p1) {
this.scriptsArray.push(p1);return "";}
this.regReplFromScript = function(p0,p1,p2,p3) {
return p1.replace(/&gt;/g ,">").replace(/&lt;/g ,"<").replace(/&amp;/g ,"&");}
this.regReplFromScript1 = function(p0,p1,p2,p3) {
this.scriptsArray_index++;var mmm;if(!Sys.Extended.UI.HTMLEditor.isIE)
mmm = this.scriptsArray[this.scriptsArray_index].replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,"\"");else
mmm = this.scriptsArray[this.scriptsArray_index];return p1+mmm+p3;}
}
Sys.Extended.UI.HTMLEditor.DesignPanel.registerClass("Sys.Extended.UI.HTMLEditor.DesignPanel",Sys.Extended.UI.HTMLEditor.ModePanel);Sys.Extended.UI.HTMLEditor.DesignPanelEventHandler = function(ev) {
try {
var editor = this;if (editor._editPanel != Sys.Extended.UI.HTMLEditor.LastFocusedEditPanel) {
return true;}
if (Sys.Extended.UI.HTMLEditor.isIE) {
try {
var selka = this._doc.selection;var rrr = this._createRange(selka);} catch (e) {
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
}
if (ev.type == "mousedown" || ev.type == "dblclick") {
this._focus(true);}
if (!Sys.Extended.UI.HTMLEditor.isIE && ev.type == "keydown" && ev.keyCode == Sys.UI.Key.tab && this._editPanel.get_suppressTabInDesignMode()) {
Sys.Extended.UI.HTMLEditor.LastFocusedEditPanel = null;return true;}
if (this.isPopup()) {
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
var contextMenuRemoved = false;if (editor._contextElement && editor._contextElement != null) {
Function.createDelegate(this, Sys.Extended.UI.HTMLEditor.RemoveContextMenu)();if (ev.type == "keydown" || ev.type == "keypress") {
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return;}
contextMenuRemoved = true;}
if (typeof editor.captureInDesign == "function") {
if (editor.captureInDesign(ev) === false) {
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return;}
}
if (Sys.Extended.UI.HTMLEditor.isIE && ev.type == "mousedown" && ev.ctrlKey) {
var sel = editor._getSelection();var savedX = ev.clientX;var savedY = ev.clientY;setTimeout(function() {
var sel = editor._getSelection();if (sel.type.toLowerCase() != "control") {
var range = editor._doc.body.createTextRange();range.moveToPoint(savedX, savedY);range.select();}
sel = editor._getSelection();var range = editor._createRange(sel);var parent = Sys.Extended.UI.HTMLEditor.getSelParent(editor);while (parent != null && parent.tagName.toUpperCase() != "BODY") {
if (parent.tagName.toUpperCase() == "A" && parent.href != null && typeof parent.href != "undefined" && parent.href.length > 0) {
window.open(parent.href, "LinkViewWindow");break;}
parent = parent.parentNode;}
}, 0);Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
var el = (!Sys.Extended.UI.HTMLEditor.isIE) ? ev.target : ev.srcElement;if (el.tagName != null && typeof el.tagName != "undefined" && (el.tagName.toUpperCase() == "HTML" || el.tagName.toUpperCase() == "BODY")) {
if (editor.__kkoka != true) {
editor.__kkoka = true;setTimeout(function() {
if (editor._editPanel == Sys.Extended.UI.HTMLEditor.LastFocusedEditPanel) {
if (!editor.toEndOfProtected()) {
try {
editor.focusEditor();} catch (ex) { }
}
}
editor.__kkoka = false;}, 0);}
}
else {
if (Sys.Extended.UI.HTMLEditor.contentEditable(el) != null) {
setTimeout(function() {
if (editor._editPanel == Sys.Extended.UI.HTMLEditor.LastFocusedEditPanel) {
editor.toEndOfProtected();}
}, 0);}
}
if (contextMenuRemoved && (Sys.Extended.UI.HTMLEditor.isIE)) {
var sss = this._getSelection();var rrr;try {
rrr = this._createRange(sss);if (sss.type.toLowerCase() == "control") {
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
} catch (ex) {
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
}
var keyEvent = (Sys.Extended.UI.HTMLEditor.isIE && ev.type == "keydown") || (ev.type == "keypress");var rere = ev.type + "--" + keyEvent;if (keyEvent && !this._editPanel.get_keyboardEnabled()) {
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
var key = String.fromCharCode(Sys.Extended.UI.HTMLEditor.isIE ? ev.keyCode : ev.charCode).toLowerCase();;if (keyEvent && editor._editPanel.get_hotkeys() != null) {
if (editor._editPanel.get_hotkeys().length > 0) {
var keysn = editor._editPanel.get_hotkeys().length;var cake = key;if (ev.keyCode == 18 || ev.keyCode == 17 || ev.keyCode == 16) {
cake = null;}
for (var i = 0;i < keysn;i++) {
var item = editor._editPanel.get_hotkeys()[i];if (item[1] == cake && item[2] == ev.altKey && item[3] == ev.shiftKey && item[4] == ev.ctrlKey) {
if (typeof item[0] == "function") {
setTimeout(function() {
(item[0])(editor);editor.onContentChanged();editor.focusEditor();}, 0);}
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
}
}
}
if (keyEvent && ev.shiftKey && ev.keyCode == 45) {
this._commonPaste(ev);} else {
if (keyEvent && ev.ctrlKey && ev.altKey && ev.keyCode == Sys.UI.Key.home) {
var prot = null;var el = Sys.Extended.UI.HTMLEditor.getSelParent(editor);while (el && (el.nodeType == 3 || (el.tagName && el.tagName.toUpperCase() != "BODY"))) {
if (el.nodeType == 3 || !el.tagName) {
el = el.parentNode;continue;}
var tagName = el.tagName.toUpperCase();if (!Sys.Extended.UI.HTMLEditor.canBeInsideP(el) && tagName != "P") {
if (tagName == "TD") {
while (tagName != "TABLE") {
el = el.parentNode;tagName = el.tagName.toUpperCase();}
} else {
if (tagName == "LI") {
while (tagName != "OL" && tagName != "UL") {
el = el.parentNode;tagName = el.tagName.toUpperCase();}
}
}
prot = el;break;}
el = el.parentNode;}
if (prot != null) {
var sel = editor._getSelection();var range = editor._createRange(sel);var tempText = editor._doc.createTextNode("");prot.parentNode.insertBefore(tempText, prot);if (Sys.Extended.UI.HTMLEditor.isIE) {
var range1 = editor._createRange(sel);var range2 = editor._createRange(sel);var span1 = editor._doc.createElement("span");var span2 = editor._doc.createElement("span");tempText.parentNode.insertBefore(span1, tempText);if (tempText.nextSibling) {
tempText.parentNode.insertBefore(span2, tempText.nextSibling);} else {
tempText.parentNode.appendChild(span2);}
try {
range1.moveToElementText(span1);range2.moveToElementText(span2);range1.setEndPoint("EndToEnd", range2);range1.select();} catch (e) { }
tempText.parentNode.removeChild(span1);tempText.parentNode.removeChild(span2);} else {
editor._removeAllRanges(sel);range.setStart(tempText, 0);range.setEnd(tempText, 0);editor._selectRange(sel, range);}
}
}
else
if (Sys.Extended.UI.HTMLEditor.isIE && ev.keyCode >= 33 && ev.keyCode <= 40 && !ev.shiftKey) {
var after_pos = (ev.keyCode == Sys.UI.Key.pageDown || ev.keyCode == Sys.UI.Key.end || ev.keyCode == Sys.UI.Key.right || ev.keyCode == Sys.UI.Key.down);setTimeout(function() {
var sel = editor._getSelection();var range = editor._createRange(sel);if (sel.type.toLowerCase() == "control") {
var el = range.item(0);if (!el.contentEditable || el.contentEditable == "false") {
range.remove(0);sel.empty();range = editor._createRange(sel);var span = editor._doc.createElement("SPAN");span.appendChild(editor._doc.createTextNode(""));if (after_pos) {
if (el.nextSibling == null)
el.parentNode.appendChild(span);else
el.parentNode.insertBefore(span, el.nextSibling);} else {
el.parentNode.insertBefore(span, el);}
range.moveToElementText(span);range.select();setTimeout(function() {
editor.focusEditor();span.parentNode.removeChild(span);}, 0);}
}
}, 0);}
else
if (((keyEvent && !Sys.Extended.UI.HTMLEditor.isSafari) || (Sys.Extended.UI.HTMLEditor.isSafari && ev.type == "keydown")) && ev.ctrlKey && !ev.altKey) {
editor._a_prize = false;var sel = null;var range = null;var key = String.fromCharCode((Sys.Extended.UI.HTMLEditor.isIE || Sys.Extended.UI.HTMLEditor.isOpera || Sys.Extended.UI.HTMLEditor.isSafari) ? ev.keyCode : ev.charCode).toLowerCase();var cmd = null;var value = null;if ((Sys.Extended.UI.HTMLEditor.isIE || Sys.Extended.UI.HTMLEditor.isSafari) && ev.keyCode == 17) { 
return false;}
else
if (!Sys.Extended.UI.HTMLEditor.isIE && ev.keyCode == Sys.UI.Key.end && !ev.shiftKey) {
editor._setToEnd();}
else
if (ev.keyCode == 46 && this.isShadowed()) {
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
else
if (ev.keyCode == 46 || ev.keyCode == Sys.UI.Key.backspace) {
if ((Sys.Extended.UI.HTMLEditor.isIE && ev.type == "keydown") || (!Sys.Extended.UI.HTMLEditor.isIE && ev.type == "keypress"))
this._saveContent();}
else {
switch (key) {
case "a":
if (!Sys.Extended.UI.HTMLEditor.isIE) {
sel = this._getSelection();this._removeAllRanges(sel);range = this._createRange();range.selectNodeContents(this._doc.body);this._selectRange(sel, range);Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;} else {
editor._a_prize = true;}
break;case "z":
this.undo();Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;break;case "p":
if (!Sys.Extended.UI.HTMLEditor.isIE) {
setTimeout(function() {
editor._contextMenuCallP();}, 0);Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
break;case "y":
this.redo();Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;break;case "x":
if (this.isShadowed()) {
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
this._saveContent();if (Sys.Extended.UI.HTMLEditor.isIE) {
if (ev.type == "keydown") {
editor.openWait();setTimeout(function() {
editor._copyCut(key, false);editor.closeWait();}, 0);Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
}
break;case "c":
if (this.isShadowed()) {
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
if (Sys.Extended.UI.HTMLEditor.isIE) {
if (ev.type == "keydown") {
editor.openWait();setTimeout(function() {
editor._copyCut(key, false);editor.closeWait();setTimeout(function() {
editor._ifShadow();}, 0);}, 0);Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
}
break;case "v":
if (this.isShadowed()) {
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
if (Sys.Extended.UI.HTMLEditor.isIE) {
this._saveContent();return true;}
this._commonPaste(ev);break;case "b": 
this._execCommand("bold", false, value);Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;case "i": 
this._execCommand("italic", false, value);Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;case "u": 
this._execCommand("underline", false, value);Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;case "s": 
this._execCommand("strikethrough", false, value);Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;case "l": 
cmd = "justifyleft";break;case "e": 
cmd = "justifycenter";break;case "r": 
cmd = "justifyright";break;case "j": 
cmd = "justifyfull";break;case "q": 
alert(this._doc.body.innerHTML);Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;break;case "0": 
var str1 = "Your browser:\n\n" + navigator.userAgent;alert(str1);Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;break;case "9":
if (!Sys.Extended.UI.HTMLEditor.isIE) {
var sel = editor._getSelection();var range = editor._createRange(sel);var p1 = range.startContainer;var p2 = range.endContainer;var Str = "";Str += "startContainer: " + (p1.nodeType == 1 ? p1.tagName : "text") + "\n";Str += "endContainer  : " + (p2.nodeType == 1 ? p2.tagName : "text") + "\n";if (p1 == p2) {
Str += "startOffset: " + range.startOffset + "\n";Str += "endOffset  : " + range.endOffset + "\n";if (p1.nodeType == 1) {
p1 = p1.childNodes.item(range.startOffset);if (p1 && p1.nodeType) {
Str += "startOffset node: " + (p1.nodeType == 1 ? p1.tagName : "text") + "\n";if (range.startOffset != range.endOffset) {
p1 = p1.childNodes.item(range.endOffset);if (p1 && p1.nodeType) {
Str += "endOffset node: " + (p1.nodeType == 1 ? p1.tagName : "text") + "\n";}
}
} else {
Str += p1;}
}
}
alert(Str);} else {
var sel = editor._getSelection();var range = editor._createRange(sel);alert("boundingLeft: " + range.boundingLeft + " boundingTop: " + range.boundingTop + "\n" + "boundingWidth: " + range.boundingWidth + " boundingHeight: " + range.boundingHeight);}
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;break;}
}
if (cmd) {
this._execCommand(cmd, false, value);if (cmd == "formatblock" && !Sys.Extended.UI.HTMLEditor.isIE) {
this._saveContent();this._undo(false);}
Sys.Extended.UI.HTMLEditor._stopEvent(ev);if (cmd == "delete" || cmd == "paste") {
this._clearP();}
}
}
else
if (keyEvent || (Sys.Extended.UI.HTMLEditor.isSafari && ev.type == "keydown")) {
if (Sys.Extended.UI.HTMLEditor.isIE && this._tryForward) {
var range = this._createRange(this._getSelection());range.select();this._tryForward = false;}
var key = String.fromCharCode(Sys.Extended.UI.HTMLEditor.isIE ? ev.keyCode : ev.charCode).toLowerCase();if (editor._a_prize) {
editor._a_prize = false;function test_a() {
var r = editor._createRange(editor._getSelection());var parent = r.parentElement();if (parent && parent.nodeType == 1 && parent.tagName.toUpperCase() == "P") {
while (parent.firstChild) {
parent.parentNode.insertBefore(parent.firstChild, parent);}
parent.parentNode.removeChild(parent);}
}
setTimeout(test_a, 0);}
if (this.isShadowed()) {
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
switch (ev.keyCode) {
case Sys.UI.Key.tab:
if (Sys.Extended.UI.HTMLEditor.isSafari && ev.type != "keydown") break;if (!this._editPanel.get_suppressTabInDesignMode()) {
if (!this.isControl())
this.insertHTML("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");Sys.Extended.UI.HTMLEditor._stopEvent(ev);}
else {
if (Sys.Extended.UI.HTMLEditor.isSafari) {
Sys.Extended.UI.HTMLEditor._stopEvent(ev);}
Sys.Extended.UI.HTMLEditor.LastFocusedEditPanel = null;return true;}
break;case 46: case Sys.UI.Key.backspace:
if (Sys.Extended.UI.HTMLEditor.isSafari && ev.type != "keydown") break;if (((Sys.Extended.UI.HTMLEditor.isIE || Sys.Extended.UI.HTMLEditor.isSafari) && ev.type == "keydown") || (!Sys.Extended.UI.HTMLEditor.isIE && ev.type == "keypress")) {
this._saveContent();}
if (!Sys.Extended.UI.HTMLEditor.isIE) {
var range = this._createRange(this._getSelection());var p1 = range.startContainer;var p2 = range.endContainer;if (ev.type == "keypress") {
if (Sys.Extended.UI.HTMLEditor.contentEditable(p1) != null || Sys.Extended.UI.HTMLEditor.contentEditable(p2) != null) {
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
}
if (p1 == p2 && p1.nodeType == 1 && p1.tagName.toUpperCase() == "TD" && range.startOffset == range.startOffset && p1.childNodes.item(range.startOffset) && p1.childNodes.item(range.startOffset).tagName && p1.childNodes.item(range.startOffset).tagName.toUpperCase() == "BR") {
var span = p1.childNodes.item(range.startOffset);var left = 0, right = 0;var nb;nb = span.previousSibling;while (nb) {
left++;nb = nb.previousSibling;}
nb = span.nextSibling;while (nb) {
right++;nb = nb.nextSibling;}
if ((ev.keyCode == 46 && right == 0) || (ev.keyCode == Sys.UI.Key.backspace && left == 0)) {
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;} else {
if (ev.keyCode == 46 && p1.firstChild == p1.lastChild && p1.firstChild.nodeType == 1) {
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
}
}
if (p1 == p2 && p1.nodeType == 3 && range.startOffset == range.endOffset) {
var data = p1.data + "";if (ev.keyCode == 46) {
if (range.startOffset == data.length && !(p1.nextSibling && p1.nextSibling.nodeType == 3)) {
if (p1.nextSibling) {
p1.parentNode.removeChild(p1.nextSibling);editor.onContentChanged();}
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
}
if (ev.keyCode == Sys.UI.Key.backspace) {
if (range.startOffset == 0 && !(p1.previousSibling && p1.previousSibling.nodeType == 3)) {
if (p1.previousSibling) {
p1.parentNode.removeChild(p1.previousSibling);editor.onContentChanged();}
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
}
}
if (ev.keyCode == Sys.UI.Key.backspace && p1.nodeType == 1 && p1 == p2 && range.startOffset == range.endOffset) {
var mel = p1.childNodes.item(range.startOffset);if (mel != null && mel.nodeType == 1 && mel.tagName.toUpperCase() == "BR") {
mel = mel.previousSibling;if (mel != null && mel.nodeType != 3) {
mel.parentNode.removeChild(mel);editor.onContentChanged();Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
}
}
setTimeout(function() {
var sel = editor._getSelection();var range = editor._createRange(sel);var p1 = range.startContainer;var p2 = range.endContainer;if (Sys.Extended.UI.HTMLEditor.contentEditable(p1) != null || Sys.Extended.UI.HTMLEditor.contentEditable(p2) != null) {
editor._undo(false);return;}
if (p1 == p2 && p1.nodeType == 1 && Sys.Extended.UI.HTMLEditor.isStyleTag(p1.tagName) && range.startOffset == range.endOffset && p1.childNodes.length == 0) {
while (p1.parentNode.nodeType == 1 && Sys.Extended.UI.HTMLEditor.isStyleTag(p1.parentNode.tagName) && p1.parentNode.childNodes.length == 1) {
p1 = p1.parentNode;}
var next = p1.nextSibling;var prev = p1.previousSibling;var parent = p1.parentNode;parent.removeChild(p1);editor.onContentChanged();if (next == null && prev == null) {
range.setStart(parent, 0);range.setEnd(parent, 0);}
else
if (next != null && prev != null) {
if (next.nodeType == 3 && prev.nodeType == 3) {
var l = ("" + prev.data + "").length;prev.appendData(next.data);parent.removeChild(next);range.setStart(prev, l);range.setEnd(prev, l);} else {
if (prev.nodeType == 3) {
var l = ("" + prev.data + "").length;range.setStart(prev, l);range.setEnd(prev, l);} else {
if (next.nodeType == 3) {
range.setStart(next, 0);range.setEnd(next, 0);} else {
if (next.childNodes.length > 0) {
range.setStart(next, 0);range.setEnd(next, 0);} else {
var l = Sys.Extended.UI.HTMLEditor.__getIndex(next);range.setStart(parent, l);range.setEnd(parent, l);}
}
}
}
} else {
if (prev != null) {
if (prev.nodeType == 3) {
var l = ("" + prev.data + "").length;range.setStart(prev, l);range.setEnd(prev, l);} else {
var l = prev.childNodes.length;if (l > 0) {
range.setStart(prev, l);range.setEnd(prev, l);} else {
l = Sys.Extended.UI.HTMLEditor.__getIndex(prev);range.setStart(parent, l);range.setEnd(parent, l);}
}
} else {
if (next != null) {
if (next.nodeType == 3) {
range.setStart(next, 0);range.setEnd(next, 0);} else {
var l = next.childNodes.length;if (l > 0) {
range.setStart(next, l);range.setEnd(next, l);} else {
l = Sys.Extended.UI.HTMLEditor.__getIndex(next);range.setStart(parent, l);range.setEnd(parent, l);}
}
}
}
}
editor._removeAllRanges(sel);editor._selectRange(sel, range);}
}, 0);}
else { 
var sel = editor._getSelection();if (sel.type.toLowerCase() == "control") {
if (ev.keyCode == 8) {
setTimeout(function() {
editor._ifShadow();editor.onContentChanged();}, 0);Sys.Extended.UI.HTMLEditor._stopEvent(ev);return;}
var r = editor._createRange(sel);var eln = r.item(0);if (eln.tagName.toUpperCase() == "EMBED") {
eln.src = "";eln.parentNode.removeChild(eln);while (r.length > 0) {
r.remove(0);}
try {
r.collapse(false);} catch (e) { }
Sys.Extended.UI.HTMLEditor._stopEvent(ev);editor._saveContent();setTimeout(function() {
editor._undo(false);editor.onContentChanged();}, 0);return;}
}
var tempCollectionLength = editor._doc.body.getElementsByTagName("EMBED").length;if (tempCollectionLength > 0) {
var popup = editor._body.ownerDocument.createElement("div");editor._body.appendChild(popup);var evKeyCode = ev.keyCode;setTimeout(function() {
editor._body.removeChild(popup);var tempCollectionNew = editor._doc.body.getElementsByTagName("EMBED");if (tempCollectionLength != tempCollectionNew.length) {
editor._saveContent();setTimeout(function() {
editor._undo(false);editor.onContentChanged();}, 0);}
}, 0);}
setTimeout(function() {
editor._clearP();}, 0);}
break;case Sys.UI.Key.enter:
if (Sys.Extended.UI.HTMLEditor.isSafari && ev.type == "keydown") break;if ((!Sys.Extended.UI.HTMLEditor.isIE && ev.type == "keypress") || (Sys.Extended.UI.HTMLEditor.isIE && ev.type == "keydown")) {
this._saveContent();}
if (Sys.Extended.UI.HTMLEditor.isIE && ev.type == "keydown") {
var sel = editor._getSelection();if (sel.type.toLowerCase() == "control")
break;var r = editor._createRange(sel);if (!ev.shiftKey) {
var prnt = r.parentElement();if (prnt.tagName.toUpperCase() == "TEXTAREA") {
break;}
while (prnt && prnt.tagName && prnt.tagName.toUpperCase() != "BODY" && Sys.Extended.UI.HTMLEditor.isStyleTag(prnt.tagName)) {
prnt = prnt.parentNode;}
if (prnt && prnt.tagName) {
var tagName = prnt.tagName.toUpperCase();if (tagName == "P" || tagName == "LI") {
if (tagName == "LI") {
function test() {
r = editor._createRange(editor._getSelection());var parent = r.parentElement();while (parent && parent.tagName && parent.tagName.toUpperCase() != "BODY" && Sys.Extended.UI.HTMLEditor.isStyleTag(parent.tagName)) {
parent = parent.parentNode;}
if (parent && parent.nodeType == 1 && parent.tagName.toUpperCase() == "P") {
var span1 = editor._doc.createElement("span");var tempText = editor._doc.createTextNode(" ");var inner = parent;while (inner.firstChild != null && inner.firstChild.nodeType == 1) {
inner = inner.firstChild;}
if (inner.nodeType == 1) {
inner.appendChild(tempText);inner.appendChild(span1);while (parent.firstChild) {
parent.parentNode.insertBefore(parent.firstChild, parent);}
} else {
parent.parentNode.insertBefore(tempText, parent);parent.parentNode.insertBefore(span1, parent);}
parent.parentNode.removeChild(parent);r.moveToElementText(span1);r.select();span1.parentNode.removeChild(span1);editor.onContentChanged();}
}
setTimeout(test, 0);}
break;}
}
try {
var mn = Sys.Extended.UI.HTMLEditor.smartClassName + "_middle_add";var mn_element = null;var mn_span_text = "<span id=" + mn + "></span>";function testNextBlockElement() {
var sel = editor._getSelection();var range = editor._createRange(sel);if (mn_element != null) {
mn_element.innerHTML = "&nbsp;";range.moveToElementText(mn_element);range.select();mn_element.parentNode.insertBefore(mn_element.firstChild, mn_element);mn_element.parentNode.removeChild(mn_element);editor.onContentChanged();}
}
r.pasteHTML(mn_span_text);var needTest = false;mn_element = editor._doc.getElementById(mn);if (mn_element != null) {
var nextSibling = mn_element.nextSibling;var curPar = mn_element.parentNode;while (nextSibling == null && curPar != null && Sys.Extended.UI.HTMLEditor.isStyleTag(curPar.tagName)) {
nextSibling = curPar.nextSibling;curPar = curPar.parentNode;}
if (nextSibling != null && !Sys.Extended.UI.HTMLEditor.isInlineElement(nextSibling) && nextSibling.tagName != null && typeof nextSibling.tagName != "undefined") {
var tag = nextSibling.tagName.toUpperCase();if (tag != "BR" && tag != "UL" && tag != "OL" && tag != "P") {
needTest = true;}
}
mn_element.parentNode.removeChild(mn_element);}
r.pasteHTML("<br/>" + (needTest ? mn_span_text : ""));if (needTest) {
mn_element = editor._doc.getElementById(mn);}
r.select();if (needTest) {
setTimeout(testNextBlockElement, 0);Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
} catch (ex) { }
} else {
break;}
Sys.Extended.UI.HTMLEditor._stopEvent(ev);} else {
if (!ev.shiftKey && (Sys.Extended.UI.HTMLEditor.isSafari || Sys.Extended.UI.HTMLEditor.isOpera)) {
var prnt = Sys.Extended.UI.HTMLEditor.getSelParent(this);if (prnt.nodeType == 3) {
prnt = prnt.parentNode;}
while (prnt && prnt.tagName && prnt.tagName.toUpperCase() != "BODY" && Sys.Extended.UI.HTMLEditor.isStyleTag(prnt.tagName)) {
prnt = prnt.parentNode;}
if (prnt && prnt.tagName && (prnt.tagName.toUpperCase() == "P" || prnt.tagName.toUpperCase() == "LI")) {
break;}
this.insertHTML("<br/>");Sys.Extended.UI.HTMLEditor._stopEvent(ev);editor.onContentChanged();} else if (Sys.Extended.UI.HTMLEditor.isSafari) {
this.insertHTML("<br/>");Sys.Extended.UI.HTMLEditor._stopEvent(ev);editor.onContentChanged();}
}
break;}
}
else {
editor._a_prize = false;}
}
if (Sys.Extended.UI.HTMLEditor.isIE && ev.type == "keypress" && !ev.ctrlKey) {
var key = ev.keyCode;var selT = editor._getSelection();var rangeT = editor._createRange(selT);if (rangeT.text.length > 0) {
var chr = String.fromCharCode(key);var caps = Sys.Extended.UI.HTMLEditor.capLock(ev);var upper = (ev.shiftKey && !caps) || caps;if (!upper) {
chr = chr.toLowerCase();}
var tid = Sys.Extended.UI.HTMLEditor.smartClassName + "StyleForTyping";var elT = editor._doc.getElementById(tid);if (elT != null) {
chr = "<span id='" + tid + "'></span>" + chr + "<span id='" + tid + tid + "'></span>";elT.parentNode.removeChild(elT);}
rangeT.pasteHTML(chr);if (elT != null) {
editor.trickWithStyles(tid);elT = editor._doc.getElementById(tid + tid);elT.parentNode.removeChild(elT);}
Sys.Extended.UI.HTMLEditor._stopEvent(ev);editor.onContentChanged();return false;}
}
if (ev.type == "mouseup" || ev.type == "mousedown" || ev.type == "keydown") {
var need_update = true;if (ev.type == "keydown" && !ev.ctrlKey) {
var key = ev.keyCode;if ((key >= 0x30 && key <= 0x5a) || (key == 0x20) || (key == 0x0d) || (key >= 0xba && key <= 0xde) || (key >= 0x60 && key <= 0x6f)) {
if (editor._StyleForTyping != null) {
editor.n_arr = [];for (var im = 0;im < editor._StyleForTyping.length;im++) {
editor.n_arr.push(editor._StyleForTyping[im]);}
var tid = Sys.Extended.UI.HTMLEditor.smartClassName + "StyleForTyping";var needItNow = true;if (!Sys.Extended.UI.HTMLEditor.isIE) {
editor.insertHTML("<span id='" + tid + "'></span>");} else {
editor.insertHTML("<span id='" + tid + "'>&nbsp;</span>");var elT = editor._doc.getElementById(tid);if (elT && elT.nextSibling && elT.nextSibling.nodeType == 3) {
needItNow = false;var selT = editor._getSelection();var rangeT = editor._createRange(selT);rangeT.moveToElementText(editor._doc.getElementById(tid));rangeT.select();} else {
if (elT) {
elT.removeChild(elT.firstChild);}
}
}
if (needItNow) {
setTimeout(function() {
editor.trickWithStyles(tid);editor.onContentChanged();}, 0);}
}
}
}
if (need_update || !Sys.Extended.UI.HTMLEditor.isIE) {
if (!editor._updated_now) {
if (editor._updateTimer) {
clearTimeout(editor._updateTimer);editor._updateTimer = null;}
editor._updateTimerLimit = 3;function xyz() {
if (editor._editPanel == Sys.Extended.UI.HTMLEditor.LastFocusedEditPanel) {
try {
if (Sys.Extended.UI.HTMLEditor.isIE) {
try {
var selka = editor._doc.selection;} catch (e) {
return false;}
if (editor._getSelection().type == "None" && editor._doc.queryCommandValue("backcolor") == 0 && editor._doc.queryCommandValue("forecolor") == 0) {
editor._updateTimerLimit--;if (editor._updateTimerLimit > 0) {
editor._updateTimer = setTimeout(xyz, 100);return;}
}
}
editor._updated_now = true;editor._editPanel.updateToolbar();editor._updated_now = false;editor._updateTimer = null;if (!Sys.Extended.UI.HTMLEditor.isIE) {
editor.focusEditor();}
} catch (e) { }
}
}
editor._updateTimer = setTimeout(xyz, 300);}
}
}
if (!((!Sys.Extended.UI.HTMLEditor.isIE && (ev.type == "keydown" || ev.type == "keyup")) || (Sys.Extended.UI.HTMLEditor.isIE && (ev.type == "keydown" || ev.type == "keyup") && (ev.keyCode == 16 || ev.keyCode == 20)))) {
editor._StyleForTyping = null;}
if (Sys.Extended.UI.HTMLEditor.isSafari) {
setTimeout(function() {
editor._createRange(editor._getSelection());}, 0);}
if (!Sys.Extended.UI.HTMLEditor.isIE) {
setTimeout(function() {
if (editor._editPanel == Sys.Extended.UI.HTMLEditor.LastFocusedEditPanel) {
var sel = editor._getSelection();var range = editor._createRange(sel);if (range.startContainer.nodeType != 3 && range.startContainer == range.endContainer)
if (range.startOffset == range.endOffset)
if (range.startContainer.childNodes.item(range.startOffset))
if (range.startContainer.childNodes.item(range.startOffset).nodeType == 3) {
var container = range.startContainer.childNodes.item(range.startOffset);sel.collapseToEnd();editor._removeAllRanges(sel);sel = editor._getSelection();range = editor._createRange(sel);range.setStart(container, 0);range.setEnd(container, 0);editor._selectRange(sel, range);}
}
}, 0);}
if (!Sys.Extended.UI.HTMLEditor.isIE) {
var sel = editor._getSelection();var range = editor._createRange(sel);editor._saved_startContainer = range.startContainer;editor._saved_startOffset = range.startOffset;}
setTimeout(function() {
try {
if (editor._editPanel == Sys.Extended.UI.HTMLEditor.LastFocusedEditPanel) {
editor._ifShadow();}
} catch (e) { }
}, 0);if (ev.type == "keydown") {
if (editor._AfterOnContentChanged == null || typeof editor._AfterOnContentChanged == "undefined" || !editor._AfterOnContentChanged) {
editor._AfterOnContentChanged = true;setTimeout(function() {
if (editor._editPanel == Sys.Extended.UI.HTMLEditor.LastFocusedEditPanel) {
editor.onContentChanged();editor._AfterOnContentChanged = false;}
}, 0);}
}
return true;} catch (ex) {
Sys.Extended.UI.HTMLEditor._stopEvent(ev);return false;}
};Sys.Extended.UI.HTMLEditor.ActiveModeType = function() { }
Sys.Extended.UI.HTMLEditor.ActiveModeType.prototype = {
Design : 0x00,
Html : 0x01,
Preview: 0x02
}
Sys.Extended.UI.HTMLEditor.ActiveModeType_checkValue = function(value) {
if(value >= 0 && value <= 2) return true;return false;}
Sys.Extended.UI.HTMLEditor.ActiveModeType.registerEnum("Sys.Extended.UI.HTMLEditor.ActiveModeType", true);Sys.Extended.UI.HTMLEditor.ActiveModeChangedArgs = function(oldMode, newMode, editPanel) 
{ 
if (arguments.length != 3) throw Error.parameterCount();Sys.Extended.UI.HTMLEditor.ActiveModeChangedArgs.initializeBase(this);this._oldMode = oldMode;this._newMode = newMode;this._editPanel = editPanel;} 
Sys.Extended.UI.HTMLEditor.ActiveModeChangedArgs.prototype = 
{ 
get_oldMode : function() 
{ 
return this._oldMode;}, 
get_newMode : function() 
{ 
return this._newMode;},
get_editPanel : function() 
{ 
return this._editPanel;} 
} 
Sys.Extended.UI.HTMLEditor.ActiveModeChangedArgs.registerClass('Sys.Extended.UI.HTMLEditor.ActiveModeChangedArgs', Sys.EventArgs);Sys.Extended.UI.HTMLEditor.MSIE_list = function(listTg) {
var paragraphs = this.get_paragraphs();var pars = this.getSelectionAfterOperation(paragraphs);var currentParent = null;var collectedParagraphs = [];var editor = this;var commonList = null;var commonListItems = [];var listTag = listTg.toUpperCase();var needJoiner = false;function operateList() {
if(commonList != null) {
var newList;newList = commonList.cloneNode(false);commonList.parentNode.insertBefore(newList,commonList);while(commonList.firstChild != commonListItems[0]) newList.appendChild(commonList.firstChild);if(newList.firstChild==null) newList.parentNode.removeChild(newList);if(commonList.tagName.toUpperCase() == listTag) {
for(var i=0;i < commonListItems.length;i++) {
var element = commonListItems[i];if(element.nodeType==1 && element.tagName && element.tagName.toUpperCase()=="LI") {
var good = false;commonList.parentNode.insertBefore(element,commonList);if(element.style.textAlign=="") element.style.textAlign = commonList.style.textAlign;if(commonList.childNodes.length==0 && i == commonListItems.length-1) {
commonList.parentNode.removeChild(commonList);commonList = null;}
if(element.style.textAlign=="" || (element.style.textAlign.toLowerCase()=="left" && !editor.rtlState()) || (element.style.textAlign.toLowerCase()=="right" && editor.rtlState())) {
good = editor.tryUnWrap(element,pars);if(good) needJoiner=true;}
if(!good) {
var newP = editor._doc.createElement(editor.dfltBlockElement);var attrs = element.attributes;for (var ik = 0;ik < attrs.length;++ik) {
var a = attrs.item(ik);if (!a.specified) continue;if (a.name.toLowerCase()=="style") continue;newP.setAttribute(a.name,a.value);}
newP.style.cssText = element.style.cssText;if(newP.tagName.toUpperCase()=="P") newP.style.margin = "0px";while(element.firstChild) newP.appendChild(element.firstChild);element.parentNode.insertBefore(newP,element);element.parentNode.removeChild(element);}
}
else
commonList.parentNode.insertBefore(element,commonList);}
} else {
var newList = editor._doc.createElement(listTag);var attrs = commonList.attributes;for (var ik = 0;ik < attrs.length;++ik) {
var a = attrs.item(ik);if (!a.specified) continue;if (a.name.toLowerCase()=="style") continue;newList.setAttribute(a.name,a.value);}
newList.style.cssText = commonList.style.cssText;commonList.parentNode.insertBefore(newList,commonList);for(var i=0;i < commonListItems.length;i++) {
var element = commonListItems[i];newList.appendChild(element);}
}
if(commonList != null) {
newList = commonList.cloneNode(false);commonList.parentNode.insertBefore(newList,commonList);while(commonList.firstChild) newList.appendChild(commonList.firstChild);if(newList.firstChild==null) newList.parentNode.removeChild(newList);commonList.parentNode.removeChild(commonList);}
}
commonList = null;commonListItems = [];}
function operateCollectedParagraphs() {
var firstChild = currentParent.firstChild;var lastChild = currentParent.lastChild;var parTagName = currentParent.tagName.toUpperCase();if( 
!Sys.Extended.UI.HTMLEditor.isInlineElement(currentParent) &&
collectedParagraphs[0][0] == firstChild &&
collectedParagraphs[collectedParagraphs.length-1][collectedParagraphs[collectedParagraphs.length-1].length-1] == lastChild &&
(parTagName=="OL" || parTagName=="UL" || parTagName=="DL" || parTagName=="LI" || 
((parTagName=="P" || parTagName=="DIV" || Sys.Extended.UI.HTMLEditor.isHeader(currentParent)) && parTagName=="LI")
)
) {
operateList();commonListItems = [];if (parTagName == "LI") {
commonList = currentParent.parentNode;commonListItems.push(currentParent);}
else if(parTagName=="P" || parTagName=="DIV" || Sys.Extended.UI.HTMLEditor.isHeader(currentParent)) {
commonList = currentParent.parentNode.parentNode;commonListItems.push(currentParent.parentNode);} else {
commonList = currentParent;for(var i=0;i < collectedParagraphs.length;i++) {
var paragraph = collectedParagraphs[i];for(var j=0;j < paragraph.length;j++) {
commonListItems.push(paragraph[j]);}
}
}
operateList();} else {
if(parTagName=="LI" && (collectedParagraphs.length < paragraphs.length)) {
if(commonList != currentParent.parentNode) {
operateList();commonList = currentParent.parentNode;commonListItems = [];}
commonListItems.push(currentParent);} else if(parTagName=="OL" || parTagName=="UL" || parTagName=="DL") {
operateList();commonList = currentParent;commonListItems = [];for(var i=0;i < collectedParagraphs.length;i++) {
var paragraph = collectedParagraphs[i];for(var j=0;j < paragraph.length;j++) {
commonListItems.push(paragraph[j]);}
}
operateList();} else {
var li = null;var list = null;function completeLi() {
if(li != null)
if(li.childNodes==1 && (li.firstChild==pars[0] || li.firstChild==pars[1])) {
li.parentNode.insertBefore(li.firstChild, li);li.parentNode.removeChild(li);}
li = null;}
if(commonList != null) {
operateList();}
var colTagName = "";if (collectedParagraphs.length==1 && collectedParagraphs[0].length==1 && collectedParagraphs[0][0].nodeType==1 && collectedParagraphs[0][0].tagName) {
colTagName = collectedParagraphs[0][0].tagName.toUpperCase();}
if (colTagName=="OL" || colTagName=="UL" || colTagName=="DL") {
var element = collectedParagraphs[0][0];commonList = element;commonListItems = [];for(var i=0;i < element.childNodes.length;i++) {
var el = element.childNodes.item(i);commonListItems.push(el);}
operateList();} else {
for(var i=0;i < collectedParagraphs.length;i++) {
var paragraph = collectedParagraphs[i];for(var j=0;j < paragraph.length;j++) {
var element = paragraph[j];var elTagName = (element.tagName)?element.tagName.toUpperCase():"";if(list == null) {
list = editor._doc.createElement(listTag);element.parentNode.insertBefore(list,element);}
if(!Sys.Extended.UI.HTMLEditor.isInlineElement(element) && elTagName != "BR") {
if(li && li.firstChild) completeLi();if(li == null) {
li = editor._doc.createElement("LI");list.appendChild(li);}
li.appendChild(element);completeLi();} else {
if (li == null) {
li = editor._doc.createElement("LI");list.appendChild(li);}
var actualLength = (paragraph[paragraph.length-1]==pars[1])?paragraph.length-1:paragraph.length;var actualStart = (paragraph[0]==pars[0])?1:0;if(elTagName == "BR" && j == actualLength-1 && j==actualStart) {
if(Sys.Extended.UI.HTMLEditor.isIE) {
li.appendChild(editor._doc.createTextNode(String.fromCharCode(160)));element.parentNode.removeChild(element);}
else
li.appendChild(element);} else
if(elTagName == "BR" && j == actualLength-1 && j>actualStart)
element.parentNode.removeChild(element);else
li.appendChild(element);if(elTagName == "BR" && j == paragraph.length-1) {
completeLi();li = null;}
if(element == pars[1] && j == paragraph.length-1) {
completeLi();li = null;}
}
}
if(li && li.firstChild) completeLi();}
}
if(list != null) {
var aligns = [];for(var j=0;j < list.childNodes.length;j++) aligns.push(list.childNodes.item(j).style.textAlign);var jj=1;for(;jj < aligns.length;jj++)
if(aligns[jj-1] != aligns[jj]) break;if(jj==aligns.length) {
var align = ((aligns[0]=="left" && !editor.rtlState()) || (aligns[0]=="right" && editor.rtlState()))?"":aligns[0];for(var j=0;j < list.childNodes.length;j++) list.childNodes.item(j).style.textAlign = "";list.style.textAlign = align;}
}
if(list != null)
if(list.parentNode.tagName.toUpperCase() == "P" && list.parentNode.childNodes.length == 1) {
var pp = list.parentNode;var clone = pp.cloneNode(false);pp.parentNode.insertBefore(list,pp);pp.parentNode.removeChild(pp);if(list.childNodes.length==1) {
var item = list.firstChild;while(item.firstChild) clone.appendChild(item.firstChild);item.appendChild(clone);} else
delete clone;}
}
}
}
for(var i=0;i < paragraphs.length;i++) {
var paragraph = paragraphs[i];if(paragraph.length > 0) {
if(paragraph[0].parentNode != currentParent) { 
if(collectedParagraphs.length > 0)
operateCollectedParagraphs();collectedParagraphs = [];currentParent = paragraph[0].parentNode;}
collectedParagraphs.push(paragraph);}
}
if(collectedParagraphs.length > 0)
operateCollectedParagraphs();if(commonList != null) {
operateList();}
this.setSelectionAfterOperation(pars, needJoiner);};Sys.Extended.UI.HTMLEditor.MSIE_justify = function(textAlign, addParameter, addParameter1) {
var paragraphs = this.get_paragraphs();var pars = this.getSelectionAfterOperation(paragraphs);var currentParent = null;var collectedParagraphs = [];var editor = this;var force = (typeof addParameter != "undefined" && addParameter )?true:false;var remainP = (typeof addParameter1 == "string")?true:false;var pTag = (typeof addParameter1 == "string")?addParameter1:"";var needJoiner = false;function completeDiv(div){
if(div != null)
if(div.childNodes==1 && (div.firstChild==pars[0] || div.firstChild==pars[1])) {
div.parentNode.insertBefore(div.firstChild, div);div.parentNode.removeChild(div);}
}
function operateCollectedParagraphs()
{
var firstChild = currentParent.firstChild;var lastChild = currentParent.lastChild;var single = false;var curTagName;if( currentParent.tagName && !Sys.Extended.UI.HTMLEditor.isInlineElement(currentParent) &&
collectedParagraphs[0][0] == firstChild &&
collectedParagraphs[collectedParagraphs.length-1][collectedParagraphs[collectedParagraphs.length-1].length-1] == lastChild
) {
curTagName = currentParent.tagName.toUpperCase();if (curTagName != "TD" && curTagName != "TH" && curTagName != "FIELDSET" && curTagName != "LEGEND") {
single = true;}
}
if(single) { 
var align = "";if(currentParent.getAttribute("align") && currentParent.getAttribute("align").length > 0)
align = currentParent.getAttribute("align");if(currentParent.align && currentParent.align.length > 0)
align = currentParent.align;if(currentParent.style.textAlign && currentParent.style.textAlign.length > 0)
align = currentParent.style.textAlign;currentParent.align = "";currentParent.setAttribute("align", "");currentParent.removeAttribute("align");if((curTagName == "DIV" || curTagName == "P" || Sys.Extended.UI.HTMLEditor.isHeader(currentParent)) && textAlign == "left" && force ) {
if(editor.tryUnWrap(currentParent,pars,force)) needJoiner=true;} else {
if(textAlign != "remain") {
if(!(textAlign == "left" && force) || (curTagName=="LI" && currentParent.parentNode.style.textAlign.length>0 ))
currentParent.style.textAlign = textAlign;else
currentParent.style.textAlign = "";}
if(force) currentParent.style.margin = (curTagName=="P")?"0px":"";if(curTagName=="LI") {
var list = currentParent.parentNode;var aligns = [];for(var jn=0;jn < list.childNodes.length;jn++)
if(list.childNodes.item(jn).nodeType==1)
aligns.push(list.childNodes.item(jn).style.textAlign);var jj=1;for(;jj < aligns.length;jj++)
if(aligns[jj-1] != aligns[jj]) break;if(jj==aligns.length) {
var align = (aligns[0]=="left" && force)?"":aligns[0];for(var j=0;j < list.childNodes.length;j++)
if(list.childNodes.item(j).nodeType==1) {
list.childNodes.item(j).style.textAlign = "";if(force) list.childNodes.item(j).style.margin = (list.childNodes.item(j).tagName.toUpperCase()=="P")?"0px":"";}
list.style.textAlign = align;}
}
if((curTagName == "DIV" || curTagName == "P" || Sys.Extended.UI.HTMLEditor.isHeader(currentParent))
&& remainP && pTag.toUpperCase() != curTagName) {
var nEl = editor._doc.createElement(pTag);var attrs = currentParent.attributes;for (var k = 0;k < attrs.length;++k) {
var a = attrs.item(k);if (!a.specified) continue;if (a.name.toLowerCase()=="style") continue;nEl.setAttribute(a.name,a.value);}
nEl.style.cssText = currentParent.style.cssText;while(currentParent.firstChild) nEl.appendChild(currentParent.firstChild);currentParent.parentNode.insertBefore(nEl,currentParent);currentParent.parentNode.removeChild(currentParent);}
}
} else {
var div = null;for(var i=0;i < collectedParagraphs.length ;i++) {
if(!remainP) div = null;var paragraph = collectedParagraphs[i];for(var j=0;j < paragraph.length;j++) {
var element = paragraph[j];var elementTagName = (element.nodeType == 1 && element.tagName)?element.tagName.toUpperCase():null;if( elementTagName != null &&
(elementTagName == "UL" || elementTagName == "OL" ||
elementTagName == "DL" || elementTagName == "DIV" || Sys.Extended.UI.HTMLEditor.isHeader(element) ||
elementTagName == "P" || elementTagName == "LI" || elementTagName == "TABLE"
)
) {
completeDiv(div);div = null;if(textAlign != "remain")
if(elementTagName!="TABLE" && !force)
element.style.textAlign = textAlign;if(force) element.style.margin = (elementTagName=="P")?"0px":"";if (elementTagName == "UL" || elementTagName == "OL" || elementTagName == "DL") {
for(var jk=0;jk < element.childNodes.length;jk++) {
var li = element.childNodes.item(jk);if(li.nodeType==1) {
li.style.textAlign = "";if(force) li.style.margin = (li.tagName.toUpperCase()=="P")?"0px":"";for(var kk=0;kk < li.childNodes.length;kk++) {
var child = li.childNodes.item(kk);if(child.nodeType==1 && child.tagName) {
var childTagName = child.tagName.toUpperCase();if(force) child.style.margin = (childTagName=="P")?"0px":"";if(childTagName == "DIV" || childTagName == "P" || Sys.Extended.UI.HTMLEditor.isHeader(child)) {
if(editor.tryUnWrap(child,pars,force)) needJoiner=true;}
}
}
}
}
if(textAlign == "left" && force) element.style.textAlign = "";continue;} else if(elementTagName=="LI") {
if(textAlign != "remain") {
if(!(textAlign == "left" && force) || element.parentNode.style.textAlign.length>0 )
element.style.textAlign = textAlign;else
element.style.textAlign = "";}
if(force) element.style.margin = (elementTagName=="P")?"0px":"";var list = element.parentNode;var aligns = [];for(var jn=0;jn < list.childNodes.length;jn++)
if(list.childNodes.item(jn).nodeType==1)
aligns.push(list.childNodes.item(jn).style.textAlign);var jj=1;for(;jj < aligns.length;jj++)
if(aligns[jj-1] != aligns[jj]) break;if(jj==aligns.length) {
var align = (aligns[0]=="left" && force)?"":aligns[0];for(var j=0;j < list.childNodes.length;j++)
if(list.childNodes.item(j).nodeType==1) {
list.childNodes.item(j).style.textAlign = "";if(force) list.childNodes.item(j).style.margin = (list.childNodes.item(j).tagName.toUpperCase()=="P")?"0px":"";}
list.style.textAlign = align;}
continue;} else if(elementTagName=="TABLE") {
if(textAlign != "remain") {
if(!(textAlign == "left" && force) )
element.align = textAlign;else {
element.align = "";element.removeAttribute("align");}
}
}
if((elementTagName == "DIV" || elementTagName == "P" || Sys.Extended.UI.HTMLEditor.isHeader(element)) && textAlign == "left" && force) {
if(editor.tryUnWrap(element,pars,force)) needJoiner=true;}
if((elementTagName == "DIV" || elementTagName == "P" || Sys.Extended.UI.HTMLEditor.isHeader(element))
&& remainP && pTag.toUpperCase() != elementTagName) {
var nEl = editor._doc.createElement(pTag);var attrs = element.attributes;for (var k = 0;k < attrs.length;++k) {
var a = attrs.item(k);if (!a.specified) continue;if (a.name.toLowerCase()=="style") continue;nEl.setAttribute(a.name,a.value);}
nEl.style.cssText = element.style.cssText;while(element.firstChild) nEl.appendChild(element.firstChild);element.parentNode.insertBefore(nEl,element);element.parentNode.removeChild(element);}
} else {
if(!(textAlign == "left" && force) || remainP) {
if(div == null) {
div = editor._doc.createElement(remainP?pTag:editor.dfltBlockElement);if(editor.dfltBlockElement.toUpperCase()=="P" && !remainP) div.style.margin = "0px";if(!remainP)div.style.textAlign = textAlign;element.parentNode.insertBefore(div,element);}
var actualLength = (paragraph[paragraph.length-1]==pars[1])?paragraph.length-1:paragraph.length;var actualStart = (paragraph[0]==pars[0])?1:0;if(elementTagName == "BR" && j == actualLength-1 && j==actualStart) {
if(Sys.Extended.UI.HTMLEditor.isIE) {
div.appendChild(editor._doc.createTextNode(String.fromCharCode(160)));element.parentNode.removeChild(element);} else
div.appendChild(element);} else
if(elementTagName == "BR" && j == actualLength-1 && j>actualStart && (!remainP || (element.nextSibling != null && element.nextSibling==pars[1])))
element.parentNode.removeChild(element);else
div.appendChild(element);if(elementTagName == "BR" && j == paragraph.length-1 && !remainP) {
completeDiv(div);div = null;}
if(element == pars[1] && j == paragraph.length-1) {
completeDiv(div);div = null;}
}
}
}
}
}
}
for(var i=0;i < paragraphs.length;i++) {
var paragraph = paragraphs[i];if(paragraph.length > 0) {
if(paragraph[0].parentNode != currentParent) { 
if(collectedParagraphs.length > 0)
operateCollectedParagraphs();collectedParagraphs = [];currentParent = paragraph[0].parentNode;}
collectedParagraphs.push(paragraph);}
}
if(collectedParagraphs.length > 0)
operateCollectedParagraphs();this.setSelectionAfterOperation(pars, needJoiner);}
Sys.Extended.UI.HTMLEditor.MSIE_indent = function(increase) {
var paragraphs = this.get_paragraphs();var pars = this.getSelectionAfterOperation(paragraphs);var currentParent = null;var collectedParagraphs = [];var editor = this;var needJoiner = false;function getMargin(el) {
if(el.nodeType==1) {
var cssEl = (!editor.rtlState())?el.style.marginLeft:el.style.marginRight;if(cssEl.length > 0) return parseInt(cssEl);}
return 0;}
function setMargin(el,value) {
if(el.nodeType==1) {
if(el.tagName.toUpperCase()=="P" && value=="") value="0px";if(!editor.rtlState())
el.style.marginLeft = value;else
el.style.marginRight= value;}
}
function changeMargin(el) {
if(increase)
setMargin(el,(getMargin(el)+40)+"px");else {
if(el.tagName.toUpperCase()=="P") {
if(getMargin(el) >= 40)
setMargin(el,(getMargin(el)-40)+"px");else
setMargin(el,"0px");}
else {
if(getMargin(el) > 40)
setMargin(el,(getMargin(el)-40)+"px");else
setMargin(el,"");}
}
}
function completeDiv(div) {
if(div != null)
if(div.childNodes==1 && (div.firstChild==pars[0] || div.firstChild==pars[1])) {
div.parentNode.insertBefore(div.firstChild, div);div.parentNode.removeChild(div);}
}
function operateCollectedParagraphs() {
var firstChild = currentParent.firstChild;var lastChild = currentParent.lastChild;if( 
currentParent.tagName && !Sys.Extended.UI.HTMLEditor.isInlineElement(currentParent) &&
collectedParagraphs[0][0] == firstChild &&
collectedParagraphs[collectedParagraphs.length-1][collectedParagraphs[collectedParagraphs.length-1].length-1] == lastChild
) {
var textAlign = "";if(currentParent.getAttribute("align") && currentParent.getAttribute("align").length > 0)
textAlign = currentParent.getAttribute("align");if(currentParent.align && currentParent.align.length > 0)
textAlign = currentParent.align;if(currentParent.style.textAlign && currentParent.style.textAlign.length > 0)
textAlign = currentParent.style.textAlign;if((textAlign.toLowerCase()=="left" && !editor.rtlState()) || (textAlign.toLowerCase()=="right" && editor.rtlState())) textAlign = "";currentParent.align = "";currentParent.setAttribute("align", "");currentParent.removeAttribute("align");changeMargin(currentParent);var curTagName = currentParent.tagName.toUpperCase();if((curTagName == "DIV" || curTagName == "P" || Sys.Extended.UI.HTMLEditor.isHeader(currentParent)) && textAlign == "") {
if(editor.tryUnWrap(currentParent,pars)) needJoiner=true;} else {
if(textAlign != "" || (curTagName=="LI" && currentParent.parentNode.style.textAlign.length>0 ))
currentParent.style.textAlign = textAlign;else
currentParent.style.textAlign = "";if(curTagName=="LI") {
var list = currentParent.parentNode;var margins = [];for(var jn=0;jn < list.childNodes.length;jn++)
margins.push(getMargin(list.childNodes.item(jn)));var jj=1;for(;jj < margins.length;jj++)
if(margins[jj-1] != margins[jj]) break;if(jj==margins.length) {
var margin = (margins[0]==0)?"":(margins[0]+"px");for(var j=0;j < list.childNodes.length;j++)
setMargin(list.childNodes.item(j),"");setMargin(list, margin);}
}
}
} else {
for(var i=0;i < collectedParagraphs.length ;i++) {
var div = null;var paragraph = collectedParagraphs[i];for(var j=0;j < paragraph.length;j++) {
var element = paragraph[j];var elementTagName = (element.nodeType == 1 && element.tagName)?element.tagName.toUpperCase():null;if (elementTagName != null &&
(elementTagName == "UL" || elementTagName == "OL" ||
elementTagName == "DL" || elementTagName == "DIV" || Sys.Extended.UI.HTMLEditor.isHeader(element) ||
elementTagName == "P" || elementTagName == "LI"
)
) {
completeDiv(div);div = null;changeMargin(element)
if(elementTagName == "UL" || elementTagName == "OL" || elementTagName == "DL") {
for(var jk=0;jk < element.childNodes.length;jk++) {
var li = element.childNodes.item(jk);if(li.nodeType==1) {
setMargin(li, "");for(var kk=0;kk < li.childNodes.length;kk++) {
var child = li.childNodes.item(kk);var textAlign = (child.nodeType==1)?element.style.textAlign:"";if((textAlign.toLowerCase()=="left" && !editor.rtlState()) || (textAlign.toLowerCase()=="right" && editor.rtlState())) textAlign = "";if(child.nodeType==1) {
setMargin(child, "");if(textAlign == "" && child.tagName) {
var childTagName = child.tagName.toUpperCase();if (childTagName == "DIV" || childTagName == "P") {
if(editor.tryUnWrap(child,pars)) needJoiner=true;}
}
}
}
}
}
continue;} else if(elementTagName=="LI") {
var list = element.parentNode;var margins = [];for(var jn=0;jn < list.childNodes.length;jn++)
margins.push(getMargin(list.childNodes.item(jn)));var jj=1;for(;jj < margins.length;jj++)
if(margins[jj-1] != margins[jj]) break;if(jj==margins.length) {
var margin = (margins[0]==0)?"":(margins[0]+"px");for(var j=0;j < list.childNodes.length;j++)
setMargin(list.childNodes.item(j),"");setMargin(list, margin);}
continue;}
var textAlign = element.style.textAlign;if((textAlign.toLowerCase()=="left" && !editor.rtlState()) || (textAlign.toLowerCase()=="right" && editor.rtlState())) textAlign = "";if((elementTagName == "DIV" || elementTagName == "P" || Sys.Extended.UI.HTMLEditor.isHeader(element)) && textAlign == "") {
if(editor.tryUnWrap(element,pars)) needJoiner=true;}
} else {
if(increase) {
if(div == null) {
div = editor._doc.createElement(editor.dfltBlockElement);if(editor.dfltBlockElement.toUpperCase()=="P") div.style.margin = "0px";changeMargin(div);element.parentNode.insertBefore(div,element);}
var actualLength = (paragraph[paragraph.length-1]==pars[1])?paragraph.length-1:paragraph.length;var actualStart = (paragraph[0]==pars[0])?1:0;if(elementTagName == "BR" && j == actualLength-1 && j==actualStart) {
if(Sys.Extended.UI.HTMLEditor.isIE) {
div.appendChild(editor._doc.createTextNode(String.fromCharCode(160)));element.parentNode.removeChild(element);} else
div.appendChild(element);} else if(elementTagName == "BR" && j == actualLength-1 && j>actualStart)
element.parentNode.removeChild(element);else
div.appendChild(element);if(elementTagName == "BR" && j == paragraph.length-1) {
completeDiv(div);div = null;}
if(element == pars[1] && j == paragraph.length-1) {
completeDiv(div);div = null;}
}
}
}
}
}
}
for(var i=0;i < paragraphs.length;i++) {
var paragraph = paragraphs[i];if(paragraph.length > 0) {
if(paragraph[0].parentNode != currentParent) {
if(collectedParagraphs.length > 0)
operateCollectedParagraphs();collectedParagraphs = [];currentParent = paragraph[0].parentNode;}
collectedParagraphs.push(paragraph);}
}
if(collectedParagraphs.length > 0)
operateCollectedParagraphs();this.setSelectionAfterOperation(pars,needJoiner);};Sys.Extended.UI.HTMLEditor.getSelectionAfterOperation = function(paragraphs) {
if(paragraphs.length==0) return[];var lPoint = this._doc.createElement("SPAN");var rPoint = this._doc.createElement("SPAN");var initFirst = paragraphs[0][0];var initLast = paragraphs[paragraphs.length-1][paragraphs[paragraphs.length-1].length-1];if(initFirst==initLast && initLast.nodeType==1 && initLast.childNodes.length==0 && Sys.Extended.UI.HTMLEditor.canHaveChildren(initLast)) {
initLast.appendChild(lPoint);initLast.appendChild(rPoint);} else {
var firstest = Sys.Extended.UI.HTMLEditor._getReallyFirst(initFirst);firstest.parentNode.insertBefore(lPoint,firstest);if(firstest == initFirst) {
var sv = [];sv.push(lPoint);for(var i=0;i<paragraphs[0].length;i++)
sv.push(paragraphs[0][i]);paragraphs[0] = sv;}
var lastest = Sys.Extended.UI.HTMLEditor._getReallyLast(initLast);if(lastest.nextSibling)
lastest.parentNode.insertBefore(rPoint,lastest.nextSibling);else
lastest.parentNode.appendChild(rPoint);if(lastest == initLast) {
paragraphs[paragraphs.length-1].push(rPoint)
}
}
return [lPoint,rPoint];};Sys.Extended.UI.HTMLEditor.setSelectionAfterOperation = function(pars, needJoiner) {
if(pars.length==0) return;var lPoint = pars[0];var rPoint = pars[1];var sel = this._getSelection();var text1 = null;var text2 = null;if(Sys.Extended.UI.HTMLEditor.isIE) {
sel.empty();sel = this._getSelection();var range1= this._createRange(sel);var range2= this._createRange(sel);try {
if(lPoint != null && rPoint != null && lPoint.nextSibling == rPoint) {
text1 = this._doc.createTextNode(" ");rPoint.parentNode.insertBefore(text1,rPoint);}
this._TcurrentFormat = null;if(lPoint != null) {
range1.moveToElementText(lPoint);}
if(rPoint != null) {
range2.moveToElementText(rPoint);}
if(lPoint != null && rPoint != null) {
range1.setEndPoint("EndToStart", range2);range1.select();if(text1 != null) {
range1.collapse(false);range1.select();text1.parentNode.removeChild(text1);}
} else
if(lPoint != null) range1.select();else
if(rPoint != null) range2.select();} catch(ex) {}
} else {
try {
var range;var next = lPoint.nextSibling;var prev = rPoint.previousSibling
this._TcurrentFormat = null;if(next == prev && next.nodeType == 1 && next.tagName.toUpperCase()=="BR") {
var ind = Sys.Extended.UI.HTMLEditor.__getIndex(next);range = this._doc.createRange();range.setStart(next.parentNode,ind);range.setEnd (next.parentNode,ind);} else {
text1 = this._doc.createTextNode("");text2 = this._doc.createTextNode("");lPoint.parentNode.insertBefore(text1,lPoint);rPoint.parentNode.insertBefore(text2,rPoint);range = this._doc.createRange();range.setStart(text1,0);range.setEnd (text2,0);}
this._removeAllRanges(sel);this._selectRange(sel,range);} catch(ex){}
}
var fnd = Sys.Extended.UI.HTMLEditor._commonTotalParent((lPoint==null)?rPoint:lPoint,(rPoint==null)?lPoint:rPoint);var parent = null;if(fnd != null) {
parent = fnd.parent;}
if(lPoint != null) lPoint.parentNode.removeChild(lPoint);if(rPoint != null) rPoint.parentNode.removeChild(rPoint);if(needJoiner && parent != null) {
Sys.Extended.UI.HTMLEditor.spanJoiner(parent,this._doc);if(!Sys.Extended.UI.HTMLEditor.isIE && text1 != null && text2 !=null) {
var range = this._doc.createRange();range.setStart(text1,0);range.setEnd (text2,0);this._removeAllRanges(sel);this._selectRange(sel,range);}
}
};Sys.Extended.UI.HTMLEditor.get_paragraphs = function() {
this._TcurrentFormat = null;var paragraphs = this.getPseudoP();if(paragraphs.length == 0) {
try {
var str = "<span id='"+Sys.Extended.UI.HTMLEditor.smartClassName+"_ll'></span><span id='"+Sys.Extended.UI.HTMLEditor.smartClassName+"_rr'></span><br>";this.insertHTML(str);var lPoint = this._doc.getElementById(Sys.Extended.UI.HTMLEditor.smartClassName+"_ll");var rPoint = this._doc.getElementById(Sys.Extended.UI.HTMLEditor.smartClassName+"_rr");var sv = this._TcurrentFormat;this._TcurrentFormat = null;this.setSelectionAfterOperation([lPoint,rPoint], false);this._TcurrentFormat = sv;paragraphs = this.getPseudoP();} catch(ex) {}
}
return paragraphs;};Sys.Extended.UI.HTMLEditor.getPseudoP = function() {
var result = [];try {
var sel = this._getSelection();var range = this._createRange(sel);var rn=Sys.Extended.UI.HTMLEditor.smartClassName+"_right";var ln=Sys.Extended.UI.HTMLEditor.smartClassName+"_left";var r_left = null;var r_right= null;if(Sys.Extended.UI.HTMLEditor.isIE) {
if(sel.type.toLowerCase() != "control") {
r_left =range.duplicate();r_right=range.duplicate();r_left .setEndPoint("EndToStart",range);r_right.setEndPoint("StartToEnd",range);}
} else {
r_left =range.cloneRange();r_right=range.cloneRange();r_left .setEnd (r_left .startContainer,r_left .startOffset);r_right.setStart(r_right.endContainer ,r_right.endOffset );}
var lPoint = null;var rPoint = null;if(Sys.Extended.UI.HTMLEditor.isIE && sel.type.toLowerCase() == "control") {
var control =range.item(0);var cspan;cspan = this._doc.createElement("SPAN");cspan.id = ln;control.parentNode.insertBefore(cspan,control);cspan = this._doc.createElement("SPAN");cspan.id = rn;if(control.nextSibling == null)
control.parentNode.appendChild(cspan);else
control.parentNode.insertBefore(cspan,control.nextSibling);} else {
if(!this.insertHTML("<span id='"+rn+"'/>",r_right)) return [];if(!this.insertHTML("<span id='"+ln+"'/>",r_left )) {
var rP = this._doc.getElementById(rn);if(rP!=null) {
temp=rP.parentNode;temp.removeChild(rP);}
return [];}
}
lPoint = this._doc.getElementById(ln);rPoint = this._doc.getElementById(rn);if(lPoint != null && rPoint != null) {
while(lPoint.nextSibling == null) {
if(lPoint.parentNode.nextSibling)
lPoint.parentNode.parentNode.insertBefore(lPoint,lPoint.parentNode.nextSibling);else
lPoint.parentNode.parentNode.appendChild(lPoint);}
}
if(lPoint != null && rPoint != null) {
while(rPoint.previousSibling == null)
rPoint.parentNode.parentNode.insertBefore(rPoint,rPoint.parentNode);if(rPoint.previousSibling.nodeType==1) {
var tagName = rPoint.previousSibling.tagName.toUpperCase();if(tagName!="BR" && tagName!="IMG") {
var last = Sys.Extended.UI.HTMLEditor._getReallyLast(rPoint.previousSibling);if(last.nodeType==1 && Sys.Extended.UI.HTMLEditor.canHaveChildren(last))
last.appendChild(rPoint);else
last.parentNode.appendChild(rPoint);}
}
if(rPoint.previousSibling && rPoint.previousSibling.nodeType==1 && rPoint.previousSibling.tagName.toUpperCase()=="BR")
rPoint.parentNode.insertBefore(rPoint,rPoint.previousSibling);}
if(lPoint == null) {
var span = this._doc.createElement("SPAN");span.id = ln;rPoint.parentNode.insertBefore(span,rPoint);lPoint = span;}
if(rPoint == null) {
var span = this._doc.createElement("SPAN");span.id = rn;if(lPoint.nextSibling)
lPoint.parentNode.insertBefore(span,lPoint.nextSibling);else
lPoint.parentNode.appendChild (span);rPoint = span;}
if(lPoint != null && rPoint != null) {
if(lPoint.parentNode == rPoint) {
rPoint.parentNode.insertBefore(lPoint,rPoint);}
else if(rPoint.parentNode == lPoint) {
if(lPoint.nextSibling != null)
lPoint.parentNode.insertBefore(rPoint,lPoint.nextSibling);else
lPoint.parentNode.appendChild(rPoint);}
}
while(lPoint.nextSibling != null && lPoint.nextSibling.nodeType==3 && (""+lPoint.nextSibling.data+"").length==0)
lPoint.parentNode.removeChild(lPoint.nextSibling);if(this._TcurrentFormat == null && lPoint != null && rPoint != null && lPoint.nextSibling == rPoint) {
var par = rPoint.parentNode;this._TcurrentFormat = null;while (par && par.tagName.toUpperCase() != "BODY" && Sys.Extended.UI.HTMLEditor.isStyleTag(par.tagName)) {
if(par.tagName.toUpperCase() != "A") {
var temp = par.cloneNode(false);if(this._TcurrentFormat == null) {
this._TcurrentFormat = temp;} else {
temp.appendChild(this._TcurrentFormat);this._TcurrentFormat = temp;}
}
par = par.parentNode;}
if(this._TcurrentFormat) {
var sspan = this._doc.createElement("span");sspan.appendChild(this._TcurrentFormat);this._TcurrentFormat = sspan.innerHTML;}
}
var telem = lPoint;while(telem && telem.tagName && Sys.Extended.UI.HTMLEditor.isStyleTag(telem.tagName) && (telem.tagName.toUpperCase() != "A")) {
telem = telem.parentNode;}
if(telem != null && telem.tagName.toUpperCase()=="P") {
if(telem.firstChild != null)
telem.insertBefore(lPoint,telem.firstChild);else
telem.appendChild(lPoint);} else
Sys.Extended.UI.HTMLEditor.positionInParagraph(lPoint,lPoint.previousSibling,true ,lPoint.parentNode);telem = rPoint;while(telem && telem.tagName && Sys.Extended.UI.HTMLEditor.isStyleTag(telem.tagName) && (telem.tagName.toUpperCase() != "A")) {
telem = telem.parentNode;}
if(telem != null && telem.tagName.toUpperCase()=="P") {
telem.appendChild(rPoint);} else
Sys.Extended.UI.HTMLEditor.positionInParagraph(rPoint,rPoint.nextSibling ,false,rPoint.parentNode);result = this.getPseudoP_Recur(lPoint, rPoint, 0);var lpTagName = lPoint.parentNode.tagName.toUpperCase();if (result.length==0 && lPoint.previousSibling==null && rPoint.nextSibling==null && 
lPoint.nextSibling==rPoint && (lpTagName=="P" || llpTagName=="DIV" || lpTagName=="LI")
)
result = [[lPoint.parentNode]];if(Sys.Extended.UI.HTMLEditor.isIE) {
sel.empty();sel = this._getSelection();var range1= this._createRange(sel);var range2= this._createRange(sel);try {
if(lPoint != null) range1.moveToElementText(lPoint);if(rPoint != null) range2.moveToElementText(rPoint);if(lPoint != null && rPoint != null) {
range1.setEndPoint("EndToEnd", range2);range1.select();} else if(lPoint != null) range1.select();else
if(rPoint != null) range2.select();} catch(e) {}
}
if(lPoint != null) lPoint.parentNode.removeChild(lPoint);if(rPoint != null) rPoint.parentNode.removeChild(rPoint);} catch(e) {
var spans = this._doc.getElementsByTagName("SPAN");var del = [];for(var i=0;i < spans.length;i++) {
var span = spans[i];if(span.id && span.id.length > 0) {
var reg = new RegExp(Sys.Extended.UI.HTMLEditor.smartClassName,"ig");if(reg.test(span.id))
del.push(span);}
}
for(var i=0;i < del.length;i++)
del[i].parentNode.removeChild(del[i]);}
return result;};Sys.Extended.UI.HTMLEditor.getPseudoP_Recur = function(lPoint,rPoint,r_level) {
var result = [];var lBound = lPoint;var rBound = (rPoint.nextSibling != null && rPoint.nextSibling.tagName && rPoint.nextSibling.tagName.toUpperCase()=="BR")?rPoint.nextSibling:rPoint;var fnd = null;if(lBound==null || rBound==null) {
if(lBound!=null) {
fnd = Sys.Extended.UI.HTMLEditor._commonTotalParent(lBound,lBound);}
if(rBound!=null) {
fnd = Sys.Extended.UI.HTMLEditor._commonTotalParent(rBound,rBound);}
} else
fnd = Sys.Extended.UI.HTMLEditor._commonTotalParent(lBound,rBound);if(fnd != null) { 
lBound = Sys.Extended.UI.HTMLEditor.getContainer(fnd.parent.childNodes.item(fnd.indexFirst),lBound);rBound = Sys.Extended.UI.HTMLEditor.getContainer(fnd.parent.childNodes.item(fnd.indexLast ),rBound);Sys.Extended.UI.HTMLEditor.unStyle(lBound);Sys.Extended.UI.HTMLEditor.unStyle(rBound);while(lBound.parentNode != fnd.parent) lBound = lBound.parentNode;while(rBound.parentNode != fnd.parent) rBound = rBound.parentNode;Sys.Extended.UI.HTMLEditor._moveTagsUp(lBound.nextSibling,rBound);fnd = null;if(lPoint==null || rPoint==null) {
if(lPoint!=null) {
fnd = Sys.Extended.UI.HTMLEditor._commonTotalParent(lPoint,lPoint);}
if(rPoint!=null) {
fnd = Sys.Extended.UI.HTMLEditor._commonTotalParent(rPoint,rPoint);}
} else
fnd = Sys.Extended.UI.HTMLEditor._commonTotalParent(lPoint,rPoint);if(fnd != null) {
Sys.Extended.UI.HTMLEditor.spanJoiner(fnd.parent,this._doc,fnd.indexFirst,fnd.indexLast+1, true);}
function _dive1(next) {
if(!Sys.Extended.UI.HTMLEditor.isInlineElement(next)) {
return true;}
else if(next.tagName && Sys.Extended.UI.HTMLEditor.isStyleTag(next.tagName) && (next.tagName.toUpperCase() != "A") && !Sys.Extended.UI.HTMLEditor.isTempElement(next)) {
var nnn = next.firstChild;while(nnn != null) {
nnnNext = nnn.nextSibling;var temp = _dive1(nnn);if(temp) return true;nnn = nnnNext;}
}
return false;}
var arrIndex = 0;var subArr = [];var subIndex = 0;if(lBound.tagName && rBound.tagName) {
var lBoundTagName = lBound.tagName.toUpperCase();var rBoundTagName = rBound.tagName.toUpperCase();if((lBoundTagName == "TD" || lBoundTagName == "TR") &&
(rBoundTagName == "TD" || rBoundTagName == "TR")
) {
while(lBound.tagName.toUpperCase() != "TABLE") lBound = lBound.parentNode;rBound = lBound;} else {
if((lBoundTagName == "DD" || lBoundTagName == "DT") &&
(rBoundTagName == "DD" || rBoundTagName == "DT")
) {
while(lBound.tagName && lBound.tagName.toUpperCase() != "DL") lBound = lBound.parentNode;rBound = lBound;} else {
if((lBoundTagName == "LI") && (rBoundTagName == "LI")) {
while(lBoundTagName != "UL" && lBoundTagName != "OL") {
lBound = lBound.parentNode;lBoundTagName = (lBound.tagName)?lBound.tagName.toUpperCase():null;}
rBound = lBound;}
}
}
}
var fromPoint = lPoint?lPoint:rPoint;var toPoint = rPoint?rPoint:lPoint;var next = lBound;while(true) {
if(!Sys.Extended.UI.HTMLEditor.isTempElement(next)) {
var isBlock = _dive1(next);if(!isBlock) {
if(next.nodeType && next.nodeType==3) {
var str = ""+next.data+"";if(str.length==0 || /^[\n\r]+$/.test(str)) {
var tempNext = next.nextSibling;next.parentNode.removeChild(next);if(next==rBound) break;next = tempNext;continue;}
}
subArr[subIndex] = next;subIndex++;} else {
if(next.tagName && next.tagName.toUpperCase()=="BR") {
subArr[subIndex] = next;result[arrIndex] = subArr;arrIndex++;subArr = [];subIndex = 0;}
else
if( (next==rBound || next==lBound) &&
!((next==rBound && next==lBound)?(Sys.Extended.UI.HTMLEditor._reallyFirst(next,fromPoint) && Sys.Extended.UI.HTMLEditor._reallyLast(next,toPoint))
:(Sys.Extended.UI.HTMLEditor._reallyFirst(next,fromPoint) || Sys.Extended.UI.HTMLEditor._reallyLast(next,toPoint))
)
) {
var nextTagName = (next.tagName)?(next.tagName.toUpperCase()):null;if(nextTagName== "TABLE" || nextTagName== "TBODY") {
var table = next;while(table.tagName.toUpperCase() != "TABLE") table = table.parentNode;var fromCellIndex = 0;var fromRowIndex = 0;var toCellIndex = table.rows.item(table.rows.length-1).cells.length-1;var toRowIndex = table.rows.length-1;for(var i=0;i<table.rows.length;i++) {
var row = table.rows.item(i);var j=0;for(;j<row.cells.length;j++) {
var cell = row.cells.item(j);if(Sys.Extended.UI.HTMLEditor._lookChild(cell,fromPoint) >= 0) {
fromCellIndex = j;fromRowIndex = i;}
if(Sys.Extended.UI.HTMLEditor._lookChild(cell,toPoint) >= 0) {
toCellIndex = j;toRowIndex = i;}
}
}
for(var i=fromRowIndex;i<=toRowIndex;i++)
for(var j=((i==fromRowIndex)?fromCellIndex:0);j<=((i==toRowIndex)?toCellIndex:(table.rows.item(i).cells.length-1));j++) {
var cell = table.rows.item(i).cells.item(j);if(subIndex > 0) {
result[arrIndex] = subArr;arrIndex++;subArr = [];subIndex = 0;}
var is_lPoint = (Sys.Extended.UI.HTMLEditor._lookChild(cell,fromPoint) >=0);var is_rPoint = (Sys.Extended.UI.HTMLEditor._lookChild(cell,toPoint ) >=0);if(is_lPoint || is_rPoint) { 
var r_lPoint = fromPoint;var r_rPoint = toPoint;var rn=Sys.Extended.UI.HTMLEditor.smartClassName+"_right_"+r_level;var ln=Sys.Extended.UI.HTMLEditor.smartClassName+"_left_" +r_level;if(is_lPoint) {
r_rPoint = this._doc.createElement("span");r_rPoint.id = rn;cell.appendChild(r_rPoint);}
if(is_rPoint) {
r_lPoint = this._doc.createElement("span");r_lPoint.id = ln;if(cell.firstChild)
cell.insertBefore(r_lPoint,cell.firstChild);else
cell.appendChild (r_lPoint);}
var r_result = this.getPseudoP_Recur(r_lPoint, r_rPoint, r_level+1);for(var cnt=0;cnt < r_result.length;cnt++) {
result[arrIndex] = r_result[cnt];arrIndex++;}
if(r_lPoint != fromPoint) r_lPoint.parentNode.removeChild(r_lPoint);if(r_rPoint != toPoint ) r_rPoint.parentNode.removeChild(r_rPoint);} else {
var fromEl = 0;var toEl = cell.childNodes.length;for(var k=fromEl;k<toEl;k++) {
var el = cell.childNodes.item(k);if(!Sys.Extended.UI.HTMLEditor.isTempElement(el)) {
subArr[subIndex] = el;subIndex++;}
}
if(subArr.length > 0) {
result[arrIndex] = subArr;arrIndex++;subArr = [];subIndex = 0;}
}
}
}
else if(nextTagName== "UL" || nextTagName== "OL" || nextTagName== "DL") {
var list = next;var fromIndex = 0;var toIndex = list.childNodes.length-1;for(var i=0;i<list.childNodes.length;i++) {
var point = list.childNodes.item(i);if(point.nodeType==1) {
if(point==fromPoint || Sys.Extended.UI.HTMLEditor._lookChild(point,fromPoint) >= 0) {
fromIndex = i;}
if(point==toPoint || Sys.Extended.UI.HTMLEditor._lookChild(point,toPoint) >= 0) {
toIndex = i;}
}
}
for(var i=fromIndex;i<=toIndex;i++) {
var point = list.childNodes.item(i);if(subIndex > 0) {
result[arrIndex] = subArr;arrIndex++;subArr = [];subIndex = 0;}
var is_lPoint = (Sys.Extended.UI.HTMLEditor._lookChild(point,fromPoint) >=0);var is_rPoint = (Sys.Extended.UI.HTMLEditor._lookChild(point,toPoint ) >=0);if(is_lPoint || is_rPoint) { 
var r_lPoint = fromPoint;var r_rPoint = toPoint;var rn=Sys.Extended.UI.HTMLEditor.smartClassName+"_right_"+r_level;var ln=Sys.Extended.UI.HTMLEditor.smartClassName+"_left_" +r_level;if(is_lPoint) {
r_rPoint = this._doc.createElement("span");r_rPoint.id = rn;point.appendChild(r_rPoint);}
if(is_rPoint) {
r_lPoint = this._doc.createElement("span");r_lPoint.id = ln;if(point.firstChild)
point.insertBefore(r_lPoint,point.firstChild);else
point.appendChild (r_lPoint);}
var r_result = this.getPseudoP_Recur(r_lPoint, r_rPoint, r_level+1);for(var cnt=0;cnt < r_result.length;cnt++) {
result[arrIndex] = r_result[cnt];arrIndex++;}
if(r_lPoint != fromPoint) r_lPoint.parentNode.removeChild(r_lPoint);if(r_rPoint != toPoint ) r_rPoint.parentNode.removeChild(r_rPoint);} else {
var fromEl = 0;var toEl = point.childNodes.length;for(var k=fromEl;k<toEl;k++) {
var el = point.childNodes.item(k);if(!Sys.Extended.UI.HTMLEditor.isTempElement(el)) {
subArr[subIndex] = el;subIndex++;}
}
if(subArr.length > 0) {
result[arrIndex] = subArr;arrIndex++;subArr = [];subIndex = 0;}
}
}
} else {
var is_lPoint = (Sys.Extended.UI.HTMLEditor._lookChild(next,fromPoint) >=0);var is_rPoint = (Sys.Extended.UI.HTMLEditor._lookChild(next,toPoint ) >=0);if(subIndex > 0) {
result[arrIndex] = subArr;arrIndex++;subArr = [];subIndex = 0;}
if(is_lPoint || is_rPoint) { 
var r_lPoint = fromPoint;var r_rPoint = toPoint;var rn=Sys.Extended.UI.HTMLEditor.smartClassName+"_right_"+r_level;var ln=Sys.Extended.UI.HTMLEditor.smartClassName+"_left_" +r_level;if(is_lPoint) {
r_rPoint = this._doc.createElement("span");r_rPoint.id = rn;next.appendChild(r_rPoint);}
if(is_rPoint) {
r_lPoint = this._doc.createElement("span");r_lPoint.id = ln;if(next.firstChild)
next.insertBefore(r_lPoint,next.firstChild);else
next.appendChild (r_lPoint);}
var r_result = this.getPseudoP_Recur(r_lPoint, r_rPoint, r_level+1);for(var cnt=0;cnt < r_result.length;cnt++) {
result[arrIndex] = r_result[cnt];arrIndex++;}
if(r_lPoint != fromPoint) r_lPoint.parentNode.removeChild(r_lPoint);if(r_rPoint != toPoint ) r_rPoint.parentNode.removeChild(r_rPoint);} else {
var fromEl = 0;var toEl = next.childNodes.length;for(var k=fromEl;k<toEl;k++) {
var el = next.childNodes.item(k);if(!Sys.Extended.UI.HTMLEditor.isTempElement(el)) {
subArr[subIndex] = el;subIndex++;}
}
if(subArr.length > 0) {
result[arrIndex] = subArr;arrIndex++;subArr = [];subIndex = 0;}
}
}
} else {
if(subIndex > 0) {
result[arrIndex] = subArr;arrIndex++;subArr = [];subIndex = 0;}
subArr[subIndex] = next;result[arrIndex] = subArr;arrIndex++;subArr = [];subIndex = 0;}
}
}
if(next==rBound) break;next = next.nextSibling;}
if(subIndex > 0) {
result[arrIndex] = subArr;}
}
return result;};Sys.Extended.UI.HTMLEditor.unWrap = function(element,pars) {
var editor = this;if(element.firstChild) {
while(element.firstChild && element.firstChild.nodeType==3 && (""+element.firstChild.data+"")=="")
element.removeChild(element.firstChild);var inner = [];while(element.firstChild) {
if(element.firstChild != pars[0] && element.firstChild != pars[1]) inner.push(element.firstChild);element.parentNode.insertBefore(element.firstChild,element);}
if(inner.length==0) {
var br = editor._doc.createElement("BR");element.parentNode.insertBefore(br,element);}
if(Sys.Extended.UI.HTMLEditor.isIE && inner.length==1 && inner[0].nodeType==3) {
var str = ""+inner[0].data+"";if(str.length== 1 && str.charCodeAt(0)==160) {
var br = editor._doc.createElement("BR");inner[0].parentNode.insertBefore(br,inner[0]);inner[0].parentNode.removeChild(inner[0]);}
}
while(element.nextSibling && element.nextSibling.nodeType==3 && (""+element.nextSibling.data+"")=="")
element.parentNode.removeChild(element.nextSibling);var previousSibling = (element.previousSibling && pars[1] == element.previousSibling)?pars[1].previousSibling:element.previousSibling;if(previousSibling && Sys.Extended.UI.HTMLEditor.isInlineElement(previousSibling))
if(previousSibling.nodeType==1 && previousSibling.childNodes.length > 0)
previousSibling = Sys.Extended.UI.HTMLEditor._getReallyLast(previousSibling);if(Sys.Extended.UI.HTMLEditor.isInlineElement(previousSibling) && element.nextSibling != null) {
var br = editor._doc.createElement("BR");element.parentNode.insertBefore(br,element);}
} else {
var br = editor._doc.createElement("BR");element.parentNode.insertBefore(br,element);}
element.parentNode.removeChild(element);};Sys.Extended.UI.HTMLEditor.tryUnWrap = function(element,pars,force) {
var editor = this;element.style.textAlign = "";var attrsNumber = 0;var attrs = element.attributes;for (var k = 0;k < attrs.length;++k) {
var a = attrs.item(k);if (!a.specified) continue;if (a.name.toLowerCase()=="style") continue;attrsNumber++;}
var save_css = element.style.cssText;var margin = 0;var mar;var elementTagName = element.tagName.toUpperCase();if(!(typeof force != "undefined" && force))
if(elementTagName != "LI")
try {
mar = parseInt(Sys.Extended.UI.HTMLEditor.getStyle(element,"margin-top"));if(isNaN(mar)) mar=elementTagName=="P"?1:0;margin+=mar;mar = parseInt(Sys.Extended.UI.HTMLEditor.getStyle(element,"margin-bottom"));if(isNaN(mar)) mar=elementTagName=="P"?1:0;margin+=mar;mar = parseInt(Sys.Extended.UI.HTMLEditor.getStyle(element,"margin-right"));if(isNaN(mar)) mar=elementTagName=="P"?1:0;margin+=mar;mar = parseInt(Sys.Extended.UI.HTMLEditor.getStyle(element,"margin-left"));if(isNaN(mar)) mar=elementTagName=="P"?1:0;margin+=mar;} catch(e) {margin=1;}
element.style.margin = "";if((attrsNumber == 0 && element.style.cssText.length == 0 && margin==0) || (typeof force != "undefined" && force && elementTagName != "LI")) {
editor.unWrap(element,pars);return true;} else {
element.style.cssText = save_css;return false;}
};Sys.Extended.UI.HTMLEditor._queryCommandValue = function(cmdID, _id) {
var obj = this._rangeStartEnd();if(obj == null) return "";try {
if(cmdID.toLowerCase()=="backcolor") {
var el = obj.start;while(el) {
var bckg = Sys.Extended.UI.HTMLEditor.getStyle(el,"background-color").toLowerCase();if(bckg.length > 0 && bckg != "transparent") return bckg;el = el.parentNode;}
return "#FFFFFF";}
var cssStyle = "none";switch (cmdID.toLowerCase()) {
case "forecolor":
cssStyle = "color";break;case "fontname":
cssStyle = "font-family";break;case "fontsize":
cssStyle = "font-size";break;}
var ret;if((cssStyle == "font-size" || cssStyle == "font-family") && this._FontNotSet) {
ret = "";var par = obj.start;while (par != null) {
if(cssStyle == "font-size") {
if(par.style && par.style.fontSize && par.style.fontSize.length > 0) {
ret = par.style.fontSize;break;} else if(par.tagName && par.tagName.toUpperCase()=="FONT" && par.size && par.size.length > 0) {
ret = Sys.Extended.UI.HTMLEditor.fontSizeSeek(par.size);break;}
} else {
if(par.style && par.style.fontFamily && par.style.fontFamily.length > 0) {
ret = par.style.fontFamily;break;} else if(par.tagName && par.tagName.toUpperCase()=="FONT" && par.face && par.face.length > 0) {
ret = par.face;break;}
}
if(par.className && par.className.length > 0) {
ret = Sys.Extended.UI.HTMLEditor.getStyle(par,cssStyle).toLowerCase();if(cssStyle == "font-size") {
if(!Sys.Extended.UI.HTMLEditor.isIE) {
ret = Sys.Extended.UI.HTMLEditor._TryTransformFromPxToPt(ret,this,_id);}
}
break;}
var parTagName = par.tagName.toUpperCase();if(parTagName == "BODY" || parTagName == "TD") break;par = par.parentNode;}
} else {
ret = Sys.Extended.UI.HTMLEditor.getStyle(obj.start,cssStyle).toLowerCase();if(cssStyle == "font-size") {
if(!Sys.Extended.UI.HTMLEditor.isIE) {
ret = Sys.Extended.UI.HTMLEditor._TryTransformFromPxToPt(ret,this,_id);var par = obj.start;while (par != null) {
if(par.style && par.style.fontSize && par.style.fontSize.length > 0) {
ret = par.style.fontSize;break;}
if(par.className && par.className.length > 0) break;var parTagName = par.tagName.toUpperCase();if(parTagName == "BODY" || parTagName == "TD") break;par = par.parentNode;}
}
}
}
if(this._StyleForTyping != null && this._StyleForTyping.length > 0) {
for(var i=0;i < this._StyleForTyping.length;i++) {
var curCss = this._StyleForTyping[i];if(curCss.name == cssStyle) {
ret = curCss.value;break;}
}
}
return ret;} catch(ex) {return "";}
};Sys.Extended.UI.HTMLEditor.Trim = function(value) {
return value.replace(/[\x00-\x1F]+/g,"");};Sys.Extended.UI.HTMLEditor.TrimAll = function(value) {
return value.replace(/[\x00-\x1F]/g,"").replace(/^[\x20]+/g,"").replace(/[\x20]+$/g,"");};Sys.Extended.UI.HTMLEditor.isIE = (Sys.Browser.agent == Sys.Browser.InternetExplorer);Sys.Extended.UI.HTMLEditor.isSafari = (Sys.Browser.agent == Sys.Browser.Safari);Sys.Extended.UI.HTMLEditor.isOpera = (Sys.Browser.agent == Sys.Browser.Opera);Sys.Extended.UI.HTMLEditor.tryReplaceRgb = function(value) {
var result = value;var re = /(rgb\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\))/ig;function hex(d) {
return (d < 16) ? ("0" + d.toString(16)) : d.toString(16);};function repl($0,$1,$2,$3,$4) {
var r = parseInt($2);var g = parseInt($3);var b = parseInt($4);return "#" + hex(r) + hex(g) + hex(b);}
try { 
result = result.replace(re, repl);} catch(e){}
return result;}
Sys.Extended.UI.HTMLEditor.addFormOnSubmit = function(handler) {
var form = window.theForm;if(window.theForm != null && typeof window.theForm != "undefined") {
if(form.HTMLEditor_editPanels == null || typeof form.HTMLEditor_editPanels == "undefined") {
form.originalOnSubmit_HTMLEditor = window.theForm.onsubmit;form.HTMLEditor_editPanels = [];window.theForm.onsubmit = Sys.Extended.UI.HTMLEditor.EditPanelsOnSubmit;if (window.__doPostBack != null && typeof window.__doPostBack != "undefined") {
if (window.__doPostBack_HTMLEditor_original == null || typeof window.__doPostBack_HTMLEditor_original == "undefined") {
window.__doPostBack_HTMLEditor_original = window.__doPostBack;window.__doPostBack = Sys.Extended.UI.HTMLEditor.EditPanelsOnPostBack;}
}
}
form.HTMLEditor_editPanels.push(handler);}
}
Sys.Extended.UI.HTMLEditor.removeFormOnSubmit = function(handler) {
var form = window.theForm;if(window.theForm != null && typeof window.theForm != "undefined") {
var original = form.originalOnSubmit_HTMLEditor;if(form.HTMLEditor_editPanels != null && typeof form.HTMLEditor_editPanels != "undefined") {
var newArr = [];for(var i=0;i < form.HTMLEditor_editPanels.length;i++) {
var cur = form.HTMLEditor_editPanels[i];if(cur != handler) {
newArr.push(cur);}
}
form.HTMLEditor_editPanels = newArr;if(form.HTMLEditor_editPanels.length == 0) {
window.theForm.onsubmit = original;form.originalOnSubmit_HTMLEditor = null;form.HTMLEditor_editPanels = null;if (window.__doPostBack_HTMLEditor_original != null && typeof window.__doPostBack_HTMLEditor_original != "undefined") {
window.__doPostBack = window.__doPostBack_HTMLEditor_original;window.__doPostBack_HTMLEditor_original = null;}
}
}
}
}
Sys.Extended.UI.HTMLEditor.EditPanelsOnSubmit = function(e) {
var form = window.theForm;for(var i=0;i < form.HTMLEditor_editPanels.length;i++) {
var ret = form.HTMLEditor_editPanels[i](e);if(!ret) return false;}
if(form.originalOnSubmit_HTMLEditor != null && typeof form.originalOnSubmit_HTMLEditor != "undefined") {
return form.originalOnSubmit_HTMLEditor(e);}
return true;}
Sys.Extended.UI.HTMLEditor.EditPanelsOnPostBack = function(eventTarget, eventArgument) {
var form = window.theForm;for(var i=0;i < form.HTMLEditor_editPanels.length;i++) {
var ret = form.HTMLEditor_editPanels[i](null);if(!ret) return false;}
if (window.__doPostBack_HTMLEditor_original != null && typeof window.__doPostBack_HTMLEditor_original != "undefined") {
return window.__doPostBack_HTMLEditor_original(eventTarget, eventArgument);}
return true;}
Sys.Extended.UI.HTMLEditor.getRealAttributeIE = function(element, name, source) {
var value = source;var n_value = "";function tempFunc(p0,p1) {
n_value = p1;}
element.outerHTML.replace(new RegExp("^(?:<[^>]*?"+name+"=\")([^\"]*?)\"","ig"),tempFunc);if (n_value == "") {
element.outerHTML.replace(new RegExp("^(?:<[^>]*?"+name+"=')([^']*?)'","ig"),tempFunc);}
if (n_value == "") {
element.outerHTML.replace(new RegExp("^(?:<[^>]*?"+name+"=)([^\s>]*?)","ig"),tempFunc);}
if (value != n_value && n_value != "") {
value = n_value;value = value.replace(/&amp;/g,"&");}
return value;}
Sys.Extended.UI.HTMLEditor.getRealAttribute = function(element,name) {
var searchName = name.toLowerCase();var attrs = element.attributes;var value = "";for (i = 0;i < attrs.length;++i) {
var a = attrs.item(i);if (!a.specified) continue;var name = a.name.toLowerCase();if (name == searchName) {
value = a.value;if (Sys.Extended.UI.HTMLEditor.isIE) {
value = Sys.Extended.UI.HTMLEditor.getRealAttributeIE(element, name, value);}
if (name == "src" || name == "href")
value = value.replace(/(\(S\([A-Za-z0-9_]+\)\)\/)/,"");break;}
}
return value;}
Sys.Extended.UI.HTMLEditor.enabledWordTags = [
"img",
"strong",
"p",
"b",
"i",
"u",
"a",
"h1",
"h2",
"h3",
"h4",
"h5",
"h6",
"table",
"tbody",
"tr",
"td",
"ul",
"ol",
"li",
"span",
"div",
"font",
"xml",
"del",
"ins",
"em",
"sub",
"sup",
"hr",
"br"
];Sys.Extended.UI.HTMLEditor.cleanUp = function(html) {
var old_ret;var ret = Sys.Extended.UI.HTMLEditor.Trim(html.replace(/[\x00-\x1F]+/g," "))
.replace(/^[^\u0000]+?<html(?:[^>]*?)>/gi,"").replace(/<\/html(?:[^>]*?)>[^\u0000]*$/gi,"")
.replace(/<head(?:[^>]*?)>[^\u0000]*?<\/head(?:[^>]*?)>/gi,"")
.replace(/<body[^>]*?>([^\u0000]*?)<\/body(?:[^>]*?)>/gi,"$1")
.replace(/<\/?html(?:[^>]*?)>/gi,"")
.replace(/<\/?head(?:[^>]*?)>/gi,"")
.replace(/<\/?body(?:[^>]*?)>/gi,"")
.replace(/<!--(\w|\W)+?-->/ig,"") 
.replace(/(<[\/]?)(?:o|v|x|p|w|\?xml):(\w+)([^>]*?>)/ig,"$1$2$3") 
.replace(/<(IMAGEDATA)([^>]*?)>/ig,"<img$2>") 
.replace(/<p[^>]*><p>&nbsp;<\/p><\/p>/ig,"<br>") 
.replace(/<p[^>]*?\/>/ig,"").replace(/<(p|div)[^>]*?>&nbsp;<\/(\1)[^>]*?>/ig,"").replace(/<(p|div)[^>]*?><\/(\1)[^>]*?>/ig,"");do {
old_ret = ret;ret = ret.replace(/<([^>]*)(?:class|size|lang|face|start|type|border|[ovwxp]:\w+)=(?:\'[^\']*\'|\"[^\"]*\"|[^> ]+)([^>]*)>/ig, "<$1$2>");}
while(ret != old_ret)
var div = document.createElement("div");div.innerHTML = ret;function diver(elem) {
var n = elem.childNodes.length;for(var i=0;i<elem.childNodes.length;i++) {
var child = elem.childNodes.item(i);if(child.nodeType==1){
if(child.tagName.indexOf("/")>=0) {
i--;child.parentNode.removeChild(child);} else {
var search = child.tagName.toLowerCase();var found = false;var nn = Sys.Extended.UI.HTMLEditor.enabledWordTags.length;for(var j=0;j < nn;j++) {
if(Sys.Extended.UI.HTMLEditor.enabledWordTags[j] == search) {
found = true;break;}
}
diver(child);if(!found) {
i += child.childNodes.length;while(child.firstChild) child.parentNode.insertBefore(child.firstChild,child);child.parentNode.removeChild(child);i--;} else {
var s_background_color = child.style.backgroundColor;var s_color = child.style.color;child.style.cssText ="";child.removeAttribute("style");if(child.getAttribute("width") && child.getAttribute("width").length > 0) child.style.width=child.getAttribute("width");if(child.width && child.width.length > 0) child.style.width=child.width;child.width ="";try{child.removeAttribute("width");}catch(e){}
if(child.getAttribute("height") && child.getAttribute("height").length > 0) child.style.height=child.getAttribute("height");if(child.height && child.height.length > 0) child.style.height=child.height;child.height ="";try{child.removeAttribute("height");}catch(e){}
if(search=="table") {
child.style.borderLeftWidth = "1px";child.style.borderLeftColor = "black";child.style.borderLeftStyle = "solid";child.style.borderTopWidth = "1px";child.style.borderTopColor = "black";child.style.borderTopStyle = "solid";child.style.backgroundColor = s_background_color;child.style.color = s_color;}
if(search=="td") {
child.style.borderRightWidth = "1px";child.style.borderRightColor = "black";child.style.borderRightStyle = "solid";child.style.borderBottomWidth = "1px";child.style.borderBottomColor = "black";child.style.borderBottomStyle = "solid";child.style.backgroundColor = s_background_color;child.style.color = s_color;}
if(search=="font" || search=="span") {
child.style.backgroundColor = s_background_color;child.style.color = s_color;var attrs = child.attributes;var n =0;for (var m = 0;m < attrs.length;++m) {
var a = attrs.item(m);if (!a.specified) continue;n++;}
if(n== 0 && child.style.cssText=="") {
i += child.childNodes.length;while(child.firstChild) child.parentNode.insertBefore(child.firstChild,child);child.parentNode.removeChild(child);i--;}
}
}
}
}
}
}
diver(div);ret = Sys.Extended.UI.HTMLEditor.Trim(div.innerHTML);delete div;ret = ret.replace(/<[\/]?(xml|del|ins)[^>]*?>/ig,"") // remove some tags (content should be remained)
.replace(/<(p|div)[^>]*?>/ig,"") 
.replace(/<\/(p|div)[^>]*?>/ig,"<br>");do {
old_ret = ret;ret = ret.replace(/<b><\/b>/ig,"").replace(/<i><\/i>/ig,"").replace(/<u><\/u>/ig,"").replace(/<strong><\/strong>/ig,"").replace(/<em><\/em>/ig,"").replace(/<sub><\/sub>/ig,"").replace(/<sup><\/sup>/ig,"");ret = ret.replace(/<span[^>]*?><\/span>/ig,"").replace(/<span>([^<]+?)<\/span>/ig,"$1");ret = ret.replace(/<font[^>]*?><\/font>/ig,"").replace(/<font>([^<]+?)<\/font>/ig,"$1");}
while(ret != old_ret)
ret = ret.replace(/&rsquo;/g, "'")
.replace(/&lsquo;/g, "'")
.replace(/&ndash;/g, "-")
.replace(/&mdash;/g, "-")
.replace(/&hellip;/g, "...")
.replace(/&quot;/g, "\"")
.replace(/&ldquo;/g, "\"")
.replace(/&rdquo;/g, "\"")
.replace(//g, "")
.replace(/&bull;/g, "")
.replace(/[ \s]+/g," ").replace(/((&nbsp;)+)/g,"&nbsp;");if(document.all) ret = ret.replace(/^[\x00-\x1F]*&nbsp;/,"");return ret;};Sys.Extended.UI.HTMLEditor.spanJoiner = function(element,doc, sFrom, sTo, nobr) {
var sIndex = 0;var sLength = element.childNodes.length;if(typeof sFrom != "undefined" && sFrom != null) sIndex = sFrom;if(typeof sTo != "undefined" && sTo != null) sLength = sTo;for(var i=sIndex;i< sLength;i++) {
var child = element.childNodes.item(i)
switch (child.nodeType) {
case 1: 
if(child.childNodes.length==0 && Sys.Extended.UI.HTMLEditor.isStyleTag(child.tagName) && child.tagName.toUpperCase() != "A" && !(child.className.length > 0 || (child.getAttribute("class") && child.getAttribute("class").length > 0)) && !Sys.Extended.UI.HTMLEditor.isTempElement(child)) {
element.removeChild(child);i--;sLength--;continue;} 
if( child.tagName.toUpperCase()=="SPAN") {
while(child.childNodes.length==1 && child.firstChild.nodeType==1) {
if(child.firstChild.tagName.toUpperCase()=="SPAN" && !Sys.Extended.UI.HTMLEditor.isTempElement(child.firstChild)) {
var attrs = Sys.Extended.UI.HTMLEditor.differAttr (child.firstChild,[]);var styles = Sys.Extended.UI.HTMLEditor.differStyle(child.firstChild);var oldSpan = child.firstChild;var chieldren = oldSpan.childNodes;while(oldSpan.firstChild != null) {
child.insertBefore(oldSpan.firstChild,oldSpan);}
for(var j=0;j < styles.length;j++) {
if(styles[j][1]) {
try {
if(child.style[styles[j][0]]) {
if(styles[j][0].toLowerCase().indexOf("color") >= 0) {
child.style[styles[j][0]] = styles[j][1];} else {
try {
var sv = child.style[styles[j][0]];child.style[styles[j][0]] = child.style[styles[j][0]]+" "+styles[j][1];if(sv == child.style[styles[j][0]]) {
child.style[styles[j][0]] = styles[j][1];}
}
catch(e) {
child.style[styles[j][0]] = styles[j][1];}
}
} else {
child.style[styles[j][0]] = styles[j][1];}
} catch (ee) {}
}
}
for(var j=0;j < attrs.length;j++) {
if(attrs[j][1]) {
child.setAttribute(attrs[j][0],attrs[j][1]);}
}
child.removeChild(oldSpan);continue;} else {
if(child.firstChild.tagName.toUpperCase()=="SPAN" && Sys.Extended.UI.HTMLEditor.isTempElement(child.firstChild)) {
var svv = child.firstChild;child.parentNode.insertBefore(child.firstChild,child);child.parentNode.removeChild(child);child = svv;}
}
break;}
var tempArr = [];var nextChild = child.nextSibling;while(!Sys.Extended.UI.HTMLEditor.isTempElement(child) && nextChild && i+1 < sLength && (nextChild.nodeType == 3 || (nextChild.nodeType == 1 &&
(nextChild.tagName.toUpperCase()=="SPAN" || (nextChild.tagName.toUpperCase()=="BR") && typeof nobr == "undefined") &&
!Sys.Extended.UI.HTMLEditor.isTempElement(nextChild)))) {
if(nextChild.nodeType == 3) {
if((""+nextChild.data+"").length==0) {
nextChild.parentNode.removeChild(nextChild);nextChild = child.nextSibling;sLength--;} else {
break;}
}
else {
if(nextChild.tagName.toUpperCase()=="BR") {
tempArr.push(nextChild);nextChild = nextChild.nextSibling;} else {
var attrs = Sys.Extended.UI.HTMLEditor.differAttr (child,[], nextChild);var styles = Sys.Extended.UI.HTMLEditor.differStyle(child, nextChild);if(attrs.length==0 && styles.length==0 && child.className == nextChild.className) {
var n = tempArr.length;for(var j=0;j < n;j++) {
child.appendChild(tempArr[j]);sLength--;}
tempArr = [];while(nextChild.firstChild) child.appendChild(nextChild.firstChild);nextChild.parentNode.removeChild(nextChild);nextChild = child.nextSibling;sLength--;} else {
break;}
}
}
}
if(!Sys.Extended.UI.HTMLEditor.isTempElement(child) && child.className.length == 0) {
var attrs = Sys.Extended.UI.HTMLEditor.differAttr (child,[]);var styles = Sys.Extended.UI.HTMLEditor.differStyle(child );if(attrs.length==0 && styles.length==0) {
i--;sLength--;while(child.firstChild) {
child.parentNode.insertBefore(child.firstChild,child);sLength++;}
child.parentNode.removeChild(child);continue;}
}
}
if(child.parentNode != null) {
if(child.childNodes.length==0 && Sys.Extended.UI.HTMLEditor.isStyleTag(child.tagName) && child.tagName.toUpperCase() != "A" && !(child.className.length > 0 || (child.getAttribute("class") && child.getAttribute("class").length > 0)) && !Sys.Extended.UI.HTMLEditor.isTempElement(child)) {
element.removeChild(child);i--;sLength--;continue;} else {
Sys.Extended.UI.HTMLEditor.spanJoiner(child,doc);}
}
break;}
}
};Sys.Extended.UI.HTMLEditor._styleTags = [
"strong",
"em",
"u",
"strike",
"s",
"span",
"font",
"b",
"sub",
"sup",
"a",
"i"
];Sys.Extended.UI.HTMLEditor.isStyleTag = function(tag) {
if(!tag) return false;for(var i=0;i< Sys.Extended.UI.HTMLEditor._styleTags.length;i++) {
if(Sys.Extended.UI.HTMLEditor._styleTags[i].toLowerCase()==tag.toLowerCase()) return true;}
return false;};Sys.Extended.UI.HTMLEditor.smartClassName = "MSIEparagraph";Sys.Extended.UI.HTMLEditor.noContextMenuAttribute= "obout-no-contextmenu";Sys.Extended.UI.HTMLEditor.isTempElement = function(el) {
if(el.id && el.id.length > 0 && el.id.indexOf(Sys.Extended.UI.HTMLEditor.smartClassName) >= 0) return true;return false;};Sys.Extended.UI.HTMLEditor.differAttr = function(element,pr, comp) {
var result = [];var parent = element.parentNode;if(typeof comp != "undefined") parent = comp;if(!parent || !parent.tagName || !Sys.Extended.UI.HTMLEditor.isStyleTag(parent.tagName)) parent = null;if(element.attributes)
for (var i=0;i < element.attributes.length;i++) {
var attr = element.attributes[i];var brk=false;for(var j=0;j < pr.length;j++) {
if(attr.name.toUpperCase() == pr[j].toUpperCase()) {
brk=true;break;}
}
if(brk) continue;if(attr.name.toUpperCase() == "STYLE") continue;if(attr.name.toUpperCase().substr(0,4) == "_MOZ") continue;if(attr.specified)
if(parent && parent.attributes && parent.attributes[attr.name]) {
var pattr= parent.attributes[attr.name];if(pattr) {
if(attr.name != pattr.name || attr.value != pattr.value) {
result.push([attr.name, attr.value]);}
}
} else {
if(attr.name.toUpperCase() == "CLASS" && attr.value =="") continue;result.push([attr.name, attr.value]);}
}
return result;};Sys.Extended.UI.HTMLEditor.differStyle = function(element, comp) {
var result = [];var parent = element.parentNode;if(typeof comp != "undefined") parent = comp;if(!parent || !parent.tagName || !Sys.Extended.UI.HTMLEditor.isStyleTag(parent.tagName)) parent = null;function _putStyle(i,_style) {
_style=""+_style;if(i.toLowerCase()=="textdecoration") {
var _arr = _style.split(" ");for(var j=0;j<_arr.length;j++) {
result.push([i, Sys.Extended.UI.HTMLEditor.Trim(_arr[j])]);}
} else {
result.push([i, _style]);}
}
for (var i in element.style) {
if(i && typeof i == "string" && i != "accelerator") {
var ii = i;if(!isNaN(parseInt(i))) {
if(!Sys.Extended.UI.HTMLEditor.isSafari) {
continue;}
ii = element.style[i];}
var style = element.style[ii];if(style && typeof style == "string" && style != "accelerator") {
if(parent && parent.style) {
var pstyle= parent.style [ii];if(ii.toLowerCase() != "csstext" && ii.toLowerCase() != "length")
if(style != pstyle) {
_putStyle(ii, style);}
} else {
if(ii.toLowerCase() != "csstext" && ii.toLowerCase() != "length") {
_putStyle(ii, style);}
}
}
}
}
if(typeof comp != "undefined")
for (var i in parent.style) {
if(i && typeof i == "string" && i != "accelerator") {
var ii = i;if(!isNaN(parseInt(i))) {
if(!Sys.Extended.UI.HTMLEditor.isSafari) {
continue;}
ii = element.style[i];}
var style = parent.style[ii];if(style && typeof style == "string" && style != "accelerator") {
var pstyle= element.style [ii];if(i.toLowerCase() != "csstext" && ii.toLowerCase() != "length")
if(style != pstyle) {
_putStyle(ii, style);}
}
}
}
return result;};Sys.Extended.UI.HTMLEditor.brXHTML = function(str) {
return str.replace(/<br>/ig, "<br/>");};Sys.Extended.UI.HTMLEditor._needsClosingTag = function(el) {
var closingTags = " script style div span a del strong em u strike font b sub sup p iframe li ul ol placeholder textarea td tr ";return (closingTags.indexOf(" " + el.tagName.toLowerCase() + " ") != -1);};Sys.Extended.UI.HTMLEditor._encodeText_ = function(str) {
return str.replace(/&/ig, "&amp;").replace(/</ig, "&lt;").replace(/>/ig, "&gt;").replace(/\"/ig, "&quot;").replace(/\xA0/ig, "&nbsp;");};Sys.Extended.UI.HTMLEditor._noNeedsClosingTag = function(el) {
var closingTags = " hr br ";return (closingTags.indexOf(" " + el.tagName.toLowerCase() + " ") != -1);};Sys.Extended.UI.HTMLEditor.canBeInsideP = function(el,prize)
{
if(el && el.style && el.style.display && el.style.display.toLowerCase()=="inline") return true;var name = el.tagName.toUpperCase();if(name.length==2) {
if(name.substr(0,1)=="H" && parseInt(name.substr(1,1)) > 0) {
return false;}
}
switch(name) {
case "TBODY" :
case "TR" :
case "TD" :
if(typeof prize != "undefined") {
var par = el.parentNode;while(par && par.tagName && par.tagName.toUpperCase() != "TABLE") par = par.parentNode;if(par.tagName.toUpperCase() == "TABLE" && par.style && par.style.display && par.style.display.toLowerCase() == "inline") {
return true;}
}
case "P" :
case "PRE" :
case "TABLE" :
case "OL" :
case "UL" :
case "LI" :
case "HR" :
case "DIV" :
case "BLOCKQUOTE" :
case "FORM" :
case "FIELDSET" :
case "LEGEND" :
return false;default:
return true;}
};Sys.Extended.UI.HTMLEditor.convertAlign = function(aval) {
var value;var n;try { n = parseInt(aval)-1;}
catch(e){return aval;}
switch(n) {
case 1:
value = "left";break;case 2:
value = "right";break;case 3:
value = "texttop";break;case 4:
value = "absmiddle";break;case 5:
value = "baseline";break;case 6:
value = "absbottom";break;case 7:
value = "bottom";break;case 8:
value = "middle";break;case 9:
value = "top";break;default:
value = aval.replace(/\"/g,"&quot;");}
return value;};Sys.Extended.UI.HTMLEditor.getHTML = function(root, outputRoot, must)
{
try {
if(typeof must == "undefined") {
if(!outputRoot && root.nodeType==1) {
return root.innerHTML;} else {
if(outputRoot && root.nodeType==1 && Sys.Extended.UI.HTMLEditor.isIE) {
return root.outerHTML;}
}
}
} catch(e){}
var html = new Sys.Extended.UI.HTMLEditor.jsDocument(true);Sys.Extended.UI.HTMLEditor._getHTML_(html, root, outputRoot);return html.toString();};Sys.Extended.UI.HTMLEditor._getHTML_ = function(html, root, outputRoot, must)
{
switch (root.nodeType) {
case 1: 
case 11: 
if(root.tagName && root.tagName.indexOf("/") >= 0) {
if(Sys.Extended.UI.HTMLEditor.isIE) {
var tag = root.tagName.toLowerCase().substr(root.tagName.indexOf("/")+1);var prev = root.previousSibling;if(tag == "embed") return;while(prev != null) {
if(prev.nodeType == root.nodeType && prev.tagName && prev.tagName.toLowerCase() == tag) {
html.append("</teo"+Sys.Extended.UI.HTMLEditor.smartClassName+":"+root.tagName.toLowerCase().substr(root.tagName.indexOf("/")+1)+">");return;}
prev = prev.previousSibling;}
}
return;}
var closed;var noSlash;var i;if (outputRoot && root.tagName.length >0) {
var tag = root.tagName.toLowerCase();closed = (!(root.hasChildNodes() || Sys.Extended.UI.HTMLEditor._needsClosingTag(root)));noSlash= true;var scope = "";if(Sys.Extended.UI.HTMLEditor.isIE && root.scopeName && typeof root.scopeName != "undefined") {
scope = (root.scopeName.toUpperCase()=="HTML")?"":(root.scopeName+":");}
if(Sys.Extended.UI.HTMLEditor.isIE && (closed || tag == "placeholder") && !Sys.Extended.UI.HTMLEditor._noNeedsClosingTag(root) && tag !="embed") {
var next = root.nextSibling;while(next != null) {
if(next.nodeType == root.nodeType && next.tagName) {
var nextTagName = next.tagName;if(nextTagName.indexOf("/") >= 0)
if(nextTagName.toLowerCase().substr(nextTagName.indexOf("/")+1) == tag) {
closed = false;noSlash= false;break;}
}
next = next.nextSibling;}
}
if(!Sys.Extended.UI.HTMLEditor.canBeInsideP(root)) {
html.append("\n");}
html.append("<"+((!closed && !noSlash)?"teo"+Sys.Extended.UI.HTMLEditor.smartClassName+":":scope)+ tag);if(Sys.Extended.UI.HTMLEditor.isIE && root.name && root.name.length > 0) {
html.append(" name=\"" + root.name.replace(/\"/g,"&quot;") + '"');}
if(Sys.Extended.UI.HTMLEditor.isIE && root.value && root.value.length > 0 && tag != "textarea") {
html.append(" value=\"" + root.value.replace(/\"/g,"&quot;") + '"');}
if(Sys.Extended.UI.HTMLEditor.isIE && root.className && root.className.length > 0) {
html.append(" class=\"" + root.className.replace(/\"/g,"&quot;") + '"');}
if(Sys.Extended.UI.HTMLEditor.isIE && root.align && root.align.length > 0) {
html.append(" align=\"" + root.align.replace(/\"/g,"&quot;") + '"');}
if(Sys.Extended.UI.HTMLEditor.isIE && root.color && root.color.length > 0) {
html.append(" color=\"" + root.color.replace(/\"/g,"&quot;") + '"');}
if(Sys.Extended.UI.HTMLEditor.isIE && root.size && root.size.length > 0) {
html.append(" size=\"" + root.size.replace(/\"/g,"&quot;") + '"');}
var attrs = root.attributes;var cssForSafari = null;for (i = 0;i < attrs.length;++i) {
var a = attrs.item(i);if (!a.specified) continue;var name = a.name.toLowerCase();if (name.substr(0, 4) == "_moz") {
continue;}
if (name == "teoalign") {
continue;}
var value;if (name != 'style') {
if(name=='width') {
value= root.width;if(Sys.Extended.UI.HTMLEditor.isIE && value == 0) {
var n_value = 0;root.outerHTML.replace(new RegExp("^(?:<[^>]*?width=)([\\d]+)","ig"),function(p0,p1){n_value = p1;});if(value != n_value) value = n_value;}
}
else
if(name=='height') {
value= root.height;if(Sys.Extended.UI.HTMLEditor.isIE && value == 0) {
var n_value = 0;root.outerHTML.replace(new RegExp("^(?:<[^>]*?height=)([\\d]+)","ig"),function(p0,p1){n_value = p1;});if(value != n_value) value = n_value;}
}
else
if(Sys.Extended.UI.HTMLEditor.isIE && name=='name' && root.name && root.name.length > 0 )
continue;else
if(Sys.Extended.UI.HTMLEditor.isIE && name=='value' && root.value && root.value.length > 0 )
continue;else
if(Sys.Extended.UI.HTMLEditor.isIE && name=='align' && root.align && root.align.length > 0 )
continue;else
if(Sys.Extended.UI.HTMLEditor.isIE && name=='class' && root.className && root.className.length > 0 )
continue;else
if(Sys.Extended.UI.HTMLEditor.isIE && name=='color' && root.color && root.color.length > 0 )
continue;else
if(Sys.Extended.UI.HTMLEditor.isIE && name=='size' && root.size && root.size.length > 0 )
continue;else {
if(tag=="embed" && name=="align" && (Sys.Extended.UI.HTMLEditor.isIE)) {
value = Sys.Extended.UI.HTMLEditor.convertAlign(a.value);}
else {
value = a.value;if(Sys.Extended.UI.HTMLEditor.isSafari && name == "class") {
if(/apple-style/ig.test(value)) {
continue;}
}
if(name == "src" || name == "href") {
if (Sys.Extended.UI.HTMLEditor.isIE) {
value = Sys.Extended.UI.HTMLEditor.getRealAttributeIE(root, name, value);}
value = value.replace(/(\(S\([A-Za-z0-9_]+\)\)\/)/,"");}
value = value.replace(/\"/g,"&quot;");}
}
} else {
if(Sys.Extended.UI.HTMLEditor.isSafari) {
cssForSafari = a.value;}
continue;}
var qchar = "\"";if((""+value+"").indexOf("\"") >= 0) qchar="'";if(name != null) html.append(" " + name + '=' + qchar + value + qchar);}
if(root.style.cssText.length > 0 || cssForSafari != null) {
var name = "style";var re1 = /(url\((?:[^\)]*)\))/ig;var urls = [];function f2($0,$1) {
urls.push($1);}
var value = ((cssForSafari !=null)?cssForSafari:root.style.cssText).toLowerCase();value.replace(re1, f2);var times = 0;function f3() {
var temp = urls[times];times++;return temp;}
value = Sys.Extended.UI.HTMLEditor.tryReplaceRgb(value.replace(re1, f3)).replace(/(font-weight\s*:\s*)(700)/ig, "$1bold")
.replace(/([\s]*-moz-[^;]*[;][\s]*)/ig, "").replace(/(-moz-.*)$/i, "")
.replace(/(background-position: 0% 0%[;]*[\s]*)/ig, "");if(Sys.Extended.UI.HTMLEditor.isSafari) {
function repSaf($0,$1,$2,$3) {
return $1+$2.replace(/(,)/g,"")+$3;}
value = value.replace(/(text-decoration:)([^;$]+)([;$])/ig, repSaf);}
if(Sys.Extended.UI.HTMLEditor.isSafari || Sys.Extended.UI.HTMLEditor.isOpera) {
function repSafOp($0,$1,$2,$3) {
return $1+$2.replace(/(['"])/g,"")+$3;}
value = value.replace(/(font-family:)([^;]+)([;]*)/ig, repSafOp);}
if(value.length > 0) {
var qchar = "\"";if((""+value+"").indexOf("\"") >= 0) qchar="'";html.append(" " + name + '=' + qchar + value + qchar);}
}
html.append(closed ? " />" : ">");if(tag=="br") html.append("\n");}
if(root.tagName && root.tagName.toUpperCase()=="SCRIPT") html.append(root.text);if(root.tagName && root.tagName.toUpperCase()=="STYLE") {
html.append(root.innerHTML);} else {
for (i = root.firstChild;i;i = i.nextSibling) {
Sys.Extended.UI.HTMLEditor._getHTML_(html,i, true)
}
}
if (outputRoot && root.tagName.length >0 && !closed && noSlash) {
html.append("</" + scope + root.tagName.toLowerCase() + ">");}
break;case 3: 
html.append(Sys.Extended.UI.HTMLEditor._encodeText_(""+root.data+""));break;case 8: 
if(root.length > 0) {
html.append("<!--" + root.data + "-->");} else { 
html.append("<!---->");}
break;}
};Sys.Extended.UI.HTMLEditor.RemoveContextMenu = function() {
var editor = this;var hhh=editor._contextElement.parentNode.removeChild(editor._contextElement);if (hhh) delete hhh;editor._contextElement=null;editor._contextTable=null;if (editor.__saved_range__){
editor.__saved_range__.select();editor.__saved_range__=null;}
};Sys.Extended.UI.HTMLEditor.contentEditable = function(el, prize) {
while(el != null) {
try {
var mean = null;if(el.contentEditable != null && typeof el.contentEditable != "undefined" && !(Sys.Extended.UI.HTMLEditor.isSafari || Sys.Extended.UI.HTMLEditor.isOpera)) {
if(!el.contentEditable || el.contentEditable=="false") {
mean = false;} else {
mean = true;}
}
else {
var value = el.getAttribute("contenteditable");if(typeof value == "boolean") {
mean = value;} else {
if(typeof value == "string" && value.toLowerCase()=="false") {
mean = false;}
}
}
if(mean != null && typeof mean == "boolean") {
if(!mean) {
return el;}
}
} catch(ex) {}
if(typeof prize != "undefined" && prize) {
return null;}
if(el.tagName != null && typeof el.tagName != "undefined" && (el.tagName.toUpperCase()=="BODY" || el.tagName.toUpperCase()=="HTML")) {
break;}
el = el.parentNode;}
return null;};Sys.Extended.UI.HTMLEditor.getSelParent = function (editor) {
var sel = editor._getSelection();var range = editor._createRange(sel);var parent = null;if(Sys.Extended.UI.HTMLEditor.isIE) {
if(sel.type.toLowerCase()=="control")
parent =range.item(0);else
parent= editor._getParent(range);} else {
parent= editor._getParent(range);if(parent.nodeType != 3 && range.startContainer==range.endContainer) {
var p=parent;parent = parent.childNodes.item(range.startOffset);if(parent==null) parent=p;}
}
return parent;};Sys.Extended.UI.HTMLEditor.__getIndex = function(el) {
var ind =0;if(el.parentNode) {
for(;ind<el.parentNode.childNodes.length;ind++) {
if(el.parentNode.childNodes.item(ind)==el) {
break;}
}
}
return ind;};Sys.Extended.UI.HTMLEditor.isInlineElement = function(el) {
if(el.nodeType == 3) return true;if(el.nodeType != 1) return false;if(!el.tagName || el.tagName.length == 0) return false;if(el && el.style && el.style.display && el.style.display.toLowerCase()=="inline") return true;var name = el.tagName.toUpperCase();if(name.length==2) {
if(name.substr(0,1)=="H" && parseInt(name.substr(1,1)) > 0) {
return false;}
}
switch(name) {
case "BR" :
case "TBODY" :
case "TR" :
case "TD" :
case "P" :
case "PRE" :
case "TABLE" :
case "OL" :
case "UL" :
case "LI" :
case "HR" :
case "DIV" :
case "BLOCKQUOTE" :
case "FORM" :
case "FIELDSET" :
case "LEGEND" :
return false;default:
return true;}
};Sys.Extended.UI.HTMLEditor.capLock = function(e) { 
var kc = e.charCode;var sk = e.shiftKey?e.shiftKey:((kc == 16)?true:false);if(((kc >= 65 && kc <= 90) && !sk)||((kc >= 97 && kc <= 122) && sk))
return true;else
return false;};Sys.Extended.UI.HTMLEditor.operateAnchors = function(editor, _doc, _prize) {
var aList = _doc.getElementsByTagName("A");var ret = false;for(var i=0;i < aList.length;i++) {
var a = aList[i];if( a.name && a.name.length > 0) {
var imgToDelete = [];for(var j=0;j < a.childNodes.length;j++) {
var node = a.childNodes.item(j);if(node.nodeType==1 && node.tagName && node.tagName.toUpperCase()=="IMG" && node.src==editor._editPanel.get_imagePath_anchor()) {
imgToDelete.push(node);ret = true;}
}
while (imgToDelete.length > 0) {
a.removeChild(imgToDelete.pop());}
if(!_prize) {
var img = _doc.createElement("IMG");img.title = a.name;img.src = editor._editPanel.get_imagePath_anchor();img.setAttribute(editor.noContextMenuAttributeName(),"yes");a.appendChild(img);}
}
}
return ret;};Sys.Extended.UI.HTMLEditor.operatePlaceHolders = function(editor, _doc, _prize) {
var ret = false;if(_prize) {
var tempCollection = _doc.getElementsByTagName("IMG");var aList =[];for(var i=0;i<tempCollection.length;i++) {
aList.push(tempCollection[i]);}
for(var i=0;i < aList.length;i++)
{
var a = aList[i];var dum = a.getAttribute("dummytag");if(dum && dum.length > 0 && dum.toLowerCase()=="placeholder") {
var ph = _doc.createElement("PLACEHOLDER");var title = a.title;if(title==null || typeof title=="undefined") {
title = a.getAttribute("title");}
ph.name = title;ph.setAttribute("name",title);a.parentNode.insertBefore(ph,a);a.parentNode.removeChild (a);ret = true;}
}
} else {
var tempCollection = _doc.getElementsByTagName("PLACEHOLDER");var aList =[];for(var i=0;i<tempCollection.length;i++) {
aList.push(tempCollection[i]);}
for(var i=0;i < aList.length;i++) {
var a = aList[i];var nd = true;try {
if(a.childNodes.length > 0) {
nd = false;}
} catch(ex) {}
if(nd) {
var name = a.name;if(name==null || typeof name=="undefined") {
name = a.getAttribute("name");}
var img = _doc.createElement("IMG");img.title = name;img.src = editor._editPanel.get_imagePath_placeHolder();img.setAttribute("dummytag","placeholder");img.setAttribute("title",name);a.parentNode.insertBefore(img,a);a.parentNode.removeChild (a);}
}
}
return ret;};Sys.Extended.UI.HTMLEditor.inspectForShadows = function(el) {
var aList = el.getElementsByTagName("IMG");for(var i=0;i < aList.length;i++)
{
if(aList[i].getAttribute(Sys.Extended.UI.HTMLEditor.attachedIdAttribute) && aList[i].getAttribute(Sys.Extended.UI.HTMLEditor.attachedIdAttribute).length > 0) {
try {
if(Sys.Extended.UI.HTMLEditor.isIE) {
$removeHandler(aList[i],"dragstart", Sys.Extended.UI.HTMLEditor.stopDrag);} else {
$removeHandler(aList[i],"draggesture", Sys.Extended.UI.HTMLEditor.stopDrag);}
} catch(e) {}
if(Sys.Extended.UI.HTMLEditor.isIE) {
$addHandler(aList[i],"dragstart", Sys.Extended.UI.HTMLEditor.stopDrag);} else {
$addHandler(aList[i],"draggesture", Sys.Extended.UI.HTMLEditor.stopDrag);}
}
}
};Sys.Extended.UI.HTMLEditor.attachedIdAttribute= "obout-attached-id";Sys.Extended.UI.HTMLEditor.stopDrag = function(ev)
{
if(ev) ev.stopPropagation();ev.preventDefault();return false;};Sys.Extended.UI.HTMLEditor.replacingRules =
[
[ "strong" ,"font-weight" , "bold" ],
[ "b" ,"font-weight" , "bold" ],
[ "strong" ,"font-weight" , "700" ],
[ "em" ,"font-style" , "italic" ],
[ "i" ,"font-style" , "italic" ],
[ "u" ,"text-decoration" , "underline" ],
[ "strike" ,"text-decoration" , "line-through" ]
];Sys.Extended.UI.HTMLEditor.replaceOldTags = function(root,editor) {
var innerHTML = root.innerHTML;var need = false;for(var j=0;j < Sys.Extended.UI.HTMLEditor.replacingRules.length;j++) {
var reg = new RegExp("<"+Sys.Extended.UI.HTMLEditor.replacingRules[j][0]+"[\s>]", "ig");if(reg.test(innerHTML)) {
need = true;break;}
}
if(!need) {
if(!(/<font[\s>]/ig.test(innerHTML))) {
return;}
}
for(var i=0;i<root.childNodes.length;i++) {
var child = root.childNodes.item(i);if(child.nodeType == 1) {
var found = null;var childTagName = child.tagName.toLowerCase();for(var j=0;j < Sys.Extended.UI.HTMLEditor.replacingRules.length;j++) {
if(Sys.Extended.UI.HTMLEditor.replacingRules[j][0].toLowerCase() == childTagName) {
found = Sys.Extended.UI.HTMLEditor.replacingRules[j];break;}
}
if(found) {
var span = editor._doc.createElement("SPAN");span.style["cssText"] = child.style["cssText"];if(Sys.Extended.UI.HTMLEditor.isIE) {
span.style[found[1]] = found[2];} else {
span.style[found[1].replace(/\-(\w)/g, function (strMatch, p1){return p1.toUpperCase();})] = found[2];}
while(child.firstChild) {
span.appendChild(child.firstChild);}
root.insertBefore(span,child);root.removeChild(child);child = span;} else {
if(childTagName == "font") {
var span = editor._doc.createElement("SPAN");var save = child.size;span.style["cssText"] = child.style["cssText"];if(child.color) {
span.style.color = child.color;}
if(child.face ) {
span.style.fontFamily = child.face;}
while(child.firstChild) {
span.appendChild(child.firstChild);}
root.insertBefore(span,child);root.removeChild(child);if(save) {
var font = editor._doc.createElement("FONT");font.size = save;root.insertBefore(font,span);if(span.style["cssText"].length > 0) {
font.appendChild(span);child = span;} else {
while(span.firstChild) {
font.appendChild(span.firstChild);}
root.removeChild(span);child = font;}
} else {
child = span;}
}
}
Sys.Extended.UI.HTMLEditor.replaceOldTags(child,editor);}
}
};Sys.Extended.UI.HTMLEditor.getStyle = function(oElm, strCssRule) {
var strValue = "";if(oElm.nodeType==1) {
if(oElm.ownerDocument && oElm.ownerDocument.defaultView && oElm.ownerDocument.defaultView.getComputedStyle) {
strValue = oElm.ownerDocument.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);}
else if(oElm.currentStyle) {
try {
strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){return p1.toUpperCase();});strValue = oElm.currentStyle[strCssRule];} catch(ex) {
strValue = oElm.style[strCssRule];}
} else {
strValue = oElm.style[strCssRule];}
}
return strValue;};Sys.Extended.UI.HTMLEditor._Marker = function(editor,rng,sel) {
if(Sys.Extended.UI.HTMLEditor.isIE) {
this._nArr = Sys.Extended.UI.HTMLEditor.getNames(editor._doc.body);this._save = editor._doc.body.innerHTML;this._tree = null;if(sel.type.toLowerCase()=="control") {
try {
var el = rng.item(0);this._tree =[];while(el && (el.nodeType==3 || !el.tagName || el.tagName.toUpperCase() != "BODY")) {
var n=0;while(el.previousSibling) {
n++;el = el.previousSibling;}
this._tree.push(n);el = el.parentNode;}
} catch(e){}
} else {
this._offsetLeft=rng.offsetLeft;this._offsetTop =rng.offsetTop;}
} else {
if(Sys.Extended.UI.HTMLEditor.isOpera) {
this._save = Sys.Extended.UI.HTMLEditor.Trim(editor._doc.body.innerHTML);} else {
this._save = editor._doc.body.cloneNode(true);}
this._tree =[];this._offset= 0;try {
var el =rng.startContainer;this._offset=rng.startOffset;if(el && el.nodeType==1 && el.tagName.toUpperCase()=="HTML") {
el = editor._doc.body;setTimeout(function(){
try {
sel = editor._getSelection();rng = editor._createRange();editor._removeAllRanges(sel);rng.setStart(el,0);rng.setEnd (el,0);editor._selectRange(sel,rng);} catch(e) {}
},0);}
while(el && el.nodeType && (el.nodeType==3 || !el.tagName || el.tagName.toUpperCase() != "BODY")) {
var n=0;while(el.previousSibling) {
n++;if(Sys.Extended.UI.HTMLEditor.isOpera) {
if(el.nodeType == 3 && el.previousSibling != null && el.previousSibling.nodeType == 3) {
n--;}
}
el = el.previousSibling;}
this._tree.push(n);el = el.parentNode;}
} catch(e) {}
}
};Sys.Extended.UI.HTMLEditor.__stackMaxSize = 30;Sys.Extended.UI.HTMLEditor.getNames = function(el) {
var aList = el.all;var mArr = [];var nArr =[]
for(var i=0;i < aList.length;i++) {
var a = aList[i];if(a.name && a.name.length > 0) {
var tag = a.tagName;var coll= el.getElementsByTagName(tag);var n = 0;for(var j=0;j < coll.length;j++) {
if(coll[j] == a) {
n = j;break;}
}
nArr[tag] = n;mArr.push([tag,nArr[tag],a.name]);}
}
return mArr;};Sys.Extended.UI.HTMLEditor.setNames = function(el,mArr) {
for(var i=0;i < mArr.length;i++) {
if(el.getElementsByTagName(mArr[i][0]).length > mArr[i][1]) {
el.getElementsByTagName(mArr[i][0])[mArr[i][1]].name = mArr[i][2];}
}
};Sys.Extended.UI.HTMLEditor._lookChild = function(root,seek) {
for(var i=0;i<root.childNodes.length;i++) {
var child = root.childNodes.item(i);if(child==seek) {
return i;}
if(child.nodeType==1) {
if(Sys.Extended.UI.HTMLEditor._lookChild(child,seek) >= 0 ) {
return i;}
}
}
return -1;};Sys.Extended.UI.HTMLEditor.getHrefsText = function(txt) {
var result =[]
function regRepl(p0,p1,p2,p3,p4,p5,p6,p7) {
var tag = p1.replace(/^<([^\s>]+)/,"$1");var insert =true;var i =0;for(;i < result.length;i++) {
if(result[i][0] == tag) {
insert = false;break;}
}
if(insert) {
result[i] =[tag];}
result[i].push(p5);};var reg = new RegExp("(<[^\\s><]+)([^><]*?)(href=)(\"|')([^\\4]*?)(\\4)((?:[^><]*?)>)","ig");txt.replace(reg,regRepl);return result;};Sys.Extended.UI.HTMLEditor.setHrefsText = function(el,mArr) {
for(var j=0;j < mArr.length;j++) {
var aList = el.getElementsByTagName(mArr[j][0]);var k=1;for(var i=0;i < aList.length;i++) {
if(!aList[i].href) {
continue;}
if(mArr[j][k] && mArr[j][k].length > 0) {
aList[i].href = mArr[j][k].replace(/&amp;/ig,"&");}
k++;}
}
};Sys.Extended.UI.HTMLEditor.getImagesText = function(txt) {
var mArr = [];function regRepl(p0,p1,p2,p3,p4,p5) {
mArr.push(p3);return p0;}
txt.replace(/(<img(?:.*?))(src=")(.*?)(")((?:.*?)>)/ig,regRepl);return mArr;};Sys.Extended.UI.HTMLEditor.setImagesText = function(el,mArr) {
var aList = el.getElementsByTagName("IMG");var k=0;for(var i=0;i < aList.length;i++) {
if(!aList[i].src) {
continue;}
if(mArr[k] && mArr[k].length > 0) {
aList[i].src = mArr[k].replace(/&amp;/ig,"&");}
k++;}
};Sys.Extended.UI.HTMLEditor.canHaveChildren = function(elem) {
if(Sys.Extended.UI.HTMLEditor.isIE) {
return elem.canHaveChildren;} else {
return !/^(area|base|basefont|col|frame|hr|img|br|input|isindex|link|meta|param)$/.test(elem.tagName.toLowerCase());}
};Sys.Extended.UI.HTMLEditor._setCursor = function(el1,editor) {
var el = el1;if(Sys.Extended.UI.HTMLEditor.isIE) {
var sel = editor._getSelection();var range=editor._createRange(sel);if(sel.type.toLowerCase() == "control") {
range.remove(0);sel.empty();range = editor._createRange();}
var isText = (el.nodeType==3);var span;if(isText)
{
span = editor._doc.createElement("SPAN");span.innerHTML = "&nbsp;";el.parentNode.insertBefore(span,el);el = span;}
var location = $common.getLocation(el);var _left = location.x, _top = location.y;if(isText) {
span.parentNode.removeChild(span);}
try {
range.moveToPoint(_left,_top);} catch(e) {}
range.select();} else {
var sel = editor._getSelection();var range=editor._createRange();range.setStart(el, 0);range.setEnd(el, 0);editor._removeAllRanges(sel);editor._selectRange(sel,range);editor.focusEditor();}
};Sys.Extended.UI.HTMLEditor.myClone = function(el,doc,prize) {
var ela;if(Sys.Extended.UI.HTMLEditor.isIE && el.tagName && (el.tagName.toUpperCase()=="EMBED" || el.tagName.toUpperCase()=="OBJECT")) {
var div = doc.createElement("DIV");try { 
div.innerHTML = el.outerHTML;ela = div.firstChild;} catch(e) {
ela = el;}
delete div;} else {
ela = el.cloneNode(prize);}
return ela;};Sys.Extended.UI.HTMLEditor.unStyle = function(el) {
var _prn = (el.parentNode != null && typeof el.parentNode != "undefined")?el.parentNode:null;if(_prn) {
var _fnd = null;while ( _prn && _prn.tagName && _prn.tagName.toUpperCase() != "BODY" && Sys.Extended.UI.HTMLEditor.isStyleTag(_prn.tagName) &&
(_prn.tagName.toUpperCase() != "A")) {
_fnd = _prn;_prn = _prn.parentNode;}
if(_fnd) {
function diver(add,el, rpr, before, prize) {
var par=rpr.cloneNode(false);if(add) {
if(add.push && typeof add.push == "function") {
for(var iii=0;iii < add.length;iii++) {
par.appendChild(add[iii]);}
} else {
par.appendChild(add);}
}
if(prize) {
par.appendChild(el);} else {
while(el) {
var elSibling=before?el.previousSibling:el.nextSibling;if(el.nodeType==1 || (el.nodeType==3 && Sys.Extended.UI.HTMLEditor.Trim(""+el.data+"").length>0)) {
if(el.nodeType==1) {
if(el.tagName && Sys.Extended.UI.HTMLEditor.isStyleTag(el.tagName) && el.childNodes.length==0 && !Sys.Extended.UI.HTMLEditor.isTempElement(el)) {
el=null;}
}
if(el) {
if(par.childNodes.length == 0 || !before) {
par.appendChild(el);} else {
par.insertBefore(el,par.firstChild);}
}
}
el=elSibling;}
}
if(par.childNodes.length==0) {
delete par;par=null;}
else if(par.childNodes.length==1 && par.firstChild.nodeType==3 && (""+par.firstChild.data+"").length==0) {
delete par;par=null;} else {
if(!prize && par.tagName && Sys.Extended.UI.HTMLEditor.isStyleTag(par.tagName) && (par.tagName.toUpperCase() != "A") && !Sys.Extended.UI.HTMLEditor.isTempElement(par)) {
var elNumber = par.childNodes.length;for(var cnt=0;cnt< par.childNodes.length;cnt++) {
var inn = par.childNodes.item(cnt);if(inn.nodeType==1 && inn.tagName && !Sys.Extended.UI.HTMLEditor.isStyleTag(inn.tagName) &&
(inn.tagName.toUpperCase()=="BR" || inn.tagName.toUpperCase()=="TABLE" ||
Sys.Extended.UI.HTMLEditor.isTempElement(inn))) {
elNumber--;}
}
if(elNumber == 0) {
var parr = [];while(par.firstChild) {
var inn = par.removeChild(par.firstChild);parr.push(inn);}
par = parr;}
}
}
if(rpr==_fnd) {
return par;} else {
if(!prize) {
return diver(par,before?rpr.previousSibling:rpr.nextSibling,rpr.parentNode,before,prize);} else {
return diver(null,par,rpr.parentNode,before,prize);}
}
};_prn = el.parentNode;if( el.previousSibling == null && el.nextSibling == null &&
_prn && _prn.tagName && _prn.tagName.toUpperCase() != "BODY" && Sys.Extended.UI.HTMLEditor.isStyleTag(_prn.tagName) &&
Sys.Extended.UI.HTMLEditor.differAttr(_prn,["class","color","face","size"]).length > 0) {
el = _prn;}
var p1 = diver(null,el.previousSibling,el.parentNode,true , false);var p2 = diver(null,el.nextSibling ,el.parentNode,false, false);var par = _fnd.parentNode;if(p1) {
if(p1.push && typeof p1.push == "function") {
for(var iii=0;iii < p1.length;iii++) {
par.insertBefore(p1[iii],_fnd);}
} else {
par.insertBefore(p1,_fnd);}
}
if(el.nodeType==1 && el.tagName &&
(el.tagName.toUpperCase()=="BR" || el.tagName.toUpperCase()=="TABLE" ||
Sys.Extended.UI.HTMLEditor.isTempElement(el))) {
par.insertBefore(el,_fnd);} else {
var p3 = diver(null,el,el.parentNode,false, true);par.insertBefore(p3,_fnd);}
if(p2) {
if(p2.push && typeof p2.push == "function") {
for(var iii=0;iii < p2.length;iii++) {
par.insertBefore(p2[iii],_fnd);}
} else {
par.insertBefore(p2,_fnd);}
}
par.removeChild (_fnd);}
}
};Sys.Extended.UI.HTMLEditor.isTempElement = function(el) {
if(el.id && el.id.length > 0 && el.id.indexOf(Sys.Extended.UI.HTMLEditor.smartClassName) >= 0) {
return true;}
return false;};Sys.Extended.UI.HTMLEditor._moveTagsUp = function(lBound,rBound) {
function _dive(next) {
if(!Sys.Extended.UI.HTMLEditor.isInlineElement(next)) {
Sys.Extended.UI.HTMLEditor.unStyle(next);} else if(next.tagName && Sys.Extended.UI.HTMLEditor.isStyleTag(next.tagName) && (next.tagName.toUpperCase() != "A") && !Sys.Extended.UI.HTMLEditor.isTempElement(next)) {
var nnn = next.firstChild;while(nnn != null) {
var nnnNext = nnn.nextSibling;_dive(nnn);nnn = nnnNext;}
}
}
var next = lBound;while(next != null && next != rBound) {
var nextSibling = next.nextSibling;_dive(next);next = nextSibling;}
};Sys.Extended.UI.HTMLEditor._commonTotalParent = function(first,last) {
var ret = null;var par = first.parentNode;var fst = first;while (par) {
if(par.tagName && !Sys.Extended.UI.HTMLEditor.isStyleTag(par.tagName)) {
var indexLast = Sys.Extended.UI.HTMLEditor._lookChild(par,last);if(indexLast >=0 ) {
var indexFirst = 0;for(var i=0;i < par.childNodes.length;i++) {
if(par.childNodes.item(i) == fst) {
indexFirst = i;break;}
}
return {parent: par, indexFirst: indexFirst, indexLast: indexLast};}
}
fst = par;par = par.parentNode;}
return ret;};Sys.Extended.UI.HTMLEditor._commonParent = function(first,last) {
var ret = null;var par = first.parentNode;var fst = first;while (par && par.tagName.toUpperCase() != "BODY" && Sys.Extended.UI.HTMLEditor.isStyleTag(par.tagName)) {
var indexLast = Sys.Extended.UI.HTMLEditor._lookChild(par,last);if(indexLast >=0 ) {
var indexFirst = 0;for(var i=0;i < par.childNodes.length;i++) {
if(par.childNodes.item(i) == fst) {
indexFirst = i;break;}
}
return {parent: par, indexFirst: indexFirst, indexLast: indexLast};}
fst = par;par = par.parentNode;}
return ret;};Sys.Extended.UI.HTMLEditor.positionInParagraph = function(marker,el,left,par,wordBound) {
while(true){
var result = Sys.Extended.UI.HTMLEditor.positionInParagraphLevel(marker,el,left,wordBound);if(result != null) {
return result;}
if(par.tagName && Sys.Extended.UI.HTMLEditor.isStyleTag(par.tagName) && (par.tagName.toUpperCase() != "A") && !Sys.Extended.UI.HTMLEditor.isTempElement(par)) {
el = left?par.previousSibling:par.nextSibling;par = par.parentNode;} else {
if(!left || par.firstChild == null) {
par.appendChild(marker);} else {
par.insertBefore(marker,par.firstChild);}
return marker;}
}
};Sys.Extended.UI.HTMLEditor.positionInParagraphLevel = function(marker,el,left,wordBound) {
while(el) {
var elSibling = left?el.previousSibling:el.nextSibling;if(!Sys.Extended.UI.HTMLEditor.isInlineElement(el)) {
var par = el.parentNode;if(!left) {
par.insertBefore(marker,el);} else{
if(el.nextSibling) {
par.insertBefore(marker,el.nextSibling);} else {
par.appendChild (marker);}
}
return marker;}
else if(typeof wordBound == "function" && el.nodeType==3) {
var j;var str = ""+el.data+"";if(left) {
for(j=str.length-1;j >= 0;j--) {
if(wordBound(str.substr(j,1))) {
break;}
}
} else {
for(j=0;j < str.length;j++) {
if(wordBound(str.substr(j,1))) {
break;}
}
}
if(j >= 0 && j < str.length) {
var par = el.parentNode;var newNode;if((j > 0 || (left && j==0)) && (j < str.length-1 || (!left && j==str.length-1))) {
if(left) {
newNode = el.splitText(j+1);} else {
newNode = el.splitText(j);}
par.insertBefore(marker,newNode);} else {
if(!left) {
par.insertBefore(marker,el);} else {
if(el.nextSibling) {
par.insertBefore(marker,el.nextSibling);} else {
par.appendChild (marker);}
}
}
return marker;}
}
el = left?el.lastChild:el.firstChild;if(el) {
var result = Sys.Extended.UI.HTMLEditor.positionInParagraphLevel(marker,el,left,wordBound);if(result != null) {
return result;}
}
el=elSibling;}
return null;};Sys.Extended.UI.HTMLEditor._addEvent = function(el, evname, func){
if(el.attachEvent)
el.attachEvent("on" + evname, func);else if(el.addEventListener)
el.addEventListener(evname, func, true);};Sys.Extended.UI.HTMLEditor._addEvents = function(el, evs, func) {
for(var i=0;i < evs.length;i++)
Sys.Extended.UI.HTMLEditor._addEvent(el, evs[i], func);};Sys.Extended.UI.HTMLEditor._removeEvent = function(el, evname, func) {
if(el.detachEvent)
el.detachEvent("on" + evname, func);else if(el.removeEventListener)
el.removeEventListener(evname, func, true);};Sys.Extended.UI.HTMLEditor._removeEvents = function(el, evs, func) {
for(var i=0;i < evs.length;i++)
Sys.Extended.UI.HTMLEditor._removeEvent(el, evs[i], func);};Sys.Extended.UI.HTMLEditor._stopEvent = function(ev) {
if(ev) {
if (Sys.Extended.UI.HTMLEditor.isIE) {
ev.cancelBubble = true;ev.returnValue = false;} else {
ev.preventDefault();ev.stopPropagation();}
}
};Sys.Extended.UI.HTMLEditor.restrictedTags = ["DIV","P","TD","TR","TABLE","TBODY","LI","OL","UL","FORM","INPUT"];Sys.Extended.UI.HTMLEditor.isRestricted = function(element) {
var elementTagName = element.tagName.toUpperCase();for(var i=0;i < Sys.Extended.UI.HTMLEditor.restrictedTags.length;i++) {
if (Sys.Extended.UI.HTMLEditor.restrictedTags[i].toUpperCase() == elementTagName) {
return true;}
}
if(Sys.Extended.UI.HTMLEditor.isIE && element.scopeName.toUpperCase()!="HTML") {
return true;}
return false;};Sys.Extended.UI.HTMLEditor.jsDocument = function(noExtraLf) {
this.noExtraLf = (typeof noExtraLf != "undefined" && noExtraLf);this.text = [];this.write = function (str) {
if(!this.noExtraLf || (this.text.length == 0 && str != "\n") || (this.text.length > 0 && (this.text[this.text.length-1] != "\n" || str != "\n"))) {
this.text[this.text.length] = str;}
};this.append = this.write;this.writeln = function (str) { this.text[this.text.length] = str + "\n";}
this.toString = function () { return this.text.join("");}
this.clear = function () { delete this.text;this.text = null;this.text = new Array;}
};Sys.Extended.UI.HTMLEditor.isHeader = function(el) {
var name = el.tagName.toUpperCase();if(name.length==2) {
if(name.substr(0,1)=="H" && parseInt(name.substr(1,1)) > 0) {
return true;}
}
return false;};Sys.Extended.UI.HTMLEditor._getReallyFirst = function(root) {
if(typeof root.firstChild != "undefined" && root.firstChild != null) {
if(typeof root.firstChild.childNodes != "undefined" && root.firstChild.childNodes != null) {
return Sys.Extended.UI.HTMLEditor._getReallyFirst(root.firstChild)
}
}
return root;};Sys.Extended.UI.HTMLEditor._getReallyLast = function(root) {
if(typeof root.lastChild != "undefined" && root.lastChild != null) {
if(typeof root.lastChild.childNodes != "undefined" && root.lastChild.childNodes != null) {
return Sys.Extended.UI.HTMLEditor._getReallyLast(root.lastChild)
}
}
return root;};Sys.Extended.UI.HTMLEditor._reallyFirst = function(root,seek) {
if(root.firstChild) {
if(root.firstChild == seek) return true;if(root.firstChild.childNodes)
if(Sys.Extended.UI.HTMLEditor._lookChild(root.firstChild,seek) == 0 ) {
return Sys.Extended.UI.HTMLEditor._reallyFirst(root.firstChild,seek)
}
}
return false;};Sys.Extended.UI.HTMLEditor._reallyLast = function(root,seek) {
if(root.lastChild) {
if(root.lastChild == seek) return true;if(root.lastChild.childNodes)
if(Sys.Extended.UI.HTMLEditor._lookChild(root.lastChild,seek) == root.lastChild.childNodes.length-1 ) {
return Sys.Extended.UI.HTMLEditor._reallyLast(root.lastChild,seek)
}
}
return false;};Sys.Extended.UI.HTMLEditor.getContainer = function(container, el) {
if(el==container) return container;if(container.nodeType == 1) {
for(var i=0;i < container.childNodes.length;i++) {
var child = container.childNodes.item(i);if(el==child) return child;if(child.nodeType == 1) {
var ind = Sys.Extended.UI.HTMLEditor._lookChild(child,el);if(ind >= 0) {
if(child.tagName && Sys.Extended.UI.HTMLEditor.isStyleTag(child.tagName) && (child.tagName.toUpperCase() != "A") && !Sys.Extended.UI.HTMLEditor.isTempElement(child))
return Sys.Extended.UI.HTMLEditor.getContainer(child, el);else
return child;}
}
}
}
return null;};Sys.Extended.UI.HTMLEditor._TryTransformFromPxToPt = function(fontSize,editor, _id) {
var ret = fontSize.replace(/^(\d+)\.(\d+)px/i,"$1px");if(!Sys.Extended.UI.HTMLEditor.isIE) {
if(ret && ret.length > 0) {
var seek = ret.toLowerCase().split(",")[0];if (typeof _id != "undefined") {
var el = document.getElementById(_id);if(el != null) {
var i;for(i=0;i< el.options.length;i++) {
var cur = Sys.Extended.UI.HTMLEditor.fontSizeSeek(el.options.item(i).value.toLowerCase().split(",")[0]);if(cur==seek) break;}
if(i==el.options.length) {
var span = editor._doc.createElement("SPAN");editor._doc.body.appendChild(span);for(i=1;i< 100;i++) {
span.style.fontSize = i+"pt";if(Sys.Extended.UI.HTMLEditor.getStyle(span,"font-size").replace(/^(\d+)\.(\d+)px/i,"$1px") == seek) {
seek = i+"pt";break;}
}
span.parentNode.removeChild(span);}
}
}
ret = seek;}
}
return ret;};Sys.Extended.UI.HTMLEditor.fontSizeSeek = function(val) {
var seek = val.toString();switch (seek) {
case "1":
seek="8pt";break;case "2":
seek="10pt";break;case "3":
seek="12pt";break;case "4":
seek="14pt";break;case "5":
seek="18pt";break;case "6":
seek="24pt";break;case "7":
seek="36pt";break;}
return seek;};Sys.Extended.UI.HTMLEditor.getOwnerDocument = function(node) {
return node.nodeType == 9 ? node : node.ownerDocument || node.document;};Sys.Extended.UI.HTMLEditor.getClientViewportElement = function(opt_node) {
var doc;if (opt_node.nodeType == 9) {
doc = opt_node;} else {
doc = Sys.Extended.UI.HTMLEditor.getOwnerDocument(opt_node);}
if (Sys.Extended.UI.HTMLEditor.isIE && doc.compatMode != 'CSS1Compat') {
return doc.body;}
return doc.documentElement;};Sys.Extended.UI.HTMLEditor.isReallyVisible = function(el) {
var elem = el;var real_visible = true;while(elem) {
if(elem.style && Sys.Extended.UI.HTMLEditor.getStyle(elem,"display") == "none") {
real_visible = false;break;}
elem = elem.parentNode;}
return real_visible;}
Sys.Extended.UI.HTMLEditor.setSelectionRange = function(input, selectionStart, selectionEnd) {
input.focus();if (input.setSelectionRange) {
input.setSelectionRange(selectionStart, selectionEnd);}
else if (input.createTextRange) {
var range = input.createTextRange();range.collapse(true);range.moveEnd('character', selectionEnd);range.moveStart('character', selectionStart);range.select();}
};if(!Sys.Extended.UI.HTMLEditor.isIE) {
try { 
Sys.Extended.UI.HTMLEditor.__MozillaGetInnerText = function(node, html) {
var els=node.childNodes;for(var i=0;i<els.length;i++) {
var elem = els[i];if(elem.nodeType == 3) {
html.write(elem.nodeValue.replace("\n",""));}
if(elem.nodeType == 1) {
var display = Sys.Extended.UI.HTMLEditor.getStyle(elem,"display");var visibility = Sys.Extended.UI.HTMLEditor.getStyle(elem,"visibility");if(Sys.Extended.UI.HTMLEditor.__needLineBreakBefore(elem)) {
html.write("\n");}
if(Sys.Extended.UI.HTMLEditor.__needTabBefore(elem)) {
html.write("\t");}
if(display != "none" && visibility != "hidden") {
Sys.Extended.UI.HTMLEditor.__MozillaGetInnerText(elem,html);}
if(Sys.Extended.UI.HTMLEditor.__needLineBreakAfter(elem)) {
html.write("\n");}
}
}
};Sys.Extended.UI.HTMLEditor.__needLineBreakBefore = function(el)
{
var _Tags = " div table p pre ol ul blockquote form fieldset ";return (_Tags.indexOf(" " + el.tagName.toLowerCase() + " ") != -1);};Sys.Extended.UI.HTMLEditor.__needLineBreakAfter = function(el)
{
var _Tags = " br div table tr p pre ol ul li hr blockquote form fieldset legend ";return (_Tags.indexOf(" " + el.tagName.toLowerCase() + " ") != -1);};Sys.Extended.UI.HTMLEditor.__needTabBefore = function(el)
{
var _Tags = " td li ";return (_Tags.indexOf(" " + el.tagName.toLowerCase() + " ") != -1);};HTMLElement.prototype.__defineGetter__("innerText",function() {
var html = new Sys.Extended.UI.HTMLEditor.jsDocument(true);Sys.Extended.UI.HTMLEditor.__MozillaGetInnerText(this,html);return html.toString();}
);} catch(ex) {}
}
Sys.Extended.UI.HTMLEditor.Toolbar = function(element) {
Sys.Extended.UI.HTMLEditor.Toolbar.initializeBase(this, [element]);this._loaded = false;this._cachedButtonIds = null;this._cachedEditPanel = null;this._buttons = null;this._alwaysVisible = false;this._app_onload$delegate = Function.createDelegate(this, this._app_onload);}
Sys.Extended.UI.HTMLEditor.Toolbar.prototype = {
get_alwaysVisible : function() {
return this._alwaysVisible;},
set_alwaysVisible : function(value) {
this._alwaysVisible = value;if (this.get_isInitialized()) {
this.raisePropertyChanged("alwaysVisible");}
},
set_activeEditPanel : function(value) {
if(!this._loaded) {
this._cachedEditPanel = value;return;}
for(var i=0;i < this.get_buttons().length;i++) {
this.get_buttons()[i].set_activeEditPanel(value);}
},
disable : function() {
if (this.get_isInitialized()) {
if (this._alwaysVisible) {
return;}
for(var i=0;i < this.get_buttons().length;i++) {
this.get_buttons()[i].set_activeEditPanel(null);}
}
},
get_buttons : function() { 
if (this._buttons == null) {
this._buttons = [];}
return this._buttons;},
set_buttons : function(value) { 
this.get_buttons().push(value);},
get_buttonIds : function() { 
},
set_buttonIds : function(value) { 
if (!this.get_isInitialized()) {
this._cachedButtonIds = value;return;}
var arr = value.split(";");for(var i=0;i < arr.length;i++) {
if(arr[i].length > 0) {
this.set_buttons($find(arr[i]));}
}
},
initialize : function() {
Sys.Extended.UI.HTMLEditor.Toolbar.callBaseMethod(this, "initialize");Sys.Application.add_load(this._app_onload$delegate);},
dispose : function() {
this._loaded = false;Sys.Application.remove_load(this._app_onload$delegate);Sys.Extended.UI.HTMLEditor.Toolbar.callBaseMethod(this, "dispose");},
_app_onload : function(sender, e) {
if (this._cachedButtonIds != null) {
this.set_buttonIds(this._cachedButtonIds);this._cachedButtonIds = null;}
this._loaded = true;if(this._cachedEditPanel != null) {
this.set_activeEditPanel(this._cachedEditPanel);this._cachedEditPanel = null;}
}
}
Sys.Extended.UI.HTMLEditor.Toolbar.registerClass("Sys.Extended.UI.HTMLEditor.Toolbar", Sys.UI.Control);Sys.Extended.UI.HTMLEditor.LastFocusedEditPanel = null;Sys.Extended.UI.HTMLEditor.EditPanel = function(element) {
Sys.Extended.UI.HTMLEditor.EditPanel.initializeBase(this, [element]);this._loaded = false;this._eAfter = null;this._toolbars = null;this._modePanels = null;this._contentChangedElement = null;this._contentElement = null;this._contentForceElement = null;this._activeModeElement = null;this._suppressTabInDesignMode = false;this._keyboardEnabled = true;this._noPaste = false;this._hotkeys = null;this._showAnchors = false;this._showPlaceHolders = false;this._startEnd = true;this._relativeImages = true;this._documentCssPath = null;this._designPanelCssPath = null;this._imagePath_1x1 = null;this._imagePath_flash = null;this._imagePath_media = null;this._imagePath_anchor = null;this._imagePath_placeHolder = null;this._autofocus = true;this._initialCleanUp = false;this._noScript = false;this._noUnicode = false;this._cachedToolbarIds = null;this._contentPrepared = false;this._activeMode = null;this._pageRequestManager = null;this._formOnSubmitSaved = null;this._app_onload$delegate = Function.createDelegate(this, this._app_onload);this._onsubmit$delegate = Function.createDelegate(this, this._onsubmit);this._disposed = true;}
Sys.Extended.UI.HTMLEditor.EditPanel.prototype = {
get_relativeImages: function() {
return this._relativeImages;},
set_relativeImages: function(value) {
this._relativeImages = value;if (this._loaded) {
this.raisePropertyChanged("relativeImages");}
},
get_startEnd: function() {
return this._startEnd;},
set_startEnd: function(value) {
this._startEnd = value;if (this._loaded) {
this.raisePropertyChanged("startEnd");}
},
get_showPlaceHolders: function() {
return this._showPlaceHolders;},
set_showPlaceHolders: function(value) {
this._showPlaceHolders = value;if (this._loaded) {
this.raisePropertyChanged("showPlaceHolders");}
},
get_showAnchors: function() {
return this._showAnchors;},
set_showAnchors: function(value) {
this._showAnchors = value;if (this._loaded) {
this.raisePropertyChanged("showAnchors");}
},
get_hotkeys: function() {
return this._hotkeys;},
set_hotkeys: function(value) {
this._hotkeys = value;if (this._loaded) {
this.raisePropertyChanged("noPaste");}
},
get_noPaste: function() {
return this._noPaste;},
set_noPaste: function(value) {
this._noPaste = value;if (this._loaded) {
this.raisePropertyChanged("noPaste");}
},
get_suppressTabInDesignMode: function() {
return this._suppressTabInDesignMode;},
set_suppressTabInDesignMode: function(value) {
this._suppressTabInDesignMode = value;if (this._loaded) {
this.raisePropertyChanged("suppressTabInDesignMode");}
},
get_keyboardEnabled: function() {
return this._keyboardEnabled;},
set_keyboardEnabled: function(value) {
this._keyboardEnabled = value;if (this._loaded) {
this.raisePropertyChanged("keyboardEnabled");}
},
get_noUnicode: function() {
return this._noUnicode;},
set_noUnicode: function(value) {
this._noUnicode = value;if (this._loaded) {
this.raisePropertyChanged("noUnicode");}
},
get_noScript: function() {
return this._noScript;},
set_noScript: function(value) {
this._noScript = value;if (this._loaded) {
this.raisePropertyChanged("noScript");}
},
get_initialCleanUp: function() {
return this._initialCleanUp;},
set_initialCleanUp: function(value) {
this._initialCleanUp = value;if (this._loaded) {
this.raisePropertyChanged("initialCleanUp");}
},
get_imagePath_1x1: function() {
return this._imagePath_1x1;},
set_imagePath_1x1: function(value) {
this._imagePath_1x1 = value;},
get_imagePath_flash: function() {
return this._imagePath_flash;},
set_imagePath_flash: function(value) {
this._imagePath_flash = value;},
get_imagePath_media: function() {
return this._imagePath_media;},
set_imagePath_media: function(value) {
this._imagePath_media = value;},
get_imagePath_anchor: function() {
return this._imagePath_anchor;},
set_imagePath_anchor: function(value) {
this._imagePath_anchor = value;},
get_imagePath_placeHolder: function() {
return this._imagePath_placeHolder;},
set_imagePath_placeHolder: function(value) {
this._imagePath_placeHolder = value;},
get_documentCssPath: function() {
return this._documentCssPath;},
set_documentCssPath: function(value) {
this._documentCssPath = value;if (this._loaded) {
this.raisePropertyChanged("documentCssPath");}
},
get_designPanelCssPath: function() {
return this._designPanelCssPath;},
set_designPanelCssPath: function(value) {
this._designPanelCssPath = value;if (this._loaded) {
this.raisePropertyChanged("designPanelCssPath");}
},
get_autofocus: function() {
return this._autofocus;},
set_autofocus: function(value) {
this._autofocus = value;if (this._loaded) {
this.raisePropertyChanged("autofocus");}
},
get_content: function() {
if (this._activeMode == null) {
return "";}
return this.getContent();},
set_content: function(value) {
if (!this.get_isInitialized() || !this._loaded) {
if (this.get_contentElement() != null) {
this.get_contentElement().value = value.replace(/\"/g, "&quot;");}
return;}
this.setContent(value);if (this._loaded) {
this.raisePropertyChanged("content");}
},
get_activeMode: function() {
if (this._activeMode == null) {
return Sys.Extended.UI.HTMLEditor.ActiveModeType.Design;}
return this._activeMode;},
set_activeMode: function(value) {
if (!Sys.Extended.UI.HTMLEditor.ActiveModeType_checkValue(value)) {
throw Error.argumentOutOfRange("value, function: Sys.Extended.UI.HTMLEditor.EditPanel.set_activeMode");}
var oldMode = this._activeMode;var retval = true;if (this._loaded && oldMode != null && oldMode != value) {
var eBefore = new Sys.Extended.UI.HTMLEditor.ActiveModeChangedArgs(oldMode, value, this);this.raiseBeforeActiveModeChanged(eBefore);this._eAfter = new Sys.Extended.UI.HTMLEditor.ActiveModeChangedArgs(oldMode, value, this);retval = this._setMode(value);} else {
this._activeMode = value;}
this.get_activeModeElement().value = value;return retval;},
get_contentChangedElement: function() {
return this._contentChangedElement;},
set_contentChangedElement: function(value) {
this._contentChangedElement = value;},
get_contentElement: function() {
return this._contentElement;},
set_contentElement: function(value) {
this._contentElement = value;},
get_contentForceElement: function() {
return this._contentForceElement;},
set_contentForceElement: function(value) {
this._contentForceElement = value;},
get_activeModeElement: function() {
return this._activeModeElement;},
set_activeModeElement: function(value) {
this._activeModeElement = value;},
setCancelOnPostback: function() {
if (this._loaded) {
this.get_contentForceElement().value = "";}
},
setAcceptOnPostback: function() {
if (this._loaded) {
this.get_contentForceElement().value = "1";}
},
get_toolbars: function() {
if (this._toolbars == null) {
this._toolbars = [];}
return this._toolbars;},
set_toolbars: function(value) {
this.get_toolbars().push(value);},
get_toolbarIds: function() {
},
set_toolbarIds: function(value) {
if (!this.get_isInitialized()) {
this._cachedToolbarIds = value;return;}
var arr = value.split(";");for (var i = 0;i < arr.length;i++) {
if (arr[i].length > 0) {
this.set_toolbars($find(arr[i]));}
}
},
get_modePanels: function() {
if (this._modePanels == null) {
this._modePanels = [];}
return this._modePanels;},
set_modePanel: function(value) {
this.get_modePanels().push(value);},
get_modePanelIds: function() {
},
set_modePanelIds: function(value) {
var arr = value.split(";");for (var i = 0;i < arr.length;i++) {
this.set_modePanel($find(arr[i]));}
},
add_focused: function(handler) {
this.get_events().addHandler("focused", handler);},
remove_focused: function(handler) {
this.get_events().removeHandler("focused", handler);},
raiseFocused: function(e) {
var eh = this.get_events().getHandler("focused");if (eh) {
eh(this, e);}
},
add_activeModeChanged: function(handler) {
this.get_events().addHandler("activeModeChanged", handler);},
remove_activeModeChanged: function(handler) {
this.get_events().removeHandler("activeModeChanged", handler);},
raiseActiveModeChanged: function(e) {
var eh = this.get_events().getHandler("activeModeChanged");if (eh) {
eh(this, e);}
},
add_beforeActiveModeChanged: function(handler) {
this.get_events().addHandler("beforeActiveModeChanged", handler);},
remove_beforeActiveModeChanged: function(handler) {
this.get_events().removeHandler("beforeActiveModeChanged", handler);},
raiseBeforeActiveModeChanged: function(e) {
var eh = this.get_events().getHandler("beforeActiveModeChanged");if (eh) {
eh(this, e);}
},
get_activePanel: function() {
var modePanel = this.get_modePanels()[this.get_activeMode()];if (modePanel == null || typeof modePanel == "undefined") {
throw Error.argumentOutOfRange("activeMode, function: Sys.Extended.UI.HTMLEditor.EditPanel.get_activePanel");}
return modePanel;},
initialize: function() {
this.__appLoaded__ = false;Sys.Extended.UI.HTMLEditor.EditPanel.callBaseMethod(this, "initialize");this._disposed = false;Sys.Application.add_load(this._app_onload$delegate);if (Sys && Sys.WebForms && Sys.WebForms.PageRequestManager) {
this._pageRequestManager = Sys.WebForms.PageRequestManager.getInstance();if (this._pageRequestManager) {
this._partialUpdateEndRequestHandler = Function.createDelegate(this, this._partialUpdateEndRequest);this._pageRequestManager.add_endRequest(this._partialUpdateEndRequestHandler);this._invokingRequestHandler = Function.createDelegate(this, this._invokingRequest);Sys.Net.WebRequestManager.add_invokingRequest(this._invokingRequestHandler);}
}
Sys.Extended.UI.HTMLEditor.addFormOnSubmit(this._onsubmit$delegate);},
dispose: function() {
this._loaded = false;this._disposed = true;if (this._pageRequestManager) {
if (this._invokingRequestHandler) {
this._pageRequestManager.remove_endRequest(this._partialUpdateEndRequestHandler);this._partialUpdateEndRequestHandler = null;Sys.Net.WebRequestManager.remove_invokingRequest(this._invokingRequestHandler);this._invokingRequestHandler = null;}
this._pageRequestManager = null;}
Sys.Extended.UI.HTMLEditor.removeFormOnSubmit(this._onsubmit$delegate);Sys.Application.remove_load(this._app_onload$delegate);this.disableToolbars();Sys.Extended.UI.HTMLEditor.EditPanel.callBaseMethod(this, "dispose");},
_onsubmit: function(e) {
if (!this._contentPrepared) {
this._prepareContentForPostback(this.get_content());this._contentPrepared = true;}
return true;},
_invokingRequest: function(sender, args) {
if (this._contentPrepared) {
return;}
var webRequest = args.get_webRequest();var body = webRequest.get_body();var reg = new RegExp("([\\?&])(" + this.get_contentElement().name + "=)([^&$]*)([&$])", "g");body = body.replace(reg, "$1$2" + escape(this.get_content().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;")) + "$4");this._contentPrepared = true;webRequest.set_body(body);},
_partialUpdateEndRequest: function(sender, args) {
this._contentPrepared = false;if (Sys.Extended.UI.HTMLEditor.isIE && this.__blured) {
this.__blured = false;this.get_activePanel()._focus();}
},
_app_onload: function(sender, e) {
if (this.__appLoaded__) return;this.__appLoaded__ = true;if (this._disposed) {
return;}
var editPanel = this;if (!Sys.Extended.UI.HTMLEditor.isReallyVisible(this.get_element().parentNode)) {
setTimeout(this._app_onload$delegate, 100);return;}
this._loaded = true;this.set_activeMode(parseInt(this.get_activeModeElement().value));if (this._cachedToolbarIds != null) {
this.set_toolbarIds(this._cachedToolbarIds);this._cachedToolbarIds = null;}
this._shouldResize = false;if (Sys.Extended.UI.HTMLEditor.isIE && document.compatMode != "BackCompat") {
if (this.get_element().clientHeight == 0 || Sys.Browser.version < 7) {
this._shouldResize = true;}
}
if (this._shouldResize) {
var modePanels = this.get_modePanels();var iframePanel = modePanels[Sys.Extended.UI.HTMLEditor.ActiveModeType.Design];if (iframePanel == null) {
iframePanel = modePanels[Sys.Extended.UI.HTMLEditor.ActiveModeType.Preview];}
var htmlPanel = modePanels[Sys.Extended.UI.HTMLEditor.ActiveModeType.Html];if (iframePanel != null && htmlPanel != null) {
var iframePanelElement = iframePanel.get_element();iframePanelElement.style.display = "";htmlPanel.get_element().style.height = iframePanelElement.offsetHeight + "px";iframePanelElement.style.display = "none";}
}
var content = this.get_contentElement().value.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&amp;/g, "&");this.setContent(this._initialCleanUp ? Sys.Extended.UI.HTMLEditor.cleanUp(content.replace(/[\n\r]+/g, " ")) : content);this.setAcceptOnPostback();},
_setActive: function() {
for (var i = 0;i < this.get_toolbars().length;i++) {
this.get_toolbars()[i].set_activeEditPanel(this, true);}
if (this._eAfter != null) {
this.raisePropertyChanged("activeMode");this.raiseActiveModeChanged(this._eAfter);this._eAfter = null;}
},
_focused: function(prize) {
if (!(typeof prize != "undefined" && prize)) {
for (var i = 0;i < this.get_toolbars().length;i++) {
this.get_toolbars()[i].set_activeEditPanel(this);}
}
Sys.Extended.UI.HTMLEditor.LastFocusedEditPanel = this;},
_really_focused: function() {
this._focused();this.raiseFocused(new Sys.EventArgs());},
updateToolbar: function() {
this._focused();},
getContent: function() {
return this.get_activePanel().get_content()
.replace(/<\/?html(?=\s|>)(?:[^>]*?)>/gi, "")
.replace(/<\/?head(?=\s|>)(?:[^>]*?)>/gi, "")
.replace(/<\/?body(?=\s|>)(?:[^>]*?)>/gi, "")
.replace(/^([\n\r]+)/, "").replace(/([\n\r]+)$/, "");},
setContent: function(content) {
var temptext = content;if (this.get_noScript()) {
temptext = temptext.replace(/(<script(?:[^>]*?)>(?:[^<]*?)<\/script(?:[^>]*?)>)/ig, "");}
temptext = temptext.replace(/<\/?html(?=\s|>)(?:[^>]*?)>/gi, "")
.replace(/<\/?head(?=\s|>)(?:[^>]*?)>/gi, "")
.replace(/<\/?body(?=\s|>)(?:[^>]*?)>/gi, "")
.replace(/^([\n\r]+)/, "").replace(/([\n\r]+)$/, "");this._prepareContentForPostback(temptext);this.get_activePanel().set_content(temptext);},
_prepareContentForPostback: function(value) {
this.get_contentElement().value = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");},
_setMode: function(mode) {
var activePanel = this.get_activePanel();if (!activePanel._activated) {
var editPanel = this;setTimeout(function() { editPanel._setMode(mode);}, 10);return false;}
var content = this.get_content();if (this._shouldResize && mode == Sys.Extended.UI.HTMLEditor.ActiveModeType.Html) {
var iframePanel = this.get_activePanel();var htmlPanel = this.get_modePanels()[Sys.Extended.UI.HTMLEditor.ActiveModeType.Html];if (iframePanel != null && htmlPanel != null) {
htmlPanel.get_element().style.height = iframePanel.get_element().offsetHeight + "px";}
}
this.disableToolbars(mode);activePanel._deactivate();this._activeMode = mode;this.setContent(content);return true;},
disableToolbars: function(mode) {
for (var i = 0;i < this.get_toolbars().length;i++) {
var toolbar = this.get_toolbars()[i];if (toolbar._loaded) {
toolbar.disable(mode);}
}
},
openWait: function() {
},
closeWait: function() {
}
}
Sys.Extended.UI.HTMLEditor.EditPanel.registerClass("Sys.Extended.UI.HTMLEditor.EditPanel", Sys.UI.Control);Sys.Extended.UI.HTMLEditor.Editor = function(element) {
Sys.Extended.UI.HTMLEditor.Editor.initializeBase(this, [element]);this._editPanel = null;this._changingToolbar = null;if(Sys.Extended.UI.HTMLEditor.isIE && Sys.Browser.version == 8 && document.compatMode != "BackCompat") {
this._onresize$delegate = Function.createDelegate(this, this._onresize);}
}
Sys.Extended.UI.HTMLEditor.Editor.prototype = {
get_autofocus: function() {
return this._editPanel.get_autofocus();},
set_autofocus: function(value) {
this._editPanel.set_autofocus(value);},
get_content: function() {
return this._editPanel.get_content();},
set_content: function(value) {
this._editPanel.set_content(value);},
get_activeMode: function() {
return this._editPanel.get_activeMode();},
set_activeMode: function(value) {
this._editPanel.set_activeMode(value);},
get_editPanel: function() {
return this._editPanel;},
set_editPanel: function(value) {
this._editPanel = value;},
get_changingToolbar: function() {
return this._changingToolbar;},
set_changingToolbar: function(value) {
this._changingToolbar = value;},
add_propertyChanged: function(handler) {
this._editPanel.add_propertyChanged(handler);},
remove_propertyChanged: function(handler) {
this._editPanel.remove_propertyChanged(handler);},
initialize: function() {
Sys.Extended.UI.HTMLEditor.Editor.callBaseMethod(this, "initialize");var element = this.get_element();var oldStyle = element.className;Sys.UI.DomElement.removeCssClass(element, oldStyle);Sys.UI.DomElement.addCssClass(element, "ajax__htmleditor_editor_base");Sys.UI.DomElement.addCssClass(element, oldStyle);if (!Sys.Extended.UI.HTMLEditor.isIE && document.compatMode != "BackCompat") {
this.get_element().style.height = "100%";}
if (Sys.Extended.UI.HTMLEditor.isIE && Sys.Browser.version == 8 && document.compatMode != "BackCompat") {
if (this.get_changingToolbar() != null) {
this._saved_set_activeEditPanel = this.get_changingToolbar().set_activeEditPanel;this._saved_disable = this.get_changingToolbar().disable;this.get_changingToolbar().set_activeEditPanel = Function.createDelegate(this, this._set_activeEditPanel);this.get_changingToolbar().disable = Function.createDelegate(this, this._disable);}
}
},
_set_activeEditPanel: function(par) {
var changingToolbar = this.get_changingToolbar().get_element();var editPanel = this.get_editPanel().get_element();var height1 = changingToolbar.parentNode.clientHeight;(Function.createDelegate(this.get_changingToolbar(), this._saved_set_activeEditPanel))(par);var height2 = changingToolbar.parentNode.clientHeight;var clientHeight = editPanel.parentNode.clientHeight;if (clientHeight > 0) {
editPanel.style.height = clientHeight - (height2 - height1) + "px";}
},
_disable: function(par) {
var changingToolbar = this.get_changingToolbar().get_element();var editPanel = this.get_editPanel().get_element();var height1 = changingToolbar.clientHeight;(Function.createDelegate(this.get_changingToolbar(), this._saved_disable))(par);var height2 = changingToolbar.clientHeight;var clientHeight = editPanel.parentNode.clientHeight;if (clientHeight > 0) {
editPanel.style.height = clientHeight - (height2 - height1) + "px";}
},
dispose: function() {
if (Sys.Extended.UI.HTMLEditor.isIE && Sys.Browser.version == 8 && document.compatMode != "BackCompat") {
this.get_changingToolbar().set_activeEditPanel = this._saved_set_activeEditPanel;this.get_changingToolbar().disable = this._saved_disable;}
Sys.Extended.UI.HTMLEditor.Editor.callBaseMethod(this, "dispose");},
_onresize: function(e) {
var changingToolbar = this.get_changingToolbar().get_element();var editPanel = this.get_editPanel().get_element();var clientHeight = editPanel.parentNode.clientHeight;if (clientHeight > 0) {
editPanel.style.height = clientHeight - (changingToolbar.clientHeight - this._changingToolbarHeight) + "px";}
this._changingToolbarHeight = changingToolbar.clientHeight;}
}
Sys.Extended.UI.HTMLEditor.Editor.registerClass("Sys.Extended.UI.HTMLEditor.Editor", Sys.UI.Control);Sys.Extended.UI.HTMLEditor.Editor.MidleCellHeightForIE = function(table, row) {
var height = "100%";if (Sys.Extended.UI.HTMLEditor.isIE && document.compatMode != "BackCompat") {
try {
var decrease = 2;for (var i = 0;i < table.rows.length;i++) {
if (table.rows[i] != row) {
decrease += (table.rows[i].offsetHeight + 1);}
}
height = ((table.clientHeight - decrease) / table.clientHeight * 100) + '%';} catch (e) {
height = "";}
}
return height;}
Sys.Extended.UI.HTMLEditor.ClientSideEditor = function(element) {
Sys.Extended.UI.HTMLEditor.ClientSideEditor.initializeBase(this, [element]);
var id = this.__id__ = element.id+"_RichTextEditor";var newElement = document.createElement("DIV");newElement.className = "ajax__htmleditor_editor_default";newElement.id = id;
newElement.innerHTML = "<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" class=\"ajax__htmleditor_editor_container\" style=\"border-collapse: separate;\"><tbody><tr><td class=\"ajax__htmleditor_editor_toptoolbar\"><div id=\""+id+"_ctl01\"><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl00\" title=\"Undo\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl01\" title=\"Redo\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl02\" class=\"ajax__htmleditor_toolbar_button\" style=\"background-color: transparent; cursor: text; display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl03\" title=\"Bold\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl04\" title=\"Italic\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl05\" title=\"Underline\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl06\" title=\"Strike through\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl07\" title=\"Sub script\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl08\" title=\"Super script\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl09\" class=\"ajax__htmleditor_toolbar_button\" style=\"background-color: transparent; cursor: text; display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl10\" title=\"Left to right direction\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl11\" title=\"Right to left direction\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl12\" class=\"ajax__htmleditor_toolbar_button\" style=\"background-color: transparent; cursor: text; display: none;\" /><div id=\""+id+"_ctl01_FixedForeColor\" title=\"Foreground color\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\"><table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"margin: 1px; padding: 0px;\"><tbody><tr><td><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_FixedForeColor_ctl01\" title=\"Foreground color\" /></td></tr><tr><td><div id=\""+id+"_ctl01_FixedForeColor_ctl02\" title=\"Foreground color\" style=\"margin: 0px; padding: 0px; height: 5px; width: 21px; background-color: #ff0000; font-size: 1px;\"></div></td></tr></tbody></table></div><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl13\" title=\"Foreground color\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><div id=\""+id+"_ctl01_ctl14\" style=\"position: absolute; top: -2000px; left: -2000px;\"><iframe frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" tabindex=\"-1\" id=\""+id+"_ctl01_ctl14_ctl00\"></iframe><div id=\""+id+"_ctl01_ctl14_ctl01\" style=\"display: none;\"><div class=\"ajax__htmleditor_attachedpopup_default\"><table cellspacing=\"1\" cellpadding=\"0\" border=\"0\" style=\"background-color: #000000;\"><tbody><tr><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#003300&quot;)\" style=\"background-color: #003300; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#006600&quot;)\" style=\"background-color: #006600; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#009900&quot;)\" style=\"background-color: #009900; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#00CC00&quot;)\" style=\"background-color: #00cc00; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#00FF00&quot;)\" style=\"background-color: #00ff00; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#330000&quot;)\" style=\"background-color: #330000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#333300&quot;)\" style=\"background-color: #333300; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#336600&quot;)\" style=\"background-color: #336600; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#339900&quot;)\" style=\"background-color: #339900; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#33CC00&quot;)\" style=\"background-color: #33cc00; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#33FF00&quot;)\" style=\"background-color: #33ff00; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#660000&quot;)\" style=\"background-color: #660000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#663300&quot;)\" style=\"background-color: #663300; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#666600&quot;)\" style=\"background-color: #666600; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#669900&quot;)\" style=\"background-color: #669900; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#66CC00&quot;)\" style=\"background-color: #66cc00; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#66FF00&quot;)\" style=\"background-color: #66ff00; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td></tr><tr><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#333333&quot;)\" style=\"background-color: #333333; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#000033&quot;)\" style=\"background-color: #000033; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#003333&quot;)\" style=\"background-color: #003333; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#006633&quot;)\" style=\"background-color: #006633; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#009933&quot;)\" style=\"background-color: #009933; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#00CC33&quot;)\" style=\"background-color: #00cc33; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#00FF33&quot;)\" style=\"background-color: #00ff33; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#330033&quot;)\" style=\"background-color: #330033; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#333333&quot;)\" style=\"background-color: #333333; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#336633&quot;)\" style=\"background-color: #336633; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#339933&quot;)\" style=\"background-color: #339933; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#33CC33&quot;)\""
+ " style=\"background-color: #33cc33; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#33FF33&quot;)\" style=\"background-color: #33ff33; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#660033&quot;)\" style=\"background-color: #660033; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#663333&quot;)\" style=\"background-color: #663333; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#666633&quot;)\" style=\"background-color: #666633; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#669933&quot;)\" style=\"background-color: #669933; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#66CC33&quot;)\" style=\"background-color: #66cc33; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#66FF33&quot;)\" style=\"background-color: #66ff33; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td></tr><tr><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#666666&quot;)\" style=\"background-color: #666666; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#000066&quot;)\" style=\"background-color: #000066; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#003366&quot;)\" style=\"background-color: #003366; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#006666&quot;)\" style=\"background-color: #006666; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#009966&quot;)\" style=\"background-color: #009966; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#00CC66&quot;)\" style=\"background-color: #00cc66; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#00FF66&quot;)\" style=\"background-color: #00ff66; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#330066&quot;)\" style=\"background-color: #330066; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#333366&quot;)\" style=\"background-color: #333366; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#336666&quot;)\" style=\"background-color: #336666; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#339966&quot;)\" style=\"background-color: #339966; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#33CC66&quot;)\" style=\"background-color: #33cc66; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#33FF66&quot;)\" style=\"background-color: #33ff66; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#660066&quot;)\" style=\"background-color: #660066; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#663366&quot;)\" style=\"background-color: #663366; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#666666&quot;)\" style=\"background-color: #666666; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#669966&quot;)\" style=\"background-color: #669966; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#66CC66&quot;)\" style=\"background-color: #66cc66; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#66FF66&quot;)\" style=\"background-color: #66ff66; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td></tr><tr><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#999999&quot;)\" style=\"background-color: #999999; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#000099&quot;)\" style=\"background-color: #000099; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#003399&quot;)\" style=\"background-color: #003399; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#006699&quot;)\" style=\"background-color: #006699; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#009999&quot;)\" style=\"background-color: #009999; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#00CC99&quot;)\" style=\"background-color: #00cc99; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#00FF99&quot;)\" style=\"background-color: #00ff99; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#330099&quot;)\" style=\"background-color: #330099; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#333399&quot;)\" style=\"background-color: #333399; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#336699&quot;)\" style=\"background-color: #336699; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#339999&quot;)\" style=\"background-color: #339999; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#33CC99&quot;)\" style=\"background-color: #33cc99; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#33FF99&quot;)\" style=\"background-color: #33ff99; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#660099&quot;)\" style=\"background-color: #660099; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#663399&quot;)\" style=\"background-color: #663399; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#666699&quot;)\" style=\"background-color: #666699; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#669999&quot;)\" style=\"background-color: #669999; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#66CC99&quot;)\" style=\"background-color: #66cc99; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#66FF99&quot;)\" style=\"background-color: #66ff99; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td></tr><tr><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CCCCCC&quot;)\""
+ " style=\"background-color: #cccccc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#0000CC&quot;)\" style=\"background-color: #0000cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#0033CC&quot;)\" style=\"background-color: #0033cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#0066CC&quot;)\" style=\"background-color: #0066cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#0099CC&quot;)\" style=\"background-color: #0099cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#00CCCC&quot;)\" style=\"background-color: #00cccc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#00FFCC&quot;)\" style=\"background-color: #00ffcc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#3300CC&quot;)\" style=\"background-color: #3300cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#3333CC&quot;)\" style=\"background-color: #3333cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#3366CC&quot;)\" style=\"background-color: #3366cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#3399CC&quot;)\" style=\"background-color: #3399cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#33CCCC&quot;)\" style=\"background-color: #33cccc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#33FFCC&quot;)\" style=\"background-color: #33ffcc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#6600CC&quot;)\" style=\"background-color: #6600cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#6633CC&quot;)\" style=\"background-color: #6633cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#6666CC&quot;)\" style=\"background-color: #6666cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#6699CC&quot;)\" style=\"background-color: #6699cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#66CCCC&quot;)\" style=\"background-color: #66cccc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#66FFCC&quot;)\" style=\"background-color: #66ffcc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td></tr><tr><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FFFFFF&quot;)\" style=\"background-color: #ffffff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#0000FF&quot;)\" style=\"background-color: #0000ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#0033FF&quot;)\" style=\"background-color: #0033ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#0066FF&quot;)\" style=\"background-color: #0066ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#0099FF&quot;)\" style=\"background-color: #0099ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#00CCFF&quot;)\" style=\"background-color: #00ccff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#00FFFF&quot;)\" style=\"background-color: #00ffff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#3300FF&quot;)\" style=\"background-color: #3300ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#3333FF&quot;)\" style=\"background-color: #3333ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#3366FF&quot;)\" style=\"background-color: #3366ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#3399FF&quot;)\" style=\"background-color: #3399ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#33CCFF&quot;)\" style=\"background-color: #33ccff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#33FFFF&quot;)\" style=\"background-color: #33ffff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#6600FF&quot;)\" style=\"background-color: #6600ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#6633FF&quot;)\" style=\"background-color: #6633ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#6666FF&quot;)\" style=\"background-color: #6666ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#6699FF&quot;)\" style=\"background-color: #6699ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#66CCFF&quot;)\" style=\"background-color: #66ccff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#66FFFF&quot;)\" style=\"background-color: #66ffff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td></tr><tr><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF0000&quot;)\" style=\"background-color: #ff0000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#990000&quot;)\" style=\"background-color: #990000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#993300&quot;)\" style=\"background-color: #993300; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#996600&quot;)\" style=\"background-color: #996600; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#999900&quot;)\" style=\"background-color: #999900; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#99CC00&quot;)\" style=\"background-color: #99cc00; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#99FF00&quot;)\" style=\"background-color: #99ff00; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC0000&quot;)\" style=\"background-color: #cc0000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC3300&quot;)\""
+ " style=\"background-color: #cc3300; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC6600&quot;)\" style=\"background-color: #cc6600; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC9900&quot;)\" style=\"background-color: #cc9900; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CCCC00&quot;)\" style=\"background-color: #cccc00; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CCFF00&quot;)\" style=\"background-color: #ccff00; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF0000&quot;)\" style=\"background-color: #ff0000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF3300&quot;)\" style=\"background-color: #ff3300; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF6600&quot;)\" style=\"background-color: #ff6600; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF9900&quot;)\" style=\"background-color: #ff9900; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FFCC00&quot;)\" style=\"background-color: #ffcc00; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FFFF00&quot;)\" style=\"background-color: #ffff00; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td></tr><tr><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#00FF00&quot;)\" style=\"background-color: #00ff00; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#990033&quot;)\" style=\"background-color: #990033; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#993333&quot;)\" style=\"background-color: #993333; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#996633&quot;)\" style=\"background-color: #996633; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#999933&quot;)\" style=\"background-color: #999933; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#99CC33&quot;)\" style=\"background-color: #99cc33; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#99FF33&quot;)\" style=\"background-color: #99ff33; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC0033&quot;)\" style=\"background-color: #cc0033; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC3333&quot;)\" style=\"background-color: #cc3333; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC6633&quot;)\" style=\"background-color: #cc6633; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC9933&quot;)\" style=\"background-color: #cc9933; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CCCC33&quot;)\" style=\"background-color: #cccc33; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CCFF33&quot;)\" style=\"background-color: #ccff33; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF0033&quot;)\" style=\"background-color: #ff0033; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF3333&quot;)\" style=\"background-color: #ff3333; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF6633&quot;)\" style=\"background-color: #ff6633; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF9933&quot;)\" style=\"background-color: #ff9933; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FFCC33&quot;)\" style=\"background-color: #ffcc33; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FFFF33&quot;)\" style=\"background-color: #ffff33; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td></tr><tr><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#0000FF&quot;)\" style=\"background-color: #0000ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#990066&quot;)\" style=\"background-color: #990066; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#993366&quot;)\" style=\"background-color: #993366; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#996666&quot;)\" style=\"background-color: #996666; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#999966&quot;)\" style=\"background-color: #999966; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#99CC66&quot;)\" style=\"background-color: #99cc66; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#99FF66&quot;)\" style=\"background-color: #99ff66; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC0066&quot;)\" style=\"background-color: #cc0066; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC3366&quot;)\" style=\"background-color: #cc3366; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC6666&quot;)\" style=\"background-color: #cc6666; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC9966&quot;)\" style=\"background-color: #cc9966; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CCCC66&quot;)\" style=\"background-color: #cccc66; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CCFF66&quot;)\" style=\"background-color: #ccff66; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF0066&quot;)\" style=\"background-color: #ff0066; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF3366&quot;)\" style=\"background-color: #ff3366; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF6666&quot;)\" style=\"background-color: #ff6666; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF9966&quot;)\" style=\"background-color: #ff9966; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FFCC66&quot;)\""
+ " style=\"background-color: #ffcc66; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FFFF66&quot;)\" style=\"background-color: #ffff66; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td></tr><tr><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FFFF00&quot;)\" style=\"background-color: #ffff00; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#990099&quot;)\" style=\"background-color: #990099; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#993399&quot;)\" style=\"background-color: #993399; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#996699&quot;)\" style=\"background-color: #996699; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#999999&quot;)\" style=\"background-color: #999999; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#99CC99&quot;)\" style=\"background-color: #99cc99; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#99FF99&quot;)\" style=\"background-color: #99ff99; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC0099&quot;)\" style=\"background-color: #cc0099; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC3399&quot;)\" style=\"background-color: #cc3399; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC6699&quot;)\" style=\"background-color: #cc6699; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC9999&quot;)\" style=\"background-color: #cc9999; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CCCC99&quot;)\" style=\"background-color: #cccc99; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CCFF99&quot;)\" style=\"background-color: #ccff99; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF0099&quot;)\" style=\"background-color: #ff0099; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF3399&quot;)\" style=\"background-color: #ff3399; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF6699&quot;)\" style=\"background-color: #ff6699; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF9999&quot;)\" style=\"background-color: #ff9999; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FFCC99&quot;)\" style=\"background-color: #ffcc99; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FFFF99&quot;)\" style=\"background-color: #ffff99; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td></tr><tr><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#00FFFF&quot;)\" style=\"background-color: #00ffff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#9900CC&quot;)\" style=\"background-color: #9900cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#9933CC&quot;)\" style=\"background-color: #9933cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#9966CC&quot;)\" style=\"background-color: #9966cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#9999CC&quot;)\" style=\"background-color: #9999cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#99CCCC&quot;)\" style=\"background-color: #99cccc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#99FFCC&quot;)\" style=\"background-color: #99ffcc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC00CC&quot;)\" style=\"background-color: #cc00cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC33CC&quot;)\" style=\"background-color: #cc33cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC66CC&quot;)\" style=\"background-color: #cc66cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC99CC&quot;)\" style=\"background-color: #cc99cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CCCCCC&quot;)\" style=\"background-color: #cccccc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CCFFCC&quot;)\" style=\"background-color: #ccffcc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF00CC&quot;)\" style=\"background-color: #ff00cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF33CC&quot;)\" style=\"background-color: #ff33cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF66CC&quot;)\" style=\"background-color: #ff66cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF99CC&quot;)\" style=\"background-color: #ff99cc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FFCCCC&quot;)\" style=\"background-color: #ffcccc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FFFFCC&quot;)\" style=\"background-color: #ffffcc; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td></tr><tr><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF00FF&quot;)\" style=\"background-color: #ff00ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#000000&quot;)\" style=\"background-color: #000000; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#9900FF&quot;)\" style=\"background-color: #9900ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#9933FF&quot;)\" style=\"background-color: #9933ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#9966FF&quot;)\" style=\"background-color: #9966ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#9999FF&quot;)\" style=\"background-color: #9999ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#99CCFF&quot;)\""
+ " style=\"background-color: #99ccff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#99FFFF&quot;)\" style=\"background-color: #99ffff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC00FF&quot;)\" style=\"background-color: #cc00ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC33FF&quot;)\" style=\"background-color: #cc33ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC66FF&quot;)\" style=\"background-color: #cc66ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CC99FF&quot;)\" style=\"background-color: #cc99ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CCCCFF&quot;)\" style=\"background-color: #ccccff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#CCFFFF&quot;)\" style=\"background-color: #ccffff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF00FF&quot;)\" style=\"background-color: #ff00ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF33FF&quot;)\" style=\"background-color: #ff33ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF66FF&quot;)\" style=\"background-color: #ff66ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FF99FF&quot;)\" style=\"background-color: #ff99ff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FFCCFF&quot;)\" style=\"background-color: #ffccff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td><td onclick=\"setColor(&quot;#FFFFFF&quot;)\" style=\"background-color: #ffffff; width: 10px; height: 10px; cursor: pointer;\"><div style=\"font-size: 1px; height: 100%; width: 100%;\"></div></td></tr></tbody></table></div></div></div><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl15\" title=\"Clear foreground color\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl16\" class=\"ajax__htmleditor_toolbar_button\" style=\"background-color: transparent; cursor: text; display: none;\" /><div id=\""+id+"_ctl01_FixedBackColor\" title=\"Background color\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\"><table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"margin: 1px; padding: 0px;\"><tbody><tr><td><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_FixedBackColor_ctl01\" title=\"Background color\" /></td></tr><tr><td><div id=\""+id+"_ctl01_FixedBackColor_ctl02\" title=\"Background color\" style=\"margin: 0px; padding: 0px; height: 5px; width: 21px; background-color: #ffff00; font-size: 1px;\"></div></td></tr></tbody></table></div><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl17\" title=\"Background color\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl18\" title=\"Clear background color\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl19\" class=\"ajax__htmleditor_toolbar_button\" style=\"background-color: transparent; cursor: text; display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl20\" title=\"Remove styles\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl21\" class=\"ajax__htmleditor_toolbar_button\" style=\"background-color: transparent; cursor: text; display: none;\" /><div id=\""+id+"_ctl01_ctl22\" class=\"ajax__htmleditor_toolbar_button\" style=\"background-color: transparent; cursor: text; display: none;\"><nobr><span id=\""+id+"_ctl01_ctl22_label\" class=\"ajax__htmleditor_toolbar_selectlable\">Font&nbsp;</span><select id=\""+id+"_ctl01_ctl22_select\" class=\"ajax__htmleditor_toolbar_selectbutton\"><option value=\"\">default</option><option value=\"arial,helvetica,sans-serif\">Arial</option><option value=\"courier new,courier,monospace\">Courier New</option><option value=\"georgia,times new roman,times,serif\">Georgia</option><option value=\"tahoma,arial,helvetica,sans-serif\">Tahoma</option><option value=\"times new roman,times,serif\">Times New Roman</option><option value=\"verdana,arial,helvetica,sans-serif\">Verdana</option><option value=\"impact\">Impact</option><option value=\"wingdings\">WingDings</option></select></nobr></div><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl23\" class=\"ajax__htmleditor_toolbar_button\" style=\"background-color: transparent; cursor: text; display: none;\" /><div id=\""+id+"_ctl01_ctl24\" class=\"ajax__htmleditor_toolbar_button\" style=\"background-color: transparent; cursor: text; display: none;\"><nobr><span id=\""+id+"_ctl01_ctl24_label\" class=\"ajax__htmleditor_toolbar_selectlable\">Size&nbsp;</span><select id=\""+id+"_ctl01_ctl24_select\" class=\"ajax__htmleditor_toolbar_selectbutton\" style=\"width: 70px;\"><option value=\"\">default</option><option value=\"8pt\">1 ( 8 pt)</option><option value=\"10pt\">2 (10 pt)</option><option value=\"12pt\">3 (12 pt)</option><option value=\"14pt\">4 (14 pt)</option><option value=\"18pt\">5 (18 pt)</option><option value=\"24pt\">6 (24 pt)</option><option value=\"36pt\">7 (36 pt)</option></select></nobr></div><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl25\" class=\"ajax__htmleditor_toolbar_button\" style=\"background-color: transparent; cursor: text; display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl26\" title=\"Cut\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl27\" title=\"Copy\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl28\" title=\"Paste\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl29\" title=\"Paste Plain Text\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl30\" title=\"Paste from MS Word (with cleanup)\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl31\" class=\"ajax__htmleditor_toolbar_button\" style=\"background-color: transparent; cursor: text; display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl32\" title=\"Decrease Indent\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl33\" title=\"Increase Indent\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl34\" class=\"ajax__htmleditor_toolbar_button\" style=\"background-color: transparent; cursor: text; display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl35\" title=\"Make Paragraph\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl36\" title=\"Justify Left\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl37\" title=\"Justify Center\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl38\" title=\"Justify Right\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl39\" title=\"Justify\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl40\" title=\"Remove Alignment\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl41\" class=\"ajax__htmleditor_toolbar_button\" style=\"background-color: transparent; cursor: text; display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl42\" title=\"Ordered List\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl43\" title=\"Bulleted List\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl44\" class=\"ajax__htmleditor_toolbar_button\" style=\"background-color: transparent; cursor: text; display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl45\" title=\"Insert horizontal rule\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl46\" title=\"Insert/Edit URL link\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /><div id=\""+id+"_ctl01_ctl47\" style=\"position: absolute; top: -2000px; left: -2000px;\"><iframe frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" tabindex=\"-1\" id=\""+id+"_ctl01_ctl47_ctl00\"></iframe><div id=\""+id+"_ctl01_ctl47_ctl01\" style=\"display: none;\"><div class=\"ajax__htmleditor_attachedpopup_default\"><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tbody><tr><td align=\"left\">URL:</td><td align=\"left\"><input type=\"text\" name=\""+id+"$ctl01$ctl47$ctl05\""
+ " maxlength=\"255\" id=\""+id+"_ctl01_ctl47_ctl05\" style=\"width: 200px;\" /></td></tr><tr><td align=\"left\">Target:</td><td align=\"left\"><select name=\""+id+"$ctl01$ctl47$ctl07\" id=\""+id+"_ctl01_ctl47_ctl07\" style=\"width: 105px;\"><option value=\"_blank\">New window</option><option value=\"_self\">Current window</option><option value=\"_parent\">Parent window</option><option value=\"_top\">Top window</option></select></td></tr></tbody></table><table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"width: 100%;\"><tbody><tr><td align=\"right\"><div id=\""+id+"_ctl01_ctl47_ctl09\" class=\"ajax__htmleditor_popup_boxbutton ajax__htmleditor_popup_confirmbutton\"><table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody><tr><td align=\"center\" valign=\"middle\" class=\"ajax__htmleditor_popup_bgibutton\">OK</td></tr></tbody></table></div><div id=\""+id+"_ctl01_ctl47_ctl10\" class=\"ajax__htmleditor_popup_boxbutton ajax__htmleditor_popup_confirmbutton\"><table cellspacing=\"0\" cellpadding=\"0\" border=\"0\"><tbody><tr><td align=\"center\" valign=\"middle\" class=\"ajax__htmleditor_popup_bgibutton\">Cancel</td></tr></tbody></table></div></td></tr></tbody></table></div></div></div><img src=\"none\" alt=\"\" id=\""+id+"_ctl01_ctl48\" title=\"Remove Link\" class=\"ajax__htmleditor_toolbar_button\" style=\"display: none;\" /></div></td></tr><tr><td class=\"ajax__htmleditor_editor_editpanel\""+((Sys.Extended.UI.HTMLEditor.isIE)?"style=\"height: expression(Sys.Extended.UI.HTMLEditor.Editor.MidleCellHeightForIE(this.parentNode.parentNode.parentNode,this.parentNode));\"":"")+"><div id=\""+id+"_ctl02\" style=\"width: 100%; height:100%;\"><iframe frameborder=\"0\" id=\""+id+"_ctl02_ctl00\" name=\""+id+"_ctl02_ctl00\" marginheight=\"0\" marginwidth=\"0\" style=\"border-width: 0px; height: 100%; width: 100%; display: none;\"></iframe><textarea id=\""+id+"_ctl02_ctl01\" class=\"ajax__htmleditor_htmlpanel_default\" style=\"height: 100%; width: 100%; display: none;\"></textarea><iframe frameborder=\"0\" id=\""+id+"_ctl02_ctl02\" name=\""+id+"_ctl02_ctl02\" marginheight=\"0\" marginwidth=\"0\" style=\"border-width: 0px; height: 100%; width: 100%; display: none;\"></iframe></div></td></tr><tr><td class=\"ajax__htmleditor_editor_bottomtoolbar\"><div id=\""+id+"_ctl03\"><img src=\"none\" alt=\"\" id=\""+id+"_ctl03_ctl00\" title=\"Design mode\" class=\"ajax__htmleditor_toolbar_button\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl03_ctl01\" title=\"HTML text\" class=\"ajax__htmleditor_toolbar_button\" /><img src=\"none\" alt=\"\" id=\""+id+"_ctl03_ctl02\" title=\"Preview\" class=\"ajax__htmleditor_toolbar_button\" /></div></td></tr></tbody></table>"
if (element.style.height.length > 0) newElement.firstChild.style.height = element.style.height;if (element.style.width.length > 0) newElement.firstChild.style.width = element.style.width;element.style.display = "none";var inputs = document.createElement("DIV");inputs.innerHTML = "<input name=\"_contentChanged_"+id+"_ctl02\" id=\"_contentChanged_"+id+"_ctl02\" type=\"hidden\" /><input name=\"_contentForce_"+id+"_ctl02\" value=\"1\" id=\"_contentForce_"+id+"_ctl02\" type=\"hidden\" /><input name=\"_content_"+id+"_ctl02\" id=\"_content_"+id+"_ctl02\" type=\"hidden\" value=\""+((element.value != null && typeof element.value != "undefined")?element.value.replace(/\"/g,"&quot;"):"")+"\" /><input name=\"_activeMode_"+id+"_ctl02\" value=\"0\" id=\"_activeMode_"+id+"_ctl02\" type=\"hidden\" />";while(inputs.firstChild) {
element.parentNode.insertBefore(inputs.firstChild, element);}
delete inputs;element.parentNode.insertBefore(newElement, element);this._editor = null;this._editorElement = newElement;
if (Sys.loader) {
    var url = Sys.loader.basePath || "";
    if (url) {
        if (url.charAt(url.length-1) !== "/") {
            url += "/";
        }
    }
    this._imagesPath = url + "extended/htmleditor/images/";
    this._popupCss = url + "extended/htmleditor/AttachedTemplatePopup.css";
    this._designPanelCss = url + "extended/htmleditor/DesignPane.css";
    this._documentCss = url + "extended/htmleditor/Document.css";
}
else {
    this._imagesPath = "";
    this._popupCss = "";
    this._designPanelCss = "";
    this._documentCss = "";
}
$create(Sys.Extended.UI.HTMLEditor.EditPanel, {"activeModeElement":$get("_activeMode_"+id+"_ctl02"),"contentChangedElement":$get("_contentChanged_"+id+"_ctl02"),"contentElement":$get("_content_"+id+"_ctl02"),"contentForceElement":$get("_contentForce_"+id+"_ctl02"),"designPanelCssPath":this.get_designPanelCss(),"documentCssPath":this.get_documentCss(),"imagePath_1x1":this.get_imagesPath()+"ed_1x1.gif","imagePath_anchor":this.get_imagesPath()+"ed_anchor.gif","imagePath_flash":this.get_imagesPath()+"ed_flash.gif","imagePath_media":this.get_imagesPath()+"ed_media.gif","imagePath_placeHolder":this.get_imagesPath()+"ed_placeHolder.gif","modePanelIds":id+"_ctl02_ctl00;"+id+"_ctl02_ctl01;"+id+"_ctl02_ctl02","toolbarIds":id+"_ctl03;"+id+"_ctl01"}, null, null, $get(id+"_ctl02"));
$create(Sys.Extended.UI.HTMLEditor.DesignPanel, null, null, {"editPanel":id+"_ctl02"}, $get(id+"_ctl02_ctl00"));
$create(Sys.Extended.UI.HTMLEditor.HtmlPanel, null, null, {"editPanel":id+"_ctl02"}, $get(id+"_ctl02_ctl01"));
$create(Sys.Extended.UI.HTMLEditor.PreviewPanel, null, null, {"editPanel":id+"_ctl02"}, $get(id+"_ctl02_ctl02"));
$create(Sys.Extended.UI.HTMLEditor.Editor, null, null, null, $get(id));
this._editor = $find(id);this.get_editor().set_editPanel($find(id+"_ctl02"));}
Sys.Extended.UI.HTMLEditor.ClientSideEditor.prototype = {
get_height : function() {
return Sys.Extended.UI.HTMLEditor.getStyle(this._editorElement.firstChild,"height");},
set_height : function(value) {
this._editorElement.firstChild.style.height = value;},
get_width : function() {
return Sys.Extended.UI.HTMLEditor.getStyle(this._editorElement.firstChild,"width");},
set_width : function(value) {
this._editorElement.firstChild.style.width = value;},
get_autofocus : function() {
return this.get_editor().get_autofocus();},
set_autofocus : function(value) {
this.get_editor().set_autofocus(value);},
get_content : function() {
return this.get_editor().get_content();},
set_content : function(value) {
this.get_editor().set_content(value);},
get_activeMode : function() {
return this.get_editor().get_activeMode();},
set_activeMode : function(value) {
this.get_editor().set_activeMode(value);},
get_imagesPath : function() {
return this._imagesPath;},
set_imagesPath : function(value) {
this._imagesPath = (value.length && value.length > 0)?((value.lastIndexOf("/") == (value.length-1))?(value):(value+"/")):"";},
get_popupCss : function() {
return this._popupCss;},
set_popupCss : function(value) {
this._popupCss = value;},
get_designPanelCss : function() {
return this._designPanelCss;},
set_designPanelCss : function(value) {
this._designPanelCss = value;},
get_documentCss : function() {
return this._documentCss;},
set_documentCss : function(value) {
this._documentCss = value;},
get_editor : function() {
return this._editor;},
initialize : function() {
var id = this.__id__;$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.Undo, {"activeModesIds":"0","downSrc":this.get_imagesPath()+"ed_undo_a.gif","normalSrc":this.get_imagesPath()+"ed_undo_n.gif"}, null, null, $get(id+"_ctl01_ctl00"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.Redo, {"activeModesIds":"0","downSrc":this.get_imagesPath()+"ed_redo_a.gif","normalSrc":this.get_imagesPath()+"ed_redo_n.gif"}, null, null, $get(id+"_ctl01_ctl01"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator, {"activeModesIds":"0","normalSrc":this.get_imagesPath()+"ed_sep.gif"}, null, null, $get(id+"_ctl01_ctl02"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.Bold, {"activeModesIds":"0","activeSrc":this.get_imagesPath()+"ed_format_bold_a.gif","downSrc":this.get_imagesPath()+"ed_format_bold_a.gif","normalSrc":this.get_imagesPath()+"ed_format_bold_n.gif"}, null, null, $get(id+"_ctl01_ctl03"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.Italic, {"activeModesIds":"0","activeSrc":this.get_imagesPath()+"ed_format_italic_a.gif","downSrc":this.get_imagesPath()+"ed_format_italic_a.gif","normalSrc":this.get_imagesPath()+"ed_format_italic_n.gif"}, null, null, $get(id+"_ctl01_ctl04"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.Underline, {"activeModesIds":"0","activeSrc":this.get_imagesPath()+"ed_format_underline_a.gif","downSrc":this.get_imagesPath()+"ed_format_underline_a.gif","normalSrc":this.get_imagesPath()+"ed_format_underline_n.gif"}, null, null, $get(id+"_ctl01_ctl05"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.StrikeThrough, {"activeModesIds":"0","activeSrc":this.get_imagesPath()+"ed_format_strike_a.gif","downSrc":this.get_imagesPath()+"ed_format_strike_a.gif","normalSrc":this.get_imagesPath()+"ed_format_strike_n.gif"}, null, null, $get(id+"_ctl01_ctl06"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.SubScript, {"activeModesIds":"0","activeSrc":this.get_imagesPath()+"ed_format_sub_a.gif","downSrc":this.get_imagesPath()+"ed_format_sub_a.gif","normalSrc":this.get_imagesPath()+"ed_format_sub_n.gif"}, null, null, $get(id+"_ctl01_ctl07"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.SuperScript, {"activeModesIds":"0","activeSrc":this.get_imagesPath()+"ed_format_sup_a.gif","downSrc":this.get_imagesPath()+"ed_format_sup_a.gif","normalSrc":this.get_imagesPath()+"ed_format_sup_n.gif"}, null, null, $get(id+"_ctl01_ctl08"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator, {"activeModesIds":"0","normalSrc":this.get_imagesPath()+"ed_sep.gif"}, null, null, $get(id+"_ctl01_ctl09"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.Ltr, {"activeModesIds":"0","activeSrc":this.get_imagesPath()+"ed_format_ltr_a.gif","downSrc":this.get_imagesPath()+"ed_format_ltr_a.gif","normalSrc":this.get_imagesPath()+"ed_format_ltr_n.gif"}, null, null, $get(id+"_ctl01_ctl10"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.Rtl, {"activeModesIds":"0","activeSrc":this.get_imagesPath()+"ed_format_rtl_a.gif","downSrc":this.get_imagesPath()+"ed_format_rtl_a.gif","normalSrc":this.get_imagesPath()+"ed_format_rtl_n.gif"}, null, null, $get(id+"_ctl01_ctl11"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator, {"activeModesIds":"0","normalSrc":this.get_imagesPath()+"ed_sep.gif"}, null, null, $get(id+"_ctl01_ctl12"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton, {"activeModesIds":"0","downSrc":this.get_imagesPath()+"ed_forecolor_a.gif","normalSrc":this.get_imagesPath()+"ed_forecolor_n.gif"}, null, null, $get(id+"_ctl01_FixedForeColor_ctl01"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeBoxButton, {"activeModesIds":"0"}, null, null, $get(id+"_ctl01_FixedForeColor_ctl02"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedForeColor, {"activeModesIds":"0","defaultColor":"#FF0000"}, null, {"colorDiv":id+"_ctl01_FixedForeColor_ctl02","methodButton":id+"_ctl01_FixedForeColor_ctl01"}, $get(id+"_ctl01_FixedForeColor"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorSelector, {"activeModesIds":"0","autoClose":true,"downSrc":this.get_imagesPath()+"ed_selector_a.gif","normalSrc":this.get_imagesPath()+"ed_selector_n.gif"}, null, {"fixedColorButton":id+"_ctl01_FixedForeColor","relatedPopup":id+"_ctl01_ctl14"}, $get(id+"_ctl01_ctl13"));$create(Sys.Extended.UI.HTMLEditor.Popups.BaseColorsPopup, {"contentDiv":$get(id+"_ctl01_ctl14_ctl01"),"cssPath":this.get_popupCss(),"iframe":$get(id+"_ctl01_ctl14_ctl00"),"registeredFields":"[]","registeredHandlers":"[]"}, null, null, $get(id+"_ctl01_ctl14"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.ForeColorClear, {"activeModesIds":"0","downSrc":this.get_imagesPath()+"ed_color_fg_clear_a.gif","normalSrc":this.get_imagesPath()+"ed_color_fg_clear_n.gif"}, null, null, $get(id+"_ctl01_ctl15"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator, {"activeModesIds":"0","normalSrc":this.get_imagesPath()+"ed_sep.gif"}, null, null, $get(id+"_ctl01_ctl16"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.MethodButton, {"activeModesIds":"0","downSrc":this.get_imagesPath()+"ed_backcolor_a.gif","normalSrc":this.get_imagesPath()+"ed_backcolor_n.gif"}, null, null, $get(id+"_ctl01_FixedBackColor_ctl01"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignModeBoxButton, {"activeModesIds":"0"}, null, null, $get(id+"_ctl01_FixedBackColor_ctl02"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.FixedBackColor, {"activeModesIds":"0","defaultColor":"#FFFF00"}, null, {"colorDiv":id+"_ctl01_FixedBackColor_ctl02","methodButton":id+"_ctl01_FixedBackColor_ctl01"}, $get(id+"_ctl01_FixedBackColor"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorSelector, {"activeModesIds":"0","autoClose":true,"downSrc":this.get_imagesPath()+"ed_selector_a.gif","normalSrc":this.get_imagesPath()+"ed_selector_n.gif"}, null, {"fixedColorButton":id+"_ctl01_FixedBackColor","relatedPopup":id+"_ctl01_ctl14"}, $get(id+"_ctl01_ctl17"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.BackColorClear, {"activeModesIds":"0","downSrc":this.get_imagesPath()+"ed_color_bg_clear_a.gif","normalSrc":this.get_imagesPath()+"ed_color_bg_clear_n.gif"}, null, null, $get(id+"_ctl01_ctl18"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator, {"activeModesIds":"0","normalSrc":this.get_imagesPath()+"ed_sep.gif"}, null, null, $get(id+"_ctl01_ctl19"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveStyles, {"activeModesIds":"0","downSrc":this.get_imagesPath()+"ed_unformat_a.gif","normalSrc":this.get_imagesPath()+"ed_unformat_n.gif"}, null, null, $get(id+"_ctl01_ctl20"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator, {"activeModesIds":"0","normalSrc":this.get_imagesPath()+"ed_sep.gif"}, null, null, $get(id+"_ctl01_ctl21"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.FontName, {"activeModesIds":"0"}, null, null, $get(id+"_ctl01_ctl22"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator, {"activeModesIds":"0","normalSrc":this.get_imagesPath()+"ed_sep.gif"}, null, null, $get(id+"_ctl01_ctl23"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.FontSize, {"activeModesIds":"0"}, null, null, $get(id+"_ctl01_ctl24"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator, {"activeModesIds":"0","normalSrc":this.get_imagesPath()+"ed_sep.gif"}, null, null, $get(id+"_ctl01_ctl25"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.Cut, {"activeModesIds":"0","downSrc":this.get_imagesPath()+"ed_cut_a.gif","normalSrc":this.get_imagesPath()+"ed_cut_n.gif"}, null, null, $get(id+"_ctl01_ctl26"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.Copy, {"activeModesIds":"0","downSrc":this.get_imagesPath()+"ed_copy_a.gif","normalSrc":this.get_imagesPath()+"ed_copy_n.gif"}, null, null, $get(id+"_ctl01_ctl27"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.Paste, {"activeModesIds":"0","downSrc":this.get_imagesPath()+"ed_paste_a.gif","normalSrc":this.get_imagesPath()+"ed_paste_n.gif"}, null, null, $get(id+"_ctl01_ctl28"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteText, {"activeModesIds":"0","downSrc":this.get_imagesPath()+"ed_pasteText_a.gif","normalSrc":this.get_imagesPath()+"ed_pasteText_n.gif"}, null, null, $get(id+"_ctl01_ctl29"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.PasteWord, {"activeModesIds":"0","downSrc":this.get_imagesPath()+"ed_pasteWord_a.gif","normalSrc":this.get_imagesPath()+"ed_pasteWord_n.gif"}, null, null, $get(id+"_ctl01_ctl30"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator, {"activeModesIds":"0","normalSrc":this.get_imagesPath()+"ed_sep.gif"}, null, null, $get(id+"_ctl01_ctl31"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.DecreaseIndent, {"activeModesIds":"0","downSrc":this.get_imagesPath()+"ed_indent_less_a.gif","normalSrc":this.get_imagesPath()+"ed_indent_less_n.gif"}, null, null, $get(id+"_ctl01_ctl32"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.IncreaseIndent, {"activeModesIds":"0","downSrc":this.get_imagesPath()+"ed_indent_more_a.gif","normalSrc":this.get_imagesPath()+"ed_indent_more_n.gif"}, null, null, $get(id+"_ctl01_ctl33"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator, {"activeModesIds":"0","normalSrc":this.get_imagesPath()+"ed_sep.gif"}, null, null, $get(id+"_ctl01_ctl34"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.Paragraph, {"activeModesIds":"0","activeSrc":this.get_imagesPath()+"ed_format_paragraph_a.gif","downSrc":this.get_imagesPath()+"ed_format_paragraph_a.gif","normalSrc":this.get_imagesPath()+"ed_format_paragraph_n.gif"}, null, null, $get(id+"_ctl01_ctl35"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyLeft, {"activeModesIds":"0","activeSrc":this.get_imagesPath()+"ed_align_left_a.gif","downSrc":this.get_imagesPath()+"ed_align_left_a.gif","normalSrc":this.get_imagesPath()+"ed_align_left_n.gif"}, null, null, $get(id+"_ctl01_ctl36"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyCenter, {"activeModesIds":"0","activeSrc":this.get_imagesPath()+"ed_align_center_a.gif","downSrc":this.get_imagesPath()+"ed_align_center_a.gif","normalSrc":this.get_imagesPath()+"ed_align_center_n.gif"}, null, null, $get(id+"_ctl01_ctl37"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyRight, {"activeModesIds":"0","activeSrc":this.get_imagesPath()+"ed_align_right_a.gif","downSrc":this.get_imagesPath()+"ed_align_right_a.gif","normalSrc":this.get_imagesPath()+"ed_align_right_n.gif"}, null, null, $get(id+"_ctl01_ctl38"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.JustifyFull, {"activeModesIds":"0","activeSrc":this.get_imagesPath()+"ed_align_justify_a.gif","downSrc":this.get_imagesPath()+"ed_align_justify_a.gif","normalSrc":this.get_imagesPath()+"ed_align_justify_n.gif"}, null, null, $get(id+"_ctl01_ctl39"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveAlignment, {"activeModesIds":"0","activeSrc":this.get_imagesPath()+"ed_removealign_a.gif","downSrc":this.get_imagesPath()+"ed_removealign_a.gif","normalSrc":this.get_imagesPath()+"ed_removealign_n.gif"}, null, null, $get(id+"_ctl01_ctl40"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator, {"activeModesIds":"0","normalSrc":this.get_imagesPath()+"ed_sep.gif"}, null, null, $get(id+"_ctl01_ctl41"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.OrderedList, {"activeModesIds":"0","downSrc":this.get_imagesPath()+"ed_list_num_a.gif","normalSrc":this.get_imagesPath()+"ed_list_num_n.gif"}, null, null, $get(id+"_ctl01_ctl42"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.BulletedList, {"activeModesIds":"0","downSrc":this.get_imagesPath()+"ed_list_bullet_a.gif","normalSrc":this.get_imagesPath()+"ed_list_bullet_n.gif"}, null, null, $get(id+"_ctl01_ctl43"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.HorizontalSeparator, {"activeModesIds":"0","normalSrc":this.get_imagesPath()+"ed_sep.gif"}, null, null, $get(id+"_ctl01_ctl44"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.InsertHR, {"activeModesIds":"0","downSrc":this.get_imagesPath()+"ed_rule_a.gif","normalSrc":this.get_imagesPath()+"ed_rule_n.gif"}, null, null, $get(id+"_ctl01_ctl45"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.InsertLink, {"activeModesIds":"0","autoClose":false,"downSrc":this.get_imagesPath()+"ed_link_a.gif","normalSrc":this.get_imagesPath()+"ed_link_n.gif"}, null, {"relatedPopup":id+"_ctl01_ctl47"}, $get(id+"_ctl01_ctl46"));$create(Sys.Extended.UI.HTMLEditor.Popups.PopupBGIButton, {"name":"OK"}, null, null, $get(id+"_ctl01_ctl47_ctl09"));$create(Sys.Extended.UI.HTMLEditor.Popups.PopupBGIButton, {"name":"Cancel"}, null, null, $get(id+"_ctl01_ctl47_ctl10"));$create(Sys.Extended.UI.HTMLEditor.Popups.LinkProperties, {"contentDiv":$get(id+"_ctl01_ctl47_ctl01"),"cssPath":this.get_popupCss(),"defaultTarget":"_self","iframe":$get(id+"_ctl01_ctl47_ctl00"),"registeredFields":"[{name: \u0027url\u0027, clientID: \u0027"+id+"_ctl01_ctl47_ctl05\u0027},{name: \u0027target\u0027, clientID: \u0027"+id+"_ctl01_ctl47_ctl07\u0027}]","registeredHandlers":"[{name: \u0027OK\u0027, clientID: \u0027"+id+"_ctl01_ctl47_ctl09\u0027, callMethod: null},{name: \u0027Cancel\u0027, clientID: \u0027"+id+"_ctl01_ctl47_ctl10\u0027, callMethod: null}]"}, null, null, $get(id+"_ctl01_ctl47"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.RemoveLink, {"activeModesIds":"0","downSrc":this.get_imagesPath()+"ed_unlink_a.gif","normalSrc":this.get_imagesPath()+"ed_unlink_n.gif"}, null, null, $get(id+"_ctl01_ctl48"));$create(Sys.Extended.UI.HTMLEditor.Toolbar, {"buttonIds":id+"_ctl01_ctl00;"+id+"_ctl01_ctl01;"+id+"_ctl01_ctl02;"+id+"_ctl01_ctl03;"+id+"_ctl01_ctl04;"+id+"_ctl01_ctl05;"+id+"_ctl01_ctl06;"+id+"_ctl01_ctl07;"+id+"_ctl01_ctl08;"+id+"_ctl01_ctl09;"+id+"_ctl01_ctl10;"+id+"_ctl01_ctl11;"+id+"_ctl01_ctl12;"+id+"_ctl01_FixedForeColor;"+id+"_ctl01_ctl13;"+id+"_ctl01_ctl15;"+id+"_ctl01_ctl16;"+id+"_ctl01_FixedBackColor;"+id+"_ctl01_ctl17;"+id+"_ctl01_ctl18;"+id+"_ctl01_ctl19;"+id+"_ctl01_ctl20;"+id+"_ctl01_ctl21;"+id+"_ctl01_ctl22;"+id+"_ctl01_ctl23;"+id+"_ctl01_ctl24;"+id+"_ctl01_ctl25;"+id+"_ctl01_ctl26;"+id+"_ctl01_ctl27;"+id+"_ctl01_ctl28;"+id+"_ctl01_ctl29;"+id+"_ctl01_ctl30;"+id+"_ctl01_ctl31;"+id+"_ctl01_ctl32;"+id+"_ctl01_ctl33;"+id+"_ctl01_ctl34;"+id+"_ctl01_ctl35;"+id+"_ctl01_ctl36;"+id+"_ctl01_ctl37;"+id+"_ctl01_ctl38;"+id+"_ctl01_ctl39;"+id+"_ctl01_ctl40;"+id+"_ctl01_ctl41;"+id+"_ctl01_ctl42;"+id+"_ctl01_ctl43;"+id+"_ctl01_ctl44;"+id+"_ctl01_ctl45;"+id+"_ctl01_ctl46;"+id+"_ctl01_ctl48"}, null, null, $get(id+"_ctl01"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.DesignMode, {"activeModesIds":"0;1;2","activeSrc":this.get_imagesPath()+"ed_design_a.gif","downSrc":this.get_imagesPath()+"ed_design_a.gif","normalSrc":this.get_imagesPath()+"ed_design_n.gif"}, null, null, $get(id+"_ctl03_ctl00"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.HtmlMode, {"activeMode":1,"activeModesIds":"0;1;2","activeSrc":this.get_imagesPath()+"ed_html_a.gif","downSrc":this.get_imagesPath()+"ed_html_a.gif","normalSrc":this.get_imagesPath()+"ed_html_n.gif"}, null, null, $get(id+"_ctl03_ctl01"));$create(Sys.Extended.UI.HTMLEditor.ToolbarButton.PreviewMode, {"activeMode":2,"activeModesIds":"0;1;2","activeSrc":this.get_imagesPath()+"ed_preview_a.gif","downSrc":this.get_imagesPath()+"ed_preview_a.gif","normalSrc":this.get_imagesPath()+"ed_preview_n.gif"}, null, null, $get(id+"_ctl03_ctl02"));$create(Sys.Extended.UI.HTMLEditor.Toolbar, {"alwaysVisible":true,"buttonIds":id+"_ctl03_ctl00;"+id+"_ctl03_ctl01;"+id+"_ctl03_ctl02"}, null, null, $get(id+"_ctl03"));this.get_editor().set_changingToolbar($find(id+"_ctl01"));if (Sys.Extended.UI.HTMLEditor.isIE && Sys.Browser.version == 8 && document.compatMode != "BackCompat") {
this.get_editor()._saved_set_activeEditPanel = this.get_editor().get_changingToolbar().set_activeEditPanel;this.get_editor()._saved_disable = this.get_editor().get_changingToolbar().disable;this.get_editor().get_changingToolbar().set_activeEditPanel = Function.createDelegate(this.get_editor(), this.get_editor()._set_activeEditPanel);this.get_editor().get_changingToolbar().disable = Function.createDelegate(this.get_editor(), this.get_editor()._disable);}
Sys.Extended.UI.HTMLEditor.ClientSideEditor.callBaseMethod(this, "initialize");},
dispose : function() { 
Sys.Extended.UI.HTMLEditor.ClientSideEditor.callBaseMethod(this, "dispose");}
}
Sys.Extended.UI.HTMLEditor.ClientSideEditor.registerClass("Sys.Extended.UI.HTMLEditor.ClientSideEditor", Sys.UI.Control);

} // execute

if (window.Sys && Sys.loader) {
    Sys.loader.registerScript(scriptName, ["ExtendedDynamicPopulate"], execute);
}
else {
    execute();
}

})();
