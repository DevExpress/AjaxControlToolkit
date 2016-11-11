<%@ Page Title="AlwaysVisibleControl Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="AlwaysVisibleControl.aspx.cs" Inherits="AlwaysVisibleControl_AlwaysVisibleControl" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    AlwaysVisibleControl Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <asp:UpdatePanel runat="server" ID="UpdatePanel1">
        <ContentTemplate>
            <div style="width: 230px; height: 100px">
                <asp:Panel ID="timer" runat="server"
                    Width="250px" BackColor="White" ForeColor="DarkBlue"
                    BorderWidth="2" BorderStyle="solid" BorderColor="DarkBlue" Style="z-index: 1;">
                    <div style="width: 100%; height: 100%; vertical-align: ; text-align: center;">
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

    <script type="text/javascript">
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

<asp:Content ContentPlaceHolderID="InfoContent" runat="server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>AlwaysVisibleControl Description</Header>
        <Content>
           <div runat="server" data-control-type="AlwaysVisibleControlExtender" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>AlwaysVisibleControl Properties</Header>
        <Content>
            <div runat="server" data-control-type="AlwaysVisibleControlExtender" data-content-type="members" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>Additional Text For Scrolling</Header>
        <Content>
            <% for(int i = 0; i < 10; i++) { %>
                <%= DemoData.ContentFillerText %>
                <br />
                <br />
            <% } %>
        </Content>
    </samples:InfoBlock>
</asp:Content>
