<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="LandingUserControl.ascx.cs"
    Inherits="AjaxControlToolkit.Tests.Bugs.ModalPopup._26909.LandingUserControl" %>

<asp:UpdatePanel ID="UpdatePanel1" runat="server" UpdateMode="Conditional">
    <Triggers>
        <asp:AsyncPostBackTrigger ControlID="btnRegistNext" EventName="Click" />
    </Triggers>
    <ContentTemplate>
        <div>
            Some nested divs
            <div>
                <asp:Label ID="labelInUserControl" runat="server" Text="Some text & some controls."></asp:Label>                
                <asp:LinkButton ID="btnRegistNext" runat="server" Text="NEXT" CssClass="btn-purple ActionLink"
                    ValidationGroup="Register" TabIndex="25" OnClick="btnRegistNext_Click" />
            </div>
        </div>
    </ContentTemplate>
</asp:UpdatePanel>
