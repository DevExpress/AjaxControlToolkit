function Sys$Enum$parse(value, ignoreCase) {
    /// <summary locid="M:J#Sys.Enum.parse">Converts the string representation of the name or numeric value of one or more enumerated   constants to an equivalent enumerated object.</summary>
    /// <param name="value" type="String">A string containing the name or value to convert.</param>
    /// <param name="ignoreCase" type="Boolean" optional="true" mayBeNull="true">If true, the parsing will be done case-insensitively.  If omitted, the parsing is done case-sensitively.</param>
    /// <returns>An object of type enumType whose value is represented by value.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "value", type: String},
        {name: "ignoreCase", type: Boolean, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    var values, parsed, val;
    if (ignoreCase) {
        values = this.__lowerCaseValues;
        if (!values) {
            this.__lowerCaseValues = values = {};
            var prototype = this.prototype;
            for (var name in prototype) {
                values[name.toLowerCase()] = prototype[name];
            }
        }
    }
    else {
        values = this.prototype;
    }
    function throwError(v) {
        if (typeof(parsed) !== 'number') throw Error.argument('value', String.format(Sys.Res.enumInvalidValue, v, this.__typeName));
    }
    if (!this.__flags) {
        val = (ignoreCase ? value.toLowerCase() : value);
        parsed = values[val.trim()];
        if (typeof(parsed) !== 'number') throwError.call(this, value);
        return parsed;
    }
    else {
        var parts = (ignoreCase ? value.toLowerCase() : value).split(',');
        var v = 0;

        for (var i = parts.length - 1; i >= 0; i--) {
            var part = parts[i].trim();
            parsed = values[part];
            if (typeof(parsed) !== 'number') throwError.call(this, value.split(',')[i].trim());
            v |= parsed;
        }
        return v;
    }
}

function Sys$Enum$toString(value) {
    /// <summary locid="M:J#Sys.Enum.toString">Converts the value of an enum instance to its equivalent string representation.</summary>
    /// <param name="value" optional="true" mayBeNull="true">The value of the enum instance for which the string representation must be constructed.</param>
    /// <returns type="String">The string representation of "value".</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "value", mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    // Need to do the type check manually instead of using parameter validation to be able to return
    // an error message that mentions the actual enum type that's expected instead of Number.
    if ((typeof(value) === 'undefined') || (value === null)) return this.__string;
    //#if DEBUG
    if ((typeof(value) != 'number') || ((value % 1) !== 0)) throw Error.argumentType('value', Object.getType(value), this);
    //#endif
    var values = this.prototype;
    var i;
    if (!this.__flags || (value === 0)) {
        for (i in values) {
            if (values[i] === value) {
                return i;
            }
        }
    }
    else {
        var sorted = this.__sortedValues;
        if (!sorted) {
            sorted = [];
            for (i in values) {
                sorted.push({key: i, value: values[i]});
            }
            sorted.sort(function(a, b) {
                return a.value - b.value;
            });
            this.__sortedValues = sorted;
        }
        var parts = [];
        var v = value;
        for (i = sorted.length - 1; i >= 0; i--) {
            var kvp = sorted[i];
            var vali = kvp.value;
            if (vali === 0) continue;
            if ((vali & value) === vali) {
                parts.push(kvp.key);
                v -= vali;
                if (v === 0) break;
            }
        }
        if (parts.length && v === 0) return parts.reverse().join(', ');
    }
    //#if DEBUG
    throw Error.argumentOutOfRange('value', value, String.format(Sys.Res.enumInvalidValue, value, this.__typeName));
    //#else
    return '';
    //#endif
}

$type = Type;

$type.prototype.registerEnum = function Type$registerEnum(name, flags) {
    /// <summary locid="M:J#Sys.UI.LineType.#ctor">Registers an enum type.</summary>
    /// <param name="name" type="String">The fully-qualified name of the enum.</param>
    /// <param name="flags" type="Boolean" optional="true" mayBeNull="true">True if the enum is a flags collection.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "name", type: String},
        {name: "flags", type: Boolean, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    //#if DEBUG
    if (!Type.__fullyQualifiedIdentifierRegExp.test(name)) throw Error.argument('name', Sys.Res.notATypeName);
    // Check if the type name parses to an existing object that matches this.
    var parsedName;
    try {
        // note: would like to use window.eval() here instead of eval().
        // however, window.eval() is a no-op in the VS intellisense environment
        parsedName = eval(name);
    }
    catch(e) {
        throw Error.argument('name', Sys.Res.argumentTypeName);
    }
    if (parsedName !== this) throw Error.argument('name', Sys.Res.badTypeName);
    if (Sys.__registeredTypes[name]) throw Error.invalidOperation(String.format(Sys.Res.typeRegisteredTwice, name));
    for (var j in this.prototype) {
        var val = this.prototype[j];
        if (!Type.__identifierRegExp.test(j)) throw Error.invalidOperation(String.format(Sys.Res.enumInvalidValueName, j));
        if (typeof(val) !== 'number' || (val % 1) !== 0) throw Error.invalidOperation(Sys.Res.enumValueNotInteger);
        if (typeof(this[j]) !== 'undefined') throw Error.invalidOperation(String.format(Sys.Res.enumReservedName, j));
    }
    //#endif
    Sys.__upperCaseTypes[name.toUpperCase()] = this;

    for (var i in this.prototype) {
        this[i] = this.prototype[i];
    }
    this.__typeName = name;
    this.parse = Sys$Enum$parse;
    this.__string = this.toString();
    this.toString = Sys$Enum$toString;
    this.__flags = flags;
    this.__enum = true;
    //#if DEBUG
    Sys.__registeredTypes[name] = true;
    //#endif
}

$type.isEnum = function Type$isEnum(type) {
    /// <summary locid="M:J#Type.isEnum"></summary>
    /// <param name="type" mayBeNull="true">The type to test.</param>
    /// <returns type="Boolean">True if the type is an enum.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "type", mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    return !!(type && type.__enum);
}

$type.isFlags = function Type$isFlags(type) {
    /// <summary locid="M:J#Type.isFlags"></summary>
    /// <param name="type" mayBeNull="true">The type to test.</param>
    /// <returns type="Boolean">True if the type is a set of flags.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "type", mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    return !!(type && type.__flags);
}
