/*
Utility methods to use in your qunit tests
*/

var testFrame = $("#testFrame");


QUnit.done = function (result) {

    if (parent.done) {
        parent.done(result);
    }

};


// Loads the test page
function loadTestPage(url) {
    testFrame.attr("src", url);
}

// Loads the test script
function loadTestScript(url) {
    $.getScript(url);
}



function testFrameWindow() {
    return $("#testFrame")[0].contentWindow;
}


function $find(id) {
    return $("#testFrame")[0].contentWindow.$find(id);
}


// jQuery selector that works against the test frame
function $testFrame(selector) {
    return $(testFrame).contents().find(selector);
}


// Reloads the test frame to its starting point
function resetTestFrame(callback) {
    $(testFrame).one("load", callback);
    testFrame.attr("src", testFrame.attr("src"));
}


// Waits for a condition to be true before calling callback
function waitFor(settings) {
    settings.timeout = settings.timeout || 5000; // timeout is 5 seconds by default
    var start = new Date();

    var id = parent.setInterval(function () {
        if (settings.condition()) {
            parent.clearInterval(id);
            if (settings.success) {
                settings.success();
            }
        }

        var now = new Date();
        if (now - start > settings.timeout) {
            parent.clearInterval(id);

            if (settings.fail) {
                settings.fail();
            } else if (settings.success) {
                settings.success();
            }
        }

    }, 500);

} 
