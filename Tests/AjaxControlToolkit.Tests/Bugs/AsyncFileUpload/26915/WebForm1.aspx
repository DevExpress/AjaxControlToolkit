<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.AsyncFileUpload._26915.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    <asp:TextBox ID="txtFirstName" runat="server" />
    
    <asp:CustomValidator ID="val" ValidateEmptyText="true" ControlToValidate="txtFirstName" ErrorMessage="Bad!" runat="server" />

    <act:ToolkitScriptManager ID="sm1" runat="server" />

    <act:AsyncFileUpload ID="async1" runat="server" />

    <asp:Button ID="btn" Text="Go!" runat="server" />


    </div>
    </form>
</body>
</html>
