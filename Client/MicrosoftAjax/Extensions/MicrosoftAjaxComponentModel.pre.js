//!/ <reference name="MicrosoftAjaxCore.js" />

(function() {

function execute() {

Type._registerScript("MicrosoftAjaxComponentModel.js", ["MicrosoftAjaxCore.js"]);

Type.registerNamespace('Sys.UI');

var $type, $prototype,
    isBrowser = Sys._isBrowser,
	foreach = Sys._foreach,
	forIn = Sys._forIn,
	callIf = Sys._callIf;

//#include "Sys\CommandEventArgs.js"
//#include "Sys\INotifyDisposing.js"
//#include "Sys\Component.js"
//#include "Sys\UI\MouseButton.js"
//#include "Sys\UI\Key.js"
//#include "Sys\UI\Point.js"
//#include "Sys\UI\Bounds.js"
//#include "Sys\UI\DomEvent.js"
//#include "Sys\UI\DomElement.js"
//#include "Sys\IContainer.js"
//#include "Sys\ApplicationLoadEventArgs.js"
//#include "Sys\Application.js"

//#include "Sys\UI\Behavior.js"
//#include "Sys\UI\VisibilityMode.js"
//#include "Sys\UI\Control.js"

}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("ComponentModel", null, execute);
}
else {
	execute();
}

})();
var $get, $create, $addHandler, $addHandlers, $clearHandlers;
