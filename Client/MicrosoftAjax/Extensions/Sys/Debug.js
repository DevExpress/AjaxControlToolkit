$type = Sys._Debug = function _Debug() {
    /// <summary locid="M:J#Sys.Debug.#ctor">Provides a set of methods that help debug your code.</summary>
    /// <field name="isDebug" type="Boolean" locid="F:J#Sys.Debug.isDebug"></field>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif
}
$type.prototype = {
    _appendConsole: function _Debug$_appendConsole(text) {
        // VS script debugger output window.
        if ((typeof(Debug) !== 'undefined') && Debug.writeln) {
            Debug.writeln(text);
        }
        // FF firebug and Safari console.
        if (window.console && window.console.log) {
            window.console.log(text);
        }
        // Opera console.
        if (window.opera) {
            window.opera.postError(text);
        }
        // WebDevHelper console.
        if (window.debugService) {
            window.debugService.trace(text);
        }
    },

    _getTrace: function() {
        var traceElement = Sys.get('#TraceConsole');
        return (traceElement && (traceElement.tagName.toUpperCase() === 'TEXTAREA')) ? traceElement : null;
    },

    _appendTrace: function _Debug$_appendTrace(text) {
        var traceElement = this._getTrace();
        if (traceElement) {
            traceElement.value += text + '\n';
        }
    },

    assert: function _Debug$assert(condition, message, displayCaller) {
        /// <summary locid="M:J#Sys.Debug.assert">Checks for a condition, displays a message and prompts the user to break   into the debugger if the condition is false.</summary>
        /// <param name="condition" type="Boolean">true to prevent a message being displayed; otherwise, false.</param>
        /// <param name="message" type="String" optional="true" mayBeNull="true">A message to display.</param>
        /// <param name="displayCaller" type="Boolean" optional="true" mayBeNull="true">True if the function calling assert should be displayed in the message.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "condition", type: Boolean},
            {name: "message", type: String, mayBeNull: true, optional: true},
            {name: "displayCaller", type: Boolean, mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        //#endif
        if (!condition) {
            message = (displayCaller && this.assert.caller) ?
                String.format(Sys.Res.assertFailedCaller, message, this.assert.caller) :
                String.format(Sys.Res.assertFailed, message);

            if (confirm(String.format(Sys.Res.breakIntoDebugger, message))) {
                this.fail(message);
            }
        }
    },

    clearTrace: function _Debug$clearTrace() {
        /// <summary locid="M:J#Sys.Debug.clearTrace"></summary>
        //#if DEBUG
        if (arguments.length !== 0) throw Error.parameterCount();
        //#endif
        var traceElement = this._getTrace();
        if (traceElement) {
            traceElement.value = '';
        }
    },

    fail: function _Debug$fail(message) {
        /// <summary locid="M:J#Sys.Debug.fail">Displays a message in the debugger's output window and breaks into the debugger.</summary>
        /// <param name="message" type="String" mayBeNull="true">A message to display.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "message", type: String, mayBeNull: true}
        ]);
        if (e) throw e;
        //#endif
        this._appendConsole(message);

        // Cannot execute eval('debugger') in browsers that don't have a debugger statement, since it causes a parse error.
        if (Sys.Browser.hasDebuggerStatement) {
            window.eval('debugger');
        }
    },

    trace: function _Debug$trace(text) {
        /// <summary locid="M:J#Sys.Debug.trace">Appends a text line to the debugger console and the TraceConsole textarea element if available.</summary>
        /// <param name="text">Text for trace.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "text"}
        ]);
        if (e) throw e;
        //#endif
        this._appendConsole(text);
        this._appendTrace(text);
    },

    traceDump: function _Debug$traceDump(object, name) {
        /// <summary locid="M:J#Sys.Debug.traceDump">Dumps an object to the debugger console and the TraceConsole textarea element if available.</summary>
        /// <param name="object" mayBeNull="true">Object for trace dump.</param>
        /// <param name="name" type="String" mayBeNull="true" optional="true">Object name.</param>
        //#if DEBUG
        var e = Function._validateParams(arguments, [
            {name: "object", mayBeNull: true},
            {name: "name", type: String, mayBeNull: true, optional: true}
        ]);
        if (e) throw e;
        //#endif
        this._traceDump(object, name, true);
    },

    _traceDump: function _Debug$_traceDump(object, name, recursive, indentationPadding, loopArray) {
        name = name || 'traceDump';
        indentationPadding = indentationPadding || '';
        var prefix = indentationPadding + name + ": ";
        if (object === null) {
            this.trace(prefix + 'null');
            return;
        }
        switch(typeof(object)) {
            case 'undefined':
                this.trace(prefix + 'Undefined');
                break;
            case 'number': case 'string': case 'boolean':
                this.trace(prefix + object);
                break;
            default:
                if (Date.isInstanceOfType(object) || RegExp.isInstanceOfType(object)) {
                    this.trace(prefix + object.toString());
                    break;
                }
                if (!loopArray) {
                    loopArray = [];
                }
                else if (Array.contains(loopArray, object)) {
                    this.trace(prefix + '...');
                    return;
                }
                loopArray.push(object);

                // don't recurse into dom elements.
                // trace dump has to use '==' for window when it's passed as event arg in IE.
                // i.e., body onLoad="Sys.Debug.traceDump(window)"
                if ((object == window) || (object === document) ||
                    (window.HTMLElement && (object instanceof HTMLElement)) ||
                    (typeof(object.nodeName) === 'string')) {
                    var tag = object.tagName || 'DomElement';
                    if (object.id) {
                        tag += ' - ' + object.id;
                    }
                    this.trace(indentationPadding + name + ' {' +  tag + '}');
                }
                // objects and arrays
                else {
                    var typeName = Object.getTypeName(object);
                    this.trace(indentationPadding + name + (typeof(typeName) === 'string' ? ' {' + typeName + '}' : ''));
                    if ((indentationPadding === '') || recursive) {
                        indentationPadding += "    ";
                        var i, length, properties, p, v;
                        if (object instanceof Array) {
                            length = object.length;
                            for (i = 0; i < length; i++) {
                                this._traceDump(object[i], '[' + i + ']', recursive, indentationPadding, loopArray);
                            }
                        }
                        else {
                            for (p in object) {
                                v = object[p];
                                if (typeof(v) !== "function") {
                                    this._traceDump(v, p, recursive, indentationPadding, loopArray);
                                }
                            }
                        }
                    }
                }
                Array.remove(loopArray, object);
        }
    }
}
$type.registerClass('Sys._Debug');

$type = Sys.Debug = new Sys._Debug();
//#if DEBUG
$type.isDebug = true;
//#else
$type.isDebug = false;
//#endif
