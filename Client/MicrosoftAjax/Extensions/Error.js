$type = Error;
$type.__typeName = 'Error';
$type.__class = true;

Sys._errorArgument = function(kind, paramName, message) {
    var name = "Sys.Argument" + kind + "Exception";
    var displayMessage = name + ": " + (message || Sys.Res["argument"+kind]);
    if (paramName) {
        displayMessage += "\n" + String.format(Sys.Res.paramName, paramName);
    }

    var err = Error.create(displayMessage, { name: name, paramName: paramName });
    err.popStackFrame();
    err.popStackFrame();
    return err;
}

Sys._error = function(kind, message, defaultMessage) {
    var name = "Sys." + kind + "Exception";
    var displayMessage = name + ": " + (message || Sys.Res[defaultMessage]);
    var err = Error.create(displayMessage, {name: name});
    err.popStackFrame();
    err.popStackFrame();
    return err;
}

$type.create = function Error$create(message, errorInfo) {
    /// <summary locid="M:J#Error.create">Use this method to create a new error.</summary>
    /// <param name="message" type="String" optional="true" mayBeNull="true">The error message.</param>
    /// <param name="errorInfo" optional="true" mayBeNull="true">A plain JavaScript object that contains extended information about the error.   The object should have a 'name' field that contains a string that identifies the error   and any additional fields that are necessary to fully describe the error.</param>
    /// <returns type="Error">An Error object.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "message", type: String, mayBeNull: true, optional: true},
        {name: "errorInfo", mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif

    // If message string can be converted to a number, IE sets e.message to the number, not the string.
    // Workaround this issue by explicitly setting e.message to the string.
    var err = new Error(message);
    err.message = message;

    if (errorInfo) {
        for (var v in errorInfo) {
            err[v] = errorInfo[v];
        }
    }

    err.popStackFrame();
    return err;
}

// The ArgumentException ctor in .NET has the message *before* paramName.  This
// is inconsistent with all the other Argument*Exception ctors in .NET.
// We feel the paramName is more important than the message, and we want all our
// argument errors to be consistent, so our Error.argument() takes the paramName
// before the message.  This is inconsistent with .NET, but overall we feel
// it is the better design.
$type.argument = function Error$argument(paramName, message) {
    /// <summary locid="M:J#Error.argument">Creates an ArgumentException with a specified error message   and the name of the parameter that caused this exception.</summary>
    /// <param name="paramName" type="String" optional="true" mayBeNull="true">The name of the parameter that caused the exception.</param>
    /// <param name="message" type="String" optional="true" mayBeNull="true">A message that describes the error.</param>
    /// <returns>An Error instance that represents an ArgumentException.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "paramName", type: String, mayBeNull: true, optional: true},
        {name: "message", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    return Sys._errorArgument("", paramName, message);
}

$type.argumentNull = function Error$argumentNull(paramName, message) {
    /// <summary locid="M:J#Error.argumentNull">Creates an ArgumentNullException with a specified error message   and the name of the parameter that caused this exception.</summary>
    /// <param name="paramName" type="String" optional="true" mayBeNull="true">The name of the parameter that caused the exception.</param>
    /// <param name="message" type="String" optional="true" mayBeNull="true">A message that describes the error.</param>
    /// <returns>An Error instance that represents an ArgumentNullException.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "paramName", type: String, mayBeNull: true, optional: true},
        {name: "message", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    return Sys._errorArgument("Null", paramName, message);
}

$type.argumentOutOfRange = function Error$argumentOutOfRange(paramName, actualValue, message) {
    /// <summary locid="M:J#Error.argumentOutOfRange">Creates an ArgumentOutOfRangeException with a specified error message   and the name and actual value of the parameter that caused this exception.</summary>
    /// <param name="paramName" type="String" optional="true" mayBeNull="true">The name of the parameter that caused the exception.</param>
    /// <param name="actualValue" optional="true" mayBeNull="true">The actual value of the parameter.</param>
    /// <param name="message" type="String" optional="true" mayBeNull="true">A message that describes the error.</param>
    /// <returns>An Error instance that represents an ArgumentOutOfRangeException.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "paramName", type: String, mayBeNull: true, optional: true},
        {name: "actualValue", mayBeNull: true, optional: true},
        {name: "message", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif

    var displayMessage = "Sys.ArgumentOutOfRangeException: " + (message || Sys.Res.argumentOutOfRange);
    if (paramName) {
        displayMessage += "\n" + String.format(Sys.Res.paramName, paramName);
    }

    // .NET implementation of ArgumentOutOfRangeException does not display actualValue if it is null.
    // For parity with .NET, we do not display if actualValue is null or undefined.  This is OK,
    // since more specific exceptions exist for null and undefined.
    if (typeof(actualValue) !== "undefined" && actualValue !== null) {
        displayMessage += "\n" + String.format(Sys.Res.actualValue, actualValue);
    }

    var err = Error.create(displayMessage, {
        name: "Sys.ArgumentOutOfRangeException",
        paramName: paramName,
        actualValue: actualValue
    });
    err.popStackFrame();
    return err;
}

$type.argumentType = function Error$argumentType(paramName, actualType, expectedType, message) {
    /// <summary locid="M:J#Error.argumentType">Creates an ArgumentTypeException with a specified error message   and the name, actual type, and expected type of the parameter that   caused this exception.</summary>
    /// <param name="paramName" type="String" optional="true" mayBeNull="true">The name of the parameter that caused the exception.</param>
    /// <param name="actualType" type="Type" optional="true" mayBeNull="true">The actual type of the parameter value.</param>
    /// <param name="expectedType" type="Type" optional="true" mayBeNull="true">The expected type of the parameter value.</param>
    /// <param name="message" type="String" optional="true" mayBeNull="true">A message that describes the error.</param>
    /// <returns>An Error instance that represents an ArgumentTypeException.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "paramName", type: String, mayBeNull: true, optional: true},
        {name: "actualType", type: Type, mayBeNull: true, optional: true},
        {name: "expectedType", type: Type, mayBeNull: true, optional: true},
        {name: "message", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif

    var displayMessage = "Sys.ArgumentTypeException: ";
    if (message) {
        displayMessage += message;
    }
    else if (actualType && expectedType) {
        displayMessage +=
            String.format(Sys.Res.argumentTypeWithTypes, actualType.getName(), expectedType.getName());
    }
    else {
        displayMessage += Sys.Res.argumentType;
    }

    if (paramName) {
        displayMessage += "\n" + String.format(Sys.Res.paramName, paramName);
    }

    var err = Error.create(displayMessage, {
        name: "Sys.ArgumentTypeException",
        paramName: paramName,
        actualType: actualType,
        expectedType: expectedType
    });
    err.popStackFrame();
    return err;
}

$type.argumentUndefined = function Error$argumentUndefined(paramName, message) {
    /// <summary locid="M:J#Error.argumentUndefined">Creates an ArgumentUndefinedException with a specified error message   and the name of the parameter that caused this exception.</summary>
    /// <param name="paramName" type="String" optional="true" mayBeNull="true">The name of the parameter that caused the exception.</param>
    /// <param name="message" type="String" optional="true" mayBeNull="true">A message that describes the error.</param>
    /// <returns>An Error instance that represents an ArgumentUndefinedException.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "paramName", type: String, mayBeNull: true, optional: true},
        {name: "message", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    return Sys._errorArgument("Undefined", paramName, message);
}

$type.format = function Error$format(message) {
    /// <summary locid="M:J#Error.format">Creates a format error.</summary>
    /// <param name="message" type="String" optional="true" mayBeNull="true">The error message.</param>
    /// <returns>An Error object that represents a FormatException.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "message", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    return Sys._error("Format", message, "format");
}

$type.invalidOperation = function Error$invalidOperation(message) {
    /// <summary locid="M:J#Error.invalidOperation">Creates an invalid operation error.</summary>
    /// <param name="message" type="String" optional="true" mayBeNull="true">The error message.</param>
    /// <returns>An Error instance that represents an InvalidOperationException.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "message", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    return Sys._error("InvalidOperation", message, "invalidOperation");
}

$type.notImplemented = function Error$notImplemented(message) {
    /// <summary locid="M:J#Error.notImplemented">Creates a not implemented error.</summary>
    /// <param name="message" type="String" optional="true" mayBeNull="true">The error message.</param>
    /// <returns>An Error instance that represents a NotImplementedException.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "message", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    return Sys._error("NotImplemented", message, "notImplemented");
}

$type.parameterCount = function Error$parameterCount(message) {
    /// <summary locid="M:J#Error.parameterCount">Creates a ParameterCountException with a specified error message.</summary>
    /// <param name="message" type="String" optional="true" mayBeNull="true">A message that describes the error.</param>
    /// <returns>An Error instance that represents a ParameterCountException.</returns>
    //#if DEBUG
    var e = Function._validateParams(arguments, [
        {name: "message", type: String, mayBeNull: true, optional: true}
    ]);
    if (e) throw e;
    //#endif
    return Sys._error("ParameterCount", message, "parameterCount");
}

$type.prototype.popStackFrame = function Error$popStackFrame() {
    /// <summary locid="M:J#checkParam">Updates the fileName and lineNumber fields based on the next frame in the   stack trace. Call this method whenever an instance of Error is returned   from a function. This makes the fileName and lineNumber reported in the   FireFox console point to the location where the exception was thrown, not   the location where the instance of Error was created.</summary>
    //#if DEBUG
    if (arguments.length !== 0) throw Error.parameterCount();
    //#endif

    // Example stack frame
    // ===================
    // Error("test error")@:0
    // createError()@http://localhost/app/Error.js:2
    // throwError()@http://localhost/app/Error.js:6
    // callThrowError()@http://localhost/app/Error.js:10
    // @http://localhost/app/Error:js:14

    if (typeof(this.stack) === "undefined" || this.stack === null ||
        typeof(this.fileName) === "undefined" || this.fileName === null ||
        typeof(this.lineNumber) === "undefined" || this.lineNumber === null) {
        return;
    }

    var stackFrames = this.stack.split("\n");

    // Find current stack frame.  It may not be the first stack frame, since the very
    // first frame when the Error is constructed does not correspond to any actual file
    // or line number.  See example stack frame above.
    var currentFrame = stackFrames[0];
    var pattern = this.fileName + ":" + this.lineNumber;
    while(typeof(currentFrame) !== "undefined" &&
          currentFrame !== null &&
          currentFrame.indexOf(pattern) < 0) {
        stackFrames.shift();
        currentFrame = stackFrames[0];
    }

    var nextFrame = stackFrames[1];

    // Special-case last stack frame, to stop shifting frames off the stack.
    if (typeof(nextFrame) === "undefined" || nextFrame === null) {
        return;
    }

    // Update fields to correspond with next stack frame
    var nextFrameParts = nextFrame.match(/@(.*):(\d+)$/);
    if (typeof(nextFrameParts) === "undefined" || nextFrameParts === null) {
        return;
    }

    this.fileName = nextFrameParts[1];

    // This should always succeed, since the regex matches "\d+"
    this.lineNumber = parseInt(nextFrameParts[2]);

    stackFrames.shift();
    this.stack = stackFrames.join("\n");
}
