<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Tests.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Tests" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>

    <link rel="stylesheet" href="/Vendor/jasmine-2.2.0/jasmine.css" />

    <script src="/Vendor/jasmine-2.2.0/jasmine.js"></script>
    <script src="/Vendor/jasmine-2.2.0/jasmine-html.js"></script>
    <script src="/Vendor/jasmine-2.2.0/boot.js"></script>
</head>
<body>
    <form id="form1" runat="server">
        <iframe id="test-frame"></iframe>
    </form>

    <script>
        window.Testing = {};
        window.Testing.LoadSpec = function (specName, callback) {
            window.Testing.LoadSpecCallback = callback;
            document.getElementById("test-frame").src = "/Suite/" + specName;
        };
    </script>

    <script src="Suites/TextBoxWatermark.js"></script>
    <script src="Suites/MaskedEdit.js"></script>
</body>
</html>
