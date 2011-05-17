//!/ <reference name="MicrosoftAjaxComponentModel.js" />
//!/ <reference name="MicrosoftAjaxSerialization.js" />

(function() {

function execute() {

Type._registerScript("MicrosoftAjaxHistory.js", ["MicrosoftAjaxComponentModel.js", "MicrosoftAjaxSerialization.js"]);

var $type, $prototype,
    isBrowser = Sys._isBrowser;

//#include "Sys\HistoryEventArgs.js"
//#include "Sys\Application.History.js"

}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("History", null, execute);
}
else {
	execute();
}

})();
