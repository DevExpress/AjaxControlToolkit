<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.HtmlEditorExtender._27028.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <act:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
    </act:ToolkitScriptManager>
    <div>
        <asp:TextBox ID="txtBox1" runat="server" TextMode="MultiLine" Rows="10" Columns="75"></asp:TextBox>
        <act:HtmlEditorExtender ID="Html_MainDesc" runat="server" TargetControlID="txtBox1">
            <Toolbar>
                <act:Bold />
                <act:Italic />
                <act:Underline />
                <act:HorizontalSeparator />
                <act:JustifyLeft />
                <act:JustifyCenter />
                <act:JustifyRight />
                <act:JustifyFull />
                <act:CreateLink />
                <act:UnLink />                
            </Toolbar>
        </act:HtmlEditorExtender>
        <br />
        <asp:Button ID="btnSubmit" runat="server" Text="Submit" />
    </div>
    </form>
</body>
</html>
