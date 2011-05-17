//!/ <reference name="MicrosoftAjaxWebServices.js" />

(function() {

function execute() {

Type._registerScript("MicrosoftAjaxApplicationServices.js", ["MicrosoftAjaxWebServices.js"]);

var $type, $prototype;
Type.registerNamespace('Sys.Services');

//#include "Sys\Services\ProfileService.js"
//#include "Sys\Services\AuthenticationService.js"
//#include "Sys\Services\RoleService.js"
}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("ApplicationServices", null, execute);
}
else {
	execute();
}

})();