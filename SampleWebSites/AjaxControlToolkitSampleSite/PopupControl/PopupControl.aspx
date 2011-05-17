<%@ Page
    Language="C#"
    MasterPageFile="~/DefaultMaster.master"
    AutoEventWireup="true"
    CodeFile="PopupControl.aspx.cs"
    Inherits="PopupControl_PopupControl"
    Title="PopupControl Sample" 
    Theme="SampleSiteTheme" %>
<%@ Register
    Assembly="AjaxControlToolkit"
    Namespace="AjaxControlToolkit"
    TagPrefix="ajaxToolkit" %>
<asp:Content ContentPlaceHolderID="SampleContent" Runat="Server">
    <ajaxToolkit:ToolkitScriptManager runat="Server" EnablePartialRendering="true" ID="ScriptManager1" />
    <div class="demoarea">
        <div class="demoheading">PopupControl Demonstration</div>
    
        Enter date for new reminder:
        <asp:TextBox ID="DateTextBox" runat="server" Width="80" autocomplete="off" /><br /><br />
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
        <asp:TextBox ID="MessageTextBox" runat="server" Width="200" autocomplete="off" /><br /><br />
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
            CommitScript="e.value += ' - do not forget!';" />

        <asp:UpdatePanel ID="UpdatePanel3" runat="server">
            <ContentTemplate>
                <asp:Button ID="ReminderButton" runat="server" Text="Add reminder" OnClick="ReminderButton_Click" />
                <br /><br />
                <asp:Label ID="Label1" runat="server" Text="[No response provided yet]" />
            </ContentTemplate>
        </asp:UpdatePanel>
    </div>
    <div class="demobottom"></div>

    <asp:Panel ID="Description_HeaderPanel" runat="server" style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Description_ToggleImage" runat="server" ImageUrl="~/images/collapse.jpg" AlternateText="collapse" />
            PopupControl Description
        </div>
    </asp:Panel>
    <asp:Panel id="Description_ContentPanel" runat="server" style="overflow:hidden;">
        <p>
            PopupControl is an ASP.NET AJAX extender that can be attached to any control in order to open
            a popup window that displays additional content.  This popup window will probably be interactive
            and will probably be within an ASP.NET AJAX UpdatePanel, so it will be able to perform complex
            server-based processing (including postbacks) without affecting the rest of the page.  The popup
            window can contain any content, including ASP.NET server controls, HTML elements, etc.  Once the
            work of the popup window is done, a simple server-side call dismisses it and triggers any relevant
            script on the client to run and update the page dynamically.
        </p>
    </asp:Panel>

    <asp:Panel ID="Properties_HeaderPanel" runat="server" style="cursor: pointer;">
        <div class="heading">
            <asp:ImageButton ID="Properties_ToggleImage" runat="server" ImageUrl="~/images/expand.jpg" AlternateText="expand" />
            PopupControl Properties
        </div>
    </asp:Panel>
    <asp:Panel id="Properties_ContentPanel" runat="server" style="overflow:hidden;" Height="0px">
        <p>
            The control above is initialized with this code. The <em>italic</em> properties are optional:
        </p>
<pre>&lt;ajaxToolkit:PopupControlExtender ID="PopEx" runat="server"
    TargetControlID="DateTextBox"
    PopupControlID="Panel1"
    <em>Position</em>="Bottom" /&gt;</pre>
        <ul>
            <li><strong>TargetControlID</strong> - The ID of the control to attach to</li>
            <li><strong>PopupControlID</strong> - The ID of the control to display</li>
            <li><strong>Position</strong> - Optional setting specifying where the popup should be
                positioned relative to the target control. (Left, Right, Top, Bottom, Center)</li>
            <li><strong>CommitProperty</strong> - Optional setting specifying the property on the control
                being extended that should be set with the result of the popup</li>
            <li><strong>CommitScript</strong> - Optional setting specifying additional script to run after
                setting the result of the popup</li>
            <li><strong>OffsetX/OffsetY</strong> - The number of pixels to offset the Popup from its
                default position, as specified by Position.</li>
            <li><strong>Animations</strong> - Generic animations for the PopupControlExtender.  See the
                <a href="../Walkthrough/UsingAnimations.aspx">Using Animations</a> walkthrough and
                <a href="../Walkthrough/AnimationReference.aspx">Animation Reference</a> for more details.
                <ul>
                    <li><strong>OnShow</strong> - The OnShow animation will be played each time the popup is displayed.
                        The popup will be positioned correctly but hidden.  The animation can use
                        <span class="codeReference">&lt;HideAction Visible="true" /&gt;</span>
                        to display the popup along with any other visual effects.</li>
                    <li><strong>OnHide</strong> - The OnHide animation will be played each time the popup is hidden.</li>
                </ul>
            </li>
        </ul>
    </asp:Panel>

    <ajaxToolkit:CollapsiblePanelExtender ID="cpeDescription" runat="Server" 
        TargetControlID="Description_ContentPanel"
        ExpandControlID="Description_HeaderPanel"
        CollapseControlID="Description_HeaderPanel"
        Collapsed="False"        
        ImageControlID="Description_ToggleImage" /> 
    <ajaxToolkit:CollapsiblePanelExtender ID="cpeProperties" runat="Server" 
        TargetControlID="Properties_ContentPanel"
        ExpandControlID="Properties_HeaderPanel"
        CollapseControlID="Properties_HeaderPanel"
        Collapsed="True"        
        ImageControlID="Properties_ToggleImage" />
</asp:Content>