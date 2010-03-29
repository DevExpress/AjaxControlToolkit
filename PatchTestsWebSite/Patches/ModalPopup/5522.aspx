<%@ Page Language="C#" MasterPageFile="~/DefaultTests.master" AutoEventWireup="true"
    Inherits="CommonPage" Title="ModalPopup Sample" Theme="SampleSiteTheme" %>

<script runat="server">


    /// <summary>
    /// Handler for calendar changes
    /// </summary>
    /// <param name="sender">source</param>
    /// <param name="e">arguments</param>
    protected void Calendar1_SelectionChanged(object sender, EventArgs e) {
        // Popup result is the selected date
        PopupControlExtender1.Commit(Calendar1.SelectedDate.ToShortDateString());
    }

    /// <summary>
    /// Handler for radio button changes
    /// </summary>
    /// <param name="sender">source</param>
    /// <param name="e">arguments</param>
    protected void RadioButtonList1_SelectedIndexChanged(object sender, EventArgs e) {
        if (!string.IsNullOrEmpty(RadioButtonList1.SelectedValue)) {
            // Popup result is the selected task
            PopupControlExtender2.Commit(RadioButtonList1.SelectedValue);
        }
        else {
            // Cancel the popup
            PopupControlExtender2.Cancel();
        }
        // Reset the selected item
        RadioButtonList1.ClearSelection();
    }
    protected void OnChange(object sender, EventArgs e) {
        if (string.IsNullOrEmpty(ddlPosition.SelectedValue) || ddlPosition.SelectedValue.Length != 2) {
            avce.Enabled = false;
            return;
        }

        avce.Enabled = true;
        switch (ddlPosition.SelectedValue[0]) {
            case 'T':
                avce.VerticalSide = VerticalSide.Top;
                break;
            case 'M':
                avce.VerticalSide = VerticalSide.Middle;
                break;
            case 'B':
                avce.VerticalSide = VerticalSide.Bottom;
                break;
            default:
                avce.Enabled = false;
                return;
        }

        switch (ddlPosition.SelectedValue[1]) {
            case 'L':
                avce.HorizontalSide = HorizontalSide.Left;
                break;
            case 'C':
                avce.HorizontalSide = HorizontalSide.Center;
                break;
            case 'R':
                avce.HorizontalSide = HorizontalSide.Right;
                break;
            default:
                avce.Enabled = false;
                return;
        }
    }
</script>

