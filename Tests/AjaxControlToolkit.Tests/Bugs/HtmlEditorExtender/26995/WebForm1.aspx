<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.HtmlEditorExtender.WebForm1" %>

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
        <asp:LinkButton ID="LinkButton1" runat="server" Text="Click here to change the paragraph style" />
        <asp:Panel ID="Panel1" runat="server" Style="display: none" >            
            <div>
                <asp:TextBox runat="server" ID="txtBox1" TextMode="MultiLine" Columns="50" Rows="10"    
                    Text="Hello <b>world!</b>" /><br />
                <act:HtmlEditorExtender ID="htmlEditorExtender1" TargetControlID="txtBox1"
                    runat="server">
                </act:HtmlEditorExtender>
                <p style="text-align: center;">                    
                    <asp:Button ID="CancelButton" runat="server" Text="Cancel" />
                </p>
            </div>
        </asp:Panel>
        <act:ModalPopupExtender ID="ModalPopupExtender" runat="server" TargetControlID="LinkButton1"
            PopupControlID="Panel1"  
            OnOkScript="onOk()" CancelControlID="CancelButton" DropShadow="true" PopupDragHandleControlID="Panel3" />
        <br />
        <br />
    </div>
    </form>
</body>
</html>
