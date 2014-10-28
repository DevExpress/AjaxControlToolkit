﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="AlwaysVisibleControl.aspx.cs" Inherits="AlwaysVisibleControl_AlwaysVisibleControl" %>

<%@ Register Assembly="AjaxControlToolkit" Namespace="AjaxControlToolkit" TagPrefix="ajaxToolkit" %>

<asp:Content ID="Content1" ContentPlaceHolderID="DemoHeading" runat="Server">
    AlwaysVisibleControl Demonstration
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="DemoContent" runat="Server">
    <asp:UpdatePanel runat="server" ID="UpdatePanel1">
        <ContentTemplate>
            <div style="width: 230px; height: 100px">
                <asp:Panel ID="timer" runat="server"
                    Width="250px" BackColor="White" ForeColor="DarkBlue"
                    BorderWidth="2" BorderStyle="solid" BorderColor="DarkBlue" Style="z-index: 1;">
                    <div style="width: 100%; height: 100%; vertical-align: middle; text-align: center;">
                        <p>Current Time:</p>
                        <span id="currentTime" runat="server" style="font-size: xx-large; font-weight: bold; line-height: 40px;" />
                    </div>
                </asp:Panel>
                <ajaxToolkit:AlwaysVisibleControlExtender ID="avce" runat="server"
                    TargetControlID="timer"
                    VerticalSide="Top"
                    VerticalOffset="10"
                    HorizontalSide="Right"
                    HorizontalOffset="10"
                    ScrollEffectDuration=".1" />
            </div>
            <p>
                Choose a position for the clock from the list below. Scroll your browser window to see
                    the control maintain its always-visible position.  
            </p>
            <p>
                Position:
                <asp:DropDownList ID="ddlPosition" runat="server"
                    AutoPostBack="true" OnSelectedIndexChanged="OnChange">
                    <asp:ListItem Text="Default" Selected="true" Value="None" />
                    <asp:ListItem Text="Top Left" Value="TL" />
                    <asp:ListItem Text="Top Center" Value="TC" />
                    <asp:ListItem Text="Top Right" Value="TR" />
                    <asp:ListItem Text="Middle Left" Value="ML" />
                    <asp:ListItem Text="Middle Center" Value="MC" />
                    <asp:ListItem Text="Middle Right" Value="MR" />
                    <asp:ListItem Text="Bottom Left" Value="BL" />
                    <asp:ListItem Text="Bottom Center" Value="BC" />
                    <asp:ListItem Text="Bottom Right" Value="BR" />
                </asp:DropDownList>
            </p>
        </ContentTemplate>
    </asp:UpdatePanel>

    <script type="text/javascript" language="javascript">
        function updateTime() {
            var label = document.getElementById('ctl00_SampleContent_currentTime');
            if(label) {
                var time = (new Date()).localeFormat("T");
                label.innerHTML = time;
            }
        }
        updateTime();
        window.setInterval(updateTime, 1000);
    </script>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="DescriptionHeaderPanelContent" runat="Server">
    <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse" />
    AlwaysVisibleControl Description
</asp:Content>
<asp:Content ID="Content4" ContentPlaceHolderID="DescriptionContentPanelContent" runat="Server">
    <p>
        The AlwaysVisibleControl is a simple extender allowing you to pin controls to the page so that they
        appear to float over the background body content when it is scrolled or resized.  It targets any ASP.NET
        control and always keeps the position a specified distance from the desired horizontal and vertical sides.
    </p>
    <br />
    <p>
        To avoid having the control flash and move when the page loads, it is recommended that you absolutely
        position the control in the desired location in addition to attaching the extender.
    </p>
</asp:Content>
<asp:Content ID="Content5" ContentPlaceHolderID="PropertiesHeaderPanelContent" runat="Server">
    <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg" AlternateText="expand" />
    AlwaysVisibleControl Properties
</asp:Content>
<asp:Content ID="Content6" ContentPlaceHolderID="PropertiesContentPanelContent" runat="Server">
    The always visible extender has been initialized with these properties. The properties
        in <em>italics</em> are optional.<br />
    <br />
    <pre>&lt;ajaxToolkit:AlwaysVisibleControlExtender ID="ace" runat="server"
    TargetControlID="timer"         
    <em>VerticalSide</em>="Top"
    <em>VerticalOffset</em>="10"
    <em>HorizontalSide</em>="Right"
    <em>HorizontalOffset</em>="10"
    <em>ScrollEffectDuration</em>=".1"/&gt;</pre>
    <ul>
        <li><strong>TargetControlID</strong> - ID of control for this extender to always make visible</li>
        <li><strong>HorizontalOffset</strong> - Distance to the HorizontalSide edge of the browser in pixels from the same side of the target control.  The default is 0 pixels.</li>
        <li><strong>HorizontalSide</strong> - Horizontal edge of the browser (either Left, Center, or Right) used to anchor the target control.  The default is Left.</li>
        <li><strong>VerticalOffset</strong> - Distance to the VerticalSide edge of the browser in pixels from the same side of the target control.  The default is 0 pixels.</li>
        <li><strong>VerticalSide</strong> - Vertical edge of the browser (either Top, Middle, or Bottom) used to anchor the target control.  The default is Top.</li>
        <li><strong>ScrollEffectDuration</strong> - Length in seconds of the scrolling effect to last when the target control is repositioned.  The default is .1 second.</li>
        <li><strong>UseAnimation</strong> - Whether or not to animate the element into position.  The default is false.</li>
    </ul>
</asp:Content>