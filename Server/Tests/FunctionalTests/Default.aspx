<%@ Page
    Language="C#"
    AutoEventWireup="true"
    CodeFile="Default.aspx.cs"
    Inherits="Automated_TestHarness" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>AJAX Control Toolkit Test Harness</title>
    <link href="Default.css" rel="stylesheet" type="text/css" />
    <script language="Javascript" type="text/javascript" src="TestHarness.js"></script>
</head>
<body onload="testHarness.initialize();"><form runat="server"><div>
    <script language="javascript" type="text/javascript">
        // List of test suite URLs populated by enumerating the directory server-side
        var testSuiteUrls = [<asp:Literal ID="litTestSuiteUrls" runat="server" />];
        
        // Command line flags set by the server
        var runAll = <asp:Literal ID="litRunAllFlag" runat="server" />;
        var debug = <asp:Literal ID="litDebugFlag" runat="server" />;
    </script>
    <table width="100%" height="100%" style="text-align: center;">
        <tr><td colspan="2">
            <h1>AJAX Control Toolkit Automated Test Harness</h1>
            <div id="status" class="status">
                Passed: <span id="statusPassed">0</span>, Failed: <span id="statusFailed">0</span>, Not Run: <span id="statusUnknown">0</span>
            </div>
        </td></tr>
        <tr>
            <td valign="top">
                <div class="testSuiteList">
                    <div id="availableTests" style="width: 100%; text-align: left; overflow: auto;" runat="server" /><br />
                    <div>
                        <a href="#" onclick="testHarness.selectAllTests(true);">Select All</a> |
                        <a href="#" onclick="testHarness.selectAllTests(false);">Clear All</a>
                    </div><br />
                    <input type="button" id="btnRun" value="Run Tests" onclick="testHarness.runTests();"/><br /><br />
                    <div><input type="checkbox" id="chkDebug" /><label for="chkDebug">Debug</label></div>
                </div>
            </td>
            <td valign="top" width="100%">
                <iframe id="wndTest" src="about:blank" width="100%" height="400" style="margin-bottom: 15px;"
                    onload="window.setTimeout(testHarness.initializeTestSuite, testHarness.Constants.InitialDelay);"></iframe>
                <div id="results" style="width: 100%; text-align: left;" runat="server" />
            </td>
        </tr>
    </table>
</div></form></body>
</html>