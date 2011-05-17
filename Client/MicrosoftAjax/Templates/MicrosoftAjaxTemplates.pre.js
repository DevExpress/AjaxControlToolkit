//#localize Sys.UI.TemplatesRes true ..\Resources\Templates.Res.resx

//!/ <reference name="MicrosoftAjaxComponentModel.js" />
//!/ <reference name="MicrosoftAjaxSerialization.js" />

// depends on ComponentModel because of knowledge of Sys.UI.Control and Sys.Component.
// depends on Serialization because the serializer is required when converting attribute node values to javascript.
(function() {

function execute($) {
Type._registerScript("MicrosoftAjaxTemplates.js", ["MicrosoftAjaxComponentModel.js", "MicrosoftAjaxSerialization.js"]);

var $type, $prototype,
    merge = Sys._merge,
	foreach = Sys._foreach,
	forIn = Sys._forIn,
	isBrowser = Sys._isBrowser;

function serialize(obj) {
	return Sys.Serialization.JavaScriptSerializer.serialize(obj);
}

Type.registerNamespace("Sys.Net");

//#include "Net\WebRequestEventArgs.js"

Type.registerNamespace("Sys.Data");

if (!Sys.Data.IDataProvider) {
//#include "Data\IDataProvider.js"
}
if (!Sys.Data.MergeOption) {
//#include "Data\MergeOption.js"
}

Type.registerNamespace("Sys.UI");

//#include "Application_MarkupExtensions.js"
//#include "Template.js"
//#include "TemplateContext.js"
//#include "ITemplateContextConsumer.js"
//#include "DOMProcessor.js"
//#include "BindingMode.js"

//#include "Binding.js"
//#include "DataView.js"
//#include "DataViewEventArgs.js"
}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("Templates", null, execute);
}
else {
	execute();
}

})();
