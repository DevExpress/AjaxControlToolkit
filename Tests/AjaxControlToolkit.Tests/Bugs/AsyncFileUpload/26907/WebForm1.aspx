<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.AsyncFileUpload._26907.WebForm1" %>

<%@ Register src="WebUserControl1.ascx" tagname="WebUserControl1" tagprefix="uc1" %>

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
        <act:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server" CombineScripts="true">
        </act:ToolkitScriptManager>
        <act:ModalPopupExtender ID="ModalPopupExtender1" runat="server" TargetControlID="showPopup" PopupControlID="pnPopup" CancelControlID="btnCancel" BackgroundCssClass="modalBackground" >
        </act:ModalPopupExtender>
        <asp:Panel ID="pnPopup" runat="server" CssClass="ModalWindow">
            <p>
                This is page
                <uc1:WebUserControl1 ID="WebUserControl11" runat="server" />
                <asp:Button ID="btnOK" runat="server" Text="Ok" />
                <asp:Button ID="btnCancel" runat="server" Text="Cancel" />
            </p>
        </asp:Panel>

        <a id="showPopup" runat="server" href="#"> Show Popup</a>
    </div>
    </form>
</body>
</html>
