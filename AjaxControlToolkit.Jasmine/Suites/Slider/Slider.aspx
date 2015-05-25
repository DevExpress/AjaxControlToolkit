<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Slider.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.Slider.Slider" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body onload="onLoad()">
    <form id="TestForm" runat="server">
        <asp:ScriptManager ID="TestScriptManager" runat="server"></asp:ScriptManager>

        <asp:TextBox ID="Target" runat="server" />
        <act:SliderExtender runat="server" ID="TargetExtender" TargetControlID="Target" 
            Minimum="0" Maximum="100" />
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
