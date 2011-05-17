(function() {

function execute() {
Type._registerScript("Date.UmAlQuraCalendar.js", ["MicrosoftAjaxGlobalization.js"]);
//#include "Date.UmAlQuraCalendar.js"
}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("UmAlQuraCalendar", null, execute);
}
else {
	execute();
}

})();