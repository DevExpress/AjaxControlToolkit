Type.registerNamespace('AjaxControlToolkit');AjaxControlToolkit.DynamicPopulateBehavior = function(element) {
AjaxControlToolkit.DynamicPopulateBehavior.initializeBase(this, [element]);this._servicePath = null;this._serviceMethod = null;this._contextKey = null;this._cacheDynamicResults = false;this._populateTriggerID = null;this._setUpdatingCssClass = null;this._clearDuringUpdate = true;this._customScript = null;this._clickHandler = null;this._callID = 0;this._currentCallID = -1;this._populated = false;}
AjaxControlToolkit.DynamicPopulateBehavior.prototype = {
initialize : function() {
AjaxControlToolkit.DynamicPopulateBehavior.callBaseMethod(this, 'initialize');$common.prepareHiddenElementForATDeviceUpdate();if (this._populateTriggerID) {
var populateTrigger = $get(this._populateTriggerID);if (populateTrigger) {
this._clickHandler = Function.createDelegate(this, this._onPopulateTriggerClick);$addHandler(populateTrigger, "click", this._clickHandler);}
}
},
dispose : function() {
if (this._populateTriggerID && this._clickHandler) {
var populateTrigger = $get(this._populateTriggerID);if (populateTrigger) {
$removeHandler(populateTrigger, "click", this._clickHandler);}
this._populateTriggerID = null;this._clickHandler = null;}
AjaxControlToolkit.DynamicPopulateBehavior.callBaseMethod(this, 'dispose');},
populate : function(contextKey) {
if (this._populated && this._cacheDynamicResults) {
return;}
if (this._currentCallID == -1) {
var eventArgs = new Sys.CancelEventArgs();this.raisePopulating(eventArgs);if (eventArgs.get_cancel()) {
return;}
this._setUpdating(true);}
if (this._customScript) {
var scriptResult = eval(this._customScript);this._setTargetHtml(scriptResult);this._setUpdating(false);} else {
this._currentCallID = ++this._callID;if (this._servicePath && this._serviceMethod) {
Sys.Net.WebServiceProxy.invoke(this._servicePath, this._serviceMethod, false,
{ contextKey:(contextKey ? contextKey : this._contextKey) },
Function.createDelegate(this, this._onMethodComplete), Function.createDelegate(this, this._onMethodError),
this._currentCallID);$common.updateFormToRefreshATDeviceBuffer();}
}
},
_onMethodComplete : function (result, userContext, methodName) {
if (userContext != this._currentCallID) return;this._setTargetHtml(result);this._setUpdating(false);},
_onMethodError : function(webServiceError, userContext, methodName) {
if (userContext != this._currentCallID) return;if (webServiceError.get_timedOut()) {
this._setTargetHtml(AjaxControlToolkit.Resources.DynamicPopulate_WebServiceTimeout);} else {
this._setTargetHtml(String.format(AjaxControlToolkit.Resources.DynamicPopulate_WebServiceError, webServiceError.get_statusCode()));}
this._setUpdating(false);},
_onPopulateTriggerClick : function() {
this.populate(this._contextKey);},
_setUpdating : function(updating) {
this.setStyle(updating);if (!updating) {
this._currentCallID = -1;this._populated = true;this.raisePopulated(this, Sys.EventArgs.Empty);}
},
_setTargetHtml : function(value) {
var e = this.get_element()
if (e) {
if (e.tagName == "INPUT") {
e.value = value;} else {
e.innerHTML = value;}
}
},
setStyle : function(updating) {
var e = this.get_element();if (this._setUpdatingCssClass) {
if (!updating) {
e.className = this._oldCss;this._oldCss = null;} else {
this._oldCss = e.className;e.className = this._setUpdatingCssClass;}
}
if (updating && this._clearDuringUpdate) {
this._setTargetHtml("");}
},
get_ClearContentsDuringUpdate : function() {
return this._clearDuringUpdate;},
set_ClearContentsDuringUpdate : function(value) {
if (this._clearDuringUpdate != value) {
this._clearDuringUpdate = value;this.raisePropertyChanged('ClearContentsDuringUpdate');}
},
get_ContextKey : function() {
return this._contextKey;},
set_ContextKey : function(value) {
if (this._contextKey != value) {
this._contextKey = value;this.raisePropertyChanged('ContextKey');}
},
get_PopulateTriggerID : function() {
return this._populateTriggerID;},
set_PopulateTriggerID : function(value) {
if (this._populateTriggerID != value) {
this._populateTriggerID = value;this.raisePropertyChanged('PopulateTriggerID');}
},
get_ServicePath : function() {
return this._servicePath;},
set_ServicePath : function(value) {
if (this._servicePath != value) {
this._servicePath = value;this.raisePropertyChanged('ServicePath');}
},
get_ServiceMethod : function() {
return this._serviceMethod;},
set_ServiceMethod : function(value) {
if (this._serviceMethod != value) {
this._serviceMethod = value;this.raisePropertyChanged('ServiceMethod');}
},
get_cacheDynamicResults : function() {
return this._cacheDynamicResults;},
set_cacheDynamicResults : function(value) {
if (this._cacheDynamicResults != value) {
this._cacheDynamicResults = value;this.raisePropertyChanged('cacheDynamicResults');}
},
get_UpdatingCssClass : function() {
return this._setUpdatingCssClass;},
set_UpdatingCssClass : function(value) {
if (this._setUpdatingCssClass != value) {
this._setUpdatingCssClass = value;this.raisePropertyChanged('UpdatingCssClass');}
},
get_CustomScript : function() {
return this._customScript;}, 
set_CustomScript : function(value) {
if (this._customScript != value) {
this._customScript = value;this.raisePropertyChanged('CustomScript');}
},
add_populating : function(handler) {
this.get_events().addHandler('populating', handler);},
remove_populating : function(handler) {
this.get_events().removeHandler('populating', handler);},
raisePopulating : function(eventArgs) {
var handler = this.get_events().getHandler('populating');if (handler) {
handler(this, eventArgs);}
},
add_populated : function(handler) {
this.get_events().addHandler('populated', handler);},
remove_populated : function(handler) {
this.get_events().removeHandler('populated', handler);},
raisePopulated : function(eventArgs) {
var handler = this.get_events().getHandler('populated');if (handler) {
handler(this, eventArgs);}
}
}
AjaxControlToolkit.DynamicPopulateBehavior.registerClass('AjaxControlToolkit.DynamicPopulateBehavior', AjaxControlToolkit.BehaviorBase);
if(typeof(Sys)!=='undefined')Sys.Application.notifyScriptLoaded();
