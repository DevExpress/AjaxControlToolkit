<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.AsyncFileUpload._26731.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    <act:ToolkitScriptManager runat="server" />
    <act:AsyncFileUpload ID="AsyncFileUpload" Width="400px" runat="server" 
Enabled="false"
CompleteBackColor="Lime"
UploaderStyle="Modern" 
ErrorBackColor="Red"
ThrobberID="LabelThrobber" 
UploadingBackColor="#66CCFF" />

    </div>
    </form>
</body>
</html>
