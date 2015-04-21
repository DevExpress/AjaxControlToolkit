<%@ Page Language="C#" AutoEventWireup="True" CodeBehind="Debug_Cdn.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager.Debug_Cdn" %>

<%@ Register Assembly="AjaxControlToolkit.Jasmine" Namespace="AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager" TagPrefix="test" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body onload="onLoad()">
    <form runat="server">
        <asp:ScriptManager runat="server" ScriptMode="Debug" EnableCdn="true"/>

        <asp:TextBox runat="server" ID="Target" />
        <test:TestExtenderCdnControl runat="server" TargetControlID="Target" />
    </form>
</body>
</html>

<script>
    function onLoad() {
        parent.Testing.TestExtender = Sys.Extended.UI.TestExtender;
        parent.Testing.LoadSpecCallback();
    }
</script>

