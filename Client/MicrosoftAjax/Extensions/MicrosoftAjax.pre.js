//#localize Sys.Res false ..\Resources\Res.resx

(function(window, Sys) {

//#include "global.js"
//#define CORE
if (!Sys || !Sys.loader) {
//#include "../loader/loader.js"
}
//#include "../loader/RegisterPlugin.js"

function execute() {

var $type, $prototype;
Sys._foreach = foreach;
Sys._forIn = forIn;
Sys._merge = merge;
Sys._callIf = callIf;

//#include "Function.js"
//#include "Error.js"
//#include "Object.js"
//#include "String.js"
//#include "Boolean.js"
//#include "Date.js"
//#include "Number.js"
//#include "RegExp.js"
//#include "Type.js"
//#include "Array.js"

Type._registerScript._scripts = {
	"MicrosoftAjaxCore.js": true,
	"MicrosoftAjaxGlobalization.js": true,
	"MicrosoftAjaxSerialization.js": true,
	"MicrosoftAjaxComponentModel.js": true,
	"MicrosoftAjaxHistory.js": true,
	"MicrosoftAjaxNetwork.js" : true,
	"MicrosoftAjaxWebServices.js": true };

//#include "Sys\IDisposable.js"
//#include "Sys\StringBuilder.js"

// Compat
//#include "Compat\Browser.js"

//#include "Sys\EventArgs.js"
//#include "Sys\CancelEventArgs.js"

// Base Class Library

Type.registerNamespace('Sys.UI');

//#include "Sys\Debug.js"
//#include "Sys\Enum.js"

//#include "Sys\CollectionChange.js"
//#include "Sys\NotifyCollectionChangedAction.js"
//#include "Sys\NotifyCollectionChangedEventArgs.js"
//#include "Sys\Observer.js"

// **********************************************
// ** MicrosoftAjaxGlobalization.jsa
// **********************************************

//#include "Date.Globalization.js"
//#include "String.Globalization.js"
//#include "Number.Globalization.js"
//#include "Sys\CultureInfo.js"



// **********************************************
// ** MicrosoftAjaxSerialization.jsa
// **********************************************

Type.registerNamespace('Sys.Serialization');

//#include "Sys\Serialization\JavaScriptSerializer.js"

// **********************************************
// ** MicrosoftAjaxComponentModel.jsa
// **********************************************

Type.registerNamespace('Sys.UI');

//#include "Sys\EventHandlerList.js"
//#include "Sys\CommandEventArgs.js"
//#include "Sys\INotifyPropertyChange.js"
//#include "Sys\PropertyChangedEventArgs.js"
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


// **********************************************
// ** MicrosoftAjaxHistory.jsa
// **********************************************

//#include "Sys\HistoryEventArgs.js"
//#include "Sys\Application.History.js"


// **********************************************
// ** MicrosoftAjaxNetwork.jsa
// **********************************************

//#include "Sys\XMLHttpRequest.js"

Type.registerNamespace('Sys.Net');

//#include "Sys\Net\WebRequestExecutor.js"
//#include "Sys\Net\XMLHttpExecutor.js"
//#include "Sys\Net\WebRequestManager.js"
//#include "Sys\Net\NetworkRequestEventArgs.js"
//#include "Sys\Net\WebRequest.js"


// **********************************************
// ** MicrosoftAjaxWebServices.jsa
// **********************************************

Type.registerNamespace('Sys.Net');

//#include "Sys\Net\WebServiceProxy.js"
//#include "Sys\Net\WebServiceError.js"

// for compatibility with 3.5 we define some shell objects to hold app service config info
Type.registerNamespace("Sys.Services");
//#include "Sys\Services\Compat.js"

Sys._domLoaded();
}

if (Sys.loader) {
	Sys.loader.registerScript("MicrosoftAjax", null, execute);
}
else {
	execute();
}

})(window, window.Sys);
var $get, $create, $addHandler, $addHandlers, $clearHandlers;
