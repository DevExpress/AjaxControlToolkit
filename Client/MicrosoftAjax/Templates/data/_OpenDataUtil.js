$type = Sys.Data._OpenDataUtil = function Data$_OpenDataUtil() {
    // this is a static type - no constructor
    //#if DEBUG
    throw Error.invalidOperation();
    //#endif
}

$type.concatUris = function _OpenDataUtil$concatUris(serviceUri, resourceUri) {
    if (resourceUri.indexOf("//") >= 0) {
        // resourceUri is an absolute URI
        return resourceUri;
    }
    
    if (serviceUri.endsWith('/')) {
        serviceUri = serviceUri.substr(0, serviceUri.length - 1);
    }
    if (resourceUri.startsWith('/')) {
        resourceUri = resourceUri.substr(1);
    }
    return serviceUri + '/' + resourceUri;
}

$type.extractETag = function _OpenDataUtil$extractETag(item) {
    // <param name="item" mayBeNull="false">The item from which to extract the ETag.</param>
    // <returns type="String" mayBeNull="true">The ETag for the given item, or null if the item does not have an ETag.</returns>
    return (item.__metadata) ? (item.__metadata.etag || null) : null;
}

$type.extractUri = function _OpenDataUtil$extractUri(item) {
    // <param name="item" mayBeNull="false">The item from which to extract the resource URI.</param>
    // <returns type="String" mayBeNull="true">The resource URI for the given item, or null if the item does not have a resource URI.</returns>
    return (item.__metadata) ? (item.__metadata.uri || null) : null;
}

$type.registerClass("Sys.Data._OpenDataUtil");    
