<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ModalupPopupWithUpdatePanel.aspx.cs" Inherits="AjaxTestWebSite.ModalupPopupWithUpdatePanel" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>


<%@ Register src="LandingUserControl.ascx" tagname="LandingUserControl" tagprefix="uc1" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <ajaxToolkit:ToolkitScriptManager ID="ToolkitScriptManager1" runat="server">
    </ajaxToolkit:ToolkitScriptManager>

    <div style="width: 300px; left: 100px">
            <div style="background-color: White">
                <asp:Label ID="Label3" runat="server">Modal Popup with UpdatePanel inside PopupPanel</asp:Label>
                <asp:Button runat="server" ID="button4" Text="Launch Modal Popup1" />
                <asp:Panel runat="server" ID="modalPanel3" BackColor="LemonChiffon" Style="display: none">
                    <asp:UpdatePanel runat="server" ID="updatePanel3">
                        <ContentTemplate>
                            <uc1:LandingUserControl ID="LandingUserControl1" runat="server" />
                            <asp:Label runat="server" ID="label4" Text="Label in UpdatePanel"></asp:Label>
                            <asp:Button runat="server" ID="Button5" Text="Click to Cause postback" OnClick="Button5_Click" />
                        </ContentTemplate>
                    </asp:UpdatePanel>
                    <asp:Button runat="server" ID="Button6" Text="OK" />
                    <asp:LinkButton runat="server" ID="LinkButton1" Text="Cancel" />
                </asp:Panel>
                <ajaxToolkit:ModalPopupExtender runat="server" ID="modalPopupExtender3" TargetControlID="button4"
                    PopupControlID="modalPanel3" OkControlID="Button6" CancelControlID="LinkButton1"
                    BackgroundCssClass="modalBackground">
                </ajaxToolkit:ModalPopupExtender>
                
            </div>
            <br />
            <div style="background-color: Gray">
                <asp:Label ID="Label7" runat="server">Update Panel that contains a ModalPopup and its associated PopupPanel inside it</asp:Label>
                <asp:UpdatePanel runat="server" ID="updatePanel2" UpdateMode="Conditional" ChildrenAsTriggers="true">
                    <ContentTemplate>
                        <asp:Button runat="server" ID="button2" Text="Launch Modal Popup2" />
                        <asp:Panel runat="server" ID="modalPanel2" BackColor="AliceBlue" Style="display: none">
                            <asp:Label runat="server" ID="label5" Text="Label in UpdatePanel"></asp:Label>
                            <asp:Button runat="server" ID="postbackBtn" Text="Click to Cause postback" OnClick="postbackBtn_Click" /><br />
                            <asp:Button runat="server" ID="cancelBtn2" Text="OK" />
                            <asp:LinkButton runat="server" ID="okBtn2" Text="Cancel" />
                        </asp:Panel>
                        <ajaxToolkit:ModalPopupExtender runat="server" ID="modalPopupExtender2" TargetControlID="button2"
                            PopupControlID="modalPanel2" OkControlID="okBtn2" CancelControlID="cancelBtn2"
                            BackgroundCssClass="modalBackground">
                        </ajaxToolkit:ModalPopupExtender>
                    </ContentTemplate>
                </asp:UpdatePanel>
            </div>
            <br />
            <div style="background-color: White">
                <asp:Label ID="Label1" runat="server">Update Panel that contains a ModalPopup; its PopupPanel has an UpdatePanel inside it </asp:Label>
                <asp:UpdatePanel runat="server" ID="outerUpdatePanel" UpdateMode="Conditional" ChildrenAsTriggers="false">
                   <%-- <Triggers>
                        <asp:AsyncPostBackTrigger ControlID="outerPanelTrigger" />
                    </Triggers>--%>
                    <ContentTemplate>
                        <%--<asp:Button runat="server" ID="outerPanelTrigger" Text="OuterPanelTrigger" />--%><br />
                        <br />
                        <asp:Button runat="server" ID="button1" Text="Launch Modal Popup3" />
                        <asp:Panel runat="server" ID="modalPanel1" BackColor="Pink" Style="display: none">
                            <asp:UpdatePanel runat="server" ID="updatePanel1" ChildrenAsTriggers="true" UpdateMode="Conditional">
                                <ContentTemplate>
                                    <asp:Label runat="server" ID="label2" Text="Label in UpdatePanel"></asp:Label>
                                    <asp:Button runat="server" ID="updateLabel" OnClick="updateLabel_Click" Text="Click to Cause postback" />
                                </ContentTemplate>
                            </asp:UpdatePanel>
                            <asp:Button runat="server" ID="okBtn" Text="OK" />
                            <asp:LinkButton runat="server" ID="cancelBtn" Text="Cancel" />
                        </asp:Panel>

                        <ajaxToolkit:ModalPopupExtender runat="server" ID="modalPopupExtender1" TargetControlID="button1"
                            PopupControlID="modalPanel1" OkControlID="okBtn" CancelControlID="cancelBtn"
                            BackgroundCssClass="modalBackground">
                        </ajaxToolkit:ModalPopupExtender>
                    </ContentTemplate>
                </asp:UpdatePanel>
                <br />
                <br />
            </div>
        </div>
    </form>
</body>
</html>
