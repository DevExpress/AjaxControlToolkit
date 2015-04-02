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
            <p>
                ConfirmButton is a simple extender that catches clicks on a button (or any instance of a type 
                derived from Button) and displays a message to the user. If the "OK" button is clicked, the 
                button or link functions normally. If not, the click is trapped and the button will not perform 
                its default submit behavior; optionally, a client script is executed if the OnClientCancel property 
                is set. This is useful for delete links or anything else that requires confirmation from the user.
            </p>
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>ConfirmButton Properties</Header>
        <Content>
            <p>
                The control above is initialized with this code. The <em>italic</em> properties
            are optional:
            </p>
            <pre>
&lt;ajaxToolkit:ConfirmButtonExtender ID="cbe" runat="server"
    TargetControlID="LinkButton1"
    ConfirmText="Are you sure you want to click this?"
    <em>OnClientCancel</em>="CancelClick" /&gt;
            </pre>
            <ul>
                <li><strong>TargetControlID</strong> - The ID of the button or link for this extender to operate on.</li>
                <li><strong>ConfirmText</strong> - The text to show when you want to confirm the click. (Note: HTML entities can be used here (ex: "&amp;#10;" for new-line))</li>
                <li><strong>OnClientCancel</strong> - The client-side script that executes when the cancel button is clicked in the confirm dialog.</li>
                <li><strong>ConfirmOnFormSubmit</strong> - True if the confirm dialog should wait until just before the form submits to display. This is useful when ASP.NET validators are in use and the confirm should be shown only after all validators pass.</li>
                <li><strong>DisplayModalPopupID</strong> - Optionally specifies the ID of a ModalPopup control to use for displaying the confirmation dialog (instead of window.confirm). When using DisplayModalPopupID, the following conditions must be met:
                <ul>
                    <li>The ModalPopup must be configured to work against the same TargetControlID as the ConfirmButton (and should work properly if the ConfirmButton is disabled).</li>
                    <li>The ModalPopup must specify OkControlID and/or CancelControlID to identify the buttons corresponding to window.confirm's OK/Cancel buttons.</li>
                    <li>The ModalPopup must not specify OnOkScript or OnCancelScript.</li>
                </ul>
                </li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>

