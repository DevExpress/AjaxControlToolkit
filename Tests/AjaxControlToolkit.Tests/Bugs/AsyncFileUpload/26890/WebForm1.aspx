<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.AsyncFileUpload._26890.WebForm1" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
        <style type="text/css">
.modalBackground
{
  background-color:#CCCCFF;
  filter:alpha(opacity=40);
  opacity:0.5;
}
 
 
 
.ModalWindow
{
  border: solid1px#c0c0c0;
  background-color:Gray;
  padding: 0px10px10px10px;
  position:absolute;
  top:-1000px;
}
 
</style>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <act:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
        </act:ToolkitScriptManager>
        <act:ModalPopupExtender ID="ModalPopupExtender1" runat="server" TargetControlID="lnkPopup"
        PopupControlID="panEdit" BackgroundCssClass="modalBackground" CancelControlID="btnCancel"
        PopupDragHandleControlID="panEdit" Enabled="true">
    </act:ModalPopupExtender>
    <asp:Panel ID="panEdit" runat="server" Height="180px" Width="500px" CssClass="ModalWindow">
        <h1>
            File</h1>
        <table width="100%">
            <tr>
                <td class="formtext"  align="left">
                   Upload
                </td>
                <td>
                  
                </td>
            </tr>
        </table>
        <br />
        <asp:Button ID="Button1" runat="server" Text="Update" />
        <asp:Button ID="btnCancel" runat="server" Text="Cancel" />
    </asp:Panel>
    <a id="lnkPopup" runat="server" href="#">Show Popup</a>
    </div>
    </form>
</body>
</html>
