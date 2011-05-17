//#localize Sys.Data.OpenDataRes true ..\Resources\OpenData.Res.resx

//!/ <reference name="MicrosoftAjaxDataContext.js" />
(function() {

function execute() {
Type._registerScript("MicrosoftAjaxOpenData.js", ["MicrosoftAjaxDataContext.js"]);

var $type, $prototype;
var merge = Sys._merge;
var forIn = Sys._forIn;

Type.registerNamespace("Sys.Data");

if (!Sys.Data.IDataProvider) {
//#include "..\Templates\Data\IDataProvider.js"
}
if (!Sys.Data.MergeOption) {
//#include "..\Templates\Data\MergeOption.js"
}
//#include "..\Templates\Data\OpenDataQueryBuilder.js"
//#include "..\Templates\Data\_OpenDataUtil.js"
//#include "..\Templates\Data\OpenDataActionResult.js"
//#include "..\Templates\Data\OpenDataActionSequence.js"
//#include "..\Templates\Data\OpenDataInvokeParametersBuilder.js"
//#include "..\Templates\Data\OpenDataServiceProxy.js"
//#include "..\Templates\Data\OpenDataBatchReader.js"
//#include "..\Templates\Data\OpenDataBatchWriter.js"
//#include "..\Templates\Data\OpenDataContext.js"
}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("OpenData", null, execute);
}
else {
	execute();
}

})();
