<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Page.aspx.cs" Inherits="AjaxControlToolkit.Tests.Bugs.ModalPopup._26909.Page" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>


<%@ Register src="LandingUserControl.ascx" tagname="LandingUserControl" tagprefix="uc1" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" ID="ScriptManager1" />    
    <div>
        
        <asp:UpdatePanel ID="OutterPanel" runat="server" UpdateMode="Always">
            <ContentTemplate>
                <input type="hidden" id="btnDummy" runat="server" />
                <input type="button" id="btnOpen" value="Open Popup" runat="server" />
                <ajaxToolkit:ModalPopupExtender id="LandingModalPopupExtender" runat="server" popupcontrolid="landingDiv"
                    targetcontrolid="btnOpen" backgroundcssclass="modalBackground" />
                <asp:Panel runat="server" ID="landingDiv" CssClass="" Style="position: absolute;
                    top: 1500px; left: 100px; display: none;">
                    <asp:LinkButton ID="btnClosePopup" Text="close" runat="server" CssClass="btnClosePopup"
                        CausesValidation="False" OnClick="btnClosePopup_Click" />
                    <uc1:LandingUserControl ID="LandingUserControl1" runat="server" />                
                </asp:Panel>
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
    
    </form>
</body>
</html>
