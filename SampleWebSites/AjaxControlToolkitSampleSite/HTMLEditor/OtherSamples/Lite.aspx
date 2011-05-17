<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Lite.aspx.cs" Inherits="test" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<%@ Register
    TagPrefix="customEditors"
    Namespace="AjaxControlToolkit.HTMLEditor.Samples" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head runat="server">
    <title>HTMLEditor Sample</title>
    <style type="text/css">
           a {
                   font:11px Verdana;
                   color:#315686;
                   text-decoration:underline;
           }

           a:hover {
                   color:#DC143C;
           }
    </style>
</head>
<body style="font:12px Verdana;">
    <a href="../HTMLEditor.aspx">< Back to <strong>HTMLEditor</strong> page</a>
    <br /><br />
    This sample demonstrates a lighter set of buttons in the top toolbar.<br />
    <br />
    <form id="form1" runat="server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
    <asp:UpdatePanel ID="updatePanel1" runat="server">
    <ContentTemplate>
        <customEditors:Lite runat="server" id="editor" Height="400px" Width="500px" />
        <asp:Button runat="server" Text="Submit content" ID="submit" />
    </ContentTemplate>
    </asp:UpdatePanel>
    </form>
</body>
</html>
