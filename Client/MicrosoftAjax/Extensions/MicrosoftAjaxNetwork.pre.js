//!/ <reference name="MicrosoftAjaxSerialization.js" />

(function() {

function execute() {

Type._registerScript("MicrosoftAjaxNetwork.js", ["MicrosoftAjaxSerialization.js"]);
var $type, $prototype;

//#include "Sys\XMLHttpRequest.js"

Type.registerNamespace('Sys.Net');

//#include "Sys\Net\WebRequestExecutor.js"
//#include "Sys\Net\XMLHttpExecutor.js"
//#include "Sys\Net\WebRequestManager.js"
//#include "Sys\Net\NetworkRequestEventArgs.js"
//#include "Sys\Net\WebRequest.js"

}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("Network", null, execute);
}
else {
	execute();
}

})();