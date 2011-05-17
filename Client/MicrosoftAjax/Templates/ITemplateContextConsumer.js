$type = Sys.UI.ITemplateContextConsumer = function ITemplateContextConsumer() {
    //#if DEBUG
    throw Error.notImplemented();
    //#endif
}
//#if DEBUG
$type.prototype = {
    get_templateContext: function ITemplateContextConsumer$get_templateContext() {
        /// <value type="Sys.UI.TemplateContext" mayBeNull="true" locid="P:J#Sys.UI.ITemplateContextConsumer.templateContext"></value>
        throw Error.notImplemented();
    },
    set_templateContext: function ITemplateContextConsumer$set_templateContext(value) {
        throw Error.notImplemented();
    }
}
//#endif
$type.registerInterface("Sys.UI.ITemplateContextConsumer");
