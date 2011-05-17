<%@ Page Language="C#" AutoEventWireup="true" CodeFile="FullScreen.aspx.cs" Inherits="test" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit.HTMLEditor"
    TagPrefix="HTMLEditor" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html style="height:100%">
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
<script type="text/javascript">
    function pageLoad() {
        if (Sys.Browser.agent == Sys.Browser.InternetExplorer ||
            Sys.Browser.agent == Sys.Browser.Firefox ||
            Sys.Browser.agent == Sys.Browser.Opera ||
            Sys.Browser.agent == Sys.Browser.Safari) {
            changeEditorHeight();
        } else {
            window.setTimeout(changeEditorHeight, 250);
        }
    }
    function changeEditorHeight(ev) {
        document.getElementById("<%= editor.ClientID %>").style.height = document.getElementById("container").offsetHeight
             - document.getElementById("header").offsetHeight
             - document.getElementById("<%= submit.ClientID %>").offsetHeight
             - parseInt(document.body.style.margin) * 2
             - (document.all ? 5 : 0)
             + "px";
        if (typeof ev != "undefined" && (Sys.Browser.agent == Sys.Browser.InternetExplorer && document.compatMode != "BackCompat" && Sys.Browser.version == 8 || Sys.Browser.agent == Sys.Browser.Opera)) {
            var editorControl = $find("<%= editor.ClientID %>");
            if (editorControl != null) {
                editorControl._onresize();
            }
        }
    }
</script>
<body style="font:12px Verdana; height:100%; margin:2px; overflow:hidden;" scroll="no" onresize="changeEditorHeight(event);">
    <div id="container" style="height:100%;">
    <div id="header" >
    <a href="../HTMLEditor.aspx">< Back to <strong>HTMLEditor</strong> page</a>
    <br /><br />
    </div>
    <form id="form1" runat="server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
    <asp:UpdatePanel ID="updatePanel1" runat="server">
    <ContentTemplate>
        <HTMLEditor:Editor runat="server" id="editor" Width="100%" Height="100%" />
        <asp:Button runat="server" Text="Submit content" ID="submit" />
    </ContentTemplate>
    </asp:UpdatePanel>
    </form>
    </div>
</body>
</html>
