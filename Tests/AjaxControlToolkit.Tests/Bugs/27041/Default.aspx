<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs._27041.Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <asp:ScriptManager ID="ScriptManager1" runat="server">
        <CompositeScript>
            <Scripts>
                <asp:ScriptReference Name="MicrosoftAjax.js" />
                <asp:ScriptReference Name="MicrosoftAjaxCore.js" />
                <asp:ScriptReference Name="MicrosoftAjaxSerialization.js" />
                <asp:ScriptReference Name="MicrosoftAjaxNetwork.js" />
                <asp:ScriptReference Name="MicrosoftAjaxComponentModel.js" />
            </Scripts>
        </CompositeScript>
    </asp:ScriptManager>
    <asp:UpdatePanel ID="UpdatePanel1" runat="server">
        <ContentTemplate>
            <asp:Panel ID="MembershipForm" runat="server">
                <div>
                    A standard text field:
                    <asp:TextBox ID="txtCompany" runat="server" />
                </div>
                An HTML5 'tel' field:
                <asp:TextBox ID="txtTelNo" type="tel" runat="server" />
                <div>
                    An HTML5 'email' field:
                    <asp:TextBox ID="txtEmail" Type="email" runat="server"></asp:TextBox>
                </div>
                <asp:Button ID="btnContinue" runat="server" Text="Submit" />
            </asp:Panel>
        </ContentTemplate>
    </asp:UpdatePanel>
    </form>
</body>
</html>
