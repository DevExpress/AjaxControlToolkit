<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="HtmlEditor.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.HtmlEditor.HtmlEditor" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body onload="onLoad()">
    <form id="TestForm" runat="server">
        <asp:ScriptManager ID="MainScriptManager" runat="server"></asp:ScriptManager>

        <asp:TextBox ID="Target" runat="server" Width="500" Height="300"/>
        <act:HtmlEditorExtender runat="server" TargetControlID="Target" ID="TargetExtender" EnableSanitization="false">
        </act:HtmlEditorExtender>
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
