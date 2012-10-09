<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="26686.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.Combobox._26686" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>    
    <form id="form1" runat="server">
    <act:ToolkitScriptManager ID="sm1" runat="server"></act:ToolkitScriptManager>
    <div>
        <act:ComboBox ID="comboBoxSeasons" runat="server" CssClass="" AutoPostBack="false"
            AutoCompleteMode="Suggest" DropDownStyle="DropDown" CaseSensitive="false">
            <asp:ListItem>Sammi</asp:ListItem>
            <asp:ListItem>Nikki</asp:ListItem>
            <asp:ListItem>Dante</asp:ListItem>
            <asp:ListItem>John</asp:ListItem>
            <asp:ListItem>Merilee</asp:ListItem>
        </act:ComboBox>
    </div>
    </form>
</body>
</html>
