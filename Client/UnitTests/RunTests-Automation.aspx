<%@ Page Language="C#" %>
<%@ Import Namespace="System.IO" %>
<script runat="server" language="C#">
    [System.Web.Services.WebMethod]
    public static void WriteReport(UnitTests.TestResults result, string browserName) {
        result.WriteToFile(browserName);
    }
</script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>QUnit Automation</title>
    <link type="text/css" rel="Stylesheet" href="qunit/qunit-automation.css" />
    <script type="text/javascript">
    function pageLoad() {
        runTests("RunTests.html", "<%= Request["log"] ?? "" %>");
    }
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <asp:ScriptManager runat="server" EnablePageMethods="true">
        <Scripts>
            <asp:ScriptReference Path="qunit/qunit_automation.js" />
        </Scripts>
    </asp:ScriptManager>

    <span id="status" class="running">Running...</span>
    <div id="testarea">
    </div>

    
    </form>
</body>
</html>
