$type = Sys.Serialization.JavaScriptSerializer = function Serialization$JavaScriptSerializer() {
    /// <summary locid="M:J#Sys.Serialization.JavaScriptSerializer.#ctor">Provides serialization from JavaScript object to JavaScript object notation.</summary>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
    // DevDiv #62350: Considered making all methods static and removing this constructor,
    // but this would have been a breaking change from Atlas 1.0 to Atlas Orcas so was rejected.
}
$type.registerClass('Sys.Serialization.JavaScriptSerializer');

$type._esc = {
    charsRegExs: { '"': /\"/g, '\\': /\\/g }, /*"*/
    chars: ['\\', '"'],
    dateRegEx: /(^|[^\\])\"\\\/Date\((-?[0-9]+)(?:[a-zA-Z]|(?:\+|-)[0-9]{4})?\)\\\/\"/g, /* " */
    escapeChars: {'\\':'\\\\', '"':'\\"', "\b":"\\b", "\t":"\\t", "\n":"\\n", "\f":"\\f", "\r":"\\r"},
    escapeRegExG: /[\"\\\x00-\x1F]/g,
    escapeRegEx: /[\"\\\x00-\x1F]/i,
    jsonRegEx: /[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/g,
    jsonStringRegEx: /\"(\\.|[^\"\\])*\"/g /*"*/
};
$type._init = function() {
    var esc = this._esc,
        toEsc = esc.chars,
        toEscRE = esc.charsRegExs,
        escChars = esc.escapeChars;
    // Backslash needs to be put at the beginning of the charsToEscape array so that it
    // gets replaced first in the serializeStringWithBuilder method to avoid adding
    // an extra backslash for the newly added backslash of other escaped chars.
    for (var i = 0; i < 32; i++) {
        var c = String.fromCharCode(i);
        toEsc[i+2] = c;
        toEscRE[c] = new RegExp(c, 'g');
        escChars[c] = escChars[c] || ("\\u" + ("000" + i.toString(16)).slice(-4));
    }
    this._load = true;
}
$type._serializeNumberWithBuilder = function(object, stringBuilder) {
    if (!isFinite(object)) {
        throw Error.invalidOperation(Sys.Res.cannotSerializeNonFiniteNumbers);
    }
    stringBuilder.append(String(object));
}
// DevDiv 154418: for performance improvement, this function has been considered in different ways to come up
// with the following solutions, which depend on the length of the input strings and the browser types, implement
// one of the below three methods for scanning strings and performing escaped char replacements. Other solutions
// that had been considered and their performance comparisons are attached in DevDiv 154418.
$type._serializeStringWithBuilder = function(string, stringBuilder) {
    stringBuilder.append('"');
    var esc = this._esc;
    if (esc.escapeRegEx.test(string)) {
        // Initialization the following arrays once: charsRegExs, chars, and
        // escapeChars. These arrays are used for perf reasons, not neccessary required.
        if (!this._load) {
            this._init();
        }
        // DevDiv154418: Depending on the string length, different methods for replacing escaped chars are used for
        // perf reason. Currently 128 is used as a cutoff point based on perf comparisons attached in DevDiv154418
        if (string.length < 128) {
            string = string.replace(esc.escapeRegExG,
                function(x) { return esc.escapeChars[x]; });
        }
        else {
            for (var i = 0; i < 34; i++) {
                var c = esc.chars[i];
                if (string.indexOf(c) !== -1) {
                    var escChar = esc.escapeChars[c];
                    string = (isBrowser("Opera") || isBrowser("Firefox")) ?
                        string.split(c).join(escChar) :
                        string.replace(esc.charsRegExs[c], escChar);
                }
            }
       }
    }
    stringBuilder.append(string).append('"');
}
$type._serializeWithBuilder = function(object, stringBuilder, sort, prevObjects) {
    var i;
    switch (typeof object) {
    case 'object':
        if (object) {
            //#if DEBUG
            if (prevObjects){
                // The loop below makes serilzation O(n^2) worst case for linked list like struture
                // where in depth of graph is in linear proportion to number of elements.
                // However the depth of graph is limited by call stack size(less than 1000 in IE7) hence 
                // the performance hit is within reasonable bounds for debug mode
                if (Sys._indexOf(prevObjects, object) !== -1) {
                    throw Error.invalidOperation(Sys.Res.cannotSerializeObjectWithCycle);
                }
            }
            else {
                prevObjects = [];
            }
            try {
                prevObjects.push(object);
            //#endif
                
                if (Number.isInstanceOfType(object)) {
                    this._serializeNumberWithBuilder(object, stringBuilder);
                }
                else if (Boolean.isInstanceOfType(object)) {
                    stringBuilder.append(object);
                }
                else if (String.isInstanceOfType(object)) {
                    this._serializeStringWithBuilder(object, stringBuilder);
                }
            
                // Arrays
                else if (object instanceof Array) {
                    stringBuilder.append('[');
                   
                    for (i = 0; i < object.length; ++i) {
                        if (i) {
                            stringBuilder.append(',');
                        }
                        this._serializeWithBuilder(object[i], stringBuilder, false, prevObjects);
                    }
                    stringBuilder.append(']');
                }
                else {
                    // DivDev 41125: Do not confuse atlas serialized strings with dates
                    // Currently it always serialize as \/Date({milliseconds from 1970/1/1})\/
                    // For example \/Date(123)\/
                    if (Date.isInstanceOfType(object)) {
                        stringBuilder.append('"\\/Date(').
                            append(object.getTime()).
                            append(')\\/"');
                        break;
                    }

                    var properties = [],
                        propertyCount = 0;
                    for (var name in object) {
                        // skip internal properties that should not be serialized.
                        if (name.charAt(0) !== '$') {
                            //DevDiv 74427 : Need to make sure that _type is first item on JSON serialization
                            if (name === '__type' && propertyCount) {
                                // if current propery Name is __type, swap it with the first element on property array.
                                properties[propertyCount++] = properties[0];
                                properties[0] = name;
                            }
                            else {
                                properties[propertyCount++] = name;
                            }
                        }
                    }
                    if (sort) properties.sort();

                    stringBuilder.append('{');
                     
                    var needComma;
                    for (i=0; i < propertyCount; i++) {
                        var prop = properties[i], value = object[prop],
                            type = typeof(value);
                        if (type !== 'undefined' && type !== 'function') {
                            if (needComma) {
                                stringBuilder.append(',');
                            }
                            // Serialize the name of the object property, then the value
                            this._serializeWithBuilder(prop, stringBuilder, sort, prevObjects);
                            stringBuilder.append(':');
                            this._serializeWithBuilder(value, stringBuilder, sort, prevObjects);
                            needComma = true;
                        }
                    }
                stringBuilder.append('}');
                }
            //#if DEBUG
            }
            finally {
                Array.removeAt(prevObjects, prevObjects.length - 1);
            }
            //#endif
        }
        else {
            stringBuilder.append('null');
        }
        break;

    case 'number':
        this._serializeNumberWithBuilder(object, stringBuilder);
        break;

    case 'string':
        this._serializeStringWithBuilder(object, stringBuilder);
        break;

    case 'boolean':
        stringBuilder.append(object);
        break;

    default:
        stringBuilder.append('null');
        break;
    }
}

$type.serialize = function JavaScriptSerializer$serialize(object) {
    /// <summary locid="M:J#Sys.Serialization.JavaScriptSerializer.serialize">Generates a JSON string from an object.</summary>
    /// <param name="object" mayBeNull="true">The object to serialize.</param>
    /// <returns type="String">The JSON string representation of the object.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "object", mayBeNull: true}
    ]);
    if (e) throw e;
    //#endif
    var stringBuilder = new Sys.StringBuilder();
    Sys.Serialization.JavaScriptSerializer._serializeWithBuilder(object, stringBuilder, false);
    return stringBuilder.toString();
}

$type.deserialize = function JavaScriptSerializer$deserialize(data, secure) {
    /// <summary locid="M:J#Sys.Serialization.JavaScriptSerializer.deserialize">Deserializes a JSON string.</summary>
    /// <param name="data" type="String">The JSON string to eval.</param>
    /// <param name="secure" type="Boolean" optional="true" mayBeNull="true">True if the method should perform JSON conformance checks before evaluating. False by default.</param>
    /// <returns>The results of eval applied to data.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "data", type: String},
        {name: "secure", type: Boolean, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    if (!data.length) throw Error.argument('data', Sys.Res.cannotDeserializeEmptyString);
    // DevDiv 41127: Never confuse atlas serialized strings with dates.
    // DevDiv 74430: JavasciptSerializer will need to handle date time offset - following WCF design
    // serilzed dates might look like "\/Date(123)\/" or "\/Date(123A)" or "Date(123+4567)" or Date(123-4567)"
    // the regex escaped version of this pattern is \"\\/Date\(123(?:[a-zA-Z]|(?:\+|-)[0-9]{4})?\)\\/\"
    // but we must also do js escaping to put it in the string. Escape all \ with \\
    // Result: \\"\\\\/Date\\(123(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\\)\\\\/\\"
    // The 123 can really be any number with an optional -, and we want to capture it.
    // Regex for that is: (-?[0-9]+)
    // Result: \\"\\\\/Date\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\\)\\\\/\\"
    // We want to avoid replacing serialized strings that happen to contain this string as a substring.
    // We can do that by excluding matches that start with a slash \ since that means the first quote is escaped.
    // The first quote of a real date string will never be escaped and so will never be preceeded with \
    // So we want to add regex pattern (^|[^\\]) to the beginning, which means "beginning of string or anything but slash".
    // JS Escaped version: (^|[^\\\\])
    // Result: (^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\\)\\\\/\\"
    // Finally, the replace string is $1new Date($2). We must include $1 so we put back the potentially matched character we captured.
    var er, esc = Sys.Serialization.JavaScriptSerializer._esc;
    try {    
        var exp = data.replace(esc.dateRegEx, "$1new Date($2)");
        
        if (secure && esc.jsonRegEx.test(exp.replace(esc.jsonStringRegEx, ''))) throw null;

        return window.eval('(' + exp + ')');
    }
    catch (er) {
         throw Error.argument('data', Sys.Res.cannotDeserializeInvalidJson);
    }
}
