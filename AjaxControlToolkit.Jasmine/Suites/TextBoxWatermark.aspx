<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="TextBoxWatermark.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.TextBoxWatermark" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body onload="onLoad()">
    <form id="form1" runat="server">
        <asp:ScriptManager runat="server"></asp:ScriptManager>

        <asp:TextBox ID="Target" runat="server"></asp:TextBox>
        <act:TextBoxWatermarkExtender
            WatermarkText="ABC"
            ID="Target_TextBoxWatermarkExtender"
            runat="server"
            BehaviorID="Target_TextBoxWatermarkExtender"
            TargetControlID="Target" />
    </form>
</body>
</html>

<script>
    function onLoad() {

        parent.Testing.Target = document.getElementById("<%= Target.ClientID %>");
        parent.Testing.LoadSpecCallback();
    }
</script>

