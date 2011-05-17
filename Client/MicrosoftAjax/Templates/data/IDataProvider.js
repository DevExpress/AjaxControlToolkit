$type = Sys.Data.IDataProvider = function Data$IDataProvider() {
    //#if if
    DEBUG throw Error.notImplemented();
    //#endif
}
//#if DEBUG
$type.prototype = {
    fetchData: function IDataProvider$fetchData(operation, parameters, mergeOption, httpVerb, succeededCallback, failedCallback, timeout, userContext) {
        /// <summary locid="M:J#Sys.Data.IDataProvider.fetchData">Fetches data from the service.</summary>
        /// <param name="operation">The operation to fetch data with.</param>
        /// <param name="parameters" type="Object" mayBeNull="true" optional="true"></param>
        /// <param name="mergeOption" type="Sys.Data.MergeOption" mayBeNull="true" optional="true">Determines how the returned data is tracked if the DataProvider supports it.</param>
        /// <param name="httpVerb" type="String" mayBeNull="true" optional="true"></param>
        /// <param name="succeededCallback" type="Function" mayBeNull="true" optional="true"></param>
        /// <param name="failedCallback" type="Function" mayBeNull="true" optional="true"></param>
        /// <param name="timeout" type="Number" integer="true" mayBeNull="true" optional="true"></param>
        /// <param name="userContext" mayBeNull="true" optional="true"></param>
        /// <returns type="Sys.Net.WebRequest"></returns>
        throw Error.notImplemented();
    }
}
//#endif
$type.registerInterface("Sys.Data.IDataProvider");
