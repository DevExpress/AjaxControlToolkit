<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="AjaxControlToolkit.Tests.Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Ajax Control Toolkit Tests</title>
    <link href="Styles/Site.css" rel="stylesheet" type="text/css" /> 
    
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    <h1>Run All Ajax Control Toolkit Tests</h1>

    <div>
        Completed <span id="testPagesCompleted">0</span>
        out of <span id="testPagesTotal">0</span> test pages
        in <span id="testTotalMinutes"></span> 
        seconds.
    </div>

    <table id="resultsTable">
    <thead>
        <tr>
            <th>Test Name</th>
            <th>Total Tests</th>
            <th>Failed</th>
            <th>Passed</th>
            <th>Time (seconds)</th>
        </tr>
    </thead>    
    <tbody id="testResults">
    </tbody>
    </table>




    <iframe id="testRunner" name="testRunner" width="100%" height="300"></iframe>

    <script src="Scripts/jquery-1.5.min.js" type="text/javascript"></script>
    <script src="Scripts/jquery.tmpl.js" type="text/javascript"></script>
  

    <script id="resultTemplate" type="text/html">
        <tr class="${ (failed===0)?'success':'fail' }">
            <td>${testName}</td>
            <td>${total}</td>
            <td>${failed}</td>
            <td>${passed}</td>
            <td>${runtime/1000}</td>
        </tr>
    </script>


 
    <script type="text/javascript">
        // Get list of all tests in the /Tests folder
        var tests = [<%= GetTests() %>];
        
        // Global to display test results
        var currentTest = null;
        var testPagesCompleted = 0;
        var testPagesTotal = tests.length;
        var testTotalTime = 0;
        var results = [];


        // Get test runner iframe
        var testRunner = $("#testRunner");

        // Show total test page count
        $("#testPagesTotal").text(testPagesTotal);

        // Run the first test
        runTest();

        function runTest() {
            if (tests.length > 0) {
                currentTest = tests.pop();
                testRunner.attr("src", currentTest);
            }
        }


        function done(result) {
            // Record results
            result.testName = currentTest;
            results.push(result);

            // Show tests completed
            testPagesCompleted = testPagesTotal - tests.length;
            $("#testPagesCompleted").text(testPagesCompleted); 
            testTotalTime += result.runtime;
            $("#testTotalMinutes").text( testTotalTime / 1000);

            // Display results
            displayResults();

            // Run next test
            runTest();
        }


        function displayResults() {
            $("#testResults").empty();
            $("#resultTemplate").tmpl(results).appendTo("#testResults");
        }

    
    </script>



    </div>
    </form>
</body>
</html>
