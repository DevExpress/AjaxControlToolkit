<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.AsyncFileUpload._26761.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    
    <act:ToolkitScriptManager ID="sm1" runat="server" />

    <act:AsyncFileUpload ID="async1" runat="server" />

    <asp:Label runat="server" Text="&nbsp;" ID="lblUploadResult" />


    </div>
    </form>
</body>
</html>
