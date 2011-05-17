(function() {

function execute() {
Type._registerScript("Timer.js", ["MicrosoftAjaxComponentModel.js"]);
var $type, $prototype;
//#include "Sys\UI\Controls\Timer.js"
}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("Timer", null, execute);
}
else {
	execute();
}

})();
