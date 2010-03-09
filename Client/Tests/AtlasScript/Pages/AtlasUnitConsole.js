/// <reference name="MicrosoftAjax.js"/>
/// <reference path="AtlasUnit.js"/>

Type.registerNamespace("AtlasUnit.Console");

AtlasUnit.Console.ResultSummaryGenerator = function() {
}
AtlasUnit.Console.ResultSummaryGenerator.registerClass("AtlasUnit.Console.ResultSummaryGenerator");

AtlasUnit.Console.ResultSummaryGenerator.generateSummary = function(runTestCases, failedTestCases, plainLog, elapsedTime) {
    if (plainLog) {
        var allTests = [];
        for (var i=0; i < failedTestCases.length; i++) {
            Array.add(allTests, failedTestCases[i].get_fullName() + " FAILED");
        }

        for (var i=0; i < runTestCases.length; i++) {
            // Only add the test as "passed" if it didn't fail
            var testName = runTestCases[i].get_fullName();
            if (!Array.contains(allTests, testName + " FAILED")) {
                Array.add(allTests, testName + " Pass");
            }
        }

        allTests.sort(function(a, b) {
            var aLower = a.toLowerCase();
            var bLower = b.toLowerCase();
            return aLower > bLower ? 1 : (aLower < bLower ? -1 : 0);
        });
        return allTests.join("\r\n");
    }
    else {
        var sb = new Sys.StringBuilder();

        for (var i=0; i < runTestCases.length; i++) {
            if (runTestCases[i].get_result().get_executionStatus() == AtlasUnit.ExecutionStatus.Failed) {
                sb.append("F");
            }
            else {
                sb.append(".");
            }
            if (i % 80 === 79) {
                sb.appendLine();
            }
        }
        sb.appendLine();

        sb.appendLine(String.format("Tests Run: {0}, Failures: {1}, Time: {2} seconds",
            runTestCases.length, failedTestCases.length, elapsedTime / 1000));

        if (failedTestCases.length > 0) {
            sb.appendLine();
            sb.appendLine("Failures:");
        }
        for (var i=0; i < failedTestCases.length; i++) {
            sb.append("" + (i + 1) + ") " + failedTestCases[i].get_fullName() + ": ");
            var exception = failedTestCases[i].get_result().get_exception();
            if (exception && typeof(exception.message) != "undefined") {
                sb.appendLine(exception.message);
            }
            else {
                sb.appendLine(exception);
            }
        }

        sb.appendLine();
        sb.appendLine("Tests Run:");
        for (var i=0; i < runTestCases.length; i++) {
            sb.appendLine(runTestCases[i].get_fullName());
        }

        return sb.toString();
    }
}

Sys.Application.notifyScriptLoaded();