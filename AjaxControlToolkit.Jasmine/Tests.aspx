<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Tests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Tests" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>

    <link rel="stylesheet" href="/Vendor/jasmine-2.2.0/jasmine.css" />

    <script src="/Vendor/jasmine-2.2.0/jasmine.js"></script>
    <script src="/Vendor/jasmine-2.2.0/jasmine-html.js"></script>
    <script src="/Vendor/jasmine-2.2.0/boot.js"></script>
    <script src="/TestUtils/customMatchers.js"></script>

    <script src="/Vendor/jquery-2.1.4/jquery.js"></script>

    <script src="/Vendor/jquery.simulate.js"></script>
</head>
<body>
    <form id="MainForm" runat="server">
        <iframe id="test-frame" width="1000" height="500"></iframe>
    </form>

    <script>
        window.Testing = {};
        window.Testing.LoadSpec = function (callback, suiteDirName, suiteName) {
            if(!suiteName)
                suiteName = suiteDirName;

            document.getElementById("test-frame").src = "/Suite/" + suiteDirName + "/" + suiteName;
            window.Testing.LoadSpecCallback = callback;
        };
    </script>

    <script src="Suites/TestSetup/TestSetup.js"></script>
    <script src="Suites/MaskedEdit/MaskedEdit.js"></script>
    <script src="Suites/HtmlEditor/HtmlEditor.js"></script>
    <script src="Suites/Tabs/Tabs.js"></script>
    <script src="Suites/Slider/Slider.js"></script>
    <script src="Suites/ToolkitResourceManager/ToolkitResourceManager.js"></script>
</body>
</html>
