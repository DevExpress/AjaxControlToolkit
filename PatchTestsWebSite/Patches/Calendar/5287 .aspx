<%@ Page 
    Language="C#" 
    MasterPageFile="~/DefaultTests.master" 
    AutoEventWireup="true"
    Inherits="CommonPage" 
    Title="Calendar Sample" 
    Theme="SampleSiteTheme" %>

<asp:Content ContentPlaceHolderID="SampleContent" runat="Server">
    <link href="../../StyleSheet.css" rel="stylesheet" type="text/css" />
    <div class="demoarea">
        <div class="demoheading">
            Calendar Demonstration</div>
        <br />
        <b>Default calendar: </b>
        <br />
        <asp:TextBox runat="server" ID="Date1" autocomplete="off" /><br />
        <asp:CalendarExtender ID="defaultCalendarExtender" runat="server" TargetControlID="Date1" />
        <div style="font-size: 90%">
            <em>(Set the focus to the textbox to show the calendar)</em></div>
        <br />
        <br />
        <b>Calendar with a custom style and formatted date (opening on left):</b><br />
        <asp:TextBox runat="server" ID="Date2" autocomplete="off" /><br />
        <asp:CalendarExtender ID="customCalendarExtender" runat="server" TargetControlID="Date2"
           CssClass="MyCalendar" Format="MMMM d, yyyy" SelectedDate="April 28, 1906" PopupPosition="Left"/>
        <div style="font-size: 90%">
            <em>(Set the focus to the textbox to show the calendar)</em></div>
        <br />
        <br />
        <b>Calendar with an associated button:</b><br />
        <asp:TextBox runat="server" ID="Date5" />
        <asp:ImageButton runat="Server" ID="Image1" ImageUrl="~/images/Calendar_scheduleHS.png" AlternateText="Click to show calendar" /><br />
        <asp:CalendarExtender ID="calendarButtonExtender" runat="server" TargetControlID="Date5" 
            PopupButtonID="Image1" />
        <div style="font-size: 90%">
            <em>(Click the image button to show the calendar; this calendar dismisses automatically
                when you choose a date)</em></div>
        <b>Calendar with an associated button:</b><br />

        <asp:TextBox runat="server" ID="Date6" />
        <asp:ImageButton runat="Server" ID="Image2" ImageUrl="~/images/Calendar_scheduleHS.png" AlternateText="Click to show calendar" /><br />
        <asp:CalendarExtender ID="calendarButtonExtender2" runat="server" TargetControlID="Date6" 
            PopupButtonID="Image2"  DefaultView="Months" />
        <div style="font-size: 90%">
            <em>(Click the image button to show the calendar; this calendar dismisses automatically
                when you choose a date)</em></div>
    </div>
</asp:Content>
