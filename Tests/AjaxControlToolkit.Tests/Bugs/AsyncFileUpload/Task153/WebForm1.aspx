<%@ Page Title="" Language="C#" MasterPageFile="~/Bugs/AsyncFileUpload/Task153/Site1.Master"
    AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.AsyncFileUpload.Task153.WebForm1" %>

<%@ Register src="AFU.ascx" tagname="AFU" tagprefix="uc1" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
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

 <script type="text/javascript">
     function fillCell(row, cellNumber, text) {
         var cell = row.insertCell(cellNumber);
         cell.innerHTML = text;
         cell.style.borderBottom = cell.style.borderRight = "solid 1px #aaaaff";
     }
     function addToClientTable(name, text) {
         var table = document.getElementById("<%= clientSide.ClientID %>");
         var row = table.insertRow(0);
         fillCell(row, 0, name);
         fillCell(row, 1, text);
     }

     function uploadError(sender, args) {
         addToClientTable(args.get_fileName(), "<span style='color:red;'>" + args.get_errorMessage() + "</span>");
     }
     function uploadComplete(sender, args) {
         var contentType = args.get_contentType();
         var text = args.get_length() + " bytes";
         if (contentType.length > 0) {
             text += ", '" + contentType + "'";
         }
         addToClientTable(args.get_fileName(), text);
     }

     function openFileOption() {
         //document.getElementById('ctl00_MainContent_AsyncFileUpload1_ctl02').click();
     }
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <act:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
    </act:ToolkitScriptManager>
    <act:ModalPopupExtender ID="ModalPopupExtender1" runat="server" TargetControlID="lnkPopup"
        PopupControlID="panEdit" BackgroundCssClass="modalBackground" CancelControlID="btnCancel"
        PopupDragHandleControlID="panEdit" >
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
                   <uc1:AFU ID="AFU1" runat="server" />
                    <table style="border-collapse: collapse; border-left: solid 1px #aaaaff; border-top: solid 1px #aaaaff;" runat="server" cellpadding="3" id="clientSide" />
                </td>
            </tr>
        </table>
        <br />
        <asp:Button ID="Button1" runat="server" Text="Update" />
        <asp:Button ID="btnCancel" runat="server" Text="Cancel" />
    </asp:Panel>
    <a id="lnkPopup" runat="server" href="#">Show Popup</a>
    
</asp:Content>
