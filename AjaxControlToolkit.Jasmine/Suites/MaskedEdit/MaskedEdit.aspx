<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MaskedEdit.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.MaskedEdit" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body onload="onLoad()">
    <form id="TestForm" runat="server">
        <asp:ScriptManager ID="TestScriptManager" runat="server"></asp:ScriptManager>

        <asp:TextBox ID="CommonTarget" runat="server" Text="ABC" />
        <act:MaskedEditExtender ID="CommonTargetExtender" runat="server" TargetControlID="CommonTarget" Mask="LLLLL" />
    </form>
</body>
</html>

<script>
    function onLoad() {
        parent.Testing.CommonTarget = document.getElementById("<%= CommonTarget.ClientID %>");
        parent.Testing.CommonExtender = $find("<%= CommonTargetExtender.ClientID %>");
        
        parent.Testing.Sys = Sys;
        parent.Testing.LoadSpecCallback();
    }
</script>
