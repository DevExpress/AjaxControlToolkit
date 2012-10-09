<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AnimateMe2.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.ModalPopup._6944.AnimateMe2" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>

    <style type="text/css"> 
    
        .popup {
            background-color: Gray;
            border: solid 1px black;
            width:400px;
            padding:10px;   
        }
    
        .modalBackground {
	        background-color:Gray;
	        filter:alpha(opacity=70);
	        opacity:0.7;
        }

    
    
    </style>

</head>
<body>
    <form id="form1" runat="server">
    <div>
    

    <act:ToolkitScriptManager runat="server" />

    <asp:Panel ID="panel1" CssClass="popup" runat="server">
        <asp:Panel ID="pnlDrag" runat="server">
            Drag This!
        </asp:Panel>
        When in the course of human events.

        <br />
        <asp:Button ID="btnOk" Text="Close" runat="server" />

    </asp:Panel>

    <act:ModalPopupExtender ID="mpe" TargetControlID="btn" 
    PopupDragHandleControlID="pnlDrag" OkControlID="btnOk"
    PopupControlID="panel1" BackgroundCssClass="modalBackground" runat="server">
    <Animations>
        <OnShown>
            <Fadein />
        </OnShown>
        <OnHiding>
            <Fadeout />
        </OnHiding>
    </Animations>
    </act:ModalPopupExtender>


    <asp:Button ID="btn" Text="Show Popup" runat="server" />

    </div>
    </form>
</body>
</html>
