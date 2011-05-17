<%@ Page Language="C#" AutoEventWireup="true" CodeFile="AnotherStyle.aspx.cs" Inherits="test" %>
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
    <style type="text/css">
           .myStyle .ajax__htmleditor_editor_container
           {
                   border: 1px solid #C2C2C2;
           }
           .myStyle .ajax__htmleditor_editor_toptoolbar
           {
                   background-color:#FFFFFF; padding: 0px 0px 2px 2px; background-image:url(images/ed_bar_bg.gif);background-repeat:repeat-x;
           }
           .myStyle .ajax__htmleditor_editor_toptoolbar .ajax__htmleditor_toolbar_button
           {
                   background-color:#C2C2C2; margin:2px 0px 0px 0px;
           }
           .myStyle .ajax__htmleditor_editor_toptoolbar .ajax__htmleditor_toolbar_button_hover
           {
                   background-color:#8000FF;
           }
           .myStyle .ajax__htmleditor_editor_toptoolbar div.ajax__htmleditor_toolbar_button label
           {
               font-family:Arial; font-size:12px; font-weight:bold;
           }
           .myStyle .ajax__htmleditor_editor_toptoolbar div.ajax__htmleditor_toolbar_button select
           {
               font-size:12px; font-family:arial; cursor:pointer;
           }
           .myStyle .ajax__htmleditor_editor_toptoolbar div.ajax__htmleditor_toolbar_button select option
           {
               font-size:12px;
           }
           .myStyle .ajax__htmleditor_editor_editpanel
           {
                   border-width: 0px;
                   border-top: 1px solid #C2C2C2;
                   border-bottom: 1px solid #C2C2C2;
           }
           .myStyle .ajax__htmleditor_editor_bottomtoolbar
           {
                   background-color:#F0F0F0; padding: 0px 2px 2px 0px;
                   background-image:url(images/ed_frame_light_bg.gif);
           }
           .myStyle .ajax__htmleditor_editor_bottomtoolbar .ajax__htmleditor_toolbar_button
           {
                   background-color:#C2C2C2; margin:0px 0px 0px 2px; float: right;
           }
           .myStyle .ajax__htmleditor_editor_bottomtoolbar .ajax__htmleditor_toolbar_button_hover
           {
                   background-color:#8000FF;
           }
    </style>
</head>
<body style="font:12px Verdana;">
    <a href="../HTMLEditor.aspx">< Back to <strong>HTMLEditor</strong> page</a>
    <br /><br />
    This sample demonstrates a custom skin for the editor control.<br />
    Bottom toolbar buttons are also positioned to the right.<br /> 
    <br />
    <form id="form1" runat="server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
    <asp:UpdatePanel ID="updatePanel1" runat="server">
    <ContentTemplate>
        <customEditors:FullWithRightBottom runat="server" id="editor" Height="400px" Width="730px" CssClass="myStyle" />
        <asp:Button runat="server" Text="Submit content" ID="submit" />
    </ContentTemplate>
    </asp:UpdatePanel>
    </form>
</body>
</html>
