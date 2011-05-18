<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.AsyncFileUpload._26128.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    <act:ToolkitScriptManager runat="server" />

    <asp:UpdatePanel runat="server">
    <ContentTemplate>
    
    
        <act:AsyncFileUpload ID="AsyncFileUpload1" runat="server" />

        <br /><br />

        <asp:Button ID="Button1" Text="Upload" runat="server" />


    </ContentTemplate>    
    </asp:UpdatePanel>


    </div>
    </form>
</body>
</html>
