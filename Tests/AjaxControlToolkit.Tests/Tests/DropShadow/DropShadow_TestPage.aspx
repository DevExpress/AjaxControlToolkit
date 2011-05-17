<%@ Page Title="" Language="C#" AutoEventWireup="true" CodeBehind="DropShadow_TestPage.aspx.cs"
    Inherits="AjaxControlToolkit.Tests.Tests.DropShadow.DropShadow_TestPage" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <act:ToolkitScriptManager ID="ScriptManager1" runat="server" />

        <asp:UpdatePanel ID="up1" runat="server">
            <ContentTemplate>
                <asp:Panel ID="MyPanel" CssClass="dropShadow" runat="server">
                    <div class="dropShadow_content">
                        <h1>
                            Hello World!</h1>
                    </div>
                </asp:Panel>
                <act:DropShadowExtender ID="DropShadowExtender1" TargetControlID="MyPanel" Width="10"
                    Radius="10" runat="server">
                </act:DropShadowExtender>                
                <asp:Button ID="btn" Text="Go!" runat="server" />
            </ContentTemplate>
        </asp:UpdatePanel>

    </div>
    </form>
</body>
</html>
