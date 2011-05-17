$type = Sys.Data._OpenDataBatchWriter = function Data$_OpenDataBatchWriter(host) {
    this._host = host;
    this._content = "";
    this._boundary = null;
    this._changesetBoundary = null;
    this._changesetEntries = null;
    this._contentType = "application/json";
}
$type.prototype = {
    get_contentType: function _OpenDataBatchWriter$get_contentType() {
        return this._contentType;
    },
    set_contentType: function _OpenDataBatchWriter$set_contentType(type) {
        //#if DEBUGINTERNAL
        var re = /;\s*charset\s*=/i,
            match = re.exec(type);
        if (match) throw "MIME type cannot include 'charset' parameter";
        //#endif
        this._contentType = type;
    },
    get_requestBody: function _OpenDataBatchWriter$get_requestBody() {
        return this._content + "--" + this.get_topBoundary() + "--";
    },
    get_topBoundary: function _OpenDataBatchWriter$get_topBoundary() {
        if (!this._boundary) {
            this._boundary = "batch_" + this._createBoundary();
        }
        return this._boundary;
    },
    addChange: function _OpenDataBatchWriter$addChange(targetUri, eTag, method, body, contentId) {
        this._changesetEntries.push({ uri: targetUri, eTag: eTag, method: method, body: body, contentId: contentId });
    },
    addQuery: function _OpenDataBatchWriter$addQuery(queryUri) {
        this._content += this._startPart(this.get_topBoundary(), "GET", queryUri, null) + "\r\n";
    },
    endChangeSet: function _OpenDataBatchWriter$endChangeSet() {
        var changeset = "";
        for (var key in this._changesetEntries) {
            var entry = this._changesetEntries[key];
            changeset += this._startPart(this._changesetBoundary, entry.method, entry.uri, entry.eTag, entry.contentId);
            if (entry.body) {
                changeset += "Content-Type: " + this._contentType + ";charset=utf-8\r\n";
            }
            changeset += "\r\n";
            if (entry.body) {
                changeset += entry.body;
            }
        }
        if (changeset) {
            changeset += "\r\n--" + this._changesetBoundary + "--\r\n";
        }
        this._content += "\r\n--" + this.get_topBoundary() + "\r\nContent-Type: multipart/mixed;boundary=" +
                         this._changesetBoundary + "\r\n\r\n" + changeset;
        this._changesetBoundary = null;
        this._changesetEntries = null;
    },
    startChangeSet: function _OpenDataBatchWriter$startChangeSet() {
        this._changesetBoundary = "changeset_" + this._createBoundary();
        this._changesetEntries = [];
    },
    _createBoundary: function _OpenDataBatchWriter$_createBoundary() {
        function hex16() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substr(1);
        }
        return hex16() + "-" + hex16() + "-" + hex16();
    },
    _startPart: function _OpenDataBatchWriter$_startPart(boundary, method, uri, eTag, contentId) {
        var start = "\r\n--" + boundary + "\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\n" + method + " " + uri + " HTTP/1.1\r\n";
        if (typeof(contentId) === "number") {
            start += "Content-ID: " + contentId + "\r\n";
        }
        if (eTag) {
            start += "If-Match: " + eTag + "\r\n";
        }
        start += "Host: " + this._host + "\r\nAccept: " + this.get_contentType() + "\r\nAccept-Charset: utf-8\r\n";
        return start;
    }
}
$type.registerClass("Sys.Data._OpenDataBatchWriter");
