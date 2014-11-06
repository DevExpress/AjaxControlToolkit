<%@ Page Title="Calendar Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="Calendar.aspx.cs" Inherits="Calendar_Calendar" Culture="auto" UICulture="auto"%>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    Calendar Demonstration
</asp:Content>

<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    <asp:TextBox runat="server" ID="Date1" autocomplete="off" /><br />
    <ajaxToolkit:CalendarExtender ID="defaultCalendarExtender" runat="server" TargetControlID="Date1" />

    <div style="font-size: 90%">
        <em>(Set the focus to the textbox to show the calendar)</em>
    </div>
    <br />
    <br />
    <b>Calendar with a custom style and formatted date (opening on left):</b><br />
    <asp:TextBox runat="server" ID="Date2" autocomplete="off" /><br />
    <ajaxToolkit:CalendarExtender ID="customCalendarExtender" runat="server" TargetControlID="Date2"
        CssClass="MyCalendar" Format="MMMM d, yyyy" SelectedDate="April 28, 1906" PopupPosition="Left" />
    <div style="font-size: 90%">
        <em>(Set the focus to the textbox to show the calendar)</em>
    </div>
    <br />
    <br />
    <b>Calendar with an associated button:</b><br />
    <asp:TextBox runat="server" ID="Date5" />
    <asp:ImageButton runat="Server" ID="Image1" ImageUrl="~/Images/Calendar_scheduleHS.png" AlternateText="Click to show calendar" /><br />
    <ajaxToolkit:CalendarExtender ID="calendarButtonExtender" runat="server" TargetControlID="Date5"
        PopupButtonID="Image1" />
    <div style="font-size: 90%">
        <em>(Click the image button to show the calendar; this calendar dismisses automatically
                when you choose a date)</em>
    </div>
    <br />
    <br />

    <b>Calendar with date range:</b><br />
    <asp:TextBox runat="server" ID="Date6" />
    <ajaxToolkit:CalendarExtender ID="CalendarExtender1" runat="server" Format="MM/dd/yyyy" TargetControlID="Date6" StartDate="8/3/2010" EndDate="10/7/2010" SelectedDate="8/3/2010" />
    <div style="font-size: 90%">
        <em>(Set the focus to the textbox to show the calendar. This calendar's StartDate property is '8/3/2010' and EndDate is '10/7/2010')</em>
    </div>
</asp:Content>

<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>Calendar Description</Header>
        <Content>
            <p>
                Calendar is an ASP.NET AJAX extender that can be attached to any ASP.NET TextBox
                control. It provides client-side date-picking functionality with customizable date
                format and UI in a popup control. You can interact with the calendar by clicking
                on a day to set the date, or the "Today" link to set the current date.
            </p>
            <br />
            <p>
                In addition, the left and right arrows can be used to move forward or back a month.
                By clicking on the title of the calendar you can change the view from Days in the
                current month, to Months in the current year. Another click will switch to Years
                in the current Decade. This action allows you to easily jump to dates in the past
                or the future from within the calendar control.
            </p>
            <br />
            <p>
                The page uses the culture setting <strong><%= System.Globalization.CultureInfo.CurrentCulture.NativeName %></strong>
                which was specified by the browser. The page properties have Culture="auto" and
                UICulture="auto" set to enable the same. See this
                <a href="http://msdn2.microsoft.com/en-us/library/bz9tc508.aspx">MSDN article</a>
                for more information. The ScriptManager on this Calendar demo page has EnableScriptGlobalization="true"
                and EnableScriptLocalization="true".
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server" Collapsed="true">
        <Header>Calendar Properties</Header>
        <Content>
            <p>
                The calendar associated with a button has been initialized with this code. The properties
            in <em>italic</em> are optional:
            </p>
            <pre>&lt;ajaxToolkit:Calendar runat="server"
    TargetControlID="Date1"
    <em>CssClass</em>="ClassName"
    <em>Format</em>="MMMM d, yyyy"
    <em>PopupButtonID</em>="Image1" /&gt;</pre>
            <ul>
                <li><strong>TargetControlID</strong> - The ID of the TextBox to extend with the calendar.</li>
                <li><strong>CssClass</strong> - Name of the CSS class used to style the calendar. See
                the Calendar Theming section for more information.</li>
                <li><strong>Format</strong> - <a href="http://msdn2.microsoft.com/en-us/library/bb79761a-ca08-44ee-b142-b06b3e2fc22b.aspx">Format string</a> used to display the selected date.</li>
                <li><strong>PopupButtonID</strong> - The ID of a control to show the calendar popup
                when clicked. If this value is not set, the calendar will pop up when the textbox
                receives focus.</li>
                <li><strong>PopupPosition</strong> - Indicates where the calendar popup should appear 
                at the BottomLeft(default), BottomRight, TopLeft, TopRight, Left or Right of the TextBox.</li>
                <li><strong>SelectedDate</strong> - Indicates the date the Calendar extender is 
                initialized with.</li>
                <li>
                    <strong>StartDate</strong> - Indicates start date for range that available for selection.
                </li>
                <li>
                    <strong>EndDate</strong> - Indicates end date for range that available for selection.
                </li>
            </ul>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server" Collapsed="true">
        <Header>Calendar Theming</Header>
        <Content>
            You can change the look and feel of Calendar using the Calendar CssClass property.
        Calendar has a predefined set of CSS classes that can be overridden. It has a default
        style which is embedded as a WebResource and is a part of the Toolkit assembly that
        has styles set for all the sub-classes. You can find them in the Toolkit solution,
        in the <strong>"AjaxControlToolkit\Calendar\Calendar.css"</strong> file. If your
        CssClass does not provide values for any of those then it falls back to the default
        value. To customize the same the user would have to set the CssClass property to
        the name of the CSS style and define the styles for the individual classes so that
        the various elements in a Calendar control can be styled accordingly. The second
        calendar in the demo above uses the "MyCalendar" style. which sets the Calendar
        container style as follows.
        <pre>
.MyCalendar .ajax__calendar_container {
    border:1px solid #646464;
    background-color: lemonchiffon;
    color: red;
}</pre>
            <strong>Calendar Css Classes</strong>
            <br />
            <ul>
                <li><strong>.ajax__calendar_container </strong>: The outer rectangular container that
                supplies the border around the calendar element. Child Css classes: .ajax__calendar_header,.ajax__calendar_body,.ajax__calendar_footer.
                </li>
                <li><strong>.ajax__calendar_header </strong>: A container element that holds the next
                and previous arrows and the title of the current view. Child Css classes: .ajax__calendar_prev,
                .ajax__calendar_title, .ajax__calendar_next. </li>
                <li><strong>.ajax__calendar_prev </strong>: An element that displays the arrow to view
                the previous set of data in the view(previous month/year/decade). Child Css classes:
                none. </li>
                <li><strong>.ajax__calendar_title </strong>: An element that displays the title of the
                current view (month name, year, decade). Child Css classes: none. </li>
                <li><strong>.ajax__calendar_next </strong>: An element that displays the arrow to view
                the previous set of data in the view (previous month/year/decade). Child Css classes:
                none. </li>
                <li><strong>.ajax__calendar_body </strong>: A container element that holds the days,
                months, and years panes. Also provides a fixed rectangle with hidden overflow that
                is used for transitioning between views (next/previous month, or days/months/years).Child
                Css class: .ajax__calendar_days, .ajax__calendar_months, .ajax__calendar_years.
                </li>
                <li><strong>.ajax__calendar_days </strong>: A container element that holds the layout for 
                    the days in a month. Child Css classes: .ajax__calendar_dayname, .ajax__calendar_day
                </li>
                <li><strong>.ajax__calendar_dayname </strong>: An element that displays the short name of the 
                day of the week. Child Css classes: none.</li>
                <li><strong>.ajax__calendar_day </strong>: An element that displays the day of the month. 
                Child Css classes: none </li>
                <li><strong>.ajax__calendar_months </strong>: A container element that holds the layout for the months 
                in a year. Child Css classes: .ajax__calendar_month.
                </li>
                <li><strong>.ajax__calendar_month </strong>: An element that displays the month of the year. 
            Child Css classes: none </li>
                <li><strong>.ajax__calendar_years </strong>: A container element that holds the layout for the 
            years in a decade. Child Css classes: .ajax__calendar_year.
                </li>
                <li><strong>.ajax__calendar_year </strong>: An element that displays the year in a decade.
                Child Css classes: none </li>
                <li><strong>.ajax__calendar_footer </strong>: A container element that holds the current date. 
            Child Css classes: .ajax__calendar_today.</li>
                <li><strong>.ajax__calendar_today </strong>: An element that displays the current date. 
            Child Css classes: none.</li>
                <li><strong>.ajax__calendar_hover </strong>: This is applied to an element in the DOM above a day, 
                month or year and is used
                to apply CSS attributes that show a hover state. Child Css classes: .ajax__calendar_day,
                .ajax__calendar_month, .ajax__calendar_year </li>
                <li><strong>.ajax__calendar_active </strong>: This is applied to an element in the DOM above a day, month or year and is used
                to apply CSS attributes that show the currently selected value. Child Css classes: .ajax__calendar_day,
                .ajax__calendar_month, .ajax__calendar_year.</li>
                <li><strong>.ajax__calendar_other </strong>: This is applied to an element in the DOM above a day or year that is outside of
                the current view (day not in the visible month, year not in the visible decade).
                Child Css classes: .ajax__calendar_day, .ajax__calendar_year.</li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>