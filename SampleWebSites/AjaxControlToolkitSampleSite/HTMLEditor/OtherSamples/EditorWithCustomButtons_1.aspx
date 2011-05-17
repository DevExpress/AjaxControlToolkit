<%@ Page Language="C#" AutoEventWireup="true" CodeFile="EditorWithCustomButtons_1.aspx.cs" Inherits="test" %>
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
<body  style="font:12px Verdana; margin:2px; overflow:hidden;" scroll="no">
    <a href="../HTMLEditor.aspx">< Back to <strong>HTMLEditor</strong> page</a>
    <br /><br />
    This sample demonstrates custom buttons added to the top toolbar.<br />
    Here you can see two custom buttons: <img alt=""  style="background-color: Blue; vertical-align:middle" src="../../App_Images/HTMLEditor.customButtons/ed_date_n.gif" />
    and <img alt="" style="background-color: Blue; vertical-align:middle" src="../../App_Images/HTMLEditor.customButtons/ed_insertIcon_n.gif" />.<br />
    How to add custom buttons, take a look at <span style="color: #3300cc">'App_Code'</span>, <span style="color: #3300cc">'App_Scripts'</span>
    and <span style="color: #3300cc">'App_Images'</span> folders of the application.
    <br />
    <br />
    <form id="form1" runat="server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
    <asp:UpdatePanel ID="updatePanel1" runat="server">
    <ContentTemplate>
        <customEditors:EditorWithCustomButtons_1 runat="server" id="editor" Height="400px" Width="100%" />
        <asp:Button runat="server" Text="Submit content" ID="submit" />
    </ContentTemplate>
    </asp:UpdatePanel>
    </form>
</body>
</html>
