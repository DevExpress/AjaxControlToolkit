$type = Sys.Data._OpenDataBatchReader = function Data$_OpenDataBatchReader(responseBody, boundary) {
    this._responseBody = responseBody;
    this._boundary = [boundary];
    this._position = 0;
    this._responses = [];
    this._parseParts(this._responses);
}
$type.prototype = {
    get_responses: function _OpenDataBatchReader$get_responses() {
        return this._responses;
    },
    _parseParts: function _OpenDataBatchReader$_parseParts(responses) {
        // skip preamble
        // Strictly speaking this should be prefixed with \r\n, but life is complicated...
        if (this._readToMark("--" + this._currentBoundary(), true) === null) return;
        this._readLine();
        var endmark = null;
        while ((endmark !== "--") && !this._eof()) {
            var partHeaders = [];
            this._parseHeaders(partHeaders);
            var partType = partHeaders["Content-Type"];
            if (partType.indexOf("multipart/mixed") === 0) {
                var nested = [];
                this._boundary.push(Sys.Data._OpenDataBatchReader._boundaryFromTypeHeader(partType));
                this._parseParts(nested);
                this._boundary.pop();
                responses.push(nested);
                // skip inner-part epilog, if any, and go to next boundary
                // NOTE: this should have a leading newline, but Astoria sometimes
                // puts nested boundary markers together. This is safe enough, given
                // that what's in between is only the epilog
                var check = this._readToMark("--" + this._currentBoundary(), true);
            }
            else if (partType.indexOf("application/http") === 0) {
                responses.push(this._parseHttpResponse());
            }
            //#if DEBUGINTERNAL
            else {
                throw "Invalid MIME part type '" + partType + "'";
            }
            //#endif
            endmark = this._peek(2);
            // read the remaining boundary line
            this._readLine();
        }
    },
    _parseHttpResponse: function _OpenDataBatchReader$_parseHttpResponse() {
        var line = this._readLine(),
            status = this._parseStatus(line);
        var headers = [];
        this._parseHeaders(headers);
        var body = this._readToMark("--" + this._currentBoundary(), true);
        if (body === "\r\n") body = "";
        return { status: status, headers: headers, body: body };
    },
    _parseHeaders: function _OpenDataBatchReader$_parseHeaders(target) {
        for (var line = this._readLine(); line; line = this._readLine()) {
            var h = this._parseHeader(line);
            target[h.name] = h.value;
        }
    },
    _parseHeader: function _OpenDataBatchReader$_parseHeader(s) {
        if (s === null) return null;
        var index = s.indexOf(":");
        return (index === -1) ? null :
            { name: s.substring(0, index).trim(), value: s.substring(index + 1).trim() };
    },
    _parseStatus: function _OpenDataBatchReader$_parseStatus(s) {
        // HTTP/1.1 500 TEXT
        var match = Sys.Data._OpenDataBatchReader._statusRegExp.exec(s);
        return match ? ({ code: match[1], text: match[2] }) : null;
    },
    _currentBoundary: function _OpenDataBatchReader$_currentBoundary() {
        return this._boundary[this._boundary.length - 1];
    },
    _eof: function _OpenDataBatchReader$_eof() {
        return this._position === -1;
    },
    _readLine: function _OpenDataBatchReader$_readLine() {
        return this._readToMark("\r\n", false);
    },
    _readToMark: function _OpenDataBatchReader$_readToMark(mark, nullIfMissing) {
        if (this._eof()) return null;
        var r, index = this._responseBody.indexOf(mark, this._position);
        if (index < 0) {
            if (nullIfMissing) {
                r = null;
            }
            else {
                r = this._responseBody.substring(this._position);
                this._position = -1;
            }
        }
        else {
            r = this._responseBody.substring(this._position, index);
            this._position = index + mark.length;
        }
        return r;
    },
    _peek: function _OpenDataBatchReader$_peek(len) {
        if (this._eof()) return "";
        return this._responseBody.substring(this._position, this._position + len);
    }
}
$type._boundaryFromTypeHeader = function _OpenDataBatchReader$_boundaryFromTypeHeader(header) {
    var re = /;\s*boundary=(.*)$/i,
        match = re.exec(header);
    return match ? match[1] : null;
};
$type._parseResponse = function _OpenDataBatchReader$_parseResponse(executor) {
    var r = new Sys.Data._OpenDataBatchReader(executor.get_responseData(), Sys.Data._OpenDataBatchReader._boundaryFromTypeHeader(executor.getResponseHeader("Content-Type")));
    return r.get_responses();
};
//  ^HTTP\/1\.[01] (\d{3}) (.*)$
$type._statusRegExp = new RegExp("^HTTP\\/1\\.[01] (\\d{3}) (.*)$", "i");
$type.registerClass("Sys.Data._OpenDataBatchReader");
