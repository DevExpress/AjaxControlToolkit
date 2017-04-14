<%@ Page Title="ConfirmButton Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="ConfirmButton.aspx.cs" Inherits="ConfirmButton_ConfirmButton" %>

<asp:Content ID="Content1" ContentPlaceHolderID="DemoHeading" runat="Server">
    ConfirmButton Demonstration
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="DemoContent" runat="Server">
    <script type='text/javascript'>
        function cancelClick() {
            var label = $get('Content_DemoContent_Button');
            label.innerHTML = 'You hit cancel in the Confirm dialog on ' + (new Date()).localeFormat("T") + '.';
        }
    </script>
    <asp:UpdatePanel ID="UpdatePanel1" runat="server">
        <ContentTemplate>

            <asp:LinkButton ID="LinkButton" runat="server" OnClick="Button_Click">Click Me</asp:LinkButton>
            <ajaxToolkit:ConfirmButtonExtender ID="ConfirmButtonExtender1" runat="server"
                TargetControlID="LinkButton"
                ConfirmText="Are you sure you want to click the LinkButton?"
                OnClientCancel="cancelClick" />
            <br />
            <br />
            <asp:Button ID="Button" runat="server" Text="Click Me" OnClick="Button_Click" /><br />
            <ajaxToolkit:ConfirmButtonExtender ID="ConfirmButtonExtender2" runat="server"
                TargetControlID="Button"
                OnClientCancel="cancelClick"
                DisplayModalPopupID="ModalPopupExtender1" />
            <br />
            <ajaxToolkit:ModalPopupExtender ID="ModalPopupExtender1" runat="server" TargetControlID="Button" PopupControlID="PNL" OkControlID="ButtonOk" CancelControlID="ButtonCancel" BackgroundCssClass="modalBackground" />
            <asp:Panel ID="PNL" runat="server" Style="display: none; width: 200px; background-color: White; border-width: 2px; border-color: Black; border-style: solid; padding: 20px;">
                Are you sure you want to click the Button?
                        <br />
                <br />
                <div style="text-align: right;">
                    <asp:Button ID="ButtonOk" runat="server" Text="OK" />
                    <asp:Button ID="ButtonCancel" runat="server" Text="Cancel" />
                </div>
            </asp:Panel>

            <asp:Label ID="Label1" runat="server" />
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>ConfirmButton Description</Header>
        <Content>
            <div runat="server" data-control-type="ConfirmButtonExtender" data-content-type="description" />
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>ConfirmButton Properties</Header>
        <Content>
            <div runat="server" data-control-type="ConfirmButtonExtender" data-content-type="members" />
        </Content>
    </samples:InfoBlock>
</asp:Content>

