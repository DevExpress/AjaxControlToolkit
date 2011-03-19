<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="DropDown_TestPage.aspx.cs" Inherits="AjaxControlToolkit.Tests.Tests.DropDown.DropDown_TestPage" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>


            <act:ToolkitScriptManager ID="ScriptManager1" runat="server">
            </act:ToolkitScriptManager>

            <asp:label runat="server" id="L0" text="L0" />
            <asp:hyperlink runat="server" id="L1" text="L1" navigateurl="javascript:void(L1WasClicked=true)" />
            <act:DropDownExtender runat="server" ID="D0" TargetControlID="L0" DropDownControlID="P0" />
            <act:DropDownExtender runat="server" ID="D1" TargetControlID="L1" DropDownControlID="P1" />
            <asp:panel runat="Server" id="P0" style="display: none; visibility: hidden;"></asp:panel>
            <asp:panel runat="Server" id="P1" style="display: none; visibility: hidden;"></asp:panel>            

            <asp:updatepanel runat="server" id="UP1">
                <ContentTemplate>
                    <asp:Label runat="server" id="L2" text="L2" />
                    <asp:Panel runat="Server" id="P2" style="display:none;visibility:hidden;"></asp:Panel>
                    <act:DropDownExtender runat="server" ID="D2" TargetControlID="L2" DropDownControlID="P2" />
                    <asp:Button runat="server" id="B0" text="" onclick="B0_Click" />
                </ContentTemplate>
            </asp:updatepanel>
    
    </div>
    </form>
</body>
</html>
