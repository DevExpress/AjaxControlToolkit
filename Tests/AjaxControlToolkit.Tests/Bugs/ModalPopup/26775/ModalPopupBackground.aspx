<%@ Page Language="C#" AutoEventWireup="true"
    Inherits="ModalPopupBackground" Codebehind="ModalPopupBackground.aspx.cs" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link href="StyleSheet.css" rel="stylesheet" type="text/css" />
    
    <script type="text/javascript">
        function AddText() {
            var newText = "";

            for (var i = 0; i < 100; i++)
            {
                newText += "<span> Hello World </span>";
            }

            $get("Paragraph1").innerHTML += newText;
        }

        function onOk() { 
        
        }
    </script>

</head>
<body>
    <form id="form1" runat="server">
    <ajaxToolkit:ToolkitScriptManager ID="mgr1" runat="server">
            </ajaxToolkit:ToolkitScriptManager>
    <div>
        <input type="button" id="button1" value="Add Text" onclick="AddText();" />
        <p id="Paragraph1">
        
        Some message
        Some message
        Some message
        </p><br />
        <asp:LinkButton ID="LinkButton1" runat="server" Text="Open ModalPopup" />
        <br />
        <br />
        <asp:Panel ID="Panel1" runat="server" Style="display: none" CssClass="modalPopup">
            <asp:Panel ID="Panel3" runat="server" Style="cursor: move; background-color: #DDDDDD;
                border: solid 1px Gray; color: Black">
            </asp:Panel>
            <div>
                some text
                <p style="text-align: center;">
                    <asp:Button ID="OkButton" runat="server" Text="OK" />
                    <asp:Button ID="CancelButton" runat="server" Text="Cancel" />
                </p>
            </div>
        </asp:Panel>
        <ajaxToolkit:ModalPopupExtender ID="ModalPopupExtender" runat="server" TargetControlID="LinkButton1"
            PopupControlID="Panel1" BackgroundCssClass="modalBackground" OkControlID="OkButton"
            OnOkScript="onOk()" CancelControlID="CancelButton" DropShadow="true" PopupDragHandleControlID="Panel3" />
    </div>
    </form>
</body>
</html>
