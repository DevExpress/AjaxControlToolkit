<%@ Page Title="ModalPopup Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="ModalPopup.aspx.cs" Inherits="ModalPopup_ModalPopup" %>

<asp:Content ID="Content1" ContentPlaceHolderID="DemoHeading" runat="Server">
    ModalPopup Demonstration
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="DemoContent" runat="Server">
    <script type="text/javascript">
        var styleToSelect;
        function onOk() {
            $get('Paragraph1').className = styleToSelect;
        }

        // Add click handlers for buttons to show and hide modal popup on pageLoad
        function pageLoad() {
            $addHandler($get("showModalPopupClientButton"), 'click', showModalPopupViaClient);
            $addHandler($get("hideModalPopupViaClientButton"), 'click', hideModalPopupViaClient);
        }

        function showModalPopupViaClient(ev) {
            ev.preventDefault();
            var modalPopupBehavior = $find('programmaticModalPopupBehavior');
            modalPopupBehavior.show();
        }

        function hideModalPopupViaClient(ev) {
            ev.preventDefault();
            var modalPopupBehavior = $find('programmaticModalPopupBehavior');
            modalPopupBehavior.hide();
        }
    </script>

    <p id="Paragraph1">
        <%= DemoData.ContentFillerText %>
    </p>
    <br />
    <asp:LinkButton ID="LinkButton1" runat="server" Text="Click here to change the paragraph style" />
    <asp:Panel ID="Panel1" runat="server" Style="display: none" CssClass="modalPopup">
        <asp:Panel ID="Panel3" runat="server" Style="cursor: move; background-color: #DDDDDD; border: solid 1px Gray; color: Black">
            <div>
                <p>
                    Choose the paragraph style you would like:
                </p>
            </div>
        </asp:Panel>
        <div>
            <p>
                <input type="radio" name="Radio" id="RadioA" checked="checked" onclick="styleToSelect = 'sampleStyleA';" />
                <label for="RadioA" class="sampleStyleA" style="padding: 3px;">
                    Sample paragraph text</label>
            </p>
            <p>
                <input type="radio" name="Radio" id="RadioB" onclick="styleToSelect = 'sampleStyleB';" />
                <label for="RadioB" class="sampleStyleB" style="padding: 3px;">
                    Sample paragraph text</label>
            </p>
            <p>
                <input type="radio" name="Radio" id="RadioC" onclick="styleToSelect = 'sampleStyleC';" />
                <label for="RadioC" class="sampleStyleC" style="padding: 3px;">
                    Sample paragraph text</label>
            </p>
            <p>
                <input type="radio" name="Radio" id="RadioD" onclick="styleToSelect = 'sampleStyleD';" />
                <label for="RadioD" class="sampleStyleD" style="padding: 3px;">
                    Sample paragraph text</label>
            </p>
            <p style="text-align: center;">
                <asp:Button ID="OkButton" runat="server" Text="OK" />
                <asp:Button ID="CancelButton" runat="server" Text="Cancel" />
            </p>
        </div>
    </asp:Panel>
    <ajaxToolkit:ModalPopupExtender ID="ModalPopupExtender" runat="server" TargetControlID="LinkButton1"
        PopupControlID="Panel1" BackgroundCssClass="modalBackground" OkControlID="OkButton"
        OnOkScript="onOk()" CancelControlID="CancelButton" DropShadow="true" PopupDragHandleControlID="Panel3" />
    <br />
    <br />
    <hr />
    <br />
    This ModalPopup will be spawned programmatically. The ModalPopupExtender that this
        popup is attached to has a hidden TargetControl. The popup can be
        <asp:LinkButton runat="server" ID="showModalPopupServerOperatorButton" Text="shown via server in code behind"
            OnClick="showModalPopupServerOperatorButton_Click" />
    and <a id="showModalPopupClientButton" href="#">on the client in script</a> by calling
        the ModalPopupExtender methods to show and hide.<br />
    <asp:Button runat="server" ID="hiddenTargetControlForModalPopup" Style="display: none" />
    <ajaxToolkit:ModalPopupExtender runat="server" ID="programmaticModalPopup" BehaviorID="programmaticModalPopupBehavior"
        TargetControlID="hiddenTargetControlForModalPopup" PopupControlID="programmaticPopup"
        BackgroundCssClass="modalBackground" DropShadow="True" PopupDragHandleControlID="programmaticPopupDragHandle"
        RepositionMode="RepositionOnWindowScroll">
    </ajaxToolkit:ModalPopupExtender>
    <asp:Panel runat="server" CssClass="modalPopup" ID="programmaticPopup" Style="display: none; width: 350px; padding: 10px">
        <asp:Panel runat="Server" ID="programmaticPopupDragHandle" Style="cursor: move; background-color: #DDDDDD; border: solid 1px Gray; color: Black; text-align: center;">
            ModalPopup shown and hidden in code
        </asp:Panel>
        You can now use this sample to see how to use ModalPopup with an invisible TargetControl.
            The ModalPopupExtender this popup is attached to has a hidden target control. The
            popup is hidden
            <asp:LinkButton runat="server" ID="hideModalPopupViaServer" Text="on the server side in code behind"
                OnClick="hideModalPopupViaServer_Click" />
        and <a id="hideModalPopupViaClientButton" href="#">on the client in script</a>.
    </asp:Panel>
    <br />
    <hr />
    <br />
    The ModalPopup supports 4 animation events that allow you to spice up its showing
        and hiding with visual effects.
        <asp:LinkButton ID="OpenButton" runat="server" Text="Open an animated modal popup" />
    <asp:Panel ID="AnimatedModalPopupPanel" runat="server" BorderStyle="Solid" Height="20"
        Style="display: none" Width="100" CssClass="modalPopup">
        <table style="height: 100%; width: 100%">
            <tr>
                <td style="text-align: left; vertical-align: top" valign="top">The animation can be applied to the main target, the PopupControlID, or to any other
                        target, e.g the Close button.
                        <br />
                    You can animate the closing of the popup also. Click the Close Button to see this.
                </td>
            </tr>
            <tr>
                <td style="text-align: center; vertical-align: bottom" valign="bottom">
                    <asp:Button ID="CloseButton" runat="server" Text="Close" />
                </td>
            </tr>
        </table>
    </asp:Panel>
    <ajaxToolkit:ModalPopupExtender ID="OpenButton_AnimatedModalPopupExtender1" runat="server"
        CancelControlID="CloseButton" Enabled="True" PopupControlID="AnimatedModalPopupPanel"
        TargetControlID="OpenButton">
        <Animations>
                    <OnShowing>
                        <Sequence>
                            <StyleAction AnimationTarget="CloseButton" Attribute="display" Value="none" />
                            <Resize Duration="0" Height="50px" Width="50px" />
                        </Sequence>
                    </OnShowing>
                    <OnShown>
                        <Sequence>
                            <Parallel>
                                <FadeIn />
                                <Scale ScaleFactor="5" Center="True" />
                            </Parallel>
                            <StyleAction AnimationTarget="CloseButton" Attribute="display" Value="" />
                        </Sequence>
                    </OnShown>    
                    <OnHiding>
                        <Sequence>                            
                            <StyleAction AnimationTarget="CloseButton" Attribute="display" Value="none" />
                            <Parallel>
                                <FadeOut />
                                <Scale ScaleFactor="5" Center="True" />
                            </Parallel>
                        </Sequence>
                    </OnHiding>            
        </Animations>
    </ajaxToolkit:ModalPopupExtender>
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="InfoContent" runat="Server">

    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>ModalPopup Description</Header>
        <Content>
            <div runat="server" data-control-type="ModalPopupExtender" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>ModalPopup Properties</Header>
        <Content>
            <div runat="server" data-control-type="ModalPopupExtender" data-content-type="members" />
        </Content>
    </samples:InfoBlock>

    <script type="text/javascript">
        //The following snippet works around a problem where FloatingBehavior
        //doesn't allow drops outside the "content area" of the page - where "content
        //area" is a little unusual for our sample web pages due to their use of CSS
        //for layout.
        function setBodyHeightToContentHeight() {
            document.body.style.height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) + "px";
        }
        setBodyHeightToContentHeight();
        $addHandler(window, "resize", setBodyHeightToContentHeight);
    </script>
</asp:Content>