<asp:Content ContentPlaceHolderID="SampleContent" runat="Server">
    <link href="../../StyleSheet.css" rel="stylesheet" type="text/css" />

    <script type="text/javascript">
        var styleToSelect;
        function onOk() {
            $get('Paragraph1').className = styleToSelect;
        }
        
    </script>

    <div class="demoarea">
        <div class="demoheading">
            ModalPopup Demonstration</div>
        <p id="Paragraph1">
            <%= GetContentFillerText() %></p>
        <br />
                <div style="width:230px;height:100px">
                <p>
                    Set the z-index of alwaysVisible controls to more than 10000 in order to have them sit in front of the modalPopup background.
                    Set it to less than 10100 to show in back of a 2nd nested modal dialog. Each modal dialog gets zIndex 10000 + nestCount*100.
                </p>
                    <asp:Panel ID="timer" runat="server"
                        Width="250px" BackColor="White" ForeColor="DarkBlue"
                        BorderWidth="2" BorderStyle="solid" BorderColor="DarkBlue" style="z-index: 10050;">
                            <div style="width: 100%; height: 100%; vertical-align: middle; text-align: center;">
                                <p>Current Time:</p>
                                <span id="currentTime" runat="server" style="font-size:xx-large;font-weight:bold;line-height:40px;"/>
                            </div>
                    </asp:Panel>
                    <asp:AlwaysVisibleControlExtender ID="avce" runat="server"
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
                    Position: <asp:DropDownList ID="ddlPosition" runat="server" 
                        AutoPostBack="true" OnSelectedIndexChanged="OnChange">
                        <asp:ListItem Text="Default" Selected="true"  Value="None" />
                        <asp:ListItem Text="Top Left" Value="TL" />
                        <asp:ListItem Text="Top Center" Value="TC" />
                        <asp:ListItem Text="Top Right"  Value="TR" />
                        <asp:ListItem Text="Middle Left" Value="ML" />
                        <asp:ListItem Text="Middle Center" Value="MC" />
                        <asp:ListItem Text="Middle Right"  Value="MR" />
                        <asp:ListItem Text="Bottom Left" Value="BL" />
                        <asp:ListItem Text="Bottom Center" Value="BC" />
                        <asp:ListItem Text="Bottom Right" Value="BR" />
                    </asp:DropDownList>
                </p>
        <asp:LinkButton ID="LinkButton1" runat="server" Text="Click here to bring up a modal dialog" />
        
        <asp:Panel ID="Panel1" runat="server" Class="modalPopup">
            <asp:Panel ID="Panel3" runat="server" Style="cursor: move; background-color: #DDDDDD;
                border: solid 1px Gray; color: Black">
                <div>
                    <p>
                        Choose the Message</p>
                </div>
            </asp:Panel>
            <asp:DropDownList runat="server" >
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            <asp:ListItem Text="one"></asp:ListItem>
            </asp:DropDownList>
            <asp:LinkButton ID="LinkButton2" runat="server" Text="Click here for a nested modal dialog" />
        
            <div class="demoarea">
                Reminder message:
                <asp:TextBox ID="MessageTextBox" runat="server" Width="200" autocomplete="off" /><br />
                <br />
                <asp:Panel ID="Panel2" runat="server" CssClass="popupControl">
                    <div style="border: 1px outset white; width: 100px">
                        <asp:UpdatePanel runat="server" ID="up2">
                            <ContentTemplate>
                                <asp:RadioButtonList ID="RadioButtonList1" runat="server" AutoPostBack="true" OnSelectedIndexChanged="RadioButtonList1_SelectedIndexChanged">
                                    <asp:ListItem Text="Walk dog" />
                                    <asp:ListItem Text="Feed dog" />
                                    <asp:ListItem Text="Feed cat" />
                                    <asp:ListItem Text="Feed fish" />
                                    <asp:ListItem Text="Cancel" Value="" />
                                </asp:RadioButtonList>
                            </ContentTemplate>
                        </asp:UpdatePanel>
                    </div>
                </asp:Panel>
                <asp:PopupControlExtender ID="PopupControlExtender2" runat="server" TargetControlID="MessageTextBox"
                    PopupControlID="Panel2" CommitProperty="value" Position="Bottom" CommitScript="e.value += ' - do not forget!';" />
            </div>
            
            <div>
                <p style="text-align: center;">
                    <asp:Button ID="OkButton" runat="server" Text="OK" />
                    <asp:Button ID="CancelButton" runat="server" Text="Cancel" />
                </p>
            </div>
        </asp:Panel>

        <asp:Panel ID="Panel1m" runat="server" CssClass="modalPopup">
            <asp:Panel ID="Panel3m" runat="server" Style="cursor: move; background-color: #DDDDDD;
                border: solid 1px Gray; color: Black">
                <div>
                    <p>
                        Choose the Date</p>
                </div>
            </asp:Panel>
            
                <p style="text-align: center;">
                    <asp:Button ID="OkButton2" runat="server" Text="OK2" />
                    <asp:Button ID="CancelButton2" runat="server" Text="Cancel2" />
                </p>
            <div class="demoarea">
                <div class="demoheading">
                    PopupControl Demonstration</div>
                Enter date for new reminder:
                <asp:TextBox ID="DateTextBox" runat="server" Width="80" autocomplete="off" /><br />
                <br />
                <asp:Panel ID="Panel1b" runat="server" CssClass="popupControl">
                    <asp:UpdatePanel runat="server" ID="up1">
                        <ContentTemplate>
                            <center>
                                <asp:Calendar ID="Calendar1" runat="server" Width="160px" DayNameFormat="Shortest"
                                    BackColor="White" BorderColor="#999999" CellPadding="1" Font-Names="Verdana"
                                    Font-Size="8pt" ForeColor="Black" OnSelectionChanged="Calendar1_SelectionChanged">
                                    <SelectedDayStyle BackColor="#666666" Font-Bold="True" ForeColor="White" />
                                    <TodayDayStyle BackColor="#CCCCCC" ForeColor="Black" />
                                    <SelectorStyle BackColor="#CCCCCC" />
                                    <WeekendDayStyle BackColor="#FFFFCC" />
                                    <OtherMonthDayStyle ForeColor="#808080" />
                                    <NextPrevStyle VerticalAlign="Bottom" />
                                    <DayHeaderStyle BackColor="#CCCCCC" Font-Bold="True" Font-Size="7pt" />
                                    <TitleStyle BackColor="#999999" Font-Size="7pt" BorderColor="Black" Font-Bold="True" />
                                </asp:Calendar>
                            </center>
                        </ContentTemplate>
                    </asp:UpdatePanel>
                </asp:Panel>
                <asp:PopupControlExtender ID="PopupControlExtender1" runat="server" TargetControlID="DateTextBox"
                    PopupControlID="Panel1b" Position="Bottom" />
            </div>
        </asp:Panel>
    </div>

    <asp:ModalPopupExtender ID="ModalPopupExtender" runat="server" TargetControlID="LinkButton1"
        PopupControlID="Panel1" BackgroundCssClass="modalBackground" OkControlID="OkButton"
        OnOkScript="onOk()" CancelControlID="CancelButton" DropShadow="true" PopupDragHandleControlID="Panel3" />
    <asp:ModalPopupExtender ID="ModalPopupExtender2" runat="server" TargetControlID="LinkButton2"
        PopupControlID="Panel1m" BackgroundCssClass="modalBackground" OkControlID="OkButton2"
        CancelControlID="CancelButton2" DropShadow="true" PopupDragHandleControlID="Panel3m" />
</asp:Content>
