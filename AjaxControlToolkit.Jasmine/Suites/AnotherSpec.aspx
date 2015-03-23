<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AnotherSpec.aspx.cs" Inherits="AjaxControlToolkit.Jasmine.Suites.AnotherSpec" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body onload="onLoad()">
    <form id="form1" runat="server">
        <div>
            <asp:Button ID="Target" runat="server" Text="Bingo" />
        </div>
    </form>
</body>
</html>

<script>
    function onLoad() {
        parent.Testing.Target = document.getElementById("<%= Target.ClientID %>");
        parent.Testing.LoadSpecCallback();
    }
</script>

