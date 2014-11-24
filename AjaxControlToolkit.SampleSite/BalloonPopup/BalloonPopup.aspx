<%@ Page Title="BalloonPopup Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="BalloonPopup.aspx.cs" Inherits="BaloonPopup_BaloonPopup" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    BalloonPopup Demonstration
</asp:Content>

<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <p>
        Click inside either of the two TextBox controls below or click the link to see
        a demonstration of the BalloonPopupExtender control.
    </p>

    <asp:TextBox ID="MessageTextBox" runat="server" Width="200" autocomplete="off" />
    <br /><br />
    <asp:Panel ID="Panel2" runat="server">
        This Balloon Popup uses the Cloud style.
    </asp:Panel>
    <ajaxToolkit:BalloonPopupExtender ID="PopupControlExtender2" runat="server" TargetControlID="MessageTextBox"
        BalloonPopupControlID="Panel2" Position="BottomRight" BalloonStyle="Cloud" BalloonSize="Small"
        UseShadow="false" DisplayOnClick="true" DisplayOnFocus="true" />
    <br /><br />
    <asp:HyperLink ID="link1" runat="server">Click Here to Show the Balloon Popup</asp:HyperLink>
    <br /><br />
    <asp:Panel ID="Panel1" runat="server">
        This Balloon Popup appears when you click the link. It uses a Rectangle style and it is set to 
        appear at the top-right of the link.
    </asp:Panel>
    <ajaxToolkit:BalloonPopupExtender ID="BalloonPopupExtender1" runat="server" TargetControlID="link1"
        BalloonPopupControlID="Panel1" Position="TopRight" BalloonStyle="Rectangle" BalloonSize="Small"
        UseShadow="true" />
    <br /><br />
    <asp:TextBox ID="txtCustom" runat="server" Width="200" autocomplete="off" />
    <br /><br />
    <asp:Panel ID="Panel3" runat="server">
        This is a custom BalloonPopupExtender style created with a custom Cascading Style Sheet. 
    </asp:Panel>
    <ajaxToolkit:BalloonPopupExtender ID="BalloonPopupExtender2" runat="server" TargetControlID="txtCustom"
        BalloonPopupControlID="Panel3" Position="BottomRight" BalloonStyle="Custom" CustomCssUrl="CustomStyle/BalloonPopupOvalStyle.css"
        CustomClassName="oval" BalloonSize="Medium" UseShadow="true" />
</asp:Content>

<asp:Content ID="Content3" ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>BalloonPopupExtender Description</Header>
        <Content>
            <p>
                The BalloonPopupExtender control displays a popup which can contain any content. For example, you can use 
                the BalloonPopupExtender to display help information when you move focus to a TextBox control.
            </p>
            <br />
            <p>
                The BalloonPopupExtender supports three different styles: Balloon, Rectangle, and Custom. You can select 
                among three different sizes for the popup: Small, Medium, and Large. If you set the BalloonPopup 
                style to the value Custom then you can define a custom appearance for the BalloonPopup. In that 
                case, you also need to set the CustomCssUrl property to point to a custom style sheet.
            </p>
            <br />
            <p>
                This control can be set to 5 positions - TopLeft, TopRight, BottomLeft, BottomRight and Auto. If 
                you select the value Auto then the position of the BalloonPopup is determined automatically based 
                on available space.
            </p>
            <br />
            <p>
                You can set the BalloonPopExtender to be triggered by the MouseOver, Focus or Click events. The control is 
                hidden automatically when you click outside the Balloon Popup.
            </p>
            <br />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>BalloonPopupExtender Properties</Header>
        <Content>
            Height="0px">
        <p>
            The BalloonPopupExtender is initialized with this code. The <em>italic</em> properties
            are optional:
        </p>
            <pre>&lt;ajaxToolkit:BalloonPopupExtender ID="PopupControlExtender2" runat="server"
        TargetControlID="MessageTextBox"
        BalloonPopupControlID="Panel2"
        <em>Position</em>="BottomRight" 
        <em>BalloonStyle</em>="Cloud"
        <em>BalloonSize</em>="Small"
        <em>CustomCssUrl</em>="CustomStyle/BalloonPopupOvalStyle.css"
        <em>CustomClassName</em>="oval"
        <em>UseShadow</em>="true" 
        <em>ScrollBars</em>="Auto"
        <em>DisplayOnMouseOver</em>="true"
        <em>DisplayOnFocus</em>="false"
        <em>DisplayOnClick</em>=&quot;true&quot; /&gt;</pre>

            <ul>
                <li><strong>TargetControlID</strong> - The ID of the control to attach to.</li>
                <li><strong>BalloonPopupControlID</strong> - The ID of the control to display.</li>
                <li><strong>Position</strong> - Optional setting specifying where the popup should 
                be positioned relative to the target control. (TopRight, TopLeft, BottomRight, 
                BottomLeft, Auto) Default value is Auto.</li>
                <li><strong>OffsetX/OffsetY</strong> - The number of pixels to offset the Popup from
                its default position, as specified by Position. Default value is 0. </li>
                <li><strong>BalloonStyle</strong> - Optional setting specifying the theme of balloon popup. 
            (Cloud, Rectangle, Custom). Default value is Rectangle.</li>
                <li><strong>BalloonSize</strong> - Optional setting specifying the size of balloon popup. 
            (Small, Medium and Large). Default value is Small.</li>
                <li><strong>CustomCssUrl</strong> - This is required if user choose BalloonStyle to Custom. 
            This specifies the url of custom css which will display custom theme.</li>
                <li><strong>CustomClassName</strong> - This is required if user choose BalloonStyle to Custom. 
            This specifies the name of the css class for the custom theme.</li>
                <li><strong>UseShadow</strong> - Optional setting specifying whether to display shadow of balloon 
            popup or not.</li>
                <li><strong>ScrollBars</strong> - Optional setting specifying whether to display scrollbar if 
            contents are overflowing. This property contains 5 options - None, Horizontal, Vertical, Both 
            and Auto. Default value is Auto.</li>
                <li><strong>DisplayOnMouseOver</strong> - Optional setting specifying whether to display balloon 
            popup on the client onMouseOver event. Default value is false.</li>
                <li><strong>DisplayOnFocus</strong> - Optional setting specifying whether to display balloon 
            popup  on the client  onFocus event. Default value is false.</li>
                <li><strong>DisplayOnClick</strong> - Optional setting specifying whether to display balloon popup  
            on the client  onClick event. Default value is true.</li>
                <li><strong>Animations</strong> - Generic animations for the PopupControlExtender. See the <a href="https://ajaxcontroltoolkit.codeplex.com/wikipage?title=Animation%20Control%20Reference">Animation Reference</a> for more details.
                <ul>
                    <li><strong>OnShow</strong> - The OnShow animation will be played each time the popup
                        is displayed. The popup will be positioned correctly but hidden. The animation can
                        use <span class="codeReference">&lt;HideAction Visible="true" /&gt;</span> to display
                        the popup along with any other visual effects.</li>
                    <li><strong>OnHide</strong> - The OnHide animation will be played each time the popup
                        is hidden.</li>
                </ul>
                </li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>

