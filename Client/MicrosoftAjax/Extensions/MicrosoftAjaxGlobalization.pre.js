//!/ <reference name="MicrosoftAjaxCore.js" />

(function() {

function execute() {

Type._registerScript("MicrosoftAjaxGlobalization.js", ["MicrosoftAjaxCore.js"]);

var $type, $prototype,
    merge = Sys._merge,
	forIn = Sys._forIn,
    foreach = Sys._foreach,
    indexOf = Sys._indexOf;

//#include "Date.Globalization.js"
//#include "String.Globalization.js"
//#include "Number.Globalization.js"
//#include "Sys\CultureInfo.js"

}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("Globalization", null, execute);
}
else {
	execute();
}

})();