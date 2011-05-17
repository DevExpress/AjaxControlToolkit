$type = Sys.Data.OpenDataQueryBuilder = function Data$OpenDataQueryBuilder(uri) {
    /// <summary locid="M:J#Sys.Data.OpenDataQueryBuilder.#ctor">Allows construction of ADO.NET Data Service queries.</summary>
    /// <param name="uri" type="String">The URI (absolute or relative) to parse.</param>
    this._queryParameters = {};
    this._uri = uri;
    var idxQuery = uri.indexOf('?');
    if (idxQuery >= 0) {
        // split query string if already exists
        this._uri = uri.substr(0, idxQuery);
        var params = uri.substr(idxQuery + 1).split('&');
        for (var i in params) {
            var param = params[i];
            var idxValue = param.indexOf('=');
            if (idxValue >= 0) {
                this._queryParameters[decodeURIComponent(param.substr(0, idxValue))] = decodeURIComponent(param.substr(idxValue + 1));
            }
            else {
                this._queryParameters[decodeURIComponent(param)] = "";
            }
        }
    }
}
$type.prototype = {
    _queryParameters: null,
    _uri: null,
    get_skip: function OpenDataQueryBuilder$get_skip() {
        /// <value type="Number" integer="true" mayBeNull="true" locid="P:J#Sys.Data.OpenDataQueryBuilder.skip">The number of elements to skip when returning results, or null if no skip value is specified.</value>
        return this._getIntParam("$skip");
    },
    set_skip: function OpenDataQueryBuilder$set_skip(value) {
        this._setParam("$skip", value);
    },
    get_top: function OpenDataQueryBuilder$get_top() {
        /// <value type="Number" integer="true" mayBeNull="true" locid="P:J#Sys.Data.OpenDataQueryBuilder.top">The maximum number of elements to return, or null if no maximum is specified.</value>
        return this._getIntParam("$top");
    },
    set_top: function OpenDataQueryBuilder$set_top(value) {
        this._setParam("$top", value);
    },
    get_orderby: function OpenDataQueryBuilder$get_orderby() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Data.OpenDataQueryBuilder.orderby">The ordering applied to the result set, or null if no ordering is specified.</value>
        return this._getStringParam("$orderby");
    },
    set_orderby: function OpenDataQueryBuilder$set_orderby(value) {
        this._setParam("$orderby", value);
    },
    get_filter: function OpenDataQueryBuilder$get_filter() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Data.OpenDataQueryBuilder.filter">The filter applied to the result set, or null if no filter is specified.</value>
        return this._getStringParam("$filter");
    },
    set_filter: function OpenDataQueryBuilder$set_filter(value) {
        this._setParam("$filter", value);
    },
    get_select: function OpenDataQueryBuilder$get_select() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Data.OpenDataQueryBuilder.select">A comma-delimited list of columns to retrieve.</value>
        return this._getStringParam("$select");
    },
    set_select: function OpenDataQueryBuilder$set_select(value) {
        this._setParam("$select", value);
    },
    get_expand: function OpenDataQueryBuilder$get_expand() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Data.OpenDataQueryBuilder.expand">The property expansion applied to the result set, or null if no property expansion is specified.</value>
        return this._getStringParam("$expand");
    },
    set_expand: function OpenDataQueryBuilder$set_expand(value) {
        this._setParam("$expand", value);
    },
    get_inlineCount: function OpenDataQueryBuilder$get_inlineCount() {
        /// <value type="String" mayBeNull="true" locid="P:J#Sys.Data.OpenDataQueryBuilder.inlineCount">.</value>
        return this._getStringParam("$inlinecount");
    },
    set_inlineCount: function OpenDataQueryBuilder$set_inlineCount(value) {
        this._setParam("$inlinecount", value);
    },
    get_resourcePath: function OpenDataQueryBuilder$get_resourcePath() {
        /// <value type="string" locid="P:J#Sys.Data.OpenDataQueryBuilder.resourcePath">The resource path of this QueryBuilder object.</value>
        return this._uri;
    },
    /* setter temporarily removed until we can figure out how to spec it
    set_resourcePath: function(value) {
    var idxQuery = value.indexOf('?');
    this._uri = (idxQuery >= 0) ? value.substr(0, idxQuery) : value;
    }, */
    get_queryParameters: function OpenDataQueryBuilder$get_queryParameters() {
        /// <value type="Object" locid="P:J#Sys.Data.OpenDataQueryBuilder.queryParameters">A dictionary of query parameters. This object will be non-null but may contain no fields if no query parameters have been set.</value>
        return this._queryParameters;
    },
    set_queryParameters: function OpenDataQueryBuilder$set_queryParameters(value) {
        this._queryParameters = value;
    },
    toString: function OpenDataQueryBuilder$toString() {
        /// <summary locid="M:J#Sys.Data.OpenDataQueryBuilder.toString">Generates a complete query string based on this object's resource path and parameter dictionary.</summary>
        /// <returns type="string">The complete query string.</returns>
        var key, i, value, params = new Array(), qParams = this._queryParameters, options = Sys.Data.OpenDataQueryBuilder._queryOptions;
        for (key in qParams) {
            if (qParams.hasOwnProperty(key) && !Array.contains(options, key)) {
                value = qParams[key];
                if (value != null) {
                    params.push({ key: key, value: value });
                }
            }
        }
        // special query options which should be presented in a particular order to the server
        for (i in options) {
            key = options[i];
            value = qParams[key];
            if (value != null) {
                params.push({ key: key, value: value });
            }
        }

        var sb = new Sys.StringBuilder(this._uri);
        var firstElement = true;
        for (i in params) {
            if (params.hasOwnProperty(i)) {
                sb.append((firstElement) ? '?' : '&');
                sb.append(encodeURIComponent(params[i].key));
                sb.append('=');
                sb.append(encodeURIComponent(params[i].value));
                firstElement = false;
            }
        }
        return sb.toString();
    },
    _getIntParam: function OpenDataQueryBuilder$_getIntParam(name) {
        var value = parseInt(this._queryParameters[name]);
        return (isNaN(value)) ? null : value;
    },
    _getStringParam: function OpenDataQueryBuilder$_getStringParam(name) {
        var value = this._queryParameters[name];
        return value || null;
    },
    _setParam: function OpenDataQueryBuilder$_setParam(name, value) {
        if (typeof(value) === "undefined" || (value === null)) {
            delete this._queryParameters[name];
        }
        else {
            this._queryParameters[name] = value;
        }
    }
}

// proper ordering of query options as interpreted by the server
$type._queryOptions = ["$filter", "$orderby", "$skip", "$top"];
$type.registerClass("Sys.Data.OpenDataQueryBuilder");
