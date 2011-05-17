//!/ <reference name="MicrosoftAjaxNetwork.js" />

(function() {

function execute() {

Type._registerScript("MicrosoftAjaxWebServices.js", ["MicrosoftAjaxNetwork.js"]);
var $type, $prototype;
Type.registerNamespace('Sys.Net');

//#include "Sys\Net\WebServiceProxy.js"
//#include "Sys\Net\WebServiceError.js"

}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("WebServices", null, execute);
}
else {
	execute();
}

})();