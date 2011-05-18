<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.ModalPopup._26808.WebForm1" %>

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
        PopupControlID="Panel2" BackgroundCssClass="modalBackground" CancelControlID="btnCancel"
        PopupDragHandleControlID="Panel2">
    </act:ModalPopupExtender>
      <asp:Panel ID="Panel2" runat="server" Width="400px" Height="300px" CssClass="ModalWindow">
        
        <act:ColorPickerExtender ID="ColorPickerExtender1" runat="server" TargetControlID="TextBox1"
            PopupButtonID="btnColors" SampleControlID="Panel1">
        </act:ColorPickerExtender>
        <asp:TextBox ID="TextBox1" runat="server"></asp:TextBox>
        <asp:Panel ID="Panel1" runat="server" Width="200px" Height="200px">
        </asp:Panel>
        <asp:Button ID="btnColors" runat="server" Text="Pick color" />
         <asp:Button ID="btnCancel" runat="server" Text="Cancel" />
        </asp:Panel>

        <a id="lnkPopup" runat="server" href="#"> Show Popup</a>
    </div>
    </form>
</body>
</html>
