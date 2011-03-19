<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="RoundedCorners_TestPage.aspx.cs" Inherits="AjaxControlToolkit.Tests.Tests.RoundedCorners.RoundedCorners_TestPage" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
        <act:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server" />
        <asp:panel id="Panel1" runat="server" backcolor="Gold">
        This is just a plain old panel.
        <br />
        <br />
        <asp:Panel ID="Panel2" runat="server" backcolor="Purple">
        </asp:Panel>
        It's got a bunch of text in it.<br />
        <br />
        And it's gold.
    </asp:panel>

        <act:RoundedCornersExtender ID="RoundedCornersExtender1" runat="server" TargetControlID="Panel1" Color="Lime" Radius="10">
        </act:RoundedCornersExtender>


    </div>
    </form>
</body>
</html>
