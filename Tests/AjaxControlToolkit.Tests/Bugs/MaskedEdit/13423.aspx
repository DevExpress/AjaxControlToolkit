<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="13423.aspx.cs"
    Inherits="AjaxControlToolkit.Tests.Bugs.Issue13423" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <act:ToolkitScriptManager ID="ToolkitScriptManager1" CombineScripts="false" runat="server" />
    <div>
         <%--<asp:UpdatePanel ID="UpdatePanel1" runat="server">
            <ContentTemplate>--%>
                <asp:TextBox ID="TextBox1" runat="server"></asp:TextBox>
                <asp:Button ID="Button1" runat="server" OnClick="Button1_Click" Text="Button" />
                <act:MaskedEditExtender ID="MaskedEditExtender1" runat="server" Mask="99/99/9999 99:99:99" 
                TargetControlID="TextBox1" MaskType="DateTime" CultureName="en-GB" UserDateFormat="DayMonthYear">
                </act:MaskedEditExtender>
                <act:MaskedEditValidator ID="MaskedEditValidator1" runat="server" ControlExtender="MaskedEditExtender1"
                ControlToValidate="TextBox1" Display="Dynamic" InvalidValueMessage="invalid date" ErrorMessage="Error in the entered datetime"></act:MaskedEditValidator>
            <%--</ContentTemplate>
        </asp:UpdatePanel>--%>
    </div>
    </form>
</body>
</html>
