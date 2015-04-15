<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="TestSetup.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.TextBoxWatermark" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body onload="onLoad()">
    <form id="TestForm" runat="server">
        <asp:ScriptManager runat="server"></asp:ScriptManager>

        <asp:TextBox ID="Target" runat="server" Text="ABC"></asp:TextBox>
    </form>
</body>
</html>

<script>
    function onLoad() {
        parent.Testing.Target = document.getElementById("<%= Target.ClientID %>");
        parent.Testing.LoadSpecCallback();
    }
</script>

