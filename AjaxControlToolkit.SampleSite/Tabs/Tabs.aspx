<%@ Page Title="Tabs Sample" Language="C#" MasterPageFile="~/Samples.master" AutoEventWireup="true" CodeFile="Tabs.aspx.cs" Inherits="Tabs_Tabs" %>

<asp:Content ContentPlaceHolderID="DemoHeading" runat="Server">
    Tabs Demonstration
</asp:Content>

<asp:Content ContentPlaceHolderID="DemoContent" runat="Server">

    <script type="text/javascript">
        function PanelClick(sender, e) {
            var Messages = $get('<%=Messages.ClientID%>');
            Highlight(Messages);
        }

        function ActiveTabChanged(sender, e) {
            var CurrentTab = $get('<%=CurrentTab.ClientID%>');
            CurrentTab.innerHTML = sender.get_activeTab().get_headerText();
            Highlight(CurrentTab);
        }

        var HighlightAnimations = {};
        function Highlight(el) {
            if(HighlightAnimations[el.uniqueID] == null) {
                HighlightAnimations[el.uniqueID] = Sys.Extended.UI.Animation.createAnimation({
                    AnimationName: "color",
                    duration: 0.5,
                    property: "style",
                    propertyKey: "backgroundColor",
                    startValue: "#FFFF90",
                    endValue: "#FFFFFF"
                }, el);
            }
            HighlightAnimations[el.uniqueID].stop();
            HighlightAnimations[el.uniqueID].play();
        }

        function ToggleHidden(value) {
            $find('<%=Tabs.ClientID%>').get_tabs()[2].set_enabled(value);
        }
    </script>

    The following user profile is presented in Tab format. You can click on the tab
        and modify specific fields.
        <br />
    <br />
    Toolkit User Profile:
        <ajaxToolkit:TabContainer runat="server" ID="Tabs" Height="138px" OnClientActiveTabChanged="ActiveTabChanged"
            ActiveTabIndex="0" Width="402px">
            <ajaxToolkit:TabPanel runat="server" ID="Panel1" HeaderText="Signature and Bio">
                <ContentTemplate>
                    <asp:UpdatePanel ID="updatePanel1" runat="server">
                        <ContentTemplate>
                            <table>
                                <tr>
                                    <td>Signature:
                                    </td>
                                    <td>
                                        <asp:TextBox ID="signatureText" runat="server" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Bio:
                                    </td>
                                    <td>
                                        <asp:TextBox ID="bioText" runat="server" />
                                    </td>
                                </tr>
                            </table>
                            <asp:Button ID="Button3" runat="Server" Text="Save" OnClick="SaveProfile" />
                            <br />
                            <br />
                            Hit Save to cause a postback from an update panel inside the tab panel.<br />
                        </ContentTemplate>
                    </asp:UpdatePanel>
                </ContentTemplate>
            </ajaxToolkit:TabPanel>
            <ajaxToolkit:TabPanel runat="server" ID="Panel3" HeaderText="Email">
                <ContentTemplate>
                    Email:
                    <asp:TextBox ID="emailText" runat="server" />
                    <br />
                    <br />
                    <asp:Button ID="Button1" runat="server" Text="Save" OnClick="SaveProfile" />
                    <br />
                    <br />
                    Hit Save to cause a full postback.
                </ContentTemplate>
            </ajaxToolkit:TabPanel>
            <ajaxToolkit:TabPanel runat="server" ID="Panel2" OnClientClick="PanelClick" HeaderText="Controls">
                <ContentTemplate>
                    <div>
                        Controls authored by Toolkit User (read-only - demo purposes):
                    </div>
                    <ul>
                        <li>Calendar</li>
                        <li>MaskedEdit</li>
                        <li>Accordion</li>
                        <li>Calendar</li>
                        <li>Calendar</li>
                    </ul>
                    <br />
                </ContentTemplate>
            </ajaxToolkit:TabPanel>
            <ajaxToolkit:TabPanel ID="PanelDP" HeaderText="Dynamic" DynamicServicePath="~/Tabs/Tabs.aspx" DynamicServiceMethod="GetHtml" DynamicContextKey="G" runat="server">
            </ajaxToolkit:TabPanel>
        </ajaxToolkit:TabContainer>
    <br />
    <asp:CheckBox runat="server" ID="showComponents" Checked="true" Text=" Show Controls Owned"
        onclick="ToggleHidden(this.checked)" />
    <br />
    <br />
    Current Tab:
        <asp:Label runat="server" ID="CurrentTab" /><br />
    <asp:Label runat="server" ID="Messages" />
    <br />
    <br />
    Vertical Tab layout feature:
        <ajaxToolkit:TabContainer runat="server" ID="TabContainer2" Height="138px"
            ActiveTabIndex="0" Width="402px" UseVerticalStripPlacement="true">
            <ajaxToolkit:TabPanel runat="server" ID="TabPanel5" HeaderText="Signature and Bio">
                <ContentTemplate>
                    <asp:UpdatePanel ID="updatePanel2" runat="server">
                        <ContentTemplate>
                            <table>
                                <tr>
                                    <td>Signature:
                                    </td>
                                    <td>
                                        <asp:TextBox ID="TextBox2" runat="server" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Bio:
                                    </td>
                                    <td>
                                        <asp:TextBox ID="TextBox3" runat="server" />
                                    </td>
                                </tr>
                            </table>
                            <asp:Button ID="Button2" runat="Server" Text="Save" OnClick="SaveProfile" />
                            <br />
                            <br />
                            Hit Save to cause a postback from an update panel inside the tab panel.<br />
                        </ContentTemplate>
                    </asp:UpdatePanel>
                </ContentTemplate>
            </ajaxToolkit:TabPanel>
            <ajaxToolkit:TabPanel runat="server" ID="TabPanel6" HeaderText="Email">
                <ContentTemplate>
                    Email:
                    <asp:TextBox ID="TextBox4" runat="server" />
                    <br />
                    <br />
                    <asp:Button ID="Button4" runat="server" Text="Save" OnClick="SaveProfile" />
                    <br />
                    <br />
                    Hit Save to cause a full postback.
                </ContentTemplate>
            </ajaxToolkit:TabPanel>
            <ajaxToolkit:TabPanel runat="server" ID="TabPanel7" OnClientClick="PanelClick" HeaderText="Controls">
                <ContentTemplate>
                    <div>
                        Controls authored by Toolkit User (read-only - demo purposes):
                    </div>
                    <ul>
                        <li>Calendar</li>
                        <li>MaskedEdit</li>
                        <li>Accordion</li>
                        <li>Calendar</li>
                        <li>Calendar</li>
                    </ul>
                    <br />
                </ContentTemplate>
            </ajaxToolkit:TabPanel>
        </ajaxToolkit:TabContainer>
    <br />
    <br />
    OnDemand feature:
        <ajaxToolkit:TabContainer ID="TabContainer1" runat="server" ActiveTabIndex="0" Height="128px"
            Width="332px" OnDemand="true">
            <ajaxToolkit:TabPanel runat="server" HeaderText="TabPanel1" ID="TabPanel1" OnDemandMode="Once">
                <ContentTemplate>
                    I'm tab 1, I was rendered at
                    <%= DateTime.Now.ToString("T") %>
                    <br />
                    My OnDemandMode is &#39;Once&#39;
                </ContentTemplate>
            </ajaxToolkit:TabPanel>
            <ajaxToolkit:TabPanel ID="TabPanel2" runat="server" HeaderText="TabPanel2" OnDemandMode="Always">
                <ContentTemplate>
                    I'm tab 2, I was rendered at
                    <%= DateTime.Now.ToString("T") %>
                    <br />
                    My OnDemandMode is &#39;Always&#39;
                </ContentTemplate>
            </ajaxToolkit:TabPanel>
            <ajaxToolkit:TabPanel ID="TabPanel3" runat="server" HeaderText="TabPanel3" OnDemandMode="None">
                <ContentTemplate>
                    I'm tab 3, I was rendered at
                    <%= DateTime.Now.ToString("T") %>
                    <br />
                    My OnDemandMode is &#39;None&#39;
                </ContentTemplate>
            </ajaxToolkit:TabPanel>
            <ajaxToolkit:TabPanel ID="TabPanel4" runat="server" HeaderText="TabPanel4" OnDemandMode="Once">
                <ContentTemplate>
                    I'm tab 4. Hey, I&#39;m loaded only once!<br />
                    I was rendered at
                    <%= DateTime.Now.ToString("T") %>
                </ContentTemplate>
            </ajaxToolkit:TabPanel>
        </ajaxToolkit:TabContainer>

