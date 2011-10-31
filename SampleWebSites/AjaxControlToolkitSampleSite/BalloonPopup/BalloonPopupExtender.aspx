<%@ Page Language="C#" MasterPageFile="~/DefaultMaster.master" AutoEventWireup="true"
    CodeFile="BalloonPopupExtender.aspx.cs" Inherits="BalloonPopupSample" Title="BalloonPopupExtender Sample"
    Theme="SampleSiteTheme" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">
            BalloonPopupExtender Demonstration</div>
        <asp:TextBox ID="MessageTextBox" runat="server" Width="200" autocomplete="off" />
        <br />
        <br />
        <asp:Panel ID="Panel2" runat="server">
            some text some text some text some text some text some text some text some text
            some text some text some text some text
        </asp:Panel>
        <ajaxToolkit:BalloonPopupExtender ID="PopupControlExtender2" runat="server" TargetControlID="MessageTextBox"
            BalloonPopupControlID="Panel2" Position="BottomRight" BalloonStyle="Cloud" BalloonSize="Medium"
            UseShadow="false" DisplayOnClick="true" DisplayOnFocus="true" />
        <br />
        <br />
        <asp:HyperLink ID="link1" runat="server">Show Balloon popup</asp:HyperLink>
        <br />
        <br />
        <asp:Panel ID="Panel1" runat="server">
            These are some contents to display for Balloon popup These are some contents to
            display for Balloon popup These are some contents to display for Balloon popup These
            are some contents to display for Balloon popup
        </asp:Panel>
        <ajaxToolkit:BalloonPopupExtender ID="BalloonPopupExtender1" runat="server" TargetControlID="link1"
            BalloonPopupControlID="Panel1" Position="TopRight" BalloonStyle="Rectangle" BalloonSize="Medium"
            UseShadow="true" />
        <br />
        <br />
        <asp:TextBox ID="txtCustom" runat="server" Width="200" autocomplete="off" />
        <br />
        <br />
        <asp:Panel ID="Panel3" runat="server">
            Contents for custom style Contents for custom style Contents for custom style Contents
            for custom style
        </asp:Panel>
        <ajaxToolkit:BalloonPopupExtender ID="BalloonPopupExtender2" runat="server" TargetControlID="txtCustom"
            BalloonPopupControlID="Panel3" Position="BottomRight" BalloonStyle="Custom" CustomCssUrl="http://browsers.superexpert.com/MohinderJ/CustomTheme/BalloonPopup_resource.css"
            BalloonSize="Medium" UseShadow="true" />
    </div>
    <div class="demobottom">
    </div>
    <asp:Panel ID="Description_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg"
                AlternateText="collapse" />
            BalloonPopupExtender Description
        </div>
    </asp:Panel>
    <asp:Panel ID="Description_ContentPanel" runat="server" Style="overflow: hidden;">
        <p>
            BalloonPopup Control is an ASP.NET AJAX extender that can be attached to any control
            in order to open a popup window that displays additional content with shape in background
            to resemble like balloon. This popup window will be readonly and use will not able
            to perform any further action in this popup.
        </p>
        <br />
        <p>
            This control provides Rectangle and cloud themes in 3 different sizes - small, 
            medium and large. This control also provides custom theme that provides facility 
            for end user to extend themes and define their own themes. For this they need to 
            set BalloonStyle property to custom and provide value of CustomCssUrl. This 
            control by default displays shadow of balloon popup but user can set UseShadow 
            property to false to hide shadow.
        </p>
        <br />
        <p>
            This control can be set at 5 positions - TopLeft, TopRight, BottomLeft, BottomRight
            and Auto. If user selects Auto then position of balloon popup will be automatically
            set as per the available space and size of balloon popup.
        </p>
        <br />
        <p>
            This control displays on MouseOver, Focus and Click events. This control provides functionality
            to user to customize on which event BalloonPopup to display.
        </p>
        <br />
        <p>
            This control hides as user clicks outside the balloon popup.
        </p>
        <br />
    </asp:Panel>
    <asp:Panel ID="Properties_HeaderPanel" runat="server" Style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg"
                AlternateText="expand" />
            BalloonPopup control Properties
        </div>
    </asp:Panel>
    <asp:Panel ID="Properties_ContentPanel" runat="server" Style="overflow: hidden;"
        Height="0px">
        <p>
            The Balloon Popup is initialized with this code. The <em>italic</em> properties
            are optional:
        </p>
        <pre>&lt;ajaxToolkit:BalloonPopupExtender ID="PopupControlExtender2" runat="server"
        TargetControlID="MessageTextBox"
        BalloonPopupControlID="Panel2"
        <em>Position</em>="BottomRight" 
        <em>BalloonStyle</em>="Cloud"
        <em>BalloonSize</em>="Small"
        <em>CustomCssUrl</em>="http://browsers.superexpert.com/MohinderJ/CustomTheme/BalloonPopup_resource.css"
        <em>UseShadow</em>="true" 
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
            <li><strong>UseShadow</strong> - Optional setting specifying whether to display shadow of balloon 
            popup or not.</li>
            <li><strong>DisplayOnMouseOver</strong> - Optional setting specifying whether to display balloon 
            popup onMouseOver event. Default value is false.</li>
            <li><strong>DisplayOnFocus</strong> - Optional setting specifying whether to display balloon 
            popup onFocus event. Default value is false.</li>
            <li><strong>DisplayOnClick</strong> - Optional setting specifying whether to display balloon 
            popup onClick event. Default value is true.</li>
            <li><strong>Animations</strong> - Generic animations for the PopupControlExtender. See
                the <a href="../Walkthrough/UsingAnimations.aspx">Using Animations</a> walkthrough
                and <a href="../Walkthrough/AnimationReference.aspx">Animation Reference</a> for
                more details.
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
    </asp:Panel>
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel" CollapseControlID="Description_HeaderPanel"
        Collapsed="False" ImageControlID="Description_ToggleImage" />
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel" CollapseControlID="Properties_HeaderPanel"
        Collapsed="False" ImageControlID="Properties_ToggleImage" />
</asp:Content>
