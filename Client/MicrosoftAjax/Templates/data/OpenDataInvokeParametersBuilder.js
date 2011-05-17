// See http://msdn.microsoft.com/en-us/library/cc907912.aspx for info on Astoria literal formats.

$type = Sys.Data.OpenDataInvokeParametersBuilder = function Data$OpenDataInvokeParametersBuilder() {
    /// <summary locid="M:J#Sys.Data.OpenDataInvokeParametersBuilder.#ctor">Creates an empty OpenDataInvokeParametersBuilder object.</summary>
    
    this._queryBuilder = new Sys.Data.OpenDataQueryBuilder("");
    this._parameters = this._queryBuilder.get_queryParameters();
}

$type.prototype = {

    //
    // INSTANCE FIELDS
    //

    _parameters: null,
    _queryBuilder: null,

    //
    // INSTANCE PROPERIES
    //

    get_parameters: function OpenDataInvokeParametersBuilder$get_parameters() {
        /// <value locid="P:J#Sys.Data.OpenDataInvokeParametersBuilder.parameters">A dictionary of parameters. This object will be non-null but may contain no fields if no parameters have been set.</value>
        return this._parameters;
    },

    //
    // PUBLIC INSTANCE METHODS
    //

    addBoolean: function OpenDataInvokeParametersBuilder$addBoolean(name, value) {
        /// <summary locid="M:J#Sys.Data.OpenDataInvokeParametersBuilder.addBoolean">Adds a Boolean parameter to the builder.</summary>
        /// <param name="name" type="String">The name of the parameter to be added.</param>
        /// <param name="value" type="Boolean">The value of the parameter to be added.</param>

        this._parameters[name] = value.toString();
    },

    addDate: function OpenDataInvokeParametersBuilder$addDate(name, value, includeTimeZone) {
        /// <summary locid="M:J#Sys.Data.OpenDataInvokeParametersBuilder.addDate">Adds a Date parameter to the builder.</summary>
        /// <param name="name" type="String">The name of the parameter to be added.</param>
        /// <param name="value" type="Date">The value of the parameter to be added.</param>
        /// <param name="includeTimeZone" type="Boolean" optional="true" mayBeNull="true">True to include time zone information with this Date object, false to exclude the time zone.</param>

        // dates are represented by datetime'value'
        // see http://blogs.msdn.com/bclteam/archive/2004/05/21/136918.aspx for the origin of the provided format string
        var converted = (includeTimeZone)
            ? value.format("yyyy-MM-ddTHH:mm:ss.fffffffzzz")
            : value.format("yyyy-MM-ddTHH:mm:ss.fffffff");
            
        this._parameters[name] = "datetime'" + converted + "'";
    },

    addDecimal: function OpenDataInvokeParametersBuilder$addDecimal(name, value) {
        /// <summary locid="M:J#Sys.Data.OpenDataInvokeParametersBuilder.addDecimal">Adds a Decimal parameter to the builder.</summary>
        /// <param name="name" type="String">The name of the parameter to be added.</param>
        /// <param name="value" type="Number">The value of the parameter to be added.</param>

        this._parameters[name] = value.toString() + "M";
    },

    addDouble: function OpenDataInvokeParametersBuilder$addDouble(name, value) {
        /// <summary locid="M:J#Sys.Data.OpenDataInvokeParametersBuilder.addDouble">Adds a floating point parameter to the builder.</summary>
        /// <param name="name" type="String">The name of the parameter to be added.</param>
        /// <param name="value" type="Number">The value of the parameter to be added.</param>

        this._parameters[name] = value.toString();
    },

    addGuid: function OpenDataInvokeParametersBuilder$addGuid(name, value) {
        /// <summary locid="M:J#Sys.Data.OpenDataInvokeParametersBuilder.addGuid">Adds a GUID parameter to the builder.</summary>
        /// <param name="name" type="String">The name of the parameter to be added.</param>
        /// <param name="value" type="String">The value of the parameter to be added. The parameter must be a string of the form "dddddddd-dddd-dddd-dddd-dddddddddddd".</param>

        //#if DEBUG
        // check format of parameter
        var matchFound = value.match(Sys.Data.OpenDataInvokeParametersBuilder._guidRegex);
        if (!matchFound) {
            var er = Error.create(Sys.Data.OpenDataRes.invalidGuid, { name: "Sys.Data.OpenDataException" });
            throw er;
        }
        //#endif
        
        this._parameters[name] = "guid'" + value + "'";
    },

    addInteger: function OpenDataInvokeParametersBuilder$addInteger(name, value) {
        /// <summary locid="M:J#Sys.Data.OpenDataInvokeParametersBuilder.addInteger">Adds an integer parameter to the builder.</summary>
        /// <param name="name" type="String">The name of the parameter to be added.</param>
        /// <param name="value" type="Number" integer="true">The value of the parameter to be added.</param>

        this._parameters[name] = value.toString();
    },

    addString: function OpenDataInvokeParametersBuilder$addString(name, value) {
        /// <summary locid="M:J#Sys.Data.OpenDataInvokeParametersBuilder.addString">Adds a string parameter to the builder.</summary>
        /// <param name="name" type="String">The name of the parameter to be added.</param>
        /// <param name="value" type="String">The value of the parameter to be added.</param>

        // strings are represented by 'char*', where delimeters are escaped by doubling
        this._parameters[name] = "'" + value.replace(new RegExp("'", "g"), "''") + "'";
    },

    toString: function OpenDataInvokeParametersBuilder$toString() {
        /// <summary locid="M:J#Sys.Data.OpenDataInvokeParametersBuilder.toString">Generates a complete query string based on this object's parameter dictionary.</summary>
        /// <returns type="String">The complete query string.</returns>

        return this._queryBuilder.toString();
    }

}

//
// PRIVATE STATIC MEMBERS
//

//#if DEBUG
$type._guidRegex = /^[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}$/;
//#endif

$type.registerClass("Sys.Data.OpenDataInvokeParametersBuilder");
