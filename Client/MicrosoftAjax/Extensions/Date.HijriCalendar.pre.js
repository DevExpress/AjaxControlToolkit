(function() {

function execute() {
Type._registerScript("Date.HijriCalendar.js", ["MicrosoftAjaxGlobalization.js"]);
//#include "Date.HijriCalendar.js"
}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("HijriCalendar", null, execute);
}
else {
	execute();
}

})();