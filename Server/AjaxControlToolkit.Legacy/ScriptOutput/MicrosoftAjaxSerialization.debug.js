// (c) 2010 CodePlex Foundation
//!/ <reference name="MicrosoftAjaxCore.js" />

(function() {

function execute() {

Type._registerScript("MicrosoftAjaxSerialization.js", ["MicrosoftAjaxCore.js"]);

var $type, $prototype,
    isBrowser = Sys._isBrowser,
	merge = Sys._merge;

Type.registerNamespace('Sys.Serialization');

$type = Sys.Serialization.JavaScriptSerializer = function Serialization$JavaScriptSerializer() {
    /// <summary locid="M:J#Sys.Serialization.JavaScriptSerializer.#ctor">Provides serialization from JavaScript object to JavaScript object notation.</summary>
    if (arguments.length !== 0) throw Error.parameterCount();
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
$type._serializeStringWithBuilder = function(string, stringBuilder) {
    stringBuilder.append('"');
    var esc = this._esc;
    if (esc.escapeRegEx.test(string)) {
        if (!this._load) {
            this._init();
        }
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
            if (prevObjects){
                if (Sys._indexOf(prevObjects, object) !== -1) {
                    throw Error.invalidOperation(Sys.Res.cannotSerializeObjectWithCycle);
                }
            }
            else {
                prevObjects = [];
            }
            try {
                prevObjects.push(object);
                
                if (Number.isInstanceOfType(object)) {
                    this._serializeNumberWithBuilder(object, stringBuilder);
                }
                else if (Boolean.isInstanceOfType(object)) {
                    stringBuilder.append(object);
                }
                else if (String.isInstanceOfType(object)) {
                    this._serializeStringWithBuilder(object, stringBuilder);
                }
            
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
                    if (Date.isInstanceOfType(object)) {
                        stringBuilder.append('"\\/Date(').
                            append(object.getTime()).
                            append(')\\/"');
                        break;
                    }

                    var properties = [],
                        propertyCount = 0;
                    for (var name in object) {
                        if (name.charAt(0) !== '$') {
                            if (name === '__type' && propertyCount) {
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
                            this._serializeWithBuilder(prop, stringBuilder, sort, prevObjects);
                            stringBuilder.append(':');
                            this._serializeWithBuilder(value, stringBuilder, sort, prevObjects);
                            needComma = true;
                        }
                    }
                stringBuilder.append('}');
                }
            }
            finally {
                Array.removeAt(prevObjects, prevObjects.length - 1);
            }
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
    var e = Function._validateParams(arguments, [
        {name: "object", mayBeNull: true}
    ]);
    if (e) throw e;
    var stringBuilder = new Sys.StringBuilder();
    Sys.Serialization.JavaScriptSerializer._serializeWithBuilder(object, stringBuilder, false);
    return stringBuilder.toString();
}

$type.deserialize = function JavaScriptSerializer$deserialize(data, secure) {
    /// <summary locid="M:J#Sys.Serialization.JavaScriptSerializer.deserialize">Deserializes a JSON string.</summary>
    /// <param name="data" type="String">The JSON string to eval.</param>
    /// <param name="secure" type="Boolean" optional="true" mayBeNull="true">True if the method should perform JSON conformance checks before evaluating. False by default.</param>
    /// <returns>The results of eval applied to data.</returns>
    var e = Function._validateParams(arguments, [
        {name: "data", type: String},
        {name: "secure", type: Boolean, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    if (!data.length) throw Error.argument('data', Sys.Res.cannotDeserializeEmptyString);
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

}

if (window.Sys && Sys.loader) {
	Sys.loader.registerScript("Serialization", null, execute);
}
else {
	execute();
}

})();
