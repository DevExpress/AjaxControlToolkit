<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Debug.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager.Debug" %>

<%@ Register Assembly="AjaxControlToolkit.Jasmine" Namespace="AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager" TagPrefix="test" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
</head>
<body onload="onLoad()">
    <form id="Form1" runat="server">
        <asp:ScriptManager ID="ScriptManager1" runat="server" ScriptMode="Debug" />

        <asp:TextBox runat="server" ID="Target" />
        <test:TestExtenderControl ID="TestExtenderControl1" runat="server" TargetControlID="Target" />
    </form>
</body>
</html>

<script>
    function onLoad() {
        parent.Testing.TestExtenderBehavior = Sys.Extended.UI.TestExtenderBehavior;
        parent.Testing.LoadSpecCallback();
    }
</script>

