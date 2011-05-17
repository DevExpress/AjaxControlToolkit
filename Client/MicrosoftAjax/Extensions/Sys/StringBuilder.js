$type = Sys.StringBuilder = function StringBuilder(initialText) {
    /// <summary locid="M:J#Sys.StringBuilder.#ctor">Provides an optimized mechanism to concatenate a sequence of strings.</summary>
    /// <param name="initialText" optional="true" mayBeNull="true">The initial text for the StringBuilder.</param>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "initialText", mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    this._parts = (typeof(initialText) !== 'undefined' && initialText !== null && initialText !== '') ?
        [initialText.toString()] : [];
    this._value = {};
    this._len = 0;
}

$type.prototype = {
    append: function StringBuilder$append(text) {
        /// <summary locid="M:J#Sys.StringBuilder.append">Appends a new string at the end of the StringBuilder.</summary>
        /// <param name="text" mayBeNull="true">The string to append.</param>
        /// <returns type="Sys.StringBuilder"></returns>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "text", mayBeNull: true}
        ]);
        if (e) throw e;
        //#endif
        this._parts.push(text);
        return this;
    },

    appendLine: function StringBuilder$appendLine(text) {
        /// <summary locid="M:J#Sys.StringBuilder.appendLine">Appends a new string as a line of text at the end of the StringBuilder.</summary>
        /// <param name="text" optional="true" mayBeNull="true">The string to append.</param>
        /// <returns type="Sys.StringBuilder"></returns>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "text", mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        //#endif
        this._parts.push(
            ((typeof(text) === 'undefined') || (text === null) || (text === '')) ?
            '\r\n' : (text + '\r\n'));
        return this;
    },

    clear: function StringBuilder$clear() {
        /// <summary locid="M:J#Sys.StringBuilder.clear">Clears the StringBuilder of its current contents.</summary>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        this._parts = [];
        this._value = {};
        this._len = 0;
    },

    isEmpty: function StringBuilder$isEmpty() {
        /// <summary locid="M:J#Sys.StringBuilder.isEmpty">Use this method to determine if the StringBuilder has contents.</summary>
        /// <returns type="Boolean">True if the StringBuilder has any contents.</returns>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        return (!this._parts.length || !this.toString());
    },

    // separator may be null, to match behavior of ECMA Array.join(separator) and
    // .NET String.Join(separator, value)
    toString: function StringBuilder$toString(separator) {
        /// <summary locid="M:J#Sys.StringBuilder.toString">Creates a string from the contents of the StringBuilder.</summary>
        /// <param name="separator" type="String" optional="true" mayBeNull="true">The separator to insert between the elements of the StringBuilder.</param>
        /// <returns type="String">The string built from the StringBuilder.</returns>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "separator", type: String, mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        //#endif
        separator = separator || '';
        var parts = this._parts;
        if (this._len !== parts.length) {
            this._value = {};
            this._len = parts.length;
        }
        var val = this._value;
        var ret = val[separator];
        if (typeof(ret) === 'undefined') {
            // Need to remove empty elements before joining in the separator case
            if (separator !== '') {
                for (var i = 0; i < parts.length;) {
                    var part = parts[i];
                    if ((typeof(part) === 'undefined') || (part === '') || (part === null)) {
                        parts.splice(i, 1);
                    }
                    else {
                        i++;
                    }
                }
            }
            val[separator] = ret = parts.join(separator);
        }
        return ret;
    }
}
$type.registerClass('Sys.StringBuilder');
