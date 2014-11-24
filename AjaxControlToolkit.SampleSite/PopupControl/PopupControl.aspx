<%@ Page Title="PopupControl Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="PopupControl.aspx.cs" Inherits="PopupControl_PopupControl" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    PopupControl Demonstration
</asp:Content>
<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">
    Enter date for new reminder:
        <asp:TextBox ID="DateTextBox" runat="server" Width="80" autocomplete="off" /><br />
    <br />
    <asp:Panel ID="Panel1" runat="server" CssClass="popupControl">
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
    <ajaxToolkit:PopupControlExtender ID="PopupControlExtender1" runat="server"
        TargetControlID="DateTextBox"
        PopupControlID="Panel1"
        Position="Bottom" />

    Reminder message:
        <asp:TextBox ID="MessageTextBox" runat="server" Width="200" autocomplete="off" /><br />
    <i>Please select 'Cancel' to discard changes.</i>
    <br />
    <br />
    <asp:Panel ID="Panel2" runat="server" CssClass="popupControl">
        <div style="border: 1px outset white; width: 100px">
            <asp:UpdatePanel runat="server" ID="up2">
                <ContentTemplate>
                    <asp:RadioButtonList ID="RadioButtonList1" runat="server" AutoPostBack="true"
                        OnSelectedIndexChanged="RadioButtonList1_SelectedIndexChanged">
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
    <ajaxToolkit:PopupControlExtender ID="PopupControlExtender2" runat="server"
        TargetControlID="MessageTextBox"
        PopupControlID="Panel2"
        CommitProperty="value"
        Position="Bottom"
        CommitScript="this.get_element().value += ' - do not forget!';" />

    <asp:UpdatePanel ID="UpdatePanel3" runat="server">
        <ContentTemplate>
            <asp:Button ID="ReminderButton" runat="server" Text="Add reminder" OnClick="ReminderButton_Click" />
            <br />
            <br />
            <asp:Label ID="Label1" runat="server" Text="[No response provided yet]" />
        </ContentTemplate>
    </asp:UpdatePanel>
</asp:Content>
<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">
    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>
            PopupControl Description
        </Header>
        <Content>
            <p>
                PopupControl is an ASP.NET AJAX extender that can be attached to any control in order to open
                a popup window that displays additional content.  This popup window will probably be interactive
                and will probably be within an ASP.NET AJAX UpdatePanel, so it will be able to perform complex
                server-based processing (including postbacks) without affecting the rest of the page.  The popup
                window can contain any content, including ASP.NET server controls, HTML elements, etc.  Once the
                work of the popup window is done, a simple server-side call dismisses it and triggers any relevant
                script on the client to run and update the page dynamically.
            </p>
        </Content>
    </samples:InfoBlock>
    <samples:InfoBlock runat="server">
        <Header>
            PopupControl Properties
        </Header>
        <Content>
            <p>
                The control above is initialized with this code. The <em>italic</em> properties are optional:
            </p>
            <pre>
&lt;ajaxToolkit:PopupControlExtender ID="PopEx" runat="server"
    TargetControlID="DateTextBox"
    PopupControlID="Panel1"
    <em>Position</em>="Bottom" /&gt;
            </pre>
            <ul>
                <li><strong>TargetControlID</strong> - The ID of the control to attach to</li>
                <li><strong>PopupControlID</strong> - The ID of the control to display</li>
                <li><strong>Position</strong> - Optional setting specifying where the popup should be positioned relative to the target control. (Left, Right, Top, Bottom, Center)</li>
                <li><strong>CommitProperty</strong> - Optional setting specifying the property on the control being extended that should be set with the result of the popup</li>
                <li><strong>CommitScript</strong> - Optional setting specifying additional script to run after setting the result of the popup</li>
                <li><strong>OffsetX/OffsetY</strong> - The number of pixels to offset the Popup from its default position, as specified by Position.</li>
                <li><strong>Animations</strong> - Generic animations for the PopupControlExtender.  See the <a href="https://ajaxcontroltoolkit.codeplex.com/wikipage?title=Animation%20Control%20Reference">Animation Reference</a> for more details.
                    <ul>
                        <li><strong>OnShow</strong> - The OnShow animation will be played each time the popup is displayed.
                            The popup will be positioned correctly but hidden.  The animation can use
                            <span class="codeReference">&lt;HideAction Visible="true" /&gt;</span>
                            to display the popup along with any other visual effects.</li>
                        <li><strong>OnHide</strong> - The OnHide animation will be played each time the popup is hidden.</li>
                    </ul>
                </li>
            </ul>
        </Content>
    </samples:InfoBlock>
</asp:Content>

