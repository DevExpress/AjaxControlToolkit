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
            <p>
                TabContainer is an ASP.NET AJAX Control which creates a set of Tabs that can be
                used to organize page content. A TabContainer is a host for a number of TabPanel
                controls.
                <br />
                <br />
                Each TabPanel defines its HeaderText or HeaderTemplate as well as a ContentTemplate
                that defines its content. The most recent tab should remain selected after a postback,
                and the Enabled state of tabs should remain after a postback as well.
                <br />
                <br />
                TabContainer layout provides option to set TabPanels at top, topright, bottom, bottomright.
                TabContainer also provides option to set TabPanels at left, leftbottom, right and
                rightbottom by setting UseVerticalStripPlacement to true.
                <br />
                <br />
                Tabs can be loaded all at one time or on demand. Each tab provides functionality
                to load tab in three different modes - always, once or none. 
                <br />
                <br />
                Tab can be accessed by keyboard. After focus is set on the tab container then you can navigate to different
                tabs by using the left and right arrow keys. When tabs are displayed vertically then Up and Down arrow keys can be 
                used to navigate from tab to tab.
            </p>
        </Content>
    </samples:InfoBlock>

    <samples:InfoBlock runat="server">
        <Header>Tabs Properties</Header>
        <Content>
            <p>
                The control above is initialized with this code. The <em>italic</em> properties are optional:
            </p>
            <pre>
&lt;ajaxToolkit:TabContainer runat="server" 
        <em>OnClientActiveTabChanged</em>="ClientFunction" 
        <em>Height</em>="150px"
        <em>Width</em>="400px"
        <em>ActiveTabIndex</em>="1"
        <em>OnDemand</em>="true"
        <em>AutoPostBack</em>="false"
        <em>TabStripPlacement</em>="Top"
        <em>CssClass</em>=""
        <em>CssTheme</em>="XP"
        <em>ScrollBars</em>="None"
        <em>UseVerticalStripPlacement</em>="true"
        <em>VerticalStripWidth</em>="120px"
        &gt;
    <strong>&lt;ajaxToolkit:TabPanel</strong> runat="server" 
        <em>HeaderText</em>="Signature and Bio"
        <em>Enabled</em>="true"
        <em>ScrollBars</em>="Auto"
        <em>OnDemandMode</em>="Once"
        &lt;ContentTemplate&gt;
            ...
        &lt;/ContentTemplate&gt;
    <strong>/&gt;</strong>
&lt;/ajaxToolkit:TabContainer&gt;
            </pre>
            <b>TabContainer Properties</b>
            <ul>
                <li><strong>ActiveTabChanged (Event)</strong> - Fired on the server side when a tab
                    is changed after a postback</li>
                <li><strong>OnClientActiveTabChanged</strong> - The name of a javascript function to
                    attach to the client-side tabChanged event</li>
                <li><strong>CssClass</strong> - A css class override used to define a custom look and
                    feel for the tabs. See the Tabs Theming section for more details.</li>
                <li><strong>ActiveTabIndex</strong> - The first tab to show</li>
                <li><strong>Height</strong> - sets the height of the body of the tabs (does not include
                    the TabPanel headers)</li>
                <li><strong>Width</strong> - sets the width of the body of the tabs</li>
                <li><strong>ScrollBars</strong> - Whether to display scrollbars (None, Horizontal, Vertical,
                    Both, Auto) in the body of the TabContainer</li>
                <li><strong>TabStripPlacement</strong> - Whether to render the tabs on top of the container
                    or below (Top, Bottom) </li>
                <li><strong>UseVerticalStripPlacement</strong> - Whether to render the tabs on left or right 
                    of the container</li>
                <li><strong>VerticalStripWidth</strong> - Width of the tab panels when displaying tabs 
                vertically</li>
                <li><strong>AutoPostBack</strong> - Make auto postback from the javascript when tab index changes.</li>
                <li><strong>OnDemand</strong> - Whether to render/load tabs onDemand or all at page load</li>
            </ul>
            <b>TabPanel Properties</b>
            <ul>
                <li><strong>Enabled</strong> - Whether to display the Tab for the TabPanel by default.
                    This can be changed on the client.</li>
                <li><strong>OnClientClick</strong> - The name of a javascript function to attach to
                    the client-side click event of the tab.</li>
                <li><strong>HeaderText</strong> - The text to display in the Tab</li>
                <li><strong>HeaderTemplate</strong> - A TemplateInstance.Single ITemplate to use to
                    render the header</li>
                <li><strong>ContentTemplate</strong> - A TemplateInstance.Single ITemplate to use to
                    render the body</li>
                <li><strong>Enabled</strong> - Make tab enable or not</li>
                <li><strong>ScrollBars</strong> - Whether to display scrollbars (None, Horizontal, Vertical,
                    Both, Auto) in the body of the TabPanel</li>
                <li><strong>OnDemandMode</strong> - When container's onDemand is true then whether to load tab - 
                Always, Once, None</li>
            </ul>
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

