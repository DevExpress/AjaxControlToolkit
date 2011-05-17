<%@ Page Language="C#" Trace="false" CodeFile="Tabs.aspx.cs" ValidateRequest="false"  Inherits="HTMLEditor.TabsExample" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit.HTMLEditor"
    TagPrefix="HTMLEditor" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head runat="server" >
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
<script type="text/JavaScript">
    function getContent1() {
        alert($find("<%= editor1.ClientID %>").get_content());
        return false;
    }
    function getContent2() {
        alert($find("<%= editor2.ClientID %>").get_content());
        return false;
    }
    function setContent1() {
        $find("<%= editor1.ClientID %>").set_content("content #1 content #1 content #1 content #1 content #1 content #1");
        return false;
    }
    function setContent2() {
        $find("<%= editor2.ClientID %>").set_content("content #2 content #2 content #2 content #2 content #2 content #2");
        return false;
    }
</script>
<body style="font:12px Verdana;">
    <a href="../HTMLEditor.aspx">< Back to <strong>HTMLEditor</strong> page</a>
    <br /><br />
    <b>HTMLEditor</b> controls inside <b>Tabs</b> control.<br />
    <br />
    <form runat="server">
        <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
        <script type="text/javascript">
        </script>
        <ajaxToolkit:TabContainer runat="server" ID="Tabs" Height="400px" ActiveTabIndex="0" Width="402px">
            <ajaxToolkit:TabPanel runat="server" ID="Panel1" HeaderText="HTMLEditor 1">
                <ContentTemplate>
                    <asp:UpdatePanel ID="updatePanel1" runat="server">
                        <ContentTemplate>
                           <HTMLEditor:Editor runat="server" id="editor1" Height="350px" AutoFocus="true" />
                           <br />
                           <asp:Button runat="server" Text="Submit content" />
                        </ContentTemplate>
                    </asp:UpdatePanel>
                </ContentTemplate>
            </ajaxToolkit:TabPanel>
            
            <ajaxToolkit:TabPanel runat="server" ID="Panel2" HeaderText="HTMLEditor 2" >
                <ContentTemplate>
                    <asp:UpdatePanel ID="updatePanel2" runat="server">
                        <ContentTemplate>
                           <HTMLEditor:Editor runat="server" id="editor2" Height="350px" AutoFocus="true" />
                           <br />
                           <asp:Button runat="server" Text="Submit content" />
                        </ContentTemplate>
                    </asp:UpdatePanel>
                </ContentTemplate>
            </ajaxToolkit:TabPanel>
        </ajaxToolkit:TabContainer>
    </form>
</body>
</html>
