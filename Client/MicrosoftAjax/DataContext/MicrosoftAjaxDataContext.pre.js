//#localize Sys.Data.DataRes true ..\Resources\DataContext.Res.resx

//!/ <reference name="MicrosoftAjaxCore.js" />
(function() {

function execute() {
Type._registerScript("MicrosoftAjaxDataContext.js", ["MicrosoftAjaxComponentModel.js", "MicrosoftAjaxCore.js"]);

var $type, $prototype;
var merge = Sys._merge;

Type.registerNamespace("Sys.Net");

//#include "..\Templates\Net\WebServiceOperation.js"

Type.registerNamespace("Sys.Data");

if (!Sys.Data.IDataProvider) {
//#include "..\Templates\Data\IDataProvider.js"
}
if (!Sys.Data.MergeOption) {
//#include "..\Templates\Data\MergeOption.js"
}
//#include "..\Templates\Data\DataContext.js"
//#include "..\Templates\Data\ChangeOperationType.js"
//#include "..\Templates\Data\ChangeOperation.js"
}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("DataContext", null, execute);
}
else {
	execute();
}

})();