</asp:Content>

<asp:Content ContentPlaceHolderID="InfoContent" runat="Server">

    <samples:InfoBlock runat="server" Collapsed="false">
        <Header>Tabs Description</Header>
        <Content>
            <div runat="server" data-control-type="TabContainer" data-content-type="description" />
            <div runat="server" data-control-type="TabPanel" data-content-type="description" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>Tabs Properties</Header>
        <Content>
            <h2>TabContainer</h2>
            <br />
            <div runat="server" data-control-type="TabContainer" data-content-type="members" />
            <br />
            <h2>TabPanel</h2>
            <br />
            <div runat="server" data-control-type="TabPanel" data-content-type="members" />
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>Tabs Theming</Header>
        <Content>
            You can change the look and feel of Tabs using the Tabs CssClass property. Tabs
            has a predefined set of CSS classes that can be overridden. It has a default style
            which is embedded as a WebResource and is a part of the Toolkit assembly that has
            styles set for all the sub-classes. You can find the default styles in the Toolkit
            solution in the <strong>"AjaxControlToolkit\Tabs\Tabs.css"</strong> file. If your
            CssClass does not provide values for any of those then it falls back to the default
            value. In the example above the default style is used. To customize the same the
            user would have to set the CssClass property to the name of the CSS style and define
            the styles for the individual classes so that the various elements in a Tab control
            can be styled accordingly. For example if the CssClass property was set to "CustomTabStyle"
            this is how the css to style the tab header would look:
            <pre>
    .CustomTabStyle .ajax__tab_header {
        font-family:verdana,tahoma,helvetica;
        font-size:11px;
        background:url(images/tab-line.gif) repeat-x bottom;
    }
            </pre>
            <strong>Tabs Css classes</strong>
            <br />
            <ul>
                <li><strong>.ajax__tab_header:</strong> A container element that wraps all of the tabs at the top of the TabContainer. Child CSS classes:.ajax__tab_outer. </li>
                <li><strong>.ajax__tab_outer:</strong> An outer element of a tab, often used to set the left-side background image of the tab.Child CSS classes: .ajax__tab_inner.</li>
                <li><strong>.ajax__tab_inner:</strong> An inner element of a tab, often used to set the right-side image of the tab. Child CSS classes:.ajax__tab_tab. </li>
                <li><strong>.ajax__tab_tab:</strong> An element of the tab that contains the text content. Child CSS classes:none.</li>
                <li><strong>.ajax__tab_body</strong>: A container element that wraps the area where a TabPanel is displayed. Child CSS classes: none.</li>
                <li><strong>.ajax__tab_hover</strong> . This is applied to a tab when the mouse is hovering over. Child CSS classes:.ajax__tab_outer. </li>
                <li><strong>.ajax__tab_active</strong>: This is applied to a tab when it is the currently selected tab. Child CSS classes:.ajax__tab_outer. </li>
            </ul>
        </Content>
    </samples:InfoBlock>

</asp:Content>

