<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.AsyncFileUpload._26737.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <act:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
        </act:ToolkitScriptManager>
        <asp:UpdatePanel ID="UpdatePanel1" runat="server">
            <ContentTemplate>
                <act:AsyncFileUpload ID="AsyncFileUpload1" runat="server" OnUploadedComplete="AsyncFileUpload1_UploadedComplete"
                    OnUploadedFileError="AsyncFileUpload1_UploadedFileError" />
                <asp:Button ID="Button1" runat="server" OnClick="Button1_Click" 
                    Text="Create viewstate variable" />
                <asp:Button ID="Button2" runat="server" OnClick="Button2_Click" 
                    Text="Show viewState variable" />
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
    </form>
</body>
</html>
