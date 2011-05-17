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

Type._registerScript("MicrosoftAjaxCore.js");

//#include "Sys\IDisposable.js"
//#include "Sys\StringBuilder.js"

// Compat
//#include "Compat\Browser.js"

// Base Class Library

//#include "Sys\EventArgs.js"
//#include "Sys\CancelEventArgs.js"
//#include "Sys\EventHandlerList.js"

Type.registerNamespace('Sys.UI');

//#include "Sys\Debug.js"
//#include "Sys\Enum.js"

//#include "Sys\CollectionChange.js"
//#include "Sys\NotifyCollectionChangedAction.js"
//#include "Sys\NotifyCollectionChangedEventArgs.js"
//#include "Sys\INotifyPropertyChange.js"
//#include "Sys\PropertyChangedEventArgs.js"
//#include "Sys\Observer.js"

// for compatibility with 3.5 we define some shell objects to hold app service config info
Type.registerNamespace("Sys.Services");
//#include "Sys\Services\Compat.js"

Sys._domLoaded();
}

if (Sys.loader) {
	Sys.loader.registerScript("Core", null, execute);
}
else {
	execute();
}

})(window, window.Sys);

