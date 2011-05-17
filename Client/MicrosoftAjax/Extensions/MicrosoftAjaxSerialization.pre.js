//!/ <reference name="MicrosoftAjaxCore.js" />

(function() {

function execute() {

Type._registerScript("MicrosoftAjaxSerialization.js", ["MicrosoftAjaxCore.js"]);

var $type, $prototype,
    isBrowser = Sys._isBrowser,
	merge = Sys._merge;

Type.registerNamespace('Sys.Serialization');

//#include "Sys\Serialization\JavaScriptSerializer.js"

}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("Serialization", null, execute);
}
else {
	execute();
}

})();