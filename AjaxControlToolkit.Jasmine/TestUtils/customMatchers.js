beforeEach(function() {
    jasmine.addMatchers({
        toBeAnyOf: function() {
            return {
                compare: function(actual, expected) {
                    var result = { pass: false }

                    for(var i = 0, length = expected.length; i < length; i++) {
                        if(actual === expected[i]) {
                            result.pass = true;
                            break;
                        }
                    }

                    return result;
                }
            }
        }
    });
});