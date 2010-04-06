/*
Custom asserts for QUnit
 */

(function(window) {

function extend(a, b) {
	for ( var prop in b ) {
		a[prop] = b[prop];
	}

	return a;
}

extend(window, {
    isTrue: function(value, message) {
        ok(value === true, message || "expected true");
    },
    isFalse: function(value, message) {
        ok(value === false, message || "expected false");
    },
    
    instanceOfType: function(instance, type, message) {
        ok(type.isInstanceOfType(instance),
            "Expected type '" + type.getName() + "', actual '" + Object.getType(instance).getName() + "'. " + (message||""));
    },
    notInstanceOfType: function(instance, type, message) {
        ok(!type.isInstanceOfType(instance),
            "Expected any type but '" + type.getName() + "'. " + (message||""));
    },
    
    expectException: function(callback, exception) {
        exception = exception || Error;
        var thrown, actualException;
        
        try {
            callback();
        }
        catch (ex) {
            thrown = true;
            actualException = ex;
        }
        if (!thrown) {
            ok(false, "Exception was expected.");
        }
        else if (!(actualException instanceof exception)) {
            var message = "Expected exception of type " + exception.getName();
            if (actualException === undefined) {
                message += ". Actual: Undefined exception";
            }
            else if (actualException === null) {
                message += ". Actual: Null exception";
            }
            else {
                message += ". Actual: Exception of type " + Object.getTypeName(actualException);
            }
            ok(false, message);
        }
        else {
            for (var member in exception) {
                var expectedMember = exception[member],
                    actualMember = actualException[member];
                if (expectedMember !== actualMember) {
                    var displayExpected = " exception with " + member + " <" + expectedMember + ">",
                        displayActual = " exception with " + member + " <" + actualMember + ">";
                    ok(false, "Expected " + displayExpected + ". Actual " + displayActual);
                    break;
                }
            }
        }
    }
    
});


})(this);