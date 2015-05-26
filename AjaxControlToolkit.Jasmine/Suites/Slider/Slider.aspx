<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Slider.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.Slider.Slider" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body onload="onLoad()">
    <form id="TestForm" runat="server">
        <asp:ScriptManager ID="TestScriptManager" runat="server"></asp:ScriptManager>

        <asp:TextBox ID="HorizontalTarget" runat="server" />
        <act:SliderExtender runat="server" ID="HorizontalTargetExtender" TargetControlID="HorizontalTarget" 
            Minimum="0" Maximum="100" />

        <br />

        <asp:TextBox ID="VerticalTarget" runat="server" />
        <act:SliderExtender runat="server" ID="VerticalTargetExtender" TargetControlID="VerticalTarget"
            Minimum="0" Maximum="100" Orientation="Vertical" />
    </form>
</body>
</html>

<script>
    function onLoad() {
        parent.Testing.HorizontalTarget = document.getElementById("<%= HorizontalTarget.ClientID %>");
        parent.Testing.HorizontalExtender = $find("<%= HorizontalTargetExtender.ClientID %>");
        
        parent.Testing.VerticalTarget = document.getElementById("<%= VerticalTarget.ClientID %>");
        parent.Testing.VerticalExtender = $find("<%= VerticalTargetExtender.ClientID %>");

        parent.Testing.Sys = Sys;
        parent.Testing.LoadSpecCallback();
    }
</script>
