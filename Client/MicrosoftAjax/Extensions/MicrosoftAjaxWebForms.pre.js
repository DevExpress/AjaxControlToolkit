//#localize Sys.WebForms.Res true ..\Resources\WebForms.Res.resx
(function() {

function execute() {

Type._registerScript("MicrosoftAjaxWebForms.js", [
	"MicrosoftAjaxCore.js",
	"MicrosoftAjaxSerialization.js",
	"MicrosoftAjaxNetwork.js",
	"MicrosoftAjaxComponentModel.js"]);
var $type, $prototype;
Type.registerNamespace('Sys.WebForms');

//#include "Sys\WebForms\BeginRequestEventArgs.js"
//#include "Sys\WebForms\EndRequestEventArgs.js"
//#include "Sys\WebForms\InitializeRequestEventArgs.js"
//#include "Sys\WebForms\PageLoadedEventArgs.js"
//#include "Sys\WebForms\PageLoadingEventArgs.js"
//#include "Sys\ScriptLoaderTask.js"
//#include "Sys\ScriptLoader.js"
//#include "Sys\WebForms\PageRequestManager.js"
//#include "Sys\UI\Controls\UpdateProgress.js"

}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("WebForms", ["ComponentModel", "Serialization", "Network"], execute);
}
else {
	execute();
}

})();
