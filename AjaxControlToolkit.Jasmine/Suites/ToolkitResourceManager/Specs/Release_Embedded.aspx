<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Release_Embedded.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager.Release_Embedded" %>

<%@ Register Assembly="AjaxControlToolkit.Jasmine" Namespace="AjaxControlToolkit.Jasmine.Suites.ToolkitResourceManager" TagPrefix="test" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body onload="onLoad()">
    <form runat="server">
        <asp:ScriptManager runat="server" ScriptMode="Release" EnableCdn="false" />

        <asp:TextBox runat="server" ID="Target" />
        <test:TestExtenderEmbeddedControl runat="server" TargetControlID="Target" />
    </form>
</body>
</html>

<script>
    function onLoad() {
        parent.Testing.Sys = Sys;
        parent.Testing.TestExtender = Sys.Extended.UI.TestExtender;
        parent.Testing.LoadSpecCallback();
    }
</script>

