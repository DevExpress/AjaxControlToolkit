<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MaskedEdit.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.MaskedEdit" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body onload="onLoad()">
    <form id="TestForm" runat="server">
        <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>

        <asp:TextBox ID="Target" runat="server" />
        <act:MaskedEditExtender ID="TargetExtender" runat="server"
            TargetControlID="Target"
            Mask="LLLLL"
            ClientIDMode="Static"/>
    </form>
</body>
</html>

<script>
    function onLoad() {
        parent.Testing.Component = $find("<%= TargetExtender.ClientID %>");
        parent.Testing.Target = document.getElementById("<%= Target.ClientID %>");
        parent.Testing.Sys = Sys;
        parent.Testing.LoadSpecCallback();
    }
</script>
