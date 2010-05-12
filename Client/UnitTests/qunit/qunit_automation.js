
(function(window) {
    var pageLoaded,
        testframe = document.createElement("iframe"),
        result,
        waitCallback;

    function valueOf(e) {
        var nodes = e.childNodes;
        return nodes.length ? parseInt(nodes[0].nodeValue || "0") : 0;
    }

    function getDoc(iframe) {
        var doc;
        try {
            doc = iframe.contentWindow ? iframe.contentWindow.document : iframe.contentDocument;
        }
        catch (e) {
        }
        return doc;
    }

    function ping(callback) {
        var doc = getDoc(testframe),
            result = doc ? doc.getElementById("qunit-testresult") : null;
        if (!result) {
            window.setTimeout(function() { ping(callback) }, 50);
        }
        else {
            callback(result);
        }
    }

    Sys.Application.add_load(function() {
        pageLoaded = true;
        if (result && waitCallback) {
            processResult();
        }
    });

    function processResult() {
        var status = $get("status");
        status.innerHTML = String.format("{1} passed, {2} failed ({0} total tests)", result.total, result.passed, result.failed);
        if (!result.failed) status.className = "success";
        waitCallback(result);
        result = null;
        waitCallback = null;
    }

    window.waitForTests = function(test, callback) {
        testframe.src = test + "?t=" + (new Date()-0) + "&" + window.location.search;
        document.getElementById("testarea").appendChild(testframe);

        ping(function(resultElement) {
            var spans = resultElement.getElementsByTagName("span"),
                passed = spans[0],
                total = spans[1],
                failed = spans[2];
            result = { total: valueOf(total), passed: valueOf(passed), failed: valueOf(failed) };
            waitCallback = callback;
            if (pageLoaded) {
                processResult();
            }
        });
    };

    window.runTests = function(test, browserName) {
        waitForTests(test, function(result) {
            PageMethods.WriteReport(result, browserName,
                function() {
                    var status = $get("status");
                    status.innerHTML += " [report sent successfully]";
                },
                function(err) {
                    var status = $get("status");
                    status.innerHTML += " [report failed: " + err.get_message() + "]";
                });
        });
    }

})(this);